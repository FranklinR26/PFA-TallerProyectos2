import { useEffect, useState } from 'react';
import { useDataStore }   from '../store/dataStore';
import { usePeriodStore } from '../store/periodStore';

const TABS = [
  { id: 'classrooms', label: 'Aulas' },
  { id: 'teachers',   label: 'Docentes' },
  { id: 'sections',   label: 'Secciones' },
  { id: 'courses',    label: 'Cursos' },
  { id: 'students',   label: 'Estudiantes' },
  { id: 'periods',    label: 'Períodos' },
];

export default function DataPage() {
  const {
    teachers, classrooms, sections, courses, students,
    loading, error, fetchAll,
    addTeacher, removeTeacher, updateTeacher,
    addClassroom, removeClassroom, updateClassroom,
    addSection, removeSection, updateSection,
    addCourse, removeCourse, updateCourse,
    addStudent, removeStudent, updateStudent,
    enroll, unenroll, bulkEnroll,
  } = useDataStore();

  const { periods, fetch: fetchPeriods, create: createPeriod,
          activate: activatePeriod, remove: removePeriod } = usePeriodStore();

  const [tab, setTab] = useState('classrooms');

  useEffect(() => { fetchAll(); fetchPeriods(); }, []);

  const counts = {
    classrooms: classrooms.length, teachers: teachers.length,
    sections: sections.length, courses: courses.length,
    students: students.length, periods: periods.length,
  };

  if (loading) return (
    <div style={{ padding: '80px 0', textAlign: 'center', color: '#ababab' }}>
      Cargando datos…
    </div>
  );
  if (error) return (
    <div style={{ padding: 24 }}>
      <div style={{ background: 'rgba(238,29,54,0.06)', border: '1px solid rgba(238,29,54,0.2)', borderRadius: 6, padding: '12px 16px', color: '#ee1d36' }}>
        {error}
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 28 }}>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 4 }}>Gestión de datos</h2>
        <p style={{ color: '#ababab', fontSize: 13 }}>Administra docentes, aulas, secciones, cursos y estudiantes</p>
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'flex', gap: 2,
        borderBottom: '1px solid #d8d8d8',
        marginBottom: 24,
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '8px 16px', border: 'none', background: 'transparent',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            color: tab === t.id ? '#146ef5' : '#5a5a5a',
            borderBottom: tab === t.id ? '2px solid #146ef5' : '2px solid transparent',
            marginBottom: -1,
            transition: 'color 0.12s',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {t.label}
            <span style={{
              padding: '1px 6px', borderRadius: 10, fontSize: 11, fontWeight: 600,
              background: tab === t.id ? 'rgba(20,110,245,0.1)' : '#f2f2f2',
              color: tab === t.id ? '#146ef5' : '#ababab',
            }}>
              {counts[t.id]}
            </span>
          </button>
        ))}
      </div>

      {tab === 'classrooms' && <ClassroomsPanel classrooms={classrooms} onAdd={addClassroom} onUpdate={updateClassroom} onDelete={removeClassroom} />}
      {tab === 'teachers'   && <TeachersPanel   teachers={teachers}     onAdd={addTeacher}   onUpdate={updateTeacher}   onDelete={removeTeacher} />}
      {tab === 'sections'   && <SectionsPanel   sections={sections}     onAdd={addSection}   onUpdate={updateSection}   onDelete={removeSection} />}
      {tab === 'courses'    && <CoursesPanel    courses={courses} teachers={teachers} classrooms={classrooms} onAdd={addCourse} onUpdate={updateCourse} onDelete={removeCourse} onEnroll={enroll} onUnenroll={unenroll} onBulkEnroll={bulkEnroll} students={students} sections={sections} />}
      {tab === 'students'   && <StudentsPanel   students={students} sections={sections} courses={courses} onAdd={addStudent} onUpdate={updateStudent} onDelete={removeStudent} />}
      {tab === 'periods'    && <PeriodsPanel    periods={periods} onCreate={createPeriod} onActivate={activatePeriod} onDelete={removePeriod} />}
    </div>
  );
}

/* ── Shared components ───────────────────────────────────────────────────── */

function PageSection({ children }) {
  return <div>{children}</div>;
}

function InlineForm({ fields, onSubmit, submitLabel = 'Agregar' }) {
  return (
    <form onSubmit={onSubmit} style={{
      display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap',
      padding: '16px', background: '#f8f8f8', border: '1px solid #d8d8d8',
      borderRadius: 6, marginBottom: 20,
    }}>
      {fields}
      <button type="submit" className="btn btn-primary btn-sm">
        + {submitLabel}
      </button>
    </form>
  );
}

function DataTable({ columns, rows, emptyText = 'Sin registros' }) {
  return (
    <div style={{ border: '1px solid #d8d8d8', borderRadius: 6, overflow: 'hidden' }}>
      {rows.length === 0
        ? <div style={{ padding: '40px 20px', textAlign: 'center', color: '#ababab', fontSize: 13 }}>{emptyText}</div>
        : <table><thead><tr>{columns.map(c => <th key={c}>{c}</th>)}</tr></thead><tbody>{rows}</tbody></table>
      }
    </div>
  );
}

function DeleteBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '4px 10px', borderRadius: 4, border: '1px solid #d8d8d8',
      background: 'transparent', color: '#ababab', fontSize: 12, cursor: 'pointer',
      transition: 'all 0.12s',
    }}
    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(238,29,54,0.06)'; e.currentTarget.style.color = '#ee1d36'; e.currentTarget.style.borderColor = 'rgba(238,29,54,0.3)'; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ababab'; e.currentTarget.style.borderColor = '#d8d8d8'; }}
    >
      Eliminar
    </button>
  );
}

function EditBtn({ onClick, active }) {
  return (
    <button onClick={onClick} style={{
      padding: '4px 10px', borderRadius: 4, fontSize: 12, cursor: 'pointer',
      border: active ? '1px solid #146ef5' : '1px solid #d8d8d8',
      background: active ? 'rgba(20,110,245,0.08)' : 'transparent',
      color: active ? '#146ef5' : '#5a5a5a',
      transition: 'all 0.12s',
    }}>
      {active ? 'Cancelar' : 'Editar'}
    </button>
  );
}

function SaveBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '4px 10px', borderRadius: 4, fontSize: 12, cursor: 'pointer',
      border: '1px solid #009618', background: 'rgba(0,215,34,0.08)',
      color: '#009618', transition: 'all 0.12s',
    }}>
      Guardar
    </button>
  );
}

function ActionCell({ children }) {
  return (
    <td style={{ textAlign: 'right' }}>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
        {children}
      </div>
    </td>
  );
}

function FormError({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ background: 'rgba(238,29,54,0.06)', border: '1px solid rgba(238,29,54,0.2)', borderRadius: 4, padding: '9px 12px', color: '#ee1d36', fontSize: 13, marginBottom: 16 }}>
      {msg}
    </div>
  );
}

/* badge helper */
function roomBadge(type) {
  const map = { lab: 'purple', taller: 'orange', auditorio: 'yellow', teoria: 'blue' };
  return map[type] ?? 'blue';
}
function roomLabel(type) {
  return { teoria: 'Teoría', lab: 'Lab cómputo', taller: 'Taller', auditorio: 'Auditorio' }[type] ?? type;
}

/* ── Panels ──────────────────────────────────────────────────────────────── */

/* ── CLASSROOMS ── */
function ClassroomsPanel({ classrooms, onAdd, onUpdate, onDelete }) {
  const [form, setForm] = useState({ name: '', type: 'teoria', capacity: 30 });
  const [editing, setEditing] = useState({ id: null, form: {} });
  const [saveErr, setSaveErr] = useState('');

  const submit = async e => {
    e.preventDefault();
    await onAdd(form);
    setForm({ name: '', type: 'teoria', capacity: 30 });
  };

  const startEdit = (r) => setEditing({ id: r._id, form: { name: r.name, type: r.type, capacity: r.capacity } });
  const cancelEdit = () => { setEditing({ id: null, form: {} }); setSaveErr(''); };
  const saveEdit = async () => {
    setSaveErr('');
    try { await onUpdate(editing.id, editing.form); cancelEdit(); }
    catch (err) { setSaveErr(err.response?.data?.message || 'Error al guardar'); }
  };
  const ef = (k) => e => setEditing(s => ({ ...s, form: { ...s.form, [k]: k === 'capacity' ? +e.target.value : e.target.value } }));

  return (
    <PageSection>
      <InlineForm onSubmit={submit} fields={[
        <input key="n" placeholder="Nombre del aula" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required style={{ width: 200 }} />,
        <select key="t" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
          <option value="teoria">Teoría</option>
          <option value="lab">Laboratorio (cómputo)</option>
          <option value="taller">Taller</option>
          <option value="auditorio">Auditorio</option>
        </select>,
        <div key="c" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <label style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#ababab' }}>Capacidad</label>
          <input type="number" value={form.capacity} min={1} onChange={e => setForm(p => ({ ...p, capacity: +e.target.value }))} style={{ width: 80 }} />
        </div>,
      ]} />
      <FormError msg={saveErr} />
      <DataTable columns={['Nombre', 'Tipo', 'Capacidad', '']}
        rows={classrooms.map(r => editing.id === r._id ? (
          <tr key={r._id} style={{ background: 'rgba(20,110,245,0.03)' }}>
            <td><input value={editing.form.name} onChange={ef('name')} style={{ width: '100%' }} /></td>
            <td>
              <select value={editing.form.type} onChange={ef('type')}>
                <option value="teoria">Teoría</option>
                <option value="lab">Laboratorio (cómputo)</option>
                <option value="taller">Taller</option>
                <option value="auditorio">Auditorio</option>
              </select>
            </td>
            <td><input type="number" value={editing.form.capacity} min={1} onChange={ef('capacity')} style={{ width: 80 }} /></td>
            <ActionCell><SaveBtn onClick={saveEdit} /><EditBtn onClick={cancelEdit} active /></ActionCell>
          </tr>
        ) : (
          <tr key={r._id}>
            <td><strong style={{ color: '#080808', fontSize: 13 }}>{r.name}</strong></td>
            <td><span className={`badge badge-${roomBadge(r.type)}`}>{roomLabel(r.type)}</span></td>
            <td>{r.capacity} personas</td>
            <ActionCell>
              <EditBtn onClick={() => startEdit(r)} />
              <DeleteBtn onClick={() => onDelete(r._id)} />
            </ActionCell>
          </tr>
        ))}
        emptyText="No hay aulas registradas"
      />
    </PageSection>
  );
}

/* ── TEACHERS ── */
function TeachersPanel({ teachers, onAdd, onUpdate, onDelete }) {
  const [form, setForm]   = useState({ name: '', email: '', password: '' });
  const [formError, setFormError] = useState('');
  const [editing, setEditing] = useState({ id: null, form: {} });
  const [saveErr, setSaveErr] = useState('');

  const submit = async e => {
    e.preventDefault(); setFormError('');
    try { await onAdd(form); setForm({ name: '', email: '', password: '' }); }
    catch (err) { setFormError(err.response?.data?.message || 'Error al crear docente'); }
  };

  const startEdit = (t) => setEditing({ id: t._id, form: { name: t.name, email: t.email || '' } });
  const cancelEdit = () => { setEditing({ id: null, form: {} }); setSaveErr(''); };
  const saveEdit = async () => {
    setSaveErr('');
    try { await onUpdate(editing.id, editing.form); cancelEdit(); }
    catch (err) { setSaveErr(err.response?.data?.message || 'Error al guardar'); }
  };
  const ef = (k) => e => setEditing(s => ({ ...s, form: { ...s.form, [k]: e.target.value } }));

  return (
    <PageSection>
      <InlineForm onSubmit={submit} fields={[
        <input key="n" placeholder="Nombre completo" value={form.name}
          onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required style={{ width: 200 }} />,
        <input key="e" type="email" placeholder="Email" value={form.email}
          onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required style={{ width: 200 }} />,
        <input key="p" type="password" placeholder="Contraseña" value={form.password}
          onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required style={{ width: 140 }} />,
      ]} />
      <FormError msg={formError} />
      <FormError msg={saveErr} />
      <DataTable columns={['Docente', 'Email', 'Disponibilidad', '']}
        rows={teachers.map(t => {
          const available = t.availability?.flat().filter(v => v > 0).length ?? 0;
          const total = 5 * 12;
          return editing.id === t._id ? (
            <tr key={t._id} style={{ background: 'rgba(20,110,245,0.03)' }}>
              <td><input value={editing.form.name} onChange={ef('name')} style={{ width: '100%' }} /></td>
              <td><input type="email" value={editing.form.email} onChange={ef('email')} style={{ width: '100%' }} /></td>
              <td style={{ color: '#ababab', fontSize: 12 }}>—</td>
              <ActionCell><SaveBtn onClick={saveEdit} /><EditBtn onClick={cancelEdit} active /></ActionCell>
            </tr>
          ) : (
            <tr key={t._id}>
              <td><strong style={{ color: '#080808' }}>{t.name}</strong></td>
              <td style={{ color: '#5a5a5a', fontSize: 13 }}>{t.email ?? <span style={{ color: '#ababab' }}>—</span>}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 100, height: 6, background: '#f2f2f2', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.round(available / total * 100)}%`, height: '100%', background: '#00d722', borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 12, color: '#ababab' }}>{Math.round(available / total * 100)}%</span>
                </div>
              </td>
              <ActionCell>
                <EditBtn onClick={() => startEdit(t)} />
                <DeleteBtn onClick={() => onDelete(t._id)} />
              </ActionCell>
            </tr>
          );
        })}
        emptyText="No hay docentes registrados"
      />
    </PageSection>
  );
}

/* ── SECTIONS ── */
function SectionsPanel({ sections, onAdd, onUpdate, onDelete }) {
  const [form, setForm] = useState({ name: '', students: 25 });
  const [editing, setEditing] = useState({ id: null, form: {} });
  const [saveErr, setSaveErr] = useState('');

  const submit = async e => { e.preventDefault(); await onAdd(form); setForm({ name: '', students: 25 }); };

  const startEdit = (s) => setEditing({ id: s._id, form: { name: s.name, students: s.students } });
  const cancelEdit = () => { setEditing({ id: null, form: {} }); setSaveErr(''); };
  const saveEdit = async () => {
    setSaveErr('');
    try { await onUpdate(editing.id, editing.form); cancelEdit(); }
    catch (err) { setSaveErr(err.response?.data?.message || 'Error al guardar'); }
  };
  const ef = (k) => e => setEditing(s => ({ ...s, form: { ...s.form, [k]: k === 'students' ? +e.target.value : e.target.value } }));

  return (
    <PageSection>
      <InlineForm onSubmit={submit} fields={[
        <input key="n" placeholder="Nombre de la sección" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required style={{ width: 220 }} />,
        <div key="s" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <label style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#ababab' }}>Estudiantes</label>
          <input type="number" value={form.students} min={1} onChange={e => setForm(p => ({ ...p, students: +e.target.value }))} style={{ width: 80 }} />
        </div>,
      ]} />
      <FormError msg={saveErr} />
      <DataTable columns={['Sección', 'Estudiantes', '']}
        rows={sections.map(s => editing.id === s._id ? (
          <tr key={s._id} style={{ background: 'rgba(20,110,245,0.03)' }}>
            <td><input value={editing.form.name} onChange={ef('name')} style={{ width: '100%' }} /></td>
            <td><input type="number" value={editing.form.students} min={1} onChange={ef('students')} style={{ width: 80 }} /></td>
            <ActionCell><SaveBtn onClick={saveEdit} /><EditBtn onClick={cancelEdit} active /></ActionCell>
          </tr>
        ) : (
          <tr key={s._id}>
            <td><strong style={{ color: '#080808' }}>{s.name}</strong></td>
            <td><span className="badge badge-blue">{s.students} est.</span></td>
            <ActionCell>
              <EditBtn onClick={() => startEdit(s)} />
              <DeleteBtn onClick={() => onDelete(s._id)} />
            </ActionCell>
          </tr>
        ))}
        emptyText="No hay secciones registradas"
      />
    </PageSection>
  );
}

/* ── COURSES ── */
function CoursesPanel({ courses, teachers, classrooms, onAdd, onUpdate, onDelete, onEnroll, onUnenroll, onBulkEnroll, students, sections }) {
  const [form, setForm] = useState({ name: '', teacher: '', sessionsPerWeek: 2, blocksPerSession: 2, roomType: 'teoria', capacity: 30 });
  const [enrollModal, setEnrollModal] = useState(null);
  const [bulk, setBulk] = useState({ sectionId: '', courseId: '' });
  const [formError, setFormError] = useState('');
  const [editing, setEditing] = useState({ id: null, form: {} });
  const [saveErr, setSaveErr] = useState('');

  const submit = async e => {
    e.preventDefault(); setFormError('');
    try { await onAdd(form); setForm({ name: '', teacher: '', sessionsPerWeek: 2, blocksPerSession: 2, roomType: 'teoria', capacity: 30 }); }
    catch (err) { setFormError(err.response?.data?.message || 'Error al crear curso'); }
  };

  const startEdit = (c) => setEditing({ id: c._id, form: {
    name: c.name,
    teacher: c.teacher?._id || c.teacher || '',
    sessionsPerWeek: c.sessionsPerWeek,
    blocksPerSession: c.blocksPerSession,
    roomType: c.roomType,
    capacity: c.capacity,
  }});
  const cancelEdit = () => { setEditing({ id: null, form: {} }); setSaveErr(''); };
  const saveEdit = async () => {
    setSaveErr('');
    try { await onUpdate(editing.id, editing.form); cancelEdit(); }
    catch (err) { setSaveErr(err.response?.data?.message || 'Error al guardar'); }
  };
  const ef = (k) => e => {
    const v = ['sessionsPerWeek','blocksPerSession','capacity'].includes(k) ? +e.target.value : e.target.value;
    setEditing(s => ({ ...s, form: { ...s.form, [k]: v } }));
  };

  return (
    <PageSection>
      <form onSubmit={submit} style={{
        padding: 16, background: '#f8f8f8', border: '1px solid #d8d8d8',
        borderRadius: 6, marginBottom: 20,
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 10, alignItems: 'end',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label className="label">Nombre del curso</label>
          <input placeholder="Ej. Matemática I" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label className="label">Docente</label>
          <select value={form.teacher} onChange={e => setForm(p => ({ ...p, teacher: e.target.value }))} required>
            <option value="">Seleccionar…</option>
            {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label className="label">Ses/semana</label>
          <input type="number" value={form.sessionsPerWeek} min={1} max={5} onChange={e => setForm(p => ({ ...p, sessionsPerWeek: +e.target.value }))} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label className="label">Bloq/sesión</label>
          <input type="number" value={form.blocksPerSession} min={1} max={4} onChange={e => setForm(p => ({ ...p, blocksPerSession: +e.target.value }))} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label className="label">Tipo de aula</label>
          <select value={form.roomType} onChange={e => setForm(p => ({ ...p, roomType: e.target.value }))}>
            <option value="teoria">Teoría</option>
            <option value="lab">Laboratorio (cómputo)</option>
            <option value="taller">Taller</option>
            <option value="auditorio">Auditorio</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label className="label">Cupo</label>
          <input type="number" value={form.capacity} min={1} onChange={e => setForm(p => ({ ...p, capacity: +e.target.value }))} />
        </div>
        <div>
          <button type="submit" className="btn btn-primary btn-sm" style={{ width: '100%' }}>+ Agregar curso</button>
        </div>
      </form>

      <FormError msg={formError} />
      <FormError msg={saveErr} />

      {/* Bulk enrollment */}
      <div style={{
        display: 'flex', gap: 8, alignItems: 'center',
        padding: '12px 16px', background: 'rgba(20,110,245,0.04)',
        border: '1px solid rgba(20,110,245,0.15)', borderRadius: 6, marginBottom: 20, flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#146ef5', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Matrícula masiva</span>
        <select value={bulk.sectionId} onChange={e => setBulk(b => ({ ...b, sectionId: e.target.value }))} style={{ fontSize: 13 }}>
          <option value="">Seleccionar sección…</option>
          {sections.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
        <select value={bulk.courseId} onChange={e => setBulk(b => ({ ...b, courseId: e.target.value }))} style={{ fontSize: 13 }}>
          <option value="">Seleccionar curso…</option>
          {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => bulk.sectionId && bulk.courseId && onBulkEnroll(bulk.sectionId, bulk.courseId)}
        >
          Matricular sección
        </button>
      </div>

      <DataTable columns={['Curso', 'Docente', 'Sesiones', 'Tipo', 'Cupo', 'Matrículas', '']}
        rows={courses.map(c => editing.id === c._id ? (
          <tr key={c._id} style={{ background: 'rgba(20,110,245,0.03)' }}>
            <td><input value={editing.form.name} onChange={ef('name')} style={{ width: '100%', minWidth: 120 }} /></td>
            <td>
              <select value={editing.form.teacher} onChange={ef('teacher')}>
                <option value="">Sin docente</option>
                {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
            </td>
            <td>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <input type="number" value={editing.form.sessionsPerWeek} min={1} max={5} onChange={ef('sessionsPerWeek')} style={{ width: 48 }} />
                <span style={{ color: '#ababab', fontSize: 11 }}>×</span>
                <input type="number" value={editing.form.blocksPerSession} min={1} max={4} onChange={ef('blocksPerSession')} style={{ width: 48 }} />
              </div>
            </td>
            <td>
              <select value={editing.form.roomType} onChange={ef('roomType')}>
                <option value="teoria">Teoría</option>
                <option value="lab">Lab cómputo</option>
                <option value="taller">Taller</option>
                <option value="auditorio">Auditorio</option>
              </select>
            </td>
            <td><input type="number" value={editing.form.capacity} min={1} onChange={ef('capacity')} style={{ width: 64 }} /></td>
            <td style={{ color: '#ababab', fontSize: 12 }}>—</td>
            <ActionCell><SaveBtn onClick={saveEdit} /><EditBtn onClick={cancelEdit} active /></ActionCell>
          </tr>
        ) : (
          <tr key={c._id}>
            <td><strong style={{ color: '#080808' }}>{c.name}</strong></td>
            <td style={{ color: '#5a5a5a' }}>{c.teacher?.name || <span style={{ color: '#ee1d36', fontSize: 12 }}>Sin docente</span>}</td>
            <td><span style={{ fontSize: 12, color: '#5a5a5a' }}>{c.sessionsPerWeek}×{c.blocksPerSession}h</span></td>
            <td><span className={`badge badge-${roomBadge(c.roomType)}`}>{roomLabel(c.roomType)}</span></td>
            <td><span style={{ fontSize: 13, color: '#5a5a5a' }}>{c.capacity}</span></td>
            <td>
              <button onClick={() => setEnrollModal(c._id)} style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                fontSize: 13, color: '#146ef5', fontWeight: 500,
              }}>
                {c.enrolled ?? 0}/{c.capacity}
              </button>
            </td>
            <ActionCell>
              <EditBtn onClick={() => startEdit(c)} />
              <DeleteBtn onClick={() => onDelete(c._id)} />
            </ActionCell>
          </tr>
        ))}
        emptyText="No hay cursos registrados"
      />

      {enrollModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(8,8,8,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999,
        }}>
          <div style={{
            background: '#fff', borderRadius: 8, padding: 28,
            maxHeight: '70vh', overflowY: 'auto', width: 400,
            border: '1px solid #d8d8d8',
            boxShadow: 'rgba(0,0,0,0) 0px 84px 24px, rgba(0,0,0,0.01) 0px 54px 22px, rgba(0,0,0,0.04) 0px 30px 18px, rgba(0,0,0,0.08) 0px 13px 13px, rgba(0,0,0,0.09) 0px 3px 7px',
          }}>
            <h3 style={{ marginBottom: 16 }}>Matricular en: {courses.find(c => c._id === enrollModal)?.name}</h3>
            {students.map(s => {
              const enrolled = s.courses?.some(c => (c._id || c) === enrollModal);
              return (
                <label key={s._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #f2f2f2', cursor: 'pointer' }}>
                  <input type="checkbox" checked={!!enrolled}
                    onChange={() => enrolled ? onUnenroll(s._id, enrollModal) : onEnroll(s._id, enrollModal)}
                    style={{ accentColor: '#146ef5' }}
                  />
                  <span style={{ fontSize: 13 }}><strong>{s.code}</strong> — {s.name}</span>
                </label>
              );
            })}
            <button onClick={() => setEnrollModal(null)} className="btn btn-secondary" style={{ marginTop: 16, width: '100%' }}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </PageSection>
  );
}

/* ── STUDENTS ── */
function StudentsPanel({ students, sections, onAdd, onUpdate, onDelete }) {
  const [form, setForm] = useState({ code: '', name: '', section: '', email: '', password: '' });
  const [formError, setFormError] = useState('');
  const [editing, setEditing] = useState({ id: null, form: {} });
  const [saveErr, setSaveErr] = useState('');

  const submit = async e => {
    e.preventDefault(); setFormError('');
    try {
      await onAdd({ ...form, section: form.section || undefined });
      setForm({ code: '', name: '', section: '', email: '', password: '' });
    }
    catch (err) { setFormError(err.response?.data?.message || 'Error al crear estudiante'); }
  };

  const startEdit = (s) => setEditing({ id: s._id, form: {
    code: s.code,
    name: s.name,
    section: s.section?._id || s.section || '',
  }});
  const cancelEdit = () => { setEditing({ id: null, form: {} }); setSaveErr(''); };
  const saveEdit = async () => {
    setSaveErr('');
    try {
      await onUpdate(editing.id, { ...editing.form, section: editing.form.section || undefined });
      cancelEdit();
    }
    catch (err) { setSaveErr(err.response?.data?.message || 'Error al guardar'); }
  };
  const ef = (k) => e => setEditing(s => ({ ...s, form: { ...s.form, [k]: e.target.value } }));

  return (
    <PageSection>
      <form onSubmit={submit} style={{
        display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap',
        padding: '16px', background: '#f8f8f8', border: '1px solid #d8d8d8',
        borderRadius: 6, marginBottom: 20,
      }}>
        <input placeholder="Código (ej. U2025001)" value={form.code}
          onChange={e => setForm(p => ({ ...p, code: e.target.value }))} required style={{ width: 160 }} />
        <input placeholder="Nombre completo" value={form.name}
          onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required style={{ width: 200 }} />
        <select value={form.section} onChange={e => setForm(p => ({ ...p, section: e.target.value }))}>
          <option value="">Sin sección</option>
          {sections.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
        <input type="email" placeholder="Email de acceso" value={form.email}
          onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required style={{ width: 200 }} />
        <input type="password" placeholder="Contraseña" value={form.password}
          onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required style={{ width: 140 }} />
        <button type="submit" className="btn btn-primary btn-sm">+ Agregar</button>
      </form>

      <FormError msg={formError} />
      <FormError msg={saveErr} />

      <DataTable columns={['Código', 'Nombre', 'Sección', 'Cursos', '']}
        rows={students.map(s => editing.id === s._id ? (
          <tr key={s._id} style={{ background: 'rgba(20,110,245,0.03)' }}>
            <td><input value={editing.form.code} onChange={ef('code')} style={{ width: '100%' }} /></td>
            <td><input value={editing.form.name} onChange={ef('name')} style={{ width: '100%' }} /></td>
            <td>
              <select value={editing.form.section} onChange={ef('section')}>
                <option value="">Sin sección</option>
                {sections.map(sec => <option key={sec._id} value={sec._id}>{sec.name}</option>)}
              </select>
            </td>
            <td style={{ color: '#ababab', fontSize: 12 }}>—</td>
            <ActionCell><SaveBtn onClick={saveEdit} /><EditBtn onClick={cancelEdit} active /></ActionCell>
          </tr>
        ) : (
          <tr key={s._id}>
            <td><code style={{ fontFamily: 'monospace', fontSize: 12, background: '#f2f2f2', padding: '2px 6px', borderRadius: 3 }}>{s.code}</code></td>
            <td><strong style={{ color: '#080808' }}>{s.name}</strong></td>
            <td>{s.section?.name ? <span className="badge badge-blue">{s.section.name}</span> : <span style={{ color: '#ababab', fontSize: 12 }}>Sin sección</span>}</td>
            <td><span style={{ fontSize: 13, color: '#5a5a5a' }}>{s.courses?.length ?? 0} cursos</span></td>
            <ActionCell>
              <EditBtn onClick={() => startEdit(s)} />
              <DeleteBtn onClick={() => onDelete(s._id)} />
            </ActionCell>
          </tr>
        ))}
        emptyText="No hay estudiantes registrados"
      />
    </PageSection>
  );
}

/* ── PERIODS ── */
function PeriodsPanel({ periods, onCreate, onActivate, onDelete }) {
  const currentYear = new Date().getFullYear();
  const [form, setForm]       = useState({ year: currentYear, semester: 1 });
  const [formError, setFormError] = useState('');

  const submit = async e => {
    e.preventDefault(); setFormError('');
    try { await onCreate(form); setForm({ year: currentYear, semester: 1 }); }
    catch (err) { setFormError(err.response?.data?.message || 'Error al crear período'); }
  };

  return (
    <PageSection>
      <InlineForm onSubmit={submit} fields={[
        <input
          key="y" type="number" placeholder="Año" value={form.year}
          onChange={e => setForm(p => ({ ...p, year: +e.target.value }))}
          required style={{ width: 100 }}
        />,
        <select key="s" value={form.semester} onChange={e => setForm(p => ({ ...p, semester: +e.target.value }))}>
          <option value={1}>Semestre I</option>
          <option value={2}>Semestre II</option>
        </select>,
      ]} />
      <FormError msg={formError} />
      <DataTable
        columns={['Período', 'Año', 'Semestre', 'Estado', '']}
        rows={periods.map(p => (
          <tr key={p._id}>
            <td><strong style={{ color: '#080808' }}>{p.name}</strong></td>
            <td>{p.year}</td>
            <td>Semestre {p.semester === 1 ? 'I' : 'II'}</td>
            <td>
              {p.isActive
                ? <span className="badge badge-green">Activo</span>
                : <span className="badge badge-yellow">Inactivo</span>
              }
            </td>
            <td style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                {!p.isActive && (
                  <button
                    onClick={() => onActivate(p._id)}
                    className="btn btn-secondary btn-sm"
                  >
                    Activar
                  </button>
                )}
                <DeleteBtn onClick={() => onDelete(p._id)} />
              </div>
            </td>
          </tr>
        ))}
        emptyText="No hay períodos registrados"
      />
    </PageSection>
  );
}
