import { describe, it, expect } from 'vitest';
import {
  encodeLoanQuery,
  decodeLoanQuery,
  encodeCompoundQuery,
  decodeCompoundQuery,
  encodeSalaryQuery,
  decodeSalaryQuery,
  encodeGoalQuery,
  decodeGoalQuery,
} from './deepLink';
import { LoanInput } from '../types/loan';
import { ScenarioInput } from '../types/calculator';
import { SalaryInput } from '../types/salary';
import { GoalInput } from '../types/goal';

describe('Deep Link Utilities', () => {
  describe('Loan Calculator Deep Linking', () => {
    const sampleLoan: LoanInput = {
      loanAmount: 350_000_000,
      annualRate: 3.8,
      loanTermYears: 30,
      gracePeriodMonths: 12,
      repaymentMethod: 'equal_principal',
      earlyRepayment: {
        enabled: true,
        afterMonths: 36,
        amount: 50_000_000,
        feeRate: 1.5,
      },
    };

    it('correctly encodes and decodes loan input without data loss', () => {
      const query = encodeLoanQuery(sampleLoan);
      expect(query).toContain('amount=350000000');
      expect(query).toContain('rate=3.8');
      expect(query).toContain('years=30');
      expect(query).toContain('grace=12');
      expect(query).toContain('method=equal_principal');
      expect(query).toContain('early=true');
      expect(query).toContain('earlyMonth=36');
      expect(query).toContain('earlyAmount=50000000');
      expect(query).toContain('earlyFee=1.5');

      const decoded = decodeLoanQuery(`?${query}`);
      expect(decoded).not.toBeNull();
      expect(decoded?.loanAmount).toBe(350_000_000);
      expect(decoded?.annualRate).toBe(3.8);
      expect(decoded?.loanTermYears).toBe(30);
      expect(decoded?.gracePeriodMonths).toBe(12);
      expect(decoded?.repaymentMethod).toBe('equal_principal');
      expect(decoded?.earlyRepayment?.enabled).toBe(true);
      expect(decoded?.earlyRepayment?.afterMonths).toBe(36);
      expect(decoded?.earlyRepayment?.amount).toBe(50_000_000);
      expect(decoded?.earlyRepayment?.feeRate).toBe(1.5);
    });

    it('returns null for empty or invalid query string', () => {
      expect(decodeLoanQuery('')).toBeNull();
      expect(decodeLoanQuery('?foo=bar')).toBeNull();
    });
  });

  describe('Compound Interest Deep Linking', () => {
    const sampleCompound: ScenarioInput = {
      name: '시나리오 A',
      principal: 50_000_000,
      regularContribution: 1_000_000,
      contributionFrequency: 'monthly',
      years: 20,
      annualRate: 8.5,
      compoundingFrequency: 'quarterly',
      taxType: 'isa',
      customTaxRate: 9.9,
    };

    it('correctly encodes and decodes compound interest scenario', () => {
      const query = encodeCompoundQuery(sampleCompound);
      expect(query).toContain('principal=50000000');
      expect(query).toContain('contribution=1000000');
      expect(query).toContain('years=20');
      expect(query).toContain('rate=8.5');
      expect(query).toContain('compFreq=quarterly');
      expect(query).toContain('tax=isa');

      const decoded = decodeCompoundQuery(`?${query}`);
      expect(decoded).not.toBeNull();
      expect(decoded?.principal).toBe(50_000_000);
      expect(decoded?.regularContribution).toBe(1_000_000);
      expect(decoded?.years).toBe(20);
      expect(decoded?.annualRate).toBe(8.5);
      expect(decoded?.compoundingFrequency).toBe('quarterly');
      expect(decoded?.taxType).toBe('isa');
    });

    it('returns null for empty query', () => {
      expect(decodeCompoundQuery('')).toBeNull();
    });
  });

  describe('Salary Calculator Deep Linking', () => {
    const sampleSalary: SalaryInput = {
      paymentType: 'annual',
      grossAmount: 70_000_000,
      severanceType: 'separate',
      nonTaxableAmount: 200_000,
      familyCount: 3,
      childrenCount: 1,
    };

    it('correctly encodes and decodes salary input', () => {
      const query = encodeSalaryQuery(sampleSalary);
      expect(query).toContain('gross=70000000');
      expect(query).toContain('type=annual');
      expect(query).toContain('severance=separate');
      expect(query).toContain('nonTax=200000');
      expect(query).toContain('family=3');
      expect(query).toContain('children=1');

      const decoded = decodeSalaryQuery(`?${query}`);
      expect(decoded).not.toBeNull();
      expect(decoded?.grossAmount).toBe(70_000_000);
      expect(decoded?.paymentType).toBe('annual');
      expect(decoded?.severanceType).toBe('separate');
      expect(decoded?.nonTaxableAmount).toBe(200_000);
      expect(decoded?.familyCount).toBe(3);
      expect(decoded?.childrenCount).toBe(1);
    });

    it('returns null for empty query', () => {
      expect(decodeSalaryQuery('')).toBeNull();
    });
  });

  describe('Goal Target Calculator Deep Linking', () => {
    const sampleGoal: GoalInput = {
      targetAmount: 500_000_000,
      targetYears: 10,
      annualRate: 7.0,
      initialAmount: 20_000_000,
      taxType: 'isa',
    };

    it('correctly encodes and decodes goal target input', () => {
      const query = encodeGoalQuery(sampleGoal);
      expect(query).toContain('target=500000000');
      expect(query).toContain('years=10');
      expect(query).toContain('rate=7');
      expect(query).toContain('initial=20000000');
      expect(query).toContain('tax=isa');

      const decoded = decodeGoalQuery(`?${query}`);
      expect(decoded).not.toBeNull();
      expect(decoded?.targetAmount).toBe(500_000_000);
      expect(decoded?.targetYears).toBe(10);
      expect(decoded?.annualRate).toBe(7.0);
      expect(decoded?.initialAmount).toBe(20_000_000);
      expect(decoded?.taxType).toBe('isa');
    });

    it('returns null for empty query', () => {
      expect(decodeGoalQuery('')).toBeNull();
    });
  });
});
