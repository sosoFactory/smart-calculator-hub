import React from 'react';
import { BmiResult } from '../../../types/bmi';
import { Badge } from '../../../components/ui/badge';

interface BmiGaugeCardProps {
  result: BmiResult;
}

interface GaugeSegment {
  id: string;
  label: string;
  range: string;
  minBmi: number;
  maxBmi: number;
  startPct: number;
  endPct: number;
  widthPercent: number;
  bg: string;
}

const GAUGE_SECTIONS: GaugeSegment[] = [
  { id: 'underweight', label: '저체중', range: '<18.5', minBmi: 13, maxBmi: 18.5, startPct: 0, endPct: 18, widthPercent: 18, bg: 'bg-blue-400 dark:bg-blue-500' },
  { id: 'normal', label: '정상', range: '18.5-22.9', minBmi: 18.5, maxBmi: 23.0, startPct: 18, endPct: 42, widthPercent: 24, bg: 'bg-emerald-500 dark:bg-[#d1ff19]' },
  { id: 'pre-obese', label: '과체중', range: '23-24.9', minBmi: 23.0, maxBmi: 25.0, startPct: 42, endPct: 58, widthPercent: 16, bg: 'bg-amber-400 dark:bg-amber-500' },
  { id: 'obese-1', label: '1단계', range: '25-29.9', minBmi: 25.0, maxBmi: 30.0, startPct: 58, endPct: 76, widthPercent: 18, bg: 'bg-orange-500 dark:bg-orange-500' },
  { id: 'obese-2', label: '2단계', range: '30-34.9', minBmi: 30.0, maxBmi: 35.0, startPct: 76, endPct: 90, widthPercent: 14, bg: 'bg-rose-500 dark:bg-rose-500' },
  { id: 'obese-3', label: '고도', range: '≥35', minBmi: 35.0, maxBmi: 42.0, startPct: 90, endPct: 100, widthPercent: 10, bg: 'bg-purple-600 dark:bg-purple-600' },
];

export const BmiGaugeCard: React.FC<BmiGaugeCardProps> = ({ result }) => {
  // 게이지 바의 실제 세그먼트 너비에 정확히 일치하도록 구간별 보간(Piecewise Linear Interpolation) 적용
  const getMarkerPosition = (bmi: number): number => {
    if (bmi <= 13) return 2;
    if (bmi >= 42) return 98;

    for (const sec of GAUGE_SECTIONS) {
      if (bmi < sec.maxBmi) {
        const ratio = (bmi - sec.minBmi) / (sec.maxBmi - sec.minBmi);
        const clampedRatio = Math.max(0, Math.min(1, ratio));
        return sec.startPct + clampedRatio * (sec.endPct - sec.startPct);
      }
    }
    return 95;
  };

  const markerPercent = getMarkerPosition(result.bmi);

  return (
    <div className="bg-white dark:bg-ghost-dark-surface rounded-[24px] border border-[#e5e7eb] dark:border-ghost-dark-hairline p-4 sm:p-6 shadow-sm transition-colors space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#112220] dark:text-ghost-dark-ink flex items-center gap-2">
            <span>비만도 스펙트럼 게이지</span>
            <Badge variant="outline" size="sm" className="text-[10px] sm:text-xs">
              KSSO 한국인 기준
            </Badge>
          </h3>
          <p className="text-xs text-[#64748b] dark:text-ghost-dark-ink-mute mt-0.5">
            전체 비만도 6단계 스펙트럼 상 나의 위치
          </p>
        </div>
      </div>

      {/* 게이지 본체 영역 */}
      <div className="pt-8 pb-2 px-2">
        <div className="relative">
          {/* 현재 BMI 위치 마커 (상단 뱃지 + 화살표) */}
          <div
            className="absolute -top-7 -translate-x-1/2 transition-all duration-300 ease-out z-10 flex flex-col items-center pointer-events-none"
            style={{ left: `${markerPercent}%` }}
          >
            <div className="bg-[#15171a] dark:bg-white text-white dark:text-[#112220] px-2 py-0.5 rounded text-[11px] font-black tabular-nums shadow-md whitespace-nowrap">
              내 BMI {result.bmi}
            </div>
            <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#15171a] dark:border-t-white" />
          </div>

          {/* 6단계 컬러 멀티 세그먼트 바 */}
          <div className="h-4 sm:h-5 w-full rounded-full overflow-hidden flex shadow-inner">
            {GAUGE_SECTIONS.map((sec) => (
              <div
                key={sec.id}
                className={`${sec.bg} h-full transition-opacity duration-200 ${
                  result.category === sec.id ? 'opacity-100 ring-2 ring-slate-900/30 dark:ring-white/40' : 'opacity-75 hover:opacity-100'
                }`}
                style={{ width: `${sec.widthPercent}%` }}
                title={`${sec.label} (${sec.range})`}
              />
            ))}
          </div>
        </div>

        {/* 하단 구간별 라벨 및 기준치 */}
        <div className="grid grid-cols-6 gap-1 pt-3 text-center">
          {GAUGE_SECTIONS.map((sec) => {
            const isCurrent = result.category === sec.id;
            return (
              <div key={sec.id} className="space-y-0.5 min-w-0">
                <div
                  className={`text-[11px] sm:text-xs truncate transition-colors ${
                    isCurrent
                      ? 'font-bold text-[#112220] dark:text-[#d1ff19]'
                      : 'text-slate-500 dark:text-ghost-dark-ink-mute font-medium'
                  }`}
                >
                  {sec.label}
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-400 dark:text-ghost-dark-ink-stone tabular-nums">
                  {sec.range}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
