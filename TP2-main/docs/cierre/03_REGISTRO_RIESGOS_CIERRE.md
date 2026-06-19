# Registro de Riesgos — Estado Final de Cierre (Risk Register)

**Proyecto:** CSP Schedule Solver
**Fase:** Control y Cierre
**Fecha:** 2026-06-18
**Versión:** 1.0
**Base:** [../Planificación/GESTION_RIESGOS_OPORTUNIDADES.md](../Planificación/GESTION_RIESGOS_OPORTUNIDADES.md)

> Este registro consolida los riesgos identificados durante el ciclo de vida, la **respuesta efectivamente aplicada** y el **estado final** de cada uno al cierre del proyecto (vista exigida por la fase de cierre).

---

## 1. Registro de Riesgos (cierre)

| ID | Riesgo | Prob. | Impacto | Exposición | Respuesta aplicada | ¿Ocurrió? | Estado final |
|---|---|---|---|---|---|---|---|
| **R-01** | Complejidad excesiva del CSP (no converge ≤5 s) | 45% | Alto ($3,500) | $1,575 | Heurística MRV + propagación AC-3 + timeout 5 s + worker thread | Parcial | ✅ **Cerrado / Mitigado** — 50 cursos en 2,340 ms |
| **R-02** | Rendimiento: UI se congela / timeout HTTP | 35% | Medio ($2,000) | $700 | Solver en worker thread aislado + polling | No | ✅ **Cerrado** — UI no bloqueante |
| **R-03** | Cambio de requerimientos a mitad de proyecto | 50% | Alto ($4,000) | $2,000 | Scope control, restricciones documentadas, diseño modular | No materializado | ✅ **Cerrado** — sin scope creep en 14 HU |
| **R-04** | Datos inválidos / inconsistentes en MongoDB | 30% | Medio ($1,500) | $450 | Validación de esquema + `validarDatos()` + preprocesamiento | Parcial | ✅ **Cerrado / Mitigado** |
| **R-05** | Falta de escalabilidad (>100 cursos) | 25% | Medio ($2,500) | $625 | Diseño modular + parámetros ajustables | No (fuera de alcance PMV) | 🟡 **Aceptado / Transferido** — recomendación de prueba de carga |
| **R-06** | Incompatibilidad de restricciones (infeasibility) | 40% | Alto ($3,200) | $1,280 | Reporte de causa raíz + sugerencias automáticas | Sí (casos infeasibles) | ✅ **Cerrado** — `solver` retorna estado `infeasible` controlado |
| **R-07** | Mantenimiento a largo plazo ("black box") | 60% | Medio ($1,800) | $1,080 | Documentación exhaustiva + código comentado + trazabilidad | Riesgo residual | 🟡 **Mitigado / Residual** — depende de transferencia (ver capacitación) |
| **R-08** | Fallo de conexión MongoDB durante generación | 15% | Alto ($2,800) | $420 | Retry con backoff + connection pooling + manejo de errores | No | ✅ **Cerrado** |
| **R-09** | Discrepancia especificación-código | 20% | Alto ($3,500) | $700 | Doble validación + tests unitarios por restricción | No | ✅ **Cerrado** — 87% cobertura, trazabilidad verificada |

**Exposición total inicial:** $8,910 · **Contingencia presupuestada:** $16,408 (30%).
**Contingencia consumida al cierre:** mínima (no se activaron los escenarios de sobrecosto B/C del presupuesto).

---

## 2. Riesgos Residuales y Transferidos al Mantenimiento

| ID | Riesgo residual | Recomendación de gestión post-cierre |
|---|---|---|
| R-05 | Escalabilidad >100 cursos | Ejecutar prueba de carga formal (k6/Artillery) antes de uso productivo |
| R-07 | Pérdida de conocimiento del CSP | Completar documentación de capacitación y sesión de transferencia (ver [10_DOCUMENTACION_CAPACITACION.md](10_DOCUMENTACION_CAPACITACION.md)) |

---

## 3. Análisis de Efectividad de la Gestión de Riesgos

- **7 de 9 riesgos** quedaron cerrados/mitigados gracias a respuestas técnicas implementadas y verificadas con pruebas.
- Los **2 riesgos residuales** (R-05, R-07) son de naturaleza operativa/largo plazo y se transfieren formalmente al equipo de mantenimiento.
- La estrategia de **concentrar el riesgo crítico en HU-05** y dotar de contingencia (multiplicador 1.385x) resultó adecuada: no se requirió replanificación.

---

## 4. Referencias

- Registro original (planificación): [../Planificación/GESTION_RIESGOS_OPORTUNIDADES.md](../Planificación/GESTION_RIESGOS_OPORTUNIDADES.md)
- Informe final: [01_INFORME_FINAL_PROYECTO.md](01_INFORME_FINAL_PROYECTO.md)
- Defectos: [06_REGISTRO_DEFECTOS.md](06_REGISTRO_DEFECTOS.md)
