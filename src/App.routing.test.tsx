import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('Seam 2-1: React Router Navigation and Routing', () => {
  it('/compound 경로에서는 연복리 계산기 화면이 렌더링되어야 한다', async () => {
    render(
      <MemoryRouter initialEntries={['/compound']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('연복리 & 자산성장 계산기')).toBeInTheDocument();
    expect(await screen.findByText('투자 조건 설정', {}, { timeout: 14000 })).toBeInTheDocument();
  }, 20000);

  it('/unit 경로에서는 단위 변환기 화면이 렌더링되어야 한다', async () => {
    render(
      <MemoryRouter initialEntries={['/unit']}>
        <App />
      </MemoryRouter>
    );

    expect((await screen.findAllByText('단위 변환기')).length).toBeGreaterThanOrEqual(1);
  }, 15000);

  it('/exchange 경로에서는 환율 계산기 화면이 렌더링되어야 한다', async () => {
    render(
      <MemoryRouter initialEntries={['/exchange']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getAllByText('환율 계산기').length).toBeGreaterThanOrEqual(1);
    expect(await screen.findByText('전체 주요 통화 실시간 일괄 환산', {}, { timeout: 10000 })).toBeInTheDocument();
  }, 15000);

  it('/ 경로로 접속 시 메인 홈 대시보드 화면이 렌더링되어야 한다', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('계산기 모아보기')).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: '전체' }, { timeout: 10000 })).toBeInTheDocument();
    expect(screen.getAllByText('연복리 계산기').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('대출이자 계산기').length).toBeGreaterThanOrEqual(2);
  }, 15000);

  it('/loan 경로에서는 대출이자 계산기 화면이 렌더링되어야 한다', async () => {
    render(
      <MemoryRouter initialEntries={['/loan']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getAllByText('대출이자 & 상환방식 비교').length).toBeGreaterThanOrEqual(1);
    expect(await screen.findByText('3대 상환방식 동시 비교', {}, { timeout: 10000 })).toBeInTheDocument();
  }, 15000);

  it('/salary 경로에서는 연봉 실수령액 계산기 화면이 렌더링되어야 한다', async () => {
    render(
      <MemoryRouter initialEntries={['/salary']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getAllByText('연봉 실수령액 계산기').length).toBeGreaterThanOrEqual(1);
    expect(await screen.findByText('급여 조건 입력', {}, { timeout: 10000 })).toBeInTheDocument();
    expect(await screen.findByText('공제 항목별 세부 명세표', {}, { timeout: 10000 })).toBeInTheDocument();
  }, 15000);

  it('/bmi 경로에서는 BMI & 비만도 계산기 화면이 렌더링되어야 한다', async () => {
    render(
      <MemoryRouter initialEntries={['/bmi']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getAllByText('BMI & 비만도 계산기').length).toBeGreaterThanOrEqual(1);
    expect(await screen.findByText('신체 정보 입력', {}, { timeout: 10000 })).toBeInTheDocument();
    expect(await screen.findByText('비만도 스펙트럼 게이지', {}, { timeout: 10000 })).toBeInTheDocument();
  }, 15000);

  it('/goal 경로에서는 목표 자산 역산 계산기 화면이 렌더링되어야 한다', async () => {
    render(
      <MemoryRouter initialEntries={['/goal']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getAllByText('목표 자산 역산 계산기').length).toBeGreaterThanOrEqual(1);
    expect(await screen.findByText('목표 조건 설정', {}, { timeout: 10000 })).toBeInTheDocument();
    expect(await screen.findByText('목표 달성 필요 월 적립액', {}, { timeout: 10000 })).toBeInTheDocument();
  }, 15000);
});
