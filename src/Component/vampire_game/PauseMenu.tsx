import React from "react";
import "./PauseMenu.css";

interface PauseMenuProps {
  onResume: () => void;
  onSettings?: () => void;
  onQuit: () => void;
  stats?: {
    kills: number;
    time: string;
    level: number;
  };
}

const PauseMenu: React.FC<PauseMenuProps> = ({
  onResume,
  onSettings,
  onQuit,
  stats,
}) => {
  return (
    <div className="pause-menu-overlay" id="vampire-pause-menu">
      <div className="pause-menu-content">
        <h2 className="pause-title">PAUSED</h2>

        {stats && (
          <div className="pause-stats">
            <div className="stat-item">
              <span className="stat-label">TIME</span>
              <span className="stat-value">{stats.time}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">KILLS</span>
              <span className="stat-value">{stats.kills}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">LEVEL</span>
              <span className="stat-value">{stats.level}</span>
            </div>
          </div>
        )}

        <nav className="pause-nav">
          <button
            className="pause-button primary"
            onClick={onResume}
            id="btn-resume"
          >
            RESUME
          </button>

          <button
            className="pause-button"
            onClick={() => alert("Settings coming soon!")}
            id="btn-pause-settings"
          >
            SETTINGS
          </button>

          <button
            className="pause-button danger"
            onClick={onQuit}
            id="btn-quit"
          >
            QUIT TO MENU
          </button>
        </nav>
      </div>
    </div>
  );
};

export default PauseMenu;
