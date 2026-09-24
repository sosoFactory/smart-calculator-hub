import React, { useState } from 'react';
import {
  PartTimeInput,
  PartTimeTaxType,
  WorkScheduleMode,
  MINIMUM_WAGE_2026,
  MINIMUM_WAGE_2025,
} from '../../../types/partTime';
import { NumericInput } from '../../../components/ui/numeric-input';
import { Slider } from '../../../components/ui/slider';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { SelectableChip } from '../../../components/ui/selectable-chip';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { RotateCcw, Clock, ChevronDown, ChevronUp, Building2 } from 'lucide-react';
import { formatNumberWithWon } from '../../../utils/formatters';

interface PartTimeFormProps {
  input: PartTimeInput;
  onChange: (updated: PartTimeInput) => void;
  onReset: () => void;
}

const WAGE_PRESETS = [
  { label: '2026 최저', value: MINIMUM_WAGE_2026, isNew: true },
  { label: '2025 최저', value: MINIMUM_WAGE_2025 },
  { label: '11,000원', value: 11_000 },
  { label: '12,000원', value: 12_000 },
  { label: '15,000원', value: 15_000 },
];

const WORKING_DAYS = [1, 2, 3, 4, 5, 6, 7];

const TAX_OPTIONS: { id: PartTimeTaxType; label: string; desc: string }[] = [
  { id: 'none', label: '미적용 (0%)', desc: '세전 총액 100% 수령' },
  { id: 'freelancer', label: '프리랜서 (3.3%)', desc: '사업소득세 3% + 지방소득세 0.3%' },
  { id: 'four_insurances', label: '4대보험 (약 9.4%)', desc: '월 60시간 이상 근무 시 의무 가입' },
];

export const PartTimeForm: React.FC<PartTimeFormProps> = ({ input, onChange, onReset }) => {
  const [showAdditionalPay, setShowAdditionalPay] = useState(false);

  const calculatedWeeklyHours =
    input.scheduleMode === 'weekly_total'
      ? input.weeklyTotalHours
      : input.dailyHours * input.workingDaysPerWeek;

  return (
    <div className="bg-white dark:bg-ghost-dark-surface rounded-[24px] border border-[#e5e7eb] dark:border-ghost-dark-hairline p-5 sm:p-6 shadow-xs space-y-6 transition-colors">
      {/* 폼 헤더 */}
      <div className="flex items-center justify-between pb-3 border-b border-[#e5e7eb] dark:border-ghost-dark-hairline">
        <div className="space-y-0.5">
          <h2 className="text-base sm:text-lg font-bold text-[#112220] dark:text-ghost-dark-ink tracking-tight flex items-center gap-2">
            <span>알바 근무 조건 입력</span>
            <Badge variant="lime" className="text-[10px] px-1.5 py-0 h-4">
              2026년 기준
            </Badge>
          </h2>
          <p className="text-xs text-[#64748b] dark:text-ghost-dark-ink-mute">
            시급과 근무 시간을 입력하면 주휴수당과 실수령액이 즉시 계산됩니다.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-xs text-[#64748b] dark:text-ghost-dark-ink-mute hover:text-[#112220] dark:hover:text-ghost-dark-ink gap-1 px-2.5 h-8 shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>초기화</span>
        </Button>
      </div>

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

        {/* 시급 원클릭 프리셋 칩 */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          {WAGE_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => onChange({ ...input, hourlyWage: preset.value })}
              className={`h-7 px-2.5 text-xs rounded-full font-medium transition-all flex items-center gap-1 border ${
                input.hourlyWage === preset.value
                  ? 'bg-[#15171a] dark:bg-ghost-lime text-white dark:text-[#112220] border-[#15171a] dark:border-ghost-lime shadow-xs font-bold'
                  : 'bg-slate-50 dark:bg-ghost-dark-surface-deep border-[#e5e7eb] dark:border-ghost-dark-hairline-soft text-[#475569] dark:text-ghost-dark-ink-soft hover:bg-slate-100 dark:hover:bg-ghost-dark-hover'
              }`}
            >
              <span>{preset.label}</span>
              {preset.isNew && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="2026 최저임금 적용" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 2. 근무 시간 입력 방식 탭 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-bold text-[#112220] dark:text-ghost-dark-ink">
            근무 시간 설정
          </span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            주 {calculatedWeeklyHours}시간 근로
          </span>
        </div>

        <Tabs
          value={input.scheduleMode}
          onValueChange={(val) => onChange({ ...input, scheduleMode: val as WorkScheduleMode })}
          className="w-full"
        >
          <TabsList variant="slate-solid" size="sm" className="grid grid-cols-2 w-full">
            <TabsTrigger value="weekly_total" variant="slate-solid">
              주간 총 시간 기준
            </TabsTrigger>
            <TabsTrigger value="daily_hours" variant="slate-solid">
              일별 시간 × 일수 기준
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {input.scheduleMode === 'weekly_total' ? (
          /* 주간 총 근로시간 슬라이더 */
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs text-[#64748b] dark:text-ghost-dark-ink-mute">
              <span>1주 총 근로시간</span>
              <span className="font-bold text-[#112220] dark:text-ghost-dark-ink text-sm">
                {input.weeklyTotalHours}시간
              </span>
            </div>
            <Slider
              value={[input.weeklyTotalHours]}
              onValueChange={([val]) => onChange({ ...input, weeklyTotalHours: val })}
              min={1}
              max={60}
              step={1}
            />
            <div className="flex justify-between text-[11px] text-[#94a3b8] dark:text-ghost-dark-ink-stone">
              <span>1시간</span>
              <span>15시간(주휴 기준)</span>
              <span>40시간(풀타임)</span>
              <span>60시간</span>
            </div>
          </div>
        ) : (
          /* 일별 시간 × 주당 일수 */
          <div className="space-y-4 pt-1">
            {/* 1일 근무시간 슬라이더 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#64748b] dark:text-ghost-dark-ink-mute">
                <span>1일 근무시간</span>
                <span className="font-bold text-[#112220] dark:text-ghost-dark-ink text-sm">
                  {input.dailyHours}시간
                </span>
              </div>
              <Slider
                value={[input.dailyHours]}
                onValueChange={([val]) => onChange({ ...input, dailyHours: val })}
                min={1}
                max={12}
                step={0.5}
              />
              <div className="flex justify-between text-[11px] text-[#94a3b8] dark:text-ghost-dark-ink-stone">
                <span>1시간</span>
                <span>4시간(반일)</span>
                <span>8시간(전일)</span>
                <span>12시간</span>
              </div>
            </div>

            {/* 주간 근무일수 선택 칩 */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-[#64748b] dark:text-ghost-dark-ink-mute">
                1주일 근무일수
              </span>
              <div className="grid grid-cols-7 gap-1.5">
                {WORKING_DAYS.map((days) => (
                  <SelectableChip
                    key={days}
                    isSelected={input.workingDaysPerWeek === days}
                    onClick={() => onChange({ ...input, workingDaysPerWeek: days })}
                    className="py-1.5 text-xs text-center justify-center font-bold"
                  >
                    주 {days}일
                  </SelectableChip>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 주 15시간 여부 실시간 안내 배너 */}
        <div
          className={`px-3 py-2 rounded-xl text-xs flex items-center justify-between border transition-all ${
            calculatedWeeklyHours >= 15
              ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span className="font-semibold">
              {calculatedWeeklyHours >= 15
                ? '주 15시간 이상 근무 ➔ 주휴수당 발생 대상입니다'
                : '주 15시간 미만 근무 ➔ 주휴수당이 발생하지 않습니다 (초단시간)'}
            </span>
          </div>
          <span className="text-[11px] font-bold shrink-0">
            {calculatedWeeklyHours >= 15 ? '주휴 유급' : '기본시급만'}
          </span>
        </div>
      </div>

      {/* 3. 소정근로일 개근 여부 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-[#112220] dark:text-ghost-dark-ink">
            소정근로일 출결 상태
          </label>
          <span className="text-xs text-[#64748b] dark:text-ghost-dark-ink-mute">
            {input.hasAttendance ? '전일 개근 (주휴수당 지급)' : '결근 발생 (주휴수당 미지급)'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <SelectableChip
            isSelected={input.hasAttendance}
            onClick={() => onChange({ ...input, hasAttendance: true })}
            className="py-2 text-xs sm:text-sm text-center justify-center font-bold"
          >
            약속된 근무일 개근 (정상)
          </SelectableChip>
          <SelectableChip
            isSelected={!input.hasAttendance}
            onClick={() => onChange({ ...input, hasAttendance: false })}
            className="py-2 text-xs sm:text-sm text-center justify-center font-bold"
          >
            결근 있음 (주휴 제외)
          </SelectableChip>
        </div>
      </div>

      {/* 4. 세금 및 공제 방식 선택 */}
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
              className="py-2 text-xs sm:text-sm text-center justify-center font-bold"
            >
              {tax.label}
            </SelectableChip>
          ))}
        </div>
        <p className="text-[11px] text-[#64748b] dark:text-ghost-dark-ink-mute pl-0.5">
          {TAX_OPTIONS.find((t) => t.id === input.taxType)?.desc}
        </p>
      </div>

      {/* 5. 가산수당 및 5인 이상 사업장 옵션 (접이식 아코디언) */}
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
