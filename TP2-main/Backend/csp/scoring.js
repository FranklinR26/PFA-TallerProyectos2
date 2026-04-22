const DAYS_COUNT  = 5;
const SLOTS_COUNT = 12;

export function scoreSolution(assignment, variables, students, weights) {
  const W = weights;
  let score = 0;

  for (const v of variables) {
    const a = assignment[v.id];
    if (!a) continue;
    const teacher = v.course.teacher;
    for (let k = 0; k < v.course.blocksPerSession; k++) {
      if (teacher.availability[a.day]?.[a.slot + k] === 2) {
        score += W.pref;
      }
    }
  }

  for (const student of students) {
    const courseIdSet = new Set(student.courses.map(id => id.toString()));
    const dayLoad     = Array(DAYS_COUNT).fill(0);

    for (const v of variables) {
      const a = assignment[v.id];
      if (!a || !courseIdSet.has(v.courseId)) continue;
      dayLoad[a.day] += v.course.blocksPerSession;
    }

    const total = dayLoad.reduce((x, y) => x + y, 0);
    if (total === 0) continue;
    const avg      = total / DAYS_COUNT;
    const variance = dayLoad.reduce((s, x) => s + (x - avg) ** 2, 0) / DAYS_COUNT;
    score -= variance * W.balance;
  }

  for (const student of students) {
    const courseIdSet = new Set(student.courses.map(id => id.toString()));
    for (let d = 0; d < DAYS_COUNT; d++) {
      const busy = Array(SLOTS_COUNT).fill(false);
      for (const v of variables) {
        const a = assignment[v.id];
        if (!a || a.day !== d || !courseIdSet.has(v.courseId)) continue;
        for (let k = 0; k < v.course.blocksPerSession; k++) {
          busy[a.slot + k] = true;
        }
      }
      const first = busy.indexOf(true);
      const last  = busy.lastIndexOf(true);
      if (first === -1) continue;
      for (let i = first; i <= last; i++) {
        if (!busy[i]) score -= W.gaps;
      }
    }
  }

  const daysByCourse = {};
  for (const v of variables) {
    const a = assignment[v.id];
    if (!a) continue;
    if (!daysByCourse[v.courseId]) daysByCourse[v.courseId] = new Set();
    if (daysByCourse[v.courseId].has(a.day)) {
      score -= W.spread * 3;
    }
    daysByCourse[v.courseId].add(a.day);
  }

  for (const v of variables) {
    const a = assignment[v.id];
    if (!a) continue;
    for (let k = 0; k < v.course.blocksPerSession; k++) {
      const hour = 8 + a.slot + k;
      if (hour < 9 || hour >= 17) score -= W.core * 0.5;
    }
  }

  return score;
}
