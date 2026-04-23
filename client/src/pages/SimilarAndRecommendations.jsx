import { useParams } from 'react-router-dom';
import { useRef, useContext, useEffect } from 'react';

import loadingSpinner from '@/shared/assets/animated-icon/loading-spinner.lottie';

import MovieCard from '@/widgets/SaveableMovieCard';
import { useMovies } from '@/shared/hooks/useMovies';
import MainScrollContext from '@/shared/context/MainScrollContext';
import ShowError from '@/shared/components/ui/ShowError';
import useInfiniteObserver from '@/shared/hooks/useInfiniteObserver';
import Message from '@/shared/components/ui/Message';
import NowPlayingContext from '@/shared/context/NowPlayingContext';
import { useIsMd } from '@/shared/hooks/useIsMd';
import HeadingSection from '../features/MediaPlayer/HeadingSection';
import DetailsSection from '../features/MediaPlayer/DetailsSection';
import HighLightSection from '@/shared/components/sections/HighLight';
import InfiniteMovieGrid from '../shared/components/sections/infiniteMovieGrid';

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
  const { data: mediaData, isError: mediaIsError } = useMovies(
    mediaQueryString,
    type2,
    {
      enabled: nowPlayingMedia ? false : true,
    }
  );

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
      </div>
    </>
  );
};

export default Similar;
