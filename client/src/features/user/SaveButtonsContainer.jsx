import SaveButtons from '@/shared/components/ui/SaveButtons';
import { useSaveControls } from '@/features/user/hooks/useSaveControls';

export default function SaveButtonsContainer({ media, classNames }) {
  const { isSaved, isWatchLater, toggleSave, toggleWatchLater } =
    useSaveControls(media);
  return (
    <SaveButtons
      isSaved={isSaved}
      isWatchLater={isWatchLater}
      onSave={toggleSave}
      onWatchLater={toggleWatchLater}
      classNames={classNames}
    />
  );
}
