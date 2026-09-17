import React, { useState } from 'react';
import {
  CurrencyCode,
  ExchangeRateSnapshot,
  ExchangeType,
  SpreadDiscount,
} from '../../../types/exchange';
import {
  CURRENCIES_DATA,
  formatCurrencyAmount,
  getExchangeRateText,
} from '../../../utils/exchangeCalculator';
import { CurrencySelect } from './CurrencySelect';
import { ArrowLeftRight, Check, Copy, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { SelectableChip } from '../../../components/ui/selectable-chip';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../components/ui/tooltip';

interface DualExchangeCardProps {
  fromCode: CurrencyCode;
  toCode: CurrencyCode;
  amount: number | '';
  convertedAmount: number;
  appliedRate: number;
  exchangeType: ExchangeType;
  discount: SpreadDiscount;
  discountSavedKRW: number;
  onFromChange: (c: CurrencyCode) => void;
  onToChange: (c: CurrencyCode) => void;
  onAmountChange: (val: number | '') => void;
  onSwap: () => void;
  onTypeChange: (t: ExchangeType) => void;
  onDiscountChange: (d: SpreadDiscount) => void;
  snapshot: ExchangeRateSnapshot;
}

const EXCHANGE_TYPE_OPTIONS: { id: ExchangeType; label: string }[] = [
  { id: 'base', label: '매매기준율' },
  { id: 'cash_buy', label: '현찰 살 때' },
  { id: 'cash_sell', label: '현찰 팔 때' },
];

export const DualExchangeCard: React.FC<DualExchangeCardProps> = ({
  fromCode,
  toCode,
  amount,
  convertedAmount,
  appliedRate,
  exchangeType,
  discount,
  discountSavedKRW,
  onFromChange,
  onToChange,
  onAmountChange,
  onSwap,
  onTypeChange,
  onDiscountChange,
  snapshot,
}) => {
  const [copied, setCopied] = useState(false);

  const fromCurr = CURRENCIES_DATA[fromCode];
  const toCurr = CURRENCIES_DATA[toCode];

  const handleCopyResult = () => {
    if (convertedAmount > 0) {
      navigator.clipboard.writeText(convertedAmount.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const discountOptions: SpreadDiscount[] = [90, 80, 50, 0];

  return (
    <div className="bg-white dark:bg-ghost-dark-surface rounded-[24px] border border-[#e5e7eb] dark:border-ghost-dark-hairline p-4 sm:p-6 space-y-4 shadow-2xs transition-colors min-w-0">
      {/* 1. 상단 환전 방식 탭 및 기준일자 배지 */}
      <div className="space-y-2.5 pb-3 border-b border-[#e5e7eb] dark:border-ghost-dark-hairline">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {/* 환전 방식 탭 (모바일: 3등분 꽉 채움) */}
          <Tabs
            value={exchangeType}
            onValueChange={(val) => onTypeChange(val as ExchangeType)}
            className="w-full sm:w-auto min-w-0"
          >
            <TabsList
              variant="slate-solid"
              size="sm"
              className="grid grid-cols-3 w-full sm:w-auto p-1 h-auto min-w-0"
            >
              {EXCHANGE_TYPE_OPTIONS.map((opt) => (
                <TabsTrigger
                  key={opt.id}
                  value={opt.id}
                  variant="slate-solid"
                  className="py-1.5 px-1 sm:px-2 text-xs font-semibold cursor-pointer truncate justify-center text-center"
                >
                  {opt.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* 기준일 및 환율 안내 (모바일: 1행 가로 양끝 정렬 또는 유동 줄바꿈) */}
          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-[#64748b] dark:text-ghost-dark-ink-soft font-medium pt-[0.5px] min-w-0 flex-wrap">
            <div className="flex items-center gap-1 text-[11px] bg-slate-50 dark:bg-ghost-dark-surface-deep px-2 py-1 rounded-md border border-[#e5e7eb] dark:border-ghost-dark-hairline-soft shrink-0">
              <Calendar className="w-3.5 h-3.5 text-[#64748b] dark:text-ghost-dark-ink-mute" />
              <span className="whitespace-nowrap">고시: {snapshot.baseDate}</span>
              {snapshot.isLive && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5 shrink-0" title="최신 실시간 환율 연동" />
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] sm:text-xs truncate">
              <TrendingUp className="w-3.5 h-3.5 text-[#15171a] dark:text-[#d1ff19] shrink-0" />
              <span className="truncate">{getExchangeRateText(fromCode, toCode, appliedRate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 은행 환전 우대율 (스프레드 할인율) - 현찰 살 때/팔 때 활성화 */}
      {exchangeType !== 'base' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-ghost-dark-surface-deep border border-[#e5e7eb] dark:border-ghost-dark-hairline">
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <span className="text-xs font-bold text-[#112220] dark:text-ghost-dark-ink-base whitespace-nowrap">은행 우대율</span>
            {discountSavedKRW > 0 && (
              <Badge variant="eyebrow" className="text-[10px] px-1.5 py-0 h-5 whitespace-nowrap">
                약 {formatCurrencyAmount(discountSavedKRW, 'KRW')}원 절약
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-4 sm:flex items-center gap-1 w-full sm:w-auto">
            {discountOptions.map((disc) => (
              <SelectableChip
                key={disc}
                isSelected={discount === disc}
                onClick={() => onDiscountChange(disc)}
                className="py-1 sm:px-2.5 h-auto text-center justify-center font-bold"
              >
                {disc}%
              </SelectableChip>
            ))}
          </div>
        </div>
      )}

      {/* 3. 메인 인터랙티브 듀얼 변환 영역 (모바일: 1열 세로, 데스크톱: 3열 좌/중/우) */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-center">
        {/* 1. 출발(From) 단위 입력 박스 */}
        <div className="bg-slate-50/70 dark:bg-ghost-dark-surface-deep border border-[#e5e7eb] dark:border-ghost-dark-hairline-soft rounded-2xl p-3.5 sm:p-4 focus-within:border-[#15171a] dark:focus-within:border-[#d1ff19] focus-within:bg-white dark:focus-within:bg-ghost-dark-surface transition-all">
          <div className="flex items-center justify-between gap-2 mb-2">
            <label htmlFor="from-amount" className="text-[11px] sm:text-xs font-bold text-[#64748b] dark:text-ghost-dark-ink-mute uppercase tracking-wider whitespace-nowrap cursor-pointer">
              입력 (From)
            </label>
            <div className="w-28 sm:w-36 lg:w-44 shrink-0">
              <CurrencySelect
                id="from-currency"
                value={fromCode}
                onChange={onFromChange}
                variant="light"
              />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <Input
              id="from-amount"
              aria-label={`${fromCurr.name} 환전 금액 입력`}
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => {
                const val = e.target.value;
                onAmountChange(val === '' ? '' : parseFloat(val));
              }}
              onBlur={() => {
                if (amount === '' || isNaN(amount as number) || (typeof amount === 'number' && amount < 0)) {
                  onAmountChange(0);
                }
              }}
              placeholder="0"
              className="h-auto w-full border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 font-extrabold text-2xl sm:text-3xl text-[#112220] dark:text-ghost-dark-ink tracking-tight placeholder-slate-300 dark:placeholder-ghost-dark-ink-stone tabular-nums"
            />
            <span className="text-sm sm:text-base font-bold text-slate-500 dark:text-ghost-dark-ink-mute shrink-0">
              {fromCurr.symbol}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-ghost-dark-ink-stone mt-2 truncate">
            {fromCurr.name} ({fromCode})
          </p>
        </div>

        {/* 2. 중앙 스왑(Swap) 버튼 */}
        <div className="flex justify-center my-1 md:my-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onSwap}
                className="w-10 h-10 rounded-full border border-[#e5e7eb] dark:border-ghost-dark-hairline-soft bg-white dark:bg-ghost-dark-surface-elevated hover:bg-slate-100 dark:hover:bg-ghost-dark-hover shadow-xs hover:border-[#15171a] dark:hover:border-[#d1ff19] transition-all text-[#112220] dark:text-white shrink-0"
                aria-label="통화 맞바꾸기"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">통화 맞바꾸기 (Swap)</TooltipContent>
          </Tooltip>
        </div>

        {/* 3. 도착(To) 단위 결과 박스 */}
        <div className="bg-[#15171a] dark:bg-ghost-dark-surface-elevated text-white rounded-2xl p-3.5 sm:p-4 border border-[#15171a] dark:border-ghost-dark-hairline-soft shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-2">
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
                <CurrencySelect
                  id="to-currency"
                  value={toCode}
                  onChange={onToChange}
                  variant="dark"
                />
              </div>
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-2 overflow-x-auto">
            <span className="font-extrabold text-2xl sm:text-3xl text-white tracking-tight tabular-nums break-all">
              {formatCurrencyAmount(convertedAmount, toCode)}
            </span>
            <span className="text-sm sm:text-base font-bold text-[#d1ff19] shrink-0">
              {toCurr.symbol}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 mt-2 truncate">
            {toCurr.name} ({toCode})
          </p>
        </div>
      </div>
    </div>
  );
};
