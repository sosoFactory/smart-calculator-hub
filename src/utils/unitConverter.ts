import {
  DecimalPrecision,
  QuickPreset,
  UnitCategory,
  UnitConversionResult,
  UnitDefinition,
} from '../types/unit';

export const UNIT_CATEGORIES: { id: UnitCategory; label: string; icon: string }[] = [
  { id: 'area', label: '넓이 (면적)', icon: 'Square' },
  { id: 'length', label: '길이', icon: 'Ruler' },
  { id: 'weight', label: '무게 (질량)', icon: 'Scale' },
  { id: 'volume', label: '부피 (용량)', icon: 'Box' },
  { id: 'temperature', label: '온도', icon: 'Thermometer' },
];

export const UNITS_DATA: Record<UnitCategory, UnitDefinition[]> = {
  area: [
    { id: 'sqm', name: '제곱미터', symbol: '㎡', category: 'area', ratioToBase: 1, isPopular: true, description: '국제 표준 면적 단위' },
    { id: 'pyeong', name: '평', symbol: '평', category: 'area', ratioToBase: 3.305785, isPopular: true, description: '아파트 및 부동산 분양 기준 (1평 ≈ 3.3058㎡)' },
    { id: 'sqcm', name: '제곱센티미터', symbol: '㎠', category: 'area', ratioToBase: 0.0001, description: '소형 면적 단위 (100㎟)' },
    { id: 'sqkm', name: '제곱킬로미터', symbol: '㎢', category: 'area', ratioToBase: 1_000_000, description: '국토/도시 면적 단위 (1,000,000㎡)' },
    { id: 'ha', name: '헥타르', symbol: 'ha', category: 'area', ratioToBase: 10_000, description: '토지/농지 면적 (10,000㎡)' },
    { id: 'ac', name: '에이커', symbol: 'ac', category: 'area', ratioToBase: 4046.8564224, description: '영미권 토지 단위 (약 4,047㎡)' },
    { id: 'sqft', name: '제곱피트', symbol: 'ft²', category: 'area', ratioToBase: 0.09290304, description: '미국/캐나다 주거 면적 (약 0.093㎡)' },
    { id: 'sqyd', name: '제곱야드', symbol: 'yd²', category: 'area', ratioToBase: 0.83612736, description: '야드 기반 면적 (약 0.836㎡)' },
  ],
  length: [
    { id: 'cm', name: '센티미터', symbol: 'cm', category: 'length', ratioToBase: 0.01, isPopular: true, description: '국제 표준 센티미터 (1cm = 10mm)' },
    { id: 'm', name: '미터', symbol: 'm', category: 'length', ratioToBase: 1, isPopular: true, description: '국제 표준 길이 단위 (100cm)' },
    { id: 'km', name: '킬로미터', symbol: 'km', category: 'length', ratioToBase: 1000, isPopular: true, description: '장거리 및 도로 주행 거리 (1,000m)' },
    { id: 'mm', name: '밀리미터', symbol: 'mm', category: 'length', ratioToBase: 0.001, description: '정밀 측정 단위 (0.1cm)' },
    { id: 'in', name: '인치', symbol: 'in', category: 'length', ratioToBase: 0.0254, isPopular: true, description: '디스플레이, 의류 사이즈 (2.54cm)' },
    { id: 'ft', name: '피트', symbol: 'ft', category: 'length', ratioToBase: 0.3048, isPopular: true, description: '신장, 항공 고도 (30.48cm)' },
    { id: 'yd', name: '야드', symbol: 'yd', category: 'length', ratioToBase: 0.9144, description: '골프, 미식축구 (0.9144m)' },
    { id: 'mi', name: '마일', symbol: 'mi', category: 'length', ratioToBase: 1609.344, description: '영미권 도로 주행 거리 (약 1.609km)' },
    { id: 'cheok', name: '자 (척)', symbol: '尺', category: 'length', ratioToBase: 0.30303, description: '한국 전통 도량형 (10/33m ≈ 30.3cm)' },
  ],
  weight: [
    { id: 'g', name: '그램', symbol: 'g', category: 'weight', ratioToBase: 1, isPopular: true, description: '국제 표준 질량 단위 (1,000mg)' },
    { id: 'kg', name: '킬로그램', symbol: 'kg', category: 'weight', ratioToBase: 1000, isPopular: true, description: '국제 표준 질량 단위 (1,000g)' },
    { id: 'ton', name: '톤', symbol: 't', category: 'weight', ratioToBase: 1_000_000, isPopular: true, description: '중량 및 대형 화물 단위 (1,000kg)' },
    { id: 'mg', name: '밀리그램', symbol: 'mg', category: 'weight', ratioToBase: 0.001, description: '의약품 및 정밀 측정 단위 (0.001g)' },
    { id: 'lb', name: '파운드', symbol: 'lb', category: 'weight', ratioToBase: 453.59237, isPopular: true, description: '영미권 체중 및 볼링공 (약 453.6g)' },
    { id: 'oz', name: '온스', symbol: 'oz', category: 'weight', ratioToBase: 28.349523125, isPopular: true, description: '귀금속 및 커피 원두 (약 28.35g)' },
    { id: 'don', name: '돈', symbol: '돈', category: 'weight', ratioToBase: 3.75, isPopular: true, description: '한국 순금/귀금속 거래 (1돈 = 3.75g)' },
    { id: 'geun', name: '근 (고기)', symbol: '근', category: 'weight', ratioToBase: 600, isPopular: true, description: '한국 전통 육류/채소 (1근 = 600g)' },
  ],
  volume: [
    { id: 'ml', name: '밀리리터', symbol: 'mL', category: 'volume', ratioToBase: 0.001, isPopular: true, description: '소용량 액체 단위 (1mL = 1cc)' },
    { id: 'l', name: '리터', symbol: 'L', category: 'volume', ratioToBase: 1, isPopular: true, description: '음료, 주유 기준 단위 (1,000mL)' },
    { id: 'cbm', name: '세제곱미터', symbol: '㎥', category: 'volume', ratioToBase: 1000, description: '화물 적재, 수도 계량 (1,000L)' },
    { id: 'gal', name: '갤런 (US)', symbol: 'gal', category: 'volume', ratioToBase: 3.785411784, isPopular: true, description: '미국 액량 갤런 (약 3.785L)' },
    { id: 'bbl', name: '배럴 (원유)', symbol: 'bbl', category: 'volume', ratioToBase: 158.987294928, description: '국제 원유 거래 단위 (약 159L)' },
    { id: 'floz', name: '플루이드 온스', symbol: 'fl oz', category: 'volume', ratioToBase: 0.0295735295625, description: '음료 캔 및 향수 용량 (약 29.57mL)' },
  ],
  temperature: [
    { id: 'celsius', name: '섭씨', symbol: '℃', category: 'temperature', ratioToBase: 1, isPopular: true, description: '물 어는점 0℃, 끓는점 100℃' },
    { id: 'fahrenheit', name: '화씨', symbol: '℉', category: 'temperature', ratioToBase: 1, isPopular: true, description: '미국 일상 기온 체계 (32℉ = 0℃)' },
    { id: 'kelvin', name: '켈빈', symbol: 'K', category: 'temperature', ratioToBase: 1, description: '절대온도 0K (-273.15℃)' },
  ],
};

export const QUICK_PRESETS: QuickPreset[] = [
  // 면적
  { label: '84㎡ (국민평형)', category: 'area', unitId: 'sqm', value: 84, badge: '인기', description: '전용 84㎡ ≈ 25.4평 (공급 33~34평형)' },
  { label: '59㎡ (소형)', category: 'area', unitId: 'sqm', value: 59, badge: '인기', description: '전용 59㎡ ≈ 17.8평 (공급 24~25평형)' },
  { label: '114㎡ (대형)', category: 'area', unitId: 'sqm', value: 114, description: '전용 114㎡ ≈ 34.5평 (공급 43~45평형)' },
  { label: '10평', category: 'area', unitId: 'pyeong', value: 10, description: '약 33.06㎡ (원룸/오피스텔)' },
  { label: '20평', category: 'area', unitId: 'pyeong', value: 20, description: '약 66.12㎡' },
  { label: '34평', category: 'area', unitId: 'pyeong', value: 34, description: '약 112.4㎡ (아파트 대표 공급평형)' },

  // 길이
  { label: '1인치', category: 'length', unitId: 'in', value: 1, description: '2.54cm' },
  { label: '1피트', category: 'length', unitId: 'ft', value: 1, description: '30.48cm' },
  { label: '1마일', category: 'length', unitId: 'mi', value: 1, description: '1.609km' },
  { label: '100미터', category: 'length', unitId: 'm', value: 100, description: '단거리 육상 트랙' },
  { label: '키 175cm', category: 'length', unitId: 'cm', value: 175, description: '약 5피트 8.9인치' },

  // 무게
  { label: '순금 1돈', category: 'weight', unitId: 'don', value: 1, badge: '금', description: '정확히 3.75g' },
  { label: '순금 10돈 (1냥)', category: 'weight', unitId: 'don', value: 10, badge: '금', description: '37.5g' },
  { label: '고기 1근', category: 'weight', unitId: 'geun', value: 1, description: '600g' },
  { label: '1파운드 (1lb)', category: 'weight', unitId: 'lb', value: 1, description: '약 453.6g' },
  { label: '1톤', category: 'weight', unitId: 'ton', value: 1, description: '1,000kg' },

  // 부피
  { label: '1갤런 (US)', category: 'volume', unitId: 'gal', value: 1, badge: '인기', description: '약 3.785리터 (해외 직구/주유)' },
  { label: '종이컵 180mL', category: 'volume', unitId: 'ml', value: 180, description: '표준 자판기 종이컵' },
  { label: '생수 500mL', category: 'volume', unitId: 'ml', value: 500, description: '소형 페트병' },
  { label: '생수 2L', category: 'volume', unitId: 'l', value: 2, description: '가정용 대용량' },

  // 온도
  { label: '체온 36.5℃', category: 'temperature', unitId: 'celsius', value: 36.5, badge: '건강', description: '화씨 97.7℉' },
  { label: '실온 20℃', category: 'temperature', unitId: 'celsius', value: 20, description: '화씨 68.0℉' },
  { label: '물 끓는점 100℃', category: 'temperature', unitId: 'celsius', value: 100, description: '화씨 212.0℉' },
  { label: '화씨 100℉', category: 'temperature', unitId: 'fahrenheit', value: 100, description: '섭씨 37.78℃ (여름 폭염)' },
];

export interface CategoryDefaultConfig {
  fromUnitId: string;
  toUnitId: string;
  inputValue: number;
}

export const CATEGORY_DEFAULTS: Record<UnitCategory, CategoryDefaultConfig> = {
  area: {
    fromUnitId: 'sqm',
    toUnitId: 'pyeong',
    inputValue: 84, // 국민평형 84㎡ -> 25.4평
  },
  length: {
    fromUnitId: 'in',
    toUnitId: 'cm',
    inputValue: 1, // 1인치 -> 2.54cm
  },
  weight: {
    fromUnitId: 'don',
    toUnitId: 'g',
    inputValue: 1, // 순금 1돈 -> 3.75g
  },
  volume: {
    fromUnitId: 'gal',
    toUnitId: 'l',
    inputValue: 1, // 1갤런 -> 3.785L
  },
  temperature: {
    fromUnitId: 'celsius',
    toUnitId: 'fahrenheit',
    inputValue: 36.5, // 체온 36.5℃ -> 97.7℉
  },
};

/**
 * 특정 카테고리 내에서 단위 A에서 단위 B로 값을 변환
 */
export function convertUnitValue(
  value: number,
  fromUnitId: string,
  toUnitId: string,
  category: UnitCategory
): number {
  if (fromUnitId === toUnitId) return value;
  if (isNaN(value)) return 0;

  // 온도 특수 처리
  if (category === 'temperature') {
    let celsius = value;
    if (fromUnitId === 'fahrenheit') {
      celsius = (value - 32) / 1.8;
    } else if (fromUnitId === 'kelvin') {
      celsius = value - 273.15;
    }

    if (toUnitId === 'celsius') return celsius;
    if (toUnitId === 'fahrenheit') return celsius * 1.8 + 32;
    if (toUnitId === 'kelvin') return celsius + 273.15;
    return celsius;
  }

  // 선형 비례 단위 변환 (기준 단위 환산)
  const units = UNITS_DATA[category];
  const fromUnit = units.find((u) => u.id === fromUnitId);
  const toUnit = units.find((u) => u.id === toUnitId);

  if (!fromUnit || !toUnit) return value;

  // 1. 기준 단위로 변환
  const baseValue = value * fromUnit.ratioToBase;
  // 2. 목적 단위로 변환
  return baseValue / toUnit.ratioToBase;
}

/**
 * 특정 카테고리의 모든 단위로 일괄 변환
 */
export function convertToAllUnits(
  value: number,
  fromUnitId: string,
  category: UnitCategory,
  precision: DecimalPrecision = 2
): UnitConversionResult[] {
  const units = UNITS_DATA[category];
  return units.map((targetUnit) => {
    const converted = convertUnitValue(value, fromUnitId, targetUnit.id, category);
    return {
      unit: targetUnit,
      value: converted,
      formattedValue: formatUnitValue(converted, precision),
    };
  });
}

/**
 * 변환된 수치를 지정된 소수점 자릿수로 포맷팅
 */
export function formatUnitValue(val: number, precision: DecimalPrecision = 2): string {
  if (isNaN(val)) return '0';
  if (val === 0) return '0';

  // 정밀도 0이면 반올림 정수
  if (precision === 0) {
    return Math.round(val).toLocaleString('ko-KR');
  }

  // 매우 작거나 큰 값 처리
  const abs = Math.abs(val);
  if (abs >= 1e9 || (abs < 1e-4 && abs > 0)) {
    return val.toExponential(precision);
  }

  // 지정된 자릿수로 고정 후 필요 시 불필요한 뒤쪽 0 정리
  const fixed = val.toFixed(precision);
  const parts = fixed.split('.');
  const intPart = parseInt(parts[0], 10).toLocaleString('ko-KR');
  const decimalPart = parts[1];

  return decimalPart ? `${intPart}.${decimalPart}` : intPart;
}
