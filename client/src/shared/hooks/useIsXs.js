import { useEffect, useState } from 'react';

export function useIsXs() {
  const query = '(min-width: 300px)';

  const [isXs, setIsXs] = useState(() => {
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);

    const handler = () => setIsXs(media.matches);

    media.addEventListener('change', handler);

    return () => media.removeEventListener('change', handler);
  }, []);

  return isXs;
}
