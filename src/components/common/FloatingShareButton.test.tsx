import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { FloatingShareButton } from './FloatingShareButton';
import { TooltipProvider } from '../ui/tooltip';

describe('FloatingShareButton Component', () => {
  const originalNavigator = { ...navigator };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    // 복원
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });

  it('renders floating share button with accessible label', () => {
    render(
      <TooltipProvider>
        <FloatingShareButton />
      </TooltipProvider>
    );

    const button = screen.getByRole('button', { name: '현재 페이지 공유하기' });
    expect(button).toBeInTheDocument();
  });

  it('calls navigator.share when available', async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(global, 'navigator', {
      value: {
        ...originalNavigator,
        share: shareMock,
      },
      writable: true,
      configurable: true,
    });

    render(
      <TooltipProvider>
        <FloatingShareButton />
      </TooltipProvider>
    );

    const button = screen.getByRole('button', { name: '현재 페이지 공유하기' });
    await act(async () => {
      fireEvent.click(button);
    });

    expect(shareMock).toHaveBeenCalledTimes(1);
    expect(shareMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.any(String),
      })
    );
  });

  it('copies URL to clipboard when navigator.share is not available', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(global, 'navigator', {
      value: {
        ...originalNavigator,
        share: undefined,
        clipboard: {
          writeText: writeTextMock,
        },
      },
      writable: true,
      configurable: true,
    });

    render(
      <TooltipProvider>
        <FloatingShareButton />
      </TooltipProvider>
    );

    const button = screen.getByRole('button', { name: '현재 페이지 공유하기' });
    await act(async () => {
      fireEvent.click(button);
    });

    expect(writeTextMock).toHaveBeenCalledTimes(1);
  });
});
