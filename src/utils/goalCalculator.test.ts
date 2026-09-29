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

    // 10개년 breakdown 데이터 검증 및 3단 스택 무결성 검증
    expect(result.breakdown).toHaveLength(10);
    expect(result.breakdown[9].totalAsset).toBe(500_000_000);
    result.breakdown.forEach((item) => {
      expect(item.initialValue).toBe(DEFAULT_GOAL_INPUT.initialAmount);
      expect(item.initialValue + item.accumulatedContribution + item.accumulatedInterest).toBe(
        item.totalAsset
      );
    });
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

  it('초기 목돈만으로 목표 자산을 초과 달성할 경우 월 적립액 0원 및 조기 달성과 안전 인출액이 산출되어야 한다', () => {
    // 사용자가 제시한 시나리오: 5억 목표, 10년, 15%, 초기 2억, ISA 9.9%
    const input: GoalInput = {
      targetAmount: 500_000_000,
      targetYears: 10,
      annualRate: 15.0,
      initialAmount: 200_000_000,
      taxType: 'isa',
    };

    const result = calculateGoalTarget(input);
    expect(result.monthlyContribution).toBe(0);
    expect(result.totalContribution).toBe(0);

    // 조기 달성 객체 검증
    expect(result.earlyAchievement).toBeDefined();
    expect(result.earlyAchievement?.isEarlyAchieved).toBe(true);
    // 2억이 5억 도달까지 약 82개월(6년 10개월) 소요
    expect(result.earlyAchievement?.reachMonths).toBeGreaterThan(70);
    expect(result.earlyAchievement?.reachMonths).toBeLessThan(90);
    expect(result.earlyAchievement?.reachYearsText).toMatch(/\d+년/);
    expect(result.earlyAchievement?.savedYearsText).toMatch(/\d+년/);

    // 매월 안전 인출 가능액이 합리적으로 산출되어야 함 (약 100만원~150만원 사이)
    expect(result.earlyAchievement?.safeMonthlyWithdrawal).toBeGreaterThan(1_000_000);
    expect(result.earlyAchievement?.safeMonthlyWithdrawal).toBeLessThan(1_600_000);

    // 10년차 최종 자산이 5억으로 강제 꺾이지 않고 7억 이상으로 온전히 유지되어야 함
    expect(result.breakdown[9].totalAsset).toBeGreaterThan(700_000_000);
    expect(result.breakdown[8].totalAsset).toBeLessThan(result.breakdown[9].totalAsset); // 9년차보다 10년차가 우상향!
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
