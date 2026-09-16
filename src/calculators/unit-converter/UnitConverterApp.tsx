import React, { useState, useEffect } from 'react';
import { DecimalPrecision, QuickPreset, UnitCategory } from '../../types/unit';
import {
  UNITS_DATA,
  CATEGORY_DEFAULTS,
  convertUnitValue,
  convertToAllUnits,
  formatUnitValue,
} from '../../utils/unitConverter';
import { UnitCategoryTabs } from './components/UnitCategoryTabs';
import { DualConverterCard } from './components/DualConverterCard';
import { QuickPresetChips } from './components/QuickPresetChips';
import { MultiResultGrid } from './components/MultiResultGrid';
import { UnitInfoCard } from './components/UnitInfoCard';
import { siteConfig } from '../../config/site';

const STORAGE_KEY = 'smart_calculator_unit_converter_v1';

interface StoredUnitState {
  category: UnitCategory;
  fromUnitId: string;
  toUnitId: string;
  inputValue: number;
  precision: DecimalPrecision;
}

export const UnitConverterApp: React.FC = () => {
  // 로컬 스토리지 초기 상태 로드
  const [category, setCategory] = useState<UnitCategory>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredUnitState = JSON.parse(saved);
        if (parsed.category && UNITS_DATA[parsed.category]) return parsed.category;
      }
    } catch {
      // fallback
    }
    return 'area';
  });

  const [fromUnitId, setFromUnitId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredUnitState = JSON.parse(saved);
        if (parsed.fromUnitId) return parsed.fromUnitId;
      }
    } catch {
      // fallback
    }
    return 'sqm';
  });

  const [toUnitId, setToUnitId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredUnitState = JSON.parse(saved);
        if (parsed.toUnitId) return parsed.toUnitId;
      }
    } catch {
      // fallback
    }
    return 'pyeong';
  });

  const [inputValue, setInputValue] = useState<number | ''>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredUnitState = JSON.parse(saved);
        if (typeof parsed.inputValue === 'number') return parsed.inputValue;
      }
    } catch {
      // fallback
    }
    return 84;
  });

  const [precision, setPrecision] = useState<DecimalPrecision>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredUnitState = JSON.parse(saved);
        if ([0, 2, 4, 6].includes(parsed.precision)) return parsed.precision;
      }
    } catch {
      // fallback
    }
    return 2;
  });

  // 상태 변경 시 LocalStorage에 저장
  useEffect(() => {
    try {
      const stateToSave: StoredUnitState = {
        category,
        fromUnitId,
        toUnitId,
        inputValue: typeof inputValue === 'number' ? inputValue : 0,
        precision,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // ignore
    }
  }, [category, fromUnitId, toUnitId, inputValue, precision]);

  // 페이지 타이틀 및 메타 동적 업데이트
  useEffect(() => {
    document.title = siteConfig.getTitle('단위 변환기');
  }, []);

  // 카테고리 변경 시 자주 찾는 생활 프리셋 1순위 기반 기본 단위/수치 자동 선택
  const handleSelectCategory = (newCat: UnitCategory) => {
    setCategory(newCat);
    const defaults = CATEGORY_DEFAULTS[newCat];
    if (defaults) {
      setFromUnitId(defaults.fromUnitId);
      setToUnitId(defaults.toUnitId);
      setInputValue(defaults.inputValue);
    } else {
      const units = UNITS_DATA[newCat];
      if (units.length >= 2) {
        setFromUnitId(units[0].id);
        setToUnitId(units[1].id);
      }
    }
  };

  // 단위 맞바꾸기(Swap)
  const handleSwapUnits = () => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
  };

  // 프리셋 선택
  const handleSelectPreset = (preset: QuickPreset) => {
    setCategory(preset.category);
    setFromUnitId(preset.unitId);
    setInputValue(preset.value);

    // 도착 단위가 선택한 프리셋 단위와 같아지면 상호 단위로 스마트하게 변경
    if (toUnitId === preset.unitId) {
      const defaults = CATEGORY_DEFAULTS[preset.category];
      if (defaults && defaults.toUnitId !== preset.unitId) {
        setToUnitId(defaults.toUnitId);
      } else {
        const units = UNITS_DATA[preset.category];
        const altUnit = units.find((u) => u.id !== preset.unitId);
        if (altUnit) setToUnitId(altUnit.id);
      }
    }
  };

  const currentUnits = UNITS_DATA[category] || [];
  const numericInput = typeof inputValue === 'number' ? inputValue : 0;

  // 메인 듀얼 결과 계산
  const convertedValue = convertUnitValue(numericInput, fromUnitId, toUnitId, category);
  const formattedConvertedValue = formatUnitValue(convertedValue, precision);

  // 전체 단위 일괄 변환 목록 계산
  const multiResults = convertToAllUnits(numericInput, fromUnitId, category, precision);

  // 기준 공식 텍스트 계산
  const fromUnitObj = currentUnits.find((u) => u.id === fromUnitId);
  const toUnitObj = currentUnits.find((u) => u.id === toUnitId);
  let ratioInfoText = '';
  if (fromUnitObj && toUnitObj) {
    if (category === 'temperature') {
      if (fromUnitId === 'celsius' && toUnitId === 'fahrenheit') {
        ratioInfoText = '℉ = ℃ × 1.8 + 32';
      } else if (fromUnitId === 'fahrenheit' && toUnitId === 'celsius') {
        ratioInfoText = '℃ = (℉ - 32) ÷ 1.8';
      } else if (fromUnitId === 'celsius' && toUnitId === 'kelvin') {
        ratioInfoText = 'K = ℃ + 273.15';
      } else {
        ratioInfoText = `${fromUnitObj.name} ↔ ${toUnitObj.name} 변환`;
      }
    } else {
      const oneBase = convertUnitValue(1, fromUnitId, toUnitId, category);
      ratioInfoText = `1 ${fromUnitObj.symbol} = ${formatUnitValue(oneBase, 4)} ${toUnitObj.symbol}`;
    }
  }

  return (
    <div className="space-y-4 w-full">
      {/* 1. 카테고리 탭 (가로 스크롤 모바일 퍼스트) */}
      <UnitCategoryTabs
        activeCategory={category}
        onSelectCategory={handleSelectCategory}
      />

      {/* 2. 대형 듀얼 변환기 카드 (Near-black & 24px Round) */}
      <DualConverterCard
        units={currentUnits}
        fromUnitId={fromUnitId}
        toUnitId={toUnitId}
        inputValue={inputValue}
        formattedConvertedValue={formattedConvertedValue}
        precision={precision}
        onInputChange={setInputValue}
        onFromUnitChange={setFromUnitId}
        onToUnitChange={setToUnitId}
        onSwapUnits={handleSwapUnits}
        onPrecisionChange={setPrecision}
        ratioInfoText={ratioInfoText}
      />

      {/* 3. 한국형 생활 밀착 프리셋 칩 */}
      <QuickPresetChips
        category={category}
        onSelectPreset={handleSelectPreset}
      />

      {/* 4. 전체 단위 일괄 실시간 변환표 및 복사 그리드 */}
      <MultiResultGrid
        results={multiResults}
        activeUnitId={fromUnitId}
        inputValue={numericInput}
        activeUnitSymbol={fromUnitObj?.symbol}
      />

      {/* 5. 생활 상식 및 안내 팁 카드 */}
      <UnitInfoCard />
    </div>
  );
};
