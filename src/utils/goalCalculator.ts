import { GoalInput, GoalCalculationResult, GoalTaxType } from '../types/goal';

/**
 * 과세 방식별 세율 매핑 상수 (일반과세 15.4%, ISA 9.9%, 비과세 0%)
 */
const TAX_RATES: Record<GoalTaxType, number> = {
  normal: 0.154,
  isa: 0.099,
  exempt: 0,
};

/**
 * 목표 잔여액과 실효 월이율을 기반으로 월초 적립 기준 필요 월납입액(PMT)을 산출하는 단일 수식 헬퍼 함수
 *
 * 공식: FV = PMT * (1 + r) * ((1 + r)^n - 1) / r
 * => PMT = FV * r / [ (1 + r) * ((1 + r)^n - 1) ]
 *
 * @param remainingTarget 초기 거치금 미래가치를 제외한 순수 필요 적립 목표액
 * @param totalMonths 총 적립 개월 수
 * @param netMonthlyRate 세후 실효 월이자율
 */
export function calculatePMT(
  remainingTarget: number,
  totalMonths: number,
  netMonthlyRate: number
): number {
  if (remainingTarget <= 0) return 0;
  if (totalMonths <= 0) return 0;

  if (netMonthlyRate <= 0) {
    return Math.ceil(remainingTarget / totalMonths);
  }

  const numerator = remainingTarget * netMonthlyRate;
  const denominator =
    (1 + netMonthlyRate) * (Math.pow(1 + netMonthlyRate, totalMonths) - 1);

  return denominator > 0
    ? Math.ceil(numerator / denominator)
    : Math.ceil(remainingTarget / totalMonths);
}

/**
 * 목표 자산 역산 계산기 핵심 비즈니스 로직 (Financial PMT Formula)
 * 원하는 목표 금액과 기간, 수익률을 입력하면 매월 얼마씩 적립해야 하는지 정확히 역산합니다.
 */
export function calculateGoalTarget(input: GoalInput): GoalCalculationResult {
  const { targetAmount, targetYears, annualRate, initialAmount, taxType } = input;
  const totalMonths = Math.max(1, targetYears * 12);
  const taxRate = TAX_RATES[taxType] ?? 0.154;

  // 세금을 반영한 실효 월 이자율 (세후 기준)
  const grossMonthlyRate = annualRate / 100 / 12;
  const netMonthlyRate =
    grossMonthlyRate > 0 ? grossMonthlyRate * (1 - taxRate) : grossMonthlyRate;

  // 1. 초기 자금(거치금)이 N년(totalMonths) 후 불어나는 미래 가치 (세후 복리)
  let initialFutureValue = initialAmount;
  if (initialAmount > 0 && netMonthlyRate > 0) {
    initialFutureValue =
      initialAmount * Math.pow(1 + netMonthlyRate, totalMonths);
  }

  // 2. 월 적립금으로 달성해야 하는 잔여 목표액
  const remainingTarget = Math.max(0, targetAmount - initialFutureValue);

  // 3. 필요 월 적립액 (단일 PMT 헬퍼 호출)
  const monthlyContribution = calculatePMT(
    remainingTarget,
    totalMonths,
    netMonthlyRate
  );

  const totalContribution = monthlyContribution * totalMonths;
  const totalPrincipal = initialAmount + totalContribution;
  const totalInterest = Math.max(0, targetAmount - totalPrincipal);
  const interestRatio =
    targetAmount > 0
      ? Number(((totalInterest / targetAmount) * 100).toFixed(1))
      : 0;

  // 4. 연도별 자산 형성 흐름표 (Breakdown)
  const breakdown = [];
  for (let year = 1; year <= targetYears; year++) {
    const months = year * 12;
    let initialVal = initialAmount;
    let accumContrib = monthlyContribution * months;
    let contribFV = 0;

    if (netMonthlyRate <= 0) {
      initialVal = initialAmount;
      contribFV = accumContrib;
    } else {
      initialVal = initialAmount * Math.pow(1 + netMonthlyRate, months);
      contribFV =
        (monthlyContribution *
          (1 + netMonthlyRate) *
          (Math.pow(1 + netMonthlyRate, months) - 1)) /
        netMonthlyRate;
    }

    const totalAsset = Math.round(initialVal + contribFV);
    const accumPrincipal = initialAmount + accumContrib;
    const accumInterest = Math.max(0, totalAsset - accumPrincipal);

    breakdown.push({
      year,
      initialValue: Math.round(initialVal),
      accumulatedContribution: Math.round(accumContrib),
      accumulatedInterest: Math.round(accumInterest),
      totalAsset: year === targetYears ? targetAmount : totalAsset,
    });
  }

  // 5. 대표 수익률 시나리오 대조 (예적금 3.5%, 인덱스 7.0%, 적극 10.0%)
  const benchmarkRates = [3.5, 7.0, 10.0];
  const rateComparisons = benchmarkRates.map((rate) => {
    if (rate === annualRate) {
      return {
        rate,
        monthlyContribution,
        totalPrincipal,
        totalInterest,
        diffVsTarget: 0,
      };
    }

    const compResult = calculateGoalTargetInternal({
      targetAmount,
      targetYears,
      annualRate: rate,
      initialAmount,
      taxRate,
    });
    return {
      rate,
      monthlyContribution: compResult.monthlyContribution,
      totalPrincipal: compResult.totalPrincipal,
      totalInterest: compResult.totalInterest,
      diffVsTarget: compResult.monthlyContribution - monthlyContribution,
    };
  });

  return {
    targetAmount,
    targetYears,
    annualRate,
    initialAmount,
    monthlyContribution,
    totalMonths,
    totalContribution,
    totalPrincipal,
    totalInterest,
    interestRatio,
    breakdown,
    rateComparisons,
  };
}

/**
 * 벤치마크 수익률 비교 연산을 위한 내부 목표 역산 계산 함수
 */
function calculateGoalTargetInternal(params: {
  targetAmount: number;
  targetYears: number;
  annualRate: number;
  initialAmount: number;
  taxRate: number;
}) {
  const { targetAmount, targetYears, annualRate, initialAmount, taxRate } = params;
  const totalMonths = Math.max(1, targetYears * 12);
  const grossMonthlyRate = annualRate / 100 / 12;
  const netMonthlyRate =
    grossMonthlyRate > 0 ? grossMonthlyRate * (1 - taxRate) : grossMonthlyRate;

  let initialFutureValue = initialAmount;
  if (initialAmount > 0 && netMonthlyRate > 0) {
    initialFutureValue =
      initialAmount * Math.pow(1 + netMonthlyRate, totalMonths);
  }

  const remainingTarget = Math.max(0, targetAmount - initialFutureValue);
  const monthlyContribution = calculatePMT(
    remainingTarget,
    totalMonths,
    netMonthlyRate
  );

  const totalContribution = monthlyContribution * totalMonths;
  const totalPrincipal = initialAmount + totalContribution;
  const totalInterest = Math.max(0, targetAmount - totalPrincipal);

  return {
    monthlyContribution,
    totalPrincipal,
    totalInterest,
  };
}
