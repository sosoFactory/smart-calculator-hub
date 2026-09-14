import { describe, it, expect } from 'vitest';
import { siteConfig } from './site';

describe('siteConfig Tests', () => {
  it('사이트 기본 메타데이터가 올바르게 정의되어 있어야 한다', () => {
    expect(siteConfig.name).toBe('스마트 계산기 허브');
    expect(siteConfig.nameEn).toBe('Smart Calculator Hub');
    expect(siteConfig.shortName).toBe('스마트 계산기');
    expect(siteConfig.shortNameEn).toBe('Smart Calculator');
    expect(siteConfig.company).toBe('sosoFactory');
    expect(siteConfig.copyright).toBe('© sosoFactory');
    expect(siteConfig.version).toBe('1.9.27');
    expect(siteConfig.url).toBe('https://soso-calculator.vercel.app');
  });

  it('getTitle 헬퍼가 페이지 제목을 일관된 포맷으로 반환해야 한다', () => {
    expect(siteConfig.getTitle('연복리 계산기')).toBe('연복리 계산기 | 스마트 계산기 허브');
    expect(siteConfig.getTitle()).toBe('스마트 계산기 허브 | Smart Calculator Hub');
  });
});
