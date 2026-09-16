/**
 * 숫자를 한국 원화 형식(₩1,234,567)으로 변환
 */
export function formatCurrency(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '₩0';
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

/**
 * 숫자를 콤마 포맷팅(1,234,567원)으로 변환
 */
export function formatNumberWithWon(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '0원';
  return `${Math.round(value).toLocaleString('ko-KR')}원`;
}

/**
 * 한국어 단위(억, 만 원) 친화적 텍스트 변환
 * 예: 125,000,000 -> "1억 2,500만 원"
 * 예: 50,000,000 -> "5,000만 원"
 * 예: 3,500,000 -> "350만 원"
 * 예: 0 -> "0원"
 */
export function formatKoreanUnit(value: number): string {
  if (isNaN(value) || !isFinite(value) || value === 0) return '0원';

  const isNegative = value < 0;
  const rounded = Math.abs(Math.round(value));
  const eok = Math.floor(rounded / 100_000_000);
  const man = Math.floor((rounded % 100_000_000) / 10_000);
  const remainder = rounded % 10_000;

  const parts: string[] = [];

  if (eok > 0) {
    parts.push(`${eok.toLocaleString('ko-KR')}억`);
  }
  if (man > 0) {
    parts.push(`${man.toLocaleString('ko-KR')}만`);
  }
  if (parts.length === 0 && remainder > 0) {
    parts.push(`${remainder.toLocaleString('ko-KR')}`);
  }

  const result = parts.length > 0 ? `${parts.join(' ')} 원` : '0원';
  return isNegative ? `-${result}` : result;
}

/**
 * formatKoreanUnit의 별칭 (호환성 유지)
 */
export const formatKoreanCurrency = formatKoreanUnit;

/**
 * 백분율 포맷팅 (예: 12.34%, +5.67%)
 */
export function formatPercent(value: number, includeSign = false): string {
  if (isNaN(value) || !isFinite(value)) return '0.0%';
  const prefix = includeSign && value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(1)}%`;
}

/**
 * 배수 포맷팅 (예: 1.85배)
 */
export function formatMultiple(value: number): string {
  if (isNaN(value) || !isFinite(value) || value <= 0) return '1.0배';
  return `${value.toFixed(2)}배`;
}
