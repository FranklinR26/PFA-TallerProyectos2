/**
 * TDD — solver.js  (tests de integración)
 *
 * CICLO RED-GREEN-REFACTOR:
 *  RED:    Se especificaron las postcondiciones del solucionador: cuándo
 *          debe fallar, cuándo debe encontrar solución y qué estructura
 *          debe tener la asignación resultante.
 *  GREEN:  runSolver con backtracking + forward checking satisface todos los casos.
 *  REFACTOR: Se separaron casos de fallo (dominios vacíos) de casos de éxito,
 *            y se añadieron invariantes sobre hard constraints en la solución.
 */

import { describe, it, expect } from 'vitest';
import { runSolver } from '../csp/solver.js';

// ── Factories ────────────────────────────────────────────────────────────────

const mkId = (str) => ({ toString: () => str });

const mkTeacher = (id) => ({
  _id: mkId(id),
  availability: Array(5).fill(null).map(() => Array(12).fill(1)),
});

const mkCourse = (id, teacherObj, overrides = {}) => ({
  _id: mkId(id),
  name: `Curso ${id}`,
  teacher: teacherObj ?? mkTeacher(`t_${id}`),
  sessionsPerWeek: 1,
  blocksPerSession: 1,
  roomType: 'teoria',
  capacity: 30,
  ...overrides,
});

const mkRoom = (id = 'r1', overrides = {}) => ({
  _id: mkId(id),
  type: 'teoria',
  capacity: 40,
  ...overrides,
});

const W = { pref: 5, balance: 4, gaps: 6, spread: 7, core: 3 };
const PARAMS = { timeout: 5000, restarts: 1, maxNodes: 100_000 };

// ── Casos de fallo ────────────────────────────────────────────────────────────

describe('runSolver — casos de fallo', () => {
  it('falla cuando no hay cursos', () => {
    const r = runSolver({ courses: [], classrooms: [], students: [], weights: W, params: PARAMS });
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/No hay sesiones/);
  });

  it('falla cuando no hay aulas del tipo requerido', () => {
    const course = mkCourse('c1', null, { roomType: 'lab' });
    const rooms  = [mkRoom('r1', { type: 'teoria' })];
    const r = runSolver({ courses: [course], classrooms: rooms, students: [], weights: W, params: PARAMS });
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/Sin dominio válido/);
  });

  it('falla cuando las aulas no tienen capacidad suficiente', () => {
    const course = mkCourse('c1', null, { capacity: 60 });
    const rooms  = [mkRoom('r1', { capacity: 30 })];
    const r = runSolver({ courses: [course], classrooms: rooms, students: [], weights: W, params: PARAMS });
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/Sin dominio válido/);
  });

  it('falla cuando el docente no tiene disponibilidad (todo en 0)', () => {
    const teacher = {
      _id: mkId('t1'),
      availability: Array(5).fill(null).map(() => Array(12).fill(0)),
    };
    const course = mkCourse('c1', teacher);
    const r = runSolver({ courses: [course], classrooms: [mkRoom()], students: [], weights: W, params: PARAMS });
    expect(r.ok).toBe(false);
  });
});

// ── Casos de éxito ────────────────────────────────────────────────────────────

describe('runSolver — casos de éxito', () => {
  it('resuelve un caso mínimo (1 curso, 1 aula)', () => {
    const r = runSolver({
      courses: [mkCourse('c1')],
      classrooms: [mkRoom()],
      students: [],
      weights: W,
      params: PARAMS,
    });
    expect(r.ok).toBe(true);
    expect(r.assignment).toBeDefined();
    expect(Object.keys(r.assignment)).toHaveLength(1);
  });

  it('la asignación tiene day ∈ [0,4] y slot ∈ [0,11]', () => {
    const r = runSolver({
      courses: [mkCourse('c1')],
      classrooms: [mkRoom()],
      students: [],
      weights: W,
      params: PARAMS,
    });
    const [entry] = Object.values(r.assignment);
    expect(entry.day).toBeGreaterThanOrEqual(0);
    expect(entry.day).toBeLessThanOrEqual(4);
    expect(entry.slot).toBeGreaterThanOrEqual(0);
    expect(entry.slot).toBeLessThanOrEqual(11);
  });

  it('el resultado incluye nodes y timeMs', () => {
    const r = runSolver({
      courses: [mkCourse('c1')],
      classrooms: [mkRoom()],
      students: [],
      weights: W,
      params: PARAMS,
    });
    expect(typeof r.nodes).toBe('number');
    expect(typeof r.timeMs).toBe('number');
    expect(r.nodes).toBeGreaterThanOrEqual(0);
    expect(r.timeMs).toBeGreaterThanOrEqual(0);
  });

  it('resuelve 2 cursos con distinto docente', () => {
    const r = runSolver({
      courses: [mkCourse('c1', mkTeacher('t1')), mkCourse('c2', mkTeacher('t2'))],
      classrooms: [mkRoom('r1'), mkRoom('r2')],
      students: [],
      weights: W,
      params: PARAMS,
    });
    expect(r.ok).toBe(true);
    expect(Object.keys(r.assignment)).toHaveLength(2);
  });

  it('genera un score numérico finito', () => {
    const r = runSolver({
      courses: [mkCourse('c1')],
      classrooms: [mkRoom()],
      students: [],
      weights: W,
      params: PARAMS,
    });
    expect(Number.isFinite(r.score)).toBe(true);
  });
});

// ── Verificación de hard constraints en la solución ───────────────────────────

describe('runSolver — invariantes de hard constraints', () => {
  it('dos cursos con el mismo docente no se superponen en la solución', () => {
    const teacher = mkTeacher('t1');
    const c1 = mkCourse('c1', teacher, { blocksPerSession: 2 });
    const c2 = mkCourse('c2', teacher, { blocksPerSession: 2 });
    const r = runSolver({
      courses: [c1, c2],
      classrooms: [mkRoom('r1'), mkRoom('r2')],
      students: [],
      weights: W,
      params: PARAMS,
    });
    expect(r.ok).toBe(true);
    const entries = Object.values(r.assignment);
    const [a1, a2] = entries;
    if (a1.day === a2.day) {
      const overlap = a1.slot < a2.slot + 2 && a2.slot < a1.slot + 2;
      expect(overlap).toBe(false);
    }
  });

  it('dos cursos en el mismo aula no se superponen en la solución', () => {
    const r = runSolver({
      courses: [mkCourse('c1', mkTeacher('t1')), mkCourse('c2', mkTeacher('t2'))],
      classrooms: [mkRoom('r1')], // solo un aula — fuerza días distintos
      students: [],
      weights: W,
      params: PARAMS,
    });
    expect(r.ok).toBe(true);
    const entries = Object.values(r.assignment);
    const [a1, a2] = entries;
    if (a1.roomId === a2.roomId && a1.day === a2.day) {
      const overlap = a1.slot < a2.slot + 1 && a2.slot < a1.slot + 1;
      expect(overlap).toBe(false);
    }
  });

  it('el mismo curso no aparece dos veces en el mismo día', () => {
    const teacher = mkTeacher('t1');
    const course = mkCourse('c1', teacher, { sessionsPerWeek: 2 });
    const r = runSolver({
      courses: [course],
      classrooms: [mkRoom('r1'), mkRoom('r2')],
      students: [],
      weights: W,
      params: { ...PARAMS, restarts: 3 },
    });
    expect(r.ok).toBe(true);
    const days = Object.values(r.assignment).map(a => a.day);
    expect(new Set(days).size).toBe(days.length); // todos los días son distintos
  });
});
