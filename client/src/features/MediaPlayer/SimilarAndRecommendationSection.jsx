import { BsStars } from 'react-icons/bs';
import { RiMovieAiLine } from 'react-icons/ri';

import { useIsMd } from '@/shared/hooks/useIsMd';

import HorizontalCardCarousel from '@/shared/components/sections/HorizontalCardCarousel';
import SaveableMovieCard from '@/widgets/SaveableMovieCard';

const SimilarAndRecommendationSection = ({ media }) => {
  const similar = media?.similar?.results;
  const recommendations = media?.recommendations?.results;
  const title = media?.name ? 'Similar TV Shows' : 'Similar Movies';
  const getType = () => (media?.name ? 'tv' : 'movie');
  const similarRoute = `/${getType()}/${media?.id}/similar`;
  const recommendationRoute = `/${getType()}/${media?.id}/recommendations`;

  const isMd = useIsMd();

  const hasRecommendations = recommendations?.length > 0;
  const hasSimilar = similar?.length > 0;

  if (!media || (!hasRecommendations && !hasSimilar)) return null;

  return (
    <div
      className={`similar-and-recommendation ${
        isMd && hasRecommendations && hasSimilar
          ? 'xl:flex xl:gap-10 xl:w-1/2'
          : ''
      }`}
    >
      {hasRecommendations && (
        <HorizontalCardCarousel
          media={recommendations}
          title="You may also like"
          route={recommendationRoute}
          Icon={BsStars}
          CardComponent={SaveableMovieCard}
        />
      )}
      {hasSimilar && (
        <HorizontalCardCarousel
          media={similar}
          title={title}
          route={similarRoute}
          Icon={RiMovieAiLine}
          CardComponent={SaveableMovieCard}
        />
      )}
    </div>
  );
};

export default SimilarAndRecommendationSection;

