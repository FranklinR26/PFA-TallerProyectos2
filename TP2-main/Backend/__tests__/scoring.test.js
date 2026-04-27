/**
 * TDD — scoring.js
 *
 * CICLO RED-GREEN-REFACTOR:
 *  RED:    Se definieron los contratos de cada criterio de optimización:
 *          pref, spread, core, gaps, balance — antes de correr los tests.
 *  GREEN:  scoreSolution implementa los cinco criterios con sus pesos.
 *  REFACTOR: Se añadieron comparaciones relativas (mejor > peor) para
 *            hacer los tests independientes de valores absolutos de pesos.
 */

import { describe, it, expect } from 'vitest';
import { scoreSolution } from '../csp/scoring.js';

// ── Factories ────────────────────────────────────────────────────────────────

const mkId = (str) => ({ toString: () => str });

const mkTeacher = (id, avail) => ({
  _id: mkId(id),
  availability: avail ?? Array(5).fill(null).map(() => Array(12).fill(1)),
});

const mkCourse = (id, teacherId, blocks = 1, avail = null) => ({
  _id: mkId(id),
  teacher: mkTeacher(teacherId, avail),
  blocksPerSession: blocks,
});

const mkVar = (id, courseId, teacherId, blocks = 1, avail = null) => ({
  id,
  courseId,
  course: mkCourse(courseId, teacherId, blocks, avail),
});

const W = { pref: 5, balance: 4, gaps: 6, spread: 7, core: 3 };

// ── Casos base ────────────────────────────────────────────────────────────────

describe('scoreSolution — casos base', () => {
  it('retorna 0 para asignación vacía sin variables ni estudiantes', () => {
    expect(scoreSolution({}, [], [], W)).toBe(0);
  });

  it('ignora variables sin asignación (assignment[v.id] === undefined)', () => {
    const v = mkVar('c1_0', 'c1', 't1');
    const score = scoreSolution({}, [v], [], W);
    expect(score).toBe(0);
  });
});

// ── Criterio PREF ─────────────────────────────────────────────────────────────

describe('scoreSolution — criterio pref (preferencia docente)', () => {
  it('suma W.pref por cada bloque en slot preferido (availability=2)', () => {
    const avail = Array(5).fill(null).map(() => Array(12).fill(1));
    avail[0][1] = 2;
    avail[0][2] = 2; // slot 1 y 2 preferidos
    const v = mkVar('c1_0', 'c1', 't1', 2, avail); // 2 bloques desde slot 1
    const assignment = { 'c1_0': { day: 0, slot: 1, roomId: 'r1' } };
    const score = scoreSolution(assignment, [v], [], W);
    // 2 bloques × 5 (pref) = +10; ambos slots dentro del horario núcleo (9-16) → sin penalización
    expect(score).toBeGreaterThanOrEqual(10);
  });

  it('no suma pref cuando availability=1 (disponible, no preferido)', () => {
    const v = mkVar('c1_0', 'c1', 't1', 1);
    const assignment = { 'c1_0': { day: 0, slot: 2, roomId: 'r1' } };
    // slot 2 en día 0 está dentro del horario núcleo, sin pref → score ≤ 0
    const score = scoreSolution(assignment, [v], [], W);
    expect(score).toBeLessThanOrEqual(0);
  });

  it('slot preferido da mayor puntaje que slot no preferido en las mismas condiciones', () => {
    const avail = Array(5).fill(null).map(() => Array(12).fill(1));
    avail[0][2] = 2;
    const vPref    = mkVar('c1_0', 'c1', 't1', 1, avail);
    const vNoPref  = mkVar('c1_0', 'c1', 't1', 1);
    const a = { 'c1_0': { day: 0, slot: 2, roomId: 'r1' } };
    expect(scoreSolution(a, [vPref], [], W)).toBeGreaterThan(scoreSolution(a, [vNoPref], [], W));
  });
});

// ── Criterio SPREAD ───────────────────────────────────────────────────────────

describe('scoreSolution — criterio spread (distribución de sesiones)', () => {
  it('penaliza cuando el mismo curso tiene dos sesiones en el mismo día', () => {
    const v1 = mkVar('c1_0', 'c1', 't1', 1);
    const v2 = mkVar('c1_1', 'c1', 't1', 1);
    const assignment = {
      'c1_0': { day: 0, slot: 2, roomId: 'r1' },
      'c1_1': { day: 0, slot: 5, roomId: 'r2' }, // mismo día
    };
    const score = scoreSolution(assignment, [v1, v2], [], W);
    expect(score).toBeLessThan(0);
  });

  it('no penaliza spread cuando las sesiones del mismo curso están en días distintos', () => {
    const v1 = mkVar('c1_0', 'c1', 't1', 1);
    const v2 = mkVar('c1_1', 'c1', 't1', 1);
    const sameDayAssign = {
      'c1_0': { day: 0, slot: 2, roomId: 'r1' },
      'c1_1': { day: 0, slot: 5, roomId: 'r2' },
    };
    const diffDayAssign = {
      'c1_0': { day: 0, slot: 2, roomId: 'r1' },
      'c1_1': { day: 1, slot: 2, roomId: 'r2' },
    };
    const scoreSame = scoreSolution(sameDayAssign, [v1, v2], [], W);
    const scoreDiff = scoreSolution(diffDayAssign, [v1, v2], [], W);
    expect(scoreDiff).toBeGreaterThan(scoreSame);
  });
});

// ── Criterio CORE ─────────────────────────────────────────────────────────────

describe('scoreSolution — criterio core (horario núcleo 9-17)', () => {
  it('penaliza bloques antes de las 9am (slot 0 = 8am)', () => {
    const v = mkVar('c1_0', 'c1', 't1', 1);
    const score = scoreSolution({ 'c1_0': { day: 0, slot: 0, roomId: 'r1' } }, [v], [], W);
    expect(score).toBeLessThan(0);
  });

  it('no penaliza bloques dentro del horario núcleo (slot 1 = 9am)', () => {
    const v = mkVar('c1_0', 'c1', 't1', 1);
    // slot 1 → 8+1=9am (núcleo), sin pref → penalización core = 0
    const score = scoreSolution({ 'c1_0': { day: 0, slot: 1, roomId: 'r1' } }, [v], [], W);
    expect(score).toBe(0);
  });

  it('horario dentro del núcleo tiene mayor puntaje que fuera del núcleo', () => {
    const v = mkVar('c1_0', 'c1', 't1', 1);
    const scoreCore    = scoreSolution({ 'c1_0': { day: 0, slot: 2, roomId: 'r1' } }, [v], [], W);
    const scoreOffCore = scoreSolution({ 'c1_0': { day: 0, slot: 0, roomId: 'r1' } }, [v], [], W);
    expect(scoreCore).toBeGreaterThan(scoreOffCore);
  });
});

// ── Criterio GAPS ─────────────────────────────────────────────────────────────

describe('scoreSolution — criterio gaps (huecos en el día del estudiante)', () => {
  it('penaliza huecos entre sesiones de un estudiante en el mismo día', () => {
    const student = { _id: mkId('s1'), courses: [mkId('c1'), mkId('c2')] };
    const v1 = mkVar('c1_0', 'c1', 't1', 1);
    const v2 = mkVar('c2_0', 'c2', 't2', 1);
    const withGap = {
      'c1_0': { day: 0, slot: 1, roomId: 'r1' },
      'c2_0': { day: 0, slot: 4, roomId: 'r2' }, // 2 slots de hueco entre 1 y 4
    };
    const noGap = {
      'c1_0': { day: 0, slot: 1, roomId: 'r1' },
      'c2_0': { day: 0, slot: 2, roomId: 'r2' }, // adyacentes, sin hueco
    };
    const scoreGap   = scoreSolution(withGap, [v1, v2], [student], W);
    const scoreNoGap = scoreSolution(noGap,   [v1, v2], [student], W);
    expect(scoreNoGap).toBeGreaterThan(scoreGap);
  });

  it('no penaliza si el estudiante solo tiene un bloque por día', () => {
    const student = { _id: mkId('s1'), courses: [mkId('c1')] };
    const v = mkVar('c1_0', 'c1', 't1', 1);
    const score1 = scoreSolution({ 'c1_0': { day: 0, slot: 2, roomId: 'r1' } }, [v], [student], W);
    const score2 = scoreSolution({ 'c1_0': { day: 0, slot: 8, roomId: 'r1' } }, [v], [student], W);
    // sin hueco en ambos casos → diferencia solo por core
    const gapPenalty = 0;
    expect(score1 - score2).toBeCloseTo(gapPenalty, 0);
  });
});

// ── Criterio BALANCE ──────────────────────────────────────────────────────────

describe('scoreSolution — criterio balance (carga diaria uniforme)', () => {
  it('penaliza cuando todas las clases del estudiante están en un solo día', () => {
    const student = { _id: mkId('s1'), courses: [mkId('c1'), mkId('c2')] };
    const v1 = mkVar('c1_0', 'c1', 't1', 1);
    const v2 = mkVar('c2_0', 'c2', 't2', 1);
    const concentrated = {
      'c1_0': { day: 0, slot: 2, roomId: 'r1' },
      'c2_0': { day: 0, slot: 4, roomId: 'r2' },
    };
    const spread = {
      'c1_0': { day: 0, slot: 2, roomId: 'r1' },
      'c2_0': { day: 2, slot: 2, roomId: 'r2' },
    };
    const scoreConc   = scoreSolution(concentrated, [v1, v2], [student], W);
    const scoreSpread = scoreSolution(spread,        [v1, v2], [student], W);
    expect(scoreSpread).toBeGreaterThan(scoreConc);
  });
});
