import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SubMetricCard } from './SubMetricCard';
import { Clock } from 'lucide-react';

describe('SubMetricCard Component', () => {
  it('renders label, value, and description correctly', () => {
    render(
      <SubMetricCard
        label="기본 급여"
        icon={Clock}
        value="896,857원"
        description="10,320원 × 86.9h"
      />
    );

    expect(screen.getByText('기본 급여')).toBeInTheDocument();
    expect(screen.getByText('896,857원')).toBeInTheDocument();
    expect(screen.getByText('10,320원 × 86.9h')).toBeInTheDocument();
  });

  it('renders optional badge when provided', () => {
    render(
      <SubMetricCard
        label="총 대출이자"
        badge="원금의 63.2%"
        badgeColor="rose"
        value="189,525,072원"
        valueColor="rose"
        description="1억 8,952만 원"
      />
    );

    expect(screen.getByText('원금의 63.2%')).toBeInTheDocument();
    expect(screen.getByText('189,525,072원')).toHaveClass('text-rose-600');
  });

  it('applies semantic color themes properly', () => {
    const { rerender } = render(
      <SubMetricCard
        label="예상 복리 수익"
        value="+137,340,520원"
        valueColor="emerald"
      />
    );
    expect(screen.getByText('+137,340,520원')).toHaveClass('text-emerald-600');

    rerender(
      <SubMetricCard
        label="이자/수익 기여도"
        value="27.5%"
        valueColor="indigo"
      />
    );
    expect(screen.getByText('27.5%')).toHaveClass('text-indigo-600');
  });

  it('ensures label is not truncated with whitespace-nowrap and shrink-0', () => {
    render(
      <SubMetricCard
        label="이자 소득세"
        badge="15.4%"
        value="5,720,153원"
      />
    );

    const labelElement = screen.getByText('이자 소득세');
    expect(labelElement).toHaveClass('whitespace-nowrap');
    expect(labelElement).not.toHaveClass('truncate');
  });
});
