import React, { useState, useMemo } from 'react';
import { calculateDateMath, getTodayString } from '../../../utils/dateCalculator';
import { DateCalcOp, DateCalcUnit } from '../../../types/date';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Calendar, Copy, Check, Plus, Minus, ArrowRight, Clock } from 'lucide-react';
import { useToast } from '../../../hooks/use-toast';

export const DateCalcTab: React.FC = () => {
  const today = getTodayString();
  const [baseDate, setBaseDate] = useState<string>(today);
  const [amount, setAmount] = useState<number>(100);
  const [unit, setUnit] = useState<DateCalcUnit>('days');
  const [operation, setOperation] = useState<DateCalcOp>('add');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

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
    const text = `[날짜 계산 결과]\n기준일: ${result.baseDate}\n계산: ${amount}${unitLabels[unit]} ${operation === 'add' ? '뒤' : '전'}\n결과 날짜: ${result.resultDate} (${result.dayOfWeek})`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      }
      setCopied(true);
      toast({
        title: '날짜 계산 결과가 복사되었습니다',
        description: '원하는 곳에 붙여넣어 공유해보세요.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: '복사 실패',
        description: '직접 텍스트를 선택하여 복사해주세요.',
        variant: 'destructive',
      });
    }
  };

  const setPreset = (amt: number, u: DateCalcUnit, op: DateCalcOp) => {
    setAmount(amt);
    setUnit(u);
    setOperation(op);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. 입력 폼 영역 */}
      <Card className="p-4 sm:p-5 bg-white dark:bg-ghost-dark-surface border-[#e5e7eb] dark:border-ghost-dark-hairline rounded-2xl shadow-2xs space-y-4">
        {/* 기준일 선택 */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-[#112220] dark:text-ghost-dark-ink mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#112220] dark:text-[#d1ff19]" />
            <span>기준일 선택</span>
          </label>
          <input
            type="date"
            value={baseDate}
            onChange={(e) => setBaseDate(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl border border-[#e5e7eb] dark:border-ghost-dark-hairline bg-slate-50 dark:bg-ghost-dark-surface-elevated text-sm font-semibold text-[#112220] dark:text-ghost-dark-ink focus:outline-none focus:ring-2 focus:ring-[#112220] dark:focus:ring-[#d1ff19]"
          />
        </div>

        {/* 연산(더하기/빼기) 및 수량, 단위 선택 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 더하기 / 빼기 토글 */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-ghost-dark-ink-mute mb-1.5">
              계산 방향
            </label>
            <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-ghost-dark-surface-elevated border border-slate-200/80 dark:border-ghost-dark-hairline">
              <button
                type="button"
                onClick={() => setOperation('add')}
                className={`flex items-center justify-center gap-1 h-9 rounded-lg text-xs font-bold transition-all ${
                  operation === 'add'
                    ? 'bg-white dark:bg-ghost-dark-surface text-[#112220] dark:text-[#d1ff19] shadow-xs'
                    : 'text-slate-500 dark:text-ghost-dark-ink-stone hover:text-slate-900'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>N일 뒤 (+)</span>
              </button>
              <button
                type="button"
                onClick={() => setOperation('subtract')}
                className={`flex items-center justify-center gap-1 h-9 rounded-lg text-xs font-bold transition-all ${
                  operation === 'subtract'
                    ? 'bg-white dark:bg-ghost-dark-surface text-[#112220] dark:text-[#d1ff19] shadow-xs'
                    : 'text-slate-500 dark:text-ghost-dark-ink-stone hover:text-slate-900'
                }`}
              >
                <Minus className="w-3.5 h-3.5" />
                <span>N일 전 (-)</span>
              </button>
            </div>
          </div>

          {/* 수량 입력 */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-ghost-dark-ink-mute mb-1.5">
              수량 (기간 값)
            </label>
            <input
              type="number"
              min={1}
              max={10000}
              value={amount || ''}
              onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-full h-11 px-3.5 rounded-xl border border-[#e5e7eb] dark:border-ghost-dark-hairline bg-slate-50 dark:bg-ghost-dark-surface-elevated text-sm font-semibold text-[#112220] dark:text-ghost-dark-ink focus:outline-none focus:ring-2 focus:ring-[#112220] dark:focus:ring-[#d1ff19] tabular-nums"
            />
          </div>

          {/* 단위 선택 */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-ghost-dark-ink-mute mb-1.5">
              단위 선택
            </label>
            <div className="grid grid-cols-4 p-1 rounded-xl bg-slate-100 dark:bg-ghost-dark-surface-elevated border border-slate-200/80 dark:border-ghost-dark-hairline">
              {(['days', 'weeks', 'months', 'years'] as DateCalcUnit[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  className={`h-9 rounded-lg text-xs font-bold transition-all ${
                    unit === u
                      ? 'bg-white dark:bg-ghost-dark-surface text-[#112220] dark:text-[#d1ff19] shadow-xs'
                      : 'text-slate-500 dark:text-ghost-dark-ink-stone hover:text-slate-900'
                  }`}
                >
                  {unitLabels[u]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 빠른 프리셋 버튼 칩 */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreset(7, 'days', 'add')}
            className="text-xs h-7 px-2.5 rounded-lg border-slate-200 dark:border-ghost-dark-hairline hover:bg-slate-100 dark:hover:bg-ghost-dark-hover"
          >
            +7일 (1주 뒤)
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreset(30, 'days', 'add')}
            className="text-xs h-7 px-2.5 rounded-lg border-slate-200 dark:border-ghost-dark-hairline hover:bg-slate-100 dark:hover:bg-ghost-dark-hover"
          >
            +30일 뒤
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreset(100, 'days', 'add')}
            className="text-xs h-7 px-2.5 rounded-lg border-slate-200 dark:border-ghost-dark-hairline hover:bg-slate-100 dark:hover:bg-ghost-dark-hover"
          >
            +100일 뒤
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreset(1, 'years', 'add')}
            className="text-xs h-7 px-2.5 rounded-lg border-slate-200 dark:border-ghost-dark-hairline hover:bg-slate-100 dark:hover:bg-ghost-dark-hover"
          >
            +1년 뒤
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreset(30, 'days', 'subtract')}
            className="text-xs h-7 px-2.5 rounded-lg border-slate-200 dark:border-ghost-dark-hairline hover:bg-slate-100 dark:hover:bg-ghost-dark-hover"
          >
            -30일 전
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreset(100, 'days', 'subtract')}
            className="text-xs h-7 px-2.5 rounded-lg border-slate-200 dark:border-ghost-dark-hairline hover:bg-slate-100 dark:hover:bg-ghost-dark-hover"
          >
            -100일 전
          </Button>
        </div>
      </Card>

      {/* 2. 메인 결과 하이라이트 카드 */}
      <Card className="p-4 sm:p-6 bg-white dark:bg-ghost-dark-surface border-[#e5e7eb] dark:border-ghost-dark-hairline rounded-2xl shadow-2xs space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-ghost-dark-ink-mute uppercase tracking-wider block mb-1">
              날짜 계산 결과
            </span>
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#112220] dark:text-white tracking-tight tabular-nums">
                {result.resultDate}
              </h2>
              <Badge
                variant="outline"
                className="text-xs px-2.5 py-0.5 font-bold bg-[#d1ff19] text-[#112220] border-[#d1ff19]"
              >
                {result.dayOfWeek}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-ghost-dark-ink-soft mt-1.5 font-medium">
              기준일({result.baseDate})로부터 {amount}
              {unitLabels[unit]} {operation === 'add' ? '뒤' : '전'} 날짜
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-8 px-2.5 gap-1.5 text-xs border-slate-200 dark:border-ghost-dark-hairline text-slate-600 dark:text-ghost-dark-ink-soft hover:bg-slate-50 dark:hover:bg-ghost-dark-hover"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>복사</span>
          </Button>
        </div>

        {/* 3단 서브 요약 지표 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 dark:border-ghost-dark-hairline">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-ghost-dark-surface-elevated border border-slate-100 dark:border-ghost-dark-hairline-soft">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-ghost-dark-ink-mute mb-1 font-medium">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>기준일</span>
            </div>
            <div className="text-sm font-bold text-[#112220] dark:text-ghost-dark-ink tabular-nums">
              {result.baseDate}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-ghost-dark-surface-elevated border border-slate-100 dark:border-ghost-dark-hairline-soft">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-ghost-dark-ink-mute mb-1 font-medium">
              <ArrowRight className="w-3 h-3 text-indigo-500" />
              <span>계산 수식</span>
            </div>
            <div className="text-sm font-bold text-[#112220] dark:text-ghost-dark-ink">
              {operation === 'add' ? `+${amount}` : `-${amount}`}
              {unitLabels[unit]} {operation === 'add' ? '뒤' : '전'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-ghost-dark-surface-elevated border border-slate-100 dark:border-ghost-dark-hairline-soft">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-ghost-dark-ink-mute mb-1 font-medium">
              <Calendar className="w-3 h-3 text-emerald-500" />
              <span>해당 요일</span>
            </div>
            <div className="text-sm font-bold text-[#112220] dark:text-ghost-dark-ink">
              {result.dayOfWeek}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
