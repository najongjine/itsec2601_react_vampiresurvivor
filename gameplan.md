# Vampire Survivors React 컴포넌트 목록

나중에 조립하기 위해 미리 만들어두어야 할 핵심 요소들입니다. **UI 컴포넌트**와 실제 게임을 구성하는 **게임 엔티티(객체)**들로 나누었습니다.

---

## 1. Game Overlays (UI 메뉴)

React로 작성하며, 게임 루프와 독립적으로 상태에 따라 표시됩니다.

- **`StartScreen.tsx`**: 게임 시작 전 초기 화면.
- **`LevelUpModal.tsx`**: 레벨업 시 나타나는 카드 선택 화면.
- **`PauseMenu.tsx`**: 일시정지 옵션 창.
- **`GameOverReport.tsx`**: 게임 종료 결과 리포트.

## 2. HUD Components (인게임 정보 표시)

React로 작성하며, 전역 상태(Store)를 구독하여 실시간 정보를 보여줍니다.

- **`ExperienceBar.tsx`**: 경험치와 레벨 표시.
- **`GameTimer.tsx`**: 생존 시간 표시.
- **`KillCounter.tsx`**: 처치한 몬스터 수.
- **`HealthBar.tsx`**: HP 표시.
- **`InventoryHotbar.tsx`**: 획득 무기/아이템 아이콘 바.

## 3. Game Entities (핵심 게임 객체)

이들은 Canvas 내부에서 움직이는 **'로직 컴포넌트'**입니다. 각각 독립적인 클래스나 데이터 구조로 정의하여 조립 가능하게 만듭니다.

- **`PlayerEntity`**:
  - 속성: 위치(x, y), 속도, 공격력, 획득 범위 등.
  - 역할: 사용자 입력에 따라 움직이고, 주변의 아이템을 끌어당깁니다.
- **`MonsterEntity`**:
  - 속성: 타입(졸개, 보스), 체력, 이동 속도, 대미지.
  - 역할: 플레이어를 향해 이동하고 충돌 시 대미지를 줍니다.
- **`ProjectileEntity` (미사일/무기)**:
  - 속성: 궤적, 관통 횟수, 공격력, 지속 시간.
  - 역할: 플레이어 주변에서 생성되어 적을 향해 날아가거나 특정 영역을 공격합니다.
- **`PickupEntity` (경험치/아이템)**:
  - 속성: 경험치 양, 드랍 위치.
  - 역할: 적 처치 시 생성되며 플레이어가 접근하면 플레이어에게 흡수됩니다.

## 4. Game Graphics Container (그래픽 및 조립)

위의 모든 엔티티들을 하나로 묶어 화면에 그리는 메인 컴포넌트입니다.

- **`GameCanvas.tsx`**:
  - 모든 `Monster`, `Projectile`, `Player` 객체들을 배열로 관리합니다.
  - 이 객체들을 돌면서 "움직여라", "화면에 그려라"라고 명령합니다. (조립의 핵심)

## 5. Item Cards & Icons (UI 요소)

- **`UpgradeCard.tsx`**: 레벨업 화면의 개별 카드.
- **`StatIcon.tsx`**: 스탯 표시용 아이콘.

---

## 💡 조립 가이드 (Gemini에게 시킬 일):

1. **"PlayerEntity와 MonsterEntity 간의 충돌 로직을 작성해줘"**
2. **"GameCanvas에서 ProjectileEntity들을 관리하고 적과 맞으면 사라지게 해줘"**
3. **"MonsterEntity가 죽을 때 그 자리에 PickupEntity를 생성해줘"**
