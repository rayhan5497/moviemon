import LottiePlayer from '@/shared/components/ui/LottiePlayer';
import fireAnimation from '@/shared/assets/animated-icon/fire-animation.lottie';
import loadingSpinner from '@/shared/assets/animated-icon/loading-spinner.lottie';
import HorizontalCardCarousel from '@/shared/components/sections/HorizontalCardCarousel';
import ShowError from '@/shared/components/ui/ShowError';
import Message from '@/shared/components/ui/Message';
import SaveableMovieCard from '@/widgets/SaveableMovieCard';

const TrendingSection = ({ movies = [], isLoading, isError, error }) => {
  const type = 'trending';

  const getLottiePlayer = () => {
    return (
      <LottiePlayer
        lottie={!isLoading ? fireAnimation : loadingSpinner}
        className={`w-[1.5em] ${isLoading ? 'invert-on-dark' : ''}`}
      />
    );
  };

  return (
    <div className="m-2 md:m-4">
      <HorizontalCardCarousel
        media={movies}
        title={'Trending Now'}
        route={'/trending/all/day'}
        Icon={getLottiePlayer}
        className="text-accent"
        CardComponent={SaveableMovieCard}
      />

      {isError && (
        <ShowError type={type} code={error.code} message={error.message} />
      )}

      {isLoading && movies.length === 0 && (
        <Message message="Loading, Please wait..." className="w-[1.4em]" />
      )}
    </div>
  );
};

export default TrendingSection;

