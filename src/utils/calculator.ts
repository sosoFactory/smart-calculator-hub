import type {
  CalculationResult,
  CompoundingFrequency,
  ScenarioComparison,
  ScenarioInput,
  TaxType,
  YearlyBreakdown,
} from '../types/calculator.ts';

/**
 * 과세 유형별 실효 세율 반환
 */
export function getTaxRate(taxType: TaxType): number {
  switch (taxType) {
    case 'normal':
      return 0.154; // 이자소득세 14% + 지방소득세 1.4%
    case 'isa':
      return 0.099; // 9.9% 분리과세
    case 'exempt':
      return 0.0;
    default:
      return 0.154;
  }
}

/**
 * 복리 주기에 따른 월간 실효 이자율 산출
 * @param annualRate 연 수익률 (%)
 * @param freq 복리 주기
 */
export function getMonthlyEffectiveRate(annualRate: number, freq: CompoundingFrequency): number {
  const r = annualRate / 100;
  if (r === 0) return 0;
  if (r <= -1) return -1; // 원금 100% 손실 방어

  switch (freq) {
    case 'monthly':
      // 연 12회 복리: 월 이율 = r / 12
      return r / 12;
    case 'annual':
      // 연 1회 복리: (1 + r)^(1/12) - 1
      return Math.pow(1 + r, 1 / 12) - 1;
    case 'quarterly':
      // 분기 복리: (1 + r/4)^(4/12) - 1
      return Math.pow(1 + r / 4, 4 / 12) - 1;
    case 'daily':
      // 일 복리: (1 + r/365)^(365/12) - 1
      return Math.pow(1 + r / 365, 365 / 12) - 1;
    default:
      return r / 12;
  }
}

/**
 * 복리 계산 및 연도별 자산 성장 시뮬레이션
 */
export function calculateCompoundInterest(input: ScenarioInput): CalculationResult {
  const rawPrincipal = Number.isFinite(input.principal) ? (input.principal ?? 0) : 0;
  const rawContribution = Number.isFinite(input.regularContribution) ? (input.regularContribution ?? 0) : 0;
  const rawYears = Number.isFinite(input.years) ? (input.years ?? 10) : 10;
  const rawAnnualRate = Number.isFinite(input.annualRate) ? (input.annualRate ?? 7) : 7;

  const {
    contributionFrequency = 'monthly',
    compoundingFrequency = 'monthly',
    taxType = 'normal',
  } = input;

  const validYears = Math.max(1, Math.min(50, Math.round(rawYears)));
  const monthlyRate = getMonthlyEffectiveRate(rawAnnualRate, compoundingFrequency);
  const taxRate = getTaxRate(taxType);

  let currentBalance = Math.max(0, rawPrincipal);
  let accumulatedPrincipal = Math.max(0, rawPrincipal);
  const regularContribution = Math.max(0, rawContribution);

  const breakdown: YearlyBreakdown[] = [];
  let previousCumulativeGrossInterest = 0;

  const totalMonths = validYears * 12;

  for (let m = 1; m <= totalMonths; m++) {
    // 1. 월초 적립금 투입
    if (contributionFrequency === 'monthly' && regularContribution > 0) {
      currentBalance += regularContribution;
      accumulatedPrincipal += regularContribution;
    } else if (contributionFrequency === 'annual' && regularContribution > 0) {
      // 매년 첫 달(1, 13, 25...)에 연 적립금 투입
      if ((m - 1) % 12 === 0) {
        currentBalance += regularContribution;
        accumulatedPrincipal += regularContribution;
      }
    }

    // 2. 월간 복리/감가 적용 (음수 이율 지원)
    if (monthlyRate !== 0) {
      currentBalance = Math.max(0, currentBalance * (1 + monthlyRate));
    }

    // 3. 1년 주기(12개월) 스냅샷 기록
    if (m % 12 === 0) {
      const year = m / 12;
      const preTaxBalance = Math.round(currentBalance);
      const curPrincipal = Math.round(accumulatedPrincipal);
      const grossInterestTotal = preTaxBalance - curPrincipal;
      const grossInterestYear = grossInterestTotal - previousCumulativeGrossInterest;
      previousCumulativeGrossInterest = grossInterestTotal;

      // 손실 발생 시 소득세는 0원
      const taxAmount = grossInterestTotal > 0 ? Math.round(grossInterestTotal * taxRate) : 0;
      const netInterestTotal = grossInterestTotal - taxAmount;
      const postTaxBalance = Math.max(0, curPrincipal + netInterestTotal);

      const returnRate = curPrincipal > 0 ? (netInterestTotal / curPrincipal) * 100 : 0;

      breakdown.push({
        year,
        totalPrincipal: curPrincipal,
        grossInterestYear,
        grossInterestTotal,
        taxAmount,
        netInterestTotal,
        futureValuePreTax: preTaxBalance,
        futureValuePostTax: postTaxBalance,
        returnRate,
      });
    }
  }

  const finalYear = breakdown[breakdown.length - 1] ?? {
    totalPrincipal: accumulatedPrincipal,
    grossInterestTotal: 0,
    taxAmount: 0,
    netInterestTotal: 0,
    futureValuePreTax: accumulatedPrincipal,
    futureValuePostTax: accumulatedPrincipal,
    returnRate: 0,
  };

  const principalMultiple =
    finalYear.totalPrincipal > 0
      ? finalYear.futureValuePostTax / finalYear.totalPrincipal
      : 1.0;

  return {
    totalPrincipal: finalYear.totalPrincipal,
    grossInterest: finalYear.grossInterestTotal,
    taxAmount: finalYear.taxAmount,
    netInterest: finalYear.netInterestTotal,
    futureValuePreTax: finalYear.futureValuePreTax,
    futureValuePostTax: finalYear.futureValuePostTax,
    netReturnRate: finalYear.returnRate,
    principalMultiple,
    breakdown,
  };
}

/**
 * 두 시나리오(A, B) 간의 비교 데이터 산출
 */
export function compareScenarios(
  scenarioA: ScenarioInput,
  scenarioB: ScenarioInput
): ScenarioComparison {
  const resultA = calculateCompoundInterest(scenarioA);
  const resultB = calculateCompoundInterest(scenarioB);

  return {
    scenarioA,
    scenarioB,
    resultA,
    resultB,
    diffPrincipal: resultB.totalPrincipal - resultA.totalPrincipal,
    diffPostTax: resultB.futureValuePostTax - resultA.futureValuePostTax,
    diffNetInterest: resultB.netInterest - resultA.netInterest,
    diffReturnRate: resultB.netReturnRate - resultA.netReturnRate,
  };
}
