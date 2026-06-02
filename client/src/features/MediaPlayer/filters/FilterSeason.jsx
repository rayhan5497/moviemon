import { motion, AnimatePresence } from 'framer-motion';

import NowPlayingContext from '@/shared/context/NowPlayingContext';

import { useMediaSelection } from '@/features/MediaPlayer/hooks/useMediaSelection';
import CurrentlyPlayingBadge from '@/features/MediaPlayer/components/CurrentlyPlayingBadge';
import AudioVisualizer from '@/features/MediaPlayer/components/AudioVisualizer';
const FilterSeason = ({ tv }) => {
  const {
    nowPlayingSNum,
    nowPlayingENum,
    nowPlayingSId,
    nowPlayingEId,
    clickedSeasonNum,
    season,
    isLoading,
    handleSeasonClick,
    handleEpisodeClick,
  } = useMediaSelection(tv);

  return (
    <div id="filterSeason" className="season-and-episode-wrapper flex flex-col">
      <div className="season-section flex flex-col items-center gap-1">
        <div className="badge-container w-full flex justify-start">
          <CurrentlyPlayingBadge
            nowPlayingSNum={nowPlayingSNum}
            nowPlayingENum={nowPlayingENum}
          />
        </div>
        <div className="flex w-full">
          <span className="nowPlaying bg-black/20 flex items-center p-2 gap-1 shadow-[1px_0_1px] rounded-tr-[5px] rounded-br-[20px] border-r-1">
            Season
          </span>
          <span className="season-wrapper gap-2 h-fit flex overflow-auto">
            {tv.seasons
              ?.filter((s) => s.season_number !== 0)
              .map((s) => (
                <span
                  key={s.season_number}
                  onClick={() => handleSeasonClick(s.season_number)}
                  className={`cursor-pointer inline-block relative hover:bg-gray-700 rounded p-1 px-2 text-gray-200 ${
                    clickedSeasonNum === s.season_number ? 'bg-teal-600' : ''
                  } ${
                    nowPlayingSNum === s.season_number ? 'font-semibold' : ''
                  }`}
                >
                  {nowPlayingSNum === s.season_number && <AudioVisualizer />}
                  {`S${s.season_number}`}
                </span>
              ))}
          </span>
        </div>
      </div>
      <div className="episode-section flex items-center gap-1">
        <span className="nowPlaying bg-black/20 flex items-center p-2 gap-1 shadow-[1px_0_1px] rounded-tr-[5px] rounded-br-[20px] border-r-1">
          Episode
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
                    key={`loading-dot-${i}`}
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
                      className={`cursor-pointer relative hover:bg-gray-500/30 rounded p-1 px-2 text-gray-200 ${
                        nowPlayingENum === e.episode_number &&
                        nowPlayingEId === e.id &&
                        nowPlayingSId === season.id
                          ? 'bg-teal-600'
                          : ''
                      } ${
                        nowPlayingENum === e.episode_number
                          ? 'font-semibold'
                          : ''
                      }`}
                      key={e.episode_number}
                    >
                      {nowPlayingENum === e.episode_number && (
                        <AudioVisualizer />
                      )}
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
  );
};

export default FilterSeason;
