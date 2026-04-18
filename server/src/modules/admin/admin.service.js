const adminRepository = require('./admin.repository');

async function getStats() {
  const [totalUsers, verifiedUsers, adminUsers, recentUsers, totals] =
    await Promise.all([
      adminRepository.countUsers(),
      adminRepository.countUsers({ isVerified: true }),
      adminRepository.countUsers({ role: 'admin' }),
      adminRepository.countNewUsersSince(
        new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
      ),
      adminRepository.aggregateLibraryTotals(),
    ]);

  return {
    totalUsers,
    verifiedUsers,
    adminUsers,
    newUsersLast7Days: recentUsers,
    savedTotal: totals.savedTotal,
    watchLaterTotal: totals.watchLaterTotal,
    watchHistoryTotal: totals.watchHistoryTotal,
  };
}

module.exports = {
  getStats,
};
