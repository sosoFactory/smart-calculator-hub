import { useState, useCallback } from 'react';

/**
 * 컴포넌트 전반에서 재사용 가능한 클립보드 복사 훅
 * @param timeout 피드백 유지 시간(ms, 기본값 1500)
 */
export function useClipboard(timeout = 1500) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = useCallback(
    async (text: string, key = 'default'): Promise<boolean> => {
      if (!text) return false;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
          setCopiedKey(key);
          setTimeout(() => {
            setCopiedKey((current) => (current === key ? null : current));
          }, timeout);
          return true;
        }
      } catch {
        // fallback for older environments
      }
      return false;
    },
    [timeout]
  );

  const isCopied = useCallback((key: string) => copiedKey === key, [copiedKey]);

  return { copiedKey, copy, isCopied };
}
