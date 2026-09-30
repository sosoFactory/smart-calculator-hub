import React from 'react';
import { CalculatorItem } from '../../types/navigation';
import { Menu, Star } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../ui/tooltip';
import { ThemeToggle } from './ThemeToggle';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { siteConfig } from '../../config/site';
import { useFavorites } from '../../hooks/useFavorites';

interface GlobalHeaderProps {
  currentCalculator: CalculatorItem;
  onOpenMobileMenu: () => void;
  headerActions?: React.ReactNode;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  currentCalculator,
  onOpenMobileMenu,
  headerActions,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(currentCalculator.id);

  return (
    <header className="bg-white/95 dark:bg-ghost-dark-canvas/90 backdrop-blur-md border-b border-ghost-hairline dark:border-ghost-dark-hairline fixed top-0 left-0 right-0 lg:left-64 z-30 h-16 flex items-center shrink-0 transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 flex items-center justify-between gap-2">
        {/* 좌측: 모바일 햄버거 메뉴 버튼 + 계산기 타이틀 + 즐겨찾기 버튼 */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1 mr-2">
          <div className="lg:hidden shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={onOpenMobileMenu}
                  className="h-9 w-9 dark:bg-ghost-dark-surface dark:border-ghost-dark-hairline-soft dark:text-ghost-dark-ink-base dark:hover:bg-ghost-dark-hover"
                  aria-label="메뉴 열기"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">메뉴 열기</TooltipContent>
            </Tooltip>
          </div>

          <div className="min-w-0 flex-1">
            {/* Ghost Signature: 12px Uppercase Eyebrow */}
            <div className="text-[11px] font-bold text-ghost-ink dark:text-ghost-dark-ink-soft uppercase tracking-widest leading-normal mb-0.5 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-ghost-lime" />
              <span className="pt-[0.5px] truncate">{siteConfig.nameEn}</span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <h1 className="text-sm sm:text-base md:text-lg font-bold text-ghost-ink dark:text-ghost-dark-ink truncate tracking-tight leading-tight">
                {currentCalculator.name}
              </h1>
              {currentCalculator.id !== 'home' && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(currentCalculator.id)}
                      className="p-1 rounded-md text-ghost-ink-stone hover:text-ghost-ink-soft dark:text-ghost-dark-ink-stone dark:hover:text-ghost-dark-ink transition-transform active:scale-90 shrink-0"
                      aria-label={isFav ? `${currentCalculator.shortName} 즐겨찾기 해제` : `${currentCalculator.shortName} 즐겨찾기 추가`}
                    >
                      <Star
                        className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${
                          isFav
                            ? 'text-ghost-ink dark:text-ghost-dark-ink fill-ghost-ink dark:fill-ghost-dark-ink'
                            : 'text-ghost-ink-stone dark:text-ghost-dark-ink-stone hover:text-ghost-ink dark:hover:text-ghost-dark-ink'
                        }`}
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {isFav ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>

        {/* 우측: 커스텀 액션, PWA 앱 설치 버튼 및 테마 토글 스위치 */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {headerActions}
          <PWAInstallButton variant="header" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
