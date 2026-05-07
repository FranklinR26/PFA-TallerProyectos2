# SPRINT 1: IMPLEMENTACIÓN CON TDD

## Sistema Inteligente de Generación Óptima de Horarios Académicos

## Evidencias del Ciclo Red-Green-Refactor

El equipo aplicó **Test-Driven Development (TDD)** para el desarrollo del núcleo del algoritmo de generación de horarios. El ciclo seguido fue:

1. **RED** — Escribir un test que falla porque la funcionalidad no existe aún.
2. **GREEN** — Implementar el mínimo código necesario para que el test pase.
3. **REFACTOR** — Mejorar el código sin romper los tests existentes.

---

## Estructura de Tests

```
Backend/__tests__/
├── constraints.test.js   → Restricciones duras del CSP
├── solver.test.js        → Algoritmo de resolución completo
├── scoring.test.js       → Criterios de optimización (5 criterios)
├── variables.test.js     → Construcción de variables y dominios
└── metrics.test.js       → Métricas de evaluación del horario
```

**Framework:** Vitest 2.1.8  
**Cobertura:** @vitest/coverage-v8  
**Módulos cubiertos:** `csp/**/*.js`

---

## Ejecutar los tests

```bash
cd Backend

# Ejecutar todos los tests
npm test

# Ejecutar con reporte de cobertura
npm run test:coverage
```

El reporte HTML de cobertura se genera en `Backend/coverage/index.html`.

---

## Ejemplo del ciclo TDD aplicado

### Caso: Restricción de docente (constraints.test.js)

**RED — Test escrito primero:**
```javascript
test('should detect teacher conflict on same day and overlapping slots', () => {
  const result = hasConflict(v1, { day: 0, slot: 2, roomId: 'r1' },
                              v2, { day: 0, slot: 3, roomId: 'r2' });
  expect(result).toBe(true);
});
// En este punto, hasConflict() no existía → test falla
```

**GREEN — Implementación mínima:**
```javascript
export function hasConflict(v1, a1, v2, a2) {
  if (a1.day !== a2.day) return false;
  const s1End = a1.slot + v1.course.blocksPerSession;
  const s2End = a2.slot + v2.course.blocksPerSession;
  const overlap = a1.slot < s2End && a2.slot < s1End;
  if (!overlap) return false;
  if (c1.teacher._id.toString() === c2.teacher._id.toString()) return true;
  return false;
}
// Test pasa
```

**REFACTOR — Se agrega conflicto de aula y estudiantes:**
```javascript
  if (a1.roomId === a2.roomId) return true;
  if (shareStudents(c1._id.toString(), c2._id.toString(), v1.studentMap)) return true;
// Todos los tests existentes siguen pasando
```

---

## Resumen de cobertura por módulo

| Módulo | Tests | Criterios cubiertos |
|--------|-------|---------------------|
| `csp/constraints.js` | 12 casos | Conflicto docente, aula, estudiante; misma sesión mismo día |
| `csp/solver.js` | 13 casos | Sin dominio, sin solución, solución válida, restricciones invariantes |
| `csp/scoring.js` | 15 casos | pref, balance, gaps, spread, core (los 5 criterios) |
| `csp/variables.js` | — | buildVariables, buildDomain con filtros de tipo y capacidad |
| `csp/metrics.js` | 19 casos | Cobertura %, preferencia %, utilización de aulas, balance, matriz de calor |
| **Total** | **~59 casos** | |

---

## Comando para generar evidencia

```bash
npm run test:coverage
# Abre coverage/index.html para ver el reporte visual
```
