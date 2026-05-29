import mongoose from 'mongoose';

/**
 * Métrica ambiental por respuesta HTTP.
 *
 * Cada documento representa la medición de una única respuesta generada por la
 * aplicación: el endpoint, su resultado, el tamaño transferido, el tiempo de
 * respuesta y la emisión estimada de CO₂ calculada con CO2.js.
 *
 * La colección se vacía automáticamente al arrancar el servidor para iniciar
 * una nueva sesión de medición (ver config/db.js · clearEnvironmentalMetrics).
 */
const environmentalMetricSchema = new mongoose.Schema({
  method:         { type: String, required: true },           // GET, POST, ...
  route:          { type: String, required: true, index: true }, // path de la ruta
  statusCode:     { type: Number, required: true },           // código HTTP
  bytes:          { type: Number, required: true, default: 0 }, // tamaño respuesta
  co2Grams:       { type: Number, required: true, default: 0 }, // emisión estimada (g)
  responseTimeMs: { type: Number, required: true, default: 0 }, // tiempo de respuesta
}, {
  timestamps: { createdAt: 'timestamp', updatedAt: false },   // timestamp = fecha/hora
  collection: 'environmental_metrics',
});

// Orden por fecha descendente para el dashboard.
environmentalMetricSchema.index({ timestamp: -1 });

export const EnvironmentalMetric = mongoose.model(
  'EnvironmentalMetric',
  environmentalMetricSchema,
);
