# 변경 이력 (CHANGELOG)

모든 주요 변경 사항은 본 문서에 기록됩니다.
버전 체계는 [Semantic Versioning (SemVer)](https://semver.org/)을 준수합니다.

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
