import { useEffect, useState, useCallback } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, useDroppable, useDraggable } from '@dnd-kit/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getFullSchedule, patchScheduleEntry } from '../api/scheduleApi';
import { useAuthStore } from '../store/authStore';

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

  const { user } = useAuthStore();
  const canEdit  = user?.role === 'admin' || user?.role === 'coordinador';

  const loadSchedule = useCallback(() => {
    setLoading(true);
    getFullSchedule()
      .then(res => {
        setEntries(res.data.entries);
        setScheduleId(res.data.scheduleId);
        setScore(res.data.score);
      })
      .catch(err => setError(err.response?.data?.message || 'Sin horario activo'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadSchedule(); }, [loadSchedule]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const courseNames = [...new Set(entries.map(e => e.courseName))].sort();
  const colorMap    = Object.fromEntries(courseNames.map((n, i) => [n, PALETTE[i % PALETTE.length]]));

  const filtered = filter
    ? entries.filter(e =>
        e.courseName.toLowerCase().includes(filter.toLowerCase()) ||
        e.teacher.toLowerCase().includes(filter.toLowerCase()) ||
        e.room.toLowerCase().includes(filter.toLowerCase())
      )
    : entries;

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

    // Optimistic update
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
    const rows   = [...entries].sort((a,b)=>a.day-b.day||a.slot-b.slot).map(e=>[
      DAYS[e.day], SLOTS[e.slot].label,
      SLOTS[Math.min(11,e.slot+e.blocks-1)].end,
      e.courseName, e.teacher, e.room, e.roomType,
    ]);
    const csv  = [header,...rows].map(r=>r.map(v=>`"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href=url; a.download=`horario_${scheduleId}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    doc.setFontSize(16);
    doc.setTextColor(8,8,8);
    doc.text('Horario Académico — Universidad Continental', 14, 16);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generado el ${new Date().toLocaleDateString('es-PE')}  ·  ${entries.length} sesiones asignadas`, 14, 22);
    if (score != null) doc.text(`Puntaje CSP: ${score.toFixed(1)}`, 14, 27);

    const sorted = [...entries].sort((a,b)=>a.day-b.day||a.slot-b.slot);
    autoTable(doc, {
      startY: 32,
      head: [['Día','Inicio','Fin','Curso','Docente','Aula','Tipo']],
      body: sorted.map(e=>[
        DAYS[e.day], SLOTS[e.slot].label,
        SLOTS[Math.min(11,e.slot+e.blocks-1)].end,
        e.courseName, e.teacher, e.room, e.roomType,
      ]),
      styles:     { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [20,110,245], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248,248,248] },
      columnStyles: {
        0:{cellWidth:24}, 1:{cellWidth:18}, 2:{cellWidth:18},
        3:{cellWidth:60}, 4:{cellWidth:50}, 5:{cellWidth:30}, 6:{cellWidth:20},
      },
    });
    doc.save(`horario_${scheduleId ?? 'activo'}.pdf`);
  };

  if (loading) return (
    <div style={{padding:'80px 0',textAlign:'center',color:'#ababab'}}>Cargando horario…</div>
  );
  if (error) return (
    <div style={{paddingTop:28}}>
      <div style={{background:'rgba(238,29,54,0.06)',border:'1px solid rgba(238,29,54,0.2)',borderRadius:6,padding:'12px 16px',color:'#ee1d36',fontSize:13,marginBottom:8}}>{error}</div>
      <p style={{fontSize:13,color:'#ababab'}}>Ve a <a href="/generar">Generar</a> para crear un horario primero.</p>
    </div>
  );

  return (
    <div style={{ paddingTop: 28 }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, flexWrap:'wrap', gap:12 }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>Horario semanal</h2>
          <p style={{ fontSize:13, color:'#ababab', margin:0 }}>
            {entries.length} sesiones
            {score != null && <> · Puntaje: <strong style={{color:'#146ef5'}}>{score.toFixed(1)}</strong></>}
            {canEdit && view==='grid' && (
              <span style={{marginLeft:10,fontSize:11,background:'rgba(20,110,245,0.08)',color:'#146ef5',padding:'2px 8px',borderRadius:4,fontWeight:600}}>
                ✦ Arrastra para reorganizar
              </span>
            )}
          </p>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
          <input placeholder="Filtrar curso / docente / aula…" value={filter}
            onChange={e=>setFilter(e.target.value)} style={{width:240}} />
          <button onClick={()=>setView(v=>v==='grid'?'list':'grid')} className="btn btn-secondary btn-sm">
            {view==='grid'?'☰ Lista':'⊞ Grilla'}
          </button>
          <button onClick={exportCSV} className="btn btn-secondary btn-sm">↓ CSV</button>
          <button onClick={exportPDF} className="btn btn-secondary btn-sm" style={{color:'#ee1d36',borderColor:'rgba(238,29,54,0.3)'}}>
            ↓ PDF
          </button>
        </div>
      </div>

      {/* DnD error */}
      {dndError && (
        <div style={{background:'rgba(238,29,54,0.06)',border:'1px solid rgba(238,29,54,0.2)',borderRadius:6,padding:'10px 14px',color:'#ee1d36',fontSize:13,marginBottom:16,display:'flex',justifyContent:'space-between'}}>
          <span>⚠ {dndError}</span>
          <button onClick={()=>setDndError(null)} style={{background:'none',border:'none',cursor:'pointer',color:'#ee1d36',fontSize:16}}>×</button>
        </div>
      )}

      {/* Legend */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:16 }}>
        {courseNames.map(name => (
          <span key={name} style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:11,padding:'3px 10px',borderRadius:20,border:'1px solid #d8d8d8',background:'#fff',color:'#363636'}}>
            <span style={{width:7,height:7,borderRadius:'50%',background:colorMap[name],flexShrink:0}} />
            {name}
          </span>
        ))}
      </div>

      {view === 'grid' ? (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <GridView grid={grid} colorMap={colorMap} canEdit={canEdit} />
          <DragOverlay>
            {activeItem && (
              <div style={{background:colorMap[activeItem.courseName],color:'#fff',borderRadius:4,padding:'6px 10px',fontSize:11,fontWeight:600,boxShadow:'0 8px 24px rgba(0,0,0,0.2)',opacity:0.9,cursor:'grabbing'}}>
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
      minHeight:48, padding:3, transition:'background 0.1s',
      background: isOver ? 'rgba(20,110,245,0.08)' : isEmpty ? '#fff' : 'transparent',
      borderLeft:'1px solid #e8e8e8', borderBottom:'1px solid #e8e8e8',
      outline: isOver ? '2px dashed #146ef5' : 'none',
      outlineOffset: '-2px',
      display:'flex', flexDirection:'column', gap:2,
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
    <div ref={setNodeRef} {...(canEdit && !isContinuation ? { ...listeners, ...attributes } : {})}
      style={{
        flex:1, borderRadius:3, padding:'3px 5px', background:color,
        opacity: isDragging ? 0.35 : isContinuation ? 0.65 : 1,
        overflow:'hidden',
        cursor: canEdit && !isContinuation ? 'grab' : 'default',
        userSelect:'none',
      }}>
      {!isContinuation ? (
        <>
          <div style={{fontWeight:600,fontSize:10,color:'#fff',lineHeight:1.2,marginBottom:1}}>{entry.courseName}</div>
          <div style={{fontSize:9,color:'rgba(255,255,255,0.85)'}}>{entry.teacher}</div>
          <div style={{fontSize:9,color:'rgba(255,255,255,0.7)'}}>{entry.room}</div>
        </>
      ) : (
        <div style={{fontSize:9,color:'rgba(255,255,255,0.5)',textAlign:'center'}}>▲</div>
      )}
    </div>
  );
}

function GridView({ grid, colorMap, canEdit }) {
  return (
    <div className="card" style={{ overflow:'hidden' }}>
      <div style={{ overflowX:'auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:`64px repeat(5, minmax(130px, 1fr))`, gap:0, minWidth:760 }}>
          <div style={{background:'#f8f8f8',padding:'10px 8px',borderBottom:'1px solid #d8d8d8'}} />
          {DAYS_SHORT.map((d,di) => (
            <div key={d} style={{background:'#f8f8f8',padding:'10px 8px',textAlign:'center',fontWeight:600,fontSize:11,color:'#ababab',textTransform:'uppercase',letterSpacing:'0.08em',borderLeft:'1px solid #e8e8e8',borderBottom:'1px solid #d8d8d8'}}>
              {DAYS[di]}
            </div>
          ))}
          {SLOTS.map((slot,si) => (
            <>
              <div key={`t-${si}`} style={{background:'#f8f8f8',padding:'6px 4px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:1,borderBottom:'1px solid #e8e8e8'}}>
                <span style={{fontSize:10,fontWeight:600,color:'#5a5a5a',fontFamily:'var(--mono,monospace)'}}>{slot.label}</span>
                <span style={{fontSize:9,color:'#ababab'}}>{slot.end}</span>
              </div>
              {Array.from({length:5},(_,di) => {
                const cells    = grid[di][si];
                const prev     = si > 0 ? grid[di][si-1] : [];
                const isCont   = cells.length>0 && prev.some(p=>cells.some(c=>c.varId===p.varId));
                return (
                  <DroppableCell key={`${di}-${si}`} id={`${di}-${si}`} isEmpty={cells.length===0}>
                    {cells.map((e,idx) => (
                      <DraggableBlock key={`${e.varId}-${idx}`} entry={e}
                        color={colorMap[e.courseName]??'#146ef5'}
                        isContinuation={isCont} canEdit={canEdit} />
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
  const sorted = [...entries].sort((a,b)=>a.day-b.day||a.slot-b.slot);
  return (
    <div className="card" style={{ overflow:'hidden' }}>
      <table>
        <thead><tr>{['Día','Horario','Curso','Docente','Aula','Tipo'].map(h=><th key={h}>{h}</th>)}</tr></thead>
        <tbody>
          {sorted.map((e,i) => (
            <tr key={`${e.varId}-${i}`}>
              <td style={{fontWeight:500,color:'#146ef5'}}>{DAYS[e.day]}</td>
              <td style={{fontFamily:'var(--mono,monospace)',fontSize:12}}>
                {SLOTS[e.slot].label}–{SLOTS[Math.min(11,e.slot+e.blocks-1)].end}
              </td>
              <td>
                <span style={{display:'flex',alignItems:'center',gap:7}}>
                  <span style={{width:7,height:7,borderRadius:'50%',background:colorMap[e.courseName],flexShrink:0}} />
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
