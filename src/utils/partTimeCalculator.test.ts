import { describe, it, expect } from 'vitest';
import { calculatePartTimeWage } from './partTimeCalculator';
import { MINIMUM_WAGE_2026, PartTimeInput } from '../types/partTime';

describe('partTimeCalculator Tests', () => {
  const defaultInput: PartTimeInput = {
    hourlyWage: MINIMUM_WAGE_2026, // 10,320원
    scheduleMode: 'weekly_total',
    weeklyTotalHours: 40,
    dailyHours: 8,
    workingDaysPerWeek: 5,
    hasAttendance: true,
    taxType: 'none',
    isOver5Employees: false,
    weeklyOvertimeHours: 0,
    weeklyNightHours: 0,
    weeklyHolidayWorkHours: 0,
  };

  it('주 40시간 풀타임 근무 시 주휴시간 8시간 및 월 209시간 최저임금 환산액이 정확해야 한다', () => {
    const result = calculatePartTimeWage(defaultInput);

    expect(result.isHolidayAllowanceEligible).toBe(true);
    expect(result.weekly.holidayAllowanceHours).toBe(8);
    expect(result.weekly.totalPaidHours).toBe(48);

    // 주간 기본급 및 주휴수당
    expect(result.weekly.baseWage).toBe(40 * 10320); // 412,800
    expect(result.weekly.holidayAllowance).toBe(8 * 10320); // 82,560

    // 월 환산 (40+8 = 48시간 * 4.34524 = 약 208.57 -> 208.6 또는 209시간대)
    // 2026 최저임금 월급 환산액: 약 2,156,880원 근사치
    expect(result.monthly.grossWage).toBeGreaterThan(2_150_000);
    expect(result.monthly.grossWage).toBeLessThan(2_160_000);

    // 주휴 포함 실질 시급은 기본 시급의 1.2배 (20% 인상)
    expect(result.effectiveHourlyRate).toBe(Math.round(10320 * 1.2));
    expect(result.effectiveRateIncreasePercent).toBe(20.0);
  });

  it('주 20시간 단시간 근로 시 주휴시간 4시간(20/5)으로 비례 계산되어야 한다', () => {
    const result = calculatePartTimeWage({
      ...defaultInput,
      weeklyTotalHours: 20,
    });

    expect(result.isHolidayAllowanceEligible).toBe(true);
    expect(result.weekly.workHours).toBe(20);
    expect(result.weekly.holidayAllowanceHours).toBe(4);
    expect(result.weekly.holidayAllowance).toBe(4 * 10320);
    expect(result.weekly.grossWage).toBe((20 + 4) * 10320);
  });

  it('주 14시간 근무 시 주휴수당이 0원이고 미발생 사유가 표기되어야 한다', () => {
    const result = calculatePartTimeWage({
      ...defaultInput,
      weeklyTotalHours: 14,
    });

    expect(result.isHolidayAllowanceEligible).toBe(false);
    expect(result.weekly.holidayAllowanceHours).toBe(0);
    expect(result.weekly.holidayAllowance).toBe(0);
    expect(result.ineligibilityReason).toContain('15시간 미만');
    expect(result.effectiveHourlyRate).toBe(10320);
    expect(result.effectiveRateIncreasePercent).toBe(0);
  });

  it('소정근로일 결근 시 주휴수당이 발생하지 않아야 한다', () => {
    const result = calculatePartTimeWage({
      ...defaultInput,
      hasAttendance: false,
    });

    expect(result.isHolidayAllowanceEligible).toBe(false);
    expect(result.weekly.holidayAllowanceHours).toBe(0);
    expect(result.ineligibilityReason).toContain('결근');
  });

  it('일별 근무시간(daily_hours) 모드에서 일 6시간 × 주 4일 = 주 24시간으로 정상 계산되어야 한다', () => {
    const result = calculatePartTimeWage({
      ...defaultInput,
      scheduleMode: 'daily_hours',
      dailyHours: 6,
      workingDaysPerWeek: 4,
    });

    expect(result.weekly.workHours).toBe(24);
    expect(result.weekly.holidayAllowanceHours).toBe(4.8); // 24 / 5 = 4.8시간
    expect(result.weekly.holidayAllowance).toBe(Math.round(4.8 * 10320));
  });

  it('프리랜서 3.3% 공제가 정확하게 계산되어야 한다', () => {
    const result = calculatePartTimeWage({
      ...defaultInput,
      weeklyTotalHours: 20,
      taxType: 'freelancer',
    });

    const weeklyGross = (20 + 4) * 10320; // 247,680
    const expectedWeeklyTax = Math.floor(weeklyGross * 0.033);
    expect(result.weekly.taxAmount).toBe(expectedWeeklyTax);
    expect(result.weekly.netWage).toBe(weeklyGross - expectedWeeklyTax);
  });

  it('4대보험 공제가 4대 항목별로 정확하게 계산되어야 한다', () => {
    const result = calculatePartTimeWage({
      ...defaultInput,
      weeklyTotalHours: 40,
      taxType: 'four_insurances',
    });

    expect(result.monthly.nationalPension).toBeGreaterThan(0);
    expect(result.monthly.healthInsurance).toBeGreaterThan(0);
    expect(result.monthly.longTermCare).toBeGreaterThan(0);
    expect(result.monthly.employmentInsurance).toBeGreaterThan(0);
    expect(result.monthly.taxAmount).toBe(
      result.monthly.nationalPension +
        result.monthly.healthInsurance +
        result.monthly.longTermCare +
        result.monthly.employmentInsurance
    );
    expect(result.monthly.netWage).toBe(result.monthly.grossWage - result.monthly.taxAmount);
  });

  it('5인 이상 사업장에서 연장/야간/휴일 가산수당이 정상 반영되어야 한다', () => {
    const result = calculatePartTimeWage({
      ...defaultInput,
      weeklyTotalHours: 40,
      isOver5Employees: true,
      weeklyOvertimeHours: 4, // 4 * 10,320 * 1.5 = 61,920
      weeklyNightHours: 2, // 2 * 10,320 * 0.5 = 10,320
      weeklyHolidayWorkHours: 8, // 8 * 10,320 * 1.5 = 123,840
    });

    expect(result.weekly.overtimePay).toBe(Math.round(4 * 10320 * 1.5));
    expect(result.weekly.nightPay).toBe(Math.round(2 * 10320 * 0.5));
    expect(result.weekly.holidayWorkPay).toBe(Math.round(8 * 10320 * 1.5));
    expect(result.weekly.additionalPayTotal).toBe(
      result.weekly.overtimePay + result.weekly.nightPay + result.weekly.holidayWorkPay
    );
  });

  it('5인 미만 사업장에서는 가산수당이 0원이어야 한다', () => {
    const result = calculatePartTimeWage({
      ...defaultInput,
      weeklyTotalHours: 40,
      isOver5Employees: false,
      weeklyOvertimeHours: 4,
      weeklyNightHours: 2,
    });

    expect(result.weekly.overtimePay).toBe(0);
    expect(result.weekly.nightPay).toBe(0);
    expect(result.weekly.additionalPayTotal).toBe(0);
  });
});
