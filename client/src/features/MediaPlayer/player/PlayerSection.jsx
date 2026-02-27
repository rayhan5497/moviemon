import { useSearchParams, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoadingRipple from '@/assets/animated-icon/loadingRipple.svg';

import HlsPlayer from './HlsPlayer';
import FallbackIframe from './FallbackIframe';

import '../../../index.css';
import { useIsLg } from '@/hooks/useIsLg';
import { useIsMd } from '@/hooks/useIsMd';
import { saveWatchProgress } from '@/features/MediaPlayer/utils/watchHistory';

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

const Player = ({ media }) => {
  // console.log('media in Player:', media);
  const imdbId = media?.imdb_id || media?.external_ids?.imdb_id || null;

  const [showTurnstile, setShowTurnstile] = useState(false);

  const [searchParams] = useSearchParams();
  const { mediaType, id } = useParams();
  const [videoSrc, setVideoSrc] = useState(null);
  const [iframeSrc, setIframeSrc] = useState(null);
  const [timeout, setTimeout] = useState(false);
  const [statusCode, setStatusCode] = useState(true);
  const [subtitleSrc, setSubtitleSrc] = useState(null);

  // Read from URL for iframe src
  let season = null;
  let episode = null;

  if (mediaType === 'tv') {
    season = searchParams.get('season') || '1';
    episode = searchParams.get('episode') || '1';
  } else {
    season = null;
    episode = null;
  }

  async function getLink(url) {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      const err = new Error(data.status_message);
      err.code = data.status_code;
      throw err;
    }
    return data;
  }

  const loadVideo = async () => {
    try {
      const url =
        mediaType === 'tv'
          ? `${BASE_URL}/api/movies/video-src?query=${mediaType}/${id}/${season}/${episode}`
          : `${BASE_URL}/api/movies/video-src?query=${mediaType}/${id}`;

      const link = await getLink(url);

      if (link.statusCode === 404) {
        setTimeout(false);
        setPlayButtonClicked(false);
        setStatusCode(link.statusCode);
        console.log('Media Does not exist:', link);
        return;
      }
      if (link.statusCode === 500) {
        setTimeout(false);
        setPlayButtonClicked(false);
        setStatusCode(link.statusCode);
        console.log('Server Error:', link);
        return;
      }
      if (link.statusCode === 429) {
        setTimeout(false);
        setPlayButtonClicked(false);
        setStatusCode(link.statusCode);
        console.log('To Many Request:', link);
        return;
      }

      if (link.timeout) {
        setTimeout(true);
        setPlayButtonClicked(false);
        console.log('link timeout:', link);
        return;
      }

      if (link.needsTurnstile) {
        setIframeSrc(link.middleSrc);
        setShowTurnstile(true);
        console.log('link:', link);
        return;
      }
      setVideoSrc(link.videoLink);
      setSubtitleSrc(link.subtitleSrc);
      console.log('link:', link);
    } catch (err) {
      if (err instanceof TypeError) {
        setTimeout(false);
        setPlayButtonClicked(false);
        console.log('Network error: check your connection', err);
        setStatusCode('NETWORK_ERROR');
      } else {
        console.error('Unexpected error:', err);
      }
    }
  };

  console.log('videoSrc', videoSrc);

  const handlePlayBtnClick = () => {
    setPlayButtonClicked(true);
    const mediaId = media?.id ?? Number(id);
    if (mediaId) {
      if (mediaType === 'tv') {
        saveWatchProgress(
          mediaId,
          Number(season),
          Number(episode),
          null,
          null,
          mediaType
        );
      } else {
        saveWatchProgress(mediaId, null, null, null, null, mediaType);
      }
    }
    loadVideo();
  };

  const [imgLoaded, setImgLoaded] = useState(false);
  const [menifestLoaded, setMenifestLoaded] = useState(false);
  const [playBtnClicked, setPlayButtonClicked] = useState(false);

  // Add a key that changes when episode changes to force full remount
  const playerKey = `${videoSrc}-${season}-${episode}`;

  useEffect(() => {
    if (playBtnClicked) {
      // Reset states when episode changes
      setPlayButtonClicked(false);
      setVideoSrc(null);
      setMenifestLoaded(false);
      setTimeout(false);
      setShowTurnstile(false);
      setStatusCode(200);
    }
  }, [episode]);

  const isLg = useIsLg();
  const isMd = useIsMd();

  return (
    <div className="player-container bg-black m-0 relative w-full aspect-video md:overflow-hidden grid rounded md:rouded-tl-lg md:rounded-bl-lg">
      <div
        id="player-background"
        className="fixed top-0 left-0 w-full h-full -z-10 bg-black"
      ></div>
      <img
        id="player-background"
        className="fixed top-0 left-0 w-full blur-lg brightness-50 -z-10"
        src={`https://image.tmdb.org/t/p/w185${
          isLg ? media.backdrop_path : media.poster_path
        }`}
      />
      {!playBtnClicked && (
        <>
          <img
            className={`placeholder-image relative self-center top-0 left-0 w-full h-auto border-0 brightness-80 rounded ${
              !imgLoaded ? 'invisible' : 'visible'
            }`}
            src={`https://image.tmdb.org/t/p/${
              isLg ? 'original' : isMd ? 'w1280' : 'w780'
            }${media.backdrop_path}`}
            alt=""
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgLoaded(true)}
          />
          <button
            onClick={handlePlayBtnClick}
            className="play-btn cursor-pointer bg-orange-400 hover:scale-140 scale-125 transition-all duration-300 p-[0.5rem] rounded-full font-semibold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="black"
              viewBox="0 0 24 24"
              className="w-10 h-10"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </>
      )}
      {playBtnClicked && !menifestLoaded && !showTurnstile && (
        <img
          className="absolute z-50 top-1/2 left-1/2 -translate-1/2 w-28 h-28 border-0"
          src={LoadingRipple}
        />
      )}
      {playBtnClicked && videoSrc && !showTurnstile && (
        <HlsPlayer
          key={playerKey} // ← Add this key to force proper remount
          videoSrc={videoSrc}
          setMenifestLoaded={setMenifestLoaded}
          subtitleSrc={subtitleSrc}
          imdbId={imdbId}
          season={season}
          episode={episode}
        />
      )}
      {showTurnstile && <FallbackIframe url={iframeSrc} />}
      {!playBtnClicked && !videoSrc && !showTurnstile && timeout && (
        <div className="absolute inset-0 gap-5 flex items-center flex-col justify-center bg-black bg-opacity-75">
          <p className="text-white text-lg">Request Timeout, Please Reload!</p>
          <button
            onClick={handlePlayBtnClick}
            className="relative play-btn cursor-pointer bg-orange-400 hover:scale-140 scale-125 transition-all duration-300 p-[0.5rem] rounded-full font-semibold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-rotate-cw-icon lucide-rotate-cw"
            >
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
          </button>
          <p className="text-white/80 text-md">or Try again later...!</p>
        </div>
      )}
      {statusCode === 404 && (
        <div className="absolute inset-0 gap-5 flex items-center flex-col justify-center bg-black bg-opacity-75">
          <p className="text-white text-lg">Media not found !</p>
        </div>
      )}
      {statusCode === 500 && (
        <div className="absolute inset-0 gap-5 flex items-center flex-col justify-center bg-black bg-opacity-75">
          <p className="text-white text-lg">Server Error !</p>
        </div>
      )}
      {statusCode === 429 && (
        <div className="absolute inset-0 gap-5 flex items-center flex-col justify-center bg-black bg-opacity-75">
          <p className="text-white text-lg">
            To many request, Please try again later !
          </p>
        </div>
      )}
      {statusCode === 'NETWORK_ERROR' && (
        <div className="absolute inset-0 gap-5 flex items-center flex-col justify-center bg-black bg-opacity-75">
          <p className="text-white text-lg">
            Please check your internet connection !
          </p>
        </div>
      )}
    </div>
  );
};

export default Player;
