const AppError = require('../shared/errors/AppError');

module.exports = function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return next(new AppError('Forbidden', 403));
  }

  return next();
};
