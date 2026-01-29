import React from "react";
import "./GameTimer.css";

interface GameTimerProps {
  totalSeconds: number;
}

const GameTimer: React.FC<GameTimerProps> = ({ totalSeconds }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="game-timer-container">
      <span className="game-timer-text">{formatTime(totalSeconds)}</span>
    </div>
  );
};

export default GameTimer;
