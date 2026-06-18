/**
 * Pruebas del controlador de períodos académicos.
 * Modelos mockeados (sin MongoDB): cubre validaciones, éxito y errores de
 * getPeriods, createPeriod, activatePeriod y deletePeriod.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../models/Period.js', () => ({
  Period: {
    find: vi.fn(),
    create: vi.fn(),
    updateMany: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
  },
}));
vi.mock('../models/Schedule.js', () => ({
  Schedule: { countDocuments: vi.fn() },
}));

import { getPeriods, createPeriod, activatePeriod, deletePeriod } from '../controllers/period.controller.js';
import { Period } from '../models/Period.js';
import { Schedule } from '../models/Schedule.js';

const mockRes = () => {
  const res = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  return res;
};

beforeEach(() => vi.clearAllMocks());

describe('getPeriods', () => {
  it('devuelve los períodos ordenados', async () => {
    const periods = [{ name: '2026-I' }];
    Period.find.mockReturnValue({ sort: vi.fn().mockResolvedValue(periods) });
    const res = mockRes();
    await getPeriods({}, res);
    expect(res.json).toHaveBeenCalledWith(periods);
  });

  it('responde 500 ante error', async () => {
    Period.find.mockReturnValue({ sort: vi.fn().mockRejectedValue(new Error('db')) });
    const res = mockRes();
    await getPeriods({}, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('createPeriod', () => {
  it('responde 400 si faltan year o semester', async () => {
    const res = mockRes();
    await createPeriod({ body: { year: 2026 } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(Period.create).not.toHaveBeenCalled();
  });

  it('crea el período con nombre derivado (semestre I)', async () => {
    Period.create.mockResolvedValue({ name: '2026-I' });
    const res = mockRes();
    await createPeriod({ body: { year: 2026, semester: 1 } }, res);
    expect(Period.create).toHaveBeenCalledWith({ name: '2026-I', year: 2026, semester: 1 });
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('deriva el nombre con semestre II', async () => {
    Period.create.mockResolvedValue({ name: '2026-II' });
    const res = mockRes();
    await createPeriod({ body: { year: 2026, semester: 2 } }, res);
    expect(Period.create).toHaveBeenCalledWith({ name: '2026-II', year: 2026, semester: 2 });
  });

  it('responde 409 ante período duplicado', async () => {
    Period.create.mockRejectedValue({ code: 11000 });
    const res = mockRes();
    await createPeriod({ body: { year: 2026, semester: 1 } }, res);
    expect(res.status).toHaveBeenCalledWith(409);
  });
});

describe('activatePeriod', () => {
  it('desactiva los demás y activa el indicado', async () => {
    Period.updateMany.mockResolvedValue({});
    Period.findByIdAndUpdate.mockResolvedValue({ _id: 'p1', isActive: true });
    const res = mockRes();
    await activatePeriod({ params: { id: 'p1' } }, res);
    expect(Period.updateMany).toHaveBeenCalledWith({}, { isActive: false });
    expect(res.json).toHaveBeenCalledWith({ _id: 'p1', isActive: true });
  });

  it('responde 404 si el período no existe', async () => {
    Period.updateMany.mockResolvedValue({});
    Period.findByIdAndUpdate.mockResolvedValue(null);
    const res = mockRes();
    await activatePeriod({ params: { id: 'x' } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('deletePeriod', () => {
  it('impide eliminar si hay horarios asociados', async () => {
    Schedule.countDocuments.mockResolvedValue(3);
    const res = mockRes();
    await deletePeriod({ params: { id: 'p1' } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(Period.findByIdAndDelete).not.toHaveBeenCalled();
  });

  it('elimina el período sin horarios asociados', async () => {
    Schedule.countDocuments.mockResolvedValue(0);
    Period.findByIdAndDelete.mockResolvedValue({});
    const res = mockRes();
    await deletePeriod({ params: { id: 'p1' } }, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Período eliminado' });
  });
});
