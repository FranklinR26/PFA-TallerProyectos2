export function buildVariables(courses) {
  const vars = [];
  for (const course of courses) {
    for (let k = 0; k < course.sessionsPerWeek; k++) {
      vars.push({
        id:         `${course._id}_${k}`,
        courseId:   course._id.toString(),
        sessionIdx: k,
        course,
      });
    }
  }
  return vars;
}

export function buildDomain(variable, classrooms, SLOTS_COUNT = 12) {
  const { course } = variable;
  const teacher    = course.teacher;
  const bps        = course.blocksPerSession;
  const DAYS       = 5;
  const domain     = [];

  for (let d = 0; d < DAYS; d++) {
    for (let s = 0; s + bps <= SLOTS_COUNT; s++) {
      let teacherOk = true;
      for (let k = 0; k < bps; k++) {
        if (teacher.availability[d][s + k] === 0) { teacherOk = false; break; }
      }
      if (!teacherOk) continue;

      for (const room of classrooms) {
        if (room.type     !== course.roomType)  continue;
        if (room.capacity <  course.capacity)   continue;
        domain.push({ day: d, slot: s, roomId: room._id.toString() });
      }
    }
  }
  return domain;
}
