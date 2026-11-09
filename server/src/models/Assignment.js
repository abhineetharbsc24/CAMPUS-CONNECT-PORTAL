import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    dueDate: { type: String, default: '' },
    status: { type: String, enum: ['Pending', 'Submitted'], default: 'Pending' }
  },
  { timestamps: true }
);

export default mongoose.model('Assignment', assignmentSchema);
