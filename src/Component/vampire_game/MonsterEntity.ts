/**
 * 몬스터 타입 정의
 */
export type MonsterType =
  | "bat"
  | "zombie"
  | "dracula"
  | "werewolf"
  | "mantis"
  | "golem";

/**
 * 몬스터의 스탯 정의
 */
export interface MonsterStats {
  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  type: MonsterType;
  color: string;
  size: number;
  name: string;
}

/**
 * 뱀파이어 서바이버 게임의 몬스터 엔티티
 */
export class MonsterEntity {
  x: number;
  y: number;
  stats: MonsterStats;
  isDead: boolean = false;
  image: HTMLImageElement | null = null;

  constructor(
    x: number,
    y: number,
    type: MonsterType = "bat",
    level: number = 1,
    imageUrl?: string,
  ) {
    this.x = x;
    this.y = y;

    if (imageUrl) {
      this.setImage(imageUrl);
    }

    const baseStats: Record<MonsterType, Partial<MonsterStats>> = {
      bat: {
        hp: 10,
        speed: 150,
        damage: 1,
        color: "#5d3fd3",
        size: 20,
        name: "Bat",
      },
      zombie: {
        hp: 20,
        speed: 150,
        damage: 2,
        color: "#2ecc71",
        size: 30,
        name: "Zombie",
      },
      dracula: {
        hp: 30,
        speed: 110,
        damage: 4,
        color: "#c0392b",
        size: 35,
        name: "Dracula",
      },
      werewolf: {
        hp: 40,
        speed: 110,
        damage: 6,
        color: "#7f8c8d",
        size: 40,
        name: "Werewolf",
      },
      mantis: {
        hp: 200,
        speed: 100,
        damage: 10,
        color: "#f1c40f",
        size: 60,
        name: "Mantis (Boss)",
      },
      golem: {
        hp: 1000,
        speed: 90,
        damage: 20,
        color: "#34495e",
        size: 80,
        name: "Golem (Boss)",
      },
    };

    const stats = baseStats[type];
    const hp = (stats.hp || 10) * level;

    this.stats = {
      hp: hp,
      maxHp: hp,
      speed: stats.speed || 100,
      damage: (stats.damage || 1) * level,
      type: type,
      color: stats.color || "#8e44ad",
      size: stats.size || 30,
      name: stats.name || type,
    };
  }

  /**
   * 플레이어 방향으로 이동합니다.
   * @param playerCoords 플레이어의 월드 좌표
   * @param deltaTime 프레임 간 시간 차이
   */
  update(playerCoords: { x: number; y: number }, deltaTime: number) {
    const dx = playerCoords.x - this.x;
    const dy = playerCoords.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      // 플레이어 방향으로 정규화된 벡터 계산 및 이동
      this.x += (dx / distance) * this.stats.speed * deltaTime;
      this.y += (dy / distance) * this.stats.speed * deltaTime;
    }
  }

  /**
   * 몬스터에게 데미지를 입힙니다.
   */
  takeDamage(amount: number) {
    this.stats.hp -= amount;
    if (this.stats.hp <= 0) {
      this.isDead = true;
    }
  }

  /**
   * 몬스터 이미지를 설정합니다.
   */
  setImage(url: string) {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      this.image = img;
    };
  }

  /**
   * 몬스터를 화면에 그립니다.
   */
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);

    const size = this.stats.size;

    // 이미지가 있으면 이미지 출력, 없으면 커스텀 드로잉
    if (this.image && this.image.complete) {
      ctx.drawImage(this.image, -size / 2, -size / 2, size, size);
    } else {
      const time = Date.now() / 1000;
      const color = this.stats.color;

      switch (this.stats.type) {
        case "bat":
          this.drawBat(ctx, size, color, time);
          break;
        case "zombie":
          this.drawZombie(ctx, size, color, time);
          break;
        case "dracula":
          this.drawDracula(ctx, size, color, time);
          break;
        case "werewolf":
          this.drawWerewolf(ctx, size, color, time);
          break;
        case "mantis":
          this.drawMantis(ctx, size, color, time);
          break;
        case "golem":
          this.drawGolem(ctx, size, color, time);
          break;
        default:
          this.drawGeneric(ctx, size, color);
      }
    }

    // HP 바
    if (this.stats.hp < this.stats.maxHp) {
      const barWidth = size;
      const barHeight = 4;
      ctx.fillStyle = "#333";
      ctx.fillRect(-barWidth / 2, -size / 2 - 15, barWidth, barHeight);
      ctx.fillStyle = "#ff3333";
      ctx.fillRect(
        -barWidth / 2,
        -size / 2 - 15,
        barWidth * (this.stats.hp / this.stats.maxHp),
        barHeight,
      );
    }

    ctx.restore();
  }

  private drawBat(
    ctx: CanvasRenderingContext2D,
    size: number,
    color: string,
    time: number,
  ) {
    const flap = Math.sin(time * 15) * 0.8;
    ctx.fillStyle = color;

    // 날개
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(size * 0.8, -size * (0.5 + flap), size, 0);
    ctx.quadraticCurveTo(size * 0.5, size * 0.2, 0, 0);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-size * 0.8, -size * (0.5 + flap), -size, 0);
    ctx.quadraticCurveTo(-size * 0.5, size * 0.2, 0, 0);
    ctx.fill();

    // 몸통
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // 눈
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(-size * 0.1, -size * 0.05, 2, 0, Math.PI * 2);
    ctx.arc(size * 0.1, -size * 0.05, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawZombie(
    ctx: CanvasRenderingContext2D,
    size: number,
    color: string,
    time: number,
  ) {
    const wobble = Math.sin(time * 5) * 0.1;
    ctx.rotate(wobble);
    ctx.fillStyle = color;

    // 몸체 (약간 각진 사각형)
    ctx.fillRect(-size * 0.4, -size * 0.5, size * 0.8, size);

    // 머리
    ctx.fillStyle = "#7fb3d5";
    ctx.fillRect(-size * 0.3, -size * 0.6, size * 0.6, size * 0.3);

    // 눈 (초점 없는 좀비 눈)
    ctx.fillStyle = "white";
    ctx.fillRect(-size * 0.2, -size * 0.5, 4, 4);
    ctx.fillRect(size * 0.1, -size * 0.5, 4, 4);
  }

  private drawDracula(
    ctx: CanvasRenderingContext2D,
    size: number,
    color: string,
    time: number,
  ) {
    // 망토 (검은색)
    ctx.fillStyle = "#2c3e50";
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.5);
    ctx.lineTo(size * 0.6, size * 0.7);
    ctx.lineTo(-size * 0.6, size * 0.7);
    ctx.closePath();
    ctx.fill();

    // 얼굴 (창백한 색)
    ctx.fillStyle = "#fdfefe";
    ctx.beginPath();
    ctx.arc(0, -size * 0.3, size * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // 턱시도/깃
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-size * 0.3, -size * 0.3);
    ctx.lineTo(0, 0);
    ctx.lineTo(size * 0.3, -size * 0.3);
    ctx.stroke();

    // 눈 (빨간색)
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(-size * 0.1, -size * 0.35, 2, 0, Math.PI * 2);
    ctx.arc(size * 0.1, -size * 0.35, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawWerewolf(
    ctx: CanvasRenderingContext2D,
    size: number,
    color: string,
    time: number,
  ) {
    ctx.fillStyle = color;
    // 털이 많은 느낌을 주기 위해 삐죽삐죽하게 그림
    ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const r = size * 0.4 + (i % 2 === 0 ? 5 : 0);
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    // 귀
    ctx.beginPath();
    ctx.moveTo(-size * 0.3, -size * 0.3);
    ctx.lineTo(-size * 0.4, -size * 0.6);
    ctx.lineTo(-size * 0.1, -size * 0.4);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(size * 0.3, -size * 0.3);
    ctx.lineTo(size * 0.4, -size * 0.6);
    ctx.lineTo(size * 0.1, -size * 0.4);
    ctx.fill();

    // 눈 (노란색)
    ctx.fillStyle = "#f1c40f";
    ctx.beginPath();
    ctx.arc(-size * 0.15, -size * 0.1, 3, 0, Math.PI * 2);
    ctx.arc(size * 0.15, -size * 0.1, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawMantis(
    ctx: CanvasRenderingContext2D,
    size: number,
    color: string,
    time: number,
  ) {
    ctx.fillStyle = color;
    // 몸통 (길쭉함)
    ctx.fillRect(-size * 0.2, -size * 0.6, size * 0.4, size * 1.2);

    // 낫 (Scythes) - 앞다리
    const swing = Math.sin(time * 10) * 0.3;
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";

    // 왼쪽 낫
    ctx.beginPath();
    ctx.moveTo(-size * 0.2, -size * 0.3);
    ctx.lineTo(-size * 0.7, -size * (0.1 + swing));
    ctx.lineTo(-size * 0.4, size * (0.2 + swing));
    ctx.stroke();

    // 오른쪽 낫
    ctx.beginPath();
    ctx.moveTo(size * 0.2, -size * 0.3);
    ctx.lineTo(size * 0.7, -size * (0.1 + swing));
    ctx.lineTo(size * 0.4, size * (0.2 + swing));
    ctx.stroke();

    // 눈 (큰 곤충 눈)
    ctx.fillStyle = "#2ecc71";
    ctx.beginPath();
    ctx.ellipse(-size * 0.2, -size * 0.7, 8, 5, -0.5, 0, Math.PI * 2);
    ctx.ellipse(size * 0.2, -size * 0.7, 8, 5, 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawGolem(
    ctx: CanvasRenderingContext2D,
    size: number,
    color: string,
    time: number,
  ) {
    ctx.fillStyle = color;
    // 돌 조각들로 구성된 형태
    ctx.beginPath();
    ctx.moveTo(-size * 0.4, -size * 0.4);
    ctx.lineTo(size * 0.5, -size * 0.3);
    ctx.lineTo(size * 0.4, size * 0.5);
    ctx.lineTo(-size * 0.5, size * 0.4);
    ctx.closePath();
    ctx.fill();

    // 추가 돌 조각 (어깨/팔 느낌)
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(-size * 0.6, -size * 0.2, size * 0.3, size * 0.4);
    ctx.fillRect(size * 0.3, -size * 0.2, size * 0.3, size * 0.4);

    // 빛나는 코어
    const pulse = Math.sin(time * 3) * 0.5 + 0.5;
    ctx.fillStyle = `rgba(0, 210, 255, ${0.5 + pulse * 0.5})`;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00d2ff";
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  private drawGeneric(
    ctx: CanvasRenderingContext2D,
    size: number,
    color: string,
  ) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
    ctx.fill();
  }
}
