const numberFormatter = new Intl.NumberFormat();

export const formatAdminNumber = (value) => numberFormatter.format(value ?? 0);

export function getAdminDashboardData(stats = {}) {
  const totalUsers = stats.totalUsers ?? 0;
  const verifiedUsers = stats.verifiedUsers ?? 0;
  const adminUsers = stats.adminUsers ?? 0;
  const newUsersLast7Days = stats.newUsersLast7Days ?? 0;
  const savedTotal = stats.savedTotal ?? 0;
  const watchLaterTotal = stats.watchLaterTotal ?? 0;
  const watchHistoryTotal = stats.watchHistoryTotal ?? 0;
  const totalLibraryEntries = savedTotal + watchLaterTotal + watchHistoryTotal;

  const verificationRate = totalUsers
    ? `${Math.round((verifiedUsers / totalUsers) * 100)}%`
    : '0%';
  const adminShare = totalUsers
    ? `${Math.round((adminUsers / totalUsers) * 100)}%`
    : '0%';
  const libraryActionsPerUser = totalUsers
    ? (totalLibraryEntries / totalUsers).toFixed(1)
    : '0.0';

  return {
    totalUsers,
    verifiedUsers,
    adminUsers,
    newUsersLast7Days,
    savedTotal,
    watchLaterTotal,
    watchHistoryTotal,
    summaryItems: [
      `${formatAdminNumber(totalLibraryEntries)} tracked library actions`,
      `${verificationRate} verification rate`,
      `${adminShare} admin share`,
    ],
    insights: [
      {
        label: 'Verification Rate',
        value: verificationRate,
        helper: 'A fast signal for how smoothly onboarding is going.',
      },
      {
        label: 'Admin Share',
        value: adminShare,
        helper: 'Useful for keeping privileged access visible.',
      },
      {
        label: 'Library Actions Per User',
        value: libraryActionsPerUser,
        helper: 'A compact engagement signal across the user base.',
      },
    ],
    scopeItems: [
      'This dashboard is powered by the protected `/api/admin/stats` endpoint.',
      'Visibility depends on the signed-in user role already stored in auth state.',
      'The structure is ready for future additions like moderation, user search, and audit tools.',
    ],
  };
}
