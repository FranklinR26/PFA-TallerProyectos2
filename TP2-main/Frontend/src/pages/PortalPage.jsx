import { useEffect, useState } from 'react';
import { usePortalStore } from '../store/portalStore';
import { useAuthStore }   from '../store/authStore';
import { saveAvailability } from '../api/portalApi';

const DAYS  = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
const SLOTS = Array.from({ length: 12 }, (_, i) =>
  `${String(i + 8).padStart(2, '0')}:00`
);

const PALETTE = [
  '#146ef5','#7a3dff','#ed52cb','#00b894',
  '#ffae13','#ff6b00','#0ea5e9','#009618',
];

export default function PortalPage() {
  const {
    student, teacher, courses: docenteCourses, sessionList,
    enrolledCourses, availableCourses,
    personalGrid, hasSchedule, totalBlocks,
    loading, error, fetch,
    enroll, unenroll, joinWaitlist, leaveWaitlist,
  } = usePortalStore();

  // El rol viene SIEMPRE del JWT (authStore), nunca del portalStore
  // Esto evita que datos de una sesión anterior contaminen la vista
  const role = useAuthStore(s => s.user?.role);

  const [actionError, setActionError] = useState(null);

  useEffect(() => { fetch(); }, []);

  const handle = async (fn, courseId) => {
    setActionError(null);
    try { await fn(courseId); }
    catch (err) { setActionError(err.response?.data?.message || err.message); }
  };

  if (loading) return (
    <div style={{ padding: '80px 0', textAlign: 'center', color: '#ababab' }}>
      Cargando portal…
    </div>
  );
  if (error) return (
    <div style={{ paddingTop: 28 }}>
      <div style={{
        background: 'rgba(238,29,54,0.06)', border: '1px solid rgba(238,29,54,0.2)',
        borderRadius: 6, padding: '12px 16px', color: '#ee1d36', fontSize: 13,
      }}>
        {error}
      </div>
    </div>
  );

  // Vista docente
  if (role === 'docente') {
    return <DocentePortal
      teacher={teacher} courses={docenteCourses ?? []}
      sessionList={sessionList ?? []} personalGrid={personalGrid ?? {}}
      hasSchedule={hasSchedule} totalBlocks={totalBlocks}
    />;
  }

  const colorMap = {};
  enrolledCourses.forEach((c, i) => {
    colorMap[c._id] = PALETTE[i % PALETTE.length];
  });

  return (
    <div style={{ paddingTop: 28 }}>

      {/* Hero banner */}
      <div style={{
        background: '#080808', borderRadius: 10,
        padding: '24px 28px', marginBottom: 24,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.2px',
            textTransform: 'uppercase', color: '#146ef5', marginBottom: 6 }}>
            Portal del Estudiante
          </p>
          <h2 style={{ color: '#ffffff', marginBottom: 4, fontSize: 20 }}>
            {student?.name ?? 'Cargando…'}
          </h2>
          <p style={{ color: '#5a5a5a', fontSize: 13, margin: 0 }}>
            {student?.code}{student?.section ? ` · ${student.section}` : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            ['Matriculados', enrolledCourses.length],
            ['Bloques/sem',  totalBlocks],
            ['Disponibles',  availableCourses.length],
            ['Horario',      hasSchedule ? 'Sí' : 'Pendiente'],
          ].map(([label, val]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 22, fontWeight: 700, color: '#ffffff',
                letterSpacing: '-0.5px',
              }}>
                {val}
              </div>
              <div style={{
                fontSize: 10, color: '#5a5a5a',
                textTransform: 'uppercase', letterSpacing: '0.06em',
                marginTop: 2,
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action error */}
      {actionError && (
        <div style={{
          background: 'rgba(238,29,54,0.06)', border: '1px solid rgba(238,29,54,0.2)',
          borderRadius: 6, padding: '10px 14px', marginBottom: 16,
          color: '#ee1d36', fontSize: 13,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span>{actionError}</span>
          <button
            onClick={() => setActionError(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer',
              color: '#ee1d36', fontSize: 18, lineHeight: 1 }}
          >
            ×
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 20 }}>

        {/* Left column: enrollment */}
        <div>
          {/* Enrolled courses */}
          <Section title="Mis cursos matriculados" count={enrolledCourses.length}>
            {enrolledCourses.length === 0
              ? <Empty text="Aún no te has matriculado en ningún curso." />
              : enrolledCourses.map(c => (
                  <CourseCard key={c._id} course={c} color={colorMap[c._id]}>
                    <button
                      onClick={() => handle(unenroll, c._id)}
                      className="btn btn-danger btn-sm"
                    >
                      Retirarme
                    </button>
                  </CourseCard>
                ))
            }
          </Section>

          {/* Available courses */}
          <Section title="Catálogo disponible" count={availableCourses.length}>
            {availableCourses.length === 0
              ? <Empty text="No hay más cursos disponibles." />
              : availableCourses.map(c => {
                  let action;
                  if (c.inWaitlist) {
                    action = (
                      <button onClick={() => handle(leaveWaitlist, c._id)} className="btn btn-secondary btn-sm">
                        ✕ Salir de espera
                      </button>
                    );
                  } else if (c.isFull) {
                    action = (
                      <button onClick={() => handle(joinWaitlist, c._id)} className="btn btn-secondary btn-sm">
                        ⏳ Lista de espera
                      </button>
                    );
                  } else if (c.conflictReason) {
                    action = (
                      <button disabled className="btn btn-secondary btn-sm" title={c.conflictReason}>
                        ⚠ Choque
                      </button>
                    );
                  } else {
                    action = (
                      <button onClick={() => handle(enroll, c._id)} className="btn btn-primary btn-sm">
                        Matricularme
                      </button>
                    );
                  }
                  return (
                    <CourseCard key={c._id} course={c}>
                      <div>
                        {action}
                        {c.conflictReason && (
                          <div style={{
                            fontSize: 11, color: '#b87800', marginTop: 6,
                            background: 'rgba(255,174,19,0.08)',
                            padding: '3px 7px', borderRadius: 4,
                          }}>
                            ⚠ {c.conflictReason}
                          </div>
                        )}
                        {c.inWaitlist && (
                          <div style={{ fontSize: 11, color: '#b87800', marginTop: 4 }}>
                            En lista de espera
                          </div>
                        )}
                      </div>
                    </CourseCard>
                  );
                })
            }
          </Section>
        </div>

        {/* Right column: personal schedule */}
        <div className="card" style={{
          padding: '20px', position: 'sticky',
          top: 72, maxHeight: 'calc(100vh - 92px)', overflowY: 'auto',
        }}>
          <h3 style={{ fontSize: 14, marginBottom: 14 }}>Mi horario semanal</h3>
          {hasSchedule
            ? <ScheduleGrid grid={personalGrid} colorMap={colorMap} enrolledCourses={enrolledCourses} />
            : (
              <div style={{
                textAlign: 'center', padding: '48px 20px',
                color: '#ababab',
              }}>
                <div style={{ fontSize: 36, marginBottom: 12, filter: 'grayscale(1) opacity(0.4)' }}>📅</div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#363636', marginBottom: 4 }}>
                  Horario no publicado
                </div>
                <div style={{ fontSize: 13 }}>
                  Tu matrícula queda registrada. El horario aparecerá aquí cuando se genere.
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}

function Section({ title, count, children }) {
  return (
    <div className="card" style={{ padding: 18, marginBottom: 16 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 14,
      }}>
        <h3 style={{ margin: 0, fontSize: 13 }}>{title}</h3>
        <span style={{
          background: '#f2f2f2', borderRadius: 20, padding: '2px 10px',
          fontSize: 11, color: '#5a5a5a', fontWeight: 600,
        }}>
          {count}
        </span>
      </div>
      {children}
    </div>
  );
}

function CourseCard({ course: c, color, children }) {
  const fillColor = c.fillPct >= 100 ? '#ee1d36' : c.fillPct >= 80 ? '#b87800' : '#009618';
  return (
    <div style={{
      background: '#f8f8f8',
      border: '1px solid #e8e8e8',
      borderLeft: color ? `3px solid ${color}` : '1px solid #e8e8e8',
      borderRadius: 6, padding: '12px 14px', marginBottom: 8,
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'flex-start', gap: 12,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: 600, fontSize: 13, marginBottom: 3,
          display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
        }}>
          {c.name}
          <span className={`badge ${c.roomType === 'lab' ? 'badge-purple' : 'badge-blue'}`}>
            {c.roomType}
          </span>
        </div>
        <div style={{ fontSize: 12, color: '#ababab', marginBottom: 2 }}>{c.teacher}</div>
        {c.schedule && <div style={{ fontSize: 12, color: '#5a5a5a', marginBottom: 4 }}>{c.schedule}</div>}
        <div style={{ fontSize: 12, color: fillColor, fontWeight: 600, marginBottom: 4 }}>
          {c.enrolled}/{c.capacity} cupos
        </div>
        <div style={{ height: 3, background: '#e8e8e8', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 2,
            width: `${Math.min(100, c.fillPct)}%`,
            background: fillColor,
          }} />
        </div>
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function ScheduleGrid({ grid, colorMap, enrolledCourses }) {
  const idToColor = {};
  enrolledCourses.forEach(c => { idToColor[c._id] = colorMap[c._id]; });

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `48px repeat(5, 1fr)`,
      gap: 2, fontSize: 10,
    }}>
      <div />
      {DAYS.map(d => (
        <div key={d} style={{
          textAlign: 'center', fontWeight: 600, padding: '4px 2px',
          color: '#ababab', fontSize: 10,
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          {d}
        </div>
      ))}
      {SLOTS.map((slot, si) => (
        <>
          <div key={`t-${si}`} style={{
            fontSize: 9, color: '#ababab',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--mono, monospace)',
            padding: '2px',
          }}>
            {slot}
          </div>
          {DAYS.map((_, di) => {
            const cell = grid[`${di}-${si}`];
            const bg   = cell ? (idToColor[cell.courseId] ?? '#146ef5') : '#f8f8f8';
            return (
              <div key={`${di}-${si}`} style={{
                minHeight: 36, borderRadius: 3, padding: 3,
                background: bg,
                border: `1px solid ${cell ? 'transparent' : '#e8e8e8'}`,
                overflow: 'hidden',
              }}>
                {cell && (
                  <>
                    <div style={{ fontWeight: 600, fontSize: 8, color: '#fff', lineHeight: 1.2 }}>
                      {cell.courseName}
                    </div>
                    <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.8)', marginTop: 1 }}>
                      {cell.teacher}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </>
      ))}
    </div>
  );
}

function Empty({ text }) {
  return (
    <div style={{ textAlign: 'center', padding: '24px 16px', color: '#ababab', fontSize: 13 }}>
      {text}
    </div>
  );
}

const DAYS_FULL  = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const SLOT_HOURS = Array.from({ length: 12 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`);

function DocentePortal({ teacher, courses, sessionList, personalGrid, hasSchedule, totalBlocks }) {
  const makeDefault = () => Array.from({ length: 5 }, () => Array(12).fill(1));

  const [avail,   setAvail]   = useState(makeDefault());
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [saveErr, setSaveErr] = useState(null);

  // Cargar disponibilidad del teacher cuando llega del store
  useEffect(() => {
    if (teacher?.availability) setAvail(teacher.availability);
  }, [teacher?._id]);

  const toggle = (day, slot) => {
    setAvail(prev => {
      const next = prev.map(r => [...r]);
      next[day][slot] = (next[day][slot] + 1) % 3; // 0→1→2→0
      return next;
    });
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true); setSaveErr(null);
    try {
      await saveAvailability(avail);
      setSaved(true);
    } catch (err) {
      setSaveErr(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const PALETTE_DOC = ['#146ef5','#7a3dff','#ed52cb','#00b894','#ffae13','#ff6b00','#0ea5e9','#009618'];
  const colorMap = Object.fromEntries(
    courses.map((c, i) => [c._id.toString(), PALETTE_DOC[i % PALETTE_DOC.length]])
  );

  const CELL = {
    0: { bg: '#f2f2f2', border: '#d8d8d8', label: '—', color: '#ababab' },
    1: { bg: '#ffffff', border: '#d8d8d8', label: '✓', color: '#363636' },
    2: { bg: 'rgba(20,110,245,0.10)', border: '#146ef5', label: '★', color: '#146ef5' },
  };

  return (
    <div style={{ paddingTop: 28 }}>
      {/* Banner */}
      <div style={{
        background: '#080808', borderRadius: 10,
        padding: '24px 28px', marginBottom: 24,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.2px',
            textTransform: 'uppercase', color: '#009618', marginBottom: 6 }}>
            Portal del Docente
          </p>
          <h2 style={{ color: '#ffffff', marginBottom: 4, fontSize: 20 }}>{teacher?.name}</h2>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            ['Cursos',       courses.length],
            ['Sesiones/sem', sessionList.length],
            ['Bloques/sem',  totalBlocks],
            ['Horario',      hasSchedule ? 'Publicado' : 'Pendiente'],
          ].map(([label, val]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.5px' }}>{val}</div>
              <div style={{ fontSize: 10, color: '#5a5a5a', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Disponibilidad */}
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: 14, marginBottom: 2 }}>Mi disponibilidad horaria</h3>
              <p style={{ fontSize: 12, color: '#ababab', margin: 0 }}>
                Haz clic para cambiar: <strong style={{ color: '#ababab' }}>—</strong> No disponible ·{' '}
                <strong style={{ color: '#363636' }}>✓</strong> Disponible ·{' '}
                <strong style={{ color: '#146ef5' }}>★</strong> Preferido
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn btn-primary btn-sm"
            >
              {saving ? 'Guardando…' : saved ? '✓ Guardado' : 'Guardar'}
            </button>
          </div>

          {saveErr && (
            <div style={{
              background: 'rgba(238,29,54,0.06)', border: '1px solid rgba(238,29,54,0.2)',
              borderRadius: 4, padding: '8px 12px', color: '#ee1d36',
              fontSize: 12, marginBottom: 12,
            }}>
              {saveErr}
            </div>
          )}

          <div style={{ overflowX: 'auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `44px repeat(5, 1fr)`,
              gap: 2, fontSize: 10,
            }}>
              <div />
              {DAYS_FULL.map(d => (
                <div key={d} style={{
                  textAlign: 'center', fontWeight: 600, padding: '4px 2px',
                  color: '#ababab', fontSize: 10,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  {d.slice(0, 3)}
                </div>
              ))}
              {SLOT_HOURS.map((slot, si) => (
                <>
                  <div key={`t-${si}`} style={{
                    fontSize: 9, color: '#ababab',
                    display: 'flex', alignItems: 'center',
                    fontFamily: 'var(--mono, monospace)',
                  }}>
                    {slot}
                  </div>
                  {DAYS_FULL.map((_, di) => {
                    const v = avail[di]?.[si] ?? 1;
                    const s = CELL[v];
                    return (
                      <button
                        key={`${di}-${si}`}
                        onClick={() => toggle(di, si)}
                        title={`${DAYS_FULL[di]} ${slot}`}
                        style={{
                          minHeight: 30, borderRadius: 3,
                          background: s.bg,
                          border: `1px solid ${s.border}`,
                          cursor: 'pointer',
                          fontSize: 11, color: s.color, fontWeight: 600,
                          transition: 'all 0.1s',
                          padding: 0,
                        }}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        </div>

        {/* Horario asignado + cursos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Cursos */}
          <div className="card" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 13, marginBottom: 12 }}>Mis cursos asignados</h3>
            {courses.length === 0
              ? <Empty text="No tienes cursos asignados aún." />
              : courses.map(c => (
                <div key={c._id} style={{
                  background: '#f8f8f8', border: '1px solid #e8e8e8',
                  borderLeft: `3px solid ${colorMap[c._id.toString()] ?? '#146ef5'}`,
                  borderRadius: 6, padding: '10px 14px', marginBottom: 8,
                }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: '#ababab', marginTop: 2 }}>
                    {c.sessionsPerWeek} sesiones / semana
                  </div>
                </div>
              ))
            }
          </div>

          {/* Horario */}
          <div className="card" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 13, marginBottom: 12 }}>Mi horario asignado</h3>
            {hasSchedule
              ? <ScheduleGrid grid={personalGrid} colorMap={colorMap} enrolledCourses={courses} />
              : (
                <div style={{ textAlign: 'center', padding: '32px 16px', color: '#ababab' }}>
                  <div style={{ fontSize: 30, marginBottom: 8, filter: 'grayscale(1) opacity(0.4)' }}>📅</div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#363636', marginBottom: 4 }}>
                    Horario no publicado aún
                  </div>
                  <div style={{ fontSize: 12 }}>
                    El coordinador generará el horario con tu disponibilidad.
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}
