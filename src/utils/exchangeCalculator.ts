import {
  CurrencyCode,
  CurrencyItem,
  ExchangeCalculationResult,
  ExchangePreset,
  ExchangeRateSnapshot,
  ExchangeType,
  SpreadDiscount,
} from '../types/exchange';

// 6대 주요 통화 기본 정보 및 기준 매매기준율 (오프라인 PWA 기본값)
export const DEFAULT_EXCHANGE_SNAPSHOT: ExchangeRateSnapshot = {
  baseDate: '2026.09.07',
  lastUpdatedTime: '11:00',
  source: '글로벌 공시 매매기준율 (Open Exchange Rates)',
  ratesToKRW: {
    KRW: 1,
    USD: 1350.0,
    JPY: 900.0, // 100엔당 900원
    EUR: 1470.0,
    CNY: 188.0,
    GBP: 1730.0,
  },
  isLive: false,
};
export const CURRENCIES_DATA: Record<CurrencyCode, CurrencyItem> = {
  KRW: {
    code: 'KRW',
    name: '대한민국 원',
    symbol: '₩',
    baseRateToKRW: 1,
    baseUnit: 1,
    spreadRate: 0,
  },
  USD: {
    code: 'USD',
    name: '미국 달러',
    symbol: '$',
    baseRateToKRW: 1350.0,
    baseUnit: 1,
    spreadRate: 0.0175, // 1.75% 스프레드
  },
  JPY: {
    code: 'JPY',
    name: '일본 엔 (100엔)',
    symbol: '¥',
    baseRateToKRW: 900.0, // 100엔당 900원 (1엔당 9원)
    baseUnit: 100,
    spreadRate: 0.0175,
  },
  EUR: {
    code: 'EUR',
    name: '유럽연합 유로',
    symbol: '€',
    baseRateToKRW: 1470.0,
    baseUnit: 1,
    spreadRate: 0.0195, // 1.95%
  },
  CNY: {
    code: 'CNY',
    name: '중국 위안',
    symbol: '¥',
    baseRateToKRW: 188.0,
    baseUnit: 1,
    spreadRate: 0.05, // 5.0%
  },
  GBP: {
    code: 'GBP',
    name: '영국 파운드',
    symbol: '£',
    baseRateToKRW: 1730.0,
    baseUnit: 1,
    spreadRate: 0.0195,
  },
};

export const EXCHANGE_PRESETS: ExchangePreset[] = [
  {
    label: '$100 (비상금)',
    fromCurrency: 'USD',
    toCurrency: 'KRW',
    amount: 100,
    badge: '인기',
    description: '미국 여행 소액 비상금 환전',
  },
  {
    label: '$200 (직구 면세)',
    fromCurrency: 'USD',
    toCurrency: 'KRW',
    amount: 200,
    badge: '추천',
    description: '미국 해외직구 목록통관 면세한도',
  },
  {
    label: '10,000엔 (1만엔권)',
    fromCurrency: 'JPY',
    toCurrency: 'KRW',
    amount: 10000,
    badge: '인기',
    description: '일본 여행 기본 지폐 1만엔',
  },
  {
    label: '€100 (유럽 여행)',
    fromCurrency: 'EUR',
    toCurrency: 'KRW',
    amount: 100,
    description: '유럽 여행 일일 지출 경비',
  },
  {
    label: '100만원 환전',
    fromCurrency: 'KRW',
    toCurrency: 'USD',
    amount: 1000000,
    description: '원화 100만원을 달러로 환전',
  },
];

/**
 * 통화 단위(JPY 등 100엔)를 감안한 1외화당 원화 단가 계산
 */
export function getPerUnitRateToKRW(
  currency: CurrencyItem,
  customRates?: Record<CurrencyCode, number>
): number {
  const baseRate = customRates?.[currency.code] ?? currency.baseRateToKRW;
  return baseRate / currency.baseUnit;
}

/**
 * 스프레드 및 우대율이 적용된 통화의 실질 원화 단가 계산
 */
export function getAdjustedRateToKRW(
  currency: CurrencyItem,
  type: ExchangeType,
  discount: SpreadDiscount,
  customRates?: Record<CurrencyCode, number>
): number {
  const baseRate = getPerUnitRateToKRW(currency, customRates);
  if (currency.code === 'KRW' || type === 'base') {
    return baseRate;
  }

  // 할인 후 실질 스프레드 비율
  const effectiveSpread = currency.spreadRate * (1 - discount / 100);

  if (type === 'cash_buy' || type === 'send') {
    // 외화를 살 때 / 송금 보낼 때 -> 더 비싸게 삼
    return baseRate * (1 + effectiveSpread);
  } else if (type === 'cash_sell' || type === 'receive') {
    // 외화를 팔 때 / 송금 받을 때 -> 더 싸게 팖
    return baseRate * (1 - effectiveSpread);
  }

  return baseRate;
}

/**
 * 양방향 환율 변환 계산
 */
export function calculateExchange(
  amount: number,
  fromCode: CurrencyCode,
  toCode: CurrencyCode,
  type: ExchangeType = 'base',
  discount: SpreadDiscount = 90,
  customRates?: Record<CurrencyCode, number>
): ExchangeCalculationResult {
  const fromCurrency = CURRENCIES_DATA[fromCode] || CURRENCIES_DATA.USD;
  const toCurrency = CURRENCIES_DATA[toCode] || CURRENCIES_DATA.KRW;

  if (amount <= 0 || isNaN(amount)) {
    return {
      fromCurrency: fromCode,
      toCurrency: toCode,
      inputAmount: 0,
      convertedAmount: 0,
      appliedRate: 0,
      baseRate: 0,
      spreadFeeKRW: 0,
      discountSavedKRW: 0,
    };
  }

  // 1. 기준 원화 단가
  const fromBasePerUnit = getPerUnitRateToKRW(fromCurrency, customRates);
  const toBasePerUnit = getPerUnitRateToKRW(toCurrency, customRates);
  const baseRate = fromBasePerUnit / toBasePerUnit;

  // 2. 적용 원화 단가 (스프레드/우대율 반영)
  const fromAdjPerUnit = getAdjustedRateToKRW(fromCurrency, type, discount, customRates);
  const toAdjPerUnit = getAdjustedRateToKRW(toCurrency, type, discount, customRates);
  const appliedRate = fromAdjPerUnit / toAdjPerUnit;

  // 3. 우대율 0%일 때 원화 단가 (절약금액 산출용)
  const fromZeroPerUnit = getAdjustedRateToKRW(fromCurrency, type, 0, customRates);

  const convertedAmount = amount * appliedRate;

  // 수수료 및 절약액 계산 (원화 기준)
  const baseTotalKRW = amount * fromBasePerUnit;
  const zeroTotalKRW = amount * fromZeroPerUnit;
  const appliedTotalKRW = amount * fromAdjPerUnit;

  const fullSpreadFeeKRW = Math.abs(zeroTotalKRW - baseTotalKRW);
  const actualSpreadFeeKRW = Math.abs(appliedTotalKRW - baseTotalKRW);
  const discountSavedKRW = Math.max(0, fullSpreadFeeKRW - actualSpreadFeeKRW);

  return {
    fromCurrency: fromCode,
    toCurrency: toCode,
    inputAmount: amount,
    convertedAmount,
    appliedRate,
    baseRate,
    spreadFeeKRW: actualSpreadFeeKRW,
    discountSavedKRW,
  };
}

/**
 * 금액 포맷팅 유틸 (원화는 소수점 제외, 외화는 2자리)
 */
export function formatCurrencyAmount(amount: number, code: CurrencyCode): string {
  if (code === 'KRW' || code === 'JPY') {
    return Math.round(amount).toLocaleString('ko-KR');
  }
  return amount.toLocaleString('ko-KR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * 우상단 기준 환율 안내 텍스트 생성 (국내 금융 관행 반영)
 * - 원화(KRW) -> 외화인 경우: 소수점 절사로 인한 0달러/0엔 표시를 방지하고,
 *   한국인에게 직관적인 외화 1단위(엔화는 100엔)당 원화 가치로 역산 표기
 * - 외화가 입력인 경우: 외화 1단위(엔화는 100엔)당 상대 통화 가치 표기
 */
export function getExchangeRateText(
  fromCode: CurrencyCode,
  toCode: CurrencyCode,
  appliedRate: number
): string {
  if (fromCode === toCode) {
    return `1 ${fromCode} = 1 ${toCode}`;
  }

  // 1. 입력이 원화(KRW)이고 대상이 외화인 경우 -> 외화 기준 역산 표기
  if (fromCode === 'KRW') {
    if (appliedRate <= 0) {
      return toCode === 'JPY' ? '100 JPY = - KRW' : `1 ${toCode} = - KRW`;
    }
    if (toCode === 'JPY') {
      const rateFor100 = 100 / appliedRate;
      const formatted = rateFor100.toLocaleString('ko-KR', {
        minimumFractionDigits: rateFor100 % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
      });
      return `100 JPY = ${formatted} KRW`;
    }
    const rateFor1 = 1 / appliedRate;
    const formatted = rateFor1.toLocaleString('ko-KR', {
      minimumFractionDigits: rateFor1 % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    });
    return `1 ${toCode} = ${formatted} KRW`;
  }

  // 2. 입력이 엔화(JPY)인 경우 -> 100엔 기준 표기
  if (fromCode === 'JPY') {
    const rateFor100 = appliedRate * 100;
    const formatted =
      toCode === 'KRW'
        ? rateFor100.toLocaleString('ko-KR', {
            minimumFractionDigits: rateFor100 % 1 === 0 ? 0 : 2,
            maximumFractionDigits: 2,
          })
        : formatCurrencyAmount(rateFor100, toCode);
    return `100 JPY = ${formatted} ${toCode}`;
  }

  // 3. 그 외 외화 (USD, EUR, CNY, GBP 등)
  const formatted =
    toCode === 'KRW'
      ? appliedRate.toLocaleString('ko-KR', {
          minimumFractionDigits: appliedRate % 1 === 0 ? 0 : 2,
          maximumFractionDigits: 2,
        })
      : formatCurrencyAmount(appliedRate, toCode);

  return `1 ${fromCode} = ${formatted} ${toCode}`;
}

/**
 * 공개 환율 API(open.er-api.com)를 통한 최신 고시 환율 비동기 동기화
 */
export async function fetchLiveExchangeRates(): Promise<ExchangeRateSnapshot | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (!res.ok) return null;

    const data = await res.json();
    if (!data || !data.rates || !data.rates.KRW) return null;

    const usdToKrw = data.rates.KRW;
    const ratesToKRW: Record<CurrencyCode, number> = {
      KRW: 1,
      USD: Math.round(usdToKrw * 100) / 100,
      JPY: data.rates.JPY ? Math.round((usdToKrw / data.rates.JPY) * 100 * 100) / 100 : 900.0, // 100엔당
      EUR: data.rates.EUR ? Math.round((usdToKrw / data.rates.EUR) * 100) / 100 : 1470.0,
      CNY: data.rates.CNY ? Math.round((usdToKrw / data.rates.CNY) * 100) / 100 : 188.0,
      GBP: data.rates.GBP ? Math.round((usdToKrw / data.rates.GBP) * 100) / 100 : 1730.0,
    };

    const dateStr = data.time_last_update_utc
      ? new Date(data.time_last_update_utc).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).replace(/\. /g, '.').replace(/\.$/, '')
      : new Date().toLocaleDateString('ko-KR');

    const timeStr = new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    return {
      baseDate: dateStr,
      lastUpdatedTime: timeStr,
      source: '글로벌 공시 매매기준율 (Open Exchange Rates)',
      ratesToKRW,
      isLive: true,
    };
  } catch {
    return null;
  }
}
