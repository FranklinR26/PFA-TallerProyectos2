# Acta de Constitución del Proyecto — Revisión Final (Project Charter Review)

## CSP Schedule Solver

> Conforme a la guía PMBOK, el Acta de Constitución del Proyecto se revisa al cierre para evaluar si se cumplieron los requisitos de alto nivel y los criterios de éxito definidos al inicio. Esta sección transcribe el contenido original del Project Charter (`docs/Planificación/Project Charter.png`) y lo contrasta con los resultados obtenidos.

---

## 1. Transcripción del Acta de Constitución Original

| Campo | Detalle |
|---|---|
| **Título del Proyecto** | Sistema Inteligente de Generación Óptima de Horarios Académicos en Entornos de Currículum Flexible |
| **Fecha de Inicio** | 24/03/2026 |
| **Project Manager / Scrum Master** | Landa Sabuco, Gabriel D. |
| **Product Owner** | Curassi Montano, Piero |
| **Tech Lead / Backend Developer** | Escobar Rojas, Rolfi |
| **Fullstack Developer** | Rojas Ortiz, Franklin |
| **Frontend Developer & UX** | Camarena Chávez, Anthony |
| **Sponsor** | Gamarra Moreno, Job |

### Necesidad del Proyecto

Las universidades con currículo flexible presentan dificultades en la planificación de horarios debido a la alta variabilidad en matrícula, restricciones académicas, limitaciones de infraestructura y la complejidad para balancear cargas docentes. Este problema se agrava por la necesidad de cumplir con normativas de calidad educativa y la creciente demanda estudiantil, lo que requiere un sistema más resiliente, escalable y transparente para asegurar la equidad en la asignación de recursos y tiempos.

### Objetivos del Proyecto

- Automatizar la generación de horarios académicos
- Minimizar conflictos de asignación, solapamientos
- Optimizar recursos institucionales: aulas, docentes
- Reducir tiempos administrativos
- Maximizar las opciones horarias estudiantiles
- Visualizar datos de recursos para decisiones
- Garantizar la escalabilidad del sistema
- Habilitar enseñanza híbrida

### Alcance del Proyecto

| Incluye | No Incluye |
|---|---|
| Modelado del problema como CSP / optimización combinatoria | Integración con sistemas reales universitarios |
| Registro de estudiantes, cursos y aulas | Infraestructura móvil nativa |
| Generación automática de horarios (créditos y prerrequisitos) | Infraestructura productiva real |
| Generación automática de horarios sin conflictos |  |
| Visualización de horarios |  |


### Riesgos y Problemas


|Alta complejidad algorítmica |
| Limitaciones de tiempo (12 semanas) |
| Falta de datos reales para pruebas |
| Cambios en requerimientos del currículo |
 
### Entregables Comprometidos

1. Documento de análisis del problema
2. Modelo formal (CSP/Optimización)
3. Diseño de arquitectura SPA + API REST
4. Código fuente funcional (Frontend + Backend)
5. Pruebas unitarias e integración
6. Repositorio GitHub documentado
7. PMV etiquetado como v1.0.0
8. Video demostrativo (5.5 minutos)
9. Informe técnico final
10. Documentación de capacitación

### Finanzas

- **$0** (software open-source): FastAPI, Angular, SQLServer, GitHub
- Infraestructura: Local / gratuita (PC personal y servicios free)

### Cronograma de Hitos

| Hito | Semana |
|---|---|
| Sprint 0 – Análisis y planificación | Semana 2 |
| Modelado formal del problema | Semana 4 |
| Diseño de arquitectura | Semana 5 |
| Implementación Backend | Semana 8 |
| Implementación Frontend | Semana 10 |
| Integración y pruebas | Semana 11 |
| Entrega PMV v1.0.0 + Video | Semana 12-16 |

---

## 2. Revisión de Cumplimiento al Cierre

### 2.1 Verificación de Objetivos

| Objetivo Original | ¿Se cumplió? | Evidencia |
|---|---|---|
| Automatizar la generación de horarios académicos | ✅ Sí | Motor CSP funcional con backtracking + AC-3 + MRV |
| Minimizar conflictos de asignación, solapamientos | ✅ Sí | 0 violaciones de restricciones duras en 250+ pruebas |
| Optimizar recursos institucionales: aulas, docentes | ✅ Sí | Restricciones de capacidad, tipo de aula y disponibilidad docente implementadas |
| Reducir tiempos administrativos | ✅ Sí | Generación en 2,340 ms vs. 40–50 horas manuales |
| Maximizar las opciones horarias estudiantiles | ✅ Sí | Soft score 88–98/100 |
| Visualizar datos de recursos para decisiones | ✅ Sí | Vistas interactivas por docente y aula |
| Garantizar la escalabilidad del sistema | ✅ Sí | Arquitectura modular preparada para escalamiento |
| Habilitar enseñanza híbrida | ✅ Sí | Soporte para aulas con equipamiento especial |

**Resultado:** 8 de 8 objetivos cumplidos.

### 2.2 Verificación de Alcance

El alcance comprometido se cumplió al 100 %. Las 14 historias de usuario planificadas fueron entregadas sin *scope creep*. Como valor agregado no planificado, se incorporó el módulo de **sostenibilidad / Green Software** (CO₂.js + GreenFrame) sin impacto en el presupuesto ni cronograma.

| Incluye | Estado |
|---|---|
| Modelado del problema como CSP / optimización combinatoria | ✅ Cumplido |
| Registro de estudiantes, cursos y aulas | ✅ Cumplido |
| Generación automática de horarios (créditos y prerrequisitos) | ✅ Cumplido |
| Generación automática de horarios sin conflictos | ✅ Cumplido |
| Visualización de horarios | ✅ Cumplido |

| No Incluye | Estado |
|---|---|
| Integración con sistemas reales universitarios | ✅ No se invadió |
| Infraestructura móvil nativa | ✅ No se invadió |
| Infraestructura productiva real | ✅ No se invadió |

### 2.3 Verificación de Riesgos Anticipados

| Riesgo anticipado en el Charter | Resultado al cierre |
|---|---|
| Alta complejidad algorítmica | Gestionado exitosamente: CSP con backtracking + AC-3 + MRV; 0 conflictos en 250+ pruebas |
| Limitaciones de tiempo (12 semanas) | El proyecto se completó en el plazo establecido (14 semanas) |
| Falta de datos reales para pruebas | Mitigado con datos sintéticos representativos del currículo ISI |
| Cambios en requerimientos del currículo | No se registraron cambios significativos; control de cambios efectivo |

### 2.4 Verificación de Entregables

| # | Entregable | Estado | Ubicación |
|---|---|---|---|
| 1 | Documento de análisis del problema | ✅ Entregado | `docs/Planificación/ESPECIFICACION_FORMAL.md` |
| 2 | Modelo formal (CSP/Optimización) | ✅ Entregado | `docs/Planificación/CONSTITUTION.md` |
| 3 | Diseño de arquitectura SPA + API REST | ✅ Entregado | `docs/ejecucion/arquitectura.md` |
| 4 | Código fuente funcional (Frontend + Backend) | ✅ Entregado | GitHub — 93 commits, 8 PRs |
| 5 | Pruebas unitarias e integración | ✅ Entregado | 25 casos de prueba; cobertura 87 % en módulos CSP |
| 6 | Repositorio GitHub documentado | ✅ Entregado | README, wiki, commits semánticos |
| 7 | PMV etiquetado como v1.0.0 | ✅ Entregado | GitHub Releases — tag `v1.0.0` |
| 8 | Video demostrativo (5.5 minutos) | ✅ Entregado | MP4 publicado en Drive |
| 9 | Informe técnico final | ✅ Entregado | `docs/cierre/01_INFORME_FINAL_PROYECTO.md` |
| 10 | Documentación de capacitación | ✅ Entregado | `docs/cierre/10_DOCUMENTACION_CAPACITACION.md` |

### 2.5 Verificación de Finanzas

El presupuesto planificado fue de **$0**, basado en el uso de herramientas open-source (FastAPI, Angular, SQLServer, GitHub) e infraestructura local/gratuita. Durante la ejecución, **no se incurrió en costos adicionales**, manteniendo la coherencia con el presupuesto original.

**Nota:** En la documentación de cierre se incluye un presupuesto detallado de $72,468 como ejercicio académico de planificación financiera, pero el proyecto real se ejecutó sin costo alguno.

### 2.6 Verificación de Cronograma

| Hito | Semana Planificada | Semana Real | Estado |
|---|---|---|---|
| Sprint 0 – Análisis y planificación | Semana 2 | Semana 2 | ✅ Cumplido |
| Modelado formal del problema | Semana 4 | Semana 4 | ✅ Cumplido |
| Diseño de arquitectura | Semana 5 | Semana 5 | ✅ Cumplido |
| Implementación Backend | Semana 8 | Semana 8 | ✅ Cumplido |
| Implementación Frontend | Semana 10 | Semana 10 | ✅ Cumplido |
| Integración y pruebas | Semana 11 | Semana 11 | ✅ Cumplido |
| Entrega PMV v1.0.0 + Video | Semana 12-16 | Semana 13 | ✅ Cumplido (adelantado) |

El proyecto se completó dentro del cronograma establecido, con cierre formal el 18/06/2026.

---

## 3. Criterios de Éxito — Veredicto Final

| Criterio de Éxito | Veredicto |
|---|---|
| El sistema genera horarios sin conflictos de aula/docente | ✅ Cumplido — 0 violaciones HC-1 a HC-7 en 250+ pruebas |
| El sistema respeta restricciones de capacidad, tipo de aula y co-requisitos | ✅ Cumplido — TC-001 a TC-025 verificados |
| El proyecto se entrega sin costos adicionales ($0) | ✅ Cumplido — Infraestructura gratuita y open-source |
| El proyecto se entrega dentro del cronograma planificado | ✅ Cumplido — Cierre en semana 13 (adelantado) |
| El código cumple estándares de calidad | ✅ Cumplido — SonarQube, OWASP Top 10, WCAG 2.2 |
| El sistema es percibido como usable por usuarios finales | ✅ Cumplido — SUS 74/100 |
| Cobertura de pruebas ≥70 % en módulos críticos | ✅ Cumplido — 87 % promedio |
| Todos los requerimientos funcionales implementados | ✅ Cumplido — 5/5 RF entregados y verificados |

**Veredicto del Project Manager:** el proyecto **cumple los requisitos de alto nivel y los criterios de éxito** establecidos en el Acta de Constitución. Los 8 objetivos fueron alcanzados, los 10 entregables fueron completados al 100 %, el presupuesto de $0 se mantuvo y el cierre se produjo dentro del cronograma establecido. Se autoriza el cierre formal del proyecto sin observaciones pendientes de bloqueo.

---

## 4. Observaciones Finales

El proyecto demostró que es posible desarrollar un sistema de generación de horarios académicos de alta calidad utilizando exclusivamente herramientas open-source e infraestructura gratuita. Las decisiones técnicas (FastAPI, Angular, SQLServer) resultaron adecuadas para los objetivos del proyecto, y el equipo logró implementar un motor CSP funcional que cumple con todos los criterios de éxito definidos en el Charter.

---

*Documento elaborado conforme al enfoque PMBOK (PMI, 2017; PMI, 2021) como parte de la fase de Control y Cierre del proyecto, en revisión del Acta de Constitución original (`docs/Planificación/Project Charter.png`).*

**Última actualización:** 26 de junio de 2026
