import { useParams } from 'react-router-dom';
import { useEffect, useContext, useRef, useState } from 'react';

import { useMovies } from '@/shared/hooks/useMovies';
import { useIsMd } from '@/shared/hooks/useIsMd';
import { useIsLg } from '@/shared/hooks/useIsLg';

import MainScrollContext from '@/shared/context/MainScrollContext';
import NowPlayingContext from '@/shared/context/NowPlayingContext';
import { setMeta } from '@/shared/utils/setMeta';

import Player from '../features/MediaPlayer/player/PlayerSection';
import FilterSeason from '../features/MediaPlayer/filters/FilterSeason';
import FilterSeasonDesktop from '../features/MediaPlayer/filters/FilterSeasonDesktop';
import HeadingSection from '../features/MediaPlayer/HeadingSection';
import HighLightSection from '@/shared/components/sections/HighLight';
import DetailsSection from '../features/MediaPlayer/DetailsSection';
import CastSection from '../features/MediaPlayer/CastSection';
import ShowError from '@/shared/components/ui/ShowError';
import SimilarAndRecommendationSection from '../features/MediaPlayer/SimilarAndRecommendationSection';
import useInfiniteObserver from '@/shared/hooks/useInfiniteObserver';
import Message from '@/shared/components/ui/Message';
import MediaPlayerSkeleton from '@/features/MediaPlayer/MediaPlayerSkeleton';
import MovieCard from '@/widgets/MovieCard';
import SaveButtonsContainer from '@/features/user/SaveButtonsContainer';
import TrailerModal from '../features/MediaPlayer/TrailerModal';
import ActionButtons from '@/features/MediaPlayer/Components/ActionButtons';

const MediaPlayer = () => {
  const { mediaType, id } = useParams();
  const queryString = `${
    mediaType + '/' + id
  }&append_to_response=credits,content_ratings,release_dates,recommendations,similar,external_ids,videos,backdrops`;

  const type = `player/${mediaType}`;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
    isLoading,
  } = useMovies(queryString, type);

  const media = data?.pages[0];

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
    if (!isLoading && !hasNextPage && mainRef.current) {
      requestAnimationFrame(() => {
        mainRef.current.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      });
    }
  }, [isLoading, hasNextPage, media]);

  const { setIsPlayerPage, setNowPlayingId } = useContext(NowPlayingContext);
  useEffect(() => {
    setNowPlayingId(media?.id);
  }, [setNowPlayingId, media]);

  const isMd = useIsMd();
  const isLg = useIsLg();

  useEffect(() => {
    setIsPlayerPage(true);
    return () => {
      setIsPlayerPage(false);
    };
  }, []);

  const poster = media?.poster_path;

  //Change document title
  useEffect(() => {
    const title = `Watch: ${media?.name || media?.title}`;

    document.title = `${title} - Moviemon`;

    setMeta('description', media?.overview || 'Watch movies on Moviemon');

    setMeta('og:title', title, 'property');

    setMeta('og:description', media?.overview, 'property');

    setMeta(
      'og:image',
      `https://image.tmdb.org/t/p/w1280${media?.backdrop_path}`,
      'property'
    );

    setMeta('twitter:card', 'summary_large_image');

    setMeta('twitter:title', title);

    setMeta('twitter:description', media?.overview);

    setMeta(
      'twitter:image',
      `https://image.tmdb.org/t/p/w1280${media?.backdrop_path}`
    );
  }, [media]);

  const [openTrailer, setOpenTrailer] = useState(false);

  if (isError)
    return (
      <ShowError type={mediaType} code={error.code} message={error.message} />
    );

  return (
    <>
      <div
        className={`movies md:flex md:flex-col ${!isLg ? 'w-full' : 'm-10'}`}
      >
        <div className="movie-wrapper md:flex md:flex-col md:w-full text-white max-w-screen-2xl self-center">
          {media && (
            <>
              <div
                id="playerWrapper"
                className="player-wrapper md:flex md:h-[70vh] md:w-full"
              >
                <Player media={media} />
                {isMd && mediaType === 'tv' && (
                  <FilterSeasonDesktop tv={media} />
                )}
              </div>

              {!isMd && (
                <ActionButtons setOpenTrailer={setOpenTrailer} media={media} />
              )}

              <TrailerModal
                open={openTrailer}
                onClose={() => setOpenTrailer(false)}
                videos={media?.videos?.results}
                mediaTitle={media?.title}
              />

              {isMd ? (
                <>
                  <div className="details-container relative gap-4 flex flex-col m-2 my-5">
                    <div className="main-details flex gap-4">
                      <img
                        id="poster"
                        className="w-full h-max max-w-60 relative rounded-lg min-w-0 flex-shrink"
                        src={`https://image.tmdb.org/t/p/w780${poster}`}
                      />
                      <div className="heading-and-details flex flex-col gap-3 items-start">
                        <HeadingSection media={media} />
                        <DetailsSection media={media} />
                        <ActionButtons
                          setOpenTrailer={setOpenTrailer}
                          media={media}
                        />
                      </div>
                      <HighLightSection
                        media={media}
                        SaveButtons={SaveButtonsContainer}
                      />
                    </div>
                    <div className="relevant-details m-2">
                      <CastSection media={media} />
                      <SimilarAndRecommendationSection
                        media={media}
                        CardComponent={MovieCard}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="details-container relative gap-4 flex flex-col mx-2">
                    <HeadingSection media={media} />
                    {mediaType === 'tv' && <FilterSeason tv={media} />}
                    <div className="poster-and-highlight flex gap-2 min-w-0">
                      <img
                        id="poster"
                        className="w-full h-fit max-w-40 min-w-0 flex-shrink rounded-lg"
                        src={`https://image.tmdb.org/t/p/w780${poster}`}
                      />
                      <div className="container flex flex-col justify-center">
                        <HighLightSection
                          media={media}
                          SaveButtons={SaveButtonsContainer}
                        />

                        {/* <ActionButtons
                          setOpenTrailer={setOpenTrailer}
                          media={media}
                        /> */}
                      </div>
                    </div>

                    <DetailsSection media={media} />

                    <div className="relevant-details m-2">
                      <CastSection media={media} />
                      <SimilarAndRecommendationSection
                        media={media}
                        CardComponent={MovieCard}
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        {isLoading && <MediaPlayerSkeleton />}
      </div>
    </>
  );
};

export default MediaPlayer;
