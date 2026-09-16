import React from 'react';
import { Lightbulb, Clock, TrendingUp, ShieldCheck } from 'lucide-react';

export const GoalInfoCard: React.FC = () => {
  return (
    <div className='bg-white dark:bg-[#1e293b] rounded-[24px] border border-[#e5e7eb] dark:border-slate-800 p-4 sm:p-6 space-y-4 shadow-2xs transition-colors w-full'>
      <div className='flex items-center gap-2 pb-3 border-b border-[#e5e7eb] dark:border-slate-800'>
        <Lightbulb className='w-4 h-4 text-[#112220] dark:text-[#d1ff19] shrink-0' />
        <h3 className='text-sm sm:text-base font-bold text-[#112220] dark:text-slate-100'>
          목표 자산 달성을 위한 핵심 재무 원칙
        </h3>
      </div>

      <div className='grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2.5 sm:gap-3 text-xs leading-relaxed'>
        <div className='p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1.5 min-w-0'>
          <div className='flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200'>
            <Clock className='w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0' />
            <span>시간이 최고의 자산</span>
          </div>
          <p className='text-slate-600 dark:text-slate-400 break-keep'>
            기간이 5년에서 10년으로 2배 늘어나면 복리의 마법으로 인해 매월 넣어야 하는 적립금 부담은 3분의 1 수준으로 줄어듭니다.
          </p>
        </div>

        <div className='p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1.5 min-w-0'>
          <div className='flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200'>
            <TrendingUp className='w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0' />
            <span>초기 시드머니의 레버리지</span>
          </div>
          <p className='text-slate-600 dark:text-slate-400 break-keep'>
            초기에 얼마라도 목돈을 거치해두면 복리로 함께 불어나 전체 목표 달성에 필요한 월 적립 부담을 크게 덜어줍니다.
          </p>
        </div>

        <div className='p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1.5 min-w-0'>
          <div className='flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200'>
            <ShieldCheck className='w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0' />
            <span>ISA 등 절세계좌 활용</span>
          </div>
          <p className='text-slate-600 dark:text-slate-400 break-keep'>
            일반 계좌의 이자소득세(15.4%) 대신 ISA(9.9%)나 비과세 혜택을 이용하면 세후 수령액이 늘어 목표를 훨씬 빠르게 달성할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};
