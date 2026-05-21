import MovieCardShell from '@/shared/components/cards/MovieCardShell';
import SaveButtonsContainer from '@/features/user/SaveButtonsContainer';
import { useSaveControls } from '@/features/user/hooks/useSaveControls';

export default function MovieCard({ media, ratingSource }) {
  const { isSaved, isWatchLater, toggleSave, toggleWatchLater } =
    useSaveControls(media);

  const saveButtonsContainer = (
    <SaveButtonsContainer
      media={media}
      isSaved={isSaved}
      isWatchLater={isWatchLater}
      onSave={toggleSave}
      onWatchLater={toggleWatchLater}
    />
  );

  return (
    <MovieCardShell
      media={media}
      saveButtons={saveButtonsContainer}
      ratingSource={ratingSource}
    />
  );
}
