import mongoose from 'mongoose';
import { logger } from './logger.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info('db_connected', { host: conn.connection.host });
  } catch (err) {
    logger.error('db_connection_failed', { message: err.message });
    process.exit(1);
  }
};
