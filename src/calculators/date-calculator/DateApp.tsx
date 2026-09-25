import React, { useState, useEffect } from 'react';
import { DateTabType } from '../../types/date';
import { DDayTab } from './components/DDayTab';
import { DateDiffTab } from './components/DateDiffTab';
import { DateCalcTab } from './components/DateCalcTab';
import { AgeTab } from './components/AgeTab';
import { DateInfoCard } from './components/DateInfoCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { siteConfig } from '../../config/site';

export const DateApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DateTabType>('dday');

  useEffect(() => {
    document.title = siteConfig.getTitle('날짜 & 디데이 계산기');
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6 w-full animate-page-fade">
      {/* 4단 탭 인터페이스 */}
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as DateTabType)} className="w-full">
        <TabsList className="grid grid-cols-4 w-full h-11 p-1 bg-slate-100 dark:bg-ghost-dark-surface rounded-xl border border-slate-200/80 dark:border-ghost-dark-hairline">
          <TabsTrigger
            value="dday"
            className="text-xs sm:text-sm font-bold rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-ghost-dark-surface-elevated data-[state=active]:text-[#112220] dark:data-[state=active]:text-[#d1ff19] data-[state=active]:shadow-xs transition-all"
          >
            디데이·기념일
          </TabsTrigger>
          <TabsTrigger
            value="diff"
            className="text-xs sm:text-sm font-bold rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-ghost-dark-surface-elevated data-[state=active]:text-[#112220] dark:data-[state=active]:text-[#d1ff19] data-[state=active]:shadow-xs transition-all"
          >
            날짜 간격
          </TabsTrigger>
          <TabsTrigger
            value="calc"
            className="text-xs sm:text-sm font-bold rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-ghost-dark-surface-elevated data-[state=active]:text-[#112220] dark:data-[state=active]:text-[#d1ff19] data-[state=active]:shadow-xs transition-all"
          >
            날짜 계산
          </TabsTrigger>
          <TabsTrigger
            value="age"
            className="text-xs sm:text-sm font-bold rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-ghost-dark-surface-elevated data-[state=active]:text-[#112220] dark:data-[state=active]:text-[#d1ff19] data-[state=active]:shadow-xs transition-all"
          >
            만 나이
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dday" className="mt-4 sm:mt-6 focus-visible:outline-none">
          <DDayTab />
        </TabsContent>

        <TabsContent value="diff" className="mt-4 sm:mt-6 focus-visible:outline-none">
          <DateDiffTab />
        </TabsContent>

        <TabsContent value="calc" className="mt-4 sm:mt-6 focus-visible:outline-none">
          <DateCalcTab />
        </TabsContent>

        <TabsContent value="age" className="mt-4 sm:mt-6 focus-visible:outline-none">
          <AgeTab />
        </TabsContent>
      </Tabs>

      {/* 하단 날짜 상식 안내 카드 */}
      <DateInfoCard />
    </div>
  );
};

export default DateApp;
