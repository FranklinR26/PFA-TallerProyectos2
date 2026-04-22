import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  students: { type: Number, default: 25 },
}, { timestamps: true });

export const Section = mongoose.model('Section', sectionSchema);
