from constants import *
from game_state import GameState

class RoomState:
    def __init__(self, room_id):
        self.room_id = room_id
        self.players = {}
        self.game_state = GameState()
        self.teams = {
            "team1": [],
            "team2": [],
            "neutral": []
        }

    def add_player_to_room(self, sid, name, team):
        if sid in self.players:
            return False
        if team not in self.teams:
            return False
        if name in self.teams[team]:
            self.players[sid] = {"name": name, "team": team}
            return True
        if len(self.teams[team]) >= MAX_TEAM_SIZES[team]:
            return False
        self.players[sid] = {"name": name, "team": team}
        self.teams[team].append({"sid": sid, "name": name})
        return True
    
    def start_game(self):
        self.game_state.start_game(self.teams["team1"], self.teams["team2"], self.teams["neutral"])
        return self.game_state
    
    def remove_player_from_room(self, sid):
        if sid not in self.players:
            return False
        if self.game_state.get("started", False):
            del self.players[sid]
            return True
        team = self.players[sid]["team"]
        # Remove player from the team
        for i, player in enumerate(self.teams[team]):
            if player["sid"] == sid:
                del self.teams[team][i]
                break
        del self.players[sid]
        return True
    
    def get_room_state(self, sid):
        return_game_state = {
            "teams": self.teams,
            "started": self.game_state.started,
            "current_player": self.players.get(self.game_state.current_player, None),
            "player_data": self.game_state.players.get(sid, None),
            "top_discard_pile": self.game_state.discard_pile,
        }
        print("Room state:", return_game_state)
        return return_game_state
    
    def reset_room(self):
        self.players = {}
        self.game_state = {}
        self.teams = {
            "team1": [],
            "team2": [],
            "neutral": []
        }
        return True
    

class GameStateDB:
    def __init__(self):
        self.rooms = []

    def add_room(self, room_id):
        room = RoomState(room_id)
        self.rooms.append(room)
        return room
    
    def get_room(self, room_id):
        for room in self.rooms:
            if room.room_id == room_id:
                return room
        return None
    
    def remove_room(self, room_id):
        for room in self.rooms:
            if room.room_id == room_id:
                self.rooms.remove(room)
                return True
        return False
    
    def update_room(self, room_id, room):
        for i, r in enumerate(self.rooms):
            if r.room_id == room_id:
                self.rooms[i] = room
                return True
        return False
    


    
