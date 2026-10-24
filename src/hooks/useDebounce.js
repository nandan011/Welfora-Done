import { useRef, useEffect } from 'react';

/**
 * useDebounce — returns a stable debounced function
 * that delays calling fn until after `delay` ms have passed
 * since the last invocation.
 */
export function useDebounce(fn, delay = 400) {
  const timer = useRef(null);
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  return (...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      fnRef.current(...args);
    }, delay);
  };
}

/**
 * useDebounceValue — returns a debounced copy of a value.
 * The returned value updates only after `delay` ms of the input being stable.
 */
import { useState } from 'react';

export function useDebounceValue(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
