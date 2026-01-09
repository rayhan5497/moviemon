import { useSearchParams } from 'react-router-dom';
import { useEffect, useContext, useState, useRef } from 'react';
import { motion } from 'framer-motion';

import meme from '@/assets/image/meme.webp';

import LottiePlayer from '../components/ui/LottiePlayer';
import loadingSpinner from '@/assets/animated-icon/loading-spinner.lottie';

import MovieCard from '../components/cards/MovieCard';
import { useMovies } from '../hooks/useMovies';
import MainScrollContext from '../context/MainScrollContext';
import verifyAdultQuery from '../utils/verifyAdultQuery';
import SearchBox from '../components/ui/SearchBox';
import { useSnackbar } from '../context/SnackbarProvider';
import ShowError from '@/components/ui/ShowError';
import useInfiniteObserver from '../hooks/useInfiniteObserver';

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

    // Observer setup — run once per mount
  useInfiniteObserver({
    targetRef: sentinelRef, // this div from Layout
    rootRef: mainRef,
    rootMargin: '200px', // trigger a bit before reaching bottom
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

  // 1. Reset scroll on new query ---------------------------------------------
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
          className={`w-full sm:h-full sm:w-auto md:max-h-96 [transition-property:opacity,scale] [transition-duration:2000ms,4000ms]  [transition-timing-function:linear,linear] ${
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
        <div
          className="movie-wrapper movies-grid grid gap-1 lg:gap-2 m-2 xl:m-4
          grid-cols-[repeat(auto-fill,minmax(110px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(120px,1fr))]
          md:grid-cols-[repeat(auto-fill,minmax(130px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]
          xl:grid-cols-[repeat(auto-fill,minmax(170px,1fr))] md:mt-0"
        >
          {allMovies.map(
            (media) =>
              media.media_type !== 'person ' && (
                <MovieCard key={media.id} media={media} />
              )
          )}
        </div>
        {!isLoading && !hasNextPage && allMovies.length <= 0 && (
          <div className="flex items-center justify-center gap-2 m-auto w-fit p-2 text-primary bg-accent-secondary rounded">
            <span className="text-secondary">No Media Found</span>
            <div className="w-5 h-5 invert-on-dark">🎬</div>
          </div>
        )}
        {!isLoading && !hasNextPage && allMovies.length > 0 && (
          <div className="flex items-center justify-center gap-2 m-auto w-fit p-2 text-primary bg-accent-secondary rounded">
            <span className="text-secondary">No More Media</span>
            <div className="w-5 h-5 invert-on-dark">🎬</div>
          </div>
        )}

        {isLoading && allMovies.length === 0 && (
          <div className="flex items-center justify-center gap-2 m-auto w-fit p-2 text-primary bg-accent-secondary rounded">
            <span className="text-secondary">Loading Media</span>
            <div className="invert-on-dark">
              <LottiePlayer lottie={loadingSpinner} className="w-[1.4em]" />
            </div>
          </div>
        )}
        {isFetchingNextPage && allMovies.length > 0 && (
          <div className="flex items-center justify-center gap-2 m-auto w-fit p-2 text-primary bg-accent-secondary rounded">
            <span className="text-secondary">Loading More Media</span>
            <div className="invert-on-dark">
              <LottiePlayer lottie={loadingSpinner} className="w-[1.4em]" />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Search;
