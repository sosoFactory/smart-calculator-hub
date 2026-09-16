import { LoanInput, RepaymentMethod } from '../types/loan';
import { ScenarioInput, TaxType, ContributionFrequency, CompoundingFrequency } from '../types/calculator';
import { SalaryInput, SalaryPaymentType, SeveranceType } from '../types/salary';
import { GoalInput, GoalTaxType } from '../types/goal';

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
