const logger = require('../config/logger');
const AppError = require('../shared/errors/AppError');

module.exports = function errorMiddleware(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      details: err.details || null
    });
  }

  const multerCodes = new Set([
    'LIMIT_PART_COUNT',
    'LIMIT_FILE_SIZE',
    'LIMIT_FILE_COUNT',
    'LIMIT_FIELD_KEY',
    'LIMIT_FIELD_VALUE',
    'LIMIT_FIELD_COUNT',
    'LIMIT_UNEXPECTED_FILE',
  ]);
  if (err && (err.name === 'MulterError' || multerCodes.has(err.code))) {
    const isFileSize = err.code === 'LIMIT_FILE_SIZE';
    const statusCode = isFileSize ? 413 : 400;
    const message = isFileSize
      ? 'File too large. Max size is 2MB.'
      : err.message || 'Upload error';
    return res.status(statusCode).json({
      message,
      code: err.code || null,
      field: err.field || null,
    });
  }

  logger.error(err);
  return res.status(500).json({ message: 'Internal Server Error' });
};
