import React from 'react';
import { CalculatorItem } from '../../types/navigation';
import { Menu } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../ui/tooltip';
import { ThemeToggle } from './ThemeToggle';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { siteConfig } from '../../config/site';

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
  return (
    <header className="bg-white/95 dark:bg-ghost-dark-canvas/90 backdrop-blur-md border-b border-[#e5e7eb] dark:border-ghost-dark-hairline fixed top-0 left-0 right-0 lg:left-64 z-30 h-16 flex items-center shrink-0 transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 flex items-center justify-between gap-2">
        {/* 좌측: 모바일 햄버거 메뉴 버튼 + 계산기 타이틀 */}
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
            <div className="text-[11px] font-bold text-[#112220] dark:text-ghost-dark-ink-soft uppercase tracking-widest leading-normal mb-0.5 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#d1ff19]" />
              <span className="pt-[0.5px] truncate">{siteConfig.nameEn}</span>
            </div>

            <div className="flex items-center min-w-0">
              <h1 className="text-sm sm:text-base md:text-lg font-bold text-[#112220] dark:text-ghost-dark-ink truncate tracking-tight leading-tight">
                {currentCalculator.name}
              </h1>
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
