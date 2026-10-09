export interface SeveranceInput {
  startDate: string;              // 입사일 (YYYY-MM-DD)
  endDate: string;                // 퇴사일 (YYYY-MM-DD)
  baseSalary: number;             // 최근 3개월 월 평균 급여 (원)
  annualBonus: number;            // 최근 1년 연간 상여금 총액 (원, 기본 0원)
  annualLeaveAllowance: number;   // 최근 1년 연간 연차수당 총액 (원, 기본 0원)
}

export interface SeveranceTaxDetail {
  serviceYears: number;           // 세법상 근속연수 (년)
  serviceDeduction: number;       // 근속연수공제 (원)
  convertedSalary: number;        // 환산급여 (원)
  convertedDeduction: number;     // 환산급여공제 (원)
  taxBase: number;                // 퇴직소득 과세표준 (원)
  convertedTaxAmount: number;     // 환산산출세액 (원)
  calculatedTax: number;          // 퇴직소득 산출세액 (원)
  localTax: number;               // 지방소득세 (10%) (원)
  totalTax: number;               // 총 퇴직소득세 (소득세 + 지방세) (원)
  effectiveTaxRate: number;       // 실효세율 (%)
}

export interface IrpComparison {
  lumpSumTax: number;             // 일시금 수령 시 세금 (총 퇴직소득세)
  irpTax10Years: number;          // IRP 10년 이하 연금 수령 시 세금 (30% 감면)
  irpTaxOver10Years: number;      // IRP 10년 초과 연금 수령 시 세금 (40% 감면)
  taxSavings10Years: number;      // 10년 이하 절세액
  taxSavingsOver10Years: number;  // 10년 초과 절세액
}

export interface SeveranceResult {
  // 1. 근속 기간 지표
  totalDays: number;              // 총 재직일수 (일)
  formattedServicePeriod: string; // "N년 M개월 D일"
  isEligible: boolean;            // 법정 퇴직금 수급 요건 충족 여부 (1년 이상, 365일 이상)

  // 2. 임금 및 퇴직금 (세전)
  dailyAverageWage: number;       // 1일 평균임금 (원)
  threeMonthsTotalPay: number;    // 3개월간 임금 총액 (기본급여 + 상여금3/12 + 연차수당3/12)
  grossSeverancePay: number;      // 세전 법정 퇴직금 총액 (원)

  // 3. 세금 및 실수령액 (세후)
  taxDetail: SeveranceTaxDetail;  // 퇴직소득세 상세 공제 내역
  netSeverancePay: number;        // 세후 예상 실수령 퇴직금 (원)

  // 4. IRP 연금 수령 절세 비교
  irpComparison: IrpComparison;
}

export const DEFAULT_SEVERANCE_INPUT: SeveranceInput = {
  startDate: '2023-01-01',
  endDate: '2026-01-01',
  baseSalary: 3_000_000,
  annualBonus: 0,
  annualLeaveAllowance: 0,
};

