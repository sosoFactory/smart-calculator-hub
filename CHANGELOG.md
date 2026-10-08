# 변경 이력 (CHANGELOG)

모든 주요 변경 사항은 본 문서에 기록됩니다.
버전 체계는 [Semantic Versioning (SemVer)](https://semver.org/)을 준수합니다.

## [1.15.10] - 2026-10-08

### Feat
- **전방위 SEO 고도화 및 글로벌 시맨틱 푸터(`GlobalFooter`) 탑재**:
  - **`sitemap.xml` 최종 수정일(`lastmod`) 명시**: 11대 전 계산기, 개발자 도구, 홈 화면 총 12개 엔드포인트 전체에 W3C 최신 수정일(`<lastmod>2026-10-08</lastmod>`)을 일괄 명시하여 검색엔진 재색인 우선순위 최적화.
  - **구글 SERP 빵부스러기 스키마(`BreadcrumbList`) JSON-LD 동적 주입**: [PageMetaUpdater.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/components/common/PageMetaUpdater.tsx)에 `@graph` 규격을 적용하여 `SoftwareApplication` 스키마와 함께 `BreadcrumbList`(`홈 > [계산기 이름]`)를 복합 주입하여 검색 결과 리치 스니펫 가독성 극대화.
  - **네이버/빙 검색 엔진 키워드 동적 메타태그(`meta[name="keywords"]`) 주입**: 각 계산기별 세부 타깃 키워드를 DOM 헤더에 실시간 동기화.
  - **미출시/플레이스홀더 라우트(`status: 'coming-soon'`) `noindex, follow` 방어**: 빈약한 콘텐츠(Thin Content) 색인 페널티를 원천 차단하고 일반 계산기 복귀 시 `index, follow`로 안전하게 복원.
  - **`index.html` 표준 `robots` 메타태그 보강**: `max-image-preview:large, max-snippet:-1, max-video-preview:-1`을 명시하여 소셜/검색 대형 이미지 미리보기 및 리치 스니펫 활성화.
  - **글로벌 시맨틱 푸터([GlobalFooter.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/components/navigation/GlobalFooter.tsx)) 신설**: 모바일 및 데스크톱 환경 전체에서 11대 계산기 및 홈 화면으로 통하는 시맨틱 `<Link>` 내부 링크 그래프(Link Equity)를 구축하고 프라이버시 원칙 및 카피라이트 명시.

## [1.15.9] - 2026-10-08

### Refactor
- **전체 코드베이스 컴포넌트/포맷터 중복 제거 및 공통화**:
  - **차트 Y축 원화 단위 포맷터 통합 (`formatChartAxisWon`)**:
    - [formatters.ts](file:///c:/Users/hakso/_work/smart-calculator/www/src/utils/formatters.ts): 계산기마다 중복 작성되어 있던 `1억`, `5000만`, `0` 단위 변환 함수를 `formatChartAxisWon`으로 표준화.
    - [LoanChartDashboard.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/calculators/loan-calculator/components/LoanChartDashboard.tsx), [SalaryChartDashboard.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/calculators/salary-calculator/components/SalaryChartDashboard.tsx), [PartTimeChartDashboard.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/calculators/part-time-calculator/components/PartTimeChartDashboard.tsx), [GoalChartCard.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/calculators/goal-calculator/components/GoalChartCard.tsx), [ChartDashboard.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/calculators/compound-interest/components/ChartDashboard.tsx), [CashFlowCharts.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/calculators/cashflow-calculator/components/CashFlowCharts.tsx)의 Y축 `tickFormatter` 일원화.
  - **차트 다크 툴팁 컴포넌트 공통화 (`ChartTooltipCard`)**:
    - [ChartTooltipCard.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/components/common/ChartTooltipCard.tsx): Recharts 차트 호버 툴팁의 반투명 다크 컨테이너(`bg-[#15171a]/95`), 헤더 라벨, 키-값 리스트 규격을 표준 컴포넌트로 공통화하고 전 계산기 차트에 일괄 적용.
  - **계산 결과 복사 버튼 일원화 (`CopyResultButton`)**:
    - [CopyResultButton.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/components/common/CopyResultButton.tsx): `useClipboard` 훅 기반의 통일된 클립보드 복사 버튼 컴포넌트 제작(일반 버튼 모드 및 `size="icon"` 툴팁 모드 동시 지원).
    - 계산기별로 개별 관리되던 `copied` 상태 및 중복 툴팁 로직 제거 ([DualExchangeCard.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/calculators/exchange-rate/components/DualExchangeCard.tsx), [MultiExchangeGrid.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/calculators/exchange-rate/components/MultiExchangeGrid.tsx), [DualConverterCard.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/calculators/unit-converter/components/DualConverterCard.tsx), [MultiResultGrid.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/calculators/unit-converter/components/MultiResultGrid.tsx)).
  - **결과 서머리 다크 히어로 카드 공통화 (`ResultHeroCard`)**:
    - [ResultHeroCard.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/components/common/ResultHeroCard.tsx): 고대비 블랙 배경(`#15171a`), 상단 라벨/뱃지, 주요 결과 수치/단위, 액션 슬롯을 지원하는 다크 히어로 카드 공통화.
    - [LoanSummaryCards.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/calculators/loan-calculator/components/LoanSummaryCards.tsx), [SalarySummaryCards.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/calculators/salary-calculator/components/SalarySummaryCards.tsx), [GoalSummaryCards.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/calculators/goal-calculator/components/GoalSummaryCards.tsx), [PartTimeSummaryCards.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/calculators/part-time-calculator/components/PartTimeSummaryCards.tsx), [CashFlowSummaryCards.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/calculators/cashflow-calculator/components/CashFlowSummaryCards.tsx), [SummaryCards.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/calculators/compound-interest/components/SummaryCards.tsx), [BmiSummaryCards.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/calculators/bmi-calculator/components/BmiSummaryCards.tsx), [AgeTab.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/calculators/date-calculator/components/AgeTab.tsx), [DDayTab.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/calculators/date-calculator/components/DDayTab.tsx), [DateDiffTab.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/calculators/date-calculator/components/DateDiffTab.tsx)에 전면 도입.
  - **FormHeader 격리 유지**: 사용자의 의도적 제외 지침을 준수하여 탭별 `FormHeader`는 억지 주입 없이 개별 유지.

## [1.15.8] - 2026-10-08

### Fixed
- **알바 급여 계산기 차트 툴팁 텍스트 미노출 버그 수정 및 전 차트 툴팁 안정화**:
  - `PartTimeChartDashboard.tsx`: Recharts 기본 툴팁의 내부 텍스트 색상 누락으로 발생하던 어두운 배경 위 텍스트 미노출 문제를 연봉 계산기 검증 규격과 동일한 고대비 커스텀 툴팁(`content={...}`)으로 전면 교체하여 해결.
  - 전 계산기 차트(`LoanChartDashboard.tsx`, `GoalChartCard.tsx`, `CashFlowCharts.tsx`, `ChartDashboard.tsx`, `PartTimeChartDashboard.tsx`)의 `<Tooltip>`에 `wrapperStyle={{ zIndex: 50, pointerEvents: 'none' }}`를 일괄 적용하여 호버 깜빡임(flickering) 및 레이어 충돌 원천 차단.

## [1.15.7] - 2026-10-08

### Refactor
- **금액 입력 컴포넌트(`NumericInput`) 내부 좌측 '정정' 캡슐 버튼 표준화**:
  - `NumericInput.tsx`: 가로로 넓은 금액 인풋의 좌측 여백을 활용하여, 내부 좌측(`left-2.5`)에 `RotateCcw` 아이콘과 '정정' 텍스트가 결합된 미니 캡슐 버튼 탑재. 금액이 0보다 클 때만 부드럽게 페이드인되며 원클릭 `0원` 리셋 제공.
  - 전 계산기([LoanForm.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/calculators/loan-calculator/components/LoanForm.tsx), [GoalForm.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/calculators/goal-calculator/components/GoalForm.tsx), [CashFlowForm.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/calculators/cashflow-calculator/components/CashFlowForm.tsx), [SalaryForm.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/calculators/salary-calculator/components/SalaryForm.tsx), [QuickAmountButtons.tsx](file:///c:/Users/hakso/_work/smart-calculator/www/src/calculators/compound-interest/components/QuickAmountButtons.tsx))의 하단 프리셋 행에서 중복된 '정정' 버튼을 정리하고, 순수 증액 칩 행으로 일원화.
- **대출이자 계산기 연 대출 금리 입력 컴포넌트 일원화 (규칙 준수)**:
  - "금액은 `NumericInput`, 비율/기간은 `Slider`" 단일 원칙에 맞춰 `LoanForm.tsx`의 대출 금리 입력을 `NumericInput`에서 슬라이더(`Slider`, 0.1% ~ 15.0%, step 0.1%) + 주요 금리 프리셋 칩(`3.2% 특판`, `3.8% 주담대`, `4.5% 전세대출`, `5.5% 신용대출`)으로 전면 전환.

## [1.15.6] - 2026-10-07

### Fixed
- **파이어 현금흐름 주기별 명세표 모바일 마이너스 부호 개행 분리 버그 및 테이블 레이아웃 수정**:
  - `CashFlowTable.tsx`에 모바일 엣지 투 엣지 스크롤 래퍼(`-mx-5 sm:mx-0 px-5 sm:px-0`) 및 최소 너비(`min-w-[500px]`) 적용.
  - 전 헤더 및 데이터 셀에 `whitespace-nowrap`을 적용하여 예상 세금 음수 금액(`-₩4,368,794`)에서 `-` 기호만 윗줄로 튕겨 나가는 소프트 랩 현상 및 우측 열 축소/잘림 문제 원천 차단.
- **안드로이드 모바일 PWA 새로고침 토스트 실시간 격발 및 지속 시간 개선**:
  - `PWAUpdateToast.tsx`에 네이티브 `ServiceWorkerRegistration` 직접 감시 로직 도입 (`reg.waiting` 즉시 감지 및 `reg.installing`의 `statechange` 다운로드 완료 실시간 추적).
  - 실시간 폴링 주기를 30초로 단축하고 페이지/계산기 탭 이동 시 즉시 업데이트 검사 추가.
  - "지금 업데이트" 클릭 시 `reg.waiting.postMessage({ type: 'SKIP_WAITING' })` 직접 전송으로 지연 없는 즉시 활성화 보장.
  - 토스트 지속 시간을 무제한(`duration: Infinity`)으로 설정하여 사용자가 직접 조작할 때까지 상시 유지되도록 개선.

## [1.15.5] - 2026-10-07

### Fixed
- **파이어 현금흐름 및 알바 급여 도넛 차트 툴팁 레이어 겹침 버그 수정**:
  - `CashFlowCharts.tsx` 및 `PartTimeChartDashboard.tsx`에서 도넛 가운데 글씨 레이어를 차트 앞에 배치하도록 DOM 마크업 순서를 조정.
  - 마우스 호버 시 뜨는 Recharts 툴팁이 도넛 중앙 텍스트 밑으로 가려지던 문제를 `z-index` 충돌 없이 자연스러운 브라우저 렌더링 스택으로 완벽하게 해결.

## [1.15.4] - 2026-10-02

### Added
- **네이버 서치어드바이저(Naver Search Advisor) 사이트 소유권 확인 메타 태그 추가**:
  - `index.html` 내 `<meta name="naver-site-verification" content="4ef100228466fd76bb27d955ed3a18de0c0cc0fe" />` 태그 등록으로 네이버 검색엔진 수집 및 서치어드바이저 소유권 인증 지원.

## [1.15.3] - 2026-10-02

### Added
- **구글 서치 콘솔(Google Search Console) 사이트 소유권 확인 메타 태그 추가**:
  - `index.html` 내 `<meta name="google-site-verification" content="Kc1VYlBdL45HnSEy1pQCv_vF4xmYAMKemuU6vQ5LTjg" />` 태그 등록으로 구글 검색 색인 및 서치 콘솔 소유권 인증 지원.

## [1.15.2] - 2026-10-01

### Refactor
- **공통 클립보드 훅 분리 (`useClipboard`)**:
  - `BaseTab`, `CssUnitTab`, `ColorTab` 3개 탭에 분산되어 있던 복사 로직과 타이머 피드백 상태를 단일 공통 훅(`src/hooks/useClipboard.ts`)으로 캡슐화.
  - 브라우저 비동기 복사 실패 시 안전한 에러 핸들링 및 타이머 자동 정리(Cleanup) 보장, 단위 테스트 100% 검증.
- **디자인 시스템 및 컴포넌트 표준화**:
  - `CssUnitTab`의 루트 폰트 크기(14/16/18px) 및 실무 빈출 픽셀 프리셋(4~64px) 버튼을 디자인 시스템 표준 컴포넌트인 `SelectableChip`으로 전면 교체하여 일관된 인터랙션 및 상태 스타일 제공.
- **도메인 타입 안전성 강화**:
  - 진법 기수를 원시 `number` 대신 `SupportedRadix = 2 | 8 | 10 | 16` 유니온 타입으로 정의하여 타입 안전성 확보.
- **진수 변환 표준 접두사 기본 복사 적용**:
  - 복사 버튼 클릭 시 프로그래밍 코드에 즉시 붙여넣을 수 있도록 각 진법의 표준 접두사(16진수 `0x`, 2진수 `0b`, 8진수 `0o`)를 기본 포함하여 클립보드에 복사되도록 편의성 개선.

### Added
- **PRD 공식 사양 등재**:
  - 실제 구현 및 사용성 검증을 거친 네이티브 컬러 피커, 픽셀 프리셋 칩, 비트 팝카운트(Popcount), 탭 딥링크(`?tab=`)를 PRD §3.11 및 데이터 모델(§4.13)에 공식 사양으로 반영.

## [1.15.1] - 2026-10-01

### Refactor
- **디자인 시스템 및 컴포넌트 표준화**:
  - 개발자 도구 탭 컴포넌트 전반에 걸쳐 공통 표준 `Input` 컴포넌트 전면 적용 (`BaseTab`, `CssUnitTab`, `ColorTab`).
  - 개발자 도구 하단 안내 카드(`DevToolsInfoCard`)를 전 계산기 공통 표준 컴포넌트인 `InfoCard` 규격으로 일원화하여 디자인 파편화 제거.
- **색상 코드 변환 탭(`ColorTab`) UX 고도화**:
  - HEX 입력 필드 왼쪽에 un-deletable `#` 프리픽스를 고정하고, `#`가 포함된 코드를 붙여넣어도 16진수 문자만 정제(`sanitizeHexInput`)하여 반영.
  - 상단 대형 스와치 카드에서 혼란을 유발하던 복사 버튼 바를 제거하고, 명확한 '컬러 피커 선택' 트리거와 WCAG AA 명암비 대비율 뱃지로 역할 단순화.
  - 하단 입력 영역(HEX, RGB, HSL) 상단에 라벨과 복사 버튼을 `BaseTab`과 동일한 패턴으로 재배치하여 입력과 복사 인터랙션 명확화.
- **CSS 단위 변환 탭(`CssUnitTab`) 단일 통합 및 단위 정제**:
  - 탭 명칭을 다른 탭과 일관되도록 `'CSS 단위 환산'` ➔ `'CSS 단위 변환'`으로 통일.
  - 상단 3단 서브 메트릭과 하단 그리드의 중복을 제거하고 단일 통합 카드 그리드로 개편.
  - 기준 해상도가 임의적인 뷰포트 단위(`vw`, `vh`) 및 브라우저 환경에서 실제 모니터 DPI를 알 수 없어 왜곡되는 물리 단위(`in`, `mm`)를 배제하고, 실무에서 100% 신뢰할 수 있는 4대 단위(`EM`, `%`, `PT`, `Tailwind Spacing`)에 집중.

## [1.15.0] - 2026-10-01

### Added
- 신규 11번째 계산기 모듈 **개발자 도구 (Dev Tools, `/devtools`)** 공식 론칭:
  - **진수 변환기 (`BaseTab`)**: 2진수(0b)·8진수(0o)·10진수·16진수(0x) 실시간 양방향 변환, BigInt 기반 고밀도 비트 무결성 보장, 4비트 Nibble 단위 가독성 포맷팅, 원클릭 클립보드 복사.
  - **CSS 단위 환산기 (`CssUnitTab`)**: 루트(HTML) 폰트 크기 변경(14/16/18px 프리셋 및 커스텀), px ↔ rem/em 실시간 상호 환산, Tailwind CSS spacing 클래스 힌트 제공, 인쇄 포인트(pt) 지표 산출, 실무 빈출 픽셀 프리셋 칩.
  - **색상 코드 변환기 (`ColorTab`)**: 대형 컬러 스와치 프리뷰, 네이티브 컬러 피커 연동, HEX·RGB·HSL 상호 자동 변환 및 동기화, WCAG AA 가독성 명암비(4.5:1 이상) 실시간 검증 및 텍스트 색상 추천.
  - **개발자 상식 패널 (`DevToolsInfoCard`)**: 컴퓨터 진법 체계(Nibble/Byte), CSS rem vs em 설계 가이드, RGB/HSL 디지털 색상 모델 및 웹 접근성 지침.
  - Definition of Done 완료: 라우팅 연동, SEO 메타데이터/JSON-LD 구조화 데이터 등록, `sitemap.xml` 등재, 사이드바/홈 시맨틱 링크 연결.

## [1.14.4] - 2026-10-01

### Fixed
- 메인 대시보드 카드 즐겨찾기 별 토글 버튼에 브라우저 기본 title 속성을 배제하고 공통 Tooltip 컴포넌트 적용.

## [1.14.3] - 2026-09-30

### Fixed
- 즐겨찾기 별 아이콘 색상 클래스 단일화 및 채움(솔리드)/비움(외곽선) 상태 구분 일원화.

## [1.14.2] - 2026-09-30

### Changed
- Ghost 디자인 시스템 기준 전역 모노크롬 잉크 계층 일원화 및 카드 아이콘 다색상 난립 배제.
- 하드코딩 헥스코드 제거 및 과도한 라임 하이라이트 절제.

## [1.14.1] - 2026-09-30

### Refactor
- 홈 대시보드 중복 즐겨찾기 탭 제거 및 단일 그리드 최우선 정렬(Pin-to-Top) 단독 표준화.
- 즐겨찾기 별 아이콘 순수 모노크롬 적용.

## [1.14.0] - 2026-09-30

### Added
- 자주 쓰는 계산기(즐겨찾기) 기능 신설 (홈 카드/헤더 원터치 토글 및 사이드바 바로가기 연동).
- SemVer 버전 체계 정규화.

## [1.9.54] - 2026-09-30

### Refactor
- 홈 대시보드 즐겨찾기 단일 그리드 최우선 정렬(Pin-to-Top) 적용 및 별도 상단 섹션 제거.

## [1.9.53] - 2026-09-30

### Feat
- 자주 쓰는 계산기(즐겨찾기) 기능 신설 및 로컬 스토리지 연동.

## [1.9.52] - 2026-09-30

### Fixed
- 안드로이드 설치형 PWA(WebAPK) 백그라운드 복귀 시 서비스 워커 자동 업데이트 감지 및 Vercel no-cache 헤더 적용.

## [1.9.51] - 2026-09-29

### Fixed
- 서브 요약 지표 카드(SubMetricCard) 타이틀 말줄임(...) 원천 방지 및 뱃지·캡션 데이터 배치 최적화.

## [1.9.50] - 2026-09-29

### Refactor
- 전 계산기 결과 하단 3단 서브 요약 지표 공통 컴포넌트(`SubMetricCard`) 구축 및 레이아웃·색상·계층 일관성 전면 통일.

## [1.9.49] - 2026-09-29

### Refactor
- 전 계산기 하단 추가정보 카드(InfoCard) 풀위드 단독 배치 통일 및 Ghost 디자인 토큰 전면 정돈.

## [1.9.48] - 2026-09-29

### Added
- 10번째 신규 계산기: '파이어 현금흐름 계산기(FIRE Cash Flow Calculator)' 출시.

## [1.9.47] - 2026-09-29

### Changed
- 목표 자산 역산 계산기 조기 달성 시점 역산, 안전 인출액 시뮬레이션 및 차트 정상화.

## [1.9.46] - 2026-09-25

### Fixed
- 모바일 최적화 하이브리드 DatePicker 개편 및 캘린더 드롭다운 UI 버그 해결.

## [1.9.45] - 2026-09-25

### Changed
- 전체 코드 리뷰 기반 아키텍처 비대칭 해소 및 딥링크 전 계산기 확장.

## [1.9.44] - 2026-09-25

### Changed
- shadcn/ui 기반 Calendar, Popover 및 Ghost DatePicker 공통 컴포넌트 전면 도입.

## [1.9.43] - 2026-09-25

### Changed
- 디데이 및 날짜 연산 원스톱 통합 개편 (D-Day & Date Math One-Stop Integration).

## [1.9.42] - 2026-09-25

### Refactor
- 날짜 & 디데이 계산기 공통 컴포넌트 표준화 및 Ghost 단일 디자인 문법 완전 통일.

## [1.9.39] - 2026-09-25

### Fixed
- 목표 자산 차트 3단 누적 스택 중복 합산 버그 수정 (Goal Chart Stacked Bug Fix).

## [1.9.38] - 2026-09-25

### Refactor
- 전 계산기 결과 대시보드(메인 & 3단 서브 카드) 단일 디자인 문법 완전 통일.

## [1.9.37] - 2026-09-25

### Refactor
- 전 계산기 폼 헤더 및 결과 카드 디자인 문법 완전 통일 (Global UI/UX Design System Alignment).

## [1.9.36] - 2026-09-25

### Refactor
- 알바 계산기 UI/UX 표준 규격 일원화 및 폼 간소화 (Part-Time UI/UX Standardization).

## [1.9.35] - 2026-09-24

### Added
- 알바 급여 & 주휴수당 계산기 정식 출시 (Part-time Wage & Holiday Allowance Calculator).

## [1.9.34] - 2026-09-17

### Changed
- PWA 서비스 워커 대기 상태 즉시 감지 및 업데이트 신뢰성 강화 (PWA Update Detection Fix).

## [1.9.33] - 2026-09-17

### Changed
- Ghost 디자인 시스템 완벽 통합 및 풀 뎁스 다크모드 전면 개편 (Ghost Dark Full Depth).

## [1.9.32] - 2026-09-16

### Refactor
- 전 계산기 UI/UX 표준 규격 일원화 및 Ghost 일관성 개편 (Global UI/UX Standardization).

## [1.9.31] - 2026-09-16

### Added
- 7번째 신규 계산기 모듈: 목표 자산 역산 계산기 출시 (Goal Target Calculator `/goal`).

## [1.9.29] - 2026-09-15

### Changed
- 연복리 연도별 상세 흐름표 모바일 CSV 다운로드 버튼 반응형 최적화 (Mobile CSV Button Polish).

## [1.9.28] - 2026-09-14

### Docs
- 프로젝트 전반 문서 정합성 점검 및 최신화 정리 (Documentation Consistency & Polish).

## [1.9.27] - 2026-09-14

### Changed
- 전 페이지 일관 모바일 최우선 전역 플로팅 공유 버튼 구축 (Floating Share Button).

## [1.9.26] - 2026-09-14

### Added
- BMI 계산기 증감 단위 1 통일 및 미세 조절 버튼 추가 (BMI Stepper & Step Unification).

## [1.9.25] - 2026-09-14

### Refactor
- 환율 계산기 원화(KRW) 선택 시 기준 환율 표기 개선 (Exchange Rate Display Polish).

## [1.9.24] - 2026-09-13

### Changed
- 금융 3대 계산기 URL 쿼리 기반 딥링크 및 상태 복원 시스템 구축 (Deep Link Query State Sync).

## [1.9.23] - 2026-09-13

### Fixed
- BMI 계산기 디자인 시스템 통일, 스펙트럼 마커 불일치 결함 수정 및 폼 최적화 (BMI Polish & Form UX).

## [1.9.22] - 2026-09-13

### Refactor
- PWA 설치/가이드 버튼 역할 분리 및 설치 가이드 모달 개선 (PWA Install Flow Polish).

## [1.9.21] - 2026-09-13

### Added
- PWA 신규 버전 업데이트 알림 토스트 활성화 및 TODO 완료 표기 전면 통일 (PWA Update Toast & Docs Sync).

## [1.9.20] - 2026-09-13

### Changed
- 전 페이지 상단 글로벌 헤더 fixed 고정 및 홈 화면 하단 PWA 배너 삭제 (Header Fixed & Clean Home).

## [1.9.19] - 2026-09-13

### Refactor
- 메인 홈 대시보드 본문 중복 타이틀 제거 및 상단 고정 헤더 일원화 (Header & Layout Polish).

## [1.9.18] - 2026-09-13

### Changed
- 메인 홈 대시보드 모바일 스크롤 최소화 및 초슬림 콤팩트 그리드 개편 (Mobile UX & Polish).

## [1.9.17] - 2026-09-13

### Changed
- 메인 홈 화면 대시보드(Home Dashboard) 및 스마트 검색 구축 (UI/UX & Navigation).

## [1.9.16] - 2026-09-13

### Changed
- PWA 모바일 홈 화면 앱 아이콘 풀 블리드 리디자인 (Mobile UX & PWA).

## [1.9.15] - 2026-09-13

### Changed
- Vercel Web Analytics 실시간 방문자 분석 인프라 구축 (Analytics & Ops).

## [1.9.14] - 2026-09-13

### Changed
- 공식 운영 도메인 및 SEO 최적화 인프라 구축 (Production & SEO).

## [1.9.13] - 2026-09-12

### Changed
- 네비게이션 및 헤더 타이틀 라벨(NEW, 인기 등) 전면 제거 (UI/UX Refactoring).

## [1.9.12] - 2026-09-12

### Refactor
- 코드 리뷰 기반 TDD 안티패턴 개선 및 PRD 명세 정합성 확보 (Refactoring & Quality).

## [1.9.11] - 2026-09-12

### Changed
- 에이전트 확장 스킬셋 5종 설치 및 구성 (Customization).

## [1.9.10] - 2026-09-12

### Changed
- 에이전트 실행 프로토콜(GEMINI.md) 및 프로젝트 규칙(rules) 파일셋 구축 (Documentation & Governance).

## [1.9.9] - 2026-09-12

### Refactor
- 전역 데이터 테이블 컴포넌트 표준화 및 Ghost 디자인 시스템 정합성 확보 (UI/UX Refactoring).

## [1.9.8] - 2026-09-12

### Changed
- PWA 인앱 설치 버튼 상시 노출 및 플랫폼별 스마트 설치 가이드 모달 구축 (UX Enhancement).

## [1.9.7] - 2026-09-12

### Added
- 신규 브랜드 로고 적용, PWA 원클릭 설치 버튼 및 shadcn/ui 업데이트 알림 토스트 구축 (Feature).

## [1.9.6] - 2026-09-12

### Docs
- PWA 표준 규격 강화 및 정적 자산·아이콘·테마 정합성 보완 (Fix & Feature).

## [1.9.5] - 2026-09-12

### Refactor
- 연봉 계산기 1024px/모바일 반응형 레이아웃 결함 및 도넛 차트 툴팁 레이어링 개선 (Fix).

## [1.9.4] - 2026-09-12

### Docs
- 연봉 계산기 모바일/태블릿(768)/데스크톱(1024) 3단계 반응형 규격 명문화 (Docs).

## [1.9.3] - 2026-09-12

### Changed
- 연봉 계산기 페이지 폰트 전면 프리텐다드(Pretendard Variable) 단일화 (Refactor).

## [1.9.2] - 2026-09-12

### Refactor
- 전역 프리텐다드(Pretendard Variable) 단일 서체 강제 원칙 및 PRD 표준화 (Docs).

## [1.9.1] - 2026-09-12

### Added
- 공통 숫자 및 금액 입력 컴포넌트(NumericInput) 신설 및 계산기 폼 규격 표준화 (Refactor).

## [1.9.0] - 2026-09-12

### Added
- 2026년 기준 연봉 실수령액 계산기 모듈(SalaryApp) 신규 개발 및 전역 네비게이션 연결 (Feature).

## [1.8.13] - 2026-09-10

### Added
- 공통 숫자 입력 제어 훅(useClampedNumberInput) 신설 및 전 계산기 폼 UX 고도화 (Refactor & UX Polish).

## [1.8.12] - 2026-09-10

### Refactor
- 연복리 계산기 예상 수익률 프리셋 버튼 선택 스타일 일원화 (UI Polish).

## [1.8.11] - 2026-09-10

### Refactor
- 연복리 계산기 입력 폼 표준 인풋(h-11) 전면 통일, 빈 값 입력 지원 및 바운더리 검증 (UI Polish & UX).

## [1.8.10] - 2026-09-10

### Refactor
- 연복리 계산기 입력 폼 프리셋 4개 통일 및 수익률 범위 확장, 3단 서브 카드 디자인 완벽 복원 (Feature & UI Polish).

## [1.8.9] - 2026-09-10

### Changed
- 연복리 요약 카드 디자인 복원 및 전 페이지 반응형 안정화 (UI Polish & Bug Fix).

## [1.8.8] - 2026-09-10

### Refactor
- 카드 헤더 서브 뱃지(Header Meta Badge) 디자인 일원화 및 공통 표준화 (UI Polish).

## [1.8.7] - 2026-09-10

### Changed
- Tabs 컴포넌트 반응형 고정 높이 간섭 해제 및 단위 변환기 1:1 픽셀 복원 (Bug Fix & Pixel-Perfect).

## [1.8.6] - 2026-09-10

### Changed
- shadcn UI 기반 표준 Tabs 컴포넌트 구축 및 전역 통합 (Component Standardization).

## [1.8.5] - 2026-09-10

### Changed
- 컨테이너 쿼리 도입 및 1024px 반응형 공간 재배치 (Container Queries & Fluid Layout).

## [1.8.4] - 2026-09-10

### Fixed
- 대출 상환방식 카드 개선 및 스위치 호버 버그 수정 (TDD Red-Green).

## [1.8.3] - 2026-09-10

### Fixed
- 폼 스위치 토글 규격 표준화 및 버그 수정 (TDD Red-Green).

## [1.8.2] - 2026-09-10

### Changed
- 모바일 퍼스트 및 전 화면 반응형 최적화 (Mobile-First & Responsive Robustness).

## [1.8.1] - 2026-09-10

### Refactor
- 인터랙션 요소 전면 표준화 및 공통 컴포넌트 추상화 (Component Refactoring & DRY).

## [1.8.0] - 2026-09-10

### Added
- 대출이자 & 상환방식 비교 계산기 신규 출시 (Loan Repayment Calculator).

## [1.7.7] - 2026-09-07

### Fixed
- 복리 계산기 금액 입력창 우측 패딩 및 단위 텍스트 겹침 버그 수정 (UI Fix).

## [1.7.6] - 2026-09-07

### Added
- 연복리 계산기 투자 상식 및 유의사항 안내 카드 추가 (Compound Info Card).

## [1.7.5] - 2026-09-07

### Refactor
- 폼 UI 요소 shadcn/ui 컴포넌트 전면 표준화 (Form UI Standardization).

## [1.7.4] - 2026-09-07

### Changed
- 웹 표준 및 웹 접근성(WCAG 2.1 / KWCAG) 강화 적용 (Web Standards & Accessibility).

## [1.7.3] - 2026-09-07

### Changed
- 코드 리뷰 권장 조치 및 라우트 코드 스플리팅 적용 (Route Splitting & Robustness).

## [1.7.2] - 2026-09-07

### Changed
- 테스트 환경 최적화 및 패키지 메타데이터 동기화 (Test Optimization & Metadata Sync).

## [1.7.1] - 2026-09-07

### Refactor
- 전역 단일 컨테이너 너비 표준화 적용 (Global Container Max-Width Standardization).

## [1.7.0] - 2026-09-07

### Changed
- 전역 다크 모드 시스템 및 shadcn UI 모드 토글 버튼 구현 (Global Dark Mode System & Mode Toggle).

## [1.6.5] - 2026-09-07

### Changed
- 전역 페이지 라우트 전환 부드러운 페이드인 애니메이션 구현.

## [1.6.4] - 2026-09-07

### Changed
- 모바일 사이드바 드로어 하드웨어 가속 슬라이드 애니메이션 구현.

## [1.6.3] - 2026-09-07

### Refactor
- 모바일 뷰포트(360px~390px) 텍스트 줄바꿈 및 레이아웃 깨짐 개선.

## [1.6.2] - 2026-09-07

### Refactor
- 단위 변환기 및 환율 계산기 듀얼 카드 UI/UX 디자인 일원화.

## [1.6.1] - 2026-09-07

### Added
- 환율 고시 기준일시 표시 및 백그라운드 자동 동기화 기능 추가.

## [1.6.0] - 2026-09-07

### Added
- 환율 계산기(Currency Exchange) 신규 모듈 출시 (/exchange).

## [1.5.5] - 2026-09-07

### Refactor
- 개별 계산기 및 타이틀 명칭에서 불필요한 수식어 정리 및 표준화.

## [1.5.4] - 2026-09-07

### Changed
- 폰트 베이스라인 패딩 조정 및 UI 텍스트 수직 정렬 정밀 보정.

## [1.5.3] - 2026-09-07

### Changed
- 단위 변환기 카테고리별 1순위 실생활 프리셋 기본 단위 설정.

## [1.5.2] - 2026-09-07

### Refactor
- shadcn/ui Select 컴포넌트 전면 도입 및 네이티브 select 대체.

## [1.5.1] - 2026-09-07

### Refactor
- 전역 설정 파일(site.ts) 도입 및 사이트 브랜드 명칭 일원화.

## [1.5.0] - 2026-09-07

### Added
- 단위 변환기(Unit Converter) 신규 모듈 출시 (/unit).

## [1.4.1] - 2026-09-07

### Fixed
- 사이드바-글로벌 헤더 하단 보더 라인 수평 일치 및 연복리 차트 가독성 보정.

## [1.4.0] - 2026-09-07

### Changed
- Ghost 디자인 시스템 전면 도입 및 shadcn/ui 컬러 토큰 개편.

## [1.3.0] - 2026-09-07

### Added
- PWA(Progressive Web App) 오프라인 캐싱 및 설치 지원.

## [1.2.0] - 2026-09-07

### Added
- shadcn/ui 기반 공통 컴포넌트 시스템 구축.

## [1.0.0] - 2026-09-06

### Added
- 모바일 우선 연복리 계산기 프론트엔드 최초 구축.
