import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { GlobalHeader } from './GlobalHeader';
import { CALCULATORS_LIST } from '../../types/navigation';
import { FAVORITES_STORAGE_KEY } from '../../hooks/useFavorites';
import { TooltipProvider } from '../ui/tooltip';
import { ThemeProvider } from '../../context/ThemeContext';

describe('GlobalHeader Favorites Tests', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  const loanCalculator = CALCULATORS_LIST.find((c) => c.id === 'loan')!;
  const homeCalculator = {
    id: 'home' as const,
    name: '스마트 계산기 허브',
    shortName: '홈',
    description: '',
    category: 'finance' as const,
    icon: 'LayoutDashboard',
    path: '/',
    status: 'active' as const,
  };

  const renderHeader = (calc = loanCalculator) =>
    render(
      <MemoryRouter>
        <ThemeProvider>
          <TooltipProvider>
            <GlobalHeader
              currentCalculator={calc}
              onOpenMobileMenu={vi.fn()}
            />
          </TooltipProvider>
        </ThemeProvider>
      </MemoryRouter>
    );

  it('홈 대시보드(id="home")에서는 즐겨찾기 별 버튼이 렌더링되지 않는다', () => {
    renderHeader(homeCalculator);

    expect(screen.queryByLabelText(/즐겨찾기/)).not.toBeInTheDocument();
  });

  it('계산기 화면(id="loan")에서는 즐겨찾기 별 버튼이 렌더링되고 토글 동작한다', () => {
    renderHeader(loanCalculator);

    const starBtn = screen.getByRole('button', { name: '대출이자 계산기 즐겨찾기 추가' });
    expect(starBtn).toBeInTheDocument();

    fireEvent.click(starBtn);

    // 로컬스토리지에 저장되었는지 확인
    const stored = JSON.parse(window.localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]');
    expect(stored).toContain('loan');

    // 다시 클릭 시 해제
    fireEvent.click(starBtn);
    const storedAfter = JSON.parse(window.localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]');
    expect(storedAfter).not.toContain('loan');
  });
});
