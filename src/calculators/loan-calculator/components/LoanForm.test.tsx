import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoanForm } from './LoanForm';
import { LoanInput } from '../../../types/loan';

const MOCK_INPUT_OFF: LoanInput = {
  loanAmount: 300_000_000,
  annualRate: 4.5,
  loanTermYears: 30,
  gracePeriodMonths: 0,
  repaymentMethod: 'equal_payment',
  earlyRepayment: {
    enabled: false,
    afterMonths: 24,
    amount: 10_000_000,
    feeRate: 1.2,
  },
};

const MOCK_INPUT_ON: LoanInput = {
  ...MOCK_INPUT_OFF,
  earlyRepayment: {
    ...MOCK_INPUT_OFF.earlyRepayment!,
    enabled: true,
  },
};

describe('Seam: LoanForm Early Repayment Switch Toggle Interaction', () => {
  it('OFF 상태일 때 switch는 aria-checked=false이고 중도상환 세부 설정 필드가 숨겨져야 한다', () => {
    const handleChange = vi.fn();
    const handleReset = vi.fn();

    render(
      <LoanForm
        input={MOCK_INPUT_OFF}
        onChange={handleChange}
        onReset={handleReset}
      />
    );

    const switchBtn = screen.getByRole('switch', { name: '중도상환 시뮬레이션 토글' });
    expect(switchBtn).toBeInTheDocument();
    expect(switchBtn).toHaveAttribute('aria-checked', 'false');

    // OFF 상태에서는 중도상환 상세 설정 영역이 노출되지 않아야 함
    expect(screen.queryByText('중도상환 시점')).not.toBeInTheDocument();
  });

  it('토글 클릭 시 상태 변경 핸들러가 호출되고, ON 상태에서는 aria-checked=true 및 상세 필드가 노출되어야 한다', () => {
    const handleChange = vi.fn();
    const handleReset = vi.fn();

    const { rerender } = render(
      <LoanForm
        input={MOCK_INPUT_OFF}
        onChange={handleChange}
        onReset={handleReset}
      />
    );

    const switchBtn = screen.getByRole('switch', { name: '중도상환 시뮬레이션 토글' });
    switchBtn.click();
    expect(handleChange).toHaveBeenCalled();

    // ON 상태로 리렌더링
    rerender(
      <LoanForm
        input={MOCK_INPUT_ON}
        onChange={handleChange}
        onReset={handleReset}
      />
    );

    const updatedSwitchBtn = screen.getByRole('switch', { name: '중도상환 시뮬레이션 토글' });
    expect(updatedSwitchBtn).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('중도상환 시점')).toBeInTheDocument();
  });

  it('대출 금리 프리셋 칩 클릭 시 해당 금리로 onChange가 호출되어야 한다', () => {
    const handleChange = vi.fn();
    const handleReset = vi.fn();

    render(
      <LoanForm
        input={MOCK_INPUT_OFF}
        onChange={handleChange}
        onReset={handleReset}
      />
    );

    const ratePreset = screen.getByRole('button', { name: '3.8% 주담대' });
    ratePreset.click();

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ annualRate: 3.8 })
    );
  });

  it('중도상환 금액 프리셋 및 정정 버튼 클릭 시 올바른 금액이 반영되어야 한다', () => {
    const handleChange = vi.fn();
    const handleReset = vi.fn();

    render(
      <LoanForm
        input={MOCK_INPUT_ON}
        onChange={handleChange}
        onReset={handleReset}
      />
    );

    // 중도상환 정정 버튼 클릭 -> amount: 0
    const resetButtons = screen.getAllByRole('button', { name: '금액 정정' });
    // 첫 번째는 대출원금 정정, 두 번째는 중도상환금액 정정
    expect(resetButtons.length).toBe(2);
    resetButtons[1].click();

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        earlyRepayment: expect.objectContaining({ amount: 0 }),
      })
    );
  });
});
