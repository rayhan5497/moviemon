// features/user/hooks/useSaveControls.js
import { useMovieAction } from './useMovieActions';
import { useUserMovies } from './useUserMovies';

export function useSaveControls(media) {
  const mutation = useMovieAction();
  const { savedIds = [], watchLaterIds = [] } = useUserMovies();

  const isSaved = savedIds.includes(media?.id);
  const isWatchLater = watchLaterIds.includes(media?.id);

  const mediaType = media?.title ? 'movie' : 'tv';

  const toggleSave = () => {
    mutation.mutate({
      movieId: media.id,
      actionType: 'saved',
      state: !isSaved,
      mediaType,
    });
  };

  const toggleWatchLater = () => {
    mutation.mutate({
      movieId: media.id,
      actionType: 'watchLater',
      state: !isWatchLater,
      mediaType,
    });
  };

  return {
    isSaved,
    isWatchLater,
    toggleSave,
    toggleWatchLater,
  };
}
