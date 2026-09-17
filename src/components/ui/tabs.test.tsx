import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';

describe('Tabs Component Tests', () => {
  it('기본 탭 렌더링 및 활성 탭 전환이 올바르게 동작해야 한다', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <Tabs defaultValue="tab1" onValueChange={handleValueChange}>
        <TabsList>
          <TabsTrigger value="tab1">탭 1</TabsTrigger>
          <TabsTrigger value="tab2">탭 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">컨텐츠 1</TabsContent>
        <TabsContent value="tab2">컨텐츠 2</TabsContent>
      </Tabs>
    );

    // 초기 상태: tab1 활성
    expect(screen.getByRole('tab', { name: '탭 1' })).toHaveAttribute('data-state', 'active');
    expect(screen.getByRole('tab', { name: '탭 2' })).toHaveAttribute('data-state', 'inactive');
    expect(screen.getByText('컨텐츠 1')).toBeInTheDocument();
    expect(screen.queryByText('컨텐츠 2')).not.toBeInTheDocument();

    // 탭 2 클릭
    await user.click(screen.getByRole('tab', { name: '탭 2' }));

    expect(handleValueChange).toHaveBeenCalledWith('tab2');
    expect(screen.getByRole('tab', { name: '탭 1' })).toHaveAttribute('data-state', 'inactive');
    expect(screen.getByRole('tab', { name: '탭 2' })).toHaveAttribute('data-state', 'active');
    expect(screen.getByText('컨텐츠 2')).toBeInTheDocument();
    expect(screen.queryByText('컨텐츠 1')).not.toBeInTheDocument();
  });

  it('다양한 variant와 size가 올바르게 적용되어야 한다', () => {
    const { container } = render(
      <Tabs defaultValue="tab-a">
        <TabsList variant="dark-solid" size="sm">
          <TabsTrigger value="tab-a">항목 A</TabsTrigger>
          <TabsTrigger value="tab-b">항목 B</TabsTrigger>
        </TabsList>
      </Tabs>
    );

    const list = container.querySelector('[role="tablist"]');
    expect(list).toBeInTheDocument();
    expect(list?.className).toContain('dark:bg-ghost-dark-surface-deep');
    expect(list?.className).toContain('h-8');
  });
});
