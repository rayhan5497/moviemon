import { useQuery } from '@tanstack/react-query';
import { getAdminStats } from '../api/adminApi';

export const useAdminStats = () =>
  useQuery({
    queryKey: ['adminStats'],
    queryFn: getAdminStats,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
