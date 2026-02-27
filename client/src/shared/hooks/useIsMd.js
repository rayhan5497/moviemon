import { useEffect, useState } from 'react';

export function useIsMd() {
  const query = '(min-width: 768px)';

  const [isMd, setIsMd] = useState(() => {
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);

    const handler = () => setIsMd(media.matches);

    media.addEventListener('change', handler);

    return () => media.removeEventListener('change', handler);
  }, []);

  return isMd;
}
