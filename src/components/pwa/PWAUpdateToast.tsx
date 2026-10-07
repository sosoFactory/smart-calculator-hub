import React, { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useToast } from '../../hooks/use-toast';
import { ToastAction } from '../ui/toast';
import { RefreshCw } from 'lucide-react';

export const PWAUpdateToast: React.FC = () => {
  const { toast } = useToast();
  const location = useLocation();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        // 등록 즉시 새 버전 확인
        r.update().catch(() => {});
      }
    },
    onRegisterError(error) {
      console.error('SW registration error:', error);
    },
  });

  // ServiceWorkerRegistration 상태를 검사하여 대기/설치 중인 워커 감시
  const inspectRegistration = useCallback(
    (reg: ServiceWorkerRegistration | undefined | null) => {
      if (!reg) return;

      // 1. 이미 새 버전이 대기(waiting) 중인 경우 -> 즉시 토스트 발동
      if (reg.waiting) {
        setNeedRefresh(true);
        return;
      }

      // 2. 현재 설치/다운로드 중(installing)인 경우 -> 설치 완료(installed) 시점에 즉시 토스트 발동
      if (reg.installing) {
        const installingWorker = reg.installing;
        installingWorker.addEventListener('statechange', () => {
          if (installingWorker.state === 'installed') {
            setNeedRefresh(true);
          }
        });
      }

      // 3. updatefound 이벤트 리스너 등록: 향후 새 워커가 다운로드 시작될 때 감지
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              setNeedRefresh(true);
            }
          });
        }
      });
    },
    [setNeedRefresh]
  );

  // 서버에 최신 sw.js 업데이트 확인 요청 및 상태 검사
  const checkAndUpdate = useCallback(async () => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (!reg) return;
      inspectRegistration(reg);
      await reg.update();
      inspectRegistration(reg);
    } catch {
      // 오프라인이거나 네트워크 일시 오류 시 무시
    }
  }, [inspectRegistration]);

  // 마운트 시 즉시 검사
  useEffect(() => {
    checkAndUpdate();
  }, [checkAndUpdate]);

  // 페이지/계산기 탭 이동 시 즉시 업데이트 검사
  useEffect(() => {
    checkAndUpdate();
  }, [location.pathname, checkAndUpdate]);

  // 실시간 폴링 (30초 주기)
  useEffect(() => {
    const timer = setInterval(() => {
      checkAndUpdate();
    }, 30 * 1000);

    return () => clearInterval(timer);
  }, [checkAndUpdate]);

  // 안드로이드 WebAPK/모바일 PWA 백그라운드 복귀(resume) 및 포커스 시 즉시 검사
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    const handleResume = () => {
      if (document.visibilityState === 'visible') {
        checkAndUpdate();
      }
    };

    document.addEventListener('visibilitychange', handleResume);
    window.addEventListener('focus', handleResume);

    return () => {
      document.removeEventListener('visibilitychange', handleResume);
      window.removeEventListener('focus', handleResume);
    };
  }, [checkAndUpdate]);

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

  // '지금 업데이트' 클릭 시 waiting 워커에 SKIP_WAITING 직접 전송 후 활성화
  const handleUpdate = useCallback(async () => {
    try {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg?.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      }
    } catch {
      // 무시
    }
    updateServiceWorker(true);
    setNeedRefresh(false);
  }, [updateServiceWorker, setNeedRefresh]);

  useEffect(() => {
    if (needRefresh) {
      toast({
        variant: 'lime',
        duration: Infinity,
        title: '새로운 버전이 준비되었습니다',
        description: '최신 계산 기능과 성능 최적화가 적용되었습니다.',
        action: (
          <ToastAction
            altText="지금 업데이트"
            onClick={handleUpdate}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>지금 업데이트</span>
          </ToastAction>
        ),
      });
    }
  }, [needRefresh, toast, handleUpdate]);

  return null;
};
