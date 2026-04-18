import { useEffect } from 'react';
import loadingSpinner from '@/shared/assets/animated-icon/loading-spinner.lottie';

import AdminDashboard from '@/features/admin/components/AdminDashboard';
import AdminErrorState from '@/features/admin/components/AdminErrorState';
import { useAdminStats } from '@/features/admin/hooks/useAdminStats';
import { useUserMoviesContext } from '@/shared/context/UserMoviesContext';
import { useIsLg } from '@/shared/hooks/useIsLg';
import Message from '@/shared/components/ui/Message';

export default function Admin() {
  const isLg = useIsLg();
  const { data, error, isLoading, isFetching, refetch } = useAdminStats();
  const { userInfo } = useUserMoviesContext();
  const containerClassName = `movies md:flex md:flex-col ${!isLg ? 'm-2' : 'm-5'}`;

  useEffect(() => {
    document.title = 'Admin Dashboard - Moviemon';
  }, []);

  if (isLoading) {
    return (
      <div className={containerClassName}>
        <Message
          lottie={loadingSpinner}
          className="w-[1.4em]"
          message="Loading admin dashboard"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className={containerClassName}>
        <AdminErrorState message={error.message} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <AdminDashboard
        stats={data}
        userName={userInfo?.user?.name}
        isRefreshing={isFetching}
        onRefresh={refetch}
      />
    </div>
  );
}
