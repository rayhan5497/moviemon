const SkeletonBlock = ({ className = '' }) => (
  <div className={`skeleton-shimmer ${className}`}></div>
);

const MediaPlayerSkeleton = () => {
  return (
    <div className="movies md:flex md:flex-col w-full">
      <div className="movie-wrapper md:flex md:flex-col md:w-full text-white max-w-screen-2xl self-center">
        {/* Player Section Skeleton */}
        <div
          id="playerWrapper"
          className="player-wrapper md:flex md:h-[70vh] md:w-full"
        >
          <SkeletonBlock className="w-full aspect-video md:h-full" />
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex details-container relative gap-4 flex-col m-2 my-5">
          <div className="main-details items-center flex gap-4">
            {/* Poster Skeleton */}
            <SkeletonBlock className="self-baseline w-full h-max lg:max-w-60 sm:max-w-40 relative rounded-lg min-w-0 flex-shrink aspect-[2/3]" />

            <div className="heading-and-details self-start flex flex-col gap-3 flex-1">
              {/* Heading Section Skeleton */}
              <div className="space-y-3">
                <SkeletonBlock className="h-10 w-3/4 rounded-full" />
                <SkeletonBlock className="h-4 w-2/5 rounded-full" />
              </div>

              {/* Details Section Skeleton */}
              <div className="space-y-2 mt-4">
                <SkeletonBlock className="h-4 w-full rounded-full" />
                <SkeletonBlock className="h-4 w-full rounded-full" />
                <SkeletonBlock className="h-4 w-5/6 rounded-full" />
                <SkeletonBlock className="h-4 w-4/6 rounded-full" />
                <div className="flex flex-col mt-6 gap-3">
                  <SkeletonBlock className="h-4 w-4/16 rounded-full" />
                  <SkeletonBlock className="h-4 w-5/17 rounded-full" />
                  <SkeletonBlock className="h-4 w-3/15 rounded-full" />
                </div>
              </div>
            </div>

            {/* Highlight Section Skeleton */}
            <SkeletonBlock className="lg:w-60 sm:w-40 h-30 rounded-2xl flex-shrink-0" />
          </div>

          <div className="relevant-details m-2 mt-6 space-y-8">
            {/* Cast Section Skeleton */}
            <div>
              <SkeletonBlock className="h-7 w-32 rounded-full mb-4" />
              <div className="grid grid-flow-col auto-cols-[110px] gap-3 overflow-hidden">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <SkeletonBlock className="aspect-square w-full rounded-full" />
                    <SkeletonBlock className="h-4 w-full rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Similar & Recommendations Skeleton */}
            <div>
              <SkeletonBlock className="h-7 w-48 rounded-full mb-4" />
              <div className="grid grid-flow-col auto-cols-[140px] gap-2 overflow-hidden">
                {Array.from({ length: 7 }).map((_, i) => (
                  <SkeletonBlock
                    key={i}
                    className="aspect-[2/3] w-full rounded-2xl"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden details-container relative gap-4 flex flex-col mx-2 mt-4">
          {/* Heading Section Skeleton Mobile */}
          <div className="space-y-3 mb-2">
            <SkeletonBlock className="h-8 w-2/5 rounded-full" />
            <SkeletonBlock className="h-5 w-5/5 rounded-full" />
          </div>

          {/* Season Filter Skeleton */}
          <SkeletonBlock className="h-10 w-full rounded-xl" />
          <SkeletonBlock className="h-10 w-full rounded-xl mb-3" />

          {/* Poster + Highlight Row */}
          <div className="poster-and-highlight flex gap-2 min-w-0 mb-4">
            <SkeletonBlock className="w-full max-w-40 min-w-0 flex-shrink rounded-lg aspect-[2/3]" />

            <div className="flex flex-1 justify-center items-center">
              <SkeletonBlock className="h-25 w-full max-w-40 rounded-xl" />
            </div>
          </div>

          {/* Details Section Skeleton Mobile */}
          <div className="space-y-2 mb-6">
            <SkeletonBlock className="h-4 w-full rounded-full" />
            <SkeletonBlock className="h-4 w-full rounded-full" />
            <SkeletonBlock className="h-4 w-5/6 rounded-full" />
            <SkeletonBlock className="h-4 w-4/6 rounded-full" />
          </div>

          <div className="relevant-details m-2 space-y-6">
            {/* Cast Section Skeleton Mobile */}
            <div>
              <SkeletonBlock className="h-6 w-28 rounded-full mb-3" />
              <div className="grid grid-flow-col auto-cols-[90px] gap-2 overflow-hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <SkeletonBlock className="aspect-square w-full rounded-full" />
                    <SkeletonBlock className="h-3 w-full rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Similar & Recommendations Skeleton Mobile */}
            <div>
              <SkeletonBlock className="h-6 w-40 rounded-full mb-3" />
              <div className="grid grid-flow-col auto-cols-[110px] gap-2 overflow-hidden">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonBlock
                    key={i}
                    className="aspect-[2/3] w-full rounded-xl"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPlayerSkeleton;
