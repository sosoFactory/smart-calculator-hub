import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoanApp } from '../calculators/loan-calculator/LoanApp';
import { SalaryApp } from '../calculators/salary-calculator/SalaryApp';
import { CompoundInterestApp } from '../calculators/compound-interest/CompoundInterestApp';
import { TooltipProvider } from '../components/ui/tooltip';
import { ThemeProvider } from '../context/ThemeContext';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <TooltipProvider>{ui}</TooltipProvider>
    </ThemeProvider>
  );
};

describe('Deep Link App Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, '', window.location.pathname);
  });

  it('restores loan calculator inputs from URL search parameters', () => {
    // 5억, 3.5%, 20년 조건 딥링크 시뮬레이션
    window.history.replaceState(
      null,
      '',
      '/loan?amount=500000000&rate=3.5&years=20&method=equal_principal'
    );

    renderWithProviders(<LoanApp />);

    // 대출 원금 5억 및 금리 3.5% 반영 확인
    const amountInput = screen.getByLabelText('대출 원금 입력') as HTMLInputElement;
    expect(amountInput.value).toBe('500,000,000');

    const rateInput = screen.getByLabelText('연 대출 금리 입력') as HTMLInputElement;
    expect(rateInput.value).toBe('3.5');
  });

  it('restores salary calculator inputs from URL search parameters', () => {
    // 세전 7,000만 원, 부양가족 3명 딥링크 시뮬레이션
    window.history.replaceState(
      null,
      '',
      '/salary?gross=70000000&family=3'
    );

    renderWithProviders(<SalaryApp />);

    const grossInput = screen.getByLabelText(/세전/i) as HTMLInputElement;
    expect(grossInput.value).toBe('70,000,000');
  });

  it('restores compound interest inputs from URL search parameters', () => {
    // 초기 3,000만, 적립 100만, 15년, 8.5% 딥링크 시뮬레이션
    window.history.replaceState(
      null,
      '',
      '/compound?principal=30000000&contribution=1000000&years=15&rate=8.5'
    );

    renderWithProviders(<CompoundInterestApp />);

    const principalInput = screen.getByLabelText(/초기 투자 원금/i) as HTMLInputElement;
    expect(principalInput.value).toBe('30,000,000');
  });
});
