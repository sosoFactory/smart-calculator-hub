import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFavorites, FAVORITES_STORAGE_KEY } from './useFavorites';

describe('useFavorites', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('초기 상태에서는 빈 즐겨찾기 목록을 반환한다', () => {
    const { result } = renderHook(() => useFavorites());

    expect(result.current.favorites).toEqual([]);
    expect(result.current.isFavorite('loan')).toBe(false);
  });

  it('기존 로컬스토리지에 저장된 즐겨찾기 목록을 정상적으로 불러온다', () => {
    window.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(['compound', 'loan'])
    );

    const { result } = renderHook(() => useFavorites());

    expect(result.current.favorites).toEqual(['compound', 'loan']);
    expect(result.current.isFavorite('compound')).toBe(true);
    expect(result.current.isFavorite('loan')).toBe(true);
    expect(result.current.isFavorite('salary')).toBe(false);
  });

  it('toggleFavorite 실행 시 즐겨찾기 추가 및 로컬스토리지 영속화가 이루어진다', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite('salary');
    });

    expect(result.current.favorites).toEqual(['salary']);
    expect(result.current.isFavorite('salary')).toBe(true);

    const stored = JSON.parse(window.localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]');
    expect(stored).toEqual(['salary']);
  });

  it('이미 등록된 항목에 toggleFavorite 실행 시 목록에서 정상 제거된다', () => {
    window.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(['salary', 'goal'])
    );

    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite('salary');
    });

    expect(result.current.favorites).toEqual(['goal']);
    expect(result.current.isFavorite('salary')).toBe(false);
    expect(result.current.isFavorite('goal')).toBe(true);
  });

  it('addFavorite 및 removeFavorite 개별 메서드가 올바르게 작동한다', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.addFavorite('bmi');
    });
    expect(result.current.favorites).toEqual(['bmi']);

    // 중복 추가 방지
    act(() => {
      result.current.addFavorite('bmi');
    });
    expect(result.current.favorites).toEqual(['bmi']);

    act(() => {
      result.current.removeFavorite('bmi');
    });
    expect(result.current.favorites).toEqual([]);
  });

  it('다른 컴포넌트나 인스턴스에서 발생한 FAVORITES_CHANGED_EVENT를 감지하여 동기화한다', () => {
    const hook1 = renderHook(() => useFavorites());
    const hook2 = renderHook(() => useFavorites());

    expect(hook1.result.current.favorites).toEqual([]);
    expect(hook2.result.current.favorites).toEqual([]);

    act(() => {
      hook1.result.current.toggleFavorite('cashflow');
    });

    expect(hook1.result.current.favorites).toEqual(['cashflow']);
    expect(hook2.result.current.favorites).toEqual(['cashflow']);
  });

  it('로컬스토리지 데이터가 손상되었을 경우 빈 배열로 안전하게 폴백한다', () => {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, 'invalid-json{{{');

    const { result } = renderHook(() => useFavorites());

    expect(result.current.favorites).toEqual([]);
  });
});
