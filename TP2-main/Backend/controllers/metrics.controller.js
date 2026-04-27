import { Schedule }       from '../models/Schedule.js';
import { Course }         from '../models/Course.js';
import { Classroom }      from '../models/Classroom.js';
import { Student }        from '../models/Student.js';
import { computeMetrics } from '../csp/metrics.js';
import { logger }         from '../config/logger.js';

export const getMetrics = async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ isActive: true }).lean();
    if (!schedule) {
      return res.status(404).json({ message: 'No hay horario activo' });
    }

    const [courses, classrooms, students] = await Promise.all([
      Course.find().populate('teacher', 'availability name'),
      Classroom.find(),
      Student.find().select('courses section'),
    ]);

    const solution = schedule.solution instanceof Map
      ? Object.fromEntries(schedule.solution)
      : schedule.solution;

    const metrics = computeMetrics({ solution, courses, classrooms, students });
    logger.info('metrics_computed', { scheduleId: schedule._id, coveragePct: metrics.coveragePct });
    res.json({ ...metrics, scheduleId: schedule._id, score: schedule.score });
  } catch (err) {
    logger.error('metrics_error', { message: err.message });
    res.status(500).json({ message: err.message });
  }
};
