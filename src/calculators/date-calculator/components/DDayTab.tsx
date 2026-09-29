import React, { useState, useMemo } from 'react';
import {
  calculateDDay,
  calculateDateMath,
  getTodayString,
} from '../../../utils/dateCalculator';
import { DateCalcOp, DateCalcUnit } from '../../../types/date';
import { FormHeader } from '../../../components/common/FormHeader';
import { SelectableChip } from '../../../components/ui/selectable-chip';
import { SegmentedControl } from '../../../components/ui/segmented-control';
import { NumericInput } from '../../../components/ui/numeric-input';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { DatePicker } from '../../../components/ui/date-picker';
import { SubMetricCard } from '../../../components/common/SubMetricCard';
import {
  Calendar,
  CalendarHeart,
  Copy,
  Check,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const UNIT_OPTIONS = [
  { id: 'days' as DateCalcUnit, label: '일' },
  { id: 'weeks' as DateCalcUnit, label: '주' },
  { id: 'months' as DateCalcUnit, label: '개월' },
  { id: 'years' as DateCalcUnit, label: '년' },
];

const OP_OPTIONS = [
  { id: 'add' as DateCalcOp, label: 'N일 뒤 (+)' },
  { id: 'subtract' as DateCalcOp, label: 'N일 전 (-)' },
];

const unitLabels: Record<DateCalcUnit, string> = {
  days: '일',
  weeks: '주',
  months: '개월',
  years: '년',
};

export const DDayTab: React.FC = () => {
  const today = getTodayString();
  const [targetDate, setTargetDate] = useState<string>(today);
  const [amount, setAmount] = useState<number | ''>(100);
  const [unit, setUnit] = useState<DateCalcUnit>('days');
  const [operation, setOperation] = useState<DateCalcOp>('add');
  const [copied, setCopied] = useState(false);

  const numericAmount = typeof amount === 'number' ? amount : 0;

  // 1. 기준일 기준 실시간 D-day 및 기념일 목록
  const ddayResult = useMemo(() => calculateDDay(targetDate), [targetDate]);

  // 2. 기준일 기준 날짜 연산 (+N일/개월/년)
  const calcResult = useMemo(
    () => calculateDateMath(targetDate, numericAmount, unit, operation),
    [targetDate, numericAmount, unit, operation]
  );

  const handleCopy = async () => {
    const ddayText = ddayResult.isToday
      ? '오늘'
      : ddayResult.isPast
      ? `D+${Math.abs(ddayResult.diffDays)}일째`
      : `D-${ddayResult.diffDays}`;

    const text = `[스마트 계산기] 디데이 및 날짜 연산 결과
- 기준일: ${targetDate} (${ddayText})
- 계산 결과: ${calcResult.resultDate} (${calcResult.dayOfWeek})
- 연산 수식: 기준일로부터 ${operation === 'add' ? '+' : '-'}${numericAmount}${unitLabels[unit]} ${operation === 'add' ? '뒤' : '전'}`;

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

  const handleReset = () => {
    setTargetDate(today);
    setAmount(100);
    setUnit('days');
    setOperation('add');
  };

  const setPresetDays = (days: number) => {
    setOperation('add');
    setUnit('days');
    setAmount(days);
  };

  const setPresetMonths = (months: number) => {
    setOperation('add');
    setUnit('months');
    setAmount(months);
  };

  const setPresetYears = (years: number) => {
    setOperation('add');
    setUnit('years');
    setAmount(years);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start w-full">
      {/* 1. 좌측 입력 폼 영역 (5컬럼) */}
      <div className="lg:col-span-5 space-y-4 w-full min-w-0">
        <div className="@container bg-white dark:bg-ghost-dark-surface p-5 sm:p-6 rounded-ghost-xl border border-ghost-hairline dark:border-ghost-dark-hairline shadow-sm transition-colors space-y-5 sm:space-y-6 w-full">
          <FormHeader
            badge="디데이·연산"
            title="목표일 또는 기념일 선택"
            description="사귄 날, 입대일, 시험일 등 기준 날짜를 지정하면 실시간 디데이와 원하는 기간(N일/개월/년 뒤) 도달 날짜를 원스톱 계산합니다"
            onReset={handleReset}
          />

          <div className="space-y-4 sm:space-y-5">
            {/* 기준 날짜 선택 */}
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-1 mb-1.5">
                <label className="text-xs sm:text-sm font-bold text-ghost-ink dark:text-ghost-dark-ink-base flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-ghost-ink dark:text-ghost-lime" />
                  <span>기준 날짜 (시작일 / 목표일)</span>
                </label>
                <span className="text-xs font-bold text-ghost-ink dark:text-ghost-lime tabular-nums">
                  {targetDate} ({ddayResult.label})
                </span>
              </div>

              <DatePicker
                value={targetDate}
                onChange={setTargetDate}
                placeholder="기준 날짜를 선택하세요"
              />
            </div>

            {/* 연산 조건 설정 (방향, 단위, 수량) */}
            <div className="pt-2 border-t border-slate-100 dark:border-ghost-dark-hairline space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ghost-ink-mute dark:text-ghost-dark-ink-mute uppercase tracking-wider">
                  기간 더하기 / 빼기 설정
                </span>
                <span className="text-[11px] text-slate-400 dark:text-ghost-dark-ink-stone">
                  원하는 N일·개월 자유 입력
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 연산 방향 (+/-) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-ghost-dark-ink-soft mb-1.5">
                    계산 방향
                  </label>
                  <SegmentedControl
                    value={operation}
                    onChange={(val) => setOperation(val as DateCalcOp)}
                    options={OP_OPTIONS}
                  />
                </div>

                {/* 연산 단위 (일/주/개월/년) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-ghost-dark-ink-soft mb-1.5">
                    기간 단위
                  </label>
                  <SegmentedControl
                    value={unit}
                    onChange={(val) => setUnit(val as DateCalcUnit)}
                    options={UNIT_OPTIONS}
                  />
                </div>
              </div>

              {/* 수량 입력 */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-ghost-dark-ink-soft mb-1.5">
                  기간 수량 입력
                </label>
                <NumericInput
                  value={amount}
                  onNumberChange={(val) => setAmount(val)}
                  min={0}
                  max={99999}
                  suffix={unitLabels[unit]}
                  placeholder="기간 수량 입력 (예: 100)"
                />
              </div>
            </div>

            {/* 생활 밀착형 빠른 프리셋 칩 */}
            <div className="pt-1 space-y-1.5">
              <span className="text-xs font-bold text-ghost-ink-mute dark:text-ghost-dark-ink-mute uppercase tracking-wider block">
                자주 찾는 기념일 & 생활 프리셋
              </span>
              <div className="flex flex-wrap gap-1.5">
                <SelectableChip
                  isSelected={operation === 'add' && unit === 'days' && amount === 100}
                  onClick={() => setPresetDays(100)}
                >
                  +100일 (백일)
                </SelectableChip>
                <SelectableChip
                  isSelected={operation === 'add' && unit === 'days' && amount === 200}
                  onClick={() => setPresetDays(200)}
                >
                  +200일
                </SelectableChip>
                <SelectableChip
                  isSelected={operation === 'add' && unit === 'years' && amount === 1}
                  onClick={() => setPresetYears(1)}
                >
                  +1주년 (1년 뒤)
                </SelectableChip>
                <SelectableChip
                  isSelected={operation === 'add' && unit === 'months' && amount === 18}
                  onClick={() => setPresetMonths(18)}
                >
                  +18개월 (육군 전역)
                </SelectableChip>
                <SelectableChip
                  isSelected={operation === 'add' && unit === 'months' && amount === 21}
                  onClick={() => setPresetMonths(21)}
                >
                  +21개월 (공군 전역)
                </SelectableChip>
                <SelectableChip
                  isSelected={operation === 'add' && unit === 'days' && amount === 30}
                  onClick={() => setPresetDays(30)}
                >
                  +30일 (1개월)
                </SelectableChip>
                <SelectableChip
                  isSelected={targetDate === today && amount === 0}
                  onClick={() => {
                    setTargetDate(today);
                    setAmount(0);
                  }}
                >
                  오늘 (D-DAY)
                </SelectableChip>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 우측 결과 대시보드 및 마일스톤 테이블 영역 (7컬럼) */}
      <div className="lg:col-span-7 space-y-4 sm:space-y-5 w-full min-w-0">
        <div className="space-y-3.5 sm:space-y-4 w-full">
          <div className="relative overflow-hidden rounded-2xl bg-ghost-surface-elevated dark:bg-ghost-dark-surface-elevated border border-ghost-surface-elevated dark:border-ghost-dark-hairline-soft p-5 sm:p-6 text-white shadow-sm">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-ghost-lime/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-ghost-lime/20 text-ghost-lime border border-ghost-lime/30">
                  <CalendarHeart className="w-3.5 h-3.5" />
                  계산 도달 날짜
                </span>
                <span className="text-xs text-ghost-lime font-bold px-2 py-0.5 rounded-full bg-ghost-lime/10 border border-ghost-lime/20 shrink-0">
                  기준일: {ddayResult.label}
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
                    <Check className="w-3 h-3 text-ghost-lime" />
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
                <span className="text-3xl sm:text-4xl font-extrabold text-ghost-lime tracking-tight tabular-nums break-keep">
                  {calcResult.resultDate}
                </span>
                <span className="text-xs sm:text-sm text-slate-300 font-semibold break-keep">
                  ({calcResult.dayOfWeek})
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                기준일({targetDate})로부터 {operation === 'add' ? '+' : '-'}{numericAmount}
                {unitLabels[unit]} {operation === 'add' ? '뒤' : '전'} 시점
              </p>
            </div>
          </div>
        </div>

        {/* 3단 서브 요약 지표 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          <SubMetricCard
            label="오늘 기준 디데이"
            icon={Clock}
            iconColor="indigo"
            badge={ddayResult.isToday ? 'D-DAY' : ddayResult.isPast ? '경과' : '디데이'}
            badgeColor={ddayResult.isToday ? 'emerald' : ddayResult.isPast ? 'slate' : 'indigo'}
            value={
              ddayResult.isToday
                ? 'D-DAY 오늘'
                : ddayResult.isPast
                ? `D+${Math.abs(ddayResult.diffDays)}일째`
                : `D-${ddayResult.diffDays}`
            }
            description={ddayResult.isPast ? '기준일 이후 경과일' : '도달까지 남은 기간'}
          />

          <SubMetricCard
            label="적용된 연산 수식"
            icon={ArrowRight}
            iconColor="slate"
            value={`${operation === 'add' ? `+${numericAmount}` : `-${numericAmount}`}${unitLabels[unit]} ${operation === 'add' ? '뒤' : '전'}`}
            description="기준일 대비 적용 범위"
          />

          <SubMetricCard
            label="도달 요일"
            icon={Calendar}
            iconColor="emerald"
            value={calcResult.dayOfWeek}
            description="해당 날짜의 요일"
          />
        </div>
      </div>

      {/* 3. 주요 기념일 캘린더 테이블 */}
      <div className="@container bg-white dark:bg-ghost-dark-surface p-5 sm:p-6 rounded-ghost-xl border border-ghost-hairline dark:border-ghost-dark-hairline shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="meta" size="sm" className="shrink-0 font-bold">
              기념일 캘린더
            </Badge>
            <h3 className="text-sm sm:text-base font-bold text-ghost-ink dark:text-ghost-dark-ink">
              주요 기념일 및 마일스톤 날짜
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-ghost-dark-ink-stone hidden sm:inline">
            기준일 첫날 1일 기산 기준
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-ghost-hairline dark:border-ghost-dark-hairline">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-ghost-dark-surface-elevated text-slate-500 dark:text-ghost-dark-ink-mute font-semibold border-b border-ghost-hairline dark:border-ghost-dark-hairline">
              <tr>
                <th className="py-2.5 px-3 sm:px-4">기념일</th>
                <th className="py-2.5 px-3 sm:px-4">해당 날짜</th>
                <th className="py-2.5 px-3 sm:px-4">요일</th>
                <th className="py-2.5 px-3 sm:px-4 text-right">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ghost-hairline dark:divide-ghost-dark-hairline font-medium">
              {ddayResult.milestones.map((item) => (
                <tr
                  key={item.label}
                  className="hover:bg-slate-50/70 dark:hover:bg-ghost-dark-hover transition-colors"
                >
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-ghost-ink dark:text-ghost-dark-ink flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-slate-400 dark:text-ghost-dark-ink-stone" />
                    <span>{item.label}</span>
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 tabular-nums text-slate-700 dark:text-ghost-dark-ink-base">
                    {item.date}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-slate-500 dark:text-ghost-dark-ink-soft">
                    {item.dayOfWeek}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right">
                    {item.isPast ? (
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-ghost-dark-surface-elevated text-slate-500 dark:text-ghost-dark-ink-mute">
                        지남
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-ghost-lime/20 text-ghost-ink dark:text-ghost-lime border border-ghost-lime/30">
                        예정
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);
};
