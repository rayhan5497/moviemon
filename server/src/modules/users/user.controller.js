const asyncHandler = require('../../shared/utils/asyncHandler');
const userService = require('./user.service');

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.sub;

  const result = await userService.updateProfile(userId, req.body, req.file);

  res.json(result);
});

module.exports = {
  updateProfile,
};
