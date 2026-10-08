import React from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { useClipboard } from '../../hooks/useClipboard';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

export interface CopyResultButtonProps {
  /** 복사할 텍스트 문자열 또는 함수 */
  text: string | (() => string);
  /** 기본 라벨 (기본값: '결과 복사') */
  label?: string;
  /** 복사 완료 후 라벨 (기본값: '복사 완료') */
  copiedLabel?: string;
  /** 버튼 변형 스타일 */
  variant?: 'outline' | 'default' | 'ghost' | 'secondary';
  /** 버튼 크기 */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /** 커스텀 추가 클래스명 */
  className?: string;
  /** 툴팁 위치 (기본값: 'top') */
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  /** 복사 성공 시 추가 콜백 */
  onCopied?: () => void;
}

export const CopyResultButton: React.FC<CopyResultButtonProps> = ({
  text,
  label = '결과 복사',
  copiedLabel = '복사 완료',
  variant = 'outline',
  size = 'sm',
  className = '',
  tooltipSide = 'top',
  onCopied,
}) => {
  const { copy, isCopied } = useClipboard(2000);
  const copied = isCopied('copy-button');

  const handleCopy = async () => {
    const content = typeof text === 'function' ? text() : text;
    if (!content) return;
    const success = await copy(content, 'copy-button');
    if (success && onCopied) {
      onCopied();
    }
  };

  const defaultStyles =
    'h-7 px-2.5 text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700 hover:text-white transition-colors';

  if (size === 'icon') {
    return (
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={variant}
              size={size}
              onClick={handleCopy}
              className={className || 'h-7 w-7 text-slate-300 hover:text-white hover:bg-slate-800 dark:hover:bg-ghost-dark-surface rounded-md shrink-0 p-0'}
              aria-label={copied ? copiedLabel : label}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-300" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={tooltipSide}>
            {copied ? copiedLabel : label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={className ? className : defaultStyles}
      aria-label={copied ? copiedLabel : label}
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 mr-1 text-[#d1ff19]" />
          <span>{copiedLabel}</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3 mr-1 text-slate-300" />
          <span>{label}</span>
        </>
      )}
    </Button>
  );
};
