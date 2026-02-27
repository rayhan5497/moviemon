import { useMemo } from 'react';

import randomizeArray from '@/shared/utils/randomizeArray';

import HeroSlider from './HeroSlider';

const HeroSliderSection = ({ trending, popular }) => {
  const allMedia = useMemo(() => {
    return randomizeArray(
      Array.from(
        new Map([...popular, ...trending].map((m) => [m.id, m])).values()
      )
    );
  }, [trending, popular]);

  if (!allMedia.length) return null;

  return (
    allMedia && (
      <section>
        <HeroSlider items={allMedia.slice(0, 10)} />
      </section>
    )
  );
};

export default HeroSliderSection;

