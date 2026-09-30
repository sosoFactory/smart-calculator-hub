import React, { useEffect, useCallback } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useToast } from '../../hooks/use-toast';
import { ToastAction } from '../ui/toast';
import { RefreshCw } from 'lucide-react';

export const PWAUpdateToast: React.FC = () => {
  const { toast } = useToast();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        // 1. 등록 즉시 새 버전 확인
        r.update().catch(() => {});

        // 2. 안드로이드 백그라운드 다운로드 완료(installed) 시 실시간 감지
        if (typeof r.addEventListener === 'function') {
          r.addEventListener('updatefound', () => {
            const installingWorker = r.installing;
            if (installingWorker && typeof installingWorker.addEventListener === 'function') {
              installingWorker.addEventListener('statechange', () => {
                if (installingWorker.state === 'installed' && navigator?.serviceWorker?.controller) {
                  setNeedRefresh(true);
                }
              });
            }
          });
        }

        // 3. 주기적 업데이트 검사 (30분)
        setInterval(() => {
          r.update().catch(() => {});
        }, 30 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('SW registration error:', error);
    },
  });

  // 대기(waiting) 중인 서비스 워커 검사 함수
  const checkWaitingWorker = useCallback(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg?.waiting) {
          setNeedRefresh(true);
        }
      });
    }
  }, [setNeedRefresh]);

  // 마운트 시 즉시 검사
  useEffect(() => {
    checkWaitingWorker();
  }, [checkWaitingWorker]);

  // 안드로이드 WebAPK/모바일 PWA 백그라운드 복귀(resume) 및 포커스 시 즉시 검사
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    const handleResume = () => {
      if (document.visibilityState === 'visible') {
        checkWaitingWorker();
        navigator.serviceWorker.getRegistration().then((reg) => {
          reg?.update().catch(() => {});
        });
      }
    };

    document.addEventListener('visibilitychange', handleResume);
    window.addEventListener('focus', handleResume);

    return () => {
      document.removeEventListener('visibilitychange', handleResume);
      window.removeEventListener('focus', handleResume);
    };
  }, [checkWaitingWorker]);

  // 컨트롤러 변경 시(새 버전 활성화 완료 시) 클라이언트 자동 새로고침 보장
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator) ||
      typeof navigator.serviceWorker.addEventListener !== 'function'
    ) {
      return;
    }

    let refreshing = false;
    const handleControllerChange = () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    };

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
    return () => {
      if (typeof navigator.serviceWorker.removeEventListener === 'function') {
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      }
    };
  }, []);

  useEffect(() => {
    if (needRefresh) {
      toast({
        variant: 'lime',
        title: '새로운 버전이 준비되었습니다',
        description: '최신 계산 기능과 성능 최적화가 적용되었습니다.',
        action: (
          <ToastAction
            altText="지금 업데이트"
            onClick={() => {
              updateServiceWorker(true);
              setNeedRefresh(false);
            }}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>지금 업데이트</span>
          </ToastAction>
        ),
      });
    }
  }, [needRefresh, toast, updateServiceWorker, setNeedRefresh]);

  return null;
};
