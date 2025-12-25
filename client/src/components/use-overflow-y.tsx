import { useEffect } from 'react';

export function useOverflowY() {
  useEffect(() => {
    document.documentElement.classList.add('overflow-y-scroll');

    return () => {
      document.documentElement.classList.remove('overflow-y-scroll');
    };
  }, []);
}
