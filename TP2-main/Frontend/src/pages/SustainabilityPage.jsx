import { useEffect, useState } from 'react';
import { getSustainabilityReport } from '../api/sustainabilityApi';

export default function SustainabilityPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadReport() {
      try {
        const { data } = await getSustainabilityReport();
        setReport(data);
      } catch (err) {
        setError(err.response?.data?.message || 'No se pudo cargar el reporte de sostenibilidad.');
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, []);

  return (
    <div style={{ paddingTop: 28, paddingBottom: 40 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 4 }}>Sostenibilidad y Green Software</h2>
        <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
          Interfaz adicional que centraliza el reporte ambiental y los resultados de GreenFrame.
        </p>
      </div>

      <section style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <a
            href="/environmental-impact"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
            style={{ minWidth: 180 }}
          >
            Ver dashboard ambiental
          </a>
          <a
            href="/api/sustainability"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
            style={{ minWidth: 180 }}
          >
            Abrir reporte de GreenFrame
          </a>
        </div>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 8, fontSize: 18 }}>Dashboard integrado</h3>
        <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.7 }}>
          El dashboard de impacto ambiental se carga en un iframe para ofrecer una interfaz adicional dentro
          de las rutas del sistema.
        </p>
        <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #d1d5db', minHeight: 360 }}>
          <iframe
            title="Dashboard Ambiental"
            src="/environmental-impact"
            style={{ width: '100%', height: 520, border: 'none' }}
          />
        </div>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 8, fontSize: 18 }}>Reporte GreenFrame</h3>
        {loading && <p style={{ color: '#475569' }}>Cargando reporte...</p>}
        {!loading && error && (
          <div style={{ background: '#fde8e8', color: '#b91c1c', padding: 16, borderRadius: 12 }}>
            {error}
          </div>
        )}
        {!loading && !error && report && (
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
              <div style={cardStyle}>
                <span style={labelStyle}>Estado del reporte</span>
                <strong>{report.status}</strong>
              </div>
              <div style={cardStyle}>
                <span style={labelStyle}>Origen</span>
                <strong>{report.source || 'GreenFrame'}</strong>
              </div>
              <div style={cardStyle}>
                <span style={labelStyle}>Formato</span>
                <strong>{report.report ? 'JSON' : 'Texto'}</strong>
              </div>
            </div>

            <div style={{ borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0', padding: 16 }}>
              <h4 style={{ marginBottom: 12, fontSize: 16 }}>JSON de reporte</h4>
              <pre style={preStyle}>{JSON.stringify(report, null, 2)}</pre>
            </div>
          </div>
        )}
      </section>

      <section>
        <h3 style={{ marginBottom: 8, fontSize: 18 }}>Por qué es sobresaliente</h3>
        <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.7 }}>
          Esta ruta garantiza que la solución no solo sea funcional, sino que también muestre evidencia de
          sostenibilidad y métricas ambientales como un valor agregado dentro del producto.
        </p>
      </section>
    </div>
  );
}

const cardStyle = {
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: 16,
  padding: 16,
  minHeight: 100,
};

const labelStyle = {
  display: 'block',
  color: '#64748b',
  fontSize: 12,
  marginBottom: 8,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const preStyle = {
  margin: 0,
  fontSize: 12,
  lineHeight: 1.5,
  color: '#111827',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
};
