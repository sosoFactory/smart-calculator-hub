import {
  PartTimeCalculationResult,
  PartTimeInput,
  PartTimeMonthlyResult,
  PartTimeWeeklyResult,
  WEEKS_PER_MONTH,
} from '../types/partTime';

/**
 * 알바 급여 및 주휴수당 핵심 연산 함수
 */
export function calculatePartTimeWage(input: PartTimeInput): PartTimeCalculationResult {
  const hourlyWage = Math.max(0, input.hourlyWage || 0);

  // 1. 주간 실근로시간 계산
  const weeklyWorkHours = Math.max(0, input.weeklyWorkHours || 0);

  // 2. 주휴수당 대상 여부 판정 (주 15시간 이상 여부)
  let isHolidayAllowanceEligible = false;
  let ineligibilityReason: string | undefined;
  let weeklyHolidayHours = 0;

  if (weeklyWorkHours < 15) {
    isHolidayAllowanceEligible = false;
    ineligibilityReason = '주 15시간 미만 근무 (초단시간 근로)';
  } else {
    isHolidayAllowanceEligible = true;
    if (weeklyWorkHours >= 40) {
      weeklyHolidayHours = 8;
    } else {
      // 주 15시간 이상 40시간 미만 비례 산정: (주 소정근로시간 / 40) * 8 = 주 근로시간 / 5
      weeklyHolidayHours = Number((weeklyWorkHours / 5).toFixed(2));
    }
  }

  // 3. 가산수당 계산 (5인 이상 사업장만 법정 의무)
  let weeklyOvertimePay = 0;
  let weeklyNightPay = 0;
  let weeklyHolidayWorkPay = 0;

  if (input.isOver5Employees) {
    const overtimeHours = Math.max(0, input.weeklyOvertimeHours || 0);
    const nightHours = Math.max(0, input.weeklyNightHours || 0);
    const holidayWorkHours = Math.max(0, input.weeklyHolidayWorkHours || 0);

    // 연장근로 1.5배 (기본시급 * 1.5)
    weeklyOvertimePay = Math.round(overtimeHours * hourlyWage * 1.5);
    // 야간근로(22:00~06:00) 0.5배 가산
    weeklyNightPay = Math.round(nightHours * hourlyWage * 0.5);
    // 휴일근로 1.5배 (8시간 이내 기준)
    weeklyHolidayWorkPay = Math.round(holidayWorkHours * hourlyWage * 1.5);
  }

  const weeklyAdditionalPayTotal = weeklyOvertimePay + weeklyNightPay + weeklyHolidayWorkPay;

  // 4. 주간 급여 산출
  const weeklyBaseWage = Math.round(weeklyWorkHours * hourlyWage);
  const weeklyHolidayAllowance = Math.round(weeklyHolidayHours * hourlyWage);
  const weeklyGrossWage = weeklyBaseWage + weeklyHolidayAllowance + weeklyAdditionalPayTotal;

  let weeklyTaxAmount = 0;
  if (input.taxType === 'freelancer') {
    // 3.3% 사업소득세
    weeklyTaxAmount = Math.floor(weeklyGrossWage * 0.033);
  } else if (input.taxType === 'four_insurances') {
    // 4대보험 근로자 부담분 약 9.4%
    weeklyTaxAmount = Math.floor(weeklyGrossWage * 0.094);
  }
  const weeklyNetWage = weeklyGrossWage - weeklyTaxAmount;

  const weeklyResult: PartTimeWeeklyResult = {
    workHours: weeklyWorkHours,
    holidayAllowanceHours: weeklyHolidayHours,
    totalPaidHours: Number((weeklyWorkHours + weeklyHolidayHours).toFixed(2)),
    baseWage: weeklyBaseWage,
    holidayAllowance: weeklyHolidayAllowance,
    overtimePay: weeklyOvertimePay,
    nightPay: weeklyNightPay,
    holidayWorkPay: weeklyHolidayWorkPay,
    additionalPayTotal: weeklyAdditionalPayTotal,
    grossWage: weeklyGrossWage,
    taxAmount: weeklyTaxAmount,
    netWage: weeklyNetWage,
  };

  // 5. 월간 급여 산출 (4.34524주 환산)
  const monthlyWorkHours = Math.round(weeklyWorkHours * WEEKS_PER_MONTH * 10) / 10;
  const monthlyHolidayHours = Math.round(weeklyHolidayHours * WEEKS_PER_MONTH * 10) / 10;
  const monthlyTotalPaidHours = Math.round((weeklyWorkHours + weeklyHolidayHours) * WEEKS_PER_MONTH * 10) / 10;

  const monthlyBaseWage = Math.round(weeklyBaseWage * WEEKS_PER_MONTH);
  const monthlyHolidayAllowance = Math.round(weeklyHolidayAllowance * WEEKS_PER_MONTH);
  const monthlyOvertimePay = Math.round(weeklyOvertimePay * WEEKS_PER_MONTH);
  const monthlyNightPay = Math.round(weeklyNightPay * WEEKS_PER_MONTH);
  const monthlyHolidayWorkPay = Math.round(weeklyHolidayWorkPay * WEEKS_PER_MONTH);
  const monthlyAdditionalPayTotal = monthlyOvertimePay + monthlyNightPay + monthlyHolidayWorkPay;

  const monthlyGrossWage = monthlyBaseWage + monthlyHolidayAllowance + monthlyAdditionalPayTotal;

  let nationalPension = 0;
  let healthInsurance = 0;
  let longTermCare = 0;
  let employmentInsurance = 0;
  let monthlyTaxAmount = 0;

  if (input.taxType === 'freelancer') {
    monthlyTaxAmount = Math.floor(monthlyGrossWage * 0.033);
  } else if (input.taxType === 'four_insurances') {
    // 2026년 기준 4대보험 근로자 부담 요율
    nationalPension = Math.floor(monthlyGrossWage * 0.045); // 국민연금 4.5%
    healthInsurance = Math.floor(monthlyGrossWage * 0.03545); // 건강보험 3.545%
    longTermCare = Math.floor(healthInsurance * 0.1295); // 장기요양 건강보험료의 12.95%
    employmentInsurance = Math.floor(monthlyGrossWage * 0.009); // 고용보험 0.9%
    monthlyTaxAmount = nationalPension + healthInsurance + longTermCare + employmentInsurance;
  }

  const monthlyNetWage = monthlyGrossWage - monthlyTaxAmount;

  const monthlyResult: PartTimeMonthlyResult = {
    workHours: monthlyWorkHours,
    holidayAllowanceHours: monthlyHolidayHours,
    totalPaidHours: monthlyTotalPaidHours,
    baseWage: monthlyBaseWage,
    holidayAllowance: monthlyHolidayAllowance,
    overtimePay: monthlyOvertimePay,
    nightPay: monthlyNightPay,
    holidayWorkPay: monthlyHolidayWorkPay,
    additionalPayTotal: monthlyAdditionalPayTotal,
    grossWage: monthlyGrossWage,
    taxAmount: monthlyTaxAmount,
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    netWage: monthlyNetWage,
  };

  // 6. 체감 실질 시급 (주휴수당 포함 효과)
  let effectiveHourlyRate = hourlyWage;
  let effectiveRateIncreasePercent = 0;

  if (weeklyWorkHours > 0) {
    effectiveHourlyRate = Math.round((weeklyBaseWage + weeklyHolidayAllowance) / weeklyWorkHours);
    effectiveRateIncreasePercent =
      hourlyWage > 0 ? Number((((effectiveHourlyRate - hourlyWage) / hourlyWage) * 100).toFixed(1)) : 0;
  }

  return {
    isHolidayAllowanceEligible,
    ineligibilityReason,
    effectiveHourlyRate,
    effectiveRateIncreasePercent,
    weekly: weeklyResult,
    monthly: monthlyResult,
  };
}
