import { describe, it, expect } from 'vitest';
import {
  parseLocalDate,
  formatLocalDate,
  calculateDDay,
  calculateDateDiff,
  calculateDateMath,
  calculateAge,
  getDayOfWeekKo,
} from './dateCalculator';

describe('dateCalculator Utility Tests', () => {
  describe('기본 파싱 및 포맷', () => {
    it('YYYY-MM-DD 문자열을 로컬 자정 날짜로 올바르게 파싱해야 한다', () => {
      const date = parseLocalDate('2026-05-15');
      expect(date.getFullYear()).toBe(2026);
      expect(date.getMonth()).toBe(4); // 5월은 0-index로 4
      expect(date.getDate()).toBe(15);
      expect(formatLocalDate(date)).toBe('2026-05-15');
    });

    it('요일을 한글로 정확히 반환해야 한다', () => {
      // 2026-09-25는 금요일
      const date = parseLocalDate('2026-09-25');
      expect(getDayOfWeekKo(date)).toBe('금요일');
    });
  });

  describe('1. 디데이 및 기념일 (calculateDDay)', () => {
    const baseDate = '2026-09-25';

    it('오늘과 동일한 날짜는 D-DAY로 계산되어야 한다', () => {
      const res = calculateDDay('2026-09-25', baseDate);
      expect(res.diffDays).toBe(0);
      expect(res.label).toBe('D-DAY');
      expect(res.isToday).toBe(true);
      expect(res.isPast).toBe(false);
    });

    it('미래의 목표일은 D-N으로 올바르게 계산되어야 한다', () => {
      // 2026-09-25 ~ 2026-10-05 (10일 뒤)
      const res = calculateDDay('2026-10-05', baseDate);
      expect(res.diffDays).toBe(10);
      expect(res.label).toBe('D-10');
      expect(res.isToday).toBe(false);
      expect(res.isPast).toBe(false);
    });

    it('과거의 날짜는 D+N으로 올바르게 계산되어야 한다', () => {
      // 2026-09-25 기준 2026-09-15는 10일 전
      const res = calculateDDay('2026-09-15', baseDate);
      expect(res.diffDays).toBe(-10);
      expect(res.label).toBe('D+10');
      expect(res.isPast).toBe(true);
    });

    it('주요 기념일(100일, 1주년 등) 날짜가 정확히 산출되어야 한다', () => {
      // 사귄 날: 2026-01-01 -> 100일째는 2026-04-10 (1일차 시작이므로 +99일)
      const res = calculateDDay('2026-01-01', baseDate);
      const m100 = res.milestones.find((m) => m.days === 100);
      expect(m100).toBeDefined();
      expect(m100?.date).toBe('2026-04-10');
    });
  });

  describe('2. 날짜 간격 및 근무일수 (calculateDateDiff)', () => {
    it('두 날짜 사이의 총 일수와 주차를 정확히 계산해야 한다', () => {
      // 2026-09-01 ~ 2026-09-15 (14일 차이 = 2주)
      const res = calculateDateDiff('2026-09-01', '2026-09-15');
      expect(res.totalDays).toBe(14);
      expect(res.weeks).toBe(2);
    });

    it('주말(토/일)을 제외한 평일 근무일수를 정확히 필터링해야 한다', () => {
      // 2026-09-21(월) ~ 2026-09-28(월): 7일간 (월화수목금 5일 근무, 토일 2일 주말)
      const res = calculateDateDiff('2026-09-21', '2026-09-28');
      expect(res.totalDays).toBe(7);
      expect(res.businessDays).toBe(5);
      expect(res.weekendDays).toBe(2);
    });
  });

  describe('3. 날짜 더하기 및 빼기 (calculateDateMath)', () => {
    const baseDate = '2026-09-25';

    it('일(days) 더하기 및 빼기가 정확해야 한다', () => {
      const add10 = calculateDateMath(baseDate, 10, 'days', 'add');
      expect(add10.resultDate).toBe('2026-10-05');

      const sub5 = calculateDateMath(baseDate, 5, 'days', 'subtract');
      expect(sub5.resultDate).toBe('2026-09-20');
    });

    it('개월(months) 및 년(years) 연산이 정확해야 한다', () => {
      const add2Months = calculateDateMath(baseDate, 2, 'months', 'add');
      expect(add2Months.resultDate).toBe('2026-11-25');

      const add1Year = calculateDateMath(baseDate, 1, 'years', 'add');
      expect(add1Year.resultDate).toBe('2027-09-25');
    });
  });

  describe('4. 만 나이 및 생애 지표 (calculateAge)', () => {
    const baseDate = '2026-09-25'; // 기준일

    it('생일이 지난 경우 만 나이 = 연 나이', () => {
      // 2000-05-10 출생 (생일 지남)
      const res = calculateAge('2000-05-10', baseDate);
      expect(res.annualAge).toBe(26);
      expect(res.internationalAge).toBe(26);
      expect(res.zodiac).toBe('용띠'); // 2000년 = 용띠
      expect(res.horoscope).toBe('황소자리'); // 5월 10일 = 황소자리
    });

    it('생일이 아직 안 지난 경우 만 나이 = 연 나이 - 1', () => {
      // 2000-11-20 출생 (생일 아직 안 옴)
      const res = calculateAge('2000-11-20', baseDate);
      expect(res.annualAge).toBe(26);
      expect(res.internationalAge).toBe(25);
    });

    it('태어난 지 살아온 총 일수를 정확히 계산해야 한다', () => {
      // 2026-09-20 출생 (2026-09-25 기준: 20, 21, 22, 23, 24, 25 총 6일째)
      const res = calculateAge('2026-09-20', baseDate);
      expect(res.daysLived).toBe(6);
    });
  });
});
