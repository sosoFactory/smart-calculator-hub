import React from 'react';
import { SalaryCalculationResult } from '../../../types/salary';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatNumberWithWon } from '../../../utils/formatters';

interface SalaryChartDashboardProps {
  result: SalaryCalculationResult;
}

interface ChartSegment {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export const SalaryChartDashboard: React.FC<SalaryChartDashboardProps> = ({ result }) => {
  if (result.grossMonthlySalary <= 0) {
    return null;
  }

  // 차트 데이터 구성 (실수령액 vs 4대 보험 vs 세금)
  const segments: ChartSegment[] = [
    {
      name: '실수령액',
      value: result.netMonthlySalary,
      color: '#d1ff19', // Ghost Electric Lime
      percentage: result.takeHomeRatio,
    },
    {
      name: '국민연금',
      value: result.nationalPension,
      color: '#3b82f6', // blue-500
      percentage: Number(((result.nationalPension / result.grossMonthlySalary) * 100).toFixed(1)),
    },
    {
      name: '건강보험',
      value: result.healthInsurance,
      color: '#0ea5e9', // sky-500
      percentage: Number(((result.healthInsurance / result.grossMonthlySalary) * 100).toFixed(1)),
    },
    {
      name: '노인장기요양',
      value: result.longTermCare,
      color: '#06b6d4', // cyan-500
      percentage: Number(((result.longTermCare / result.grossMonthlySalary) * 100).toFixed(1)),
    },
    {
      name: '고용보험',
      value: result.employmentInsurance,
      color: '#64748b', // slate-500
      percentage: Number(((result.employmentInsurance / result.grossMonthlySalary) * 100).toFixed(1)),
    },
    {
      name: '소득세·지방소득세',
      value: result.totalTax,
      color: '#f43f5e', // rose-500
      percentage: Number(((result.totalTax / result.grossMonthlySalary) * 100).toFixed(1)),
    },
  ].filter((s) => s.value > 0);

  return (
    <div className="@container bg-white dark:bg-ghost-dark-surface p-5 sm:p-6 rounded-[24px] border border-[#e5e7eb] dark:border-ghost-dark-hairline shadow-sm transition-colors space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#e5e7eb] dark:border-ghost-dark-hairline">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#112220] dark:text-ghost-dark-ink tracking-tight whitespace-nowrap">
            급여 및 공제 항목 구성 비중
          </h3>
          <p className="text-xs text-[#64748b] dark:text-ghost-dark-ink-mute mt-0.5 break-keep">
            세전 월 급여 중 실수령액과 각 공제 항목이 차지하는 비율입니다
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 @xl:grid-cols-12 gap-4 items-center">
        {/* 도넛 차트 */}
        <div className="@xl:col-span-6 w-full h-56 relative flex items-center justify-center min-w-0">
          {/* 도넛 차트 중앙 텍스트 (z-0으로 배치하여 툴팁(z-50)에 가려지지 않도록 보장) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center z-0">
            <span className="text-[11px] font-bold text-[#64748b] dark:text-ghost-dark-ink-mute uppercase tracking-wider">
              실수령 비율
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#112220] dark:text-ghost-dark-ink tabular-nums">
              {result.takeHomeRatio}%
            </span>
          </div>

          {/* 차트 및 툴팁 레이어 (z-10, 툴팁 z-50) */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height={224}>
              <PieChart>
                <Pie
                  data={segments}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                  isAnimationActive={false}
                >
                  {segments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  wrapperStyle={{ zIndex: 50, pointerEvents: 'none' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as ChartSegment;
                      return (
                        <div className="bg-[#15171a] dark:bg-ghost-dark-surface-elevated text-white text-xs p-2.5 rounded-lg shadow-xl border border-slate-700/60 dark:border-ghost-dark-hairline-soft pointer-events-none z-50">
                          <div className="font-semibold flex items-center gap-1.5 mb-1 whitespace-nowrap">
                            <span
                              className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                              style={{ backgroundColor: data.color }}
                            />
                            <span>{data.name}</span>
                          </div>
                          <div className="text-slate-200 tabular-nums whitespace-nowrap">
                            {formatNumberWithWon(data.value)} ({data.percentage}%)
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 항목별 범례 및 비중 게이지 목록 */}
        <div className="@xl:col-span-6 w-full space-y-2 text-xs">
          {segments.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-ghost-dark-surface-deep border border-[#e5e7eb] dark:border-ghost-dark-hairline gap-2"
            >
              <div className="flex items-center gap-2 min-w-0 shrink-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-semibold text-[#112220] dark:text-ghost-dark-ink-base whitespace-nowrap">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-slate-400 dark:text-ghost-dark-ink-stone text-[11px] whitespace-nowrap">
                  {item.percentage}%
                </span>
                <span className="font-bold text-[#112220] dark:text-ghost-dark-ink tabular-nums whitespace-nowrap">
                  {formatNumberWithWon(item.value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
