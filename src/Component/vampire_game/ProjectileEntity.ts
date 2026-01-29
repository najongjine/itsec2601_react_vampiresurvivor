import { MonsterEntity } from "./MonsterEntity";

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
  hitMonsters: Set<MonsterEntity> = new Set(); // 이미 맞은 몬스터 중복 데미지 방지
  isExpired: boolean = false;

  constructor(
    x: number,
    y: number,
    vx: number,
    vy: number,
    damage: number = 10,
    penetration: number = 1,
    lifeTime: number = 2,
  ) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.damage = damage;
    this.penetration = penetration;
    this.lifeTime = lifeTime;
  }

  /**
   * 투사체의 위치를 업데이트하고 수명을 체크합니다.
   */
  update(deltaTime: number) {
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
    this.lifeTime -= deltaTime;

    if (this.lifeTime <= 0) {
      this.isExpired = true;
    }
  }

  /**
   * 몬스터와 충돌했을 때 호출됩니다.
   */
  onHit(monster: MonsterEntity) {
    if (this.hitMonsters.has(monster)) return false;

    this.hitMonsters.add(monster);
    monster.takeDamage(this.damage);
    this.penetration -= 1;

    if (this.penetration <= 0) {
      this.isExpired = true;
    }
    return true;
  }

  /**
   * 투사체를 그립니다.
   */
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // 빛나는 효과
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
    ctx.fill();

    // 꼬리 효과 (간단하게)
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-this.vx * 0.05, -this.vy * 0.05);
    ctx.lineWidth = this.size;
    ctx.strokeStyle = this.color;
    ctx.stroke();

    ctx.restore();
  }
}
