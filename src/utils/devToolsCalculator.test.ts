import { describe, it, expect } from 'vitest';
import {
  // 진수 변환
  convertBase,
  formatBinaryNibbles,
  isValidBaseInput,
  formatRadixWithPrefix,
  // CSS 단위 변환
  convertPxToRem,
  convertRemToPx,
  getTailwindSpacingHint,
  convertPxToCssUnits,
  // 색상 변환
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  hexToHsl,
  getContrastRatio,
  isValidHex,
  sanitizeHexInput,
} from './devToolsCalculator';

describe('DevTools: 진수 변환 (Base Converter)', () => {
  it('formatRadixWithPrefix: 진법별 프로그래밍 접두사를 올바르게 부여해야 한다', () => {
    expect(formatRadixWithPrefix('ff', 16)).toBe('0xff');
    expect(formatRadixWithPrefix('1111', 2)).toBe('0b1111');
    expect(formatRadixWithPrefix('377', 8)).toBe('0o377');
    expect(formatRadixWithPrefix('255', 10)).toBe('255');
    expect(formatRadixWithPrefix('', 16)).toBe('');
  });
  it('10진수 입력을 2진수, 8진수, 16진수로 정확하게 변환해야 한다', () => {
    const result = convertBase('255', 10);
    expect(result.bin).toBe('11111111');
    expect(result.oct).toBe('377');
    expect(result.dec).toBe('255');
    expect(result.hex).toBe('FF');
  });

  it('2진수 입력을 다른 모든 진법으로 정확하게 변환해야 한다', () => {
    const result = convertBase('1010', 2);
    expect(result.bin).toBe('1010');
    expect(result.oct).toBe('12');
    expect(result.dec).toBe('10');
    expect(result.hex).toBe('A');
  });

  it('16진수 입력을 다른 모든 진법으로 정확하게 변환해야 한다 (소문자 포함)', () => {
    const result = convertBase('1a', 16);
    expect(result.bin).toBe('11010');
    expect(result.oct).toBe('32');
    expect(result.dec).toBe('26');
    expect(result.hex).toBe('1A');
  });

  it('8진수 입력을 다른 모든 진법으로 정확하게 변환해야 한다', () => {
    const result = convertBase('77', 8);
    expect(result.bin).toBe('111111');
    expect(result.oct).toBe('77');
    expect(result.dec).toBe('63');
    expect(result.hex).toBe('3F');
  });

  it('빈 값 또는 0 입력 시 안전하게 0/빈 문자열 결과를 반환해야 한다', () => {
    const emptyResult = convertBase('', 10);
    expect(emptyResult.bin).toBe('');
    expect(emptyResult.oct).toBe('');
    expect(emptyResult.dec).toBe('');
    expect(emptyResult.hex).toBe('');

    const zeroResult = convertBase('0', 10);
    expect(zeroResult.bin).toBe('0');
    expect(zeroResult.oct).toBe('0');
    expect(zeroResult.dec).toBe('0');
    expect(zeroResult.hex).toBe('0');
  });

  it('진법별 입력 유효성을 정확하게 검증해야 한다', () => {
    expect(isValidBaseInput('1010', 2)).toBe(true);
    expect(isValidBaseInput('1012', 2)).toBe(false);

    expect(isValidBaseInput('765', 8)).toBe(true);
    expect(isValidBaseInput('789', 8)).toBe(false);

    expect(isValidBaseInput('12345', 10)).toBe(true);
    expect(isValidBaseInput('123a', 10)).toBe(false);

    expect(isValidBaseInput('1a2F', 16)).toBe(true);
    expect(isValidBaseInput('1a2G', 16)).toBe(false);
  });

  it('2진수 문자열을 4비트(Nibble) 단위로 공백 포맷팅해야 한다', () => {
    expect(formatBinaryNibbles('11111111')).toBe('1111 1111');
    expect(formatBinaryNibbles('10101')).toBe('1 0101');
    expect(formatBinaryNibbles('')).toBe('');
  });
});

describe('DevTools: CSS 단위 변환 (CSS Unit Converter)', () => {
  it('기본 16px 기준 px을 rem으로 정확하게 변환해야 한다', () => {
    expect(convertPxToRem(16, 16)).toBe(1);
    expect(convertPxToRem(24, 16)).toBe(1.5);
    expect(convertPxToRem(12, 16)).toBe(0.75);
    expect(convertPxToRem(0, 16)).toBe(0);
  });

  it('커스텀 루트 폰트 크기 기준 px을 rem으로 변환해야 한다', () => {
    expect(convertPxToRem(20, 10)).toBe(2);
    expect(convertPxToRem(15, 10)).toBe(1.5);
  });

  it('rem을 px로 정확하게 역산해야 한다', () => {
    expect(convertRemToPx(1, 16)).toBe(16);
    expect(convertRemToPx(1.5, 16)).toBe(24);
    expect(convertRemToPx(0.875, 16)).toBe(14);
  });

  it('rem 값에 매칭되는 Tailwind spacing 클래스 힌트를 제공해야 한다', () => {
    expect(getTailwindSpacingHint(1)).toBe('4 (16px / 1rem)');
    expect(getTailwindSpacingHint(1.5)).toBe('6 (24px / 1.5rem)');
    expect(getTailwindSpacingHint(2)).toBe('8 (32px / 2rem)');
    expect(getTailwindSpacingHint(0.25)).toBe('1 (4px / 0.25rem)');
    expect(getTailwindSpacingHint(999)).toBeNull();
  });
});

describe('DevTools: 색상 코드 변환 (Color Converter)', () => {
  it('HEX 코드를 RGB 객체로 정확하게 변환해야 한다', () => {
    expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    expect(hexToRgb('#d1ff19')).toEqual({ r: 209, g: 255, b: 25 }); // Electric Lime
    // 3자리 축약형 HEX
    expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('RGB를 HEX 코드로 정확하게 변환해야 한다', () => {
    expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
    expect(rgbToHex(0, 0, 0)).toBe('#000000');
    expect(rgbToHex(209, 255, 25)).toBe('#d1ff19');
  });

  it('RGB를 HSL 객체로 정확하게 변환해야 한다', () => {
    expect(rgbToHsl(255, 255, 255)).toEqual({ h: 0, s: 0, l: 100 });
    expect(rgbToHsl(0, 0, 0)).toEqual({ h: 0, s: 0, l: 0 });
    expect(rgbToHsl(255, 0, 0)).toEqual({ h: 0, s: 100, l: 50 });
  });

  it('HSL을 RGB 객체로 정확하게 역산해야 한다', () => {
    expect(hslToRgb(0, 0, 100)).toEqual({ r: 255, g: 255, b: 255 });
    expect(hslToRgb(0, 0, 0)).toEqual({ r: 0, g: 0, b: 0 });
    expect(hslToRgb(0, 100, 50)).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('HEX를 HSL로 직접 변환해야 한다', () => {
    expect(hexToHsl('#ffffff')).toEqual({ h: 0, s: 0, l: 100 });
    expect(hexToHsl('#ff0000')).toEqual({ h: 0, s: 100, l: 50 });
  });

  it('HEX 유효성을 엄격히 판별해야 한다', () => {
    expect(isValidHex('#ffffff')).toBe(true);
    expect(isValidHex('ffffff')).toBe(true);
    expect(isValidHex('#fff')).toBe(true);
    expect(isValidHex('fff')).toBe(true);
    expect(isValidHex('#d1ff19')).toBe(true);

    expect(isValidHex('#fffffg')).toBe(false);
    expect(isValidHex('#12')).toBe(false);
    expect(isValidHex('12345')).toBe(false);
  });

  it('배경색과 텍스트색 간의 WCAG 명암비(Contrast Ratio)를 정확히 산출해야 한다', () => {
    // 흰색과 검은색의 최대 명암비는 21:1
    const whiteBlackRatio = getContrastRatio('#ffffff', '#000000');
    expect(whiteBlackRatio).toBeCloseTo(21, 0);

    // 동일 색상 간 명암비는 1:1
    const sameRatio = getContrastRatio('#ffffff', '#ffffff');
    expect(sameRatio).toBeCloseTo(1, 0);
  });

  it('sanitizeHexInput: # 접두사 및 잘못된 문자를 안전하게 정제해야 한다', () => {
    expect(sanitizeHexInput('#d1ff19')).toBe('d1ff19');
    expect(sanitizeHexInput('###D1FF19')).toBe('D1FF19');
    expect(sanitizeHexInput('d1ff19abc')).toBe('d1ff19'); // max 6 chars
    expect(sanitizeHexInput('hello#world')).toBe('ed'); // non-hex filtered
    expect(sanitizeHexInput('')).toBe('');
  });
});

describe('DevTools: 실무 핵심 CSS 단위 일괄 변환 (CSS Units)', () => {
  it('16px 기준 실무 핵심 CSS 단위(rem, em, percent, pt, tailwind)로 정확하게 일괄 변환해야 한다', () => {
    const res = convertPxToCssUnits(16, 16);
    expect(res.px).toBe(16);
    expect(res.rem).toBe(1);
    expect(res.em).toBe(1);
    expect(res.percent).toBe(100);
    expect(res.pt).toBe(12);
    expect(res.tailwind).toBe('4 (16px / 1rem)');
  });

  it('24px 기준 및 루트 폰트 크기 변경 시 비례하여 환산되어야 한다', () => {
    const res = convertPxToCssUnits(24, 16);
    expect(res.rem).toBe(1.5);
    expect(res.em).toBe(1.5);
    expect(res.percent).toBe(150);
    expect(res.pt).toBe(18);
    expect(res.tailwind).toBe('6 (24px / 1.5rem)');
  });
});
