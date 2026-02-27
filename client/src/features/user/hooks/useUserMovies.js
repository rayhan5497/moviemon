import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getSavedMovies,
  getWatchLaterMovies,
  getWatchHistory,
} from '../api/userMoviesApi';
import { useUserMoviesContext } from '@/shared/context/UserMoviesContext';

export const useUserMovies = () => {
  const { isLoggedIn } = useUserMoviesContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoggedIn) {
      queryClient.setQueryData(['userSaved'], []);
      queryClient.setQueryData(['userWatchLater'], []);
      queryClient.setQueryData(['userWatchHistory'], []);
    }
  }, [isLoggedIn, queryClient]);

  const savedQuery = useQuery({
    queryKey: ['userSaved'],
    queryFn: getSavedMovies,
    enabled: isLoggedIn,
  });

  const watchLaterQuery = useQuery({
    queryKey: ['userWatchLater'],
    queryFn: getWatchLaterMovies,
    enabled: isLoggedIn,
  });

  const watchHistoryQuery = useQuery({
    queryKey: ['userWatchHistory'],
    queryFn: getWatchHistory,
    enabled: isLoggedIn,
  });

  const savedByType =
    isLoggedIn && savedQuery.data && typeof savedQuery.data === 'object'
      ? {
          movies: savedQuery.data.movies ?? [],
          tv: savedQuery.data.tv ?? [],
        }
      : { movies: [], tv: [] };
  const savedIds = isLoggedIn
    ? [...new Set([...(savedByType.movies || []), ...(savedByType.tv || [])])]
    : [];

  const watchLaterByType =
    isLoggedIn && watchLaterQuery.data && typeof watchLaterQuery.data === 'object'
      ? {
          movies: watchLaterQuery.data.movies ?? [],
          tv: watchLaterQuery.data.tv ?? [],
        }
      : { movies: [], tv: [] };
  const watchLaterIds = isLoggedIn
    ? [
        ...new Set([
          ...(watchLaterByType.movies || []),
          ...(watchLaterByType.tv || []),
        ]),
      ]
    : [];

  return {
    savedIds,
    savedByType,
    watchLaterIds,
    watchLaterByType,
    watchHistory: isLoggedIn ? watchHistoryQuery.data ?? [] : [],
    savedQuery,
    watchLaterQuery,
    watchHistoryQuery,
    isLoading: isLoggedIn
      ? savedQuery.isLoading ||
        watchLaterQuery.isLoading ||
        watchHistoryQuery.isLoading
      : false,
    isError: isLoggedIn
      ? savedQuery.isError ||
        watchLaterQuery.isError ||
        watchHistoryQuery.isError
      : false,
    error: isLoggedIn
      ? savedQuery.error || watchLaterQuery.error || watchHistoryQuery.error
      : null,
    isLoggedIn,
  };
};

