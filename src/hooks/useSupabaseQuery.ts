"use client";

import { useState, useEffect } from "react";

export interface QueryResult<T> {
  data: T;
  loading: boolean;
  error: Error | null;
}

/**
 * Fetch data from Supabase with mock fallback and error exposure.
 * Simplified to avoid React strict mode lint issues.
 */
export function useSupabaseQuery<T>(
  fetcher: () => Promise<T>,
  fallback: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deps: any[] = []
): QueryResult<T> {
  const [state, setState] = useState<{ data: T; loading: boolean; error: Error | null }>({
    data: fallback,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    fetcher()
      .then((result) => {
        if (!cancelled) setState({ data: result, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) {
          const e = err instanceof Error ? err : new Error(String(err));
          setState({ data: fallback, loading: false, error: e });
        }
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
