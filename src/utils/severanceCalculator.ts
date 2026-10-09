import {
  SeveranceInput,
  SeveranceResult,
  SeveranceTaxDetail,
  IrpComparison,
} from '../types/severance';

export interface ServicePeriodInfo {
  totalDays: number;
  formattedServicePeriod: string;
  isEligible: boolean;
}

/**
 * 입사일과 퇴사일 기준 총 재직일수 및 근속기간 포맷팅
 * 재직일수 = (퇴사일 - 입사일) + 1 (첫날과 마지막날 모두 산입)
 */
export function calculateServicePeriod(startDateStr: string, endDateStr: string): ServicePeriodInfo {
  if (!startDateStr || !endDateStr) {
    return {
      totalDays: 0,
      formattedServicePeriod: '0일',
      isEligible: false,
    };
  }

  const [sY, sM, sD] = startDateStr.split('-').map(Number);
  const [eY, eM, eD] = endDateStr.split('-').map(Number);
  const start = new Date(sY, sM - 1, sD);
  const end = new Date(eY, eM - 1, eD);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
    return {
      totalDays: 0,
      formattedServicePeriod: '0일',
      isEligible: false,
    };
  }

  const diffTime = end.getTime() - start.getTime();
  const totalDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
  const isEligible = totalDays >= 365;

  // 근속기간(N년 N개월 N일): 퇴사일 당일까지 근무이므로 퇴사일 익일 기준 달력 차이 산출
  const endNext = new Date(end.getTime() + 1000 * 60 * 60 * 24);
  let years = endNext.getFullYear() - start.getFullYear();
  let months = endNext.getMonth() - start.getMonth();
  let days = endNext.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const prevMonthLastDay = new Date(endNext.getFullYear(), endNext.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const parts: string[] = [];
  if (years > 0) parts.push(`${years}년`);
  if (months > 0) parts.push(`${months}개월`);
  if (days > 0 || parts.length === 0) parts.push(`${days}일`);

  return {
    totalDays,
    formattedServicePeriod: parts.join(' '),
    isEligible,
  };
}

/**
 * 1일 평균임금 산출
 * (최근 3개월 기본급여 + 상여금×3/12 + 연차수당×3/12) ÷ 3개월간 총 일수(약 92일)
 */
export function calculateDailyAverageWage(
  baseSalary: number,
  annualBonus: number = 0,
  annualLeaveAllowance: number = 0,
  threeMonthsDays: number = 92
): number {
  if (threeMonthsDays <= 0) return 0;
  const threeMonthsPay = (baseSalary * 3) + (annualBonus * 0.25) + (annualLeaveAllowance * 0.25);
  return threeMonthsPay / threeMonthsDays;
}

/**
 * 2024~2026 현행 소득세법 기준 퇴직소득세 상세 산정
 */
export function calculateSeveranceTax(
  grossSeverancePay: number,
  serviceYears: number
): SeveranceTaxDetail {
  if (grossSeverancePay <= 0 || serviceYears <= 0) {
    return {
      serviceYears: Math.max(1, serviceYears),
      serviceDeduction: 0,
      convertedSalary: 0,
      convertedDeduction: 0,
      taxBase: 0,
      convertedTaxAmount: 0,
      calculatedTax: 0,
      localTax: 0,
      totalTax: 0,
      effectiveTaxRate: 0,
    };
  }

  // 1. 근속연수공제
  let serviceDeduction = 0;
  if (serviceYears <= 5) {
    serviceDeduction = 1000000 * serviceYears;
  } else if (serviceYears <= 10) {
    serviceDeduction = 5000000 + 2000000 * (serviceYears - 5);
  } else if (serviceYears <= 20) {
    serviceDeduction = 15000000 + 2500000 * (serviceYears - 10);
  } else {
    serviceDeduction = 40000000 + 3000000 * (serviceYears - 20);
  }

  // 퇴직소득이 근속연수공제액 이하이면 세금 면제
  if (grossSeverancePay <= serviceDeduction) {
    return {
      serviceYears,
      serviceDeduction,
      convertedSalary: 0,
      convertedDeduction: 0,
      taxBase: 0,
      convertedTaxAmount: 0,
      calculatedTax: 0,
      localTax: 0,
      totalTax: 0,
      effectiveTaxRate: 0,
    };
  }

  // 2. 환산급여: (퇴직소득 - 근속연수공제) ÷ 근속연수 × 12
  const convertedSalary = Math.round(((grossSeverancePay - serviceDeduction) / serviceYears) * 12);

  // 3. 환산급여공제
  let convertedDeduction = 0;
  if (convertedSalary <= 8000000) {
    convertedDeduction = convertedSalary;
  } else if (convertedSalary <= 70000000) {
    convertedDeduction = 8000000 + (convertedSalary - 8000000) * 0.6;
  } else if (convertedSalary <= 150000000) {
    convertedDeduction = 45200000 + (convertedSalary - 70000000) * 0.55;
  } else if (convertedSalary <= 300000000) {
    convertedDeduction = 89200000 + (convertedSalary - 150000000) * 0.45;
  } else {
    convertedDeduction = 156700000 + (convertedSalary - 300000000) * 0.35;
  }
  convertedDeduction = Math.round(convertedDeduction);

  // 4. 과세표준
  const taxBase = Math.max(0, convertedSalary - convertedDeduction);

  // 5. 환산산출세액 (기본 8단계 누진세율)
  let convertedTaxAmount = 0;
  if (taxBase <= 14000000) {
    convertedTaxAmount = taxBase * 0.06;
  } else if (taxBase <= 50000000) {
    convertedTaxAmount = 840000 + (taxBase - 14000000) * 0.15;
  } else if (taxBase <= 88000000) {
    convertedTaxAmount = 6240000 + (taxBase - 50000000) * 0.24;
  } else if (taxBase <= 150000000) {
    convertedTaxAmount = 15360000 + (taxBase - 88000000) * 0.35;
  } else if (taxBase <= 300000000) {
    convertedTaxAmount = 37060000 + (taxBase - 150000000) * 0.38;
  } else if (taxBase <= 500000000) {
    convertedTaxAmount = 94060000 + (taxBase - 300000000) * 0.40;
  } else if (taxBase <= 1000000000) {
    convertedTaxAmount = 174060000 + (taxBase - 500000000) * 0.42;
  } else {
    convertedTaxAmount = 384060000 + (taxBase - 1000000000) * 0.45;
  }
  convertedTaxAmount = Math.round(convertedTaxAmount);

  // 6. 퇴직소득 산출세액 = 환산산출세액 ÷ 12 × 근속연수
  const calculatedTax = Math.floor((convertedTaxAmount / 12) * serviceYears);

  // 7. 지방소득세 = 산출세액의 10% (10원 단위 절사)
  const localTax = Math.floor((calculatedTax * 0.1) / 10) * 10;

  // 8. 총 세금 및 실효세율
  const totalTax = calculatedTax + localTax;
  const effectiveTaxRate = grossSeverancePay > 0
    ? Number(((totalTax / grossSeverancePay) * 100).toFixed(2))
    : 0;

  return {
    serviceYears,
    serviceDeduction,
    convertedSalary,
    convertedDeduction,
    taxBase,
    convertedTaxAmount,
    calculatedTax,
    localTax,
    totalTax,
    effectiveTaxRate,
  };
}

/**
 * 퇴직금 & 퇴직소득세 전체 통합 계산기
 */
export function calculateSeverancePay(input: SeveranceInput): SeveranceResult {
  const period = calculateServicePeriod(input.startDate, input.endDate);

  const emptyTaxDetail: SeveranceTaxDetail = {
    serviceYears: 1,
    serviceDeduction: 0,
    convertedSalary: 0,
    convertedDeduction: 0,
    taxBase: 0,
    convertedTaxAmount: 0,
    calculatedTax: 0,
    localTax: 0,
    totalTax: 0,
    effectiveTaxRate: 0,
  };

  const emptyIrp: IrpComparison = {
    lumpSumTax: 0,
    irpTax10Years: 0,
    irpTaxOver10Years: 0,
    taxSavings10Years: 0,
    taxSavingsOver10Years: 0,
  };

  // 법정 퇴직금 요건 미충족 (1년 미만)
  if (!period.isEligible) {
    return {
      totalDays: period.totalDays,
      formattedServicePeriod: period.formattedServicePeriod,
      isEligible: false,
      dailyAverageWage: 0,
      threeMonthsTotalPay: 0,
      grossSeverancePay: 0,
      taxDetail: emptyTaxDetail,
      netSeverancePay: 0,
      irpComparison: emptyIrp,
    };
  }

  // 1. 임금 및 법정 퇴직금 산정
  const dailyAverageWage = calculateDailyAverageWage(
    input.baseSalary,
    input.annualBonus,
    input.annualLeaveAllowance,
    92
  );
  const threeMonthsTotalPay = (input.baseSalary * 3) + (input.annualBonus * 0.25) + (input.annualLeaveAllowance * 0.25);
  const grossSeverancePay = Math.floor(dailyAverageWage * 30 * (period.totalDays / 365));

  // 2. 세법상 근속연수 (1년 미만 절상)
  const serviceYears = Math.max(1, Math.ceil(period.totalDays / 365));

  // 3. 퇴직소득세 산출
  const taxDetail = calculateSeveranceTax(grossSeverancePay, serviceYears);
  const netSeverancePay = grossSeverancePay - taxDetail.totalTax;

  // 4. IRP 절세 혜택 비교
  const irpComparison: IrpComparison = {
    lumpSumTax: taxDetail.totalTax,
    irpTax10Years: Math.round(taxDetail.totalTax * 0.7),
    irpTaxOver10Years: Math.round(taxDetail.totalTax * 0.6),
    taxSavings10Years: Math.round(taxDetail.totalTax * 0.3),
    taxSavingsOver10Years: Math.round(taxDetail.totalTax * 0.4),
  };

  return {
    totalDays: period.totalDays,
    formattedServicePeriod: period.formattedServicePeriod,
    isEligible: true,
    dailyAverageWage: Math.round(dailyAverageWage),
    threeMonthsTotalPay: Math.round(threeMonthsTotalPay),
    grossSeverancePay,
    taxDetail,
    netSeverancePay,
    irpComparison,
  };
}
