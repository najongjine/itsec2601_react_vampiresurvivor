import { useState, useEffect, useRef } from "react";
import "./Game.css";
import StartScreen from "./Component/vampire_game/StartScreen";

/** 뱀파이어 서바이버 게임 */
function Game() {
  const [gameState, setGameState] = useState<"START" | "PLAYING" | "GAMEOVER">(
    "START",
  );

  const startGame = () => {
    setGameState("PLAYING");
  };

  return (
    <div className="game-container">
      {gameState === "START" && <StartScreen onStartGame={startGame} />}

      {gameState === "PLAYING" && (
        <div className="playing-area">
          <h1>Game Started!</h1>
          <button onClick={() => setGameState("START")}>Back to Menu</button>
        </div>
      )}
    </div>
  );
}

export default Game;
