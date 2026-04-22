import { buildVariables } from './variables.js';

const DAYS  = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
const SLOTS = 12;

export function computeMetrics({ solution, courses, classrooms, students }) {
  if (!solution) return null;

  const variables = buildVariables(courses);
  const assigned  = variables.filter(v => solution[v.id]);

  let prefHits = 0, totalBlocks = 0;
  for (const v of assigned) {
    const a = solution[v.id];
    const t = v.course.teacher;
    for (let k = 0; k < v.course.blocksPerSession; k++) {
      totalBlocks++;
      if (t.availability[a.day]?.[a.slot + k] === 2) prefHits++;
    }
  }
  const prefPct = totalBlocks ? Math.round(prefHits / totalBlocks * 100) : 0;

  let totalGaps = 0;
  for (const st of students) {
    const courseIdSet = new Set(st.courses.map(id => id.toString()));
    for (let d = 0; d < 5; d++) {
      const busy = Array(SLOTS).fill(false);
      for (const v of assigned) {
        const a = solution[v.id];
        if (a.day !== d || !courseIdSet.has(v.courseId)) continue;
        for (let k = 0; k < v.course.blocksPerSession; k++) busy[a.slot + k] = true;
      }
      const first = busy.indexOf(true);
      const last  = busy.lastIndexOf(true);
      if (first === -1) continue;
      for (let i = first; i <= last; i++) if (!busy[i]) totalGaps++;
    }
  }
  const avgGaps = students.length ? (totalGaps / students.length).toFixed(2) : '0';

  const totalClassroomSlots = classrooms.length * 5 * SLOTS;
  const occupiedSlots       = assigned.reduce((s, v) => s + v.course.blocksPerSession, 0);
  const roomUtil            = totalClassroomSlots
    ? Math.round(occupiedSlots / totalClassroomSlots * 100) : 0;

  const sectionMap = {};
  for (const st of students) {
    if (!st.section) continue;
    const sid = st.section.toString();
    if (!sectionMap[sid]) sectionMap[sid] = [];
    sectionMap[sid].push(st);
  }
  let varianceSum = 0, sectionsCount = 0;
  for (const mates of Object.values(sectionMap)) {
    const dayLoad = Array(5).fill(0);
    for (const m of mates) {
      const courseIdSet = new Set(m.courses.map(id => id.toString()));
      for (const v of assigned) {
        const a = solution[v.id];
        if (!courseIdSet.has(v.courseId)) continue;
        dayLoad[a.day] += v.course.blocksPerSession;
      }
    }
    const avg      = dayLoad.reduce((x, y) => x + y, 0) / 5;
    const variance = dayLoad.reduce((s, x) => s + (x - avg) ** 2, 0) / 5;
    varianceSum += Math.sqrt(variance);
    sectionsCount++;
  }
  const balanceScore = sectionsCount
    ? (10 - Math.min(10, varianceSum / sectionsCount)).toFixed(1) : '10';

  let studentConflicts = 0;
  for (const st of students) {
    const courseIdSet = new Set(st.courses.map(id => id.toString()));
    const busy        = {};
    for (const v of assigned) {
      const a = solution[v.id];
      if (!courseIdSet.has(v.courseId)) continue;
      for (let k = 0; k < v.course.blocksPerSession; k++) {
        const key = `${a.day}-${a.slot + k}`;
        if (busy[key]) studentConflicts++;
        busy[key] = true;
      }
    }
  }

  let ocSum = 0;
  for (const c of courses) {
    const enrolled = students.filter(s =>
      s.courses.some(id => id.toString() === c._id.toString())
    ).length;
    ocSum += enrolled / (c.capacity || 1);
  }
  const courseFill = courses.length ? Math.round(ocSum / courses.length * 100) : 0;

  const heat = Array.from({ length: 5 }, () => Array(SLOTS).fill(0));
  for (const v of assigned) {
    const a = solution[v.id];
    for (let k = 0; k < v.course.blocksPerSession; k++) {
      heat[a.day][a.slot + k]++;
    }
  }

  const totalVars   = buildVariables(courses).length;
  const coveragePct = totalVars ? Math.round(assigned.length / totalVars * 100) : 0;

  return {
    prefPct,
    avgGaps:          parseFloat(avgGaps),
    roomUtil,
    balanceScore:     parseFloat(balanceScore),
    studentConflicts,
    courseFill,
    coveragePct,
    assignedCount:    assigned.length,
    totalVars,
    heat,
    days: DAYS,
  };
}
