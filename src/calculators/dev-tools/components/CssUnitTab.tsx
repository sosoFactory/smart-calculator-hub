import React, { useState, useId } from 'react';
import { Copy, Check, Type, Layers } from 'lucide-react';
import {
  convertPxToRem,
  convertRemToPx,
  convertPxToCssUnits,
} from '../../../utils/devToolsCalculator';
import { useClipboard } from '../../../hooks/useClipboard';
import { SelectableChip } from '../../../components/ui/selectable-chip';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '../../../components/ui/tooltip';

const COMMON_PRESETS = [4, 8, 12, 14, 16, 20, 24, 32, 40, 48, 64];

export const CssUnitTab: React.FC = () => {
  const pxInputId = useId();
  const remInputId = useId();
  const rootFontInputId = useId();

  const [rootFontSize, setRootFontSize] = useState<number>(16);
  const [pxValue, setPxValue] = useState<number>(16);
  const [remValue, setRemValue] = useState<number>(1);
  const { copy, isCopied } = useClipboard();

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

  const numericPx = Number.isNaN(Number(pxValue)) ? 0 : Number(pxValue);
  const allUnits = convertPxToCssUnits(numericPx, rootFontSize);

  const unitCards = [
    {
      id: 'em',
      name: '부모 상대 단위 (EM)',
      symbol: 'em',
      value: `${allUnits.em}`,
      unitSuffix: 'em',
      copyText: `${allUnits.em}em`,
      desc: '부모 요소 폰트 크기 기준 상대 비율',
    },
    {
      id: 'percent',
      name: '백분율 (%)',
      symbol: '%',
      value: `${allUnits.percent}`,
      unitSuffix: '%',
      copyText: `${allUnits.percent}%`,
      desc: `기준 폰트(${rootFontSize}px = 100%) 대비 백분율`,
    },
    {
      id: 'pt',
      name: '인쇄 포인트 (PT)',
      symbol: 'pt',
      value: `${allUnits.pt}`,
      unitSuffix: 'pt',
      copyText: `${allUnits.pt}pt`,
      desc: '1pt = 0.75px (1/72 inch 인쇄·그래픽 표준)',
    },
    {
      id: 'tailwind',
      name: 'Tailwind Spacing',
      symbol: 'class',
      value: allUnits.tailwind ? allUnits.tailwind.split(' ')[0] : `[${allUnits.rem}rem]`,
      unitSuffix: '',
      copyText: allUnits.tailwind ? allUnits.tailwind.split(' ')[0] : `[${allUnits.rem}rem]`,
      desc: allUnits.tailwind ? `스페이싱: ${allUnits.tailwind}` : `임의 클래스 [${allUnits.rem}rem]`,
    },
  ];

  return (
    <TooltipProvider delayDuration={150}>
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
            <div className="flex items-center gap-1.5">
              {[14, 16, 18].map((size) => (
                <SelectableChip
                  key={size}
                  isSelected={rootFontSize === size}
                  onClick={() => handleRootChange(size)}
                >
                  {size}px
                </SelectableChip>
              ))}
            </div>
            <div className="flex items-center gap-1.5 ml-auto sm:ml-2">
              <label htmlFor={rootFontInputId} className="sr-only">
                루트 폰트 크기 입력
              </label>
              <Input
                id={rootFontInputId}
                type="number"
                value={rootFontSize || ''}
                onChange={(e) => handleRootChange(Number(e.target.value))}
                min={1}
                max={64}
                className="w-16 h-8 text-center text-xs font-bold"
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
                onClick={() => copy(`${pxValue}px`, 'px')}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-ghost-ink-mute dark:text-ghost-dark-ink-mute hover:text-ghost-ink dark:hover:text-ghost-dark-ink transition-colors"
              >
                {isCopied('px') ? (
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
              <Input
                id={pxInputId}
                type="number"
                value={pxValue || ''}
                onChange={(e) => handlePxChange(Number(e.target.value))}
                step="any"
                className="h-12 font-mono text-lg sm:text-xl font-bold pr-10"
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
                렘 (REM)
              </label>
              <button
                type="button"
                onClick={() => copy(`${remValue}rem`, 'rem')}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-ghost-ink-mute dark:text-ghost-dark-ink-mute hover:text-ghost-ink dark:hover:text-ghost-dark-ink transition-colors"
              >
                {isCopied('rem') ? (
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
              <Input
                id={remInputId}
                type="number"
                value={remValue || ''}
                onChange={(e) => handleRemChange(Number(e.target.value))}
                step="any"
                className="h-12 font-mono text-lg sm:text-xl font-bold pr-12"
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
              <SelectableChip
                key={p}
                isSelected={pxValue === p}
                onClick={() => handlePxChange(p)}
              >
                {p}px
              </SelectableChip>
            ))}
          </div>
        </div>

        {/* 실무 핵심 단위 일괄 변환 카드 (단일 통합 그리드) */}
        <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-ghost-hairline dark:border-ghost-dark-hairline bg-white dark:bg-ghost-dark-surface space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-ghost-ink-mute dark:text-ghost-dark-ink-mute" />
              <h3 className="text-sm sm:text-base font-bold text-ghost-ink dark:text-ghost-dark-ink">
                실무 핵심 CSS 단위 일괄 변환
              </h3>
            </div>
            <span className="text-[11px] font-medium text-ghost-ink-mute dark:text-ghost-dark-ink-soft bg-ghost-surface dark:bg-ghost-dark-surface-elevated px-2.5 py-1 rounded-full shrink-0">
              기준: {pxValue}px ({remValue}rem)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            {unitCards.map((card) => {
              const copied = isCopied(card.id);

              return (
                <div
                  key={card.id}
                  className="p-3.5 rounded-xl border border-ghost-hairline dark:border-ghost-dark-hairline bg-ghost-surface/50 dark:bg-ghost-dark-surface-deep flex flex-col justify-between hover:border-ghost-hairline-strong transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-ghost-ink dark:text-ghost-dark-ink block truncate">
                        {card.name}
                      </span>
                      <span className="text-[10px] text-ghost-ink-mute dark:text-ghost-dark-ink-mute">
                        {card.symbol}
                      </span>
                    </div>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => copy(card.copyText, card.id)}
                          className="h-7 w-7 text-ghost-ink-mute hover:text-ghost-ink dark:hover:text-white hover:bg-slate-100 dark:hover:bg-ghost-dark-hover rounded-md shrink-0"
                          aria-label={`${card.name} 복사`}
                        >
                          {copied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        {copied ? '복사 완료!' : `${card.copyText} 복사`}
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="mt-1 flex items-baseline justify-between gap-1 overflow-x-auto">
                    <span className="font-extrabold text-base sm:text-lg text-ghost-ink dark:text-ghost-dark-ink tracking-tight truncate font-mono">
                      {card.value}
                    </span>
                    {card.unitSuffix && (
                      <span className="text-xs font-semibold text-ghost-ink-mute dark:text-ghost-dark-ink-mute shrink-0">
                        {card.unitSuffix}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 pt-2 border-t border-ghost-hairline dark:border-ghost-dark-hairline min-h-[20px]">
                    <p className="text-[10px] text-ghost-ink-mute dark:text-ghost-dark-ink-stone truncate">
                      {card.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
