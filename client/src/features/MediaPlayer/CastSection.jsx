import { FiCast } from 'react-icons/fi';

import HorizontalCardCarousel from '@/shared/components/sections/HorizontalCardCarousel';

const CastSection = ({ media }) => {
  return (
    media?.credits?.cast?.length > 0 && (
      <HorizontalCardCarousel
        media={media?.credits?.cast}
        title={'Top Actors'}
        Icon={FiCast}
        type="cast"
      />
    )
  );
};

export default CastSection;

