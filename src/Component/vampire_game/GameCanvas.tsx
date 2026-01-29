import React, { useEffect, useRef, useState } from "react";
import { PlayerEntity } from "./PlayerEntity";

interface GameCanvasProps {
  playerImageUrl?: string;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ playerImageUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<PlayerEntity>(
    new PlayerEntity(400, 300, {}, playerImageUrl),
  );
  const cameraRef = useRef({ x: 0, y: 0 });
  const keysRef = useRef<Set<string>>(new Set());
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    // 플레이어 이미지 업그레이드 (prop 변경 시)
    if (playerImageUrl) {
      playerRef.current.setImage(playerImageUrl);
    }
  }, [playerImageUrl]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keysRef.current.add(e.key);
    const handleKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const update = (time: number) => {
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = time;
    }

    const deltaTime = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // 플레이어 업데이트 (월드 좌표)
        playerRef.current.update(keysRef.current, deltaTime);

        // 카메라 업데이트 (플레이어를 화면 중앙에 위치시키기)
        // 카메라의 x, y는 화면의 왼쪽 상단 구석의 월드 좌표가 됩니다.
        cameraRef.current.x = playerRef.current.x - canvas.width / 2;
        cameraRef.current.y = playerRef.current.y - canvas.height / 2;

        // 배경 청소
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 격자 그리기 (무한 맵 느낌)
        drawInfiniteGrid(ctx, canvas.width, canvas.height, cameraRef.current);

        // 플레이어 그리기 (카메라 오프셋 적용)
        ctx.save();
        ctx.translate(-cameraRef.current.x, -cameraRef.current.y);
        playerRef.current.draw(ctx);
        ctx.restore();
      }
    }

    requestRef.current = requestAnimationFrame(update);
  };

  /**
   * 카메라 좌표에 따라 반복되는 격자를 그립니다.
   */
  const drawInfiniteGrid = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    camera: { x: number; y: number },
  ) => {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    const spacing = 100;

    // 카메라의 오프셋을 계산하여 격자가 계속 이어지는 것처럼 보이게 함
    const startX = -camera.x % spacing;
    const startY = -camera.y % spacing;

    for (let x = startX; x < width; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = startY; y < height; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 월드 중심 표시 (좌표 0,0) - 테스트용
    ctx.strokeStyle = "rgba(255, 255, 0, 0.2)";
    ctx.beginPath();
    ctx.moveTo(-camera.x, 0);
    ctx.lineTo(-camera.x, height);
    ctx.moveTo(0, -camera.y);
    ctx.lineTo(width, -camera.y);
    ctx.stroke();
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div
      className="game-canvas-container"
      style={{ textAlign: "center", padding: "20px" }}
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{
          border: "4px solid #333",
          borderRadius: "8px",
          boxShadow: "0 0 20px rgba(0,0,0,0.5)",
          backgroundColor: "#111",
        }}
      />
      <div style={{ color: "#aaa", marginTop: "10px" }}>
        Move with WASD or Arrow Keys
      </div>
    </div>
  );
};

export default GameCanvas;
