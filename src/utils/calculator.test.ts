import { describe, it, expect } from 'vitest';
import { calculateCompoundInterest, getTaxRate, getMonthlyEffectiveRate } from './calculator';

describe('Compound Interest Calculator Unit Tests', () => {
  it('기본 연복리 계산이 정상적으로 수행되어야 한다', () => {
    const result = calculateCompoundInterest({
      name: '기본 테스트',
      principal: 10000000,
      regularContribution: 1000000,
      contributionFrequency: 'monthly',
      years: 5,
      annualRate: 7,
      compoundingFrequency: 'monthly',
      taxType: 'normal',
    });

    expect(result.totalPrincipal).toBe(70000000);
    expect(result.futureValuePreTax).toBeGreaterThan(70000000);
    expect(result.breakdown).toHaveLength(5);
    expect(result.netReturnRate).toBeGreaterThan(0);
  });

  it('NaN 또는 유효하지 않은 입력값이 들어와도 기본값으로 안전하게 폴백되어야 한다', () => {
    const result = calculateCompoundInterest({
      name: 'NaN 테스트',
      principal: NaN,
      regularContribution: NaN,
      contributionFrequency: 'monthly',
      years: NaN,
      annualRate: NaN,
      compoundingFrequency: 'monthly',
      taxType: 'normal',
    });

    expect(Number.isFinite(result.totalPrincipal)).toBe(true);
    expect(Number.isFinite(result.futureValuePreTax)).toBe(true);
    expect(Number.isFinite(result.futureValuePostTax)).toBe(true);
    expect(result.breakdown.length).toBe(10);
    expect(isNaN(result.futureValuePreTax)).toBe(false);
  });

  it('하락장(음수 이율)에서도 원금이 0 미만으로 떨어지지 않아야 한다', () => {
    const result = calculateCompoundInterest({
      name: '하락장 테스트',
      principal: 10000000,
      regularContribution: 0,
      contributionFrequency: 'monthly',
      years: 3,
      annualRate: -20,
      compoundingFrequency: 'monthly',
      taxType: 'normal',
    });

    expect(result.futureValuePreTax).toBeLessThan(10000000);
    expect(result.futureValuePreTax).toBeGreaterThanOrEqual(0);
    expect(result.taxAmount).toBe(0);
  });

  it('과세 유형별 실효 세율이 정확해야 한다', () => {
    expect(getTaxRate('normal')).toBe(0.154);
    expect(getTaxRate('isa')).toBe(0.099);
    expect(getTaxRate('exempt')).toBe(0);
  });

  it('월 복리 실효 이율이 올바르게 계산되어야 한다', () => {
    const rate = getMonthlyEffectiveRate(12, 'monthly');
    expect(rate).toBeCloseTo(0.01, 4);
  });

  it('고수익률(100%) 시뮬레이션에서도 복리 계산이 정상적으로 수행되어야 한다', () => {
    const result = calculateCompoundInterest({
      name: '고수익 테스트',
      principal: 10000000,
      regularContribution: 0,
      contributionFrequency: 'none',
      years: 1,
      annualRate: 100,
      compoundingFrequency: 'annual',
      taxType: 'exempt',
    });

    expect(result.futureValuePreTax).toBe(20000000);
    expect(result.netInterest).toBe(10000000);
    expect(result.netReturnRate).toBe(100);
  });
});
