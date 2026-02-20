const AppError = require('../shared/errors/AppError');
const { verifyToken } = require('../shared/utils/jwt');

module.exports = function authMiddleware(req, res, next) {
  console.log('req', req.headers.authorization)
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized, Unkown Header', 401));
  }
  const token = header.slice(7);
  try {
    const payload = verifyToken(token);
    req.user = payload;
    return next();
  } catch (err) {
    return next(new AppError('Unauthorized', 401));
  }
};
