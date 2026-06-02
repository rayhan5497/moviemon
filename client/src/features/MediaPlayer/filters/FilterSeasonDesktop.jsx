import { motion, AnimatePresence } from 'framer-motion';

import { ChevronLeft } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

import { useState } from 'react';

import NowPlayingContext from '@/shared/context/NowPlayingContext';
import { useMediaSelection } from '@/features/MediaPlayer/hooks/useMediaSelection';
import CurrentlyPlayingBadge from '@/features/MediaPlayer/components/CurrentlyPlayingBadge';
import AudioVisualizer from '@/features/MediaPlayer/components/AudioVisualizer';

const FilterSeason = ({ tv }) => {
  const [filterVisibility, setFilterVisibility] = useState(true);

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
            <div className="badge-container w-full flex justify-center">
              <CurrentlyPlayingBadge
                nowPlayingSNum={nowPlayingSNum}
                nowPlayingENum={nowPlayingENum}
              />
            </div>
            <span className="nowPlaying bg-teal-600 flex items-center p-2 gap-1 border-t-1 w-full justify-center rounded text-white">
              Season
            </span>
            <div className="season-wrapper gap-2 flex overflow-auto md:flex-wrap">
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
            </div>
          </div>
          <div className="episode-section flex items-center gap-1 md:flex-wrap">
            <span className="nowPlaying bg-teal-600 flex items-center p-2 gap-1 border-t-1 w-full justify-center rounded text-white">
              Episode
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
                        key={`loading-dot-${i}`}
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
      )}
    </>
  );
};

export default FilterSeason;
