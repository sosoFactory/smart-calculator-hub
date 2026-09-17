import React from 'react';
import { UnitCategory } from '../../../types/unit';
import { UNIT_CATEGORIES } from '../../../utils/unitConverter';
import { Square, Ruler, Scale, Box, Thermometer } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs';

interface UnitCategoryTabsProps {
  activeCategory: UnitCategory;
  onSelectCategory: (category: UnitCategory) => void;
}

export const UnitCategoryTabs: React.FC<UnitCategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const getIcon = (cat: UnitCategory, isActive: boolean) => {
    const cls = `w-4 h-4 shrink-0 transition-colors ${
      isActive ? 'text-[#d1ff19]' : 'text-slate-500 dark:text-ghost-dark-ink-mute group-hover:text-slate-800 dark:group-hover:text-slate-200'
    }`;
    switch (cat) {
      case 'area':
        return <Square className={cls} />;
      case 'length':
        return <Ruler className={cls} />;
      case 'weight':
        return <Scale className={cls} />;
      case 'volume':
        return <Box className={cls} />;
      case 'temperature':
        return <Thermometer className={cls} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-1 scrollbar-none">
      <Tabs
        value={activeCategory}
        onValueChange={(val) => onSelectCategory(val as UnitCategory)}
        className="w-full min-w-max"
      >
        <TabsList
          variant="slate-solid"
          size="auto"
          className="flex items-center justify-start gap-1.5 p-1 bg-slate-100/80 dark:bg-ghost-dark-surface-deep rounded-xl border border-[#e5e7eb] dark:border-ghost-dark-hairline w-full min-w-max transition-colors"
        >
          {UNIT_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="group h-auto flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-xs font-semibold transition-all duration-150 cursor-pointer text-[#475569] dark:text-ghost-dark-ink-mute hover:bg-white/80 dark:hover:bg-ghost-dark-hover hover:text-[#112220] dark:hover:text-white data-[state=active]:bg-[#15171a] hover:data-[state=active]:bg-[#2e3238] dark:data-[state=active]:bg-ghost-dark-surface-elevated dark:hover:data-[state=active]:bg-ghost-dark-hairline data-[state=active]:text-white dark:data-[state=active]:text-white data-[state=active]:shadow-xs border data-[state=active]:border-[#e5e7eb] dark:data-[state=active]:border-ghost-dark-hairline-soft"
              >
                {getIcon(cat.id, isActive)}
                <span className="pt-[1px] leading-normal">{cat.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d1ff19] ml-0.5" />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
};
