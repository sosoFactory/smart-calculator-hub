import React, { useState, useEffect } from 'react';
import { DateTabType } from '../../types/date';
import { DateCategoryTabs } from './components/DateCategoryTabs';
import { DDayTab } from './components/DDayTab';
import { DateDiffTab } from './components/DateDiffTab';
import { AgeTab } from './components/AgeTab';
import { DateInfoCard } from './components/DateInfoCard';
import { siteConfig } from '../../config/site';

const STORAGE_KEY = 'smart_calculator_date_tab_v1';

export const DateApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DateTabType>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && ['dday', 'diff', 'age'].includes(saved)) {
        return saved as DateTabType;
      }
    } catch {
      // fallback
    }
    return 'dday';
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, activeTab);
    } catch {
      // ignore
    }
  }, [activeTab]);

  useEffect(() => {
    document.title = siteConfig.getTitle('날짜 & 디데이 계산기');
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6 w-full animate-page-fade">
      {/* 1. 카테고리 탭 (단위 변환기 표준과 100% 동일한 가로 스크롤 모바일 퍼스트 탭) */}
      <DateCategoryTabs activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* 2. 활성 탭 콘텐츠 (3대 통합 탭) */}
      <div className="w-full">
        {activeTab === 'dday' && <DDayTab />}
        {activeTab === 'diff' && <DateDiffTab />}
        {activeTab === 'age' && <AgeTab />}
      </div>

      {/* 3. 하단 날짜 상식 안내 카드 */}
      <DateInfoCard />
    </div>
  );
};

export default DateApp;


