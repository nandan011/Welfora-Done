// useAsync: Custom hook for standardized asynchronous state management
// Syllabus Topic: Async state and loading/error handling in React
import { useState, useCallback, useEffect } from 'react';

/**
 * useAsync hook manages the complete lifecycle of asynchronous operations:
 * - status: 'idle' | 'pending' | 'resolved' | 'rejected'
 * - loading: boolean convenience flag
 * - data: resolved result
 * - error: caught exception or error message
 * - execute: trigger function with dynamic arguments
 * - reset: reset back to idle state
 */
export function useAsync(asyncFunction, immediate = false) {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setStatus('pending');
      setError(null);

      try {
        const response = await asyncFunction(...args);
        setData(response);
        setStatus('resolved');
        return response;
      } catch (err) {
        const errorMessage = err?.message || 'An unexpected error occurred';
        setError(errorMessage);
        setStatus('rejected');
        throw err;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setData(null);
    setError(null);
  }, []);

  useEffect(() => {
    let isCancelled = false;
    if (immediate) {
      Promise.resolve().then(() => {
        if (!isCancelled) {
          execute();
        }
      });
    }
    return () => {
      isCancelled = true;
    };
  }, [execute, immediate]);

  return {
    execute,
    reset,
    status,
    data,
    error,
    loading: status === 'pending',
    isSuccess: status === 'resolved',
    isError: status === 'rejected',
  };
}
