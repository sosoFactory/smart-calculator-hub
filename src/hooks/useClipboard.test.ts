import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useClipboard } from './useClipboard';

describe('useClipboard Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('기본 상태에서는 copiedKey가 null이다', () => {
    const { result } = renderHook(() => useClipboard());
    expect(result.current.copiedKey).toBeNull();
    expect(result.current.isCopied('hex')).toBe(false);
  });

  it('copy 호출 시 클립보드에 텍스트를 복사하고 copiedKey를 설정한다', async () => {
    const { result } = renderHook(() => useClipboard(1500));

    let success = false;
    await act(async () => {
      success = await result.current.copy('#d1ff19', 'hex');
    });

    expect(success).toBe(true);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('#d1ff19');
    expect(result.current.copiedKey).toBe('hex');
    expect(result.current.isCopied('hex')).toBe(true);

    // 1500ms 후 초기화
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(result.current.copiedKey).toBeNull();
    expect(result.current.isCopied('hex')).toBe(false);
  });

  it('빈 문자열일 경우 복사를 실행하지 않고 false를 반환한다', async () => {
    const { result } = renderHook(() => useClipboard());

    let success = true;
    await act(async () => {
      success = await result.current.copy('', 'empty');
    });

    expect(success).toBe(false);
    expect(result.current.copiedKey).toBeNull();
  });
});
