import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña requeridos' });
  }

  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }

  const token = signToken(user._id);
  res.json({
    token,
    user: {
      id: user._id,
      code: user.code,
      name: user.name,
      email: user.email,
      role: user.role,
      entityId: user.entityId,
    },
  });
};

export const getMe = async (req, res) => {
  res.json({ user: req.user });
};

export const register = async (req, res) => {
  const { code, name, email, password, role, entityId, sectionId } = req.body;
  try {
    const user = await User.create({
      code,
      name,
      email,
      passwordHash: password,
      role,
      entityId: entityId || null,
      sectionId: sectionId || null,
    });
    res.status(201).json({ user });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Email o código ya existe' });
    }
    res.status(500).json({ message: err.message });
  }
};
