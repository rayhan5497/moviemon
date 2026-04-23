import { useSearchParams } from 'react-router-dom';
import { useEffect, useContext, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { VirtuosoGrid } from 'react-virtuoso'; // 1. Import Virtuoso

import meme from '@/shared/assets/image/meme.webp';
import loadingSpinner from '@/shared/assets/animated-icon/loading-spinner.lottie';

import MovieCard from '@/widgets/SaveableMovieCard';
import { useMovies } from '@/shared/hooks/useMovies';
import MainScrollContext from '@/shared/context/MainScrollContext';
import verifyAdultQuery from '@/shared/utils/verifyAdultQuery';
import SearchBox from '@/features/search/SearchBox';
import { useSnackbar } from '@/shared/context/SnackbarProvider';
import ShowError from '@/shared/components/ui/ShowError';
import useInfiniteObserver from '@/shared/hooks/useInfiniteObserver';
import Message from '@/shared/components/ui/Message';
import InfiniteMovieGrid from '@/shared/components/sections/infiniteMovieGrid';
import SaveableMovieCard from '@/widgets/SaveableMovieCard';

const Search = () => {
  const { showSnackbar } = useSnackbar();
  const [visible, setVisible] = useState(false);

  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString();
  const type = 'search';

  const isQuery = searchParams.get('query');
    const isAdultQuery = isQuery && verifyAdultQuery(searchParams.get('query'));

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
    isLoading,
  } = useMovies(queryString, type, { enabled: !isAdultQuery });

  useEffect(() => {
    document.title = `Search ${
      isQuery
        ? 'For: ' + isQuery.toUpperCase()
        : 'Your Favorite Movies & TV Series'
    } - Moviemon`;
  }, [isQuery]);

  // 2. Filter data here to prevent "Empty Divs" in the grid
  const allMovies = [
    ...new Map(
      (data?.pages || [])
        .flatMap((page) => page.results)
        .filter((m) => m && m.poster_path && m.media_type !== 'person') // Combined filters
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

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [queryString]);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  useEffect(() => {
    if (isAdultQuery) {
      showSnackbar(`WE DON'T DO THIS IN HERE 💀🗿`, {
        color: 'red',
        fontWeight: 'bold',
      });
    }
  }, [isAdultQuery]);

  if (!isQuery) {
    return (
      <div className="wrapper flex items-center justify-center self-center gap-2 m-auto p-2 text-primary bg-accent-secondary rounded relative w-full h-full ">
        <motion.div
          layoutId="search-box"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <SearchBox inMotion={true} isSearchOpen={true} />
        </motion.div>
      </div>
    );
  }

  if (isAdultQuery) {
    return (
      <div className="flex items-center justify-center self-center gap-2 m-auto p-2 text-primary bg-accent-secondary rounded absolute w-full h-full top-1/2 left-1/2 -translate-1/2 z-10">
        <img
          className={`w-full sm:h-full sm:w-auto md:max-h-80 transition-all duration-1000 ${
            visible ? 'opacity-100 scale-100' : 'opacity-0 scale-80'
          }`}
          src={meme}
          alt=""
        />
      </div>
    );
  }

  if (isError)
    return <ShowError type={type} code={error.code} message={error.message} />;

  return (
    <>
      <div className="movies">
        {!isLoading && (
          <h1 className="heading inset-0 m-4 text-2xl md:text-3xl font-normal text-accent">
            🔎︎ Found <strong>{data?.pages[0]?.total_results} </strong>
            result for{' '}
            <strong>
              {searchParams.get('query')}:{' '}
              {data?.pages[0]?.total_results > 0 ? '🎉' : '☺'}{' '}
            </strong>
          </h1>
        )}

        {/* 3. VirtuosoGrid replaces the manual .map() */}
        <InfiniteMovieGrid
          data={allMovies}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          renderItem={(media) => (
            <SaveableMovieCard key={media.id} media={media} />
          )}
        />

        <div className="message pt-3">
          {!isLoading && !hasNextPage && allMovies.length <= 0 && (
            <Message icon="🎬" message="No Media Found!" />
          )}

          {(isLoading && allMovies.length === 0) || isFetchingNextPage ? (
            <Message
              lottie={loadingSpinner}
              message={isLoading ? 'Loading Media' : 'Loading More Media'}
              className="w-[1.4em]"
            />
          ) : null}

          {!isLoading && !hasNextPage && allMovies.length > 0 && (
            <Message icon="🎬" message="No More Media" />
          )}
        </div>
      </div>
    </>
  );
};

export default Search;
