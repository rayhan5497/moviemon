import { motion, AnimatePresence } from 'framer-motion';

import { ChevronLeft } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

import { useEffect, useState, useContext, useRef } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';

import NowPlayingContext from '@/shared/context/NowPlayingContext';
import { useMovies } from '@/shared/hooks/useMovies';
import { saveWatchProgress, getWatchProgress } from '../utils/watchHistory';

const FilterSeason = ({ tv }) => {
  const [filterVisibility, setFilterVisibility] = useState(true);

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

  //-----------------------------------------------------------------------------
  // Read season and episode number from URL first - fallback to saved progress.
  // If no params, neither no saved progress, default to season 1 episode 1.
  // If params, validate url params - fallback default to season 1 episode 1.
  //-----------------------------------------------------------------------------
  const urlSeason = parseInt(searchParams.get('season'));
  const urlEpisode = parseInt(searchParams.get('episode'));

  const validSeasonNum =
    tv?.seasons?.find((s) => s.season_number === urlSeason)?.season_number || 1;

  const [clickedSeasonNum, setClickedSeasonNum] = useState(
    validSeasonNum ?? validSeasonNum
  );

  //------------------------------------------------------
  // Load saved progress only if URL doesn't have params
  // Fallback to season 1 episode 1 if no saved progress
  //------------------------------------------------------
  useEffect(() => {
    if (mediaType === 'tv' && !urlSeason && !urlEpisode) {
      const progress = getWatchProgress(id);

      console.log('progress-first: ', progress);
      if (progress) {
        // Update URL with saved progress
        setSearchParams(
          {
            season: progress.season,
            episode: progress.episode,
          },
          { replace: true }
        );

        // Update context with saved progress
        setNowPlayingSNum(progress.season);
        setNowPlayingENum(progress.episode);
        setNowPlayingSId(progress.seasonId);
        setNowPlayingEId(progress.episodeId);

        // Trigger season fetch with saved season number
        setClickedSeasonNum(progress.season);
      } else {
        // No params, no saved progress - default to season 1 episode 1
        setSearchParams({ season: 1, episode: 1 }, { replace: true });
      }
    }
  }, [id, mediaType, urlSeason, urlEpisode]);

  //--------------------
  // fetch season data
  //--------------------
  const queryString =
    `${mediaType}/${id}` +
    (clickedSeasonNum !== null || clickedSeasonNum !== undefined
      ? `/season/${clickedSeasonNum}`
      : '');
  const type = `player/tv`;
  const {
    data,
    // fetchNextPage,
    // hasNextPage,
    // isFetchingNextPage,
    // isError,
    // error,
    isLoading,
  } = useMovies(queryString, type);
  const season = data?.pages[0];

  //--------------------------------------------------------------------------------------------------------------------
  // If url params found, save in progress including ids if both url season and episode number is valid
  // If url params found but invalid, after season data fetch - update url with fallback valid season and episode number without saving in progress
  //--------------------------------------------------------------------------------------------------------------------
  const seasonClick = useRef(false);
  useEffect(() => {
    // don't update anything with just season click
    if (seasonClick.current) return;

    if (mediaType === 'tv' && urlSeason && urlEpisode) {
      const validEpisodeNum =
        season?.episodes?.find((e) => e.episode_number === urlEpisode)
          ?.episode_number || 1;

      // if episode Id not found that means the episode number in url is invalid, fallback to episode 1, but if season id found that means season number in url is valid, so keep the season number in url and only fallback episode number to 1
      const episodeId = season?.episodes?.find(
        (e) => e.episode_number === urlEpisode
      )?.id;

      const seasonId = season?.id;

      // if both season and episode number in url is valid, then save progress and update context with season and episode ids, otherwise just update url with valid season and episode number without saving in progress
      if (episodeId && seasonId) {
        saveWatchProgress(
          id,
          validSeasonNum,
          validEpisodeNum,
          seasonId,
          episodeId
        );

        setNowPlayingSNum(validSeasonNum);
        setNowPlayingENum(validEpisodeNum);
        setNowPlayingSId(seasonId);
        setNowPlayingEId(episodeId);

        setSearchParams(
          {
            season: validSeasonNum,
            episode: validEpisodeNum,
          },
          { replace: true }
        );
      } else if (
        season &&
        (validSeasonNum !== urlSeason || validEpisodeNum !== urlEpisode)
      ) {
        setSearchParams(
          {
            season: validSeasonNum,
            episode: validEpisodeNum,
          },
          { replace: true }
        );
      }
    }
  }, [id, mediaType, season, urlSeason, urlEpisode]);

  //-------------------------------------------------------------
  // only select the season to trigger selected season data fetch
  //-------------------------------------------------------------
  const handleSeasonClick = (sNum) => {
    seasonClick.current = true;
    setClickedSeasonNum(sNum);
  };

  //---------------------------------------------------------------
  // save progress and update context and url only on episode click
  //---------------------------------------------------------------
  const handleEpisodeClick = (sNum, eNum, sId, eId) => {
    seasonClick.current = false;
    setSearchParams(
      {
        season: sNum,
        episode: eNum,
      },
      { replace: true }
    );
    setNowPlayingSNum(sNum);
    setNowPlayingENum(eNum);
    setNowPlayingSId(sId);
    setNowPlayingEId(eId);

    saveWatchProgress(id, sNum, eNum, sId, eId);
  };

  return (
    <>
      {filterVisibility ? (
        <ChevronLeft
          onClick={() => setFilterVisibility(false)}
          className="filter-visibility-toggle z-1 self-center -mr-4 bg-gray-700 rounded-sm hover:bg-gray-600 w-5 cursor-pointer h-12"
        />
      ) : (
        <ChevronRight
          onClick={() => setFilterVisibility(true)}
          className="filter-visibility-toggle z-1 self-center -mr-4 bg-gray-700 rounded-sm hover:bg-gray-600 w-5 cursor-pointer h-12"
        />
      )}

      {filterVisibility && (
        <div
          id="filterSeason"
          className="season-and-episode-wrapper flex flex-col md:shrink-3 md:overflow-auto md:w-full p-5 pl-6 gap-5 backdrop-grayscale-[1] backdrop-contrast-[1.1] rounded-tr-lg rounded-br-lg"
        >
          <div className="season-section flex items-center gap-1 md:flex-wrap">
            <span className="nowPlaying bg-teal-600 flex items-center p-2 gap-1 border-t-1 w-full justify-center rounded text-white">
              <span>Season:</span>{' '}
              <span>{String(nowPlayingSNum)?.padStart(2, '0')}</span>
            </span>
            <div className="season-wrapper gap-2 flex overflow-auto md:flex-wrap">
              {tv.seasons
                ?.filter((s) => s.season_number !== 0)
                .map((s) => (
                  <span
                    key={s.season_number}
                    onClick={() => handleSeasonClick(s.season_number)}
                    className={`cursor-pointer hover:bg-gray-700 rounded p-1 px-2 text-gray-200 ${
                      clickedSeasonNum === s.season_number ? 'bg-teal-600' : ''
                    }`}
                  >{`S${s.season_number}`}</span>
                ))}
            </div>
          </div>
          <div className="episode-section flex items-center gap-1 md:flex-wrap">
            <span className="nowPlaying bg-teal-600 flex items-center p-2 gap-1 border-t-1 w-full justify-center rounded text-white">
              <span>Episode:</span>{' '}
              <span>{String(nowPlayingENum)?.padStart(2, '0')}</span>
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                className={`episode-wrapper gap-2 flex overflow-auto items-center min-h-[2rem] md:flex-wrap ${
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
                        className="w-2 h-2 bg-accent rounded-full"
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
                      <span className="text-secondary">
                        No episode in season {clickedSeasonNum}
                      </span>
                    ) : (
                      season?.episodes?.map((e) => (
                        <span
                          onClick={() =>
                            handleEpisodeClick(
                              clickedSeasonNum,
                              e.episode_number,
                              season.id,
                              e.id
                            )
                          }
                          className={`cursor-pointer hover:bg-gray-500/30 rounded p-1 px-2 text-gray-200 ${
                            nowPlayingENum === e.episode_number &&
                            nowPlayingEId === e.id &&
                            nowPlayingSId === season.id
                              ? 'bg-teal-600'
                              : ''
                          }`}
                          key={e.episode_number}
                        >
                          {`E${e.episode_number}`}
                        </span>
                      ))
                    )}
                  </>
                )}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterSeason;
