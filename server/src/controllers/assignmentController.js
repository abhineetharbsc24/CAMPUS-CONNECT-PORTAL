import mongoose from 'mongoose';
import Assignment from '../models/Assignment.js';

const httpError = (status, message) => {
  const error = new Error(message);
  error.statusCode = status;
  return error;
};

export const getAssignments = async (req, res, next) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: 1 });
    res.json(assignments);
  } catch (err) {
    next(err);
  }
};

export const createAssignment = async (req, res, next) => {
  try {
    const { subject, title, dueDate } = req.body;
    if (!subject || !title) throw httpError(400, 'subject and title are required');
    const assignment = await Assignment.create({ subject, title, dueDate: dueDate || '' });
    res.status(201).json(assignment);
  } catch (err) {
    next(err);
  }
};

export const submitAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw httpError(400, 'invalid assignment id');
    const assignment = await Assignment.findByIdAndUpdate(id, { status: 'Submitted' }, { new: true });
    if (!assignment) throw httpError(404, 'Assignment not found');
    res.json(assignment);
  } catch (err) {
    next(err);
  }
};

export const deleteAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw httpError(400, 'invalid assignment id');
    const assignment = await Assignment.findByIdAndDelete(id);
    if (!assignment) throw httpError(404, 'Assignment not found');
    res.json({ success: true, message: 'Assignment deleted' });
  } catch (err) {
    next(err);
  }
};
