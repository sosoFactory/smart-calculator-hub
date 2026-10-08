import React from 'react';
import { CashFlowCalculationResult } from '../../../types/cashFlow';
import { formatCurrency, formatKoreanCurrency } from '../../../utils/formatters';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface CashFlowChartsProps {
  result: CashFlowCalculationResult;
}

export const CashFlowCharts: React.FC<CashFlowChartsProps> = ({ result }) => {
  const { sensitivityList, annualNet, annualTax, annualGross } = result;

  const barData = sensitivityList.map((item) => ({
    name: `${item.rate}%`,
    capital: item.requiredCapital,
    isCurrent: item.isCurrent,
  }));

  const formatYAxis = (val: number) => {
    if (val >= 100_000_000) {
      return (val / 100_000_000).toFixed(val % 100_000_000 === 0 ? 0 : 1) + '억';
    }
    if (val >= 10_000) {
      return Math.round(val / 10_000) + '만';
    }
    return String(val);
  };

  const pieData = [
    {
      name: '세후 실수령액',
      value: annualNet,
      color: '#10b981',
      percentage: annualGross > 0 ? Number(((annualNet / annualGross) * 100).toFixed(1)) : 100,
    },
    {
      name: '예상 세금',
      value: annualTax,
      color: '#f43f5e',
      percentage: annualGross > 0 ? Number(((annualTax / annualGross) * 100).toFixed(1)) : 0,
    },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-4 sm:space-y-5 w-full">
      {/* 1. 수익률별 필요 원금 비교 막대차트 */}
      <div className="bg-white dark:bg-ghost-dark-surface rounded-[24px] border border-[#e5e7eb] dark:border-ghost-dark-hairline p-4 sm:p-6 shadow-2xs space-y-4 transition-colors w-full">
        <div className="flex items-center justify-between pb-3 border-b border-[#e5e7eb] dark:border-ghost-dark-hairline gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base font-bold text-[#112220] dark:text-ghost-dark-ink flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#112220] dark:text-[#d1ff19] shrink-0" />
              <span>수익률 민감도 분석 (2% ~ 10%)</span>
            </h3>
            <p className="text-xs text-[#64748b] dark:text-ghost-dark-ink-mute mt-0.5 break-keep">
              예상 수익률이 1%p 높아질 때마다 은퇴에 필요한 원금이 얼마나 줄어드는지 확인하세요
            </p>
          </div>
        </div>

        <div className="h-56 sm:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <YAxis
                tickFormatter={formatYAxis}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <Tooltip
                wrapperStyle={{ zIndex: 50, pointerEvents: 'none' }}
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-[#15171a] text-white p-2.5 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1">
                      <div className="font-bold text-[#d1ff19] flex items-center gap-1.5">
                        <span>수익률 연 {d.name}</span>
                        {d.isCurrent && (
                          <span className="text-[10px] bg-[#d1ff19]/20 text-[#d1ff19] px-1.5 py-0.2 rounded">
                            현재 설정
                          </span>
                        )}
                      </div>
                      <div className="text-slate-300">
                        필요 원금: <span className="font-bold text-white">{formatKoreanCurrency(d.capital)}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        ({formatCurrency(d.capital)})
                      </div>
                    </div>
                  );
                }}
              />
              <Bar dataKey="capital" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isCurrent ? '#10b981' : '#94a3b8'}
                    opacity={entry.isCurrent ? 1 : 0.55}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. 세전 수익 구성비 도넛 차트 */}
      {pieData.length > 0 && (
        <div className="bg-white dark:bg-ghost-dark-surface rounded-[24px] border border-[#e5e7eb] dark:border-ghost-dark-hairline p-4 sm:p-6 shadow-2xs space-y-4 transition-colors w-full">
          <div className="flex items-center justify-between pb-3 border-b border-[#e5e7eb] dark:border-ghost-dark-hairline gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-base font-bold text-[#112220] dark:text-ghost-dark-ink flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-[#112220] dark:text-[#d1ff19] shrink-0" />
                <span>연간 세전 수익 구성 (실수령 vs 세금)</span>
              </h3>
              <p className="text-xs text-[#64748b] dark:text-ghost-dark-ink-mute mt-0.5 break-keep">
                총 세전 수익금 중 실제로 내 통장에 들어오는 실수령액과 납부 세금 비중
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-4 pt-2">
            <div className="h-44 w-44 shrink-0 relative">
              {/* 도넛 중앙 텍스트 (차트 아래 바닥 레이어에 먼저 배치하여 호버 시 툴팁을 가리지 않도록 보장) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-[#64748b] dark:text-ghost-dark-ink-mute font-medium">실수령률</span>
                <span className="text-base font-black text-emerald-600 dark:text-[#d1ff19] tabular-nums">
                  {pieData[0]?.percentage || 100}%
                </span>
              </div>

              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`pie-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    wrapperStyle={{ zIndex: 50, pointerEvents: 'none' }}
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[#15171a] text-white p-2 rounded-lg text-xs space-y-0.5">
                          <span className="font-bold" style={{ color: d.color }}>
                            {d.name}
                          </span>
                          <div>
                            {formatKoreanCurrency(d.value)} ({d.percentage}%)
                          </div>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2.5 w-full sm:w-auto">
              {pieData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between sm:justify-start gap-4 p-2.5 rounded-xl border border-slate-100 dark:border-ghost-dark-hairline bg-slate-50/50 dark:bg-ghost-dark-surface-deep text-xs min-w-[200px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-[#112220] dark:text-ghost-dark-ink">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#112220] dark:text-ghost-dark-ink tabular-nums">
                      {formatKoreanCurrency(item.value)}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-ghost-dark-ink-mute ml-1 tabular-nums">
                      ({item.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
