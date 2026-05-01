"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableInitialValue = useMemo(() => initialValue, []);

  const readValue = useCallback((): T => {
    if (typeof window === "undefined") return stableInitialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : stableInitialValue;
    } catch {
      return stableInitialValue;
    }
  }, [key, stableInitialValue]);

  // ✅ Lazy initializer — sirf ek baar chalta hai, SSR safe
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const current = readValue();
        const newValue = value instanceof Function ? value(current) : value;
        window.localStorage.setItem(key, JSON.stringify(newValue));
        setStoredValue(newValue);
        // ✅ Same-page doosre components ko bhi update karo
        window.dispatchEvent(
          new StorageEvent("storage", {
            key,
            newValue: JSON.stringify(newValue),
          })
        );
      } catch {
        console.warn(`useLocalStorage: could not set key "${key}"`);
      }
    },
    [key, readValue]
  );

  // ✅ Cross-tab sync
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === key) {
        setStoredValue(readValue());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key, readValue]);

  return [storedValue, setValue] as const;
}
