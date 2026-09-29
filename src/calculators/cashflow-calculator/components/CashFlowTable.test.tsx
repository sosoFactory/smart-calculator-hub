import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CashFlowTable } from './CashFlowTable';
import { CashFlowCalculationResult } from '../../../types/cashFlow';
import * as csvDownloader from '../../../utils/csvDownloader';

const MOCK_RESULT: CashFlowCalculationResult = {
  monthlyNet: 3_000_000,
  annualNet: 36_000_000,
  monthlyGross: 3_546_099,
  annualGross: 42_553_191,
  monthlyTax: 546_099,
  annualTax: 6_553_191,
  taxRatePercent: 15.4,
  effectiveNetReturnRate: 3.38,
  requiredCapital: 1_063_829_775,
  isComprehensiveTaxWarning: true,
  sensitivityList: [],
};

describe('CashFlowTable Component', () => {
  it('주기별 상세 명세표와 월간/연간 데이터를 올바르게 렌더링한다', () => {
    render(<CashFlowTable result={MOCK_RESULT} />);

    expect(screen.getByText('주기별 현금흐름 상세 명세표')).toBeInTheDocument();
    expect(screen.getByText('월간 기준')).toBeInTheDocument();
    expect(screen.getByText('연간 기준')).toBeInTheDocument();
    expect(screen.getByText('CSV 다운로드')).toBeInTheDocument();
  });

  it('CSV 다운로드 버튼 클릭 시 downloadCSV 유틸을 호출한다', () => {
    const downloadSpy = vi.spyOn(csvDownloader, 'downloadCSV').mockImplementation(() => {});

    render(<CashFlowTable result={MOCK_RESULT} />);
    const downloadButton = screen.getByRole('button', { name: /CSV 다운로드/i });
    fireEvent.click(downloadButton);

    expect(downloadSpy).toHaveBeenCalledTimes(1);
    expect(downloadSpy).toHaveBeenCalledWith(
      expect.stringContaining('파이어_현금흐름_명세서'),
      expect.arrayContaining(['구분', '세전 필요 수익금', '예상 세금 (15.4%)', '세후 실수령액', '실효 수익률']),
      expect.any(Array)
    );

    downloadSpy.mockRestore();
  });
});
