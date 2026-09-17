import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Share2, PlusSquare, Monitor, Smartphone, CheckCircle2, Download } from 'lucide-react';
import { Button } from '../ui/button';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall?: () => void;
  isInstallable?: boolean;
}

/**
  * PWA 설치 가이드 및 직접 설치 모달 컴포넌트
  * - React Portal(document.body)을 적용하여 부모 컨테이너의 z-index/stacking context를 탈출하고 전역 최상위(z-[100])로 노출
  * - 네이티브 설치 지원 시 모달 내부에서 즉시 [지금 앱 설치하기] 버튼 제공
  * - iOS Safari 및 데스크톱 환경별 맞춤 가이드 제공
  */
export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  onInstall,
  isInstallable = false,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  // OS / 브라우저 환경 감지
  const isIOS =
    typeof navigator !== 'undefined' &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-install-title"
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white dark:bg-ghost-dark-surface border border-[#e5e7eb] dark:border-ghost-dark-hairline shadow-2xl p-6 text-[#112220] dark:text-ghost-dark-ink animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src="/logo.svg"
            alt="스마트 계산기 로고"
            className="w-11 h-11 shrink-0 object-contain"
          />
          <div>
            <h3 id="pwa-install-title" className="text-base sm:text-lg font-bold tracking-tight">
              {isInstallable && onInstall ? '스마트 계산기 앱 간편 설치' : '스마트 계산기 앱 설치 안내'}
            </h3>
            <p className="text-xs text-[#64748b] dark:text-ghost-dark-ink-mute">
              {isInstallable && onInstall
                ? '기기에 앱을 설치하여 브라우저 주소창 없이 풀스크린으로 더 빠르고 쾌적하게 이용하세요.'
                : '홈 화면에 추가하면 브라우저 주소창 없이 풀스크린으로 더 빠르고 편리하게 사용할 수 있습니다.'}
            </p>
          </div>
        </div>

        {/* 혜택 안내 */}
        <div className="bg-slate-50 dark:bg-ghost-dark-surface-deep rounded-xl p-3.5 border border-[#e5e7eb] dark:border-ghost-dark-hairline mb-5 space-y-1.5 text-xs text-slate-600 dark:text-ghost-dark-ink-soft">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#112220] dark:text-[#d1ff19] shrink-0" />
            <span>브라우저 주소창 없이 네이티브 앱처럼 풀스크린 실행</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#112220] dark:text-[#d1ff19] shrink-0" />
            <span>비행기 모드나 인터넷 연결이 없어도 모든 계산 즉시 가능</span>
          </div>
        </div>

        {/* 설치 방법 / 안내 섹션 (직접 설치 지원 시 원클릭 안내, 미지원 시 플랫폼별 수동 가이드) */}
        {isInstallable && onInstall ? (
          <div className="rounded-xl p-3.5 bg-slate-50/80 dark:bg-ghost-dark-surface-deep border border-[#e5e7eb] dark:border-ghost-dark-hairline mb-5 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#112220] dark:text-ghost-dark-ink-base">
              <Download className="w-4 h-4 text-[#112220] dark:text-[#d1ff19] shrink-0" />
              <span>원클릭 앱 설치 지원 브라우저</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-ghost-dark-ink-soft pl-6 leading-relaxed">
              아래 <strong className="text-[#112220] dark:text-white">[지금 설치하기]</strong> 버튼을 누르면 브라우저 설치 대화상자가 즉시 열려 홈 화면 또는 데스크톱에 바로 설치됩니다.
            </p>
          </div>
        ) : isIOS ? (
          <div className="space-y-3 mb-5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#112220] dark:text-ghost-dark-ink-base">
              <Smartphone className="w-4 h-4 text-[#112220] dark:text-ghost-dark-ink-base" />
              <span>iOS 사파리(Safari) 설치 방법</span>
            </div>
            <ol className="space-y-2.5 text-xs text-slate-600 dark:text-ghost-dark-ink-soft pl-1">
              <li className="flex items-start gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 dark:bg-ghost-dark-surface-elevated text-[11px] font-bold shrink-0 mt-0.5">1</span>
                <span>
                  사파리 화면 하단의 <strong className="text-[#112220] dark:text-white inline-flex items-center gap-1 mx-0.5"><Share2 className="w-3.5 h-3.5" /> 공유</strong> 버튼을 누릅니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 dark:bg-ghost-dark-surface-elevated text-[11px] font-bold shrink-0 mt-0.5">2</span>
                <span>
                  메뉴를 아래로 스크롤하여 <strong className="text-[#112220] dark:text-white inline-flex items-center gap-1 mx-0.5"><PlusSquare className="w-3.5 h-3.5" /> [홈 화면에 추가]</strong>를 누릅니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 dark:bg-ghost-dark-surface-elevated text-[11px] font-bold shrink-0 mt-0.5">3</span>
                <span>우측 상단의 <strong>[추가]</strong>를 누르면 홈 화면에 계산기 앱이 설치됩니다.</span>
              </li>
            </ol>
          </div>
        ) : (
          <div className="space-y-3 mb-5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#112220] dark:text-ghost-dark-ink-base">
              <Monitor className="w-4 h-4 text-[#112220] dark:text-ghost-dark-ink-base" />
              <span>데스크톱 PC / 안드로이드 설치 방법</span>
            </div>
            <ol className="space-y-2.5 text-xs text-slate-600 dark:text-ghost-dark-ink-soft pl-1">
              <li className="flex items-start gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 dark:bg-ghost-dark-surface-elevated text-[11px] font-bold shrink-0 mt-0.5">1</span>
                <span>
                  크롬 / 엣지 브라우저 주소창 우측 상단의 <strong className="text-[#112220] dark:text-white">[설치 ⊕]</strong> 아이콘을 클릭합니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 dark:bg-ghost-dark-surface-elevated text-[11px] font-bold shrink-0 mt-0.5">2</span>
                <span>안드로이드는 브라우저 우측 상단 메뉴(⋮)에서 <strong>[홈 화면에 추가]</strong>를 선택합니다.</span>
              </li>
            </ol>
          </div>
        )}

        {/* 하단 액션 버튼 영역 */}
        {isInstallable && onInstall ? (
          <div className="space-y-2 pt-2 border-t border-[#e5e7eb] dark:border-ghost-dark-hairline">
            <Button
              type="button"
              onClick={() => {
                onInstall();
                onClose();
              }}
              className="w-full h-11 rounded-xl bg-[#15171a] dark:bg-[#d1ff19] text-white dark:text-[#112220] hover:bg-slate-800 dark:hover:bg-[#bceb0f] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>스마트 계산기 앱 지금 설치하기</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="w-full h-8 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-ghost-dark-ink-base"
            >
              닫기
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            onClick={onClose}
            className="w-full h-10 rounded-xl bg-[#15171a] dark:bg-white text-white dark:text-[#112220] hover:bg-slate-800 dark:hover:bg-slate-100 font-bold text-xs"
          >
            가이드 확인 완료
          </Button>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

