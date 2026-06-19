# Informe Final de Lecciones Aprendidas (Final Lessons Learned Report)

**Proyecto:** Sistema de Generación Óptima de Horarios Académicos (CSP Schedule Solver)
**Curso:** Taller de Proyectos 2 – Ingeniería de Sistemas e Informática
**Fase:** Control y Cierre
**Fecha:** 2026-06-18
**Versión:** 1.0

---

## 1. Propósito

Consolidar el aprendizaje organizacional del proyecto a partir de las retrospectivas de los 7 sprints: identificar **qué funcionó bien** (para repetir), **qué no funcionó** (para evitar) y las **acciones correctivas y oportunidades de mejora** aplicables a futuros proyectos del programa ISI.

---

## 2. Lo que salió bien (buenas prácticas a adoptar)

| # | Buena práctica | Evidencia | Por qué replicarla |
|---|---|---|---|
| BP-01 | **Modelado formal del problema como CSP antes de codificar** | `ESPECIFICACION_FORMAL.md`, `CONSTITUTION.md` con HC-1..7 / SC-1..5 | Evitó retrabajo: las restricciones definieron el espacio de soluciones válidas desde el inicio. |
| BP-02 | **Planificación por ruta crítica con HU-05 como bloqueador** | `SPRINTS_OBJETIVOS.md` (escenarios de retraso) | Concentrar el riesgo en un sprint y dotarlo de buffer protegió el cronograma global. |
| BP-03 | **Desarrollo guiado por pruebas (TDD) en el núcleo CSP** | 25 test cases TC-001..025; suites en `Backend/__tests__` | Garantizó 0 violaciones de restricciones y cobertura ≥87% en módulos críticos. |
| BP-04 | **Aislar el solver en worker thread** | `Backend/csp/solverWorker.js` | Evitó congelar la UI durante cálculos pesados (mitigó riesgo R-02). |
| BP-05 | **Trazabilidad requerimiento ↔ restricción ↔ test ↔ HU** | Matriz en `TEST_REPORT.md` y README | Facilita mantenimiento y auditoría; principal activo de calidad. |
| BP-06 | **Flujo Git con ramas por feature y PRs revisados** | 8 PRs (`feature/frontend-tests`, `feature/sostenibilidad`, `Gabo`, `Franklin`) | Permitió integración controlada y revisión por pares. |
| BP-07 | **Auditoría de calidad integral en fase de control** | SonarQube + OWASP 2025 + WCAG + SUS (commit `46d4463`) | Aportó evidencia objetiva de calidad, seguridad, accesibilidad y usabilidad. |
| BP-08 | **Incorporación temprana de sostenibilidad (Green Software)** | CO2.js + GreenFrame (PRs #6, #7) | Valor agregado diferenciador, medible y alineado a buenas prácticas modernas. |

---

## 3. Lo que no funcionó (errores a evitar)

| # | Problema | Evidencia | Acción correctiva aplicada / recomendada |
|---|---|---|---|
| LA-01 | **Cobertura de pruebas heterogénea** entre backend (87%) y frontend (≈18% global) | Badge README vs. TEST_REPORT | Definir *thresholds* de cobertura en `vitest.config.js` y reportar métrica unificada en CI. |
| LA-02 | **Suite E2E no quedó ejecutable de forma reproducible** | Cypress falló por red (ECONNRESET); Playwright requiere dev server manual | Integrar Cypress/Playwright en GitHub Actions con servicios y caché de dependencias. |
| LA-03 | **Conflictos de merge recurrentes** entre ramas `main`, `Gabo`, `feature/*` | Commits de merge/resolución de conflictos (p. ej. `9467320`, `864beef`) | Acortar el ciclo de integración (merges más frecuentes), proteger `main` y usar PRs pequeños. |
| LA-04 | **Defecto de "horario vacío"** detectado tarde | Corregido en commit `4a6b70d` | Añadir casos de prueba de borde (datasets vacíos/mínimos) antes de la integración. |
| LA-05 | **RNF-02 (50 usuarios concurrentes) sin prueba de carga formal** | No hay evidencia de *load testing* | Programar prueba de carga (k6/Artillery) antes de un despliegue productivo. |
| LA-06 | **Documentación dispersa** en la raíz de `docs/` antes del cierre | Reorganización de fase de cierre | Establecer la estructura por fases (inicio/planificación/ejecución/seguimiento/cierre) desde el inicio. |

---

## 4. Retrospectivas por sprint (síntesis)

| Sprint | Salió bien | A mejorar | Acción |
|---|---|---|---|
| S1-S2 (Datos) | Velocidad estable (12→14 pts), CRUD sólido | Congelar el esquema de MongoDB a tiempo | Schema freeze 48 h antes (R1.1) |
| S3 (Motor CSP) | HU-05 entregada con tests verdes | Alto *overhead* (150 h para 13 pts) | Buffer de contingencia + profiling diario |
| S4 (Conflictos) | Reutilización del solver | Dependencia fuerte de S3 | Paralelizar testing |
| S5 (Optimización/UI) | Soft score 88-98 | Preferencias docentes solo 72% satisfechas | Ajuste de pesos w₁,w₂,w₃ |
| S6 (Exportación) | Entrega simple y rápida | — | — |
| S7 (Testing/Cierre) | Auditoría integral de calidad | Cerrar E2E en CI | Pipeline de pruebas |

---

## 5. Oportunidades de mejora (para futuros proyectos)

1. **CI/CD desde el Sprint 1:** pipeline que ejecute lint + tests + cobertura + E2E en cada PR.
2. **Definición de *Done* con gate de cobertura:** bloquear merge si la cobertura cae bajo el umbral.
3. **Portabilidad del solver** a otros programas/carreras (oportunidad O-02 del registro de oportunidades).
4. **Caché inteligente / warm-start** del solver entre semestres (O-04).
5. **Prueba de carga y observabilidad** para validar RNF de rendimiento y disponibilidad.

---

## 6. Conclusión

El proyecto demostró **aprendizaje organizacional** maduro: las prácticas de modelado formal, TDD y planificación por ruta crítica son directamente reutilizables. Los principales aprendizajes negativos se concentran en **automatización de calidad (CI/E2E)** y **gobernanza de ramas Git**, ambos con acciones correctivas claras y de bajo costo de implementación para el siguiente ciclo.

---

## 7. Referencias

- [01_INFORME_FINAL_PROYECTO.md](01_INFORME_FINAL_PROYECTO.md)
- `../Planificación/SPRINTS_OBJETIVOS.md` · `../Planificación/GESTION_RIESGOS_OPORTUNIDADES.md`
- [../seguimiento_control/EVIDENCIAS_TESTING.md](../seguimiento_control/EVIDENCIAS_TESTING.md)
