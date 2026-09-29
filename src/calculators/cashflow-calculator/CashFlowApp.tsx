import React, { useState, useMemo, useEffect } from 'react';
import { CashFlowInput, DEFAULT_CASH_FLOW_INPUT } from '../../types/cashFlow';
import { calculateCashFlow } from '../../utils/cashFlowCalculator';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CashFlowForm } from './components/CashFlowForm';
import { CashFlowSummaryCards } from './components/CashFlowSummaryCards';
import { CashFlowCharts } from './components/CashFlowCharts';
import { CashFlowTable } from './components/CashFlowTable';
import { CashFlowInfoCard } from './components/CashFlowInfoCard';
import { encodeCashFlowQuery, decodeCashFlowQuery, syncUrlQuery } from '../../utils/deepLink';
import { siteConfig } from '../../config/site';

export const CashFlowApp: React.FC = () => {
  const [storedInput, setStoredInput] = useLocalStorage<CashFlowInput>(
    'smart_calc_cashflow_input',
    DEFAULT_CASH_FLOW_INPUT
  );

  const [input, setInput] = useState<CashFlowInput>(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      const fromUrl = decodeCashFlowQuery(window.location.search);
      if (fromUrl) {
        return {
          ...DEFAULT_CASH_FLOW_INPUT,
          ...fromUrl,
        };
      }
    }
    return storedInput;
  });

  // URL Query 실시간 동기화
  useEffect(() => {
    const isDefault =
      input.monthlyNetDesired === DEFAULT_CASH_FLOW_INPUT.monthlyNetDesired &&
      input.annualReturnRate === DEFAULT_CASH_FLOW_INPUT.annualReturnRate &&
      input.taxType === DEFAULT_CASH_FLOW_INPUT.taxType;

    if (isDefault) {
      syncUrlQuery('');
    } else {
      const query = encodeCashFlowQuery(input);
      syncUrlQuery(query);
    }
    setStoredInput(input);
  }, [input, setStoredInput]);

  // 페이지 타이틀 동적 업데이트
  useEffect(() => {
    document.title = siteConfig.getTitle('파이어 현금흐름 계산기');
  }, []);

  const result = useMemo(() => calculateCashFlow(input), [input]);

  const handleReset = () => {
    setInput(DEFAULT_CASH_FLOW_INPUT);
    syncUrlQuery('');
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full animate-page-fade">
      {/* 2컬럼 레이아웃: 좌측 폼 (5) / 우측 결과 및 시각화 (7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* 좌측 입력 폼 영역 (lg: 5컬럼) */}
        <div className="lg:col-span-5 space-y-4 w-full min-w-0">
          <CashFlowForm input={input} onChange={setInput} onReset={handleReset} />
        </div>

        {/* 우측 결과 대시보드 & 시각화 영역 (lg: 7컬럼) */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5 w-full min-w-0">
          <CashFlowSummaryCards result={result} />
          <CashFlowCharts result={result} />
          <CashFlowTable result={result} />
        </div>
      </div>

      {/* 하단 파이어족 상식 안내 카드 (풀위드 단독 배치) */}
      <CashFlowInfoCard />
    </div>
  );
};

export default CashFlowApp;
