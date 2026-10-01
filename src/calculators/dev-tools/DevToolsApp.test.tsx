import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DevToolsApp } from './DevToolsApp';

describe('DevToolsApp Component', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, '', '/devtools');
  });

  it('renders default tab (BaseTab) with all tabs and info card', () => {
    render(<DevToolsApp />);

    // 탭 내비게이션 확인
    expect(screen.getByRole('tab', { name: /진수 변환/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /CSS 단위 환산/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /색상 코드 변환/i })).toBeInTheDocument();

    // 기본 BaseTab 콘텐츠 렌더링 확인 (10진수 기본값 255)
    expect(screen.getByText('2진수 (Binary)')).toBeInTheDocument();
    expect(screen.getByText('8진수 (Octal)')).toBeInTheDocument();
    expect(screen.getByText('10진수 (Decimal)')).toBeInTheDocument();
    expect(screen.getByText('16진수 (Hexadecimal)')).toBeInTheDocument();

    // 하단 정보 가이드 카드 렌더링 확인
    expect(screen.getByText(/개발자 상식 & 실무 가이드/i)).toBeInTheDocument();
  });

  it('switches to CSS Unit tab and renders px/rem conversion elements', () => {
    render(<DevToolsApp />);

    // CSS 단위 환산 탭 클릭
    const cssTab = screen.getByRole('tab', { name: /CSS 단위 환산/i });
    fireEvent.click(cssTab);

    // CSS 탭 전용 요소 확인
    expect(screen.getByText('픽셀 (PX)')).toBeInTheDocument();
    expect(screen.getByText('렘 (REM / EM)')).toBeInTheDocument();
    expect(screen.getByText('Tailwind Spacing')).toBeInTheDocument();
    expect(screen.getByText('실무 빈출 크기 빠른 선택')).toBeInTheDocument();
  });

  it('switches to Color tab and renders color codes and WCAG contrast check', () => {
    render(<DevToolsApp />);

    // 색상 코드 변환 탭 클릭
    const colorTab = screen.getByRole('tab', { name: /색상 코드 변환/i });
    fireEvent.click(colorTab);

    // 색상 탭 전용 요소 확인
    expect(screen.getByText('HEX 색상 코드')).toBeInTheDocument();
    expect(screen.getByText(/RGB 채널/)).toBeInTheDocument();
    expect(screen.getByText(/HSL \(색상·채도·명도\)/)).toBeInTheDocument();
    expect(screen.getByText('WCAG AA 명암비')).toBeInTheDocument();
  });

  it('restores tab selection from localStorage when available', () => {
    localStorage.setItem('smart_calculator_dev_tools_tab_v1', 'css');

    render(<DevToolsApp />);

    expect(screen.getByText('픽셀 (PX)')).toBeInTheDocument();
    expect(screen.getByText('렘 (REM / EM)')).toBeInTheDocument();
  });
});
