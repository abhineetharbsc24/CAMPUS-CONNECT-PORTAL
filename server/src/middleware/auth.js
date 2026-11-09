import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    const error = new Error('Not authenticated: token missing');
    error.statusCode = 401;
    return next(error);
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    const error = new Error('Not authenticated: token invalid or expired');
    error.statusCode = 401;
    next(error);
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    const error = new Error('Forbidden: your role cannot access this resource');
    error.statusCode = 403;
    return next(error);
  }
  next();
};
