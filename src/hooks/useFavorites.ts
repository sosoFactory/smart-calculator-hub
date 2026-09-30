import { useState, useEffect, useCallback } from 'react';
import { CalculatorId } from '../types/navigation';

export const FAVORITES_STORAGE_KEY = 'smart_calc_favorites';
export const FAVORITES_CHANGED_EVENT = 'smart_calc_favorites_changed';

const getStoredFavorites = (): CalculatorId[] => {
  if (typeof window === 'undefined') return [];
  try {
    const item = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!item) return [];
    const parsed = JSON.parse(item);
    return Array.isArray(parsed) ? (parsed as CalculatorId[]) : [];
  } catch (error) {
    console.warn('Failed to parse favorites from localStorage:', error);
    return [];
  }
};

const saveFavorites = (favorites: CalculatorId[]) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT, { detail: favorites }));
  } catch (error) {
    console.warn('Failed to save favorites to localStorage:', error);
  }
};

export function useFavorites() {
  const [favorites, setFavorites] = useState<CalculatorId[]>(getStoredFavorites);

  const reloadFavorites = useCallback(() => {
    setFavorites(getStoredFavorites());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<CalculatorId[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        setFavorites(customEvent.detail);
      } else {
        reloadFavorites();
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === FAVORITES_STORAGE_KEY) {
        reloadFavorites();
      }
    };

    window.addEventListener(FAVORITES_CHANGED_EVENT, handleCustomChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, handleCustomChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [reloadFavorites]);

  const isFavorite = useCallback(
    (id: CalculatorId) => favorites.includes(id),
    [favorites]
  );

  const addFavorite = useCallback((id: CalculatorId) => {
    const current = getStoredFavorites();
    if (!current.includes(id)) {
      const updated = [...current, id];
      saveFavorites(updated);
    }
  }, []);

  const removeFavorite = useCallback((id: CalculatorId) => {
    const current = getStoredFavorites();
    const updated = current.filter((item) => item !== id);
    saveFavorites(updated);
  }, []);

  const toggleFavorite = useCallback((id: CalculatorId) => {
    const current = getStoredFavorites();
    const updated = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id];
    saveFavorites(updated);
  }, []);

  return {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  };
}
