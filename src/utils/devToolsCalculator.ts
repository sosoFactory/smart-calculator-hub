/**
 * 개발자 도구 (DevTools) 핵심 연산 유틸리티
 * 1) 진수 변환 (2, 8, 10, 16진법)
 * 2) CSS 단위 환산 (px, rem, em, Tailwind 스페이싱)
 * 3) 색상 코드 변환 (HEX, RGB, HSL, WCAG 명암비)
 */

// -------------------------------------------------------------
// 1. 진수 변환 (Base Converter)
// -------------------------------------------------------------

export interface BaseConversionResult {
  bin: string;
  oct: string;
  dec: string;
  hex: string;
}

/**
 * 진법별 입력 문자열 유효성 검증
 */
export function isValidBaseInput(value: string, base: number): boolean {
  if (!value) return true;
  const clean = value.trim();
  switch (base) {
    case 2:
      return /^[01]+$/.test(clean);
    case 8:
      return /^[0-7]+$/.test(clean);
    case 10:
      return /^[0-9]+$/.test(clean);
    case 16:
      return /^[0-9a-fA-F]+$/.test(clean);
    default:
      return false;
  }
}

/**
 * 임의 진법의 입력을 2, 8, 10, 16진수로 일괄 변환 (BigInt 지원으로 대형 비트 연산 무결성 보장)
 */
export function convertBase(value: string, fromBase: number): BaseConversionResult {
  const clean = value.trim();
  if (!clean) {
    return { bin: '', oct: '', dec: '', hex: '' };
  }

  if (!isValidBaseInput(clean, fromBase)) {
    return { bin: '', oct: '', dec: '', hex: '' };
  }

  try {
    let bigNum: bigint;
    if (fromBase === 2) {
      bigNum = BigInt('0b' + clean);
    } else if (fromBase === 8) {
      bigNum = BigInt('0o' + clean);
    } else if (fromBase === 10) {
      bigNum = BigInt(clean);
    } else if (fromBase === 16) {
      bigNum = BigInt('0x' + clean);
    } else {
      return { bin: '', oct: '', dec: '', hex: '' };
    }

    return {
      bin: bigNum.toString(2),
      oct: bigNum.toString(8),
      dec: bigNum.toString(10),
      hex: bigNum.toString(16).toUpperCase(),
    };
  } catch {
    return { bin: '', oct: '', dec: '', hex: '' };
  }
}

/**
 * 2진수 문자열을 4비트(Nibble) 단위로 공백 분리하여 가독성 강화
 */
export function formatBinaryNibbles(bin: string): string {
  if (!bin) return '';
  const clean = bin.trim();
  const remainder = clean.length % 4;
  let formatted = '';

  if (remainder > 0) {
    formatted += clean.slice(0, remainder) + (clean.length > remainder ? ' ' : '');
  }

  for (let i = remainder; i < clean.length; i += 4) {
    formatted += clean.slice(i, i + 4) + (i + 4 < clean.length ? ' ' : '');
  }

  return formatted.trim();
}

// -------------------------------------------------------------
// 2. CSS 단위 변환 (CSS Unit Converter)
// -------------------------------------------------------------

/**
 * px을 rem으로 환산
 */
export function convertPxToRem(px: number, rootFontSize = 16): number {
  if (rootFontSize <= 0) return 0;
  const rem = px / rootFontSize;
  // 부동소수점 오차 보정 (최대 소수점 4자리 반올림)
  return Math.round(rem * 10000) / 10000;
}

/**
 * rem을 px로 환산
 */
export function convertRemToPx(rem: number, rootFontSize = 16): number {
  const px = rem * rootFontSize;
  return Math.round(px * 100) / 100;
}

/**
 * Tailwind CSS Spacing 스케일 힌트 테이블 매핑
 */
const TAILWIND_SPACING_MAP: Record<string, string> = {
  '0': '0 (0px)',
  '0.125': '0.5 (2px / 0.125rem)',
  '0.25': '1 (4px / 0.25rem)',
  '0.375': '1.5 (6px / 0.375rem)',
  '0.5': '2 (8px / 0.5rem)',
  '0.625': '2.5 (10px / 0.625rem)',
  '0.75': '3 (12px / 0.75rem)',
  '0.875': '3.5 (14px / 0.875rem)',
  '1': '4 (16px / 1rem)',
  '1.25': '5 (20px / 1.25rem)',
  '1.5': '6 (24px / 1.5rem)',
  '1.75': '7 (28px / 1.75rem)',
  '2': '8 (32px / 2rem)',
  '2.25': '9 (36px / 2.25rem)',
  '2.5': '10 (40px / 2.5rem)',
  '2.75': '11 (44px / 2.75rem)',
  '3': '12 (48px / 3rem)',
  '3.5': '14 (56px / 3.5rem)',
  '4': '16 (64px / 4rem)',
  '5': '20 (80px / 5rem)',
  '6': '24 (96px / 6rem)',
  '7': '28 (112px / 7rem)',
  '8': '32 (128px / 8rem)',
};

export function getTailwindSpacingHint(rem: number): string | null {
  const key = rem.toString();
  return TAILWIND_SPACING_MAP[key] ?? null;
}

export interface CssUnitsResult {
  px: number;
  rem: number;
  em: number;
  percent: number;
  pt: number;
  tailwind: string | null;
}

/**
 * 픽셀(px) 값을 실무 핵심 CSS 단위(rem, em, percent, pt, tailwind)로 일괄 환산
 */
export function convertPxToCssUnits(
  px: number,
  rootFontSize = 16
): CssUnitsResult {
  const rem = convertPxToRem(px, rootFontSize);
  const em = rem;
  const percent = rootFontSize > 0 ? Math.round((px / rootFontSize) * 10000) / 100 : 0;
  const pt = Math.round((px * 0.75) * 100) / 100;
  const tailwind = getTailwindSpacingHint(rem);

  return {
    px,
    rem,
    em,
    percent,
    pt,
    tailwind,
  };
}

// -------------------------------------------------------------
// 3. 색상 코드 변환 (Color Converter)
// -------------------------------------------------------------

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

/**
 * 3자리 또는 6자리 HEX 코드 검증
 */
export function isValidHex(hex: string): boolean {
  const clean = hex.startsWith('#') ? hex.slice(1) : hex;
  return /^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(clean);
}

/**
 * 사용자 입력 문자열에서 '#' 및 공백/특수문자를 제거하고 최대 6자리 16진수로 정제
 */
export function sanitizeHexInput(value: string): string {
  if (!value) return '';
  const clean = value.replace(/^#+/, '').replace(/[^0-9a-fA-F]/g, '');
  return clean.slice(0, 6);
}

/**
 * HEX 코드를 RGB 객체로 변환
 */
export function hexToRgb(hex: string): RgbColor {
  let clean = hex.trim();
  if (clean.startsWith('#')) clean = clean.slice(1);

  // 3자리 축약형 (#fff) 대응
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }

  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * RGB 값을 소문자 6자리 HEX 문자열로 변환
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const clampR = Math.min(255, Math.max(0, Math.round(r)));
  const clampG = Math.min(255, Math.max(0, Math.round(g)));
  const clampB = Math.min(255, Math.max(0, Math.round(b)));

  const hex = ((1 << 24) + (clampR << 16) + (clampG << 8) + clampB)
    .toString(16)
    .slice(1);
  return `#${hex}`;
}

/**
 * RGB를 HSL로 변환
 */
export function rgbToHsl(r: number, g: number, b: number): HslColor {
  const normR = r / 255;
  const normG = g / 255;
  const normB = b / 255;

  const max = Math.max(normR, normG, normB);
  const min = Math.min(normR, normG, normB);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case normR:
        h = (normG - normB) / delta + (normG < normB ? 6 : 0);
        break;
      case normG:
        h = (normB - normR) / delta + 2;
        break;
      case normB:
        h = (normR - normG) / delta + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * HSL을 RGB로 역산
 */
export function hslToRgb(h: number, s: number, l: number): RgbColor {
  const normH = (h % 360) / 360;
  const normS = Math.min(100, Math.max(0, s)) / 100;
  const normL = Math.min(100, Math.max(0, l)) / 100;

  if (normS === 0) {
    const val = Math.round(normL * 255);
    return { r: val, g: val, b: val };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let normT = t;
    if (normT < 0) normT += 1;
    if (normT > 1) normT -= 1;
    if (normT < 1 / 6) return p + (q - p) * 6 * normT;
    if (normT < 1 / 2) return q;
    if (normT < 2 / 3) return p + (q - p) * (2 / 3 - normT) * 6;
    return p;
  };

  const q = normL < 0.5 ? normL * (1 + normS) : normL + normS - normL * normS;
  const p = 2 * normL - q;

  const r = hue2rgb(p, q, normH + 1 / 3);
  const g = hue2rgb(p, q, normH);
  const b = hue2rgb(p, q, normH - 1 / 3);

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * HEX 코드를 HSL 객체로 변환
 */
export function hexToHsl(hex: string): HslColor {
  const rgb = hexToRgb(hex);
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

/**
 * WCAG 2.1 상대 휘도(Relative Luminance) 계산
 */
function getRelativeLuminance(rgb: RgbColor): number {
  const sRGB = [rgb.r, rgb.g, rgb.b].map((val) => {
    const channel = val / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

/**
 * 두 색상 간의 WCAG 명암 대비율(Contrast Ratio) 산출 (1 ~ 21)
 */
export function getContrastRatio(hexA: string, hexB: string): number {
  const rgbA = hexToRgb(hexA);
  const rgbB = hexToRgb(hexB);

  const lumA = getRelativeLuminance(rgbA);
  const lumB = getRelativeLuminance(rgbB);

  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}
