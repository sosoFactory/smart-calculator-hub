export type CalculatorId =
  | 'home'
  | 'compound'
  | 'unit'
  | 'bmi'
  | 'exchange'
  | 'loan'
  | 'salary'
  | 'part-time'
  | 'dividend'
  | 'goal'
  | 'cashflow'
  | 'date'
  | 'devtools'
  | 'severance';

export type CalculatorCategory = 'finance' | 'lifestyle' | 'global';

export interface CalculatorItem {
  id: CalculatorId;
  name: string;
  shortName: string;
  description: string;
  category: CalculatorCategory;
  badge?: string;
  status: 'active' | 'coming-soon';
  keywords?: string[];
}

export const HOME_NAVIGATION_ITEM: CalculatorItem = {
  id: 'home',
  name: '계산기 모아보기',
  shortName: '홈 (대시보드)',
  description: '일상과 금융을 위한 스마트 멀티 계산기 전체 모아보기',
  category: 'finance',
  status: 'active',
};

export const CATEGORY_NAMES: Record<CalculatorCategory, string> = {
  finance: '금융 & 자산 투자',
  lifestyle: '생활 & 측정',
  global: '통화 & 글로벌',
};

/**
 * 계산기 항목 한국어 가나다(ㄱ~ㅎ) 정렬 헬퍼 함수
 * shortName 기준 한국어 사전 순 정렬을 수행하며, 향후 즐겨찾기(상단 고정) 지원 시 1순위 조건 추가 가능
 */
export const compareCalculatorsKorean = (a: CalculatorItem, b: CalculatorItem): number => {
  return a.shortName.localeCompare(b.shortName, 'ko');
};

export const CALCULATORS_LIST: CalculatorItem[] = [
  // 전체 가나다(ㄱ~ㅎ) 순 정렬 (각 카테고리 내부에서도 자동으로 가나다순 유지)
  {
    id: 'devtools',
    name: '개발자 도구 (프로그래머 변환기)',
    shortName: '개발자 도구',
    description: '2·8·10·16진수 진법 변환, CSS px·rem 단위 환산, HEX·RGB·HSL 색상 코드 변환',
    category: 'lifestyle',
    status: 'active',
    keywords: ['개발자', '개발자도구', 'devtools', '진수', '2진수', '16진수', '진법', 'rem', 'px', 'em', 'css', '색상', 'hex', 'rgb', 'hsl'],
  },
  {
    id: 'date',
    name: '날짜 & 디데이 계산기',
    shortName: '날짜·디데이',
    description: '디데이 카운트다운, 두 날짜 간격(근무일수), 날짜 더하기/빼기, 만 나이',
    category: 'lifestyle',
    status: 'active',
    keywords: ['날짜', '디데이', 'dday', '기념일', '근무일수', '영업일', '만나이', '생일', '달력', '100일', '날짜계산'],
  },
  {
    id: 'unit',
    name: '단위 변환기',
    shortName: '단위 변환기',
    description: '아파트 평↔㎡, 길이, 무게, 부피, 온도 실시간 멀티 변환',
    category: 'lifestyle',
    status: 'active',
    keywords: ['단위', '변환', '평수', '평', '제곱미터', 'm2', '면적', '아파트', '길이', '무게', '부피', '온도', '섭씨', '화씨'],
  },
  {
    id: 'loan',
    name: '대출이자 & 상환방식 비교',
    shortName: '대출이자 계산기',
    description: '원리금균등 vs 원금균등 vs 만기일시 3대 상환방식 한눈에 비교',
    category: 'finance',
    status: 'active',
    keywords: ['대출', '이자', '원리금', '원금', '만기일시', '주담대', '신용대출', '상환', '거치기간', '중도상환', '은행'],
  },
  {
    id: 'goal',
    name: '목표 자산 역산 계산기',
    shortName: '목표자산 역산',
    description: 'N년 뒤 목표 금액 달성에 필요한 월 적립 투자금 역산',
    category: 'finance',
    status: 'active',
    keywords: ['목표', '목표자산', '역산', '은퇴', '10억', '노후', '월적립', '파이어족'],
  },
  {
    id: 'part-time',
    name: '알바 급여 & 주휴수당 계산기',
    shortName: '알바·주휴수당 계산기',
    description: '2026년 최저시급(10,320원) 반영, 주휴수당 자동 비례 산정 & 세후 실수령액',
    category: 'finance',
    status: 'active',
    badge: '2026년 최저시급',
    keywords: ['알바', '아르바이트', '시급', '주휴수당', '최저시급', '주휴', '급여', '알바비', '주급', '월급', '초단시간', '가산수당', '4대보험', '프리랜서', '3.3%'],
  },
  {
    id: 'compound',
    name: '연복리 & 자산성장 계산기',
    shortName: '연복리 계산기',
    description: '적립식 복리, 세금 공제, 하락장 손실, 시나리오 A/B 비교',
    category: 'finance',
    status: 'active',
    keywords: ['복리', '연복리', '이자', '자산', '투자', '적립식', '수익률', '재테크', '목돈', '적금'],
  },
  {
    id: 'salary',
    name: '연봉 실수령액 계산기',
    shortName: '연봉 계산기',
    description: '2026년 4대 보험 및 간이세액표 기반 월/연 실수령액 & 세부 공제',
    category: 'finance',
    status: 'active',
    keywords: ['연봉', '월급', '실수령액', '4대보험', '국민연금', '건강보험', '고용보험', '소득세', '식대', '비과세', '급여', '세금'],
  },
  {
    id: 'severance',
    name: '퇴직금 & 퇴직소득세 계산기',
    shortName: '퇴직금 계산기',
    description: '입·퇴사일 기준 재직일수 산정, 법정 퇴직금, 2026년 퇴직소득세 및 IRP 절세 비교',
    category: 'finance',
    status: 'active',
    keywords: ['퇴직금', '퇴직소득세', '실수령액', 'irp', '평균임금', '근속연수', '퇴직연금', '퇴직', '사직', '퇴사'],
  },
  {
    id: 'cashflow',
    name: '파이어 현금흐름 계산기',
    shortName: '파이어 현금흐름',
    description: '목표 월 실수령액과 예상 수익률 기반 필요 은퇴 총 원금 역산',
    category: 'finance',
    status: 'active',
    badge: 'NEW',
    keywords: ['파이어', '파이어족', '현금흐름', '은퇴', '트리니티', '4%룰', '배당', '월수령', '조기은퇴', '노후자금'],
  },
  {
    id: 'exchange',
    name: '환율 계산기',
    shortName: '환율 계산기',
    description: '주요 통화(USD, JPY, EUR 등) 환산 및 은행 우대율 시뮬레이션',
    category: 'global',
    status: 'active',
    keywords: ['환율', '달러', '엔화', '유로', '위안', '환전', '통화', '외환', 'usd', 'jpy', 'eur', 'cny', '해외여행', '우대율'],
  },
  {
    id: 'bmi',
    name: 'BMI & 비만도 계산기',
    shortName: 'BMI 계산기',
    description: '신장·체중 기반 체질량지수(BMI), 비만도 6단계 및 적정 체중 분석',
    category: 'lifestyle',
    status: 'active',
    keywords: ['bmi', '비만도', '체질량지수', '과체중', '저체중', '고도비만', '적정체중', '표준체중', '다이어트', '체중', '키', '몸무게'],
  },
  {
    id: 'dividend',
    name: '배당금 & 월 배당 달력',
    shortName: '배당금 계산기',
    description: '미국/한국 배당주 월별 현금흐름 및 세후 실수령액 계산',
    category: 'finance',
    status: 'coming-soon',
    keywords: ['배당', '배당금', '달력', '미국주식', '배당주', '월배당', '배당소득세', 'isa'],
  },
];
