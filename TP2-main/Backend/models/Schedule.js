import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  solution: { type: Map, of: mongoose.Schema.Types.Mixed },
  score:    { type: Number },
  nodes:    { type: Number },
  timeMs:   { type: Number },
  weights:  { type: mongoose.Schema.Types.Mixed },
  isActive: { type: Boolean, default: true },
  period:   { type: mongoose.Schema.Types.ObjectId, ref: 'Period', default: null },
}, { timestamps: true });

export const Schedule = mongoose.model('Schedule', scheduleSchema);
