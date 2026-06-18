import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { logger } from '../config/logger.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// H-04 (A07) — Política mínima de fortaleza: ≥ 8 caracteres, con letras y números.
const PASSWORD_POLICY = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export const login = async (req, res) => {
  const { email, password } = req.body;
  // H-03 (A05 Injection) — rechazar valores no-string para evitar inyección de
  // operadores NoSQL como {"$gt":""} que de otro modo llegarían a la consulta Mongo.
  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
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

  // H-03 (A05 Injection) — validar tipos antes de construir el documento.
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Datos de registro inválidos' });
  }
  // H-04 (A07 Authentication Failures) — exigir contraseña robusta.
  if (!PASSWORD_POLICY.test(password)) {
    return res.status(400).json({
      message: 'La contraseña debe tener al menos 8 caracteres e incluir letras y números',
    });
  }

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
    // H-01 (A10) — no filtrar detalles internos (Mongo/Mongoose) al cliente;
    // el detalle queda en el log estructurado para diagnóstico.
    logger.error('register_failed', { error: err.message });
    res.status(500).json({ message: 'No se pudo completar el registro' });
  }
};
