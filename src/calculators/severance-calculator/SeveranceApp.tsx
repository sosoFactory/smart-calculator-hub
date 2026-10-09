import React, { useState, useMemo, useEffect } from 'react';
import { SeveranceInput, DEFAULT_SEVERANCE_INPUT } from '../../types/severance';
import { calculateSeverancePay } from '../../utils/severanceCalculator';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { SeveranceForm } from './components/SeveranceForm';
import { SeveranceSummaryCards } from './components/SeveranceSummaryCards';
import { SeveranceBreakdownTable } from './components/SeveranceBreakdownTable';
import { SeveranceInfoCard } from './components/SeveranceInfoCard';
import { encodeSeveranceQuery, decodeSeveranceQuery, syncUrlQuery } from '../../utils/deepLink';
import { siteConfig } from '../../config/site';

export const SeveranceApp: React.FC = () => {
  const [storedInput, setStoredInput] = useLocalStorage<SeveranceInput>(
    'smart_calc_severance_input',
    DEFAULT_SEVERANCE_INPUT
  );

  const [input, setInput] = useState<SeveranceInput>(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      const fromUrl = decodeSeveranceQuery(window.location.search);
      if (fromUrl) {
        return {
          ...DEFAULT_SEVERANCE_INPUT,
          ...fromUrl,
        };
      }
    }
    return storedInput;
  });

  // URL Query 실시간 동기화
  useEffect(() => {
    const isDefault =
      input.startDate === DEFAULT_SEVERANCE_INPUT.startDate &&
      input.endDate === DEFAULT_SEVERANCE_INPUT.endDate &&
      input.baseSalary === DEFAULT_SEVERANCE_INPUT.baseSalary &&
      input.annualBonus === DEFAULT_SEVERANCE_INPUT.annualBonus &&
      input.annualLeaveAllowance === DEFAULT_SEVERANCE_INPUT.annualLeaveAllowance;

    if (isDefault) {
      syncUrlQuery('');
    } else {
      const query = encodeSeveranceQuery(input);
      syncUrlQuery(query);
    }
    setStoredInput(input);
  }, [input, setStoredInput]);

  // 페이지 타이틀 동적 업데이트
  useEffect(() => {
    document.title = siteConfig.getTitle('퇴직금 계산기');
  }, []);

  const result = useMemo(() => calculateSeverancePay(input), [input]);

  const handleReset = () => {
    setInput(DEFAULT_SEVERANCE_INPUT);
    syncUrlQuery('');
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full animate-page-fade">
      {/* 2컬럼 레이아웃: 좌측 폼 (5) / 우측 결과 및 시각화 (7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* 좌측 입력 폼 영역 (lg: 5컬럼) */}
        <div className="lg:col-span-5 space-y-4 w-full min-w-0">
          <SeveranceForm input={input} onChange={setInput} onReset={handleReset} />
        </div>

        {/* 우측 결과 대시보드 & 시각화 영역 (lg: 7컬럼) */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5 w-full min-w-0">
          <SeveranceSummaryCards result={result} />
          <SeveranceBreakdownTable result={result} />
        </div>
      </div>

      {/* 최하단 법률 및 세무 상식 안내 카드 */}
      <div className="w-full">
        <SeveranceInfoCard />
      </div>
    </div>
  );
};

export default SeveranceApp;
