import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  availability: {
    type: [[Number]],
    default: () => Array.from({ length: 5 }, () => Array(12).fill(1)),
  },
}, { timestamps: true });

export const Teacher = mongoose.model('Teacher', teacherSchema);
