export type CashFlowTaxType = 'normal' | 'isa' | 'none';

export interface CashFlowInput {
  monthlyNetDesired: number;   // 목표 월 세후 실수령액 (원)
  annualReturnRate: number;    // 예상 연 수익률/배당률 (%, 1.0 ~ 20.0)
  taxType: CashFlowTaxType;    // 과세 체계: 일반과세(15.4%) | ISA(9.9%) | 비과세(0%)
}

export const DEFAULT_CASH_FLOW_INPUT: CashFlowInput = {
  monthlyNetDesired: 3_000_000,
  annualReturnRate: 4.0,
  taxType: 'normal',
};

export interface SensitivityItem {
  rate: number;                // 수익률 (%)
  requiredCapital: number;     // 해당 수익률에서의 필요 원금 (원)
  isCurrent: boolean;          // 현재 선택된 수익률 여부
}

export interface CashFlowCalculationResult {
  monthlyNet: number;          // 월 세후 실수령액
  annualNet: number;           // 연 세후 실수령액
  monthlyGross: number;        // 월 세전 필요 수익금
  annualGross: number;         // 연 세전 필요 수익금
  monthlyTax: number;          // 월 예상 세금
  annualTax: number;           // 연 예상 세금
  taxRatePercent: number;      // 적용 세율 (15.4, 9.9, 0)
  effectiveNetReturnRate: number; // 세후 실효 연 수익률 (%)
  requiredCapital: number;     // 필요 총 은퇴 원금 (원)
  isComprehensiveTaxWarning: boolean; // 연 세전 2,000만원 초과 여부
  sensitivityList: SensitivityItem[]; // 2% ~ 10% 민감도 분석 리스트
}
