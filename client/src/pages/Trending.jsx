import { useParams } from 'react-router-dom';
import { useRef, useContext, useEffect } from 'react';

import loadingSpinner from '@/shared/assets/animated-icon/loading-spinner.lottie';

import MovieCard from '@/widgets/SaveableMovieCard';
import FilterMovies from '@/shared/components/filters/trending/FilterMovies';
import { useMovies } from '@/shared/hooks/useMovies';
import MainScrollContext from '@/shared/context/MainScrollContext';
import ShowError from '@/shared/components/ui/ShowError';
import useInfiniteObserver from '@/shared/hooks/useInfiniteObserver';
import Message from '@/shared/components/ui/Message';
import InfiniteMovieGrid from '../shared/components/sections/infiniteMovieGrid';
import MovieSkeleton from '../shared/components/ui/MovieSkeleton';

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

  //Change document title
  useEffect(() => {
    console.log('movi', mediaType);
    document.title = `Watch Trending ${
      mediaType === 'movie'
        ? 'Movies'
        : mediaType === 'tv'
        ? 'TV Shows'
        : 'Movies & TV Shows'
    } - Moviemon`;
  }, [mediaType]);

  if (isError)
    return <ShowError type={type} code={error.code} message={error.message} />;

  return (
    <>
      {!isLoading && <FilterMovies />}
      <div className="movies">
        {!isLoading && allMovies.length !== 0 && (
          <InfiniteMovieGrid
            data={allMovies}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            renderItem={(media) => <MovieCard key={media.id} media={media} />}
          />
        )}

        <div className="message pt-3">
          {isLoading && allMovies.length === 0 && <MovieSkeleton />}

          {isFetchingNextPage && (
            <Message
              lottie={loadingSpinner}
              message={
                mediaType === 'movie'
                  ? 'Loading More Movies'
                  : mediaType === 'tv'
                  ? 'Loading More Shows'
                  : 'Loading More Media'
              }
              className="w-[1.4em]"
            />
          )}

          {/* {(isLoading && allMovies.length === 0) || isFetchingNextPage ? (
            <Message
              lottie={loadingSpinner}
              message={
                isLoading
                  ? mediaType === 'movie'
                    ? 'Loading Movies'
                    : mediaType === 'tv'
                    ? 'Loading TV Shows'
                    : 'Loading Media'
                  : mediaType === 'movie'
                  ? 'Loading More Movies'
                  : mediaType === 'tv'
                  ? 'Loading More Shows'
                  : 'Loading More Media'
              }
              className="w-[1.4em]"
            />
          ) : null} */}

          {!isLoading && !hasNextPage && (
            <Message
              icon="🎬"
              message={
                mediaType === 'movie'
                  ? 'No More Movies'
                  : mediaType === 'tv'
                  ? 'No More Shows'
                  : 'No More Media'
              }
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Movies;
