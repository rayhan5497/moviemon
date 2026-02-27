import { useEffect, useState } from 'react';

export function useIsLg() {
  const query = '(min-width: 1024px)';

  const [isLg, setIsLg] = useState(() => {
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);

    const handler = () => setIsLg(media.matches);

    media.addEventListener('change', handler);

    return () => media.removeEventListener('change', handler);
  }, []);

  return isLg;
}
