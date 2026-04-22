import { Period }   from '../models/Period.js';
import { Schedule } from '../models/Schedule.js';

// GET /api/periods
export const getPeriods = async (req, res) => {
  try {
    const periods = await Period.find().sort({ createdAt: -1 });
    res.json(periods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/periods
export const createPeriod = async (req, res) => {
  try {
    const { year, semester } = req.body;
    if (!year || !semester) {
      return res.status(400).json({ message: 'year y semester son requeridos' });
    }
    const name = `${year}-${semester === 1 ? 'I' : 'II'}`;
    const period = await Period.create({ name, year, semester });
    res.status(201).json(period);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Ya existe ese período académico' });
    }
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/periods/:id/activate
export const activatePeriod = async (req, res) => {
  try {
    await Period.updateMany({}, { isActive: false });
    const period = await Period.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    if (!period) return res.status(404).json({ message: 'Período no encontrado' });
    res.json(period);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/periods/:id
export const deletePeriod = async (req, res) => {
  try {
    const scheduleCount = await Schedule.countDocuments({ period: req.params.id });
    if (scheduleCount > 0) {
      return res.status(400).json({
        message: `No se puede eliminar: tiene ${scheduleCount} horario(s) asociado(s)`,
      });
    }
    await Period.findByIdAndDelete(req.params.id);
    res.json({ message: 'Período eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
