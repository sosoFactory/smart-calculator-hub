import React, { useState, useMemo, useEffect } from 'react';
import { ScenarioInput } from '../../types/calculator';
import { calculateCompoundInterest, compareScenarios } from '../../utils/calculator';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CalculatorForm } from '../../components/CalculatorForm';
import { SummaryCards } from '../../components/SummaryCards';
import { ChartDashboard } from '../../components/ChartDashboard';
import { ComparisonView } from '../../components/ComparisonView';
import { DataTable } from '../../components/DataTable';
import { CompoundInfoCard } from './components/CompoundInfoCard';
import { GitCompare } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { SegmentedControl, SegmentedOption } from '../../components/ui/segmented-control';
import { siteConfig } from '../../config/site';
import { decodeCompoundQuery, encodeCompoundQuery, syncUrlQuery } from '../../utils/deepLink';

const MOBILE_TAB_OPTIONS: SegmentedOption<'A' | 'B'>[] = [
  { id: 'A', label: '시나리오 A' },
  { id: 'B', label: '시나리오 B' },
];

const DEFAULT_SCENARIO_A: ScenarioInput = {
  name: '시나리오 A',
  principal: 10_000_000,
  regularContribution: 500_000,
  contributionFrequency: 'monthly',
  years: 10,
  annualRate: 7.0,
  compoundingFrequency: 'monthly',
  taxType: 'normal',
  customTaxRate: 15.4,
};

const DEFAULT_SCENARIO_B: ScenarioInput = {
  name: '시나리오 B',
  principal: 10_000_000,
  regularContribution: 500_000,
  contributionFrequency: 'monthly',
  years: 10,
  annualRate: 10.0,
  compoundingFrequency: 'monthly',
  taxType: 'isa',
  customTaxRate: 9.9,
};

interface CompoundInterestAppProps {
  onSetHeaderActions?: (actions: React.ReactNode) => void;
}

export const CompoundInterestApp: React.FC<CompoundInterestAppProps> = () => {
  const [isComparisonMode, setIsComparisonMode] = useLocalStorage<boolean>(
    'compound_calc_comparison_mode',
    false
  );

  const [scenarioA, setScenarioA] = useLocalStorage<ScenarioInput>(
    'compound_calc_scenario_a',
    DEFAULT_SCENARIO_A
  );

  const [scenarioB, setScenarioB] = useLocalStorage<ScenarioInput>(
    'compound_calc_scenario_b',
    DEFAULT_SCENARIO_B
  );

  const isInitialMount = React.useRef(true);

  // 1. 초기 마운트 시 URL 쿼리 파라미터(딥링크)가 있으면 LocalStorage보다 최우선 복원
  useEffect(() => {
    document.title = siteConfig.getTitle('연복리 & 자산성장 계산기');

    if (typeof window !== 'undefined' && window.location.search) {
      const fromUrl = decodeCompoundQuery(window.location.search);
      if (fromUrl) {
        setScenarioA((prev) => ({
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
    const isDefault = JSON.stringify(scenarioA) === JSON.stringify(DEFAULT_SCENARIO_A);
    syncUrlQuery(isDefault ? '' : encodeCompoundQuery(scenarioA));
  }, [scenarioA]);

  const [activeMobileTab, setActiveMobileTab] = useState<'A' | 'B'>('A');

  const resultA = useMemo(() => calculateCompoundInterest(scenarioA), [scenarioA]);
  const resultB = useMemo(() => calculateCompoundInterest(scenarioB), [scenarioB]);
  const comparison = useMemo(
    () => compareScenarios(scenarioA, scenarioB),
    [scenarioA, scenarioB]
  );

  const handleReset = () => {
    setScenarioA(DEFAULT_SCENARIO_A);
    setScenarioB(DEFAULT_SCENARIO_B);
    setIsComparisonMode(false);
    setActiveMobileTab('A');
    syncUrlQuery('');
  };

  const handleCopyAtoB = () => {
    setScenarioB({
      ...scenarioA,
      name: '시나리오 B',
    });
  };

  const handleCopyBtoA = () => {
    setScenarioA({
      ...scenarioB,
      name: '시나리오 A',
    });
  };

  return (
    <div className="space-y-6">
      {/* 서브 헤더 액션 바: 비교 모드 토글 */}
      <div className="flex items-center justify-between gap-2 pb-2">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsComparisonMode(!isComparisonMode)}
            className={`h-auto flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md border transition-colors ${
              isComparisonMode
                ? 'bg-[#15171a] hover:bg-[#2e3238] dark:bg-white dark:hover:bg-slate-100 text-white hover:text-white dark:text-[#112220] dark:hover:text-[#112220] border-[#15171a] dark:border-white'
                : 'bg-white dark:bg-slate-900 text-[#334155] dark:text-slate-300 border-[#e5e7eb] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <GitCompare className="w-4 h-4" />
            <span>비교 모드 (A/B)</span>
            <span
              className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-sm font-bold ${
                isComparisonMode ? 'bg-[#d1ff19] text-[#112220]' : 'bg-slate-100 dark:bg-slate-800 text-[#64748b] dark:text-slate-400'
              }`}
            >
              {isComparisonMode ? 'ON' : 'OFF'}
            </span>
          </Button>
        </div>
      </div>

      {/* 모바일 비교 모드 시 탭 네비게이션 */}
      {isComparisonMode && (
        <div className="lg:hidden">
          <SegmentedControl
            options={MOBILE_TAB_OPTIONS}
            value={activeMobileTab}
            onChange={setActiveMobileTab}
            variant="slate-solid"
            itemClassName="py-2 text-xs sm:text-sm font-bold"
          />
        </div>
      )}

      {/* 2열 반응형 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* 좌측: 입력 폼 영역 (lg: 5컬럼) */}
        <div className="lg:col-span-5 space-y-4 min-w-0">
          {!isComparisonMode && (
            <CalculatorForm
              scenario={scenarioA}
              onChange={setScenarioA}
              accentColor="teal"
              badgeTitle="기본 시나리오"
              onReset={handleReset}
            />
          )}

          {isComparisonMode && (
            <>
              <div className={`space-y-4 ${activeMobileTab === 'A' ? 'block' : 'hidden lg:block'}`}>
                <CalculatorForm
                  scenario={scenarioA}
                  onChange={setScenarioA}
                  accentColor="teal"
                  badgeTitle="시나리오 A (기준)"
                  onCopyFromOther={handleCopyBtoA}
                  copyButtonLabel="시나리오 B 조건 복사"
                  onReset={() => setScenarioA(DEFAULT_SCENARIO_A)}
                />
              </div>

              <div className={`space-y-4 ${activeMobileTab === 'B' ? 'block' : 'hidden lg:block'}`}>
                <CalculatorForm
                  scenario={scenarioB}
                  onChange={setScenarioB}
                  accentColor="indigo"
                  badgeTitle="시나리오 B (비교)"
                  onCopyFromOther={handleCopyAtoB}
                  copyButtonLabel="시나리오 A 조건 복사"
                  onReset={() => setScenarioB(DEFAULT_SCENARIO_B)}
                />
              </div>
            </>
          )}
        </div>

        {/* 우측: 시각화 대시보드 & 결과 영역 (lg: 7컬럼) */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5 min-w-0">
          {isComparisonMode && <ComparisonView comparison={comparison} />}

          {!isComparisonMode ? (
            <SummaryCards result={resultA} theme="teal" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SummaryCards result={resultA} title="시나리오 A" theme="teal" />
              <SummaryCards result={resultB} title="시나리오 B" theme="indigo" />
            </div>
          )}

          <ChartDashboard
            resultA={resultA}
            resultB={resultB}
            isComparisonMode={isComparisonMode}
            nameA={scenarioA.name}
            nameB={scenarioB.name}
          />

          <DataTable
            result={isComparisonMode && activeMobileTab === 'B' ? resultB : resultA}
            scenarioName={
              isComparisonMode && activeMobileTab === 'B' ? scenarioB.name : scenarioA.name
            }
          />

          <CompoundInfoCard />
        </div>
      </div>
    </div>
  );
};
