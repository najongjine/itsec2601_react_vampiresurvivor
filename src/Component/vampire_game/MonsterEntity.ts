/**
 * 몬스터 타입 정의
 */
export type MonsterType = "minion" | "boss";

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
}

/**
 * 뱀파이어 서바이버 게임의 몬스터 엔티티
 */
export class MonsterEntity {
  x: number;
  y: number;
  stats: MonsterStats;
  isDead: boolean = false;

  constructor(
    x: number,
    y: number,
    type: MonsterType = "minion",
    level: number = 1,
  ) {
    this.x = x;
    this.y = y;

    // 레벨에 따른 스탯 스케일링 (기본 예시)
    if (type === "boss") {
      this.stats = {
        hp: 100 * level,
        maxHp: 100 * level,
        speed: 80,
        damage: 20,
        type: "boss",
        color: "#ff3333",
        size: 50,
      };
    } else {
      this.stats = {
        hp: 20 * level,
        maxHp: 20 * level,
        speed: 120,
        damage: 5,
        type: "minion",
        color: "#8e44ad",
        size: 30,
      };
    }
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
   * 몬스터를 화면에 그립니다.
   */
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // 몸통
    ctx.fillStyle = this.stats.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.stats.size / 2, 0, Math.PI * 2);
    ctx.fill();

    // 테두리
    ctx.strokeStyle = "rgba(0,0,0,0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 눈 (무섭게 보이게)
    ctx.fillStyle = "white";
    const eyeSize = this.stats.size * 0.15;
    const eyeOffset = this.stats.size * 0.2;
    ctx.beginPath();
    ctx.arc(-eyeOffset, -eyeOffset, eyeSize, 0, Math.PI * 2);
    ctx.arc(eyeOffset, -eyeOffset, eyeSize, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(-eyeOffset, -eyeOffset, eyeSize / 2, 0, Math.PI * 2);
    ctx.arc(eyeOffset, -eyeOffset, eyeSize / 2, 0, Math.PI * 2);
    ctx.fill();

    // HP 바 (선택적)
    if (this.stats.hp < this.stats.maxHp) {
      const barWidth = this.stats.size;
      const barHeight = 4;
      ctx.fillStyle = "#333";
      ctx.fillRect(
        -barWidth / 2,
        -this.stats.size / 2 - 10,
        barWidth,
        barHeight,
      );
      ctx.fillStyle = "#ff3333";
      ctx.fillRect(
        -barWidth / 2,
        -this.stats.size / 2 - 10,
        barWidth * (this.stats.hp / this.stats.maxHp),
        barHeight,
      );
    }

    ctx.restore();
  }
}
