import React, { useState, useMemo } from 'react';
import { calculateDateMath, getTodayString } from '../../../utils/dateCalculator';
import { DateCalcOp, DateCalcUnit } from '../../../types/date';
import { FormHeader } from '../../../components/common/FormHeader';
import { SegmentedControl } from '../../../components/ui/segmented-control';
import { SelectableChip } from '../../../components/ui/selectable-chip';
import { NumericInput } from '../../../components/ui/numeric-input';
import { Button } from '../../../components/ui/button';
import { Calendar, Copy, Check, Clock, CalendarDays, ArrowRight } from 'lucide-react';

export const DateCalcTab: React.FC = () => {
  const today = getTodayString();
  const [baseDate, setBaseDate] = useState<string>(today);
  const [amount, setAmount] = useState<number>(100);
  const [unit, setUnit] = useState<DateCalcUnit>('days');
  const [operation, setOperation] = useState<DateCalcOp>('add');
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () => calculateDateMath(baseDate, amount, unit, operation),
    [baseDate, amount, unit, operation]
  );

  const unitLabels: Record<DateCalcUnit, string> = {
    days: '일',
    weeks: '주',
    months: '개월',
    years: '년',
  };

  const handleCopy = async () => {
    const text = `[스마트 계산기] 날짜 계산 결과
- 기준일: ${result.baseDate}
- 계산 수식: ${amount}${unitLabels[unit]} ${operation === 'add' ? '뒤' : '전'}
- 최종 날짜: ${result.resultDate} (${result.dayOfWeek})`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const setPreset = (amt: number, u: DateCalcUnit, op: DateCalcOp) => {
    setAmount(amt);
    setUnit(u);
    setOperation(op);
  };

  const handleReset = () => {
    setBaseDate(today);
    setAmount(100);
    setUnit('days');
    setOperation('add');
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      {/* 1. 입력 폼 영역 (표준 FormHeader + SegmentedControl + NumericInput + SelectableChip) */}
      <div className="@container bg-white dark:bg-ghost-dark-surface p-5 sm:p-6 rounded-[24px] border border-[#e5e7eb] dark:border-ghost-dark-hairline shadow-sm transition-colors space-y-5 sm:space-y-6 w-full">
        <FormHeader
          badge="날짜 연산"
          title="날짜 더하기 및 빼기"
          description="특정 기준일로부터 N일, N주, N개월, N년 후 또는 전의 정확한 날짜를 산출합니다"
          onReset={handleReset}
        />

        <div className="space-y-4">
          {/* 기준일 선택 */}
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-1 mb-1.5">
              <label className="text-xs sm:text-sm font-bold text-[#112220] dark:text-ghost-dark-ink-base flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#112220] dark:text-[#d1ff19]" />
                <span>기준일</span>
              </label>
              <span className="text-xs font-bold text-[#112220] dark:text-[#d1ff19] tabular-nums">
                {baseDate}
              </span>
            </div>
            <input
              type="date"
              value={baseDate}
              onChange={(e) => setBaseDate(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#e5e7eb] dark:border-ghost-dark-hairline bg-slate-50/50 dark:bg-slate-900/60 text-sm font-bold text-[#112220] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#15171a] dark:focus:ring-[#d1ff19] transition-all"
            />
          </div>

          {/* 계산 방향 및 단위 선택 (SegmentedControl) + 수량 (NumericInput) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* 계산 방향 */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-ghost-dark-ink-mute mb-1.5">
                계산 방향
              </label>
              <SegmentedControl<DateCalcOp>
                options={[
                  { id: 'add', label: 'N일 뒤 (+)' },
                  { id: 'subtract', label: 'N일 전 (-)' },
                ]}
                value={operation}
                onChange={setOperation}
                variant="slate-solid"
              />
            </div>

            {/* 수량 입력 */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-ghost-dark-ink-mute mb-1.5">
                기간 값
              </label>
              <NumericInput
                value={amount}
                onNumberChange={(val) => setAmount(Math.max(1, Math.min(10000, val || 1)))}
                suffix={unitLabels[unit]}
                thousandSeparator={true}
                placeholder="100"
              />
            </div>

            {/* 단위 선택 */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-ghost-dark-ink-mute mb-1.5">
                단위 선택
              </label>
              <SegmentedControl<DateCalcUnit>
                options={[
                  { id: 'days', label: '일' },
                  { id: 'weeks', label: '주' },
                  { id: 'months', label: '개월' },
                  { id: 'years', label: '년' },
                ]}
                value={unit}
                onChange={setUnit}
                variant="slate-solid"
              />
            </div>
          </div>

          {/* 빠른 프리셋 칩 (SelectableChip) */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <SelectableChip
              isSelected={amount === 7 && unit === 'days' && operation === 'add'}
              onClick={() => setPreset(7, 'days', 'add')}
            >
              +7일 (1주 뒤)
            </SelectableChip>
            <SelectableChip
              isSelected={amount === 30 && unit === 'days' && operation === 'add'}
              onClick={() => setPreset(30, 'days', 'add')}
            >
              +30일 뒤
            </SelectableChip>
            <SelectableChip
              isSelected={amount === 100 && unit === 'days' && operation === 'add'}
              onClick={() => setPreset(100, 'days', 'add')}
            >
              +100일 뒤
            </SelectableChip>
            <SelectableChip
              isSelected={amount === 1 && unit === 'years' && operation === 'add'}
              onClick={() => setPreset(1, 'years', 'add')}
            >
              +1년 뒤
            </SelectableChip>
            <SelectableChip
              isSelected={amount === 30 && unit === 'days' && operation === 'subtract'}
              onClick={() => setPreset(30, 'days', 'subtract')}
            >
              -30일 전
            </SelectableChip>
            <SelectableChip
              isSelected={amount === 100 && unit === 'days' && operation === 'subtract'}
              onClick={() => setPreset(100, 'days', 'subtract')}
            >
              -100일 전
            </SelectableChip>
          </div>
        </div>
      </div>

      {/* 2. 메인 결과 대시보드 (PRD 11.12 단일 디자인 규격 준수) */}
      <div className="space-y-3.5 sm:space-y-4 w-full">
        {/* 메인 다크 서피스 카드 */}
        <div className="relative overflow-hidden rounded-2xl bg-[#15171a] dark:bg-ghost-dark-surface-elevated border border-[#15171a] dark:border-ghost-dark-hairline-soft p-5 sm:p-6 text-white shadow-sm">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#d1ff19]/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#d1ff19]/20 text-[#d1ff19] border border-[#d1ff19]/30">
                  <CalendarDays className="w-3.5 h-3.5" />
                  날짜 계산 결과
                </span>
                <span className="text-xs text-[#d1ff19] font-bold px-2 py-0.5 rounded-full bg-[#d1ff19]/10 border border-[#d1ff19]/20 shrink-0">
                  {result.dayOfWeek}
                </span>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="h-7 px-2.5 text-xs bg-slate-800/80 dark:bg-ghost-dark-hairline hover:bg-slate-700 dark:hover:bg-ghost-dark-hairline-soft border-slate-700 dark:border-ghost-dark-hairline-soft text-white rounded-lg shrink-0 flex items-center gap-1"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-[#d1ff19]" />
                    <span>복사 완료</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-300" />
                    <span>결과 복사</span>
                  </>
                )}
              </Button>
            </div>

            <div>
              <div className="flex items-baseline gap-2.5 flex-wrap pt-0.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#d1ff19] tracking-tight tabular-nums break-keep">
                  {result.resultDate}
                </span>
                <span className="text-xs sm:text-sm text-slate-300 font-semibold break-keep">
                  ({result.dayOfWeek})
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                기준일({result.baseDate})로부터 {amount}
                {unitLabels[unit]} {operation === 'add' ? '뒤' : '전'} 날짜
              </p>
            </div>
          </div>
        </div>

        {/* 3단 서브 요약 지표 카드 (PRD 11.12 단일 규격) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-ghost-dark-surface border border-[#e5e7eb] dark:border-ghost-dark-hairline shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[#64748b] dark:text-ghost-dark-ink-mute text-[11px] font-bold uppercase tracking-wider">
              <span>기준일</span>
              <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-ghost-dark-ink-stone" />
            </div>
            <div className="text-base sm:text-lg font-bold text-[#112220] dark:text-ghost-dark-ink tabular-nums">
              {result.baseDate}
            </div>
            <p className="text-[11px] text-[#64748b] dark:text-ghost-dark-ink-mute truncate">
              연산 시작 날짜
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-ghost-dark-surface border border-[#e5e7eb] dark:border-ghost-dark-hairline shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[#64748b] dark:text-ghost-dark-ink-mute text-[11px] font-bold uppercase tracking-wider">
              <span>계산 수식</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-ghost-dark-ink-stone" />
            </div>
            <div className="text-base sm:text-lg font-bold text-[#112220] dark:text-ghost-dark-ink">
              {operation === 'add' ? `+${amount}` : `-${amount}`}{unitLabels[unit]} {operation === 'add' ? '뒤' : '전'}
            </div>
            <p className="text-[11px] text-[#64748b] dark:text-ghost-dark-ink-mute truncate">
              적용된 증감 범위
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-ghost-dark-surface border border-[#e5e7eb] dark:border-ghost-dark-hairline shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[#64748b] dark:text-ghost-dark-ink-mute text-[11px] font-bold uppercase tracking-wider">
              <span>해당 요일</span>
              <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-ghost-dark-ink-stone" />
            </div>
            <div className="text-base sm:text-lg font-bold text-[#112220] dark:text-ghost-dark-ink">
              {result.dayOfWeek}
            </div>
            <p className="text-[11px] text-[#64748b] dark:text-ghost-dark-ink-mute truncate">
              도달 일자의 요일
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
