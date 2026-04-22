import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: ['admin', 'coordinador', 'docente', 'estudiante'],
    required: true,
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  courseIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  }],
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return;
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
});

userSchema.methods.matchPassword = async function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

export const User = mongoose.model('User', userSchema);
