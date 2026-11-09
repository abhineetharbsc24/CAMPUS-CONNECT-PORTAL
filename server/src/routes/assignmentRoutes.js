import express from 'express';
import {
  getAssignments,
  createAssignment,
  submitAssignment,
  deleteAssignment
} from '../controllers/assignmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAssignments);
router.post('/', protect, authorize('faculty', 'admin'), createAssignment);
router.put('/:id/submit', protect, authorize('student'), submitAssignment);
router.delete('/:id', protect, authorize('faculty', 'admin'), deleteAssignment);

export default router;
