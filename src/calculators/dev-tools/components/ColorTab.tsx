import React, { useState, useId } from 'react';
import { Copy, Check, Palette, Eye, ShieldCheck, ShieldAlert, Pipette } from 'lucide-react';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  hexToHsl,
  isValidHex,
  sanitizeHexInput,
  getContrastRatio,
  RgbColor,
  HslColor,
} from '../../../utils/devToolsCalculator';
import { SubMetricCard } from '../../../components/common/SubMetricCard';
import { Input } from '../../../components/ui/input';

export const ColorTab: React.FC = () => {
  const hexInputId = useId();
  const rgbInputId = useId();
  const hslInputId = useId();

  // 기본값: Ghost Electric Lime (D1FF19)
  const [hexInput, setHexInput] = useState<string>('D1FF19');
  const [rgb, setRgb] = useState<RgbColor>(() => hexToRgb('#d1ff19'));
  const [hsl, setHsl] = useState<HslColor>(() => hexToHsl('#d1ff19'));
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleHexChange = (newHex: string) => {
    const sanitized = sanitizeHexInput(newHex);
    setHexInput(sanitized);
    if (isValidHex(sanitized)) {
      const formattedHex = `#${sanitized}`;
      const newRgb = hexToRgb(formattedHex);
      const newHsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
      setRgb(newRgb);
      setHsl(newHsl);
    }
  };

  const handleRgbChange = (channel: keyof RgbColor, val: number) => {
    const clamped = Math.min(255, Math.max(0, val));
    const newRgb = { ...rgb, [channel]: clamped };
    setRgb(newRgb);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b).replace(/^#/, '');
    setHexInput(newHex.toUpperCase());
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleHslChange = (channel: keyof HslColor, val: number) => {
    const maxVal = channel === 'h' ? 360 : 100;
    const clamped = Math.min(maxVal, Math.max(0, val));
    const newHsl = { ...hsl, [channel]: clamped };
    setHsl(newHsl);
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgb(newRgb);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b).replace(/^#/, '');
    setHexInput(newHex.toUpperCase());
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

  const currentValidHex = isValidHex(hexInput) ? `#${hexInput}` : '#000000';
  const contrastWithWhite = getContrastRatio(currentValidHex, '#ffffff');
  const contrastWithBlack = getContrastRatio(currentValidHex, '#000000');
  const isWhiteTextBetter = contrastWithWhite >= contrastWithBlack;
  const bestContrastRatio = Math.max(contrastWithWhite, contrastWithBlack);
  const passesWcagAA = bestContrastRatio >= 4.5;

  const rgbCssString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslCssString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  return (
    <div className="space-y-6">
      {/* 1. 대형 컬러 프리뷰 스와치 카드 */}
      <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-ghost-hairline dark:border-ghost-dark-hairline bg-white dark:bg-ghost-dark-surface space-y-3">
        <div
          className="w-full h-28 sm:h-32 rounded-xl border border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:px-6 gap-3 transition-colors shadow-inner"
          style={{ backgroundColor: currentValidHex }}
        >
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider block opacity-75"
              style={{ color: isWhiteTextBetter ? '#ffffff' : '#000000' }}
            >
              현재 선택 색상
            </span>
            <span
              className="text-lg sm:text-2xl font-bold font-mono tracking-tight drop-shadow-sm"
              style={{ color: isWhiteTextBetter ? '#ffffff' : '#000000' }}
            >
              {currentValidHex.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* 네이티브 컬러 피커 트리거 버튼 */}
            <label
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md bg-white/40 dark:bg-black/40 hover:bg-white/60 dark:hover:bg-black/60 cursor-pointer shadow-xs border border-white/20 transition-all active:scale-95"
              style={{ color: isWhiteTextBetter ? '#ffffff' : '#000000' }}
            >
              <Pipette className="w-3.5 h-3.5 shrink-0" />
              <span>컬러 피커</span>
              <input
                type="color"
                value={currentValidHex}
                onChange={(e) => handleHexChange(e.target.value)}
                className="sr-only"
                aria-label="색상 직접 선택 (컬러 피커)"
              />
            </label>

            {/* WCAG 명암비 배지 */}
            <span
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg backdrop-blur-md bg-white/25 dark:bg-black/25 shadow-xs border border-white/10"
              style={{ color: isWhiteTextBetter ? '#ffffff' : '#000000' }}
            >
              {passesWcagAA ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              )}
              <span>{bestContrastRatio}:1 ({passesWcagAA ? 'WCAG AA 적합' : '대비 낮음'})</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. HEX / RGB / HSL 세부 입력 영역 (BaseTab과 동일하게 상단 라벨+복사, 하단 Input 컴포넌트 일원화) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* HEX 입력 카드 */}
        <div className="p-4 rounded-xl sm:rounded-2xl border border-ghost-hairline dark:border-ghost-dark-hairline bg-white dark:bg-ghost-dark-surface space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor={hexInputId}
              className="text-xs font-semibold text-ghost-ink dark:text-ghost-dark-ink cursor-pointer"
            >
              HEX 색상 코드
            </label>
            <button
              type="button"
              onClick={() => handleCopy(currentValidHex.toUpperCase(), 'hex-copy')}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-ghost-ink-mute dark:text-ghost-dark-ink-mute hover:text-ghost-ink dark:hover:text-ghost-dark-ink transition-colors"
              aria-label="HEX 코드 복사"
            >
              {copiedKey === 'hex-copy' ? (
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
            <span className="absolute left-3 text-sm font-mono font-bold text-ghost-ink-mute dark:text-ghost-dark-ink-mute select-none pointer-events-none">
              #
            </span>
            <Input
              id={hexInputId}
              type="text"
              value={hexInput}
              onChange={(e) => handleHexChange(e.target.value)}
              placeholder="FFFFFF"
              maxLength={6}
              spellCheck={false}
              autoComplete="off"
              className="h-11 font-mono text-sm sm:text-base font-bold pl-7 sm:pl-8 uppercase tracking-wider"
            />
          </div>
        </div>

        {/* RGB 채널 카드 */}
        <div className="p-4 rounded-xl sm:rounded-2xl border border-ghost-hairline dark:border-ghost-dark-hairline bg-white dark:bg-ghost-dark-surface space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor={rgbInputId}
              className="text-xs font-semibold text-ghost-ink dark:text-ghost-dark-ink cursor-pointer"
            >
              RGB 채널 (0 ~ 255)
            </label>
            <button
              type="button"
              onClick={() => handleCopy(rgbCssString, 'rgb-copy')}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-ghost-ink-mute dark:text-ghost-dark-ink-mute hover:text-ghost-ink dark:hover:text-ghost-dark-ink transition-colors"
              aria-label="RGB CSS 코드 복사"
            >
              {copiedKey === 'rgb-copy' ? (
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
          <div className="grid grid-cols-3 gap-1.5" id={rgbInputId}>
            {(['r', 'g', 'b'] as const).map((ch) => (
              <div key={ch} className="relative">
                <Input
                  type="number"
                  min={0}
                  max={255}
                  value={rgb[ch]}
                  onChange={(e) => handleRgbChange(ch, Number(e.target.value))}
                  className="h-11 text-center font-mono text-xs sm:text-sm font-bold pr-5"
                  aria-label={`RGB ${ch.toUpperCase()} 채널`}
                />
                <span className="absolute bottom-1 right-1.5 text-[9px] font-bold text-ghost-ink-mute uppercase select-none pointer-events-none">
                  {ch}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* HSL 채널 카드 */}
        <div className="p-4 rounded-xl sm:rounded-2xl border border-ghost-hairline dark:border-ghost-dark-hairline bg-white dark:bg-ghost-dark-surface space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor={hslInputId}
              className="text-xs font-semibold text-ghost-ink dark:text-ghost-dark-ink cursor-pointer"
            >
              HSL (색상·채도·명도)
            </label>
            <button
              type="button"
              onClick={() => handleCopy(hslCssString, 'hsl-copy')}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-ghost-ink-mute dark:text-ghost-dark-ink-mute hover:text-ghost-ink dark:hover:text-ghost-dark-ink transition-colors"
              aria-label="HSL CSS 코드 복사"
            >
              {copiedKey === 'hsl-copy' ? (
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
          <div className="grid grid-cols-3 gap-1.5" id={hslInputId}>
            {(['h', 's', 'l'] as const).map((ch) => (
              <div key={ch} className="relative">
                <Input
                  type="number"
                  min={0}
                  max={ch === 'h' ? 360 : 100}
                  value={hsl[ch]}
                  onChange={(e) => handleHslChange(ch, Number(e.target.value))}
                  className="h-11 text-center font-mono text-xs sm:text-sm font-bold pr-5"
                  aria-label={`HSL ${ch.toUpperCase()} 채널`}
                />
                <span className="absolute bottom-1 right-1.5 text-[9px] font-bold text-ghost-ink-mute uppercase select-none pointer-events-none">
                  {ch === 'h' ? '°' : '%'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. 3단 서브 요약 지표 (SubMetricCard 표준 준수) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        <SubMetricCard
          icon={Palette}
          label="RGB 색상 모델"
          value={`${rgb.r}, ${rgb.g}, ${rgb.b}`}
          description={`Red ${rgb.r} / Green ${rgb.g} / Blue ${rgb.b}`}
        />
        <SubMetricCard
          icon={Eye}
          label="HSL 색상 모델"
          value={`${hsl.h}°, ${hsl.s}%, ${hsl.l}%`}
          description={`Hue ${hsl.h}° / Sat ${hsl.s}% / Light ${hsl.l}%`}
        />
        <SubMetricCard
          icon={passesWcagAA ? ShieldCheck : ShieldAlert}
          label="WCAG AA 명암비"
          value={`${bestContrastRatio} : 1`}
          description={
            passesWcagAA
              ? `${isWhiteTextBetter ? '흰색' : '검은색'} 텍스트 가독성 충분`
              : '일반 텍스트용 대비 기준 미달 (4.5 미만)'
          }
        />
      </div>
    </div>
  );
};
