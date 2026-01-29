/**
 * PlayerEntity 가질 수 있는 속성 정의
 */
export interface PlayerStats {
  speed: number;
  attackPower: number;
  collectionRange: number;
  maxHp: number;
  currentHp: number;
}

/**
 * 뱀파이어 서바이버 게임의 플레이어 엔티티
 */
export class PlayerEntity {
  x: number;
  y: number;
  stats: PlayerStats;
  image: HTMLImageElement | null = null;
  width: number = 40;
  height: number = 40;

  constructor(
    x: number,
    y: number,
    stats?: Partial<PlayerStats>,
    imageUrl?: string,
  ) {
    this.x = x;
    this.y = y;
    this.stats = {
      speed: 200,
      attackPower: 10,
      collectionRange: 50,
      maxHp: 100,
      currentHp: 100,
      ...stats,
    };

    if (imageUrl) {
      this.setImage(imageUrl);
    }
  }

  /**
   * 플레이어 캐릭터 이미지를 설정합니다.
   */
  setImage(url: string) {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      this.image = img;
    };
  }

  /**
   * 플레이어의 위치를 업데이트합니다. (월드 좌표계)
   * @param keys 현재 눌린 키 셋
   * @param deltaTime 프레임 간 시간 차이 (초 단위)
   */
  update(keys: Set<string>, deltaTime: number) {
    let dx = 0;
    let dy = 0;

    if (keys.has("ArrowUp") || keys.has("w") || keys.has("W")) dy -= 1;
    if (keys.has("ArrowDown") || keys.has("s") || keys.has("S")) dy += 1;
    if (keys.has("ArrowLeft") || keys.has("a") || keys.has("A")) dx -= 1;
    if (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) dx += 1;

    // 대각선 이동 시 속도 일정하게 유지 (정규화)
    if (dx !== 0 && dy !== 0) {
      const length = Math.sqrt(dx * dx + dy * dy);
      dx /= length;
      dy /= length;
    }

    this.x += dx * this.stats.speed * deltaTime;
    this.y += dy * this.stats.speed * deltaTime;
  }

  /**
   * 플레이어를 화면에 그립니다.
   */
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();

    // 플레이어 중심을 기준으로 이동
    ctx.translate(this.x, this.y);

    if (this.image && this.image.complete) {
      // 이미지가 있으면 이미지 출력
      ctx.drawImage(
        this.image,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height,
      );
    } else {
      // 기본 그래픽 (부드러운 색상의 사각형)
      ctx.fillStyle = "#4facfe";
      ctx.beginPath();
      ctx.roundRect(
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height,
        8,
      );
      ctx.fill();

      // 테두리
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();

      // 캐릭터처럼 보이게 눈 추가
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(-10, -5, 4, 0, Math.PI * 2);
      ctx.arc(10, -5, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /**
   * 주변 아이템을 플레이어 쪽으로 이동시키는 로직 (스텁)
   */
  attractItems(items: any[]) {
    // TODO: PickupEntity 구현 후 실제 로직 추가
    // collectionRange 내에 있는 아이템들을 플레이어 방향으로 가속시킴
  }
}
