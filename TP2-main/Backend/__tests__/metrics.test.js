/**
 * TDD — metrics.js
 *
 * CICLO RED-GREEN-REFACTOR:
 *  RED:    Se definieron los contratos de computeMetrics: forma de la matriz
 *          heat, cálculo de coveragePct, prefPct, studentConflicts y roomUtil.
 *  GREEN:  La implementación pasa todos los casos.
 *  REFACTOR: Se separaron tests de estructura (heat, totalVars) de tests de
 *            lógica de negocio (conflictos, cobertura, preferencias).
 */

import { describe, it, expect } from 'vitest';
import { computeMetrics } from '../csp/metrics.js';

// ── Factories ────────────────────────────────────────────────────────────────

const mkId = (str) => ({ toString: () => str });

const mkTeacher = (id, avail) => ({
  _id: mkId(id),
  availability: avail ?? Array(5).fill(null).map(() => Array(12).fill(1)),
});

const mkCourse = (id, teacherId = 't1', overrides = {}) => ({
  _id: mkId(id),
  name: `Curso ${id}`,
  teacher: mkTeacher(teacherId),
  sessionsPerWeek: 1,
  blocksPerSession: 1,
  roomType: 'teoria',
  capacity: 30,
  ...overrides,
});

const mkRoom = (id = 'r1') => ({ _id: mkId(id), type: 'teoria', capacity: 40 });

const mkStudent = (id, courseIds, sectionId = 'sec1') => ({
  _id: mkId(id),
  courses: courseIds.map(mkId),
  section: mkId(sectionId),
});

// ── Casos base ────────────────────────────────────────────────────────────────

describe('computeMetrics — casos base', () => {
  it('retorna null cuando solution es null', () => {
    expect(computeMetrics({ solution: null, courses: [], classrooms: [], students: [] })).toBeNull();
  });

  it('retorna el objeto con todas las claves esperadas', () => {
    const course = mkCourse('c1');
    const result = computeMetrics({
      solution: { 'c1_0': { day: 0, slot: 2, roomId: 'r1' } },
      courses: [course],
      classrooms: [mkRoom()],
      students: [],
    });
    const keys = ['prefPct', 'avgGaps', 'roomUtil', 'balanceScore',
                  'studentConflicts', 'courseFill', 'coveragePct',
                  'assignedCount', 'totalVars', 'heat', 'days'];
    keys.forEach(k => expect(result).toHaveProperty(k));
  });
});

// ── coveragePct / assignedCount / totalVars ───────────────────────────────────

describe('computeMetrics — cobertura de sesiones', () => {
  it('100% de cobertura cuando todas las sesiones están asignadas', () => {
    const course = mkCourse('c1');
    const result = computeMetrics({
      solution: { 'c1_0': { day: 0, slot: 2, roomId: 'r1' } },
      courses: [course],
      classrooms: [mkRoom()],
      students: [],
    });
    expect(result.coveragePct).toBe(100);
    expect(result.assignedCount).toBe(1);
    expect(result.totalVars).toBe(1);
  });

  it('0% de cobertura cuando la solución está vacía', () => {
    const course = mkCourse('c1');
    const result = computeMetrics({
      solution: {},
      courses: [course],
      classrooms: [mkRoom()],
      students: [],
    });
    expect(result.coveragePct).toBe(0);
    expect(result.assignedCount).toBe(0);
    expect(result.totalVars).toBe(1);
  });

  it('cobertura parcial cuando solo algunas sesiones están asignadas', () => {
    const course = mkCourse('c1', 't1', { sessionsPerWeek: 2 });
    const result = computeMetrics({
      solution: { 'c1_0': { day: 0, slot: 2, roomId: 'r1' } }, // solo 1 de 2
      courses: [course],
      classrooms: [mkRoom()],
      students: [],
    });
    expect(result.coveragePct).toBe(50);
  });
});

// ── prefPct ───────────────────────────────────────────────────────────────────

describe('computeMetrics — preferencias docentes (prefPct)', () => {
  it('0% cuando ningún bloque está en slot preferido', () => {
    const course = mkCourse('c1'); // availability toda en 1
    const result = computeMetrics({
      solution: { 'c1_0': { day: 0, slot: 2, roomId: 'r1' } },
      courses: [course],
      classrooms: [mkRoom()],
      students: [],
    });
    expect(result.prefPct).toBe(0);
  });

  it('100% cuando el bloque asignado es preferido (availability=2)', () => {
    const avail = Array(5).fill(null).map(() => Array(12).fill(1));
    avail[0][2] = 2;
    const teacher = mkTeacher('t1', avail);
    const course  = { ...mkCourse('c1'), teacher };
    const result  = computeMetrics({
      solution: { 'c1_0': { day: 0, slot: 2, roomId: 'r1' } },
      courses: [course],
      classrooms: [mkRoom()],
      students: [],
    });
    expect(result.prefPct).toBe(100);
  });
});

// ── studentConflicts ──────────────────────────────────────────────────────────

describe('computeMetrics — conflictos de estudiantes', () => {
  it('0 conflictos cuando cursos del estudiante están en días distintos', () => {
    const student = mkStudent('s1', ['c1', 'c2']);
    const result  = computeMetrics({
      solution: {
        'c1_0': { day: 0, slot: 2, roomId: 'r1' },
        'c2_0': { day: 1, slot: 2, roomId: 'r2' },
      },
      courses: [mkCourse('c1'), mkCourse('c2', 't2')],
      classrooms: [mkRoom(), mkRoom('r2')],
      students: [student],
    });
    expect(result.studentConflicts).toBe(0);
  });

  it('detecta conflicto cuando dos cursos del estudiante coinciden en día y slot', () => {
    const student = mkStudent('s1', ['c1', 'c2']);
    const result  = computeMetrics({
      solution: {
        'c1_0': { day: 0, slot: 2, roomId: 'r1' },
        'c2_0': { day: 0, slot: 2, roomId: 'r2' }, // mismo día y slot
      },
      courses: [mkCourse('c1'), mkCourse('c2', 't2')],
      classrooms: [mkRoom(), mkRoom('r2')],
      students: [student],
    });
    expect(result.studentConflicts).toBeGreaterThan(0);
  });

  it('0 conflictos cuando el estudiante no comparte cursos con la solución', () => {
    const student = mkStudent('s1', ['c99']); // curso que no está en la solución
    const result  = computeMetrics({
      solution: { 'c1_0': { day: 0, slot: 2, roomId: 'r1' } },
      courses: [mkCourse('c1')],
      classrooms: [mkRoom()],
      students: [student],
    });
    expect(result.studentConflicts).toBe(0);
  });
});

// ── roomUtil ──────────────────────────────────────────────────────────────────

describe('computeMetrics — utilización de aulas (roomUtil)', () => {
  it('calcula roomUtil correctamente: bloques asignados / (aulas × días × slots)', () => {
    const course = mkCourse('c1'); // blocksPerSession = 1
    const result = computeMetrics({
      solution: { 'c1_0': { day: 0, slot: 0, roomId: 'r1' } },
      courses: [course],
      classrooms: [mkRoom()],
      students: [],
    });
    // 1 bloque / (1 aula × 5 días × 12 slots) = 1/60 ≈ 2%
    expect(result.roomUtil).toBe(Math.round(1 / 60 * 100));
  });

  it('roomUtil = 0 cuando no hay sesiones asignadas', () => {
    const result = computeMetrics({
      solution: {},
      courses: [mkCourse('c1')],
      classrooms: [mkRoom()],
      students: [],
    });
    expect(result.roomUtil).toBe(0);
  });
});

// ── heat matrix ───────────────────────────────────────────────────────────────

describe('computeMetrics — matriz heat', () => {
  it('retorna matriz de 5 días × 12 slots', () => {
    const course = mkCourse('c1');
    const result = computeMetrics({
      solution: { 'c1_0': { day: 2, slot: 3, roomId: 'r1' } },
      courses: [course],
      classrooms: [mkRoom()],
      students: [],
    });
    expect(result.heat).toHaveLength(5);
    result.heat.forEach(row => expect(row).toHaveLength(12));
  });

  it('la celda correspondiente al bloque asignado vale 1', () => {
    const course = mkCourse('c1');
    const result = computeMetrics({
      solution: { 'c1_0': { day: 2, slot: 3, roomId: 'r1' } },
      courses: [course],
      classrooms: [mkRoom()],
      students: [],
    });
    expect(result.heat[2][3]).toBe(1);
  });

  it('celdas sin asignación valen 0', () => {
    const course = mkCourse('c1');
    const result = computeMetrics({
      solution: { 'c1_0': { day: 2, slot: 3, roomId: 'r1' } },
      courses: [course],
      classrooms: [mkRoom()],
      students: [],
    });
    expect(result.heat[0][0]).toBe(0);
    expect(result.heat[4][11]).toBe(0);
  });

  it('dos bloques en la misma celda incrementan el valor a 2', () => {
    const c1 = mkCourse('c1', 't1', { sessionsPerWeek: 2 });
    const result = computeMetrics({
      solution: {
        'c1_0': { day: 0, slot: 0, roomId: 'r1' },
        'c1_1': { day: 0, slot: 0, roomId: 'r2' },
      },
      courses: [c1],
      classrooms: [mkRoom(), mkRoom('r2')],
      students: [],
    });
    expect(result.heat[0][0]).toBe(2);
  });
});

// ── balanceScore ──────────────────────────────────────────────────────────────

describe('computeMetrics — balanceScore', () => {
  it('retorna 10 (máximo) cuando no hay estudiantes', () => {
    const course = mkCourse('c1');
    const result = computeMetrics({
      solution: { 'c1_0': { day: 0, slot: 2, roomId: 'r1' } },
      courses: [course],
      classrooms: [mkRoom()],
      students: [],
    });
    expect(result.balanceScore).toBe(10);
  });

  it('balanceScore está en el rango [0, 10]', () => {
    const student = mkStudent('s1', ['c1', 'c2']);
    const result  = computeMetrics({
      solution: {
        'c1_0': { day: 0, slot: 2, roomId: 'r1' },
        'c2_0': { day: 0, slot: 4, roomId: 'r2' },
      },
      courses: [mkCourse('c1'), mkCourse('c2', 't2')],
      classrooms: [mkRoom(), mkRoom('r2')],
      students: [student],
    });
    expect(result.balanceScore).toBeGreaterThanOrEqual(0);
    expect(result.balanceScore).toBeLessThanOrEqual(10);
  });
});
