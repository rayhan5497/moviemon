import { useMovieAction } from '@/features/user/hooks/useMovieActions';
import { useUserMovies } from '@/features/user/hooks/useUserMovies';
import MovieCard from '@/components/cards/MovieCard';

export default function SaveableMovieCard({ media }) {
  const mutation = useMovieAction();
  const { savedIds = [], watchLaterIds = [] } = useUserMovies();

  const isSaved = savedIds.includes(media.id);
  const isWatchLater = watchLaterIds.includes(media.id);

  const handleSave = () => {
    const mediaType = media?.title ? 'movie' : media?.name ? 'tv' : 'movie';
    mutation.mutate({
      movieId: media.id,
      actionType: 'saved',
      state: !isSaved,
      mediaType,
    });
  };

  const handleWatchLater = () => {
    const mediaType = media?.title ? 'movie' : media?.name ? 'tv' : 'movie';
    mutation.mutate({
      movieId: media.id,
      actionType: 'watchLater',
      state: !isWatchLater,
      mediaType,
    });
  };

  return (
    <MovieCard
      media={{
        ...media,
        saved: isSaved,
        watchLater: isWatchLater,
      }}
      onSave={handleSave}
      onWatchLater={handleWatchLater}
    />
  );
}
