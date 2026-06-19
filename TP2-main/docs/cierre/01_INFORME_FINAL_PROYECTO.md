# Informe Final del Proyecto (Final Project Report)

| | |
|---|---|
| **Proyecto** | Sistema de Generación Óptima de Horarios Académicos (CSP Schedule Solver) |
| **Curso** | Taller de Proyectos 2 – Ingeniería de Sistemas e Informática |
| **Institución** | Universidad Continental |
| **Repositorio** | https://github.com/FranklinR26/PFA-TallerProyectos2 |
| **Fase** | Control y Cierre |
| **Fecha de cierre** | 2026-06-18 |
| **Versión** | 2.0 (informe extendido con citas) |
| **Elaborado por** | Equipo de Proyecto |
| **Marco de referencia** | PMBOK 7.ª ed. (PMI, 2021); PMBOK 6.ª ed., Grupo de Procesos de Cierre (PMI, 2017); Scrum (Schwaber & Sutherland, 2020) |

> **Nota metodológica.** Las citas en el texto siguen el formato APA 7.ª edición; la lista completa de fuentes se encuentra en §14 (Referencias). Las referencias a artefactos internos del repositorio se enlazan directamente para garantizar la trazabilidad documental exigida por la fase de cierre (PMI, 2017).

---

## Tabla de Contenido

1. Resumen Ejecutivo
2. Introducción y Contexto del Proyecto
3. Objetivos y Criterios de Éxito
4. Marco Metodológico
5. Desempeño del Alcance
6. Desempeño del Cronograma
7. Desempeño de los Costos
8. Desempeño de la Calidad
9. Gestión de Riesgos, Incidentes y Defectos
10. Resultados Técnicos del Producto (Motor CSP)
11. Análisis Integrado Plan vs. Ejecución
12. Equipo y Gestión de Interesados
13. Conclusiones, Lecciones y Recomendaciones
14. Referencias
15. Anexos (Trazabilidad)

---

## 1. Resumen Ejecutivo

El presente documento constituye el **Informe Final del Proyecto**, entregable característico del cierre formal que «resume el desempeño del proyecto y proporciona al patrocinador una visión general que sirve como registro histórico» (PMI, 2017, p. 123). El proyecto desarrolló un **sistema web bajo arquitectura MERN** (MongoDB, Express, React, Node.js) que **genera horarios académicos libres de conflictos** mediante un modelo de Satisfacción de Restricciones (*Constraint Satisfaction Problem*, CSP) resuelto con *backtracking*, *forward checking* y la heurística de Mínimos Valores Remanentes con consistencia de arcos (MRV + AC-3) (Russell & Norvig, 2021; Dechter, 2003).

El proyecto se ejecutó en **7 sprints bisemanales** (23-Mar-2026 a 05-Jul-2026; 14 semanas) bajo Scrum (Schwaber & Sutherland, 2020), con un equipo de **5 integrantes**, **69 puntos de historia** distribuidos en 14 historias de usuario y un presupuesto planificado de **US$ 72,468** (600 horas). Al cierre, el sistema se encuentra **funcional y verificado**: el motor genera soluciones válidas con **0 violaciones de restricciones duras** y tiempos de resolución por debajo del umbral comprometido de 5 segundos para instancias de hasta 100 cursos (ver §10; [TEST_REPORT](../Planificación/TEST_REPORT.md)).

**Resultado global:** ✅ **Objetivos principales alcanzados.** Se cumplieron la totalidad de requerimientos funcionales (RF-01 a RF-05) y la mayoría de los no funcionales (RNF-01 a RNF-05), con desviaciones acotadas y debidamente documentadas en cobertura de pruebas de *frontend*, prueba de carga concurrente (RNF-02) y cierre de la suite E2E (§8, §11). El proyecto se mantuvo **dentro del presupuesto** sin agotar la reserva de contingencia (§7).

---

## 2. Introducción y Contexto del Proyecto

### 2.1 Problema

Las instituciones con currículos flexibles enfrentan dificultades para generar horarios académicos sin conflictos debido a la elevada cantidad de variables y restricciones simultáneas (cursos, docentes, aulas y franjas horarias). El problema pertenece a la clase **NP-completo**, caracterizada por un crecimiento combinatorio exponencial del espacio de soluciones (Garey & Johnson, 1979; Russell & Norvig, 2021), lo que justifica un enfoque algorítmico formal en lugar de heurísticas manuales.

### 2.2 Solución

Se desarrolló un sistema que modela la calendarización como un CSP, definiendo formalmente variables, dominios y restricciones (Dechter, 2003). El sistema garantiza la factibilidad por construcción —cualquier solución hallada respeta las 7 restricciones duras— y optimiza 5 restricciones blandas cuando el tiempo de cómputo lo permite, conforme al principio de **prioridad de factibilidad** declarado en el Acta de Constitución ([CONSTITUTION.md](../Planificación/CONSTITUTION.md)).

### 2.3 Valor de negocio

El beneficio comprometido fue la **reducción del tiempo de planificación en al menos 50 %** y la **minimización de conflictos de asignación**, posicionando la solución como un diferenciador frente a procesos manuales (ver Acta de Constitución y [README](../../../README.md)). Estos beneficios se verificaron mediante *benchmarks* de rendimiento (§10).

---

## 3. Objetivos y Criterios de Éxito

Conforme a la guía de cierre, el Acta de Constitución «se revisa al final para evaluar si se cumplieron los requisitos de alto nivel y los criterios de éxito» (PMI, 2017). La revisión integral se documenta en [08_REVISION_ACTA_CONSTITUCION.md](08_REVISION_ACTA_CONSTITUCION.md); a continuación se sintetizan los resultados.

| Objetivo de alto nivel | Criterio de éxito | Resultado | Estado |
|---|---|---|---|
| Automatizar la generación de horarios | Generación sin intervención manual vía CSP | Motor CSP operativo (HU-05) | ✅ |
| Reducir el tiempo de planificación ≥50 % | ≤5 s vs. proceso manual de horas | 2,340 ms para 50 cursos | ✅ |
| Garantizar horarios sin conflictos | 0 violaciones de restricciones duras | 0 violaciones en 250+ pruebas | ✅ |
| Mantener calidad y mantenibilidad | Arquitectura modular + cobertura ≥70 % | 87 % en módulos CSP | ✅ |

---

## 4. Marco Metodológico

El proyecto integró tres marcos complementarios, alineados con la orientación de PMBOK 7.ª edición hacia un enfoque de **entrega adaptativa basada en principios y dominios de desempeño** (PMI, 2021):

1. **Gestión de proyectos – PMBOK (PMI, 2021; PMI, 2017).** Se aplicaron prácticas de los dominios de planificación, trabajo del proyecto, entrega, medición e incertidumbre; y, para el cierre, el Grupo de Procesos de Cierre de la 6.ª edición (registro histórico, lecciones aprendidas, cierre administrativo).
2. **Desarrollo ágil – Scrum (Schwaber & Sutherland, 2020).** Sprints bisemanales, *Daily Scrum* de 15 minutos, *Product Owner*, *Scrum Master* y *Definition of Done* por historia (ver [SPRINTS_OBJETIVOS.md](../Planificación/SPRINTS_OBJETIVOS.md)).
3. **Ingeniería de software – TDD y Spec-Driven Development (Beck, 2003).** Ciclo *Red–Green–Refactor* y especificación formal previa del CSP, con trazabilidad requerimiento ↔ restricción ↔ test ↔ historia.

La combinación de un marco predictivo de control con uno adaptativo de ejecución corresponde a un **enfoque híbrido**, recomendado para proyectos con alta incertidumbre técnica concentrada (PMI, 2021).

---

## 5. Desempeño del Alcance

### 5.1 Alcance comprometido vs. entregado

| Épica | Historias | Puntos | Estado | Evidencia |
|---|---|---:|---|---|
| EPIC-01 — Gestión de Datos | HU-01..HU-04, HU-10, HU-11 | 23 | ✅ Completado | `Backend/models`, `Backend/controllers`; auth JWT |
| EPIC-02 — Motor CSP | HU-05..HU-09 | 31 | ✅ Completado | `Backend/csp/` (solver, constraints, scoring, variables, metrics, solverWorker) |
| EPIC-03 — Testing e Integración | HU-12..HU-14 | 15 | ✅ Completado (parcial en E2E) | `Backend/__tests__`, `Frontend/src/__tests__` |
| **Total** | **14 HU** | **69** | **✅** | 93 commits · 8 PRs |

### 5.2 Cumplimiento de requerimientos

| Req. | Descripción | Estado | Evidencia |
|---|---|---|---|
| RF-01 | Registrar cursos/docentes/aulas ≤2 s/op | ✅ | CRUD + tests de controladores |
| RF-02 | Generar horarios vía CSP ≤5 s | ✅ | `solver.test.js`; 2,340 ms (50 cursos) |
| RF-03 | Evitar conflictos ≥99 % | ✅ | 0 conflictos en 250+ pruebas |
| RF-04 | Interfaz visual interactiva | ✅ | Frontend React (vistas por docente/aula) |
| RF-05 | Modificar parámetros antes de generar | ✅ | UI de gestión de datos |
| RNF-01 | Respuesta ≤2 s | ✅ | *Benchmarks* de rendimiento |
| RNF-02 | ≥50 usuarios concurrentes | ⚠️ Parcial | Sin prueba de carga formal |
| RNF-03 | Modularidad/mantenibilidad | ✅ | SPA + API REST; SonarQube |
| RNF-04 | Disponibilidad ≥99 % | ⚠️ No medible | Entorno académico sin SLA |
| RNF-05 | Aprendizaje <30 min | ✅ | SUS (Brooke, 1996) |

### 5.3 Control de cambios

No se registró *scope creep* significativo: las 14 historias planificadas se mantuvieron, lo que evidencia un control de alcance efectivo (PMI, 2021). Como **valor agregado** no contemplado inicialmente, se incorporó un módulo de **sostenibilidad / Green Software** (CO2.js + GreenFrame; PRs #6 y #7), alineado con los *Principles of Green Software Engineering* (Green Software Foundation, 2021).

---

## 6. Desempeño del Cronograma

| Sprint | Período planificado | Foco | Puntos | Estado |
|---|---|---|---:|---|
| 1 | 23-Mar → 05-Abr | Fundación de datos | 12 | ✅ |
| 2 | 06-Abr → 19-Abr | Gestión de datos + prep. CSP | 14 | ✅ |
| 3 | 20-Abr → 03-May | **Motor CSP (HU-05) — ruta crítica** | 13 | ✅ |
| 4 | 04-May → 17-May | Detección de conflictos | 3 | ✅ |
| 5 | 18-May → 31-May | Optimización + visualización | 9 | ✅ |
| 6 | 01-Jun → 14-Jun | Exportación | 3 | ✅ |
| 7 | 15-Jun → 05-Jul | Testing, calidad e integración | 15 | 🟡 En cierre |

**Análisis.** La planificación identificó **HU-05 (Motor CSP) como ruta crítica** y bloqueador de seis tareas *downstream* (PMI, 2021, gestión del cronograma). Concentrar el riesgo en el Sprint 3 y protegerlo con reserva de contingencia evitó la materialización de los escenarios de retraso modelados (retraso de 3 o 7 días). El historial de control de versiones (93 commits, PRs #1–#8) evidencia actividad continua entre abril y junio de 2026, coherente con la curva de velocidad proyectada (12→14→13→3→9→3→15 puntos). La variabilidad de velocidad se explica por el sobrecosto de esfuerzo del sprint del CSP (150 h para 13 puntos), documentado en [SPRINTS_OBJETIVOS.md](../Planificación/SPRINTS_OBJETIVOS.md).

---

## 7. Desempeño de los Costos

### 7.1 Estructura del presupuesto

| Concepto | Monto (US$) | Justificación |
|---|---:|---|
| Costo directo (600 h × $54.46) | 32,676 | Esfuerzo de desarrollo |
| Multiplicador CSP (HU-05, 1.385x) | 5,800 | Complejidad NP-completa |
| Infraestructura y herramientas | 1,200 | Hosting, BD, CI/CD, licencias |
| Indirectos (PM, supervisión, doc.) | 7,260 | Gestión y coordinación |
| Contingencia (30 %) | 16,408 | Reserva para riesgos del CSP |
| **Total planificado** | **72,468** | — |

### 7.2 Análisis del valor (plan vs. real)

El **Sprint 3 concentró el 31 % del costo directo** (US$ 11,307), conforme a lo presupuestado por la complejidad algorítmica (multiplicador 1.385x justificado en [PRESUPUESTO.md](../Planificación/PRESUPUESTO.md)). El control semanal por *timesheet* mostró varianzas negativas (ejecución bajo presupuesto) en las primeras semanas, y **no se activaron los escenarios de sobrecosto** (retraso de 1–2 semanas de HU-05), por lo que la **reserva de contingencia se mantuvo mayormente intacta**. Este comportamiento es indicativo de una **varianza de costos (CV) favorable** y un índice de desempeño del costo (CPI ≥ 1) en los términos del análisis del valor ganado (PMI, 2017).

---

## 8. Desempeño de la Calidad

La evaluación de calidad se estructuró según el modelo de calidad de producto **ISO/IEC 25010** (ISO/IEC, 2011), abarcando funcionalidad, eficiencia de desempeño, seguridad, usabilidad y mantenibilidad.

### 8.1 Pruebas (verificación y validación)

| Tipo | Herramienta | Ubicación | Estado |
|---|---|---|---|
| Unitarias backend | Vitest | `Backend/__tests__/` (10 suites) | ✅ |
| Unitarias/componentes frontend | Vitest + Testing Library | `Frontend/src/__tests__/` | ✅ |
| Integración API | Vitest + MSW / supertest | `Frontend/src/mocks/`, `Backend/__tests__` | ✅ |
| E2E | Playwright | `Frontend/e2e/app.spec.ts` | ⚠️ Requiere *dev server* |
| Aceptación | Cypress | `Frontend/cypress/e2e/login.cy.js` | ⚠️ Instalación pendiente (ECONNRESET) |

- **25 casos de prueba** (TC-001 a TC-025) con trazabilidad a restricciones y requerimientos.
- **Cobertura de módulos CSP: 87 %** (solver 87 %, constraints 92 %, variables 94 %, scoring 89 %, metrics 81 %), superando el umbral comprometido del 70 %.
- **Transparencia metodológica:** el *badge* global del [README](../../../README.md) reporta 17.7 % porque promedia todo el *frontend*; la cobertura crítica corresponde a los módulos del backend CSP. Se recomienda unificar la métrica reportada (ver [Lecciones Aprendidas](02_INFORME_LECCIONES_APRENDIDAS.md), LA-01).

### 8.2 Auditoría integral de calidad

Durante la fase de control se ejecutó una auditoría (commit `46d4463`) que abarcó:

- **Análisis estático – SonarQube:** configuración en `sonar-project.properties`; evidencias en `seguimiento_control/Calidad/evidencias/`.
- **Seguridad – OWASP Top 10:** matriz de control de vulnerabilidades ([OWASP_TOP10_2025_MATRIZ.md](../seguimiento_control/Calidad/OWASP_TOP10_2025_MATRIZ.md)), alineada con OWASP Foundation (2021).
- **Accesibilidad – WCAG 2.2:** checklist + auditoría Lighthouse (login al 100 %), conforme a W3C (2023).
- **Usabilidad – SUS:** *System Usability Scale* (Brooke, 1996), instrumento en [SUS_INSTRUMENTO.md](../seguimiento_control/Calidad/SUS_INSTRUMENTO.md).
- **Sostenibilidad – Green Software:** medición de CO₂ con GreenFrame y optimizaciones (compresión de imágenes, reducción de solicitudes HTTP), conforme a Green Software Foundation (2021).

### 8.3 Calidad funcional del producto

- **Restricciones duras (HC-1 a HC-7):** 0 violaciones (garantía por construcción del CSP).
- **Restricciones blandas (SC-1 a SC-5):** *soft score* de 88 a 98 / 100 según el tamaño de la instancia (§10).

---

## 9. Gestión de Riesgos, Incidentes y Defectos

### 9.1 Riesgos

De los **9 riesgos** registrados (R-01 a R-09), **7 quedaron cerrados/mitigados** mediante respuestas técnicas verificadas y **2 son residuales** (R-05 escalabilidad y R-07 mantenibilidad), transferidos al mantenimiento. La exposición total inicial ($8,910) quedó cubierta por la contingencia ($16,408), de la cual se consumió un porcentaje mínimo. Detalle y estado final en [03_REGISTRO_RIESGOS_CIERRE.md](03_REGISTRO_RIESGOS_CIERRE.md). La gestión proactiva de riesgos es coherente con el dominio de incertidumbre de PMBOK 7.ª edición (PMI, 2021).

### 9.2 Incidentes y defectos

- **Incidentes:** 7 registrados (conflictos de *merge*, dependencias de E2E, limpieza de *issues*), 5 resueltos — ver [04_REGISTRO_INCIDENTES.md](04_REGISTRO_INCIDENTES.md).
- **Defectos:** 8 registrados (1 crítico, 2 altos, 4 medios, 1 bajo), **todos cerrados y validados** con pruebas automatizadas; destaca el defecto de «horario vacío» corregido en el commit `4a6b70d`. Ver [06_REGISTRO_DEFECTOS.md](06_REGISTRO_DEFECTOS.md).

---

## 10. Resultados Técnicos del Producto (Motor CSP)

### 10.1 Formulación

El problema se modeló como una tupla CSP ⟨X, D, C⟩ (Russell & Norvig, 2021): variables de asignación curso–docente–aula–franja (≈ **8,750 variables** tras propagación), dominios booleanos y restricciones duras/blandas. La búsqueda emplea *backtracking* con MRV y consistencia de arcos AC-3 (Dechter, 2003), ejecutada en un *worker thread* para no bloquear la interfaz.

### 10.2 Rendimiento (benchmarks)

| Tamaño | Cursos | Tiempo (ms) | *Soft score* | Memoria (MB) |
|---|---:|---:|---:|---:|
| Muy pequeño | 5 | 245 | 98/100 | — |
| Pequeño | 10 | 520 | 96/100 | — |
| Mediano | 25 | 1,240 | 94/100 | 12 |
| Grande | 50 | 2,340 | 92/100 | 45 |
| Muy grande | 100 | 4,800 | 88/100 | 98 |

**Conclusión técnica:** todas las instancias cumplen el umbral de **<5,000 ms** y el *soft score* mínimo de 85, validando RF-02, RNF-01 y la decisión arquitectónica de usar CSP frente a algoritmos tradicionales (ver [TEST_REPORT.md](../Planificación/TEST_REPORT.md)).

---

## 11. Análisis Integrado Plan vs. Ejecución

| Dimensión | Planificado | Ejecutado / Resultado | Varianza | Valoración |
|---|---|---|---|---|
| Alcance | 14 HU / 69 pts | 14 HU entregadas (+ módulo sostenibilidad) | +valor agregado | ✅ Favorable |
| Cronograma | 14 semanas (Mar–Jul) | Cierre en Sprint 7, sin retrasos críticos | ≈0 | ✅ En plazo |
| Costo | US$ 72,468 | Dentro de presupuesto; contingencia no agotada | Negativa (ahorro) | ✅ Favorable |
| Calidad | Cobertura ≥70 %, 0 conflictos | 87 % CSP, 0 violaciones HC | Positiva | ✅ Favorable |
| Riesgos | Exposición $8,910 | 7/9 cerrados, 2 residuales | Controlada | ✅ Favorable |
| RNF | 5 RNF | 3 plenos, 2 parciales (RNF-02, RNF-04) | Menor | ⚠️ Aceptable (PMV) |

El balance evidencia un proyecto **conforme a línea base** en las tres restricciones clásicas (alcance, tiempo, costo) (PMI, 2017), con desviaciones acotadas y de carácter no funcional, coherentes con el alcance de **Producto Mínimo Viable** en entorno académico controlado.

---

## 12. Equipo y Gestión de Interesados

| Rol Scrum | Integrante |
|---|---|
| Scrum Master | Gabriel D. Landa Sabuco |
| Product Owner | Piero Curassi Montano |
| Fullstack Developer | Rolfi Escobar Rojas |
| Frontend & UX | Franklin Rojas Ortiz |
| Frontend & UX | Anthony Camarena Chávez |

**Interesados:** administradores académicos, coordinadores, docentes, estudiantes y equipo de desarrollo, todos contemplados en la solución y en las vistas de visualización. La gestión de interesados se apoyó en *Daily Scrum*, revisiones de *sprint* y control de versiones colaborativo (Schwaber & Sutherland, 2020).

---

## 13. Conclusiones, Lecciones y Recomendaciones

### 13.1 Conclusiones estratégicas

1. **El enfoque CSP fue la decisión técnica acertada:** garantiza horarios válidos por construcción y resolvió el problema combinatorio dentro de los límites comprometidos (Russell & Norvig, 2021).
2. **La planificación por ruta crítica funcionó:** anticipar HU-05 como bloqueador y dotarlo de contingencia protegió el cronograma y el costo (PMI, 2021).
3. **La trazabilidad requerimiento ↔ restricción ↔ test ↔ HU** es el principal activo de mantenibilidad (ISO/IEC, 2011).
4. **El proyecto cumple los criterios de éxito del Acta de Constitución** (ver [08_REVISION_ACTA_CONSTITUCION.md](08_REVISION_ACTA_CONSTITUCION.md)).

### 13.2 Lecciones aprendidas

El detalle se consolida en [02_INFORME_LECCIONES_APRENDIDAS.md](02_INFORME_LECCIONES_APRENDIDAS.md). En síntesis: el modelado formal previo, el TDD y la planificación por ruta crítica deben replicarse; la automatización de calidad (CI/E2E) y la gobernanza de ramas Git son las principales oportunidades de mejora.

### 13.3 Recomendaciones

1. Integrar la suite E2E (Cypress/Playwright) en un *pipeline* de CI con *thresholds* de cobertura.
2. Ejecutar una **prueba de carga formal** (k6/Artillery) para validar RNF-02.
3. Completar la **transferencia de conocimiento** documentada en [10_DOCUMENTACION_CAPACITACION.md](10_DOCUMENTACION_CAPACITACION.md) para mitigar el riesgo residual R-07.
4. Homogeneizar la métrica de cobertura reportada en el README.

### 13.4 Estado final del proyecto

| Dimensión | Resultado |
|---|---|
| Alcance | ✅ 14/14 HU |
| Cronograma | ✅ En plazo |
| Costo | ✅ Dentro de presupuesto |
| Calidad | ✅ Verificado |
| **Cierre** | ✅ **Apto para entrega académica / transferencia** |

---

## 14. Referencias

Beck, K. (2003). *Test-driven development: By example*. Addison-Wesley.

Brooke, J. (1996). SUS: A quick and dirty usability scale. In P. W. Jordan, B. Thomas, B. A. Weerdmeester, & I. L. McClelland (Eds.), *Usability evaluation in industry* (pp. 189–194). Taylor & Francis.

Dechter, R. (2003). *Constraint processing*. Morgan Kaufmann.

Garey, M. R., & Johnson, D. S. (1979). *Computers and intractability: A guide to the theory of NP-completeness*. W. H. Freeman.

Green Software Foundation. (2021). *Principles of green software engineering*. https://principles.green/

International Organization for Standardization & International Electrotechnical Commission. (2011). *ISO/IEC 25010:2011 — Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — System and software quality models*. ISO.

OWASP Foundation. (2021). *OWASP Top 10 — 2021: The ten most critical web application security risks*. https://owasp.org/Top10/

Project Management Institute. (2017). *A guide to the project management body of knowledge (PMBOK guide)* (6th ed.). PMI.

Project Management Institute. (2021). *A guide to the project management body of knowledge (PMBOK guide)* (7th ed.). PMI.

Russell, S., & Norvig, P. (2021). *Artificial intelligence: A modern approach* (4th ed.). Pearson.

Schwaber, K., & Sutherland, J. (2020). *The Scrum guide: The definitive guide to Scrum*. https://scrumguides.org/

World Wide Web Consortium. (2023). *Web Content Accessibility Guidelines (WCAG) 2.2*. W3C. https://www.w3.org/TR/WCAG22/

---

## 15. Anexos (Trazabilidad)

| Artefacto de cierre | Documento |
|---|---|
| Lecciones aprendidas | [02_INFORME_LECCIONES_APRENDIDAS.md](02_INFORME_LECCIONES_APRENDIDAS.md) |
| Registro de riesgos (cierre) | [03_REGISTRO_RIESGOS_CIERRE.md](03_REGISTRO_RIESGOS_CIERRE.md) |
| Registro de incidentes | [04_REGISTRO_INCIDENTES.md](04_REGISTRO_INCIDENTES.md) |
| Registro de impedimentos | [05_REGISTRO_IMPEDIMENTOS.md](05_REGISTRO_IMPEDIMENTOS.md) |
| Registro de defectos | [06_REGISTRO_DEFECTOS.md](06_REGISTRO_DEFECTOS.md) |
| Registro de supuestos (cierre) | [07_REGISTRO_SUPUESTOS_CIERRE.md](07_REGISTRO_SUPUESTOS_CIERRE.md) |
| Revisión del Acta de Constitución | [08_REVISION_ACTA_CONSTITUCION.md](08_REVISION_ACTA_CONSTITUCION.md) |
| Declaración de Trabajo (SOW) | [09_DECLARACION_TRABAJO_SOW.md](09_DECLARACION_TRABAJO_SOW.md) |
| Documentación de capacitación | [10_DOCUMENTACION_CAPACITACION.md](10_DOCUMENTACION_CAPACITACION.md) |

**Artefactos de fases previas:** Acta de Constitución ([CONSTITUTION.md](../Planificación/CONSTITUTION.md)), Presupuesto ([PRESUPUESTO.md](../Planificación/PRESUPUESTO.md)), Sprints ([SPRINTS_OBJETIVOS.md](../Planificación/SPRINTS_OBJETIVOS.md)), Reporte de pruebas ([TEST_REPORT.md](../Planificación/TEST_REPORT.md)), Evidencias de testing ([EVIDENCIAS_TESTING.md](../seguimiento_control/EVIDENCIAS_TESTING.md)).
