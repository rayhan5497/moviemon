import { useParams } from 'react-router-dom';
import { useRef, useContext } from 'react';

import LottiePlayer from '../components/ui/LottiePlayer';
import loadingSpinner from '@/assets/animated-icon/loading-spinner.lottie';

import MovieCard from '../components/cards/MovieCard';
import FilterMovies from '../components/filters/trending/FilterMovies';
import { useMovies } from '../hooks/useMovies';
import MainScrollContext from '../context/MainScrollContext';
import ShowError from '@/components/ui/ShowError';
import useInfiniteObserver from '../hooks/useInfiniteObserver';


const Movies = () => {
  const { mediaType, timeWindow } = useParams();
  const queryString = `${mediaType}/${timeWindow}`;
  const type = 'trending';

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
    isLoading,
  } = useMovies(queryString, type);

  const allMovies = [
    ...new Map(
      (data?.pages || [])
        .flatMap((page) => page.results)
        .filter(Boolean)
        .map((m) => [m.id, m])
    ).values(),
  ];

  const { mainRef, sentinelRef } = useContext(MainScrollContext);

  const fetchLock = useRef(false);

  useInfiniteObserver({
    targetRef: sentinelRef,
    rootRef: mainRef,
    rootMargin: '200px',
    threshold: 0,
    onIntersect: async () => {
      if (fetchLock.current) return;
      if (!hasNextPage || isFetchingNextPage) return;

      fetchLock.current = true;
      try {
        await fetchNextPage();
      } finally {
        fetchLock.current = false;
      }
    },
  });

  if (isError)
    return <ShowError type={type} code={error.code} message={error.message} />;

  return (
    <>
      <FilterMovies />
      <div className="movies">
        <div
          className="movie-wrapper movies-grid grid gap-1 lg:gap-2 m-2 xl:m-4
          grid-cols-[repeat(auto-fill,minmax(110px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(120px,1fr))]
          md:grid-cols-[repeat(auto-fill,minmax(130px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]
          xl:grid-cols-[repeat(auto-fill,minmax(170px,1fr))] md:mt-0"
        >
          {allMovies.map(
            (media) =>
              media.media_type !== 'person' && (
                <MovieCard key={media.id} media={media} />
              )
          )}
        </div>
        {!isLoading && !hasNextPage && (
          <div className="flex items-center justify-center gap-2 m-auto w-fit p-2 text-primary bg-accent-secondary rounded">
            <span className="text-secondary">
              {mediaType === 'movie'
                ? 'No More Movies'
                : mediaType === 'tv'
                ? 'No More Shows'
                : 'No More Media'}
            </span>
            <div className="w-5 h-5 invert-on-dark">🎬</div>
          </div>
        )}

        {isLoading && allMovies.length === 0 && (
          <div className="flex items-center justify-center gap-2 m-auto w-fit p-2 text-primary bg-accent-secondary rounded">
            <span className="text-secondary">
              {mediaType === 'movie'
                ? 'Loading Movies'
                : mediaType === 'tv'
                ? 'Loading TV Shows'
                : 'Loading! please wait'}
            </span>
            <div className="invert-on-dark">
              <LottiePlayer lottie={loadingSpinner} className="w-[1.4em]" />
            </div>
          </div>
        )}
        {isFetchingNextPage && allMovies.length > 0 && (
          <div className="flex items-center justify-center gap-2 m-auto w-fit p-2 text-primary bg-accent-secondary rounded">
            <span className="text-secondary">
              {mediaType === 'movie'
                ? 'Loading More Movies'
                : mediaType === 'tv'
                ? 'Loading More Shows'
                : 'Loading More Media'}
            </span>
            <div className="invert-on-dark">
              <LottiePlayer lottie={loadingSpinner} className="w-[1.4em]" />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Movies;
