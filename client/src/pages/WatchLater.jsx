import { useEffect, useMemo, useState } from 'react';
import loadingSpinner from '@/shared/assets/animated-icon/loading-spinner.lottie';

import FilterLibraryMedia from '@/shared/components/filters/library/FilterLibraryMedia';
import Message from '@/shared/components/ui/Message';
import { useUserMovies } from '../features/user/hooks/useUserMovies';
import { useMediaByIds } from '@/shared/hooks/useMediaByIds';
import { useIsLg } from '@/shared/hooks/useIsLg';
import SaveableMovieCard from '@/widgets/SaveableMovieCard';
import InfiniteMovieGrid from '../shared/components/sections/infiniteMovieGrid';

const WatchLater = () => {
  const { watchLaterByType, isLoggedIn } = useUserMovies();
  const [selectedMedia, setSelectedMedia] = useState('movie');
  const isLg = useIsLg();

  useEffect(() => {
    document.title = 'Watch Later - Moviemon';
  }, []);

  const ids = useMemo(() => {
    if (!isLoggedIn) return [];
    return selectedMedia === 'tv'
      ? watchLaterByType?.tv || []
      : watchLaterByType?.movies || [];
  }, [isLoggedIn, watchLaterByType, selectedMedia]);

  const { data, isLoading } = useMediaByIds(ids, {
    enabled: isLoggedIn && ids.length > 0,
    mediaType: selectedMedia,
  });

  return (
    <>
      <h1 className="heading inset-0 text-2xl md:text-3xl font-bold text-accent p-2 md:px-4">
        Watch Later
      </h1>

      {isLoggedIn && (
        <FilterLibraryMedia
          selectedMedia={selectedMedia}
          onMediaChange={(e) => setSelectedMedia(e.target.value)}
        />
      )}
      <div
        className={`movies md:flex md:flex-col mt-0 ${!isLg ? 'm-2' : 'm-5'}`}
      >
        {isLoggedIn ? (
          <>
            {isLoading && (
              <Message
                lottie={loadingSpinner}
                message="Loading Watch Later"
                className="w-[1.4em]"
              />
            )}

            {!isLoading && data.length === 0 && (
              <Message message="No watch later items yet" />
            )}

            <InfiniteMovieGrid
              data={data}
              renderItem={(media) => (
                <SaveableMovieCard key={media.id} media={media} />
              )}
            />
          </>
        ) : (
          <Message icon="🚫" message="You need to login to use this feature" />
        )}
      </div>
    </>
  );
};

export default WatchLater;
