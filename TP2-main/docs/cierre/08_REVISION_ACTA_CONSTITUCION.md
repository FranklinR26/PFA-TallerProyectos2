# Acta de Constitución del Proyecto — Revisión Final (Project Charter Review)

## CSP Schedule Solver

> Conforme a la guía PMBOK, el Acta de Constitución del Proyecto se revisa al cierre para evaluar si se cumplieron los requisitos de alto nivel y los criterios de éxito definidos al inicio. Esta sección transcribe el contenido original del Project Charter (`docs/Planificación/Project Charter.png` · `docs/Planificación/CONSTITUTION.md`) y lo contrasta con los resultados obtenidos.

---

## 1. Transcripción del Acta de Constitución Original
# PROJECT CHARTER

## SISTEMA INTELIGENTE DE GENERACIÓN ÓPTIMA DE HORARIOS ACADÉMICOS EN ENTORNOS DE CURRÍCULO FLEXIBLE

| **Campo** | **Detalle** |
|---|---|
| **Título del Proyecto** | Sistema Inteligente de Generación Óptima de Horarios Académicos en Entornos de Currículum Flexible |
| **Sigla del Sistema** | CSP Schedule Solver (v1.0 PMV) |
| **Código del Proyecto** | TP2-2026-ISI |
| **Institución** | Universidad Continental |
| **Programa Académico** | Ingeniería de Sistemas e Informática (ISI) |
| **Curso** | Taller de Proyectos 2 |
| **Fecha de Inicio** | 24/03/2026 |
| **Fecha de Cierre Planificada** | 05/07/2026 |
| **Project Manager / Scrum Master** | Landa Sabuco, Gabriel D. |
| **Product Owner** | Curassi Montano, Piero |
| **Tech Lead / Backend Developer** | Escobar Rojas, Rolfi |
| **Fullstack Developer** | Rojas Ortiz, Franklin |
| **Frontend Developer & UX** | Camarena Chávez, Anthony |
| **Sponsor** | Gamarra Moreno, Job |

---

## 1. NECESIDAD DEL PROYECTO

Las universidades con currículo flexible enfrentan complejidad extrema en la planificación de horarios académicos debido a:

- **Alta variabilidad en matrículas:** Los estudiantes pueden seleccionar cursos de diferentes áreas, generando combinaciones únicas cada semestre.
- **Restricciones académicas complejas:** Prerrequisitos, co-requisitos, carga crediticia mínima/máxima (20-22 créditos).
- **Limitaciones de infraestructura:** Aulas con capacidades y tipos específicos (laboratorios, talleres, auditorios).
- **Disponibilidad docente heterogénea:** Horarios de disponibilidad variable por docente.
- **Cumplimiento normativo:** Necesidad de cumplir con estándares de calidad educativa.

Este problema pertenece a la clase **NP-completo**, caracterizada por un crecimiento combinatorio exponencial del espacio de soluciones (Garey & Johnson, 1979; Russell & Norvig, 2021). Sin una herramienta formal, el proceso manual consume **40–50 horas administrativas por semestre** con **3–7 conflictos no detectados**, exigiendo un sistema escalable, ágil y matemáticamente garantizado para la asignación de recursos.

---

## 2. OBJETIVOS DEL PROYECTO

| # | Objetivo | Criterio de Éxito |
|---|----------|-------------------|
| 01 | Automatizar la generación de horarios académicos sin intervención manual | Generación automática vía motor CSP |
| 02 | Reducir el tiempo de planificación en al menos 50 % respecto al proceso manual | Generación ≤5 segundos vs. 40-50 horas manuales |
| 03 | Garantizar horarios académicamente válidos con 0 conflictos de asignación | 0 violaciones de restricciones duras (HC-1 a HC-7) |
| 04 | Optimizar la asignación de recursos institucionales (aulas, docentes, franjas) | Soft score ≥80/100 en restricciones blandas |
| 05 | Mantener una arquitectura modular y escalable para futura mantenibilidad | Cobertura de pruebas ≥70 % en módulos críticos |
| 06 | Visualizar datos de recursos para la toma de decisiones | Vistas interactivas por docente, aula y carrera |
| 07 | Habilitar enseñanza híbrida | Soporte para asignación de aulas con equipamiento especial |
| 08 | Garantizar escalabilidad del sistema | Arquitectura preparada para >100 cursos (escalamiento horizontal) |

---

## 3. ALCANCE DEL PROYECTO

### 3.1 Incluye

| Área | Descripción |
|------|-------------|
| **Modelado formal** | Problema modelado como CSP con 7 restricciones duras (HC) y 5 restricciones blandas (SC) |
| **Gestión de datos** | Registro de cursos, docentes (con disponibilidad), aulas (capacidad, tipo, equipamiento) |
| **Validación académica** | Validación de prerrequisitos, co-requisitos, carga crediticia (20-22 créditos) |
| **Motor CSP** | Generación automática con backtracking + AC-3 + MRV, 0 violaciones HC |
| **Visualización** | Vistas interactivas por docente, por aula y por carrera |
| **Seguridad** | Autenticación JWT + controles OWASP Top 10 |
| **Calidad** | SonarQube, WCAG 2.2 (accesibilidad), SUS (usabilidad), Green Software (sostenibilidad) |
| **Documentación** | Técnica completa en Markdown + repositorio GitHub versionado |
| **Exportación** | Horarios en formatos CSV/PDF |

### 3.2 No Incluye

| Área | Justificación |
|------|---------------|
| Integración con sistemas ERP universitarios reales (SAP, Banner, etc.) | Fuera del alcance del PMV; requeriría acuerdos institucionales |
| Infraestructura productiva con SLA 99.9 % | Fuera del alcance académico; se entrega documentación para despliegue |
| Pruebas de carga formal (k6/Artillery) | Pendiente para fase de mantenimiento/mejora |
| Aplicación móvil nativa | No contemplada en el alcance inicial |
| Reportes analíticos avanzados (BI / dashboards) | Funcionalidad futura no incluida en el PMV |
| Integración SSO institucional | Requiere coordinación con área de TI institucional |

---

## 4. RIESGOS Y PROBLEMAS IDENTIFICADOS

| # | Riesgo | Probabilidad | Impacto | Estrategia de Mitigación |
|---|---------|-------------|---------|---------------------------|
| R-01 | Complejidad excesiva del CSP (no converge ≤5s) | 45% | Alto | Heurística MRV + AC-3 + timeout 5s + worker thread |
| R-02 | Rendimiento: UI se congela / timeout HTTP | 35% | Medio | Solver en worker thread aislado + polling |
| R-03 | Cambio de requerimientos a mitad de proyecto | 50% | Alto | Scope control, diseño modular, restricciones documentadas |
| R-04 | Datos inválidos / inconsistentes | 30% | Medio | Validación de esquema + preprocesamiento de datos |
| R-05 | Falta de escalabilidad (>100 cursos) | 25% | Medio | Diseño modular + parámetros ajustables |
| R-06 | Infeasibilidad (restricciones incompatibles) | 40% | Alto | Reporte de causa raíz + sugerencias automáticas |
| R-07 | Mantenimiento a largo plazo ("black box") | 60% | Medio | Documentación exhaustiva + trazabilidad |
| R-08 | Fallo de conexión a MongoDB | 15% | Alto | Retry con backoff + connection pooling |
| R-09 | Discrepancia especificación-código | 20% | Alto | TDD + tests unitarios por restricción |

**Exposición total estimada:** $8,910 · **Reserva de contingencia:** 30 % ($16,408)

---

## 5. ENTREGABLES COMPROMETIDOS

| # | Entregable | Criterio de Aceptación |
|---|------------|------------------------|
| 01 | Documento de análisis del problema (modelado CSP formal) | Especificación formal con variables, dominios y restricciones |
| 02 | Modelo formal CSP / Optimización | Definición de HC-1 a HC-7 y SC-1 a SC-5 |
| 03 | Diseño de arquitectura SPA + API REST | Diagramas C4 + especificación de API |
| 04 | Código fuente funcional (Frontend React + Backend Node.js) | Repositorio con 93+ commits, 8+ PRs |
| 05 | Pruebas unitarias e integración | 25+ casos de prueba, cobertura ≥70 % en módulos CSP |
| 06 | Repositorio GitHub documentado | README, wiki, commits semánticos, estructura organizada |
| 07 | PMV etiquetado como v1.0.0 | GitHub Releases con tag v1.0.0 |
| 08 | Video demostrativo | Máximo 5.5 minutos, funcionalidades clave |
| 09 | Informe técnico final | Documento completo de cierre del proyecto |
| 10 | Documentación de capacitación | Manuales de usuario y mantenimiento |

---

## 6. FINANZAS Y PRESUPUESTO

| Concepto | Cálculo | Monto (US$) |
|----------|---------|-------------|
| Costo directo (esfuerzo de desarrollo) | 600 horas × $54.46 | $32,676 |
| Multiplicador CSP (HU-05, complejidad NP-completa) | $32,676 × 1.385× | $5,800 |
| Infraestructura y herramientas | Hosting, MongoDB Atlas, CI/CD, licencias | $1,200 |
| Costos indirectos | PM, supervisión, documentación, coordinación | $7,260 |
| **Subtotal** | | **$46,936** |
| **Contingencia (30 %)** | Reserva para riesgos del CSP | **$16,408** |
| **TOTAL PLANIFICADO** | | **$72,468** |

**Nota:** El presupuesto refleja el esfuerzo humano y la complejidad algorítmica del proyecto, no solo costos de infraestructura. El multiplicador 1.385× para HU-05 (Motor CSP) está justificado por la naturaleza NP-completa del problema.

---

## 7. CRONOGRAMA DE HITOS

| # | Hito | Período | Semana | Entregable Clave |
|---|------|---------|--------|------------------|
| 01 | Sprint 0 — Análisis y planificación | 24/03 → 06/04 | Semana 2 | Project Charter aprobado |
| 02 | Sprint 1 — Fundación de datos | 07/04 → 20/04 | Semana 4 | CRUD funcional (docentes, cursos, aulas) |
| 03 | Sprint 2 — Gestión de datos + preparación CSP | 21/04 → 04/05 | Semana 6 | Modelo CSP definido |
| 04 | **Sprint 3 — Motor CSP (Ruta Crítica)** | 05/05 → 18/05 | **Semana 8** | **HU-05: Motor CSP operativo** |
| 05 | Sprint 4 — Detección de conflictos | 19/05 → 01/06 | Semana 10 | Validación de restricciones |
| 06 | Sprint 5 — Optimización + visualización | 02/06 → 15/06 | Semana 12 | Vistas interactivas + soft score |
| 07 | Sprint 6 — Exportación de horarios | 16/06 → 29/06 | Semana 14 | Exportación CSV/PDF |
| 08 | Sprint 7 — Testing, calidad e integración | 30/06 → 05/07 | Semana 16 | Entrega PMV v1.0.0 + Video + Cierre |

**Fecha de cierre real:** 18/06/2026 (17 días antes de lo planificado)

---

## 8. STAKEHOLDERS CLAVE

| Grupo | Rol en el Proyecto |
|-------|-------------------|
| Estudiantes universitarios | Usuarios finales; beneficiarios del sistema |
| Docentes | Usuarios que reciben asignación de horarios |
| Coordinadores académicos | Validadores de restricciones y reglas de negocio |
| Personal administrativo de planificación | Operadores del sistema |
| Universidad Continental | Institución patrocinadora |
| Equipo de TI institucional | Futuros mantenedores del sistema |

---

## 9. EQUIPO INTERNO DEL PROYECTO

| Rol | Integrante | Responsabilidad |
|-----|------------|-----------------|
| Sponsor | Gamarra Moreno, Job | Aprobación de requisitos y criterios de éxito |
| Project Manager / Scrum Master | Landa Sabuco, Gabriel D. | Gestión del proyecto, facilitación Scrum, eliminación de impedimentos |
| Product Owner | Curassi Montano, Piero | Definición de requisitos, priorización del backlog |
| Tech Lead / Backend Developer | Escobar Rojas, Rolfi | Arquitectura backend, motor CSP, API REST |
| Fullstack Developer | Rojas Ortiz, Franklin | Frontend React, integración con backend, UX/UI |
| Frontend Developer & UX | Camarena Chávez, Anthony | Interfaz de usuario, experiencia de usuario, accesibilidad |

---

## 10. APROBACIONES

| Rol | Nombre | Firma | Fecha |
|-----|--------|-------|-------|
| Sponsor | Gamarra Moreno, Job | __________ | __________ |
| Project Manager / Scrum Master | Landa Sabuco, Gabriel D. | __________ | __________ |
| Product Owner | Curassi Montano, Piero | __________ | __________ |

---

## 11. REFERENCIAS

- Garey, M. R., & Johnson, D. S. (1979). *Computers and intractability: A guide to the theory of NP-completeness*. W. H. Freeman.
- Project Management Institute. (2017). *A guide to the project management body of knowledge (PMBOK guide)* (6th ed.). PMI.
- Project Management Institute. (2021). *A guide to the project management body of knowledge (PMBOK guide)* (7th ed.). PMI.
- Russell, S., & Norvig, P. (2021). *Artificial intelligence: A modern approach* (4th ed.). Pearson.
- Schwaber, K., & Sutherland, J. (2020). *The Scrum guide: The definitive guide to Scrum*. https://scrumguides.org/

---

## 12. CONTROL DE CAMBIOS

| Versión | Fecha | Cambio | Autor | Aprobado por |
|---------|-------|--------|-------|--------------|
| 1.0 | 24/03/2026 | Versión inicial | Curassi Montano, P. | Gamarra Moreno, J. |
| 2.0 | 18/06/2026 | Actualización post-cierre: stack MERN, presupuesto $72,468, roles actualizados, cronograma detallado | Landa Sabuco, G. D. | Gamarra Moreno, J. |

---

**Documento elaborado conforme al enfoque PMBOK (PMI, 2017; PMI, 2021) como parte de la fase de Inicio del proyecto.**

**Última actualización:** 26 de junio de 2026

---

*Documento elaborado conforme al enfoque PMBOK (PMI, 2017; PMI, 2021) como parte de la fase de Control y Cierre del proyecto, en revisión del Acta de Constitución original (`docs/Planificación/Project Charter.png` · `docs/Planificación/CONSTITUTION.md`). Última actualización: 24 de junio de 2026.*
