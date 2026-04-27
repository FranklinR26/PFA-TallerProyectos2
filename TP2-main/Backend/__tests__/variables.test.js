/**
 * TDD — variables.js
 *
 * CICLO RED-GREEN-REFACTOR:
 *  RED:    Se especificaron los contratos de buildVariables y buildDomain:
 *          cantidad de variables, estructura de IDs, filtros por disponibilidad,
 *          tipo de aula y capacidad.
 *  GREEN:  La implementación pasa todos los casos.
 *  REFACTOR: Se agregaron casos límite de slots al borde (bps+slot > SLOTS_COUNT)
 *            y de disponibilidad parcial (solo algunos días bloqueados).
 */

import { describe, it, expect } from 'vitest';
import { buildVariables, buildDomain } from '../csp/variables.js';

// ── Factories ────────────────────────────────────────────────────────────────

const mkId = (str) => ({ toString: () => str });

const mkTeacher = (id, avail) => ({
  _id: mkId(id),
  availability: avail ?? Array(5).fill(null).map(() => Array(12).fill(1)),
});

const mkCourse = (overrides = {}) => ({
  _id: mkId(overrides.id ?? 'c1'),
  name: overrides.name ?? 'Curso 1',
  teacher: overrides.teacher ?? mkTeacher('t1'),
  sessionsPerWeek: overrides.sessionsPerWeek ?? 2,
  blocksPerSession: overrides.blocksPerSession ?? 2,
  roomType: overrides.roomType ?? 'teoria',
  capacity: overrides.capacity ?? 30,
});

const mkRoom = (overrides = {}) => ({
  _id: mkId(overrides.id ?? 'r1'),
  type: overrides.type ?? 'teoria',
  capacity: overrides.capacity ?? 40,
});

// ── buildVariables ────────────────────────────────────────────────────────────

describe('buildVariables', () => {
  it('retorna array vacío cuando no hay cursos', () => {
    expect(buildVariables([])).toEqual([]);
  });

  it('crea una variable por sesión semanal', () => {
    const course = mkCourse({ sessionsPerWeek: 3 });
    expect(buildVariables([course])).toHaveLength(3);
  });

  it('asigna IDs con formato {courseId}_{sessionIdx}', () => {
    const course = mkCourse({ id: 'abc', sessionsPerWeek: 2 });
    const vars = buildVariables([course]);
    expect(vars[0].id).toBe('abc_0');
    expect(vars[1].id).toBe('abc_1');
  });

  it('sessionIdx incrementa de 0 a sessionsPerWeek-1', () => {
    const course = mkCourse({ sessionsPerWeek: 4 });
    const vars = buildVariables([course]);
    vars.forEach((v, i) => expect(v.sessionIdx).toBe(i));
  });

  it('genera el total de sesiones sumando todos los cursos', () => {
    const c1 = mkCourse({ id: 'c1', sessionsPerWeek: 2 });
    const c2 = mkCourse({ id: 'c2', sessionsPerWeek: 3 });
    expect(buildVariables([c1, c2])).toHaveLength(5);
  });

  it('cada variable mantiene referencia al objeto curso original', () => {
    const course = mkCourse({ sessionsPerWeek: 1 });
    const [v] = buildVariables([course]);
    expect(v.course).toBe(course);
    expect(v.courseId).toBe('c1');
  });
});

// ── buildDomain ───────────────────────────────────────────────────────────────

describe('buildDomain', () => {
  it('retorna dominio vacío cuando no hay aulas compatibles por tipo', () => {
    const course = mkCourse({ roomType: 'lab' });
    const v = { course, courseId: 'c1' };
    const rooms = [mkRoom({ type: 'teoria' })];
    expect(buildDomain(v, rooms)).toHaveLength(0);
  });

  it('retorna dominio vacío cuando la capacidad del aula es insuficiente', () => {
    const course = mkCourse({ capacity: 50 });
    const v = { course, courseId: 'c1' };
    const rooms = [mkRoom({ capacity: 30 })];
    expect(buildDomain(v, rooms)).toHaveLength(0);
  });

  it('excluye slots donde el docente no está disponible (availability=0)', () => {
    const avail = Array(5).fill(null).map(() => Array(12).fill(1));
    avail[0][0] = 0; // no disponible
    const course = mkCourse({ teacher: mkTeacher('t1', avail), blocksPerSession: 1 });
    const v = { course, courseId: 'c1' };
    const domain = buildDomain(v, [mkRoom()]);
    expect(domain.some(a => a.day === 0 && a.slot === 0)).toBe(false);
  });

  it('excluye slots donde cualquier bloque de la sesión no está disponible', () => {
    const avail = Array(5).fill(null).map(() => Array(12).fill(1));
    avail[1][2] = 0; // bloque 2 del día 1 bloqueado
    const course = mkCourse({ teacher: mkTeacher('t1', avail), blocksPerSession: 2 });
    const v = { course, courseId: 'c1' };
    const domain = buildDomain(v, [mkRoom()]);
    // slot 1 (ocuparía slots 1-2) y slot 2 (slots 2-3) deben excluirse
    expect(domain.some(a => a.day === 1 && a.slot === 1)).toBe(false);
    expect(domain.some(a => a.day === 1 && a.slot === 2)).toBe(false);
  });

  it('los entries tienen la forma { day, slot, roomId }', () => {
    const course = mkCourse({ blocksPerSession: 1 });
    const domain = buildDomain({ course, courseId: 'c1' }, [mkRoom()]);
    expect(domain.length).toBeGreaterThan(0);
    const entry = domain[0];
    expect(entry).toHaveProperty('day');
    expect(entry).toHaveProperty('slot');
    expect(entry).toHaveProperty('roomId');
  });

  it('slot + blocksPerSession nunca supera SLOTS_COUNT (12)', () => {
    const course = mkCourse({ blocksPerSession: 3 });
    const domain = buildDomain({ course, courseId: 'c1' }, [mkRoom()]);
    expect(domain.every(a => a.slot + 3 <= 12)).toBe(true);
  });

  it('incluye los 5 días cuando el docente está disponible toda la semana', () => {
    const course = mkCourse({ blocksPerSession: 1 });
    const domain = buildDomain({ course, courseId: 'c1' }, [mkRoom()]);
    const days = new Set(domain.map(a => a.day));
    expect(days.size).toBe(5);
  });

  it('con un aula y bps=1 genera exactamente 60 entradas (5 días × 12 slots)', () => {
    const course = mkCourse({ blocksPerSession: 1 });
    const domain = buildDomain({ course, courseId: 'c1' }, [mkRoom()]);
    expect(domain).toHaveLength(60);
  });

  it('con dos aulas compatibles duplica el número de entradas', () => {
    const course = mkCourse({ blocksPerSession: 1 });
    const rooms = [mkRoom({ id: 'r1' }), mkRoom({ id: 'r2' })];
    const domain = buildDomain({ course, courseId: 'c1' }, rooms);
    expect(domain).toHaveLength(120);
  });

  it('roomId en cada entrada corresponde al _id del aula', () => {
    const course = mkCourse({ blocksPerSession: 1 });
    const domain = buildDomain({ course, courseId: 'c1' }, [mkRoom({ id: 'sala-A' })]);
    expect(domain.every(a => a.roomId === 'sala-A')).toBe(true);
  });
});
