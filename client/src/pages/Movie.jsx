import { useParams, useSearchParams } from 'react-router-dom';
import { useRef, useContext, useEffect } from 'react';

import loadingSpinner from '@/shared/assets/animated-icon/loading-spinner.lottie';

import MovieCard from '@/widgets/SaveableMovieCard';
import FilterMovies from '@/shared/components/filters/movie/FilterMovies';
import { useMovies } from '@/shared/hooks/useMovies';
import MainScrollContext from '@/shared/context/MainScrollContext';
import ShowError from '@/shared/components/ui/ShowError';
import useInfiniteObserver from '@/shared/hooks/useInfiniteObserver';
import Message from '@/shared/components/ui/Message';
import InfiniteMovieGrid from '../shared/components/sections/infiniteMovieGrid';

const Popular = () => {
  const [searchParams] = useSearchParams();

  const { sort } = useParams();
  const queryString = `${sort}&${searchParams.toString()}`;
  const type = 'movie';

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
    document.title = `Watch Popular Movies - Moviemon`;
  }, []);

  if (isError)
    return <ShowError type={type} code={error.code} message={error.message} />;

  return (
    <>
      <FilterMovies />
      <div className="movies">
        <InfiniteMovieGrid
          data={allMovies}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          renderItem={(media) => <MovieCard key={media.id} media={media} />}
        />

        <div className="message pt-3">
          {(isLoading && allMovies.length === 0) || isFetchingNextPage ? (
            <Message
              lottie={loadingSpinner}
              message={isLoading ? 'Loading Movies' : 'Loading More Movies'}
              className="w-[1.4em]"
            />
          ) : null}

          {!isLoading && !hasNextPage && (
            <Message icon="🎬" message="No More Movies" />
          )}
        </div>
      </div>
    </>
  );
};

export default Popular;
