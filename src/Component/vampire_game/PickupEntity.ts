/**
 * 아이템 타입 정의
 */
export type PickupType = "xp_gem" | "gold" | "health";

/**
 * 뱀파이어 서바이버 게임의 아이템 엔티티
 */
export class PickupEntity {
  x: number;
  y: number;
  xpValue: number;
  type: PickupType;
  isCollected: boolean = false;
  size: number = 12;
  color: string = "#2ecc71";
  speed: number = 0; // 자석 효과 시 속도

  constructor(
    x: number,
    y: number,
    xpValue: number = 10,
    type: PickupType = "xp_gem",
  ) {
    this.x = x;
    this.y = y;
    this.xpValue = xpValue;
    this.type = type;

    if (type === "health") {
      this.color = "#ff4b2b";
      this.size = 18;
    } else if (type === "gold") {
      this.color = "#f1c40f";
    }
  }

  /**
   * 아이템의 위치를 업데이트합니다. (자석 효과)
   */
  update(
    playerCoords: { x: number; y: number },
    collectionRange: number,
    deltaTime: number,
  ) {
    const dx = playerCoords.x - this.x;
    const dy = playerCoords.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // 자석 범위 내에 있으면 플레이어 쪽으로 가속
    if (distance < collectionRange) {
      this.speed = Math.min(this.speed + 500 * deltaTime, 600); // 서서히 가속
      this.x += (dx / distance) * this.speed * deltaTime;
      this.y += (dy / distance) * this.speed * deltaTime;
    }

    // 플레이어와 매우 가까우면 수집됨
    if (distance < 15) {
      this.isCollected = true;
    }
  }

  /**
   * 아이템을 그립니다.
   */
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // 반짝이는 보석 모양
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;

    ctx.beginPath();
    ctx.moveTo(0, -this.size / 2);
    ctx.lineTo(this.size / 2, 0);
    ctx.lineTo(0, this.size / 2);
    ctx.lineTo(-this.size / 2, 0);
    ctx.closePath();
    ctx.fill();

    // 반사 하이라이트
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.beginPath();
    ctx.moveTo(-2, -2);
    ctx.lineTo(2, -4);
    ctx.lineTo(4, -2);
    ctx.fill();

    ctx.restore();
  }
}
