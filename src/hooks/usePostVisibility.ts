import { useEffect, useRef, useState, useCallback } from 'react';

interface UsePostVisibilityOptions {
  threshold?: number[];
  rootMargin?: string;
  visibilityThreshold?: number;
  hideThreshold?: number;
  debounceMs?: number;
}

export const usePostVisibility = ({
  threshold = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
  rootMargin = "-20px 0px -20px 0px",
  visibilityThreshold = 0.5,
  hideThreshold = 0.3,
  debounceMs = 100
}: UsePostVisibilityOptions = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const setVisibilityWithDebounce = useCallback((newVisibility: boolean) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(newVisibility);
    }, debounceMs);
  }, [debounceMs]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const { intersectionRatio, isIntersecting } = entry;

        let newVisibility = false;

        if (isIntersecting && intersectionRatio >= visibilityThreshold) {
          newVisibility = true;
        } else if (!isIntersecting || intersectionRatio < hideThreshold) {
          newVisibility = false;
        } else {
          // No change in visibility for intermediate values
          return;
        }

        setVisibilityWithDebounce(newVisibility);
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [threshold, rootMargin, visibilityThreshold, hideThreshold, setVisibilityWithDebounce]);

  return { elementRef, isVisible };
};