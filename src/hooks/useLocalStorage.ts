import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const read = (): T => {
    if (typeof window === "undefined") return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  };

  const [state, setState] = useState<T>(read);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      // keep state in sync if external changes happened
      if (!raw) {
        window.localStorage.setItem(key, JSON.stringify(initialValue));
      } else {
        const parsed = JSON.parse(raw) as T;
        if (JSON.stringify(parsed) !== JSON.stringify(state)) {
          setState(parsed);
        }
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setState((prev) => {
          const next = value instanceof Function ? (value as (p: T) => T)(prev) : value;
          window.localStorage.setItem(key, JSON.stringify(next));
          return next;
        });
      } catch {
        /* ignore */
      }
    },
    [key]
  );

  const remove = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setState(initialValue);
    } catch {
      /* ignore */
    }
  }, [key, initialValue]);

  return [state, set, remove] as const;
}