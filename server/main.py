import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from time import sleep
import asyncio
from game_state_db import *
from typing import Dict

# Set up Socket.IO with ASGI
sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*"
)

# Create FastAPI app
fastapi_app = FastAPI()

fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Your HTTP routes can go here (optional)
@fastapi_app.get("/")
async def root():
    return {"message": "Hello from FastAPI"}

# Game state
game_state_db = GameStateDB()
active_rooms: Dict[str, RoomState] = {}
room_state = game_state_db.add_room("room1")
active_rooms["room1"] = room_state



async def get_game_state(sid):
    session = await sio.get_session(sid)
    room_id = session.get("room_id", None)
    if room_id is None:
        return {"error": "User not in a room"}
    room_state = active_rooms.get(room_id, None)
    if room_state is None:
        return {"error": "Room not found"}
    return room_state.return_room_state()

async def send_game_state_to_all_players(room_id):
    room_state = active_rooms.get(room_id, None)
    if room_state is None:
        return
    for player_sid in room_state.players.keys():
        await sio.emit("game_state", room_state.get_room_state(player_sid), to=player_sid)


# Socket.IO events
@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")
    session = await sio.get_session(sid)
    room_id = session.get("room_id", None)
    if room_id is None:
        return
    room_state = active_rooms.get(room_id, None)
    if room_state is None:
        return
    room_state.remove_player_from_room(sid)
    await sio.emit("game_state", room_state.get_room_state(sid), room=room_id)

@sio.on("join_game")
async def join_game(sid, data):
    name = data.get("name")
    team = data.get("team")
    room_id = data.get("room_id", "room1")       # Default to room1 if not specified
    print("Join game request:", name, team)
    room_state = active_rooms.get(room_id, None)
    if room_state is None:
        await sio.emit("error", {"message": "Room not found"}, to=sid)
    if room_state.add_player_to_room(sid, name, team):
        await sio.save_session(sid, {"room_id": room_id})
        await sio.enter_room(sid, room_id)
    
    # await sio.emit("game_state", room_state.get_room_state(sid), room=room_id)
    await send_game_state_to_all_players(room_id)

@sio.on("start_game")
async def start_game(sid):
    session = await sio.get_session(sid)
    room_id = session.get("room_id", None)
    print("Start game request:", room_id)
    room_state = active_rooms.get(room_id, None)
    if room_state is None:
        await sio.emit("error", {"message": "Room not found"}, to=sid)
        return
    if room_state.game_state.started:
        await sio.emit("error", {"message": "Game already started"}, to=sid)
        return
    if len(room_state.teams["team1"]) == 0 or len(room_state.teams["team2"]) == 0:
        await sio.emit("error", {"message": "Not enough players"}, to=sid)
        return
    if len(room_state.teams["team1"]) != len(room_state.teams["team2"]):
        await sio.emit("error", {"message": "Teams are not balanced"}, to=sid)
        return
    if len(room_state.teams["neutral"]) > 1:
        await sio.emit("error", {"message": "Too many neutral players"}, to=sid)
        return
    room_state.start_game()
    print("start_game:: Sending game state")
    # await sio.emit("game_state", room_state.get_room_state(sid), room=room_id)
    await send_game_state_to_all_players(room_id)
    print("start_game:: Sleeping for 2 seconds...")
    await asyncio.sleep(2)  # Simulate some delay for the game to start
    print("start_game:: Sending game started event")
    await sio.emit("game_started", room=room_id)

@sio.on("reset")
async def reset(sid):
    session = await sio.get_session(sid)
    room_id = session.get("room_id", None)
    print("Reset game request:", room_id)
    room_state = active_rooms.get(room_id, None)
    if room_state is None:
        await sio.emit("error", {"message": "Room not found"}, to=sid)
        return
    room_state.reset_room()
    await sio.emit("game_reset")
    # await sio.emit("game_state", get_game_state(), room=room_id)
    await send_game_state_to_all_players(room_id)

# Combine FastAPI + SocketIO
app = socketio.ASGIApp(sio, other_asgi_app=fastapi_app)
