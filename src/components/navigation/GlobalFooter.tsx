import React from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/site';
import {
  CALCULATORS_LIST,
  CATEGORY_NAMES,
  CalculatorCategory,
  compareCalculatorsKorean,
} from '../../types/navigation';
import { ShieldCheck } from 'lucide-react';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg
    viewBox="0 0 24 24"
    width="14"
    height="14"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export const GlobalFooter: React.FC = () => {
  const categories: CalculatorCategory[] = ['finance', 'lifestyle', 'global'];

  return (
    <footer
      role="contentinfo"
      className="w-full mt-12 sm:mt-16 border-t border-ghost-hairline dark:border-ghost-dark-hairline bg-ghost-surface-deep/40 dark:bg-ghost-dark-canvas text-ghost-ink dark:text-ghost-dark-ink transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 sm:mb-12">
          {/* 브랜드 및 서비스 소개 */}
          <div className="md:col-span-1 space-y-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 group text-inherit no-underline"
              aria-label="스마트 계산기 허브 홈으로 이동"
            >
              <img
                src="/logo.svg"
                alt="스마트 계산기 허브 로고"
                className="w-7 h-7 object-contain group-hover:scale-105 transition-transform shrink-0"
              />
              <span className="font-bold text-base tracking-tight text-ghost-ink dark:text-ghost-dark-ink">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-xs text-ghost-ink-mute dark:text-ghost-dark-ink-mute leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-ghost-ink-stone dark:text-ghost-dark-ink-stone">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>100% 로컬 연산 · 개인정보 수집 없음</span>
            </div>
          </div>

          {/* 카테고리별 계산기 시맨틱 링크 그리드 (SEO 내부 링크 에쿼티 공급) */}
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            {categories.map((cat) => {
              const items = CALCULATORS_LIST.filter(
                (calc) => calc.category === cat && calc.status !== 'coming-soon'
              ).sort(compareCalculatorsKorean);

              return (
                <div key={cat} className="space-y-2.5">
                  <h3 className="text-xs font-bold text-ghost-ink-mute dark:text-ghost-dark-ink-mute uppercase tracking-wider">
                    {CATEGORY_NAMES[cat]}
                  </h3>
                  <ul className="space-y-1.5 list-none p-0 m-0">
                    {items.map((item) => (
                      <li key={item.id}>
                        <Link
                          to={`/${item.id}`}
                          className="text-xs text-ghost-ink-soft dark:text-ghost-dark-ink-soft hover:text-black dark:hover:text-white transition-colors block py-0.5"
                        >
                          {item.shortName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* 하단 바: 홈 링크, 깃허브, 카피라이트 및 버전 */}
        <div className="pt-6 border-t border-ghost-hairline/80 dark:border-ghost-dark-hairline flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ghost-ink-stone dark:text-ghost-dark-ink-stone">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <Link
              to="/"
              className="text-ghost-ink-soft dark:text-ghost-dark-ink-soft hover:underline font-medium"
            >
              홈 (대시보드)
            </Link>
            <a
              href={siteConfig.links.hub}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-ghost-ink-soft dark:text-ghost-dark-ink-soft hover:text-black dark:hover:text-white transition-colors font-medium"
            >
              <span>HS HUB</span>
            </a>
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-ghost-ink-soft dark:text-ghost-dark-ink-soft hover:text-black dark:hover:text-white transition-colors font-medium"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>

          <div className="text-center sm:text-right">
            <span>
              {siteConfig.copyright} • {siteConfig.shortName} v{siteConfig.version}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
