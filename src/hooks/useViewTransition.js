import { useCallback } from 'react';

export const useViewTransition = () => {
  const startViewTransition = useCallback((callback) => {
    if (!document.startViewTransition) {
      callback();
      return;
    }

    return document.startViewTransition(callback);
  }, []);

  return { startViewTransition };
};
