import { useSearchParams } from 'react-router-dom';
import { useRef, useContext, useEffect } from 'react';

import loadingSpinner from '@/assets/animated-icon/loading-spinner.lottie';

import MovieCard from '../composed/SaveableMovieCard';
import FilterMovies from '../components/filters/discover/FilterMovies';
import { useMovies } from '../hooks/useMovies';
import MainScrollContext from '../context/MainScrollContext';
import ShowError from '@/components/ui/ShowError';
import useInfiniteObserver from '../hooks/useInfiniteObserver';
import Message from '../components/ui/Message';

const Tv = () => {
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString();
  const type = 'discover/tv';

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
    isLoading,
  } = useMovies(queryString, type);

  // flatten all pages into one array
  const allTv = [
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
    document.title = `Discover TV Series - Moviemon`;
  }, []);

  if (isError)
    return <ShowError type={type} code={error.code} message={error.message} />;

  return (
    <>
      <FilterMovies />
      <div className="movies">
        <div
          className="movie-wrapper movies-grid grid gap-1 lg:gap-2 m-2 xl:m-4
          grid-cols-[repeat(auto-fit,minmax(110px,auto))] sm:grid-cols-[repeat(auto-fit,minmax(120px,auto))]
          md:grid-cols-[repeat(auto-fit,minmax(130px,auto))] lg:grid-cols-[repeat(auto-fit,minmax(150px,auto))]
          xl:grid-cols-[repeat(auto-fit,minmax(170px,auto))] md:mt-0"
        >
          {allTv.map((media) => (
            <MovieCard key={media.id} media={media} />
          ))}
        </div>

        {(isLoading && allTv.length === 0) || isFetchingNextPage ? (
          <Message
            lottie={loadingSpinner}
            message={isLoading ? 'Loading TV Shows' : 'Loading More Shows'}
            className="w-[1.4em]"
          />
        ) : null}

        {!isLoading && !hasNextPage && (
          <Message icon="🎬" message="No More Shows" />
        )}
      </div>
    </>
  );
};

export default Tv;
