import React from 'react';
import { Info, Binary, Type, Palette } from 'lucide-react';

export const DevToolsInfoCard: React.FC = () => {
  return (
    <div className="w-full mt-6 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-ghost-hairline dark:border-ghost-dark-hairline bg-ghost-surface-deep/40 dark:bg-ghost-dark-surface-deep/30 space-y-4">
      <div className="flex items-center gap-2">
        <Info className="w-4 h-4 text-ghost-ink-mute dark:text-ghost-dark-ink-mute shrink-0" />
        <h3 className="text-xs sm:text-sm font-bold text-ghost-ink dark:text-ghost-dark-ink">
          개발자 상식 & 실무 가이드 (Dev Guide)
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-ghost-ink-soft dark:text-ghost-dark-ink-mute leading-relaxed">
        {/* 1. 진법 체계 */}
        <div className="space-y-1.5 p-3 rounded-lg bg-white dark:bg-ghost-dark-surface border border-ghost-hairline dark:border-ghost-dark-hairline">
          <div className="flex items-center gap-1.5 font-bold text-ghost-ink dark:text-ghost-dark-ink">
            <Binary className="w-3.5 h-3.5" />
            <span>진법 체계와 컴퓨터 데이터</span>
          </div>
          <p>
            컴퓨터는 0과 1로 표현되는 <strong>2진수(0b)</strong>를 기본으로 동작합니다. 16진수(0x)는 4개의 비트(1 Nibble)를 문자 1개로 압축 표기할 수 있어 메모리 주소나 색상 코드에 널리 사용됩니다.
          </p>
        </div>

        {/* 2. CSS 단위 */}
        <div className="space-y-1.5 p-3 rounded-lg bg-white dark:bg-ghost-dark-surface border border-ghost-hairline dark:border-ghost-dark-hairline">
          <div className="flex items-center gap-1.5 font-bold text-ghost-ink dark:text-ghost-dark-ink">
            <Type className="w-3.5 h-3.5" />
            <span>CSS rem과 em의 차이점</span>
          </div>
          <p>
            <strong>rem</strong>은 최상위 HTML 루트 태그(기본 16px)의 폰트 크기만을 기준으로 삼아 중첩에 의한 크기 왜곡이 없습니다. <strong>em</strong>은 직계 부모 요소의 폰트 크기에 비례합니다.
          </p>
        </div>

        {/* 3. 색상 모델 */}
        <div className="space-y-1.5 p-3 rounded-lg bg-white dark:bg-ghost-dark-surface border border-ghost-hairline dark:border-ghost-dark-hairline">
          <div className="flex items-center gap-1.5 font-bold text-ghost-ink dark:text-ghost-dark-ink">
            <Palette className="w-3.5 h-3.5" />
            <span>RGB와 HSL & WCAG 명암비</span>
          </div>
          <p>
            <strong>RGB</strong>는 빛의 3원색 가산 혼합 모델이며, <strong>HSL</strong>은 색상(0~360°), 채도(%), 명도(%)로 인간의 직관에 가장 가깝습니다. 웹 접근성(WCAG AA)은 본문 기준 4.5:1 이상의 대비를 권장합니다.
          </p>
        </div>
      </div>
    </div>
  );
};
