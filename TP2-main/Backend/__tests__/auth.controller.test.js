/**
 * Pruebas del controlador de autenticación.
 * Valida las mitigaciones OWASP Top 10 2025 aplicadas (H-01, H-03, H-04) y los
 * caminos de éxito/error de login y register. El modelo User y el logger se
 * mockean para no depender de MongoDB (pruebas unitarias deterministas).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../models/User.js', () => ({
  User: { findOne: vi.fn(), create: vi.fn() },
}));
vi.mock('../config/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import { login, register, getMe } from '../controllers/auth.controller.js';
import { User } from '../models/User.js';
import { logger } from '../config/logger.js';

const mockRes = () => {
  const res = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  return res;
};

beforeEach(() => {
  vi.clearAllMocks();
  process.env.JWT_SECRET = 'test-secret';
  process.env.JWT_EXPIRES_IN = '1h';
});

describe('login', () => {
  it('H-03 (A05 Injection) — rechaza email/password no-string sin consultar la BD', async () => {
    const req = { body: { email: { $gt: '' }, password: { $gt: '' } } };
    const res = mockRes();
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email y contraseña requeridos' });
    expect(User.findOne).not.toHaveBeenCalled(); // el vector NoSQL nunca llega a Mongo
  });

  it('responde 400 cuando faltan credenciales', async () => {
    const req = { body: { email: '', password: '' } };
    const res = mockRes();
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('responde 401 cuando el usuario no existe', async () => {
    User.findOne.mockReturnValue({ select: vi.fn().mockResolvedValue(null) });
    const req = { body: { email: 'a@b.com', password: 'secret123' } };
    const res = mockRes();
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Credenciales incorrectas' });
  });

  it('responde 401 cuando la contraseña no coincide', async () => {
    const user = { matchPassword: vi.fn().mockResolvedValue(false) };
    User.findOne.mockReturnValue({ select: vi.fn().mockResolvedValue(user) });
    const req = { body: { email: 'a@b.com', password: 'wrongpass1' } };
    const res = mockRes();
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('responde con token y datos del usuario en credenciales válidas', async () => {
    const user = {
      _id: 'u1', code: 'A1', name: 'Ana', email: 'a@b.com',
      role: 'admin', entityId: null,
      matchPassword: vi.fn().mockResolvedValue(true),
    };
    User.findOne.mockReturnValue({ select: vi.fn().mockResolvedValue(user) });
    const req = { body: { email: 'a@b.com', password: 'secret123' } };
    const res = mockRes();
    await login(req, res);
    const payload = res.json.mock.calls[0][0];
    expect(typeof payload.token).toBe('string');
    expect(payload.user).toMatchObject({ id: 'u1', email: 'a@b.com', role: 'admin' });
    expect(payload.user).not.toHaveProperty('passwordHash'); // no se expone el hash
  });
});

describe('register', () => {
  it('H-03 (A05 Injection) — rechaza email/password no-string', async () => {
    const req = { body: { email: { $gt: '' }, password: 'Valida123' } };
    const res = mockRes();
    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Datos de registro inválidos' });
    expect(User.create).not.toHaveBeenCalled();
  });

  it('H-04 (A07) — rechaza contraseña demasiado corta', async () => {
    const req = { body: { email: 'a@b.com', password: 'abc' } };
    const res = mockRes();
    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(User.create).not.toHaveBeenCalled();
  });

  it('H-04 (A07) — rechaza contraseña sin números', async () => {
    const req = { body: { email: 'a@b.com', password: 'sololetras' } };
    const res = mockRes();
    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('crea el usuario (201) cuando los datos son válidos', async () => {
    User.create.mockResolvedValue({ _id: 'u2', email: 'a@b.com' });
    const req = { body: { code: 'A2', name: 'Beto', email: 'a@b.com', password: 'Valida123', role: 'docente' } };
    const res = mockRes();
    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(User.create).toHaveBeenCalledOnce();
  });

  it('responde 409 cuando el email o código ya existe', async () => {
    User.create.mockRejectedValue({ code: 11000 });
    const req = { body: { code: 'A2', name: 'Beto', email: 'a@b.com', password: 'Valida123', role: 'docente' } };
    const res = mockRes();
    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('H-01 (A10) — ante error interno responde mensaje genérico y registra el detalle en el log', async () => {
    User.create.mockRejectedValue(new Error('E11000 detalle interno de Mongo'));
    const req = { body: { code: 'A2', name: 'Beto', email: 'a@b.com', password: 'Valida123', role: 'docente' } };
    const res = mockRes();
    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    const payload = res.json.mock.calls[0][0];
    expect(payload.message).toBe('No se pudo completar el registro');
    expect(payload.message).not.toContain('Mongo'); // no se filtran detalles internos
    expect(logger.error).toHaveBeenCalledWith('register_failed', expect.objectContaining({ error: expect.any(String) }));
  });
});

describe('getMe', () => {
  it('devuelve el usuario autenticado del request', async () => {
    const req = { user: { id: 'u1', role: 'admin' } };
    const res = mockRes();
    await getMe(req, res);
    expect(res.json).toHaveBeenCalledWith({ user: req.user });
  });
});
