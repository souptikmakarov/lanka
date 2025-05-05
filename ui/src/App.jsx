// Full-stack Battleground Lanka - Frontend (React) + Backend (FastAPI)

// File: src/App.jsx
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Lobby from "./components/Lobby";
import Game from "./components/Game";
import { useDispatch, useSelector } from "react-redux";
import { setPlayerId, setGameState, setView } from "./store";

const socket = io("http://localhost:8000");

export default function App() {
  const dispatch = useDispatch();
  const view = useSelector((state) => state.game.view);

  useEffect(() => {
    socket.on("connect", () => dispatch(setPlayerId(socket.id)));
    socket.on("game_state", (state) => {
      console.log("game_state", JSON.stringify(state));
      dispatch(setGameState(state))
    });
    socket.on("game_started", () => dispatch(setView("game")));
    socket.on("game_reset", () => {
      dispatch(setGameState(null));
      dispatch(setView("lobby"));
    });

    return () => {
      socket.off("connect");
      socket.off("game_state");
      socket.off("game_started");
    };
  }, []);

  const startGame = () => {
    socket.emit("start_game");
  };

  const reset = () => {
    socket.emit("reset");
    setView("lobby");
  }

  return (
    <div className="p-4">
      {view === "lobby" && <Lobby socket={socket} startGame={startGame} />}
      {view === "game" && <Game socket={socket} />}
      <button onClick={reset}>Reset</button>
    </div>
  );
}