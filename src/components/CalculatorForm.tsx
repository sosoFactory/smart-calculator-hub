import React from 'react';
import {
  CompoundingFrequency,
  ContributionFrequency,
  ScenarioInput,
  TaxType,
} from '../types/calculator';
import { formatKoreanUnit } from '../utils/formatters';
import { QuickAmountButtons } from './QuickAmountButtons';
import { Copy, RotateCcw } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { SelectableChip } from './ui/selectable-chip';
import { NumericInput } from './ui/numeric-input';
import { Slider } from './ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface CalculatorFormProps {
  scenario: ScenarioInput;
  onChange: (updated: ScenarioInput) => void;
  accentColor?: 'teal' | 'indigo';
  badgeTitle?: string;
  onCopyFromOther?: () => void;
  copyButtonLabel?: string;
  onReset?: () => void;
}

const CONTRIBUTION_OPTIONS: { id: ContributionFrequency; label: string }[] = [
  { id: 'monthly', label: '매월 적립' },
  { id: 'annual', label: '매년 적립' },
  { id: 'none', label: '적립 없음' },
];

const RATE_PRESETS = [
  { label: '-3%', rate: -3.0 },
  { label: '3.5%', rate: 3.5 },
  { label: '8%', rate: 8.0 },
  { label: '15%', rate: 15.0 },
];

const TAX_OPTIONS: { id: TaxType; label: string; rateLabel: string }[] = [
  { id: 'normal', label: '일반과세', rateLabel: '15.4%' },
  { id: 'isa', label: 'ISA 절세', rateLabel: '9.9%' },
  { id: 'exempt', label: '비과세', rateLabel: '0%' },
];

const YEAR_PRESETS = [5, 10, 20, 30];

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  scenario,
  onChange,
  accentColor = 'teal',
  badgeTitle,
  onCopyFromOther,
  copyButtonLabel,
  onReset,
}) => {
  const isIndigo = accentColor === 'indigo';
  const idPrefix = isIndigo ? 'scenario-b' : 'scenario-a';

  const updateField = <K extends keyof ScenarioInput>(
    field: K,
    value: ScenarioInput[K]
  ) => {
    onChange({
      ...scenario,
      [field]: value,
    });
  };

  return (
    <div
      className={`bg-white dark:bg-ghost-dark-surface rounded-[24px] p-5 sm:p-6 border border-[#e5e7eb] dark:border-ghost-dark-hairline transition-colors ${
        isIndigo ? 'ring-1 ring-slate-900/5' : ''
      }`}
    >
      {/* 상단 뱃지 및 타이틀 & 액션 버튼 */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-ghost-dark-hairline gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Badge variant={isIndigo ? 'indigo' : 'teal'} className="font-bold uppercase tracking-wider shrink-0">
            {badgeTitle || scenario.name}
          </Badge>
          <h2 className="text-sm sm:text-base font-bold text-slate-800 dark:text-ghost-dark-ink whitespace-nowrap">
            투자 조건 설정
          </h2>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onCopyFromOther && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCopyFromOther}
              className="h-8 px-2.5 text-xs gap-1.5 text-slate-600 dark:text-ghost-dark-ink-soft rounded-lg shrink-0"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copyButtonLabel || '복사'}</span>
            </Button>
          )}

          {onReset && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-8 px-2.5 gap-1.5 text-xs text-slate-500 dark:text-ghost-dark-ink-mute hover:text-[#112220] dark:hover:text-white rounded-lg shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>초기화</span>
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {/* 1. 초기 원금 */}
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <label htmlFor={`${idPrefix}-principal`} className="text-xs sm:text-sm font-semibold text-[#112220] dark:text-ghost-dark-ink-base cursor-pointer">
              초기 투자 원금
            </label>
            <span className="text-xs font-semibold text-[#112220] dark:text-ghost-dark-ink-base">
              {formatKoreanUnit(scenario.principal)}
            </span>
          </div>
          <NumericInput
            id={`${idPrefix}-principal`}
            aria-label="초기 투자 원금"
            value={scenario.principal}
            placeholder="0"
            thousandSeparator
            suffix="원"
            onNumberChange={(val) => updateField('principal', val)}
          />
          <QuickAmountButtons
            onAdd={(amt) => updateField('principal', (scenario.principal || 0) + amt)}
            onClear={() => updateField('principal', 0)}
          />
        </div>

        {/* 2. 정기 적립액 및 주기 */}
        <div>
          <div className="flex justify-between items-baseline mb-1.5">
            <label htmlFor={`${idPrefix}-regular-contribution`} className="text-xs sm:text-sm font-semibold text-[#112220] dark:text-ghost-dark-ink-base cursor-pointer">
              정기 추가 적립금
            </label>
            {scenario.contributionFrequency !== 'none' && (
              <span className="text-xs font-semibold text-[#112220] dark:text-ghost-dark-ink-base">
                {formatKoreanUnit(scenario.regularContribution)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 mb-2">
            {CONTRIBUTION_OPTIONS.map((opt) => (
              <SelectableChip
                key={opt.id}
                isSelected={scenario.contributionFrequency === opt.id}
                onClick={() => updateField('contributionFrequency', opt.id as any)}
                className="h-auto py-2 text-xs sm:text-sm font-semibold justify-center text-center"
              >
                {opt.label}
              </SelectableChip>
            ))}
          </div>

          {scenario.contributionFrequency !== 'none' && (
            <>
              <NumericInput
                id={`${idPrefix}-regular-contribution`}
                aria-label="정기 추가 적립금"
                value={scenario.regularContribution}
                placeholder="0"
                thousandSeparator
                suffix="원"
                onNumberChange={(val) => updateField('regularContribution', val)}
              />
              <QuickAmountButtons
                onAdd={(amt) =>
                  updateField('regularContribution', scenario.regularContribution + amt)
                }
                onClear={() => updateField('regularContribution', 0)}
              />
            </>
          )}
        </div>

        {/* 3. 목표 투자 기간 (단독 슬라이더 + 상단 수치 표기) */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <label htmlFor={`${idPrefix}-years`} className="text-xs sm:text-sm font-semibold text-[#112220] dark:text-ghost-dark-ink-base cursor-pointer">
              목표 투자 기간
            </label>
            <span className="text-xs font-bold text-[#112220] dark:text-[#d1ff19] tabular-nums">
              {scenario.years || 0}년 ({(scenario.years || 0) * 12}개월)
            </span>
          </div>
          <Slider
            id={`${idPrefix}-years-slider`}
            aria-label="투자 기간 슬라이더"
            min={1}
            max={40}
            step={1}
            value={[Math.max(1, Math.min(40, scenario.years || 1))]}
            onValueChange={([val]) => updateField('years', val)}
            className="my-2.5"
          />
          {/* 기간 프리셋 버튼 */}
          <div className="flex items-center justify-between gap-1 mt-1">
            {YEAR_PRESETS.map((yr) => (
              <SelectableChip
                key={yr}
                isSelected={scenario.years === yr}
                onClick={() => updateField('years', yr)}
                className="flex-1 py-1 text-[11px]"
              >
                {yr}년
              </SelectableChip>
            ))}
          </div>
        </div>

        {/* 4. 예상 연수익률 (단독 슬라이더, step 0.5% 통일) */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <label htmlFor={`${idPrefix}-annual-rate`} className="text-xs sm:text-sm font-semibold text-[#112220] dark:text-ghost-dark-ink-base flex items-center gap-1.5 cursor-pointer">
              <span>연 예상 수익률</span>
              {scenario.annualRate < 0 && (
                <span className="text-[10px] text-rose-500 font-bold bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded">
                  원금 손실 구간
                </span>
              )}
            </label>
            <span className={`text-xs font-bold tabular-nums ${scenario.annualRate < 0 ? 'text-rose-500' : 'text-[#112220] dark:text-[#d1ff19]'}`}>
              연 {scenario.annualRate !== undefined && !isNaN(scenario.annualRate) ? scenario.annualRate.toFixed(1) : '0.0'}%
            </span>
          </div>
          <Slider
            id={`${idPrefix}-annual-rate-slider`}
            aria-label="연 예상 수익률 슬라이더"
            min={-5}
            max={50}
            step={0.5}
            value={[isNaN(scenario.annualRate) ? 0 : Math.max(-5, Math.min(50, scenario.annualRate))]}
            onValueChange={([val]) => updateField('annualRate', Number(val.toFixed(1)))}
            className="my-2.5"
          />
          {/* 수익률 프리셋 칩 */}
          <div className="flex items-center justify-between gap-1 mt-1">
            {RATE_PRESETS.map((preset) => {
              const isSelected = Math.abs((scenario.annualRate || 0) - preset.rate) < 0.25;
              return (
                <SelectableChip
                  key={preset.rate}
                  isSelected={isSelected}
                  onClick={() => updateField('annualRate', preset.rate)}
                  className="flex-1 py-1 text-[11px]"
                >
                  {preset.label}
                </SelectableChip>
              );
            })}
          </div>
        </div>

        {/* 5. 복리 주기 (간결한 단일 행 드롭다운) */}
        <div className="pt-2 border-t border-[#e5e7eb] dark:border-ghost-dark-hairline">
          <label className="block text-xs font-semibold text-[#112220] dark:text-ghost-dark-ink-base mb-1">
            복리 주기
          </label>
          <Select
            value={scenario.compoundingFrequency}
            onValueChange={(val) =>
              updateField('compoundingFrequency', val as CompoundingFrequency)
            }
          >
            <SelectTrigger className="h-[39px] text-xs font-semibold bg-slate-50 dark:bg-ghost-dark-surface-deep border-[#e5e7eb] dark:border-ghost-dark-hairline-soft">
              <SelectValue placeholder="복리 주기 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">월복리 (일반적/추천)</SelectItem>
              <SelectItem value="annual">연복리</SelectItem>
              <SelectItem value="quarterly">분기복리</SelectItem>
              <SelectItem value="daily">일복리</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 6. 이자소득 과세 방식 (독립된 3단 선택 칩 그룹 + 친절 안내 가이드 표준화) */}
        <div className="pt-2 border-t border-[#e5e7eb] dark:border-ghost-dark-hairline">
          <div className="flex items-center justify-between gap-1 mb-2">
            <label className="text-xs sm:text-sm font-semibold text-[#112220] dark:text-ghost-dark-ink-base whitespace-nowrap">
              이자소득 과세 방식
            </label>
            <span className="text-xs font-bold text-[#112220] dark:text-[#d1ff19] tabular-nums whitespace-nowrap">
              {scenario.taxType === 'normal' && (
                <>
                  <span className="hidden sm:inline">일반과세 </span>
                  <span>(15.4%)</span>
                </>
              )}
              {scenario.taxType === 'isa' && (
                <>
                  <span className="hidden sm:inline">ISA 절세 </span>
                  <span>(9.9%)</span>
                </>
              )}
              {scenario.taxType === 'exempt' && (
                <>
                  <span className="hidden sm:inline">비과세 </span>
                  <span>(0%)</span>
                </>
              )}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {TAX_OPTIONS.map((opt) => (
              <SelectableChip
                key={opt.id}
                isSelected={scenario.taxType === opt.id}
                onClick={() => updateField('taxType', opt.id)}
                className="h-auto py-2 text-xs sm:text-sm font-semibold justify-center text-center"
              >
                <span>{opt.label}</span>
                <span className="text-[11px] opacity-75 ml-1 hidden xs:inline">({opt.rateLabel})</span>
              </SelectableChip>
            ))}
          </div>

          {/* 과세 방식 친절 안내 가이드 */}
          <div className="mt-2 text-xs text-[#64748b] dark:text-ghost-dark-ink-mute bg-slate-50 dark:bg-ghost-dark-surface-deep p-2.5 rounded-lg border border-slate-200/80 dark:border-ghost-dark-hairline leading-relaxed">
            {scenario.taxType === 'normal' && (
              <p>
                <strong className="text-slate-800 dark:text-ghost-dark-ink-base font-semibold">일반과세 (15.4%):</strong> 금융상품 이자·배당 수익에 기본 부과되는 소득세(14%)와 지방소득세(1.4%)가 원천징수됩니다.
              </p>
            )}
            {scenario.taxType === 'isa' && (
              <p>
                <strong className="text-slate-800 dark:text-ghost-dark-ink-base font-semibold">ISA 절세 (9.9% 분리과세):</strong> 서민형/일반형 ISA 계좌로 순수익 200만~400만 원까지 비과세되며 초과분은 9.9% 분리과세됩니다.
              </p>
            )}
            {scenario.taxType === 'exempt' && (
              <p>
                <strong className="text-slate-800 dark:text-ghost-dark-ink-base font-semibold">비과세 (0%):</strong> 청년도약계좌, 비과세종합저축 등 관련 법령에 따라 소득세가 전혀 발생하지 않는 절세 상품입니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
