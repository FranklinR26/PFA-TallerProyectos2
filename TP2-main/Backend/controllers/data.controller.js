import { Teacher }   from '../models/Teacher.js';
import { Classroom } from '../models/Classroom.js';
import { Section }   from '../models/Section.js';
import { Course }    from '../models/Course.js';
import { Student }   from '../models/Student.js';
import { User }      from '../models/User.js';
import { invalidateCache } from '../middleware/cache.js';

const notFound = (res, entity) =>
  res.status(404).json({ message: `${entity} no encontrado/a` });

const serverError = (res, err) =>
  res.status(500).json({ message: err.message });

// -- BOOTSTRAP (reduccion de solicitudes HTTP) --------------------------------

/**
 * GET /api/data/all
 * Devuelve los 5 catalogos (teachers, classrooms, sections, courses, students)
 * en UNA sola respuesta HTTP, en lugar de 5 peticiones paralelas.
 *
 * Beneficio Green Software: un solo handshake TCP/TLS, una sola pasada de
 * middleware (auth, CORS, compresion gzip) y una sola respuesta comprimida,
 * reduciendo overhead de red y CPU del servidor por carga de la vista /datos.
 */
export const getBootstrap = async (_, res) => {
  try {
    const [teachers, classrooms, sections, courses, students] = await Promise.all([
      Teacher.find().select('name email availability createdAt').sort({ name: 1 }).lean(),
      Classroom.find().select('name type capacity').sort({ name: 1 }).lean(),
      Section.find().select('name').sort({ name: 1 }).lean(),
      Course.find()
        .populate('teacher', 'name')
        .select('name teacher roomType capacity sessionsPerWeek blocksPerSession')
        .sort({ name: 1 }).lean(),
      Student.find()
        .populate('section', 'name')
        .populate('courses', 'name')
        .select('code name section courses waitlist')
        .sort({ code: 1 }).lean(),
    ]);

    // Enrollment de cursos en 1 sola agregacion (sin antipatron N+1)
    const courseIds    = courses.map(c => c._id);
    const enrollCounts = await Student.aggregate([
      { $match:  { courses: { $in: courseIds } } },
      { $unwind: '$courses' },
      { $match:  { courses: { $in: courseIds } } },
      { $group:  { _id: '$courses', enrolled: { $sum: 1 } } },
    ]);
    const enrollMap = Object.fromEntries(enrollCounts.map(e => [e._id.toString(), e.enrolled]));
    const coursesWithEnrollment = courses.map(c => ({
      ...c, enrolled: enrollMap[c._id.toString()] ?? 0,
    }));

    res.json({ teachers, classrooms, sections, courses: coursesWithEnrollment, students });
  } catch (err) { serverError(res, err); }
};

// ── TEACHERS ──────────────────────────────────────────────────────────────────

export const getTeachers = async (_, res) => {
  try {
    // .lean() devuelve POJOs en lugar de documentos Mongoose → ~40 % menos memoria y CPU
    const teachers = await Teacher.find()
      .select('name email availability createdAt')
      .sort({ name: 1 })
      .lean();
    res.json(teachers);
  } catch (err) { serverError(res, err); }
};

export const createTeacher = async (req, res) => {
  try {
    const { name, email, password, availability } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: 'Ya existe un usuario con ese email' });
    }

    // Crear Teacher
    const teacher = await Teacher.create({ name, email, availability });

    // Crear User vinculado
    await User.create({
      code:         `DOC-${teacher._id.toString().slice(-6).toUpperCase()}`,
      name,
      email,
      passwordHash: password,
      role:         'docente',
      entityId:     teacher._id,
    });

    invalidateCache('/api/data');
    res.status(201).json(teacher);
  } catch (err) { serverError(res, err); }
};

export const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!teacher) return notFound(res, 'Docente');
    invalidateCache('/api/data');
    res.json(teacher);
  } catch (err) { serverError(res, err); }
};

export const deleteTeacher = async (req, res) => {
  try {
    const courses = await Course.countDocuments({ teacher: req.params.id });
    if (courses > 0) {
      return res.status(409).json({
        message: `No se puede eliminar: el docente tiene ${courses} curso(s) asignado(s)`,
      });
    }
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return notFound(res, 'Docente');

    // Eliminar User vinculado
    await User.deleteOne({ entityId: req.params.id, role: 'docente' });

    invalidateCache('/api/data');
    res.json({ message: 'Docente eliminado' });
  } catch (err) { serverError(res, err); }
};

// ── CLASSROOMS ────────────────────────────────────────────────────────────────

export const getClassrooms = async (_, res) => {
  try {
    const classrooms = await Classroom.find()
      .select('name type capacity')
      .sort({ name: 1 })
      .lean();
    res.json(classrooms);
  } catch (err) { serverError(res, err); }
};

export const createClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.create(req.body);
    res.status(201).json(classroom);
  } catch (err) { serverError(res, err); }
};

export const updateClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!classroom) return notFound(res, 'Aula');
    res.json(classroom);
  } catch (err) { serverError(res, err); }
};

export const deleteClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findByIdAndDelete(req.params.id);
    if (!classroom) return notFound(res, 'Aula');
    res.json({ message: 'Aula eliminada' });
  } catch (err) { serverError(res, err); }
};

// ── SECTIONS ──────────────────────────────────────────────────────────────────

export const getSections = async (_, res) => {
  try {
    const sections = await Section.find()
      .select('name')
      .sort({ name: 1 })
      .lean();
    res.json(sections);
  } catch (err) { serverError(res, err); }
};

export const createSection = async (req, res) => {
  try {
    const section = await Section.create(req.body);
    res.status(201).json(section);
  } catch (err) { serverError(res, err); }
};

export const updateSection = async (req, res) => {
  try {
    const section = await Section.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!section) return notFound(res, 'Sección');
    res.json(section);
  } catch (err) { serverError(res, err); }
};

export const deleteSection = async (req, res) => {
  try {
    await Student.updateMany({ section: req.params.id }, { $unset: { section: 1 } });
    const section = await Section.findByIdAndDelete(req.params.id);
    if (!section) return notFound(res, 'Sección');
    res.json({ message: 'Sección eliminada' });
  } catch (err) { serverError(res, err); }
};

// ── COURSES ───────────────────────────────────────────────────────────────────

export const getCourses = async (req, res) => {
  try {
    // Paginación: ?page=1&limit=20 (por defecto devuelve todos si no se pasan parámetros)
    const page  = parseInt(req.query.page)  || null;
    const limit = parseInt(req.query.limit) || null;

    let query = Course.find()
      .populate('teacher', 'name')
      .select('name teacher roomType capacity sessionsPerWeek blocksPerSession')
      .sort({ name: 1 })
      .lean();

    if (page && limit) query = query.skip((page - 1) * limit).limit(limit);

    const courses = await query;
    const total   = page && limit ? await Course.countDocuments() : courses.length;

    // Enrollment en una sola agregación en lugar de N queries individuales
    const courseIds    = courses.map(c => c._id);
    const enrollCounts = await Student.aggregate([
      { $match:   { courses: { $in: courseIds } } },
      { $unwind:  '$courses' },
      { $match:   { courses: { $in: courseIds } } },
      { $group:   { _id: '$courses', enrolled: { $sum: 1 } } },
    ]);
    const enrollMap = Object.fromEntries(enrollCounts.map(e => [e._id.toString(), e.enrolled]));
    const withEnrollment = courses.map(c => ({ ...c, enrolled: enrollMap[c._id.toString()] ?? 0 }));

    res.json(page && limit
      ? { data: withEnrollment, total, page, pages: Math.ceil(total / limit) }
      : withEnrollment
    );
  } catch (err) { serverError(res, err); }
};

export const createCourse = async (req, res) => {
  try {
    const { roomType, capacity } = req.body;
    const fits = await Classroom.exists({ type: roomType, capacity: { $gte: capacity } });
    if (!fits) {
      return res.status(400).json({
        message: `No existe aula tipo "${roomType}" con capacidad ≥ ${capacity}`,
      });
    }
    const course = await Course.create(req.body);
    await course.populate('teacher', 'name');
    res.status(201).json(course);
  } catch (err) { serverError(res, err); }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    ).populate('teacher', 'name');
    if (!course) return notFound(res, 'Curso');
    res.json(course);
  } catch (err) { serverError(res, err); }
};

export const deleteCourse = async (req, res) => {
  try {
    await Student.updateMany(
      { courses: req.params.id },
      { $pull: { courses: req.params.id, waitlist: req.params.id } }
    );
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return notFound(res, 'Curso');
    res.json({ message: 'Curso eliminado' });
  } catch (err) { serverError(res, err); }
};

// ── STUDENTS ──────────────────────────────────────────────────────────────────

export const getStudents = async (req, res) => {
  try {
    // Paginación: ?page=1&limit=20
    const page  = parseInt(req.query.page)  || null;
    const limit = parseInt(req.query.limit) || null;

    let query = Student.find()
      .populate('section', 'name')
      .populate('courses', 'name')
      .select('code name section courses waitlist')
      .sort({ code: 1 })
      .lean();

    if (page && limit) query = query.skip((page - 1) * limit).limit(limit);

    const students = await query;
    const total    = page && limit ? await Student.countDocuments() : students.length;

    res.json(page && limit
      ? { data: students, total, page, pages: Math.ceil(total / limit) }
      : students
    );
  } catch (err) { serverError(res, err); }
};

export const createStudent = async (req, res) => {
  try {
    const { code, name, section, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Ya existe un usuario con ese email' });

    const student = await Student.create({ code, name, section: section || undefined });

    await User.create({
      code,
      name,
      email,
      passwordHash: password,
      role:         'estudiante',
      entityId:     student._id,
    });

    res.status(201).json(student);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Código de estudiante ya existe' });
    }
    serverError(res, err);
  }
};

export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    ).populate('section', 'name').populate('courses', 'name');
    if (!student) return notFound(res, 'Estudiante');
    res.json(student);
  } catch (err) { serverError(res, err); }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return notFound(res, 'Estudiante');
    await User.deleteOne({ entityId: req.params.id, role: 'estudiante' });
    res.json({ message: 'Estudiante eliminado' });
  } catch (err) { serverError(res, err); }
};

// ── ENROLLMENT ────────────────────────────────────────────────────────────────

export const enrollStudent = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    const [student, course] = await Promise.all([
      Student.findById(studentId),
      Course.findById(courseId),
    ]);
    if (!student) return notFound(res, 'Estudiante');
    if (!course)  return notFound(res, 'Curso');

    if (student.courses.includes(courseId)) {
      return res.status(409).json({ message: 'Estudiante ya matriculado en este curso' });
    }

    const enrolled = await Student.countDocuments({ courses: courseId });
    if (enrolled >= course.capacity) {
      return res.status(400).json({ message: `Curso lleno: ${enrolled}/${course.capacity}` });
    }

    student.courses.push(courseId);
    student.waitlist = student.waitlist.filter(id => id.toString() !== courseId);
    await student.save();
    res.json({ message: 'Matriculado correctamente', student });
  } catch (err) { serverError(res, err); }
};

export const unenrollStudent = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    const student = await Student.findById(studentId);
    if (!student) return notFound(res, 'Estudiante');

    student.courses = student.courses.filter(id => id.toString() !== courseId);
    await student.save();

    const waitingStudent = await Student.findOne({ waitlist: courseId });
    if (waitingStudent) {
      const course = await Course.findById(courseId);
      const enrolled = await Student.countDocuments({ courses: courseId });
      if (enrolled < course.capacity) {
        waitingStudent.courses.push(courseId);
        waitingStudent.waitlist = waitingStudent.waitlist.filter(
          id => id.toString() !== courseId
        );
        await waitingStudent.save();
      }
    }
    res.json({ message: 'Retiro registrado' });
  } catch (err) { serverError(res, err); }
};

export const bulkEnroll = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return notFound(res, 'Curso');

    const students = await Student.find({ section: sectionId });
    let count = 0;
    for (const s of students) {
      if (!s.courses.includes(courseId)) {
        const enrolled = await Student.countDocuments({ courses: courseId });
        if (enrolled < course.capacity) {
          s.courses.push(courseId);
          await s.save();
          count++;
        }
      }
    }
    res.json({ message: `${count} estudiantes matriculados` });
  } catch (err) { serverError(res, err); }
};
