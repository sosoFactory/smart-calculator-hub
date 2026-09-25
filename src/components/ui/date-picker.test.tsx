import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DatePicker } from './date-picker';

describe('shadcn Hybrid DatePicker Component Tests', () => {
  it('기본 날짜 값이 input 필드에 정상적으로 렌더링되어야 한다', () => {
    render(<DatePicker value="2026-09-25" onChange={() => {}} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('2026-09-25');
  });

  it('날짜 값이 없을 때는 placeholder가 노출되어야 한다', () => {
    render(<DatePicker placeholder="YYYY-MM-DD" onChange={() => {}} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.placeholder).toBe('YYYY-MM-DD');
  });

  it('숫자 8자리 입력 시 자동 하이픈 포맷팅 및 유효 날짜일 때 onChange가 호출되어야 한다', () => {
    const handleChange = vi.fn();
    render(<DatePicker value="" onChange={handleChange} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '20261231' } });

    expect(input.value).toBe('2026-12-31');
    expect(handleChange).toHaveBeenCalledWith('2026-12-31');
  });

  it('달력 아이콘 클릭 시 팝오버가 열리고 showTodayButton이 기본으로 표시되어야 한다', () => {
    const handleChange = vi.fn();
    render(<DatePicker value="2026-09-25" onChange={handleChange} />);

    const calendarBtn = screen.getByRole('button', { name: '달력 열기' });
    fireEvent.click(calendarBtn);

    expect(screen.getByText('달력에서 날짜 선택')).toBeInTheDocument();
    expect(screen.getByText('오늘로 지정')).toBeInTheDocument();
    expect(screen.getByText(/오늘 날짜로 선택/)).toBeInTheDocument();

    // 연도와 월 셀렉트 요소가 각각 1개씩 존재해야 함 (중복 생성 방지)
    const selects = screen.getAllByRole('combobox');
    expect(selects).toHaveLength(2);
  });

  it('showTodayButton={false}일 경우 오늘 관련 버튼이 팝오버에 표시되지 않아야 한다', () => {
    render(<DatePicker value="2000-01-01" onChange={() => {}} showTodayButton={false} />);

    const calendarBtn = screen.getByRole('button', { name: '달력 열기' });
    fireEvent.click(calendarBtn);

    expect(screen.getByText('달력에서 날짜 선택')).toBeInTheDocument();
    expect(screen.queryByText('오늘로 지정')).not.toBeInTheDocument();
    expect(screen.queryByText(/오늘 날짜로 선택/)).not.toBeInTheDocument();
  });
});


