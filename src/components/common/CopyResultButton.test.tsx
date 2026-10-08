import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CopyResultButton } from './CopyResultButton';

describe('CopyResultButton Tests', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  it('기본 상태에서 "결과 복사" 라벨이 렌더링되어야 한다', () => {
    render(<CopyResultButton text="테스트 결과 복사" />);
    expect(screen.getByText('결과 복사')).toBeInTheDocument();
  });

  it('클릭 시 클립보드에 text가 복사되고 "복사 완료"로 변경되어야 한다', async () => {
    render(<CopyResultButton text="1,000만 원" />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('1,000만 원');
    await waitFor(() => {
      expect(screen.getByText('복사 완료')).toBeInTheDocument();
    });
  });

  it('함수 형태의 text prop도 올바르게 복사되어야 한다', async () => {
    const getText = vi.fn().mockReturnValue('동적 텍스트');
    render(<CopyResultButton text={getText} />);
    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(getText).toHaveBeenCalled();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('동적 텍스트');
    await waitFor(() => {
      expect(screen.getByText('복사 완료')).toBeInTheDocument();
    });
  });

  it('커스텀 label 및 className 적용이 가능해야 한다', () => {
    render(
      <CopyResultButton
        text="텍스트"
        label="코드 복사"
        copiedLabel="완료!"
        className="custom-class"
      />
    );
    expect(screen.getByText('코드 복사')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('size가 "icon"일 때는 텍스트 대신 아이콘과 툴팁이 제공되어야 한다', () => {
    render(<CopyResultButton text="아이콘 복사" size="icon" label="결과 복사하기" />);
    const button = screen.getByRole('button', { name: '결과 복사하기' });
    expect(button).toBeInTheDocument();
  });
});
