import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TrailerPlayer({ video, showNav, onPrev, onNext }) {
  return (
    <div className="relative w-full h-[50dvh] aspect-video bg-black">
      <iframe
        key={video?.key}
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${video?.key}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
        title={video?.name}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />

      {showNav && (
        <>
          <button
            onClick={onPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full cursor-pointer"
            aria-label="Previous trailer"
          >
            <ChevronLeft className="text-white" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full cursor-pointer"
            aria-label="Next trailer"
          >
            <ChevronRight className="text-white" />
          </button>
        </>
      )}
    </div>
  );
}
