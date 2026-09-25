import React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { RotateCcw } from 'lucide-react';

export interface FormHeaderProps {
  /** 카테고리 뱃지 라벨 (예: '알바 설계', '급여 설계', '대출 설계', '목표 설계' 등) */
  badge: string;
  /** 폼 메인 제목 (예: '알바 근무 조건 입력', '급여 조건 입력' 등) */
  title: string;
  /** 한 줄 안내 설명 */
  description: string;
  /** 초기화 핸들러 (지정 시 표준 초기화 버튼 렌더링) */
  onReset?: () => void;
  /** 초기화 버튼 좌측에 배치할 추가 액션 슬롯 (예: 연복리 '시나리오 복사' 버튼) */
  extraActions?: React.ReactNode;
}

/**
 * 전 계산기 입력 폼 상단 헤더 공통 표준 컴포넌트 (SSOT)
 * - 뱃지 위치: 항상 제목 '앞'에 위치 (Badge variant="meta" size="sm")
 * - 폼 메인 제목: h2, text-sm sm:text-base font-bold
 * - 부가 설명: text-xs text-[#64748b] dark:text-ghost-dark-ink-mute break-keep
 * - 우측 초기화 버튼: Button variant="ghost" size="sm" h-8 px-2.5 gap-1.5
 */
export const FormHeader: React.FC<FormHeaderProps> = ({
  badge,
  title,
  description,
  onReset,
  extraActions,
}) => {
  return (
    <div className="flex items-center justify-between pb-3 border-b border-[#e5e7eb] dark:border-ghost-dark-hairline gap-2">
      <div className="space-y-0.5 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="meta" size="sm" className="shrink-0 font-bold">
            {badge}
          </Badge>
          <h2 className="text-sm sm:text-base font-bold text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap">
            {title}
          </h2>
        </div>
        <p className="text-xs text-[#64748b] dark:text-ghost-dark-ink-mute break-keep">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {extraActions}

        {onReset && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 px-2.5 gap-1.5 text-xs text-slate-500 dark:text-ghost-dark-ink-mute hover:text-[#112220] dark:hover:text-white rounded-lg shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>초기화</span>
          </Button>
        )}
      </div>
    </div>
  );
};
