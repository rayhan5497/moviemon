import { useEffect } from 'react';

const useInfiniteObserver = ({ rootRef, targetRef, onIntersect }) => {

  useEffect(() => {
    if (!rootRef.current || !targetRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        observer.unobserve(entry.target); // 🔥 critical
        onIntersect();
      },
      { root: rootRef.current }
    );

    observer.observe(targetRef.current);
    return () => observer.disconnect();
  }, [rootRef, onIntersect]);

  return targetRef;
};

export default useInfiniteObserver;
