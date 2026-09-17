import React, { useState, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { CalculatorId, CALCULATORS_LIST, HOME_NAVIGATION_ITEM } from './types/navigation';
import { SidebarDrawer } from './components/navigation/SidebarDrawer';
import { GlobalHeader } from './components/navigation/GlobalHeader';
import { PlaceholderView } from './components/common/PlaceholderView';
import { TooltipProvider } from './components/ui/tooltip';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from './components/ui/toaster';
import { PWAUpdateToast } from './components/pwa/PWAUpdateToast';
import { PWAInstallModal } from './components/pwa/PWAInstallModal';
import { usePWAInstall } from './hooks/usePWAInstall';
import { FloatingShareButton } from './components/common/FloatingShareButton';
import { Analytics } from '@vercel/analytics/react';

const HomeApp = lazy(() =>
  import('./home/HomeApp').then((m) => ({ default: m.HomeApp }))
);
const CompoundInterestApp = lazy(() =>
  import('./calculators/compound-interest/CompoundInterestApp').then((m) => ({ default: m.CompoundInterestApp }))
);
const UnitConverterApp = lazy(() =>
  import('./calculators/unit-converter/UnitConverterApp').then((m) => ({ default: m.UnitConverterApp }))
);
const ExchangeApp = lazy(() =>
  import('./calculators/exchange-rate/ExchangeApp').then((m) => ({ default: m.ExchangeApp }))
);
const LoanApp = lazy(() =>
  import('./calculators/loan-calculator/LoanApp').then((m) => ({ default: m.LoanApp }))
);
const SalaryApp = lazy(() =>
  import('./calculators/salary-calculator/SalaryApp').then((m) => ({ default: m.SalaryApp }))
);
const BmiApp = lazy(() =>
  import('./calculators/bmi-calculator/BmiApp').then((m) => ({ default: m.BmiApp }))
);
const GoalApp = lazy(() =>
  import('./calculators/goal-calculator/GoalApp').then((m) => ({ default: m.GoalApp }))
);

const CalculatorLoadingFallback = () => (
  <div className="w-full py-20 flex flex-col items-center justify-center space-y-3">
    <div className="w-7 h-7 rounded-full border-2 border-[#15171a] dark:border-slate-300 border-t-transparent animate-spin" />
    <span className="text-xs text-[#64748b] dark:text-ghost-dark-ink-mute font-medium">화면을 불러오는 중...</span>
  </div>
);

export const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // URL 경로로부터 현재 활성화된 계산기 ID 도출
  const pathId = location.pathname.replace(/^\//, '') as CalculatorId;
  const isHome = location.pathname === '/' || location.pathname === '/home';
  const currentCalculator = isHome
    ? HOME_NAVIGATION_ITEM
    : (CALCULATORS_LIST.find((c) => c.id === pathId) ?? CALCULATORS_LIST[0]);

  // 모바일 드로어 상태
  const [isOpenMobileDrawer, setIsOpenMobileDrawer] = useState(false);

  // 전역 PWA 설치 가이드 모달 상태
  const { isModalOpen, closeModal, install, isInstallable } = usePWAInstall();

  // 메뉴 선택 시 해당 URL 경로로 이동
  const handleSelectCalculator = (id: CalculatorId) => {
    if (id === 'home') {
      navigate('/');
    } else {
      navigate(`/${id}`);
    }
  };

  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={150}>
        <div className="min-h-screen bg-white dark:bg-ghost-dark-canvas text-[#112220] dark:text-ghost-dark-ink flex font-sans transition-colors duration-200">
      {/* 1. 좌측 사이드바 (데스크톱 고정 & 모바일 슬라이드 드로어) */}
      <SidebarDrawer
        activeId={currentCalculator.id}
        onSelect={handleSelectCalculator}
        isOpenMobile={isOpenMobileDrawer}
        onCloseMobile={() => setIsOpenMobileDrawer(false)}
      />

      {/* 2. 우측 메인 뷰포트 영역 (고정 헤더 높이 h-16만큼 상단 여백 확보) */}
      <div className="flex-1 flex flex-col min-w-0 pt-16">
        {/* 글로벌 상단 헤더 */}
        <GlobalHeader
          currentCalculator={currentCalculator}
          onOpenMobileMenu={() => setIsOpenMobileDrawer(true)}
        />

        {/* 메인 콘텐츠 라우팅 작업 공간 (페이지 전환 시 부드러운 페이드인 트랜지션) */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 py-4 sm:px-6 sm:py-6">
          <div key={location.pathname} className="animate-page-fade">
            <Suspense fallback={<CalculatorLoadingFallback />}>
              <Routes location={location}>
                <Route path="/" element={<HomeApp />} />
                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route path="/compound" element={<CompoundInterestApp />} />
                <Route path="/unit" element={<UnitConverterApp />} />
                <Route path="/bmi" element={<BmiApp />} />
                <Route path="/exchange" element={<ExchangeApp />} />
                <Route path="/loan" element={<LoanApp />} />
                <Route path="/salary" element={<SalaryApp />} />
                <Route
                  path="/dividend"
                  element={
                    <PlaceholderView
                      calculator={CALCULATORS_LIST.find((c) => c.id === 'dividend') ?? CALCULATORS_LIST[0]}
                      onGoToCompound={() => navigate('/')}
                    />
                  }
                />
                <Route
                  path="/goal"
                  element={<GoalApp />}
                />
                {/* 정의되지 않은 경로는 메인 홈 대시보드로 리다이렉트 */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>
      <PWAUpdateToast />
      <PWAInstallModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onInstall={install}
        isInstallable={isInstallable}
      />
      <FloatingShareButton />
      <Toaster />
      <Analytics />
    </div>
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default App;
