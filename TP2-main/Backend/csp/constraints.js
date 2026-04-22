export function hasConflict(v1, a1, v2, a2) {
  const c1 = v1.course;
  const c2 = v2.course;

  if (a1.day !== a2.day) return false;

  const s1End = a1.slot + c1.blocksPerSession;
  const s2End = a2.slot + c2.blocksPerSession;
  const overlap = a1.slot < s2End && a2.slot < s1End;
  if (!overlap) return false;

  if (c1.teacher._id.toString() === c2.teacher._id.toString()) return true;
  if (a1.roomId === a2.roomId) return true;
  if (shareStudents(c1._id.toString(), c2._id.toString(), v1.studentMap)) return true;

  return false;
}

export function sameCourseConflict(v1, a1, v2, a2) {
  return v1.courseId === v2.courseId && a1.day === a2.day;
}

function shareStudents(cId1, cId2, studentMap) {
  if (!studentMap) return false;
  if (cId1 === cId2)  return true;
  const s1 = studentMap[cId1];
  const s2 = studentMap[cId2];
  if (!s1 || !s2) return false;
  for (const id of s1) { if (s2.has(id)) return true; }
  return false;
}

export function buildStudentMap(students) {
  const map = {};
  for (const student of students) {
    for (const courseId of student.courses) {
      const key = courseId.toString();
      if (!map[key]) map[key] = new Set();
      map[key].add(student._id.toString());
    }
  }
  return map;
}
