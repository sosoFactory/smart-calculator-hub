import React, { useEffect, useMemo } from 'react';
import { LoanInput } from '../../types/loan';
import { calculateLoanRepayment, compareLoanMethods } from '../../utils/loanCalculator';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { LoanForm } from './components/LoanForm';
import { LoanSummaryCards } from './components/LoanSummaryCards';
import { LoanComparisonCard } from './components/LoanComparisonCard';
import { LoanChartDashboard } from './components/LoanChartDashboard';
import { LoanScheduleTable } from './components/LoanScheduleTable';
import { LoanInfoCard } from './components/LoanInfoCard';
import { siteConfig } from '../../config/site';
import { decodeLoanQuery, encodeLoanQuery, syncUrlQuery } from '../../utils/deepLink';

const DEFAULT_LOAN_INPUT: LoanInput = {
  loanAmount: 300_000_000, // 3억 원
  annualRate: 4.2,          // 4.2%
  loanTermYears: 30,        // 30년
  gracePeriodMonths: 0,     // 거치 없음
  repaymentMethod: 'equal_payment', // 원리금균등 기본
  earlyRepayment: {
    enabled: false,
    afterMonths: 24,
    amount: 30_000_000,
    feeRate: 1.2,
  },
};

const STORAGE_KEY = 'loan_calculator_input_v1';

export const LoanApp: React.FC = () => {
  const [input, setInput] = useLocalStorage<LoanInput>(STORAGE_KEY, DEFAULT_LOAN_INPUT);
  const isInitialMount = React.useRef(true);

  // 1. 초기 마운트 시 URL 쿼리 파라미터(딥링크)가 있으면 LocalStorage보다 최우선 복원
  useEffect(() => {
    document.title = siteConfig.getTitle('대출이자 계산기');

    if (typeof window !== 'undefined' && window.location.search) {
      const fromUrl = decodeLoanQuery(window.location.search);
      if (fromUrl) {
        setInput((prev) => ({
          ...prev,
          ...fromUrl,
        }));
      }
    }
  }, []);

  // 2. 사용자가 조건 변경 시 브라우저 주소창 URL 쿼리를 실시간 갱신 (기본값이면 정리)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const isDefault = JSON.stringify(input) === JSON.stringify(DEFAULT_LOAN_INPUT);
    syncUrlQuery(isDefault ? '' : encodeLoanQuery(input));
  }, [input]);

  const handleReset = () => {
    setInput(DEFAULT_LOAN_INPUT);
    syncUrlQuery('');
  };

  // 선택한 상환 방식 결과
  const currentResult = useMemo(() => {
    return calculateLoanRepayment(input);
  }, [input]);

  // 3대 상환방식 동시 비교 결과
  const comparisonSummary = useMemo(() => {
    return compareLoanMethods(input);
  }, [input]);

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      {/* 2컬럼 레이아웃: 좌측 폼 (5) / 우측 결과 및 시각화 (7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* 좌측 입력 폼 */}
        <div className="lg:col-span-5 w-full">
          <LoanForm
            input={input}
            onChange={setInput}
            onReset={handleReset}
          />
        </div>

        {/* 우측 결과 대시보드 */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5 w-full">
          {/* 1. 요약 카드 및 중도상환 순 절감 혜택 */}
          <LoanSummaryCards
            result={currentResult}
            loanAmount={input.loanAmount}
          />

          {/* 2. 3대 상환방식 동시 비교 배너 및 카드 */}
          <LoanComparisonCard
            comparison={comparisonSummary}
            activeMethod={input.repaymentMethod}
            onSelectMethod={(method) =>
              setInput({
                ...input,
                repaymentMethod: method,
              })
            }
          />

          {/* 3. 시각화 대시보드 (Recharts 차트) */}
          <LoanChartDashboard schedule={currentResult.schedule} />

          {/* 4. 월별 상세 상환 스케줄표 (CSV 다운로드) */}
          <LoanScheduleTable schedule={currentResult.schedule} />

          {/* 5. 대출 상식 및 유의사항 안내 카드 */}
          <LoanInfoCard />
        </div>
      </div>
    </div>
  );
};
