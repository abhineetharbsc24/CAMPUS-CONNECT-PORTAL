import express from 'express';
import { register, login, listUsers } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', protect, authorize('admin'), listUsers);

export default router;
