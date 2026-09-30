# UI/UX 컴포넌트 및 레이아웃 가이드 (`ui-ux.md`)

본 문서는 스마트 계산기 허브의 **공통 UI 컴포넌트, 시각 계층 구조, 인터랙션 및 반응형 레이아웃 규격**을 정의합니다.  
기본 디자인 토큰(컬러 팔레트, 타이포그래피, 고스트 섀도우)은 [`ghost.design.md`](./ghost.design.md)를 상속하며, 비즈니스 계산 및 데이터 로직은 [`PRD.md`](./PRD.md)를 준수합니다.

---

## 1. 전역 레이아웃 및 뷰포트 아키텍처

### 1.1 반응형 2컬럼 레이아웃 (`lg:grid-cols-12`)
- **데스크톱 (≥ 1024px, `lg`)**:
  - 좌측 입력 폼: `lg:col-span-5`
  - 우측 결과 대시보드: `lg:col-span-7`
- **모바일 및 태블릿 (< 1024px)**:
  - 수직 1열 스택 (`grid-cols-1`)으로 자동 리플로우되어 가로 스크롤 없는 한 손 조작 보장.

### 1.2 최하단 풀위드 단독 배치 원칙 (`InfoCard`)
- 2열 그리드를 채택하는 모든 계산기에서도 `InfoCard`(상식 및 안내 카드)는 우측 7열 내부에 종속되지 않고, 그리드 컨테이너 바깥 최하단에 단독 풀위드(`w-full`) 패널로 배치하여 시각적 안정감과 가독성을 확보한다.

---

## 2. 공통 컴포넌트 시각 및 인터랙션 규격

### 2.1 공통 폼 헤더 (`FormHeader` / `src/components/common/FormHeader.tsx`)
- **역할**: 각 계산기 입력 폼 상단에 배치되는 일관된 제목 및 카테고리 헤더.
- **계층 구조**:
  - **카테고리 뱃지**: `Badge variant="meta"` (소문자/영문 카테고리 태그).
  - **폼 제목**: `h2` 시맨틱 태그, `text-base sm:text-lg font-bold text-ghost-ink dark:text-ghost-dark-ink`.
  - **보조 설명**: `text-xs sm:text-sm text-ghost-ink-mute dark:text-ghost-dark-ink-mute leading-relaxed`.
  - **우측 액션 슬롯**: 초기화 버튼(`ResetButton`) 등 보조 도구 전용 우측 슬롯.

### 2.2 결과 요약 메인 하이라이트 카드 (다크 서피스)
- **컨테이너**: Ghost 시그니처 딥 다크 서피스 (`bg-ghost-surface-elevated dark:bg-ghost-dark-surface-elevated text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-ghost-surface-elevated dark:border-ghost-dark-hairline-soft`).
- **배경 장식**: 우하단 라임 글로우 블러 효과 (`bg-ghost-lime/10 blur-2xl pointer-events-none`).
- **1행 (헤더)**:
  - 좌측: 일렉트릭 라임 시그니처 캡슐 뱃지 (`bg-ghost-lime/20 text-ghost-lime border border-ghost-lime/30`).
  - 우측: 결과 복사 버튼 (`variant="outline" size="sm" h-7 px-2.5 text-xs`).
- **2행 (메인 수치)**:
  - 초대형 볼드 수치 (`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-ghost-lime tabular-nums`).
  - 인라인 한글 독음 병기 (예: `(1억 3,734만 원)`).
- **3행 (하단 보조 바)**:
  - `border-t border-slate-800 dark:border-ghost-dark-hairline` 상단 구분선.
  - 단정한 텍스트 기반 보조 정보 제공 (컬러 이모지 원천 배제).

### 2.3 3단 서브 요약 지표 카드 (`SubMetricCard` / `src/components/common/SubMetricCard.tsx`)
메인 다크 카드 직하단에 위치하는 3단 핵심 지표 요약 카드. 계산기별 파편화를 없애고 엄격한 **3행 계층 구조**를 일괄 적용한다.

- **컨테이너 레이아웃**:
  - 그리드: `grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3` (비교 모드 등 분할 뷰에서는 단일 열 리플로우 지원).
  - 카드 박스: `p-3.5 sm:p-4 rounded-xl bg-white dark:bg-ghost-dark-surface border border-ghost-hairline dark:border-ghost-dark-hairline shadow-2xs space-y-1`.
- **1행 (헤더)**:
  - **좌측**: 아이콘(`w-3.5 h-3.5 shrink-0`) + 라벨(`text-[11px] font-bold uppercase tracking-wider text-ghost-ink-mute dark:text-ghost-dark-ink-mute whitespace-nowrap shrink-0`).
    - **타이틀 완전 표시 보장**: 정보의 핵심 식별자인 타이틀(라벨)은 어떠한 뷰포트에서도 `...` 말줄임 없이 100% 온전히 노출되어야 한다.
  - **우측**: 선택적 뱃지(`badge`, `badgeColor` - slate, rose, emerald, indigo, amber).
    - **뱃지 간결화 원칙**: 뱃지는 2~5글자의 짧은 상태/태그(`15.4%`, `영업일`, `유급` 등)로 제한하며, 긴 금액이나 상세 문장은 1행 뱃지가 아닌 **3행 캡션**에 배치한다.
- **2행 (메인 수치)**:
  - 굵은 볼드 타이포그래피 (`text-base sm:text-lg font-bold tabular-nums`).
  - **수치 색상 옵션 (`valueColor`)**:
    - `default`: 기본 수치/원금/일반 (`text-ghost-ink dark:text-ghost-dark-ink`)
    - `rose`: 공제액/세금/대출이자/손실 (`text-rose-600 dark:text-rose-400`)
    - `emerald`: 순수익/주휴수당/비과세 (`text-emerald-600 dark:text-emerald-400`)
    - `indigo`: 공제비율/수익기여도 (`text-indigo-600 dark:text-indigo-400`)
    - `amber`: 주의/경고 수치 (`text-amber-600 dark:text-amber-400`)
  - **통화 표기 원칙**: `₩` 전치 기호를 지양하고 대한민국 표준인 **`N원` 후치 표기**로 일원화.
- **3행 (하단 캡션)**:
  - 1줄 말줄임 텍스트 (`text-[11px] text-ghost-ink-mute dark:text-ghost-dark-ink-mute truncate`).
  - 한글 독음(예: N억 N만 원), 계산 공식, 부가 설명 및 긴 부가 금액(예: `세전 37,143,848원`)을 일관되게 최하단에 배치.

### 2.4 숫자 및 금액 입력 컴포넌트 (`NumericInput` / `src/components/ui/numeric-input.tsx`)
- **터치 높이**: 모바일 터치 접근성에 최적화된 높이 44px (`h-11`).
- **타이포그래피 및 정렬**: 우측 정렬 (`text-right`), 볼드 폰트 (`font-bold text-base sm:text-lg tracking-tight tabular-nums`).
- **단위 심볼 (`suffix`)**: '원', '%', '년', '개월' 등 단위를 인풋 내측 우측에 배치 (`right-3.5 pointer-events-none text-xs sm:text-sm font-semibold text-ghost-ink-mute dark:text-ghost-dark-ink-mute`).
- **자동 포맷팅**: 통화/금액 입력 시 3자리 콤마(`toLocaleString('ko-KR')`) 자동 적용.

### 2.5 탭 및 세그먼트 전환 컨트롤러 (`SegmentedControl` / `Tabs`)
- **`SegmentedControl`**: 2~3개 분할 인라인 옵션 선택기 (예: 과세 유형, 연산 방향, 월급/주급 기준).
  - 터치 피드백이 명확한 슬레이트/다크 솔리드 배경 및 부드러운 인디케이터 슬라이드.
- **`Tabs`**: 탭 기반 주요 화면 전환 (예: 날짜 계산기의 디데이/간격/나이 탭).

### 2.6 빠른 프리셋 칩 (`SelectableChip` / `src/components/ui/selectable-chip.tsx`)
- 자주 사용하는 입력값(예: `+100만`, `+500만`, `10년`, `90% 우대`)을 1터치로 입력하는 칩 버튼.
- 선택 상태: 라임 하이라이트 보더 및 배경 (`bg-ghost-lime/20 text-ghost-ink dark:text-ghost-lime border-ghost-lime/30 font-bold`).
- 기본 상태: 은은한 고스트 헤어라인 보더 및 뉴트럴 텍스트 (`bg-slate-50 dark:bg-ghost-dark-surface-elevated text-ghost-ink-soft border-ghost-hairline`).

### 2.7 하이브리드 날짜 입력기 (`DatePicker` / `src/components/ui/date-picker.tsx`)
- **하이브리드 UX**:
  - 모바일 터치 시 즉각적인 숫자 키패드(`inputMode="numeric"`) 오픈으로 8자리(예: 19950515) 초고속 타이핑 지원.
  - 우측 캘린더 아이콘 클릭 시 Ghost 테마 달력 팝오버 오픈.
- **`showTodayButton` 제어**:
  - 디데이/간격 계산기: '오늘' 버튼 활성화.
  - 생년월일(만 나이) 입력: 불필요한 '오늘' 버튼을 숨겨 과거 날짜 선택에 집중.

### 2.8 상식 및 안내 카드 (`InfoCard` / `src/components/common/InfoCard.tsx`)
- **배치**: 전 계산기 화면 최하단 풀위드(`w-full`) 단독 배치.
- **스타일링**:
  - `bg-white dark:bg-ghost-dark-surface p-5 sm:p-6 rounded-ghost-xl border border-ghost-hairline dark:border-ghost-dark-hairline shadow-sm`.
  - 컬러 이모지를 배제하고 단정한 흑백 모노크롬 라인 아이콘 적용.
  - 2~4개 핵심 안내 블록을 반응형 그리드로 배열하여 시각적 여유 제공.

### 2.9 즐겨찾기 토글 버튼 및 카드 그리드 우선 정렬 (`StarButton` & `Pin-to-Top`)
- **원터치 즐겨찾기 별 버튼 (`Star`)**:
  - **터치 영역 및 크기**: 모바일 터치 접근성을 위해 최소 32x32px(`h-8 w-8`) 터치 타겟 확보.
  - **시각적 상태 및 인터랙션 (Pure Monochrome Solid)**:
    - **활성(즐겨찾기 됨)**: `text-ghost-ink dark:text-ghost-dark-ink fill-ghost-ink dark:fill-ghost-dark-ink` 순수 흑백 모노크롬 솔리드 필.
    - **비활성(미등록)**: `text-ghost-ink-stone dark:text-ghost-dark-ink-stone hover:text-ghost-ink dark:hover:text-ghost-dark-ink`.
    - **호버 및 탭 피드백**: 부드러운 스케일 애니메이션(`transition-transform active:scale-90 hover:scale-110`).
  - **이벤트 전파 방지**: 카드 클릭 링크 이동(`Link`)과 충돌하지 않도록 `e.preventDefault()`, `e.stopPropagation()` 필수 적용.
- **홈 화면 단일 그리드 내 즐겨찾기 우선 정렬 (Pin-to-Top)**:
  - 상단 별도 분리 섹션 및 중복 탭을 제거하고, 단일 카드 그리드에서 즐겨찾기 등록 카드가 **맨 앞(1순위)**으로 자동 재배치되고, 동일 그룹 내에서는 한국어 가나다순(2순위)으로 정렬.
  - 중복 카드 노출과 불필요한 탭 뎁스를 없애고 뷰포트 내 수직 스크롤과 시각적 인지 부하를 최소화.

---

## 3. UI 구현 시 금지 및 주의사항 (Do & Don't)

| 항목 | Do (권장) | Don't (금지) |
| :--- | :--- | :--- |
| **디자인 토큰** | `text-ghost-ink`, `border-ghost-hairline`, `text-ghost-lime` 등 정식 시맨틱 클래스 사용 | `text-[#112220]`, `border-[#e5e7eb]`, `bg-[#15171a]` 등 임의 대괄호 헥스코드 하드코딩 |
| **공통 컴포넌트** | `SubMetricCard`, `FormHeader`, `NumericInput`, `InfoCard` 필수 재사용 | 인라인 중복 div 태그 작성, 독자적 레이아웃 생성 |
| **서브 카드 계층** | 1행(아이콘+라벨/배지) ➔ 2행(메인 수치) ➔ 3행(보조 설명/독음) 엄격 준수 | 아이콘을 우측에 배치하거나 독음을 상단에 배치하는 행 역전 |
| **통화 표기** | `137,340,520원` (대한민국 표준 후치 `원`) | `₩137,340,520` (외국식 전치 통화 기호 표기) |
| **장식 요소** | 단정하고 직관적인 Lucide 라인 아이콘 | 본문 제목 및 인포 바 내 컬러 이모지 남용 |
