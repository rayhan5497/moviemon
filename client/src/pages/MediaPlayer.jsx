import { useParams } from 'react-router-dom';
import { useEffect, useContext, useRef } from 'react';

import LottiePlayer from '../components/ui/LottiePlayer';
import loadingSpinner from '@/assets/animated-icon/loading-spinner.lottie';

import { useMovies } from '../hooks/useMovies';
import { useIsMd } from '../hooks/useIsMd';
import { useIsLg } from '../hooks/useIsLg';

import MainScrollContext from '../context/MainScrollContext';
import NowPlayingContext from '../context/NowPlayingContext';

import Player from '../features/MediaPlayer/player/PlayerSection';
import FilterSeason from '../components/filters/season/FilterSeason';
import FilterSeasonDesktop from '../components/filters/season/FilterSeasonDesktop';
import HeadingSection from '../features/MediaPlayer/HeadingSection';
import HighLightSection from '../components/sections/HighLight';
import DetailsSection from '../features/MediaPlayer/DetailsSection';
import CastSection from '../features/MediaPlayer/CastSection';
import ShowError from '@/components/ui/ShowError';
import SimilarAndRecommendationSection from '../features/MediaPlayer/SimilarAndRecommendationSection';
import useInfiniteObserver from '../hooks/useInfiniteObserver';

const MediaPlayer = () => {
  const { mediaType, id } = useParams();
  const queryString = `${
    mediaType + '/' + id
  }&append_to_response=credits,content_ratings,release_dates,recommendations,similar,external_ids`;

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

  if (isError)
    return <ShowError type={type} code={error.code} message={error.message} />;

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

              {isMd ? (
                <>
                  <div className="details-container relative gap-4 flex flex-col m-2 my-5">
                    <div className="main-details flex gap-4">
                      <img
                        id="poster"
                        className="w-full h-full max-w-60 relative rounded-lg"
                        src={`https://image.tmdb.org/t/p/w780${poster}`}
                      />
                      <div className="heading-and-details flex flex-col gap-3">
                        <HeadingSection media={media} />
                        <DetailsSection media={media} />
                      </div>
                      <HighLightSection media={media} />
                    </div>
                    <div className="relevant-details m-2">
                      <CastSection media={media} />
                      <SimilarAndRecommendationSection media={media} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="details-container relative gap-4 flex flex-col mx-2">
                    <HeadingSection media={media} />
                    {mediaType === 'tv' && <FilterSeason tv={media} />}
                    <div className="poster-and-highlight flex gap-2">
                      <img
                        id="poster"
                        className="w-full max-w-40 relative rounded-lg"
                        src={`https://image.tmdb.org/t/p/w780${poster}`}
                      />
                      <HighLightSection media={media} />
                    </div>

                    <DetailsSection media={media} />

                    <div className="relevant-details m-2">
                      <CastSection media={media} />
                      <SimilarAndRecommendationSection media={media} />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        {isLoading && (
          <div className="flex items-center justify-center self-center gap-2 m-auto p-2 text-primary bg-accent-secondary rounded absolute w-full h-full top-1/2 left-1/2 -translate-1/2 z-10">
            {console.log('loading movie')}
            <span className="text-secondary">Loading! Please Wait</span>
            <div className="invert-on-dark">
              <LottiePlayer lottie={loadingSpinner} className="w-[1.4em]" />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MediaPlayer;
