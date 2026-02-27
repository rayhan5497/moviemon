import { motion, AnimatePresence } from 'framer-motion';

import { useEffect, useState, useContext } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';

import NowPlayingContext from '@/shared/context/NowPlayingContext';
import { useMovies } from '@/shared/hooks/useMovies';
import {
  saveWatchProgress,
  getWatchProgress,
} from '../utils/watchHistory';

const FilterSeason = ({ tv }) => {
  const {
    setNowPlayingSNum,
    nowPlayingSNum,
    setNowPlayingENum,
    nowPlayingENum,
    setNowPlayingSId,
    nowPlayingSId,
    setNowPlayingEId,
    nowPlayingEId,
  } = useContext(NowPlayingContext);

  const [searchParams, setSearchParams] = useSearchParams();
  const { mediaType, id } = useParams();

  const urlSeason = searchParams.get('season');
  const urlEpisode = searchParams.get('episode');

  const [currentSeason, setCurrentSeason] = useState(
    urlSeason ? parseInt(urlSeason) : 1
  );
  const [currentEpisode, setCurrentEpisode] = useState(
    urlEpisode ? parseInt(urlEpisode) : 1
  );

  useEffect(() => {
    if (mediaType === 'tv' && !urlSeason && !urlEpisode) {
      const progress = getWatchProgress(id);
      if (progress) {
        setSearchParams(
          {
            season: progress.season,
            episode: progress.episode,
          },
          { replace: true }
        );
      }
    }
  }, [id, mediaType, urlSeason, urlEpisode]);

  useEffect(() => {
    if (urlSeason) {
      console.log('urlSeason', urlSeason);
      setNowPlayingSNum(parseInt(urlSeason));
    }
    if (urlEpisode) {
      console.log('urlEpisode', urlEpisode);
      setNowPlayingENum(parseInt(urlEpisode));
    }
  }, [urlSeason, urlEpisode]);

  const queryString =
    `${mediaType}/${id}` +
    (currentSeason !== undefined && currentSeason !== null
      ? `/season/${currentSeason}`
      : '');
  const type = `player/tv`;
  const { data, isLoading } = useMovies(queryString, type);
  const season = data?.pages[0];

  const handleSeasonClick = (sNum) => {
    setCurrentSeason(sNum);
  };

  const handleEpisodeClick = (eNum, eId, sId) => {
    if (
      nowPlayingENum === eNum &&
      nowPlayingEId === eId &&
      nowPlayingSId === sId
    )
      return;

    setSearchParams(
      {
        season: currentSeason,
        episode: eNum,
      },
      { replace: true }
    );
    setNowPlayingENum(eNum);
    setCurrentEpisode(eNum);
    setNowPlayingSId(sId);
    setNowPlayingEId(eId);

    if (mediaType === 'tv') {
      saveWatchProgress(id, currentSeason, eNum, sId, eId);
    }
  };

  useEffect(() => {
    if (mediaType === 'tv' && urlSeason && urlEpisode) {
      saveWatchProgress(id, urlSeason, urlEpisode);
    } else {
      const progress = getWatchProgress(id);
      if (progress) {
        setSearchParams(
          {
            season: progress.season,
            episode: progress.episode,
          },
          { replace: true }
        );
      }
    }
  }, []);

  useEffect(() => {
    const saved = getWatchProgress(tv.id);

    if (saved) {
      setNowPlayingSNum(saved.season);
      setNowPlayingENum(saved.episode);
      setNowPlayingSId(saved.seasonId);
      setNowPlayingEId(saved.episodeId);
    } else {
      setNowPlayingSNum(1);
      setNowPlayingENum(1);
      setNowPlayingSId(null);
      setNowPlayingEId(null);
    }
  }, [tv.id]);

  console.log('currentSeason', currentSeason);
  console.log('currentEpisode', currentEpisode);

  return (
    <div id="filterSeason" className="season-and-episode-wrapper flex flex-col">
      <div className="season-section flex items-center gap-1">
        <span className="nowPlaying bg-black/20 flex items-center p-2 gap-1 shadow-[1px_0_1px] rounded-tr-[5px] rounded-br-[20px] border-r-1">
          <span>Season:</span>{' '}
          <span>{String(nowPlayingSNum)?.padStart(2, '0')}</span>
        </span>
        <div className="season-wrapper gap-2 flex overflow-auto">
          {tv.seasons
            ?.filter((s) => s.season_number !== 0)
            .map((s) => (
              <span
                key={s.season_number}
                onClick={() => handleSeasonClick(s.season_number)}
                className={`cursor-pointer hover:bg-gray-500/30 rounded p-1 px-2 text-white ${
                  Number(nowPlayingSNum) === s.season_number
                    ? 'bg-teal-600'
                    : ''
                } ${
                  Number(currentSeason) === s.season_number
                    ? 'bg-gray-600'
                    : ''
                }`}
              >{`S${s.season_number}`}</span>
            ))}
        </div>
      </div>
      <div className="episode-section flex items-center gap-1">
        <span className="nowPlaying bg-black/20 flex items-center p-2 gap-1 shadow-[1px_0_1px] rounded-tr-[5px] rounded-br-[20px] border-r-1">
          <span>Episode:</span>{' '}
          <span>{String(nowPlayingENum)?.padStart(2, '0')}</span>
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            className={`episode-wrapper gap-2 flex overflow-auto items-center min-h-[2rem] ${
              isLoading || season?.episodes?.length <= 0
                ? 'w-full justify-center'
                : ''
            }`}
            key={`${season?.id}_${nowPlayingEId}_${nowPlayingENum}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
          >
            {isLoading ? (
              <span className="flex gap-2 items-center justify-center w-full">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 bg-teal-600 rounded-full"
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </span>
            ) : (
              <>
                {season?.episodes?.length <= 0 ? (
                  <span className="text-gray-400">
                    No episode in <strong>season {currentSeason} </strong> !
                  </span>
                ) : (
                  season?.episodes?.map((e) => (
                    <span
                      onClick={() =>
                        handleEpisodeClick(e.episode_number, e.id, season.id)
                      }
                      className={`cursor-pointer hover:bg-gray-500/30 rounded p-1 px-2 text-white ${
                        Number(nowPlayingENum) === e.episode_number &&
                        (Number(nowPlayingEId) === e.id ||
                          nowPlayingEId === null)
                          ? 'bg-teal-600'
                          : ''
                      }`}
                      key={e.episode_number}
                    >{`E${e.episode_number}`}</span>
                  ))
                )}
              </>
            )}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FilterSeason;

