import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const verifyToken = async (req, res, next) => {
  // H-06 MITIGACIÓN COMPLETA: Lee token de cookie httpOnly (inmune a XSS).
  // Fallback a header Authorization para compatibilidad con herramientas (curl, Postman).
  let token = req.cookies?.auth_token;

  if (!token) {
    const auth = req.headers.authorization;
    if (auth?.startsWith('Bearer ')) {
      token = auth.split(' ')[1];
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Usuario no válido o inactivo' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
