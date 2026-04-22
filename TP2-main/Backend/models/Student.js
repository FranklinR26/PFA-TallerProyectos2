import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  code:    { type: String, required: true, unique: true, trim: true },
  name:    { type: String, required: true, trim: true },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    default: null,
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  }],
  waitlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  }],
}, { timestamps: true });

export const Student = mongoose.model('Student', studentSchema);
