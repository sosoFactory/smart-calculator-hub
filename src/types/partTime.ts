export type WorkScheduleMode = 'weekly_total' | 'daily_hours';

export type PartTimeTaxType = 'none' | 'freelancer' | 'four_insurances';

export interface PartTimeInput {
  hourlyWage: number; // 시급 (기본 10,320)
  scheduleMode: WorkScheduleMode; // 근무 시간 입력 방식
  weeklyTotalHours: number; // 주간 총 근로시간 (weekly_total 모드)
  dailyHours: number; // 1일 근무시간 (daily_hours 모드)
  workingDaysPerWeek: number; // 주당 근무일수 (daily_hours 모드)
  hasAttendance: boolean; // 개근 여부 (기본 true)
  taxType: PartTimeTaxType; // 공제 방식
  isOver5Employees: boolean; // 5인 이상 사업장 여부 (가산수당 적용용)
  weeklyOvertimeHours: number; // 주간 연장근로 시간
  weeklyNightHours: number; // 주간 야간근로 시간 (22시~06시)
  weeklyHolidayWorkHours: number; // 주간 휴일근로 시간
}

export interface PartTimeWeeklyResult {
  workHours: number; // 주간 실근로시간
  holidayAllowanceHours: number; // 주간 주휴시간
  totalPaidHours: number; // 주간 총 유급시간 (근로시간 + 주휴시간)
  baseWage: number; // 주간 기본급
  holidayAllowance: number; // 주간 주휴수당
  overtimePay: number; // 주간 연장근로수당
  nightPay: number; // 주간 야간근로수당
  holidayWorkPay: number; // 주간 휴일근로수당
  additionalPayTotal: number; // 주간 가산수당 총액
  grossWage: number; // 주간 세전 총급여
  taxAmount: number; // 주간 공제 세금
  netWage: number; // 주간 세후 실수령액
}

export interface PartTimeMonthlyResult {
  workHours: number; // 월 환산 실근로시간
  holidayAllowanceHours: number; // 월 환산 주휴시간
  totalPaidHours: number; // 월 총 유급시간
  baseWage: number; // 월 기본급
  holidayAllowance: number; // 월 주휴수당
  overtimePay: number; // 월 연장근로수당
  nightPay: number; // 월 야간근로수당
  holidayWorkPay: number; // 월 휴일근로수당
  additionalPayTotal: number; // 월 가산수당 총액
  grossWage: number; // 월 세전 총급여
  taxAmount: number; // 월 공제 세금
  nationalPension: number; // 국민연금 (4대보험 시)
  healthInsurance: number; // 건강보험 (4대보험 시)
  longTermCare: number; // 장기요양보험 (4대보험 시)
  employmentInsurance: number; // 고용보험 (4대보험 시)
  netWage: number; // 월 세후 실수령액
}

export interface PartTimeCalculationResult {
  isHolidayAllowanceEligible: boolean; // 주휴수당 대상 여부 (주 15시간 이상)
  ineligibilityReason?: string; // 주휴수당 미발생 사유
  effectiveHourlyRate: number; // 실질 체감 시급 (주휴 포함)
  effectiveRateIncreasePercent: number; // 실질 시급 인상 효과 (%)
  weekly: PartTimeWeeklyResult;
  monthly: PartTimeMonthlyResult;
}

export const MINIMUM_WAGE_2026 = 10_320;
export const MINIMUM_WAGE_2025 = 10_030;
export const WEEKS_PER_MONTH = 365 / 7 / 12; // 약 4.34524주
