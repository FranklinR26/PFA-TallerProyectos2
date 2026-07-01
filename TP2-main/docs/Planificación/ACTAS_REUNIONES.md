# Actas de Reuniones — Sprint Reviews y Retrospectivas

**Proyecto:** Sistema de Generación Óptima de Horarios Académicos (CSP Schedule Solver)
**Metodología:** Scrum — sprints bisemanales

---

## Sprint 1 — Review y Retrospectiva

**Fecha:** 2026-04-05
**Asistentes:** Equipo de desarrollo, profesor del curso
**Duración:** 45 minutos

### Review — Entregables demostrados
- CRUD completo de docentes (HU-01): modelo, endpoints, validaciones
- CRUD de aulas con tipos teoría/laboratorio/taller (HU-02)
- Sistema de autenticación JWT con roles (HU-10): login funcional, middleware de autorización
- Base de datos MongoDB conectada y operativa

### Métricas del sprint
| Métrica | Planificado | Real |
|---------|------------|------|
| Story Points | 12 | 12 |
| Velocidad | — | 12 pts/sprint (baseline) |
| Tests creados | — | 15 |

### Retrospectiva
| Qué salió bien | Qué mejorar | Acciones |
|----------------|-------------|----------|
| Configuración rápida del stack MERN | Faltó definir .env.example desde el inicio | Crear .env.example documentado |
| Modelos Mongoose bien definidos desde el inicio | Tests podrían haber empezado antes | Adoptar TDD a partir del Sprint 2 |
| Autenticación JWT funcional en el primer sprint | Documentación de API pendiente | Documentar endpoints al finalizar cada HU |

### Decisiones
- Se adopta bcrypt con cost 12 para hashing de contraseñas.
- Se define la estructura de carpetas: controllers/, models/, routes/, middleware/.

---

## Sprint 2 — Review y Retrospectiva

**Fecha:** 2026-04-19
**Asistentes:** Equipo de desarrollo, profesor del curso
**Duración:** 40 minutos

### Review — Entregables demostrados
- CRUD de cursos con relación a docentes (HU-03)
- CRUD de secciones (HU-04)
- Gestión de estudiantes + matrícula masiva (HU-11)
- Endpoint agregado `/api/data/all` para reducir solicitudes HTTP

### Métricas del sprint
| Métrica | Planificado | Real |
|---------|------------|------|
| Story Points | 11 | 11 |
| Velocidad | 12 | 11.5 (promedio) |

### Retrospectiva
| Qué salió bien | Qué mejorar | Acciones |
|----------------|-------------|----------|
| Endpoint `/all` reduce 5 llamadas a 1 | Código de data.controller.js muy largo | Evaluar separación por entidad |
| Matrícula masiva funcional | Sin validación de capacidad en matrícula | Agregar validación HC-4 en Sprint 3 |

### Decisiones
- Se mantiene un solo data.controller.js por cohesión (todas son operaciones CRUD de datos base).
- Se prioriza HU-05 (Motor CSP) como siguiente sprint — es el bloqueador principal.

---

## Sprint 3 — Review y Retrospectiva

**Fecha:** 2026-05-03
**Asistentes:** Equipo de desarrollo, profesor del curso
**Duración:** 50 minutos

### Review — Entregables demostrados
- Estructura base del solver CSP (variables.js, constraints.js)
- Definición de las 7 restricciones duras (HC-1 a HC-7)
- Algoritmo de backtracking básico funcional
- Primeras pruebas con dataset reducido (5 cursos, 2 aulas)

### Métricas del sprint
| Métrica | Planificado | Real |
|---------|------------|------|
| Story Points | 8 | 7 ⚠️ |
| SPI | 1.0 | 0.93 |
| Riesgo R-01 materializado | — | Parcialmente |

### Retrospectiva
| Qué salió bien | Qué mejorar | Acciones |
|----------------|-------------|----------|
| Restricciones duras bien formalizadas | AC-3 más complejo de lo esperado | Dedicar horas extra en S4 |
| Worker thread aislado evita bloqueo de UI | El solver tarda >5s con dataset completo | Implementar MRV en S4 |

### Decisiones
- Se extiende HU-05 al Sprint 4 (1 SP pendiente: heurística MRV + optimización).
- Se activa el plan de mitigación de R-01 (timeout a 5s, reducción de dominio con AC-3).

---

## Sprint 4 — Review y Retrospectiva

**Fecha:** 2026-05-17
**Asistentes:** Equipo de desarrollo, profesor del curso
**Duración:** 45 minutos

### Review — Entregables demostrados
- Motor CSP completamente funcional (HU-05 cerrado)
- Heurística MRV implementada — reduce tiempo de solución de 12s a 2.3s
- AC-3 propagation operativa — reduce dominio antes de búsqueda
- Solver resuelve dataset completo (50 cursos × 5 aulas × 35 slots) en <5s
- 25 test cases de restricciones documentados y ejecutándose

### Métricas del sprint
| Métrica | Planificado | Real |
|---------|------------|------|
| Story Points | 8 | 9 (incluye SP pendiente de S3) |
| SPI acumulado | 1.0 | 1.03 (recuperado) |
| Tiempo solver (dataset completo) | <5s | 2.3s ✅ |

### Retrospectiva
| Qué salió bien | Qué mejorar | Acciones |
|----------------|-------------|----------|
| Recuperación total del retraso de S3 | Horas extra generaron fatiga | Ajustar carga en S5 |
| MRV redujo tiempo un 80% | Falta reporting de causa raíz cuando no hay solución | Agregar mensajes de infeasibility |

### Decisiones
- Motor CSP congelado (no más cambios en solver.js hasta Sprint 7).
- Se priorizan las vistas de usuario (HU-06, HU-07) para los sprints siguientes.

---

## Sprint 5 — Review y Retrospectiva

**Fecha:** 2026-05-31
**Asistentes:** Equipo de desarrollo, profesor del curso
**Duración:** 40 minutos

### Review — Entregables demostrados
- SchedulePage con grilla semanal y drag & drop (HU-06)
- Exportación de horario a PDF con jsPDF
- Gestión de períodos académicos (HU-08)
- Vista por docente, por aula y por sección

### Métricas del sprint
| Métrica | Planificado | Real |
|---------|------------|------|
| Story Points | 10 | 10 |
| SPI | 1.0 | 1.00 |

### Retrospectiva
| Qué salió bien | Qué mejorar | Acciones |
|----------------|-------------|----------|
| @dnd-kit funciona bien para drag & drop | Accesibilidad del drag & drop por teclado pendiente | Evaluar en Sprint 7 (WCAG) |
| PDF exporta correctamente | Falta responsive en mobile | Agregar media queries |

### Decisiones
- Se agrega responsive design a la deuda técnica para Sprint 7.
- Se inicia HU-07 (Portal) y HU-09 (Dashboard) en Sprint 6.

---

## Sprint 6 — Review y Retrospectiva

**Fecha:** 2026-06-14
**Asistentes:** Equipo de desarrollo, profesor del curso
**Duración:** 45 minutos

### Review — Entregables demostrados
- Portal personalizado por rol: docente ve disponibilidad, estudiante ve matrícula (HU-07)
- Dashboard de métricas del solver (HU-09)
- Módulo de sostenibilidad: CO2 monitor, compresión gzip, optimización de imágenes
- Dashboard ambiental con huella de carbono acumulada

### Métricas del sprint
| Métrica | Planificado | Real |
|---------|------------|------|
| Story Points | 10 | 10 |
| SPI | 1.0 | 1.00 |
| Funcionalidades core completadas | 100% | 100% |

### Retrospectiva
| Qué salió bien | Qué mejorar | Acciones |
|----------------|-------------|----------|
| Portal funcional para 4 roles | Tests del portal son mínimos | Expandir en Sprint 7 |
| CO2 monitor integrado sin impacto en performance | Falta documentación de sostenibilidad | Documentar en Sprint 7 |

### Decisiones
- Sprint 7 se dedica exclusivamente a testing, calidad y documentación.
- No se agregan features nuevas; solo correcciones y aseguramiento de calidad.

---

## Sprint 7 — Review y Retrospectiva (Final)

**Fecha:** 2026-06-28
**Asistentes:** Equipo de desarrollo, profesor del curso
**Duración:** 60 minutos

### Review — Entregables demostrados
- 114 tests backend ejecutándose (0 fallos)
- Tests frontend: componentes, stores, integración, E2E
- SonarQube: 0 bugs (corregidos 5 CRITICAL), 0 vulnerabilidades
- OWASP Top 10 2025: 7 hallazgos identificados y mitigados
- WCAG 2.1 AA: 12 criterios evaluados, 10 corregidos
- Instrumento SUS aplicado a 5 usuarios
- GitHub Actions CI operativo
- Docker: stack completo con healthchecks

### Métricas del sprint
| Métrica | Planificado | Real |
|---------|------------|------|
| Story Points | 10 | 10 |
| Tests totales | 100+ | 114 (backend) + frontend |
| Cobertura backend | ≥87% | 36.2% (por módulo: CSP 87%) |
| SPI final | 1.0 | 1.00 |
| CPI final | ≥0.95 | 0.99 |

### Retrospectiva
| Qué salió bien | Qué mejorar (para futuros proyectos) | Lecciones aprendidas |
|----------------|--------------------------------------|---------------------|
| Auditoría OWASP reveló vulnerabilidades reales | Empezar testing desde Sprint 1 | TDD desde el inicio |
| WCAG mejoró accesibilidad significativamente | Cobertura global baja por controllers no testeados | Testear controllers desde su creación |
| SonarQube identificó bugs reales (sorts sin compare) | Configurar pre-commit hooks desde el inicio | Incluir linting en CI desde Sprint 1 |
| Documentación PMBOK completa | Actas de reunión deberían escribirse el mismo día | Escribir actas inmediatamente post-reunión |

### Decisiones finales
- Proyecto listo para cierre formal.
- Documentación de cierre en la semana del 29 Jun – 05 Jul.
- Repositorio público se mantiene como referencia académica.
