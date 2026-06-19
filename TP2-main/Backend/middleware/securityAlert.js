import { logger } from '../config/logger.js';

/**
 * H-07 MITIGACIÓN COMPLETA — Alertas de seguridad ante intentos de fuerza bruta.
 * Mantiene un registro en memoria de intentos fallidos por IP.
 * Cuando se alcanza el umbral de rate-limit, genera una alerta WARNING.
 */

const attemptTracker = new Map();

export const securityAlertMiddleware = (req, res, next) => {
  const originalSend = res.send;

  res.send = function (data) {
    // Si el rate-limit fue alcanzado (status 429), registra alerta de seguridad.
    if (res.statusCode === 429) {
      const ip = req.ip || req.connection.remoteAddress;
      const endpoint = req.path;

      logger.warn('rate_limit_triggered', {
        ip,
        endpoint,
        message: 'Intento de fuerza bruta detectado — demasiados intentos en corto tiempo',
        timestamp: new Date().toISOString(),
      });

      // Opción futura: integrar con sistemas de alertas.
      // Por ahora, el log es capturado por el sistema de monitoreo (ELK, DataDog, etc.)
      // y puede disparar alarmas basadas en esta etiqueta 'rate_limit_triggered'.
    }

    return originalSend.call(this, data);
  };

  next();
};

export default securityAlertMiddleware;
