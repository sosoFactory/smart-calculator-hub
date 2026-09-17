import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PWAUpdateToast } from './PWAUpdateToast';
import { useRegisterSW } from 'virtual:pwa-register/react';
import * as useToastModule from '../../hooks/use-toast';

describe('PWAUpdateToast', () => {
  const toastMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useToastModule, 'useToast').mockReturnValue({
      toasts: [],
      toast: toastMock,
      dismiss: vi.fn(),
    });
  });

  it('does not invoke toast when needRefresh is false', () => {
    vi.mocked(useRegisterSW).mockReturnValue({
      needRefresh: [false, vi.fn()],
      offlineReady: [false, vi.fn()],
      updateServiceWorker: vi.fn(),
    });

    render(<PWAUpdateToast />);

    expect(toastMock).not.toHaveBeenCalled();
  });

  it('invokes toast with update action when needRefresh is true, and clicking action triggers update', () => {
    const setNeedRefreshMock = vi.fn();
    const updateServiceWorkerMock = vi.fn();

    vi.mocked(useRegisterSW).mockReturnValue({
      needRefresh: [true, setNeedRefreshMock],
      offlineReady: [false, vi.fn()],
      updateServiceWorker: updateServiceWorkerMock,
    });

    render(<PWAUpdateToast />);

    expect(toastMock).toHaveBeenCalledTimes(1);
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'lime',
        title: '새로운 버전이 준비되었습니다',
        description: '최신 계산 기능과 성능 최적화가 적용되었습니다.',
      })
    );

    // 액션 엘리먼트 렌더링 및 인터랙션 검증
    const callArgs = toastMock.mock.calls[0][0];
    const ActionElement = callArgs.action;
    render(ActionElement);

    const updateButton = screen.getByRole('button', { name: /지금 업데이트/i });
    expect(updateButton).toBeInTheDocument();

    fireEvent.click(updateButton);
    expect(updateServiceWorkerMock).toHaveBeenCalledWith(true);
    expect(setNeedRefreshMock).toHaveBeenCalledWith(false);
  });

  it('checks for existing waiting service worker on mount and triggers needRefresh', async () => {
    const setNeedRefreshMock = vi.fn();
    vi.mocked(useRegisterSW).mockReturnValue({
      needRefresh: [false, setNeedRefreshMock],
      offlineReady: [false, vi.fn()],
      updateServiceWorker: vi.fn(),
    });

    const mockRegistration = {
      waiting: {} as ServiceWorker,
    };
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        getRegistration: vi.fn().mockResolvedValue(mockRegistration),
      },
      configurable: true,
    });

    render(<PWAUpdateToast />);

    await vi.waitFor(() => {
      expect(setNeedRefreshMock).toHaveBeenCalledWith(true);
    });
  });
});

