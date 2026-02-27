import { useInfiniteQuery } from '@tanstack/react-query';
import { getMovies } from '@/shared/api/getMovies';

export function useMovies(query, type, options = {}) {
  return useInfiniteQuery({
    queryKey: ['getData', query, type],
    queryFn: ({ pageParam = 1 }) =>
      getMovies(`${query}&page=${pageParam}`, type),

    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,

    ...options,
  });
}

