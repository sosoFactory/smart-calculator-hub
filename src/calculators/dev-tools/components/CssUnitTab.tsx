import React, { useState, useId } from 'react';
import { Copy, Check, Sliders, Type, MoveRight } from 'lucide-react';
import {
  convertPxToRem,
  convertRemToPx,
  getTailwindSpacingHint,
} from '../../../utils/devToolsCalculator';
import { SubMetricCard } from '../../../components/common/SubMetricCard';

const COMMON_PRESETS = [4, 8, 12, 14, 16, 20, 24, 32, 40, 48, 64];

export const CssUnitTab: React.FC = () => {
  const pxInputId = useId();
  const remInputId = useId();
  const rootFontInputId = useId();

  const [rootFontSize, setRootFontSize] = useState<number>(16);
  const [pxValue, setPxValue] = useState<number>(16);
  const [remValue, setRemValue] = useState<number>(1);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handlePxChange = (px: number) => {
    setPxValue(px);
    setRemValue(convertPxToRem(px, rootFontSize));
  };

  const handleRemChange = (rem: number) => {
    setRemValue(rem);
    setPxValue(convertRemToPx(rem, rootFontSize));
  };

  const handleRootChange = (root: number) => {
    const validRoot = Math.max(1, root);
    setRootFontSize(validRoot);
    setRemValue(convertPxToRem(pxValue, validRoot));
  };

  const handleCopy = async (text: string, key: string) => {
    if (!text) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 1500);
      }
    } catch {
      // fallback
    }
  };

  const tailwindHint = getTailwindSpacingHint(remValue);
  const ptValue = Math.round((pxValue * 0.75) * 100) / 100;

  return (
    <div className="space-y-6">
      {/* 루트 기준 폰트 크기 설정 바 */}
      <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-ghost-hairline dark:border-ghost-dark-hairline bg-white dark:bg-ghost-dark-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-ghost-ink-mute dark:text-ghost-dark-ink-mute" />
          <span className="text-xs sm:text-sm font-semibold text-ghost-ink dark:text-ghost-dark-ink">
            루트(HTML) 기준 폰트 크기
          </span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1">
            {[14, 16, 18].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleRootChange(size)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-all ${
                  rootFontSize === size
                    ? 'bg-ghost-ink-base dark:bg-ghost-dark-surface-elevated text-white dark:text-ghost-dark-ink border-transparent'
                    : 'bg-ghost-surface dark:bg-ghost-dark-surface border-ghost-hairline dark:border-ghost-dark-hairline text-ghost-ink-soft dark:text-ghost-dark-ink-mute hover:bg-ghost-hover'
                }`}
              >
                {size}px
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 ml-auto sm:ml-2">
            <label htmlFor={rootFontInputId} className="sr-only">
              루트 폰트 크기 입력
            </label>
            <input
              id={rootFontInputId}
              type="number"
              value={rootFontSize || ''}
              onChange={(e) => handleRootChange(Number(e.target.value))}
              min={1}
              max={64}
              className="w-16 h-8 text-center text-xs font-bold rounded-md border border-ghost-hairline dark:border-ghost-dark-hairline bg-ghost-surface dark:bg-ghost-dark-surface-elevated text-ghost-ink dark:text-ghost-dark-ink focus:outline-none focus:ring-1 focus:ring-ghost-ink"
            />
            <span className="text-xs text-ghost-ink-mute dark:text-ghost-dark-ink-mute">px</span>
          </div>
        </div>
      </div>

      {/* px ↔ rem 대형 인터랙티브 변환 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* PX 입력 */}
        <div className="p-4 rounded-xl sm:rounded-2xl border border-ghost-hairline dark:border-ghost-dark-hairline bg-white dark:bg-ghost-dark-surface">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor={pxInputId}
              className="text-xs font-semibold text-ghost-ink dark:text-ghost-dark-ink cursor-pointer"
            >
              픽셀 (PX)
            </label>
            <button
              type="button"
              onClick={() => handleCopy(`${pxValue}px`, 'px')}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-ghost-ink-mute dark:text-ghost-dark-ink-mute hover:text-ghost-ink dark:hover:text-ghost-dark-ink transition-colors"
            >
              {copiedKey === 'px' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400">복사됨</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>값 복사</span>
                </>
              )}
            </button>
          </div>
          <div className="relative flex items-center">
            <input
              id={pxInputId}
              type="number"
              value={pxValue || ''}
              onChange={(e) => handlePxChange(Number(e.target.value))}
              step="any"
              className="w-full h-12 rounded-lg border border-ghost-hairline dark:border-ghost-dark-hairline bg-ghost-surface dark:bg-ghost-dark-surface-elevated text-ghost-ink dark:text-ghost-dark-ink font-mono text-lg sm:text-xl font-bold px-3 pr-10 focus:outline-none focus:ring-1 focus:ring-ghost-ink"
            />
            <span className="absolute right-3 text-xs font-semibold text-ghost-ink-mute dark:text-ghost-dark-ink-mute select-none">
              px
            </span>
          </div>
        </div>

        {/* REM 입력 */}
        <div className="p-4 rounded-xl sm:rounded-2xl border border-ghost-hairline dark:border-ghost-dark-hairline bg-white dark:bg-ghost-dark-surface">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor={remInputId}
              className="text-xs font-semibold text-ghost-ink dark:text-ghost-dark-ink cursor-pointer"
            >
              렘 (REM / EM)
            </label>
            <button
              type="button"
              onClick={() => handleCopy(`${remValue}rem`, 'rem')}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-ghost-ink-mute dark:text-ghost-dark-ink-mute hover:text-ghost-ink dark:hover:text-ghost-dark-ink transition-colors"
            >
              {copiedKey === 'rem' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400">복사됨</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>값 복사</span>
                </>
              )}
            </button>
          </div>
          <div className="relative flex items-center">
            <input
              id={remInputId}
              type="number"
              value={remValue || ''}
              onChange={(e) => handleRemChange(Number(e.target.value))}
              step="any"
              className="w-full h-12 rounded-lg border border-ghost-hairline dark:border-ghost-dark-hairline bg-ghost-surface dark:bg-ghost-dark-surface-elevated text-ghost-ink dark:text-ghost-dark-ink font-mono text-lg sm:text-xl font-bold px-3 pr-12 focus:outline-none focus:ring-1 focus:ring-ghost-ink"
            />
            <span className="absolute right-3 text-xs font-semibold text-ghost-ink-mute dark:text-ghost-dark-ink-mute select-none">
              rem
            </span>
          </div>
        </div>
      </div>

      {/* 실무 빈출 픽셀 프리셋 퀵 칩 */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-ghost-ink dark:text-ghost-dark-ink block">
          실무 빈출 크기 빠른 선택
        </span>
        <div className="flex items-center flex-wrap gap-1.5">
          {COMMON_PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handlePxChange(p)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-all ${
                pxValue === p
                  ? 'bg-ghost-ink-base dark:bg-ghost-dark-surface-elevated text-white dark:text-ghost-dark-ink border-transparent'
                  : 'bg-white dark:bg-ghost-dark-surface border-ghost-hairline dark:border-ghost-dark-hairline text-ghost-ink-soft dark:text-ghost-dark-ink-mute hover:bg-ghost-hover'
              }`}
            >
              {p}px
            </button>
          ))}
        </div>
      </div>

      {/* 3단 서브 요약 지표 (SubMetricCard) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        <SubMetricCard
          icon={Type}
          label="루트 기준 크기"
          value={`${rootFontSize}px`}
          description="1rem = 100% 폰트 비율"
        />
        <SubMetricCard
          icon={Sliders}
          label="인쇄 포인트 (PT)"
          value={`${ptValue}pt`}
          description="1pt = 1/72 inch 기준"
        />
        <SubMetricCard
          icon={MoveRight}
          label="Tailwind Spacing"
          value={tailwindHint ? `클래스 ${tailwindHint.split(' ')[0]}` : '커스텀 값'}
          description={tailwindHint ? `스페이싱 척도: ${tailwindHint}` : `arbitrary [${remValue}rem]`}
        />
      </div>
    </div>
  );
};
