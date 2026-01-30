import { MonsterEntity } from "./MonsterEntity";
import { PlayerEntity } from "./PlayerEntity";

export type ProjectileType = "LINEAR" | "ORBITAL" | "FLAME" | "AREA";

/**
 * 뱀파이어 서바이버 게임의 투사체(무기) 엔티티
 */
export class ProjectileEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  penetration: number;
  lifeTime: number; // 초 단위
  size: number = 10;
  color: string = "#00d2ff";
  hitMonsters: Set<MonsterEntity> = new Set();
  isExpired: boolean = false;

  // 특수 투사체 관련
  type: ProjectileType;
  owner?: PlayerEntity;
  angle: number = 0;
  distance: number = 0;
  orbitSpeed: number = 0;

  constructor(
    x: number,
    y: number,
    vx: number,
    vy: number,
    damage: number = 10,
    penetration: number = 1,
    lifeTime: number = 2,
    type: ProjectileType = "LINEAR",
    options?: {
      size?: number;
      color?: string;
      owner?: PlayerEntity;
      distance?: number;
      orbitSpeed?: number;
      angle?: number;
    },
  ) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.damage = damage;
    this.penetration = penetration;
    this.lifeTime = lifeTime;
    this.type = type;

    if (options) {
      if (options.size) this.size = options.size;
      if (options.color) this.color = options.color;
      this.owner = options.owner;
      this.distance = options.distance || 0;
      this.orbitSpeed = options.orbitSpeed || 0;
      this.angle = options.angle || 0;
    }
  }

  update(deltaTime: number) {
    this.lifeTime -= deltaTime;
    if (this.lifeTime <= 0) {
      this.isExpired = true;
      return;
    }

    if (this.type === "ORBITAL" && this.owner) {
      // 플레이어 주변을 회전
      this.angle += this.orbitSpeed * deltaTime;
      this.x = this.owner.x + Math.cos(this.angle) * this.distance;
      this.y = this.owner.y + Math.sin(this.angle) * this.distance;
    } else {
      // 일반 직선 이동
      this.x += this.vx * deltaTime;
      this.y += this.vy * deltaTime;
    }
  }

  onHit(monster: MonsterEntity) {
    if (this.hitMonsters.has(monster)) return false;

    this.hitMonsters.add(monster);
    monster.takeDamage(this.damage);

    // FLAME타입은 관통이 무한하거나 매우 높음
    if (this.type !== "FLAME") {
      this.penetration -= 1;
      if (this.penetration <= 0) {
        this.isExpired = true;
      }
    }
    return true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.type === "FLAME") {
      // 화염 연출
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
      gradient.addColorStop(0, "rgba(255, 100, 0, 1)");
      gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fillStyle = this.color;

      if (this.type === "ORBITAL") {
        // 성경 같은 모양
        ctx.rotate(this.angle + Math.PI / 2);
        ctx.fillRect(-this.size / 2, -this.size, this.size, this.size * 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-this.vx * 0.05, -this.vy * 0.05);
        ctx.lineWidth = this.size / 2;
        ctx.strokeStyle = this.color;
        ctx.stroke();
      }
    }

    ctx.restore();
  }
}
