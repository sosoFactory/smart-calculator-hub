import React, { useState } from 'react';
import {
  PartTimeInput,
  PartTimeTaxType,
  MINIMUM_WAGE_2026,
  MINIMUM_WAGE_2025,
} from '../../../types/partTime';
import { NumericInput } from '../../../components/ui/numeric-input';
import { Slider } from '../../../components/ui/slider';
import { SelectableChip } from '../../../components/ui/selectable-chip';
import { Badge } from '../../../components/ui/badge';
import { FormHeader } from '../../../components/common/FormHeader';
import { Clock, ChevronDown, ChevronUp, Building2 } from 'lucide-react';
import { formatNumberWithWon } from '../../../utils/formatters';

interface PartTimeFormProps {
  input: PartTimeInput;
  onChange: (updated: PartTimeInput) => void;
  onReset: () => void;
}

const WAGE_PRESETS = [
  { label: '2026 최저', value: MINIMUM_WAGE_2026 },
  { label: '2025 최저', value: MINIMUM_WAGE_2025 },
  { label: '11,000원', value: 11_000 },
  { label: '12,000원', value: 12_000 },
  { label: '15,000원', value: 15_000 },
];

const HOUR_PRESETS = [
  { label: '14시간', value: 14 },
  { label: '15시간', value: 15 },
  { label: '20시간', value: 20 },
  { label: '30시간', value: 30 },
  { label: '40시간', value: 40 },
];

const TAX_OPTIONS: { id: PartTimeTaxType; label: string; desc: string }[] = [
  { id: 'none', label: '미적용 (0%)', desc: '세전 총액 100% 수령' },
  { id: 'freelancer', label: '프리랜서 (3.3%)', desc: '사업소득세 3% + 지방소득세 0.3%' },
  { id: 'four_insurances', label: '4대보험 (약 9.4%)', desc: '월 60시간 이상 근무 시 의무 가입' },
];

export const PartTimeForm: React.FC<PartTimeFormProps> = ({ input, onChange, onReset }) => {
  const [showAdditionalPay, setShowAdditionalPay] = useState(false);
  const weeklyHours = input.weeklyWorkHours;

  return (
    <div className="@container bg-white dark:bg-ghost-dark-surface p-5 sm:p-6 rounded-[24px] border border-[#e5e7eb] dark:border-ghost-dark-hairline shadow-sm transition-colors space-y-5 sm:space-y-6">
      {/* 1. 폼 상단 헤더 및 초기화 버튼 */}
      <FormHeader
        badge="알바 설계"
        title="알바 근무 조건 입력"
        description="시급과 근무 시간을 입력하면 주휴수당과 실수령액이 즉시 계산됩니다"
        onReset={onReset}
      />

      {/* 1. 시급 입력 */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label htmlFor="hourlyWage" className="text-xs sm:text-sm font-bold text-[#112220] dark:text-ghost-dark-ink">
            시간당 시급 (원)
          </label>
          <span className="text-xs font-semibold text-[#112220] dark:text-ghost-dark-ink-base">
            {formatNumberWithWon(input.hourlyWage)}
          </span>
        </div>

        <NumericInput
          id="hourlyWage"
          value={input.hourlyWage}
          placeholder="0"
          thousandSeparator
          suffix="원"
          onNumberChange={(val) => onChange({ ...input, hourlyWage: val })}
        />

        {/* 시급 원클릭 프리셋 칩 (표준 SelectableChip flex-wrap) */}
        <div className="flex flex-wrap gap-1.5 pt-1.5">
          {WAGE_PRESETS.map((preset) => (
            <SelectableChip
              key={preset.value}
              isSelected={input.hourlyWage === preset.value}
              onClick={() => onChange({ ...input, hourlyWage: preset.value })}
              size="sm"
            >
              {preset.label}
            </SelectableChip>
          ))}
        </div>
      </div>

      {/* 2. 주간 총 근로시간 단일 입력 (PRD 2.3.3절 표준) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-[#112220] dark:text-ghost-dark-ink">
            1주 총 근로시간
          </label>
          <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            주 {weeklyHours}시간 근로
          </span>
        </div>

        {/* 풀 와이드 단독 슬라이더 */}
        <div className="space-y-2 pt-1">
          <Slider
            value={[weeklyHours]}
            onValueChange={([val]) => onChange({ ...input, weeklyWorkHours: val })}
            min={1}
            max={52}
            step={1}
          />
          <div className="flex justify-between text-[11px] text-[#94a3b8] dark:text-ghost-dark-ink-stone">
            <span>1시간</span>
            <span className="text-amber-500 font-medium">15h (주휴 기준선)</span>
            <span>40h (법정)</span>
            <span>52시간 (최대)</span>
          </div>
        </div>

        {/* 원클릭 빠른 시간 프리셋 칩 (표준 SelectableChip flex-wrap) */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {HOUR_PRESETS.map((preset) => (
            <SelectableChip
              key={preset.value}
              isSelected={weeklyHours === preset.value}
              onClick={() => onChange({ ...input, weeklyWorkHours: preset.value })}
              size="sm"
            >
              {preset.label}
            </SelectableChip>
          ))}
        </div>

        {/* 주 15시간 여부 실시간 안내 배너 */}
        <div
          className={`px-3 py-2 rounded-xl text-xs flex items-center justify-between border transition-all ${
            weeklyHours >= 15
              ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span className="font-semibold">
              {weeklyHours >= 15
                ? '주 15시간 이상 근무 ➔ 주휴수당 발생 대상입니다'
                : '주 15시간 미만 근무 ➔ 주휴수당이 발생하지 않습니다 (초단시간)'}
            </span>
          </div>
          <span className="text-[11px] font-bold shrink-0">
            {weeklyHours >= 15 ? '주휴 유급 인정' : '기본시급만 지급'}
          </span>
        </div>
      </div>

      {/* 3. 세금 및 공제 방식 선택 */}
      <div className="space-y-2">
        <label className="text-xs sm:text-sm font-bold text-[#112220] dark:text-ghost-dark-ink">
          세금 및 공제 방식
        </label>
        <div className="grid grid-cols-3 gap-2">
          {TAX_OPTIONS.map((tax) => (
            <SelectableChip
              key={tax.id}
              isSelected={input.taxType === tax.id}
              onClick={() => onChange({ ...input, taxType: tax.id })}
              className="h-auto py-2 text-xs sm:text-sm font-semibold justify-center text-center"
            >
              {tax.label}
            </SelectableChip>
          ))}
        </div>
        <p className="text-[11px] text-[#64748b] dark:text-ghost-dark-ink-mute pl-0.5">
          {TAX_OPTIONS.find((t) => t.id === input.taxType)?.desc}
        </p>
      </div>

      {/* 4. 가산수당 및 5인 이상 사업장 옵션 (접이식 아코디언) */}
      <div className="border-t border-[#e5e7eb] dark:border-ghost-dark-hairline pt-3">
        <button
          type="button"
          onClick={() => setShowAdditionalPay(!showAdditionalPay)}
          className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-[#112220] dark:text-ghost-dark-ink hover:text-emerald-600 dark:hover:text-ghost-lime transition-colors py-1 cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-[#64748b] dark:text-ghost-dark-ink-mute" />
            <span>가산수당 옵션 (연장·야간·휴일 1.5배)</span>
            {input.isOver5Employees && (
              <Badge variant="eyebrow" className="text-[9px] px-1 py-0 h-4">
                5인 이상 적용중
              </Badge>
            )}
          </div>
          {showAdditionalPay ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdditionalPay && (
          <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-ghost-dark-surface-deep border border-[#e5e7eb] dark:border-ghost-dark-hairline space-y-4 transition-all">
            {/* 5인 이상 사업장 토글 */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#112220] dark:text-ghost-dark-ink">
                  상시 근로자 5인 이상 사업장
                </span>
                <p className="text-[11px] text-[#64748b] dark:text-ghost-dark-ink-mute">
                  법정 연장·야간·휴일 가산수당(50%)은 5인 이상 사업장에만 적용됩니다
                </p>
              </div>
              <div className="flex items-center gap-1">
                <SelectableChip
                  isSelected={input.isOver5Employees}
                  onClick={() => onChange({ ...input, isOver5Employees: true })}
                  className="py-1 px-2.5 text-xs font-semibold"
                >
                  5인 이상
                </SelectableChip>
                <SelectableChip
                  isSelected={!input.isOver5Employees}
                  onClick={() => onChange({ ...input, isOver5Employees: false })}
                  className="py-1 px-2.5 text-xs font-semibold"
                >
                  5인 미만
                </SelectableChip>
              </div>
            </div>

            {input.isOver5Employees && (
              <div className="space-y-3 pt-2 border-t border-[#e5e7eb] dark:border-ghost-dark-hairline">
                {/* 주간 연장근로 시간 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-[#64748b] dark:text-ghost-dark-ink-mute">
                    <span>주간 연장근로 시간 (1일 8h / 주 40h 초과)</span>
                    <span className="font-bold text-[#112220] dark:text-ghost-dark-ink">
                      {input.weeklyOvertimeHours}시간 (1.5배)
                    </span>
                  </div>
                  <Slider
                    value={[input.weeklyOvertimeHours]}
                    onValueChange={([val]) => onChange({ ...input, weeklyOvertimeHours: val })}
                    min={0}
                    max={20}
                    step={1}
                  />
                </div>

                {/* 주간 야간근로 시간 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-[#64748b] dark:text-ghost-dark-ink-mute">
                    <span>주간 야간근로 시간 (22:00 ~ 06:00 사이 근무)</span>
                    <span className="font-bold text-[#112220] dark:text-ghost-dark-ink">
                      {input.weeklyNightHours}시간 (+50% 가산)
                    </span>
                  </div>
                  <Slider
                    value={[input.weeklyNightHours]}
                    onValueChange={([val]) => onChange({ ...input, weeklyNightHours: val })}
                    min={0}
                    max={20}
                    step={1}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
