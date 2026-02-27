import { useMemo, useEffect } from 'react';

import LottiePlayer from '@/components/ui/LottiePlayer';
import popularAnimation from '@/assets/animated-icon/popular.lottie';
import loadingSpinner from '@/assets/animated-icon/loading-spinner.lottie';
import { useMovies } from '@/hooks/useMovies';
import randomizeArray from '@/utils/randomizeArray';
import HorizontalCardCarousel from '@/components/sections/HorizontalCardCarousel';
import ShowError from '@/components/ui/ShowError';
import Message from '../../components/ui/Message';
import SaveableMovieCard from '@/composed/SaveableMovieCard';

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
        <Message message="Loading, Please wait..." className="w-[1.4em]" />
      )}
    </div>
  );
};

export default PopularSection;
