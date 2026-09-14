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
    expect(screen.getByText('신장 (cm)')).toBeInTheDocument();
    expect(screen.getByText('체중 (kg)')).toBeInTheDocument();
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

  it('updates BMI and status when weight input changes', () => {
    render(<BmiApp />);

    const weightInput = screen.getByLabelText('체중 (kg)');
    // 체중을 85kg으로 변경 (키 170cm 기준 BMI 29.4 -> 1단계 비만)
    fireEvent.change(weightInput, { target: { value: '85' } });
    fireEvent.blur(weightInput);

    expect(screen.getByText('1단계 비만')).toBeInTheDocument();
    expect(screen.getAllByText(/29.4/).length).toBeGreaterThanOrEqual(1);
  });

  it('resets inputs to default when reset button is clicked', () => {
    render(<BmiApp />);

    const weightInput = screen.getByLabelText('체중 (kg)');
    fireEvent.change(weightInput, { target: { value: '95' } });
    fireEvent.blur(weightInput);

    expect(screen.getByText('2단계 비만')).toBeInTheDocument();

    // 초기화 버튼 클릭
    const resetButton = screen.getByRole('button', { name: /초기화/i });
    fireEvent.click(resetButton);

    // 기본값 65kg 복원 -> 정상
    expect(screen.getAllByText('정상').length).toBeGreaterThanOrEqual(1);
  });

  it('adjusts height and weight by 1 unit when -1 and +1 stepper buttons are clicked', () => {
    render(<BmiApp />);

    const heightInput = screen.getByLabelText('신장 (cm)') as HTMLInputElement;
    const weightInput = screen.getByLabelText('체중 (kg)') as HTMLInputElement;

    expect(heightInput.value).toBe('170');
    expect(weightInput.value).toBe('65');

    // 신장 1cm 증가 및 감소
    const heightPlus = screen.getByLabelText('신장 1cm 증가');
    const heightMinus = screen.getByLabelText('신장 1cm 감소');
    fireEvent.click(heightPlus);
    expect(heightInput.value).toBe('171');
    fireEvent.click(heightMinus);
    expect(heightInput.value).toBe('170');

    // 체중 1kg 증가 및 감소
    const weightPlus = screen.getByLabelText('체중 1kg 증가');
    const weightMinus = screen.getByLabelText('체중 1kg 감소');
    fireEvent.click(weightPlus);
    expect(weightInput.value).toBe('66');
    fireEvent.click(weightMinus);
    expect(weightInput.value).toBe('65');
  });
});
