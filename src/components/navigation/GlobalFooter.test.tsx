import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { GlobalFooter } from './GlobalFooter';
import { siteConfig } from '../../config/site';

describe('GlobalFooter Tests', () => {
  it('사이트 이름과 카피라이트, 버전 정보가 렌더링되어야 한다', () => {
    render(
      <MemoryRouter>
        <GlobalFooter />
      </MemoryRouter>
    );

    expect(screen.getByText(siteConfig.name)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(siteConfig.copyright))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`v${siteConfig.version}`))).toBeInTheDocument();
  });

  it('홈 링크 및 주요 계산기 시맨틱 링크가 올바른 href 속성으로 렌더링되어야 한다', () => {
    render(
      <MemoryRouter>
        <GlobalFooter />
      </MemoryRouter>
    );

    const homeLinks = screen.getAllByRole('link', { name: /홈|대시보드/i });
    expect(homeLinks.length).toBeGreaterThan(0);
    expect(homeLinks[0]).toHaveAttribute('href', '/');

    const loanLink = screen.getByRole('link', { name: /대출/i });
    expect(loanLink).toHaveAttribute('href', '/loan');

    const salaryLink = screen.getByRole('link', { name: /연봉/i });
    expect(salaryLink).toHaveAttribute('href', '/salary');
  });

  it('HS HUB 및 GitHub 외부 링크가 올바른 href 및 rel 속성과 함께 제공되어야 한다', () => {
    render(
      <MemoryRouter>
        <GlobalFooter />
      </MemoryRouter>
    );

    const hubLink = screen.getByRole('link', { name: /HS HUB/i });
    expect(hubLink).toHaveAttribute('href', siteConfig.links.hub);
    expect(hubLink).toHaveAttribute('target', '_blank');
    expect(hubLink).toHaveAttribute('rel', 'noopener noreferrer');

    const githubLink = screen.getByRole('link', { name: /GitHub/i });
    expect(githubLink).toHaveAttribute('href', siteConfig.links.github);
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
