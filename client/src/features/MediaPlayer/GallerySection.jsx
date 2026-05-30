import { useState, useMemo, useEffect, useRef, memo } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useIsMd } from '@/shared/hooks/useIsMd';
import { Images } from 'lucide-react';
import HorizontalCardCarousel from '@/shared/components/sections/HorizontalCardCarousel';
import BackdropCard from './components/BackdropCard';

const TMDB_BASE_URL = 'https://image.tmdb.org/t/p/';

const BackdropGalleryWrapper = ({ backdrops = [] }) => {
  const isMd = useIsMd();
  const THUMB_SIZE = isMd ? 'w1280' : 'w780';
  // 1. CHUNKING PAGINATION STATE (20 items initially)
  const [visibleCount, setVisibleCount] = useState(20);
  const [activeIndex, setActiveIndex] = useState(null);

  const slicedBackdrops = useMemo(
    () => backdrops.slice(0, visibleCount),
    [backdrops, visibleCount]
  );

  // 2. DETECT SCROLL TO END (For loading the next batch of 20)
  const handleWrapperScroll = (e) => {
    const target = e.target;
    // Check if the scroll target is our horizontal track element
    if (target.classList.contains('movies-grid')) {
      const { scrollLeft, scrollWidth, clientWidth } = target;
      if (scrollWidth - scrollLeft - clientWidth < 300) {
        if (visibleCount < backdrops.length) {
          setVisibleCount((prev) => Math.min(prev + 20, backdrops.length));
        }
      }
    }
  };

  // Attach a captured event listener to catch scroll events bubbling up from the carousel inner track
  const containerRef = useRef(null);
  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener('scroll', handleWrapperScroll, true);
      return () => el.removeEventListener('scroll', handleWrapperScroll, true);
    }
  }, [visibleCount, backdrops.length]);

  // 3. LIGHTBOX MODAL NAVIGATION MECHANICS
  const showPrev = (e) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : backdrops.length - 1));
  };

  const showNext = (e) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev < backdrops.length - 1 ? prev + 1 : 0));
  };

  // Keyboard Event Bindings
  useEffect(() => {
    if (activeIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'Escape') setActiveIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  // 4. HARDWARE ACCELERATED TOUCH SWIPING
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches.clientX;
  };
  const handleTouchMove = (e) => {
    touchEndX.current = e.changedTouches.clientX;
  };
  const handleTouchEnd = () => {
    const diffX = touchStartX.current - touchEndX.current;
    if (Math.abs(diffX) > 50) {
      diffX > 0 ? showNext() : showPrev();
    }
  };

  // Custom component proxy wrapper injection payload
  const CustomCardComponent = useMemo(() => {
    return ({ media }) => {
      // Find matching item index reference inside our master immutable array
      const globalIndex = backdrops.findIndex(
        (b) => b.file_path === media.file_path
      );
      return (
        <BackdropCard
          media={media}
          onClick={() => setActiveIndex(globalIndex)}
        />
      );
    };
  }, [backdrops]);

  const [imgLoaded, setImgLoaded] = useState(false);
  useEffect(() => {
    setImgLoaded(false);
  }, [activeIndex]);

  return (
    <div ref={containerRef} className="w-full">
      <HorizontalCardCarousel
        title="Gallery"
        media={slicedBackdrops}
        type="images"
        CardComponent={CustomCardComponent}
        cardSize={{ smWidth: 210, mdWidth: 340 }}
        Icon={Images}
        componentClassName="md:mr-4"
      />

      {/* LIGHTBOX FULLSCREEN OVERLAY COMPONENT */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm select-none"
          onClick={() => setActiveIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close button frame */}
          <button
            onClick={() => setActiveIndex(null)}
            className="absolute cursor-pointer top-4 right-4 z-50 rounded-full bg-zinc-900/80 p-3 text-white border border-zinc-700 hover:bg-zinc-800 transition-colors"
          >
            <X className="text-gray-200" />
          </button>

          {/* Nav Controls Left */}
          <button
            onClick={showPrev}
            className="absolute cursor-pointer left-4 z-50 hidden md:flex items-center justify-center rounded-full bg-zinc-900/80 p-4 text-white border border-zinc-700 hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft className="text-white" />
          </button>

          {/* Stage Viewport */}
          <div
            className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              key={backdrops[activeIndex].file_path}
              decoding="async"
              src={`${TMDB_BASE_URL}${THUMB_SIZE}${backdrops[activeIndex].file_path}`}
              alt="Fullscreen Viewport Asset Layout"
              className={`max-w-full max-h-[80vh] rounded-lg shadow-white object-contain shadow-[0_0_10px_5px]/30 pointer-events-none transition-opacity duration-1000 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(true)}
            />
            {!imgLoaded && (
              <div className="!absolute inset-0 skeleton-shimmer rounded-lg"></div>
            )}
            <div className="absolute w-max -bottom-8 left-1/2 -translate-x-1/2 text-zinc-400 text-sm font-medium">
              {activeIndex + 1} / {backdrops.length}
            </div>
          </div>

          {/* Nav Controls Right */}
          <button
            onClick={showNext}
            className="absolute cursor-pointer right-4 z-50 hidden md:flex items-center justify-center rounded-full bg-zinc-900/80 p-4 text-white border border-zinc-700 hover:bg-zinc-800 transition-colors"
          >
            <ChevronRight className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(BackdropGalleryWrapper);
