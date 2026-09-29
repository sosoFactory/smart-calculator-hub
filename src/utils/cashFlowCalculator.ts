import type { CashFlowInput, CashFlowCalculationResult, CashFlowTaxType, SensitivityItem } from '../types/cashFlow';

/**
 * 과세 방식별 세율 반환
 * - normal: 일반과세 15.4% (배당/이자 소득세 14% + 지방소득세 1.4%)
 * - isa: ISA 서민/일반 절세 9.9% (분리과세 9% + 지방소득세 0.9%)
 * - none: 비과세 0%
 */
export function getTaxRate(taxType: CashFlowTaxType): number {
  switch (taxType) {
    case 'normal':
      return 0.154;
    case 'isa':
      return 0.099;
    case 'none':
    default:
      return 0;
  }
}

/**
 * 파이어 현금흐름 및 필요 은퇴 자산(원금) 역산
 */
export function calculateCashFlow(input: CashFlowInput): CashFlowCalculationResult {
  const taxRate = getTaxRate(input.taxType);
  const taxRatePercent =
    input.taxType === 'normal' ? 15.4 : input.taxType === 'isa' ? 9.9 : 0;

  const monthlyNet = Math.max(0, Math.round(input.monthlyNetDesired || 0));
  const annualNet = monthlyNet * 12;

  const effectiveNetReturnRate = input.annualReturnRate * (1 - taxRate);

  if (monthlyNet === 0) {
    const sensitivityList: SensitivityItem[] = [2, 3, 4, 5, 6, 7, 8, 9, 10].map((rate) => ({
      rate,
      requiredCapital: 0,
      isCurrent: Math.abs(rate - input.annualReturnRate) < 0.05,
    }));

    return {
      monthlyNet: 0,
      annualNet: 0,
      monthlyGross: 0,
      annualGross: 0,
      monthlyTax: 0,
      annualTax: 0,
      taxRatePercent,
      effectiveNetReturnRate,
      requiredCapital: 0,
      isComprehensiveTaxWarning: false,
      sensitivityList,
    };
  }

  // 1 - taxRate 로 나누어 세전 필요 수익금 산출
  const divisor = 1 - taxRate;
  const annualGross = Math.round(annualNet / (divisor > 0 ? divisor : 1));
  const annualTax = Math.max(0, annualGross - annualNet);

  const monthlyGross = Math.round(annualGross / 12);
  const monthlyTax = Math.round(annualTax / 12);

  const rateDecimal = input.annualReturnRate / 100;
  const requiredCapital = rateDecimal > 0 ? Math.round(annualGross / rateDecimal) : 0;

  // 금융소득종합과세 기준: 연간 금융소득(이자/배당 세전 합산) 2,000만 원 초과
  const isComprehensiveTaxWarning = annualGross > 20_000_000;

  // 2% ~ 10% 민감도 분석
  const sensitivityRates = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  const sensitivityList: SensitivityItem[] = sensitivityRates.map((rate) => {
    const isCurrent = Math.abs(rate - input.annualReturnRate) < 0.05;
    const rDec = rate / 100;
    const cap = isCurrent ? requiredCapital : Math.round(annualGross / rDec);
    return {
      rate,
      requiredCapital: cap,
      isCurrent,
    };
  });

  return {
    monthlyNet,
    annualNet,
    monthlyGross,
    annualGross,
    monthlyTax,
    annualTax,
    taxRatePercent,
    effectiveNetReturnRate,
    requiredCapital,
    isComprehensiveTaxWarning,
    sensitivityList,
  };
}
