
export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const paginatedResponse = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      currentPage: pagination.page,
      totalPages: pagination.totalPages,
      totalItems: pagination.totalItems,
      itemsPerPage: pagination.limit,
      hasNextPage: pagination.page < pagination.totalPages,
      hasPrevPage: pagination.page > 1,
    },
    timestamp: new Date().toISOString(),
  });
};

export const errorResponse = (res, error, statusCode = 500) => {
  const response = {
    success: false,
    message: error.message || 'An error occurred',
    code: error.code || 'INTERNAL_ERROR',
    timestamp: new Date().toISOString(),
  };

  // Include error details in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
    response.details = error.details || error.errors;
  }

  // Include validation errors
  if (error.errors) {
    response.errors = error.errors;
  }

  return res.status(statusCode).json(response);
};

export const createdResponse = (res, data, message = 'Resource created successfully') => {
  return successResponse(res, data, message, 201);
};

export const noContentResponse = (res) => {
  return res.status(204).send();
};

export default {
  successResponse,
  paginatedResponse,
  errorResponse,
  createdResponse,
  noContentResponse,
};
