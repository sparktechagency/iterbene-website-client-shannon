import { useCallback, useRef, useEffect } from 'react';

interface UseInfiniteScrollOptions {
  isLoading: boolean;
  isFetching: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  threshold?: number;
  rootMargin?: string;
}

export const useInfiniteScroll = ({
  isLoading,
  isFetching,
  hasMore,
  onLoadMore,
  threshold = 0.1,
  rootMargin = '100px'
}: UseInfiniteScrollOptions) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !isLoading && !isFetching) {
            onLoadMore();
          }
        },
        { 
          threshold,
          rootMargin
        }
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, isFetching, hasMore, onLoadMore, threshold, rootMargin]
  );

  // Cleanup observer on unmount
  useEffect(() => {
    const currentObserver = observer.current;
    return () => {
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
  }, []);

  return { lastElementRef };
};