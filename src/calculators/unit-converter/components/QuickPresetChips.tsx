import React from 'react';
import { QuickPreset, UnitCategory } from '../../../types/unit';
import { QUICK_PRESETS } from '../../../utils/unitConverter';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

interface QuickPresetChipsProps {
  category: UnitCategory;
  onSelectPreset: (preset: QuickPreset) => void;
}

export const QuickPresetChips: React.FC<QuickPresetChipsProps> = ({
  category,
  onSelectPreset,
}) => {
  const presets = QUICK_PRESETS.filter((p) => p.category === category);

  if (presets.length === 0) return null;

  return (
    <div className="bg-white dark:bg-ghost-dark-surface rounded-[24px] border border-[#e5e7eb] dark:border-ghost-dark-hairline p-4 sm:p-5 space-y-2.5 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#64748b] dark:text-ghost-dark-ink-mute uppercase tracking-wider">
          자주 찾는 생활 프리셋
        </span>
        <span className="text-[11px] text-[#94a3b8] dark:text-ghost-dark-ink-stone">원클릭 자동 입력</span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onSelectPreset(preset)}
            className="h-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-ghost-dark-surface-deep border border-[#e5e7eb] dark:border-ghost-dark-hairline-soft hover:border-[#15171a] dark:hover:border-[#d1ff19] hover:bg-white dark:hover:bg-ghost-dark-hover text-[#112220] dark:text-ghost-dark-ink-base transition-all cursor-pointer shadow-2xs"
          >
            <span className="pt-[0.5px] leading-normal">{preset.label}</span>
            {preset.badge && (
              <Badge
                variant={preset.badge === '인기' ? 'eyebrow' : 'outline'}
                className="text-[9px] px-1 py-0 h-4"
              >
                {preset.badge}
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};
