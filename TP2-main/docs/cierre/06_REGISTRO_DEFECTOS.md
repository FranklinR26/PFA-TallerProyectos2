# Registro de Defectos (Defect Log)

**Proyecto:** CSP Schedule Solver
**Fase:** Control y Cierre
**Fecha:** 2026-06-18
**Versión:** 1.0

> Documenta los defectos detectados durante el desarrollo y testing, con severidad, estado, corrección aplicada y validación. Reconstruido a partir del historial de Git, el `TEST_REPORT.md` y las evidencias de calidad.

**Clasificación de severidad:** Crítica (bloquea uso) · Alta (funcionalidad clave) · Media (funcional con *workaround*) · Baja (cosmético/menor).

---

## 1. Registro de Defectos

| ID | Defecto | Módulo / Componente | Severidad | Detección | Corrección aplicada | Validación | Estado |
|---|---|---|---|---|---|---|---|
| **DEF-01** | Horario generado se mostraba vacío en vistas por docente/estudiante | Frontend / render horarios | **Alta** | Prueba manual / revisión | Corrección de lógica de render + vistas por docente y estudiante (commit `4a6b70d`) | Revisión visual + tests de componentes | ✅ Cerrado |
| **DEF-02** | *Issues* de código y residuos detectados en el repositorio | Backend / general | Media | Revisión de código / lint | Limpieza de issues (commit `f87c49e`) | SonarQube re-análisis | ✅ Cerrado |
| **DEF-03** | Capacidad de aula no validada correctamente en casos límite | `Backend/csp/constraints.js` | **Alta** | Test unitario `constraints.test.js` (validateRoomCapacity) | Refuerzo de validación HC-4 (estudiantes ≤ capacidad) | `TC-010`/`TC-011` ✓ PASS | ✅ Cerrado |
| **DEF-04** | Asignación duplicada docente/aula/slot no rechazada | `Backend/csp/constraints.js` | **Crítica** | Test `validateUniqueAssignment` | Implementación de HC-1 (unicidad) | `TC-001` ✓ PASS (28 ms) | ✅ Cerrado |
| **DEF-05** | Docente asignado fuera de su disponibilidad | `Backend/csp/constraints.js` | Media | Test `validateTeacherAvailability` | Implementación de HC-5/HC-6 | `TC-013`/`TC-014` ✓ PASS | ✅ Cerrado |
| **DEF-06** | Problemas infeasibles no manejados con gracia (sin mensaje claro) | `Backend/csp/solver.js` | Media | `solver.test.js` (caso infeasible) | Estado `infeasible` + reporte de causa raíz | Test infeasible ✓ PASS (2,100 ms) | ✅ Cerrado |
| **DEF-07** | Riesgo de fuga de memoria en iteraciones del solver | `Backend/csp/solver.js` | Media | Benchmark de memoria | Límites de memoria + reset periódico | <500 MB (50-100 cursos) ✓ | ✅ Cerrado |
| **DEF-08** | Inconsistencia en evidencias de login/calidad | Frontend / auth | Baja | Auditoría de calidad | Actualización de login y evidencias (commits `6770358`, `67e1c1a`) | Lighthouse login 100% | ✅ Cerrado |

---

## 2. Métricas de Defectos

| Severidad | Detectados | Cerrados | Abiertos |
|---|---:|---:|---:|
| Crítica | 1 | 1 | 0 |
| Alta | 2 | 2 | 0 |
| Media | 4 | 4 | 0 |
| Baja | 1 | 1 | 0 |
| **Total** | **8** | **8** | **0** |

- **Densidad de defectos críticos/altos:** 3/8 (38%), todos cerrados y validados con pruebas automatizadas.
- **0 defectos abiertos al cierre.**
- **0 violaciones de restricciones duras** en 250+ ejecuciones de prueba (TEST_REPORT §10).

---

## 3. Conclusión

Todos los defectos identificados fueron corregidos y **validados mediante pruebas automatizadas (TC-001 a TC-025)** o revisión de calidad. El defecto crítico (DEF-04, unicidad de asignación) y los de severidad alta (DEF-01 horario vacío, DEF-03 capacidad) cuentan con trazabilidad directa a tests y commits, evidenciando control efectivo del proceso de corrección.

---

## 4. Referencias

- Reporte de pruebas: [../Planificación/TEST_REPORT.md](../Planificación/TEST_REPORT.md)
- Incidentes: [04_REGISTRO_INCIDENTES.md](04_REGISTRO_INCIDENTES.md)
- Calidad: [../seguimiento_control/Calidad/INFORME_TECNICO_INTEGRAL.md](../seguimiento_control/Calidad/INFORME_TECNICO_INTEGRAL.md)
