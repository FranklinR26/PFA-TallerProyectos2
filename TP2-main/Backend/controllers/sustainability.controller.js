import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { logger } from '../config/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// El script `npm run sustainability:analyze` deja el reporte aquí.
const REPORT_DIR  = path.resolve(__dirname, '..', 'public', 'assets');
const JSON_REPORT = path.join(REPORT_DIR, 'carbometer-latest.json');
const TXT_REPORT  = path.join(REPORT_DIR, 'carbometer-latest.txt');

/**
 * Lee el último reporte de GreenFrame del disco.
 * Intenta primero el JSON; si no existe, recurre al texto plano.
 *
 * @returns {Promise<{format:'json'|'text', data:any} | null>}
 *   El reporte, o null si no se ha generado ningún análisis.
 */
export async function readLatestReport() {
  try {
    const raw = await readFile(JSON_REPORT, 'utf8');
    return { format: 'json', data: JSON.parse(raw) };
  } catch (err) {
    if (err.code !== 'ENOENT' && !(err instanceof SyntaxError)) throw err;
  }

  try {
    const text = await readFile(TXT_REPORT, 'utf8');
    return { format: 'text', data: text };
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }

  return null;
}

/**
 * GET /api/sustainability — Sirve el último reporte ecológico de GreenFrame.
 * Ruta PÚBLICA. Solo expone el archivo de resultados locales; nunca tokens ni
 * variables de entorno sensibles.
 */
export async function getSustainabilityReport(req, res) {
  try {
    const report = await readLatestReport();

    if (!report) {
      return res.status(404).json({
        status:  'no_report',
        message: 'Aún no se ha ejecutado un análisis. Corre "npm run sustainability:analyze".',
      });
    }

    if (report.format === 'json') {
      return res.status(200).json({ status: 'ok', source: 'greenframe', report: report.data });
    }

    res.status(200).type('text/plain; charset=utf-8').send(report.data);
  } catch (err) {
    logger.error('sustainability_report_error', { message: err.message });
    res.status(500).json({ status: 'error', message: 'No se pudo leer el reporte de GreenFrame.' });
  }
}
