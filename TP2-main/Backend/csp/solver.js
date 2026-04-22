import { buildVariables, buildDomain } from './variables.js';
import { hasConflict, sameCourseConflict, buildStudentMap } from './constraints.js';
import { scoreSolution } from './scoring.js';

export function runSolver({ courses, classrooms, students, weights, params }) {
  const variables = buildVariables(courses);
  if (variables.length === 0) {
    return { ok: false, reason: 'No hay sesiones que programar' };
  }

  const studentMap = buildStudentMap(students);
  for (const v of variables) {
    v.studentMap = studentMap;
  }

  const baseDomains = {};
  for (const v of variables) {
    baseDomains[v.id] = buildDomain(v, classrooms);
    if (baseDomains[v.id].length === 0) {
      return {
        ok: false,
        reason: `Sin dominio válido para "${v.course.name}" (sesión ${v.sessionIdx + 1}). ` +
                `Verifica disponibilidad del docente y aulas compatibles.`,
      };
    }
  }

  const deadline   = Date.now() + (params.timeout ?? 5000);
  const maxNodes   = params.maxNodes ?? 200_000;
  let   nodesTotal = 0;
  let   best       = null;

  function runOnce(shuffleSeed) {
    const assignment = {};

    const curDom = {};
    for (const v of variables) {
      const dom = baseDomains[v.id].slice();
      for (let i = dom.length - 1; i > 0; i--) {
        const j = Math.floor((Math.abs(Math.sin(shuffleSeed * 9301 + i * 49297)) % 1) * (i + 1));
        [dom[i], dom[j]] = [dom[j], dom[i]];
      }
      curDom[v.id] = dom;
    }

    function forwardCheck(assignedVar, assignedVal) {
      const pruned = {};
      for (const v2 of variables) {
        if (assignment[v2.id] !== undefined) continue;
        if (v2.id === assignedVar.id)         continue;

        const before = curDom[v2.id];
        const after  = before.filter(a2 => {
          if (hasConflict(assignedVar, assignedVal, v2, a2))       return false;
          if (sameCourseConflict(assignedVar, assignedVal, v2, a2)) return false;
          return true;
        });

        if (after.length === 0) return null;
        pruned[v2.id] = before;
        curDom[v2.id] = after;
      }
      return pruned;
    }

    function undoFC(pruned) {
      if (!pruned) return;
      for (const [id, dom] of Object.entries(pruned)) {
        curDom[id] = dom;
      }
    }

    function selectUnassigned() {
      let best = null, bestSize = Infinity;
      for (const v of variables) {
        if (assignment[v.id] !== undefined) continue;
        const sz = curDom[v.id].length;
        if (sz < bestSize) { bestSize = sz; best = v; }
      }
      return best;
    }

    function orderValues(v) {
      return curDom[v.id].slice().sort((a, b) => {
        const pa = v.course.teacher.availability[a.day][a.slot] === 2 ? 1 : 0;
        const pb = v.course.teacher.availability[b.day][b.slot] === 2 ? 1 : 0;
        return pb - pa;
      });
    }

    function bt() {
      if (nodesTotal >= maxNodes)  return 'LIMIT';
      if (Date.now()  >= deadline) return 'TIMEOUT';

      const v = selectUnassigned();
      if (!v) {
        const score = scoreSolution(assignment, variables, students, weights);
        if (!best || score > best.score) {
          best = {
            assignment: JSON.parse(JSON.stringify(assignment)),
            score,
          };
        }
        return 'FOUND';
      }

      for (const val of orderValues(v)) {
        nodesTotal++;
        if (nodesTotal >= maxNodes || Date.now() >= deadline) return 'LIMIT';

        assignment[v.id] = val;
        const pruned = forwardCheck(v, val);

        if (pruned !== null) {
          const result = bt();
          undoFC(pruned);
          if (result === 'TIMEOUT' || result === 'LIMIT') return result;
        }

        delete assignment[v.id];
      }

      return 'BACKTRACK';
    }

    bt();
  }

  const restarts = params.restarts ?? 3;
  for (let r = 0; r < restarts; r++) {
    if (Date.now() >= deadline) break;
    runOnce(r);
  }

  const timeMs = Date.now() - (deadline - (params.timeout ?? 5000));

  if (best) {
    return {
      ok:         true,
      assignment: best.assignment,
      score:      best.score,
      nodes:      nodesTotal,
      timeMs,
    };
  }

  return {
    ok:     false,
    reason: 'No se encontró solución factible dentro del tiempo y nodos permitidos.',
    nodes:  nodesTotal,
    timeMs: params.timeout,
  };
}
