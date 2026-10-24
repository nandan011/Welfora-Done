import { useEffect, useState } from 'react';

const defaultSerialize = value => JSON.stringify(value);
const defaultDeserialize = value => JSON.parse(value);

export function readStoredValue(key, fallback, deserialize = defaultDeserialize) {
  try {
    const stored = localStorage.getItem(key);
    return stored === null ? fallback : deserialize(stored);
  } catch {
    return fallback;
  }
}

export function usePersistentState(key, fallback, options = {}) {
  const serialize = options.serialize || defaultSerialize;
  const deserialize = options.deserialize || defaultDeserialize;
  const [value, setValue] = useState(() => readStoredValue(key, fallback, deserialize));
  useEffect(() => {
    try { localStorage.setItem(key, serialize(value)); } catch { /* Storage may be unavailable in private browsing. */ }
  }, [key, value, serialize]);
  return [value, setValue];
}
