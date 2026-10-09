import React from 'react';
import { Link } from 'react-router-dom';
import {
  CalculatorId,
  CALCULATORS_LIST,
  CATEGORY_NAMES,
  CalculatorCategory,
  compareCalculatorsKorean,
} from '../../types/navigation';
import {
  TrendingUp,
  Ruler,
  ArrowLeftRight,
  Landmark,
  Calendar,
  Target,
  Calculator,
  Wallet,
  LayoutDashboard,
  Activity,
  Coins,
  CalendarDays,
  Flame,
  Star,
  CodeXml,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '../ui/sheet';
import { Button } from '../ui/button';
import { siteConfig } from '../../config/site';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { useFavorites } from '../../hooks/useFavorites';

interface SidebarDrawerProps {
  activeId: CalculatorId;
  onSelect: (id: CalculatorId) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  activeId,
  onSelect,
  isOpenMobile,
  onCloseMobile,
}) => {
  const renderIcon = (id: CalculatorId, isActive: boolean) => {
    const cls = `w-4 h-4 shrink-0 transition-colors ${
      isActive
        ? 'text-ghost-ink dark:text-ghost-dark-ink'
        : 'text-ghost-ink-mute dark:text-ghost-dark-ink-mute'
    }`;
    switch (id) {
      case 'home':
        return <LayoutDashboard className={cls} />;
      case 'compound':
        return <TrendingUp className={cls} />;
      case 'unit':
        return <Ruler className={cls} />;
      case 'bmi':
        return <Activity className={cls} />;
      case 'exchange':
        return <ArrowLeftRight className={cls} />;
      case 'loan':
        return <Landmark className={cls} />;
      case 'salary':
        return <Wallet className={cls} />;
      case 'part-time':
        return <Coins className={cls} />;
      case 'dividend':
        return <Calendar className={cls} />;
      case 'goal':
        return <Target className={cls} />;
      case 'cashflow':
        return <Flame className={cls} />;
      case 'date':
        return <CalendarDays className={cls} />;
      case 'devtools':
        return <CodeXml className={cls} />;
      default:
        return <Calculator className={cls} />;
    }
  };

  const categories: CalculatorCategory[] = ['finance', 'lifestyle', 'global'];
  const { favorites } = useFavorites();

  const favoriteCalculators = CALCULATORS_LIST.filter(
    (calc) => favorites.includes(calc.id) && calc.status !== 'coming-soon'
  ).sort(compareCalculatorsKorean);

  const menuContent = (
    <div className="flex flex-col h-full bg-white dark:bg-ghost-dark-surface-drawer text-ghost-ink dark:text-ghost-dark-ink transition-colors duration-200">
      {/* 헤더 로고 영역 (클릭 시 홈으로 이동) */}
      <Link
        to="/"
        onClick={() => {
          onSelect('home');
          onCloseMobile();
        }}
        className="h-16 px-4 border-b border-ghost-hairline dark:border-ghost-dark-hairline flex items-center shrink-0 cursor-pointer group hover:bg-ghost-surface-deep/80 dark:hover:bg-ghost-dark-hover transition-colors no-underline text-inherit"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src="/logo.svg"
            alt="스마트 계산기 허브 로고"
            className="w-8 h-8 shrink-0 object-contain group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col justify-center min-w-0">
            <span className="font-bold text-[15px] tracking-tight text-ghost-ink dark:text-ghost-dark-ink block leading-snug truncate pt-[1px]">
              {siteConfig.name}
            </span>
            <span className="text-[11px] text-ghost-ink-mute dark:text-ghost-dark-ink-mute font-medium block leading-normal tracking-tight truncate">
              {siteConfig.nameEn}
            </span>
          </div>
        </div>
      </Link>

      {/* 메뉴 목록 */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {/* 즐겨찾기가 있을 때: 대시보드 대신 즐겨찾기 메뉴 섹션 출력 / 없을 때: 대시보드 홈 메뉴 출력 */}
        {favoriteCalculators.length > 0 ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2.5 mb-1.5">
              <span className="text-[11px] font-bold text-ghost-ink-mute dark:text-ghost-dark-ink-mute uppercase tracking-wider flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-ghost-ink dark:text-ghost-dark-ink fill-current" />
                즐겨찾기
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-ghost-surface-deep dark:bg-ghost-dark-surface-elevated text-ghost-ink dark:text-ghost-dark-ink tabular-nums border border-ghost-hairline dark:border-ghost-dark-hairline-soft">
                {favoriteCalculators.length}
              </span>
            </div>
            {favoriteCalculators.map((item) => {
              const isActive = activeId === item.id;
              return (
                <Button
                  key={`fav-${item.id}`}
                  asChild
                  variant="ghost"
                  className={`w-full h-auto justify-between px-3 py-2.5 rounded-md text-left font-normal transition-colors ${
                    isActive
                      ? 'bg-ghost-surface-deep dark:bg-ghost-dark-surface-elevated text-ghost-ink dark:text-ghost-dark-ink font-bold border border-ghost-hairline dark:border-ghost-dark-hairline-soft hover:bg-ghost-surface-deep dark:hover:bg-ghost-dark-surface-elevated'
                      : 'text-ghost-ink-soft dark:text-ghost-dark-ink-soft hover:bg-ghost-hover dark:hover:bg-ghost-dark-hover hover:text-ghost-ink dark:hover:text-ghost-dark-ink font-medium'
                  }`}
                >
                  <Link
                    to={`/${item.id}`}
                    onClick={() => {
                      onSelect(item.id);
                      onCloseMobile();
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {renderIcon(item.id, isActive)}
                      <span className="text-xs sm:text-sm truncate pt-[0.5px] leading-normal font-medium">
                        {item.shortName}
                      </span>
                    </div>
                  </Link>
                </Button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-1">
            <div className="px-2.5 mb-1.5 text-[11px] font-bold text-ghost-ink-mute dark:text-ghost-dark-ink-mute uppercase tracking-wider">
              대시보드
            </div>
            <Button
              asChild
              variant="ghost"
              className={`w-full h-auto justify-between px-3 py-2.5 rounded-md text-left font-normal transition-colors ${
                activeId === 'home'
                  ? 'bg-ghost-surface-deep dark:bg-ghost-dark-surface-elevated text-ghost-ink dark:text-ghost-dark-ink font-bold border border-ghost-hairline dark:border-ghost-dark-hairline-soft hover:bg-ghost-surface-deep dark:hover:bg-ghost-dark-surface-elevated'
                  : 'text-ghost-ink-soft dark:text-ghost-dark-ink-soft hover:bg-ghost-hover dark:hover:bg-ghost-dark-hover hover:text-ghost-ink dark:hover:text-ghost-dark-ink font-medium'
              }`}
            >
              <Link
                to="/"
                onClick={() => {
                  onSelect('home');
                  onCloseMobile();
                }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {renderIcon('home', activeId === 'home')}
                  <span className="text-xs sm:text-sm truncate pt-[0.5px] leading-normal font-semibold">
                    홈 (대시보드)
                  </span>
                </div>
              </Link>
            </Button>
          </div>
        )}
        {categories.map((cat) => {
          // 출시 예정(coming-soon) 항목은 메뉴 목록에서 제외하고 가나다 순 동적 정렬
          const items = CALCULATORS_LIST
            .filter((calc) => calc.category === cat && calc.status !== 'coming-soon')
            .sort(compareCalculatorsKorean);
          if (items.length === 0) return null;

          return (
            <div key={cat} className="space-y-1">
              <div className="px-2.5 mb-1.5 text-[11px] font-bold text-ghost-ink-mute dark:text-ghost-dark-ink-mute uppercase tracking-wider">
                {CATEGORY_NAMES[cat]}
              </div>

              {items.map((item) => {
                const isActive = activeId === item.id;
                const isComingSoon = item.status === 'coming-soon';

                return (
                  <Button
                    key={item.id}
                    asChild
                    variant="ghost"
                    className={`w-full h-auto justify-between px-3 py-2.5 rounded-md text-left font-normal transition-colors ${
                      isActive
                        ? 'bg-ghost-surface-deep dark:bg-ghost-dark-surface-elevated text-ghost-ink dark:text-ghost-dark-ink font-bold border border-ghost-hairline dark:border-ghost-dark-hairline-soft hover:bg-ghost-surface-deep dark:hover:bg-ghost-dark-surface-elevated'
                        : isComingSoon
                        ? 'text-ghost-ink-stone dark:text-ghost-dark-ink-stone hover:bg-ghost-hover dark:hover:bg-ghost-dark-hover'
                        : 'text-ghost-ink-soft dark:text-ghost-dark-ink-soft hover:bg-ghost-hover dark:hover:bg-ghost-dark-hover hover:text-ghost-ink dark:hover:text-ghost-dark-ink font-medium'
                    }`}
                  >
                    <Link
                      to={`/${item.id}`}
                      onClick={() => {
                        onSelect(item.id);
                        onCloseMobile();
                      }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {renderIcon(item.id, isActive)}
                        <span className="text-xs sm:text-sm truncate pt-[0.5px] leading-normal">
                          {item.shortName}
                        </span>
                      </div>
                    </Link>
                  </Button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* 메뉴 목록 하단 PWA 설치 가이드 버튼 영역 (PRD 8.2 명세 준수) */}
      <div className="p-3 pb-4">
        <PWAInstallButton variant="sidebar" onActionComplete={onCloseMobile} />
      </div>
    </div>
  );

  return (
    <>
      {/* 1. 데스크톱 고정 사이드바 */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-ghost-hairline dark:border-ghost-dark-hairline bg-white dark:bg-ghost-dark-surface-drawer min-h-screen sticky top-0 h-screen z-20 transition-colors duration-200">
        {menuContent}
      </aside>

      {/* 2. 모바일 shadcn Sheet 드로어 */}
      <Sheet open={isOpenMobile} onOpenChange={(open) => !open && onCloseMobile()}>
        <SheetContent side="left" className="w-4/5 max-w-xs p-0 border-r border-ghost-hairline dark:border-ghost-dark-hairline dark:bg-ghost-dark-surface-drawer">
          <SheetTitle className="sr-only">전체 계산기 메뉴</SheetTitle>
          {menuContent}
        </SheetContent>
      </Sheet>
    </>
  );
};
