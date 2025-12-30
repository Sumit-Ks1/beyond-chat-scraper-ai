import { errorResponse } from '../utils/responseHelper.js';
import { AppError } from '../utils/errors.js';
import config from '../config/index.js';

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return { message, statusCode: 400, code: 'INVALID_ID' };
};

const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const message = `Duplicate value for field: ${field}`;
  return { message, statusCode: 409, code: 'DUPLICATE_KEY' };
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((e) => ({
    field: e.path,
    message: e.message,
  }));
  return {
    message: 'Validation failed',
    statusCode: 422,
    code: 'VALIDATION_ERROR',
    errors,
  };
};

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  if (config.server.isDevelopment) {
    console.error('❌ Error:', {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });
  }

  if (err.name === 'CastError') {
    const { message, statusCode, code } = handleCastError(err);
    error = { message, statusCode, code, isOperational: true };
  }

  if (err.code === 11000) {
    const { message, statusCode, code } = handleDuplicateKeyError(err);
    error = { message, statusCode, code, isOperational: true };
  }

  if (err.name === 'ValidationError' && err.errors) {
    const { message, statusCode, code, errors } = handleValidationError(err);
    error = { message, statusCode, code, errors, isOperational: true };
  }

  if (err instanceof AppError) {
    return errorResponse(res, err, err.statusCode);
  }

  if (error.isOperational) {
    return errorResponse(
      res,
      {
        message: error.message,
        code: error.code,
        errors: error.errors,
      },
      error.statusCode
    );
  }

  console.error('❌ Unhandled Error:', err);
  
  return errorResponse(
    res,
    {
      message: config.server.isProduction
        ? 'An unexpected error occurred'
        : err.message,
      code: 'INTERNAL_ERROR',
    },
    500
  );
};

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    code: 'ROUTE_NOT_FOUND',
    timestamp: new Date().toISOString(),
  });
};

export default { errorHandler, notFoundHandler };
