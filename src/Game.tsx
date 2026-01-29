import { useState, useEffect, useRef } from "react";
import "./Game.css";
import StartScreen from "./Component/vampire_game/StartScreen";
import LevelUpModal from "./Component/vampire_game/LevelUpModal";
import PauseMenu from "./Component/vampire_game/PauseMenu";
import GameOverReport from "./Component/vampire_game/GameOverReport";
import ExperienceBar from "./Component/vampire_game/ExperienceBar";
import GameTimer from "./Component/vampire_game/GameTimer";
import KillCounter from "./Component/vampire_game/KillCounter";
import HealthBar from "./Component/vampire_game/HealthBar";
import InventoryHotbar from "./Component/vampire_game/InventoryHotbar";
import GameCanvas from "./Component/vampire_game/GameCanvas";
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
      type: "weapon",
    },
    {
      id: "shield",
      name: "Magic Shield",
      icon: "🛡️",
      description: "Creates a protective barrier around you.",
      level: 0,
      rarity: "rare",
      type: "passive",
    },
    {
      id: "speed",
      name: "Haste",
      icon: "⚡",
      description: "Increases movement speed significantly.",
      level: 2,
      rarity: "epic",
      type: "passive",
    },
  ];

  const [inventory, setInventory] = useState<{
    weapons: UpgradeInfo[];
    passives: UpgradeInfo[];
  }>({
    weapons: [],
    passives: [],
  });

  const [gameStats, setGameStats] = useState({
    kills: 0,
    time: "00:00",
    level: 1,
    gold: 0,
    currentXp: 0,
    maxXp: 100,
    totalSeconds: 0,
    currentHp: 100,
    maxHp: 100,
  });

  const [playerImage, setPlayerImage] = useState<string | undefined>(undefined);

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

  // Survival Timer Logic
  useEffect(() => {
    let interval: number | undefined;

    if (gameState === "PLAYING") {
      interval = setInterval(() => {
        setGameStats((prev) => ({
          ...prev,
          totalSeconds: prev.totalSeconds + 1,
        }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState]);

  // Damage/Heal simulator
  const changeHp = (amount: number) => {
    setGameStats((prev) => {
      const nextHp = Math.max(0, Math.min(prev.currentHp + amount, prev.maxHp));
      if (nextHp === 0) {
        // Trigger game over if HP reaches 0
        triggerGameOver();
      }
      return { ...prev, currentHp: nextHp };
    });
  };

  const startGame = () => {
    setGameStats({
      kills: 0,
      time: "00:00",
      level: 1,
      gold: 0,
      currentXp: 0,
      maxXp: 100,
      totalSeconds: 0,
      currentHp: 100,
      maxHp: 100,
    });
    setInventory({ weapons: [], passives: [] });
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
      totalSeconds: 932,
      currentHp: 0,
      maxHp: 200,
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

    setInventory((prev) => {
      const typeKey = upgrade.type === "weapon" ? "weapons" : "passives";
      const existingItemIndex = prev[typeKey].findIndex(
        (item) => item.id === upgrade.id,
      );

      const newItems = [...prev[typeKey]];
      if (existingItemIndex > -1) {
        // Level up existing item
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          level: newItems[existingItemIndex].level + 1,
        };
      } else {
        // Add new item if slot available
        if (newItems.length < 6) {
          newItems.push({ ...upgrade, level: upgrade.level + 1 });
        }
      }

      return {
        ...prev,
        [typeKey]: newItems,
      };
    });

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
          <GameTimer totalSeconds={gameStats.totalSeconds} />
          <KillCounter kills={gameStats.kills} />
          <HealthBar currentHp={gameStats.currentHp} maxHp={gameStats.maxHp} />
          <InventoryHotbar
            weapons={inventory.weapons}
            passives={inventory.passives}
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

          <div style={{ marginTop: "60px" }}>
            <GameCanvas playerImageUrl={playerImage} />
          </div>

          <div style={{ padding: "0 20px" }}>
            <p style={{ color: "#aaa", margin: "10px 0" }}>
              Press [ESC] to pause | Use WASD to move
            </p>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ color: "white", marginRight: "10px" }}>
                Character Image URL:
              </label>
              <input
                type="text"
                placeholder="https://example.com/char.png"
                onBlur={(e) => setPlayerImage(e.target.value)}
                style={{
                  background: "#222",
                  color: "white",
                  border: "1px solid #444",
                  padding: "5px",
                }}
              />
            </div>
          </div>

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
              onClick={() =>
                setGameStats((prev) => ({ ...prev, kills: prev.kills + 1 }))
              }
              style={{
                padding: "10px 20px",
                background: "#ff3333",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Kill Monster
            </button>
            <button
              onClick={() => changeHp(-10)}
              style={{
                padding: "10px 20px",
                background: "#ff4b2b",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Take Damage
            </button>
            <button
              onClick={() => changeHp(10)}
              style={{
                padding: "10px 20px",
                background: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Heal
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
