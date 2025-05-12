// File: src/components/Game.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Heart = () => <span className="text-red-600">❤</span>;

const PlayerSlot = ({ name, health, team }) => {
  const borderColor = team === "team1" ? "border-green-500" : "border-red-500";
  return (
    <div className="flex flex-col items-center m-2">
      <div className={`rounded-full w-12 h-12 border-4 ${borderColor} flex items-center justify-center text-sm`}>Avatar</div>
      <div className="mt-1 text-xs font-bold">{name}</div>
      <div>{Array.from({ length: health }).map((_, i) => <Heart key={i} />)}</div>
    </div>
  );
};

const Card = ({ card }) => (
  <div className="border p-2 m-1 w-24 h-24 flex flex-col justify-center items-center text-xs shadow-md bg-white">
    <div className="font-bold">{card.id}</div>
    <div>{card.type}</div>
  </div>
);

export default function Game({ socket }) {
  const gameState = useSelector((state) => state.game.gameState);
  const playerId = useSelector((state) => state.game.playerId);
  useEffect(() => {
    console.log("Game:: Redux gameState updated:", gameState);
  }, [gameState]);
  
  // return (
  //   <div>
  //     <h2>Game View</h2>
  //     <pre>{JSON.stringify(gameState, null, 2)}</pre>
  //   </div>
  // );

  const self = gameState.player_data;

  return (
    <div className="p-4 w-full h-full bg-gray-100">
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="flex justify-center">
          <PlayerSlot name={gameState.players[gameState.teams.team2[0].sid].name} health={gameState.players[gameState.teams.team2[0].sid].health} team="team2" />
        </div>
        <div className="flex justify-center">
          <div className="border w-32 h-24 flex justify-center items-center">Discard Pile</div>
        </div>
        <div className="flex justify-center">
          <PlayerSlot name={gameState.players[gameState.teams.team1[0].sid].name} health={gameState.players[gameState.teams.team1[0].sid].health} team="team1" />
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded shadow">Draw from Deck</button>
      </div>

      <div className="overflow-x-auto whitespace-nowrap border-t pt-2">
        <div className="flex items-center">
          {self.cards.map((card, index) => <Card key={index} card={card} />)}
        </div>
        <div className="mt-2 flex items-center">
          <span className="font-bold text-xs mr-2">HP:</span>
          {Array.from({ length: self.health }).map((_, i) => <Heart key={i} />)}
        </div>
      </div>
    </div>
  );
}

