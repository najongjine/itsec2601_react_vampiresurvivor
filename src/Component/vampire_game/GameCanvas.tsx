import React, { useEffect, useRef } from "react";
import { PlayerEntity } from "./PlayerEntity";
import { MonsterEntity } from "./MonsterEntity";
import { ProjectileEntity } from "./ProjectileEntity";
import { PickupEntity } from "./PickupEntity";

interface GameCanvasProps {
  playerImageUrl?: string;
  onPlayerDamage: (amount: number) => void;
  onMonsterKill: () => void;
  onGainXp: (amount: number) => void;
  level: number;
}

const GameCanvas: React.FC<GameCanvasProps> = ({
  playerImageUrl,
  onPlayerDamage,
  onMonsterKill,
  onGainXp,
  level,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<PlayerEntity>(
    new PlayerEntity(400, 300, {}, playerImageUrl),
  );
  const monstersRef = useRef<MonsterEntity[]>([]);
  const projectilesRef = useRef<ProjectileEntity[]>([]);
  const pickupsRef = useRef<PickupEntity[]>([]);

  const cameraRef = useRef({ x: 0, y: 0 });
  const keysRef = useRef<Set<string>>(new Set());
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const fireTimerRef = useRef<number>(0);

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

  const spawnMonster = (canvasWidth: number, canvasHeight: number) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.max(canvasWidth, canvasHeight) * 0.7;

    const spawnX = playerRef.current.x + Math.cos(angle) * distance;
    const spawnY = playerRef.current.y + Math.sin(angle) * distance;

    const type = Math.random() > 0.9 ? "boss" : "minion";
    monstersRef.current.push(new MonsterEntity(spawnX, spawnY, type, level));
  };

  const autoFire = () => {
    if (monstersRef.current.length === 0) return;

    // 가장 가까운 적 찾기
    let closestMonster: MonsterEntity | null = null;
    let minDist = Infinity;

    monstersRef.current.forEach((monster) => {
      const dx = monster.x - playerRef.current.x;
      const dy = monster.y - playerRef.current.y;
      const dist = dx * dx + dy * dy;
      if (dist < minDist) {
        minDist = dist;
        closestMonster = monster;
      }
    });

    if (closestMonster) {
      const monster = closestMonster as MonsterEntity;
      const dx = monster.x - playerRef.current.x;
      const dy = monster.y - playerRef.current.y;
      const angle = Math.atan2(dy, dx);
      const speed = 400;

      projectilesRef.current.push(
        new ProjectileEntity(
          playerRef.current.x,
          playerRef.current.y,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          playerRef.current.stats.attackPower,
          1, // 관통 1
          2, // 수명 2초
        ),
      );
    }
  };

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
        // 플레이어 업데이트
        playerRef.current.update(keysRef.current, deltaTime);

        // 카메라 업데이트
        cameraRef.current.x = playerRef.current.x - canvas.width / 2;
        cameraRef.current.y = playerRef.current.y - canvas.height / 2;

        // 몬스터 스폰
        spawnTimerRef.current += deltaTime;
        if (spawnTimerRef.current > 1.2) {
          spawnMonster(canvas.width, canvas.height);
          spawnTimerRef.current = 0;
        }

        // 자동 발사 (1초마다)
        fireTimerRef.current += deltaTime;
        if (fireTimerRef.current > 1.0) {
          autoFire();
          fireTimerRef.current = 0;
        }

        // 투사체 업데이트 및 충돌 검사
        projectilesRef.current.forEach((projectile) => {
          projectile.update(deltaTime);

          // 몬스터와 충돌 검사
          monstersRef.current.forEach((monster) => {
            if (monster.isDead) return;

            const dx = projectile.x - monster.x;
            const dy = projectile.y - monster.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = (projectile.size + monster.stats.size) / 2;

            if (dist < minDist) {
              projectile.onHit(monster);
              if (monster.isDead) {
                onMonsterKill();
                // 죽을 때 아이템 드랍
                pickupsRef.current.push(
                  new PickupEntity(monster.x, monster.y, 25),
                );
              }
            }
          });
        });

        // 몬스터 업데이트 및 플레이어 충돌 검사
        monstersRef.current.forEach((monster: MonsterEntity) => {
          monster.update(
            { x: playerRef.current.x, y: playerRef.current.y },
            deltaTime,
          );

          const dx = monster.x - playerRef.current.x;
          const dy = monster.y - playerRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = (monster.stats.size + playerRef.current.width) / 2;

          if (dist < minDist) {
            onPlayerDamage(monster.stats.damage * deltaTime);
          }
        });

        // 아이템 업데이트 및 수집 검사
        pickupsRef.current.forEach((pickup: PickupEntity) => {
          pickup.update(
            { x: playerRef.current.x, y: playerRef.current.y },
            playerRef.current.stats.collectionRange,
            deltaTime,
          );

          if (pickup.isCollected) {
            onGainXp(pickup.xpValue);
          }
        });

        // 죽은 개체 정리
        monstersRef.current = monstersRef.current.filter((m) => !m.isDead);
        projectilesRef.current = projectilesRef.current.filter(
          (p) => !p.isExpired,
        );
        pickupsRef.current = pickupsRef.current.filter((p) => !p.isCollected);

        // 화면 청소
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 격자 그리기
        drawInfiniteGrid(ctx, canvas.width, canvas.height, cameraRef.current);

        // 개체들 그리기
        ctx.save();
        ctx.translate(-cameraRef.current.x, -cameraRef.current.y);

        monstersRef.current.forEach((m: MonsterEntity) => m.draw(ctx));
        projectilesRef.current.forEach((p: ProjectileEntity) => p.draw(ctx));
        pickupsRef.current.forEach((p: PickupEntity) => p.draw(ctx));
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
