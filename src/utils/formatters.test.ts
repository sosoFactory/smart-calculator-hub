import { describe, it, expect } from 'vitest';
import {
  formatNumberWithWon,
  formatKoreanUnit,
  formatChartAxisWon,
} from './formatters';

describe('formatters Tests', () => {
  describe('formatChartAxisWon', () => {
    it('1억 이상의 금액을 억 단위로 변환해야 한다', () => {
      expect(formatChartAxisWon(100_000_000)).toBe('1억');
      expect(formatChartAxisWon(250_000_000)).toBe('3억'); // toFixed(0) 반올림
      expect(formatChartAxisWon(1_000_000_000)).toBe('10억');
    });

    it('1만 이상 1억 미만의 금액을 만 단위로 변환해야 한다', () => {
      expect(formatChartAxisWon(10_000)).toBe('1만');
      expect(formatChartAxisWon(50_000_000)).toBe('5000만');
      expect(formatChartAxisWon(3_500_000)).toBe('350만');
    });

    it('1만 미만의 금액을 문자열 또는 원 단위로 변환해야 한다', () => {
      expect(formatChartAxisWon(0)).toBe('0');
      expect(formatChartAxisWon(5_000)).toBe('5,000');
    });

    it('NaN 또는 유효하지 않은 값 처리', () => {
      expect(formatChartAxisWon(NaN)).toBe('0');
      expect(formatChartAxisWon(Infinity)).toBe('0');
    });
  });

  describe('기존 포맷터 정상 동작 확인', () => {
    it('formatNumberWithWon', () => {
      expect(formatNumberWithWon(10000)).toBe('10,000원');
      expect(formatNumberWithWon(0)).toBe('0원');
    });

    it('formatKoreanUnit', () => {
      expect(formatKoreanUnit(125_000_000)).toBe('1억 2,500만 원');
      expect(formatKoreanUnit(0)).toBe('0원');
    });
  });
});
