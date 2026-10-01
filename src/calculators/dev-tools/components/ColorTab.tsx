import React, { useState, useId } from 'react';
import { Copy, Check, Palette, Eye, ShieldCheck, ShieldAlert } from 'lucide-react';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  hexToHsl,
  isValidHex,
  getContrastRatio,
  RgbColor,
  HslColor,
} from '../../../utils/devToolsCalculator';
import { SubMetricCard } from '../../../components/common/SubMetricCard';

export const ColorTab: React.FC = () => {
  const hexInputId = useId();
  const rgbInputId = useId();
  const hslInputId = useId();

  // 기본값: Ghost Electric Lime (#d1ff19)
  const [hex, setHex] = useState<string>('#d1ff19');
  const [rgb, setRgb] = useState<RgbColor>(() => hexToRgb('#d1ff19'));
  const [hsl, setHsl] = useState<HslColor>(() => hexToHsl('#d1ff19'));
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleHexChange = (newHex: string) => {
    setHex(newHex);
    if (isValidHex(newHex)) {
      const formattedHex = newHex.startsWith('#') ? newHex : `#${newHex}`;
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
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setHex(newHex);
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleHslChange = (channel: keyof HslColor, val: number) => {
    const maxVal = channel === 'h' ? 360 : 100;
    const clamped = Math.min(maxVal, Math.max(0, val));
    const newHsl = { ...hsl, [channel]: clamped };
    setHsl(newHsl);
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
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

  const currentValidHex = isValidHex(hex) ? (hex.startsWith('#') ? hex : `#${hex}`) : '#000000';
  const contrastWithWhite = getContrastRatio(currentValidHex, '#ffffff');
  const contrastWithBlack = getContrastRatio(currentValidHex, '#000000');
  const isWhiteTextBetter = contrastWithWhite >= contrastWithBlack;
  const bestContrastRatio = Math.max(contrastWithWhite, contrastWithBlack);
  const passesWcagAA = bestContrastRatio >= 4.5;

  const rgbCssString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslCssString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  return (
    <div className="space-y-6">
      {/* 대형 컬러 프리뷰 스와치 카드 */}
      <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-ghost-hairline dark:border-ghost-dark-hairline bg-white dark:bg-ghost-dark-surface space-y-4">
        <div
          className="w-full h-24 sm:h-28 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-between px-4 sm:px-6 transition-colors shadow-inner"
          style={{ backgroundColor: currentValidHex }}
        >
          <span
            className="text-base sm:text-lg font-bold font-mono tracking-tight drop-shadow-sm"
            style={{ color: isWhiteTextBetter ? '#ffffff' : '#000000' }}
          >
            {currentValidHex.toUpperCase()}
          </span>

          <div className="flex items-center gap-2">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-md bg-white/20 dark:bg-black/20 shadow-sm"
              style={{ color: isWhiteTextBetter ? '#ffffff' : '#000000' }}
            >
              대비율 {bestContrastRatio}:1 ({passesWcagAA ? 'WCAG AA 적합' : '대비 낮음'})
            </span>
          </div>
        </div>

        {/* 3대 포맷 원클릭 복사 바 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleCopy(currentValidHex.toUpperCase(), 'hex-copy')}
            className="p-2.5 rounded-lg border border-ghost-hairline dark:border-ghost-dark-hairline bg-ghost-surface dark:bg-ghost-dark-surface-elevated flex items-center justify-between hover:bg-ghost-hover transition-colors"
          >
            <span className="text-xs font-mono font-bold text-ghost-ink dark:text-ghost-dark-ink truncate">
              {currentValidHex.toUpperCase()}
            </span>
            {copiedKey === 'hex-copy' ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-ghost-ink-mute shrink-0" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleCopy(rgbCssString, 'rgb-copy')}
            className="p-2.5 rounded-lg border border-ghost-hairline dark:border-ghost-dark-hairline bg-ghost-surface dark:bg-ghost-dark-surface-elevated flex items-center justify-between hover:bg-ghost-hover transition-colors"
          >
            <span className="text-xs font-mono font-bold text-ghost-ink dark:text-ghost-dark-ink truncate">
              {rgbCssString}
            </span>
            {copiedKey === 'rgb-copy' ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-ghost-ink-mute shrink-0" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleCopy(hslCssString, 'hsl-copy')}
            className="p-2.5 rounded-lg border border-ghost-hairline dark:border-ghost-dark-hairline bg-ghost-surface dark:bg-ghost-dark-surface-elevated flex items-center justify-between hover:bg-ghost-hover transition-colors"
          >
            <span className="text-xs font-mono font-bold text-ghost-ink dark:text-ghost-dark-ink truncate">
              {hslCssString}
            </span>
            {copiedKey === 'hsl-copy' ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-ghost-ink-mute shrink-0" />
            )}
          </button>
        </div>
      </div>

      {/* HEX / RGB / HSL 세부 입력 영역 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* HEX 입력 */}
        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-ghost-hairline dark:border-ghost-dark-hairline bg-white dark:bg-ghost-dark-surface space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor={hexInputId}
              className="text-xs font-semibold text-ghost-ink dark:text-ghost-dark-ink cursor-pointer"
            >
              HEX 색상 코드
            </label>
            <input
              type="color"
              value={currentValidHex}
              onChange={(e) => handleHexChange(e.target.value)}
              className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
              title="네이티브 컬러 피커 열기"
            />
          </div>
          <input
            id={hexInputId}
            type="text"
            value={hex}
            onChange={(e) => handleHexChange(e.target.value)}
            placeholder="#ffffff"
            maxLength={7}
            className="w-full h-11 rounded-lg border border-ghost-hairline dark:border-ghost-dark-hairline bg-ghost-surface dark:bg-ghost-dark-surface-elevated text-ghost-ink dark:text-ghost-dark-ink font-mono text-sm font-bold px-3 focus:outline-none focus:ring-1 focus:ring-ghost-ink uppercase"
          />
        </div>

        {/* RGB 슬라이더/인풋 */}
        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-ghost-hairline dark:border-ghost-dark-hairline bg-white dark:bg-ghost-dark-surface space-y-2">
          <label
            htmlFor={rgbInputId}
            className="text-xs font-semibold text-ghost-ink dark:text-ghost-dark-ink block cursor-pointer"
          >
            RGB 채널 (0 ~ 255)
          </label>
          <div className="grid grid-cols-3 gap-1.5" id={rgbInputId}>
            {(['r', 'g', 'b'] as const).map((ch) => (
              <div key={ch} className="relative">
                <input
                  type="number"
                  min={0}
                  max={255}
                  value={rgb[ch]}
                  onChange={(e) => handleRgbChange(ch, Number(e.target.value))}
                  className="w-full h-11 text-center rounded-lg border border-ghost-hairline dark:border-ghost-dark-hairline bg-ghost-surface dark:bg-ghost-dark-surface-elevated text-ghost-ink dark:text-ghost-dark-ink font-mono text-xs sm:text-sm font-bold focus:outline-none focus:ring-1 focus:ring-ghost-ink"
                  aria-label={`RGB ${ch.toUpperCase()} 채널`}
                />
                <span className="absolute bottom-1 right-1.5 text-[9px] font-bold text-ghost-ink-mute uppercase">
                  {ch}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* HSL 슬라이더/인풋 */}
        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-ghost-hairline dark:border-ghost-dark-hairline bg-white dark:bg-ghost-dark-surface space-y-2">
          <label
            htmlFor={hslInputId}
            className="text-xs font-semibold text-ghost-ink dark:text-ghost-dark-ink block cursor-pointer"
          >
            HSL (색상·채도·명도)
          </label>
          <div className="grid grid-cols-3 gap-1.5" id={hslInputId}>
            {(['h', 's', 'l'] as const).map((ch) => (
              <div key={ch} className="relative">
                <input
                  type="number"
                  min={0}
                  max={ch === 'h' ? 360 : 100}
                  value={hsl[ch]}
                  onChange={(e) => handleHslChange(ch, Number(e.target.value))}
                  className="w-full h-11 text-center rounded-lg border border-ghost-hairline dark:border-ghost-dark-hairline bg-ghost-surface dark:bg-ghost-dark-surface-elevated text-ghost-ink dark:text-ghost-dark-ink font-mono text-xs sm:text-sm font-bold focus:outline-none focus:ring-1 focus:ring-ghost-ink"
                  aria-label={`HSL ${ch.toUpperCase()} 채널`}
                />
                <span className="absolute bottom-1 right-1.5 text-[9px] font-bold text-ghost-ink-mute uppercase">
                  {ch === 'h' ? '°' : '%'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3단 서브 요약 지표 (SubMetricCard) */}
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
