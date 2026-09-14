import { describe, it, expect } from 'vitest';
import {
  calculateExchange,
  formatCurrencyAmount,
  getExchangeRateText,
} from './exchangeCalculator';

describe('exchangeCalculator Tests', () => {
  it('매매기준율(base)로 100달러(USD)를 원화(KRW)로 변환 시 135,000원이 나와야 한다', () => {
    const res = calculateExchange(100, 'USD', 'KRW', 'base', 0);
    expect(res.convertedAmount).toBe(135000);
    expect(res.appliedRate).toBe(1350);
    expect(res.spreadFeeKRW).toBe(0);
    expect(res.discountSavedKRW).toBe(0);
  });

  it('1,000엔(JPY, 100엔당 900원)을 원화로 환산 시 9,000원이 나와야 한다', () => {
    const res = calculateExchange(1000, 'JPY', 'KRW', 'base', 0);
    expect(res.convertedAmount).toBe(9000);
    expect(res.appliedRate).toBe(9);
  });

  it('현찰 살 때(cash_buy) 우대율 0% vs 90% 시 수수료 절약 금액이 올바르게 계산되어야 한다', () => {
    // 1000달러 = 기준 1,350,000원. 스프레드 1.75% = 23,625원.
    const resZero = calculateExchange(1000, 'USD', 'KRW', 'cash_buy', 0);
    expect(resZero.convertedAmount).toBeGreaterThan(1350000);
    expect(resZero.discountSavedKRW).toBe(0);

    const resNinety = calculateExchange(1000, 'USD', 'KRW', 'cash_buy', 90);
    // 90% 우대 시 수수료의 90%가 절약되어야 함
    expect(resNinety.discountSavedKRW).toBeCloseTo(resZero.spreadFeeKRW * 0.9, 1);
  });

  it('formatCurrencyAmount 유틸이 통화별 소수점 규칙을 지켜야 한다', () => {
    expect(formatCurrencyAmount(12345.67, 'USD')).toBe('12,345.67');
    expect(formatCurrencyAmount(12345.67, 'KRW')).toBe('12,346');
    expect(formatCurrencyAmount(10000, 'JPY')).toBe('10,000');
  });

  it('customRates가 주어지면 실시간 고시 환율을 기준으로 환산되어야 한다', () => {
    const customRates = {
      KRW: 1,
      USD: 1400.0,
      JPY: 950.0,
      EUR: 1500.0,
      CNY: 190.0,
      GBP: 1800.0,
    };
    const res = calculateExchange(100, 'USD', 'KRW', 'base', 0, customRates);
    expect(res.convertedAmount).toBe(140000);
    expect(res.appliedRate).toBe(1400);
  });

  describe('getExchangeRateText 스마트 환율 표기 테스트', () => {
    it('KRW -> USD 변환 시 1 USD = x KRW 형태로 역산 표기되어야 한다 (0달러 표기 방지)', () => {
      const rateFromKrwToUsd = 1 / 1350;
      expect(getExchangeRateText('KRW', 'USD', rateFromKrwToUsd)).toBe('1 USD = 1,350 KRW');
    });

    it('KRW -> JPY 변환 시 100 JPY = x KRW 형태로 100엔 기준 역산 표기되어야 한다', () => {
      const rateFromKrwToJpy = 1 / 9; // 1원 = 1/9엔 (100엔 = 900원)
      expect(getExchangeRateText('KRW', 'JPY', rateFromKrwToJpy)).toBe('100 JPY = 900 KRW');
    });

    it('USD -> KRW 변환 시 1 USD = 1,350 KRW 형태로 정상 표기되어야 한다', () => {
      expect(getExchangeRateText('USD', 'KRW', 1350)).toBe('1 USD = 1,350 KRW');
    });

    it('JPY -> KRW 변환 시 100 JPY = 900 KRW 형태로 100엔 기준 표기되어야 한다', () => {
      expect(getExchangeRateText('JPY', 'KRW', 9)).toBe('100 JPY = 900 KRW');
    });

    it('외화 간 변환(EUR -> USD) 시 1 EUR = x USD 형태로 직관적 표기되어야 한다', () => {
      expect(getExchangeRateText('EUR', 'USD', 1.085)).toBe('1 EUR = 1.09 USD');
    });

    it('비정상 환율(0 이하) 입력 시 fallback 텍스트를 반환해야 한다', () => {
      expect(getExchangeRateText('KRW', 'USD', 0)).toBe('1 USD = - KRW');
      expect(getExchangeRateText('KRW', 'JPY', 0)).toBe('100 JPY = - KRW');
      expect(getExchangeRateText('USD', 'KRW', 0)).toBe('1 USD = 0 KRW');
    });
  });
});

