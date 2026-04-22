import { useEffect, useRef, useState, useCallback } from 'react';
import { useScheduleStore } from '../store/scheduleStore';
import { useDataStore }     from '../store/dataStore';
import { usePeriodStore }   from '../store/periodStore';
import { validateSchedule } from '../api/scheduleApi';

const WEIGHT_LABELS = {
  pref:    'Preferencias horarias del docente',
  balance: 'Distribución equilibrada de carga diaria',
  gaps:    'Evitar huecos en horario de estudiantes',
  spread:  'Separar sesiones en días distintos',
  core:    'Evitar horarios muy tempranos o tardíos',
};

const DAYS_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
const SLOT_HOURS = Array.from({ length: 12 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`);

export default function GeneratePage() {
  const {
    weights, params, solution, score, nodes, timeMs,
    generating, error, log,
    setWeights, setParams, generate, loadActive,
  } = useScheduleStore();

  const { courses, classrooms, teachers, fetchAll } = useDataStore();
  const { periods, fetch: fetchPeriods } = usePeriodStore();
  const logRef = useRef(null);

  const [validation, setValidation] = useState(null);   // null | 'loading' | { ok, errors, warnings, stats }
  const runValidate = useCallback(async () => {
    setValidation('loading');
    try {
      const res = await validateSchedule();
      setValidation(res.data);
    } catch (err) {
      setValidation({ ok: false, errors: [err.response?.data?.message || err.message], warnings: [], stats: {} });
    }
  }, []);

  useEffect(() => { loadActive(); fetchAll(); fetchPeriods(); }, []);
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  const totalSessions = courses.reduce((s, c) => s + c.sessionsPerWeek, 0);
  const activePeriod  = periods.find(p => p.isActive);

  // Heatmap: suma de disponibilidad de todos los docentes
  const heatmap = Array.from({ length: 5 }, () => Array(12).fill(0));
  for (const t of teachers) {
    if (!t.availability) continue;
    for (let d = 0; d < 5; d++) {
      for (let s = 0; s < 12; s++) {
        const v = t.availability[d]?.[s] ?? 0;
        if (v > 0) heatmap[d][s] += v;
      }
    }
  }
  const maxHeat = Math.max(1, ...heatmap.flat());

  return (
    <div style={{ paddingTop: 28, maxWidth: 900, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 4 }}>Generador de horarios</h2>
        <p style={{ color: '#ababab', fontSize: 13 }}>
          Motor CSP con backtracking + MRV + forward checking
          {activePeriod && (
            <> · Período activo: <strong style={{ color: '#146ef5' }}>{activePeriod.name}</strong></>
          )}
        </p>
      </div>

      {/* Warning sin período */}
      {!activePeriod && periods.length > 0 && (
        <div style={{
          background: 'rgba(255,174,19,0.08)', border: '1px solid rgba(255,174,19,0.3)',
          borderRadius: 6, padding: '10px 14px', marginBottom: 20,
          color: '#b87800', fontSize: 13,
        }}>
          ⚠ No hay período activo. Ve a <a href="/datos">Datos → Períodos</a> para activar uno.
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
        {[
          ['Cursos',    courses.length],
          ['Sesiones',  totalSessions],
          ['Aulas',     classrooms.length],
          ['Docentes',  teachers.length],
        ].map(([label, val]) => (
          <div key={label} className="card" style={{ padding: '16px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#080808', letterSpacing: '-1px' }}>{val}</div>
            <div className="label" style={{ marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Heatmap disponibilidad docentes */}
      {teachers.length > 0 && (
        <div className="card" style={{ padding: '20px 24px', marginBottom: 16 }}>
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, marginBottom: 2 }}>Disponibilidad agregada de docentes</h3>
            <p style={{ fontSize: 12, color: '#ababab', margin: 0 }}>
              Número de docentes disponibles por franja — útil para anticipar slots con más flexibilidad.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `44px repeat(5, 1fr)`, gap: 2 }}>
            <div />
            {DAYS_SHORT.map(d => (
              <div key={d} style={{
                textAlign: 'center', fontSize: 10, fontWeight: 600,
                color: '#ababab', textTransform: 'uppercase',
                letterSpacing: '0.06em', padding: '3px 0',
              }}>{d}</div>
            ))}
            {SLOT_HOURS.map((slot, si) => (
              <>
                <div key={`l-${si}`} style={{
                  fontSize: 9, color: '#ababab', display: 'flex', alignItems: 'center',
                  fontFamily: 'var(--mono, monospace)',
                }}>{slot}</div>
                {DAYS_SHORT.map((_, di) => {
                  const val       = heatmap[di][si];
                  const intensity = val / maxHeat;
                  const bg        = val === 0 ? '#f8f8f8' : `rgba(20,110,245,${0.1 + intensity * 0.75})`;
                  const textColor = intensity > 0.55 ? '#fff' : val > 0 ? '#146ef5' : '#d8d8d8';
                  return (
                    <div key={`${di}-${si}`} style={{
                      height: 28, borderRadius: 3,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: bg, color: textColor, fontSize: 10, fontWeight: 600,
                      border: `1px solid ${val === 0 ? '#e8e8e8' : 'transparent'}`,
                    }}>
                      {val > 0 ? val : ''}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 11, color: '#ababab' }}>0</span>
            {[0.15, 0.35, 0.55, 0.75, 1].map(t => (
              <div key={t} style={{ width: 18, height: 18, borderRadius: 3, background: `rgba(20,110,245,${0.1 + t * 0.75})` }} />
            ))}
            <span style={{ fontSize: 11, color: '#ababab' }}>{teachers.length} docentes</span>
          </div>
        </div>
      )}

      {/* Pre-CSP validation */}
      <div className="card" style={{ padding: '20px 24px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: validation && validation !== 'loading' ? 16 : 0 }}>
          <div>
            <h3 style={{ fontSize: 14, marginBottom: 2 }}>Validación de datos</h3>
            <p style={{ fontSize: 12, color: '#ababab', margin: 0 }}>
              Detecta problemas antes de lanzar el solver.
            </p>
          </div>
          <button
            onClick={runValidate}
            disabled={validation === 'loading'}
            className="btn btn-secondary btn-sm"
            style={{ minWidth: 110 }}
          >
            {validation === 'loading' ? <><Spinner /> Validando…</> : 'Validar datos'}
          </button>
        </div>

        {validation && validation !== 'loading' && (
          <div>
            {/* Summary badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              marginBottom: 12,
              background: validation.ok ? 'rgba(0,215,34,0.08)' : 'rgba(238,29,54,0.08)',
              color: validation.ok ? '#009618' : '#ee1d36',
              border: `1px solid ${validation.ok ? 'rgba(0,215,34,0.25)' : 'rgba(238,29,54,0.25)'}`,
            }}>
              {validation.ok ? '✓ Todo en orden' : `✗ ${validation.errors.length} error${validation.errors.length !== 1 ? 'es' : ''} encontrado${validation.errors.length !== 1 ? 's' : ''}`}
            </div>

            {/* Stats row */}
            {validation.stats && (
              <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
                {[
                  ['Cursos', validation.stats.courses],
                  ['Aulas', validation.stats.classrooms],
                  ['Docentes', validation.stats.teachers],
                  ['Sesiones/semana', validation.stats.totalSessions],
                ].map(([label, val]) => (
                  <div key={label} style={{ fontSize: 12, color: '#5a5a5a' }}>
                    <span style={{ fontWeight: 600, color: '#080808' }}>{val}</span> {label}
                  </div>
                ))}
              </div>
            )}

            {/* Errors */}
            {validation.errors.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                {validation.errors.map((msg, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 8, alignItems: 'flex-start',
                    padding: '7px 10px', marginBottom: 4, borderRadius: 5,
                    background: 'rgba(238,29,54,0.05)', border: '1px solid rgba(238,29,54,0.18)',
                    fontSize: 13, color: '#c0152b',
                  }}>
                    <span style={{ marginTop: 1, flexShrink: 0 }}>✕</span>
                    {msg}
                  </div>
                ))}
              </div>
            )}

            {/* Warnings */}
            {validation.warnings.length > 0 && (
              <div>
                {validation.warnings.map((msg, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 8, alignItems: 'flex-start',
                    padding: '7px 10px', marginBottom: 4, borderRadius: 5,
                    background: 'rgba(255,174,19,0.06)', border: '1px solid rgba(255,174,19,0.25)',
                    fontSize: 13, color: '#b87800',
                  }}>
                    <span style={{ marginTop: 1, flexShrink: 0 }}>⚠</span>
                    {msg}
                  </div>
                ))}
              </div>
            )}

            {validation.ok && validation.warnings.length === 0 && (
              <p style={{ fontSize: 13, color: '#5a5a5a', margin: 0 }}>
                Datos completos. Puedes generar el horario sin problemas.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Weights */}
      <div className="card" style={{ padding: '20px 24px', marginBottom: 16 }}>
        <h3 style={{ marginBottom: 16, fontSize: 14 }}>Pesos de restricciones blandas</h3>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {Object.entries(WEIGHT_LABELS).map(([key, label], idx, arr) => (
            <div key={key} style={{
              display: 'grid', gridTemplateColumns: '1fr 200px 40px',
              alignItems: 'center', gap: 16, padding: '10px 0',
              borderBottom: idx < arr.length - 1 ? '1px solid #f2f2f2' : 'none',
            }}>
              <span style={{ fontSize: 13, color: '#363636' }}>{label}</span>
              <input type="range" min={0} max={10} value={weights[key]}
                onChange={e => setWeights({ ...weights, [key]: +e.target.value })}
                style={{ width: '100%' }} />
              <span style={{ textAlign: 'right', fontWeight: 600, fontSize: 14, color: '#146ef5' }}>
                {weights[key]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Params */}
      <div className="card" style={{ padding: '20px 24px', marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16, fontSize: 14 }}>Parámetros del motor</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {[
            ['Timeout (ms)', 'timeout',  1000,  60000],
            ['Reinicios',    'restarts',    1,      10],
            ['Nodos máx.',   'maxNodes', 10000, 1000000],
          ].map(([label, key, min, max]) => (
            <div key={key}>
              <label className="label" style={{ display: 'block', marginBottom: 6 }}>{label}</label>
              <input type="number" min={min} max={max} value={params[key]}
                onChange={e => setParams({ ...params, [key]: +e.target.value })}
                style={{ width: '100%' }} />
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      {(() => {
        const hasErrors = validation && validation !== 'loading' && !validation.ok;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            <button onClick={generate} disabled={generating || courses.length === 0 || hasErrors}
              className="btn btn-primary btn-lg">
              {generating ? <><Spinner /> Generando…</> : <>Generar horario <span>→</span></>}
            </button>
            {courses.length === 0 && (
              <span style={{ fontSize: 13, color: '#ababab' }}>Agrega cursos en "Datos" antes de generar.</span>
            )}
            {hasErrors && (
              <span style={{ fontSize: 13, color: '#c0152b' }}>
                Corrige los errores de validación antes de generar.
              </span>
            )}
            {!hasErrors && validation && validation !== 'loading' && !generating && (
              <span style={{ fontSize: 13, color: '#009618' }}>✓ Validación OK</span>
            )}
          </div>
        );
      })()}

      {/* Result cards */}
      {(solution || error) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
          {[
            ['Tiempo (ms)', timeMs ?? '—', null],
            ['Nodos',       nodes  ?? '—', null],
            ['Puntaje',     score != null ? score.toFixed(1) : '—', null],
            ['Estado',      error ? 'Error' : 'OK', error ? 'err' : 'ok'],
          ].map(([label, val, status]) => (
            <div key={label} className="card" style={{
              padding: '16px 18px', textAlign: 'center',
              borderTop: `3px solid ${status === 'ok' ? '#00d722' : status === 'err' ? '#ee1d36' : '#146ef5'}`,
            }}>
              <div style={{
                fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px',
                color: status === 'err' ? '#ee1d36' : status === 'ok' ? '#009618' : '#080808',
              }}>
                {val}
              </div>
              <div className="label" style={{ marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Log */}
      {log.length > 0 && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{
            padding: '10px 16px', borderBottom: '1px solid #d8d8d8',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span className="label">Log del solver</span>
            <span style={{ fontSize: 11, color: '#ababab' }}>{log.length} líneas</span>
          </div>
          <pre ref={logRef} style={{
            margin: 0, padding: '12px 16px',
            fontFamily: 'var(--mono, monospace)', fontSize: 12,
            color: '#363636', background: '#f8f8f8',
            maxHeight: 220, overflowY: 'auto',
            whiteSpace: 'pre-wrap', lineHeight: 1.6,
          }}>
            {log.join('\n')}
          </pre>
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
}
