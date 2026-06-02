import { useId, useContext } from 'react';
import { mergeClass } from '@shared/utils/mergeClass';
import NowPlayingContext from '@/shared/context/NowPlayingContext';

const AudioVisualizer = ({ className = '' }) => {
  const { isPlaying } = useContext(NowPlayingContext);

  // Generate a unique ID so the scoped CSS animation doesn't conflict if rendered multiple visualizers on the same page.
  const uniqueId = useId().replace(/:/g, '');

  const barClass = `equalizer-bar-${uniqueId}`;
  const pausedClass = `visualizer-paused-${uniqueId}`;

  return (
    <div
      className={mergeClass(
        'absolute bottom-0 left-1/2 -translate-x-1/2 flex items-end justify-center gap-[3px] h-3 w-5 pointer-events-none',
        className
      )}
    >
      <style>{`
        /* 1. This handles the up-and-down bounce */
        @keyframes audioWave-${uniqueId} {
          0%, 100% { height: 25%; }
          50% { height: 100%; }
        }

        /* 2. This handles the active, smooth color morphing */
        @keyframes activeColorShift-${uniqueId} {
          0%   { background-color: #2dd4bf; } /* Teal */
          25%  { background-color: #3b82f6; } /* Blue */
          50%  { background-color: #8b5cf6; } /* Violet */
          75%  { background-color: #00c700; } /* Green */
          100% { background-color: #2dd4bf; } /* Loop back to Teal */
        }

        .${barClass} {
          width: 3px;
          border-radius: 9999px;
          /* Combine both animations: bounce and color morph */
          animation: 
            audioWave-${uniqueId} 1s ease-in-out infinite,
            activeColorShift-${uniqueId} 4s linear infinite;
        }

        /* Controls the play state based on context */
        .${pausedClass} {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* Bar 1 */}
      <span
        className={`${barClass} ${!isPlaying ? pausedClass : ''}`}
        style={{
          animationDelay: '-0.2s, -0.0s', // Staggered delays for bounce and color
          animationDuration: '0.8s, 5s', // Different durations keep the wave organic
        }}
      />

      {/* Bar 2 */}
      <span
        className={`${barClass} ${!isPlaying ? pausedClass : ''}`}
        style={{
          animationDelay: '-0.4s, -1.5s',
          animationDuration: '1.2s, 4s',
        }}
      />

      {/* Bar 3 */}
      <span
        className={`${barClass} ${!isPlaying ? pausedClass : ''}`}
        style={{
          animationDelay: '-0.6s, -3.0s',
          animationDuration: '0.9s, 6s',
        }}
      />

      {/* Bar 4 */}
      <span
        className={`${barClass} ${!isPlaying ? pausedClass : ''}`}
        style={{
          animationDelay: '-0.8s, -4.5s',
          animationDuration: '1s, 3s',
        }}
      />
    </div>
  );
};

export default AudioVisualizer;
