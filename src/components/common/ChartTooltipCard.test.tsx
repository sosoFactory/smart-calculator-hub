import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChartTooltipCard } from './ChartTooltipCard';

describe('ChartTooltipCard Tests', () => {
  it('title과 children이 올바르게 렌더링되어야 한다', () => {
    render(
      <ChartTooltipCard title="3년차">
        <div data-testid="tooltip-child">내부 데이터</div>
      </ChartTooltipCard>
    );
    expect(screen.getByText('3년차')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip-child')).toBeInTheDocument();
  });

  it('items 배열이 주어졌을 때 항목들이 올바르게 렌더링되어야 한다', () => {
    render(
      <ChartTooltipCard
        title="5년차말 기준"
        items={[
          { label: '납입 원금', value: '5,000만 원', color: 'text-sky-400' },
          { label: '누적 이자', value: '1,200만 원', color: 'text-rose-400', subValue: '(12,000,000원)' },
        ]}
      />
    );

    expect(screen.getByText('5년차말 기준')).toBeInTheDocument();
    expect(screen.getByText('납입 원금: 5,000만 원')).toBeInTheDocument();
    expect(screen.getByText('누적 이자: 1,200만 원')).toBeInTheDocument();
    expect(screen.getByText('(12,000,000원)')).toBeInTheDocument();
  });
});
