import { describe, it, expect } from 'vitest';
import {
  calculateSeverancePay,
  calculateServicePeriod,
  calculateSeveranceTax,
  calculateDailyAverageWage,
} from './severanceCalculator';
import { SeveranceInput } from '../types/severance';

describe('Severance Calculator Tests (TDD)', () => {
  describe('calculateServicePeriod (재직일수 및 근속기간 계산)', () => {
    it('동일 일자 입퇴사 시 재직일수는 1일이어야 한다', () => {
      const period = calculateServicePeriod('2024-01-01', '2024-01-01');
      expect(period.totalDays).toBe(1);
      expect(period.isEligible).toBe(false);
    });

    it('1년 미만(364일) 근무 시 isEligible은 false여야 한다', () => {
      const period = calculateServicePeriod('2024-01-01', '2024-12-30');
      expect(period.totalDays).toBe(365); // 2024는 윤년 (366일 중 12-30까지 365일)
      // 정확한 1년 미만 케이스
      const period2 = calculateServicePeriod('2023-01-01', '2023-12-30');
      expect(period2.totalDays).toBe(364);
      expect(period2.isEligible).toBe(false);
    });

    it('1년 이상(365일 이상) 근무 시 isEligible은 true여야 한다', () => {
      const period = calculateServicePeriod('2023-01-01', '2023-12-31');
      expect(period.totalDays).toBe(365);
      expect(period.isEligible).toBe(true);
      expect(period.formattedServicePeriod).toContain('1년');
    });

    it('3년 2개월 근무 시 올바른 텍스트 및 일수가 산출되어야 한다', () => {
      const period = calculateServicePeriod('2020-01-01', '2023-03-01');
      expect(period.totalDays).toBeGreaterThan(1150);
      expect(period.isEligible).toBe(true);
      expect(period.formattedServicePeriod).toMatch(/\d+년/);
    });
  });

  describe('calculateDailyAverageWage (1일 평균임금 계산)', () => {
    it('상여금/연차수당 없이 기본급만 있는 경우 3개월 일수(92일)로 나눈 평균임금을 산출한다', () => {
      // 3개월 기본급여 월 300만원 = 총 900만원, 92일 기준
      const dailyWage = calculateDailyAverageWage(3000000, 0, 0, 92);
      expect(dailyWage).toBeCloseTo(9000000 / 92, 2);
    });

    it('연간 상여금과 연차수당이 있으면 3/12씩 3개월 임금 총액에 포함되어야 한다', () => {
      // 기본급 300만*3 = 900만 + 상여 1200만*(3/12)=300만 + 연차 120만*(3/12)=30만 => 총 1,230만원
      const dailyWage = calculateDailyAverageWage(3000000, 12000000, 1200000, 92);
      expect(dailyWage).toBeCloseTo(12300000 / 92, 2);
    });
  });

  describe('calculateSeveranceTax (현행 퇴직소득세 및 실수령액 산정)', () => {
    it('근속연수공제: 5년 근속 시 500만원(100만*5) 공제되어야 한다', () => {
      // 세전 퇴직금 2,000만원, 5년 근속
      const tax = calculateSeveranceTax(20000000, 5);
      expect(tax.serviceYears).toBe(5);
      expect(tax.serviceDeduction).toBe(5000000);
      // 환산급여 = (2000만 - 500만) / 5 * 12 = 3,600만원
      expect(tax.convertedSalary).toBe(36000000);
      // 환산급여공제 = 800만원 + (3600만 - 800만) * 60% = 800만 + 1,680만 = 2,480만원
      expect(tax.convertedDeduction).toBe(24800000);
      // 과세표준 = 3,600만 - 2,480만 = 1,120만원 (1,400만원 이하이므로 6% 세율)
      expect(tax.taxBase).toBe(11200000);
      // 환산산출세액 = 1,120만 * 6% = 672,000원
      expect(tax.convertedTaxAmount).toBe(672000);
      // 산출세액 = 672,000 / 12 * 5 = 280,000원
      expect(tax.calculatedTax).toBe(280000);
      // 지방소득세 = 280,000 * 10% = 28,000원
      expect(tax.localTax).toBe(28000);
      // 총 퇴직소득세 = 308,000원
      expect(tax.totalTax).toBe(308000);
    });

    it('근속연수 15년 및 25년 구간 공제가 올바르게 적용되어야 한다', () => {
      // 15년: 1,500만 + 250만 * 5 = 2,750만원
      const tax15 = calculateSeveranceTax(80000000, 15);
      expect(tax15.serviceDeduction).toBe(27500000);
      expect(tax15.totalTax).toBeGreaterThan(0);

      // 25년: 4,000만 + 300만 * 5 = 5,500만원
      const tax25 = calculateSeveranceTax(150000000, 25);
      expect(tax25.serviceDeduction).toBe(55000000);
      expect(tax25.totalTax).toBeGreaterThan(0);
    });

    it('퇴직금이 공제액보다 작거나 같으면 세금은 0원이어야 한다', () => {
      const tax = calculateSeveranceTax(3000000, 5);
      expect(tax.totalTax).toBe(0);
      expect(tax.effectiveTaxRate).toBe(0);
    });

    it('시작일이 종료일보다 늦으면 재직일수 0과 수급 미달을 반환해야 한다', () => {
      const period = calculateServicePeriod('2024-05-01', '2023-01-01');
      expect(period.totalDays).toBe(0);
      expect(period.isEligible).toBe(false);
    });
  });

  describe('calculateSeverancePay (전체 통합 계산 및 IRP 비교)', () => {
    const input: SeveranceInput = {
      startDate: '2021-01-01',
      endDate: '2024-01-01',
      baseSalary: 3000000,
      annualBonus: 0,
      annualLeaveAllowance: 0,
    };

    it('3년 근무 시 올바른 법정 퇴직금, 세금, 실수령액 및 IRP 절세액이 산출되어야 한다', () => {
      const result = calculateSeverancePay(input);

      expect(result.isEligible).toBe(true);
      expect(result.totalDays).toBe(1096);
      expect(result.grossSeverancePay).toBeGreaterThan(8000000);
      expect(result.netSeverancePay).toBeLessThanOrEqual(result.grossSeverancePay);
      expect(result.netSeverancePay).toBe(result.grossSeverancePay - result.taxDetail.totalTax);

      // IRP 절세 비교
      expect(result.irpComparison.lumpSumTax).toBe(result.taxDetail.totalTax);
      expect(result.irpComparison.taxSavings10Years).toBe(Math.round(result.taxDetail.totalTax * 0.3));
      expect(result.irpComparison.taxSavingsOver10Years).toBe(Math.round(result.taxDetail.totalTax * 0.4));
    });

    it('1년 미만 근무 시 법정 퇴직금은 0원이며 수급 불가 상태를 반환해야 한다', () => {
      const shortInput: SeveranceInput = {
        ...input,
        startDate: '2023-01-01',
        endDate: '2023-06-01',
      };
      const result = calculateSeverancePay(shortInput);

      expect(result.isEligible).toBe(false);
      expect(result.grossSeverancePay).toBe(0);
      expect(result.netSeverancePay).toBe(0);
      expect(result.taxDetail.totalTax).toBe(0);
    });
  });
});
