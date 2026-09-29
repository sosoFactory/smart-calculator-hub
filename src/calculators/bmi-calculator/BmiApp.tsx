import React, { useState, useMemo, useEffect } from 'react';
import { BmiInput } from '../../types/bmi';
import { calculateBmi } from '../../utils/bmiCalculator';
import { decodeBmiQuery, encodeBmiQuery, syncUrlQuery } from '../../utils/deepLink';
import { BmiForm } from './components/BmiForm';
import { BmiSummaryCards } from './components/BmiSummaryCards';
import { BmiGaugeCard } from './components/BmiGaugeCard';
import { BmiInfoCard } from './components/BmiInfoCard';

const DEFAULT_BMI_INPUT: BmiInput = {
  height: 170,
  weight: 65,
  gender: 'male',
};

export const BmiApp: React.FC = () => {
  const [input, setInput] = useState<BmiInput>(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      const fromUrl = decodeBmiQuery(window.location.search);
      if (fromUrl) {
        return { ...DEFAULT_BMI_INPUT, ...fromUrl };
      }
    }
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bmi-calculator-input');
      if (saved) {
        try {
          return { ...DEFAULT_BMI_INPUT, ...JSON.parse(saved) };
        } catch {}
      }
    }
    return DEFAULT_BMI_INPUT;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bmi-calculator-input', JSON.stringify(input));
    }
    const query = encodeBmiQuery(input);
    syncUrlQuery(query);
  }, [input]);

  const result = useMemo(() => {
    return calculateBmi(input);
  }, [input]);

  const handleReset = () => {
    setInput(DEFAULT_BMI_INPUT);
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      {/* 2컬럼 레이아웃: 좌측 폼 (5) / 우측 결과 및 대시보드 (7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* 좌측 입력 폼 */}
        <div className="lg:col-span-5 w-full">
          <BmiForm
            input={input}
            onChange={setInput}
            onReset={handleReset}
          />
        </div>

        {/* 우측 결과 및 분석 대시보드 */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5 w-full">
          {/* 1. 핵심 결과 요약 카드 */}
          <BmiSummaryCards result={result} />

          {/* 2. 비만도 6단계 스펙트럼 게이지 */}
          <BmiGaugeCard result={result} />
        </div>
      </div>

      {/* 3. 건강 및 비만 관리 상식 안내 카드 (풀위드 단독 배치) */}
      <BmiInfoCard />
    </div>
  );
};

export default BmiApp;
