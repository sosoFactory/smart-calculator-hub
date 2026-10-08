import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultHeroCard } from './ResultHeroCard';

describe('ResultHeroCard Tests', () => {
  it('기본 구조 및 children이 올바르게 렌더링되어야 한다', () => {
    render(
      <ResultHeroCard>
        <div data-testid="child-content">내부 콘텐츠</div>
      </ResultHeroCard>
    );
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('badge, action, mainValue, koreanReading props가 올바르게 렌더링되어야 한다', () => {
    render(
      <ResultHeroCard
        badge={<span>테스트 뱃지</span>}
        action={<button>복사</button>}
        mainValue="3,450,000원"
        koreanReading="345만 원"
        subtext="세전 대비 85%"
      />
    );

    expect(screen.getByText('테스트 뱃지')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '복사' })).toBeInTheDocument();
    expect(screen.getByText('3,450,000원')).toBeInTheDocument();
    expect(screen.getByText('(345만 원)')).toBeInTheDocument();
    expect(screen.getByText('세전 대비 85%')).toBeInTheDocument();
  });

  it('커스텀 className이 루트 엘리먼트에 병합되어야 한다', () => {
    const { container } = render(
      <ResultHeroCard className="custom-hero-class">
        <div>내용</div>
      </ResultHeroCard>
    );
    expect(container.firstChild).toHaveClass('custom-hero-class');
  });
});
