// useOnClickOutside.ts
import { useEffect } from 'react';

const useOnClickOutside = (
  ref: React.RefObject<HTMLElement>,
  handler: (event: MouseEvent | TouchEvent) => void,
  ignoredRefs?: React.RefObject<HTMLElement>[]
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }

      // Yoksayılan referanslarda tıklama olup olmadığını kontrol edin
      if (ignoredRefs) {
        for (const ignoredRef of ignoredRefs) {
          if (ignoredRef.current && ignoredRef.current.contains(event.target as Node)) {
            return;
          }
        }
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, ignoredRefs]);
};

export default useOnClickOutside;
