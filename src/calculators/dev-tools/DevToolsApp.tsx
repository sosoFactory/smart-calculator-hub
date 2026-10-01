import React, { useState, useEffect } from 'react';
import { DevToolsTabType } from '../../types/devTools';
import { decodeDevToolsQuery, encodeDevToolsQuery, syncUrlQuery } from '../../utils/deepLink';
import { DevToolsCategoryTabs } from './components/DevToolsCategoryTabs';
import { BaseTab } from './components/BaseTab';
import { CssUnitTab } from './components/CssUnitTab';
import { ColorTab } from './components/ColorTab';
import { DevToolsInfoCard } from './components/DevToolsInfoCard';
import { siteConfig } from '../../config/site';

const STORAGE_KEY = 'smart_calculator_dev_tools_tab_v1';

export const DevToolsApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DevToolsTabType>(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      const fromUrl = decodeDevToolsQuery(window.location.search);
      if (fromUrl?.tab) return fromUrl.tab;
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && ['base', 'css', 'color'].includes(saved)) {
        return saved as DevToolsTabType;
      }
    } catch {
      // fallback
    }
    return 'base';
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, activeTab);
    } catch {
      // ignore
    }
    const query = encodeDevToolsQuery({ tab: activeTab });
    syncUrlQuery(query);
  }, [activeTab]);

  useEffect(() => {
    document.title = siteConfig.getTitle('개발자 도구');
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6 w-full animate-page-fade">
      {/* 1. 카테고리 탭 (가로 스크롤 모바일 퍼스트 탭) */}
      <DevToolsCategoryTabs activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* 2. 활성 탭 콘텐츠 (3대 통합 탭) */}
      <div className="w-full">
        {activeTab === 'base' && <BaseTab />}
        {activeTab === 'css' && <CssUnitTab />}
        {activeTab === 'color' && <ColorTab />}
      </div>

      {/* 3. 하단 개발자 상식 안내 카드 */}
      <DevToolsInfoCard />
    </div>
  );
};

export default DevToolsApp;
