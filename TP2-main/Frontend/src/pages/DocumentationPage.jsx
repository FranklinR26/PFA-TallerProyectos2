export default function DocumentationPage() {
  return (
    <div style={{ paddingTop: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 4 }}>Evidencias de TDD y ejemplos de código</h2>
        <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
          Sección adicional que muestra los ejemplos de código del documento sin afectar el producto original.
        </p>
      </div>

      <section style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 8, fontSize: 18 }}>Ciclo Red-Green-Refactor</h3>
        <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.7 }}>
          El equipo aplicó Test-Driven Development (TDD) para desarrollar el núcleo del algoritmo de generación de horarios.
          El ciclo consiste en escribir primero un test que falle, luego implementar la solución mínima, y finalmente refactorizar sin romper los tests.
        </p>
        <ul style={{ color: '#475569', lineHeight: 1.8 }}>
          <li><strong>RED</strong> — escribir un test que falle.</li>
          <li><strong>GREEN</strong> — implementar lo mínimo necesario para pasar el test.</li>
          <li><strong>REFACTOR</strong> — mejorar el código manteniendo los tests verdes.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 8, fontSize: 18 }}>Ejemplo: función <code>hasConflict()</code></h3>
        <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.7 }}>
          Este ejemplo muestra cómo se valida el conflicto entre dos variables de horario con solapamiento, docente y aula.
        </p>

        <div style={{ marginBottom: 18 }}>
          <div style={codeContainerStyle}>
            <pre style={preStyle}>
{`test('should detect teacher conflict on same day and overlapping slots', () => {
  const result = hasConflict(v1, { day: 0, slot: 2, roomId: 'r1' },
                              v2, { day: 0, slot: 3, roomId: 'r2' });
  expect(result).toBe(true);
});`}
            </pre>
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={codeContainerStyle}>
            <pre style={preStyle}>
{`export function hasConflict(v1, a1, v2, a2) {
  if (a1.day !== a2.day) return false;

  const s1End = a1.slot + v1.course.blocksPerSession;
  const s2End = a2.slot + v2.course.blocksPerSession;
  const overlap = a1.slot < s2End && a2.slot < s1End;
  if (!overlap) return false;

  const c1 = v1.course;
  const c2 = v2.course;
  if (c1.teacher._id.toString() === c2.teacher._id.toString()) return true;
  if (a1.roomId === a2.roomId) return true;
  if (shareStudents(c1._id.toString(), c2._id.toString(), v1.studentMap)) return true;

  return false;
}`}
            </pre>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 8, fontSize: 18 }}>Estructura de tests</h3>
        <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.7 }}>
          La carpeta de tests cubre los distintos módulos del backend y sus reglas de negocio.
        </p>
        <div style={codeContainerStyle}>
          <pre style={preStyle}>
{`Backend/__tests__/
├── constraints.test.js   → Restricciones duras del CSP
├── solver.test.js        → Algoritmo de resolución completo
├── scoring.test.js       → Criterios de optimización (5 criterios)
├── variables.test.js     → Construcción de variables y dominios
└── metrics.test.js       → Métricas de evaluación del horario`}
          </pre>
        </div>
      </section>

      <section>
        <h3 style={{ marginBottom: 8, fontSize: 18 }}>Notas</h3>
        <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.7 }}>
          Esta sección es un agregado visual al proyecto y puede usarse como referencia sin alterar la lógica principal existente.
        </p>
      </section>
    </div>
  );
}

const codeContainerStyle = {
  borderRadius: 12,
  background: '#0f172a',
  border: '1px solid #1e293b',
  overflowX: 'auto',
  padding: 16,
};

const preStyle = {
  margin: 0,
  fontSize: 13,
  lineHeight: 1.65,
  color: '#f8fafc',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
};
