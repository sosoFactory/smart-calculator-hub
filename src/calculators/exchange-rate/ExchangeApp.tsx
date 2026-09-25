import React, { useState, useEffect } from 'react';
import {
  CurrencyCode,
  ExchangePreset,
  ExchangeRateSnapshot,
  ExchangeType,
  SpreadDiscount,
} from '../../types/exchange';
import {
  calculateExchange,
  CURRENCIES_DATA,
  DEFAULT_EXCHANGE_SNAPSHOT,
  fetchLiveExchangeRates,
} from '../../utils/exchangeCalculator';
import { decodeExchangeQuery, encodeExchangeQuery, syncUrlQuery } from '../../utils/deepLink';
import { DualExchangeCard } from './components/DualExchangeCard';
import { ExchangePresetChips } from './components/ExchangePresetChips';
import { MultiExchangeGrid } from './components/MultiExchangeGrid';
import { ExchangeInfoCard } from './components/ExchangeInfoCard';
import { siteConfig } from '../../config/site';

const STORAGE_KEY = 'smart_calculator_exchange_v1';
const SNAPSHOT_STORAGE_KEY = 'smart_calculator_exchange_snapshot_v1';

interface StoredExchangeState {
  fromCode: CurrencyCode;
  toCode: CurrencyCode;
  amount: number;
  exchangeType: ExchangeType;
  discount: SpreadDiscount;
}

export const ExchangeApp: React.FC = () => {
  const initialFromUrl = typeof window !== 'undefined' && window.location.search ? decodeExchangeQuery(window.location.search) : null;

  const [fromCode, setFromCode] = useState<CurrencyCode>(() => {
    if (initialFromUrl?.from && CURRENCIES_DATA[initialFromUrl.from as CurrencyCode]) {
      return initialFromUrl.from as CurrencyCode;
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredExchangeState = JSON.parse(saved);
        if (parsed.fromCode && CURRENCIES_DATA[parsed.fromCode]) return parsed.fromCode;
      }
    } catch {
      // fallback
    }
    return 'USD';
  });

  const [toCode, setToCode] = useState<CurrencyCode>(() => {
    if (initialFromUrl?.to && CURRENCIES_DATA[initialFromUrl.to as CurrencyCode]) {
      return initialFromUrl.to as CurrencyCode;
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredExchangeState = JSON.parse(saved);
        if (parsed.toCode && CURRENCIES_DATA[parsed.toCode]) return parsed.toCode;
      }
    } catch {
      // fallback
    }
    return 'KRW';
  });

  const [amount, setAmount] = useState<number | ''>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredExchangeState = JSON.parse(saved);
        if (typeof parsed.amount === 'number') return parsed.amount;
      }
    } catch {
      // fallback
    }
    return 100;
  });

  const [exchangeType, setExchangeType] = useState<ExchangeType>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredExchangeState = JSON.parse(saved);
        if (['base', 'cash_buy', 'cash_sell', 'send', 'receive'].includes(parsed.exchangeType)) {
          return parsed.exchangeType;
        }
      }
    } catch {
      // fallback
    }
    return 'cash_buy';
  });

  const [discount, setDiscount] = useState<SpreadDiscount>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredExchangeState = JSON.parse(saved);
        if ([0, 50, 80, 90, 100].includes(parsed.discount)) return parsed.discount;
      }
    } catch {
      // fallback
    }
    return 90;
  });

  // 환율 스냅샷 상태 (오프라인 캐시 및 기본값 우선)
  const [snapshot, setSnapshot] = useState<ExchangeRateSnapshot>(() => {
    try {
      const saved = localStorage.getItem(SNAPSHOT_STORAGE_KEY);
      if (saved) {
        const parsed: ExchangeRateSnapshot = JSON.parse(saved);
        if (parsed.baseDate && parsed.ratesToKRW) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_EXCHANGE_SNAPSHOT;
  });

  // 페이지 진입 시 백그라운드 자동 최신 환율 동기화 (Stale-While-Revalidate)
  useEffect(() => {
    let isMounted = true;
    fetchLiveExchangeRates().then((liveSnapshot) => {
      if (isMounted && liveSnapshot) {
        setSnapshot(liveSnapshot);
        try {
          localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(liveSnapshot));
        } catch {
          // ignore
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // 로컬 스토리지 상태 저장
  useEffect(() => {
    try {
      const stateToSave: StoredExchangeState = {
        fromCode,
        toCode,
        amount: typeof amount === 'number' ? amount : 0,
        exchangeType,
        discount,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // ignore
    }
    const query = encodeExchangeQuery({
      from: fromCode,
      to: toCode,
      amount: typeof amount === 'number' ? amount : undefined,
      spread: discount > 0 ? discount : undefined,
    });
    syncUrlQuery(query);
  }, [fromCode, toCode, amount, exchangeType, discount]);

  // 페이지 타이틀 설정 (국문 네이밍 규칙: 한글 스마트 배제)
  useEffect(() => {
    document.title = siteConfig.getTitle('환율 계산기');
  }, []);

  const handleSwap = () => {
    setFromCode(toCode);
    setToCode(fromCode);
  };

  const handleSelectPreset = (preset: ExchangePreset) => {
    setFromCode(preset.fromCurrency);
    setToCode(preset.toCurrency);
    setAmount(preset.amount);
  };

  const numericAmount = typeof amount === 'number' ? amount : 0;
  const calculationResult = calculateExchange(
    numericAmount,
    fromCode,
    toCode,
    exchangeType,
    discount,
    snapshot.ratesToKRW
  );

  return (
    <div className="space-y-4 w-full">
      {/* 1. 메인 듀얼 환율 변환 카드 */}
      <DualExchangeCard
        fromCode={fromCode}
        toCode={toCode}
        amount={amount}
        convertedAmount={calculationResult.convertedAmount}
        appliedRate={calculationResult.appliedRate}
        exchangeType={exchangeType}
        discount={discount}
        discountSavedKRW={calculationResult.discountSavedKRW}
        snapshot={snapshot}
        onFromChange={setFromCode}
        onToChange={setToCode}
        onAmountChange={setAmount}
        onSwap={handleSwap}
        onTypeChange={setExchangeType}
        onDiscountChange={setDiscount}
      />

      {/* 2. 여행 & 해외직구 퀵 프리셋 칩 */}
      <ExchangePresetChips onSelectPreset={handleSelectPreset} />

      {/* 3. 전체 6대 통화 일괄 실시간 비교 그리드 */}
      <MultiExchangeGrid
        fromCode={fromCode}
        amount={numericAmount}
        exchangeType={exchangeType}
        discount={discount}
        customRates={snapshot.ratesToKRW}
      />

      {/* 4. 환전 상식 및 면세 가이드 안내 카드 */}
      <ExchangeInfoCard />
    </div>
  );
};
