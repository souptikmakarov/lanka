// File: src/components/Game.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Game({ socket }) {
  const gameState = useSelector((state) => state.game.gameState);
  const playerId = useSelector((state) => state.game.playerId);
  useEffect(() => {
    console.log("Game:: Redux gameState updated:", gameState);
  }, [gameState]);
  
  return (
    <div>
      <h2>Game View</h2>
      <pre>{JSON.stringify(gameState, null, 2)}</pre>
    </div>
  );
}
