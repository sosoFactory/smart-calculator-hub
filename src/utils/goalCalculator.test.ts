import { describe, it, expect } from 'vitest';
import { calculateGoalTarget } from './goalCalculator';
import { DEFAULT_GOAL_INPUT, GoalInput } from '../types/goal';

describe('calculateGoalTarget Tests', () => {
  it('기본 시나리오(5억, 10년, 7%, 초기 1000만, 일반과세)를 올바르게 역산해야 한다', () => {
    const result = calculateGoalTarget(DEFAULT_GOAL_INPUT);

    expect(result.targetAmount).toBe(500_000_000);
    expect(result.targetYears).toBe(10);
    expect(result.totalMonths).toBe(120);

    // 5억 목표 시 필요 월 적립액이 200만~300만 원 사이로 합리적 산출되어야 함
    expect(result.monthlyContribution).toBeGreaterThan(2_000_000);
    expect(result.monthlyContribution).toBeLessThan(3_000_000);

    // 총 투입 원금 + 복리 이자 = 목표 금액에 근접
    expect(result.totalPrincipal + result.totalInterest).toBe(result.targetAmount);
    expect(result.interestRatio).toBeGreaterThan(20);

    // 10개년 breakdown 데이터 검증
    expect(result.breakdown).toHaveLength(10);
    expect(result.breakdown[9].totalAsset).toBe(500_000_000);
  });

  it('수익률이 0%인 경우 단순 나눗셈으로 월 적립금이 산출되어야 한다', () => {
    const input: GoalInput = {
      targetAmount: 120_000_000,
      targetYears: 10, // 120개월
      annualRate: 0,
      initialAmount: 0,
      taxType: 'exempt',
    };

    const result = calculateGoalTarget(input);
    expect(result.monthlyContribution).toBe(1_000_000); // 1억2천 / 120 = 100만원
    expect(result.totalPrincipal).toBe(120_000_000);
    expect(result.totalInterest).toBe(0);
    expect(result.interestRatio).toBe(0);
  });

  it('초기 목돈만으로 목표 자산을 초과 달성할 경우 월 적립액은 0원이어야 한다', () => {
    const input: GoalInput = {
      targetAmount: 100_000_000,
      targetYears: 10,
      annualRate: 10,
      initialAmount: 100_000_000, // 이미 1억 보유
      taxType: 'exempt',
    };

    const result = calculateGoalTarget(input);
    expect(result.monthlyContribution).toBe(0);
    expect(result.totalContribution).toBe(0);
  });

  it('비교 수익률 시나리오(3.5%, 7%, 10%)가 올바르게 산출되어야 한다', () => {
    const result = calculateGoalTarget(DEFAULT_GOAL_INPUT);
    expect(result.rateComparisons).toHaveLength(3);

    const [rate35, rate70, rate100] = result.rateComparisons;
    expect(rate35.rate).toBe(3.5);
    expect(rate70.rate).toBe(7.0);
    expect(rate100.rate).toBe(10.0);

    // 수익률이 높을수록 필요 월 적립액은 적어야 함
    expect(rate35.monthlyContribution).toBeGreaterThan(rate70.monthlyContribution);
    expect(rate70.monthlyContribution).toBeGreaterThan(rate100.monthlyContribution);
  });
});
