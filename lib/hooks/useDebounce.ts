import { useState, useEffect } from 'react';

/**
 * Debounce hook — mengembalikan value yang di-delay setelah `delay` ms tidak ada perubahan.
 * Dipakai untuk debounce input search agar tidak fire request tiap keystroke.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
