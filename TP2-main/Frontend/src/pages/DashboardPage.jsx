import { useEffect } from 'react';
import { useMetricsStore } from '../store/metricsStore';

const DAYS  = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
const SLOTS = Array.from({ length: 12 }, (_, i) =>
  `${String(i + 8).padStart(2, '0')}:00`
);

const STATUS_COLOR = {
  ok:   '#009618',
  warn: '#b87800',
  err:  '#ee1d36',
};
const STATUS_BG = {
  ok:   'rgba(0,215,34,0.08)',
  warn: 'rgba(255,174,19,0.08)',
  err:  'rgba(238,29,54,0.08)',
};

export default function DashboardPage() {
  const { metrics: m, loading, error, fetch } = useMetricsStore();

  useEffect(() => { fetch(); }, []);

  if (loading) return (
    <div style={{ padding: '80px 0', textAlign: 'center', color: '#ababab' }}>
      Calculando métricas…
    </div>
  );

  if (error) return (
    <div style={{ paddingTop: 28 }}>
      <div style={{
        background: 'rgba(238,29,54,0.06)', border: '1px solid rgba(238,29,54,0.2)',
        borderRadius: 6, padding: '12px 16px', color: '#ee1d36', fontSize: 13,
        marginBottom: 8,
      }}>
        {error}
      </div>
      <p style={{ fontSize: 13, color: '#ababab' }}>
        Genera un horario en la pestaña "Generar" para ver el dashboard.
      </p>
    </div>
  );

  if (!m) return null;

  const maxHeat = Math.max(1, ...m.heat.flat());

  return (
    <div style={{ paddingTop: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 4 }}>Dashboard de métricas</h2>
        <p style={{ color: '#ababab', fontSize: 13 }}>
          Análisis del horario activo generado por CSP
        </p>
      </div>

      {/* KPI grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: 12, marginBottom: 24,
      }}>
        <MetricCard
          label="Preferencias satisfechas" value={m.prefPct} unit="%"
          hint="Bloques en slots preferidos por docentes"
          pct={m.prefPct}
          status={m.prefPct >= 60 ? 'ok' : m.prefPct >= 30 ? 'warn' : 'err'}
        />
        <MetricCard
          label="Huecos por estudiante" value={m.avgGaps}
          hint="Promedio de huecos por día (menor es mejor)"
          pct={100 - Math.min(100, m.avgGaps * 20)}
          status={m.avgGaps < 1 ? 'ok' : m.avgGaps < 2 ? 'warn' : 'err'}
        />
        <MetricCard
          label="Utilización de aulas" value={m.roomUtil} unit="%"
          hint="Bloques ocupados vs disponibles"
          pct={m.roomUtil}
          status={m.roomUtil >= 20 && m.roomUtil <= 70 ? 'ok' : 'warn'}
        />
        <MetricCard
          label="Balance por sección" value={m.balanceScore} unit="/10"
          hint="Equilibrio de carga diaria entre días"
          pct={m.balanceScore * 10}
          status={m.balanceScore >= 7 ? 'ok' : m.balanceScore >= 5 ? 'warn' : 'err'}
        />
        <MetricCard
          label="Conflictos de estudiantes" value={m.studentConflicts}
          hint="Choques individuales detectados (debe ser 0)"
          pct={m.studentConflicts === 0 ? 100 : 0}
          status={m.studentConflicts === 0 ? 'ok' : 'err'}
        />
        <MetricCard
          label="Ocupación de cupos" value={m.courseFill} unit="%"
          hint="Porcentaje promedio de cupos ocupados"
          pct={m.courseFill}
          status={m.courseFill >= 60 ? 'ok' : m.courseFill >= 30 ? 'warn' : 'err'}
        />
        <MetricCard
          label="Cobertura CSP" value={m.coveragePct} unit="%"
          hint={`${m.assignedCount ?? '?'} de ${m.totalVars ?? '?'} sesiones asignadas`}
          pct={m.coveragePct}
          status={m.coveragePct === 100 ? 'ok' : 'warn'}
        />
        <MetricCard
          label="Puntaje blando total" value={m.score?.toFixed(1) ?? '—'}
          hint="Score acumulado de restricciones blandas"
          pct={null} status="ok"
        />
      </div>

      {/* Heatmap */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, marginBottom: 2 }}>Densidad del horario</h3>
          <p style={{ fontSize: 12, color: '#ababab', margin: 0 }}>
            Bloques simultáneos por franja horaria
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: `52px repeat(5, 1fr)`,
          gap: 3, fontSize: 11,
        }}>
          {/* Header */}
          <div />
          {DAYS.map(d => (
            <div key={d} style={{
              textAlign: 'center', fontWeight: 600, padding: '6px 4px',
              fontSize: 11, color: '#ababab',
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              {d}
            </div>
          ))}

          {/* Rows */}
          {SLOTS.map((slot, si) => (
            <>
              <div key={`l-${si}`} style={{
                fontSize: 10, color: '#ababab',
                fontFamily: 'var(--mono, monospace)',
                padding: '6px 4px',
                display: 'flex', alignItems: 'center',
              }}>
                {slot}
              </div>
              {DAYS.map((_, di) => {
                const val       = m.heat[di][si];
                const intensity = val / maxHeat;
                const bg        = val === 0
                  ? '#f8f8f8'
                  : `rgba(20,110,245,${0.12 + intensity * 0.72})`;
                const textColor = intensity > 0.5 ? '#ffffff' : val > 0 ? '#146ef5' : '#d8d8d8';
                return (
                  <div key={`${di}-${si}`} style={{
                    padding: '6px 4px', textAlign: 'center',
                    borderRadius: 4,
                    background: bg,
                    color: textColor,
                    fontWeight: val > 0 ? 600 : 400,
                    fontSize: 11,
                    border: `1px solid ${val === 0 ? '#e8e8e8' : 'transparent'}`,
                    transition: 'background 0.15s',
                  }}>
                    {val > 0 ? val : '·'}
                  </div>
                );
              })}
            </>
          ))}
        </div>

        {/* Legend */}
        <div style={{
          marginTop: 14, display: 'flex', alignItems: 'center', gap: 8,
          justifyContent: 'flex-end',
        }}>
          <span style={{ fontSize: 11, color: '#ababab' }}>Densidad:</span>
          {[0, 0.25, 0.5, 0.75, 1].map(t => (
            <div key={t} style={{
              width: 20, height: 20, borderRadius: 3,
              background: t === 0
                ? '#f8f8f8'
                : `rgba(20,110,245,${0.12 + t * 0.72})`,
              border: t === 0 ? '1px solid #e8e8e8' : 'none',
            }} />
          ))}
          <span style={{ fontSize: 11, color: '#ababab' }}>Alta</span>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, unit = '', hint, pct, status = 'ok' }) {
  const color = STATUS_COLOR[status] ?? '#146ef5';
  const bg    = STATUS_BG[status]    ?? 'rgba(20,110,245,0.08)';
  return (
    <div className="card" style={{
      padding: '18px 20px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: color,
      }} />
      <div className="label" style={{ marginBottom: 10 }}>{label}</div>
      <div style={{
        fontSize: 28, fontWeight: 700, letterSpacing: '-1px', color: '#080808',
        display: 'flex', alignItems: 'baseline', gap: 3,
      }}>
        {value}
        {unit && (
          <span style={{ fontSize: 14, fontWeight: 400, color: '#ababab' }}>{unit}</span>
        )}
      </div>
      {pct != null && (
        <div style={{
          height: 4, background: '#f2f2f2', borderRadius: 2,
          overflow: 'hidden', margin: '10px 0 8px',
        }}>
          <div style={{
            height: '100%', background: color,
            width: `${Math.max(0, Math.min(100, pct))}%`,
            borderRadius: 2, transition: 'width 0.4s',
          }} />
        </div>
      )}
      <div style={{ fontSize: 12, color: '#ababab', lineHeight: 1.4 }}>{hint}</div>

      <div style={{
        position: 'absolute', top: 12, right: 14,
        background: bg, color, borderRadius: 4,
        padding: '2px 7px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}>
        {status === 'ok' ? 'OK' : status === 'warn' ? 'Warn' : 'Error'}
      </div>
    </div>
  );
}
