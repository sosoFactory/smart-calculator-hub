import React, { useState, useId } from 'react';
import { Copy, Check, Binary, Hash, Layers } from 'lucide-react';
import {
  convertBase,
  formatBinaryNibbles,
  isValidBaseInput,
  BaseConversionResult,
} from '../../../utils/devToolsCalculator';
import { SubMetricCard } from '../../../components/common/SubMetricCard';

export const BaseTab: React.FC = () => {
  const binaryInputId = useId();
  const octalInputId = useId();
  const decimalInputId = useId();
  const hexInputId = useId();

  // 기본값: 255 (10진수)
  const [activeBase, setActiveBase] = useState<number>(10);
  const [values, setValues] = useState<BaseConversionResult>(() => convertBase('255', 10));
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleInputChange = (val: string, base: number) => {
    setActiveBase(base);
    if (!val.trim()) {
      setValues({ bin: '', oct: '', dec: '', hex: '' });
      return;
    }

    if (!isValidBaseInput(val, base)) {
      return;
    }

    const res = convertBase(val, base);
    setValues(res);
  };

  const handleCopy = async (text: string, key: string) => {
    if (!text) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 1500);
      }
    } catch {
      // fallback
    }
  };

  // 통계 계산
  const bitLength = values.bin ? values.bin.length : 0;
  const byteLength = values.hex ? Math.ceil(values.hex.length / 2) : 0;
  const onesCount = values.bin ? (values.bin.match(/1/g) || []).length : 0;

  const bases = [
    {
      key: 'dec',
      name: '10진수 (Decimal)',
      base: 10,
      value: values.dec,
      placeholder: '예: 255',
      prefix: '',
      id: decimalInputId,
    },
    {
      key: 'hex',
      name: '16진수 (Hexadecimal)',
      base: 16,
      value: values.hex,
      placeholder: '예: FF',
      prefix: '0x',
      id: hexInputId,
    },
    {
      key: 'bin',
      name: '2진수 (Binary)',
      base: 2,
      value: values.bin,
      placeholder: '예: 11111111',
      prefix: '0b',
      id: binaryInputId,
    },
    {
      key: 'oct',
      name: '8진수 (Octal)',
      base: 8,
      value: values.oct,
      placeholder: '예: 377',
      prefix: '0o',
      id: octalInputId,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 4대 진법 양방향 입력 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {bases.map((b) => {
          const isCurrentActive = activeBase === b.base;
          const isCopied = copiedKey === b.key;

          return (
            <div
              key={b.key}
              className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-200 bg-white dark:bg-ghost-dark-surface ${
                isCurrentActive
                  ? 'border-ghost-ink/40 dark:border-ghost-dark-ink/50 shadow-sm'
                  : 'border-ghost-hairline dark:border-ghost-dark-hairline'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor={b.id}
                  className="text-xs font-semibold text-ghost-ink dark:text-ghost-dark-ink cursor-pointer"
                >
                  {b.name}
                </label>
                <button
                  type="button"
                  onClick={() => handleCopy(b.value, b.key)}
                  disabled={!b.value}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-ghost-ink-mute dark:text-ghost-dark-ink-mute hover:text-ghost-ink dark:hover:text-ghost-dark-ink transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  aria-label={`${b.name} 값 복사`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400">복사됨</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>복사</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative flex items-center">
                {b.prefix && (
                  <span className="absolute left-3 text-xs font-mono font-medium text-ghost-ink-mute dark:text-ghost-dark-ink-mute select-none">
                    {b.prefix}
                  </span>
                )}
                <input
                  id={b.id}
                  type="text"
                  value={b.value}
                  onChange={(e) => handleInputChange(e.target.value, b.base)}
                  placeholder={b.placeholder}
                  spellCheck={false}
                  autoComplete="off"
                  className={`w-full h-11 rounded-lg border border-ghost-hairline dark:border-ghost-dark-hairline bg-ghost-surface dark:bg-ghost-dark-surface-elevated text-ghost-ink dark:text-ghost-dark-ink font-mono text-sm sm:text-base font-semibold transition-colors focus:outline-none focus:ring-1 focus:ring-ghost-ink dark:focus:ring-ghost-dark-ink ${
                    b.prefix ? 'pl-8 pr-3' : 'px-3'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 2진수 4비트(Nibble) 공백 시각화 카드 */}
      <div className="p-4 rounded-xl sm:rounded-2xl border border-ghost-hairline dark:border-ghost-dark-hairline bg-ghost-surface-deep/40 dark:bg-ghost-dark-surface-deep/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-ghost-ink dark:text-ghost-dark-ink">
            2진수 4비트(Nibble) 그룹화 뷰
          </span>
          <button
            type="button"
            onClick={() => handleCopy(formatBinaryNibbles(values.bin), 'nibble')}
            disabled={!values.bin}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-ghost-ink-mute dark:text-ghost-dark-ink-mute hover:text-ghost-ink dark:hover:text-ghost-dark-ink transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            {copiedKey === 'nibble' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400">복사됨</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>포맷 복사</span>
              </>
            )}
          </button>
        </div>
        <div className="p-3 rounded-lg bg-white dark:bg-ghost-dark-surface border border-ghost-hairline dark:border-ghost-dark-hairline overflow-x-auto">
          <code className="text-sm sm:text-base font-mono font-bold tracking-wider text-ghost-ink dark:text-ghost-dark-ink break-all">
            {values.bin ? formatBinaryNibbles(values.bin) : '0000 0000'}
          </code>
        </div>
      </div>

      {/* 3단 서브 요약 지표 (SubMetricCard 표준 준수) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        <SubMetricCard
          icon={Binary}
          label="유효 비트 수"
          value={`${bitLength} bit`}
          description={bitLength > 0 ? `${Math.ceil(bitLength / 8)} 바이트 범위` : '0 바이트'}
        />
        <SubMetricCard
          icon={Layers}
          label="16진수 바이트 크기"
          value={`${byteLength} Byte`}
          description={byteLength > 0 ? `${byteLength * 8} 비트 정수 표현` : '0 비트'}
        />
        <SubMetricCard
          icon={Hash}
          label="2진수 1의 개수 (Popcount)"
          value={`${onesCount} 개`}
          description={bitLength > 0 ? `비트 점유율 ${Math.round((onesCount / bitLength) * 100)}%` : '0%'}
        />
      </div>
    </div>
  );
};
