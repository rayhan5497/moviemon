import { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause } from 'lucide-react';
import AudioVisualizer from './AudioVisualizer';
import NowPlayingContext from '@/shared/context/NowPlayingContext';

const CurrentlyPlayingBadge = ({ nowPlayingSNum, nowPlayingENum }) => {
  const { isPlaying } = useContext(NowPlayingContext);

  // Pad numbers with leading zeros (e.g., S01 E05)
  const paddedSeason = String(nowPlayingSNum).padStart(2, '0');
  const paddedEpisode = String(nowPlayingENum).padStart(2, '0');

  return (
    <div className="inline-flex items-center gap-3 bg-slate-900/20 backdrop-blur-md border border-teal-500/20 px-4 py-2 rounded-full shadow-lg shadow-teal-950/20 w-fit select-none">
      {/* Active Live Indicator Block */}
      {isPlaying ? (
        <AudioVisualizer className="relative left-0 translate-0" />
      ) : (
        <Pause className="opacity-50 w-4" />
      )}

      {/* Main Metadata Text String */}
      <div className="flex items-center gap-1.5 text-sm font-medium tracking-wide text-slate-200">
        <span className="text-slate-300 font-normal text-[0.8rem] tracking-wider uppercase mr-1">
          Currently Playing:
        </span>

        {/* Season Indicator Segment */}
        <span className="text-teal-400 font-bold">S</span>
        <div className="relative overflow-hidden h-[20px] min-w-[18px] flex justify-center items-center">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={`season-${nowPlayingSNum}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute font-semibold tabular-nums"
            >
              {paddedSeason}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Divider dot */}
        <span className="text-slate-400 mx-0.5">•</span>

        {/* Episode Indicator Segment */}
        <span className="text-teal-400 font-bold">E</span>
        <div className="relative overflow-hidden h-[20px] min-w-[18px] flex justify-center items-center">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={`episode-${nowPlayingENum}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute font-semibold tabular-nums"
            >
              {paddedEpisode}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CurrentlyPlayingBadge;
