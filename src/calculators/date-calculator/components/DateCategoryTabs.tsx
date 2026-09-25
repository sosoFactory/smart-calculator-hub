import React from 'react';
import { DateTabType } from '../../../types/date';
import { CalendarHeart, CalendarRange, UserCheck } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs';

export interface DateCategoryTabItem {
  id: DateTabType;
  label: string;
}

export const DATE_TABS: DateCategoryTabItem[] = [
  { id: 'dday', label: '디데이·날짜 연산' },
  { id: 'diff', label: '날짜 간격' },
  { id: 'age', label: '만 나이' },
];

interface DateCategoryTabsProps {
  activeTab: DateTabType;
  onSelectTab: (tab: DateTabType) => void;
}

export const DateCategoryTabs: React.FC<DateCategoryTabsProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const getIcon = (tab: DateTabType, isActive: boolean) => {
    const cls = `w-4 h-4 shrink-0 transition-colors ${
      isActive
        ? 'text-[#d1ff19]'
        : 'text-slate-500 dark:text-ghost-dark-ink-mute group-hover:text-slate-800 dark:group-hover:text-slate-200'
    }`;
    switch (tab) {
      case 'dday':
        return <CalendarHeart className={cls} />;
      case 'diff':
        return <CalendarRange className={cls} />;
      case 'age':
        return <UserCheck className={cls} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-1 scrollbar-none">
      <Tabs
        value={activeTab}
        onValueChange={(val) => onSelectTab(val as DateTabType)}
        className="w-full min-w-max"
      >
        <TabsList
          variant="slate-solid"
          size="auto"
          className="flex items-center justify-start gap-1.5 p-1 bg-slate-100/80 dark:bg-ghost-dark-surface-deep rounded-xl border border-[#e5e7eb] dark:border-ghost-dark-hairline w-full min-w-max transition-colors"
        >
          {DATE_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="group h-auto flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-xs font-semibold transition-all duration-150 cursor-pointer text-[#475569] dark:text-ghost-dark-ink-mute hover:bg-white/80 dark:hover:bg-ghost-dark-hover hover:text-[#112220] dark:hover:text-white data-[state=active]:bg-[#15171a] hover:data-[state=active]:bg-[#2e3238] dark:data-[state=active]:bg-ghost-dark-surface-elevated dark:hover:data-[state=active]:bg-ghost-dark-hairline data-[state=active]:text-white dark:data-[state=active]:text-white data-[state=active]:shadow-xs border data-[state=active]:border-[#e5e7eb] dark:data-[state=active]:border-ghost-dark-hairline-soft"
              >
                {getIcon(tab.id, isActive)}
                <span className="pt-[1px] leading-normal">{tab.label}</span>
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
