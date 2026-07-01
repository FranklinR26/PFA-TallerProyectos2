# Plan de Gestión de Comunicaciones

**Proyecto:** Sistema de Generación Óptima de Horarios Académicos (CSP Schedule Solver)
**Curso:** Taller de Proyectos 2 — Ingeniería de Sistemas e Informática
**Fecha:** 2026-03-23
**Versión:** 1.0

---

## 1. Objetivo

Definir los canales, frecuencias y responsables de comunicación del proyecto para asegurar que todos los stakeholders reciban información oportuna y relevante sobre el avance, riesgos y decisiones del proyecto.

---

## 2. Stakeholders y necesidades de información

| Stakeholder | Rol | Necesidad de información | Frecuencia |
|-------------|-----|-------------------------|------------|
| Profesor del curso | Sponsor / Evaluador | Avance del proyecto, entregables, cumplimiento de rúbrica | Bisemanal (fin de sprint) |
| Equipo de desarrollo | Ejecutor | Tareas asignadas, bloqueos, decisiones técnicas | Diaria (daily standup) |
| David Landa Sabuco | Product Owner / Dev Lead | Estado global, riesgos, priorización del backlog | Continua |
| Universidad Continental | Cliente final | Funcionalidad del sistema, usabilidad, accesibilidad | Al cierre de cada épica |

---

## 3. Matriz de comunicaciones

| Comunicación | Emisor | Receptor | Canal | Frecuencia | Formato |
|-------------|--------|----------|-------|------------|---------|
| Daily standup | Equipo | Equipo | Discord / presencial | Diaria (15 min) | Oral — 3 preguntas: ¿qué hice?, ¿qué haré?, ¿bloqueos? |
| Sprint Planning | Product Owner | Equipo | Presencial / Meet | Bisemanal (inicio de sprint) | Documento: sprint backlog + objetivos |
| Sprint Review | Equipo | Profesor + equipo | Presencial / Meet | Bisemanal (fin de sprint) | Demo funcional + métricas de sprint |
| Sprint Retrospectiva | Equipo | Equipo | Presencial | Bisemanal (fin de sprint) | Acta con: qué salió bien, qué mejorar, acciones |
| Reporte de estado | Dev Lead | Profesor | GitHub + documento | Bisemanal | Markdown: avance, riesgos, métricas |
| Notificación de riesgos | Cualquiera | Dev Lead | Discord / email | Según ocurrencia | Registro en `GESTION_RIESGOS_OPORTUNIDADES.md` |
| Entregable formal | Equipo | Profesor | GitHub (repositorio) | Según cronograma | Push a rama `main` con tag de versión |
| Documentación técnica | Equipo | Todos | Repositorio `docs/` | Continua | Markdown en carpetas por fase PMBOK |

---

## 4. Canales de comunicación

| Canal | Uso principal | Acceso |
|-------|--------------|--------|
| GitHub (repositorio) | Código, documentación, issues, PRs | Equipo + profesor |
| Discord | Comunicación informal diaria, alertas rápidas | Equipo |
| Google Meet | Reuniones formales (planning, review, retro) | Equipo + profesor |
| Email institucional | Comunicación formal con stakeholders externos | Según necesidad |
| Jira/Trello | Seguimiento de tareas del sprint | Equipo (referencia: `Otros/JIRA.md`) |

---

## 5. Escalamiento

| Nivel | Situación | Acción | Tiempo de respuesta |
|-------|-----------|--------|---------------------|
| 1 | Bloqueo técnico | Reportar en daily standup | 24 horas |
| 2 | Riesgo materializado (impacto medio) | Notificar a Dev Lead por Discord | 12 horas |
| 3 | Riesgo crítico (impacto alto) | Reunión extraordinaria + email al profesor | 4 horas |
| 4 | Cambio de alcance | Solicitud formal documentada + aprobación del profesor | Según disponibilidad |

---

## 6. Registro de decisiones

Todas las decisiones relevantes del proyecto se documentan en:
- **Actas de sprint review/retro:** `docs/Planificación/ACTAS_REUNIONES.md`
- **Decisiones arquitectónicas:** `docs/Planificación/CONSTITUTION.md`
- **Cambios de alcance:** `docs/Planificación/BACKLOG_FORMAL.md` (repriorización)
- **Riesgos:** `docs/Planificación/GESTION_RIESGOS_OPORTUNIDADES.md`
