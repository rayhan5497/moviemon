import { useEffect, useMemo, useState } from 'react';
import loadingSpinner from '@/assets/animated-icon/loading-spinner.lottie';

import FilterLibraryMedia from '../components/filters/library/FilterLibraryMedia';
import Message from '../components/ui/Message';
import { useUserMovies } from '../features/user/hooks/useUserMovies';
import { useMediaByIds } from '../hooks/useMediaByIds';
import { useIsLg } from '../hooks/useIsLg';
import SaveableMovieCard from '../composed/SaveableMovieCard';

const WatchHistory = () => {
  const { watchHistory, isLoggedIn } = useUserMovies();
  const [selectedMedia, setSelectedMedia] = useState('movie');
  const isLg = useIsLg();

  useEffect(() => {
    document.title = 'Watch History - Moviemon';
  }, []);

  const ids = useMemo(() => {
    if (!isLoggedIn) return [];
    const items = (watchHistory || [])
      .filter((item) => item?.mediaType === selectedMedia)
      .sort((a, b) => (b?.timestamp || 0) - (a?.timestamp || 0));
    const list = [];
    const seen = new Set();
    items.forEach((item) => {
      const id = Number(item?.mediaId);
      if (!Number.isFinite(id) || seen.has(id)) return;
      seen.add(id);
      list.push(id);
    });
    return list;
  }, [isLoggedIn, watchHistory, selectedMedia]);

  const { data, isLoading } = useMediaByIds(ids, {
    enabled: isLoggedIn && ids.length > 0,
    mediaType: selectedMedia,
  });

  return (
    <>
      <h1 className="heading inset-0 text-2xl md:text-3xl font-bold text-accent p-2 md:px-4">
        Watch History
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
                message="Loading Watch History"
                className="w-[1.4em]"
              />
            )}

            {!isLoading && data.length === 0 && (
              <Message message="No watch history yet" />
            )}

            <div
              className="movie-wrapper movies-grid grid gap-1 lg:gap-2 mt-2
            grid-cols-[repeat(auto-fill,minmax(110px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(120px,1fr))]
            md:grid-cols-[repeat(auto-fill,minmax(130px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]
            xl:grid-cols-[repeat(auto-fill,minmax(170px,1fr))]"
            >
              {data.map((media) => (
                <SaveableMovieCard key={media.id} media={media} />
              ))}
            </div>
          </>
        ) : (
          <Message icon="🚫" message="You need to login to use this feature" />
        )}
      </div>
    </>
  );
};

export default WatchHistory;
