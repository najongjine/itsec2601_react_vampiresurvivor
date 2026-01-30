import { ProjectileEntity, ProjectileType } from "./ProjectileEntity";
import { PlayerEntity } from "./PlayerEntity";
import { MonsterEntity } from "./MonsterEntity";

export interface WeaponConfig {
  id: string;
  name: string;
  type: ProjectileType;
  baseDamage: number;
  cooldown: number; // 초 단위
  penetration: number;
  lifeTime: number;
  projectileCount: number;
  speed: number;
  size: number;
  color: string;
  description: string;
}

export class Weapon {
  config: WeaponConfig;
  level: number = 1;
  lastFireTime: number = 0;

  constructor(config: WeaponConfig) {
    this.config = config;
  }

  update(
    currentTime: number,
    player: PlayerEntity,
    monsters: MonsterEntity[],
    projectiles: ProjectileEntity[],
  ) {
    // 레벨에 따라 재사용 대기시간(cooldown) 감소 (최대 50% 단축)
    const currentCooldown =
      this.config.id === "pidgeon"
        ? this.config.cooldown * (1 - Math.min(0.5, (this.level - 1) * 0.1))
        : this.config.cooldown;

    if (currentTime - this.lastFireTime >= currentCooldown) {
      this.fire(player, monsters, projectiles);
      this.lastFireTime = currentTime;
    }
  }

  fire(
    player: PlayerEntity,
    monsters: MonsterEntity[],
    projectiles: ProjectileEntity[],
  ) {
    const { baseDamage, penetration, lifeTime, speed, size, color } =
      this.config;
    const damage = (baseDamage * player.stats.attackPower) / 10;
    const currentLevel = this.level;

    switch (this.config.id) {
      case "dagger":
        // 레벨업할수록 더 많이 투척 (1 + level)
        // 몬스터가 여러 군데면 랜덤하게 또는 다양한 타겟을 향해 발사
        const daggerCount = 1 + currentLevel;
        const potentialTargets = [...monsters]
          .sort((a, b) => {
            const distA =
              Math.pow(a.x - player.x, 2) + Math.pow(a.y - player.y, 2);
            const distB =
              Math.pow(b.x - player.x, 2) + Math.pow(b.y - player.y, 2);
            return distA - distB;
          })
          .slice(0, Math.max(5, daggerCount));

        for (let i = 0; i < daggerCount; i++) {
          let target =
            potentialTargets[i % potentialTargets.length] ||
            this.getClosestMonster(player, monsters);
          if (target) {
            const dx = target.x - player.x;
            const dy = target.y - player.y;
            const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.2; // 약간의 랜덤 퍼짐
            projectiles.push(
              new ProjectileEntity(
                player.x,
                player.y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                damage,
                penetration,
                lifeTime,
                "LINEAR",
                { size, color },
              ),
            );
          }
        }
        break;

      case "flamethrower":
        // 레벨업할수록 크기가 더 커짐 (20%씩 증가)
        const currentSize = size * (1 + (currentLevel - 1) * 0.2);
        const fTarget = this.getClosestMonster(player, monsters);
        const baseAngle = fTarget
          ? Math.atan2(fTarget.y - player.y, fTarget.x - player.x)
          : 0;

        // 연사 속도는 cooldown으로 이미 조절됨
        for (let i = 0; i < 3; i++) {
          const spread = (Math.random() - 0.5) * 0.6;
          const angle = baseAngle + spread;
          projectiles.push(
            new ProjectileEntity(
              player.x,
              player.y,
              Math.cos(angle) * speed * (0.8 + Math.random() * 0.4),
              Math.sin(angle) * speed * (0.8 + Math.random() * 0.4),
              damage / 2,
              999,
              0.5,
              "FLAME",
              { size: currentSize * (0.5 + Math.random()), color: "#ff4500" },
            ),
          );
        }
        break;

      case "bible":
        // 레벨업할수록 개수(2+level)와 회전 속도 증가
        const bibleCount = 2 + currentLevel;
        const rotationSpeed = 3 + (currentLevel - 1) * 0.5;
        const orbitDist = 100 + (currentLevel - 1) * 10;

        const existingBibles = projectiles.filter(
          (p) => p.type === "ORBITAL" && p.color === color,
        );

        if (existingBibles.length < bibleCount) {
          const countToSpawn = bibleCount - existingBibles.length;
          for (let i = 0; i < countToSpawn; i++) {
            const initialAngle =
              ((Math.PI * 2) / bibleCount) * (existingBibles.length + i);
            projectiles.push(
              new ProjectileEntity(
                player.x,
                player.y,
                0,
                0,
                damage,
                999,
                lifeTime,
                "ORBITAL",
                {
                  size,
                  color,
                  owner: player,
                  distance: orbitDist,
                  orbitSpeed: rotationSpeed,
                  angle: initialAngle,
                },
              ),
            );
          }
        }
        break;

      case "pidgeon":
        // 플레이어를 orbit 하면서 scatter(산탄)를 몬스터 향해 쏨
        // 레벨 업할수록 산탄 개수(2+level)와 fire rate 증가
        const scatterCount = 2 + currentLevel;
        const pFireRate = 1.0 - Math.min(0.5, (currentLevel - 1) * 0.1); // Cooldown 개념

        // Emitter(비둘기)는 한 개만 유지 (ORBITAL)
        const existingPidgeon = projectiles.find(
          (p) => p.type === "ORBITAL" && p.color === "#ffffff",
        );
        if (!existingPidgeon) {
          projectiles.push(
            new ProjectileEntity(
              player.x,
              player.y,
              0,
              0,
              0,
              999,
              9999,
              "ORBITAL",
              {
                size: 20,
                color: "#ffffff",
                owner: player,
                distance: 80,
                orbitSpeed: 2,
              },
            ),
          );
        } else {
          // 비둘기가 총알을 쏨
          // update loop 내에서 fire가 불릴 때마다 쏘면 너무 빠를 수 있으므로 내부 타이머 활용이 좋지만,
          // 여기서는 fire()가 config.cooldown마다 호출되므로 이를 fire rate로 사용
          const pTarget = this.getClosestMonster(player, monsters);
          if (pTarget) {
            const dx = pTarget.x - existingPidgeon.x;
            const dy = pTarget.y - existingPidgeon.y;
            const bAngle = Math.atan2(dy, dx);

            for (let i = 0; i < scatterCount; i++) {
              const sAngle = bAngle + (Math.random() - 0.5) * 0.4;
              projectiles.push(
                new ProjectileEntity(
                  existingPidgeon.x,
                  existingPidgeon.y,
                  Math.cos(sAngle) * 400,
                  Math.sin(sAngle) * 400,
                  damage,
                  1,
                  1.5,
                  "LINEAR",
                  { size: 8, color: "#00ffff" },
                ),
              );
            }
          }
        }
        break;
    }
  }

  getClosestMonster(
    player: PlayerEntity,
    monsters: MonsterEntity[],
  ): MonsterEntity | null {
    let closest = null;
    let minDist = Infinity;
    for (const m of monsters) {
      const dist = Math.pow(m.x - player.x, 2) + Math.pow(m.y - player.y, 2);
      if (dist < minDist) {
        minDist = dist;
        closest = m;
      }
    }
    return closest;
  }
}

export const WEAPON_CONFIGS: Record<string, WeaponConfig> = {
  dagger: {
    id: "dagger",
    name: "Dagger",
    type: "LINEAR",
    baseDamage: 10,
    cooldown: 0.8,
    penetration: 1,
    lifeTime: 2,
    projectileCount: 1,
    speed: 500,
    size: 10,
    color: "#ffffff",
    description: "Fires a fast dagger at the nearest enemy.",
  },
  flamethrower: {
    id: "flamethrower",
    name: "Flamethrower",
    type: "FLAME",
    baseDamage: 5,
    cooldown: 0.1,
    penetration: 999,
    lifeTime: 0.5,
    projectileCount: 3,
    speed: 200,
    size: 20,
    color: "#ff4500",
    description: "Releases a stream of fire in front of you.",
  },
  bible: {
    id: "bible",
    name: "Rotating Bible",
    type: "ORBITAL",
    baseDamage: 15,
    cooldown: 3,
    penetration: 999,
    lifeTime: 5,
    projectileCount: 2,
    speed: 0,
    size: 15,
    color: "#ffd700",
    description: "Orbits around the player, damaging enemies.",
  },
  pidgeon: {
    id: "pidgeon",
    name: "Pidgeon",
    type: "AREA",
    baseDamage: 30,
    cooldown: 2,
    penetration: 999,
    lifeTime: 0.3,
    projectileCount: 1,
    speed: 0,
    size: 40,
    color: "#ffffff",
    description: "Bombards random areas around the player.",
  },
};
