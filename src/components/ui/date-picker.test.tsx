import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DatePicker } from './date-picker';

describe('shadcn DatePicker Component Tests', () => {
  it('기본 날짜 값이 포맷팅되어 트리거 버튼에 렌더링되어야 한다', () => {
    render(<DatePicker value="2026-09-25" onChange={() => {}} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    // 2026-09-25 (금)
    expect(button).toHaveTextContent(/2026-09-25/);
  });

  it('날짜 값이 없을 때는 placeholder가 노출되어야 한다', () => {
    render(<DatePicker placeholder="날짜를 선택하세요" onChange={() => {}} />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('날짜를 선택하세요');
  });

  it('클릭 시 팝오버 캘린더가 열리고 오늘로 지정 버튼이 표시되어야 한다', () => {
    const handleChange = vi.fn();
    render(<DatePicker value="2026-09-25" onChange={handleChange} />);

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    expect(screen.getByText('달력에서 날짜 선택')).toBeInTheDocument();
    expect(screen.getByText('오늘로 지정')).toBeInTheDocument();
  });
});
