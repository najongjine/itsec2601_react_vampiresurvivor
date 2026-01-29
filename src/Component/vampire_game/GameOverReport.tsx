import React from "react";
import "./GameOverReport.css";

interface GameOverReportProps {
  stats: {
    time: string;
    kills: number;
    gold: number;
    level: number;
  };
  onRetry: () => void;
  onQuit: () => void;
}

const GameOverReport: React.FC<GameOverReportProps> = ({
  stats,
  onRetry,
  onQuit,
}) => {
  return (
    <div className="game-over-overlay" id="vampire-game-over">
      <div className="game-over-content">
        <header className="game-over-header">
          <h1 className="game-over-title">YOU DIED</h1>
          <p className="game-over-subtitle">THE NIGHT WAS TOO LONG</p>
        </header>

        <div className="report-stats">
          <div className="report-stat-item" style={{ animationDelay: "0.2s" }}>
            <span className="label">SURVIVED FOR</span>
            <span className="value">{stats.time}</span>
          </div>
          <div className="report-stat-item" style={{ animationDelay: "0.3s" }}>
            <span className="label">ENEMIES SLAIN</span>
            <span className="value">{stats.kills.toLocaleString()}</span>
          </div>
          <div className="report-stat-item" style={{ animationDelay: "0.4s" }}>
            <span className="label">GOLD COLLECTED</span>
            <span className="value">{stats.gold.toLocaleString()}</span>
          </div>
          <div className="report-stat-item" style={{ animationDelay: "0.5s" }}>
            <span className="label">FINAL LEVEL</span>
            <span className="value">{stats.level}</span>
          </div>
        </div>

        <nav className="game-over-nav">
          <button
            className="game-over-button primary"
            onClick={onRetry}
            id="btn-retry"
          >
            TRY AGAIN
          </button>
          <button
            className="game-over-button"
            onClick={onQuit}
            id="btn-quit-gameover"
          >
            MAIN MENU
          </button>
        </nav>
      </div>
    </div>
  );
};

export default GameOverReport;
