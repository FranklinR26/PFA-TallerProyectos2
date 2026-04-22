import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  sessionsPerWeek:  { type: Number, required: true, min: 1, max: 5 },
  blocksPerSession: { type: Number, required: true, min: 1, max: 4 },
  roomType: { type: String, enum: ['teoria', 'lab', 'taller', 'auditorio'], required: true },
  capacity: { type: Number, required: true, min: 1 },
}, { timestamps: true });

export const Course = mongoose.model('Course', courseSchema);
