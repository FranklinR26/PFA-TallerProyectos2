import { useEffect, useState } from 'react';
import { getSustainabilityReport } from '../api/sustainabilityApi';

const cardStyle = { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 };
const labelStyle = { fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', display: 'block', marginBottom: 8 };
const preStyle = { background: '#1e293b', color: '#e2e8f0', padding: 12, borderRadius: 6, overflow: 'auto', fontSize: 12, lineHeight: 1.5 };

const METRIC_LABELS = {
  apiResponseTime: 'Tiempo de respuesta API',
  pageLoadTime: 'Carga de página',
  bundleSize: 'Tamaño del bundle',
  co2PerPageView: 'CO₂ por vista',
};

const STATUS_COLOR = { ok: '#059669', warn: '#d97706', err: '#dc2626' };

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function formatCo2(grams) {
  if (!Number.isFinite(grams) || grams === 0) return '0 g';
  if (grams < 0.001) return `${(grams * 1000).toFixed(2)} mg`;
  return `${grams.toFixed(3)} g`;
}

function KpiCard({ label, value, sub, accent }) {
  return (
    <div style={{ ...cardStyle, borderLeft: `4px solid ${accent || '#146ef5'}` }}>
      <span style={labelStyle}>{label}</span>
      <div style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

export default function SustainabilityPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    async function loadReport() {
      try {
        const { data } = await getSustainabilityReport();
        setReport(data.report ?? data);
      } catch (err) {
        setError(err.response?.data?.message || 'No se pudo cargar el reporte de sostenibilidad.');
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, []);

  const pres = report?.presentation;
  const session = pres?.sessionMetrics;

  return (
    <div style={{ paddingTop: 28, paddingBottom: 40 }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ marginBottom: 4 }}>Sostenibilidad y Green Software</h2>
        <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
          Medición del impacto ambiental basada en CO2.js con estrategias de optimización para reducir huella de carbono.
        </p>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#475569' }}>
          Cargando análisis de sostenibilidad...
        </div>
      )}

      {!loading && error && (
        <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: 16, color: '#dc2626', marginBottom: 24 }}>
          {error}
        </div>
      )}

      {!loading && !error && report && (
        <>
          {/* Hero / resumen ejecutivo */}
          <section style={{
            marginBottom: 32,
            background: 'linear-gradient(135deg, #ecfdf5 0%, #f0f9ff 100%)',
            border: '1px solid #bbf7d0',
            borderRadius: 12,
            padding: '24px 28px',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 24,
            alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                Reporte de sostenibilidad · {report.project?.name}
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700, color: '#0f172a' }}>
                {pres?.headline || report.project?.description}
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                Versión {report.project?.version} · Actualizado {new Date(report.timestamp).toLocaleString('es-PE')}
              </p>
            </div>
            {pres && (
              <div style={{ textAlign: 'center', minWidth: 120 }}>
                <div style={{
                  width: 96, height: 96, borderRadius: '50%',
                  background: '#fff', border: '4px solid #059669',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(5,150,105,0.15)',
                }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: '#059669', lineHeight: 1 }}>{pres.greenScore}</span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>/ 100</span>
                </div>
                <div style={{ marginTop: 8, fontSize: 18, fontWeight: 700, color: '#059669' }}>{pres.grade}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{pres.status}</div>
              </div>
            )}
          </section>

          {/* KPIs de sesión */}
          {session && (
            <section style={{ marginBottom: 32 }}>
              <h3 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>📈 Métricas de la sesión actual</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                <KpiCard label="Peticiones monitoreadas" value={session.totalRequests.toLocaleString('es-PE')} sub="Middleware CO2.js activo" accent="#146ef5" />
                <KpiCard label="CO₂ acumulado" value={formatCo2(session.totalCo2Grams)} sub={`${session.co2SavedVsBaseline}% menos vs. sin optimizar`} accent="#059669" />
                <KpiCard label="Datos transferidos" value={formatBytes(session.totalBytes)} sub="Compresión gzip aplicada" accent="#7c3aed" />
                <KpiCard label="Hit rate caché" value={`${session.cacheHitRate}%`} sub={`Respuesta media: ${session.avgResponseTimeMs} ms`} accent="#ea580c" />
              </div>
            </section>
          )}

          {/* Benchmarks */}
          {pres?.benchmarks?.length > 0 && (
            <section style={{ marginBottom: 32 }}>
              <h3 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>🎯 Cumplimiento de objetivos</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                {pres.benchmarks.map((b, i) => (
                  <div key={i} style={cardStyle}>
                    <span style={labelStyle}>{b.label}</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong style={{ fontSize: 20, color: STATUS_COLOR[b.status] || '#0f172a' }}>{b.value}</strong>
                      <span style={{ fontSize: 12, color: '#64748b' }}>meta {b.target}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Impacto de optimizaciones */}
          {pres?.optimizationImpact?.length > 0 && (
            <section style={{ marginBottom: 32 }}>
              <h3 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>📉 Impacto de optimizaciones</h3>
              <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {pres.optimizationImpact.map((opt, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                      <strong style={{ color: '#1e293b' }}>{opt.name}</strong>
                      <span style={{ color: '#059669', fontWeight: 600 }}>−{opt.reduction}%</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#64748b', marginBottom: 6 }}>
                      <span>Antes: <strong>{opt.before}</strong></span>
                      <span>→</span>
                      <span>Después: <strong style={{ color: '#059669' }}>{opt.after}</strong></span>
                    </div>
                    <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${opt.reduction}%`, background: 'linear-gradient(90deg, #059669, #34d399)', borderRadius: 4 }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CO2 EMISSIONS */}
          <section style={{ marginBottom: 32 }}>
            <h3 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>🌍 Medición de Emisiones de CO₂</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              {report.sustainability?.co2Monitoring?.measurements?.map((m, i) => (
                <div key={i} style={cardStyle}>
                  <span style={labelStyle}>
                    {m.dataTransfer >= 5242880 ? '5 MB' : '1 MB'} de transferencia
                  </span>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#059669' }}>
                      {(m.co2grams * 1000).toFixed(3)}
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>mg CO₂e</div>
                  </div>
                  <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
                    {m.description}
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>
                    Método: {report.sustainability?.co2Monitoring?.method}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ANNUAL FOOTPRINT */}
          <section style={{ marginBottom: 32 }}>
            <h3 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>📊 Huella de Carbono Anual Estimada</h3>
            <div style={cardStyle}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div>
                  <span style={labelStyle}>Transferencia mensual</span>
                  <strong style={{ fontSize: 18 }}>{report.estimatedAnnualCO2?.calculation?.monthlyDataTransfer}</strong>
                </div>
                <div>
                  <span style={labelStyle}>CO₂ mensual estimado</span>
                  <strong style={{ fontSize: 18, color: '#ea580c' }}>{report.estimatedAnnualCO2?.calculation?.estimatedMonthlyCO2}</strong>
                </div>
                <div>
                  <span style={labelStyle}>CO₂ anual estimado</span>
                  <strong style={{ fontSize: 18, color: '#dc2626' }}>{report.estimatedAnnualCO2?.calculation?.estimatedAnnualCO2}</strong>
                </div>
              </div>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #cbd5e1' }}>
                <span style={labelStyle}>Supuestos</span>
                <ul style={{ margin: '8px 0 0 0', paddingLeft: 20, color: '#475569', fontSize: 13 }}>
                  <li>Visitas mensuales: <strong>{report.estimatedAnnualCO2?.assumptions?.monthlyPageViews?.toLocaleString('es-PE')}</strong></li>
                  <li>Transfer promedio/vista: <strong>{report.estimatedAnnualCO2?.assumptions?.avgDataTransferPerView}</strong></li>
                  <li>Grid energético: <strong>{report.estimatedAnnualCO2?.assumptions?.energyGrid}</strong></li>
                </ul>
                {report.estimatedAnnualCO2?.calculation?.description && (
                  <p style={{ margin: '12px 0 0', fontSize: 13, color: '#64748b', fontStyle: 'italic' }}>
                    {report.estimatedAnnualCO2.calculation.description}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* INFRASTRUCTURE */}
          <section style={{ marginBottom: 32 }}>
            <h3 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>🔧 Infraestructura y Optimizaciones</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
              <div style={cardStyle}>
                <span style={labelStyle}>Backend</span>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', marginBottom: 8 }}>
                    {report.infrastructure?.backend?.technology}
                  </div>
                  <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>
                    Base de datos: <strong>{report.infrastructure?.backend?.database}</strong>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 500, marginBottom: 8 }}>Optimizaciones:</div>
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: '#475569' }}>
                  {report.infrastructure?.backend?.optimizations?.map((opt, i) => (
                    <li key={i} style={{ marginBottom: 4 }}>{opt}</li>
                  ))}
                </ul>
              </div>

              <div style={cardStyle}>
                <span style={labelStyle}>Frontend</span>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', marginBottom: 8 }}>
                    {report.infrastructure?.frontend?.framework}
                  </div>
                  <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>
                    Bundler: <strong>{report.infrastructure?.frontend?.bundler}</strong>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 500, marginBottom: 8 }}>Optimizaciones:</div>
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: '#475569' }}>
                  {report.infrastructure?.frontend?.optimizations?.map((opt, i) => (
                    <li key={i} style={{ marginBottom: 4 }}>{opt}</li>
                  ))}
                </ul>
              </div>

              <div style={cardStyle}>
                <span style={labelStyle}>Estrategia de Caché</span>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', marginBottom: 8 }}>
                    {report.sustainability?.caching?.strategy}
                  </div>
                  <div style={{ fontSize: 12, color: '#475569', marginBottom: 8 }}>
                    Reducción: <strong style={{ color: '#059669' }}>{report.sustainability?.caching?.reduction}</strong>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 500, marginBottom: 8 }}>Capas:</div>
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: '#475569' }}>
                  {report.sustainability?.caching?.layers?.map((layer, i) => (
                    <li key={i} style={{ marginBottom: 4 }}>{layer}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* PERFORMANCE TARGETS */}
          <section style={{ marginBottom: 32 }}>
            <h3 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>⚡ Objetivos de Rendimiento</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {Object.entries(report.sustainability?.performance?.targetMetrics || {}).map(([key, value]) => (
                <div key={key} style={cardStyle}>
                  <span style={labelStyle}>{METRIC_LABELS[key] || key}</span>
                  <strong style={{ fontSize: 16 }}>{value}</strong>
                </div>
              ))}
            </div>
          </section>

          {/* RECOMMENDATIONS */}
          <section style={{ marginBottom: 32 }}>
            <h3 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>💡 Recomendaciones</h3>
            <div style={cardStyle}>
              <ul style={{ margin: 0, paddingLeft: 20, color: '#475569', fontSize: 13, lineHeight: 1.8 }}>
                {report.recommendations?.map((rec, i) => (
                  <li key={i} style={{ marginBottom: 8 }}>{rec}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* CARBON OFFSET */}
          <section style={{ marginBottom: 32 }}>
            <h3 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>🌱 Estrategias de Compensación</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
              {report.estimatedAnnualCO2?.offsetStrategies?.map((strategy, i) => (
                <div key={i} style={cardStyle}>
                  <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>{strategy}</div>
                </div>
              ))}
            </div>
          </section>

          {/* GREEN HOSTING */}
          <section style={{ marginBottom: 32 }}>
            <h3 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>🟢 Hosting Ecológico</h3>
            <div style={cardStyle}>
              <div style={{ marginBottom: 16 }}>
                <span style={labelStyle}>Proveedor actual</span>
                <div style={{ fontSize: 13, color: '#1e293b', marginBottom: 8 }}>
                  <strong>{report.sustainability?.greenHosting?.mongodb?.provider}</strong>
                  <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>
                    Región: {report.sustainability?.greenHosting?.mongodb?.region}
                  </div>
                </div>
              </div>
              <div style={{ paddingTop: 16, borderTop: '1px solid #cbd5e1' }}>
                <span style={labelStyle}>Recomendación</span>
                <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 500 }}>
                  {report.sustainability?.greenHosting?.recommendation}
                </div>
              </div>
            </div>
          </section>

          {/* JSON (colapsable) */}
          <section>
            <button
              type="button"
              onClick={() => setShowJson((v) => !v)}
              style={{
                background: 'none', border: '1px solid #e2e8f0', borderRadius: 8,
                padding: '10px 16px', cursor: 'pointer', fontSize: 13, color: '#475569',
                marginBottom: showJson ? 16 : 0,
              }}
            >
              {showJson ? '▾ Ocultar' : '▸ Ver'} datos completos (JSON)
            </button>
            {showJson && (
              <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <pre style={preStyle}>{JSON.stringify(report, null, 2)}</pre>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
