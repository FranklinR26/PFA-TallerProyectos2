import { useEffect, useState, useCallback } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, useDroppable, useDraggable } from '@dnd-kit/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getFullSchedule, patchScheduleEntry } from '../api/scheduleApi';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';

const DAYS       = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const DAYS_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
const SLOTS      = Array.from({ length: 12 }, (_, i) => ({
  label: `${String(i + 8).padStart(2, '0')}:00`,
  end:   `${String(i + 9).padStart(2, '0')}:00`,
  index: i,
}));
const PALETTE = [
  '#146ef5','#7a3dff','#ed52cb','#00b894',
  '#ffae13','#ff6b00','#0ea5e9','#009618',
  '#a855f7','#06b6d4','#ee1d36','#84cc16',
];

export default function SchedulePage() {
  const [entries,    setEntries]    = useState([]);
  const [scheduleId, setScheduleId] = useState(null);
  const [score,      setScore]      = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [filter,     setFilter]     = useState('');
  const [view,       setView]       = useState('grid');
  const [dndError,   setDndError]   = useState(null);
  const [activeItem, setActiveItem] = useState(null);

  // Vistas por docente / estudiante / aula / curso
  const [viewMode,          setViewMode]          = useState('all');
  const [selectedTeacher,   setSelectedTeacher]   = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedRoom,      setSelectedRoom]      = useState('');
  const [selectedCourse,    setSelectedCourse]    = useState('');

  const { user } = useAuthStore();
  const canEdit  = user?.role === 'admin' || user?.role === 'coordinador';
  const isCoord  = user?.role === 'admin' || user?.role === 'coordinador';

  const { students: allStudents, fetchAll: fetchDataAll } = useDataStore();

  const loadSchedule = useCallback(() => {
    setLoading(true);
    getFullSchedule()
      .then(res => {
        setEntries(res.data.entries ?? []);
        setScheduleId(res.data.scheduleId);
        setScore(res.data.score);
      })
      .catch(err => setError(err.response?.data?.message || 'Sin horario activo'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadSchedule(); }, [loadSchedule]);
  useEffect(() => { if (isCoord) fetchDataAll(); }, [isCoord]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  // Listas únicas para los dropdowns
  const scheduleTeachers = [...new Set(entries.map(e => e.teacher).filter(t => t && t !== '—'))].sort();
  const scheduleRooms    = [...new Set(entries.map(e => e.room).filter(Boolean))].sort();
  const scheduleCourses  = [...new Set(entries.map(e => e.courseName).filter(Boolean))].sort();

  // Estudiante seleccionado
  const selectedStudentObj = allStudents.find(s => s._id === selectedStudentId) ?? null;

  // Filtrado por texto
  let filtered = filter
    ? entries.filter(e =>
        e.courseName.toLowerCase().includes(filter.toLowerCase()) ||
        e.teacher.toLowerCase().includes(filter.toLowerCase()) ||
        e.room.toLowerCase().includes(filter.toLowerCase())
      )
    : [...entries];

  // Filtrado por vista
  if (viewMode === 'teacher' && selectedTeacher) {
    filtered = filtered.filter(e => e.teacher === selectedTeacher);
  }
  if (viewMode === 'student' && selectedStudentObj) {
    const enrolledIds = new Set(
      selectedStudentObj.courses.map(c => (typeof c === 'string' ? c : String(c._id ?? c)))
    );
    filtered = filtered.filter(e => enrolledIds.has(e.courseId));
  }
  if (viewMode === 'room' && selectedRoom) {
    filtered = filtered.filter(e => e.room === selectedRoom);
  }
  if (viewMode === 'course' && selectedCourse) {
    filtered = filtered.filter(e => e.courseName === selectedCourse);
  }

  // Colores por curso (basado en TODOS los entries para consistencia)
  const allCourseNames = [...new Set(entries.map(e => e.courseName))].sort();
  const colorMap = Object.fromEntries(allCourseNames.map((n, i) => [n, PALETTE[i % PALETTE.length]]));

  // Grid
  const grid = Array.from({ length: 5 }, () => Array.from({ length: 12 }, () => []));
  for (const e of filtered) {
    for (let k = 0; k < e.blocks; k++) {
      if (e.slot + k < 12) grid[e.day][e.slot + k].push(e);
    }
  }

  const handleDragStart = ({ active }) => {
    setActiveItem(entries.find(e => e.varId === active.id) ?? null);
    setDndError(null);
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveItem(null);
    if (!over) return;
    const [newDay, newSlot] = over.id.split('-').map(Number);
    const entry = entries.find(e => e.varId === active.id);
    if (!entry || (entry.day === newDay && entry.slot === newSlot)) return;

    setEntries(prev => prev.map(e =>
      e.varId === active.id ? { ...e, day: newDay, slot: newSlot } : e
    ));
    try {
      await patchScheduleEntry(active.id, newDay, newSlot, entry.roomId);
    } catch (err) {
      setDndError(err.response?.data?.message || 'No se pudo mover la sesión');
      loadSchedule();
    }
  };

  const exportCSV = () => {
    const header = ['Día','Hora inicio','Hora fin','Curso','Docente','Aula','Tipo'];
    const rows = [...filtered].sort((a,b) => a.day - b.day || a.slot - b.slot).map(e => [
      DAYS[e.day], SLOTS[e.slot].label,
      SLOTS[Math.min(11, e.slot + e.blocks - 1)].end,
      e.courseName, e.teacher, e.room, e.roomType,
    ]);
    const csv  = [header, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `horario_${scheduleId}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    doc.setFontSize(14); doc.setTextColor(8, 8, 8);
    let title = 'Horario Académico — Universidad Continental';
    if (viewMode === 'teacher' && selectedTeacher) title += ` · ${selectedTeacher}`;
    if (viewMode === 'student' && selectedStudentObj) title += ` · ${selectedStudentObj.name}`;
    doc.text(title, 14, 16);
    doc.setFontSize(9); doc.setTextColor(100);
    doc.text(`Generado el ${new Date().toLocaleDateString('es-PE')} · ${filtered.length} sesiones`, 14, 22);
    if (score != null) doc.text(`Puntaje CSP: ${score.toFixed(1)}`, 14, 27);
    const sorted = [...filtered].sort((a, b) => a.day - b.day || a.slot - b.slot);
    autoTable(doc, {
      startY: 32,
      head: [['Día','Inicio','Fin','Curso','Docente','Aula','Tipo']],
      body: sorted.map(e => [
        DAYS[e.day], SLOTS[e.slot].label,
        SLOTS[Math.min(11, e.slot + e.blocks - 1)].end,
        e.courseName, e.teacher, e.room, e.roomType,
      ]),
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [20, 110, 245], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 248, 248] },
      columnStyles: {
        0:{cellWidth:24}, 1:{cellWidth:18}, 2:{cellWidth:18},
        3:{cellWidth:60}, 4:{cellWidth:50}, 5:{cellWidth:30}, 6:{cellWidth:20},
      },
    });
    doc.save(`horario_${scheduleId ?? 'activo'}.pdf`);
  };

  if (loading) return (
    <div style={{ padding: '80px 0', textAlign: 'center', color: '#ababab' }}>Cargando horario…</div>
  );
  if (error) return (
    <div style={{ paddingTop: 28 }}>
      <div style={{ background: 'rgba(238,29,54,0.06)', border: '1px solid rgba(238,29,54,0.2)', borderRadius: 6, padding: '12px 16px', color: '#ee1d36', fontSize: 13, marginBottom: 8 }}>
        {error}
      </div>
      <p style={{ fontSize: 13, color: '#ababab' }}>
        Ve a <a href="/generar">Generar</a> para crear un horario primero.
      </p>
    </div>
  );

  return (
    <div style={{ paddingTop: 28 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>Horario semanal</h2>
          <p style={{ fontSize: 13, color: '#ababab', margin: 0 }}>
            {filtered.length} sesiones
            {entries.length !== filtered.length && (
              <span style={{ color: '#146ef5' }}> (de {entries.length} totales)</span>
            )}
            {score != null && (
              <> · Puntaje: <strong style={{ color: '#146ef5' }}>{score.toFixed(1)}</strong></>
            )}
            {canEdit && view === 'grid' && viewMode === 'all' && (
              <span style={{ marginLeft: 10, fontSize: 11, background: 'rgba(20,110,245,0.08)', color: '#146ef5', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                ✦ Arrastra para reorganizar
              </span>
            )}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            placeholder="Filtrar curso / docente / aula…"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{ width: 240 }}
          />
          <button onClick={() => setView(v => v === 'grid' ? 'list' : 'grid')} className="btn btn-secondary btn-sm">
            {view === 'grid' ? '☰ Lista' : '⊞ Grilla'}
          </button>
          <button onClick={exportCSV} className="btn btn-secondary btn-sm">↓ CSV</button>
          <button onClick={exportPDF} className="btn btn-secondary btn-sm" style={{ color: '#ee1d36', borderColor: 'rgba(238,29,54,0.3)' }}>
            ↓ PDF
          </button>
        </div>
      </div>

      {/* ── Panel Coordinador ── */}
      {isCoord && (
        <div className="card" style={{ padding: '14px 20px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#363636', whiteSpace: 'nowrap' }}>
              Ver horario de:
            </span>

            {/* Botones de modo */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {[
                { id: 'all',     label: 'Todos' },
                { id: 'teacher', label: 'Docente' },
                { id: 'student', label: 'Estudiante' },
                { id: 'room',    label: 'Aula' },
                { id: 'course',  label: 'Curso' },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => {
                    setViewMode(m.id);
                    setSelectedTeacher(''); setSelectedStudentId('');
                    setSelectedRoom('');    setSelectedCourse('');
                  }}
                  className="btn btn-sm"
                  style={{
                    background: viewMode === m.id ? '#146ef5' : 'transparent',
                    color:      viewMode === m.id ? '#fff'     : '#5a5a5a',
                    border:     `1px solid ${viewMode === m.id ? '#146ef5' : '#d8d8d8'}`,
                    fontWeight: viewMode === m.id ? 600 : 400,
                    padding: '5px 12px',
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Dropdown según modo */}
            {viewMode === 'teacher' && (
              <select value={selectedTeacher} onChange={e => setSelectedTeacher(e.target.value)}
                style={{ fontSize: 13, padding: '6px 10px', borderRadius: 6, border: '1px solid #d8d8d8', minWidth: 220 }}>
                <option value="">— Selecciona un docente —</option>
                {scheduleTeachers.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            )}

            {viewMode === 'student' && (
              <select value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)}
                style={{ fontSize: 13, padding: '6px 10px', borderRadius: 6, border: '1px solid #d8d8d8', minWidth: 220 }}>
                <option value="">— Selecciona un estudiante —</option>
                {allStudents.map(s => (
                  <option key={s._id} value={s._id}>{s.name}{s.code ? ` (${s.code})` : ''}</option>
                ))}
              </select>
            )}

            {viewMode === 'room' && (
              <select value={selectedRoom} onChange={e => setSelectedRoom(e.target.value)}
                style={{ fontSize: 13, padding: '6px 10px', borderRadius: 6, border: '1px solid #d8d8d8', minWidth: 220 }}>
                <option value="">— Selecciona un aula —</option>
                {scheduleRooms.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            )}

            {viewMode === 'course' && (
              <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}
                style={{ fontSize: 13, padding: '6px 10px', borderRadius: 6, border: '1px solid #d8d8d8', minWidth: 220 }}>
                <option value="">— Selecciona un curso —</option>
                {scheduleCourses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}

            {/* Badge de sesiones filtradas */}
            {viewMode !== 'all' && (selectedTeacher || selectedStudentObj || selectedRoom || selectedCourse) && (
              <span style={{
                fontSize: 12, padding: '3px 10px', borderRadius: 20,
                background: 'rgba(20,110,245,0.08)', color: '#146ef5',
                border: '1px solid rgba(20,110,245,0.2)', fontWeight: 600,
              }}>
                {filtered.length} sesión{filtered.length !== 1 ? 'es' : ''}
              </span>
            )}
          </div>

          {viewMode === 'student' && selectedStudentObj && filtered.length === 0 && (
            <p style={{ margin: '10px 0 0', fontSize: 13, color: '#ababab' }}>
              {selectedStudentObj.name} no tiene cursos matriculados en este horario.
            </p>
          )}
        </div>
      )}

      {/* ── DnD error ── */}
      {dndError && (
        <div style={{ background: 'rgba(238,29,54,0.06)', border: '1px solid rgba(238,29,54,0.2)', borderRadius: 6, padding: '10px 14px', color: '#ee1d36', fontSize: 13, marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <span>⚠ {dndError}</span>
          <button onClick={() => setDndError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ee1d36', fontSize: 16 }}>×</button>
        </div>
      )}

      {/* ── Leyenda ── */}
      {filtered.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {[...new Set(filtered.map(e => e.courseName))].sort().map(name => (
            <span key={name} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, padding: '3px 10px', borderRadius: 20, border: '1px solid #d8d8d8', background: '#fff', color: '#363636' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: colorMap[name], flexShrink: 0 }} />
              {name}
            </span>
          ))}
        </div>
      )}

      {/* ── Grid / Lista ── */}
      {view === 'grid' ? (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <GridView grid={grid} colorMap={colorMap} canEdit={canEdit && viewMode === 'all' && !filter} />
          <DragOverlay>
            {activeItem && (
              <div style={{ background: colorMap[activeItem.courseName], color: '#fff', borderRadius: 4, padding: '6px 10px', fontSize: 11, fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', opacity: 0.9, cursor: 'grabbing' }}>
                {activeItem.courseName}
              </div>
            )}
          </DragOverlay>
        </DndContext>
      ) : (
        <ListView entries={filtered} colorMap={colorMap} />
      )}
    </div>
  );
}

function DroppableCell({ id, children, isEmpty }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} style={{
      minHeight: 48, padding: 3, transition: 'background 0.1s',
      background: isOver ? 'rgba(20,110,245,0.08)' : isEmpty ? '#fff' : 'transparent',
      borderLeft: '1px solid #e8e8e8', borderBottom: '1px solid #e8e8e8',
      outline: isOver ? '2px dashed #146ef5' : 'none',
      outlineOffset: '-2px',
      display: 'flex', flexDirection: 'column', gap: 2,
    }}>
      {children}
    </div>
  );
}

function DraggableBlock({ entry, color, isContinuation, canEdit }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: entry.varId,
    disabled: !canEdit || isContinuation,
  });
  return (
    <div
      ref={setNodeRef}
      {...(canEdit && !isContinuation ? { ...listeners, ...attributes } : {})}
      style={{
        flex: 1, borderRadius: 3, padding: '3px 5px', background: color,
        opacity: isDragging ? 0.35 : isContinuation ? 0.65 : 1,
        overflow: 'hidden',
        cursor: canEdit && !isContinuation ? 'grab' : 'default',
        userSelect: 'none',
      }}
    >
      {!isContinuation ? (
        <>
          <div style={{ fontWeight: 600, fontSize: 10, color: '#fff', lineHeight: 1.2, marginBottom: 1 }}>{entry.courseName}</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.85)' }}>{entry.teacher}</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)' }}>{entry.room}</div>
        </>
      ) : (
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>▲</div>
      )}
    </div>
  );
}

function GridView({ grid, colorMap, canEdit }) {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `64px repeat(5, minmax(130px, 1fr))`, gap: 0, minWidth: 760 }}>
          <div style={{ background: '#f8f8f8', padding: '10px 8px', borderBottom: '1px solid #d8d8d8' }} />
          {DAYS_SHORT.map((d, di) => (
            <div key={d} style={{ background: '#f8f8f8', padding: '10px 8px', textAlign: 'center', fontWeight: 600, fontSize: 11, color: '#ababab', textTransform: 'uppercase', letterSpacing: '0.08em', borderLeft: '1px solid #e8e8e8', borderBottom: '1px solid #d8d8d8' }}>
              {DAYS[di]}
            </div>
          ))}
          {SLOTS.map((slot, si) => (
            <>
              <div key={`t-${si}`} style={{ background: '#f8f8f8', padding: '6px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, borderBottom: '1px solid #e8e8e8' }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#5a5a5a', fontFamily: 'var(--mono,monospace)' }}>{slot.label}</span>
                <span style={{ fontSize: 9, color: '#ababab' }}>{slot.end}</span>
              </div>
              {Array.from({ length: 5 }, (_, di) => {
                const cells  = grid[di][si];
                const prev   = si > 0 ? grid[di][si - 1] : [];
                const isCont = cells.length > 0 && prev.some(p => cells.some(c => c.varId === p.varId));
                return (
                  <DroppableCell key={`${di}-${si}`} id={`${di}-${si}`} isEmpty={cells.length === 0}>
                    {cells.map((e, idx) => (
                      <DraggableBlock
                        key={`${e.varId}-${idx}`}
                        entry={e}
                        color={colorMap[e.courseName] ?? '#146ef5'}
                        isContinuation={isCont}
                        canEdit={canEdit}
                      />
                    ))}
                  </DroppableCell>
                );
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

function ListView({ entries, colorMap }) {
  const sorted = [...entries].sort((a, b) => a.day - b.day || a.slot - b.slot);
  if (sorted.length === 0) return (
    <div className="card" style={{ padding: '40px 24px', textAlign: 'center', color: '#ababab', fontSize: 13 }}>
      No hay sesiones para mostrar.
    </div>
  );
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <table>
        <thead>
          <tr>{['Día','Horario','Curso','Docente','Aula','Tipo'].map(h => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {sorted.map((e, i) => (
            <tr key={`${e.varId}-${i}`}>
              <td style={{ fontWeight: 500, color: '#146ef5' }}>{DAYS[e.day]}</td>
              <td style={{ fontFamily: 'var(--mono,monospace)', fontSize: 12 }}>
                {SLOTS[e.slot].label}–{SLOTS[Math.min(11, e.slot + e.blocks - 1)].end}
              </td>
              <td>
                <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: colorMap[e.courseName], flexShrink: 0 }} />
                  {e.courseName}
                </span>
              </td>
              <td>{e.teacher}</td>
              <td>{e.room}</td>
              <td><span className={`badge ${roomTypeBadge(e.roomType)}`}>{roomTypeLabel(e.roomType)}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function roomTypeBadge(type) {
  return { lab: 'badge-purple', taller: 'badge-yellow', auditorio: 'badge-green' }[type] ?? 'badge-blue';
}
function roomTypeLabel(type) {
  return { teoria: 'Teoría', lab: 'Lab', taller: 'Taller', auditorio: 'Auditorio' }[type] ?? type;
}
