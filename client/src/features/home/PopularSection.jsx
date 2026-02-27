import { useMemo, useEffect } from 'react';

import LottiePlayer from '@/shared/components/ui/LottiePlayer';
import popularAnimation from '@/shared/assets/animated-icon/popular.lottie';
import loadingSpinner from '@/shared/assets/animated-icon/loading-spinner.lottie';
import { useMovies } from '@/shared/hooks/useMovies';
import randomizeArray from '@/shared/utils/randomizeArray';
import HorizontalCardCarousel from '@/shared/components/sections/HorizontalCardCarousel';
import ShowError from '@/shared/components/ui/ShowError';
import Message from '@/shared/components/ui/Message';
import SaveableMovieCard from '@/widgets/SaveableMovieCard';

const PopularSection = ({ setMovies }) => {
  const queryString = `popular`;
  const type = 'movie/tv';

  const { data, isError, error, isLoading } = useMovies(
    queryString,
    type,
    false
  );

  const combined = useMemo(() => {
    if (!data?.pages?.[0]) return [];
    return data.pages[0].movies.results.concat(data.pages[0].tvs.results);
  }, [data]);

  const allMovies = useMemo(() => {
    if (!combined || combined.length === 0) return [];
    return randomizeArray(combined).slice(0, 20);
  }, [combined]);

  useEffect(() => {
    setMovies(allMovies);
  }, [allMovies]);

  const getLottiePlayer = () => {
    return (
      <LottiePlayer
        lottie={!isLoading ? popularAnimation : loadingSpinner}
        className={`w-[1.5em] ${isLoading ? 'invert-on-dark' : ''}`}
      />
    );
  };

  return (
    <div className="m-2 md:m4">
      <HorizontalCardCarousel
        media={allMovies}
        title={'Most Popular'}
        route={'/movie/popular'}
        Icon={getLottiePlayer}
        className="text-accent"
        CardComponent={SaveableMovieCard}
      />

      {isError && (
        <ShowError type={type} code={error.code} message={error.message} />
      )}

      {isLoading && allMovies.length === 0 && (
        <>
        <Message message="Loading, Please wait..." className="w-[1.4em]" />
        </>
      )}
    </div>
  );
};

export default PopularSection;

