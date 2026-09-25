import React, { useEffect, useMemo } from 'react';
import { PartTimeInput, MINIMUM_WAGE_2026 } from '../../types/partTime';
import { calculatePartTimeWage } from '../../utils/partTimeCalculator';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { PartTimeForm } from './components/PartTimeForm';
import { PartTimeSummaryCards } from './components/PartTimeSummaryCards';
import { PartTimeChartDashboard } from './components/PartTimeChartDashboard';
import { PartTimeTable } from './components/PartTimeTable';
import { PartTimeInfoCard } from './components/PartTimeInfoCard';
import { siteConfig } from '../../config/site';
import { decodePartTimeQuery, encodePartTimeQuery, syncUrlQuery } from '../../utils/deepLink';

const DEFAULT_PART_TIME_INPUT: PartTimeInput = {
  hourlyWage: MINIMUM_WAGE_2026,
  weeklyWorkHours: 20,
  taxType: 'none',
  isOver5Employees: false,
  weeklyOvertimeHours: 0,
  weeklyNightHours: 0,
  weeklyHolidayWorkHours: 0,
};

const STORAGE_KEY = 'part_time_calculator_input_v1';

export const PartTimeApp: React.FC = () => {
  const [input, setInput] = useLocalStorage<PartTimeInput>(
    STORAGE_KEY,
    DEFAULT_PART_TIME_INPUT
  );

  const isInitialMount = React.useRef(true);

  // 1. 초기 마운트 시 URL 쿼리 파라미터(딥링크)가 있으면 LocalStorage보다 최우선 복원
  useEffect(() => {
    document.title = siteConfig.getTitle('알바 급여 & 주휴수당 계산기');

    if (typeof window !== 'undefined' && window.location.search) {
      const fromUrl = decodePartTimeQuery(window.location.search);
      if (fromUrl) {
        setInput((prev) => ({
          ...prev,
          ...fromUrl,
        }));
      }
    }
  }, []);

  // 2. 조건 변경 시 브라우저 주소창 URL 쿼리를 실시간 갱신 (기본값이면 정리)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const isDefault = JSON.stringify(input) === JSON.stringify(DEFAULT_PART_TIME_INPUT);
    syncUrlQuery(isDefault ? '' : encodePartTimeQuery(input));
  }, [input]);

  const handleReset = () => {
    setInput(DEFAULT_PART_TIME_INPUT);
    syncUrlQuery('');
  };

  const result = useMemo(() => {
    return calculatePartTimeWage(input);
  }, [input]);

  return (
    <div className="space-y-4 sm:space-y-6 w-full animate-page-fade">
      {/* 2컬럼 레이아웃: 좌측 폼 (5) / 우측 결과 및 시각화 (7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* 좌측 입력 폼 */}
        <div className="lg:col-span-5 w-full min-w-0">
          <PartTimeForm
            input={input}
            onChange={setInput}
            onReset={handleReset}
          />
        </div>

        {/* 우측 결과 대시보드 */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5 w-full min-w-0">
          {/* 1. 예상 실수령액 메인 카드 및 실질시급/3단 서브 요약 지표 */}
          <PartTimeSummaryCards input={input} result={result} />

          {/* 2. 시각화 대시보드 (급여 구성 및 실수령 도넛 차트) */}
          <PartTimeChartDashboard result={result} />

          {/* 3. 급여 및 유급시간 세부 명세표 (CSV 다운로드 지원) */}
          <PartTimeTable input={input} result={result} />

          {/* 4. 근로기준법 및 주휴수당 상식 안내 카드 */}
          <PartTimeInfoCard />
        </div>
      </div>
    </div>
  );
};

export default PartTimeApp;
