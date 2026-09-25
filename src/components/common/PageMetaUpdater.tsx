import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CalculatorId, CALCULATORS_LIST, HOME_NAVIGATION_ITEM } from '../../types/navigation';
import { siteConfig } from '../../config/site';

/**
 * SPA 라우트 전환 시 브라우저 title, meta description, canonical URL,
 * OpenGraph, Twitter 카드 및 JSON-LD 구조화 데이터를 실시간 동적 갱신하는 SEO 관리 컴포넌트
 */
export const PageMetaUpdater: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const rawPath = location.pathname.replace(/^\//, '');
    const isHome = location.pathname === '/' || location.pathname === '/home';
    const pathId = rawPath as CalculatorId;

    const currentCalculator = isHome
      ? HOME_NAVIGATION_ITEM
      : CALCULATORS_LIST.find((c) => c.id === pathId) ?? HOME_NAVIGATION_ITEM;

    // 1. 브라우저 Title 동적 갱신
    const pageTitle = isHome
      ? `${siteConfig.name} | ${siteConfig.nameEn}`
      : `${currentCalculator.name} | ${siteConfig.name}`;
    document.title = pageTitle;

    // 2. Canonical URL 동적 갱신
    const baseUrl = siteConfig.url.replace(/\/$/, '');
    const canonicalUrl = isHome ? `${baseUrl}/` : `${baseUrl}/${currentCalculator.id}`;

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 3. Meta Description 동적 갱신
    const descriptionText = currentCalculator.description || siteConfig.description;
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', descriptionText);

    // 4. OpenGraph 및 Twitter 메타 태그 갱신
    const updateOrCreateMeta = (selector: string, attrName: string, attrVal: string, content: string) => {
      let meta = document.querySelector(selector) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attrName, attrVal);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateOrCreateMeta('meta[property="og:title"]', 'property', 'og:title', pageTitle);
    updateOrCreateMeta('meta[property="og:description"]', 'property', 'og:description', descriptionText);
    updateOrCreateMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    updateOrCreateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', pageTitle);
    updateOrCreateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', descriptionText);
    updateOrCreateMeta('meta[name="twitter:url"]', 'name', 'twitter:url', canonicalUrl);

    // 5. 계산기별 Schema.org JSON-LD 동적 주입
    const schemaScriptId = 'dynamic-calculator-schema';
    let schemaScript = document.getElementById(schemaScriptId) as HTMLScriptElement | null;

    if (!isHome && currentCalculator.status === 'active') {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = schemaScriptId;
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }

      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: currentCalculator.name,
        url: canonicalUrl,
        description: descriptionText,
        applicationCategory:
          currentCalculator.category === 'finance'
            ? 'FinanceApplication'
            : currentCalculator.category === 'lifestyle'
            ? 'HealthAndFitnessApplication'
            : 'UtilitiesApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'KRW',
        },
      };

      schemaScript.textContent = JSON.stringify(structuredData);
    } else if (schemaScript) {
      schemaScript.remove();
    }
  }, [location.pathname]);

  return null;
};
