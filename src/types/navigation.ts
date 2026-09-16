export type CalculatorId =
  | 'home'
  | 'compound'
  | 'unit'
  | 'bmi'
  | 'exchange'
  | 'loan'
  | 'salary'
  | 'dividend'
  | 'goal';

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

export const CALCULATORS_LIST: CalculatorItem[] = [
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
    id: 'unit',
    name: '단위 변환기',
    shortName: '단위 변환기',
    description: '아파트 평↔㎡, 길이, 무게, 부피, 온도 실시간 멀티 변환',
    category: 'lifestyle',
    status: 'active',
    keywords: ['단위', '변환', '평수', '평', '제곱미터', 'm2', '면적', '아파트', '길이', '무게', '부피', '온도', '섭씨', '화씨'],
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
    id: 'exchange',
    name: '환율 계산기',
    shortName: '환율 계산기',
    description: '주요 통화(USD, JPY, EUR 등) 환산 및 은행 우대율 시뮬레이션',
    category: 'global',
    status: 'active',
    keywords: ['환율', '달러', '엔화', '유로', '위안', '환전', '통화', '외환', 'usd', 'jpy', 'eur', 'cny', '해외여행', '우대율'],
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
    id: 'salary',
    name: '연봉 실수령액 계산기',
    shortName: '연봉 계산기',
    description: '2026년 4대 보험 및 간이세액표 기반 월/연 실수령액 & 세부 공제',
    category: 'finance',
    status: 'active',
    keywords: ['연봉', '월급', '실수령액', '4대보험', '국민연금', '건강보험', '고용보험', '소득세', '식대', '비과세', '급여', '세금'],
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
  {
    id: 'goal',
    name: '목표 자산 역산 계산기',
    shortName: '목표자산 역산',
    description: 'N년 뒤 목표 금액 달성에 필요한 월 적립 투자금 역산',
    category: 'finance',
    status: 'active',
    keywords: ['목표', '목표자산', '역산', '은퇴', '10억', '노후', '월적립', '파이어족'],
  },
];
