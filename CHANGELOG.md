# 변경 이력 (CHANGELOG)

모든 주요 변경 사항은 본 문서에 기록됩니다.
버전 체계는 [Semantic Versioning (SemVer)](https://semver.org/)을 준수합니다.

## [1.9.26] - 2026-09-14
 
### BMI 계산기 증감 단위 1 통일 및 미세 조절 버튼 추가 (BMI Stepper & Step Unification)
- **체중 슬라이더 증감 단위 1 통일 (`BmiForm.tsx`)**:
  - 체중 슬라이더의 `step` 단위를 기존 `0.5`에서 `1`로 변경하여 신장(1cm)과 체중(1kg) 모두 일관된 1단위로 동작하도록 통일.
  - 슬라이더 드래그 시 1kg 단위 정수(`Math.round(val)`)로 즉시 반영.
- **신장 및 체중 각 1단위 미세 조절 버튼(-1, +1) 추가 (`BmiForm.tsx`)**:
  - 신장(cm) 및 체중(kg) 숫자 입력 필드 좌우에 모바일 터치 친화적 규격(`h-11 w-11`)의 `[-1]`, `[+1]` 스테퍼 버튼 배치.
  - 클릭 시 각각 1cm, 1kg씩 즉각 증감되며, 유효 범위 한계(신장 100 \~ 250cm, 체중 30 \~ 200kg) 도달 시 버튼 자동 비활성화.
- **품질 검증 및 테스트**:
  - `BmiApp.test.tsx`에 신장 및 체중 `-1`, `+1` 버튼 인터랙션 검증 테스트 추가.
  - 총 25개 테스트 스위트, 128개 단위 테스트 100% 통과 (Pass).
  - `package.json`, `src/config/site.ts`, `src/config/site.test.ts`, `PRD.md` 버전 `v1.9.26` 동기화.

## [1.9.25] - 2026-09-14
 
### 환율 계산기 원화(KRW) 선택 시 기준 환율 표기 개선 (Exchange Rate Display Polish)
- **우상단 기준 환율 0달러/0엔 표기 방지 및 국내 금융 관행 표준 역산 표기 적용 (`getExchangeRateText`)**:
  - 원화(`KRW`)가 입력 통화로 선택되었을 때 소수점 2자리 반올림으로 인해 `1 KRW = 0.00 USD` (0달러) 또는 `1 KRW = 0 JPY` (0엔)으로 절사되던 결함을 해결.
  - 한국 금융 환경(네이버, 시중은행, 포털)의 표준 관행에 맞추어 외화 1단위당 원화 가치로 역산 표기 (`1 USD = 1,350 KRW`, `1 EUR = 1,470 KRW` 등).
  - 일본 엔화(`JPY`)의 경우 국내 관행인 100엔 기준으로 자동 환산 표기 (`100 JPY = 900 KRW`).
  - 엔화가 입력 통화인 경우에도 100엔 기준 상대 통화 환율 표기 지원.
- **품질 검증 및 테스트**:
  - `exchangeCalculator.test.ts`에 `getExchangeRateText` 스마트 환율 표기 관련 6개 단위 테스트 추가.
  - 총 25개 테스트 스위트, 127개 단위 테스트 100% 통과 (Pass).
  - `package.json`, `src/config/site.ts`, `src/config/site.test.ts`, `PRD.md` 버전 `v1.9.25` 동기화.

## [1.9.24] - 2026-09-13
 
### 금융 3대 계산기 URL 쿼리 기반 딥링크 및 상태 복원 시스템 구축 (Deep Link Query State Sync)
- **금융 3대 계산기 URL 쿼리 파라미터 실시간 동기화 (`deepLink.ts`)**:
  - `대출이자 계산기 (/loan)`: 원금(`amount`), 금리(`rate`), 대출기간(`years`), 거치기간(`grace`), 상환방식(`method`), 조기상환 조건 URL 동기화.
  - `연복리 계산기 (/compound)`: 초기원금(`principal`), 월적립액(`contribution`), 적립주기(`contribFreq`), 투자기간(`years`), 수익률(`rate`), 복리주기(`compFreq`), 과세유형(`tax`) URL 동기화.
  - `연봉 실수령액 계산기 (/salary)`: 세전금액(`gross`), 지급형태(`type`), 퇴직금(`severance`), 비과세식대(`nonTax`), 부양가족(`family`), 자녀수(`children`) URL 동기화.
- **순수 브라우저 URL 동기화 및 딥링크 복원 흐름**:
  - 불필요한 공유 UI 버튼을 배제하고, 입력값 변경 시 `window.history.replaceState`를 통해 주소창 URL을 조용히 실시간 갱신 (기본값과 동일할 경우 깨끗한 경로 유지).
  - 공유받은 링크로 접속 시 `LocalStorage` 값보다 **URL 쿼리 파라미터가 최우선 적용**되어 폼과 계산 결과가 즉시 로드.
- **적용 대상 원칙 준수**:
  - `BMI 계산기`: 민감 개인 신체 정보 보호를 위해 URL 파라미터화 배제 (기기 `LocalStorage` 전용 안전 보관 유지).
  - `단위 변환기`, `환율 계산기`: 1회성 유틸리티 및 실시간 환율 변동 보호를 위해 제외.
- **품질 검증 및 단위 테스트**:
  - `deepLink.test.ts` (6개), `deepLinkIntegration.test.tsx` (3개) 신규 테스트 추가.
  - 총 25개 테스트 스위트, 121개 단위 테스트 100% 통과 (Pass).
  - `package.json`, `src/config/site.ts`, `src/config/site.test.ts`, `PRD.md`, `TODO.md` 버전 `v1.9.24` 동기화.

## [1.9.23] - 2026-09-13
 
### BMI 계산기 디자인 시스템 통일, 스펙트럼 마커 불일치 결함 수정 및 폼 최적화 (BMI Polish & Form UX)
- **비만도 스펙트럼 마커 위치 불일치 버그 수정 (`BmiGaugeCard`)**:
  - 기존 단순 선형 보간식에서 구간별 비례 보간(Piecewise Linear Interpolation) 공식으로 전환하여, 상단 결과 판정(예: 정상, 과체중)과 하단 스펙트럼 화살표 마커의 위치가 100% 일치하도록 결함 해결.
- **결과 카드 다크 서피스 통일 및 액센트 보더 복원 (`BmiSummaryCards`)**:
  - 대출/예적금 계산기와 동일한 Ghost Ink-Base 다크 서피스(`bg-[#15171a] dark:bg-[#1e293b]`) 및 `@container` 3단 서브 카드 그리드 적용.
  - 결과 카드 상단에 현재 판정 단계의 액센트 컬러 보더 라인(`<div className="absolute top-0 left-0 right-0 h-1.5" />`) 복원.
  - 판정 뱃지(Badge) 색상을 비만도 스펙트럼 게이지 색상(파랑, 에메랄드, 노랑, 주황, 빨강, 보라)과 1:1로 일치 매핑.
- **입력 폼 디자인 통일 및 불필요 요소 제거 (`BmiForm`)**:
  - 공통 표준 `NumericInput`(`suffix="cm"`, `suffix="kg"`) 및 `SelectableChip` 프리셋 버튼 적용.
  - 인풋 상단에 숫자가 중복으로 노출되던 불필요한 라벨 수치 표기 제거.
  - 성인 BMI 계산 및 결과 판정에 영향을 주지 않던 **나이(만 나이) 입력 필드 완전 제거**.
  - 체중 입력 화살표 스텝 단위를 `0.1`에서 `1`(`step="1"`)로 통일하여 화살표 조작성 대폭 향상(소수점 직접 타이핑은 그대로 유지).
- **품질 검증 및 단위 테스트**:
  - 23개 테스트 스위트, 112개 단위 테스트 100% 통과 (Pass).
  - `package.json`, `src/config/site.ts`, `PRD.md`, `TODO.md` 버전 `v1.9.23` 동기화.

## [1.9.22] - 2026-09-13
 
### PWA 설치/가이드 버튼 역할 분리 및 설치 가이드 모달 개선 (PWA Install Flow Polish)
- **사이드바 [앱 설치 가이드] 버튼 명문화 및 모바일 드로어 연동**:
  - `GlobalHeader.tsx`의 우측 상단 버튼은 **[앱 설치]** 로 유지(원클릭 네이티브 설치 또는 미지원 시 가이드 모달 호출).
  - `SidebarDrawer.tsx` 하단 버튼 라벨을 **[앱 설치 가이드]** 로 명문화하여 클릭 시 단계별 가이드 모달이 뜰 것임을 직관적으로 안내.
  - 모바일 환경에서 드로어 내 [앱 설치 가이드] 버튼 클릭 시 사이드바 드로어가 자동으로 닫히도록 `onActionComplete={onCloseMobile}` 연동.
  - **모바일 드로어 닫힘 시 모달 조기 소멸 버그 수정**: 기존에는 모달이 `PWAInstallButton` 자식 컴포넌트로 마운트되어 있어 모바일 드로어가 닫힐 때 버튼과 함께 모달이 즉시 언마운트되는 문제가 발생함. `PWAInstallModal`을 최상위 `App.tsx` 레벨로 단일화하고 `usePWAInstall`에 전역 모달 상태(`globalIsModalOpen`)를 동기화하여, 모바일 드로어가 닫히더라도 모달이 화면에 안정적으로 유지되도록 아키텍처 개편.
- **모달 z-index 결함 및 Stacking Context 완벽 해결 (`PWAInstallModal`)**:
  - 사이드바 `<aside z-20>` 내부에서 마운트되던 모달을 `createPortal(modalContent, document.body)`을 통해 `document.body` 최상위로 마운트.
  - 상단 헤더(`GlobalHeader z-30`)의 페이지 타이틀이 모달 백드롭 위로 뚫고 나오는 CSS 쌓임 맥락(Stacking Context) 결함을 원천 해결하고 전역 최상위(`z-[100]`)로 안정적 노출.
- **모달 내부 설명 문구 개선 및 직접 설치 CTA 액션 버튼 탑재**:
  - 타이틀: *"스마트 계산기 앱 설치 안내"*, 설명: *"홈 화면에 추가하면 브라우저 주소창 없이 풀스크린으로 더 빠르고 편리하게 사용할 수 있습니다."*
  - 네이티브 프롬프트를 지원하는 브라우저(크롬, 안드로이드, 엣지 등)에서는 모달 하단에 Primary 버튼 **[스마트 계산기 앱 지금 설치하기]** 제공 (클릭 시 `deferredPrompt.prompt()` 즉시 호출 및 설치 유도).
  - 미지원 환경(iOS 사파리 등)에서는 '홈 화면에 추가' 3단계 가이드와 **[가이드 확인 완료]** 버튼 제공.
- **PWA 업데이트 토스트 액션 및 닫기 버튼 겹침 결함 해결 (`Toast`, `Toaster`)**:
  - `Toast` 컴포넌트의 우측에 `pr-10`(40px)의 독립적인 안전 여백을 확보하고, 모바일 및 좁은 화면 대응을 위한 `flex-col sm:flex-row items-start sm:items-center gap-3` 반응형 레이아웃 적용.
  - [지금 업데이트] 등 `action` 버튼이 우측 상단 `ToastClose`(X) 닫기 버튼과 시각적·터치 영역상으로 겹치던 결함을 완벽히 해소하고, 모바일에서는 하단 액션 버튼 + 우상단 단독 X 버튼으로 깔끔하게 분리.
- **홈 대시보드 메뉴 카드 해시태그 칩 완전 삭제 (`HomeApp`)**:
  - 홈 화면의 각 계산기 메뉴 카드 내부에 렌더링되던 해시태그(`#복리`, `#수익률` 등) 미니 칩 영역을 완전히 제거.
  - 모바일 2열 콤팩트 카드 그리드에서 카드의 세로 높이를 축소하고 불필요한 시각적 잡음을 제거하여, [아이콘 + 명칭 + 설명 + 시작 링크] 중심의 미니멀한 UI 완성.
- **품질 검증 및 단위 테스트 동기화**:
  - `PWAInstallButton.test.tsx`: "앱 설치 가이드" 라벨, `onActionComplete` 호출, 모달 내 직접 설치 버튼 인터랙션 테스트 추가.
  - 21개 테스트 스위트, 96개 테스트 100% 통과 (Pass).
  - `package.json`, `src/config/site.ts`, `PRD.md`, `CHANGELOG.md` 버전 `v1.9.22` 동기화.

## [1.9.21] - 2026-09-13
 
### PWA 신규 버전 업데이트 알림 토스트 활성화 및 TODO 완료 표기 전면 통일 (PWA Update Toast & Docs Sync)
- **PWA 신규 버전 업데이트 토스트 실동작 활성화 (`registerType: 'prompt'`)**:
  - `vite.config.ts`의 PWA 등록 모드를 `autoUpdate`에서 `prompt`로 전환하여, 신규 배포 시 새 서비스 워커가 대기(`waiting`) 상태에 진입하고 `useRegisterSW`의 `needRefresh` 상태가 정상 트리거되도록 수정.
  - `PWAUpdateToast.tsx`: 서비스 워커 주기적 업데이트 점검(1시간 간격) 및 브라우저 탭 복귀(`visibilitychange`) 시 최신 배포 여부를 점검하는 `r.update()` 자동 트리거 로직 보강.
  - 새 버전 감지 시 화면 하단에 *"새로운 버전이 준비되었습니다"* Ghost Lime 토스트가 팝업되며, **[지금 업데이트]** 버튼 클릭 시 즉시 최신 서비스 워커를 활성화하고 페이지를 새로고침하는 원클릭 업데이트 흐름 완성.
- **TODO 백로그 완료 표기 체계 전면 통일 (`TODO.md`)**:
  - 기존의 혼재되어 있던 표기(신규 기획, 진행 중, 완료 등)를 마크다운 표준 체크박스 `[x]`(완료)와 `[ ]`(예정)으로 전면 통일하여 백로그 가독성 극대화.
- **품질 검증 및 단위 테스트**:
  - `PWAUpdateToast.test.tsx` 단위 테스트 신설 (토스트 미노출 / 노출 / 업데이트 액션 클릭 및 새로고침 검증).
  - 21개 테스트 파일, 95개 단위 테스트 100% 통과 (Pass).
- **문서 및 버전 동기화**:
  - `package.json`, `src/config/site.ts`, `PRD.md`, `README.md`, `TODO.md` 버전 `v1.9.21` 동기화.

## [1.9.20] - 2026-09-13
 
### 전 페이지 상단 글로벌 헤더 fixed 고정 및 홈 화면 하단 PWA 배너 삭제 (Header Fixed & Clean Home)
- **전 페이지 상단 글로벌 헤더 영구 고정 (`Fixed Header`)**:
  - `GlobalHeader.tsx`를 `fixed top-0 left-0 right-0 lg:left-64 z-30`으로 변경하여 모바일 및 데스크톱 모든 페이지에서 스크롤 시 타이틀과 테마 토글이 화면 상단에 일관되게 고정되도록 개선.
  - `App.tsx`의 메인 뷰포트에 `pt-16`을 적용하여 고정 헤더로 인한 콘텐츠 가림을 방지하고 부모 요소의 `overflow-x-hidden` 문제를 원천 해소.
- **홈 화면 하단 오프라인 PWA 가치 제안 배너 삭제**:
  - `HomeApp.tsx` 최하단에 위치하던 "100% 오프라인 PWA · 광고 없는 쾌적한 계산 환경 · 빠른 실시간 연산" 배너 영역 및 `Zap` 아이콘 완전 제거로 미니멀하고 단정한 화면 구성 완성.
- **단위 테스트 및 문서 동기화**:
  - `App.routing.test.tsx`의 홈 비동기 대기 셀렉터를 '전체' 카테고리 버튼으로 안전하게 마이그레이션.
  - 20개 테스트 파일, 93개 단위 테스트 100% 통과 (Pass).
  - `PRD.md`, `README.md`, `TODO.md`, `package.json`, `src/config/site.ts` 버전 `v1.9.20` 동기화.

## [1.9.19] - 2026-09-13
 
### 메인 홈 대시보드 본문 중복 타이틀 제거 및 상단 고정 헤더 일원화 (Header & Layout Polish)
- **페이지 타이틀 상단 고정 일원화**:
  - 홈 화면 본문 내부에 별도로 존재하던 `<h1>계산기 모아보기</h1>` 타이틀을 완전 제거.
  - 상단 글로벌 고정 헤더(`GlobalHeader`)의 타이틀을 `계산기 모아보기`로 일원화하여, 스크롤 시 타이틀이 밀려 올라가지 않고 화면 상단에 안정적으로 고정되도록 개선.
- **모바일 수직 여백 및 뷰포트 최적화**:
  - 본문 타이틀 제거로 확보된 높이만큼 계산기 카드가 화면 최상단으로 올라와, 모바일 첫 화면에서 5대 계산기 카드가 즉시 노출되는 무결한 핏 달성.
- **문서 및 버전 동기화**:
  - `PRD.md`, `README.md`, `package.json`, `src/config/site.ts` 버전 `v1.9.19` 동기화.

## [1.9.18] - 2026-09-13
 
### 메인 홈 대시보드 모바일 스크롤 최소화 및 초슬림 콤팩트 그리드 개편 (Mobile UX & Polish)
- **불필요한 검색창 전면 제거**:
  - 모바일에서 40~50px 높이를 차지하던 검색창을 삭제하여 화면 첫 진입 시 카드가 즉시 보이도록 최적화.
- **모바일 2열 콤팩트 카드 그리드 (`grid-cols-2`)**:
  - 모바일에서 1열로 길게 늘어지던 카드 레이아웃을 정갈한 **2열 콤팩트 타일 그리드**로 개편.
  - 모바일 첫 화면(1화면)에서 스크롤을 거의 하지 않고도 5대 활성 계산기를 한눈에 조망하고 원클릭 탭 가능.
- **헤더 및 푸터 인라인 경량화**:
  - 상단 히어로 헤더를 컴팩트 1줄 스타일로 압축하고, 하단 거대 3단 배너를 슬림 인라인 바(1줄)로 경량화하여 스크롤 유발 요소 전면 배제.
- **품질 검증 및 테스트**:
  - `HomeApp.test.tsx` 콤팩트 인터랙션 테스트 동기화.
  - 20개 테스트 파일, 93개 단위 테스트 100% 통과 (Pass).
- **문서 및 버전 동기화**:
  - `PRD.md`, `README.md`, `package.json`, `src/config/site.ts` 버전 `v1.9.18` 동기화.

## [1.9.17] - 2026-09-13
 
### 메인 홈 화면 대시보드(Home Dashboard) 및 스마트 검색 구축 (UI/UX & Navigation)
- **메인 홈 대시보드 신설 (`HomeApp.tsx`)**:
  - 기존 루트(`/`) 접속 시 특정 단일 계산기(`/compound`)로 강제 리다이렉트되던 구조를 개선하고, 플랫폼의 5대 활성 계산기와 신규 로드맵을 한눈에 조망할 수 있는 공식 첫 화면 구축.
  - Ghost 디자인 시스템의 모노크롬 베이스 및 Electric Lime(`#d1ff19`) 액센트가 적용된 인터랙티브 카드 그리드 (모바일 1열, 태블릿 2열, 데스크톱 3열 반응형).
- **실시간 스마트 통합 검색 및 카테고리 필터링**:
  - 키워드(예: '평수', '대출', '연봉', '환율', '복리', '이자', '세금' 등) 입력 시 즉각 실시간 필터링되는 스마트 검색창 탑재.
  - `전체`, `금융 & 자산`, `생활 & 측정`, `통화 & 글로벌` 카테고리 퀵 탭 칩 지원.
- **글로벌 네비게이션 연동**:
  - 좌측 사이드바 최상단에 `대시보드 > 홈 (대시보드)` 메뉴 신설 (`LayoutDashboard` 아이콘).
  - 사이드바 로고 및 브랜드명 클릭 시 루트(`/`)로 즉시 이동하는 인터랙션 부여.
  - 글로벌 상단 헤더: 홈 접속 시 `메인 대시보드` 전용 타이틀 연동.
- **품질 검증 및 단위 테스트 확장**:
  - `HomeApp.test.tsx` 5개 신규 테스트 추가 (히어로 렌더링, 키워드 검색, 카테고리 필터, 빈 상태 복구).
  - 총 20개 테스트 파일, 94개 단위 테스트 100% 통과 (Pass).
- **문서 및 버전 동기화**:
  - `PRD.md`, `README.md`, `package.json`, `src/config/site.ts` 버전 `v1.9.17` 동기화.

## [1.9.16] - 2026-09-13
 
### PWA 모바일 홈 화면 앱 아이콘 풀 블리드 리디자인 (Mobile UX & PWA)
- **풀 블리드(Full Bleed) 다크 흑연 테마 아이콘 개편**:
  - 기존 흰색 여백/사각 캔버스로 인해 Android/iOS 홈 화면 설치 시 발생하던 하얀색 테두리 및 축소/이중 모서리 왜곡 문제 해결.
  - W3C PWA Maskable Icon 규격(안전 영역 Safe Zone 80%)을 완벽 준수하는 풀 블리드 다크 흑연(`#181b20`~`#111316`) 배경 캔버스 적용.
  - 서비스 고유의 Electric Lime(`#d1ff19`) 액센트가 가미된 시그니처 계산기 심볼 배치.
- **PWA 에셋 및 Manifest 동기화**:
  - `public/pwa-512x512.svg`, `public/pwa-192x192.svg` 벡터 에셋 신규 제작.
  - MS Edge Headless 렌더링을 통해 초고해상도 `public/pwa-512x512.png`, `public/pwa-192x192.png` 래스터 이미지 동기화 생성.
  - `vite.config.ts`: Manifest `background_color`를 아이콘 배경과 동일한 `'#15171a'`로 통일하여 앱 실행 스플래시 화면 일체화.
- **문서 및 버전 동기화**:
  - `TODO.md` Section 4.4 완료 처리.
  - `PRD.md`, `README.md`, `package.json`, `src/config/site.ts` 버전 `v1.9.16` 동기화.

## [1.9.15] - 2026-09-13
 
### Vercel Web Analytics 실시간 방문자 분석 인프라 구축 (Analytics & Ops)
- **Vercel Web Analytics 연동 (`@vercel/analytics`)**:
  - `@vercel/analytics` 패키지 설치 및 최상위 컴포넌트(`src/App.tsx`)에 `<Analytics />` 마운트.
  - Vercel 프로덕션 대시보드와 실시간 연동되어 페이지뷰, 방문자 수, 유입 경로, 기기별 트래픽을 프라이버시 친화적 방식으로 자동 집계.
- **문서 및 버전 동기화**:
  - `TODO.md` Section 4.1 완료 처리.
  - `PRD.md`, `README.md`, `package.json`, `src/config/site.ts` 버전 `v1.9.15` 동기화.

## [1.9.14] - 2026-09-13
 
### 공식 운영 도메인 및 SEO 최적화 인프라 구축 (Production & SEO)
- **공식 운영 도메인 연동**:
  - Vercel 프로덕션 도메인 `https://soso-calculator.vercel.app` 공식 반영.
  - `siteConfig`(`src/config/site.ts`) 및 `package.json`에 공식 도메인 및 `homepage` 명시.
- **검색엔진(SEO) 및 소셜 공유 메타데이터 강화 (`index.html`)**:
  - 표준 대표 URL(`canonical`) 태그 등록: `https://soso-calculator.vercel.app/`
  - OpenGraph (Facebook, 카카오톡, 슬랙) 및 Twitter Card 소셜 공유 미리보기 카드 규격 등록.
  - Schema.org 웹 애플리케이션(`WebApplication`) JSON-LD 구조화 데이터 삽입.
- **검색 크롤러 수집 파일 생성**:
  - `public/robots.txt`: 검색 봇 수집 전체 허용 및 사이트맵 경로 지정.
  - `public/sitemap.xml`: 5대 계산기 모듈(연복리, 대출, 연봉, 단위, 환율) 표준 사이트맵 등록.
- **문서 동기화**:
  - `README.md`: 상단 웹 베타 서비스(`Web Beta`) 뱃지 추가 및 5대 계산기 테이블 링크를 로컬(`localhost`)에서 공식 운영 주소로 전면 교체.
  - `PRD.md`: Section 7 공식 운영 도메인 명세 반영 및 버전 `v1.9.14` 갱신.

## [1.9.13] - 2026-09-12

### 네비게이션 및 헤더 타이틀 라벨(NEW, 인기 등) 전면 제거 (UI/UX Refactoring)
- **미니멀 네비게이션 및 타이틀 표준 확립**:
  - 좌측 사이드바 및 모바일 드로어(`SidebarDrawer`)의 메뉴 항목 우측 뱃지(`NEW`, `인기`, `추천`) 전면 제거.
  - 상단 글로벌 헤더(`GlobalHeader`)의 페이지 타이틀(`h1`) 옆 뱃지 전면 제거 및 미사용 컴포넌트 import 정리.
  - 네비게이션 데이터 모델(`navigation.ts`) 내 `CALCULATORS_LIST`의 `badge` 속성 일괄 제거.
  - 미출시 준비 중 페이지(`PlaceholderView`)의 상태 뱃지를 고정 텍스트 `'COMING SOON'`으로 통일.
- **문서 동기화**:
  - `PRD.md` Section 2.1에 미니멀 네비게이션 및 타이틀 원칙 명문화 및 버전 `v1.9.13` 갱신.

## [1.9.12] - 2026-09-12

### 코드 리뷰 기반 TDD 안티패턴 개선 및 PRD 명세 정합성 확보 (Refactoring & Quality)
- **TDD 안티패턴 척결 및 테스트 스위트 강화 (19개 파일 89개 테스트 100% 통과)**:
  - `LoanForm.test.tsx`: CSS 클래스명 단언 제거, 시맨틱 접근성 속성(`role="switch"`, `aria-checked`) 및 하위 입력 폼 가시성 검증으로 전환.
  - `LoanComparisonCard.test.tsx`: DOM 태그명(`DT`, `DD`) 및 CSS 클래스 단언 제거, 3대 상환방식 뱃지·금융 수치 노출 및 클릭 인터랙션 검증으로 리팩토링.
  - `PWAInstallButton.test.tsx`: 임의 인덱스 선택자 제거, 시맨틱 네임 쿼리(`getByRole('button', { name: /앱 설치/i })`) 및 모달/프롬프트 분기 상태 검증.
  - `salaryCalculator.test.ts` & `loanCalculator.test.ts`: 항등식 및 연산자 재계산 단언을 국세청 간이세액표 및 은행 대출 시뮬레이션 기준의 독립 기댓값(Known Ground-Truth Literals)으로 전면 교체.
- **아키텍처 및 코드 스멜 개선 (Fowler Smells)**:
  - `csvDownloader.ts` 신규 분리: `LoanScheduleTable.tsx`에서 CSV 생성, UTF-8 BOM 인코딩, Blob 다운로드 로직을 분리하여 관심사 분리(SRP) 및 Feature Envy 제거.
  - `DeductionBreakdownTable.tsx`: JSX 내 인라인 비율 연산을 포맷터 헬퍼 함수로 정리하고, 모바일 엣지 투 엣지 스와이프를 위한 음수 마진(`-mx-5 sm:mx-0`) 복원.
  - PWA 관련 훅 및 컴포넌트(`usePWAInstall`, `PWAInstallButton`, `PWAInstallModal`)에 한국어 JSDoc 주석 보강.
- **PRD 명세 및 UI/에셋 정합성 일치**:
  - `SidebarDrawer.tsx`: PWA 설치 버튼을 메뉴 목록 하단이자 카피라이트 푸터 상단으로 재배치하고 와이드 버튼(`w-full py-2.5 text-xs rounded-xl`) 스타일 규격화.
  - `PRD.md`: 버전 헤더 `v1.9.12` 최신화 및 파비콘 명세(`/logo.svg`) 일치.
  - `public/Smart Calculator Logo.svg`: 미사용 중복 파일 제거.

## [1.9.11] - 2026-09-12

### 에이전트 확장 스킬셋 5종 설치 및 구성 (Customization)
- **외부 공식/커뮤니티 스킬셋 도입 (`.agents/skills/`)**:
  - `frontend-design` (`anthropics/skills`): UI/UX 차별화 및 시각적 디자인 가이드라인.
  - `seo` (`addyosmani/web-quality-skills`): 웹 검색 엔진 최적화 및 메타데이터 가이드.
  - `tdd` (`mattpocock/skills`): 테스트 주도 개발(TDD) 워크플로 및 검증 절차.
  - `seo-audit` (`coreyhaines31/marketingskills`): 검색 엔진 최적화 진단 및 기술적 감사.
  - `code-review` (`mattpocock/skills`): 코드 표준 및 명세 정합성 병렬 검토.
- **의존성 잠금 및 버전 관리**:
  - `skills-lock.json` 신규 생성 및 패키지 무결성 확보.

## [1.9.10] - 2026-09-12

### 에이전트 실행 프로토콜(GEMINI.md) 및 프로젝트 규칙(rules) 파일셋 구축 (Documentation & Governance)
- **에이전트 실행 프로토콜 표준화 (`GEMINI.md`)**:
  - AI 코딩 어시스턴트 실행 프로토콜 명시 (요청 분석, PRD 선행 업데이트, 사용자 승인, 구현 및 검증, 최종 검토 후 커밋).
- **프로젝트 규칙 파일셋 복사 및 링크 연동 (`rules/`)**:
  - `rules/frontend-mobile.md`: 모바일 반응형 및 UI/UX 검증 규칙.
  - `rules/git-workflow.md`: 커밋 메시지 형식, 버전 동기화, 사용자 확인 규칙.
  - `rules/language-markdown.md`: 한국어 조사 공백, 마크다운 링크 표기 규칙.
  - `rules/security.md`: 민감 정보 및 파괴적 명령어 방지 규칙.

## [1.9.9] - 2026-09-12

### 전역 데이터 테이블 컴포넌트 표준화 및 Ghost 디자인 시스템 정합성 확보 (UI/UX Refactoring)
- **공통 테이블 컴포넌트(`ui/table.tsx`) 기준 정립 (SSOT)**:
  - 헤더(`bg-slate-50/80 dark:bg-slate-900/60`, `h-10 px-3.5`), 본문 셀 패딩(`py-2.5 px-3.5`), 구분선(`border-[#e5e7eb]/80 dark:border-slate-800/80`), 호버 음영 규격화.
  - 푸터(`TableFooter`)를 표준 시맨틱 요소(`border-t-2 border-[#e5e7eb] dark:border-slate-700 bg-slate-50/90 dark:bg-slate-900/70`)로 통일.
- **계산기별 테이블 전면 통일**:
  - **대출이자 계산기 (`LoanScheduleTable`)**: raw `<table>` 제거 ➔ 공통 `<Table>` 컴포넌트로 전면 교체, 수치 컬럼 `tabular-nums` 적용.
  - **연봉 실수령액 계산기 (`DeductionBreakdownTable`)**: raw `<table>` 제거 ➔ 공통 `<Table>`, `<TableFooter>`로 전면 교체, 일관된 패딩 적용.
  - **연복리 계산기 (`DataTable`)**: 수치 셀 `tabular-nums` 및 줄바꿈 방지 적용.
- **문서 동기화**:
  - `PRD.md` Section 2.3 및 2.4에 전역 테이블 컴포넌트 표준화 원칙 공식 반영.

## [1.9.8] - 2026-09-12

### PWA 인앱 설치 버튼 상시 노출 및 플랫폼별 스마트 설치 가이드 모달 구축 (UX Enhancement)
- **설치 버튼 상시 노출 아키텍처 전환**:
  - 기존 `beforeinstallprompt` 이벤트 미발생 시(localhost, 사파리, 이벤트 대기 등) 버튼이 숨겨지던 문제를 해결하여 헤더 및 사이드바에 `[앱 설치]` 버튼 상시 노출.
  - 이미 PWA 앱으로 실행 중인 환경(`standalone` 모드)에서만 자동 숨김 처리.
- **플랫폼별 반응형 스마트 설치 가이드 모달 (`PWAInstallModal`) 신설**:
  - 네이티브 설치 프롬프트 미지원 브라우저(iOS 사파리, 데스크톱 사파리 등)에서 버튼 클릭 시 Ghost 스타일의 설치 가이드 팝업 자동 오픈.
  - **iOS 사파리**: 하단 공유 아이콘 ➔ [홈 화면에 추가] 단계별 가이드 시각화.
  - **PC / 안드로이드**: 주소창 우측 설치 버튼 및 메뉴를 통한 설치 방법 안내.
  - 네이티브 설치 지원 브라우저(크롬, 엣지, 안드로이드 크롬)에서는 `prompt()` 즉시 실행 유지.
- **테스트 및 문서 동기화**:
  - `PWAInstallButton.test.tsx` 단위 테스트 3개 상시 노출 및 모달 오픈 검증으로 갱신 (전체 19개 파일 88개 테스트 100% 통과).
  - `PRD.md` Section 8.2 명세 최신화 및 `package.json` 버전 `v1.9.8` 동기화.

## [1.9.7] - 2026-09-12

### 신규 브랜드 로고 적용, PWA 원클릭 설치 버튼 및 shadcn/ui 업데이트 알림 토스트 구축 (Feature)
- **사용자 제공 신규 브랜드 로고 벡터/래스터 전면 적용**:
  - `public/logo.svg`를 파비콘 및 사이드바 헤더 로고로 공식 연동.
  - 고품질 PWA 아이콘(`pwa-192x192.svg`, `pwa-512x512.svg`, `pwa-192x192.png`, `pwa-512x512.png`)을 신규 로고 기반으로 재생성하여 홈 화면 추가 및 설치 시 선명한 앱 아이콘 제공.
  - 사이드바/모바일 드로어 상단 브랜드 로고 영역을 신규 로고 이미지로 교체.
- **PWA 인앱 원클릭 설치 버튼 (`PWAInstallButton`, `usePWAInstall`)**:
  - `beforeinstallprompt` 이벤트를 가로채어 설치 가능한 브라우저(크롬, 엣지, 안드로이드)에서만 지능적으로 노출되는 설치 훅 및 컴포넌트 신설.
  - 글로벌 헤더(`GlobalHeader`): 테마 토글 좌측에 데스크톱(아이콘+텍스트) 및 모바일(아이콘 툴팁) 설치 버튼 배치.
  - 사이드바/드로어(`SidebarDrawer`): 카피라이트 푸터 상단에 `[스마트 계산기 앱 설치]` 와이드 버튼 배치.
  - 이미 설치된 환경(`standalone` 모드) 및 미지원 브라우저에서는 자동 숨김 처리.
- **PWA 신규 버전 알림 shadcn/ui Toast 구축 (`PWAUpdateToast` - TODO 4.2)**:
  - `@radix-ui/react-toast` 기반 shadcn/ui Toast 컴포넌트(`toast.tsx`, `toaster.tsx`, `use-toast.ts`) 신규 구축.
  - 서비스 워커 대기(`needRefresh`) 상태 감지 시 화면 하단에 *"새로운 버전이 준비되었습니다"* Ghost 스타일 알림 토스트 자동 팝업 및 **[지금 업데이트]** 원클릭 즉각 새로고침 지원.
- **테스트 및 문서 동기화**:
  - `toast.test.tsx`, `PWAInstallButton.test.tsx` 단위 테스트 4개 신설 (전체 19개 파일 88개 테스트 100% 통과).
  - `PRD.md` Section 8.2, 8.3, 11.9 명세 반영, `TODO.md` 4.2 완료 갱신, `package.json` 버전 `v1.9.7` 동기화.

## [1.9.6] - 2026-09-12

### PWA 표준 규격 강화 및 정적 자산·아이콘·테마 정합성 보완 (Fix & Feature)
- **고해상도 PNG 래스터 아이콘 생성 및 매니페스트/iOS 호환성 확보**:
  - `pwa-192x192.png`, `pwa-512x512.png` 래스터 아이콘을 신규 생성하여 안드로이드 PWA 설치 배너 요건 및 크롬 Lighthouse PWA 심사 기준 완벽 충족.
  - `manifest.webmanifest`에 PNG 및 SVG 듀얼 아이콘(`any`, `maskable`) 등록.
  - `index.html`의 `apple-touch-icon`을 PNG 포맷(`/pwa-192x192.png`)으로 변경하고, `apple-mobile-web-app-status-bar-style: default` 메타 태그 추가.
- **파비콘 및 정적 자산 누락 해소**:
  - `index.html`의 파비콘 링크를 유효한 벡터 아이콘(`/pwa-192x192.svg`)으로 교체하여 브라우저 탭 아이콘 404 요청 원천 차단.
  - `vite.config.ts`의 `includeAssets` 목록에서 미존재 파일(`favicon.ico`, `vite.svg`)을 제거하고 실제 자산(`pwa-192x192.svg`, `pwa-512x512.svg`, `pwa-192x192.png`, `pwa-512x512.png`)으로 재구성.
- **Ghost 디자인 시스템 테마 색상 및 메타데이터 일원화**:
  - `manifest`의 `theme_color`를 구형 Teal(`#0d9488`)에서 Ghost 흑연 다크 테마 컬러인 `#15171a`로 통일하여 `index.html` 메타 태그와 일치.
  - 매니페스트 `lang: 'ko'`, `categories: ['finance', 'utilities']`, `description` 보강.
- **문서 및 버전 갱신**: `PRD.md` Section 8 및 `package.json` 버전 `v1.9.6` 동기화.

## [1.9.5] - 2026-09-12

### 연봉 계산기 1024px/모바일 반응형 레이아웃 결함 및 도넛 차트 툴팁 레이어링 개선 (Fix)
- **도넛 차트 마우스 호버 툴팁 가림 현상 원천 해결 (`SalaryChartDashboard.tsx`)**:
  - 기존 차트 중앙 고정 텍스트("실수령 비율 OO%")가 DOM 순서 및 기본 쌓임 맥락으로 인해 Recharts 툴팁보다 상위에 위치하여 마우스 호버 시 툴팁을 가리던 결함 수정.
  - 중앙 고정 텍스트를 DOM 앞단으로 재배치하고 `z-0` 및 `pointer-events-none` 부여.
  - 차트 및 `<Tooltip>` 컨테이너를 `z-10`, Recharts 툴팁 래퍼에 `wrapperStyle={{ zIndex: 50, pointerEvents: 'none' }}`을 설정하여 어떤 위치에서도 툴팁이 최상단에 깨끗하게 플로팅되도록 해결.
- **1024px 데스크톱 및 모바일 반응형 텍스트 줄바꿈 전면 최적화**:
  - `@tailwindcss/container-queries` 기반 내부 리플로우 도입으로 1024px 화면(좌측 사이드바 256px 제외 시 폼 ~290px, 대시보드 ~406px)에서 텍스트 줄바꿈 및 수치 깨짐 방지.
  - `SalaryChartDashboard.tsx`: 컨테이너 폭 576px 미만(`@xl` 미만) 시 도넛 상단, 범례 6대 항목 전폭 1열 단일 행(`whitespace-nowrap`) 정렬.
  - `SalaryForm.tsx`: 인적공제 2개 카드를 `@md:grid-cols-2`로 적응(좁은 열 1열, 가용 폭 2열), 인원수 `whitespace-nowrap shrink-0` 적용. 금액 프리셋 3x2 그리드, 증감 버튼 4열 균등 그리드 정렬, 퇴직금 옵션명 간결화(`퇴직금 별도`, `퇴직금 포함 (1/13)`).
  - `SalarySummaryCards.tsx`: 3단 서브 요약 카드 금액에 `whitespace-nowrap`, 수식 분리 방지 span 래핑.
  - `DeductionBreakdownTable.tsx`: 카드 헤더 컨테이너 쿼리(`flex-col @lg:flex-row`) 적용 및 테이블 셀 패딩 반응형(`px-2.5 @md:px-4`), 수치 열 `whitespace-nowrap`.
  - `SalaryApp.tsx`: 자식 컨테이너에 `min-w-0` 추가하여 CSS 그리드 트랙 오버플로우 방지.
- **문서 및 버전 갱신**: `PRD.md` Section 12.2 및 `package.json` 버전 `v1.9.5` 동기화.

## [1.9.4] - 2026-09-12

### 연봉 계산기 모바일/태블릿(768)/데스크톱(1024) 3단계 반응형 규격 명문화 (Docs)
- **3대 기준 해상도별 반응형 동작 명세 추가 (`PRD.md` Section 12.2)**:
  - 모바일 (<768px): 단일 열(`grid-cols-1`) 수직 스택, 상단 햄버거 메뉴 및 슬라이드 오버레이 드로어(`w-4/5 max-w-xs`), 6대 공제 명세표 음수 마진(`-mx-5`) 및 가로 스크롤(`overflow-x-auto`) 스와이프 지원.
  - 태블릿 (768px ~ 1023px, `md`): 가용 본문 폭 극대화를 위한 네비게이션 드로어 유지, 3단 서브 요약 카드 3열 배치(`sm:grid-cols-3`), 공제 비중 도넛 차트 대시보드 2열 분할(`md:grid-cols-12`: 차트 6열, 범례 6열).
  - 데스크톱 (>=1024px, `lg`): 좌측 256px 고정 사이드바(`w-64`), 12컬럼 메인 그리드(`lg:col-span-5` 폼 + `lg:col-span-7` 대시보드) 2열 스플릿 레이아웃 확립.
- **버전 동기화**: `package.json` 및 `PRD.md` 버전 `v1.9.4` 동기화.

## [1.9.3] - 2026-09-12

### 연봉 계산기 페이지 폰트 전면 프리텐다드(Pretendard Variable) 단일화 (Refactor)
- **연봉 계산기 전 컴포넌트 내 `font-mono` 잔여 제거 및 `tabular-nums` 전환**:
  - `SalarySummaryCards.tsx`: 메인 실수령액 및 3단 서브 요약 카드에서 `font-mono` 제거, 고정폭 숫자(`tabular-nums`) 적용.
  - `SalaryForm.tsx`: 부양가족 수 및 20세 이하 자녀 수 카운터에서 `font-mono` 제거.
  - `SalaryChartDashboard.tsx`: 공제 비중 툴팁 및 중앙 텍스트, 범례 목록에서 `font-mono` 제거.
  - `DeductionBreakdownTable.tsx`: 6대 공제 항목 테이블 수치 열 및 합계 행에서 `font-mono` 제거.
- **Tailwind 폰트 패밀리 mono 단일화 (`tailwind.config.js`)**:
  - `fontFamily.mono`를 `Pretendard Variable`로 매핑하여 의도치 않은 시스템 모노스페이스 서체 호출을 원천 방지.

## [1.9.2] - 2026-09-12

### 전역 프리텐다드(Pretendard Variable) 단일 서체 강제 원칙 및 PRD 표준화 (Docs)
- **PRD 전역 서체 표준 및 타 서체 사용 금지 명시 (`PRD.md`)**:
  - 기본 원칙, 핵심 가치(Section 1), Ghost 디자인 원칙(Section 2.3), 기술 스택(Section 5)에 걸쳐 플랫폼 전역의 기본 폰트로 `Pretendard Variable`을 단일 표준으로 강제.
  - Inter, Roboto, Noto Sans, Serif 등 일체의 타 폰트 혼용 전면 금지 및 고정폭 숫자(`tabular-nums`) 결합 명시.
  - `package.json` 및 `PRD.md` 버전 `v1.9.2` 동기화.

## [1.9.1] - 2026-09-12

### 공통 숫자 및 금액 입력 컴포넌트(NumericInput) 신설 및 계산기 폼 규격 표준화 (Refactor)
- **공통 숫자/금액 입력 필드 컴포넌트 신설 (`src/components/ui/numeric-input.tsx`)**:
  - `h-11`(44px 모바일 터치 타깃), `text-right`, `font-bold`, `rounded-xl` 기반 Ghost 디자인 시스템 규격 일원화.
  - 우측 고정 단위 라벨(`suffix`: '원', '%') 지원 및 `pointer-events-none` 안전 배치.
  - `thousandSeparator` 지원으로 3자리 콤마 포맷팅 자동화 및 `onNumberChange`를 통한 숫자 추출 핸들링 내장.
  - `allowDecimals`, `displayZero` 등 소수점 금리 및 정밀 제어 지원.
- **기존 3대 계산기 입력 폼 리팩토링 및 적용**:
  - `SalaryForm.tsx`: 세전 급여(`gross-amount-input`) 및 비과세 수당(`non-taxable-input`) 필드를 `NumericInput`으로 교체하여 코드 중복 제거.
  - `LoanForm.tsx`: 대출 원금(`loan-amount`) 및 연 대출 금리(`loan-rate`) 필드를 `NumericInput`으로 통일.
  - `CalculatorForm.tsx`: 초기 투자 원금(`principal`) 및 정기 추가 적립금(`regularContribution`) 필드를 `NumericInput`으로 교체.
- **품질 검증 및 테스트**:
  - `src/components/ui/numeric-input.test.tsx` 단위 테스트 5개 신설 및 전체 테스트 84개 전원 통과.
  - `PRD.md` 11.8 섹션 규격 신설 및 버전 1.9.1 갱신.

## [1.9.0] - 2026-09-12

### 2026년 기준 연봉 실수령액 계산기 모듈(SalaryApp) 신규 개발 및 전역 네비게이션 연결 (Feature)
- **2026년 최신 4대 사회보험 요율 및 국세청 간이세액표 누진세율 연산 엔진 구축 (`src/utils/salaryCalculator.ts`, `salaryCalculator.test.ts`)**:
  - 국민연금 4.5%(기준소득월액 상한액 617만 원 적용 ➔ 월 최대 보험료 277,650원 한도 캡) 및 부동소수점 오차 방지 원단위 절사 처리.
  - 건강보험 3.545%, 노인장기요양보험(건강보험료의 12.95%), 고용보험 0.9%(실업급여분) 10원 단위 절사 반영.
  - 국세청 근로소득 간이세액표 산출 알고리즘(근로소득공제 ➔ 기본인적공제 1인당 150만 원 ➔ 8단계 누진세율 6%~45% ➔ 근로소득세액공제 ➔ 자녀 세액공제) 및 지방소득세 10% 연산 구현.
  - 근로자 부담분 및 사업주(회사) 4대 보험 지원 부담금 동시 산출 지원.
  - 단위 테스트 14개 구축 및 100% 통과.
- **Ghost 디자인 시스템 기반 급여 조건 입력 폼 구현 (`src/calculators/salary-calculator/components/SalaryForm.tsx`)**:
  - 기존 계산기 표준 대형 인풋 규격(`h-11`, `text-right`, `bg-slate-50/50 dark:bg-slate-900/60`, `rounded-xl`, `border-[#e5e7eb] dark:border-slate-700`) 및 `rounded-[24px]` 카드 컨테이너 전면 통일.
  - 연봉 / 월급 기준 세그먼트 전환 토글 및 전환 시 자동 상호 환산.
  - 한국형 대표 연봉 퀵 프리셋 칩(`3,000만`, `4,000만`, `5,000만`, `6,000만`, `7,000만`, `1억`) 및 빠른 증감(`+100만`, `+500만`, `+1,000만`, `정정`).
  - 퇴직금 지급 방식 세그먼트(`별도 지급` vs `연봉 포함(1/13 분할)`).
  - 식대 비과세 설정(2023년 세법 개정 반영 20만 원 기본값 + 프리셋 칩).
  - 부양가족 수 및 20세 이하 자녀 수 증감 카운터 컨트롤.
- **결과 시각화 대시보드 및 세부 공제 명세표 구현 (`SalarySummaryCards.tsx`, `SalaryChartDashboard.tsx`, `DeductionBreakdownTable.tsx`, `SalaryInfoCard.tsx`)**:
  - 월 예상 실수령액 대형 하이라이트 카드, 세전 대비 실수령 비율(`%`) 뱃지, 연 환산 총 실수령액 및 3단 서브 카드(`세전 월 급여`, `월 총 공제액`, `총 공제율`).
  - 원클릭 클립보드 복사 인터랙션 및 복사 완료 피드백.
  - Recharts 기반 도넛 차트로 실수령액(Electric Lime), 4대 사회보험, 세금 비중 시각화.
  - 6대 공제 항목(국민연금, 건보, 요양, 고용, 소득세, 지방소득세) 세부 테이블 및 근로자 본인 부담 vs 회사 지원금 탭 전환 지원.
  - 2026년 최신 요율, 간이세액표와 연말정산의 원리, 식대 비과세 팁을 담은 상식 안내 카드 제공.
- **전역 네비게이션 및 라우팅 연결 (`src/types/navigation.ts`, `src/App.tsx`, `src/components/navigation/SidebarDrawer.tsx`)**:
  - `CalculatorId`에 `'salary'` 추가 및 좌측 사이드바/모바일 드로어에 `Wallet` 아이콘 매핑.
  - `/salary` 클린 URL 라우트 등록 및 지연 로딩(`lazy`) 연결.
  - `siteConfig` 및 `package.json` 버전 `1.9.0` 갱신.

## [1.8.13] - 2026-09-10

### 공통 숫자 입력 제어 훅(useClampedNumberInput) 신설 및 전 계산기 폼 UX 고도화 (Refactor & UX Polish)
- **`useClampedNumberInput` 커스텀 훅 신설 및 단위 테스트 구축 (`src/hooks/useClampedNumberInput.ts`, `useClampedNumberInput.test.ts`)**:
  - 인풋 필드 편집 시 빈 문자열(`''`) 및 음수 부호(`'-'`) 입력을 자연스럽게 허용하고, 포커스 아웃(`onBlur`) 시 허용 유효 범위(`min ~ max`)로 자동 클램핑 및 소수점 자리수 반올림을 수행하는 공통 훅 구현.
  - 슬라이더 및 외부 프리셋 칩 클릭 시의 외부 prop 변경과 인풋 타이핑 간의 정밀한 동기화 보장 (단위 테스트 8개 100% 통과).
- **연복리 계산기 폼 리팩터링 (`CalculatorForm.tsx`)**:
  - `목표 투자 기간`(1~40년) 및 `연 예상 수익률`(-5%~50%) 인라인 핸들러를 `useClampedNumberInput`으로 교체하여 코드 응집도 향상 및 음수 부호 타이핑 안정성 강화.
- **대출 이자 계산기 폼 UX 개선 (`LoanForm.tsx`)**:
  - `연 대출 금리`(0.1%~30%, fallback 4.2%) 및 `중도상환 수수료율`(0%~5%, fallback 1.2%)에 `useClampedNumberInput` 적용.
  - `대출 원금` 및 `중도상환 원금` 인풋에 `onBlur` 안전 폴백을 추가하여 백스페이스로 지운 뒤 포커스 아웃 시 정상 복원.
- **단위 변환기 및 환율 계산기 빈 값 방어 강화 (`DualConverterCard.tsx`, `DualExchangeCard.tsx`)**:
  - 출발 수치/금액 입력창에 `onBlur` 안전 보정 핸들러를 보강하여 빈 값 상태 포커스 아웃 시 안전 기본값(0)으로 자동 복원.

## [1.8.12] - 2026-09-10

### 연복리 계산기 예상 수익률 프리셋 버튼 선택 스타일 일원화 (UI Polish)
- **예상 수익률 프리셋 칩 선택 스타일 통일 (`CalculatorForm.tsx`)**:
  - `-3%` 프리셋 선택 시 적용되던 특수 로즈(Rose/빨간색) 배경 및 테두리 스타일을 제거하고, 다른 프리셋 버튼들과 동일한 표준 활성화 스타일(다크/블랙 배경)로 일원화하여 시각적 통일감 확보.

## [1.8.11] - 2026-09-10

### 연복리 계산기 입력 폼 표준 인풋(h-11) 전면 통일, 빈 값 입력 지원 및 바운더리 검증 (UI Polish & UX)
- **전 입력 항목 표준 대형 인풋(`h-11`) 및 단위 심볼 디자인 일원화 (`CalculatorForm.tsx`, `PRD.md`)**:
  - `초기 투자 원금`, `정기 추가 적립금`뿐만 아니라 `목표 투자 기간`(`년`), `연 예상 수익률`(`%`) 모두 동일한 규격의 풀 와이드 대형 인풋 박스(`h-11`) 및 우측 단위 심볼로 전면 일원화.
  - 연 예상 수익률 프리셋 칩에서 불필요한 수식어를 제거하고 순수 수치(`-3%`, `3.5%`, `8%`, `15%`)만 표기하여 투자 기간 버튼과 동일한 `flex-1` 균등 규격 적용.
- **예상 수익률 슬라이더 범위 및 인풋 사용성 최적화 (`CalculatorForm.tsx`)**:
  - 연 예상 수익률 슬라이더 최대값을 50%로 최적화(`min={-5}`, `max={50}`)하여 슬라이더 핸들의 위치 왜곡 해소.
  - 백스페이스 입력 시 강제 `0` 치환을 방지하고 빈 값(`''`)을 허용하여 재입력 편의성 대폭 개선.
  - 포커스 아웃(`onBlur`) 시 슬라이더 최소/최대 바운더리 자동 보정 적용 (투자 기간: 1~40년, 수익률: -5%~50%).
- **단위 테스트 및 빌드 검증 완료**:
  - 14개 테스트 파일(56개 테스트) 100% 통과 및 프로덕션 빌드 완료.

## [1.8.10] - 2026-09-10

### 연복리 계산기 입력 폼 프리셋 4개 통일 및 수익률 범위 확장, 3단 서브 카드 디자인 완벽 복원 (Feature & UI Polish)
- **연복리 입력 폼 프리셋 4개화 및 예상 수익률 조절 범위 확장 (`CalculatorForm.tsx`, `PRD.md`)**:
  - 목표 투자 기간 프리셋을 4개 버튼(`5년`, `10년`, `20년`, `30년`)으로 정돈하여 그리드 균등 밸런스 확보.
  - 연 예상 수익률 조절 범위를 기존 `-20% ~ 30%`에서 `-5% ~ 100%`로 확대 (인풋 필드 및 슬라이더 동시 적용).
  - 연 예상 수익률 프리셋을 4개 칩(`조정장 -3%`, `예적금 3.5%`, `지수 ETF 8%`, `성장투자 15%`)으로 재편하고 4열 그리드(`grid-cols-2 sm:grid-cols-4`) 최적화.
- **연복리 3단 서브 카드 디자인 복원 완성 (`SummaryCards.tsx`)**:
  - 카드 캡슐 왜곡을 해소하고 표준 `rounded-xl`, 패딩 `p-3`, 단정한 테두리로 마감.
  - 3번째 카드(`이자 소득세`)의 아이콘을 규격 라인 아이콘(`<ShieldAlert>`)으로 복원하여 시각적 일관성 확보.
- **단위 테스트 및 빌드 검증 완료**:
  - 고수익률(100%) 시뮬레이션 복리 계산 단위 테스트 추가, 14개 테스트 파일(56개 테스트) 100% 통과 및 프로덕션 빌드 완료.

## [1.8.9] - 2026-09-10

### 연복리 요약 카드 디자인 복원 및 전 페이지 반응형 안정화 (UI Polish & Bug Fix)
- **연복리 3단 서브 지표 카드(`총 투자원금`, `세후 순이자`, `이자 소득세`) 알약 왜곡 해소 (`src/components/SummaryCards.tsx`)**:
  - `Card` 컴포넌트의 과도한 라운딩(`rounded-[24px]`)으로 인해 60~70px 높이의 작은 서브 카드가 캡슐 형태로 왜곡되던 현상을 `rounded-xl sm:rounded-2xl`로 정상 복원.
  - 비교 모드(A/B) 시 좌우 2분할 공간에서 텍스트가 세로로 찌그러지지 않도록 1열 세로 레이아웃(`grid-cols-1`)으로 최적화.
- **다크 서피스 카드 내 라벨 텍스트 가독성 복원 (`src/components/ui/badge.tsx`)**:
  - `Badge`의 `variant="outline"`을 투명 배경(`bg-transparent`)으로 원복하여 다크 서피스(`ComparisonView.tsx`) 안에서 텍스트가 사라지던 결함 해결.
  - 대출 헤더 전용 은은한 배경(`bg-slate-50/70`)은 신설된 `variant="meta"`로 완전 분리 격리.
- **1024px 반응형 차트 너비 계산 오류 방지 (`CompoundInterestApp.tsx`, `ChartDashboard.tsx`)**:
  - Grid 자식 컬럼에 `min-w-0`을 보강하여 Recharts `ResponsiveContainer`가 너비를 잘못 계산하고 Y축 눈금이 뭉개지던 현상 방지.
- **정기 추가 적립금 금액 포맷팅 누락 수정 (`CalculatorForm.tsx`)**:
  - 초기 투자 원금과 동일하게 천 단위 콤마 포맷팅(`toLocaleString('ko-KR')`) 및 `inputMode="numeric"`으로 일원화.
- **단위 테스트 및 빌드 검증 완료**:
  - 14개 테스트 파일(55개 테스트) 100% 통과 및 프로덕션 빌드 완료.

## [1.8.8] - 2026-09-10

### 카드 헤더 서브 뱃지(Header Meta Badge) 디자인 일원화 및 공통 표준화 (UI Polish)
- **`Badge` 공통 컴포넌트 `size="sm"` 표준 규격 추가 (`src/components/ui/badge.tsx`)**:
  - 카드 타이틀 옆에 부가 상태 및 메타 정보를 표시하는 표준 헤더 뱃지 규격(`h-5 px-1.5 text-[10px] font-semibold leading-none rounded-md`) 정의.
  - `variant="outline"` 테두리(`border-[#e5e7eb] dark:border-slate-700`) 및 은은한 배경(`bg-slate-50/70 dark:bg-slate-800/60`), 텍스트 색상(`text-[#475569] dark:text-slate-300`) 통일.
- **대출 계산기 헤더 라벨 스타일 일원화 (`LoanForm.tsx`, `LoanScheduleTable.tsx`)**:
  - `대출 조건 입력` 타이틀 옆의 `스마트 비교` 라벨과 `월별 상환 스케줄 상세표` 옆의 `총 360회차` 라벨의 인라인 스타일을 제거하고 `<Badge variant="outline" size="sm">` 공통 컴포넌트로 일원화.
  - 두 라벨 간 높이(20px), 패딩, 모서리 라운드, 타이틀 베이스라인 수직 정렬 완벽 일치 검증.
- **단위 테스트 및 프로덕션 검증 완료**:
  - [`card-and-badge.test.tsx`](file:///c:/Users/hakso/_work/test/src/components/ui/card-and-badge.test.tsx)에 `size="sm"` 렌더링 단위 테스트 추가, 55개 단위 테스트 100% 통과 및 프로덕션 빌드 완료.

## [1.8.7] - 2026-09-10

### Tabs 컴포넌트 반응형 고정 높이 간섭 해제 및 단위 변환기 1:1 픽셀 복원 (Bug Fix & Pixel-Perfect)
- **`TabsList` 유동 높이 규격(`size="auto"`) 정식 추가 (`src/components/ui/tabs.tsx`)**:
  - `tabsListVariants`의 `size` 기본값에 포함된 `sm:h-10`(40px) 반응형 고정 높이로 인해 자식 요소가 컨테이너 밖으로 넘치던 현상을 해소.
  - 고정 높이를 강제하지 않고 내부 버튼 높이에 맞춰 유동적으로 감싸는 `size="auto"`(`h-auto`) 변형 지원.
- **`TabsTrigger` 스타일 정밀 보정 (`src/components/ui/tabs.tsx`)**:
  - `size="auto"`에 맞춘 37px 표준 버튼 규격(`px-3.5 py-2 text-xs gap-2`) 추가 및 활성 탭 1px 테두리(`border-[#e5e7eb] dark:border-slate-700`) 복원.
- **단위 변환기 탭 1:1 픽셀 퍼펙트 복원 (`UnitCategoryTabs.tsx`)**:
  - `TabsList`에 `size="auto"`를 적용하여 기존 원본 디자인(상하 4px 패딩, 37px 버튼 높이, 총 47px 컨테이너 높이, 1px 보더)을 1픽셀의 오차도 없이 100% 동일하게 복원.
  - 1024x768 데스크톱 및 390x844 모바일 전 뷰포트 스크린샷 실측 대조 검증 완료.

## [1.8.6] - 2026-09-10

### shadcn UI 기반 표준 Tabs 컴포넌트 구축 및 전역 통합 (Component Standardization)
- **표준 `Tabs` 공통 컴포넌트 시스템 구축 (`src/components/ui/tabs.tsx`)**:
  - `@radix-ui/react-tabs` 기반으로 shadcn 표준 컴포넌트 세트(`Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`) 구현.
  - 디자인 시스템에 최적화된 변형(`default`, `slate-solid`, `dark-solid`) 및 크기(`sm`, `default`, `lg`), WAI-ARIA 웹 접근성 및 키보드 화살표 탐색 완비.
- **단위 변환기 카테고리 탭 마이그레이션 (`UnitCategoryTabs.tsx`)**:
  - 기존 버튼 리스트를 표준 `<Tabs>`로 교체하여 가로 스크롤 및 카테고리 아이콘/활성 인디케이터(`bg-[#d1ff19]`) 완벽 연동.
- **환율 계산기 환전 방식 탭 마이그레이션 (`DualExchangeCard.tsx`, `MultiExchangeGrid.tsx`)**:
  - 환전 방식(`매매기준율`, `현찰 살 때`, `현찰 팔 때`) 세그먼트를 표준 `<Tabs>`로 전환하고 모바일 뷰포트 반응형 여백 및 정렬 최적화.
- **대출 상환 추이 차트 뷰 전환 탭 마이그레이션 (`LoanChartDashboard.tsx`)**:
  - 차트 유형(`대출 잔액 감소` | `누적 납입`) 전환 인터랙션을 표준 `<Tabs>`로 일원화.
- **단위 테스트 및 프로덕션 검증 완료**:
  - [`tabs.test.tsx`](file:///c:/Users/hakso/_work/test/src/components/ui/tabs.test.tsx) 신규 작성 및 전체 14개 테스트 스위트 (54개 테스트) 100% 통과, 프로덕션 빌드 완료.

## [1.8.5] - 2026-09-10

### 컨테이너 쿼리 도입 및 1024px 반응형 공간 재배치 (Container Queries & Fluid Layout)
- **컨테이너 쿼리 플러그인 도입 (`@tailwindcss/container-queries`)**:
  - 미디어 쿼리 기반 화면 분기 한계를 극복하고 요소 부모 폭에 반응하는 유동적 컴포넌트 설계 기반 구축.
- **3대 상환방식 비교 카드 (`LoanComparisonCard.tsx`) 공간 재배치**:
  - 개별 카드에 `@container`를 적용하여 1열로 넓어질 때(`@xs:`) 하단 수치 영역(`<dl>`)을 가로 2분할(`총 대출이자` | `첫 달 상환액`)로 정렬, 여백 낭비를 없애고 세로 높이 최적화.
  - 3열 좁은 폭에서는 세로 1열 스택으로 자연스럽게 전환되어 글자 겹침 및 오버플로우 원천 차단.
- **요약 카드 수평 배너 최적화 (`LoanSummaryCards.tsx`)**:
  - 1열 확장 시 라벨/한글단위(좌)와 큰 금액(우)으로 수평 와이드 배치되는 컨테이너 쿼리 적용.
- **대출 조건 입력 폼 타이틀 충돌 해결 (`LoanForm.tsx`)**:
  - 1024px 화면 폼 협소 폭(~298px)에서 "거치 기간 (원금 상환 유예)"와 "거치 없음 (즉시 원금 상환)"이 충돌하던 현상을 상태 텍스트 간소화(`거치 없음`) 및 `flex-wrap items-baseline justify-between gap-1`로 완벽 해결.
- **브라우저 실측 시각 검증 및 단위/통합 테스트 52종 100% 통과**.

## [1.8.4] - 2026-09-10

### 대출 상환방식 카드 개선 및 스위치 호버 버그 수정 (TDD Red-Green)
- **3대 상환방식 비교 카드 (`LoanComparisonCard.tsx`) 선택 체크 아이콘 제거 (방법 1)**:
  - 선택 시 타이틀 옆에 붙던 `CheckCircle2` 아이콘을 제거하여 가로 폭 낭비를 없애고 세 카드의 타이틀 대칭성과 여백을 온전히 확보.
- **메인 본문 컨테이너 확장 (`App.tsx`) (방법 2)**:
  - `<main>` 컨테이너 규격을 `max-w-5xl`(1024px)에서 `max-w-7xl`(1280px)로 전격 확장하여 2열 레이아웃 우측 패널 카드 3개가 각 210px 이상의 여유 공간을 갖도록 개선.
- **총 대출이자 수치 영역 시맨틱 `<dl>`, `<dt>`, `<dd>` 및 1줄 구성 (`LoanComparisonCard.tsx`) (방법 3)**:
  - 하단 수치 영역을 웹 표준 시맨틱 태그인 `<dl>`, `<dt>`, `<dd>`로 구성하고 `flex items-center justify-between` 1줄 구조로 안정적으로 배치.
- **중도상환 시뮬레이터 스위치 마우스 오버 시 투명화 오류 해결 (`LoanForm.tsx`) (오류 1)**:
  - `hover:bg-transparent` 클래스로 인해 마우스 오버 시 스위치 트랙 배경이 사라지던 결함을 제거하고, ON/OFF 각 상태별 적절한 호버 색상을 적용.
- **Seam 단위 테스트 및 프로덕션 검증 완료**:
  - `LoanComparisonCard.test.tsx`, `LoanForm.test.tsx` 단위 테스트 작성 및 전체 13개 테스트 파일(52개 테스트) 100% 통과, 프로덕션 빌드 완료.

## [1.8.3] - 2026-09-10

### 폼 스위치 토글 규격 표준화 및 버그 수정 (TDD Red-Green)
- **중도상환 시뮬레이터 스위치 토글 (`LoanForm.tsx`, `Button.tsx`) 렌더링 정상화**:
  - shadcn `Button`의 기본 크기(`h-[39px] px-4 py-2`)가 인라인 클래스 `h-6`과 충돌하여 스위치가 기형적으로 뚱뚱해지고 원형 썸이 어색하게 떠 있던 문제 해결.
  - `buttonVariants`에 `size="switch"` (`h-6 w-11 p-0.5`) 정식 변형을 추가하고, `LoanForm.tsx` 스위치에 적용하여 표준 컴팩트 알약 형태와 부드러운 썸 슬라이드 모션 연출.
  - Seam 단위 테스트([`LoanForm.test.tsx`](file:///c:/Users/hakso/_work/test/src/calculators/loan-calculator/components/LoanForm.test.tsx)) 선작성(Red) 후 구현(Green) 검증 완료.
- **전체 단위/통합 테스트 50종 100% 통과 및 프로덕션 빌드 완료**.

## [1.8.2] - 2026-09-10

### 모바일 퍼스트 및 전 화면 반응형 최적화 (Mobile-First & Responsive Robustness)
- **대출 요약 카드 (`LoanSummaryCards.tsx`) 금액 단위 줄바꿈 튕김 원천 차단**:
  - 억 단위 큰 금액 표시 시 "원" 단위가 아래 줄로 튕겨 떨어지던 문제를 `whitespace-nowrap flex items-baseline gap-0.5` 및 적응형 폰트 크기(`text-base sm:text-lg xl:text-xl`)로 바로잡아 어떤 화면 폭에서도 숫자에 밀려 떨어지지 않도록 완벽 보정.
- **3대 상환방식 동시 비교 (`LoanComparisonCard.tsx`) 텍스트 쪼개짐 방지**:
  - 우측 패널(약 550px)에서 카드가 좁아져 "원리금균/등", "가장 대중/적", "총 대출이/자"로 글자 단위로 쪼개지던 문제를 해결.
  - `break-keep`, `whitespace-nowrap`, `flex-wrap`을 적용하고 텍스트와 금액이 좌우 양끝에 안정적으로 안착하도록 레이아웃 재구성.
- **대출 조건 입력 폼 (`LoanForm.tsx`) 반응형 그리드 분기**:
  - 거치 기간 및 중도상환 시점 프리셋 칩: 모바일(360px ~ 480px) 4분할 시 텍스트("거치 없음 (즉시 원금 상환)") 찌그러짐을 방지하기 위해 `grid-cols-2 sm:grid-cols-4`로 분기하여 모바일 2열 2행의 안정적인 터치 영역 확보.
- **대출 상환 스케줄표 (`LoanScheduleTable.tsx`) 모바일 페이지네이션 개선**:
  - 모바일(360px)에서 연차/회차 텍스트와 화살표 버튼이 겹치지 않도록 `flex-col xs:flex-row` 분기 및 터치 타깃(`h-8 w-8`) 확보.
- **연복리 계산기 요약 지표 (`SummaryCards.tsx`) 수치 잘림 해결**:
  - 하단 3단 서브 카드(투자원금 / 순이자 / 소득세)를 모바일 1열, sm 이상 3열(`grid-cols-1 sm:grid-cols-3`)로 가변 전환하여 360px 초협소 화면에서 큰 한글 금액이 `truncate`되어 보이지 않던 문제 해결.
- **단위/통합/라우팅 테스트 49종 전체 통과 및 프로덕션 빌드 완료**.

## [1.8.1] - 2026-09-10

### 인터랙션 요소 전면 표준화 및 공통 컴포넌트 추상화 (Component Refactoring & DRY)
- **전 모듈 shadcn `Button` 컴포넌트 전면 통일**:
  - 인라인 네이티브 `<button>` 태그를 shadcn `Button`으로 100% 교체하여 일관된 포커스 링, 웹 접근성, 트랜지션 적용.
- **선택(Active) 버튼 호버 인터랙션 미세 명도 피드백 표준화**:
  - 선택된 버튼에 마우스 오버 시 색상이 고정되거나 기본 고스트 스타일이 튀어나오던 현상 개선.
  - 라이트 모드 `hover:bg-[#2e3238]`, 다크 모드 `dark:hover:bg-slate-700` / `dark:hover:bg-slate-100`으로 자연스러운 클릭 가능 피드백 통일.
- **2회 이상 중복 인터랙션 요소의 공통 컴포넌트 추상화 (DRY 원칙)**:
  - `SelectableChip` (`src/components/ui/selectable-chip.tsx`): 금리, 기간, 거치기간, 수익률, 우대율 등 선택형 프리셋 칩 표준화.
  - `SegmentedControl` (`src/components/ui/segmented-control.tsx`): 상환방식, 적립주기, 환전방식, 차트 뷰 등 2~4분할 세그먼트 탭 표준화.
- **적용 모듈**: 대출 계산기(`LoanForm`, `LoanChartDashboard`), 단위 변환기(`DualConverterCard`), 환율 계산기(`DualExchangeCard`), 복리 계산기(`CalculatorForm`, `CompoundInterestApp`).
- 단위/통합/라우팅 테스트 49종 전체 통과 및 프로덕션 빌드 완료.

## [1.8.0] - 2026-09-10

### 대출이자 & 상환방식 비교 계산기 신규 출시 (Loan Repayment Calculator)
- **3대 상환방식 정밀 지원 & 실시간 비교 (`LoanComparisonCard`)**:
  - 원리금균등, 원금균등, 만기일시 3가지 방식의 총이자 및 1회차/마지막회차 월상환액 나란히 비교
  - "원금균등 선택 시 원리금균등 대비 OOO만 원 이자 절약" 하이라이트 배너 제공
- **중도상환 시뮬레이터 내장 (선택 토글)**:
  - 시중은행 3년(36개월) 슬라이딩 감면 공식 자동 적용 (3년 경과 시 0원 전액 면제)
  - 조기 상환 시 아낄 수 있는 누적 이자와 납부 수수료, 순 절감 혜택(+OOO만 원) 실시간 산출
- **모바일 퍼스트 터치 편의 UX (`LoanForm`)**:
  - 한글 금액 실시간 표기(`3억 5,000만 원`), 빠른 금액 증감 칩(`+1,000만`, `+5,000만`, `+1억`, `정정`), shadcn `Input`
  - 0.1% 단위 금리 조절 및 시장 대표 금리 칩(`3.2% 특판`, `3.8% 주담대`, `4.5% 전세`, `5.5% 신용`)
  - 1~40년 대출 기간 슬라이더 및 거치 기간(0개월~5년 원금 상환 유예) 설정
- **시각화 & 스케줄표 & 안내 카드**:
  - Recharts 기반 연차별 대출 잔액 감소 곡선 및 누적 납입액(원금 vs 이자) 영역 차트 (`LoanChartDashboard`)
  - 12개월 단위 연차별 페이지네이션, 중도상환 회차 뱃지 표기, 엑셀 호환 UTF-8 BOM CSV 내보내기 (`LoanScheduleTable`)
  - DSR / DTI / LTV 개념, 상환방식 선택 가이드, 금리인하요구권 팁 안내 카드 (`LoanInfoCard`)
- **라우트 코드 스플리팅 & 상태 영속화**:
  - `/loan` 라우트 활성화 및 사이드바 `NEW` 배지 적용, `useLocalStorage` 입력값 자동 보관
- **단위/통합/라우팅 테스트 49종 전체 통과 및 프로덕션 빌드 완료**

## [1.7.7] - 2026-09-07

### 복리 계산기 금액 입력창 우측 패딩 및 단위 텍스트 겹침 버그 수정 (UI Fix)
- **`CalculatorForm.tsx` 원금 및 적립금 입력창 패딩 개선**:
  - `Input` 컴포넌트의 클래스에서 `px-3`이 우측 패딩 `pr-9`을 덮어써서 우측 정렬된 숫자와 '원' 텍스트가 겹치던 현상 수정
  - `pl-3 pr-10`(우측 패딩 40px)으로 충분한 여백을 확보하여 긴 금액 입력 시에도 '원' 단위 기호와 겹치지 않도록 조치
  - 우측 '원' 텍스트에 `pointer-events-none select-none`을 추가하여 클릭 시 인풋 포커스 방해 방지
- 단위/통합/라우팅 테스트 38개 전체 통과 및 프로덕션 빌드 완료

## [1.7.6] - 2026-09-07

### 연복리 계산기 투자 상식 및 유의사항 안내 카드 추가 (Compound Info Card)
- **복리 투자 상식 및 유의사항 카드(`CompoundInfoCard.tsx`) 신설**:
  - 단위 변환기 및 환율 계산기와의 UI/UX 일관성을 위해 연복리 계산기 하단(`DataTable` 아래)에 컴팩트 정보 카드 추가
  - 72의 법칙, 복리 효과(스노우볼), 절세 계좌(ISA 9.9% 분리과세) 활용 팁, 금융소득 종합과세(2,000만 원 초과) 기준을 압축형 불릿으로 제공
  - 고정 수익률 가정 및 원금 손실·물가상승률(인플레이션) 리스크에 대한 법적/시뮬레이션 유의사항 명시
- **디자인 시스템 100% 일치**:
  - `ghost.design.md` 라운드 카드(`rounded-2xl bg-slate-50 dark:bg-[#1e293b] border`) 및 Electric Lime 아이콘 포인트 적용
- 단위/통합/라우팅 테스트 38개 전체 통과 및 프로덕션 빌드 완료

## [1.7.5] - 2026-09-07

### 폼 UI 요소 shadcn/ui 컴포넌트 전면 표준화 (Form UI Standardization)
- **복리 계산기 입력 폼(`CalculatorForm.tsx`) shadcn 전환**:
  - 초기 투자 원금, 정기 추가 적립금, 연 예상 수익률, 커스텀 세율 입력 필드를 네이티브 `<input>`에서 shadcn `<Input>` 컴포넌트로 전면 교체
  - 목표 투자 기간 및 연수익률 조절 슬라이더를 네이티브 `<input type="range">`에서 shadcn `<Slider>` 컴포넌트로 전환 (키보드 화살표 1단계 정밀 제어 지원)
- **단위 변환기(`DualConverterCard.tsx`) shadcn 전환**:
  - 수치 입력 인풋을 shadcn `<Input>` 컴포넌트로 교체하고 기존 Ghost 미니멀 타이포그래피 스타일 보존
- **환율 계산기(`DualExchangeCard.tsx`) shadcn 전환**:
  - 환전 금액 입력 인풋을 shadcn `<Input>` 컴포넌트로 교체하고 기존 Ghost 미니멀 타이포그래피 스타일 보존
- **디자인 및 기능 완벽 보존**:
  - `ghost.design.md` 모노크롬(#15171a, #0b0c0e) 및 Electric Lime(#d1ff19) 포커스 링 스타일 100% 유지
  - 단위/통합/라우팅 테스트 38개 전체 통과 및 프로덕션 빌드 완료

## [1.7.4] - 2026-09-07

### 웹 표준 및 웹 접근성(WCAG 2.1 / KWCAG) 강화 적용 (Web Standards & Accessibility)
- **뷰포트 화면 확대(Zoom) 보장 (WCAG 1.4.4)**:
  - `index.html`에서 저시력자 핀치 줌을 가로막던 `user-scalable=no, maximum-scale=1.0`을 제거하고 표준 뷰포트로 전환
- **모든 폼 입력 필드 Accessible Name 매핑 (WCAG 1.3.1 & 4.1.2)**:
  - `CalculatorForm.tsx`: 초기 원금, 정기 적립금, 투자 기간(슬라이더), 예상 연수익률 입력 필드에 `id`, `htmlFor`, 명시적 `aria-label` 완벽 연결
  - `DualConverterCard.tsx`: 출발 단위 입력 필드에 `aria-label` 및 `<label htmlFor>` 매핑
  - `DualExchangeCard.tsx`: 출발 통화 입력 필드에 `aria-label` 및 `<label htmlFor>` 매핑
- **아코디언 키보드 접근성 및 상태 음성 표기 (WCAG 2.1.1 & 4.1.2)**:
  - `DataTable.tsx`: 연도별 자산 흐름표 아코디언 헤더를 시맨틱 `<button type="button" aria-expanded={isOpen}>`으로 전환하여 Tab/Enter/Space 키보드 조작 및 개폐 상태 인식 보장
- **시맨틱 랜드마크 완성도 제고 (HTML5 Semantic)**:
  - `SidebarDrawer.tsx`: 하단 카피라이트/버전 영역을 시맨틱 `<footer>` 태그로 래핑하여 5대 랜드마크 체계 수립
- 단위/통합/라우팅 테스트 38개 전체 통과 및 프로덕션 빌드 완료

## [1.7.3] - 2026-09-07

### 코드 리뷰 권장 조치 및 라우트 코드 스플리팅 적용 (Route Splitting & Robustness)
- **라우트 단위 코드 스플리팅 (`React.lazy` & `Suspense`)**:
  - `CompoundInterestApp`, `UnitConverterApp`, `ExchangeApp`을 동적 임포트로 분리
  - 초기 진입 번들 크기 262kB ➔ 154kB로 41% 경감하여 첫 로딩 속도(FCP/LCP) 대폭 향상
  - 로딩 중 Ghost 스타일 미니멀 스피너 폴백 표시
- **복리 수치 연산 NaN 방어 코드 적용**:
  - `src/utils/calculator.ts`의 `calculateCompoundInterest`에 `Number.isFinite` 검증을 적용하여 비정상 입력 시 자산 성장 테이블 전체 오염 원천 차단
  - 신규 복리 계산기 단위 테스트(`calculator.test.ts`) 5종 추가
- **네트워크 타임아웃 및 로컬스토리지 안정화**:
  - `fetchLiveExchangeRates`에 5초 타임아웃 신호(`AbortController`) 추가로 네트워크 지연 시 무한 대기 방지
  - `useLocalStorage`에 SSR 환경 가드 및 `undefined` 직렬화 예외 방지 코드 추가
- 단위/통합/라우팅 테스트 38개 전체 통과 및 프로덕션 빌드 완료

## [1.7.2] - 2026-09-07

### 테스트 환경 최적화 및 패키지 메타데이터 동기화 (Test Optimization & Metadata Sync)
- **테스트 러너 콘솔 로그 청결화**:
  - JSDOM 환경에서 Recharts `ResponsiveContainer` 크기 계산 불가로 발생하던 `stderr` 경고 로그(`width(0) and height(0)...`) 제거
  - `src/test/setup.ts`에 Recharts `ResponsiveContainer` 테스트 Mock 래퍼 적용으로 33개 테스트 완전 무경고 클린 패스 달성
- **패키지 메타데이터 동기화**:
  - `package.json`의 프로젝트명을 `smart-calculator-hub`로 동기화하여 멀티 계산기 플랫폼 정체성 일원화
- 단위/라우팅 테스트 33개 전체 통과

## [1.7.1] - 2026-09-07

### 전역 단일 컨테이너 너비 표준화 적용 (Global Container Max-Width Standardization)
- **페이지 이동 시 콘텐츠 폭 불일치 및 덜컹거림 완벽 해소**:
  - 개별 페이지마다 달랐던 컨테이너 최대 너비(연복리 1280px ↔ 단위 변환 1024px ↔ 환율 896px)를 전역 단일 규격인 `max-w-5xl` (1024px)로 일원화
  - `GlobalHeader.tsx`: 헤더 내부 컨테이너를 엣지-투-엣지(`w-full px-4 sm:px-6`)로 확장하여, 페이지 타이틀(좌측)과 테마 토글 버튼(우측)이 화면 양 끝에 시원하게 밀착 배치되도록 개선
  - `App.tsx`: `<main>` 메인 뷰포트 컨테이너를 `max-w-5xl` 단일 규격으로 유지하여 본문 가독성과 밸런스 확보
  - `UnitConverterApp.tsx` & `ExchangeApp.tsx`: 개별 컴포넌트에 하드코딩되어 있던 중복 `max-w-*`를 제거하고 부모 컨테이너 너비(`w-full`)를 자연스럽게 100% 채우도록 개선
- 단위/라우팅 테스트 33개 전체 통과 및 프로덕션 빌드 완료

## [1.7.0] - 2026-09-07

### 전역 다크 모드 시스템 및 shadcn UI 모드 토글 버튼 구현 (Global Dark Mode System & Mode Toggle)
- **사용자 요청 반영: shadcn UI 표준 모드 토글 버튼 (`ThemeToggle.tsx`)**:
  - 글로벌 헤더 우측 상단에 정갈한 `h-9 w-9` 아이콘 버튼(`Button variant="outline" size="icon"`)으로 전면 교체
  - 라이트/다크 전환 시 Sun(태양)과 Moon(달) 아이콘이 부드럽게 회전 및 스케일 모션(`dark:-rotate-90 dark:scale-0`, `rotate-90 scale-0 dark:rotate-0 dark:scale-100`)으로 전환
  - Radix UI Tooltip을 연동하여 마우스 오버 시 "다크 모드로 전환" / "라이트 모드로 전환" 안내
  - 글로벌 헤더 우측 상단 1곳으로 단일화하여 불필요한 중복 배제
- **전역 테마 상태 아키텍처 구축 (`ThemeContext.tsx`)**:
  - 시스템 선호도(OS 다크 모드) 자동 감지 및 `localStorage`(`theme-preference`) 영구 동기화
  - `<html>` 루트 엘리먼트의 `.dark` 클래스 및 `color-scheme` 동적 제어
  - SSR 및 jsdom 테스트 환경 대응 방어 코드 적용
  - 새로고침 시 화면 번쩍임 방지(FOUC 차단): `index.html` 인라인 스크립트 적용
- **전체 컴포넌트 및 3대 계산기 다크 모드 스타일 완벽 지원**:
  - **공통 UI Primitives**: `card`, `input`, `select`, `button`, `badge`, `sheet`, `table`, `slider` 다크 테마 토큰 적용
  - **연복리 계산기**: 메인 폼, 퀵 버튼, 요약 카드, 데이터 테이블, 시나리오 비교 뷰 다크 모드 지원
  - **Recharts 인터랙티브 차트 다크 모드 적응**: `ChartDashboard.tsx`에서 차트 그리드, 축, 툴팁, 면적/라인 색상이 다크 배경에 최적화되도록 구현 (Electric Lime `#d1ff19` 악센트 적용)
  - **단위 변환기**: 듀얼 인풋 카드, 카테고리 탭, 퀵 프리셋 칩, 일괄 환산 그리드 다크 모드 지원
  - **환율 계산기**: 듀얼 환율 카드, 환전 방식 탭, 프리셋 칩, 일괄 환산표, 환율 정보 카드 다크 모드 지원
  - **글로벌 네비게이션**: 데스크탑 헤더, 사이드바, 모바일 드로어(Sheet), 플레이스홀더 뷰 다크 모드 지원
- 단위/라우팅 테스트 33개 전체 통과 및 프로덕션 빌드 완료

## [1.6.5] - 2026-09-07

### 전역 페이지 라우트 전환 부드러운 페이드인 애니메이션 구현 (Page Transition Fade Motion)
- **React Router 라우트 전환 시 깜빡임 없이 부드러운 페이드 전환**:
  - 데스크탑 좌측 사이드바 및 모바일 드로어에서 메뉴 이동 시 화면이 즉시 바뀌지 않고 부드럽게 안착되도록 전환 효과 적용
  - `src/App.tsx`의 `<Routes>` 컨테이너를 `<div key={location.pathname} className="animate-page-fade">`로 래핑하여 경로 변경 시마다 애니메이션이 100% 확실하게 트리거되도록 구현
  - **애니메이션 스펙**: 200ms `ease-out`, 미세한 수직 안착(`translate3d(0, 4px, 0)` -> `translate3d(0, 0, 0)`), 불투명도 점진 증가(`opacity: 0` -> `1`)
  - `tailwind.config.js` 및 `src/index.css`에 `page-fade` / `pageFadeIn`을 명시적으로 선언하여 Tailwind 빌드 누락 방지 및 하드웨어 GPU 가속 보장
- 단위/라우팅 테스트 33개 전체 통과 및 프로덕션 빌드 완료

## [1.6.4] - 2026-09-07

### 모바일 사이드바 드로어 하드웨어 가속 슬라이드 애니메이션 구현 (Mobile Drawer Smooth Motion)
- **모바일 햄버거 메뉴 슬라이드오버 드로어(Sheet) 애니메이션 복구 및 고도화**:
  - `Sheet` 컴포넌트 내 CSS Transition과 Tailwind Animate 키프레임의 충돌로 인해 애니메이션이 생략(깜빡임)되던 문제를 근본적으로 해결
  - 브라우저 GPU 하드웨어 가속(`translate3d`)을 사용하는 독립 키프레임(`slideInFromLeft`, `slideOutToLeft`)을 `index.css`에 직접 선언
  - **열림(Open)**: 280ms 부드러운 감속 곡선(`cubic-bezier(0.16, 1, 0.3, 1)`)으로 좌측 화면 바깥에서 스르륵 진입
  - **닫힘(Close)**: 220ms 가속 곡선으로 좌측 화면 바깥으로 스르륵 퇴장
  - **배경 오버레이(Overlay)**: 드로어 전환 속도에 맞춘 280ms/220ms 딤드(Dimmed) 페이드인/아웃 애니메이션 적용
- 단위/라우팅 테스트 33개 전체 통과 및 프로덕션 빌드 완료

## [1.6.3] - 2026-09-07

### 모바일 퍼스트 뷰포트(360px~390px) 텍스트 깨짐 및 레이아웃 전면 개선 (Mobile-First UX Refinement)
- **듀얼 인풋/결과 카드 모바일 텍스트 깨짐 및 가로 넘침(Overflow) 방지**:
  - `DualExchangeCard.tsx` & `DualConverterCard.tsx`
  - 출발(From) / 도착(To) 상단 라벨을 `입력 (From)` 및 `결과 (To)`로 간결화하고 `whitespace-nowrap`을 적용하여 좁은 모바일 화면(가용 폭 270px 이하)에서 단어 중간 줄바꿈 찌그러짐 현상 원천 해결
  - 도착(To) 카드 복사 버튼을 텍스트 없는 콤팩트 `Tooltip` 아이콘 버튼(`w-7 h-7`)으로 통일하여 가로 공간 45px 이상 확보
  - 드롭다운 셀렉트 너비를 모바일 `w-28 sm:w-36 lg:w-44` 가변형으로 최적화 및 `truncate` 처리
- **일괄 환산표 헤더 모바일 반응형 2행 구조 적용**:
  - `MultiExchangeGrid.tsx` & `MultiResultGrid.tsx`
  - 모바일(360px)에서 긴 타이틀("전체 주요 통화 실시간 일괄 환산")과 기준 배지가 한 줄에 억지로 배치되어 글자가 3~4줄로 깨지던 현상 해소
  - 모바일에서는 1행(타이틀 + 우측 기준 배지), 2행(보조 설명문구 풀 너비)으로 분리하여 가독성 극대화 (`sm` 이상에서는 기존 1행 가로 정렬 유지)
- **환율 계산기 상단 환전 방식 탭 및 기준일 바 모바일 최적화**:
  - 환전 방식 탭 3개를 모바일에서 `w-full grid grid-cols-3`로 꽉 채워 텍스트 줄바꿈 방지 및 엄지 터치 영역 확대
  - 고시 기준일 및 1통화 환율 정보를 모바일 1행(`w-full flex items-center justify-between`)으로 독립 분리
  - 은행 우대율 바도 모바일에서 줄바꿈 왜곡 없이 컴팩트하게 정렬
- 단위/라우팅 테스트 33개 전체 통과 및 프로덕션 빌드 완료

## [1.6.2] - 2026-09-07

### 디자인 및 UX 스타일 전면 통일 (UI/UX Alignment)
- **듀얼 인풋/아웃풋 카드 스타일 1:1 표준화 (`DualConverterCard` ↔ `DualExchangeCard`)**:
  - **출발(From) 카드**: 상단 라벨 및 우측 콤팩트 셀렉트(`h-8 text-xs font-bold`), 하단 무경계 대형 숫자 인풋(`text-2xl sm:text-3xl font-extrabold tabular-nums`) 레이아웃 완전 일원화
  - **도착(To) 카드**: Near-black(`bg-[#15171a] text-white rounded-2xl`) 다크 하이라이트 카드 통일, 결과값 복사 버튼(Tooltip 안내 및 복사 완료 피드백) 및 우측 다크 셀렉트 드롭다운 배치 통일
  - **중앙 맞바꾸기(Swap) 버튼**: 원형 버튼 디자인 및 Tooltip 안내(`단위 맞바꾸기 / 통화 맞바꾸기`) 완벽 일치
- **전체 일괄 환산표 그리드 구조 통일 (`MultiResultGrid` ↔ `MultiExchangeGrid`)**:
  - **헤더 규격**: 좌측 타이틀 및 보조 설명문구, 우측 기준값 안내 배지(`기준: 84 ㎡` / `기준: 100 USD`) 양 화면 공통 적용
  - **카드 레이아웃**: 상단(라벨/기호 + 우측 Tooltip 복사 버튼)과 하단(대형 볼드 수치 + 우측 단위 기호) 2단 분할 레이아웃으로 100% 동일화
  - 활성 카드(`bg-slate-50 border-[#15171a]`)와 일반 카드(`bg-white border-[#e5e7eb]`) 테두리 및 룩앤필 일치화
- 단위 및 라우팅 테스트 33개 전체 통과 및 프로덕션 빌드 검증 완료

## [1.6.1] - 2026-09-07

### 개선 및 기능 추가 (Improved & Added)
- **환율 고시 기준일 표시 및 백그라운드 자동 최신화 (Auto-Sync)**:
  - 듀얼 환율 카드 상단에 **고시 기준일(예: `고시 기준: 2026.09.07`)** 및 실시간 연동 상태 인디케이터 제공
  - 페이지 진입 시 글로벌 공시 환율 API(`open.er-api.com`)를 통한 백그라운드 비동기 자동 갱신 및 캐싱 적용
  - 네트워크 단절(오프라인 PWA) 시에도 캐시 및 기본 고시 환율을 통해 100% 끊김 없는 동작 보장
- **환율 데이터 출처 및 법적 고지 안내문(Disclaimer) 추가**:
  - 하단 안내 카드에 글로벌 공시 매매기준율 출처 명시
  - 은행별 환전 시점, 거래 지점, 우대 쿠폰 등에 따른 실제 체결 금액과의 차이 발생 가능성 및 최종 거래 전 금융기관 확인 권고 안내문 반영 (문구 내 컬러 이모지 전면 배제)
- 단위 테스트(`exchangeCalculator.test.ts`) 동적 환율 매핑 검증 추가 (총 33개 테스트 전체 통과)

## [1.6.0] - 2026-09-07

### 신규 기능 추가 (Added)
- **환율 계산기(Currency Exchange) 신규 모듈 구현 및 서비스 런칭 (`/exchange`)**:
  - **6대 핵심 통화 지원**: 대한민국 원(`KRW`), 미국 달러(`USD`), 일본 엔(`JPY 100엔당`), 유럽 유로(`EUR`), 중국 위안(`CNY`), 영국 파운드(`GBP`)
  - **오프라인 100% 동작 보장 (PWA)**: 신뢰도 높은 기본 기준 환율을 내장하여 인터넷 연결이 없는 상태에서도 정상 환산
  - **은행 환전 수수료 & 우대율(스프레드) 시뮬레이터**:
    - 거래 유형(매매기준율, 현찰 살 때, 현찰 팔 때) 지원
    - 우대율(0%, 50%, 80%, 90%) 선택 및 우대 혜택으로 절약된 수수료 금액 실시간 계산 및 시각적 하이라이트
  - **모바일 퍼스트 UX**:
    - 대형 24px 라운드 듀얼 환율 카드 및 원터치 통화 맞바꿈(`⇄ Swap`) 버튼
    - 여행 및 해외 직구 퀵 프리셋 칩 (`$100`, `$200 면세`, `10,000엔`, `€100`, `100만원`)
    - 전체 6대 통화 일괄 실시간 비교 그리드 (`MultiExchangeGrid`)
    - 환전 상식 및 면세 유의사항 안내 카드 (문구 내 컬러 이모지 배제 원칙 엄수)
  - `LocalStorage` 자동 저장/복원 및 브라우저 타이틀 동적 연동
  - PRD 공통화(모바일 퍼스트 및 디자인 시스템 상위 섹션 통합) 및 단위 테스트 추가 (총 32개 테스트 통과)

## [1.5.5] - 2026-09-07

### 개선 및 명칭 표준화 (Improved & Refined)
- **페이지 타이틀 및 개별 계산기 국문 명칭에서 '스마트' 수식어 제거**:
  - 단위 변환기의 공식 명칭 및 페이지 브라우저 타이틀을 `스마트 단위 변환기` ➔ `단위 변환기`로 간결화
  - `연복리 & 자산성장 계산기`, `실시간 환율 계산기` 등과 같이 도구 본래의 직관적 명칭으로 통일성 확보
  - 글로벌 브랜딩을 위한 영문 표기(`Smart Calculator Hub`, `Smart Calculator`)는 유지
  - PRD 명세 및 라우팅 단위 테스트(`App.routing.test.tsx`) 동기화

## [1.5.4] - 2026-09-07

### 스타일 및 UI 정밀 보정 (Style & Refined)
- **한글 텍스트 세로 중앙 정렬(광학적 중심선) 미세 조정**:
  - Pretendard 한글 폰트의 라틴 baseline 여백으로 인한 상단 들뜸 현상을 해소하기 위해 `leading-normal` 및 미세 baseline 패딩(`pt-[0.5px]` ~ `pt-[1px]`) 적용
  - 사이드바 로고 텍스트, 메뉴 네비게이션 버튼, 글로벌 헤더 타이틀, 단위 탭, 프리셋 칩, 셀렉트 트리거 등 전역 컴포넌트 세로 정렬 최적화
- **컬러 이모지 전면 배제 및 단색 시스템 벡터 아이콘 원칙 확립**:
  - 알록달록한 유니코드 컬러 이모지(💡 등)를 UI에서 전면 배제하고, 통일된 모노크롬 Lucide 벡터 아이콘(`Info` 등)으로 시각적 완성도 및 가독성 향상
  - 단위 변환기 하단 대한민국 부동산 및 일상 안내 카드에 단색 `<Info />` 벡터 아이콘 배치

## [1.5.3] - 2026-09-07

### 개선 및 기능 추가 (Improved & Added)
- **단위 변환기 카테고리별 1순위 생활 프리셋 및 기본 도착 단위 표준화**:
  - `CATEGORY_DEFAULTS` 설정을 구축하여 탭 전환 시 가장 대표적인 생활 질문 시나리오로 자동 세팅:
    - **넓이**: `84㎡` ➔ `평` (국민평형 84㎡는 몇 평일까?)
    - **길이**: `1인치` ➔ `cm` (1인치는 몇 cm일까?)
    - **무게**: `순금 1돈` ➔ `g` (금 1돈은 몇 g일까?)
    - **부피**: `1갤런(US)` ➔ `L` (1갤런은 몇 리터일까?)
    - **온도**: `체온 36.5℃` ➔ `℉` (정상 체온 36.5도는 화씨 몇 도일까?)
  - 프리셋 칩 선택 시 도착 단위 중복 방지 및 상호 단위 스마트 전환 로직 보강
  - 카테고리별 기본값 매핑 유닛 테스트 추가 (총 27개 테스트 통과)

## [1.5.2] - 2026-09-07

### 개선 및 리팩터링 (Improved & Refactored)
- **shadcn/ui `Select` 컴포넌트 전면 도입 및 네이티브 select 태그 대체**:
  - `@radix-ui/react-select` 기반 모듈형 컴포넌트 구축 (`src/components/ui/select.tsx`)
  - Ghost 디자인 시스템의 Hairline 테두리, 둥근 모서리, 다크/라이트 양방향 테마 스타일링 적용
  - **스마트 단위 변환기 (`DualConverterCard.tsx`)**: 출발 단위(From) 및 도착 단위(To) 드롭다운을 shadcn Select로 마이그레이션
  - **연복리 계산기 (`CalculatorForm.tsx`)**: 복리 주기 및 이자소득 과세 체계 드롭다운을 shadcn Select로 마이그레이션
  - `select.test.tsx` 단위 테스트 작성 및 통과 (총 26개 테스트 전체 통과)

## [1.5.1] - 2026-09-07

### 개선 및 리팩터링 (Improved & Refactored)
- **전역 설정 파일(`src/config/site.ts`) 도입 및 사이트 브랜딩 명칭 전면 통일**:
  - `siteConfig` 객체를 신설하여 국문 사이트명(`스마트 계산기 허브`), 영문 사이트명(`Smart Calculator Hub`), 앱/쇼트명(`스마트 계산기`), 영문 서브타이틀(`Smart Calculator`), 카피라이트(`© sosoFactory`) 등을 단일 공급원으로 표준화
- **사이드바 로고 영역 수직 중앙 정렬(Vertical Center) 보정**:
  - 검은색 계산기 아이콘(`w-9 h-9`)과 우측 2줄 텍스트 블록의 세로 중심선을 완벽히 수직 중앙으로 일치
  - 불필요한 'Ghost Design Edition' 수식어를 제거하고 직관적인 영문 서브타이틀(`Smart Calculator`)로 정돈
- **사이드바 푸터 카피라이트 반영**:
  - Ghost 문구 배제 및 공식 카피라이트 표기 (`© sosoFactory • 스마트 계산기 v1.5.1`)
- **전역 타이틀 헬퍼 및 메타데이터 동기화**:
  - `GlobalHeader.tsx`, `CompoundInterestApp.tsx`, `UnitConverterApp.tsx`, `index.html`에 `siteConfig` 전면 연동
  - `site.test.ts` 단위 테스트 작성 완료 (총 25개 테스트 통과)

## [1.5.0] - 2026-09-07

### 추가 (Added)
- **스마트 단위 변환기 (Unit Converter) 전면 구현 및 라우팅 연동 (`/unit`)**:
  - **5대 카테고리 실시간 변환 지원**: 넓이(면적), 길이, 무게(질량), 부피(용량), 온도
  - **부동산 특화 평수 ↔ ㎡ 원클릭 변환**: 아파트 84㎡(25.4평), 59㎡(17.8평), 114㎡ 등 국민평형 프리셋 탑재
  - **한국 생활 밀착 단위 지원**: 순금 1돈(3.75g), 육류 1근(600g), 자/척(尺) 등
  - **대형 듀얼 인터랙티브 변환 카드 (`DualConverterCard`)**: 출발 단위 입력 및 도착 단위 실시간 환산, 원터치 맞바꿈(Swap `⇄`), 소수점 정밀도(0, 2, 4, 6자리) 선택, 기준 공식 가이드
  - **전체 단위 일괄 변환표 (`MultiResultGrid`)**: 한 번의 입력으로 카테고리 내 모든 단위로 실시간 동시 변환 및 원클릭 복사(`Copy`) 지원
  - **모바일 퍼스트 가로 스크롤 카테고리 탭 (`UnitCategoryTabs`)**: 터치 친화적 UI 및 좁은 뷰포트 최적화
  - **Ghost 디자인 시스템 완벽 적용**: Near-black (`#15171a`), Electric Lime (`#d1ff19`), Flat Hairline (`#e5e7eb`), 24px Round Card
  - **단위 변환 엔진 TDD 테스트 완료**: 11개 단위 변환 검증 테스트 추가 (총 23개 테스트 통과)
  - **LocalStorage 데이터 지속성**: 최근 사용 카테고리, 단위, 입력값 자동 저장 및 복원

## [1.4.1] - 2026-09-07

### 수정 및 개선 (Fixed & Improved)
- **사이드바-글로벌 헤더 하단 보더 라인 수평 정렬 일치**:
  - 좌측 사이드바 로고 영역과 우측 글로벌 헤더 영역의 높이를 `h-16 (64px)` 및 `flex items-center`로 통일하여 헤더 하단 구분선(`border-b`)의 단차 및 수평선 불일치 완벽 해소
- **연복리 차트 단순화**:
  - 단일 모드에서 불필요한 '영역형 / 선형' 토글 버튼을 제거하고, 누적 원금과 순이자 추이를 직관적으로 보여주는 단일 영역형 차트(`AreaChart`)로 고정
- **연 예상 수익률 프리셋 UI 정리**:
  - 수익률 프리셋 버튼(`RATE_PRESETS`) 내 불필요한 아이콘을 배제하고 수치/라벨 텍스트 중심으로 직관적 정돈

## [1.4.0] - 2026-09-07

### 추가 및 변경 (Added & Changed)
- **Ghost 디자인 시스템(`ghost.design.md`) 전면 도입 및 shadcn/ui 표준 토큰 개편**:
  - 기존 Teal 디자인 시스템을 완전히 버리고 Ghost 특유의 미니멀리즘 및 에디토리얼 스타일로 전면 교체
  - **Electric Lime (`#d1ff19`)**: 12px 대문자 트래킹 아이브로우 및 뱃지 포인트로 절제된 볼티지 적용
  - **Near-Black CTA (`#15171a`)**: 화이트 텍스트, 6px 둥근 모서리, 39px 규격의 시그니처 버튼 적용
  - **Deep Teal-Ink (`#112220`)**: 헤드라인 및 주요 텍스트 색상 적용
  - **Flat Hairline (`#e5e7eb`, `#1f2937`)**: 그림자를 배제하고 플랫한 헤어라인 테두리 중심의 깊이감 구현
  - **Shapes**: 메인 카드 표면에 Ghost 사양의 24px 대형 둥근 모서리(`rounded-[24px]`) 전면 적용
  - **Pretendard Variable 웹폰트 전면 유지**: 한글 및 금융 숫자의 가독성을 극대화하며 Ghost 타이포그래피 비율과 결합
  - **Recharts 시각화 테마**: Ghost 다크 대시보드 밴드 스타일과 라임/라벤더 데이터 라인 적용
  - shadcn 컴포넌트(`Button`, `Card`, `Badge`, `Input`, `Slider`, `Table`, `Tooltip`, `Sheet`) Ghost 토큰 마이그레이션 완료

## [1.3.0] - 2026-09-07

### 추가 및 변경 (Added & Changed)
- **PWA (Progressive Web App) 도입 및 오프라인 지원**:
  - `vite-plugin-pwa` 및 Workbox 서비스 워커 자동 등록 (`dist/sw.js`)
  - Web App Manifest (`dist/manifest.webmanifest`): 192x192, 512x512 고해상도 앱 아이콘 및 maskable 규격 적용
  - 정적 자산(JS, CSS, HTML, 폰트, SVG) 오프라인 프리캐싱으로 네트워크 단절 시에도 모든 계산기 기능 즉시 작동
  - iOS 홈 화면 바로가기 지원 (`apple-mobile-web-app-capable`, `apple-touch-icon`)
  - 안드로이드/데스크톱 브라우저 "앱으로 설치" 및 독립 창(`standalone`) 실행 환경 완벽 지원
- **shadcn/ui 툴팁(Tooltip) 컴포넌트 전면 도입 및 네이티브 title 속성 대체**:
  - `@radix-ui/react-tooltip` 기반 shadcn `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` 구축
  - TDD 단위 테스트 작성 (`src/components/ui/tooltip.test.tsx`)
  - 브라우저 기본 `title` 속성을 제거하고 세련된 다크 테마 플로팅 툴팁 및 접근성(`aria-label`)으로 전면 교체 (기본값 초기화 버튼, 자산 구성 비율 게이지, 모바일 햄버거 메뉴, 상세 흐름표 토글 버튼 등)

## [1.2.0] - 2026-09-07

### 추가 및 변경 (Added & Changed)
- **shadcn/ui 디자인 시스템 전면 도입**:
  - Radix UI 프리미티브 + Tailwind CSS 기반 모듈형 컴포넌트 시스템 구축
  - `Button`, `Card`, `Badge`, `Input`, `Slider`, `Table`, `Sheet` 컴포넌트 작성 (`src/components/ui/`)
- **기존 컴포넌트 shadcn/ui 전면 마이그레이션**:
  - `SidebarDrawer.tsx`: Radix Dialog 기반 모바일 슬라이드 드로어(`Sheet`) 및 `Badge` 적용
  - `GlobalHeader.tsx`: shadcn `Button`, `Badge` 적용
  - `SummaryCards.tsx`: shadcn `Card`, `Badge` 적용
  - `DataTable.tsx`: shadcn `Table`, `Button` 적용
  - `CalculatorForm.tsx` & `ComparisonView.tsx`: shadcn 컴포넌트 적용
- **TDD (Test-Driven Development) 파이프라인 구축**:
  - Vitest + Testing Library + JSDOM 기반 테스트 환경 구축
  - Red → Green 사이클을 통해 `Button`, `Card`, `Badge`, `Input`, `Table` 컴포넌트 단위 테스트 작성 및 100% 통과 (8개 테스트)
- **Pretendard Variable 가변 웹폰트 전면 적용**:
  - 전역 폰트를 Pretendard Variable로 교체하여 한글/숫자 가독성 최적화
- **마이너스(손실) 수익률 시뮬레이션 지원**:
  - 연 예상 수익률 범위를 `-30% ~ +50%`로 확장하여 시장 하락장 및 원금 손실 시나리오 분석 지원
  - 손실 발생 시 이자 소득세 0원 처리
  - 약세장(`-3%`), 하락장(`-10%`) 원터치 프리셋 칩 추가
  - 손실 구간 붉은색 시각적 피드백 및 원금 손실 배지 추가
- **음수 한글 통화 포맷팅 지원 (`src/utils/formatters.ts`)**:
  - `formatKoreanUnit`에서 음수 발생 시 `-1억 2,000만 원`처럼 정상적인 한글 금액 포맷팅 지원
- **Vite 번들 최적화 (Code Splitting)**:
  - Rollup `manualChunks` 적용으로 `vendor-charts`, `vendor-react`, `vendor-icons` 청크 분리
  - 초기 로딩 JS 청크 크기 대폭 감소로 모바일 네트워크 로딩 성능 극대화

## [1.0.0] - 2026-09-06

### 추가 (Added)
- **모바일 우선 연복리 계산기 프론트엔드 구축**:
  - React + Vite + TypeScript + Tailwind CSS 기반 모바일 반응형 SPA 구현
  - Pretendard 웹폰트 및 터치 친화적 UI 레이아웃 설계
- **정밀 복리 계산 엔진 (`src/utils/calculator.ts`)**:
  - 초기 원금 및 정기 적립(월/년/거치) 복리 미래가치 산출
  - 복리 주기 지원 (월복리, 연복리, 분기복리, 일복리)
  - 한국형 이자소득 과세 옵션 지원 (일반과세 15.4%, 비과세 0%, 세금우대/ISA 9.9%, 직접입력)
  - 연도별 시계열 자산 성장 데이터 생성
- **시나리오 A / B 비교 모드 (`src/components/ComparisonView.tsx`)**:
  - 두 가지 투자 전략 간의 최종 자산, 세후 순이자, 수익률 격차 분석 배너 및 카드
  - "시나리오 A 조건 복사" 기능 제공
- **인터랙티브 차트 대시보드 (`src/components/ChartDashboard.tsx`)**:
  - Recharts 기반의 반응형 자산 성장 차트 (누적 영역형 및 선형 차트 지원)
  - 모바일 터치 최적화 커스텀 툴팁 (한글 원화 및 억/만 단위 실시간 표시)
- **모바일 터치 편의 UX**:
  - 빠른 원화 증감 버튼 (`+10만`, `+50만`, `+100만`, `+1,000만`, `정정`)
  - 대표 연수익률 프리셋 칩 (`예적금 3.5%`, `배당/채권 5%`, `지수 ETF 8%`, `공격투자 12%`)
  - 빠른 투자 기간 칩 (`5년`, `10년`, `15년`, `20년`, `30년`)
  - 슬라이더와 콤마 포맷팅 인풋 간 양방향 실시간 동기화
- **연도별 상세 흐름표 (`src/components/DataTable.tsx`)**:
  - 접이식 아코디언 테이블 및 엑셀 호환 UTF-8 BOM CSV 내보내기 기능
- **데이터 보존 (`src/hooks/useLocalStorage.ts`)**:
  - 브라우저 LocalStorage 자동 저장 및 기본값 초기화 기능
- **검증 및 문서화**:
  - 수학적 정합성 검증 (단위 테스트 통과)
  - [PRD.md](PRD.md) 및 상세 구현 계획서 작성
