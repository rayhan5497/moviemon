import { useEffect, useMemo } from 'react';
import loadingSpinner from '@/shared/assets/animated-icon/loading-spinner.lottie';

import HorizontalCardCarousel from '@/shared/components/sections/HorizontalCardCarousel';
import SaveableMovieCard from '@/widgets/SaveableMovieCard';
import Message from '@/shared/components/ui/Message';
import { useIsLg } from '@/shared/hooks/useIsLg';
import { useUserMovies } from '../features/user/hooks/useUserMovies';
import { useMediaByIds } from '@/shared/hooks/useMediaByIds';

const Section = ({
  title,
  items,
  isLoading,
  emptyMessage,
  loadingMessage,
  route,
  CardComponent,
}) => (
  <div className="mb-6">
    <HorizontalCardCarousel
      media={items}
      title={title}
      route={items.length ? route : null}
      CardComponent={CardComponent}
    />
    {isLoading && (
      <Message
        lottie={loadingSpinner}
        message={loadingMessage}
        className="w-[1.4em]"
      />
    )}
    {!isLoading && items.length === 0 && <Message message={emptyMessage} />}
  </div>
);

const User = () => {
  const {
    savedIds,
    savedByType,
    watchLaterIds,
    watchLaterByType,
    watchHistory,
    isLoggedIn,
  } = useUserMovies();

  useEffect(() => {
    document.title = 'Saved - Moviemon';
  }, []);

  const savedList = useMemo(() => [...new Set(savedIds)], [savedIds]);
  const watchLaterList = useMemo(
    () => [...new Set(watchLaterIds)],
    [watchLaterIds]
  );

  const historyTypeById = useMemo(() => {
    const map = new Map();
    (watchHistory || []).forEach((item) => {
      if (!item) return;
      const id = Number(item.mediaId);
      if (!Number.isFinite(id)) return;
      if (item.mediaType === 'movie' || item.mediaType === 'tv') {
        map.set(id, item.mediaType);
      }
    });
    return map;
  }, [watchHistory]);

  const historyList = useMemo(() => {
    if (!isLoggedIn) return [];
    const ids = (watchHistory || [])
      .slice()
      .sort((a, b) => (b?.timestamp || 0) - (a?.timestamp || 0))
      .map((item) => item?.mediaId)
      .filter((id) => Number.isFinite(id));
    return [...new Set(ids)];
  }, [watchHistory, isLoggedIn]);

  const savedTypeById = useMemo(() => {
    const map = new Map();
    (savedByType?.movies || []).forEach((id) => map.set(id, 'movie'));
    (savedByType?.tv || []).forEach((id) => map.set(id, 'tv'));
    return map;
  }, [savedByType]);

  const watchLaterTypeById = useMemo(() => {
    const map = new Map();
    (watchLaterByType?.movies || []).forEach((id) => map.set(id, 'movie'));
    (watchLaterByType?.tv || []).forEach((id) => map.set(id, 'tv'));
    return map;
  }, [watchLaterByType]);

  const savedQuery = useMediaByIds(savedList, {
    enabled: isLoggedIn && savedList.length > 0,
    typeById: savedTypeById,
  });
  const watchLaterQuery = useMediaByIds(watchLaterList, {
    enabled: isLoggedIn && watchLaterList.length > 0,
    typeById: watchLaterTypeById,
  });
  const historyQuery = useMediaByIds(historyList, {
    enabled: isLoggedIn && historyList.length > 0,
    typeById: historyTypeById,
  });

  const isLg = useIsLg();
  return (
    <div className={`movies md:flex md:flex-col ${!isLg ? 'm-2' : 'm-5'}`}>
      <h1 className="heading inset-0 mb-2 text-2xl md:text-3xl font-bold text-accent">
        Your Library
      </h1>

      {isLoggedIn ? (
        <>
          <Section
            route="/user/saved"
            title="Saved"
            items={savedQuery.data}
            isLoading={savedQuery.isLoading}
            loadingMessage="Loading Saved Movies"
            emptyMessage={
              isLoggedIn ? 'No items saved yet' : ''
            }
            CardComponent={SaveableMovieCard}
          />

          <Section
            route="/user/watch-later"
            title="Watch Later"
            items={watchLaterQuery.data}
            isLoading={watchLaterQuery.isLoading}
            loadingMessage="Loading Watch Later"
            emptyMessage={
              isLoggedIn
                ? 'No watch later items yet'
                : ''
            }
            CardComponent={SaveableMovieCard}
          />

          <Section
            route="/user/watch-history"
            title="Watch History"
            items={historyQuery.data}
            isLoading={historyQuery.isLoading}
            loadingMessage="Loading Watch History"
            emptyMessage={
              isLoggedIn ? 'No watch history yet' : ''
            }
            CardComponent={SaveableMovieCard}
          />
        </>
      ) : (
        <Message icon="🚫" message="You need to login to use this feature" />
      )}
    </div>
  );
};

export default User;

