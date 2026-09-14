export const siteConfig = {
  // 기본 브랜딩 명칭
  name: '스마트 계산기 허브',
  nameEn: 'Smart Calculator Hub',
  shortName: '스마트 계산기',
  shortNameEn: 'Smart Calculator',
  
  // 사이트 설명
  description: '연복리, 단위 변환, 환율, 대출이자, 연봉 실수령액 등 일상과 금융 생활을 위한 스마트 멀티 계산기 플랫폼',
  
  // 공식 운영 도메인 URL
  url: 'https://soso-calculator.vercel.app',
  
  // 제작자 및 카피라이트
  company: 'sosoFactory',
  copyright: '© sosoFactory',
  
  // 버전 정보
  version: '1.9.25',
  
  // 링크
  links: {
    github: 'https://github.com/sosoFactory',
  },

  // 동적 브라우저 타이틀 헬퍼
  getTitle: (pageTitle?: string): string => {
    if (!pageTitle) return `${siteConfig.name} | ${siteConfig.nameEn}`;
    return `${pageTitle} | ${siteConfig.name}`;
  },
};

export type SiteConfig = typeof siteConfig;
