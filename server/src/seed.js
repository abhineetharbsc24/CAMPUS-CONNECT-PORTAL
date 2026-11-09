import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from './models/User.js';
import Assignment from './models/Assignment.js';

const run = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus_connect';
  await mongoose.connect(uri);

  await User.deleteMany({ email: { $in: ['admin@rvu.edu', 'faculty@rvu.edu', 'student@rvu.edu'] } });
  const password = await bcrypt.hash('Passw0rd!', 10);

  await User.create([
    { name: 'Portal Admin', email: 'admin@rvu.edu', password, role: 'admin' },
    { name: 'Prof. Rao', email: 'faculty@rvu.edu', password, role: 'faculty' },
    { name: 'RVU Student', email: 'student@rvu.edu', password, role: 'student' }
  ]);

  if ((await Assignment.countDocuments()) === 0) {
    await Assignment.create([
      { subject: 'CS3301 - Full Stack', title: 'Lab 2: React Routing', dueDate: 'Sept 15, 2026' },
      { subject: 'CS3302 - DBMS', title: 'ER Diagram Project Report', dueDate: 'Sept 01, 2026', status: 'Submitted' }
    ]);
  }

  console.log('Seed complete. Demo logins (password Passw0rd!): admin@rvu.edu, faculty@rvu.edu, student@rvu.edu');
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
