export const notFound = (req, res, next) => {
  const error = new Error(`Resource not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  if (status >= 500) console.error('Server error:', err.message);
  res.status(status).json({
    success: false,
    error: { status, message: err.message || 'Internal server error' }
  });
};
