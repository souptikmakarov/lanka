// Full-stack Battleground Lanka - Frontend (React) + Backend (FastAPI)

// File: src/components/Lobby.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function Lobby({ socket, startGame }) {
  const gameState = useSelector((state) => state.game.gameState);
  const playerId = useSelector((state) => state.game.playerId);
  const [name, setName] = useState("");
  const [team, setTeam] = useState("team1");
  const [error, setError] = useState(null);
  useEffect(() => {
    console.log("Lobby:: Redux gameState updated:", gameState);
  }, [gameState]);

  useEffect(() => {
    socket.on("error", (data) => {
      setError(data.message);
    });
    // socket.on("lobby_update", (data) => {
    //   setGameState(() => ({
    //     teams: data.teams,
    //     players: data.players,
    //   }));
    // });

    return () => {
      // socket.off("lobby_update");
      socket.off("error");
    };
  }, [socket]);

  const join = () => {
    socket.emit("join_game", { name, team });
  };

  const renderTeam = (teamName) => {
    return (
      <div>
        <h3>{teamName.toUpperCase()}</h3>
        <ul>
          {(gameState?.teams[teamName] || []).map((obj) => (
            <li key={obj["sid"]}>{obj["name"] || obj["sid"]}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <h2>Lobby</h2>
      <input
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select value={team} onChange={(e) => setTeam(e.target.value)}>
        <option value="team1">Team 1</option>
        <option value="team2">Team 2</option>
        <option value="neutral">Neutral</option>
      </select>
      <button onClick={join}>Join Game</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="mt-4">
        {renderTeam("team1")}
        {renderTeam("team2")}
        {renderTeam("neutral")}
      </div>
      <button className="mt-4" onClick={startGame}>Start Game</button>
    </div>
  );
}
