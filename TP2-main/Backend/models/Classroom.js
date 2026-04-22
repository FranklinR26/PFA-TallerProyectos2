import mongoose from 'mongoose';

const classroomSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  type:     { type: String, enum: ['teoria', 'lab', 'taller', 'auditorio'], required: true },
  capacity: { type: Number, required: true, min: 1 },
}, { timestamps: true });

export const Classroom = mongoose.model('Classroom', classroomSchema);
