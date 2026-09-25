import {
  AgeResult,
  DateCalcOp,
  DateCalcResult,
  DateCalcUnit,
  DateDiffResult,
  DDayResult,
  MilestoneItem,
} from '../types/date';

/**
 * YYYY-MM-DD 문자열을 안전하게 로컬 자정 Date 객체로 파싱
 */
export function parseLocalDate(dateStr: string): Date {
  const parts = dateStr.split('-');
  if (parts.length !== 3) {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  }
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return new Date(year, month, day, 0, 0, 0, 0);
}

/**
 * Date 객체를 YYYY-MM-DD 포맷 문자열로 변환
 */
export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 오늘 날짜를 YYYY-MM-DD 문자열로 반환
 */
export function getTodayString(): string {
  return formatLocalDate(new Date());
}

/**
 * 요일 한글 명칭 반환 (예: "월요일")
 */
export function getDayOfWeekKo(date: Date): string {
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  return days[date.getDay()];
}

/**
 * 1. 디데이 및 주요 기념일 계산
 */
export function calculateDDay(targetDateStr: string, baseDateStr?: string): DDayResult {
  const base = baseDateStr ? parseLocalDate(baseDateStr) : parseLocalDate(getTodayString());
  const target = parseLocalDate(targetDateStr);

  const diffMs = target.getTime() - base.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  let label = '';
  let isPast = false;
  let isToday = false;

  if (diffDays > 0) {
    label = `D-${diffDays}`;
  } else if (diffDays === 0) {
    label = 'D-DAY';
    isToday = true;
  } else {
    label = `D+${Math.abs(diffDays)}`;
    isPast = true;
  }

  // 기념일 마일스톤 산출 (기준일 또는 과거 기념일 시작일로부터의 경과일 및 주년)
  const milestoneDays = [
    { days: 50, label: '50일' },
    { days: 100, label: '100일' },
    { days: 200, label: '200일' },
    { days: 300, label: '300일' },
    { days: 365, label: '1주년 (365일)' },
    { days: 500, label: '500일' },
    { days: 730, label: '2주년 (730일)' },
    { days: 1000, label: '1,000일' },
  ];

  const milestones: MilestoneItem[] = milestoneDays.map((m) => {
    // 한국 관례상 시작일이 1일차이므로 m.days일째 되는 날은 시작일 + (m.days - 1)일
    const milestoneDate = new Date(target.getTime());
    milestoneDate.setDate(milestoneDate.getDate() + (m.days - 1));

    const isMilestonePast = milestoneDate.getTime() < base.getTime();

    return {
      days: m.days,
      label: m.label,
      date: formatLocalDate(milestoneDate),
      dayOfWeek: getDayOfWeekKo(milestoneDate),
      isPast: isMilestonePast,
    };
  });

  return {
    targetDate: targetDateStr,
    baseDate: formatLocalDate(base),
    diffDays,
    label,
    isPast,
    isToday,
    milestones,
  };
}

/**
 * 2. 두 날짜 사이 간격 및 영업일(주말 제외) 계산
 */
export function calculateDateDiff(startDateStr: string, endDateStr: string): DateDiffResult {
  const start = parseLocalDate(startDateStr);
  const end = parseLocalDate(endDateStr);

  const isReversed = start.getTime() > end.getTime();
  const earlier = isReversed ? end : start;
  const later = isReversed ? start : end;

  const diffMs = later.getTime() - earlier.getTime();
  const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  // 주말(토, 일) 제외 평일 근무일수 계산
  let businessDays = 0;
  let weekendDays = 0;

  const current = new Date(earlier.getTime());
  // 시작일 포함 ~ 종료일 전날까지 또는 양끝 포함?
  // 통상 두 날짜 간격에서 시작일 포함, 종료일 미포함(총 totalDays일간) 순회
  for (let i = 0; i < totalDays; i++) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendDays++;
    } else {
      businessDays++;
    }
    current.setDate(current.getDate() + 1);
  }

  const weeks = Math.floor(totalDays / 7);
  const remainingDays = totalDays % 7;

  // X년 Y개월 Z일 포맷 계산
  let years = later.getFullYear() - earlier.getFullYear();
  let months = later.getMonth() - earlier.getMonth();
  let days = later.getDate() - earlier.getDate();

  if (days < 0) {
    months--;
    const prevMonthLastDay = new Date(later.getFullYear(), later.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const periodParts: string[] = [];
  if (years > 0) periodParts.push(`${years}년`);
  if (months > 0) periodParts.push(`${months}개월`);
  if (days > 0 || periodParts.length === 0) periodParts.push(`${days}일`);

  return {
    startDate: startDateStr,
    endDate: endDateStr,
    totalDays,
    businessDays,
    weekendDays,
    weeks,
    formattedPeriod: `${periodParts.join(' ')} (약 ${weeks}주 ${remainingDays}일)`,
  };
}

/**
 * 3. 날짜 계산 (더하기 / 빼기)
 */
export function calculateDateMath(
  baseDateStr: string,
  amount: number,
  unit: DateCalcUnit,
  operation: DateCalcOp
): DateCalcResult {
  const base = parseLocalDate(baseDateStr);
  const result = new Date(base.getTime());
  const factor = operation === 'add' ? 1 : -1;
  const effectiveAmount = amount * factor;

  switch (unit) {
    case 'days':
      result.setDate(result.getDate() + effectiveAmount);
      break;
    case 'weeks':
      result.setDate(result.getDate() + effectiveAmount * 7);
      break;
    case 'months':
      result.setMonth(result.getMonth() + effectiveAmount);
      break;
    case 'years':
      result.setFullYear(result.getFullYear() + effectiveAmount);
      break;
  }

  return {
    baseDate: baseDateStr,
    amount,
    unit,
    operation,
    resultDate: formatLocalDate(result),
    dayOfWeek: getDayOfWeekKo(result),
  };
}

/**
 * 4. 만 나이, 연 나이, 띠, 별자리 계산
 */
export function calculateAge(birthDateStr: string, baseDateStr?: string): AgeResult {
  const base = baseDateStr ? parseLocalDate(baseDateStr) : parseLocalDate(getTodayString());
  const birth = parseLocalDate(birthDateStr);

  const baseYear = base.getFullYear();
  const birthYear = birth.getFullYear();

  // 연 나이: 당해연도 - 출생연도
  const annualAge = baseYear - birthYear;

  // 공식 만 나이
  let internationalAge = annualAge;
  const hasBirthdayPassed =
    base.getMonth() > birth.getMonth() ||
    (base.getMonth() === birth.getMonth() && base.getDate() >= birth.getDate());

  if (!hasBirthdayPassed) {
    internationalAge--;
  }
  if (internationalAge < 0) internationalAge = 0;

  // 태어난 지 N일째 (출생 당일이 1일째)
  const diffMs = base.getTime() - birth.getTime();
  const daysLived = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1);

  // 12간지 띠 (입춘 기준이 아닌 통상적인 연도 기준 띠 계산)
  const zodiacList = [
    '원숭이띠', // 0
    '닭띠',     // 1
    '개띠',     // 2
    '돼지띠',   // 3
    '쥐띠',     // 4
    '소띠',     // 5
    '호랑이띠', // 6
    '토끼띠',   // 7
    '용띠',     // 8
    '뱀띠',     // 9
    '말띠',     // 10
    '양띠',     // 11
  ];
  const zodiac = zodiacList[birthYear % 12];

  // 서양 12별자리 계산 (월/일 기준)
  const m = birth.getMonth() + 1;
  const d = birth.getDate();
  let horoscope = '';

  if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) horoscope = '물병자리';
  else if ((m === 2 && d >= 19) || (m === 3 && d <= 20)) horoscope = '물고기자리';
  else if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) horoscope = '양자리';
  else if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) horoscope = '황소자리';
  else if ((m === 5 && d >= 21) || (m === 6 && d <= 21)) horoscope = '쌍둥이자리';
  else if ((m === 6 && d >= 22) || (m === 7 && d <= 22)) horoscope = '게자리';
  else if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) horoscope = '사자자리';
  else if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) horoscope = '처녀자리';
  else if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) horoscope = '천칭자리';
  else if ((m === 10 && d >= 23) || (m === 11 && d <= 22)) horoscope = '전갈자리';
  else if ((m === 11 && d >= 23) || (m === 12 && d <= 21)) horoscope = '사수자리';
  else horoscope = '염소자리';

  // 다음 생일까지 남은 D-day
  let nextBirthday = new Date(baseYear, birth.getMonth(), birth.getDate(), 0, 0, 0, 0);
  if (nextBirthday.getTime() < base.getTime()) {
    nextBirthday = new Date(baseYear + 1, birth.getMonth(), birth.getDate(), 0, 0, 0, 0);
  }
  const daysToNextBirthday = Math.round((nextBirthday.getTime() - base.getTime()) / (1000 * 60 * 60 * 24));

  return {
    birthDate: birthDateStr,
    internationalAge,
    annualAge,
    daysLived,
    zodiac,
    horoscope,
    daysToNextBirthday,
  };
}
