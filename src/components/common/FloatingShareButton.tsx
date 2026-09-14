import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../ui/tooltip';
import { useToast } from '../../hooks/use-toast';

export const FloatingShareButton: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleShare = async () => {
    if (typeof window === 'undefined') return;

    const title = document.title || '스마트 계산기 허브';
    const url = window.location.href;

    // 1. Web Share API 지원 환경(모바일 및 데스크톱)에서 브라우저 순정 공유 창 호출
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: `${title} - 스마트 계산기 허브`,
          url,
        });
        return;
      } catch (err) {
        // 사용자가 취소(AbortError)한 경우 조용히 종료
        if ((err as Error).name === 'AbortError') {
          return;
        }
      }
    }

    // 2. PC 또는 미지원 환경 폴백: 클립보드 URL 복사
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopied(true);
      toast({
        title: '공유 링크가 복사되었습니다',
        description: '원하는 곳에 붙여넣어 계산기를 공유해보세요.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: '링크 복사 실패',
        description: '브라우저 주소창의 URL을 직접 복사해주세요.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="fixed bottom-5 right-4 sm:bottom-7 sm:right-7 z-40">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            onClick={handleShare}
            className="w-12 h-12 rounded-full bg-[#15171a] dark:bg-slate-800 text-white dark:text-slate-100 hover:bg-slate-800 dark:hover:bg-slate-700 hover:text-[#d1ff19] dark:hover:text-[#d1ff19] border border-slate-700/60 dark:border-slate-700 shadow-lg shadow-black/15 dark:shadow-black/40 active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center shrink-0"
            aria-label="현재 페이지 공유하기"
          >
            {copied ? (
              <Check className="w-5 h-5 text-emerald-400 animate-in zoom-in-75 duration-150" />
            ) : (
              <Share2 className="w-5 h-5 transition-transform duration-150 active:rotate-12" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="font-medium text-xs">
          현재 페이지 공유하기
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
