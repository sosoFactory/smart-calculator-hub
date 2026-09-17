import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { CalculationResult } from '../types/calculator';
import { formatCurrency, formatKoreanUnit } from '../utils/formatters';

interface ChartDashboardProps {
  resultA: CalculationResult;
  resultB?: CalculationResult;
  isComparisonMode: boolean;
  nameA?: string;
  nameB?: string;
}

export const ChartDashboard: React.FC<ChartDashboardProps> = ({
  resultA,
  resultB,
  isComparisonMode,
  nameA = '시나리오 A',
  nameB = '시나리오 B',
}) => {
  const { isDark } = useTheme();

  // 차트 데이터 병합 (연도 기준)
  const chartData = resultA.breakdown.map((itemA, index) => {
    const itemB = resultB?.breakdown[index];
    return {
      year: `${itemA.year}년`,
      yearNum: itemA.year,
      // 시나리오 A
      principalA: itemA.totalPrincipal,
      netInterestA: itemA.netInterestTotal,
      totalPostTaxA: itemA.futureValuePostTax,
      // 시나리오 B (비교 모드)
      principalB: itemB ? itemB.totalPrincipal : 0,
      netInterestB: itemB ? itemB.netInterestTotal : 0,
      totalPostTaxB: itemB ? itemB.futureValuePostTax : 0,
    };
  });

  const formatYAxis = (val: number) => {
    if (val === 0) return '0';
    if (Math.abs(val) >= 100_000_000) {
      return `${(val / 100_000_000).toFixed(0)}억`;
    }
    if (Math.abs(val) >= 10_000) {
      return `${(val / 10_000).toFixed(0)}만`;
    }
    return `${val}`;
  };

  const gridStroke = isDark ? '#22252a' : '#e5e7eb';
  const axisStroke = isDark ? '#2a2e36' : '#cbd5e1';
  const tickFill = isDark ? '#8a919e' : '#64748b';
  const primaryStroke = isDark ? '#d1ff19' : '#15171a';

  // 커스텀 툴팁
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#15171a] dark:bg-ghost-dark-surface-elevated text-white rounded-lg p-3 shadow-xl border border-[#1f2937] dark:border-ghost-dark-hairline-soft text-xs space-y-2 min-w-[170px] z-50">
          <div className="font-bold border-b border-white/10 pb-1.5 flex justify-between items-center">
            <span>{label}차 경과</span>
          </div>
          <div className="space-y-1.5">
            {payload.map((entry: any, index: number) => {
              const val = entry.value;
              return (
                <div key={`tooltip-${index}`} className="flex justify-between items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-slate-300 text-[11px]">{entry.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">{formatCurrency(val)}</div>
                    <div className="text-[10px] text-slate-400">{formatKoreanUnit(val)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-ghost-dark-surface rounded-[24px] p-5 sm:p-6 border border-[#e5e7eb] dark:border-ghost-dark-hairline transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#e5e7eb] dark:border-ghost-dark-hairline">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#112220] dark:text-ghost-dark-ink">
            {isComparisonMode ? '시나리오 A / B 자산 성장 비교' : '연도별 자산 성장 시뮬레이션'}
          </h3>
          <p className="text-xs text-[#64748b] dark:text-ghost-dark-ink-mute mt-0.5">
            {isComparisonMode
              ? '동일 기간 동안 두 전략의 자산 축적 차이를 확인하세요.'
              : '납입 원금과 복리 순이자의 누적 성장 추이입니다.'}
          </p>
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="w-full h-72 sm:h-80 min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          {isComparisonMode ? (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
              <XAxis
                dataKey="year"
                tickLine={false}
                axisLine={{ stroke: axisStroke }}
                tick={{ fontSize: 11, fill: tickFill }}
              />
              <YAxis
                tickFormatter={formatYAxis}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: tickFill }}
                width={45}
                tickMargin={4}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }}
              />

              <Line
                type="monotone"
                dataKey="totalPostTaxA"
                name={`${nameA} 최종 자산`}
                stroke={primaryStroke}
                strokeWidth={2.5}
                dot={{ r: 2, fill: primaryStroke }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="totalPostTaxB"
                name={`${nameB} 최종 자산`}
                stroke="#8b5cf6"
                strokeWidth={2.5}
                dot={{ r: 2, fill: '#8b5cf6' }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="principalA"
                name={`${nameA} 납입원금`}
                stroke={isDark ? '#94a3b8' : '#94a3b8'}
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="principalB"
                name={`${nameB} 납입원금`}
                stroke={isDark ? '#64748b' : '#cbd5e1'}
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={isDark ? 0.3 : 0.4} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={primaryStroke} stopOpacity={isDark ? 0.5 : 0.7} />
                  <stop offset="95%" stopColor={primaryStroke} stopOpacity={isDark ? 0.05 : 0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
              <XAxis
                dataKey="year"
                tickLine={false}
                axisLine={{ stroke: axisStroke }}
                tick={{ fontSize: 11, fill: tickFill }}
              />
              <YAxis
                tickFormatter={formatYAxis}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: tickFill }}
                width={45}
                tickMargin={4}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: 10, fontSize: 11 }}
              />

              <Area
                type="monotone"
                dataKey="principalA"
                stackId="1"
                name="누적 납입원금"
                stroke="#64748b"
                fill="url(#colorPrincipal)"
              />
              <Area
                type="monotone"
                dataKey="netInterestA"
                stackId="1"
                name="누적 세후순이자"
                stroke={primaryStroke}
                fill="url(#colorInterest)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
