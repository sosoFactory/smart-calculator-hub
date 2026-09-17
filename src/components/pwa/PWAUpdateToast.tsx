import React, { useEffect } from 'react';
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
        // 앱 시작 즉시 최신 배포 여부 점검
        r.update();

        // 30분마다 서비스 워커 업데이트 주기적 점검
        setInterval(() => {
          r.update();
        }, 30 * 60 * 1000);

        // 사용자가 백그라운드 탭에서 복귀 시 최신 배포 여부 점검
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            r.update();
          }
        });
      }
    },
    onRegisterError(error) {
      console.error('SW registration error:', error);
    },
  });

  // 컴포넌트 마운트 시 이미 대기(waiting) 중인 서비스 워커가 있는지 즉시 검사
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg?.waiting) {
          setNeedRefresh(true);
        }
      });
    }
  }, [setNeedRefresh]);

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
