import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
});

const httpError = (status, message) => {
  const error = new Error(message);
  error.statusCode = status;
  return error;
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) throw httpError(400, 'name, email and password are required');
    if (password.length < 6) throw httpError(400, 'password must be at least 6 characters');

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) throw httpError(409, 'email already registered');

    const safeRole = role === 'faculty' ? 'faculty' : 'student';
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: safeRole });

    res.status(201).json({ success: true, token: signToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw httpError(400, 'email and password are required');

    const user = await User.findOne({ email: email.toLowerCase() });
    const valid = user && (await bcrypt.compare(password, user.password));
    if (!valid) throw httpError(401, 'invalid email or password');

    res.json({ success: true, token: signToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
};

export const listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    next(err);
  }
};
