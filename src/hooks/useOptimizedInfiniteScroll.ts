import { useCallback, useEffect, useRef } from 'react';
import React from 'react';

interface UseOptimizedInfiniteScrollOptions {
  isLoading: boolean;
  isFetching?: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

interface UseOptimizedInfiniteScrollReturn {
  lastElementRef: (node: HTMLElement | null) => void;
  sentinelRef: React.RefObject<HTMLDivElement>;
}

/**
 * Optimized infinite scroll hook with proper cleanup and memory leak prevention
 * Supports both last element observation and sentinel element patterns
 */
export const useOptimizedInfiniteScroll = ({
  isLoading,
  isFetching = false,
  hasMore,
  onLoadMore,
  threshold = 0.1,
  rootMargin = '0px',
  enabled = true
}: UseOptimizedInfiniteScrollOptions): UseOptimizedInfiniteScrollReturn => {
  const observer = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Memoized callback to avoid recreation on every render
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    
    if (entry?.isIntersecting && !isLoading && !isFetching && hasMore && enabled) {
      onLoadMore();
    }
  }, [isLoading, isFetching, hasMore, onLoadMore, enabled]);

  // Create observer instance with proper cleanup
  const createObserver = useCallback(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin
    });

    return observer.current;
  }, [handleIntersection, threshold, rootMargin]);

  // Last element ref callback for dynamic lists
  const lastElementRef = useCallback((node: HTMLElement | null) => {
    // Don't observe if loading or fetching
    if (isLoading || isFetching || !enabled) return;
    
    // Disconnect previous observer
    if (observer.current) observer.current.disconnect();

    // Create new observer and observe the node
    if (node) {
      const observerInstance = createObserver();
      observerInstance.observe(node);
    }
  }, [isLoading, isFetching, enabled, createObserver]);

  // Effect for sentinel-based observation
  useEffect(() => {
    if (!enabled || !sentinelRef.current) return;

    const sentinelElement = sentinelRef.current;
    const observerInstance = createObserver();
    
    observerInstance.observe(sentinelElement);

    return () => {
      observerInstance.disconnect();
    };
  }, [createObserver, enabled]);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
        observer.current = null;
      }
    };
  }, []);

  return {
    lastElementRef,
    sentinelRef
  };
};

export default useOptimizedInfiniteScroll;