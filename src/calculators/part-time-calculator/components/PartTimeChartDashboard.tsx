import React from 'react';
import { PartTimeCalculationResult } from '../../../types/partTime';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatNumberWithWon } from '../../../utils/formatters';

interface PartTimeChartDashboardProps {
  result: PartTimeCalculationResult;
}

interface ChartSegment {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export const PartTimeChartDashboard: React.FC<PartTimeChartDashboardProps> = ({ result }) => {
  const { monthly } = result;

  if (monthly.grossWage <= 0) {
    return null;
  }

  // 월 급여 구성 요소 분석
  const segments: ChartSegment[] = [
    {
      name: '기본급',
      value: monthly.baseWage,
      color: '#3b82f6', // blue-500
      percentage: Number(((monthly.baseWage / monthly.grossWage) * 100).toFixed(1)),
    },
    {
      name: '주휴수당',
      value: monthly.holidayAllowance,
      color: '#10b981', // emerald-500
      percentage: Number(((monthly.holidayAllowance / monthly.grossWage) * 100).toFixed(1)),
    },
    {
      name: '가산수당',
      value: monthly.additionalPayTotal,
      color: '#f59e0b', // amber-500
      percentage: Number(((monthly.additionalPayTotal / monthly.grossWage) * 100).toFixed(1)),
    },
  ].filter((s) => s.value > 0);

  // 공제액 (있는 경우 실수령액과의 비율 비교용 데이터)
  const netVsDeductionSegments: ChartSegment[] = [
    {
      name: '실수령액',
      value: monthly.netWage,
      color: '#d1ff19', // Ghost Electric Lime
      percentage: Number(((monthly.netWage / monthly.grossWage) * 100).toFixed(1)),
    },
    {
      name: '공제액(세금/보험)',
      value: monthly.taxAmount,
      color: '#f43f5e', // rose-500
      percentage: Number(((monthly.taxAmount / monthly.grossWage) * 100).toFixed(1)),
    },
  ].filter((s) => s.value > 0);

  return (
    <div className="rounded-2xl bg-white dark:bg-ghost-dark-surface border border-slate-200 dark:border-ghost-dark-hairline p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-ghost-dark-ink">
            월 급여 구성 및 실수령 분석
          </h3>
          <p className="text-xs text-slate-500 dark:text-ghost-dark-ink-mute mt-0.5">
            총 유급 급여 중 기본급, 주휴수당 및 공제 비율
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* 차트 1: 항목별 급여 구성 */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold text-slate-600 dark:text-ghost-dark-ink-soft mb-1">
            항목별 급여 구성
          </span>
          <div className="h-44 w-full relative">
            {/* 도넛 중앙 텍스트 (차트 아래 바닥 레이어에 먼저 배치하여 툴팁 가림 방지) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[11px] text-slate-400 dark:text-ghost-dark-ink-mute">세전 총급여</span>
              <span className="text-xs font-bold text-slate-800 dark:text-ghost-dark-ink tabular-nums">
                {formatNumberWithWon(monthly.grossWage)}
              </span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segments}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {segments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [formatNumberWithWon(Number(value) || 0), '금액']}
                  contentStyle={{
                    backgroundColor: 'rgba(19, 21, 24, 0.95)',
                    borderRadius: '8px',
                    border: '1px solid #2a2e36',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs mt-1">
            {segments.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-slate-600 dark:text-ghost-dark-ink-soft">
                  {s.name} <strong className="text-slate-800 dark:text-ghost-dark-ink tabular-nums">{s.percentage}%</strong>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 차트 2: 실수령 vs 공제 (실수령 비율) */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold text-slate-600 dark:text-ghost-dark-ink-soft mb-1">
            실수령 vs 공제율
          </span>
          <div className="h-44 w-full relative">
            {/* 도넛 중앙 텍스트 (차트 아래 바닥 레이어에 먼저 배치하여 툴팁 가림 방지) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[11px] text-slate-400 dark:text-ghost-dark-ink-mute">실수령 비율</span>
              <span className="text-xs font-bold text-slate-800 dark:text-ghost-dark-ink tabular-nums">
                {netVsDeductionSegments[0]?.percentage || 100}%
              </span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={netVsDeductionSegments}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {netVsDeductionSegments.map((entry, index) => (
                    <Cell key={`cell-net-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [formatNumberWithWon(Number(value) || 0), '금액']}
                  contentStyle={{
                    backgroundColor: 'rgba(19, 21, 24, 0.95)',
                    borderRadius: '8px',
                    border: '1px solid #2a2e36',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs mt-1">
            {netVsDeductionSegments.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-slate-600 dark:text-ghost-dark-ink-soft">
                  {s.name} <strong className="text-slate-800 dark:text-ghost-dark-ink tabular-nums">{s.percentage}%</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
