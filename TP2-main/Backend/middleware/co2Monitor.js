import { EnvironmentalMetric } from '../models/EnvironmentalMetric.js';
import { estimateCo2Grams }    from '../config/co2.js';
import { logger }              from '../config/logger.js';

/**
 * Cuenta los bytes de un chunk de respuesta sin importar su tipo.
 * @param {*} chunk - Buffer, string o undefined.
 * @param {BufferEncoding} [encoding] - Codificación si el chunk es string.
 * @returns {number} Número de bytes del chunk.
 */
export function chunkSize(chunk, encoding) {
  if (!chunk) return 0;
  if (Buffer.isBuffer(chunk)) return chunk.length;
  return Buffer.byteLength(chunk, typeof encoding === 'string' ? encoding : 'utf8');
}

/**
 * Construye el documento de métrica a partir de los datos crudos de la
 * respuesta. Separado del middleware para poder probarlo de forma aislada.
 *
 * @param {object} params
 * @param {string} params.method
 * @param {string} params.route
 * @param {number} params.statusCode
 * @param {number} params.bytes
 * @param {number} params.responseTimeMs
 * @returns {object} Documento listo para persistir.
 */
export function buildMetric({ method, route, statusCode, bytes, responseTimeMs }) {
  return {
    method,
    route,
    statusCode,
    bytes,
    co2Grams: estimateCo2Grams(bytes),
    responseTimeMs,
  };
}

/**
 * Middleware GLOBAL de medición de huella de carbono.
 *
 * Mide TODAS las rutas Express (existentes y futuras) sin alterar su
 * comportamiento funcional:
 *  - Acumula los bytes transferidos envolviendo res.write / res.end.
 *  - Mide el tiempo de respuesta.
 *  - Calcula la emisión de CO₂ con CO2.js.
 *  - Persiste la métrica en MongoDB de forma asíncrona (fire-and-forget),
 *    de modo que la latencia del cliente no se ve afectada.
 *
 * @param {object} [options]
 * @param {(metric: object) => Promise<any>} [options.persist] - Función de
 *   persistencia inyectable (útil para tests). Por defecto guarda en Mongo.
 */
export function co2Monitor(options = {}) {
  const persist = options.persist
    ?? ((metric) => EnvironmentalMetric.create(metric));

  return function co2MonitorMiddleware(req, res, next) {
    const start = process.hrtime.bigint();
    let bytes = 0;

    const originalWrite = res.write.bind(res);
    const originalEnd   = res.end.bind(res);

    res.write = (chunk, encoding, cb) => {
      bytes += chunkSize(chunk, encoding);
      return originalWrite(chunk, encoding, cb);
    };

    res.end = (chunk, encoding, cb) => {
      bytes += chunkSize(chunk, encoding);
      return originalEnd(chunk, encoding, cb);
    };

    res.on('finish', () => {
      const responseTimeMs = Number(process.hrtime.bigint() - start) / 1e6;
      const metric = buildMetric({
        method:     req.method,
        route:      req.route?.path
          ? `${req.baseUrl || ''}${req.route.path}`
          : (req.originalUrl.split('?')[0] || req.path),
        statusCode: res.statusCode,
        bytes,
        responseTimeMs: Math.round(responseTimeMs * 1000) / 1000,
      });

      Promise.resolve()
        .then(() => persist(metric))
        .catch((err) => logger.error('co2_metric_persist_failed', { message: err.message }));
    });

    next();
  };
}
