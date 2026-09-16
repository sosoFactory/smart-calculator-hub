import { GoalInput, GoalCalculationResult, GoalTaxType } from '../types/goal';

const TAX_RATES: Record<GoalTaxType, number> = {
  normal: 0.154,
  isa: 0.099,
  exempt: 0,
};

/**
 * 목표 자산 역산 계산기 핵심 비즈니스 로직 (Financial PMT Formula)
 */
export function calculateGoalTarget(input: GoalInput): GoalCalculationResult {
  const { targetAmount, targetYears, annualRate, initialAmount, taxType } = input;
  const totalMonths = Math.max(1, targetYears * 12);
  const taxRate = TAX_RATES[taxType] ?? 0.154;

  // 세금을 반영한 실효 월 이자율 (세후 기준)
  const grossMonthlyRate = annualRate / 100 / 12;
  const netMonthlyRate = grossMonthlyRate > 0 ? grossMonthlyRate * (1 - taxRate) : grossMonthlyRate;

  // 1. 초기 자금(거치금)이 N년(totalMonths) 후 불어나는 미래 가치 (세후 복리)
  let initialFutureValue = initialAmount;
  if (initialAmount > 0) {
    if (netMonthlyRate === 0) {
      initialFutureValue = initialAmount;
    } else {
      initialFutureValue = initialAmount * Math.pow(1 + netMonthlyRate, totalMonths);
    }
  }

  // 2. 월 적립금으로 달성해야 하는 잔여 목표액
  const remainingTarget = Math.max(0, targetAmount - initialFutureValue);

  // 3. 필요 월 적립액 (PMT 공식 - 월초 적립 기준)
  let monthlyContribution = 0;
  if (remainingTarget > 0) {
    if (netMonthlyRate === 0) {
      monthlyContribution = Math.ceil(remainingTarget / totalMonths);
    } else if (netMonthlyRate > 0) {
      // 월초 적립 공식: FV = PMT * (1 + r) * ((1 + r)^n - 1) / r
      // => PMT = FV * r / [ (1 + r) * ((1 + r)^n - 1) ]
      const numerator = remainingTarget * netMonthlyRate;
      const denominator = (1 + netMonthlyRate) * (Math.pow(1 + netMonthlyRate, totalMonths) - 1);
      monthlyContribution = denominator > 0 ? Math.ceil(numerator / denominator) : Math.ceil(remainingTarget / totalMonths);
    } else {
      // 음수 수익률(하락장)
      const numerator = remainingTarget * Math.abs(netMonthlyRate);
      const denominator = (1 + netMonthlyRate) * (1 - Math.pow(1 + netMonthlyRate, totalMonths));
      monthlyContribution = denominator > 0 ? Math.ceil(numerator / denominator) : Math.ceil(remainingTarget / totalMonths);
    }
  }

  const totalContribution = monthlyContribution * totalMonths;
  const totalPrincipal = initialAmount + totalContribution;
  const totalInterest = Math.max(0, targetAmount - totalPrincipal);
  const interestRatio = targetAmount > 0 ? Number(((totalInterest / targetAmount) * 100).toFixed(1)) : 0;

  // 4. 연도별 자산 형성 흐름표 (Breakdown)
  const breakdown = [];
  for (let year = 1; year <= targetYears; year++) {
    const months = year * 12;
    let initialVal = initialAmount;
    let accumContrib = monthlyContribution * months;
    let contribFV = 0;

    if (netMonthlyRate === 0) {
      initialVal = initialAmount;
      contribFV = accumContrib;
    } else {
      initialVal = initialAmount * Math.pow(1 + netMonthlyRate, months);
      contribFV = monthlyContribution * (1 + netMonthlyRate) * (Math.pow(1 + netMonthlyRate, months) - 1) / netMonthlyRate;
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

    const compResult = calculateGoalTargetInternal(targetAmount, targetYears, rate, initialAmount, taxRate);
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

function calculateGoalTargetInternal(
  targetAmount: number,
  targetYears: number,
  annualRate: number,
  initialAmount: number,
  taxRate: number
) {
  const totalMonths = Math.max(1, targetYears * 12);
  const grossMonthlyRate = annualRate / 100 / 12;
  const netMonthlyRate = grossMonthlyRate > 0 ? grossMonthlyRate * (1 - taxRate) : grossMonthlyRate;

  let initialFutureValue = initialAmount;
  if (initialAmount > 0 && netMonthlyRate !== 0) {
    initialFutureValue = initialAmount * Math.pow(1 + netMonthlyRate, totalMonths);
  }

  const remainingTarget = Math.max(0, targetAmount - initialFutureValue);
  let monthlyContribution = 0;

  if (remainingTarget > 0) {
    if (netMonthlyRate === 0) {
      monthlyContribution = Math.ceil(remainingTarget / totalMonths);
    } else {
      const numerator = remainingTarget * netMonthlyRate;
      const denominator = (1 + netMonthlyRate) * (Math.pow(1 + netMonthlyRate, totalMonths) - 1);
      monthlyContribution = denominator > 0 ? Math.ceil(numerator / denominator) : Math.ceil(remainingTarget / totalMonths);
    }
  }

  const totalContribution = monthlyContribution * totalMonths;
  const totalPrincipal = initialAmount + totalContribution;
  const totalInterest = Math.max(0, targetAmount - totalPrincipal);

  return {
    monthlyContribution,
    totalPrincipal,
    totalInterest,
  };
}
