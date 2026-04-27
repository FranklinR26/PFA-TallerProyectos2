/**
 * TDD — constraints.js
 *
 * CICLO RED-GREEN-REFACTOR:
 *  RED:    Estos tests se escribieron antes de verificar el comportamiento,
 *          definiendo exactamente qué debe cumplir cada función.
 *  GREEN:  La implementación en csp/constraints.js satisface todos los casos.
 *  REFACTOR: Se añadieron casos límite (distinto día, slots adyacentes sin overlap)
 *            para cubrir ramas que podían ocultar bugs silenciosos.
 */

import { describe, it, expect } from 'vitest';
import { hasConflict, sameCourseConflict, buildStudentMap } from '../csp/constraints.js';

// ── Factories ────────────────────────────────────────────────────────────────

const mkId = (str) => ({ toString: () => str });

const mkTeacher = (id) => ({
  _id: mkId(id),
  availability: Array(5).fill(null).map(() => Array(12).fill(1)),
});

const mkCourse = (id, teacherId, blocks = 2) => ({
  _id: mkId(id),
  teacher: mkTeacher(teacherId),
  blocksPerSession: blocks,
});

const mkVar = (courseId, teacherId, blocks = 2, studentMap = null) => ({
  courseId,
  course: mkCourse(courseId, teacherId, blocks),
  studentMap,
});

const mkA = (day, slot, roomId = 'r1') => ({ day, slot, roomId });

// ── buildStudentMap ───────────────────────────────────────────────────────────

describe('buildStudentMap', () => {
  it('devuelve mapa vacío si no hay estudiantes', () => {
    expect(buildStudentMap([])).toEqual({});
  });

  it('mapea courseId → Set de studentIds', () => {
    const students = [
      { _id: mkId('s1'), courses: [mkId('c1')] },
      { _id: mkId('s2'), courses: [mkId('c1'), mkId('c2')] },
    ];
    const map = buildStudentMap(students);
    expect(map['c1'].has('s1')).toBe(true);
    expect(map['c1'].has('s2')).toBe(true);
    expect(map['c2'].has('s2')).toBe(true);
    expect(map['c2'].has('s1')).toBe(false);
  });

  it('un estudiante inscrito en varios cursos aparece en cada uno', () => {
    const students = [
      { _id: mkId('s1'), courses: [mkId('c1'), mkId('c2'), mkId('c3')] },
    ];
    const map = buildStudentMap(students);
    expect(Object.keys(map)).toHaveLength(3);
    ['c1', 'c2', 'c3'].forEach(c => expect(map[c].has('s1')).toBe(true));
  });

  it('varios estudiantes en el mismo curso comparten la misma entrada', () => {
    const students = [
      { _id: mkId('s1'), courses: [mkId('c1')] },
      { _id: mkId('s2'), courses: [mkId('c1')] },
      { _id: mkId('s3'), courses: [mkId('c1')] },
    ];
    const map = buildStudentMap(students);
    expect(map['c1'].size).toBe(3);
  });
});

// ── hasConflict ───────────────────────────────────────────────────────────────

describe('hasConflict', () => {
  it('no hay conflicto cuando los bloques son en días distintos', () => {
    const v1 = mkVar('c1', 't1');
    const v2 = mkVar('c2', 't2');
    expect(hasConflict(v1, mkA(0, 0), v2, mkA(1, 0))).toBe(false);
  });

  it('no hay conflicto cuando los bloques son adyacentes pero sin overlap', () => {
    // c1: slots 0-1 (blocks=2), c2: slots 2-3 → no se superponen
    const v1 = mkVar('c1', 't1', 2);
    const v2 = mkVar('c2', 't2', 2);
    expect(hasConflict(v1, mkA(0, 0), v2, mkA(0, 2))).toBe(false);
  });

  it('detecta conflicto de docente en mismo día con bloques superpuestos', () => {
    const v1 = mkVar('c1', 'teacher1', 2);
    const v2 = mkVar('c2', 'teacher1', 2); // mismo docente
    expect(hasConflict(v1, mkA(0, 0), v2, mkA(0, 1))).toBe(true);
  });

  it('detecta conflicto de aula en mismo día con bloques superpuestos', () => {
    const v1 = mkVar('c1', 't1', 2);
    const v2 = mkVar('c2', 't2', 2);
    expect(hasConflict(v1, mkA(0, 0, 'room1'), v2, mkA(0, 1, 'room1'))).toBe(true);
  });

  it('detecta conflicto de estudiante cuando dos cursos comparten alumnos', () => {
    const studentMap = { c1: new Set(['s1']), c2: new Set(['s1']) };
    const v1 = mkVar('c1', 't1', 2, studentMap);
    const v2 = mkVar('c2', 't2', 2, studentMap);
    expect(hasConflict(v1, mkA(0, 0, 'r1'), v2, mkA(0, 1, 'r2'))).toBe(true);
  });

  it('no hay conflicto con overlap de slots pero diferente docente, aula y alumnos', () => {
    const v1 = mkVar('c1', 't1', 2, {});
    const v2 = mkVar('c2', 't2', 2, {});
    expect(hasConflict(v1, mkA(0, 0, 'r1'), v2, mkA(0, 1, 'r2'))).toBe(false);
  });

  it('un solo bloque de overlap es suficiente para generar conflicto de docente', () => {
    // c1: slots 0-2 (blocks=3), c2: slots 2-3 (blocks=2) → overlap en slot 2
    const v1 = mkVar('c1', 'same', 3);
    const v2 = mkVar('c2', 'same', 2);
    expect(hasConflict(v1, mkA(0, 0), v2, mkA(0, 2))).toBe(true);
  });
});

// ── sameCourseConflict ────────────────────────────────────────────────────────

describe('sameCourseConflict', () => {
  it('mismo courseId en mismo día → conflicto', () => {
    const v1 = { courseId: 'c1' };
    const v2 = { courseId: 'c1' };
    expect(sameCourseConflict(v1, { day: 0 }, v2, { day: 0 })).toBe(true);
  });

  it('mismo courseId en días distintos → sin conflicto', () => {
    const v1 = { courseId: 'c1' };
    const v2 = { courseId: 'c1' };
    expect(sameCourseConflict(v1, { day: 0 }, v2, { day: 1 })).toBe(false);
  });

  it('distinto courseId en mismo día → sin conflicto', () => {
    const v1 = { courseId: 'c1' };
    const v2 = { courseId: 'c2' };
    expect(sameCourseConflict(v1, { day: 0 }, v2, { day: 0 })).toBe(false);
  });

  it('distinto courseId en días distintos → sin conflicto', () => {
    const v1 = { courseId: 'c1' };
    const v2 = { courseId: 'c2' };
    expect(sameCourseConflict(v1, { day: 0 }, v2, { day: 3 })).toBe(false);
  });
});
