import { useParams } from 'react-router-dom';
import { useRef, useContext, useEffect } from 'react';

import loadingSpinner from '@/assets/animated-icon/loading-spinner.lottie';

import MovieCard from '../composed/SaveableMovieCard';
import { useMovies } from '../hooks/useMovies';
import MainScrollContext from '../context/MainScrollContext';
import ShowError from '@/components/ui/ShowError';
import useInfiniteObserver from '../hooks/useInfiniteObserver';
import Message from '../components/ui/Message';
import NowPlayingContext from '../context/NowPlayingContext';
import { useIsMd } from '../hooks/useIsMd';
import HeadingSection from '../features/MediaPlayer/HeadingSection';
import DetailsSection from '../features/MediaPlayer/DetailsSection';
import HighLightSection from '../components/sections/HighLight';

const Similar = () => {
  const { mediaType, sort, id } = useParams();
  const queryString = `${mediaType}/${id}/${sort}`;
  const type = 'similar/recommendations';

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

  const { nowPlayingMedia, setNowPlayingMedia } = useContext(NowPlayingContext);

  const mediaQueryString = `${
    mediaType + '/' + id
  }&append_to_response=credits,content_ratings,release_dates,recommendations,similar,external_ids`;

  const type2 = `player/${mediaType}`;

  // fetch movie data if context is empty
  const {
    data: mediaData,
    isError: mediaIsError,
    error: mediaError,
    isLoading: mediaIsLoading,
  } = useMovies(mediaQueryString, type2, {
    enabled: nowPlayingMedia ? false : true,
  });

  const media = mediaData?.pages[0];

  // Change document title
  useEffect(() => {
    document.title = `${
      nowPlayingMedia?.title
        ? sort + ' Movies For: ' + nowPlayingMedia?.title
        : nowPlayingMedia?.name
        ? sort + ' TV Series For: ' + nowPlayingMedia?.name
        : 'Unknown'
    }`;
  }, [nowPlayingMedia]);

  useEffect(() => {
    setNowPlayingMedia(media);
  }, [media]);

  const isMd = useIsMd();

  if (isError || (mediaIsError && allMovies.length === 0))
    return (
      <ShowError type={type} code={error?.code} message={error?.message} />
    );

  return (
    <>
      <div className="movies">
        {!isLoading && (
          <h1 className="heading inset-0 m-4 text-2xl md:text-3xl font-normal text-accent">
            <strong>{data?.pages[0]?.total_results} </strong>
            <strong>
              {sort === 'recommendations' ? 'recommendad' : sort}{' '}
              {mediaType === 'movie' ? 'Movie' : 'TV Show'} {'available for:'}
            </strong>
          </h1>
        )}
        {nowPlayingMedia && (
          <>
            {isMd ? (
              <div className="details-container relative gap-4 flex flex-col m-2 my-5">
                <div className="main-details flex gap-4">
                  <div className="w-full h-full max-w-60 relative rounded-lg">
                    <MovieCard media={nowPlayingMedia} />
                  </div>
                  <div className="heading-and-details flex flex-col gap-3">
                    <HeadingSection
                      media={nowPlayingMedia}
                      className="text-primary"
                    />
                    <DetailsSection
                      media={nowPlayingMedia}
                      className="text-primary"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="details-container relative gap-4 flex flex-col mx-2">
                <div className="poster-and-highlight flex gap-2">
                  <div className="w-full max-w-40 relative rounded-lg">
                    <MovieCard media={nowPlayingMedia} />
                  </div>
                  <HighLightSection
                    media={nowPlayingMedia}
                    className="text-primary"
                  />
                </div>
              </div>
            )}
          </>
        )}

        <div
          className="movie-wrapper movies-grid grid gap-1 lg:gap-2 m-2 xl:m-4
          grid-cols-[repeat(auto-fill,minmax(110px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(120px,1fr))]
          md:grid-cols-[repeat(auto-fill,minmax(130px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]
          xl:grid-cols-[repeat(auto-fill,minmax(170px,1fr))] md:mt-0"
        >
          {allMovies.map((media) => (
            <MovieCard key={media.id} media={media} />
          ))}
        </div>
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
        {!isLoading && !hasNextPage && allMovies.length === 0 && (
          <Message
            icon="🎬"
            message={`No ${
              media?.title ? sort + ' for this Movie!' : ' for this TV show'
            }`}
          />
        )}
      </div>
    </>
  );
};

export default Similar;
