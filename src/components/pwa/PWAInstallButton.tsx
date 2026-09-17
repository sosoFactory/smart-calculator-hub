import React from 'react';
import { Download, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface PWAInstallButtonProps {
  variant?: 'header' | 'sidebar';
  className?: string;
  onActionComplete?: () => void;
}

/**
 * PWA 설치 및 가이드 유도 버튼 컴포넌트
 * - 헤더(Header): [앱 설치] - 즉시 네이티브 설치 다이얼로그(지원 시) 또는 전역 가이드 모달 호출
 * - 사이드바(Sidebar): [앱 설치 가이드] - 단계별 설치 가이드 모달 호출 및 모바일 드로어 닫힘 지원
 * - standalone 구동 시 자동 숨김
 */
export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  className = '',
  onActionComplete,
}) => {
  const { isInstalled, openModal, install } = usePWAInstall();

  // 이미 독립 실행(standalone) 앱으로 구동 중인 경우 숨김
  if (isInstalled) {
    return null;
  }

  if (variant === 'sidebar') {
    return (
      <Button
        type="button"
        variant="outline"
        aria-label="앱 설치 가이드"
        onClick={() => {
          onActionComplete?.();
          openModal();
        }}
        className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white dark:bg-ghost-dark-surface hover:bg-slate-50 dark:hover:bg-ghost-dark-hover text-xs font-semibold text-[#112220] dark:text-ghost-dark-ink border border-[#e5e7eb] dark:border-ghost-dark-hairline-soft transition-colors ${className}`}
      >
        <Smartphone className="w-4 h-4 text-[#112220] dark:text-ghost-dark-ink shrink-0" />
        <span className="truncate">앱 설치 가이드</span>
      </Button>
    );
  }

  // Header variant (상단 헤더 상시 노출: "앱 설치")
  return (
    <div className={`flex items-center ${className}`}>
      {/* 데스크톱: 아이콘 + 텍스트 */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-label="스마트 계산기 앱 설치"
        onClick={install}
        className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 text-xs font-semibold rounded-md border-[#e5e7eb] dark:border-ghost-dark-hairline-soft bg-white dark:bg-ghost-dark-surface hover:bg-slate-50 dark:hover:bg-ghost-dark-hover text-[#112220] dark:text-ghost-dark-ink transition-colors"
      >
        <Download className="w-4 h-4 text-[#112220] dark:text-ghost-dark-ink shrink-0" />
        <span>앱 설치</span>
      </Button>

      {/* 모바일: 아이콘 단독 + 툴팁 */}
      <div className="sm:hidden">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={install}
              className="h-9 w-9 rounded-md border-[#e5e7eb] dark:border-ghost-dark-hairline-soft bg-white dark:bg-ghost-dark-surface hover:bg-slate-50 dark:hover:bg-ghost-dark-hover text-[#112220] dark:text-ghost-dark-ink transition-colors"
              aria-label="스마트 계산기 앱 설치"
            >
              <Download className="w-4 h-4 text-[#112220] dark:text-ghost-dark-ink" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">앱 설치</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};


