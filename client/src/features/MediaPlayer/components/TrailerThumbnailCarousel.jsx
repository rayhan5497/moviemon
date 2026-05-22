import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TrailerThumbnailCarousel({
  videos,
  selectedIndex,
  onSelect,
  carouselRef,
  onScrollLeft,
  onScrollRight,
}) {
  if (!videos.length) return null;

  return (
    <div className="relative">
      {/* Left scroll button */}
      <button
        onClick={onScrollLeft}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 p-2 rounded-full cursor-pointer"
        aria-label="Scroll carousel left"
      >
        <ChevronLeft className="text-white" />
      </button>

      {/* Right scroll button */}
      <button
        onClick={onScrollRight}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 p-2 rounded-full cursor-pointer"
        aria-label="Scroll carousel right"
      >
        <ChevronRight className="text-white" />
      </button>

      {/* Thumbnails */}
      <div
        ref={carouselRef}
        className="no-scrollbar flex gap-3 overflow-x-auto px-12 py-4"
        style={{ cursor: 'grab', scrollBehavior: 'smooth' }}
      >
        {videos.map((video, index) => (
          <button
            key={video.id || video.key}
            onClick={() => onSelect(index)}
            className={`relative w-36 sm:w-50 md:w-auto max-w-60 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
              selectedIndex === index
                ? 'border-cyan-400 scale-[1.02]'
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
            aria-label={`Select ${video.name || 'trailer'}`}
          >
            <img
              src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
              alt={video.name}
              className="w-full aspect-video object-cover"
            />

            {/* Play icon overlay */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="bg-black/70 rounded-full p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {/* Gradient + title label */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
              <p className="text-white text-xs line-clamp-2">{video.name}</p>
            </div>

            {/* spoiler alert */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent p-2">
              {video?.type.toLowerCase() === 'clip' && (
                <p className="text-red-500 text-xs font-bold line-clamp-2">
                  May contain spoiler
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
