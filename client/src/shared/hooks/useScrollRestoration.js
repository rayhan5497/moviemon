import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { scrollMemory } from '@/shared/utils/scrollMemory';

export default function useScrollRestoration(mainRef) {
  const location = useLocation();
  const navType = useNavigationType();
  const container = mainRef.current;

  useEffect(() => {
    if (!container) return;

    const scrollKey = location.pathname + location.search;

    // If going back/forward (POP), restore saved scroll
    if (navType === 'POP') {
      if (location.pathname.startsWith('/player')) {
        container.scrollTop = 0;
        return;
      }

      const saved = scrollMemory[scrollKey];
      if (saved != null) {
        let attempts = 0;
        const tryRestore = () => {
          if (container.scrollHeight >= saved || attempts > 25) {
            container.scrollTop = saved;
          } else {
            attempts++;
            requestAnimationFrame(tryRestore);
          }
        };
        requestAnimationFrame(tryRestore);
      } else {
        container.scrollTop = 0;
      }
      return;
    }

    // For normal navigation (PUSH / REPLACE), scroll to top
    container.scrollTop = 0;
  }, [location, navType, mainRef]);
}

