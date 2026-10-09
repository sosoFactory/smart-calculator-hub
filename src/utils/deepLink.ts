import { LoanInput, RepaymentMethod } from '../types/loan';
import { ScenarioInput, TaxType, ContributionFrequency, CompoundingFrequency } from '../types/calculator';
import { SalaryInput, SalaryPaymentType, SeveranceType } from '../types/salary';
import { GoalInput, GoalTaxType } from '../types/goal';
import { PartTimeInput, PartTimeTaxType } from '../types/partTime';
import { BmiInput, Gender } from '../types/bmi';
import { UnitCategory } from '../types/unit';
import { DateTabType, DateCalcOp, DateCalcUnit } from '../types/date';
import { CashFlowInput, CashFlowTaxType } from '../types/cashFlow';
import { DevToolsTabType } from '../types/devTools';
import { SeveranceInput } from '../types/severance';

/**
 * 브라우저 히스토리 스택을 오염시키지 않고 주소창 URL 쿼리를 실시간 갱신
 */
export const syncUrlQuery = (queryString: string): void => {
  if (typeof window === 'undefined') return;
  const currentSearch = window.location.search.replace(/^\?/, '');
  if (currentSearch === queryString) return;

  const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
  window.history.replaceState(null, '', newUrl);
};

// ==========================================
// 1. 대출이자 계산기 (/loan)
// ==========================================

export const encodeLoanQuery = (input: LoanInput): string => {
  const params = new URLSearchParams();

  if (input.loanAmount > 0) params.set('amount', String(input.loanAmount));
  if (input.annualRate >= 0) params.set('rate', String(input.annualRate));
  if (input.loanTermYears > 0) params.set('years', String(input.loanTermYears));
  if (input.gracePeriodMonths > 0) params.set('grace', String(input.gracePeriodMonths));
  if (input.repaymentMethod) params.set('method', input.repaymentMethod);

  if (input.earlyRepayment?.enabled) {
    params.set('early', 'true');
    params.set('earlyMonth', String(input.earlyRepayment.afterMonths));
    params.set('earlyAmount', String(input.earlyRepayment.amount));
    params.set('earlyFee', String(input.earlyRepayment.feeRate));
  }

  return params.toString();
};

export const decodeLoanQuery = (search: string): Partial<LoanInput> | null => {
  if (!search) return null;
  const params = new URLSearchParams(search);

  const amountStr = params.get('amount');
  const rateStr = params.get('rate');
  const yearsStr = params.get('years');
  const graceStr = params.get('grace');
  const methodStr = params.get('method') as RepaymentMethod | null;
  const earlyStr = params.get('early');

  if (!amountStr && !rateStr && !yearsStr && !methodStr) {
    return null;
  }

  const result: Partial<LoanInput> = {};

  if (amountStr) {
    const parsed = Number(amountStr);
    if (!isNaN(parsed) && parsed > 0) result.loanAmount = parsed;
  }
  if (rateStr) {
    const parsed = Number(rateStr);
    if (!isNaN(parsed) && parsed >= 0) result.annualRate = parsed;
  }
  if (yearsStr) {
    const parsed = Number(yearsStr);
    if (!isNaN(parsed) && parsed > 0) result.loanTermYears = parsed;
  }
  if (graceStr) {
    const parsed = Number(graceStr);
    if (!isNaN(parsed) && parsed >= 0) result.gracePeriodMonths = parsed;
  }
  if (methodStr && ['equal_payment', 'equal_principal', 'bullet'].includes(methodStr)) {
    result.repaymentMethod = methodStr;
  }

  if (earlyStr === 'true') {
    const afterMonths = Number(params.get('earlyMonth') || 24);
    const amount = Number(params.get('earlyAmount') || 30_000_000);
    const feeRate = Number(params.get('earlyFee') || 1.2);
    result.earlyRepayment = {
      enabled: true,
      afterMonths: !isNaN(afterMonths) ? afterMonths : 24,
      amount: !isNaN(amount) ? amount : 30_000_000,
      feeRate: !isNaN(feeRate) ? feeRate : 1.2,
    };
  }

  return Object.keys(result).length > 0 ? result : null;
};

// ==========================================
// 2. 연복리 & 자산 성장 계산기 (/compound)
// ==========================================

export const encodeCompoundQuery = (input: ScenarioInput): string => {
  const params = new URLSearchParams();

  if (input.principal >= 0) params.set('principal', String(input.principal));
  if (input.regularContribution >= 0) params.set('contribution', String(input.regularContribution));
  if (input.contributionFrequency) params.set('contribFreq', input.contributionFrequency);
  if (input.years > 0) params.set('years', String(input.years));
  if (input.annualRate !== undefined) params.set('rate', String(input.annualRate));
  if (input.compoundingFrequency) params.set('compFreq', input.compoundingFrequency);
  if (input.taxType) params.set('tax', input.taxType);

  return params.toString();
};

export const decodeCompoundQuery = (search: string): Partial<ScenarioInput> | null => {
  if (!search) return null;
  const params = new URLSearchParams(search);

  const principalStr = params.get('principal');
  const contributionStr = params.get('contribution');
  const contribFreqStr = params.get('contribFreq') as ContributionFrequency | null;
  const yearsStr = params.get('years');
  const rateStr = params.get('rate');
  const compFreqStr = params.get('compFreq') as CompoundingFrequency | null;
  const taxStr = params.get('tax') as TaxType | null;
  const taxRateStr = params.get('taxRate');

  if (!principalStr && !contributionStr && !yearsStr && !rateStr) {
    return null;
  }

  const result: Partial<ScenarioInput> = {};

  if (principalStr) {
    const parsed = Number(principalStr);
    if (!isNaN(parsed) && parsed >= 0) result.principal = parsed;
  }
  if (contributionStr) {
    const parsed = Number(contributionStr);
    if (!isNaN(parsed) && parsed >= 0) result.regularContribution = parsed;
  }
  if (contribFreqStr && ['monthly', 'yearly'].includes(contribFreqStr)) {
    result.contributionFrequency = contribFreqStr;
  }
  if (yearsStr) {
    const parsed = Number(yearsStr);
    if (!isNaN(parsed) && parsed > 0) result.years = parsed;
  }
  if (rateStr) {
    const parsed = Number(rateStr);
    if (!isNaN(parsed)) result.annualRate = parsed;
  }
  if (compFreqStr && ['monthly', 'quarterly', 'yearly', 'daily'].includes(compFreqStr)) {
    result.compoundingFrequency = compFreqStr;
  }
  if (taxStr) {
    if (taxStr === 'normal' || taxStr === 'isa' || taxStr === 'exempt') {
      result.taxType = taxStr;
    } else if (taxStr === 'tax_free') {
      result.taxType = 'exempt';
    } else if (taxStr === 'custom') {
      result.taxType = 'normal';
    }
  }
  if (taxRateStr) {
    const parsed = Number(taxRateStr);
    if (!isNaN(parsed) && parsed >= 0) result.customTaxRate = parsed;
  }

  return Object.keys(result).length > 0 ? result : null;
};

// ==========================================
// 3. 연봉 실수령액 계산기 (/salary)
// ==========================================

export const encodeSalaryQuery = (input: SalaryInput): string => {
  const params = new URLSearchParams();

  if (input.grossAmount > 0) params.set('gross', String(input.grossAmount));
  if (input.paymentType) params.set('type', input.paymentType);
  if (input.severanceType) params.set('severance', input.severanceType);
  if (input.nonTaxableAmount >= 0) params.set('nonTax', String(input.nonTaxableAmount));
  if (input.familyCount >= 1) params.set('family', String(input.familyCount));
  if (input.childrenCount >= 0) params.set('children', String(input.childrenCount));

  return params.toString();
};

export const decodeSalaryQuery = (search: string): Partial<SalaryInput> | null => {
  if (!search) return null;
  const params = new URLSearchParams(search);

  const grossStr = params.get('gross');
  const typeStr = params.get('type') as SalaryPaymentType | null;
  const severanceStr = params.get('severance') as SeveranceType | null;
  const nonTaxStr = params.get('nonTax');
  const familyStr = params.get('family');
  const childrenStr = params.get('children');

  if (!grossStr && !typeStr && !severanceStr) {
    return null;
  }

  const result: Partial<SalaryInput> = {};

  if (grossStr) {
    const parsed = Number(grossStr);
    if (!isNaN(parsed) && parsed > 0) result.grossAmount = parsed;
  }
  if (typeStr && ['annual', 'monthly'].includes(typeStr)) {
    result.paymentType = typeStr;
  }
  if (severanceStr && ['separate', 'included'].includes(severanceStr)) {
    result.severanceType = severanceStr;
  }
  if (nonTaxStr) {
    const parsed = Number(nonTaxStr);
    if (!isNaN(parsed) && parsed >= 0) result.nonTaxableAmount = parsed;
  }
  if (familyStr) {
    const parsed = Number(familyStr);
    if (!isNaN(parsed) && parsed >= 1) result.familyCount = parsed;
  }
  if (childrenStr) {
    const parsed = Number(childrenStr);
    if (!isNaN(parsed) && parsed >= 0) result.childrenCount = parsed;
  }

  return Object.keys(result).length > 0 ? result : null;
};

// ==========================================
// 4. 목표 자산 역산 계산기 (/goal)
// ==========================================

export const encodeGoalQuery = (input: GoalInput): string => {
  const params = new URLSearchParams();

  if (input.targetAmount > 0) params.set('target', String(input.targetAmount));
  if (input.targetYears > 0) params.set('years', String(input.targetYears));
  if (input.annualRate !== undefined) params.set('rate', String(input.annualRate));
  if (input.initialAmount > 0) params.set('initial', String(input.initialAmount));
  if (input.taxType && input.taxType !== 'normal') params.set('tax', input.taxType);

  return params.toString();
};

export const decodeGoalQuery = (search: string): Partial<GoalInput> | null => {
  if (!search) return null;
  const params = new URLSearchParams(search);

  const targetStr = params.get('target');
  const yearsStr = params.get('years');
  const rateStr = params.get('rate');
  const initialStr = params.get('initial');
  const taxStr = params.get('tax') as GoalTaxType | null;

  if (!targetStr && !yearsStr && !rateStr && !initialStr && !taxStr) {
    return null;
  }

  const result: Partial<GoalInput> = {};

  if (targetStr) {
    const parsed = Number(targetStr);
    if (!isNaN(parsed) && parsed > 0) result.targetAmount = parsed;
  }
  if (yearsStr) {
    const parsed = Number(yearsStr);
    if (!isNaN(parsed) && parsed > 0) result.targetYears = parsed;
  }
  if (rateStr) {
    const parsed = Number(rateStr);
    if (!isNaN(parsed)) result.annualRate = parsed;
  }
  if (initialStr) {
    const parsed = Number(initialStr);
    if (!isNaN(parsed) && parsed >= 0) result.initialAmount = parsed;
  }
  if (taxStr && ['normal', 'exempt', 'isa'].includes(taxStr)) {
    result.taxType = taxStr;
  }

  return Object.keys(result).length > 0 ? result : null;
};

// ==========================================
// 6. 알바 급여 & 주휴수당 계산기 (/part-time)
// ==========================================

export const encodePartTimeQuery = (input: PartTimeInput): string => {
  const params = new URLSearchParams();

  if (input.hourlyWage > 0) params.set('wage', String(input.hourlyWage));
  if (input.weeklyWorkHours > 0) params.set('hours', String(input.weeklyWorkHours));
  if (input.taxType && input.taxType !== 'none') params.set('tax', input.taxType);
  if (input.isOver5Employees) {
    params.set('over5', 'true');
    if (input.weeklyOvertimeHours) params.set('overtime', String(input.weeklyOvertimeHours));
    if (input.weeklyNightHours) params.set('night', String(input.weeklyNightHours));
    if (input.weeklyHolidayWorkHours) params.set('hWork', String(input.weeklyHolidayWorkHours));
  }

  return params.toString();
};

export const decodePartTimeQuery = (search: string): Partial<PartTimeInput> | null => {
  if (!search) return null;
  const params = new URLSearchParams(search);

  const wageStr = params.get('wage');
  const hoursStr = params.get('hours');
  const taxStr = params.get('tax') as PartTimeTaxType | null;
  const over5Str = params.get('over5');
  const overtimeStr = params.get('overtime');
  const nightStr = params.get('night');
  const hWorkStr = params.get('hWork');

  if (!wageStr && !hoursStr && !taxStr) {
    return null;
  }

  const result: Partial<PartTimeInput> = {};

  if (wageStr) {
    const parsed = Number(wageStr);
    if (!isNaN(parsed) && parsed > 0) result.hourlyWage = parsed;
  }
  if (hoursStr) {
    const parsed = Number(hoursStr);
    if (!isNaN(parsed) && parsed >= 0) result.weeklyWorkHours = parsed;
  }
  if (taxStr && ['none', 'freelancer', 'four_insurances'].includes(taxStr)) {
    result.taxType = taxStr;
  }
  if (over5Str === 'true') {
    result.isOver5Employees = true;
  } else if (over5Str === 'false') {
    result.isOver5Employees = false;
  }
  if (overtimeStr) {
    const parsed = Number(overtimeStr);
    if (!isNaN(parsed) && parsed >= 0) result.weeklyOvertimeHours = parsed;
  }
  if (nightStr) {
    const parsed = Number(nightStr);
    if (!isNaN(parsed) && parsed >= 0) result.weeklyNightHours = parsed;
  }
  if (hWorkStr) {
    const parsed = Number(hWorkStr);
    if (!isNaN(parsed) && parsed >= 0) result.weeklyHolidayWorkHours = parsed;
  }

  return Object.keys(result).length > 0 ? result : null;
};

// ==========================================
// 6. BMI 계산기 (/bmi)
// ==========================================

export const encodeBmiQuery = (input: BmiInput): string => {
  const params = new URLSearchParams();
  if (input.height > 0) params.set('height', String(input.height));
  if (input.weight > 0) params.set('weight', String(input.weight));
  if (input.gender) params.set('gender', input.gender);
  return params.toString();
};

export const decodeBmiQuery = (search: string): Partial<BmiInput> | null => {
  if (!search) return null;
  const params = new URLSearchParams(search);
  const heightStr = params.get('height');
  const weightStr = params.get('weight');
  const genderStr = params.get('gender') as Gender | null;

  if (!heightStr && !weightStr && !genderStr) return null;

  const result: Partial<BmiInput> = {};
  if (heightStr) {
    const h = Number(heightStr);
    if (!isNaN(h) && h > 0) result.height = h;
  }
  if (weightStr) {
    const w = Number(weightStr);
    if (!isNaN(w) && w > 0) result.weight = w;
  }
  if (genderStr && (genderStr === 'male' || genderStr === 'female')) {
    result.gender = genderStr;
  }
  return Object.keys(result).length > 0 ? result : null;
};

// ==========================================
// 7. 단위 변환기 (/unit)
// ==========================================

export interface UnitDeepLinkParams {
  category?: UnitCategory;
  value?: number;
  fromUnit?: string;
  toUnit?: string;
}

export const encodeUnitQuery = (params: UnitDeepLinkParams): string => {
  const p = new URLSearchParams();
  if (params.category) p.set('cat', params.category);
  if (params.value !== undefined && params.value > 0) p.set('val', String(params.value));
  if (params.fromUnit) p.set('from', params.fromUnit);
  if (params.toUnit) p.set('to', params.toUnit);
  return p.toString();
};

export const decodeUnitQuery = (search: string): UnitDeepLinkParams | null => {
  if (!search) return null;
  const p = new URLSearchParams(search);
  const cat = p.get('cat') as UnitCategory | null;
  const valStr = p.get('val');
  const from = p.get('from');
  const to = p.get('to');

  if (!cat && !valStr && !from && !to) return null;

  const result: UnitDeepLinkParams = {};
  const validCategories: UnitCategory[] = ['area', 'length', 'weight', 'volume', 'temperature'];
  if (cat && validCategories.includes(cat)) result.category = cat;
  if (valStr) {
    const v = Number(valStr);
    if (!isNaN(v) && v >= 0) result.value = v;
  }
  if (from) result.fromUnit = from;
  if (to) result.toUnit = to;
  return Object.keys(result).length > 0 ? result : null;
};

// ==========================================
// 8. 실시간 환율 계산기 (/exchange)
// ==========================================

export interface ExchangeDeepLinkParams {
  from?: string;
  to?: string;
  amount?: number;
  spread?: number;
}

export const encodeExchangeQuery = (params: ExchangeDeepLinkParams): string => {
  const p = new URLSearchParams();
  if (params.from) p.set('from', params.from);
  if (params.to) p.set('to', params.to);
  if (params.amount !== undefined && params.amount > 0) p.set('amount', String(params.amount));
  if (params.spread !== undefined && params.spread > 0) p.set('spread', String(params.spread));
  return p.toString();
};

export const decodeExchangeQuery = (search: string): ExchangeDeepLinkParams | null => {
  if (!search) return null;
  const p = new URLSearchParams(search);
  const from = p.get('from');
  const to = p.get('to');
  const amountStr = p.get('amount');
  const spreadStr = p.get('spread');

  if (!from && !to && !amountStr && !spreadStr) return null;

  const result: ExchangeDeepLinkParams = {};
  if (from) result.from = from.toUpperCase();
  if (to) result.to = to.toUpperCase();
  if (amountStr) {
    const a = Number(amountStr);
    if (!isNaN(a) && a > 0) result.amount = a;
  }
  if (spreadStr) {
    const s = Number(spreadStr);
    if (!isNaN(s) && s >= 0) result.spread = s;
  }
  return Object.keys(result).length > 0 ? result : null;
};

// ==========================================
// 9. 날짜 & 디데이 계산기 (/date)
// ==========================================

export interface DateDeepLinkParams {
  tab?: DateTabType;
  target?: string;
  amount?: number;
  unit?: DateCalcUnit;
  op?: DateCalcOp;
  start?: string;
  end?: string;
  birth?: string;
}

export const encodeDateQuery = (params: DateDeepLinkParams): string => {
  const p = new URLSearchParams();
  if (params.tab) p.set('tab', params.tab);
  if (params.target) p.set('target', params.target);
  if (params.amount !== undefined) p.set('amount', String(params.amount));
  if (params.unit) p.set('unit', params.unit);
  if (params.op) p.set('op', params.op);
  if (params.start) p.set('start', params.start);
  if (params.end) p.set('end', params.end);
  if (params.birth) p.set('birth', params.birth);
  return p.toString();
};

export const decodeDateQuery = (search: string): DateDeepLinkParams | null => {
  if (!search) return null;
  const p = new URLSearchParams(search);
  const tab = p.get('tab') as DateTabType | null;
  const target = p.get('target');
  const amountStr = p.get('amount');
  const unit = p.get('unit') as DateCalcUnit | null;
  const op = p.get('op') as DateCalcOp | null;
  const start = p.get('start');
  const end = p.get('end');
  const birth = p.get('birth');

  if (!tab && !target && !amountStr && !unit && !op && !start && !end && !birth) return null;

  const result: DateDeepLinkParams = {};
  if (tab && ['dday', 'diff', 'age'].includes(tab)) result.tab = tab;
  if (target) result.target = target;
  if (amountStr) {
    const a = Number(amountStr);
    if (!isNaN(a) && a >= 0) result.amount = a;
  }
  if (unit && ['days', 'weeks', 'months', 'years'].includes(unit)) result.unit = unit;
  if (op && ['add', 'subtract'].includes(op)) result.op = op;
  if (start) result.start = start;
  if (end) result.end = end;
  if (birth) result.birth = birth;

  return Object.keys(result).length > 0 ? result : null;
};

// ==========================================
// 10. 파이어 현금흐름 계산기 (/cashflow)
// ==========================================

export const encodeCashFlowQuery = (input: CashFlowInput): string => {
  const p = new URLSearchParams();
  if (input.monthlyNetDesired > 0) p.set('net', String(input.monthlyNetDesired));
  if (input.annualReturnRate > 0) p.set('rate', String(input.annualReturnRate));
  if (input.taxType) p.set('tax', input.taxType);
  return p.toString();
};

export const decodeCashFlowQuery = (search: string): Partial<CashFlowInput> | null => {
  if (!search) return null;
  const p = new URLSearchParams(search);
  const netStr = p.get('net');
  const rateStr = p.get('rate');
  const taxStr = p.get('tax') as CashFlowTaxType | null;

  if (!netStr && !rateStr && !taxStr) return null;

  const result: Partial<CashFlowInput> = {};
  if (netStr) {
    const net = Number(netStr);
    if (!isNaN(net) && net >= 0) result.monthlyNetDesired = net;
  }
  if (rateStr) {
    const rate = Number(rateStr);
    if (!isNaN(rate) && rate > 0) result.annualReturnRate = rate;
  }
  if (taxStr && ['normal', 'isa', 'none'].includes(taxStr)) {
    result.taxType = taxStr;
  }

  return Object.keys(result).length > 0 ? result : null;
};

// ==========================================
// 11. 개발자 도구 (/devtools)
// ==========================================

export interface DevToolsDeepLinkParams {
  tab?: DevToolsTabType;
}

export const encodeDevToolsQuery = (params: DevToolsDeepLinkParams): string => {
  const p = new URLSearchParams();
  if (params.tab) p.set('tab', params.tab);
  return p.toString();
};

export const decodeDevToolsQuery = (search: string): DevToolsDeepLinkParams | null => {
  if (!search) return null;
  const p = new URLSearchParams(search);
  const tab = p.get('tab') as DevToolsTabType | null;

  if (!tab) return null;

  const result: DevToolsDeepLinkParams = {};
  if (['base', 'css', 'color'].includes(tab)) {
    result.tab = tab;
  }

  return Object.keys(result).length > 0 ? result : null;
};

// ==========================================
// 12. 퇴직금 계산기 (/severance)
// ==========================================

export const encodeSeveranceQuery = (input: SeveranceInput): string => {
  const p = new URLSearchParams();
  if (input.startDate) p.set('start', input.startDate);
  if (input.endDate) p.set('end', input.endDate);
  if (input.baseSalary > 0) p.set('salary', String(input.baseSalary));
  if (input.annualBonus > 0) p.set('bonus', String(input.annualBonus));
  if (input.annualLeaveAllowance > 0) p.set('leave', String(input.annualLeaveAllowance));
  return p.toString();
};

export const decodeSeveranceQuery = (search: string): Partial<SeveranceInput> | null => {
  if (!search) return null;
  const p = new URLSearchParams(search);
  const start = p.get('start');
  const end = p.get('end');
  const salaryStr = p.get('salary');
  const bonusStr = p.get('bonus');
  const leaveStr = p.get('leave');

  if (!start && !end && !salaryStr && !bonusStr && !leaveStr) return null;

  const result: Partial<SeveranceInput> = {};
  if (start) result.startDate = start;
  if (end) result.endDate = end;
  if (salaryStr) {
    const s = Number(salaryStr);
    if (!isNaN(s) && s >= 0) result.baseSalary = s;
  }
  if (bonusStr) {
    const b = Number(bonusStr);
    if (!isNaN(b) && b >= 0) result.annualBonus = b;
  }
  if (leaveStr) {
    const l = Number(leaveStr);
    if (!isNaN(l) && l >= 0) result.annualLeaveAllowance = l;
  }

  return Object.keys(result).length > 0 ? result : null;
};

