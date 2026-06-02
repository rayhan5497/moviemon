import { useState, useEffect, useContext, useRef } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import NowPlayingContext from '@/shared/context/NowPlayingContext';
import { useMovies } from '@/shared/hooks/useMovies';
import { saveWatchProgress, getWatchProgress } from '../utils/watchHistory';

export const useMediaSelection = (tv) => {
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

  // Return values and handlers exposed to components
  return {
    nowPlayingSNum,
    nowPlayingENum,
    nowPlayingSId,
    nowPlayingEId,
    clickedSeasonNum,
    season,
    isLoading,
    handleSeasonClick,
    handleEpisodeClick,
  };
};
