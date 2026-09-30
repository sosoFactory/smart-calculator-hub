import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { SidebarDrawer } from './SidebarDrawer';
import { FAVORITES_STORAGE_KEY } from '../../hooks/useFavorites';

describe('SidebarDrawer Favorites Tests', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  const renderSidebar = (activeId = 'home') =>
    render(
      <MemoryRouter>
        <SidebarDrawer
          activeId={activeId as any}
          onSelect={vi.fn()}
          isOpenMobile={false}
          onCloseMobile={vi.fn()}
        />
      </MemoryRouter>
    );

  it('즐겨찾기가 없을 때는 "대시보드" 메뉴와 "홈 (대시보드)"가 렌더링된다', () => {
    renderSidebar();

    expect(screen.getByText('대시보드')).toBeInTheDocument();
    expect(screen.getByText('홈 (대시보드)')).toBeInTheDocument();
    expect(screen.queryByText('즐겨찾기')).not.toBeInTheDocument();
  });

  it('즐겨찾기가 등록되어 있을 때는 "대시보드" 대신 "즐겨찾기" 메뉴 섹션이 렌더링된다', () => {
    window.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(['compound', 'loan'])
    );

    renderSidebar();

    // 대시보드 메뉴 대신 즐겨찾기 섹션 노출
    expect(screen.queryByText('대시보드')).not.toBeInTheDocument();
    expect(screen.getByText('즐겨찾기')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    // 즐겨찾기된 계산기들이 상단에 노출
    expect(screen.getAllByText('대출이자 계산기').length).toBeGreaterThan(0);
    expect(screen.getAllByText('연복리 계산기').length).toBeGreaterThan(0);
  });
});
