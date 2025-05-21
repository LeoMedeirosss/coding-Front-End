// src/components/OpponentInfo.jsx
import React from "react";
import { useGame } from "../context/GameContext";

export default function OpponentInfo({ playerId }) {
  const { gameState } = useGame();
  const count = gameState.hands[playerId]?.length ?? 0;

  return (
    <div className="flex flex-col items-center">
      <p className="font-semibold text-white">{playerId}</p>
      <div className="flex">
        {Array(count).fill(0).map((_, i) => (
          <div key={i} className="w-6 h-10 bg-gray-800 border border-white rounded mx-0.5" />
        ))}
      </div>
    </div>
  );
}
