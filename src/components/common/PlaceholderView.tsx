import React from 'react';
import { CalculatorItem } from '../../types/navigation';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

interface PlaceholderViewProps {
  calculator: CalculatorItem;
  onGoToCompound: () => void;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({
  calculator,
  onGoToCompound,
}) => {
  return (
    <div className="bg-white dark:bg-ghost-dark-surface rounded-[24px] p-6 sm:p-10 border border-[#e5e7eb] dark:border-ghost-dark-hairline text-center max-w-xl mx-auto transition-colors">
      <div className="w-12 h-12 rounded-md bg-slate-100 dark:bg-ghost-dark-surface-elevated border border-[#e5e7eb] dark:border-ghost-dark-hairline-soft text-[#112220] dark:text-ghost-dark-ink flex items-center justify-center mx-auto mb-4">
        <Clock className="w-6 h-6 text-[#112220] dark:text-[#d1ff19]" />
      </div>

      <div className="inline-block mb-3">
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-sm bg-[#d1ff19] text-[#112220] uppercase tracking-widest">
          COMING SOON
        </span>
      </div>

      <h2 className="text-xl sm:text-2xl font-black text-[#112220] dark:text-ghost-dark-ink mb-2">
        {calculator.name} 출시 준비 중
      </h2>

      <p className="text-sm text-[#475569] dark:text-ghost-dark-ink-mute mb-6 leading-relaxed">
        {calculator.description}
      </p>

      {/* 준비 중인 기능 안내 박스 */}
      <div className="bg-slate-50 dark:bg-ghost-dark-surface-deep border border-[#e5e7eb] dark:border-ghost-dark-hairline-soft rounded-xl p-4 mb-6 text-left text-xs sm:text-sm space-y-2">
        <div className="font-bold text-[#112220] dark:text-ghost-dark-ink-base flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#d1ff19]" />
          <span>준비 중인 주요 기능</span>
        </div>
        {calculator.id === 'dividend' && (
          <ul className="list-disc list-inside space-y-1 text-[#64748b] dark:text-ghost-dark-ink-mute">
            <li>월별/분기별 예상 배당금 캘린더 및 흐름 시뮬레이션</li>
            <li>배당소득세(15.4%) 및 금융소득종합과세(2,000만원) 자동 계산</li>
            <li>배당 재투자(DRIP) 시 복리 증식 효과 분석</li>
          </ul>
        )}
        {calculator.id === 'goal' && (
          <ul className="list-disc list-inside space-y-1 text-[#64748b] dark:text-ghost-dark-ink-mute">
            <li>목표 자산(1억/10억 만들기) 달성을 위한 필요 월 저축액 역산</li>
            <li>수익률 및 투자 기간별 필요 자본금 시뮬레이션</li>
            <li>단계별 달성 마일스톤 및 로드맵 가이드</li>
          </ul>
        )}
      </div>

      <Button
        type="button"
        onClick={onGoToCompound}
        className="inline-flex items-center justify-center gap-2 h-[39px] px-5 bg-[#15171a] hover:bg-[#1f2937] dark:bg-white dark:hover:bg-slate-100 text-white dark:text-[#112220] active:scale-[0.98] text-sm font-semibold rounded-md transition-colors"
      >
        <span>지금 이용 가능한 연복리 계산기 사용하기</span>
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};
