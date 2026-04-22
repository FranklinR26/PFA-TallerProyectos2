import { Worker }    from 'worker_threads';
import { fileURLToPath } from 'url';
import path            from 'path';
import { Course }      from '../models/Course.js';
import { Classroom }   from '../models/Classroom.js';
import { Student }     from '../models/Student.js';
import { Schedule }    from '../models/Schedule.js';
import { Period }      from '../models/Period.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function runSolverAsync(input) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      path.join(__dirname, '../csp/solverWorker.js'),
      { workerData: input }
    );
    worker.on('message', resolve);
    worker.on('error',   reject);
  });
}

// POST /api/schedule/generate
export const generate = async (req, res) => {
  try {
    const weights = req.body.weights ?? {
      pref: 5, balance: 4, gaps: 6, spread: 7, core: 3,
    };
    const params = req.body.params ?? {
      timeout: 8000, restarts: 3, maxNodes: 200_000,
    };

    const [courses, classrooms, students] = await Promise.all([
      Course.find().populate('teacher').lean(),
      Classroom.find().lean(),
      Student.find().select('courses _id').lean(),
    ]);

    if (courses.length    === 0) return res.status(400).json({ message: 'No hay cursos registrados' });
    if (classrooms.length === 0) return res.status(400).json({ message: 'No hay aulas registradas' });

    const result = await runSolverAsync({ courses, classrooms, students, weights, params });

    if (!result.ok) {
      return res.status(422).json({
        message: result.reason,
        nodes:   result.nodes,
        timeMs:  result.timeMs,
      });
    }

    const activePeriod = await Period.findOne({ isActive: true });

    await Schedule.updateMany({}, { isActive: false });
    const schedule = await Schedule.create({
      solution: result.assignment,
      score:    result.score,
      nodes:    result.nodes,
      timeMs:   result.timeMs,
      weights,
      isActive: true,
      period:   activePeriod?._id ?? null,
    });

    res.status(201).json({
      scheduleId: schedule._id,
      score:      result.score,
      nodes:      result.nodes,
      timeMs:     result.timeMs,
      assignment: result.assignment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/schedule/active
export const getActive = async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ isActive: true }).lean();
    if (!schedule) {
      return res.status(404).json({ message: 'No hay horario activo' });
    }
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/schedule/history
export const getHistory = async (req, res) => {
  try {
    const list = await Schedule.find()
      .select('score nodes timeMs isActive createdAt')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/schedule/full — horario activo con datos populados
export const getFull = async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ isActive: true }).lean();
    if (!schedule) return res.status(404).json({ message: 'No hay horario activo' });

    const [courses, classrooms] = await Promise.all([
      Course.find().populate('teacher', 'name'),
      Classroom.find(),
    ]);

    const roomMap   = Object.fromEntries(classrooms.map(r => [r._id.toString(), r]));
    const courseMap = Object.fromEntries(courses.map(c => [c._id.toString(), c]));

    const solution = schedule.solution instanceof Map
      ? Object.fromEntries(schedule.solution)
      : schedule.solution;

    const entries = [];
    for (const [varId, val] of Object.entries(solution)) {
      const [courseId] = varId.split('_');
      const course = courseMap[courseId];
      const room   = roomMap[val.roomId];
      if (!course || !room) continue;
      entries.push({
        varId,
        courseId,
        courseName:  course.name,
        teacher:     course.teacher?.name ?? '—',
        room:        room.name,
        roomType:    room.type,
        day:         val.day,
        slot:        val.slot,
        blocks:      course.blocksPerSession,
      });
    }

    res.json({ entries, scheduleId: schedule._id, score: schedule.score });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/schedule/validate
export const validateSchedule = async (req, res) => {
  try {
    const [courses, classrooms, teachers] = await Promise.all([
      Course.find().populate('teacher'),
      Classroom.find(),
      (await import('../models/Teacher.js')).Teacher.find(),
    ]);

    const errors   = [];
    const warnings = [];

    // 1. Cursos sin docente
    const sinDocente = courses.filter(c => !c.teacher);
    if (sinDocente.length > 0) {
      errors.push(`${sinDocente.length} curso(s) sin docente: ${sinDocente.map(c => c.name).join(', ')}`);
    }

    // 2. Disponibilidad de docentes
    const teacherLoad = {};
    for (const c of courses) {
      if (!c.teacher) continue;
      const tid = c.teacher._id.toString();
      teacherLoad[tid] = (teacherLoad[tid] || 0) + c.sessionsPerWeek * c.blocksPerSession;
    }
    for (const t of teachers) {
      const needed = teacherLoad[t._id.toString()] ?? 0;
      if (needed === 0) continue;
      const available = t.availability?.flat().filter(v => v > 0).length ?? 0;
      if (available === 0) {
        errors.push(`Docente "${t.name}" no tiene ninguna disponibilidad registrada`);
      } else if (available < needed) {
        warnings.push(`Docente "${t.name}" necesita ${needed} bloques pero solo tiene ${available} slots disponibles`);
      }
    }

    // 3. Aulas por tipo y capacidad
    const roomsByType = {};
    for (const r of classrooms) {
      if (!roomsByType[r.type]) roomsByType[r.type] = [];
      roomsByType[r.type].push(r);
    }
    for (const c of courses) {
      const rooms = roomsByType[c.roomType] ?? [];
      if (rooms.length === 0) {
        errors.push(`No hay aulas de tipo "${c.roomType}" para el curso "${c.name}"`);
      } else {
        const fits = rooms.some(r => r.capacity >= c.capacity);
        if (!fits) {
          errors.push(`No hay aula "${c.roomType}" con capacidad ≥ ${c.capacity} para "${c.name}"`);
        }
      }
    }

    // 4. Capacidad horaria general
    const totalSessions = courses.reduce((s, c) => s + c.sessionsPerWeek, 0);
    const maxSlots      = 5 * 12 * classrooms.length;
    if (totalSessions > maxSlots) {
      errors.push(`Total de sesiones (${totalSessions}) supera la capacidad horaria máxima (${maxSlots})`);
    } else if (totalSessions > maxSlots * 0.8) {
      warnings.push(`Alta densidad: ${totalSessions} sesiones en ${maxSlots} slots disponibles (${Math.round(totalSessions/maxSlots*100)}%)`);
    }

    res.json({
      ok:       errors.length === 0,
      errors,
      warnings,
      stats: {
        courses:       courses.length,
        classrooms:    classrooms.length,
        teachers:      teachers.length,
        totalSessions,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/schedule/entry — drag-and-drop: mueve una sesión a otro día/slot
export const patchEntry = async (req, res) => {
  try {
    const { varId, day, slot, roomId } = req.body;
    if (varId === undefined || day === undefined || slot === undefined) {
      return res.status(400).json({ message: 'varId, day y slot son requeridos' });
    }

    const schedule = await Schedule.findOne({ isActive: true });
    if (!schedule) return res.status(404).json({ message: 'No hay horario activo' });

    const solution = schedule.solution instanceof Map
      ? Object.fromEntries(schedule.solution)
      : { ...schedule.solution };

    if (!solution[varId]) {
      return res.status(404).json({ message: `Entrada ${varId} no encontrada` });
    }

    // Detectar conflictos con otras sesiones
    const [courseId] = varId.split('_');
    const course     = await (await import('../models/Course.js')).Course.findById(courseId);
    const blocks     = course?.blocksPerSession ?? 1;
    const newRoomId  = roomId ?? solution[varId].roomId;

    for (const [key, val] of Object.entries(solution)) {
      if (key === varId) continue;
      const [cId] = key.split('_');
      const otherCourse = await (await import('../models/Course.js')).Course.findById(cId);
      const otherBlocks = otherCourse?.blocksPerSession ?? 1;

      if (val.day !== day) continue;

      // Mismo aula mismo día → choque de aula
      if (val.roomId === newRoomId) {
        const overlap = slot < val.slot + otherBlocks && val.slot < slot + blocks;
        if (overlap) return res.status(409).json({ message: 'Conflicto de aula en ese horario' });
      }

      // Mismo docente mismo día → choque de docente
      if (course?.teacher?.toString() === otherCourse?.teacher?.toString()) {
        const overlap = slot < val.slot + otherBlocks && val.slot < slot + blocks;
        if (overlap) return res.status(409).json({ message: 'Conflicto de docente en ese horario' });
      }
    }

    solution[varId] = { ...solution[varId], day, slot, roomId: newRoomId };
    schedule.solution = solution;
    schedule.markModified('solution');
    await schedule.save();

    res.json({ message: 'Sesión movida correctamente', entry: solution[varId] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/schedule/:id/activate
export const activate = async (req, res) => {
  try {
    await Schedule.updateMany({}, { isActive: false });
    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    if (!schedule) return res.status(404).json({ message: 'Horario no encontrado' });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
