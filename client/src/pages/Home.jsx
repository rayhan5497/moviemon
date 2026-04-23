import { useEffect, useMemo } from 'react';

import TrendingSection from '../features/home/TrendingSection';
import PopularSection from '../features/home/PopularSection';
import HeroSliderSection from '../features/home/slider/HeroSliderSection';
import HomeSkeleton from '@/features/home/HomeSkeleton';
import { useMovies } from '@/shared/hooks/useMovies';
import randomizeArray from '@/shared/utils/randomizeArray';

const Home = () => {
  const trendingQuery = useMovies('all/day', 'trending');
  const popularQuery = useMovies('popular', 'movie/tv');

  const trendingMovies = useMemo(() => {
    return [
      ...new Map(
        (trendingQuery.data?.pages || [])
          .flatMap((page) => page.results)
          .filter(Boolean)
          .map((movie) => [movie.id, movie])
      ).values(),
    ];
  }, [trendingQuery.data]);

  const popularMovies = useMemo(() => {
    if (!popularQuery.data?.pages?.[0]) return [];

    const combined = popularQuery.data.pages[0].movies.results.concat(
      popularQuery.data.pages[0].tvs.results
    );

    return randomizeArray(combined).slice(0, 20);
  }, [popularQuery.data]);

  const showSkeleton =
    (trendingQuery.isLoading && trendingMovies.length === 0) ||
    (popularQuery.isLoading && popularMovies.length === 0);

  //Change document title
  useEffect(() => {
    document.title = `Moviemon - Discover Movies Instantly`;
  }, []);

  return (
    <>
      {showSkeleton ? (
        <HomeSkeleton />
      ) : (
        <>
          <HeroSliderSection trending={trendingMovies} popular={popularMovies} />

          <TrendingSection
            movies={trendingMovies}
            isLoading={trendingQuery.isLoading}
            isError={trendingQuery.isError}
            error={trendingQuery.error}
          />
          <PopularSection
            movies={popularMovies}
            isLoading={popularQuery.isLoading}
            isError={popularQuery.isError}
            error={popularQuery.error}
          />
        </>
      )}
    </>
  );
};

export default Home;
