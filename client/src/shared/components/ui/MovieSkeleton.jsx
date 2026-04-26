const SkeletonBlock = ({ className = '' }) => (
  <div className={`skeleton-shimmer ${className}`}></div>
);

const MovieSkeleton = () => {
  return (
    <>
      {/* Filter Bar Skeleton */}
      <div className="m-2 md:mx-4 mb-4">
        <div className="flex flex-wrap gap-2 items-center">
          <SkeletonBlock className="h-9 w-24 rounded-xl" />
          <SkeletonBlock className="h-9 w-28 rounded-xl" />
          <SkeletonBlock className="h-9 w-32 rounded-xl" />
          <SkeletonBlock className="h-9 w-20 rounded-xl" />
          <SkeletonBlock className="h-9 w-36 rounded-xl" />
        </div>
      </div>

      {/* Movie Grid Skeleton */}
      <div className="movies">
        <div
          className="movie-wrapper movies-grid grid gap-1 lg:gap-2 m-2 xl:m-4
        grid-cols-[repeat(auto-fill,minmax(110px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(120px,1fr))]
        md:grid-cols-[repeat(auto-fill,minmax(130px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]
        xl:grid-cols-[repeat(auto-fill,minmax(170px,1fr))]"
        >
          {Array.from({ length: 18 }).map((_, index) => (
            <div key={index} className="space-y-1">
              <SkeletonBlock className="aspect-[2/3] w-full rounded-xl" />
              <SkeletonBlock className="h-5 w-3/4 rounded-full mx-1" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MovieSkeleton;
