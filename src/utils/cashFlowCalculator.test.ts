import { describe, it, expect } from 'vitest';
import { calculateCashFlow, getTaxRate } from './cashFlowCalculator';
import type { CashFlowInput } from '../types/cashFlow';

describe('cashFlowCalculator', () => {
  describe('getTaxRate', () => {
    it('returns correct tax rate for each tax type', () => {
      expect(getTaxRate('normal')).toBe(0.154);
      expect(getTaxRate('isa')).toBe(0.099);
      expect(getTaxRate('none')).toBe(0);
    });
  });

  describe('calculateCashFlow', () => {
    it('calculates standard FIRE 4% rule with normal tax (15.4%)', () => {
      const input: CashFlowInput = {
        monthlyNetDesired: 3_000_000,
        annualReturnRate: 4.0,
        taxType: 'normal',
      };

      const result = calculateCashFlow(input);

      // 연간 세후 실수령액: 300만 * 12 = 3,600만
      expect(result.monthlyNet).toBe(3_000_000);
      expect(result.annualNet).toBe(36_000_000);

      // 세전 필요 수익금: 36,000,000 / (1 - 0.154) = 42,553,191.489... -> 42,553,191
      expect(result.annualGross).toBe(42_553_191);
      expect(result.annualTax).toBe(6_553_191);

      // 월 환산
      expect(result.monthlyGross).toBe(Math.round(42_553_191 / 12));
      expect(result.monthlyTax).toBe(Math.round(6_553_191 / 12));

      // 필요 총 원금: annualGross / 0.04 = 42,553,191 / 0.04 = 1,063,829,775
      expect(result.requiredCapital).toBe(1_063_829_775);

      // 실효 연 수익률: 4.0 * (1 - 0.154) = 3.384%
      expect(result.effectiveNetReturnRate).toBeCloseTo(3.384, 2);
      expect(result.taxRatePercent).toBe(15.4);

      // 2,000만원 초과 시 종합과세 안내 활성화
      expect(result.isComprehensiveTaxWarning).toBe(true);
    });

    it('calculates tax-exempt scenario correctly', () => {
      const input: CashFlowInput = {
        monthlyNetDesired: 2_000_000,
        annualReturnRate: 5.0,
        taxType: 'none',
      };

      const result = calculateCashFlow(input);

      expect(result.monthlyNet).toBe(2_000_000);
      expect(result.annualNet).toBe(24_000_000);
      expect(result.annualGross).toBe(24_000_000);
      expect(result.annualTax).toBe(0);
      expect(result.monthlyTax).toBe(0);
      expect(result.requiredCapital).toBe(480_000_000); // 2,400만 / 0.05
      expect(result.effectiveNetReturnRate).toBe(5.0);
      expect(result.taxRatePercent).toBe(0);
      expect(result.isComprehensiveTaxWarning).toBe(true); // 2,400만 > 2,000만
    });

    it('calculates ISA tax (9.9%) and disables comprehensive tax warning when gross <= 20M', () => {
      const input: CashFlowInput = {
        monthlyNetDesired: 1_000_000,
        annualReturnRate: 4.0,
        taxType: 'isa',
      };

      const result = calculateCashFlow(input);

      expect(result.annualNet).toBe(12_000_000);
      // 12,000,000 / (1 - 0.099) = 13,318,534.96... -> 13,318,535
      expect(result.annualGross).toBe(13_318_535);
      expect(result.annualTax).toBe(1_318_535);
      expect(result.taxRatePercent).toBe(9.9);
      expect(result.effectiveNetReturnRate).toBeCloseTo(3.604, 2);
      expect(result.isComprehensiveTaxWarning).toBe(false); // 13,318,535 <= 20,000,000
    });

    it('generates 2% to 10% sensitivity analysis list with isCurrent flag', () => {
      const input: CashFlowInput = {
        monthlyNetDesired: 3_000_000,
        annualReturnRate: 4.0,
        taxType: 'normal',
      };

      const result = calculateCashFlow(input);

      expect(result.sensitivityList).toHaveLength(9);
      expect(result.sensitivityList[0].rate).toBe(2);
      expect(result.sensitivityList[0].isCurrent).toBe(false);

      const currentItem = result.sensitivityList.find((item) => item.rate === 4);
      expect(currentItem).toBeDefined();
      expect(currentItem?.isCurrent).toBe(true);
      expect(currentItem?.requiredCapital).toBe(result.requiredCapital);

      // 높은 수익률일수록 필요 원금은 적어짐
      expect(result.sensitivityList[0].requiredCapital).toBeGreaterThan(
        result.sensitivityList[8].requiredCapital
      );
    });

    it('handles edge case of 0 monthly net desired', () => {
      const input: CashFlowInput = {
        monthlyNetDesired: 0,
        annualReturnRate: 4.0,
        taxType: 'normal',
      };

      const result = calculateCashFlow(input);

      expect(result.annualNet).toBe(0);
      expect(result.annualGross).toBe(0);
      expect(result.annualTax).toBe(0);
      expect(result.requiredCapital).toBe(0);
      expect(result.isComprehensiveTaxWarning).toBe(false);
    });
  });
});
