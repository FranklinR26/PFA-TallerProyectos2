import mongoose from 'mongoose';

const periodSchema = new mongoose.Schema({
  name:     { type: String, required: true, unique: true }, // "2025-I"
  year:     { type: Number, required: true },
  semester: { type: Number, enum: [1, 2], required: true },
  isActive: { type: Boolean, default: false },
}, { timestamps: true });

export const Period = mongoose.model('Period', periodSchema);
