import React, { useState, useMemo, useEffect } from 'react';
import { GoalInput, DEFAULT_GOAL_INPUT } from '../../types/goal';
import { calculateGoalTarget } from '../../utils/goalCalculator';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { GoalForm } from './components/GoalForm';
import { GoalSummaryCards } from './components/GoalSummaryCards';
import { GoalChartCard } from './components/GoalChartCard';
import { GoalRateComparisonCard } from './components/GoalRateComparisonCard';
import { GoalInfoCard } from './components/GoalInfoCard';
import { encodeGoalQuery, decodeGoalQuery, syncUrlQuery } from '../../utils/deepLink';
import { siteConfig } from '../../config/site';

export const GoalApp: React.FC = () => {
  const [storedInput, setStoredInput] = useLocalStorage<GoalInput>('smart_calc_goal_input', DEFAULT_GOAL_INPUT);

  const [input, setInput] = useState<GoalInput>(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      const fromUrl = decodeGoalQuery(window.location.search);
      if (fromUrl) {
        return {
          ...DEFAULT_GOAL_INPUT,
          ...fromUrl,
        };
      }
    }
    return storedInput;
  });

  // URL Query 실시간 동기화
  useEffect(() => {
    const isDefault =
      input.targetAmount === DEFAULT_GOAL_INPUT.targetAmount &&
      input.targetYears === DEFAULT_GOAL_INPUT.targetYears &&
      input.annualRate === DEFAULT_GOAL_INPUT.annualRate &&
      input.initialAmount === DEFAULT_GOAL_INPUT.initialAmount &&
      input.taxType === DEFAULT_GOAL_INPUT.taxType;

    if (isDefault) {
      syncUrlQuery('');
    } else {
      const query = encodeGoalQuery(input);
      syncUrlQuery(query);
    }
    setStoredInput(input);
  }, [input, setStoredInput]);

  // 페이지 타이틀 동적 업데이트
  useEffect(() => {
    document.title = siteConfig.getTitle('목표 자산 역산 계산기');
  }, []);

  const result = useMemo(() => calculateGoalTarget(input), [input]);

  const handleReset = () => {
    setInput(DEFAULT_GOAL_INPUT);
    syncUrlQuery('');
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full animate-page-fade">
      {/* 2컬럼 레이아웃: 좌측 폼 (5) / 우측 결과 및 시각화 (7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* 좌측 입력 폼 영역 (lg: 5컬럼) */}
        <div className="lg:col-span-5 space-y-4 w-full min-w-0">
          <GoalForm input={input} onChange={setInput} onReset={handleReset} />
        </div>

        {/* 우측 결과 대시보드 & 시각화 영역 (lg: 7컬럼) */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5 w-full min-w-0">
          <GoalSummaryCards result={result} />
          <GoalChartCard breakdown={result.breakdown} targetAmount={result.targetAmount} />
          <GoalRateComparisonCard comparisons={result.rateComparisons} currentRate={input.annualRate} />
          <GoalInfoCard />
        </div>
      </div>
    </div>
  );
};

export default GoalApp;
