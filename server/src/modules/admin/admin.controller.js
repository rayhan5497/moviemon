const asyncHandler = require('../../shared/utils/asyncHandler');
const adminService = require('./admin.service');

const getStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getStats();
  res.json(stats);
});

module.exports = {
  getStats,
};
