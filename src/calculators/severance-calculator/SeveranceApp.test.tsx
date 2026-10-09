import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SeveranceApp } from './SeveranceApp';

describe('SeveranceApp Component Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, '', '/severance');
  });

  it('기본 렌더링 시 세후 실수령 퇴직금, 서브 지표, IRP 절세 카드가 표시된다', () => {
    render(<SeveranceApp />);

    // 메인 히어로 카드
    expect(screen.getByText('예상 실수령 퇴직금 (세후)')).toBeInTheDocument();

    // 서브 메트릭 지표
    expect(screen.getByText('세전 퇴직금')).toBeInTheDocument();
    expect(screen.getByText('퇴직소득세')).toBeInTheDocument();
    expect(screen.getByText('총 재직기간')).toBeInTheDocument();

    // IRP 절세 카드
    expect(screen.getByText('IRP(퇴직연금) 계좌 수령 시 절세 혜택')).toBeInTheDocument();

    // 하단 정보 가이드 카드
    expect(screen.getByText('퇴직금 & 퇴직소득세 법률·세무 상식')).toBeInTheDocument();
  });

  it('퇴직소득세 산출 명세표에 세법상 근속연수와 과세표준이 노출된다', () => {
    render(<SeveranceApp />);

    expect(screen.getByText('퇴직소득세 단계별 산출 명세표')).toBeInTheDocument();
    expect(screen.getByText('세법상 근속연수')).toBeInTheDocument();
    expect(screen.getByText('근속연수공제')).toBeInTheDocument();
    expect(screen.getByText('퇴직소득 과세표준')).toBeInTheDocument();
  });

  it('초기화 버튼 클릭 시 기본 입력값으로 복원된다', () => {
    render(<SeveranceApp />);

    const resetButton = screen.getByRole('button', { name: /초기화/i });
    fireEvent.click(resetButton);

    expect(screen.getByText('법정 퇴직금 지급 대상')).toBeInTheDocument();
  });
});
