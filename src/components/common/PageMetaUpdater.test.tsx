import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PageMetaUpdater } from './PageMetaUpdater';

describe('PageMetaUpdater SEO Tests', () => {
  beforeEach(() => {
    document.title = '';
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) existingCanonical.remove();
    const existingMetaDesc = document.querySelector('meta[name="description"]');
    if (existingMetaDesc) existingMetaDesc.remove();
    const existingKeywords = document.querySelector('meta[name="keywords"]');
    if (existingKeywords) existingKeywords.remove();
    const existingRobots = document.querySelector('meta[name="robots"]');
    if (existingRobots) existingRobots.remove();
    const existingSchema = document.getElementById('dynamic-calculator-schema');
    if (existingSchema) existingSchema.remove();
  });

  it('홈 경로(/) 진입 시 타이틀, 캐노니컬 URL, robots 및 description이 올바르게 설정되어야 한다', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <PageMetaUpdater />
      </MemoryRouter>
    );

    expect(document.title).toContain('스마트 계산기 허브');
    
    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute('href')).toBe('https://soso-calculator.vercel.app/');

    const robots = document.querySelector('meta[name="robots"]');
    expect(robots?.getAttribute('content')).toContain('index, follow');

    const desc = document.querySelector('meta[name="description"]');
    expect(desc?.getAttribute('content')).toBeTruthy();
  });

  it('활성 계산기 경로(/loan) 진입 시 키워드 메타태그와 BreadcrumbList를 포함한 JSON-LD가 주입되어야 한다', () => {
    render(
      <MemoryRouter initialEntries={['/loan']}>
        <PageMetaUpdater />
      </MemoryRouter>
    );

    expect(document.title).toContain('대출이자 & 상환방식 비교');

    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute('href')).toBe('https://soso-calculator.vercel.app/loan');

    const keywords = document.querySelector('meta[name="keywords"]');
    expect(keywords?.getAttribute('content')).toContain('대출');

    const robots = document.querySelector('meta[name="robots"]');
    expect(robots?.getAttribute('content')).toContain('index, follow');

    const schemaScript = document.getElementById('dynamic-calculator-schema');
    expect(schemaScript).not.toBeNull();
    const data = JSON.parse(schemaScript?.textContent || '{}');
    expect(data['@context']).toBe('https://schema.org');
    expect(Array.isArray(data['@graph'])).toBe(true);

    const appSchema = data['@graph'].find((item: any) => item['@type'] === 'SoftwareApplication');
    expect(appSchema).toBeDefined();
    expect(appSchema.name).toBe('대출이자 & 상환방식 비교');
    expect(appSchema.applicationCategory).toBe('FinanceApplication');

    const breadcrumbSchema = data['@graph'].find((item: any) => item['@type'] === 'BreadcrumbList');
    expect(breadcrumbSchema).toBeDefined();
    expect(breadcrumbSchema.itemListElement).toHaveLength(2);
    expect(breadcrumbSchema.itemListElement[0].name).toBe('홈');
    expect(breadcrumbSchema.itemListElement[1].name).toBe('대출이자 & 상환방식 비교');
  });

  it('미출시 플레이스홀더 경로(/dividend) 진입 시 noindex, follow가 적용되어야 한다', () => {
    render(
      <MemoryRouter initialEntries={['/dividend']}>
        <PageMetaUpdater />
      </MemoryRouter>
    );

    const robots = document.querySelector('meta[name="robots"]');
    expect(robots?.getAttribute('content')).toBe('noindex, follow');

    // 미출시 페이지는 dynamic-calculator-schema가 주입되지 않아야 함
    const schemaScript = document.getElementById('dynamic-calculator-schema');
    expect(schemaScript).toBeNull();
  });
});
