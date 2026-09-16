# [PRD] 모바일 우선 스마트 멀티 계산기 플랫폼 (Smart Calculator Hub)

> **버전**: v1.9.31  
> **최종 갱신일**: 2026-09-16  
> **제작 및 브랜딩**: © sosoFactory  
> **기본 원칙**: Ghost 디자인 시스템 원칙 준수, 전역 프리텐다드(Pretendard Variable) 단일 폰트 원칙, 모바일 퍼스트(Mobile-First), 일관된 UI/UX, 100% 오프라인 동작(PWA), WCAG 웹 접근성 준수, 미니멀 네비게이션(불필요한 라벨/뱃지 배제)

---

## 목차 (Table of Contents)

1. [프로젝트 개요](#1-프로젝트-개요)
2. [제품 아키텍처 및 네비게이션 구조](#2-제품-아키텍처-및-네비게이션-구조)
   - 2.1 좌측 네비게이션 시스템 (Left Sidebar & Drawer)
   - 2.2 공통 모바일 퍼스트 및 반응형 레이아웃 원칙
   - 2.3 Ghost 디자인 시스템 기반 공통 UI/UX 설계 원칙
   - 2.4 모듈형 컴포넌트 아키텍처 (디렉터리 구조)
   - 2.5 전역 다크 모드 지원 및 전환 인터랙션
   - 2.6 스마트 계산기 허브 메인 홈 화면 명세 (Home Dashboard)
   - 2.7 금융 시나리오 딥링크(Deep Link) 및 상태 공유 시스템
   - 2.8 전역 플로팅 공유 버튼 (Floating Share Button)
3. [계산기 모듈별 상세 기능 명세](#3-계산기-모듈별-상세-기능-명세)
   - 3.1 [금융/투자] 연복리 & 자산 성장 계산기 (`CompoundInterestApp` - 구현 완료)
   - 3.2 [생활/측정] 단위 변환기 (`UnitConverterApp` - 구현 완료)
   - 3.3 [통화/글로벌] 환율 계산기 (`ExchangeApp` - 구현 완료)
   - 3.4 [금융/투자] 대출 이자 및 상환방식 비교 계산기 (`LoanApp` - 구현 완료)
   - 3.5 [금융/급여] 연봉 실수령액 계산기 (`SalaryApp` - 구현 완료)
   - 3.6 [생활/건강] BMI & 비만도 계산기 (`BmiApp` - 구현 완료)
   - 3.7 [금융/투자] 목표 자산 역산 계산기 (`GoalApp` - 구현 완료)
   - 3.8 향후 확장 예정 모듈 (Roadmap)
4. [데이터 모델 (Data Models)](#4-데이터-모델-data-models)
   - 4.0 사이트 전역 설정 모델 (`src/config/site.ts`)
   - 4.1 글로벌 네비게이션 모델 (`src/types/navigation.ts`)
   - 4.2 연복리 계산 데이터 모델 (`src/types/calculator.ts`)
   - 4.3 단위 변환 데이터 모델 (`src/types/unit.ts`)
   - 4.4 환율 계산 데이터 모델 (`src/types/exchange.ts`)
   - 4.5 대출 이자 계산 데이터 모델 (`src/types/loan.ts`)
   - 4.6 연봉 및 급여 계산 데이터 모델 (`src/types/salary.ts`)
   - 4.7 BMI 및 신체 계측 데이터 모델 (`src/types/bmi.ts`)
   - 4.8 목표 자산 역산 데이터 모델 (`src/types/goal.ts`)
5. [기술 스택 및 아키텍처](#5-기술-스택-및-아키텍처)
6. [비기능적 요구사항 및 품질 검증 기준](#6-비기능적-요구사항-및-품질-검증-기준)
7. [검색엔진 최적화 (SEO) 전략 및 웹 분석 명세](#7-검색엔진-최적화-seo-전략-및-웹-분석-명세)
   - 7.1 메타데이터 및 소셜 공유 (Meta Tags & OpenGraph)
   - 7.2 동적 페이지 헤드 관리 (Dynamic Meta Updater)
   - 7.3 구조화된 데이터 (JSON-LD / Schema.org)
   - 7.4 크롤러 수집 파일 지원 (robots.txt, sitemap.xml)
   - 7.5 웹 로그 및 방문자 데이터 분석 (Vercel Web Analytics)
8. [PWA (Progressive Web App) 명세 및 설치 지원](#8-pwa-progressive-web-app-명세-및-설치-지원)
9. [품질 안정화 및 신뢰성 규격 (Quality & Reliability)](#9-품질-안정화-및-신뢰성-규격-quality--reliability)
10. [웹 표준 및 웹 접근성(A11y) 규격](#10-웹-표준-및-웹-접근성a11y-규격)
11. [공통 폼 및 인터랙션 컴포넌트 표준 규격](#11-공통-폼-및-인터랙션-컴포넌트-표준-규격)
12. [모바일 퍼스트 및 반응형 리플로우 전역 규격](#12-모바일-퍼스트-및-반응형-리플로우-전역-규격)
13. [금융 및 생활 상식 안내 카드 규격 (`InfoCard`)](#13-금융-및-생활-상식-안내-카드-규격-infocard)
14. [AI 에이전트 실행 프로토콜 및 작업 규칙](#14-ai-에이전트-실행-프로토콜-및-작업-규칙)

---

## 1. 프로젝트 개요

- **프로젝트명**: 스마트 멀티 계산기 허브 (Smart Calculator Hub)
- **목적**: 일상과 금융 생활에서 자주 필요한 다양한 계산 도구들을 한곳에 모아 모바일과 데스크톱 전 환경에서 빠르고 직관적으로 사용할 수 있도록 제공하는 모듈형 계산기 포털 웹 애플리케이션.
- **핵심 가치**:
  - **Ghost 디자인 철학 계승**: 절제된 모노크롬 베이스와 단 하나의 정밀한 액센트(Electric Lime) 전압을 사용하는 Ghost 디자인 시스템(`ghost.design.md`)을 전역 디자인 원칙으로 확립하여, 불필요한 시각적 잡음을 배제하고 본질적인 계산 데이터와 정보에 온전히 집중하는 명료한 사용자 경험 제공.
  - **전역 프리텐다드(Pretendard Variable) 단일 서체 표준**: 한글과 영문, 금융 수치 데이터의 가독성을 극대화하기 위해 플랫폼 전역의 기본이자 유일한 폰트로 Pretendard Variable을 채택. 타 서체의 혼용을 엄격히 금지하여 전 화면과 기기에서 무결한 시각적 일관성 유지.
  - **원스톱 계산 허브**: 연복리, 단위 변환, 환율 계산, 대출 이자 비교 등 필수 계산기들을 탭/메뉴 전환으로 손쉽게 이용.
  - **모바일 퍼스트(Mobile-First) UX**: 한 손 터치에 최적화된 네비게이션, 유동적 그리드 및 빠른 입력 패드.
  - **확장 가능한 모듈형 아키텍처**: 새로운 계산기(배당금, 목표자산 역산 등)를 언제든 독립적으로 추가/확장 가능한 구조.
  - **데이터 지속성 & 오프라인 지원**: 각 계산기별 최근 입력값을 브라우저 `LocalStorage`에 자동 유지하며, PWA 기반으로 인터넷 연결 없이도 100% 정상 작동.

---

## 2. 제품 아키텍처 및 네비게이션 구조

### 2.1 좌측 네비게이션 시스템 (Left Sidebar & Drawer)
- **메뉴 확장성 최적화**: 향후 계산기 도구가 늘어나더라도 세로 스크롤을 통해 유연하게 확장 가능한 목록 구조 제공.
- **모바일 뷰포트**:
  - 상단 좌측 햄버거 메뉴 버튼 터치 시 부드럽게 열리고 닫히는 **슬라이드 오버레이 드로어(Slide-over Drawer)** 지원.
  - 배경을 어둡게 처리(Dimmed Overlay)하여 현재 메뉴에 대한 집중도 향상.
  - 카테고리별(금융/투자, 생활/측정, 통화/글로벌) 그룹화 및 직관적인 아이콘 제공.
  - 드로어 외부 터치 또는 메뉴 항목 선택 시 자동으로 닫힘 처리.
- **데스크톱 뷰포트**:
  - 좌측 고정 사이드바 + 우측 메인 콘텐츠 영역의 2열 레이아웃.
  - 사이드바 접기/펼치기(Collapse/Expand) 토글을 지원하여 넓은 작업 공간 확보 가능.
- **전역 페이지 전환 인터랙션**:
  - 계산기 간 화면 전환 시 즉각적인 깜빡임 없이 부드러운 안착 페이드 효과를 적용하여 자연스러운 앱 경험 제공.
  - 브라우저 히스토리(뒤로가기/앞으로가기) 및 딥링크 지원.
- **헤더 및 푸터 정렬 및 상단 고정 (Fixed Header)**:
  - 좌측 사이드바 상단과 메인 화면 상단 헤더의 높이 기준선을 일치시켜 시각적 수평선 통일감 유지.
  - 상단 글로벌 헤더(`GlobalHeader`)는 `fixed top-0 left-0 right-0 lg:left-64 z-30` 포지션으로 전 페이지에서 최상단에 영구 고정되며, 메인 뷰포트 상단에 `pt-16` 여백을 확보하여 스크롤 시에도 페이지 타이틀과 메뉴/테마 토글이 안정적으로 고정됨.
  - 사이드바 하단 푸터에 공식 카피라이트 및 버전 정보 표기.
- **미니멀 네비게이션 및 타이틀 원칙 (라벨 전면 배제)**:
  - 시각적 잡음과 복잡도를 제거하고 Ghost 디자인의 절제미와 계산 도구 본질에 집중할 수 있도록 좌측 사이드바 메뉴 및 상단 글로벌 헤더 타이틀 영역의 모든 상태 뱃지(`NEW`, `인기`, `추천` 등)를 전면 배제.
  - 메뉴 텍스트와 타이틀을 군더더기 없이 깔끔하게 표시하여 모바일 좁은 화면에서도 텍스트 잘림이나 개행 없이 명료한 가독성 확보.

### 2.2 공통 모바일 퍼스트 및 반응형 레이아웃 원칙
모든 계산기 모듈과 글로벌 네비게이션은 다음의 원칙을 공통으로 적용합니다:
- **풀 와이드 헤더와 여유로운 본문 폭 확보**:
  - 상단 헤더는 뷰포트 좌우 끝까지 100% 확장되어 브랜드 타이틀과 테마 토글 버튼이 여유롭게 배치되도록 구성.
  - 메인 본문 콘텐츠는 2열 레이아웃(좌측 입력 폼, 우측 결과 및 차트)에서 카드와 차트가 구겨지지 않도록 충분한 최대 가용 폭을 확보.
- **단일 열(Single Column) 모바일 인터랙션 완결**:
  - 좁은 모바일 화면에서 가로 스크롤 없이 엄지손가락 터치 반경 내에서 모든 입력과 결과 조회가 완결되도록 단일 열 흐름 최적화.
- **대형 인터랙티브 듀얼 카드(Dual Interactive Card) 구조**:
  - 단위 변환기와 환율 계산기는 직관적인 입력(From) 및 결과(To) 듀얼 카드 구조를 표준화:
    - **출발(From) 입력 카드**: 변환/환전할 수치 입력 필드와 단위/통화 선택 드롭다운 배치.
    - **도착(To) 결과 카드**: 계산된 변환 결과를 시각적으로 강조하여 표시하고, 원클릭 클립보드 복사 버튼과 도착 단위/통화 선택 드롭다운 배치.
    - **중앙 맞바꾸기(Swap) 버튼**: 출발 단위와 도착 단위를 한 번의 터치로 즉시 맞바꾸는 인터랙션 지원.
- **원클릭 퀵 프리셋(Quick Presets)**:
  - 사용자가 자주 찾는 대표적인 생활, 여행, 투자 수치를 탭 한 번으로 즉시 자동 입력할 수 있는 빠른 프리셋 버튼 제공.
- **모바일 가로 넘침 및 텍스트 깨짐 방지**:
  - 좁은 모바일 화면에서 우측 컨트롤(복사 버튼, 드롭다운 셀렉트)로 인해 좌측 라벨이 여러 줄로 찌그러지거나 잘리는 현상을 방지하도록 가변 폭 및 컴팩트 아이콘 버튼 적용.
  - 긴 타이틀이나 기준 정보는 필요 시 상하 2행으로 자연스럽게 분리하여 가독성 유지.
- **결과 복사 피드백**:
  - 계산된 핵심 결과를 탭 한 번으로 클립보드에 복사하고, 복사 완료 상태를 즉시 시각적으로 피드백.

### 2.3 Ghost 디자인 시스템 기반 공통 UI/UX 설계 원칙
모든 계산기 모듈과 화면 인터페이스는 Ghost 디자인 시스템(`ghost.design.md`)의 핵심 철학과 다음의 UI/UX 설계 원칙을 전역 일관되게 적용합니다:
- **Ghost 디자인 철학 (Design Philosophy)**:
  - **단일 진실 공급원 (SSOT)**: 제품의 모든 컴포넌트, 시각적 계층, 레이아웃 규격은 프로젝트 루트의 `ghost.design.md` 사양을 기준으로 설계 및 확장.
  - **절제와 집중 (Restraint & Focus)**: 전면적인 다색상 배치를 엄격히 통제하고, 차분한 모노크롬 베이스(Near-black & Warm White)를 바탕으로 아이브로우 라벨과 핵심 인터랙션에만 절제된 일렉트릭 라임(Electric Lime) 전압을 부여하여 시각적 피로도를 낮추고 정보 전달력을 극대화.
  - **에디토리얼 밴드 리듬 (Editorial Band Rhythm)**: 어수선한 구분선이나 인위적인 그라데이션 대신, 명확한 수평 여백과 카드 분할을 통해 매거진 스프레드를 넘겨보듯 자연스러운 시선 흐름 형성.
- **명확한 정보 계층 구조**: 입력 폼과 결과 요약, 시각화 차트, 상세 흐름표의 순서로 자연스러운 시선 흐름을 유도.
- **한 손 조작성 최적화**: 모바일 환경에서 중요한 조작 버튼과 프리셋 칩을 엄지손가락 터치 영역 내에 균형 배치.
- **전역 프리텐다드(Pretendard Variable) 단일 서체 강제 원칙**:
  - **기본 폰트**: 플랫폼의 모든 한글, 영문, 숫자, 기호, 뱃지, 입력창, 차트, 안내 문구 등 UI 전반에 **Pretendard Variable(가변 웹폰트)**을 기본이자 유일한 표준 서체로 적용.
  - **타 폰트 사용 절대 금지**: Serif, Inter, Roboto, Noto Sans 등 일체의 타 폰트 혼용을 전면 금지하며, Tailwind CSS 및 글로벌 스타일시트(`src/index.css`)의 최우선 서체로 강제 고정.
  - **고정폭 숫자(`tabular-nums`) 결합**: 금액, 환율, 변환 수치 등 모든 금융/측정 데이터에 Pretendard의 고정폭 숫자 속성을 적용하여 수치 변경 시 자릿수 흔들림 없는 완벽한 가독성 보장.
- **숫자 판독성 강화**: 금액, 환율, 변환 수치 등 모든 금융/측정 데이터에 고정폭 숫자(Tabular Numbers)를 적용하여 수치 변동 시 자리 흔들림 방지.
- **컬러 이모지 전면 배제**: UI 레이아웃 및 팁 안내 문구에 알록달록한 컬러 이모지를 넣지 않고, 단정한 텍스트 및 표준 라인 아이콘(Lucide React)으로 전문적이고 신뢰감 있는 톤앤매너 유지.
- **전역 테이블 컴포넌트 표준화 (`ui/table.tsx`)**:
  - 모든 계산기의 상세 표(복리 연도별 흐름표, 대출 상환 스케줄표, 연봉 공제 명세표 등)는 `src/components/ui/table.tsx` 공통 컴포넌트(Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell)를 단일 진실 공급원(SSOT)으로 사용.
  - 헤더(`bg-slate-50/80 dark:bg-slate-900/60`, `h-10 px-3.5`), 셀 패딩(`py-2.5 px-3.5`), 구분선(`border-[#e5e7eb] dark:border-slate-800`), 호버 음영, 고정폭 숫자(`tabular-nums`)를 전역 단일 규격으로 강제 적용.
- **입력 유효성 실시간 피드백**: 잘못된 수치 입력이나 음수/범위 초과 시 사용자 입력을 즉시 보정하거나 직관적으로 안내.

### 2.4 모듈형 컴포넌트 아키텍처
```text
src/
├── calculators/
│   ├── bmi-calculator/              # BMI & 비만도 측정 모듈
│   │   ├── components/              # BmiForm, BmiSummaryCards, BmiGaugeCard, BmiInfoCard
│   │   └── BmiApp.tsx               # BMI 계산기 메인 뷰
│   ├── goal-calculator/             # 목표 자산 역산 모듈
│   │   ├── components/              # GoalForm, GoalSummaryCards, GoalChartCard, GoalRateComparisonCard, GoalInfoCard
│   │   └── GoalApp.tsx              # 목표 자산 역산 메인 뷰
│   ├── loan-calculator/             # 대출이자 & 상환방식 비교 모듈
│   │   ├── components/              # LoanForm, LoanComparisonCard, LoanScheduleTable 등
│   │   └── LoanApp.tsx              # 대출 계산기 메인 뷰
│   └── salary-calculator/           # 연봉 실수령액 계산 모듈
│       ├── components/              # SalaryForm, SalarySummaryCards, DeductionBreakdownTable 등
│       └── SalaryApp.tsx            # 연봉 계산기 메인 뷰
├── components/
│   ├── common/                      # 공통 전역 유틸리티 컴포넌트
│   │   └── FloatingShareButton.tsx  # 전 페이지 일관 우하단 플로팅 공유 버튼(FAB)
│   ├── ui/                          # shadcn/ui 기반 표준 토큰 컴포넌트
│   │   ├── badge.tsx                # Badge (메타 정보 및 상태 뱃지)
│   │   ├── button.tsx               # Button (통일된 호버 및 상태 인터랙션)
│   │   ├── input.tsx                # Input (대형 인풋 및 유효성 대응)
│   │   ├── selectable-chip.tsx      # SelectableChip (프리셋 선택 칩)
│   │   ├── segmented-control.tsx    # SegmentedControl (세그먼트 탭)
│   │   ├── select.tsx               # Radix Select 기반 드롭다운
│   │   ├── slider.tsx               # Radix Slider (정밀 슬라이더 제어)
│   │   ├── table.tsx                # Table (전역 표준 데이터 테이블 SSOT)
│   │   ├── tabs.tsx                 # Radix Tabs 기반 표준 WAI-ARIA 탭
│   │   └── tooltip.tsx              # 툴팁 안내
│   ├── CalculatorForm.tsx           # 연복리 입력 폼 (표준 풀 와이드 인풋, 프리셋 4개화)
│   ├── SummaryCards.tsx             # 연복리 요약 카드 (메인 결과 + 서브 지표)
│   ├── DualConverterCard.tsx        # 단위 변환기 From/To 듀얼 카드
│   ├── DualExchangeCard.tsx         # 환율 계산기 From/To 듀얼 카드
│   ├── GlobalHeader.tsx             # 상단 전역 헤더
│   ├── LeftSidebar.tsx              # 좌측 네비게이션 사이드바
│   └── SidebarDrawer.tsx            # 모바일 슬라이드 드로어
├── config/
│   └── site.ts                      # 사이트 전역 메타데이터 및 브랜드 명칭 SSOT
├── context/
│   └── ThemeContext.tsx             # 테마(light/dark/system) 관리 Context
├── types/
│   ├── bmi.ts                       # BMI 및 신체 계측 타입
│   ├── calculator.ts                # 연복리 계산 타입
│   ├── exchange.ts                  # 환율 계산 타입
│   ├── goal.ts                      # 목표 자산 역산 계산 타입
│   ├── loan.ts                      # 대출 이자 계산 타입
│   ├── navigation.ts                # 네비게이션 및 메뉴 타입
│   ├── salary.ts                    # 연봉 및 급여 계산 타입
│   └── unit.ts                      # 단위 변환 타입
└── utils/
    ├── bmiCalculator.ts             # BMI 및 KSSO 기준 판정 로직
    ├── calculator.ts                # 복리 연산 비즈니스 로직
    ├── deepLink.ts                  # URL 쿼리 파라미터 딥링크 인코딩/디코딩 로직
    ├── exchangeCalculator.ts        # 환율 및 우대율 연산 로직
    ├── formatters.ts                # 통화, 한글 단위, 백분율 포매터
    ├── goalCalculator.ts            # 목표 자산 역산(PMT 공식) 비즈니스 로직
    ├── loanCalculator.ts            # 대출 3대 상환방식 및 중도상환 수학 로직
    ├── salaryCalculator.ts          # 4대보험 및 근로소득 간이세액표 연산 로직
    └── unitConverter.ts             # 단위 환산 계수 및 비선형 온도 변환 로직
```

### 2.5 전역 다크 모드 지원 및 전환 인터랙션
- **테마 모드 지원**:
  - `light` (라이트 모드), `dark` (다크 모드), `system` (OS 시스템 설정 자동 동기화) 3가지 모드 지원.
  - 최초 진입 시 사용자의 로컬 스토리지 설정을 우선 적용하며, 저장된 값이 없을 경우 OS 환경을 감지하여 자동 적용.
  - 테마 변경 시 로컬 스토리지에 즉시 저장되어 재방문 시에도 설정이 유지됨.
  - 시스템 모드 사용 중 사용자가 OS 테마를 전환하면 즉시 화면에 실시간 동기화.
- **테마 토글 인터페이스**:
  - 글로벌 헤더 우측 상단 1곳에 일원화 배치하여 모바일/데스크톱 전 환경에서 항시 접근 가능.
  - 라이트/다크 전환 시 경쾌한 아이콘 회전 트랜지션 및 툴팁 안내 제공.
  - **부드러운 전역 테마 전환 스무딩 (Theme Transition Smoothing & View Transitions API)**:
    - 테마 전환 조작 시 화면이 뚝뚝 끊기거나 눈부심 깜빡임이 발생하지 않도록 **모던 웹 표준 `View Transitions API` (`document.startViewTransition`)** 를 적용하여 화면 전체를 GPU 가속 기반으로 부드럽게 크로스페이드(300ms) 전환.
    - View Transitions API를 미지원하는 환경(구형 브라우저 등)을 위한 견고한 폴백(Fallback)으로 `html`, `body`, 주요 레이아웃(`header`, `aside`, `nav`, `main`, `footer`), 카드 박스, 입력 폼 패널, 테두리 전반에 `transition: background-color 300ms ease, border-color 300ms ease, color 300ms ease` 전역 스무딩을 적용하여 0.3초 동안 유기적이고 일관된 페이드 전환 경험 제공.
    - 접근성 보장: 사용자가 OS에서 모션 감소(`prefers-reduced-motion: reduce`)를 설정한 경우 트랜지션을 즉시 비활성화하여 웹 접근성 표준 준수.
  - 야간 및 저조도 환경에서 눈부심을 방지하고 최적의 명암비(WCAG AA 기준)를 확보하여 장시간 사용 편의성 제공.
  - 차트(Recharts) 시각화 또한 다크 모드 전환 시 축 라벨과 그리드선, 툴팁이 가독성 높게 자동 전환.

### 2.6 스마트 계산기 허브 메인 홈 화면 명세 (Home Dashboard)
- **도입 목적**:
  - 기존 루트(`/`) 접속 시 특정 단일 계산기(`/compound`)로 바로 강제 리다이렉트되던 흐름을 탈피하고, 사용자가 플랫폼의 전체 도구(5대 계산기 및 신규 로드맵)를 조망하고 필요한 도구를 한곳에서 즉시 탐색·진입할 수 있는 **메인 허브 대시보드(Home Screen)** 제공.
  - 모바일 홈 화면에 PWA로 설치한 사용자가 앱을 켰을 때 가장 먼저 마주하는 공식 첫 화면으로서의 완성도와 심미성 확보.
- **라우팅 및 네비게이션 연동 규격**:
  - **기본 경로**: `/` (루트 접속 시 `HomeApp` 렌더링, 기존의 `/compound` 강제 리다이렉트 해제)
  - **사이드바 네비게이션 연동**:
    - 사이드바 최상단에 '대시보드' 섹션을 신설하고 `홈 (대시보드)` 메뉴 항목(아이콘: `LayoutDashboard`, 경로: `/`) 추가.
    - 사이드바 상단 로고 및 브랜드명 클릭 시 루트(`/`)로 즉시 이동하는 인터랙션 부여.
  - **글로벌 헤더 연동**:
    - 루트(`/`) 경로 진입 시 헤더 타이틀에 `스마트 계산기 허브 | 대시보드` 표기 및 깔끔한 환영 배지 표시.
- **주요 구성 및 UX 규격 (모바일 스크롤 최소화 및 헤더 고정 원칙)**:
  1. **글로벌 헤더 일원화 타이틀 원칙 (본문 중복 타이틀 완전 배제)**:
     - 기존 계산기 모듈들과 완벽한 일관성을 유지하기 위해, 본문 내부의 `<h1>` 페이지 타이틀을 전면 배제.
     - 화면 최상단에 고정된 글로벌 헤더(`GlobalHeader`)에 `계산기 모아보기`가 상시 고정 노출되어, 사용자가 스크롤을 내려도 타이틀이 위로 밀려 올라가지 않고 안정적으로 유지됨.
     - 본문 최상단에는 카테고리 퀵 탭 칩(`전체`, `금융`, `생활`, `통화`)만 가볍게 배치하여, 모바일 첫 화면 뷰포트에서 계산기 카드가 화면 맨 위부터 즉시 노출되도록 최적화.
  2. **모바일 2열 콤팩트 카드 그리드 (Mobile 2-Column Grid)**:
     - **모바일 화면(뷰포트)에서 한눈에 전체 계산기를 조망하고 스크롤을 획기적으로 줄이기 위해 모바일 기본 2열 그리드(`grid-cols-2 sm:grid-cols-2 lg:grid-cols-3`) 채택**.
     - 불필요하게 긴 텍스트 문단과 해시태그 칩을 배제하고, [아이콘 + 계산기 명칭 + 간결한 설명 + 시작 링크] 중심의 미니멀 콤팩트 카드 레이아웃 적용 (태그 칩 완전 삭제로 세로 높이 축소 및 시각적 잡음 배제).
     - 5대 활성 계산기(연복리, 대출, 연봉, 단위, 환율)가 모바일 1~2 스와이프 내에 모두 손쉽게 노출되어 터치 진입성 극대화.
  3. **하단 모바일 접속 QR 코드 및 URL 복사 카드 (Mobile Access QR Card)**:
     - **도입 배경**: 데스크톱 사용자의 스마트폰 카메라를 통한 간편 접속 및 모바일 오프라인 대면 공유(지인/가족에게 내 폰 화면의 QR을 찍게 하는 시나리오)를 지원.
     - **UI 구성**:
       - 좌측/상단: 100% 오프라인 렌더링을 지원하는 사이트 공식 URL(`https://soso-calculator.vercel.app`) 고해상도 QR 코드 (88x88px, 흰색 라운드 배경 및 얇은 테두리로 다크모드에서도 완벽한 스캔 대비 보장).
       - 우측/하단 텍스트:
         - 타이틀: `모바일로 바로 열기`
         - 서브 설명: `스마트폰 카메라로 QR 코드를 스캔하여 바로 접속하거나, 홈 화면에 추가하여 앱처럼 사용해보세요.`
       - **독립 URL 복사 버튼 (`[🔗 URL 복사]`)**:
         - QR 코드 자체 터치에 의존하지 않고, 명시적인 `URL 복사` 액션 버튼 배치.
         - 클릭 시 클립보드 복사 + 2초간 `Check` 피드백 + Toast 알림(*"사이트 주소가 복사되었습니다"*).
     - **디자인 톤앤매너**:
       - Ghost 디자인 시스템: `bg-white dark:bg-[#15171a] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5`.
       - 모바일(`xs`~`sm`): 세로 또는 유연한 반응형 flex 배치로 레이아웃 깨짐 방지.
  4. **반응형 규격**:
     - 모바일 (sm 미만): 2열 대칭 콤팩트 그리드 (`grid-cols-2 gap-2.5`).
     - 태블릿 (sm ~ lg): 2열 그리드 (`grid-cols-2 gap-3.5`).
     - 데스크톱 (lg 이상): 3열 균형 그리드 (`grid-cols-3 gap-4`).

### 2.7 금융 시나리오 딥링크(Deep Link) 및 상태 공유 시스템
- **도입 목적 및 적용 원칙**:
  - 금융 의사결정(대출 상환, 복리 자산 형성, 연봉 협상) 시 복잡한 계산 조건과 결과를 가족, 지인, 재테크 커뮤니티, 공인중개사, 대출 상담사 등과 빠르고 정확하게 공유할 수 있도록 **URL 쿼리 파라미터 기반 딥링크(Deep Link)** 시스템 구축.
  - **선택적 적용 원칙**:
    - **적용 대상 (4대 금융 계산기)**:
      - `대출이자 계산기 (/loan)`: 주담대·전세대출 상환 조건 링크 공유 및 상담.
      - `연복리 계산기 (/compound)`: 은퇴·자산 포트폴리오 시나리오 공유.
      - `연봉 실수령액 계산기 (/salary)`: 세후 월 실수령액 및 공제 내역 공유.
      - `목표 자산 역산 계산기 (/goal)`: 목표 달성 기간, 목표액, 예상 수익률, 필요 월 적립액 조건 링크 공유.
    - **원천 배제 대상 (개인 프라이버시 보호 및 1회성 유틸리티)**:
      - `BMI 계산기 (/bmi)`: 민감한 개인 신체 정보(키, 몸무게)이므로 URL 파라미터화 원천 배제 (개인 기기 LocalStorage에만 안전 보관).
      - `단위 변환기 (/unit)`: 1초 만에 확인하고 종료하는 1회성 조회 도구로 불필요.
      - `환율 계산기 (/exchange)`: 실시간 변동 데이터로 과거 링크 열람 시 혼란 방지를 위해 제외.
- **주요 규격 및 상호작용 (UX Flow)**:
  1. **초기 로드 및 우선순위 (URL Overwrite LocalStorage)**:
     - 사용자가 URL에 쿼리 스트링을 포함하여 접속한 경우(`?amount=300000000&rate=3.8...`), 브라우저 LocalStorage 값보다 **URL 파라미터 값이 최우선 적용**되어 폼과 결과가 즉시 렌더링됨.
     - 쿼리 파라미터 없이 기본 경로로 접속한 경우 기존처럼 LocalStorage 저장값(없으면 기본값) 사용.
  2. **브라우저 주소창 실시간 동기화 (`replaceState`)**:
     - 사용자가 계산 조건을 변경할 때마다 브라우저 히스토리 스택을 오염시키지 않는 `window.history.replaceState`를 통해 주소창 URL 쿼리 파라미터가 조용히 실시간 갱신됨. (기본값과 동일할 경우 깨끗한 URL 경로 유지)
     - 사용자는 복잡한 공유 UI 없이 브라우저 주소창 복사만으로 현재 계산 조건을 타인에게 손쉽게 전달할 수 있음.
  3. **가독성 높은 쿼리 파라미터 스키마**:
     - `대출 (/loan)`: `amount`, `rate`, `years`, `grace`, `method`, `early`, `earlyMonth`, `earlyAmount`, `earlyFee`
     - `복리 (/compound)`: `principal`, `contribution`, `contribFreq`, `years`, `rate`, `compFreq`, `tax`, `taxRate`
     - `연봉 (/salary)`: `gross`, `type`, `severance`, `nonTax`, `family`, `children`
     - `목표자산 (/goal)`: `target`, `years`, `rate`, `initial`, `tax`

### 2.8 전역 플로팅 공유 버튼 (Floating Share Button)
- **도입 목적**:
  - 모바일 사용자를 최우선으로 고려하여, 상단 고정 헤더의 공간 부족 문제를 해소하고 **모든 페이지에서 완벽하게 동일한 위치**에서 1터치로 현재 계산기 및 계산 결과를 공유할 수 있는 전역 플로팅 액션 버튼(FAB) 구축.
- **핵심 UI/UX 명세**:
  1. **배치 위치 (Placement & Thumb Zone)**:
     - 모바일 화면 우측 하단(`fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-40`)에 항상 떠 있는 플로팅 버튼으로 배치.
     - 한 손 조작 시 모바일 엄지손가락 조작 반경(Thumb Zone)에 위치하여 접근성 극대화.
     - 메인 홈 대시보드 및 모든 계산기 페이지에서 일관되게 동일한 위치에 상시 노출.
  2. **디자인 및 시각 피드백 (Ghost Design System)**:
     - 크기: 지름 48px 터치 친화적 원형 버튼 (`h-12 w-12 rounded-full`).
     - 서피스: 다크 흑연(`bg-[#15171a] dark:bg-slate-800`), 테두리(`border border-slate-700/60 dark:border-slate-700`), 아이콘(`Share2`, `text-white hover:text-[#d1ff19]`), 그림자(`shadow-lg shadow-black/15 dark:shadow-black/40`).
     - 클릭 시 복사 완료 애니메이션 피드백(`Check` 아이콘으로 2초간 일시 전환).
     - 데스크톱 호버 시 "현재 페이지 링크 공유" 툴팁 노출.
  3. **공유 및 클립보드 복사 로직**:
     - **Web Share API (`navigator.share`) 지원 환경 (모바일 및 데스크톱 브라우저)**:
       - 브라우저 및 OS 순정 공유 창(모바일: 카카오톡/문자/에어드랍 등, 데스크톱: 링크 복사 및 시스템 공유 앱) 호출.
       - 제목(`title`), 페이지 설명(`text`), 현재 주소창 URL(`url`)을 함께 전달.
     - **Web Share API 미지원 환경**:
       - 현재 URL 클립보드 자동 복사 (`navigator.clipboard.writeText`).
       - shadcn/ui Toast 배너로 *"공유 링크가 복사되었습니다"* 안내 팝업.

---

## 3. 계산기 모듈별 상세 기능 명세

### 3.1 [금융/투자] 연복리 & 자산 성장 계산기 (`CompoundInterestApp` - 구현 완료)
- **기능 요약**: 초기 원금, 정기 적립금, 복리 주기, 한국형 세금 체계를 반영한 자산 증식 시뮬레이터.
- **주요 기능**:
  - 월초/연초 정기 적립식 복리 산출.
  - 복리 주기 (월복리, 연복리, 분기복리, 일복리 - shadcn `Select` 적용).
  - 과세 체계 (일반과세 15.4%, 비과세 0%, ISA 9.9%, 직접입력 - shadcn `Select` 적용).
  - 하락장/손실 및 고수익 시뮬레이션 (-5% ~ +50% 및 손실 시 세금 0원 면제).
  - 시나리오 A / B 듀얼 오버레이 비교 차트 및 격차 분석.
  - Recharts 기반 인터랙티브 시각화 대시보드 & CSV 내보내기:
    - 단일 시나리오 모드: 직관적인 누적 영역형 차트(`AreaChart`)로 고정 (불필요한 선형 토글 제거로 UX 단순화).
    - 비교 모드: 두 시나리오 간 추이를 직관적으로 대조하는 멀티 라인 차트(`LineChart`) 유지.
  - **연도별 상세 자산 흐름표 및 모바일 헤더 최적화 (`DataTable.tsx`)**:
    - 연차별 납입원금, 당해연도 세전이자, 누적 순이자, 세후 총평가액, 수익률을 아코디언 테이블로 제공.
    - **모바일-퍼스트 반응형 CSV 다운로드 버튼**:
      - 모바일 뷰포트(`< sm`): 가로 폭 협소로 인한 버튼 잘림 현상을 원천 방지하기 위해 텍스트를 숨기고 컴팩트한 다운로드 아이콘(`h-8 w-8`) 및 스크린리더/툴팁(`aria-label="CSV 다운로드"`) 제공.
      - 태블릿 및 데스크톱(`>= sm`): 아이콘과 `CSV 다운로드` 텍스트 병기.
      - 아코디언 헤더의 패딩(`px-4 sm:px-5 py-3.5 sm:py-4`)과 타이틀-액션 영역 간 최소 간격(`gap-2`)을 확보하여 모바일 전 기종에서 잘림 없는 무결점 레이아웃 보장.
  - **입력 폼 사용성 및 필드 표준화 (`CalculatorForm.tsx`)**:
    - 4개 입력 항목(초기 원금, 정기 적립금, 목표 투자 기간, 연 예상 수익률) 모두 동일한 풀 와이드 입력 필드 및 우측 단위 심볼(`원`, `년`, `%`) 적용.
    - 목표 투자 기간: 직접 입력 필드(1~40년 유효범위, 백스페이스 빈 값 허용) + 정밀 슬라이더 + 4대 균등 프리셋 버튼(`5년`, `10년`, `20년`, `30년`).
    - 연 예상 수익률: 직접 입력 필드(-5%~50% 유효범위, 백스페이스 빈 값 허용) + 정밀 슬라이더(-5%~50%) + 순수 수치 프리셋 4개 버튼(`-3%`, `3.5%`, `8%`, `15%`).
    - `-3%` 버튼을 포함한 모든 프리셋 버튼에 차별 없는 동일한 선택 활성화 인터랙션 적용 (특정 프리셋의 개별 스타일 분기 배제).
  - **결과 요약 카드 구조 (`SummaryCards.tsx`)**:
    - 최종 수령액 메인 카드: 세후 최종 수령액 강조, 원금 대비 수익 배수 및 한글 단위 금액(예: `1억 5,000만 원`) 병기.
    - 3단 서브 지표 카드(`총 투자원금`, `세후 순이자`, `이자 소득세`):
      - 주요 3대 핵심 지표를 분리하여 표시.
      - 단일 시나리오 모드에서는 3열 그리드로 배치하고, A/B 비교 모드에서는 좌우 비교 공간의 가독성을 위해 1열 세로 레이아웃으로 최적화.
  - **투자 상식 및 유의사항 안내 (`CompoundInfoCard.tsx`)**:
    - 72의 법칙, 복리의 마법, ISA 절세 계좌 팁, 금융소득종합과세 기준(연 2,000만원) 등 핵심 요약 제공 (컬러 이모지 배제).

### 3.2 [생활/측정] 단위 변환기 (`UnitConverterApp` - 구현 완료)
- **기능 요약**: 일상 생활, 부동산 거래, 직구 및 해외 규격에서 자주 쓰이는 단위를 실시간으로 상호 변환하고, 모든 관련 단위 결과를 한눈에 확인할 수 있는 올인원 변환기.
- **주요 기능 명세**:
  - **카테고리별 1순위 대표 생활 프리셋 & 기본 도착 단위 자동 설정**:
    - **넓이(면적)**: 출발 `84㎡` ➔ 도착 `평` (국민평형 84㎡는 몇 평일까?)
    - **길이**: 출발 `1in (인치)` ➔ 도착 `cm` (1인치는 몇 cm일까?)
    - **무게**: 출발 `1돈 (순금)` ➔ 도착 `g` (금 1돈은 몇 g일까?)
    - **부피**: 출발 `1gal (갤런)` ➔ 도착 `L` (1갤런은 몇 리터일까?)
    - **온도**: 출발 `36.5℃ (체온)` ➔ 도착 `℉` (체온 36.5도는 화씨 몇 도일까?)
  - 소수점 정밀도 선택기 (0, 2, 4, 6자리) 및 전체 관련 단위 일괄 실시간 변환표 제공.
- **지원 카테고리 및 상세 단위**:
  1. **넓이/면적 (부동산 특화)**:
     - **평(坪) ↔ 제곱미터(㎡)**: 아파트 공급/전용면적 원클릭 변환 (1평 = 3.305785㎡, 1㎡ ≈ 0.3025평)
     - 제곱미터(㎡), 평(坪), 제곱센티미터(㎠), 제곱킬로미터(㎢), 헥타르(ha), 에이커(ac), 제곱피트(ft²), 제곱야드(yd²)
     - *한국형 추천 프리셋*: 84㎡(국민평형 25.4평), 59㎡(소형 17.8평), 114㎡(대형 34.5평), 10평, 20평, 34평
  2. **길이**:
     - 센티미터(cm), 미터(m), 킬로미터(km), 인치(in), 피트(ft), 야드(yd), 마일(mi), 밀리미터(mm), 자/척(尺, 약 30.3cm)
     - *한국형 추천 프리셋*: 1인치(2.54cm), 1피트(30.48cm), 1마일(1.61km), 100m, 키 175cm
  3. **무게/질량**:
     - 그램(g), 킬로그램(kg), 톤(t), 파운드(lb), 온스(oz), 돈(3.75g, 금/귀금속 특화), 근(600g, 고기/채소 특화)
     - *한국형 추천 프리셋*: 순금 1돈(3.75g), 순금 10돈(1냥), 고기 1근(600g), 1파운드(453.6g)
  4. **부피/용량**:
     - 밀리리터(mL), 리터(L), 세제곱미터(㎥), 갤런(gal, US 액량 3.785L), 배럴(bbl, 원유 158.98L), 플루이드 온스(fl oz)
     - *한국형 추천 프리셋*: 종이컵 180mL, 생수병 500mL, 1리터, 1갤런
  5. **온도**:
     - 섭씨(℃), 화씨(℉), 켈빈(K)
     - 비선형/오프셋 변환 공식 적용: (℉ = ℃ 	imes 1.8 + 32), (K = ℃ + 273.15)
     - *한국형 추천 프리셋*: 체온 36.5℃, 실온 20℃, 물 끓는점 100℃, 화씨 100℉

### 3.3 [통화/글로벌] 환율 계산기 (`ExchangeApp` - 구현 완료)
- **기능 요약**: 글로벌 주요 6대 통화 간 금액을 기준 환율 및 은행 환전 수수료/우대율(Spread Discount)을 반영하여 즉시 상호 환산하는 계산기.
- **오프라인 100% 동작 & 기준 환율 구조 (PWA 원칙)**:
  - 오프라인 무인터넷 환경에서도 100% 독립 동작하도록 최신 고시 매매기준율(USD, JPY, EUR, CNY, GBP 등)을 기본 내장.
  - 네트워크 연결 시 최신 환율 비동기 갱신 및 5초 타임아웃(`AbortSignal.timeout(5000)`) 네트워크 안전망 적용.
- **지원 통화 (6대 핵심 통화)**:
  1. `KRW`: 대한민국 원 (기본 기준 통화)
  2. `USD`: 미국 달러 (세계 기축 통화)
  3. `JPY`: 일본 엔 (100엔당 표기 및 환산 자동 계산)
  4. `EUR`: 유럽연합 유로
  5. `CNY`: 중국 위안
  6. `GBP`: 영국 파운드
- **도구 고유 기능 명세**:
  1. **은행 환전 수수료 및 우대율(스프레드) 시뮬레이터**:
     - 거래 방식 선택: 매매기준율, 현찰 살 때, 현찰 팔 때, 송금 보낼 때, 송금 받을 때 (shadcn `Tabs` 기반)
     - 환전 우대율 프리셋: `90% 우대`, `80% 우대`, `50% 우대`, `0% 우대`
     - 절약된 환전 수수료(우대 혜택 금액)를 직관적으로 비교 표시.
  2. **자주 찾는 여행/직구 퀵 프리셋 칩**: `USD $100`, `USD $200`, `JPY 10,000엔`, `EUR 100유로`, `KRW 100만원`.
  3. **전체 통화 일괄 실시간 환산 그리드**: 입력 즉시 나머지 5개 통화 환산액 실시간 노출.
  4. **환율 기준일 표시 및 자동 최신화**:
     - 고시 기준일(예: `기준일: YYYY.MM.DD HH:mm`) 표시.
     - **우상단 기준 환율 안내 스마트 표기 규칙 (국내 금융 관행 반영)**:
       - 외화 ➔ 원화 또는 외화 상호 간: `1 {From} = {환율} {To}`.
       - 원화(KRW) ➔ 외화인 경우: 1원당 외화 환산 시 소수점 절사로 '0달러'나 '0엔'이 노출되는 결함을 방지하기 위해, 외화 1단위(엔화는 100엔)당 원화 가치로 역산 표기 (`1 USD = 1,350.00 KRW`, `100 JPY = 900 KRW` 등).
  5. **환전 상식 및 유의사항 면책 고지 안내**: 공항 vs 모바일 앱 환전 팁 및 면책 안내 (`ExchangeInfoCard.tsx`).

### 3.4 [금융/투자] 대출 이자 및 상환방식 비교 계산기 (`LoanApp` - 구현 완료)
- **기능 요약**: 대한민국 금융 소비자들이 주택담보대출, 전세대출, 신용대출 이용 시 가장 크게 고민하는 **3대 상환방식(원리금균등, 원금균등, 만기일시)** 간의 총 이자비용 격차와 월별 현금흐름 부담을 한눈에 명확하게 비교하고 시뮬레이션할 수 있도록 지원.
- **주요 기능 명세**:
  1. **3대 상환방식 동시 시뮬레이션**:
     - 원리금균등분할상환: 매월 동일한 상환액(원금+이자) 납부, 마지막 달 단수 차액 0원 정밀 보정.
     - 원금균등분할상환: 매월 동일한 원금 분할 상환 + 대출 잔액에 따른 월이자 납입 (점진적 상환액 감소).
     - 만기일시상환: 대출 기간 동안 매월 이자만 납부하고 만기일에 대출원금 전액 일괄 상환.
  2. **거치 기간 (Grace Period) 지원**: 0개월 ~ 대출 기간 미만 설정 시 거치 기간 동안 이자만 납입 처리.
  3. **중도상환 시뮬레이터 (선택 토글)**:
     - 실행 N개월 후 조기상환 원금 및 수수료율(기본 1.2%) 입력 지원.
     - 3년(36개월) 슬라이딩 감면 공식 적용: $\text{수수료} = \text{상환금} \times \frac{\text{수수료율}}{100} \times \frac{\max(0, 36-m)}{36}$ (3년 경과 시 0원 전액 면제).
     - 중도상환 이후 대출 잔액 즉시 차감 및 잔여 기간 이자 절약액, 순 혜택 자동 계산.
  4. **시각화 대시보드 및 스케줄표**:
     - Recharts 기반 잔액 감소 곡선 vs 누적 납입(원금/이자) 영역 차트.
     - 월별 상세 스케줄표 및 엑셀 호환 UTF-8 BOM CSV 내보내기.
  5. **대출 상식 및 팁 안내 (`LoanInfoCard.tsx`)**:
     - DSR/DTI/LTV 한 줄 핵심 요약, 상환방식 가이드, 중도상환수수료 3년 면제 및 금리인하요구권 팁.

### 3.5 [금융/급여] 연봉 실수령액 계산기 (`SalaryApp` - 신규 기획)
- **기능 요약**: 2026년 기준 대한민국 최신 4대 사회보험(국민연금, 건강보험, 노인장기요양보험, 고용보험) 요율 및 국세청 근로소득 간이세액표 누진세율을 기반으로, 세전 연봉 또는 월급에서 공제되는 6대 항목을 정밀하게 계산하여 실제 통장에 입금되는 월/연 예상 실수령액과 세부 공제 명세 대시보드를 제공하는 표준 급여 계산기.
- **방향성 합의**: 사용자 선택에 따라 **표준 집중형(핵심 4대 보험 + 월 실수령액 & 세부 공제 대시보드)** 접근법을 채택하여, 과도한 부가 옵션 대신 대한민국 직장인이 가장 궁금해하는 핵심 수치(월 실수령액, 총 공제액, 항목별 공제액 및 비중)를 명확하고 직관적으로 제공.
- **주요 기능 명세**:
  1. **급여 형태 및 세전 금액 입력 (`SalaryForm.tsx`)**:
     - **급여 지급 기준 토글**: 연봉(기본값) / 월급 기준 세그먼트 전환 (`SegmentedControl` 적용).
       - 연봉 선택 시: 세전 연봉 입력 ➔ 12개월 균등 분할 월 환산액 자동 계산.
       - 월급 선택 시: 세전 월급 입력 ➔ 12배 연간 총급여 자동 환산.
     - **세전 금액 입력 필드**: 풀 와이드 입력 필드 및 우측 단위 심볼(`원`) 적용, 실시간 한글 금액 병기(예: `5,000만 원`, `416만 6,666원`).
     - **한국형 연봉 퀵 프리셋 칩**: `3,000만`, `4,000만`, `5,000만`, `6,000만`, `7,000만`, `1억`의 6대 대표 연봉 원클릭 프리셋 제공 (`SelectableChip` 적용).
     - **세전 금액 퀵 증감 칩**: `+100만`, `+500만`, `+1,000만`, `초기화` 지원으로 빠르고 편리한 수치 조절.
     - **퇴직금 지급 방식 토글**: `별도 지급(기본)` vs `연봉 포함(1/13 분할)` 선택 지원.
  2. **비과세 급여액 및 인적공제 설정**:
     - **비과세 식대/수당**: 기본값 200,000원 (2023년 세법 개정 이후 식대 비과세 한도 20만 원 반영), 직접 입력 필드 지원.
     - **부양가족 수 (본인 포함)**: 본인 1인 기본 (1~11명 조절 가능, 인당 연 150만 원 기본인적공제 연계).
     - **20세 이하 자녀 수**: 0~10명 조절 가능 (자녀 세액공제 연계: 1명 15만 원, 2명 35만 원, 3명 이상 35만 + 초과 1인당 30만 원).
  3. **2026년 기준 4대 보험 및 조세 산출 공식**:
     - **국민연금 (4.5%)**: 기준소득월액 상한액(6,170,000원) 적용 시 월 최대 보험료 277,650원 한도 적용, 하한액(390,000원, 월 17,550원). 원단위 절사.
     - **건강보험 (3.545%)**: 과세 대상 월 급여액의 3.545%. 10원 미만 절사.
     - **노인장기요양보험 (건강보험료의 12.95%)**: 건강보험료의 12.95% (보수월액 기준 약 0.4590775%). 10원 미만 절사.
     - **고용보험 (0.9%)**: 과세 대상 월 급여액의 0.9%. 10원 미만 절사.
     - **근로소득세 (국세청 간이세액표 알고리즘)**:
       - 월 과세 급여액 ➔ 연간 총급여액 환산.
       - 근로소득공제 차감: 500만원 이하 70%, 1500만원 이하 40%, 4500만원 이하 15%, 1억원 이하 5%, 1억원 초과 2%.
       - 기본공제(본인 및 부양가족 수 × 150만 원) 및 특별소득공제 기본 반영.
       - 과세표준 구간별 8단계 누진세율(6% ~ 45%) 적용하여 산출세액 산출.
       - 근로소득세액공제(산출세액 130만원 이하 55%, 초과분 30%, 총급여 구간별 한도) 차감.
       - 20세 이하 자녀 세액공제 차감.
       - 최종 연간 산출세액 ÷ 12 ➔ 월 근로소득세 산출 (10원 미만 절사, 0원 미만 시 0원).
     - **지방소득세 (10%)**: 산출된 월 근로소득세의 10% (10원 미만 절사).
  4. **결과 시각화 대시보드 (`SalarySummaryCards.tsx`, `SalaryChartDashboard.tsx`, `DeductionBreakdownTable.tsx`)**:
     - **월 예상 실수령액 하이라이트 메인 카드**:
       - 월 예상 실수령액 대형 타이포(`tabular-nums`) 표기 및 강조.
       - 연간 환산 실수령액 합계 병기.
       - 세전 대비 실수령 비율(`%`) 뱃지 표기 (예: `실수령 85.2%`).
     - **3단 요약 카드**:
       - `세전 월 환산액`: 과세 대상 급여 + 비과세 식대.
       - `월 총 공제액`: 4대 보험 합계 + 소득세/지방소득세 합계.
       - `총 공제율`: 세전 급여 대비 공제액 비율(%).
     - **원형 공제 비중 차트 (`PieChart`)**:
       - Recharts 기반 도넛 차트로 실수령액(Electric Lime), 4대 사회보험 합계(Slate/Zinc), 소득세·지방소득세(Rose/Amber) 시각화.
     - **6대 공제 세부 내역 테이블 (`Table`)**:
       - 국민연금, 건강보험, 노인장기요양보험, 고용보험, 소득세, 지방소득세 6개 항목별 월 공제액, 연간 납부액, 공제 비중(%) 정밀 표시.
       - 탭 전환을 통해 근로자 본인 부담금과 회사(사업주) 부담금(4대보험 회사 지원분) 비교 조회 지원.
     - **원클릭 클립보드 복사 및 피드백**:
       - 세전 급여, 월 실수령액, 6대 공제 항목 요약 텍스트를 원클릭으로 클립보드에 복사하고 시각적 완료 피드백 제공.
  5. **급여 및 세무 상식 카드 (`SalaryInfoCard.tsx`)**:
     - 2026년 기준 4대 보험 최신 요율 요약표.
     - 간이세액표와 연말정산의 관계 (매월 원천징수 후 연말정산을 통한 정산 원리).
     - 비과세 식대 20만 원 상향 개정 효과 및 절세 팁.

### 3.6 [생활/건강] BMI & 비만도 계산기 (`BmiApp` - 신규 기획)
- **기능 요약**: 신장과 체중을 기반으로 체질량지수(BMI)를 산출하고, 대한비만학회(KSSO) 한국인 공식 기준에 따른 비만도 판정, 나의 적정 표준 체중 및 정상 체중 진입을 위한 체중 조절 가이드를 직관적인 스펙트럼 게이지와 카드로 제공.
- **주요 기능 명세**:
  1. **입력 폼 인터페이스 (`BmiForm.tsx`)**:
     - **신장(cm) 입력**: 유효범위 100cm \~ 250cm (정밀 슬라이더 `step={1}` + 좌우 `-1cm`/`+1cm` 미세 조절 버튼 + 직접 숫자 입력 필드 + 빠른 프리셋 버튼: `160cm`, `165cm`, `170cm`, `175cm`, `180cm`, 단위: 1cm).
     - **체중(kg) 입력**: 유효범위 30kg \~ 200kg (화살표 증감 단위 1kg(`step="1"`), 슬라이더 `step={1}` 통일 + 좌우 `-1kg`/`+1kg` 미세 조절 버튼 + 소수점 1자리 타이핑 지원 + 빠른 프리셋 버튼: `50kg`, `60kg`, `70kg`, `80kg`, `90kg`).
     - **성별 선택**: 남성 / 여성 (표준 체중 및 기초 건강 분석 공식 반영).
     - **라벨 중복 제거**: 인풋 내부 우측 접미사(`suffix="cm"`, `suffix="kg"`)로 숫자가 명확히 확인되므로 라벨 상단의 중복 수치 표기는 생략하여 직관적인 폼 제공.
     - **우측 상단 폼 초기화 버튼**: 공통 표준 규격(`onReset`, `variant="ghost"`, `size="sm"`, `RotateCcw`, `h-8 px-2.5 gap-1.5 rounded-lg text-xs shrink-0`) 배치로 원클릭 기본값 리셋.
  2. **의학적 산출 로직 (`src/utils/bmiCalculator.ts`)**:
     - **BMI 수식**: $\text{BMI} = \text{체중(kg)} / (\text{신장(m)})^2$ (소수점 첫째자리 표기).
     - **대한비만학회(KSSO) 한국인 6단계 비만도 판정 기준**:
       - 저체중: BMI < 18.5
       - 정상: 18.5 \le BMI < 23.0
       - 비만전단계 (과체중): 23.0 \le BMI < 25.0
       - 1단계 비만: 25.0 \le BMI < 30.0
       - 2단계 비만: 30.0 \le BMI < 35.0
       - 3단계 고도비만: BMI \ge 35.0
     - **적정 표준 체중**:
       - 남성: $\text{신장(m)}^2 \times 22$
       - 여성: $\text{신장(m)}^2 \times 21$
     - **정상 체중 범위**:
       - 정상 하한: $\text{신장(m)}^2 \times 18.5$
       - 정상 상한: $\text{신장(m)}^2 \times 22.9$
     - **체중 조절 가이드**:
       - 정상 범위 내: "현재 정상 체중 범위를 건강하게 유지하고 있습니다."
       - 과체중/비만: "정상 상한선(BMI 22.9) 도달까지 약 -X.X kg 감량 권장"
       - 저체중: "정상 하한선(BMI 18.5) 도달까지 약 +X.X kg 증량 권장"
  3. **결과 요약 대시보드 (`BmiSummaryCards.tsx`)**:
     - **메인 결과 카드**: 현재 BMI 수치(예: `23.4`), 6단계 판정 뱃지(예: `비만전단계 (과체중)`), 한 줄 진단 안내문.
     - **3단 서브 요약 카드**:
       - `나의 적정 체중`: 표준 체중 수치 (예: `63.5 kg`)
       - `정상 체중 범위`: 하한 \~ 상한 구간 (예: `53.5 kg \~ 66.2 kg`)
       - `체중 조절 목표`: 감량/증량 권장량 (예: `-3.5 kg`)
  4. **비만도 스펙트럼 게이지 카드 (`BmiGaugeCard.tsx`)**:
     - 저체중 \~ 고도비만까지 6개 구간의 스펙트럼 컬러 바(블루 \~ 에메랄드 \~ 옐로우 \~ 오렌지 \~ 레드 \~ 퍼플) 위에 현재 나의 BMI 위치를 정밀하게 표시하는 핀포인트 마커 및 구간별 기준 수치(`18.5`, `23.0`, `25.0`, `30.0`, `35.0`) 라벨링.
  5. **건강 및 비만 상식 카드 (`BmiInfoCard.tsx`)**:
     - BMI의 의학적 정의와 KSSO 한국인 기준의 도입 배경(서양인 대비 아시아인의 내장지방/당뇨 취약성).
     - BMI의 한계점: 근육량이 많은 운동선수의 경우 체지방률과 무관하게 비만으로 분류될 수 있음.
     - 복부 비만과 허리둘레 기준: 남성 90cm 이상, 여성 85cm 이상 주의.

### 3.7 [금융/투자] 목표 자산 역산 계산기 (`GoalApp` - 구현 완료)
- **기능 요약**: "N년 뒤 목표 자산(예: 5억, 10억)을 모으려면 매월 얼마씩 저축/투자해야 할까?"를 재무 PMT 공식을 기반으로 역산하는 금융 계산기.
- **주요 기능 명세**:
  1. **핵심 역산 로직 (Financial PMT & 월복리 공식)**:
     - 목표 자산($FV$), 목표 투자 기간($n$년), 예상 연수익률($r$), 현재 보유 초기 자금($PV$)을 기반으로 월초 납입 기준 필요 월 적립액($PMT$) 도출.
     - 초기 목돈($PV$)의 미래 가치($FV_{PV} = PV \times (1 + i)^m$)를 차감한 순수 적립 목표액을 기준으로 정밀 계산.
     - 수익률 0% 및 음수/하락장 상황까지 수학적 예외 없이 안정적 처리.
     - 한국형 과세 체계(일반과세 15.4%, ISA 9.9%, 비과세 0%)를 반영한 세후 목표 달성 필요 적립액 산출 지원.
  2. **입력 폼 표준화 (`GoalForm.tsx`)**:
      - **Ghost 디자인 시스템 일관성**: 항목별 유채색 아이콘/라벨을 배제하고, 차분한 모노크롬(딥차콜/슬레이트) 및 일렉트릭 라임 단일 액센트로 정돈.
      - **표준 초기화 액션**: 우측 상단 `variant="ghost"`, `RotateCcw` 아이콘 기반 표준 초기화 버튼 제공.
      - **서브 헤더 안내문**: 타이틀 하단에 직관적인 폼 설명 텍스트 제공.
      - 목표 자산 ($FV$): 직접 숫자 입력(1,000만 ~ 100억 원) + 한글 금액 라벨 + 5대 퀵 프리셋 칩 (`+5,000만`, `+1억`, `+3억`, `+5억`, `+10억`).
      - 목표 기간 ($n$): 직접 숫자 입력 필드(1~40년) + 정밀 슬라이더 + 7대 프리셋 (`3년`, `5년`, `7년`, `10년`, `15년`, `20년`, `30년`).
      - 연 예상 수익률 ($r$): 비현실적인 마이너스 범위를 제거하고 0%~30% 유효 범위로 제한. 직접 숫자 입력 필드 + 슬라이더(step: 0.5%) + 4대 프리셋 (`3.5% 예적금`, `5.0% 채권혼합`, `7.0% 글로벌주식`, `10.0% 적극투자`).
      - 현재 보유 초기 자금 ($PV$): 직접 숫자 입력(0원 ~ 목표 자산) + 한글 금액 라벨 + 5대 프리셋 (`0원`, `+1,000만`, `+3,000만`, `+5,000만`, `+1억`).
      - 과세 유형: `SegmentedControl` (다크 솔리드 스타일 `variant="dark-solid"`: 일반 15.4%, ISA 9.9%, 비과세 0%).
  3. **결과 요약 대시보드 (`GoalSummaryCards.tsx`)**:
     - **메인 결과 카드**: 목표 달성에 필요한 **매월 적립액** (예: `월 234만 원`)을 일렉트릭 라임 액센트와 한글 단위로 대형 강조.
     - **3단 서브 요약 지표**:
       - `총 투입 원금`: 초기 자금 + (월 적립액 × 개월 수)
       - `예상 복리 수익`: 목표 자산 - 총 투입 원금
       - `이자/수익 기여도`: 전체 목표 자산 중 복리 이자가 차지하는 비중 (%)
  4. **자산 형성 궤적 차트 (`GoalChartCard.tsx`)**:
     - 0년부터 목표 연차까지 [초기 자금 + 누적 적립 원금 + 누적 복리 수익]이 목표 금액으로 도달하는 Recharts 기반 누적 영역형 차트(`AreaChart`).
  5. **수익률 시나리오 대조 카드 (`GoalRateComparisonCard.tsx`)**:
     - 동일한 목표 기간 동안 예적금(연 3.5%), 인덱스 펀드(연 7%), 적극 투자(연 10%) 시 매월 넣어야 하는 적립금의 격차를 비교하여 높은 수익률이 가져오는 저축 부담 경감 효과를 직관적으로 체감.
  6. **목표 달성 가이드 카드 (`GoalInfoCard.tsx`)**:
     - 초기 시드머니의 위력, 복리와 시간의 상관관계, 현실적인 투자 수익률 설정 팁 제공 (Ghost 디자인 및 컬러 이모지 배제 원칙).

### 3.8 향후 확장 예정 모듈 및 TODO (Roadmap)
- **[TODO] BMI 종합 헬스케어 확장 (기초대사량 BMR & 하루 권장 칼로리 TDEE)**:
  - 활동량 수준(좌식 생활, 가벼운 활동, 보통 활동, 격렬한 활동 등) 선택 옵션 추가.
  - Mifflin-St Jeor 공식을 적용한 기초대사량(BMR) 산출.
  - 하루 유지 칼로리(TDEE) 및 체중 감량/증량 목표별 하루 권장 칼로리 식단 가이드 탭 제공.
- **배당금 및 월 배당 달력 계산기 (`dividend`)**: 배당주 포트폴리오의 월별 배당금 캘린더 및 배당소득세(15.4%) 차감 후 실수령액 계산.
- **예·적금 만기 수령액 계산기**: 단리/복리, 세금우대, 만기 이자 지급 방식별 실수령액 계산.
- **대출 갈아타기 (대환대출) 비교 계산기**: 기존 대출과 신규 대출 간 중도상환수수료 및 금리 인하에 따른 총 절감 비용 비교.

---

## 4. 데이터 모델 (Data Models)

### 4.0 사이트 전역 설정 모델 (`src/config/site.ts`)
사이트 전반에서 일관된 브랜딩, 타이틀, 카피라이트 및 메타데이터를 유지하기 위한 단일 진실 공급원(Single Source of Truth) 설정:
```typescript
export interface SiteConfig {
  name: string;           // '스마트 계산기 허브' (공식 국문 명칭)
  nameEn: string;         // 'Smart Calculator Hub' (공식 영문 명칭)
  shortName: string;      // '스마트 계산기' (모바일/PWA 쇼트 명칭)
  shortNameEn: string;    // 'Smart Calculator' (모바일/PWA 영문 쇼트 명칭)
  description: string;    // 사이트 대표 설명
  company: string;        // 'sosoFactory'
  copyright: string;      // '© sosoFactory'
  version: string;        // '1.8.13'
  links: {
    github?: string;
  };
  getTitle: (pageTitle?: string) => string;
}
```

### 4.1 글로벌 네비게이션 모델 (`src/types/navigation.ts`)
```typescript
export type CalculatorId =
  | 'compound'
  | 'unit'
  | 'exchange'
  | 'loan'
  | 'salary'
  | 'dividend'
  | 'goal';

export type CalculatorCategory = 'finance' | 'lifestyle' | 'global';

export interface CalculatorItem {
  id: CalculatorId;
  name: string;
  shortName: string;
  description: string;
  category: CalculatorCategory;
  badge?: string;
  status: 'active' | 'coming-soon';
}
```

### 4.2 연복리 계산 데이터 모델 (`src/types/calculator.ts`)
```typescript
export type TaxType = 'normal' | 'exempt' | 'isa' | 'custom';
export type CompoundingFrequency = 'annual' | 'quarterly' | 'monthly' | 'daily';
export type ContributionFrequency = 'monthly' | 'annual' | 'none';

export interface ScenarioInput {
  name: string;
  principal: number;                          // 초기 원금 (원)
  regularContribution: number;                // 정기 납입액 (원)
  contributionFrequency: ContributionFrequency; // 납입 주기
  years: number;                              // 투자 기간 (년, 1~40)
  annualRate: number;                         // 연 수익률 (%, -5~50)
  compoundingFrequency: CompoundingFrequency; // 복리 주기
  taxType: TaxType;                           // 과세 유형
  customTaxRate?: number;                     // 직접 입력 세율 (%)
}

export interface YearlyBreakdown {
  year: number;
  totalPrincipal: number;                     // 누적 원금
  grossInterestYear: number;                  // 당해 연도 세전 이자
  grossInterestTotal: number;                 // 누적 세전 이자
  taxAmount: number;                          // 누적 소득세
  netInterestTotal: number;                   // 누적 세후 이자
  futureValuePreTax: number;                  // 세전 총 자산
  futureValuePostTax: number;                 // 세후 총 자산
  returnRate: number;                         // 원금 대비 세후 수익률 (%)
}

export interface CalculationResult {
  totalPrincipal: number;                     // 총 납입 원금
  grossInterest: number;                      // 세전 총 이자
  taxAmount: number;                          // 총 이자 과세액
  netInterest: number;                        // 세후 총 이자
  futureValuePreTax: number;                  // 세전 최종 금액
  futureValuePostTax: number;                 // 세후 최종 수령액
  netReturnRate: number;                      // 세후 원금 대비 수익률 (%)
  principalMultiple: number;                  // 원금 대비 배수
  breakdown: YearlyBreakdown[];               // 연도별 데이터
}

export interface ScenarioComparison {
  scenarioA: ScenarioInput;
  scenarioB: ScenarioInput;
  resultA: CalculationResult;
  resultB: CalculationResult;
  diffPrincipal: number;                      // B - A 원금 차이
  diffPostTax: number;                        // B - A 최종 수령액 차이
  diffNetInterest: number;                    // B - A 세후 이자 차이
  diffReturnRate: number;                     // B - A 수익률 차이
}
```

### 4.3 단위 변환 데이터 모델 (`src/types/unit.ts`)
```typescript
export type UnitCategory = 'area' | 'length' | 'weight' | 'volume' | 'temperature';

export interface UnitDefinition {
  id: string;          // 예: 'sqm', 'pyeong', 'cm', 'kg'
  name: string;        // 예: '제곱미터', '평', '센티미터'
  symbol: string;      // 예: '㎡', '평', 'cm'
  category: UnitCategory;
  ratioToBase: number; // 카테고리 기준 단위 대비 1단위의 비율 (단, 온도는 별도 공식 사용)
  description?: string;// 예: '아파트 전용면적 기준', '순금 1돈 = 3.75g'
  isPopular?: boolean;
}

export interface UnitConversionResult {
  unit: UnitDefinition;
  value: number;
  formattedValue: string;
}

export interface QuickPreset {
  label: string;
  category: UnitCategory;
  unitId: string;
  value: number;
  badge?: string;
  description?: string;
}

export type DecimalPrecision = 0 | 2 | 4 | 6;
```

### 4.4 환율 계산 데이터 모델 (`src/types/exchange.ts`)
```typescript
export type CurrencyCode = 'KRW' | 'USD' | 'JPY' | 'EUR' | 'CNY' | 'GBP';

export interface CurrencyItem {
  code: CurrencyCode;
  name: string;        // '대한민국 원', '미국 달러' 등
  symbol: string;      // '₩', '$', '¥', '€', '£'
  flag: string;        // 단색/텍스트 코드 또는 국가 식별자
  baseRateToKRW: number; // 1단위(JPY는 100엔)당 KRW 기준 환율
  baseUnit: number;    // 기본 1 (JPY는 100)
  spreadRate: number;  // 은행 표준 현찰 스프레드율 (기본 약 1.75% ~ 2.0%)
}

export type ExchangeType = 'base' | 'cash_buy' | 'cash_sell' | 'send' | 'receive';

export type SpreadDiscount = 0 | 50 | 80 | 90 | 100;

export interface ExchangePreset {
  label: string;
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  amount: number;
  description: string;
}

export interface ExchangeResult {
  convertedAmount: number;
  appliedRate: number;
  spreadFee: number;
  discountSaved: number;
}
```

### 4.5 대출 이자 계산 데이터 모델 (`src/types/loan.ts`)
```typescript
export type RepaymentMethod = 'equal_payment' | 'equal_principal' | 'bullet';

export interface EarlyRepaymentOption {
  enabled: boolean;
  afterMonths: number;                        // 대출 실행 N개월 후 상환 (예: 12, 24, 36)
  amount: number;                             // 중도상환 원금
  feeRate: number;                            // 중도상환 수수료율 (%, 기본 1.2)
}

export interface EarlyRepaymentResult {
  feeAmount: number;                          // 납부할 중도상환 수수료 (3년 슬라이딩 감면 반영)
  savedInterest: number;                      // 중도상환으로 절약된 총이자
  netBenefit: number;                         // 순 절감 혜택 (절약이자 - 수수료)
}

export interface LoanInput {
  loanAmount: number;                         // 대출 원금 (원 단위, 예: 300,000,000)
  annualRate: number;                         // 연이율 (%, 예: 4.2)
  loanTermYears: number;                      // 대출 기간 (연 단위, 예: 30)
  gracePeriodMonths: number;                  // 거치 기간 (개월 단위, 0 = 거치 없음)
  repaymentMethod: RepaymentMethod;           // 기본 선택 상환방식
  earlyRepayment?: EarlyRepaymentOption;      // 중도상환 옵션
}

export interface MonthlyRepayment {
  month: number;                              // 회차 (1 ~ 총 개월수)
  year: number;                               // 연차 (1 ~ 기간)
  monthInYear: number;                        // 연차 내 월 (1 ~ 12)
  isGracePeriod: boolean;                     // 거치 기간 여부
  isEarlyRepaymentMonth?: boolean;            // 중도상환 실행 회차 여부
  earlyRepaymentAmount?: number;              // 해당 월 추가 상환된 원금
  principalPayment: number;                   // 납입 원금 (원)
  interestPayment: number;                    // 납입 이자 (원)
  totalPayment: number;                       // 월 상환액 (원금 + 이자)
  remainingBalance: number;                   // 대출 잔액 (원)
}

export interface RepaymentCalculationResult {
  method: RepaymentMethod;
  totalRepayment: number;                     // 총 상환금액 (원금 + 총이자)
  totalInterest: number;                      // 총 대출이자
  firstMonthPayment: number;                  // 1회차 상환액
  lastMonthPayment: number;                   // 최종 회차 상환액
  monthlyAveragePayment: number;              // 월평균 상환액
  maxMonthlyPayment: number;                  // 최대 월 상환액
  minMonthlyPayment: number;                  // 최소 월 상환액
  schedule: MonthlyRepayment[];               // 월별 상세 스케줄표
  earlyRepayment?: EarlyRepaymentResult;      // 중도상환 적용 시 결과
}

export interface LoanComparisonSummary {
  equalPayment: RepaymentCalculationResult;
  equalPrincipal: RepaymentCalculationResult;
  bullet: RepaymentCalculationResult;
  lowestInterestMethod: RepaymentMethod;
  interestSavingsVsEqualPayment: number;      // 원금균등 선택 시 원리금균등 대비 절약되는 이자액
}
```

### 4.6 연봉 및 급여 계산 데이터 모델 (`src/types/salary.ts`)
```typescript
export type SalaryPaymentType = 'annual' | 'monthly';
export type SeveranceType = 'separate' | 'included';

export interface SalaryInput {
  paymentType: SalaryPaymentType;             // 급여 형태: 'annual' (연봉) | 'monthly' (월급)
  grossAmount: number;                        // 세전 금액 (원, 연봉 또는 월급)
  severanceType: SeveranceType;               // 퇴직금: 'separate' (별도) | 'included' (연봉 포함, 1/13 분할)
  nonTaxableAmount: number;                   // 월 비과세액 (기본 200,000원 - 식대 등)
  familyCount: number;                        // 부양가족 수 (본인 포함, 1 ~ 11명)
  childrenCount: number;                      // 20세 이하 자녀 수 (0 ~ 10명)
}

export interface DeductionItem {
  id: string;                                 // 'national_pension', 'health_insurance', 'long_term_care', 'employment_insurance', 'income_tax', 'local_income_tax'
  name: string;                               // 국문 명칭
  description: string;                        // 항목 설명 및 요율
  employeeMonthlyAmount: number;              // 근로자 부담 월 공제액
  employerMonthlyAmount: number;              // 사업주(회사) 부담 월 지원액
  employeeAnnualAmount: number;               // 근로자 연간 공제 누적액
  percentageOfGross: number;                  // 세전 월 환산 급여 대비 공제 비중 (%)
}

export interface SalaryCalculationResult {
  input: SalaryInput;
  grossMonthlySalary: number;                 // 세전 월 환산 급여
  grossAnnualSalary: number;                  // 세전 연 환산 급여
  nonTaxableMonthly: number;                  // 월 비과세액
  taxableMonthlySalary: number;               // 월 과세 대상 급여 (세전월급 - 비과세액)
  
  // 4대 보험 월 공제액 (근로자 부담분)
  nationalPension: number;                    // 국민연금 (4.5%, 상한 277,650원)
  healthInsurance: number;                    // 건강보험 (3.545%)
  longTermCare: number;                       // 노인장기요양보험 (건보의 12.95%)
  employmentInsurance: number;                // 고용보험 (0.9%)
  totalFourMajorInsurances: number;           // 4대 보험 합계

  // 세금 월 공제액
  incomeTax: number;                          // 근로소득세 (간이세액표 누진세율 및 세액공제 반영)
  localIncomeTax: number;                     // 지방소득세 (근로소득세의 10%)
  totalTax: number;                           // 세금 합계

  // 최종 요약 지표
  totalMonthlyDeduction: number;              // 월 총 공제액 (4대보험 + 세금)
  netMonthlySalary: number;                   // 월 예상 실수령액
  netAnnualSalary: number;                    // 연 예상 실수령액
  takeHomeRatio: number;                      // 실수령 비율 (%)
  totalDeductionRatio: number;                // 총 공제 비율 (%)

  // 세부 명세 목록 (테이블 & 차트용)
  deductionItems: DeductionItem[];
}
```

### 4.7 BMI 및 비만도 측정 데이터 모델 (`src/types/bmi.ts`)
```typescript
export type Gender = 'male' | 'female';

export type BmiCategory =
  | 'underweight'      // 저체중 (<18.5)
  | 'normal'           // 정상 (18.5 - 22.9)
  | 'pre-obese'        // 비만전단계/과체중 (23.0 - 24.9)
  | 'obese-1'          // 1단계 비만 (25.0 - 29.9)
  | 'obese-2'          // 2단계 비만 (30.0 - 34.9)
  | 'obese-3';         // 3단계 고도비만 (>=35.0)

export interface BmiInput {
  height: number;      // 신장 (cm, 100 - 250)
  weight: number;      // 체중 (kg, 30 - 200)
  gender: Gender;      // 성별 ('male' | 'female')
}

export interface BmiResult {
  bmi: number;                 // BMI 수치 (소수점 1자리)
  category: BmiCategory;       // 판정 단계
  categoryLabel: string;       // 한글 단계명 (예: '비만전단계 (과체중)')
  idealWeight: number;         // 나의 적정 표준 체중 (kg)
  normalWeightMin: number;     // 정상 체중 하한 (kg)
  normalWeightMax: number;     // 정상 체중 상한 (kg)
  weightDiff: number;          // 정상 범위 도달을 위한 체중 차이 (kg)
  weightDiffLabel: string;     // 체중 조절 안내 문구
  description: string;         // 의학적 건강 상태 한 줄 진단
}
```

### 4.8 목표 자산 역산 데이터 모델 (`src/types/goal.ts`)
```typescript
export type GoalTaxType = 'normal' | 'exempt' | 'isa';

export interface GoalInput {
  targetAmount: number;        // 목표 자산 (원, 1,000만 ~ 100억)
  targetYears: number;         // 달성 목표 기간 (년, 1 ~ 40)
  annualRate: number;          // 예상 연 수익률 (%, -5 ~ 30)
  initialAmount: number;       // 현재 보유 초기 자금 (원, 0 ~ 목표 자산)
  taxType: GoalTaxType;        // 과세 유형 (일반 15.4%, ISA 9.9%, 비과세 0%)
}

export interface GoalYearlyBreakdown {
  year: number;                // 경과 연차
  initialValue: number;        // 초기 자금 미래 가치
  accumulatedContribution: number; // 누적 월 적립 원금
  accumulatedInterest: number; // 누적 복리 수익
  totalAsset: number;          // 총 평가 자산
}

export interface RateComparisonItem {
  rate: number;                // 비교 연 수익률 (%)
  monthlyContribution: number; // 필요 월 적립액 (원)
  totalPrincipal: number;      // 총 납입 원금 (원)
  totalInterest: number;       // 총 복리 수익 (원)
  diffVsTarget: number;        // 기준 시나리오 대비 월 적립액 차이 (원)
}

export interface GoalCalculationResult {
  targetAmount: number;        // 목표 자산
  targetYears: number;         // 목표 기간 (년)
  annualRate: number;          // 적용 연 수익률 (%)
  initialAmount: number;       // 초기 자금
  monthlyContribution: number; // 필요 월 적립액 (원)
  totalMonths: number;         // 총 투자 개월 수
  totalContribution: number;   // 총 월 적립 원금 (monthlyContribution * totalMonths)
  totalPrincipal: number;      // 총 투입 원금 (initialAmount + totalContribution)
  totalInterest: number;       // 예상 복리 이자 (targetAmount - totalPrincipal)
  interestRatio: number;       // 전체 목표 중 복리 수익 비중 (%)
  breakdown: GoalYearlyBreakdown[]; // 연도별 자산 형성 흐름표
  rateComparisons: RateComparisonItem[]; // 대표 수익률 시나리오 대조 (3.5%, 7%, 10%)
}
```

---

## 5. 기술 스택 및 아키텍처

- **빌드 도구**: Vite
- **PWA (Progressive Web App)**: `vite-plugin-pwa`
  - 모바일 홈 화면 설치(Add to Home Screen / A2HS) 및 독립 실행형(`display: standalone`) 앱 지원
  - 서비스 워커(Service Worker) 기반 정적 자산 캐싱을 통한 **오프라인 무인터넷 환경 100% 동작 보장**
  - Web App Manifest (`manifest.webmanifest`), 테마 색상(`theme-color`), Apple 터치 아이콘 지원
- **프론트엔드**: React 18, TypeScript
- **라우팅**: [React Router v6](https://reactrouter.com/) (`react-router-dom`)
  - 클린 URL 구조: `/compound` (연복리), `/unit` (단위변환), `/exchange` (환율), `/loan` (대출이자)
  - 브라우저 히스토리(뒤로가기/앞으로가기) 네이티브 지원 및 딥링크 공유
- **디자인 시스템**: Ghost 디자인 시스템 (`ghost.design.md` 사양 전면 채택)
- **UI 컴포넌트 라이브러리**: shadcn/ui 기반 표준 컴포넌트 구축 (Ghost 디자인 토큰 정렬)
  - 표준 컴포넌트: 버튼(Button), 카드(Card), 입력창(Input), 슬라이더(Slider), 탭(Tabs), 배지(Badge), 테이블(Table), 툴팁(Tooltip), 드롭다운(Select)
  - 기존 브라우저 기본 `<select>` 태그를 Radix UI 기반 모듈형 Select로 전면 교체하여 일관된 인터랙션 확보.
- **스타일링 프레임워크**: Tailwind CSS
- **타이포그래피**: Pretendard Variable (전역 단일 표준 서체, 타 폰트 혼용 전면 금지, 고정폭 숫자 `tabular-nums` 및 한글/영문 가독성 최적화)
- **문구 및 표기 원칙**:
  - 서비스 UI 및 안내 문구 전반에 컬러 이모지 배제 및 단정한 텍스트/표준 라인 아이콘 사용.
  - 개별 계산기 및 도구의 국문 타이틀에는 불필요한 수식어를 배제하고 본래 명칭(예: '단위 변환기', '연복리 & 자산성장 계산기')으로 통일.
- **차트 시각화**: Recharts (누적 영역형 차트, 멀티 라인 비교 차트, 대출 잔액 감소 곡선)
- **아이콘**: Lucide React
- **상태 관리**: React State + 커스텀 훅 + LocalStorage
- **코드 스플리팅**: 각 계산기 모듈별 동적 임포트(`React.lazy`) 적용으로 초기 로딩 경량화 유지

---

## 6. 비기능적 요구사항 및 검증 기준

1. **모바일 사용성**: 하단 탭 또는 좌측 드로어를 통해 한 손으로 모든 계산기 간 1회 터치로 전환 가능.
2. **성능 & 번들 최적화**: 멀티 계산기가 추가되어도 메인 엔트리 번들이 비대해지지 않도록 각 계산기 모듈을 코드 스플리팅.
3. **독립성 & 데이터 격리**: 한 계산기에서 입력한 값이 다른 계산기에 영향을 주지 않으며, 각 계산기별 LocalStorage 키를 분리하여 보존.
4. **정확성**:
   - 단위 변환: 부동소수점 오차 없는 표준 단위 환산 계수 적용.
   - 환율: 매매기준율 및 환전 우대율 수식 정합성 보증.

---

## 7. 검색엔진 최적화 (SEO) 전략 및 명세

웹 계산기 서비스의 특성상 포털(구글, 네이버 등) 검색 유입이 핵심 트래픽 원천이므로, **적극적이고 고도화된 SEO 전략**을 기본 탑재합니다.

### 7.1 메타데이터 및 소셜 공유 (Meta Tags & OpenGraph)
- **공식 운영 도메인**: `https://soso-calculator.vercel.app`
- **표준 메타 태그**:
  - `title`: `[계산기 이름] | 스마트 계산기 허브 - 연복리 · 평수계산 · 환율`
  - `description`: 검색 사용자의 클릭률(CTR)을 높이는 구체적인 타깃 설명 (예: "아파트 84㎡는 몇 평일까? 평수와 ㎡ 실시간 변환, 연복리 시뮬레이션, 실시간 환율 계산까지 무료로 이용하세요.")
  - `keywords`: `연복리 계산기, 적립식 복리, 평수 계산기, 아파트 평수 ㎡, 환율 계산기, 달러 환율, 이자 계산기`
  - `canonical`: `https://soso-calculator.vercel.app/` (중복 URL 방지를 위한 표준 대표 URL 지정)
  - `robots`: `index, follow`
- **오픈그래프(OpenGraph) & 트위터 카드**:
  - 카카오톡, 라인, 페이스북, 슬랙 링크 공유 시 매력적인 미리보기 카드 노출 (`og:title`, `og:description`, `og:image`, `og:url="https://soso-calculator.vercel.app"`, `og:type="website"`).

### 7.2 동적 페이지 헤드 관리 (Dynamic Meta Updater)
- 단일 페이지 애플리케이션(SPA) 내에서 사용자가 계산기를 전환(`연복리` ↔ `단위변환` ↔ `환율`)할 때:
  - 브라우저의 `<title>`과 `<meta name="description">`이 실시간으로 해당 계산기의 타깃 키워드로 동적 변경.
  - 브라우저 히스토리(`window.history.pushState` 또는 해시/쿼리 파라미터 `?tool=compound`, `?tool=unit`)를 지원하여 특정 계산기로 바로 연결되는 딥링크(Deep Link) URL 제공.

### 7.3 구조화된 데이터 (JSON-LD / Schema.org)
- 검색엔진 크롤러가 사이트의 성격을 즉시 파악하고 구글 검색결과에 리치 스니펫(Rich Snippet)으로 표시되도록 `ld+json` 구조화 데이터 삽입:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "스마트 계산기 허브",
    "url": "https://soso-calculator.vercel.app",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "KRW"
    }
  }
  ```
- **FAQ / HowTo 스키마**: 각 계산기 하단에 검색엔진 노출용 금융/수학 공식 질의응답 아코디언 제공 (예: "복리 계산 공식이란?", "1평은 몇 ㎡인가요?").

### 7.4 크롤러 수집 파일 지원
- `public/robots.txt`: 검색 크롤러의 전체 페이지 접근 허용 및 `Sitemap: https://soso-calculator.vercel.app/sitemap.xml` 지정
- `public/sitemap.xml`: 각 계산기 도구별 URL 맵 제공 (`https://soso-calculator.vercel.app/`, `/compound`, `/loan`, `/salary`, `/unit`, `/exchange`)

### 7.5 웹 로그 및 방문자 데이터 분석 (Vercel Web Analytics)
- **도입 목적**:
  - 개인정보를 침해하지 않는 프라이버시 중심(Cookie-less, GDPR 준수) 방식으로 방문자 트래픽, 인기 계산기 모듈, 유입 경로를 파악하여 서비스 품질 개선에 활용.
- **아키텍처 및 동작 명세**:
  - `@vercel/analytics` 경량 패키지(번들 오버헤드 < 1KB) 탑재.
  - 최상위 진입점(`src/App.tsx`)에 `<Analytics />` 컴포넌트 마운트로 SPA 라우트 전환에 따른 자동 페이지뷰 추적.
  - Vercel 프로덕션 대시보드와 실시간 연동되어 일별/월별 순 방문자 수(UV), 페이지뷰(PV), 국가/지역, 기기/브라우저, 유입 경로(Referrer) 집계.

---

## 8. PWA (Progressive Web App) 명세 및 설치 지원

모바일 앱과 동일한 사용자 경험 및 네트워크 단절 시에도 온전한 계산 기능 수행을 위해 PWA를 지원합니다.

### 8.1 핵심 요구사항
- **홈 화면 추가(A2HS)**: 모바일(iOS 사파리 '홈 화면에 추가', 안드로이드 크롬 '설치' 배너/버튼) 및 데스크톱 PWA 설치 완벽 지원.
- **오프라인 캐싱 (Service Worker)**:
  - `vite-plugin-pwa` 기반 Workbox 서비스 워커 자동 등록 (`generateSW`).
  - 정적 자산(JS, CSS, HTML, 웹폰트, PNG/SVG 아이콘) 프리캐싱을 통해 비행기 모드나 오프라인 환경에서도 모든 계산기 즉시 작동.
- **Web App Manifest**:
  - `name`: `스마트 계산기 허브 | Smart Calculator Hub`
  - `short_name`: `스마트 계산기`
  - `description`: `연복리 시뮬레이터, 대출이자 상환비교, 연봉 실수령액, 아파트 평수 단위변환, 실시간 환율 계산기`
  - `theme_color`: `#15171a` (Ghost 디자인 시스템 흑연 다크 테마 컬러 통일)
  - `background_color`: `#15171a` (스플래시 화면 및 아이콘 배경 흑연색 일치)
  - `display`: `standalone` (브라우저 주소창 제거, 네이티브 앱 느낌)
  - `orientation`: `portrait`
  - `lang`: `ko`
  - `categories`: `['finance', 'utilities']`
  - **풀 블리드(Full Bleed) 프리미엄 앱 아이콘 시스템 (v1.9.16 개편)**:
    - **배경 원칙 (Full Bleed)**: 512×512 및 192×192 캔버스 전체에 Ghost 시그니처 흑연 다크(`#15171a`) 배경을 100% 꽉 채워, iOS의 Squircle 마스킹 및 안드로이드의 Circle Adaptive 마스킹 시 "흰색 테두리 이중 모서리 현상"을 원천 제거.
    - **Safe Zone (중앙 80% 안전 구역)**: 안드로이드 및 iOS의 시스템 마스크(원형, 둥근 사각형 등)에 의해 아이콘 심볼이 잘려 나가지 않도록, 캔버스 지름 80% 안전 영역(Safe Zone) 내에 계산기 심볼(미니멀 상단 디스플레이 + 사칙연산 `+ - × =` + Electric Lime `#d1ff19` 하이라이트) 집중 배치.
    - **에셋 구성**: 192x192, 512x512 고품질 PNG 래스터 에셋 및 SVG 벡터 에셋 동기화.
    - `purpose: 'any maskable'` 규격을 명시하여 안드로이드 적응형 아이콘(Adaptive Icon) 및 데스크톱 PWA 설치 완벽 대응.
- **파비콘 및 iOS 최적화**:
  - `favicon`: `index.html` 파비콘으로 벡터 `/logo.svg`를 지정하여 브라우저 탭 아이콘 404 원천 차단 및 선명한 렌더링 보장.
  - `apple-mobile-web-app-capable`: `yes`
  - `apple-mobile-web-app-status-bar-style`: `default`
  - `apple-mobile-web-app-title`: `스마트 계산기`
  - `apple-touch-icon`: 192x192 및 512x512 풀 블리드 PNG 포맷(`/pwa-192x192.png`) 지정하여 iOS 사파리 홈 화면 추가 시 네이티브 금융 앱 수준의 일체감 있는 스퀘어클 아이콘 제공.

### 8.2 PWA 인앱 설치 버튼 및 설치 가이드 규격 (`PWAInstallButton`, `PWAInstallModal`)
- **도입 목적**:
  - 브라우저 기본 팝업 타이밍에 의존하지 않고, 사용자가 계산기 이용 중 언제든 원클릭으로 홈 화면이나 데스크톱에 앱을 설치하거나 설치 방법을 쉽게 확인할 수 있도록 명확한 접근성 제공.
- **인터랙션 및 동작 원칙**:
  - **상시 노출 원칙**: 독립 실행형(`standalone` 모드)이 아닌 일반 브라우저 환경에서는 헤더 및 사이드바에 설치/가이드 버튼을 상시 노출.
  - **버튼별 역할 분리**:
    - **우측 상단 글로벌 헤더 (`GlobalHeader`)**: **`[앱 설치]`** 버튼 유지.
      - 네이티브 설치 지원 시 (`isInstallable: true`): 즉시 브라우저의 네이티브 설치 다이얼로그(`deferredPrompt.prompt()`) 호출.
      - 미지원/이벤트 대기 시: `PWAInstallModal` 설치 가이드 모달 호출.
    - **좌측 사이드바 및 모바일 드로어 (`SidebarDrawer`)**: **`[앱 설치 가이드]`** 버튼으로 명시.
      - 사용자가 클릭 시 가이드가 열릴 것임을 직관적으로 인지할 수 있도록 "앱 설치 가이드" 라벨 적용.
      - 클릭 시 즉시 `PWAInstallModal` 가이드 모달 호출.
      - 모바일 환경에서 클릭 시 열려 있던 사이드바 드로어를 자동으로 닫아(`onCloseMobile`) 오버레이 충돌 방지.
  - **`PWAInstallModal` 전역 최상위 렌더링 및 모달 내 설치 액션 탑재**:
    - **React Portal 필수 적용**: 부모 컨테이너(사이드바 `<aside z-20>`, Sheet 등)의 CSS 쌓임 맥락(Stacking Context)에 갇혀 상단 헤더(`GlobalHeader z-30`)의 타이틀이 모달 위로 뚫고 나오는 결함을 원천 방지하기 위해 `createPortal(..., document.body)`을 통해 전역 최상위(`z-[100]`)로 마운트.
    - **모달 내부 설명 및 타이틀 개선**:
      - 타이틀: "스마트 계산기 앱 설치 안내"
      - 서브 설명: "홈 화면에 추가하면 브라우저 주소창 없이 풀스크린으로 더 빠르고 편리하게 사용할 수 있습니다."
    - **모달 내 직접 설치 버튼 탑재**:
      - 네이티브 프롬프트가 지원되는 브라우저(크롬, 안드로이드, 엣지 등): 모달 하단에 눈에 띄는 Primary 액션 버튼 **[지금 앱 설치하기]** 제공 (클릭 시 `deferredPrompt.prompt()` 즉시 실행 및 다이얼로그 호출).
      - 네이티브 프롬프트 미지원 브라우저(iOS 사파리 등): iOS 사파리 3단계 홈 화면 추가 가이드 제공 및 하단 **[닫기]** 버튼 제공.
  - **독립 실행 모드 자동 숨김**: 이미 PWA로 설치되어 standalone 모드로 실행 중인 경우 버튼을 자동 숨김 처리하여 불필요한 시각적 잡음 배제.
- **배치 위치**:
  1. **상단 글로벌 헤더 (`GlobalHeader`)**:
     - 테마 전환 스위치 좌측에 배치.
     - 데스크톱: 다운로드 아이콘(`Download`) + "앱 설치" 텍스트 (`h-9 px-3 text-xs`).
     - 모바일: 화면 가용 폭을 고려하여 다운로드 아이콘 단독 툴팁 버튼 (`h-9 w-9 p-0`).
  2. **사이드바 및 모바일 드로어 (`SidebarDrawer`)**:
     - 메뉴 목록 하단, 카피라이트 푸터 상단에 북마크/스마트폰 안내 아이콘 + "앱 설치 가이드" 와이드 버튼(`w-full py-2.5 text-xs rounded-xl`) 형태로 배치.

### 8.3 PWA 신규 버전 업데이트 알림 및 자동 갱신 규격 (TODO 4.2 - v1.9.21 완료)
- **도입 목적**:
  - 서비스 워커가 백그라운드에서 신규 배포 코드를 내려받은 후 대기(`waiting`) 상태에 머물 때 발생하는 브라우저 캐시 불일치 문제를 방지하고, 최신 계산 로직과 UI를 즉시 제공.
- **기술 스펙 및 인터랙션**:
  - `vite.config.ts`: `registerType: 'prompt'` 연동으로 새 배포 감지 시 대기 상태 유지 및 `needRefresh` 트리거 보장.
  - `vite-plugin-pwa/react`의 `useRegisterSW` 훅을 연동하여 `needRefresh` 상태 실시간 감지.
  - 1시간 주기 점검(`setInterval`) 및 브라우저 탭 복귀(`visibilitychange`) 시 `r.update()` 자동 호출.
  - 새 버전 감지 시 **shadcn/ui Toast**를 통해 화면 하단에 플로팅 알림 배너 자동 노출:
    - 타이틀: *"새로운 버전이 준비되었습니다"*
    - 설명: *"최신 계산 기능과 성능 최적화가 적용되었습니다."*
    - 액션 버튼: **[지금 업데이트]** (`updateServiceWorker(true)` 호출하여 새 서비스 워커 활성화 및 즉시 리로드)
    - 닫기 버튼: 사용자가 작업 중단 없이 현재 계산을 이어갈 수 있도록 배너 닫기 지원.

---

## 9. 품질 안정화 및 환경 표준화 규격 (Quality & Environment Standardization)

### 9.1 테스트 환경 Recharts 경고 로그 제거 (JSDOM Layout Mock)
- **배경**: Vitest JSDOM 환경은 실제 DOM 레이아웃(너비/높이 계산)을 지원하지 않아, Recharts의 `ResponsiveContainer`가 `width(0)` 및 `height(0)` 경고 로그를 `stderr`에 출력함.
- **해결 방안**: `src/test/setup.ts`에서 Recharts의 `ResponsiveContainer`를 테스트 시 명시적 크기(예: 가로 800px, 세로 400px)를 가진 래퍼 컨테이너로 Mock 처리하여 불필요한 콘솔 노이즈 제거 및 테스트 로그 청결화.

### 9.2 패키지 메타데이터 및 제품명 동기화
- **배경**: 초기 단일 복리 계산기 프로젝트(`compound-interest-calculator`)에서 멀티 계산기 허브 플랫폼으로 확장 완료됨.
- **해결 방안**: `package.json`의 패키지 `name`을 `smart-calculator-hub`로 변경하여 실제 제품 정체성과 패키지 메타데이터를 일원화.

### 9.3 복리 수치 연산 NaN 입력 방어 규격 (Calculation Robustness)
- **배경**: 사용자 입력 도중 공백이나 잘못된 문자 파싱으로 인해 `NaN`이 유입될 경우, JavaScript 구조 분해 기본값(`= 0`)이 작동하지 않아 전체 자산 성장 테이블이 `NaN`으로 오염되는 문제 예방.
- **해결 방안**: `calculateCompoundInterest` 함수 진입 시 `Number.isFinite()` 검사를 통해 원금(`principal`), 정기적립금(`regularContribution`), 연이율(`annualRate`), 투자기간(`years`)의 유효성을 엄격히 검증하고, 유효하지 않은 값은 기본 안전값(`0` 또는 `10년`)으로 즉시 폴백.

### 9.4 라우트 단위 코드 스플리팅 및 번들 최적화 (Route-level Code Splitting)
- **배경**: 현재 모든 계산기 모듈이 정적으로 임포트되어 있어, 단위 변환기나 환율 계산기 사용자도 첫 로딩 시 대용량 차트 라이브러리(`Recharts` 약 528KB)를 함께 다운로드해야 함.
- **해결 방안**: `src/App.tsx`의 3대 계산기 컴포넌트(`CompoundInterestApp`, `UnitConverterApp`, `ExchangeApp`)를 `React.lazy()` 동적 임포트 및 `<Suspense>`로 분리하여 초기 번들 크기 경감 및 첫 화면 표시 속도(FCP/LCP) 대폭 향상. 로딩 대기 시에는 Ghost 디자인 시스템에 맞춘 가벼운 스켈레톤/스피너 플레이스홀더 노출.

### 9.5 외부 API 네트워크 타임아웃 및 스토리지 안전성 (Network & Storage Reliability)
- **배경**: 환율 API(`open.er-api.com`) 호출 시 네트워크 지연이 발생하면 백그라운드 요청이 무한 대기할 수 있으며, `useLocalStorage`에서 `undefined` 직렬화 시 파싱 오류가 발생할 수 있음.
- **해결 방안**:
  - `fetchLiveExchangeRates`에 5초 타임아웃 신호(`AbortSignal.timeout(5000)`)를 적용하여 음영지역에서도 지연 없이 오프라인 기본값으로 안전하게 폴백.
  - `useLocalStorage`에 `typeof window === 'undefined'` 환경 체크 및 `undefined` 직렬화 방어 로직 적용.

---

## 10. 웹 표준 및 웹 접근성(A11y) 규격 (Web Standards & Accessibility)

### 10.1 뷰포트 저시력자 화면 확대(Zoom) 보장 (WCAG 1.4.4: Resize text)
- **배경**: `index.html`의 뷰포트 메타태그에 `maximum-scale=1.0, user-scalable=no`가 지정되어 있어 저시력 사용자의 핀치 줌 화면 확대가 원천 차단됨.
- **해결 방안**: 뷰포트 메타태그를 표준 `width=device-width, initial-scale=1.0`으로 변경하여 최대 500%까지 자유로운 화면 줌을 보장함. 모바일 iOS 사파리의 인풋 포커스 시 자동 확대는 입력 필드의 기본 폰트 크기(16px 이상) 설정을 통해 자연스럽게 방지.

### 10.2 모든 폼 입력 필드 Accessible Name 매핑 (WCAG 1.3.1 & 4.1.2)
- **배경**: 연복리, 단위 변환, 환율 계산기의 대형 숫자 입력 필드에 스크린 리더가 식별할 수 있는 접근 가능한 이름이 누락되어 음성 낭독 시 "텍스트 편집창"으로만 안내됨.
- **해결 방안**:
  - `CalculatorForm.tsx`: 초기 투자 원금, 정기 추가 적립금, 목표 투자 기간(슬라이더), 예상 수익률 인풋에 `id` 및 `aria-label` 부여.
  - `DualConverterCard.tsx`: 출발 단위 입력 필드에 `aria-label=`${fromUnit.name} 변환할 수치 입력`` 연결.
  - `DualExchangeCard.tsx`: 출발 통화 입력 필드에 `aria-label=`${fromCurr.name} 환전할 금액 입력`` 연결.

### 10.3 아코디언 트리거의 키보드 접근성 및 ARIA 상태 표기 (WCAG 2.1.1 & 4.1.2)
- **배경**: `DataTable.tsx`의 연도별 흐름표 헤더가 일반 `<div>`에 클릭 핸들러만 달려 있어 키보드(Tab/Enter/Space) 조작이 불가능하고 확장 여부(`aria-expanded`)를 알 수 없음.
- **해결 방안**: 아코디언 헤더를 시맨틱 `<button type="button" aria-expanded={isOpen} ...>` 구조로 전환하여 키보드 포커스 및 엔터/스페이스 인터랙션과 스크린 리더의 개폐 상태 음성 출력을 보장.

### 10.4 문서 시맨틱 랜드마크 완성 (HTML5 Semantic)
- **배경**: 사이드바 하단 카피라이트/버전 영역이 일반 `<div>`로 작성되어 문서 랜드마크 계층이 미완성됨.
- **해결 방안**: `SidebarDrawer.tsx`의 하단 영역을 시맨틱 `<footer>` 태그로 변경하여 `<header>`, `<nav>`, `<aside>`, `<main>`, `<footer>`의 5대 랜드마크 체계를 완벽하게 수립.

---

## 11. 공통 폼 및 인터랙션 컴포넌트 표준 규격

모든 공통 폼 및 인터랙션 요소는 Ghost 디자인 시스템(`ghost.design.md`)의 절제된 미니멀리즘과 일관된 조작감을 계승하여 구현합니다.

### 11.1 Input 컴포넌트 및 숫자 입력 제어 표준 (`src/components/ui/input.tsx`, `src/hooks/useClampedNumberInput.ts`)
- **도입 목적**: 전 계산기 모듈의 입력 필드를 단일 표준 컴포넌트와 공통 훅(`useClampedNumberInput`)으로 일원화하여 포커스 상태, 빈 값 버퍼링, 유효성 검증, 자동 클램핑 보정을 일관되게 관리.
- **적용 대상**:
  - `CalculatorForm.tsx`: 초기 투자 원금, 정기 추가 적립금, 목표 투자 기간, 연 예상 수익률
  - `LoanForm.tsx`: 대출 원금, 연 대출 금리, 대출 기간, 중도상환 원금 및 수수료율
  - `DualConverterCard.tsx`: 출발(From) 단위 수치 입력창
  - `DualExchangeCard.tsx`: 출발(From) 통화 금액 입력창
- **전 계산기 폼 숫자 입력 공통 UI/UX 사양**:
  - 동일한 풀 와이드 입력 필드 형태 및 우측 단위 심볼(`원`, `년`, `%`, 통화/단위 기호) 표기.
  - **자연스러운 편집(Natural Editing)**: 백스페이스 입력 시 즉시 0으로 치환되지 않고 빈 값(`''`) 또는 음수 부호(`'-'`) 입력을 허용하여 재입력 편의성 제공.
  - **포커스 아웃(`onBlur`) 자동 보정**: 입력 필드를 벗어날 때 각 도메인별 허용 유효 범위(연복리 기간 1~40년, 수익률 -5%~50%, 대출 금리 0.1%~30%, 단위 수치 0 이상 등)로 안전하게 자동 클램핑 및 소수점 정밀도 정돈.

### 11.2 Slider 컴포넌트 (`src/components/ui/slider.tsx`)
- **도입 목적**: 브라우저별 렌더링 파편화를 해소하고 직관적인 터치 드래그와 정밀 키보드 제어를 지원하는 슬라이더 컴포넌트 표준화.
- **주요 인터랙션 사양**:
  - 터치 및 마우스 드래그를 통한 부드러운 값 증감.
  - 키보드 방향키(좌/우/상/하) 조작을 통한 1단위 정밀 조절 지원.
  - 연계된 입력 필드와의 실시간 양방향 값 동기화.
- **적용 대상**:
  - `CalculatorForm.tsx`: 목표 투자 기간(1~40년), 연 예상 수익률(-5%~50%)
  - `LoanForm.tsx`: 대출 기간(1~40년)

### 11.3 Button 컴포넌트 (`src/components/ui/button.tsx`)
- **도입 목적**: 버튼 요소의 상태 변화(기본, 호버, 활성화, 비활성화)와 키보드 탐색 접근성을 전역 일원화.
- **인터랙션 사양**:
  - 마우스 오버 및 터치 시 명확한 시각적 반응(명도 변화)을 일관되게 제공하여 조작감 향상.
  - 키보드 포커스 탐색 시 가시성 높은 포커스 링 표시로 접근성 보장.

### 11.4 Tabs 컴포넌트 (`src/components/ui/tabs.tsx`)
- **도입 목적**: WAI-ARIA 표준 탭 구조(`role="tablist"`, `role="tab"`, `role="tabpanel"`)를 준수하여 스크린 리더 및 키보드 화살표 탐색을 완벽히 지원.
- **컴포넌트 구성 및 인터랙션**:
  - `Tabs`: 탭 상태 제어 루트
  - `TabsList`: 탭 버튼 컨테이너 (고정 높이 강제를 배제하고 내부 버튼 높이에 맞춰 유동 적응)
  - `TabsTrigger`: 개별 탭 버튼 (선택 시 활성화 상태 전환 및 키보드 좌우 화살표 전환 지원)
  - `TabsContent`: 탭 패널 컨테이너
- **적용 대상**:
  - 단위 변환기 5대 카테고리 탭 (`UnitCategoryTabs.tsx`)
  - 환율 계산기 환전 방식 3분할 탭 (`DualExchangeCard.tsx`)
  - 대출 시각화 차트 뷰 전환 탭 (`LoanChartDashboard.tsx`)

### 11.5 Badge 컴포넌트 (`src/components/ui/badge.tsx`)
- **도입 목적**: 카드의 메타 정보, 상태 표시, 카테고리 태그의 시각적 위계를 정리.
- **용도별 사양**:
  - **헤더 서브 뱃지**: 카드 타이틀 옆에 부가 상태나 회차 정보(예: "스마트 비교", "총 360회차")를 컴팩트하게 표기.
  - **아웃라인 뱃지**: 투명 배경을 유지하여 다크 패널 내부에서도 텍스트 가독성을 온전히 보존.
  - **시그니처 배지**: 주요 추천 항목이나 핵심 라벨 강조에 사용.

### 11.6 Select 컴포넌트 (`src/components/ui/select.tsx`)
- **도입 목적**: 브라우저 기본 드롭다운을 모듈형 컴포넌트로 전면 교체하여 일관된 개폐 인터랙션 및 테마 호환성 제공.
- **적용 대상**: 단위 변환기 단위 선택, 연복리 복리주기/과세유형 선택, 대출 거치기간 선택.

### 11.7 공통 인터랙션 컴포넌트 (`SelectableChip`, `SegmentedControl`)
- **`SelectableChip` (`src/components/ui/selectable-chip.tsx`)**:
  - 금리, 기간, 거치기간, 수익률, 우대율 등 단일 선택형 프리셋 칩 표준.
  - 연복리 예상 수익률 `-3%` 프리셋을 포함한 모든 칩에 차별 없는 동일한 선택 활성화 인터랙션 적용.
- **`SegmentedControl` (`src/components/ui/segmented-control.tsx`)**:
  - 상환방식, 적립주기 등 2~3분할 인라인 세그먼트 전환 컨트롤러.

### 11.8 공통 숫자 및 금액 입력 컴포넌트 표준 규격 (`NumericInput` / `src/components/ui/numeric-input.tsx`)
- **도입 목적**:
  - 기존 대출 계산기(`LoanForm`), 연복리 계산기(`CalculatorForm`), 연봉 계산기(`SalaryForm`)에서 중복 작성되던 큰 규격(`h-11`, 우측 정렬, 볼드 폰트, 우측 단위 심볼 뱃지)의 수치 및 금액 입력 UI 패턴을 공통 컴포넌트로 일원화.
  - 화면별 디자인 불일치(패딩, 테두리 라운드, 폰트 크기, 높이 등)를 원천 제거하고 Ghost 디자인 시스템 표준 준수.
- **주요 UI/UX 및 인터랙션 사양**:
  - **터치 친화적 높이**: 모바일 터치 접근성에 최적화된 높이 44px (`h-11`).
  - **정렬 및 타이포그래피**: 우측 정렬 (`text-right`), 볼드 폰트 (`font-bold text-base sm:text-lg tracking-tight`), 다크 모드 호환 텍스트 색상 (`text-[#112220] dark:text-slate-100`).
  - **우측 단위 심볼(`suffix`) 렌더링**: '원', '%', '년', '개월' 등 단위를 인풋 내측 우측에 일관된 간격(`right-3.5`)으로 배치하고 포인터 이벤트 통과(`pointer-events-none`) 처리.
  - **천 단위 콤마 포맷팅(`thousandSeparator`)**: 통화/금액 입력 시 `toLocaleString('ko-KR')` 기반 자동 3자리 콤마 표시 및 숫자 추출 핸들러 내장.
  - **테마 및 포커스 링**: `bg-slate-50/50 dark:bg-slate-900/60`, `rounded-xl`, Ghost 시그니처 포커스 링(`focus-visible:ring-[#15171a] dark:focus-visible:ring-[#d1ff19]`).
  - **웹 접근성(WCAG)**: `id`, `aria-label`, `inputMode="numeric"`, `placeholder` 등 기본 접근성 속성 완벽 지원.
- **적용 대상**:
  - `SalaryForm.tsx`: 세전 급여 금액 입력 필드 ('원')
  - `LoanForm.tsx`: 대출 원금 ('원'), 연 대출 금리 ('%')
  - `CalculatorForm.tsx`: 초기 투자 원금 ('원'), 정기 추가 적립금 ('원')

### 11.9 shadcn/ui Toast 컴포넌트 표준 규격 (`toast.tsx`, `toaster.tsx`, `use-toast.ts`)
- **도입 목적**:
  - `@radix-ui/react-toast` 기반 shadcn/ui 표준 토스트 아키텍처를 도입하여 시스템 알림, PWA 버전 업데이트, 향후 클립보드 복사 피드백 등에 일관된 피드백 UX 제공.
- **주요 UI/UX 사양**:
  - **위치 및 애니메이션**: 화면 우하단(모바일: 하단 중앙), 부드러운 슬라이드 인/아웃 트랜지션.
  - **Ghost 디자인 시스템 호환**: 다크 모노크롬 베이스(`bg-[#15171a] dark:bg-slate-900`), 시그니처 쉐도우(`shadow-xl`), 테두리(`border border-[#e5e7eb] dark:border-slate-800`), 액션 버튼에 Electric Lime 포인트 또는 반전 버튼 적용.
  - **웹 접근성(WCAG)**: WAI-ARIA `role="status"` 및 `aria-live="polite"` 준수.

### 11.10 공통 폼 입력값 초기화 버튼 표준 규격 (`ResetButton`)
- **도입 목적**:
  - 연복리(`CalculatorForm`), 대출(`LoanForm`), 연봉(`SalaryForm`) 등 전 계산기 입력 폼의 초기화 버튼 위치, 스타일 및 반응형 동작을 단일 표준으로 일원화하여 조작 일관성 확보.
- **배치 위치**:
  - 전 계산기 입력 폼 카드 상단 우측(`CardHeader` 우측)으로 고정 통일. (기존 연복리 계산기 헤더 위치는 폐기하여 폼 입력 영역으로 시선 일원화).
- **UI 및 반응형 사양**:
  - `variant="ghost" size="sm" h-8 px-2.5 rounded-lg text-xs` + `RotateCcw (w-3.5 h-3.5)` 아이콘 + 텍스트 **"초기화"**.
  - `shrink-0` 속성을 적용하여 좁은 모바일 화면에서도 카드 타이틀과 겹치거나 개행되지 않고 우측 상단에 정돈되어 표시됨.
- **인터랙션 사양**:
  - 불필요한 브라우저 confirm 다이얼로그를 제거하고 원클릭으로 각 계산기 초기 기본값으로 즉각 안전하게 리셋.

### 11.11 공통 데이터 내보내기 버튼 표준 규격 (`DataExportButton`)
- **도입 목적**:
  - 연도별 복리 계산표(`DataTable.tsx`) 및 월별 대출 상환 스케줄표(`LoanScheduleTable.tsx`) 등 상세 데이터 표의 다운로드 버튼 명칭과 인터랙션 일원화.
- **단일 표준 명칭 및 라벨**:
  - **`CSV 다운로드`** 로 전역 통일 (기존 'CSV 내보내기', '엑셀(CSV) 다운로드' 등 파편화 해소 및 아이콘 단독 노출 방지).
- **UI 및 반응형 사양**:
  - `variant="outline" size="sm" h-8 px-2.5 text-xs rounded-lg` + `Download (w-3.5 h-3.5)` 아이콘 + 텍스트 **"CSV 다운로드"**.
  - 모바일 및 좁은 뷰포트에서도 텍스트가 사라지지 않고 항상 온전한 라벨로 노출되며, 테이블 헤더 영역에서 공간에 맞춰 자연스럽게 정렬되도록 반응형 보장.

---

## 12. 모바일 퍼스트 및 반응형 리플로우 전역 규격

### 12.1 목적 및 설계 원칙
- **유동적 흐름(Fluid Content) 원칙**:
  - 텍스트와 카드를 인위적인 고정 박스에 가두지 않고 가용 공간에 따라 자연스럽게 흐르도록 구성.
  - 컨테이너의 가용 폭에 따라 카드 배열이 3열, 2열, 1열로 자동 적응하는 유동 리플로우 전면 적용.

### 12.2 주요 컴포넌트별 반응형 UX 사양
1. **대출 조건 입력 폼 (`LoanForm.tsx`)**:
   - 좁은 가용 폭에서도 헤더 타이틀이 글자 단위로 쪼개지지 않도록 정돈.
   - 프리셋 칩들은 텍스트 길이에 맞춰 자연스럽게 다음 줄로 흐르도록 배치하여 찌그러짐 방지.
2. **대출 요약 카드 (`LoanSummaryCards.tsx`)**:
   - 우측 패널 가용 폭에 따라 1열 또는 유동 그리드로 자동 재배치.
3. **3대 상환방식 동시 비교 카드 (`LoanComparisonCard.tsx`)**:
   - 가용 폭에 따라 카드가 1~3열로 자동 적응하며 최소 가독 너비 유지.
   - 하단 수치 영역은 라벨과 금액을 상하 세로 1열로 배치하여 큰 금액도 잘림 없이 온전히 표시.
4. **연복리 요약 카드 (`SummaryCards.tsx`)**:
   - 최종 수령액 메인 카드를 최상단에 강조 배치하고, 하단 3단 서브 카드는 단일 모드 시 3열 / 비교 모드 시 1열 세로 배치로 화면 분할 시에도 정보 가독성 보장.
5. **대형 듀얼 카드 (`DualExchangeCard.tsx`, `DualConverterCard.tsx`)**:
   - 모바일 좁은 화면에서 드롭다운 셀렉트와 복사 버튼, 라벨이 겹치거나 넘치지 않도록 가변 폭 최적화.
6. **연봉 실수령액 계산기 (`SalaryApp.tsx`, `SalarySummaryCards.tsx`, `SalaryChartDashboard.tsx`, `DeductionBreakdownTable.tsx`)**:
   - **모바일 (<768px)**:
     - 좌측 폼과 우측 대시보드가 단일 열(`grid-cols-1`) 수직 스택으로 전개되어 가로 스크롤 없이 한 손 조작 가능.
     - 3단 서브 요약 카드가 세로 1열(`grid-cols-1`)로 유동 리플로우되며, 복사 버튼이 수치 하단으로 자연스럽게 감김.
     - 6대 공제 명세표는 음수 마진(`-mx-5`)과 `overflow-x-auto`를 적용하여 뷰포트 넘침 없이 부드러운 스와이프 보장.
   - **태블릿 (768px ~ 1023px, `md`)**:
     - 네비게이션은 모바일 드로어를 유지하여 768px 가용 폭을 넓게 활용.
     - 본문 가용 폭 720px에 맞춰 서브 요약 카드는 3열 가로 그리드(`sm:grid-cols-3`), 공제 비중 도넛 차트는 좌우 2열 분할(`@xl:grid-cols-12`: 차트 6열, 범례 6열)로 레이아웃 전환.
   - **데스크톱 (>=1024px, `lg`)**:
     - 좌측 고정 사이드바(`w-64`, 256px)와 우측 메인 뷰포트 12컬럼 그리드(`lg:col-span-5` 입력 폼 + `lg:col-span-7` 결과 대시보드)의 2열 레이아웃 완성.
     - **컨테이너 쿼리(`@container`) 기반 내부 최적화**: 1024px 뷰포트에서 사이드바(256px) 제외 후 5:7 분할 시 발생하는 좁은 열 너비(~290px / ~406px)에 맞춰 내부 컴포넌트가 지능적으로 적응:
       - **인적공제 카드 (`SalaryForm`)**: 좁은 폼 열에서는 1열 스택, 가용 폭 확보 시 2열 그리드로 적응하며, 레이블과 인원수 수치에 `whitespace-nowrap` 적용하여 불필요한 줄바꿈 방지.
       - **공제 비중 차트 (`SalaryChartDashboard`)**: 컨테이너 폭 576px 미만(`@xl` 미만)에서는 도넛 차트 상단 배치 및 하단 범례 전폭 배치로 전환하여 6대 항목명·비율·금액의 단일 행 정렬(`whitespace-nowrap`) 보장. 또한 중앙 고정 텍스트(`z-0`, `pointer-events-none`)와 차트 레이어(`z-10`), 툴팁 래퍼(`z-50`)의 명시적 쌓임 맥락(Stacking Context)을 확립하여 마우스 호버 시 툴팁이 중앙 텍스트에 가려지는 현상 원천 차단.
       - **요약 카드 (`SalarySummaryCards`)**: 금액 수치와 원화 단위에 `whitespace-nowrap` 적용하여 금액과 단위 분리 줄바꿈 차단.
       - **공제 명세표 (`DeductionBreakdownTable`)**: 컨테이너 폭에 따라 타이틀과 전환 탭의 상하 스택/좌우 배치가 유동 전환되어 타이틀 줄바꿈 및 텍스트 찌그러짐 원천 차단.

---

## 13. 금융 및 생활 상식 안내 카드 규격 (`InfoCard`)

### 13.1 목적 및 공통 설계 사양
- 각 계산기 하단에 유용한 상식, 계산 공식, 세무 및 금융 유의사항을 압축 요약 제공하여 서비스 신뢰도와 검색엔진 SEO 가치를 동시에 확보.
- 가독성 높은 카드 형태 배치, 단정한 텍스트 및 표준 라인 아이콘 적용, 컬러 이모지 배제.

### 13.2 모듈별 핵심 콘텐츠 요약
1. **연복리 계산기 (`CompoundInfoCard.tsx`)**:
   - 72의 법칙: 원금이 2배가 되는 시간 ≈ `72 ÷ 연수익률(%)` (예: 연 7% 시 약 10년)
   - 복리의 마법: 이자에 이자가 붙어 시간이 지날수록 자산이 기하급수적으로 증식
   - 절세 계좌 활용: 일반과세(15.4%) 대비 ISA(9.9% 분리과세) 등 세금 이연 효과
   - 금융소득 종합과세: 연간 이자·배당소득 합계 2,000만 원 초과 시 종합과세 합산
2. **단위 변환기 (`UnitInfoCard.tsx`)**:
   - 넓이 상식: 국민평형 84㎡(약 25.4평)의 유래 및 1평(3.305785㎡) 기준
   - 무게 상식: 순금 1돈(3.75g, 10돈=1냥), 고기 1근(600g, 채소 1근=400g 또는 375g)
   - 부피 및 길이 상식: US 액량 갤런(3.785L), 1인치(2.54cm), 1척/자(30.3cm)
3. **환율 계산기 (`ExchangeInfoCard.tsx`)**:
   - 환전 수수료 구조: 매매기준율 vs 현찰 살때/팔때 스프레드
   - 환전 팁: 주요 은행 모바일 앱 환전(최대 90% 우대) vs 공항 환전소(수수료 100%)
   - 여행자 면세 한도: 기본 면세 범위 $800, 술 2병(합산 $400 이하, 2L 이하), 담배 1보루, 향수 100mL
4. **대출 이자 계산기 (`LoanInfoCard.tsx`)**:
   - 대출 핵심 규제 용어: DSR(총부채원리금상환비율), DTI(총부채상환비율), LTV(주택담보대출비율) 한 줄 요약
   - 상환방식 선택 가이드: 초기 상환 부담이 적은 방식(원리금균등) vs 총 이자를 최소화하는 방식(원금균등)
   - 중도상환수수료 및 팁: 대출 실행 3년 경과 시 수수료 전액 면제, 신용도 개선 시 금리인하요구권 적극 활용
5. **연봉 실수령액 계산기 (`SalaryInfoCard.tsx`)**:
   - 2026년 4대 사회보험 요율: 국민연금 4.5%(상한 277,650원), 건강보험 3.545%, 장기요양 건보의 12.95%, 고용보험 0.9%
   - 간이세액표와 연말정산: 매월 공제되는 소득세는 표준적 추정치이며, 연말정산(공제 증빙)을 통해 최종 환급 또는 추가 납부 결정
   - 비과세 식대 팁: 2023년부터 월 10만 원에서 20만 원으로 상향되어 연간 최대 240만 원의 소득세 및 4대보험 비과세 혜택 가능
6. **BMI & 비만도 계산기 (`BmiInfoCard.tsx`)**:
   - BMI 정의와 KSSO 기준: 체질량지수($kg/m^2$) 산출 원리 및 동양인 맞춤 대한비만학회 기준(비만 25 이상) 도입 이유
   - BMI의 한계점: 체지방률과 근육량(골격근량) 미반영 한계 (보디빌더 및 고령자 판정 주의)
   - 복부 비만과 허리둘레 기준: 한국 성인 기준 남성 90cm 이상, 여성 85cm 이상 시 내장지방/대사증후군 주의
   - 건강 체중 감량 원칙: 한 달에 1 \~ 2kg 서서히 감량, 극단적 단식 지양 및 근력 운동 병행

---

## 14. AI 에이전트 실행 프로토콜 및 작업 규칙 (Agent Execution Protocol)

모든 AI 코딩 어시스턴트 및 자동화 에이전트는 본 프로젝트의 안정성과 투명한 협업을 위해 다음 4단계 실행 프로토콜을 철저하게 준수해야 합니다.

### 14.1 4단계 작업 실행 워크플로우 (Core Workflow)

1. **Step 1: 작업 방향 다각화 제시 (Direction Proposal)**
   - 사용자의 요구사항을 접수하면, 코드를 바로 수정하거나 작업을 임의로 시작하지 않는다.
   - 문제 해결 또는 기능 구현을 위한 현실적인 **작업 방향(접근 방식, 아키텍처, 장단점 등)을 최소 2~3개 명확히 정리하여 사용자에게 먼저 제시** 한다.

2. **Step 2: 선택 내용 PRD 작성 및 착수 승인 (PRD Documentation & User Approval)**
   - 사용자가 제시된 방향 중 하나를 선택하거나 수정한 합의 내용을 **반드시 `./PRD.md`에 먼저 공식 요구사항 및 설계 규격으로 작성/반영** 한다.
   - PRD 업데이트 완료 후, 사용자에게 변경 내용을 공유하고 **명시적인 승인(Approval)을 받은 뒤에만 실제 코드 작업에 착수** 한다.

3. **Step 3: 구현 완료 및 사용자 검증 확인 (Implementation & User Verification)**
   - 합의된 PRD 사양에 따라 구현을 완료하고, 관련 테스트(빌드 검증, 단위 테스트 등)를 자체 검증한다.
   - 작업이 완료되면 결과 화면 및 변경 요약을 **사용자에게 보고하고, 사용자로부터 직접 확인(Review & Confirm)을 받는다**.

4. **Step 4: 최종 확인 완료 후 커밋 및 변경 이력 기록 (Commit & Changelog)**
   - 사용자의 최종 확인이 완료된 후에만 깃 컨벤션에 맞추어 **깃헙 커밋을 생성하고 체인지 로그(CHANGELOG 또는 릴리즈 노트)를 작성** 한다.
   - 사용자의 최종 확인 전에는 임의로 커밋을 생성하거나 작업을 종결짓지 않는다.

