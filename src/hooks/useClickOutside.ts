import { useEffect, RefObject } from 'react';

export const useClickOutside = (
  refs: RefObject<HTMLElement>[],
  handler: (event: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Check if click is outside all provided refs
      const isOutside = refs.every(ref => 
        ref.current && !ref.current.contains(event.target as Node)
      );
      
      if (isOutside) {
        handler(event);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [refs, handler]);
};