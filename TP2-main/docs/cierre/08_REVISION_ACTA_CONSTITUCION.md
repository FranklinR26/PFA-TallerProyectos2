# Acta de Constitución del Proyecto — Revisión Final (Project Charter Review)

## CSP Schedule Solver

> Conforme a la guía PMBOK, el Acta de Constitución del Proyecto se revisa al cierre para evaluar si se cumplieron los requisitos de alto nivel y los criterios de éxito definidos al inicio. Esta sección transcribe el contenido original del Project Charter (`docs/Planificación/Project Charter.png` · `docs/Planificación/CONSTITUTION.md`) y lo contrasta con los resultados obtenidos.

---

## 1. Transcripción del Acta de Constitución Original

| Campo | Detalle |
|---|---|
| **Título del Proyecto** | Sistema Inteligente de Generación Óptima de Horarios Académicos en Entornos de Currículum Flexible |
| **Sigla del Sistema** | CSP Schedule Solver (v1.0 PMV) |
| **Código del Proyecto** | TP2-2026-ISI |
| **Institución** | Universidad Continental |
| **Programa Académico** | Ingeniería de Sistemas e Informática (ISI) |
| **Fecha de inicio** | 24/03/2026 |
| **Fecha de cierre planificada** | 05/07/2026 |
| **Project Manager / Scrum Master** | Landa Sabuco, Gabriel D. |
| **Sponsor** | Gamarra Moreno, Job |

### Necesidad del Proyecto

Las universidades con currículo flexible enfrentan complejidad extrema en la planificación de horarios académicos debido a la alta variabilidad en matrículas, restricciones académicas complejas (co-requisitos, pre-requisitos), limitaciones de infraestructura (aulas especializadas con capacidades y tipos distintos) y la dificultad de equilibrar cargas docentes con disponibilidades heterogéneas. Este problema pertenece a la clase **NP-completo**, con crecimiento combinatorio exponencial del espacio de soluciones. Sin una herramienta formal, el proceso manual consume 40–50 horas administrativas por semestre con 3–7 conflictos no detectados, exigiendo un sistema escalable, ágil y matemáticamente garantizado para la asignación de recursos.

### Objetivos del Proyecto

- Automatizar la generación de horarios académicos sin intervención manual.
- Reducir el tiempo de planificación en al menos 50 % respecto al proceso manual.
- Garantizar horarios académicamente válidos con 0 conflictos de asignación.
- Optimizar la asignación de recursos institucionales (aulas, docentes, franjas horarias).
- Mantener una arquitectura modular y escalable para futura mantenibilidad.
- Visualizar datos de recursos para la toma de decisiones.

### Alcance del Proyecto

**Incluye:**

- Modelado del problema como CSP (7 restricciones duras + 5 restricciones blandas).
- Registro de docentes, cursos y aulas con validación de atributos.
- Validación de métricas (capacidad de aulas, co-requisitos, disponibilidad docente).
- Generación automática de horarios sin conflictos (backtracking + AC-3 + MRV).
- Visualización de horarios por docente y por aula.
- Seguridad con autenticación JWT y controles OWASP Top 10.
- Documentación técnica completa y repositorio GitHub documentado.
- Análisis de sostenibilidad (Green Software / CO₂).

**No incluye:**

- Integración con sistemas ERP universitarios reales (SAP, Banner, etc.).
- Infraestructura productiva con SLA 99.9 %.
- Pruebas de carga formal (k6 / Artillery).
- Aplicación móvil nativa.
- Reportes analíticos avanzados (BI / dashboards).
- Integración SSO institucional.

### Riesgos y Problemas Identificados (al inicio)

- Alta complejidad algorítmica (CSP NP-completo).
- Timeline de 14 semanas potencialmente ajustado para la ruta crítica (HU-05).
- Falta de datos reales del currículo para pruebas.
- Cambios en requerimientos del currículo durante la ejecución.
- Escalabilidad ante volúmenes mayores de 100 cursos simultáneos.

### Entregables Comprometidos

1. Documento de análisis del problema (modelado CSP formal).
2. Modelo formal CSP / Optimización (variables, dominios, restricciones).
3. Diseño de arquitectura SPA + API REST (diagramas C4, API specs).
4. Código fuente funcional (Frontend React + Backend Node.js/Express).
5. Pruebas unitarias e integración (25+ test cases, cobertura ≥70 % en módulos críticos).
6. Repositorio GitHub documentado (README, wiki, commits semánticos).
7. PMV etiquetado como v1.0.0.
8. Video demostrativo (máx. 5.5 minutos).
9. Informe técnico final.
10. Documentación de capacitación (manuales de usuario y mantenimiento).

### Finanzas

| Concepto | Presupuesto |
|---|---|
| Costo directo (600 h × $54.46) | $32,676 |
| Multiplicador CSP (HU-05, complejidad NP-completo, 1.385×) | $5,800 |
| Infraestructura (hosting, BD cloud, CI/CD) | $1,200 |
| Indirectos (PM, supervisión, documentación) | $7,260 |
| Contingencia (30 %) | $16,408 |
| **Total planificado** | **$72,468** |

### Cronograma de Hitos

| Hito | Semana planificada |
|---|---|
| Sprint 0 — Análisis y planificación (Project Charter aprobado) | Semana 2 |
| EPIC-01 — API CRUD funcional (docentes, cursos, aulas) | Semana 4 |
| EPIC-02 — Motor CSP operativo (HU-05 — ruta crítica) | Semana 8 |
| EPIC-02 — Exportación de horarios (CSV/PDF) | Semana 12 |
| EPIC-03 — Testing, calidad e integración (E2E + OWASP + SUS) | Semana 14 |
| Entrega PMV v1.0.0 + Video + Cierre formal | Semana 16 |

### Stakeholders Clave

- Estudiantes universitarios.
- Docentes y coordinadores académicos.
- Personal administrativo de planificación.
- Universidad Continental.
- Equipo de TI (mantenibilidad y seguridad).

### Equipo Interno del Proyecto

| Rol | Integrante |
|---|---|
| Docente del Curso / Sponsor | Gamarra Moreno, Job |
| Project Manager / Scrum Master | Landa Sabuco, Gabriel D. |
| Product Owner | Curassi Montano, Piero |
| Tech Lead / Backend Developer | Escobar Rojas, Rolfi |
| Fullstack Developer | Rojas Ortiz, Franklin |
| Frontend Developer & UX | Camarena Chávez, Anthony |

---

## 2. Revisión de Cumplimiento al Cierre

### 2.1 Verificación de Objetivos

| Objetivo Original | ¿Se cumplió? | Evidencia |
|---|---|---|
| Automatizar la generación de horarios académicos sin intervención manual | ✅ Sí | Motor CSP funcional con backtracking + AC-3 + MRV (`Backend/csp/solver.js`, HU-05 completada y verificada) |
| Reducir el tiempo de planificación en al menos 50 % | ✅ Sí | Generación en 2,340 ms para 50 cursos vs. 40–50 horas manuales (reducción del 99 %) — `TEST_REPORT.md` |
| Garantizar horarios con 0 conflictos de asignación | ✅ Sí | 0 violaciones de restricciones duras (HC-1 a HC-7) en 250+ pruebas — `Backend/__tests__/solver.test.js`, `constraints.test.js` |
| Optimizar la asignación de recursos institucionales (aulas, docentes) | ✅ Sí | Restricciones de capacidad, tipo de aula y disponibilidad docente implementadas; soft score 88–98/100 según tamaño de instancia |
| Mantener arquitectura modular y escalable | ✅ Sí | Stack MERN con separación UI (React SPA) / API REST / Solver (worker threads); cobertura 87 % en módulos críticos CSP |
| Visualizar datos de recursos para la toma de decisiones | ✅ Sí | Vistas interactivas por docente y aula (`Frontend/src/pages/SchedulePage.jsx`, `DashboardPage.jsx`); exportación CSV/PDF |

**Resultado:** 6 de 6 objetivos cumplidos en su totalidad, con métricas que superan los umbrales comprometidos en cronograma, rendimiento y cobertura de pruebas.

### 2.2 Verificación de Alcance

Ver detalle completo en el [Informe Final del Proyecto](01_INFORME_FINAL_PROYECTO.md), sección 5. En síntesis: **el alcance comprometido se cumplió al 100 %**, sin invadir las exclusiones explícitamente definidas (integración con ERPs reales, infraestructura productiva con SLA, pruebas de carga formal, app móvil nativa). Las 14 historias de usuario planificadas (69 puntos de historia, 3 épicas) fueron entregadas sin *scope creep*. Como valor agregado no planificado, se incorporó el módulo de **sostenibilidad / Green Software** (CO₂.js + GreenFrame) sin impacto en presupuesto ni cronograma.

### 2.3 Verificación de Riesgos Anticipados

| Riesgo anticipado en el Charter | Resultado al cierre |
|---|---|
| Alta complejidad algorítmica (CSP NP-completo) | Gestionado exitosamente mediante especificación formal previa (`CONSTITUTION.md`) y modelo CSP con backtracking + AC-3 + MRV. 0 conflictos en 250+ pruebas. |
| Timeline de 14 semanas potencialmente ajustado | El proyecto cerró el 18/06/2026, **17 días antes** del límite planificado (05/07/2026). La ruta crítica (HU-05) se protegió con contingencia de 3 días y se entregó en plazo. |
| Falta de datos reales para pruebas | Se materializó parcialmente; mitigado con datos sintéticos representativos del currículo ISI (50+ cursos, 20+ docentes, 15+ aulas). Ver [03_REGISTRO_RIESGOS_CIERRE.md](03_REGISTRO_RIESGOS_CIERRE.md). |
| Cambios en requerimientos del currículo | No se registraron cambios significativos durante la ejecución. Control de cambios efectivo. |
| Escalabilidad ante volúmenes reales (>100 cursos) | Riesgo residual transferido a fase de mantenimiento, coherente con la exclusión de «infraestructura productiva real» del alcance del Charter. Arquitectura diseñada para escalar. |

### 2.4 Verificación de Entregables

Ver tabla de trazabilidad completa en el [Informe Final del Proyecto](01_INFORME_FINAL_PROYECTO.md), sección 5.1. **10 de 10 entregables completados al 100 %**:

| # | Entregable | Estado | Ubicación |
|---|---|---|---|
| 1 | Documento de análisis del problema (modelado CSP) | ✅ Entregado | `docs/Planificación/ESPECIFICACION_FORMAL.md` |
| 2 | Modelo formal CSP / Optimización | ✅ Entregado | `docs/Planificación/CONSTITUTION.md` |
| 3 | Diseño de arquitectura SPA + API REST | ✅ Entregado | `docs/ejecucion/arquitectura.md` |
| 4 | Código fuente funcional (Frontend + Backend) | ✅ Entregado | GitHub — 93 commits, 8 PRs |
| 5 | Pruebas unitarias e integración | ✅ Entregado | 25 test cases; cobertura 87 % módulos CSP |
| 6 | Repositorio GitHub documentado | ✅ Entregado | README, wiki, commits semánticos |
| 7 | PMV etiquetado v1.0.0 | ✅ Entregado | GitHub Releases — tag `v1.0.0` |
| 8 | Video demostrativo (5.5 minutos) | ✅ Entregado | MP4 publicado en Drive (enlace en README) |
| 9 | Informe técnico final | ✅ Entregado | `docs/cierre/01_INFORME_FINAL_PROYECTO.md` |
| 10 | Documentación de capacitación | ✅ Entregado | `docs/cierre/10_DOCUMENTACION_CAPACITACION.md` |

### 2.5 Verificación de Finanzas

Presupuesto ejecutado: **~$68,368**, con varianza favorable de **-$4,100 (-5.6 %)** respecto al planificado ($72,468). La reserva de contingencia ($16,408) se consumió mínimamente (~$4,100 en mitigación de R-02 y R-06), manteniéndose ~$12,300 no utilizados. El Índice de Desempeño de Costo (CPI) resultó en 1.08, indicando ejecución bajo presupuesto sin desviación. Ver [Informe Final del Proyecto](01_INFORME_FINAL_PROYECTO.md), sección 7.

### 2.6 Verificación de Cronograma

Cumplido con **17 días de adelanto** respecto a la fecha de cierre planificada (05/07/2026), cerrando formalmente el 18/06/2026. La fase de testing e integración (Sprint 7) se completó 10 días antes de su fecha estimada sin comprometer la calidad. La ruta crítica (HU-05, Motor CSP) se entregó en plazo en el Sprint 3, evitando la materialización de los escenarios de retraso modelados. Ver [Informe Final del Proyecto](01_INFORME_FINAL_PROYECTO.md), sección 6.

---

## 3. Criterios de Éxito — Veredicto Final

| Criterio de Éxito | Veredicto |
|---|---|
| El sistema genera horarios sin conflictos de aula/docente | ✅ Cumplido — 0 violaciones HC-1 a HC-7 en 250+ pruebas |
| El sistema respeta restricciones de capacidad, tipo de aula y co-requisitos | ✅ Cumplido — TC-001 a TC-025 verificados; `constraints.test.js` al 92 % de cobertura |
| El proyecto se entrega dentro del presupuesto planificado ($72,468) | ✅ Cumplido — Ejecución real ~$68,368 (CPI 1.08; varianza -5.6 % favorable) |
| El proyecto se entrega dentro de las 16 semanas planificadas | ✅ Cumplido — Cierre 18/06/2026 (semana 13 real; 17 días adelantado) |
| El código cumple estándares de calidad (SonarQube, OWASP Top 10, WCAG 2.2, Green Software) | ✅ Cumplido — Quality Gate passed; OWASP Top 10 controlado; WCAG login 100/100 Lighthouse; análisis CO₂ aplicado |
| El sistema es percibido como usable por usuarios finales | ✅ Cumplido — SUS 74/100 (umbral comprometido ≥60; margen +14 puntos) |
| Cobertura de pruebas ≥70 % en módulos críticos del CSP | ✅ Cumplido — 87 % promedio (solver 87 %, constraints 92 %, variables 94 %, scoring 89 %, metrics 81 %) |
| Todos los requerimientos funcionales implementados (RF-01 a RF-05) | ✅ Cumplido — 5/5 RF entregados y verificados; RF-03 ≥99 % confiabilidad |

**Veredicto del Project Manager:** el proyecto **cumple los requisitos de alto nivel y los criterios de éxito** establecidos en el Acta de Constitución. Los 6 objetivos fueron alcanzados, los 10 entregables fueron completados al 100 %, el presupuesto se ejecutó con varianza favorable (-5.6 %) y el cierre se produjo 17 días antes de la fecha límite. Se autoriza el cierre formal del proyecto sin observaciones pendientes de bloqueo.

---

*Documento elaborado conforme al enfoque PMBOK (PMI, 2017; PMI, 2021) como parte de la fase de Control y Cierre del proyecto, en revisión del Acta de Constitución original (`docs/Planificación/Project Charter.png` · `docs/Planificación/CONSTITUTION.md`). Última actualización: 24 de junio de 2026.*
