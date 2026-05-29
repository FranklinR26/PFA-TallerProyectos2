import { co2 } from '@tgwf/co2';

/**
 * Modelo de cálculo de huella de carbono basado en CO2.js (@tgwf/co2).
 *
 * Usamos el modelo "Sustainable Web Design" (SWD) por defecto, que estima los
 * gramos de CO₂ equivalente emitidos por byte transferido a través de la red.
 *
 * Referencia: https://developers.thegreenwebfoundation.org/co2js/overview/
 */
const emissions = new co2({ model: 'swd' });

/**
 * Indica si la infraestructura corre sobre energía verde.
 * Configurable vía la variable de entorno GREEN_HOSTING (por defecto: false).
 */
const GREEN_HOSTING = process.env.GREEN_HOSTING === 'true';

/**
 * Calcula las emisiones estimadas de CO₂ (en gramos) para un número de bytes.
 *
 * @param {number} bytes - Tamaño de la respuesta HTTP en bytes.
 * @returns {number} Gramos de CO₂ equivalente. Devuelve 0 si bytes <= 0.
 */
export function estimateCo2Grams(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return 0;
  return emissions.perByte(bytes, GREEN_HOSTING);
}

export const co2Model = emissions;
export const isGreenHosting = GREEN_HOSTING;
