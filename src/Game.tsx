import { useState, useEffect, useRef } from "react";
import "./Game.css";
import StartScreen from "./Component/vampire_game/StartScreen";
import LevelUpModal from "./Component/vampire_game/LevelUpModal";
import PauseMenu from "./Component/vampire_game/PauseMenu";
import GameOverReport from "./Component/vampire_game/GameOverReport";
import ExperienceBar from "./Component/vampire_game/ExperienceBar";
import { UpgradeInfo } from "./Component/vampire_game/UpgradeCard";

/** 뱀파이어 서바이버 게임 */
function Game() {
  const [gameState, setGameState] = useState<
    "START" | "PLAYING" | "LEVEL_UP" | "PAUSED" | "GAMEOVER"
  >("START");
  const [prevGameState, setPrevGameState] = useState<
    "START" | "PLAYING" | "LEVEL_UP" | "PAUSED" | "GAMEOVER"
  >("START");

  const dummyUpgrades: UpgradeInfo[] = [
    {
      id: "fireball",
      name: "Fireball",
      icon: "🔥",
      description: "Shoots a fireball at the nearest enemy.",
      level: 1,
      rarity: "common",
    },
    {
      id: "shield",
      name: "Magic Shield",
      icon: "🛡️",
      description: "Creates a protective barrier around you.",
      level: 0,
      rarity: "rare",
    },
    {
      id: "speed",
      name: "Haste",
      icon: "⚡",
      description: "Increases movement speed significantly.",
      level: 2,
      rarity: "epic",
    },
  ];

  const [gameStats, setGameStats] = useState({
    kills: 0,
    time: "00:00",
    level: 1,
    gold: 0,
    currentXp: 0,
    maxXp: 100,
  });

  // Keyboard shortcut for pausing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (gameState === "PLAYING") {
          setPrevGameState(gameState);
          setGameState("PAUSED");
        } else if (gameState === "PAUSED") {
          setGameState("PLAYING");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  const startGame = () => {
    setGameStats({
      kills: 0,
      time: "00:00",
      level: 1,
      gold: 0,
      currentXp: 0,
      maxXp: 100,
    });
    setGameState("PLAYING");
  };

  const triggerLevelUp = () => {
    setPrevGameState(gameState);
    setGameState("LEVEL_UP");
  };

  const triggerGameOver = () => {
    setGameStats({
      kills: 124,
      time: "15:32",
      level: 24,
      gold: 450,
      currentXp: 80,
      maxXp: 2400,
    });
    setGameState("GAMEOVER");
  };

  const gainXp = (amount: number) => {
    setGameStats((prev) => {
      let nextXp = prev.currentXp + amount;
      let nextLevel = prev.level;
      let nextMaxXp = prev.maxXp;

      if (nextXp >= nextMaxXp) {
        nextXp -= nextMaxXp;
        nextLevel += 1;
        nextMaxXp = Math.floor(nextMaxXp * 1.2);
        triggerLevelUp();
      }

      return {
        ...prev,
        currentXp: nextXp,
        level: nextLevel,
        maxXp: nextMaxXp,
      };
    });
  };

  const handleUpgradeSelect = (upgrade: UpgradeInfo) => {
    console.log("Selected upgrade:", upgrade.name);
    setGameState("PLAYING");
  };

  const resumeGame = () => {
    setGameState("PLAYING");
  };

  const quitToMenu = () => {
    setGameState("START");
  };

  return (
    <div className="game-container">
      {gameState === "START" && <StartScreen onStartGame={startGame} />}

      {gameState === "PLAYING" && (
        <div className="playing-area">
          <ExperienceBar
            currentXp={gameStats.currentXp}
            maxXp={gameStats.maxXp}
            level={gameStats.level}
          />
          <header style={{ position: "absolute", top: "40px", right: "20px" }}>
            <button
              onClick={() => setGameState("PAUSED")}
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "5px 15px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              PAUSE
            </button>
          </header>

          <h1>Game Started!</h1>
          <p style={{ color: "#aaa" }}>Press [ESC] to pause</p>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button onClick={() => setGameState("START")}>Back to Menu</button>
            <button
              onClick={triggerLevelUp}
              style={{
                padding: "10px 20px",
                background: "#8b5cf6",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Simulate Level Up
            </button>
            <button
              onClick={() => gainXp(20)}
              style={{
                padding: "10px 20px",
                background: "#00d2ff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Gain 20 XP
            </button>
            <button
              onClick={triggerGameOver}
              style={{
                padding: "10px 20px",
                background: "#ff3333",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Simulate Game Over
            </button>
          </div>
        </div>
      )}

      {gameState === "LEVEL_UP" && (
        <LevelUpModal upgrades={dummyUpgrades} onSelect={handleUpgradeSelect} />
      )}

      {gameState === "PAUSED" && (
        <PauseMenu
          onResume={resumeGame}
          onQuit={quitToMenu}
          stats={{
            kills: 42,
            time: "10:24",
            level: 15,
          }}
        />
      )}

      {gameState === "GAMEOVER" && (
        <GameOverReport
          stats={gameStats}
          onRetry={startGame}
          onQuit={quitToMenu}
        />
      )}
    </div>
  );
}

export default Game;
