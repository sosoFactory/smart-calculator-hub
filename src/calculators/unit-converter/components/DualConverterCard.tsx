import React, { useState } from 'react';
import { DecimalPrecision, UnitDefinition } from '../../../types/unit';
import { ArrowLeftRight, HelpCircle, Check, Copy } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { SegmentedControl } from '../../../components/ui/segmented-control';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';

interface DualConverterCardProps {
  units: UnitDefinition[];
  fromUnitId: string;
  toUnitId: string;
  inputValue: number | '';
  formattedConvertedValue: string;
  precision: DecimalPrecision;
  onInputChange: (val: number | '') => void;
  onFromUnitChange: (id: string) => void;
  onToUnitChange: (id: string) => void;
  onSwapUnits: () => void;
  onPrecisionChange: (p: DecimalPrecision) => void;
  ratioInfoText?: string;
}

export const DualConverterCard: React.FC<DualConverterCardProps> = ({
  units,
  fromUnitId,
  toUnitId,
  inputValue,
  formattedConvertedValue,
  precision,
  onInputChange,
  onFromUnitChange,
  onToUnitChange,
  onSwapUnits,
  onPrecisionChange,
  ratioInfoText,
}) => {
  const fromUnit = units.find((u) => u.id === fromUnitId) || units[0];
  const toUnit = units.find((u) => u.id === toUnitId) || units[1] || units[0];
  const [copied, setCopied] = useState(false);

  const handleCopyResult = async () => {
    const text = `${formattedConvertedValue} ${toUnit?.symbol || ''}`.trim();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback
    }
  };

  const precisionOptions: DecimalPrecision[] = [0, 2, 4, 6];

  return (
    <div className="bg-white dark:bg-ghost-dark-surface rounded-[24px] border border-[#e5e7eb] dark:border-ghost-dark-hairline p-4 sm:p-6 space-y-4 transition-colors">
      {/* 상단: 정밀도(소수점 자릿수) 선택 바 */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#e5e7eb] dark:border-ghost-dark-hairline flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-[#64748b] dark:text-ghost-dark-ink-mute font-medium">
          <span>실시간 양방향 변환</span>
          {ratioInfoText && (
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-slate-400 dark:text-ghost-dark-ink-stone hover:text-slate-600 dark:hover:text-ghost-dark-ink-soft cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{ratioInfoText}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[#64748b] dark:text-ghost-dark-ink-mute font-medium">소수점</span>
          <SegmentedControl
            options={precisionOptions.map((p) => ({ id: p.toString(), label: `${p}자리` }))}
            value={precision.toString()}
            onChange={(val) => onPrecisionChange(Number(val) as DecimalPrecision)}
            variant="slate-solid"
            className="p-0.5 rounded-md"
            itemClassName="h-auto py-0.5 px-2 text-[11px]"
          />
        </div>
      </div>

      {/* 듀얼 인터랙티브 변환 영역 (모바일: 1열 세로, 데스크톱: 3열 좌/중/우 동일 높이 대칭) */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-stretch">
        {/* 1. 출발(From) 단위 입력 박스 */}
        <div className="flex flex-col justify-between h-full bg-slate-50/70 dark:bg-ghost-dark-surface-deep border border-[#e5e7eb] dark:border-ghost-dark-hairline-soft rounded-2xl p-3.5 sm:p-4 focus-within:border-[#15171a] dark:focus-within:border-[#d1ff19] focus-within:bg-white dark:focus-within:bg-ghost-dark-surface transition-all">
          <div className="flex items-center justify-between gap-2 mb-2 min-h-[32px]">
            <label htmlFor="unit-convert-input" className="text-[11px] sm:text-xs font-bold text-[#64748b] dark:text-ghost-dark-ink-mute uppercase tracking-wider whitespace-nowrap cursor-pointer">
              입력 (From)
            </label>
            <div className="w-28 sm:w-36 lg:w-44 shrink-0">
              <Select value={fromUnitId} onValueChange={onFromUnitChange}>
                <SelectTrigger className="h-8 text-xs bg-white dark:bg-ghost-dark-surface-elevated border-[#e5e7eb] dark:border-ghost-dark-hairline-soft font-bold px-2 sm:px-3 truncate">
                  <SelectValue placeholder="단위 선택" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name} ({u.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-baseline gap-2 py-1">
            <Input
              id="unit-convert-input"
              aria-label={`${fromUnit?.name || '출발 단위'} 수치 입력`}
              type="number"
              value={inputValue}
              onChange={(e) => {
                const val = e.target.value;
                onInputChange(val === '' ? '' : parseFloat(val));
              }}
              onBlur={() => {
                if (inputValue === '' || isNaN(inputValue as number)) {
                  onInputChange(0);
                }
              }}
              placeholder="0"
              className="h-auto w-full border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 font-extrabold text-2xl sm:text-3xl text-[#112220] dark:text-ghost-dark-ink tracking-tight placeholder-slate-300 dark:placeholder-ghost-dark-ink-stone tabular-nums"
            />
            <span className="text-sm sm:text-base font-bold text-slate-500 dark:text-ghost-dark-ink-mute shrink-0">
              {fromUnit?.symbol}
            </span>
          </div>

          <div className="min-h-[18px] mt-2">
            <p className="text-[11px] text-slate-400 dark:text-ghost-dark-ink-stone truncate">
              {fromUnit?.description || `${fromUnit?.name} (${fromUnit?.symbol})`}
            </p>
          </div>
        </div>

        {/* 2. 중앙 스왑(Swap) 버튼 */}
        <div className="flex justify-center self-center my-1 md:my-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onSwapUnits}
                className="w-10 h-10 rounded-full border border-[#e5e7eb] dark:border-ghost-dark-hairline-soft bg-white dark:bg-ghost-dark-surface-elevated hover:bg-slate-100 dark:hover:bg-ghost-dark-hover shadow-xs hover:border-[#15171a] dark:hover:border-[#d1ff19] transition-all shrink-0"
                aria-label="단위 맞바꾸기"
              >
                <ArrowLeftRight className="w-4 h-4 text-[#112220] dark:text-ghost-dark-ink" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">단위 맞바꾸기 (Swap)</TooltipContent>
          </Tooltip>
        </div>

        {/* 3. 도착(To) 단위 결과 박스 */}
        <div className="flex flex-col justify-between h-full bg-[#15171a] dark:bg-ghost-dark-surface-elevated text-white rounded-2xl p-3.5 sm:p-4 border border-[#15171a] dark:border-ghost-dark-hairline-soft shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-2 min-h-[32px]">
            <span className="text-[11px] sm:text-xs font-bold text-[#d1ff19] uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d1ff19] shrink-0" />
              결과 (To)
            </span>
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyResult}
                    className="h-7 w-7 text-slate-300 hover:text-white hover:bg-slate-800 dark:hover:bg-ghost-dark-surface rounded-md shrink-0"
                    aria-label="결과값 복사"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {copied ? '복사 완료!' : '결과값 복사'}
                </TooltipContent>
              </Tooltip>
              <div className="w-28 sm:w-36 lg:w-44 shrink-0">
                <Select value={toUnitId} onValueChange={onToUnitChange}>
                  <SelectTrigger className="h-8 text-xs bg-[#24272c] dark:bg-ghost-dark-surface text-white border-slate-700 dark:border-ghost-dark-hairline-soft font-bold hover:bg-[#2e3238] dark:hover:bg-ghost-dark-hover focus:ring-[#d1ff19] px-2 sm:px-3 truncate">
                    <SelectValue placeholder="단위 선택" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#15171a] dark:bg-ghost-dark-surface-elevated border-slate-800 dark:border-ghost-dark-hairline-soft text-white">
                    {units.map((u) => (
                      <SelectItem
                        key={u.id}
                        value={u.id}
                        className="text-white hover:bg-slate-800 dark:hover:bg-ghost-dark-surface focus:bg-slate-800 dark:focus:bg-ghost-dark-surface focus:text-[#d1ff19]"
                      >
                        {u.name} ({u.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-2 overflow-x-auto py-1">
            <span className="font-extrabold text-2xl sm:text-3xl text-white tracking-tight break-all">
              {formattedConvertedValue}
            </span>
            <span className="text-sm sm:text-base font-bold text-[#d1ff19] shrink-0">
              {toUnit?.symbol}
            </span>
          </div>

          <div className="min-h-[18px] mt-2">
            <p className="text-[11px] text-slate-400 truncate">
              {toUnit?.description || `${toUnit?.name} (${toUnit?.symbol})`}
            </p>
          </div>
        </div>
      </div>

      {/* 환산 공식 / 배율 가이드 배너 */}
      {ratioInfoText && (
        <div className="px-3.5 py-2 bg-slate-50 dark:bg-ghost-dark-surface-deep border border-[#e5e7eb] dark:border-ghost-dark-hairline rounded-xl flex items-center justify-between text-xs text-[#475569] dark:text-ghost-dark-ink-mute transition-colors">
          <span className="font-medium">기준 공식</span>
          <span className="font-bold text-[#112220] dark:text-ghost-dark-ink-base">{ratioInfoText}</span>
        </div>
      )}
    </div>
  );
};
