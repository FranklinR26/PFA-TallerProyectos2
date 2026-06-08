import { EnvironmentalMetric } from '../models/EnvironmentalMetric.js';
import { isGreenHosting }       from '../config/co2.js';
import { logger }               from '../config/logger.js';

const TABLE_LIMIT = 1000; // máximo de filas que se vuelcan al HTML

/**
 * Escapa caracteres HTML para prevenir inyección al renderizar valores.
 * @param {*} value
 * @returns {string}
 */
export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Formatea gramos de CO₂ con la unidad adecuada (mg / g). */
export function formatCo2(grams) {
  if (!Number.isFinite(grams) || grams === 0) return '0 g';
  if (grams < 0.001) return `${(grams * 1000).toFixed(4)} mg`;
  return `${grams.toFixed(6)} g`;
}

/** Formatea bytes en una unidad legible. */
export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

/**
 * Calcula las métricas globales del proyecto a partir de la colección.
 * Usa el framework de agregación de MongoDB para procesar en la base.
 *
 * @returns {Promise<object>} Indicadores agregados.
 */
export async function getEnvironmentalSummary() {
  const [totals] = await EnvironmentalMetric.aggregate([
    {
      $group: {
        _id: null,
        totalRequests:    { $sum: 1 },
        totalCo2:         { $sum: '$co2Grams' },
        totalBytes:       { $sum: '$bytes' },
        avgCo2:           { $avg: '$co2Grams' },
        avgResponseTime:  { $avg: '$responseTimeMs' },
      },
    },
  ]);

  // Ranking de endpoints: CO₂ total, nº de solicitudes y tiempo medio por ruta.
  const perEndpoint = await EnvironmentalMetric.aggregate([
    {
      $group: {
        _id:             { method: '$method', route: '$route' },
        requests:        { $sum: 1 },
        totalCo2:        { $sum: '$co2Grams' },
        avgResponseTime: { $avg: '$responseTimeMs' },
        totalBytes:      { $sum: '$bytes' },
      },
    },
    { $sort: { totalCo2: -1 } },
  ]);

  const byCo2  = [...perEndpoint].sort((a, b) => b.totalCo2 - a.totalCo2);
  const byUse  = [...perEndpoint].sort((a, b) => b.requests - a.requests);

  return {
    totalRequests:   totals?.totalRequests   ?? 0,
    totalCo2:        totals?.totalCo2         ?? 0,
    totalBytes:      totals?.totalBytes       ?? 0,
    avgCo2:          totals?.avgCo2           ?? 0,
    avgResponseTime: totals?.avgResponseTime  ?? 0,
    mostPolluting:   byCo2[0] ?? null,
    mostUsed:        byUse[0] ?? null,
    ranking:         byCo2,
  };
}

/**
 * Renderiza el dashboard HTML completo (server-side) a partir de los datos.
 * Función pura: facilita probar el render sin base de datos.
 *
 * @param {object} params
 * @param {object} params.summary - Resultado de getEnvironmentalSummary().
 * @param {Array}  params.rows    - Documentos de métricas para la tabla.
 * @returns {string} HTML.
 */
export function renderDashboardHtml({ summary, rows }) {
  const endpointLabel = (e) => e ? `${escapeHtml(e._id.method)} ${escapeHtml(e._id.route)}` : '—';

  const tableRows = rows.map((r) => `
        <tr>
          <td>${escapeHtml(new Date(r.timestamp).toLocaleString('es-PE'))}</td>
          <td><span class="badge method-${escapeHtml(r.method)}">${escapeHtml(r.method)}</span></td>
          <td class="route">${escapeHtml(r.route)}</td>
          <td><span class="status status-${Math.floor(r.statusCode / 100)}xx">${escapeHtml(r.statusCode)}</span></td>
          <td class="num">${escapeHtml(r.responseTimeMs.toFixed(2))} ms</td>
          <td class="num">${escapeHtml(formatBytes(r.bytes))}</td>
          <td class="num">${escapeHtml(formatCo2(r.co2Grams))}</td>
        </tr>`).join('');

  const rankingRows = summary.ranking.slice(0, 10).map((e, i) => `
        <tr>
          <td class="num">${i + 1}</td>
          <td>${endpointLabel(e)}</td>
          <td class="num">${e.requests}</td>
          <td class="num">${escapeHtml(formatCo2(e.totalCo2))}</td>
          <td class="num">${escapeHtml(e.avgResponseTime.toFixed(2))} ms</td>
        </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Impacto Ambiental · Monitoreo CO₂</title>
  <style>
    :root { --bg:#0f1419; --card:#1a2129; --accent:#2ecc71; --accent2:#27ae60;
            --text:#e6edf3; --muted:#8b949e; --border:#2d333b; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
           background: var(--bg); color: var(--text); padding: 24px; line-height: 1.4; }
    h1 { font-size: 1.6rem; margin-bottom: 4px; }
    .sub { color: var(--muted); margin-bottom: 24px; font-size: .9rem; }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
             gap: 16px; margin-bottom: 28px; }
    .card { background: var(--card); border: 1px solid var(--border);
            border-radius: 12px; padding: 18px; }
    .card .label { color: var(--muted); font-size: .78rem; text-transform: uppercase;
                   letter-spacing: .5px; margin-bottom: 8px; }
    .card .value { font-size: 1.5rem; font-weight: 700; color: var(--accent); }
    .card .value.small { font-size: 1.05rem; word-break: break-word; }
    section { margin-bottom: 28px; }
    h2 { font-size: 1.1rem; margin-bottom: 12px; }
    .table-wrap { background: var(--card); border: 1px solid var(--border);
                  border-radius: 12px; overflow: auto; max-height: 60vh; }
    table { width: 100%; border-collapse: collapse; min-width: 760px; font-size: .85rem; }
    thead th { position: sticky; top: 0; background: #161b22; text-align: left;
               padding: 12px; border-bottom: 2px solid var(--border); white-space: nowrap; }
    tbody td { padding: 10px 12px; border-bottom: 1px solid var(--border); white-space: nowrap; }
    tbody tr:hover { background: rgba(46,204,113,.06); }
    .num { text-align: right; font-variant-numeric: tabular-nums; }
    .route { color: #79c0ff; }
    .badge { font-size: .72rem; font-weight: 700; padding: 2px 7px; border-radius: 6px; background:#21262d; }
    .method-GET { color:#3fb950; } .method-POST { color:#d29922; }
    .method-PUT { color:#58a6ff; } .method-DELETE { color:#f85149; }
    .status { font-weight: 700; }
    .status-2xx { color:#3fb950; } .status-3xx { color:#58a6ff; }
    .status-4xx { color:#d29922; } .status-5xx { color:#f85149; }
    .empty { padding: 40px; text-align: center; color: var(--muted); }
    footer { color: var(--muted); font-size: .78rem; margin-top: 24px; }
  </style>
</head>
<body>
  <h1>🌱 Impacto Ambiental del Proyecto</h1>
  <p class="sub">
    Monitoreo de huella de carbono con CO2.js ·
    Hosting verde: <strong>${isGreenHosting ? 'Sí' : 'No'}</strong> ·
    Sesión iniciada al último arranque del servidor
  </p>

  <div class="cards">
    <div class="card"><div class="label">Total de solicitudes</div>
      <div class="value">${summary.totalRequests.toLocaleString('es-PE')}</div></div>
    <div class="card"><div class="label">CO₂ total generado</div>
      <div class="value">${escapeHtml(formatCo2(summary.totalCo2))}</div></div>
    <div class="card"><div class="label">CO₂ promedio / solicitud</div>
      <div class="value">${escapeHtml(formatCo2(summary.avgCo2))}</div></div>
    <div class="card"><div class="label">Tiempo de respuesta prom.</div>
      <div class="value">${summary.avgResponseTime.toFixed(2)} ms</div></div>
    <div class="card"><div class="label">Endpoint más contaminante</div>
      <div class="value small">${endpointLabel(summary.mostPolluting)}</div></div>
    <div class="card"><div class="label">Endpoint más utilizado</div>
      <div class="value small">${endpointLabel(summary.mostUsed)}</div></div>
  </div>

  <section>
    <h2>Ranking de endpoints por impacto ambiental</h2>
    <div class="table-wrap">
      <table>
        <thead><tr>
          <th class="num">#</th><th>Endpoint</th><th class="num">Solicitudes</th>
          <th class="num">CO₂ total</th><th class="num">Tiempo prom.</th>
        </tr></thead>
        <tbody>${rankingRows || '<tr><td colspan="5" class="empty">Sin datos</td></tr>'}</tbody>
      </table>
    </div>
  </section>

  <section>
    <h2>Registro de mediciones (${rows.length} más recientes)</h2>
    <div class="table-wrap">
      <table>
        <thead><tr>
          <th>Fecha y hora</th><th>Método</th><th>Ruta</th><th>Estado</th>
          <th class="num">Tiempo</th><th class="num">Bytes</th><th class="num">CO₂ estimado</th>
        </tr></thead>
        <tbody>${tableRows || '<tr><td colspan="7" class="empty">Aún no hay mediciones en esta sesión</td></tr>'}</tbody>
      </table>
    </div>
  </section>

  <footer>Generado por el middleware co2Monitor · ${escapeHtml(new Date().toLocaleString('es-PE'))}</footer>
</body>
</html>`;
}

/**
 * GET /environmental-impact — Dashboard público de monitoreo ambiental.
 * Ruta pública: NO requiere autenticación ni autorización.
 */
export async function getDashboard(req, res) {
  try {
    const [summary, rows] = await Promise.all([
      getEnvironmentalSummary(),
      EnvironmentalMetric.find().sort({ timestamp: -1 }).limit(TABLE_LIMIT).lean(),
    ]);

    const html = renderDashboardHtml({ summary, rows });
    // El dashboard usa estilos inline; relajamos la CSP de helmet solo para esta vista.
    res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'unsafe-inline'");
    res.status(200).type('html').send(html);
  } catch (err) {
    logger.error('environmental_dashboard_error', { message: err.message });
    res.status(500).type('html').send('<h1>Error al generar el dashboard ambiental</h1>');
  }
}

/**
 * GET /api/environmental-impact — API pública (JSON) para consumir desde el Frontend.
 * Devuelve el resumen agregado + últimas mediciones (para tablas/gráficas).
 */
export async function getEnvironmentalImpactJson(req, res) {
  try {
    const limitRaw = Number(req.query.limit);
    const limit = Number.isFinite(limitRaw)
      ? Math.max(1, Math.min(limitRaw, TABLE_LIMIT))
      : 200;

    const [summary, rows] = await Promise.all([
      getEnvironmentalSummary(),
      EnvironmentalMetric.find().sort({ timestamp: -1 }).limit(limit).lean(),
    ]);

    return res.status(200).json({
      status: 'ok',
      source: 'co2.js',
      hostingGreen: isGreenHosting,
      summary,
      rows,
    });
  } catch (err) {
    logger.error('environmental_json_error', { message: err.message });
    return res.status(500).json({
      status: 'error',
      message: 'No se pudo obtener el resumen ambiental.',
    });
  }
}
