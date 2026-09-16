# 스마트 계산기 허브 (Smart Calculator Hub)

<div align="center">

  ![스마트 계산기 허브 로고](./public/logo.svg)

  <p>
    <strong>일상과 금융 생활을 위한 스마트 멀티 계산기 플랫폼</strong><br />
    모바일 퍼스트 · 100% 오프라인 PWA · Ghost 미니멀 디자인 시스템
  </p>

  <p>
    <a href="https://soso-calculator.vercel.app"><img src="https://img.shields.io/badge/Web_Beta-soso--calculator.vercel.app-d1ff19?style=flat-square&logo=vercel&logoColor=black&labelColor=15171a" alt="웹 베타 서비스" /></a>
    <img src="https://img.shields.io/badge/version-1.9.32-d1ff19?style=flat-square&labelColor=15171a" alt="Version" />
    <img src="https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react&logoColor=black&labelColor=15171a" alt="React 18" />
    <img src="https://img.shields.io/badge/TypeScript-5.5-3178c6?style=flat-square&logo=typescript&logoColor=white&labelColor=15171a" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-5.4-646cff?style=flat-square&logo=vite&logoColor=white&labelColor=15171a" alt="Vite" />
    <img src="https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white&labelColor=15171a" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/PWA-Ready-10b981?style=flat-square&logo=pwa&logoColor=white&labelColor=15171a" alt="PWA" />
    <img src="https://img.shields.io/badge/Tests-139%20Passed-success?style=flat-square&logo=vitest&logoColor=white&labelColor=15171a" alt="Tests" />
  </p>

</div>

---

## 📱 미리보기 (Preview)

![스마트 계산기 허브 메인 화면](./docs/images/main-preview.png)

> **Ghost 디자인 시스템** 기반의 모노크롬 베이스와 **Electric Lime (`#d1ff19`)** 액센트로 시각적 잡음을 배제하고 계산 본질에 집중합니다.
> **🌐 공식 웹 서비스 (오픈 베타)**: [https://soso-calculator.vercel.app](https://soso-calculator.vercel.app)

---

## 🛠️ 7대 핵심 계산기 모듈
 
| 모듈명 | 주요 기능 및 특징 | 지원 세부 기능 |
| :--- | :--- | :--- |
| 📈 **[연복리 & 자산성장](https://soso-calculator.vercel.app/compound)** | 거치식·적립식 복리 시뮬레이션 및 A/B 전략 비교 | 과세 옵션(일반 15.4%, ISA 9.9%), -30%~+50% 손실 시뮬레이션, 연도별 자산 흐름표(CSV 내보내기) |
| 🎯 **[목표 자산 역산](https://soso-calculator.vercel.app/goal)** | 목표 자산(1억~100억) 달성에 필요한 월 적립액 역산 (Financial PMT) | 초기 거치금 반영, 연도별 누적 자산 형성 차트, 3.5%/7%/10% 수익률 시나리오 대조, 절세 계좌 |
| 💰 **[대출이자 & 상환방식](https://soso-calculator.vercel.app/loan)** | 원리금균등 · 원금균등 · 만기일시 3대 상환방식 한눈에 비교 | 최저 이자 방식 추천, 시중은행 3년 슬라이딩 중도상환 수수료 감면 시뮬레이션, 월별 스케줄표 |
| 💵 **[연봉 실수령액](https://soso-calculator.vercel.app/salary)** | 2026년 최신 4대 사회보험료 및 국세청 간이세액표 기준 | 6대 공제 항목 상세 명세표, 부양가족/비과세 반영, 근로자 본인 부담 vs 사업주 지원 듀얼 탭 |
| 🏃 **[BMI & 비만도](https://soso-calculator.vercel.app/bmi)** | 대한비만학회(KSSO) 한국인 기준 6단계 비만도 및 적정 체중 | 다단계 스펙트럼 게이지, 체중 조절 목표(감량/증량 권장치), ±1단위 미세 조절 버튼 |
| 📏 **[단위 변환기](https://soso-calculator.vercel.app/unit)** | 아파트 평수(평 ↔ ㎡), 순금 1돈(돈 ↔ g) 등 생활 밀착 단위 | 넓이·길이·무게·부피·온도 5대 카테고리, 대형 듀얼 카드 스왑, 전체 단위 일괄 변환 그리드 |
| 💱 **[실시간 환율](https://soso-calculator.vercel.app/exchange)** | 주요 6대 통화(USD, JPY, EUR 등) 실시간 환율 및 환전 우대율 | 국내 관행 역산 표기(0달러/0엔 방지), 은행별 매매기준율/스프레드 우대 계산, 퀵 프리셋 칩 |
 
---
 
## ✨ 핵심 특장점 (Key Highlights)
 
- **🎨 Ghost 미니멀 디자인 시스템**: 화려한 장식을 걷어내고 데이터와 수치의 가독성을 극대화한 단정한 UI.
- **📱 모바일 퍼스트 & 반응형 리플로우**: 모바일 한 손 조작 드로어부터 데스크톱 12컬럼 그리드까지 완벽 적응.
- **🔗 전 페이지 일관 플로팅 공유(FAB) & 딥링크**: 어디서든 1터치로 공유하고, 금융 시나리오는 URL 딥링크로 복원.
- **📶 100% 오프라인 동작 PWA**: 서비스 워커 캐싱을 통해 비행기 모드나 지하철 등 인터넷이 끊겨도 즉시 계산 가능.
- **⚡ 인앱 원클릭 설치 지원**: 브라우저에 구애받지 않고 헤더 및 사이드바에서 홈 화면/데스크톱 앱으로 즉시 설치.
- **🔒 데이터 프라이버시**: 모든 계산과 금융 수치는 외부 서버로 전송되지 않고 브라우저 로컬(`LocalStorage`)에만 안전하게 저장.
- **🧪 신뢰성 검증**: Vitest 및 Testing Library 기반 132개 단위 테스트 100% 통과로 검증된 금융 계산 정확도.
 
---
 
## 🏗️ 기술 스택 (Tech Stack)
 
```
Frontend    React 18 · TypeScript 5.5 · Vite 5.4 · React Router DOM v7
UI / UX     Tailwind CSS 3.4 · shadcn/ui · Lucide Icons · Recharts
PWA         vite-plugin-pwa · Workbox (Offline Precache & Stale-While-Revalidate)
Testing     Vitest · React Testing Library · jsdom
Font        Pretendard Variable (전역 단일 서체)
```
 
---
 
## 📄 라이선스 & 브랜딩
 
- **제작**: © [sosoFactory](https://github.com/sosoFactory)
- **라이선스**: MIT License
- **버전**: `v1.9.30`
