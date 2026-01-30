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
import playerIdleImg from "./assets/player_idle1.png";
import stage1Image from "./assets/stage1.png";

/** 뱀파이어 서바이버 게임 */
function Game() {
  const [gameState, setGameState] = useState<
    "START" | "PLAYING" | "LEVEL_UP" | "PAUSED" | "GAMEOVER"
  >("START");
  const [prevGameState, setPrevGameState] = useState<
    "START" | "PLAYING" | "LEVEL_UP" | "PAUSED" | "GAMEOVER"
  >("START");

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

  const [playerImage, setPlayerImage] = useState<string | undefined>(
    playerIdleImg,
  );
  const [mapImage, setMapImage] = useState<string | undefined>(stage1Image);
  const [monsterImages, setMonsterImages] = useState<Record<string, string>>(
    {},
  );

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

  const [upgrades, setUpgrades] = useState<UpgradeInfo[]>([]);

  const handleUpgradeSelect = (upgrade: UpgradeInfo) => {
    console.log("Selected upgrade:", upgrade.name);

    if (upgrade.type === "weapon" || upgrade.type === "passive") {
      setInventory((prev) => {
        const typeKey = upgrade.type === "weapon" ? "weapons" : "passives";
        const existingItemIndex = prev[typeKey].findIndex(
          (item) => item.id === upgrade.id,
        );

        const newItems = [...prev[typeKey]];
        if (existingItemIndex > -1) {
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            level: newItems[existingItemIndex].level + 1,
          };
        } else if (newItems.length < 6) {
          newItems.push({ ...upgrade, level: 1 });
        }
        return { ...prev, [typeKey]: newItems };
      });
    } else {
      // 스탯 업그레이드 처리
      setGameStats((prev) => {
        const next = { ...prev };
        switch (upgrade.id) {
          case "speed_boost":
            // PlayerEntity 스탯은 GameCanvas 내부에서 관리되므로
            // 실제로는 playerRef를 업데이트해야 함.
            // 여기서는 UI용 stats만 업데이트하고 GameCanvas에 prop으로 전달하도록 구조 변경 필요
            break;
          case "damage_boost":
            break;
          case "hp_boost":
            next.maxHp += 20;
            next.currentHp = Math.min(next.currentHp + 50, next.maxHp);
            break;
        }
        return next;
      });
    }

    setGameState("PLAYING");
  };

  const triggerLevelUp = () => {
    // 무작위 업그레이드 3개 선택
    const allPossibleUpgrades: UpgradeInfo[] = [
      {
        id: "flamethrower",
        name: "Flamethrower",
        icon: "🔥",
        description: "Burn them all!",
        level: 0,
        rarity: "common",
        type: "weapon",
      },
      {
        id: "bible",
        name: "Rotating Bible",
        icon: "📖",
        description: "Holy protection.",
        level: 0,
        rarity: "rare",
        type: "weapon",
      },
      {
        id: "pidgeon",
        name: "Pidgeon",
        icon: "🕊️",
        description: "Air support.",
        level: 0,
        rarity: "epic",
        type: "weapon",
      },
      {
        id: "speed_boost",
        name: "Speed Up",
        icon: "👢",
        description: "Move faster.",
        level: 0,
        rarity: "common",
        type: "stat",
      },
      {
        id: "damage_boost",
        name: "Damage Up",
        icon: "⚔️",
        description: "Hit harder.",
        level: 0,
        rarity: "common",
        type: "stat",
      },
      {
        id: "hp_boost",
        name: "HP Up",
        icon: "❤️",
        description: "More health.",
        level: 0,
        rarity: "common",
        type: "stat",
      },
    ];

    const shuffled = allPossibleUpgrades.sort(() => 0.5 - Math.random());
    setUpgrades(shuffled.slice(0, 3));

    setPrevGameState(gameState);
    setGameState("LEVEL_UP");
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
          <div className="game-world-container">
            <GameCanvas
              playerImageUrl={playerImage}
              mapImageUrl={mapImage}
              monsterImages={monsterImages}
              onPlayerDamage={changeHp}
              onMonsterKill={() =>
                setGameStats((prev) => ({ ...prev, kills: prev.kills + 1 }))
              }
              onGainXp={gainXp}
              level={gameStats.level}
              selectedWeapons={inventory.weapons}
            />

            <div className="hud-overlay">
              <div className="experience-bar-container">
                <ExperienceBar
                  currentXp={gameStats.currentXp}
                  maxXp={gameStats.maxXp}
                  level={gameStats.level}
                />
              </div>

              <div className="top-left-hud">
                <HealthBar
                  currentHp={gameStats.currentHp}
                  maxHp={gameStats.maxHp}
                />
                <InventoryHotbar
                  weapons={inventory.weapons}
                  passives={inventory.passives}
                />
              </div>

              <div className="top-center-hud">
                <GameTimer totalSeconds={gameStats.totalSeconds} />
              </div>

              <div className="top-right-hud">
                <KillCounter kills={gameStats.kills} />
              </div>

              <div className="pause-button-container">
                <button
                  onClick={() => setGameState("PAUSED")}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.2)",
                    padding: "5px 15px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    pointerEvents: "auto",
                  }}
                >
                  PAUSE
                </button>
              </div>
            </div>
          </div>

          <div className="footer-controls" style={{ padding: "0 20px" }}>
            <p style={{ color: "#aaa", margin: "10px 0" }}>
              Press [ESC] to pause | Use WASD to move
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              <div>
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
                    width: "300px",
                  }}
                />
              </div>
              <div>
                <label style={{ color: "white", marginRight: "10px" }}>
                  Map Image URL:
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/map.png"
                  onBlur={(e) => setMapImage(e.target.value)}
                  style={{
                    background: "#222",
                    color: "white",
                    border: "1px solid #444",
                    padding: "5px",
                    width: "300px",
                  }}
                />
              </div>
              <div style={{ marginTop: "10px" }}>
                <p
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  Monster Images (URLs):
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "5px",
                  }}
                >
                  {[
                    "bat",
                    "zombie",
                    "dracula",
                    "werewolf",
                    "mantis",
                    "golem",
                  ].map((type) => (
                    <div key={type}>
                      <label
                        style={{
                          color: "#aaa",
                          fontSize: "12px",
                          display: "block",
                        }}
                      >
                        {type.toUpperCase()}
                      </label>
                      <input
                        type="text"
                        placeholder="Image URL"
                        onBlur={(e) => {
                          const url = e.target.value;
                          if (url) {
                            setMonsterImages((prev) => ({
                              ...prev,
                              [type]: url,
                            }));
                          }
                        }}
                        style={{
                          background: "#222",
                          color: "white",
                          border: "1px solid #444",
                          padding: "3px",
                          width: "140px",
                          fontSize: "12px",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
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
        <LevelUpModal upgrades={upgrades} onSelect={handleUpgradeSelect} />
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
