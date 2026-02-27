import { useQueries } from '@tanstack/react-query';
import { fetchMediaById } from '@/shared/api/mediaByIds';

export function useMediaByIds(ids, options = {}) {
  const { enabled = true, typeById, mediaType } = options;
  const list = Array.isArray(ids) ? ids : [];

  const queries = useQueries({
    queries: list.map((id) => {
      const perIdType = typeById?.get?.(id) ?? typeById?.[id] ?? mediaType;
      const typeKey = perIdType || 'unknown';
      return {
        queryKey: ['mediaById', typeKey, id],
        queryFn: () => fetchMediaById(id, perIdType),
        enabled: enabled && Boolean(id) && Boolean(perIdType),
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
      };
    }),
  });

  const data = queries.map((q) => q.data).filter(Boolean);
  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);
  const error = queries.find((q) => q.error)?.error;

  return { data, isLoading, isError, error };
}

