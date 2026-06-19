# Declaración de Trabajo (Statement of Work — SOW)

**Proyecto:** CSP Schedule Solver
**Fase:** Control y Cierre
**Fecha:** 2026-06-18
**Versión:** 1.0

> Valida el cumplimiento del trabajo comprometido, el alcance acordado y los entregables, como verificación previa al cierre formal del proyecto.

---

## 1. Descripción del Trabajo Comprometido

Diseño, desarrollo, prueba y documentación de un **sistema web (MERN) para la generación automática y óptima de horarios académicos** mediante un modelo de Satisfacción de Restricciones (CSP), para el programa de Ingeniería de Sistemas e Informática (ISI).

| Atributo | Detalle |
|---|---|
| Cliente / Patrocinador | Coordinación académica ISI – Taller de Proyectos 2 |
| Proveedor (equipo) | Equipo de 5 integrantes (ver §6) |
| Modalidad | Desarrollo ágil (Scrum), 7 sprints bisemanales |
| Período | 23-Mar-2026 a 05-Jul-2026 (14 semanas) |
| Presupuesto | US$ 72,468 (600 horas) |

---

## 2. Alcance Comprometido (Entregables Contractuales)

| # | Entregable comprometido | Criterio de aceptación | Estado | Evidencia |
|---|---|---|---|---|
| E-01 | Gestión de datos (docentes, cursos, aulas, disponibilidad) | CRUD funcional + validaciones | ✅ Entregado | `Backend/models`, `Backend/controllers`, tests |
| E-02 | Autenticación y control de acceso por roles | Login JWT + middleware de roles | ✅ Entregado | `auth.controller.js`, `verifyToken.js`, `checkRole.js` |
| E-03 | Motor CSP (HU-05) | 0 violaciones HC, ≤5 s | ✅ Entregado | `Backend/csp/`, `solver.test.js` |
| E-04 | Detección de conflictos | Reporte de violaciones | ✅ Entregado | `csp/constraints.js` |
| E-05 | Optimización de restricciones blandas | Soft score ≥80 | ✅ Entregado | `csp/scoring.js`, soft score 88-98 |
| E-06 | Visualización de horarios | Vistas por docente/aula/carrera | ✅ Entregado | Frontend React |
| E-07 | Exportación de horarios | Formatos de salida | ✅ Entregado | Módulo de exportación (HU-09) |
| E-08 | Suite de pruebas y reporte | 25 TC + cobertura | ✅ Entregado | `__tests__`, `TEST_REPORT.md` |
| E-09 | Documentación técnica y de gestión | Markdown en repositorio | ✅ Entregado | `docs/` (inicio, planificación, ejecución, seguimiento, cierre) |
| E-10 | Módulo de sostenibilidad (valor agregado) | Medición CO₂ + optimizaciones | ✅ Entregado | CO2.js + GreenFrame, `informe_sostenibilidad.md` |

---

## 3. Trabajo Fuera de Alcance (No Comprometido)

- Despliegue productivo con SLA y alta disponibilidad (RNF-04 a escala).
- Pruebas de carga concurrente formales (RNF-02 a escala).
- Integración con sistemas externos en tiempo real (excluido por restricción R3).
- Soporte/mantenimiento posterior a la entrega académica (se entrega documentación de transferencia).

---

## 4. Verificación de Cumplimiento

| Criterio de cierre | Resultado |
|---|---|
| 100% de entregables contractuales completados | ✅ 10/10 |
| Aceptación de criterios funcionales (RF) | ✅ 5/5 |
| Aceptación de criterios no funcionales (RNF) | ✅ 3/5 plenos, 2/5 parciales (fuera de alcance PMV) |
| Documentación entregada en repositorio (Markdown) | ✅ |
| Defectos críticos/altos abiertos | ✅ 0 |

**Conclusión:** El trabajo comprometido en esta Declaración de Trabajo se considera **completo y conforme** para el cierre. Las exclusiones declaradas en §3 no afectan la aceptación del PMV.

---

## 5. Acta de Aceptación (para firma)

| Concepto | Responsable | Firma / Aprobación | Fecha |
|---|---|---|---|
| Aceptación del producto (Product Owner) | Piero Curassi Montano | __________ | __________ |
| Conformidad técnica (Scrum Master) | Gabriel D. Landa Sabuco | __________ | __________ |
| Aceptación del patrocinador (Docente/Coordinación) | __________ | __________ | __________ |

---

## 6. Equipo Ejecutor

Gabriel D. Landa Sabuco (SM) · Piero Curassi Montano (PO) · Rolfi Escobar Rojas (Fullstack) · Franklin Rojas Ortiz (Frontend/UX) · Anthony Camarena Chávez (Frontend/UX).

---

## 7. Referencias

- Revisión del Charter: [08_REVISION_ACTA_CONSTITUCION.md](08_REVISION_ACTA_CONSTITUCION.md)
- Informe final: [01_INFORME_FINAL_PROYECTO.md](01_INFORME_FINAL_PROYECTO.md)
- Documentación de capacitación: [10_DOCUMENTACION_CAPACITACION.md](10_DOCUMENTACION_CAPACITACION.md)
