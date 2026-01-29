import React from "react";
import "./StartScreen.css";

interface StartScreenProps {
  onStartGame: () => void;
  onOpenSettings?: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({
  onStartGame,
  onOpenSettings,
}) => {
  return (
    <div className="start-screen-container" id="vampire-start-screen">
      <div className="background-glow"></div>

      <div className="title-container">
        <h1 className="game-title">VA-SURVIVOR</h1>
        <div className="game-subtitle">The Night Awaits</div>
      </div>

      <div className="menu-options">
        <button
          className="menu-button primary"
          onClick={onStartGame}
          id="btn-start-game"
        >
          START SURVIVING
        </button>

        <button
          className="menu-button"
          onClick={() => alert("Character selection coming soon!")}
          id="btn-select-character"
        >
          SELECT HERO
        </button>

        <button
          className="menu-button"
          onClick={onOpenSettings}
          id="btn-settings"
        >
          SETTINGS
        </button>
      </div>

      <div className="footer-info">
        v0.1.0 - Built for the Ultimate Challenge
      </div>
    </div>
  );
};

export default StartScreen;
