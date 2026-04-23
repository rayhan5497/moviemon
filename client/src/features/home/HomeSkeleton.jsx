const SkeletonBlock = ({ className = '' }) => (
  <div className={`skeleton-shimmer ${className}`}></div>
);

const SkeletonCards = Array.from({ length: 8 });

const HomeSkeleton = () => {
  return (
    <div className="pb-2">
      <section className="m-2 md:m-4 rounded-3xl overflow-hidden bg-secondary md:h-[50vh] h-[40vh] relative">
        <SkeletonBlock className="absolute inset-0 rounded-none opacity-50" />
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative h-full flex items-center justify-between gap-6 p-5 md:p-8 lg:p-12">
          <div className="flex items-center gap-4 md:gap-6 w-full">
            <SkeletonBlock className="aspect-[2/3] w-24 sm:w-30 md:w-40 lg:w-48 shrink-0 rounded-2xl" />

            <div className="flex-1 space-y-3 md:space-y-5">
              <SkeletonBlock className="h-5 sm:h-6 md:h-8 lg:h-12 w-2/3" />
              <SkeletonBlock className="hidden sm:block h-4 md:h-5 w-5/6 rounded-full" />
              <SkeletonBlock className="hidden md:block h-4 md:h-5 w-4/6 rounded-full" />
              <SkeletonBlock className="h-10 w-10 sm:h-12 sm:w-12 rounded-full mt-2" />
            </div>
          </div>

          <div className="hidden lg:flex items-center w-72 xl:w-80 h-full">
            <SkeletonBlock className="w-full h-30 rounded-3xl" />
          </div>
        </div>
      </section>

      {['Trending Now', 'Most Popular'].map((title) => (
        <section key={title} className="m-2 md:m-4">
          <div className="flex justify-between items-center mb-3 mt-6">
            <SkeletonBlock className="h-7 md:h-9 w-40 md:w-52 rounded-full" />
            <SkeletonBlock className="h-5 md:h-6 w-16 rounded-full" />
          </div>

          <div className="grid grid-flow-col auto-cols-[110px] sm:auto-cols-[120px] md:auto-cols-[140px] gap-2 overflow-hidden">
            {SkeletonCards.map((_, index) => (
              <div key={`${title}-${index}`} className="space-y-2">
                <SkeletonBlock className="aspect-[2/3] w-full rounded-2xl" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default HomeSkeleton;
