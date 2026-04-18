const logger = require('../config/logger');
const AppError = require('../shared/errors/AppError');

function serializeError(err) {
  if (!err) {
    return null;
  }

  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
      statusCode: err.statusCode || null,
      code: err.code || null,
      status: err.status || null,
      text: err.text || null,
      details: err.details || null,
      stack: err.stack || null,
      cause: err.cause ? serializeError(err.cause) : null,
    };
  }

  if (typeof err === 'object') {
    return { ...err };
  }

  return { message: String(err) };
}

module.exports = function errorMiddleware(err, req, res, next) {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error('Operational error', {
        method: req.method,
        path: req.originalUrl,
        error: serializeError(err),
      });
    }

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

  logger.error('Unhandled error', {
    method: req.method,
    path: req.originalUrl,
    error: serializeError(err),
  });
  return res.status(500).json({ message: 'Internal Server Error' });
};
