import { useCallback, useEffect, useRef, useState } from 'react';
import { subscribe } from './invalidationBus';

/**
 * Generic data-fetching hook — a small stand-in for React Query's useQuery.
 *
 * @param {Function} fetcher  async function returning the data
 * @param {Object}   options
 * @param {Array}    options.key      values that, when changed, trigger a refetch
 * @param {boolean}  options.enabled  skip fetching while false (e.g. waiting for an id)
 * @param {string[]} options.tags     invalidation tags this query listens to
 *
 * Returns { data, error, isError, isLoading, isFetching, refetch }.
 * Previous data is kept while refetching (like React Query's keepPreviousData),
 * so changing a page/filter doesn't flash a full-screen loader.
 */
export function useApiQuery(fetcher, { key = [], enabled = true, tags = [] } = {}) {
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(enabled);

  // Keep the latest fetcher without making it a dependency.
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const run = useCallback(async () => {
    setIsFetching(true);
    try {
      const result = await fetcherRef.current();
      setData(result);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setIsFetching(false);
    }
  }, []);

  const keyStr = JSON.stringify(key);
  const tagsStr = JSON.stringify(tags);

  // Fetch on mount and whenever the key or enabled flag changes.
  useEffect(() => {
    if (!enabled) {
      setIsFetching(false);
      return undefined;
    }
    run();
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyStr, enabled]);

  // Refetch when a mutation invalidates one of our tags.
  useEffect(() => {
    if (!enabled) return undefined;
    const tagList = JSON.parse(tagsStr);
    const unsubs = tagList.map((tag) => subscribe(tag, run));
    return () => unsubs.forEach((u) => u());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagsStr, enabled]);

  return {
    data,
    error,
    isError: Boolean(error),
    // Only show the "first load" state when we have nothing to display yet.
    isLoading: enabled && isFetching && data === undefined,
    isFetching,
    refetch: run,
  };
}
