import { useParams } from 'react-router-dom';
import { useEffect, useContext, useRef, useState, useMemo } from 'react';

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
import ActionButtons from '@/features/MediaPlayer/components/ActionButtons';
import GallerySection from '@/features/MediaPlayer/GallerySection';

//-------------------------
// Details Skeleton
//-------------------------
const SkeletonBlock = ({ className = '' }) => (
  <div className={`skeleton-shimmer ${className}`}></div>
);

const DetailsSkeleton = () => {
  return (
    <div className="movies md:flex md:flex-col w-full">
      <div className="movie-wrapper md:flex md:flex-col md:w-full text-white max-w-screen-2xl self-center">
        {/* Desktop Layout */}
        <div className="hidden md:flex details-container relative gap-4 flex-col m-2 my-5">
          <div className="relevant-details m-2 mt-6 space-y-8">
            {/* Cast Section Skeleton */}
            <div>
              <SkeletonBlock className="h-7 w-32 rounded-full mb-4" />
              <div className="grid grid-flow-col auto-cols-[110px] gap-3 overflow-hidden">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <SkeletonBlock className="aspect-square w-full rounded-full" />
                    <SkeletonBlock className="h-4 w-full rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Similar & Recommendations Skeleton */}
            <div>
              <SkeletonBlock className="h-7 w-48 rounded-full mb-4" />
              <div className="grid grid-flow-col auto-cols-[140px] gap-2 overflow-hidden">
                {Array.from({ length: 7 }).map((_, i) => (
                  <SkeletonBlock
                    key={i}
                    className="aspect-[2/3] w-full rounded-2xl"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden details-container relative gap-4 flex flex-col mx-2 mt-4">
          <div className="relevant-details m-2 space-y-6">
            {/* Cast Section Skeleton Mobile */}
            <div>
              <SkeletonBlock className="h-6 w-28 rounded-full mb-3" />
              <div className="grid grid-flow-col auto-cols-[90px] gap-2 overflow-hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <SkeletonBlock className="aspect-square w-full rounded-full" />
                    <SkeletonBlock className="h-3 w-full rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Similar & Recommendations Skeleton Mobile */}
            <div>
              <SkeletonBlock className="h-6 w-40 rounded-full mb-3" />
              <div className="grid grid-flow-col auto-cols-[110px] gap-2 overflow-hidden">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonBlock
                    key={i}
                    className="aspect-[2/3] w-full rounded-xl"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MediaPlayer = () => {
  const { mediaType, id } = useParams();
  const type = `player/${mediaType}`;

  // State to trigger the heavy query fetching
  const [loadDetails, setLoadDetails] = useState(false);

  // 1. LIGHTWEIGHT INITIAL QUERY (5-10kb)
  const initialQueryString = `${mediaType}/${id}&append_to_response=videos`;
  const {
    data: initialData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
    isLoading,
  } = useMovies(initialQueryString, type);

  // 2. HEAVY DEFERRED QUERY (140kb - triggered later)
  const heavyQueryString = `${mediaType}/${id}&append_to_response=credits,content_ratings,release_dates,recommendations,similar,external_ids,backdrops,images`;
  const {
    data: heavyData,
    isLoading: isHeavyLoading,
    isError: isHeavyError,
  } = useMovies(heavyQueryString, type, {
    enabled: loadDetails,
  });

  // Combine initial structural data with appended sub-properties as they arrive
  const media = useMemo(() => {
    const base = initialData?.pages[0];
    const extra = heavyData?.pages[0];
    if (!base) return null;
    return { ...base, ...extra };
  }, [initialData, heavyData]);

  useEffect(() => {
    if (media) {
      const sizeInBytes = new Blob([JSON.stringify(media)]).size;
      console.log(`Size of merged media object in bytes: ${sizeInBytes}`);
    }
  }, [media]);

  const { mainRef, sentinelRef } = useContext(MainScrollContext);
  const fetchLock = useRef(false);

  // Use observer to trigger loading the heavy data details on scroll
  useInfiniteObserver({
    targetRef: sentinelRef,
    rootRef: mainRef,
    rootMargin: '200px',
    threshold: 0,
    onIntersect: async () => {
      if (!loadDetails) {
        setLoadDetails(true);
      }

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
    if (!media) return;
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
                mediaTitle={media?.title || media?.name}
              />

              {isMd ? (
                <>
                  <div className="details-container relative gap-4 flex flex-col m-2 my-5">
                    <div className="main-details flex gap-4">
                      <img
                        id="poster"
                        className="w-full h-max max-w-60 relative rounded-lg min-w-0 flex-shrink"
                        src={`https://image.tmdb.org/t/p/w780${poster}`}
                        alt=""
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
                        alt=""
                      />
                      <div className="container flex flex-col justify-center">
                        <HighLightSection
                          media={media}
                          SaveButtons={SaveButtonsContainer}
                        />
                      </div>
                    </div>

                    <DetailsSection media={media} />
                  </div>
                </>
              )}
              {!isHeavyLoading && !isHeavyError ? (
                <div className="relevant-details m-2">
                  {media?.images?.backdrops?.length > 0 && (
                    <GallerySection
                      backdrops={media?.images?.backdrops}
                      title={media?.title || media?.name}
                    />
                  )}
                  <CastSection media={media} />
                  <SimilarAndRecommendationSection
                    media={media}
                    CardComponent={MovieCard}
                  />
                </div>
              ) : isHeavyLoading && !isHeavyError ? (
                <DetailsSkeleton />
              ) : (
                isHeavyError &&
                !isHeavyLoading && (
                  <ShowError
                    className="!text-red-500 !my-2"
                    message={`Failed to load more relevant details`}
                  />
                )
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
