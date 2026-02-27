import { useMutation, useQueryClient } from '@tanstack/react-query';
import { movieActionApi } from '../api/movieActionApi';
import { useSnackbar } from '@/shared/context/SnackbarProvider';

export function useMovieAction() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const getLabel = (actionType) =>
    actionType === 'watchLater' ? 'watch later' : 'collection';

  const getSuccessMessage = (actionType, state) => {
    const label = getLabel(actionType);
    return state ? `Added to ${label}` : `Removed from ${label}`;
  };

  const getErrorMessage = (actionType, state) => {
    const label = getLabel(actionType);
    return state ? `Failed to add to ${label}` : `Failed to remove from ${label}`;
  };

  return useMutation({
    mutationFn: ({ movieId, actionType, state, mediaType }) =>
      movieActionApi(movieId, actionType, state, mediaType),

    onMutate: async ({ movieId, actionType, state, mediaType }) => {
      const listKey =
        actionType === 'watchLater' ? ['userWatchLater'] : ['userSaved'];

      await queryClient.cancelQueries({ queryKey: listKey });

      const previous = queryClient.getQueryData(listKey);

      queryClient.setQueryData(listKey, (current) => {
        if (actionType === 'saved' || actionType === 'watchLater') {
          const normalized =
            current && typeof current === 'object' && !Array.isArray(current)
              ? current
              : { movies: [], tv: [] };
          const targetType = mediaType === 'tv' ? 'tv' : 'movies';
          const nextList = Array.isArray(normalized[targetType])
            ? normalized[targetType]
            : [];

          const updated = state
            ? nextList.includes(movieId)
              ? nextList
              : [...nextList, movieId]
            : nextList.filter((id) => id !== movieId);

          return { ...normalized, [targetType]: updated };
        }

        const ids = Array.isArray(current) ? current : [];
        if (state) {
          return ids.includes(movieId) ? ids : [...ids, movieId];
        }
        return ids.filter((id) => id !== movieId);
      });

      return { listKey, previous };
    },

    onError: (error, variables, context) => {
      if (context?.listKey) {
        queryClient.setQueryData(context.listKey, context.previous ?? []);
      }
      const message =
        error?.status === 401
          ? 'Login to use this feature'
          : error?.message ||
            (variables?.actionType
              ? getErrorMessage(variables.actionType, variables.state)
              : 'Failed to update movie');
      showSnackbar(message, { color: 'red' });
    },

    onSuccess: (_data, variables) => {
      if (variables?.actionType) {
        showSnackbar(
          getSuccessMessage(variables.actionType, variables.state)
        );
      }
    },

    onSettled: (_data, _error, variables, context) => {
      const listKey =
        context?.listKey ??
        (variables?.actionType === 'watchLater'
          ? ['userWatchLater']
          : ['userSaved']);
      queryClient.invalidateQueries({ queryKey: listKey });
    },
  });
}

