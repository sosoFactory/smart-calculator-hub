import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import HomeApp from './HomeApp';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('HomeApp Compact Dashboard Tests', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderHomeApp = () =>
    render(
      <MemoryRouter>
        <HomeApp />
      </MemoryRouter>
    );

  it('헤더와 10대 활성 계산기 카드가 렌더링되고 배당금 카드는 노출되지 않아야 한다', () => {
    renderHomeApp();

    expect(screen.getByRole('button', { name: '전체' })).toBeInTheDocument();

    // 10대 활성 계산기 shortName 노출 확인
    expect(screen.getByText('날짜·디데이')).toBeInTheDocument();
    expect(screen.getByText('단위 변환기')).toBeInTheDocument();
    expect(screen.getByText('대출이자 계산기')).toBeInTheDocument();
    expect(screen.getByText('목표자산 역산')).toBeInTheDocument();
    expect(screen.getByText('알바·주휴수당 계산기')).toBeInTheDocument();
    expect(screen.getByText('연복리 계산기')).toBeInTheDocument();
    expect(screen.getByText('연봉 계산기')).toBeInTheDocument();
    expect(screen.getByText('파이어 현금흐름')).toBeInTheDocument();
    expect(screen.getByText('환율 계산기')).toBeInTheDocument();
    expect(screen.getByText('BMI 계산기')).toBeInTheDocument();

    // 배당금 계산기(coming-soon) 카드는 삭제되어 노출되지 않아야 함
    expect(screen.queryByText('배당금 계산기')).not.toBeInTheDocument();
  });

  it('카테고리 칩 "생활 & 측정" 클릭 시 생활 측정 계산기들이 필터링되어야 한다', () => {
    renderHomeApp();

    const lifestyleChip = screen.getByRole('button', { name: '생활 & 측정' });
    fireEvent.click(lifestyleChip);

    expect(screen.getByText('단위 변환기')).toBeInTheDocument();
    expect(screen.getByText('BMI 계산기')).toBeInTheDocument();
    expect(screen.getByText('날짜·디데이')).toBeInTheDocument();
    expect(screen.queryByText('연복리 계산기')).not.toBeInTheDocument();
    expect(screen.queryByText('대출이자 계산기')).not.toBeInTheDocument();
  });

  it('카테고리 칩 "금융 & 자산" 클릭 시 금융 계산기들이 필터링되어야 한다', () => {
    renderHomeApp();

    const financeChip = screen.getByRole('button', { name: '금융 & 자산' });
    fireEvent.click(financeChip);

    expect(screen.getByText('연복리 계산기')).toBeInTheDocument();
    expect(screen.getByText('대출이자 계산기')).toBeInTheDocument();
    expect(screen.getByText('연봉 계산기')).toBeInTheDocument();
    expect(screen.queryByText('단위 변환기')).not.toBeInTheDocument();
    expect(screen.queryByText('환율 계산기')).not.toBeInTheDocument();
  });

  it('계산기 카드 클릭 시 해당 URL로 이동해야 한다', () => {
    renderHomeApp();

    const loanCard = screen.getByText('대출이자 계산기');
    fireEvent.click(loanCard);

    expect(mockNavigate).toHaveBeenCalledWith('/loan');
  });

  it('하단에 모바일 접속 QR 코드와 URL 복사 버튼이 올바르게 렌더링되고 복사 동작해야 한다', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    renderHomeApp();

    expect(screen.getByAltText('스마트 계산기 허브 모바일 접속 QR 코드')).toBeInTheDocument();
    expect(screen.getByText('모바일로 바로 열기')).toBeInTheDocument();

    const copyBtn = screen.getByRole('button', { name: '사이트 주소 복사' });
    expect(copyBtn).toBeInTheDocument();

    fireEvent.click(copyBtn);
    expect(writeTextMock).toHaveBeenCalledWith('https://soso-calculator.vercel.app');
    expect(await screen.findByText('복사 완료!')).toBeInTheDocument();
  });

  it('별 아이콘 클릭 시 라우팅 이동 없이 즐겨찾기가 토글되고 첫 번째 카드로 우선 정렬(Pin-to-Top)되어야 한다', () => {
    window.localStorage.clear();
    renderHomeApp();

    // 초기 상태: 첫 번째 카드는 가나다순 첫 번째인 '날짜·디데이', 별도 섹션 헤더 및 즐겨찾기 칩 없음
    const initialHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(initialHeadings[0]).toHaveTextContent('날짜·디데이');
    expect(screen.queryByText('자주 쓰는 계산기')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '⭐ 즐겨찾기' })).not.toBeInTheDocument();

    // '대출이자 계산기' 카드의 즐겨찾기 버튼 클릭
    const starBtn = screen.getByRole('button', { name: '대출이자 계산기 즐겨찾기 추가' });
    fireEvent.click(starBtn);

    // 카드 이동(navigate)은 호출되지 않아야 함
    expect(mockNavigate).not.toHaveBeenCalled();

    // 상단 분리 섹션 헤더 및 즐겨찾기 탭은 없으며, 대출이자 계산기가 목록의 맨 앞(index 0)으로 Pin-to-Top 정렬됨
    expect(screen.queryByText('자주 쓰는 계산기')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '⭐ 즐겨찾기' })).not.toBeInTheDocument();
    const updatedHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(updatedHeadings[0]).toHaveTextContent('대출이자 계산기');

    // 다시 별 아이콘 클릭 시 즐겨찾기 해제
    const unstarBtn = screen.getByRole('button', { name: '대출이자 계산기 즐겨찾기 해제' });
    fireEvent.click(unstarBtn);

    // 원래 가나다순으로 복귀
    const restoredHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(restoredHeadings[0]).toHaveTextContent('날짜·디데이');
  });
});
