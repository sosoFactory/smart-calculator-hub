import React from 'react';
import { cn } from '../../lib/utils';

export interface ResultHeroCardProps {
  /** 상단 라벨 / 뱃지 슬롯 */
  badge?: React.ReactNode;
  /** 상단 우측 액션 슬롯 (예: CopyResultButton) */
  action?: React.ReactNode;
  /** 메인 산출 결과 (대형 수치) */
  mainValue?: React.ReactNode;
  /** 한글 금액 독음 (예: "3억 4,500만 원") */
  koreanReading?: string;
  /** 메인 수치 하단 보조 텍스트 또는 뱃지 */
  subtext?: React.ReactNode;
  /** 하단 추가 영역 (프로그레스 바, 분할 메트릭 등) 또는 전체 커스텀 바디 */
  children?: React.ReactNode;
  /** 루트 컨테이너 추가 클래스명 */
  className?: string;
  /** 배경 글로우 장식 표시 여부 (기본값: true) */
  showGlow?: boolean;
}

export const ResultHeroCard: React.FC<ResultHeroCardProps> = ({
  badge,
  action,
  mainValue,
  koreanReading,
  subtext,
  children,
  className,
  showGlow = true,
}) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-[#15171a] dark:bg-ghost-dark-surface-elevated border border-[#15171a] dark:border-ghost-dark-hairline-soft text-white p-5 sm:p-6 shadow-sm transition-colors',
        className
      )}
    >
      {/* 우측 하단 Electric Lime 글로우 장식 */}
      {showGlow && (
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#d1ff19]/10 blur-2xl pointer-events-none" />
      )}

      <div className="relative z-10 space-y-3">
        {/* 상단 헤더: 라벨/뱃지와 우측 액션 */}
        {(badge || action) && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              {badge}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}

        {/* 메인 수치 및 한글 독음 영역 */}
        {mainValue && (
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#d1ff19] tracking-tight">
              {mainValue}
              {koreanReading && (
                <span className="text-xs sm:text-sm font-normal text-slate-300 ml-2">
                  ({koreanReading})
                </span>
              )}
            </div>
            {subtext && <div className="text-xs text-slate-300">{subtext}</div>}
          </div>
        )}

        {/* 자식 요소 (추가 슬롯) */}
        {children}
      </div>
    </div>
  );
};
