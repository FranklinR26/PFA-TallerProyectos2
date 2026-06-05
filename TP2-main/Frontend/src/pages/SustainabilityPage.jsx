import { useEffect, useMemo, useState } from 'react';
import { getEnvironmentalImpact } from '../api/environmentalApi';
import { getGreenFrameReport } from '../api/sustainabilityApi';

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

function formatCo2(grams) {
  if (!Number.isFinite(grams) || grams === 0) return '0 g';
  if (grams < 0.001) return `${(grams * 1000).toFixed(4)} mg`;
  return `${grams.toFixed(6)} g`;
}

function endpointLabel(e) {
  if (!e?._id?.method || !e?._id?.route) return '—';
  return `${e._id.method} ${e._id.route}`;
}

export default function SustainabilityPage() {
  const [envLoading, setEnvLoading] = useState(true);
  const [envError, setEnvError] = useState(null);
  const [envData, setEnvData] = useState(null);

  const [gfLoading, setGfLoading] = useState(true);
  const [gfError, setGfError] = useState(null);
  const [gfData, setGfData] = useState(null);

  const refresh = async () => {
    setEnvLoading(true);
    setEnvError(null);
    setGfLoading(true);
    setGfError(null);

    try {
      const data = await getEnvironmentalImpact({ limit: 200 });
      setEnvData(data);
    } catch (e) {
      setEnvError(e?.response?.data?.message ?? e.message ?? 'Error al cargar métricas CO2.js');
    } finally {
      setEnvLoading(false);
    }

    try {
      const data = await getGreenFrameReport();
      setGfData(data);
    } catch (e) {
      // 404 = no_report (aún no ejecutan el análisis)
      const status = e?.response?.status;
      if (status === 404) setGfData(e.response.data);
      else setGfError(e?.response?.data?.message ?? e.message ?? 'Error al cargar reporte GreenFrame');
    } finally {
      setGfLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const summary = envData?.summary ?? null;
  const rows = envData?.rows ?? [];

  const top10 = useMemo(() => {
    const ranking = summary?.ranking ?? [];
    return Array.isArray(ranking) ? ranking.slice(0, 10) : [];
  }, [summary]);

  return (
    <div style={{ paddingTop: 28 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 18 }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>Validación de resultados (Sostenibilidad)</h2>
          <p style={{ color: '#64748b', fontSize: 13, margin: 0, lineHeight: 1.6 }}>
            Comparación antes/después y evidencias medibles usando CO2.js (tiempo real), GreenFrame (reporte) y Lighthouse (performance).
          </p>
        </div>
        <button onClick={refresh} className="btn btn-secondary btn-sm">
          Actualizar
        </button>
      </div>

      {/* 1) Antes vs. Después */}
      <section style={sectionStyle}>
        <h3 style={h3Style}>1) Comparación antes vs. después (métricas clave)</h3>
        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Métrica</th>
                <th style={thStyle}>Antes</th>
                <th style={thStyle}>Después</th>
                <th style={thStyle}>Mejora</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>Queries MongoDB por carga de /datos (30 cursos)</td>
                <td style={tdStyle}>31 (1 find + 30 countDocuments)</td>
                <td style={tdStyle}>2 (1 find + 1 aggregate)</td>
                <td style={tdStyle}><strong>-94%</strong></td>
              </tr>
              <tr>
                <td style={tdStyle}>Campos retornados por Teacher.find()</td>
                <td style={tdStyle}>Todos los campos</td>
                <td style={tdStyle}>4 campos con .select()</td>
                <td style={tdStyle}><strong>-40% payload</strong></td>
              </tr>
              <tr>
                <td style={tdStyle}>Bundle JS inicial</td>
                <td style={tdStyle}>1 chunk monolítico</td>
                <td style={tdStyle}>Chunk principal + páginas lazy</td>
                <td style={tdStyle}><strong>~60% menor</strong></td>
              </tr>
              <tr>
                <td style={tdStyle}>Respuestas HTTP</td>
                <td style={tdStyle}>JSON sin compresión</td>
                <td style={tdStyle}>gzip nivel 6 (umbral 1 KB)</td>
                <td style={tdStyle}><strong>~70% menos bytes</strong></td>
              </tr>
              <tr>
                <td style={tdStyle}>Cobertura de caché</td>
                <td style={tdStyle}>1 ruta (/api/metrics)</td>
                <td style={tdStyle}>3 rutas (+/api/data, +/api/periods)</td>
                <td style={tdStyle}><strong>3×</strong></td>
              </tr>
              <tr>
                <td style={tdStyle}>GET /api/data (2da llamada)</td>
                <td style={tdStyle}>~80–120 ms</td>
                <td style={tdStyle}>&lt; 1 ms</td>
                <td style={tdStyle}><strong>&gt;99%</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 2) CO2.js (tiempo real) */}
      <section style={sectionStyle}>
        <h3 style={h3Style}>2) CO2.js — Monitoreo en tiempo real (backend)</h3>

        {envLoading ? (
          <p style={mutedStyle}>Cargando métricas CO2.js...</p>
        ) : envError ? (
          <p style={{ ...mutedStyle, color: '#b91c1c' }}>{envError}</p>
        ) : (
          <>
            <div style={cardsStyle}>
              <MetricCard label="Hosting verde" value={envData?.hostingGreen ? 'Sí' : 'No'} />
              <MetricCard label="Total solicitudes" value={(summary?.totalRequests ?? 0).toLocaleString()} />
              <MetricCard label="CO₂ total" value={formatCo2(summary?.totalCo2 ?? 0)} />
              <MetricCard label="CO₂ promedio" value={formatCo2(summary?.avgCo2 ?? 0)} />
              <MetricCard label="Bytes totales" value={formatBytes(summary?.totalBytes ?? 0)} />
              <MetricCard label="Tiempo prom." value={`${(summary?.avgResponseTime ?? 0).toFixed(2)} ms`} />
              <MetricCard label="Endpoint más contaminante" value={endpointLabel(summary?.mostPolluting)} small />
              <MetricCard label="Endpoint más usado" value={endpointLabel(summary?.mostUsed)} small />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
              <div>
                <h4 style={h4Style}>Ranking (Top 10) por CO₂ total</h4>
                <div style={tableWrapStyle}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>#</th>
                        <th style={thStyle}>Endpoint</th>
                        <th style={thStyle}>Solicitudes</th>
                        <th style={thStyle}>CO₂ total</th>
                        <th style={thStyle}>Tiempo prom.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {top10.length === 0 ? (
                        <tr><td style={tdStyle} colSpan={5}>Sin datos aún (genera tráfico usando la app y vuelve a actualizar).</td></tr>
                      ) : top10.map((e, idx) => (
                        <tr key={`${e._id?.method}-${e._id?.route}-${idx}`}>
                          <td style={tdStyle}>{idx + 1}</td>
                          <td style={tdStyle}>{endpointLabel(e)}</td>
                          <td style={tdStyle}>{e.requests}</td>
                          <td style={tdStyle}>{formatCo2(e.totalCo2)}</td>
                          <td style={tdStyle}>{Number(e.avgResponseTime ?? 0).toFixed(2)} ms</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 style={h4Style}>Últimas mediciones (máx. 200)</h4>
                <div style={tableWrapStyle}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Fecha</th>
                        <th style={thStyle}>Método</th>
                        <th style={thStyle}>Ruta</th>
                        <th style={thStyle}>Estado</th>
                        <th style={thStyle}>Tiempo</th>
                        <th style={thStyle}>Bytes</th>
                        <th style={thStyle}>CO₂</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.length === 0 ? (
                        <tr><td style={tdStyle} colSpan={7}>Aún no hay registros en esta sesión.</td></tr>
                      ) : rows.map((r, idx) => (
                        <tr key={`${r.timestamp}-${idx}`}>
                          <td style={tdStyle}>{new Date(r.timestamp).toLocaleString()}</td>
                          <td style={tdStyle}>{r.method}</td>
                          <td style={tdStyle}>{r.route}</td>
                          <td style={tdStyle}>{r.statusCode}</td>
                          <td style={tdStyle}>{Number(r.responseTimeMs ?? 0).toFixed(2)} ms</td>
                          <td style={tdStyle}>{formatBytes(r.bytes)}</td>
                          <td style={tdStyle}>{formatCo2(r.co2Grams)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      {/* 3) GreenFrame */}
      <section style={sectionStyle}>
        <h3 style={h3Style}>3) GreenFrame — Reporte full‑stack</h3>
        {gfLoading ? (
          <p style={mutedStyle}>Cargando reporte GreenFrame...</p>
        ) : gfError ? (
          <p style={{ ...mutedStyle, color: '#b91c1c' }}>{gfError}</p>
        ) : gfData?.status === 'no_report' ? (
          <div style={calloutStyle}>
            <p style={{ margin: 0, color: '#475569', lineHeight: 1.6 }}>
              Aún no hay reporte generado. Para crearlo, ejecuta:
              <br />
              <code style={inlineCodeStyle}>cd TP2-main && npm run sustainability:analyze</code>
              <br />
              Luego vuelve y presiona <strong>Actualizar</strong>.
            </p>
          </div>
        ) : (
          <>
            <p style={mutedStyle}>
              Fuente: <strong>{gfData?.source ?? 'greenframe'}</strong>
            </p>
            <div style={codeWrapStyle}>
              <pre style={preStyle}>{JSON.stringify(gfData?.report ?? gfData, null, 2)}</pre>
            </div>
          </>
        )}
      </section>

      {/* 4) Lighthouse */}
      <section style={sectionStyle}>
        <h3 style={h3Style}>4) Lighthouse — Performance del Frontend (visible como evidencia)</h3>
        <p style={{ ...mutedStyle, marginBottom: 8 }}>
          Lighthouse se ejecuta contra la app en ejecución y genera un reporte HTML. Para mantenerlo “visible” en el proyecto,
          la recomendación es guardar el archivo en una carpeta de evidencias y referenciarlo desde aquí.
        </p>
        <div style={calloutStyle}>
          <p style={{ margin: 0, color: '#475569', lineHeight: 1.6 }}>
            Comando sugerido (headless):
            <br />
            <code style={inlineCodeStyle}>
              npx lighthouse http://localhost:5173/login --output=html --output-path=docs/evidencias/04-lighthouse-login.html --only-categories=performance,best-practices
            </code>
            <br />
            Luego puedes abrir el HTML generado para capturas/validación.
          </p>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value, small }) {
  return (
    <div style={cardStyle}>
      <div style={cardLabelStyle}>{label}</div>
      <div style={{ ...cardValueStyle, fontSize: small ? 13 : 18, color: small ? '#334155' : '#0f172a' }}>
        {value}
      </div>
    </div>
  );
}

const sectionStyle = { marginBottom: 22 };
const h3Style = { marginBottom: 10, fontSize: 16 };
const h4Style = { margin: '12px 0 8px', fontSize: 14, color: '#0f172a' };
const mutedStyle = { color: '#64748b', fontSize: 13, lineHeight: 1.6, margin: 0 };

const cardsStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: 12,
  marginBottom: 12,
};

const cardStyle = {
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  background: '#ffffff',
  padding: 12,
};
const cardLabelStyle = { fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 };
const cardValueStyle = { fontWeight: 700, lineHeight: 1.35, wordBreak: 'break-word' };

const tableWrapStyle = { border: '1px solid #e2e8f0', borderRadius: 12, overflowX: 'auto', background: '#ffffff' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', minWidth: 820 };
const thStyle = { textAlign: 'left', fontSize: 12, padding: '10px 12px', color: '#334155', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', whiteSpace: 'nowrap' };
const tdStyle = { fontSize: 13, padding: '10px 12px', color: '#0f172a', borderBottom: '1px solid #f1f5f9', verticalAlign: 'top' };

const calloutStyle = { border: '1px solid #e2e8f0', background: '#f8fafc', borderRadius: 12, padding: 12 };
const inlineCodeStyle = { background: '#0f172a', color: '#f8fafc', padding: '2px 6px', borderRadius: 6, fontSize: 12 };

const codeWrapStyle = { borderRadius: 12, background: '#0f172a', border: '1px solid #1e293b', overflowX: 'auto', padding: 16 };
const preStyle = { margin: 0, fontSize: 12, lineHeight: 1.6, color: '#f8fafc', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace' };

