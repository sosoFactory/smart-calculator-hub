import React from 'react';
import { LoanComparisonSummary, RepaymentMethod } from '../../../types/loan';
import { formatKoreanLoanAmount } from '../../../utils/loanCalculator';
import { Button } from '../../../components/ui/button';

interface LoanComparisonCardProps {
  comparison: LoanComparisonSummary;
  activeMethod: RepaymentMethod;
  onSelectMethod: (method: RepaymentMethod) => void;
}

export const LoanComparisonCard: React.FC<LoanComparisonCardProps> = ({
  comparison,
  activeMethod,
  onSelectMethod,
}) => {
  const { equalPayment, equalPrincipal, bullet, interestSavingsVsEqualPayment } = comparison;

  const methods = [
    {
      id: 'equal_payment' as RepaymentMethod,
      name: '원리금균등',
      badge: '가장 대중적',
      desc: '매월 상환액이 일정하여 자금 계획 수립에 용이',
      result: equalPayment,
    },
    {
      id: 'equal_principal' as RepaymentMethod,
      name: '원금균등',
      badge: '최저 총이자',
      desc: '매달 이자가 줄어들어 3가지 중 총이자 부담이 가장 적음',
      result: equalPrincipal,
    },
    {
      id: 'bullet' as RepaymentMethod,
      name: '만기일시',
      badge: '초기부담 최소',
      desc: '만기 전까지 이자만 납입하므로 초기 현금흐름 유지에 유리',
      result: bullet,
    },
  ];

  return (
    <div className="p-4 sm:p-5 rounded-[24px] bg-slate-50 dark:bg-ghost-dark-surface border border-[#e5e7eb] dark:border-ghost-dark-hairline transition-colors space-y-4">
      {/* 상단 비교 배너 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#e5e7eb] dark:border-ghost-dark-hairline">
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs sm:text-sm font-extrabold text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap">
              3대 상환방식 동시 비교
            </span>
            {interestSavingsVsEqualPayment > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#15171a] dark:bg-[#d1ff19] text-[#d1ff19] dark:text-[#112220] whitespace-nowrap">
                원금균등 선택 시 약 {formatKoreanLoanAmount(interestSavingsVsEqualPayment)} 절약!
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#64748b] dark:text-ghost-dark-ink-mute mt-0.5 leading-relaxed">
            방식을 클릭하면 해당 상환 방식으로 즉시 전환됩니다
          </p>
        </div>
      </div>

      {/* 3개 카드 그리드 (부모 폭에 맞춰 1열/2열/3열 유동 적응하여 카드당 최소 185px 확보) */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(185px,1fr))] gap-3">
        {methods.map((item) => {
          const isSelected = activeMethod === item.id;
          const isLowest = item.id === 'equal_principal';

          return (
            <Button
              key={item.id}
              type="button"
              variant="ghost"
              onClick={() => onSelectMethod(item.id)}
              className={`@container w-full h-auto p-3.5 @xs:p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between font-normal whitespace-normal break-words overflow-hidden ${
                isSelected
                  ? 'bg-white dark:bg-ghost-dark-surface-elevated border-[#15171a] dark:border-[#d1ff19] shadow-md ring-2 ring-[#15171a]/10 dark:ring-[#d1ff19]/20 hover:bg-white dark:hover:bg-ghost-dark-surface-elevated'
                  : 'bg-white/80 dark:bg-ghost-dark-surface-deep border-[#e5e7eb] dark:border-ghost-dark-hairline hover:border-slate-300 dark:hover:border-ghost-dark-hairline-soft hover:bg-white/90 dark:hover:bg-ghost-dark-hover'
              }`}
            >
              <div className="w-full">
                {/* 1행: 상환 방식 명칭 및 뱃지 */}
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <span className="font-bold text-sm text-[#112220] dark:text-ghost-dark-ink whitespace-nowrap">
                    {item.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap ${
                      isLowest
                        ? 'bg-[#d1ff19] text-[#112220]'
                        : 'bg-slate-100 dark:bg-ghost-dark-surface-elevated text-slate-600 dark:text-ghost-dark-ink-mute'
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>

                {/* 2행: 핵심 요약 설명 문구 (인위적 가두기 없이 자연스럽게 흐르는 텍스트) */}
                <p className="text-[11px] text-slate-500 dark:text-ghost-dark-ink-mute leading-relaxed mb-3 whitespace-normal break-keep">
                  {item.desc}
                </p>
              </div>

              {/* 하단 금액 정보 (컨테이너 쿼리: 좁을 때는 세로 1열, 카드가 커지면 가로 2분할 그리드로 공간 효율화) */}
              <dl className="pt-2.5 border-t border-[#e5e7eb] dark:border-ghost-dark-hairline w-full text-xs grid grid-cols-1 @xs:grid-cols-2 gap-2 @xs:gap-3">
                <div className="flex flex-col gap-0.5">
                  <dt className="text-slate-500 dark:text-ghost-dark-ink-mute text-[11px] whitespace-nowrap">총 대출이자</dt>
                  <dd className={`font-black text-xs sm:text-sm tracking-tight ${isLowest ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#112220] dark:text-ghost-dark-ink'}`}>
                    {item.result.totalInterest.toLocaleString('ko-KR')}원
                  </dd>
                </div>
                <div className="flex flex-col gap-0.5">
                  <dt className="text-slate-500 dark:text-ghost-dark-ink-mute text-[11px] whitespace-nowrap">첫 달 상환액</dt>
                  <dd className="font-bold text-xs sm:text-sm text-[#112220] dark:text-ghost-dark-ink-base tracking-tight">
                    {item.result.firstMonthPayment.toLocaleString('ko-KR')}원
                  </dd>
                </div>
              </dl>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
