import React from 'react';
import { GoalYearlyBreakdown, EarlyAchievementInfo } from '../../../types/goal';
import { formatCurrency, formatKoreanCurrency } from '../../../utils/formatters';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { Target } from 'lucide-react';

interface GoalChartCardProps {
  breakdown: GoalYearlyBreakdown[];
  targetAmount: number;
  earlyAchievement?: EarlyAchievementInfo;
}

export const GoalChartCard: React.FC<GoalChartCardProps> = ({ breakdown, targetAmount, earlyAchievement }) => {
  const chartData = breakdown.map((item) => ({
    name: item.year + '년',
    initial: item.initialValue,
    contribution: item.accumulatedContribution,
    interest: item.accumulatedInterest,
    total: item.totalAsset,
  }));

  const formatYAxis = (val: number) => {
    if (val >= 100000000) {
      return (val / 100000000).toFixed(val % 100000000 === 0 ? 0 : 1) + '억';
    }
    if (val >= 10000) {
      return Math.round(val / 10000) + '만';
    }
    return String(val);
  };

  const isEarly = earlyAchievement?.isEarlyAchieved;

  return (
    <div className='bg-white dark:bg-ghost-dark-surface rounded-[24px] border border-[#e5e7eb] dark:border-ghost-dark-hairline p-4 sm:p-6 space-y-4 shadow-2xs transition-colors w-full'>
      <div className='flex items-center justify-between pb-3 border-b border-[#e5e7eb] dark:border-ghost-dark-hairline gap-2'>
        <div className='min-w-0 flex-1'>
          <h3 className='text-sm sm:text-base font-bold text-[#112220] dark:text-ghost-dark-ink'>
            목표 자산 형성 궤적
          </h3>
          <p className='text-xs text-[#64748b] dark:text-ghost-dark-ink-mute mt-0.5 break-keep'>
            초기 목돈과 매월 적립금, 복리 수익이 누적되어 목표에 도달하는 흐름
          </p>
        </div>
        <div className='text-right shrink-0 flex flex-col items-end gap-0.5'>
          <span className='text-xs font-bold text-[#112220] dark:text-[#d1ff19] tabular-nums'>
            목표 {formatKoreanCurrency(targetAmount)}
          </span>
          {isEarly && earlyAchievement && (
            <span className='text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 px-1.5 py-0.5 rounded flex items-center gap-1'>
              <Target className='w-3 h-3 shrink-0 text-amber-600 dark:text-amber-400' />
              <span>{earlyAchievement.reachYearsText}에 조기 돌파</span>
            </span>
          )}

        </div>
      </div>

      <div className='flex flex-wrap items-center justify-start sm:justify-end gap-2.5 sm:gap-4 text-[11px] sm:text-xs text-slate-500 dark:text-ghost-dark-ink-mute'>
        <div className='flex items-center gap-1.5 shrink-0'>
          <span className='w-2.5 h-2.5 rounded-xs bg-sky-400 shrink-0' />
          <span>초기 자금</span>
        </div>
        <div className='flex items-center gap-1.5 shrink-0'>
          <span className='w-2.5 h-2.5 rounded-xs bg-indigo-500 shrink-0' />
          <span>누적 월적립 원금</span>
        </div>
        <div className='flex items-center gap-1.5 shrink-0'>
          <span className='w-2.5 h-2.5 rounded-xs bg-emerald-500 shrink-0' />
          <span>복리 이자 수익</span>
        </div>
        <div className='flex items-center gap-1.5 shrink-0'>
          <span className='w-3 h-0.5 border-t-2 border-dashed border-amber-500 shrink-0' />
          <span className='text-amber-600 dark:text-amber-400 font-medium'>목표선</span>
        </div>
      </div>

      <div className='h-60 sm:h-72 w-full pt-2 min-w-0'>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart data={chartData} margin={{ top: 15, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id='colorInitial' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#38bdf8' stopOpacity={0.8} />
                <stop offset='95%' stopColor='#38bdf8' stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id='colorContrib' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#6366f1' stopOpacity={0.8} />
                <stop offset='95%' stopColor='#6366f1' stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id='colorInterest' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#10b981' stopOpacity={0.8} />
                <stop offset='95%' stopColor='#10b981' stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#e2e8f0' opacity={0.6} />
            <XAxis
              dataKey='name'
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
            />
            <Tooltip
              wrapperStyle={{ zIndex: 50, pointerEvents: 'none' }}
              content={({ active, payload, label }) => {
                if (!active || !payload || payload.length === 0) return null;
                const data = payload[0].payload;
                const isTargetReached = data.total >= targetAmount;

                return (
                  <div className='bg-[#15171a] dark:bg-ghost-dark-surface-elevated text-white p-3 rounded-xl shadow-xl border border-slate-700 dark:border-ghost-dark-hairline-soft text-xs space-y-1.5 min-w-[170px]'>
                    <div className='flex items-center justify-between border-b border-slate-800 dark:border-ghost-dark-hairline pb-1 gap-2'>
                      <p className='font-bold text-slate-200'>
                        {label}차 말 자산 현황
                      </p>
                      {isTargetReached && (
                        <span className='text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-1.5 py-0.5 rounded'>
                          ✓ 목표 달성
                        </span>
                      )}
                    </div>
                    <div className='flex justify-between gap-2'>
                      <span className='text-slate-400'>총 평가 자산:</span>
                      <span className='font-bold text-[#d1ff19] tabular-nums'>
                        {formatCurrency(data.total)}
                      </span>
                    </div>
                    <div className='flex justify-between gap-2'>
                      <span className='text-sky-400'>초기 자금:</span>
                      <span className='tabular-nums'>{formatCurrency(data.initial)}</span>
                    </div>
                    <div className='flex justify-between gap-2'>
                      <span className='text-indigo-300'>누적 월 적립:</span>
                      <span className='tabular-nums'>{formatCurrency(data.contribution)}</span>
                    </div>
                    <div className='flex justify-between gap-2'>
                      <span className='text-emerald-400'>복리 수익:</span>
                      <span className='tabular-nums'>+{formatCurrency(data.interest)}</span>
                    </div>
                  </div>
                );
              }}
            />
            <ReferenceLine
              y={targetAmount}
              stroke='#f59e0b'
              strokeDasharray='4 4'
              strokeWidth={2}
              label={{
                value: `목표선 ${formatKoreanCurrency(targetAmount)}`,
                position: 'insideTopLeft',
                fill: '#f59e0b',
                fontSize: 10,
                fontWeight: 'bold',
              }}
            />
            <Area
              type='monotone'
              dataKey='initial'
              stackId='1'
              stroke='#38bdf8'
              fill='url(#colorInitial)'
            />
            <Area
              type='monotone'
              dataKey='contribution'
              stackId='1'
              stroke='#6366f1'
              fill='url(#colorContrib)'
            />
            <Area
              type='monotone'
              dataKey='interest'
              stackId='1'
              stroke='#10b981'
              fill='url(#colorInterest)'
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

