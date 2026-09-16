export type GoalTaxType = 'normal' | 'exempt' | 'isa';

export interface GoalInput {
  targetAmount: number;        // 목표 자산 (원, 1,000만 ~ 100억)
  targetYears: number;         // 달성 목표 기간 (년, 1 ~ 40)
  annualRate: number;          // 예상 연 수익률 (%, 0 ~ 30)
  initialAmount: number;       // 현재 보유 초기 자금 (원, 0 ~ 목표 자산)
  taxType: GoalTaxType;        // 과세 유형 (일반 15.4%, ISA 9.9%, 비과세 0%)
}

export interface GoalYearlyBreakdown {
  year: number;                // 경과 연차
  initialValue: number;        // 초기 자금 미래 가치
  accumulatedContribution: number; // 누적 월 적립 원금
  accumulatedInterest: number; // 누적 복리 수익
  totalAsset: number;          // 총 평가 자산
}

export interface RateComparisonItem {
  rate: number;                // 비교 연 수익률 (%)
  monthlyContribution: number; // 필요 월 적립액 (원)
  totalPrincipal: number;      // 총 납입 원금 (원)
  totalInterest: number;       // 총 복리 수익 (원)
  diffVsTarget: number;        // 기준 시나리오 대비 월 적립액 차이 (원)
}

export interface GoalCalculationResult {
  targetAmount: number;        // 목표 자산
  targetYears: number;         // 목표 기간 (년)
  annualRate: number;          // 적용 연 수익률 (%)
  initialAmount: number;       // 초기 자금
  monthlyContribution: number; // 필요 월 적립액 (원)
  totalMonths: number;         // 총 투자 개월 수
  totalContribution: number;   // 총 월 적립 원금 (monthlyContribution * totalMonths)
  totalPrincipal: number;      // 총 투입 원금 (initialAmount + totalContribution)
  totalInterest: number;       // 예상 복리 이자 (targetAmount - totalPrincipal)
  interestRatio: number;       // 전체 목표 중 복리 수익 비중 (%)
  breakdown: GoalYearlyBreakdown[]; // 연도별 자산 형성 흐름표
  rateComparisons: RateComparisonItem[]; // 대표 수익률 시나리오 대조 (3.5%, 7%, 10%)
}

export const DEFAULT_GOAL_INPUT: GoalInput = {
  targetAmount: 500_000_000,   // 기본 5억 원
  targetYears: 10,             // 기본 10년
  annualRate: 7.0,             // 기본 연 7%
  initialAmount: 10_000_000,   // 기본 초기 1,000만 원
  taxType: 'normal',           // 기본 일반과세(15.4%)
};
