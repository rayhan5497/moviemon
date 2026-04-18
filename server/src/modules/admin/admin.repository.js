const User = require('../users/user.model');

async function countUsers(filter = {}) {
  return User.countDocuments(filter);
}

async function aggregateLibraryTotals() {
  const results = await User.aggregate([
    {
      $project: {
        savedCount: {
          $add: [
            { $size: { $ifNull: ['$saved.movies', []] } },
            { $size: { $ifNull: ['$saved.tv', []] } },
          ],
        },
        watchLaterCount: {
          $add: [
            { $size: { $ifNull: ['$watchLater.movies', []] } },
            { $size: { $ifNull: ['$watchLater.tv', []] } },
          ],
        },
        watchHistoryCount: { $size: { $ifNull: ['$watchHistory', []] } },
      },
    },
    {
      $group: {
        _id: null,
        savedTotal: { $sum: '$savedCount' },
        watchLaterTotal: { $sum: '$watchLaterCount' },
        watchHistoryTotal: { $sum: '$watchHistoryCount' },
      },
    },
  ]);

  return results[0] || {
    savedTotal: 0,
    watchLaterTotal: 0,
    watchHistoryTotal: 0,
  };
}

async function countNewUsersSince(date) {
  return User.countDocuments({ createdAt: { $gte: date } });
}

module.exports = {
  countUsers,
  aggregateLibraryTotals,
  countNewUsersSince,
};
