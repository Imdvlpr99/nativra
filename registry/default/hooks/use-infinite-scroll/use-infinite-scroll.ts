/** Nativra — useInfiniteScroll. Install: npx nativra-cli add use-infinite-scroll */
import { useCallback, useEffect, useRef, useState } from "react";

export interface Page<T, C> {
  items: T[];
  /** Cursor for the next page; null or undefined when this was the last page. */
  nextCursor?: C | null;
}

export interface UseInfiniteScrollOptions<T, C> {
  /** Loads one page. `cursor` is undefined for the first page. */
  fetchPage: (cursor: C | undefined) => Promise<Page<T, C>>;
  /** Load the first page on mount (default true). */
  enabled?: boolean;
}

export function useInfiniteScroll<T, C = string>({ fetchPage, enabled = true }: UseInfiniteScrollOptions<T, C>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const cursor = useRef<C | undefined>(undefined);
  const inFlight = useRef(false);
  // Bumped by every refresh: a page requested before it is dropped when it arrives.
  const generation = useRef(0);
  const fetchRef = useRef(fetchPage);
  fetchRef.current = fetchPage;
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(async (reset: boolean) => {
    if (inFlight.current && !reset) return;
    const gen = reset ? ++generation.current : generation.current;
    inFlight.current = true;
    if (reset) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const page = await fetchRef.current(reset ? undefined : cursor.current);
      if (!mounted.current || gen !== generation.current) return;
      cursor.current = page.nextCursor ?? undefined;
      setHasMore(page.nextCursor != null);
      setItems((prev) => (reset ? page.items : [...prev, ...page.items]));
    } catch (err) {
      if (mounted.current && gen === generation.current) setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      // A superseded request leaves the flags to the request that replaced it.
      if (gen === generation.current) {
        inFlight.current = false;
        if (mounted.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    }
  }, []);

  /** Loads the next page. Does nothing while disabled or a page loads, after the last page, or after an error (use retry). */
  const loadMore = useCallback(() => {
    // FlatList calls onEndReached at once for an empty list: nothing loads until `enabled`.
    if (!enabled || !hasMore || error) return;
    void load(false);
  }, [enabled, hasMore, error, load]);

  /** Reloads from the first page, replacing the items once it arrives. */
  const refresh = useCallback(() => void load(true), [load]);

  /** Repeats the request that failed. */
  const retry = useCallback(() => void load(items.length === 0), [load, items.length]);

  useEffect(() => {
    if (enabled) void load(true);
  }, [enabled, load]);

  return {
    items,
    loading,
    refreshing,
    error,
    hasMore,
    loadMore,
    refresh,
    retry,
    /** Spread onto a FlatList: data, onEndReached, onEndReachedThreshold, refreshing, onRefresh. */
    listProps: {
      data: items,
      onEndReached: loadMore,
      onEndReachedThreshold: 0.5,
      refreshing,
      onRefresh: refresh,
    },
  };
}
