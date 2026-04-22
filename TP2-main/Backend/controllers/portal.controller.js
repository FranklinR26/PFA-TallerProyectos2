import { Student }  from '../models/Student.js';
import { Course }   from '../models/Course.js';
import { Schedule } from '../models/Schedule.js';
import { Teacher }  from '../models/Teacher.js';

function sessionSlots(courseId, solution, courses) {
  if (!solution) return [];
  const course = courses.find(c => c._id.toString() === courseId.toString());
  if (!course) return [];
  const sessions = [];
  for (let k = 0; k < course.sessionsPerWeek; k++) {
    const key = `${course._id}_${k}`;
    const a   = solution[key];
    if (a) sessions.push({ ...a, blocks: course.blocksPerSession });
  }
  return sessions;
}

function detectConflict(studentCourseIds, candidateId, solution, courses) {
  if (!solution) return null;
  const candSessions = sessionSlots(candidateId, solution, courses);
  for (const enrolledId of studentCourseIds) {
    const enrolledSessions = sessionSlots(enrolledId, solution, courses);
    for (const a of candSessions) {
      for (const b of enrolledSessions) {
        if (a.day !== b.day) continue;
        if (a.slot < b.slot + b.blocks && b.slot < a.slot + a.blocks) {
          const other = courses.find(c => c._id.toString() === enrolledId.toString());
          const DAYS  = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
          const SLOTS = Array.from({ length: 12 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`);
          return `Choca con "${other?.name}" el ${DAYS[a.day]} ${SLOTS[a.slot]}`;
        }
      }
    }
  }
  return null;
}

export const getPortalData = async (req, res) => {
  try {
    // Docente: devuelve su horario de clases
    if (req.user.role === 'docente') {
      const teacherId = req.user.entityId;
      if (!teacherId) return res.status(400).json({ message: 'Docente sin entidad asignada' });

      const [teacher, courses, schedule] = await Promise.all([
        Teacher.findById(teacherId),
        Course.find({ teacher: teacherId }),
        Schedule.findOne({ isActive: true }).lean(),
      ]);
      if (!teacher) return res.status(404).json({ message: 'Docente no encontrado' });

      const solution = schedule
        ? (schedule.solution instanceof Map
            ? Object.fromEntries(schedule.solution)
            : schedule.solution)
        : null;

      const DAYS  = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
      const SLOTS = Array.from({ length: 12 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`);

      const teacherGrid = {};
      const sessionList = [];
      for (const c of courses) {
        for (let k = 0; k < c.sessionsPerWeek; k++) {
          const key = `${c._id}_${k}`;
          const a   = solution?.[key];
          if (a) {
            for (let b = 0; b < c.blocksPerSession; b++) {
              teacherGrid[`${a.day}-${a.slot + b}`] = {
                courseName: c.name, courseId: c._id,
                teacher: teacher.name,
              };
            }
            sessionList.push({
              courseName: c.name, day: a.day, slot: a.slot,
              blocks: c.blocksPerSession,
              label: `${DAYS[a.day]} ${SLOTS[a.slot]}`,
            });
          }
        }
      }

      return res.json({
        role: 'docente',
        teacher: { _id: teacher._id, name: teacher.name, availability: teacher.availability },
        courses: courses.map(c => ({ _id: c._id, name: c.name, sessionsPerWeek: c.sessionsPerWeek })),
        sessionList,
        personalGrid: teacherGrid,
        hasSchedule: !!solution,
        totalBlocks: sessionList.reduce((s, e) => s + e.blocks, 0),
      });
    }

    const studentId = req.user.entityId;
    if (!studentId) {
      return res.status(400).json({ message: 'Usuario sin entidad de estudiante asignada' });
    }

    const [student, courses, schedule] = await Promise.all([
      Student.findById(studentId).populate('section', 'name'),
      Course.find().populate('teacher', 'name'),
      Schedule.findOne({ isActive: true }).lean(),
    ]);

    if (!student) return res.status(404).json({ message: 'Estudiante no encontrado' });

    const solution = schedule
      ? (schedule.solution instanceof Map
          ? Object.fromEntries(schedule.solution)
          : schedule.solution)
      : null;

    const enrollmentMap = {};
    for (const c of courses) {
      enrollmentMap[c._id.toString()] = await Student.countDocuments({ courses: c._id });
    }

    const enrolledIds = new Set(student.courses.map(id => id.toString()));
    const waitlistIds = new Set(student.waitlist.map(id => id.toString()));
    const DAYS  = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
    const SLOTS = Array.from({ length: 12 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`);

    const formatCourse = (c, isEnrolled) => {
      const enrolled = enrollmentMap[c._id.toString()] ?? 0;
      const cap      = c.capacity;
      const sessions = sessionSlots(c._id, solution, courses);
      const schedule_str = sessions.length
        ? sessions.map(s =>
            `${DAYS[s.day]} ${SLOTS[s.slot]}–${String(8 + s.slot + s.blocks).padStart(2, '0')}:00`
          ).join(' · ')
        : null;

      const conflictReason = !isEnrolled
        ? detectConflict([...enrolledIds], c._id.toString(), solution, courses)
        : null;

      return {
        _id:              c._id,
        name:             c.name,
        teacher:          c.teacher?.name,
        sessionsPerWeek:  c.sessionsPerWeek,
        blocksPerSession: c.blocksPerSession,
        roomType:         c.roomType,
        capacity:         cap,
        enrolled,
        fillPct:          Math.round(enrolled / cap * 100),
        schedule:         schedule_str,
        isEnrolled,
        inWaitlist:       waitlistIds.has(c._id.toString()),
        isFull:           enrolled >= cap,
        conflictReason,
      };
    };

    const enrolledCourses  = courses.filter(c =>  enrolledIds.has(c._id.toString()))
                                    .map(c => formatCourse(c, true));
    const availableCourses = courses.filter(c => !enrolledIds.has(c._id.toString()))
                                    .map(c => formatCourse(c, false));

    const personalGrid = {};
    for (const c of courses.filter(c => enrolledIds.has(c._id.toString()))) {
      const sessions = sessionSlots(c._id, solution, courses);
      for (const s of sessions) {
        for (let k = 0; k < s.blocks; k++) {
          personalGrid[`${s.day}-${s.slot + k}`] = {
            courseName: c.name,
            teacher:    c.teacher?.name,
            courseId:   c._id,
          };
        }
      }
    }

    res.json({
      student: {
        _id:     student._id,
        code:    student.code,
        name:    student.name,
        section: student.section?.name,
      },
      enrolledCourses,
      availableCourses,
      personalGrid,
      hasSchedule: !!solution,
      totalBlocks: enrolledCourses.reduce((s, c) => s + c.sessionsPerWeek * c.blocksPerSession, 0),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateAvailability = async (req, res) => {
  try {
    if (req.user.role !== 'docente') {
      return res.status(403).json({ message: 'Solo los docentes pueden actualizar su disponibilidad' });
    }
    const teacherId = req.user.entityId;
    if (!teacherId) return res.status(400).json({ message: 'Docente sin entidad asignada' });

    const { availability } = req.body;
    if (!Array.isArray(availability) || availability.length !== 5) {
      return res.status(400).json({ message: 'Disponibilidad inválida: se esperan 5 días' });
    }

    await Teacher.findByIdAndUpdate(teacherId, { availability });
    res.json({ message: 'Disponibilidad actualizada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const enroll = async (req, res) => {
  try {
    const studentId = req.user.entityId;
    const { courseId } = req.params;

    const [student, course, schedule] = await Promise.all([
      Student.findById(studentId),
      Course.findById(courseId),
      Schedule.findOne({ isActive: true }).lean(),
    ]);

    if (!student) return res.status(404).json({ message: 'Estudiante no encontrado' });
    if (!course)  return res.status(404).json({ message: 'Curso no encontrado' });

    if (student.courses.map(id => id.toString()).includes(courseId)) {
      return res.status(409).json({ message: 'Ya estás matriculado en este curso' });
    }

    const enrolled = await Student.countDocuments({ courses: courseId });
    if (enrolled >= course.capacity) {
      return res.status(400).json({ message: 'Curso lleno', canWaitlist: true });
    }

    const solution = schedule
      ? (schedule.solution instanceof Map
          ? Object.fromEntries(schedule.solution)
          : schedule.solution)
      : null;

    const allCourses = await Course.find().populate('teacher', 'name');
    const conflict   = detectConflict(
      student.courses.map(id => id.toString()),
      courseId, solution, allCourses
    );
    if (conflict) return res.status(400).json({ message: conflict });

    student.courses.push(courseId);
    student.waitlist = student.waitlist.filter(id => id.toString() !== courseId);
    await student.save();

    res.json({ message: 'Matriculado correctamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const unenroll = async (req, res) => {
  try {
    const studentId = req.user.entityId;
    const { courseId } = req.params;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Estudiante no encontrado' });

    student.courses = student.courses.filter(id => id.toString() !== courseId);
    await student.save();

    const waitingStudent = await Student.findOne({ waitlist: courseId });
    if (waitingStudent) {
      const course   = await Course.findById(courseId);
      const enrolled = await Student.countDocuments({ courses: courseId });
      if (enrolled < course.capacity) {
        waitingStudent.courses.push(courseId);
        waitingStudent.waitlist = waitingStudent.waitlist.filter(id => id.toString() !== courseId);
        await waitingStudent.save();
      }
    }

    res.json({ message: 'Retiro registrado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const joinWaitlist = async (req, res) => {
  try {
    const studentId = req.user.entityId;
    const { courseId } = req.params;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Estudiante no encontrado' });

    if (student.waitlist.map(id => id.toString()).includes(courseId)) {
      const pos = student.waitlist.findIndex(id => id.toString() === courseId) + 1;
      return res.status(409).json({ message: `Ya estás en la lista de espera (posición #${pos})` });
    }

    student.waitlist.push(courseId);
    await student.save();

    res.json({ message: 'Agregado a lista de espera', position: student.waitlist.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const leaveWaitlist = async (req, res) => {
  try {
    const studentId = req.user.entityId;
    const { courseId } = req.params;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Estudiante no encontrado' });

    student.waitlist = student.waitlist.filter(id => id.toString() !== courseId);
    await student.save();

    res.json({ message: 'Saliste de la lista de espera' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
