import mongoose from 'mongoose';
import { logger } from './logger.js';
import { EnvironmentalMetric } from '../models/EnvironmentalMetric.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info('db_connected', { host: conn.connection.host });
  } catch (err) {
    logger.error('db_connection_failed', { message: err.message });
    process.exit(1);
  }
};

/**
 * Elimina los registros históricos de métricas ambientales para iniciar una
 * nueva sesión de medición. Se ejecuta UNA ÚNICA VEZ durante el arranque del
 * servidor (ver index.js), inmediatamente después de conectar a MongoDB.
 *
 * @returns {Promise<number>} Número de documentos eliminados.
 */
export const clearEnvironmentalMetrics = async () => {
  const { deletedCount } = await EnvironmentalMetric.deleteMany({});
  logger.info('environmental_metrics_cleared', { deletedCount });
  return deletedCount;
};
