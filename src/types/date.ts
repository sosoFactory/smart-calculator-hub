export type DateTabType = 'dday' | 'diff' | 'calc' | 'age';

// 1. 디데이 & 기념일
export interface MilestoneItem {
  days: number;
  label: string;       // "50일", "100일", "1주년" 등
  date: string;        // YYYY-MM-DD
  dayOfWeek: string;   // "토요일"
  isPast: boolean;
}

export interface DDayResult {
  targetDate: string;  // YYYY-MM-DD
  baseDate: string;    // 기준일 (기본 오늘)
  diffDays: number;    // 음수(미래: -D), 0(당일), 양수(과거: +D)
  label: string;       // "D-35" | "D-DAY" | "D+100"
  isPast: boolean;
  isToday: boolean;
  milestones: MilestoneItem[];
}

// 2. 날짜 간격 & 영업일
export interface DateDiffResult {
  startDate: string;
  endDate: string;
  totalDays: number;
  businessDays: number;   // 주말 제외 평일 근무일수
  weekendDays: number;    // 주말(토/일) 일수
  weeks: number;          // 주차 수
  formattedPeriod: string;// "X년 Y개월 Z일"
}

// 3. 날짜 계산 (더하기/빼기)
export type DateCalcUnit = 'days' | 'weeks' | 'months' | 'years';
export type DateCalcOp = 'add' | 'subtract';

export interface DateCalcResult {
  baseDate: string;
  amount: number;
  unit: DateCalcUnit;
  operation: DateCalcOp;
  resultDate: string;  // YYYY-MM-DD
  dayOfWeek: string;   // "화요일"
}

// 4. 만 나이 & 생애 지표
export interface AgeResult {
  birthDate: string;
  internationalAge: number; // 공식 만 나이
  annualAge: number;        // 연 나이 (당해연도 - 출생연도)
  daysLived: number;        // 태어난 지 N일째
  zodiac: string;           // 12간지 띠 (예: "용띠", "호랑이띠")
  horoscope: string;        // 별자리 (예: "물병자리", "사자자리")
  daysToNextBirthday: number;// 다음 생일까지 남은 D-day
}
