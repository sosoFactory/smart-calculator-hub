import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BmiApp } from './BmiApp';

describe('BmiApp Component', () => {
  it('renders all core UI elements: form, summary cards, gauge, and info card', () => {
    render(<BmiApp />);

    // 헤더 및 타이틀
    expect(screen.getByText('신체 정보 입력')).toBeInTheDocument();
    expect(screen.getByText('초기화')).toBeInTheDocument();

    // 입력 라벨
    expect(screen.getByText('신장 (키)')).toBeInTheDocument();
    expect(screen.getByText('체중 (몸무게)')).toBeInTheDocument();
    expect(screen.getByText('성별')).toBeInTheDocument();

    // 결과 대시보드
    expect(screen.getByText('체질량지수 (BMI)')).toBeInTheDocument();
    expect(screen.getByText('적정 표준 체중')).toBeInTheDocument();
    expect(screen.getByText('정상 체중 범위')).toBeInTheDocument();
    expect(screen.getByText('체중 조절 목표')).toBeInTheDocument();

    // 게이지 및 상식
    expect(screen.getByText('비만도 스펙트럼 게이지')).toBeInTheDocument();
    expect(screen.getByText('BMI 체질량지수 및 건강 관리 상식')).toBeInTheDocument();
  });

  it('updates BMI and status when weight preset is clicked', () => {
    render(<BmiApp />);

    // 80kg 프리셋 칩 클릭 (키 170cm 기준 BMI 27.7 -> 1단계 비만)
    const weight80Btn = screen.getByRole('button', { name: '80kg' });
    fireEvent.click(weight80Btn);

    expect(screen.getByText('1단계 비만')).toBeInTheDocument();
    expect(screen.getAllByText(/27.7/).length).toBeGreaterThanOrEqual(1);
  });

  it('resets inputs to default when reset button is clicked', () => {
    render(<BmiApp />);

    // 90kg 프리셋 클릭 -> 2단계 비만
    const weight90Btn = screen.getByRole('button', { name: '90kg' });
    fireEvent.click(weight90Btn);

    expect(screen.getByText('2단계 비만')).toBeInTheDocument();

    // 초기화 버튼 클릭
    const resetButton = screen.getByRole('button', { name: /초기화/i });
    fireEvent.click(resetButton);

    // 기본값 65kg 복원 -> 정상
    expect(screen.getAllByText('정상').length).toBeGreaterThanOrEqual(1);
  });

  it('updates height and weight when preset chips are clicked', () => {
    render(<BmiApp />);

    // 신장 180cm 프리셋 클릭
    const height180Btn = screen.getByRole('button', { name: '180cm' });
    fireEvent.click(height180Btn);
    expect(screen.getByText('180 cm')).toBeInTheDocument();

    // 체중 70kg 프리셋 클릭
    const weight70Btn = screen.getByRole('button', { name: '70kg' });
    fireEvent.click(weight70Btn);
    expect(screen.getByText('70 kg')).toBeInTheDocument();

    // 180cm, 70kg -> BMI 21.6 (정상)
    expect(screen.getAllByText('정상').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/21.6/).length).toBeGreaterThanOrEqual(1);
  });
});
