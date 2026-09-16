export type TaxType = 'normal' | 'exempt' | 'isa';

export type CompoundingFrequency = 'annual' | 'quarterly' | 'monthly' | 'daily';

export type ContributionFrequency = 'monthly' | 'annual' | 'none';

export interface ScenarioInput {
  name: string;
  principal: number; // 초기 원금 (원)
  regularContribution: number; // 정기 납입액 (원)
  contributionFrequency: ContributionFrequency; // 납입 주기
  years: number; // 투자 기간 (년)
  annualRate: number; // 연 수익률 (%)
  compoundingFrequency: CompoundingFrequency; // 복리 주기
  taxType: TaxType; // 과세 유형
  customTaxRate?: number; // (하위 호환용 선택 필드)
}

export interface YearlyBreakdown {
  year: number;
  totalPrincipal: number; // 누적 원금
  grossInterestYear: number; // 해당 연도 세전 이자
  grossInterestTotal: number; // 누적 세전 이자
  taxAmount: number; // 누적 소득세
  netInterestTotal: number; // 누적 세후 이자
  futureValuePreTax: number; // 세전 총 자산
  futureValuePostTax: number; // 세후 총 자산
  returnRate: number; // 원금 대비 세후 수익률 (%)
}

export interface CalculationResult {
  totalPrincipal: number; // 총 납입 원금
  grossInterest: number; // 세전 총 이자
  taxAmount: number; // 총 이자 과세액
  netInterest: number; // 세후 총 이자
  futureValuePreTax: number; // 세전 최종 금액
  futureValuePostTax: number; // 세후 최종 수령액
  netReturnRate: number; // 세후 원금 대비 수익률 (%)
  principalMultiple: number; // 원금 대비 배수 (예: 2.1배)
  breakdown: YearlyBreakdown[]; // 연도별 데이터
}

export interface ScenarioComparison {
  scenarioA: ScenarioInput;
  scenarioB: ScenarioInput;
  resultA: CalculationResult;
  resultB: CalculationResult;
  diffPrincipal: number; // B - A 원금 차이
  diffPostTax: number; // B - A 최종 수령액 차이
  diffNetInterest: number; // B - A 세후 이자 차이
  diffReturnRate: number; // B - A 수익률 차이
}
