import React from 'react';
import { DevToolsTabType } from '../../../types/devTools';
import { Binary, Ruler, Palette } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs';

export interface DevToolsTabItem {
  id: DevToolsTabType;
  label: string;
}

export const DEV_TOOLS_TABS: DevToolsTabItem[] = [
  { id: 'base', label: '진수 변환' },
  { id: 'css', label: 'CSS 단위 환산' },
  { id: 'color', label: '색상 코드 변환' },
];

interface DevToolsCategoryTabsProps {
  activeTab: DevToolsTabType;
  onSelectTab: (tab: DevToolsTabType) => void;
}

export const DevToolsCategoryTabs: React.FC<DevToolsCategoryTabsProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const getIcon = (tab: DevToolsTabType, isActive: boolean) => {
    const cls = `w-4 h-4 shrink-0 transition-colors ${
      isActive
        ? 'text-ghost-lime'
        : 'text-slate-500 dark:text-ghost-dark-ink-mute group-hover:text-slate-800 dark:group-hover:text-slate-200'
    }`;
    switch (tab) {
      case 'base':
        return <Binary className={cls} />;
      case 'css':
        return <Ruler className={cls} />;
      case 'color':
        return <Palette className={cls} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-1 scrollbar-none">
      <Tabs
        value={activeTab}
        onValueChange={(val) => onSelectTab(val as DevToolsTabType)}
        className="w-full min-w-max"
      >
        <TabsList
          variant="slate-solid"
          size="auto"
          className="flex items-center justify-start gap-1.5 p-1 bg-slate-100/80 dark:bg-ghost-dark-surface-deep rounded-xl border border-ghost-hairline dark:border-ghost-dark-hairline w-full min-w-max transition-colors"
        >
          {DEV_TOOLS_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className="group h-auto flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-xs font-semibold transition-all duration-150 cursor-pointer text-ghost-ink-soft dark:text-ghost-dark-ink-mute hover:bg-white/80 dark:hover:bg-ghost-dark-hover hover:text-ghost-ink dark:hover:text-white data-[state=active]:bg-ghost-surface-elevated hover:data-[state=active]:bg-slate-800 dark:data-[state=active]:bg-ghost-dark-surface-elevated dark:hover:data-[state=active]:bg-ghost-dark-hairline data-[state=active]:text-white dark:data-[state=active]:text-white data-[state=active]:shadow-xs border data-[state=active]:border-ghost-hairline dark:data-[state=active]:border-ghost-dark-hairline-soft"
              >
                {getIcon(tab.id, isActive)}
                <span className="pt-[1px] leading-normal">{tab.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-ghost-lime ml-0.5" />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
};
