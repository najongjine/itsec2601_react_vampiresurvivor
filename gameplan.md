# Vampire Survivors 게임 컴포넌트 설계

Vampire Survivors 스타일의 게임을 구현하기 위해 필요한 핵심 구성 요소들을 프로그래밍 컴포넌트 및 시스템 단위로 분류한 설계안입니다.

---

## 1. Core Engine (게임 엔진 및 관리자)

게임의 전체적인 흐름과 상태를 제어하는 핵심 레이어입니다.

- **GameManager**: 게임의 전체 상태(시작, 진행, 일시정지, 게임 오버)를 관리합니다.
- **GameLoop**: 매 프레임마다 물리 연산, 렌더링, 시스템 업데이트를 트리거합니다. (requestAnimationFrame 기반)
- **TimeManager**: 게임 내 시간 흐름, 타이머, 웨이브 변화 시점을 관리합니다.

---

## 2. Entity System (엔티티 시스템)

게임 내에 존재하는 모든 객체들의 정의와 로직입니다.

### **Player (플레이어)**

- **PlayerController**: 입력(WASD/Arrow keys)에 따른 이동 및 방향 전환 처리.
- **PlayerStats**: HP, 이동 속도, 공격력, 획득 범위(Magnet), 운(Luck) 등의 스탯 관리.
- **Inventory**: 현재 보유한 무기 및 패시브 아이템 목록 관리.

### **Enemy (적/몬스터)**

- **EnemySpawner**: 웨이브별 적 생성 패턴, 위치, 난이도 조절.
- **EnemyAI**: 플레이어를 추적하는 간단한 이동 로직 및 충돌 대미지 처리.
- **EnemyPool**: 퍼포먼스 최적화를 위한 객체 풀링(Object Pooling) 시스템 (수많은 적을 효율적으로 관리).

### **Weapon & Projectile (무기 및 투사체)**

- **WeaponSystem**: 무기별 쿨타임, 공격 범위, 발사 로직 관리.
- **Projectile**: 날아가는 투사체 또는 고정된 공격 영역의 생명주기 및 대미지 판정.

### **Pickups (아이템)**

- **ExperienceGem**: 적 처치 시 드랍되는 경험치 보석.
- **LootSystem**: 보물 상자, 회복 아이템, 골드 등의 생성 및 획득 처리.

---

## 3. Systems (게임 시스템)

엔티티 간의 상호작용과 게임 규칙을 처리하는 백엔드 로직입니다.

- **CollisionSystem**: 적-플레이어, 적-투사체 간의 충돌 검사 (Spatial Partitioning 등을 이용한 최적화 필요).
- **DamageSystem**: 대미지 계산, 크리티컬 판정, 넉백(Knockback) 효과 처리.
- **LevelupSystem**: 경험치 획득에 따른 레벨업, 3가지 무기/강화 아이템 중 선택하는 UI 트리거.
- **StatusEffectSystem**: 독, 빙결, 화상 등 지속 효과 관리.

---

## 4. UI Components (사용자 인터페이스)

사용자에게 정보를 전달하고 상호작용하는 레이어입니다.

- **HUD (Heads-Up Display)**:
  - 경험치 바 (XP Bar)
  - 남은 시간 타이머
  - 현재 킬 카운트
  - 플레이어 HP 바
- **LevelUpMenu**: 레벨업 시 나타나는 무기 선택 카드 UI.
- **OverlayMenus**: 메인 메뉴, 설정, 일시정지, 게임 결과 리포트 화면.

---

## 5. View & Rendering (렌더링)

- **CanvasRenderer**: (성능을 위해 DOM 대신 Canvas 사용 권장) 모든 엔티티와 이펙트를 화면에 그리는 레이어.
- **CameraSystem**: 플레이어를 중심으로 화면을 따라가는 카메라 로직.
