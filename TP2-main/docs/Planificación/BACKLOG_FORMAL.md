# BACKLOG DEL PRODUCTO: CSP Schedule Solver
**Proyecto:** Taller de Proyectos 2 - Ingeniería de Sistemas  
**Versión:** 2.0 (Formal Completo)  
**Fecha:** 6 de Mayo, 2026  
**Responsable:** David Landa Sabuco  
**Estado:** ACTIVO - 14 User Stories, 4 Épicas

---

## 1. ESTRUCTURA DE ÉPICAS

```
ÉPICAS DEL PROYECTO
═════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────┐
│ EPIC-01: GESTIÓN DE DATOS                                   │
│ Descripción: Funcionalidades base de manejo de información  │
│ Historias: HU-01, HU-02, HU-03, HU-04, HU-10, HU-11         │
│ Duración: 6 semanas (Sprint 1-2)                            │
│ Restricciones Asociadas: HC-4, HC-5, HC-6                   │
│ Prioridad: 1 (Foundational)                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ EPIC-02: MOTOR CSP (CORE DEL PROYECTO)                      │
│ Descripción: Algoritmo de resolución de CSP                 │
│ Historias: HU-05, HU-06, HU-07, HU-08, HU-09                │
│ Duración: 5 semanas (Sprint 3-6)                            │
│ Restricciones Asociadas: HC-1 a HC-7, SC-1 a SC-5           │
│ Prioridad: 1 (CRÍTICO - Bloqueador)                         │
│ Dependencia: Después de EPIC-01 completado                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ EPIC-03: TESTING & VALIDACIÓN                               │
│ Descripción: Aseguramiento de calidad integral              │
│ Historias: HU-12, HU-13, HU-14                              │
│ Duración: 2 semanas (Sprint 7)                              │
│ Restricciones Asociadas: Todas (cobertura 87%)              │
│ Prioridad: 1 (CRÍTICO - Cierre)                             │
│ Dependencia: Después de EPIC-02 completado                  │
└─────────────────────────────────────────────────────────────┘

LEYENDA: HC = Hard Constraint, SC = Soft Constraint
```

---

## 2. HISTORIAS DE USUARIO FORMALES (14 HUs)

### 📌 HU-01: Gestión de Docentes

```
HISTORIA DE USUARIO
═════════════════════════════════════════════════════════════════
ID:             HU-01
Título:         Gestionar base de datos de docentes
Épica:          EPIC-01 (Gestión de Datos)
Prioridad:      HIGH (P1)
Puntos:         5
Duración Est:   2 semanas (80 horas)
Dependencias:   NINGUNA (Puede iniciar inmediatamente)

DESCRIPCIÓN:
Como administrador del sistema
Quiero registrar, actualizar y eliminar información de docentes
Para mantener un registro actualizado de disponibilidad y capacidades

CRITERIOS DE ACEPTACIÓN:
[ ] CRUD completo: Create, Read, Update, Delete docentes
[ ] Validación: Email único, nombre no vacío
[ ] Campos: ID, Nombre, Email, Disponibilidad (Lu-Vi, horas)
[ ] Capacidad: Máximo cursos por docente = 5
[ ] Base de datos: MongoDB con índice en Email

RESTRICCIONES CSP ASOCIADAS:
├─ HC-5: Disponibilidad Docente
│  └─ Docentes solo asignables en horarios disponibles
└─ HC-4: Capacidad
   └─ Un docente máximo N cursos por semana

PRUEBAS ASOCIADAS:
├─ TC-013: Validar docente fuera de disponibilidad (RECHAZA)
├─ TC-014: Validar docente dentro de disponibilidad (ACEPTA)
└─ TC-015: Validación exhaustiva 14 docentes × 35 slots

DEFINICIÓN DE LISTO (Definition of Done):
- [ ] Código implementado en Backend/models/Teacher.js
- [ ] Tests unitarios: 100% coverage
- [ ] Documentación API: /api/teachers endpoints
- [ ] Commits semánticos: feat(hu-01): Crear CRUD docentes
- [ ] PR con revisión y aprobación
- [ ] Merge a develop
- [ ] Documentación en README

RIESGO ASOCIADO:
├─ R-04 (Baja): Datos inconsistentes
├─ Mitigación: Validación en API + BD
└─ Contingencia: Rollback automático en caso de error
```

---

### 📌 HU-02: Gestión de Cursos

```
HISTORIA DE USUARIO
═════════════════════════════════════════════════════════════════
ID:             HU-02
Título:         Gestionar catálogo de cursos
Épica:          EPIC-01 (Gestión de Datos)
Prioridad:      HIGH (P1)
Puntos:         5
Duración Est:   2 semanas (80 horas)
Dependencias:   Paralela a HU-01

DESCRIPCIÓN:
Como coordinador académico
Quiero registrar cursos con sus atributos
Para que el sistema pueda asignarlos a horarios y docentes

CRITERIOS DE ACEPTACIÓN:
[ ] CRUD de cursos: Create, Read, Update, Delete
[ ] Campos: ID, Nombre, Código, Estudiantes, Tipo (teoría/práctica)
[ ] Validación: Estudiantes ≤ capacidad aula máxima (120)
[ ] Pre-requisitos: Grafo acíclico de co-requisitos

RESTRICCIONES CSP ASOCIADAS:
├─ HC-4: Capacidad Aula
│  └─ Estudiantes del curso ≤ capacidad aula asignada
├─ HC-6: Tipo Aula
│  └─ Cursos prácticos → aulas prácticas (preferencia)
└─ HC-7: Co-requisitos
   └─ Cursos relacionados no deben solaparse

PRUEBAS ASOCIADAS:
├─ TC-010: Curso > capacidad aula (RECHAZA)
├─ TC-011: Curso dentro capacidad (ACEPTA)
├─ TC-012: Validación exhaustiva 50 cursos × 5 aulas
├─ TC-016: Curso práctico en aula teoría (RECHAZA)
├─ TC-017: Curso teoría en aula práctica (ACEPTA)
├─ TC-019: Co-requisitos overlap temporal (RECHAZA)
├─ TC-020: Co-requisitos secuencial (ACEPTA)
└─ TC-021: Grafo acíclico (NO ciclos)

DEPENDENCIAS DE DISEÑO:
└─ Usa modelo de aulas (HU-03)
```

---

### 📌 HU-03: Gestión de Aulas

```
HISTORIA DE USUARIO
═════════════════════════════════════════════════════════════════
ID:             HU-03
Título:         Mantener inventario de aulas disponibles
Épica:          EPIC-01
Prioridad:      HIGH (P1)
Puntos:         3
Duración Est:   1.5 semanas (60 horas)
Dependencias:   Paralela a HU-01, HU-02

DESCRIPCIÓN:
Como administrator
Quiero registrar las aulas disponibles con sus características
Para que el sistema pueda asignarlas respetando capacidades y tipos

CRITERIOS DE ACEPTACIÓN:
[ ] CRUD de aulas: Create, Read, Update, Delete
[ ] Campos: ID, Nombre, Capacidad, Tipo (teoría/práctica/laboratorio)
[ ] Validación: Capacidad ≥ 20 y ≤ 120 estudiantes

RESTRICCIONES CSP ASOCIADAS:
├─ HC-3: No Solapamiento Aulas
│  └─ Una aula máximo 1 curso por slot
├─ HC-4: Capacidad Aula
│  └─ Capacidad aula ≥ estudiantes del curso
└─ HC-6: Tipo Aula
   └─ Preferencia de tipo aula por tipo de curso

PRUEBAS ASOCIADAS:
├─ TC-007: Aula ocupada 2 cursos simultáneamente (RECHAZA)
├─ TC-008: Aula uso secuencial (ACEPTA)
└─ TC-009: Matriz exhaustiva 5 aulas (0 conflictos)

ESTIMACIÓN TÉCNICA:
├─ Complejidad: Baja (modelo simple)
├─ Herramientas: Node.js + MongoDB
└─ Testing: 80% coverage mínimo
```

---

### 📌 HU-04: Definir Disponibilidad de Docentes

```
HISTORIA DE USUARIO
═════════════════════════════════════════════════════════════════
ID:             HU-04
Título:         Registrar disponibilidad horaria por docente
Épica:          EPIC-01
Prioridad:      HIGH (P1)
Puntos:         5
Duración Est:   2 semanas (80 horas)
Dependencias:   Después de HU-01 (Gestión Docentes)

DESCRIPCIÓN:
Como docente
Quiero indicar mis horas disponibles por día
Para que el sistema solo me asigne cursos en esos horarios

CRITERIOS DE ACEPTACIÓN:
[ ] Interfaz: Calendario semanal (Lu-Vi)
[ ] Entrada: Docente selecciona slots disponibles (bloques de 1-2h)
[ ] Validación: Mínimo 4 horas/semana, máximo 20 horas/semana
[ ] Persistencia: Guardado en BD

RESTRICCIONES CSP ASOCIADAS:
└─ HC-5: Disponibilidad Docente
   └─ Docente solo asignable en slots de disponibilidad registrada

PRUEBAS ASOCIADAS:
├─ TC-013: Docente asignado fuera de disponibilidad (RECHAZA)
├─ TC-014: Docente dentro de disponibilidad (ACEPTA)
└─ TC-015: Validación exhaustiva 14 docentes × 35 slots

DEPENDENCIA CON HU-01:
└─ Requiere docentes ya registrados en sistema

COMPLEJIDAD:
├─ UI: Calendario interactivo (React/Vue)
├─ Backend: API para guardar disponibilidad
└─ BD: Documento flexible para horarios
```

---

### 📌 HU-05: ⭐ MOTOR CSP (CORAZÓN DEL PROYECTO)

```
HISTORIA DE USUARIO - CRÍTICO
═════════════════════════════════════════════════════════════════
ID:             HU-05 ⭐⭐⭐
Título:         Implementar Motor de Resolución CSP
Épica:          EPIC-02 (Motor CSP)
Prioridad:      CRÍTICO (P0 - Bloqueador)
Puntos:         13 (máxima complejidad)
Duración Est:   2.5 semanas (150 horas)
Dependencias:   HU-01, HU-02, HU-03, HU-04 (TODAS)

⚠️ RUTA CRÍTICA: Este es el cuello de botella del proyecto
   Cualquier retraso impacta Sprints 4-7 directamente

DESCRIPCIÓN:
Como sistema automático
Quiero resolver el CSP de asignación de horarios
Para generar un horario óptimo que satisfaga todas las restricciones

CRITERIOS DE ACEPTACIÓN:
[HARD CONSTRAINTS - 100% OBLIGATORIO]
[ ] HC-1: Cada curso asignado exactamente una vez
[ ] HC-2: Ningún docente en 2+ cursos simultáneamente
[ ] HC-3: Ningún aula en 2+ cursos simultáneamente
[ ] HC-4: Estudiantes del curso ≤ capacidad aula
[ ] HC-5: Docentes solo en slots de disponibilidad
[ ] HC-6: Preferencia de tipo aula respetada
[ ] HC-7: Co-requisitos no solapan

[SOFT CONSTRAINTS - Optimizar ≥ 80 puntos]
[ ] SC-1: Distribución uniforme de cursos por día
[ ] SC-2: Minimizar huecos (bloques contiguos)
[ ] SC-3: Respetar preferencias de horario docente (70%+)
[ ] SC-4: Cursos matutinos cuando sea posible (60%+)
[ ] SC-5: Centralidad temporal (cursos semestre agrupados)

[PERFORMANCE]
[ ] Timeout máximo: 5 segundos para instancia de 50 cursos
[ ] Memoria: < 256MB para instancia de 100 cursos
[ ] Heurísticas: MRV + AC-3 implementadas

[OUTPUT]
[ ] Retorna: Asignación completa (curso → docente, aula, slot)
[ ] Score: Puntuación de satisfacción de soft constraints (0-100)
[ ] Trazabilidad: Qué restricción qué violó (si es infeasible)

ARQUITECTURA TÉCNICA:
```
                    ┌─────────────────────────┐
                    │  CSP SOLVER (HU-05)     │
                    │  ↑                      │
    ┌───────────────┤  Variables: x_ijk       │
    │               │  Domain: {T×R×S}^50     │
    │               │  Constraints: HC 1-7    │
    │               │  Scoring: SC 1-5        │
    │               ├─────────────────────────┤
    │               │ OR-Tools Library        │
    │               │ + Custom Heuristics     │
    │               └─────────────────────────┘
    │                        ↓
    ├─ Input: Docentes, Cursos, Aulas (HU-01, 02, 03, 04)
    │
    └─ Output: Horario Óptimo (HU-06, 07, 08, 09)
```

VARIABLES Y DOMINIOS:
├─ Variables: 8,750 (después de pre-filtering)
│  └─ Originales: 105,000 (50 cursos × 14 docentes × 5 aulas × 35 slots)
├─ Dominio: booleanos {0,1}
│  └─ x_ijks = 1 si curso i → docente j, aula k, slot s
└─ Espacio de búsqueda: 2^8,750 (NP-Complete)

RESTRICCIONES:
├─ HC-1: ∀i, ∑∑∑ x_ijks = 1 (asignación única)
├─ HC-2: ∀j,s, ∑∑ x_ijks ≤ 1 (docente no duplicado)
├─ HC-3: ∀k,s, ∑∑ x_ijks ≤ 1 (aula no duplicada)
├─ HC-4: ∑ estudiantes_i (asignados a k) ≤ capacidad_k
├─ HC-5: x_ijks ∧ disponibilidad_js (docente disponible)
├─ HC-6: preferencia tipo aula
└─ HC-7: co-requisitos no solapan

HEURÍSTICAS DE OPTIMIZACIÓN:
├─ MRV (Minimum Remaining Values)
│  └─ Selecciona variable con dominio más pequeño primero
├─ AC-3 (Arc Consistency 3)
│  └─ Propaga restricciones para reducir dominio
└─ Backtracking con poda

PRUEBAS ASOCIADAS: TC-001 a TC-025 (25 tests)
├─ HC-1: TC-001 a TC-003
├─ HC-2: TC-004 a TC-006
├─ HC-3: TC-007 a TC-009
├─ HC-4: TC-010 a TC-012
├─ HC-5: TC-013 a TC-015
├─ HC-6: TC-016 a TC-018
├─ HC-7: TC-019 a TC-021
└─ SC-1 a SC-5: TC-022 a TC-025

RIESGOS CRÍTICOS:
├─ R-01 (45%): Complejidad CSP puede no converger
│  └─ Mitigación: Timeout de 5s, solucion parcial fallback
├─ R-02 (35%): Performance > 5s en instancias grandes
│  └─ Mitigación: Heurísticas agresivas + paralelización
└─ R-08 (15%): Dependencia de OR-Tools open source
   └─ Mitigación: Análisis de alternativas (Z3, Choco)

DEFINICIÓN DE LISTO:
- [ ] 25 tests pasados (100%)
- [ ] Cobertura ≥ 87%
- [ ] Performance < 5s
- [ ] Documentación de algoritmo
- [ ] Commits semánticos: feat(hu-05): Implementar motor CSP
- [ ] PR con revisión exhaustiva
```

---

### 📌 HU-06: Detectar Conflictos de Horarios

```
ID:             HU-06
Título:         Validar y reportar conflictos detectados
Épica:          EPIC-02 (Motor CSP)
Prioridad:      HIGH (P1)
Puntos:         3
Duración Est:   1 semana (40 horas)
Dependencias:   HU-05 (BLOQUEADO POR MOTOR CSP)

DESCRIPCIÓN:
Como usuario
Quiero recibir un reporte de conflictos si existen
Para saber qué restricciones no pueden satisfacerse

CRITERIOS DE ACEPTACIÓN:
[ ] Identifica tipo de conflicto: HC-1, HC-2, HC-3, HC-4, HC-5, HC-6, HC-7
[ ] Reporte: lista de violaciones por restricción
[ ] Exportable: JSON, PDF, CSV
[ ] UI: visualiza conflictos en calendario

RESTRICCIONES ASOCIADAS:
└─ Todas (HC-1 a HC-7) pueden generar conflictos
```

---

### 📌 HU-07: Optimizar Restricciones Soft

```
ID:             HU-07
Título:         Optimizar score de preferencias y distribución
Épica:          EPIC-02
Prioridad:      HIGH (P1)
Puntos:         4
Duración Est:   1.5 semanas (60 horas)
Dependencias:   HU-05, HU-06

DESCRIPCIÓN:
Mejorar la solución del CSP respecto a restricciones soft (SC-1 a SC-5)
para maximizar satisfacción de docentes y equidad de carga

CRITERIOS DE ACEPTACIÓN:
[ ] Score SC-1 a SC-5: mínimo 80 puntos
[ ] SC-1 (Distribución): desv. est. de cursos/día < 15%
[ ] SC-2 (Huecos): bloques contiguos ≥ 70%
[ ] SC-3 (Preferencias): satisfacción ≥ 90%
[ ] SC-4 (Matutinos): ≥ 60% en bloques matutinos
[ ] SC-5 (Centralidad): agrupación ≥ 75%

RESTRICCIONES ASOCIADAS:
├─ SC-1: Distribución uniforme de cursos
├─ SC-2: Minimizar huecos
├─ SC-3: Preferencias de horario
├─ SC-4: Horarios matutinos
└─ SC-5: Centralidad temporal

TESTEO: TC-022 a TC-025
```

---

### 📌 HU-08: Visualizar Horario Generado

```
ID:             HU-08
Título:         Interfaz de visualización de horario
Épica:          EPIC-02
Prioridad:      HIGH (P1)
Puntos:         5
Duración Est:   2 semanas (80 horas)
Dependencias:   HU-05, HU-06, HU-07

DESCRIPCIÓN:
Como usuario académico
Quiero ver el horario en formato visual (calendario)
Para identificar rápidamente mis cursos y horarios

CRITERIOS DE ACEPTACIÓN:
[ ] Vista semanal: Lu-Vi con slots de 1-2 horas
[ ] Código de colores: por docente, por curso, por tipo
[ ] Filtros: por docente, por aula, por curso
[ ] Exportable: PDF, iCal, Excel
[ ] Responsive: desktop y mobile

TECNOLOGÍA:
├─ Frontend: React/Vue
├─ Calendario: FullCalendar.io o similar
└─ Backend: API para servir horario
```

---

### 📌 HU-09: Exportar Horario en Múltiples Formatos

```
ID:             HU-09
Título:         Exportar horario a formatos diversos
Épica:          EPIC-02
Prioridad:      MEDIUM (P2)
Puntos:         3
Duración Est:   1.5 semanas (60 horas)
Dependencias:   HU-08

DESCRIPCIÓN:
Como coordinador académico
Quiero exportar el horario en múltiples formatos
Para compartirlo con diferentes sistemas académicos

CRITERIOS DE ACEPTACIÓN:
[ ] Formato PDF: con logo institucional y firma digital
[ ] Formato Excel: con fórmulas y gráficos
[ ] Formato iCal: compatible con Outlook, Google Calendar
[ ] Formato JSON: para integración con otros sistemas
[ ] Validación: todos los formatos tienen datos consistentes
```

---

### 📌 HU-10: Autenticación de Usuarios

```
ID:             HU-10
Título:         Sistema de login y control de acceso
Épica:          EPIC-01 (Gestión de Datos)
Prioridad:      MEDIUM (P2)
Puntos:         5
Duración Est:   2 semanas (80 horas)
Dependencias:   Paralela a otras

DESCRIPCIÓN:
Como usuario del sistema
Quiero autenticarme con credenciales
Para acceder según mi rol (admin, docente, coordinador)

CRITERIOS DE ACEPTACIÓN:
[ ] Login: email + contraseña
[ ] Roles: admin, docente, coordinador
[ ] Sesión: JWT token con expiración
[ ] Hash: bcrypt para contraseñas
[ ] Recuperación: reset de contraseña vía email

RESTRICCIONES ASOCIADAS:
└─ Seguridad de datos académicos
```

---

### 📌 HU-11: Gestión de Sesiones y Permisos

```
ID:             HU-11
Título:         Control de acceso basado en roles (RBAC)
Épica:          EPIC-01
Prioridad:      MEDIUM (P2)
Puntos:         3
Duración Est:   1.5 semanas (60 horas)
Dependencias:   HU-10

DESCRIPCIÓN:
Como administrador
Quiero controlar qué puede hacer cada usuario según su rol
Para proteger datos sensibles y prevenir cambios no autorizados

CRITERIOS DE ACEPTACIÓN:
[ ] Admin: CRUD completo de todas las entidades
[ ] Docente: lectura de su disponibilidad y horarios
[ ] Coordinador: lectura de todos los datos
[ ] Middleware: valida permisos en cada endpoint
[ ] Logs: auditoría de accesos
```

---

### 📌 HU-12: Testing y Validación Integral

```
ID:             HU-12
Título:         Suite de pruebas automatizadas (25 tests)
Épica:          EPIC-03 (Testing & Validación)
Prioridad:      CRÍTICO (P0 - Cierre de proyecto)
Puntos:         8
Duración Est:   2 semanas (80 horas)
Dependencias:   HU-05, HU-06, HU-07, HU-08, HU-09

DESCRIPCIÓN:
Como equipo QA
Quiero validar que todos los requisitos se cumplen
Para garantizar la calidad del software antes de la entrega

CRITERIOS DE ACEPTACIÓN:
[ ] 25 test cases ejecutados (TC-001 a TC-025)
[ ] Tasa de paso: 100% (25/25)
[ ] Cobertura: ≥ 87%
[ ] Performance: < 5s por test en promedio
[ ] Todos los HC y SC validados

TEST CASES:
├─ Unitarios: variables.test.js, constraints.test.js, scoring.test.js
├─ Integración: solver.test.js, API endpoints
├─ Performance: benchmarks por tamaño de instancia
└─ Edge cases: instancias infeasibles, timeout handling

DOCUMENTACIÓN: TEST_REPORT.md completo
```

---

### 📌 HU-13: Mejoras y Refactoring

```
ID:             HU-13
Título:         Mejoras de rendimiento y código limpio
Épica:          EPIC-03
Prioridad:      MEDIUM (P2)
Puntos:         4
Duración Est:   1.5 semanas (60 horas)
Dependencias:   HU-12

DESCRIPCIÓN:
Como desarrollador
Quiero mejorar el código y performance
Para tener una base sólida para mantenimiento futuro

CRITERIOS DE ACEPTACIÓN:
[ ] Refactoring: reducir duplicación en solver.js
[ ] Performance: optimizar heurísticas MRV y AC-3
[ ] Linting: ESLint sin errores (8.0 puntos mínimo)
[ ] Documentación: comentarios en código crítico
[ ] Tech debt: < 5 issues open
```

---

### 📌 HU-14: Integración Final y Entrega

```
ID:             HU-14
Título:         Integración final y validación end-to-end
Épica:          EPIC-03
Prioridad:      CRÍTICO (P0 - Cierre)
Puntos:         3
Duración Est:   1 semana (40 horas)
Dependencias:   HU-12, HU-13

DESCRIPCIÓN:
Como stakeholder
Quiero ver el sistema completo funcionando
Para validar que todo está integrado y listo para usar

CRITERIOS DE ACEPTACIÓN:
[ ] Flujo completo: Entrada de datos → Solver → Visualización
[ ] Datos de prueba: 50 cursos × 14 docentes × 5 aulas
[ ] Performance: genera horario en < 5 segundos
[ ] Documentación: README.md completo en GitHub
[ ] Trazabilidad: Jira → GitHub → Tests validado
[ ] Presentación: demo al profesor

ENTREGABLES FINALES:
├─ GitHub repo con commits semánticos
├─ TEST_REPORT.md: 25 tests, 87% coverage
├─ README.md con instrucciones
├─ Documentación técnica completa
└─ Video demo del sistema funcionando (opcional)
```

---

## 3. MATRIZ DE TRAZABILIDAD: HU ↔ RESTRICCIONES CSP

```
TRAZABILIDAD COMPLETA: HISTORIAS → RESTRICCIONES
═════════════════════════════════════════════════════════════════

     HU   │ HC-1 │ HC-2 │ HC-3 │ HC-4 │ HC-5 │ HC-6 │ HC-7 │ SC-1:5
──────────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼────────
  HU-01   │      │      │      │      │  ●●  │      │      │
  HU-02   │      │      │      │  ●●  │      │  ●●  │  ●●  │
  HU-03   │      │      │  ●●  │  ●●  │      │  ●●  │      │
  HU-04   │      │      │      │      │  ●●  │      │      │
  HU-05   │ ●●●  │ ●●●  │ ●●●  │ ●●●  │ ●●●  │ ●●●  │ ●●●  │ ●●●●●
  HU-06   │ ●●   │ ●●   │ ●●   │ ●●   │ ●●   │ ●●   │ ●●   │
  HU-07   │      │      │      │      │      │      │      │ ●●●●●
  HU-08   │  ●   │  ●   │  ●   │      │      │      │      │
  HU-09   │      │      │      │      │      │      │      │
  HU-10   │      │      │      │      │      │      │      │
  HU-11   │      │      │      │      │      │      │      │
  HU-12   │ ●●●  │ ●●●  │ ●●●  │ ●●●  │ ●●●  │ ●●●  │ ●●●  │ ●●●●●
  HU-13   │  ●   │  ●   │  ●   │  ●   │  ●   │  ●   │  ●   │
  HU-14   │ ●●●  │ ●●●  │ ●●●  │ ●●●  │ ●●●  │ ●●●  │ ●●●  │ ●●●●●

LEYENDA:
●●●  = Implementación principal (core)
●●   = Implementación importante (middleware)
●    = Validación o visualización
(vacío) = No aplica

COBERTURA:
HC-1: HU-05, HU-06, HU-08, HU-12, HU-14 (100%)
HC-2: HU-05, HU-06, HU-08, HU-12, HU-14 (100%)
HC-3: HU-03, HU-05, HU-06, HU-08, HU-12, HU-14 (100%)
HC-4: HU-02, HU-03, HU-05, HU-06, HU-12, HU-14 (100%)
HC-5: HU-01, HU-04, HU-05, HU-06, HU-12, HU-14 (100%)
HC-6: HU-02, HU-03, HU-05, HU-06, HU-12, HU-14 (100%)
HC-7: HU-02, HU-05, HU-06, HU-12, HU-14 (100%)
SC-1-5: HU-05, HU-07, HU-12, HU-14 (100%)

CRITICIDAD POR RESTRICCIÓN:
HC-5, HC-7 > HC-1, HC-2, HC-3 > HC-4, HC-6
(en orden de dependencias)
```

---

## 4. PRIORIZACIÓN DEL BACKLOG

```
MATRIZ DE PRIORIZACIÓN: Valor × Riesgo × Complejidad
═════════════════════════════════════════════════════════════════

Scoring: (Valor × 35%) + ((10-Riesgo) × 35%) + ((10-Complejidad) × 20%)
         + (Impacto Rúbrica × 10%)

Rank │ HU   │ Título                   │ V × R × C  │ Score │ Priority
─────┼──────┼──────────────────────────┼────────────┼───────┼──────────
  1  │ HU-05│ Motor CSP                │ 10×1×10    │ 9.4   │ CRÍTICO
  2  │ HU-06│ Detectar Conflictos      │ 9×2×7      │ 8.75  │ P1
  3  │ HU-12│ Testing & Validación     │ 9×3×8      │ 8.55  │ P1
  4  │ HU-08│ Visualizar Horario       │ 9×4×6      │ 8.5   │ P1
  5  │ HU-07│ Optimizar SC             │ 8×4×7      │ 8.1   │ P1
  6  │ HU-09│ Exportar Horario         │ 7×5×6      │ 7.9   │ P1
  7  │ HU-02│ Gestión Cursos           │ 8×6×5      │ 7.6   │ P1
  8  │ HU-01│ Gestión Docentes         │ 8×6×5      │ 7.6   │ P1
  9  │ HU-03│ Gestión Aulas            │ 7×6×4      │ 7.1   │ P1
  10 │ HU-04│ Disponibilidad Docentes  │ 7×6×5      │ 7.0   │ P1
  11 │ HU-14│ Integración Final        │ 9×2×4      │ 7.85  │ P0
  12 │ HU-13│ Mejoras                  │ 6×7×5      │ 6.9   │ P2
  13 │ HU-10│ Autenticación            │ 7×5×5      │ 6.8   │ P2
  14 │ HU-11│ Control Acceso           │ 6×5×4      │ 6.3   │ P2

OBSERVACIONES:
├─ HU-05 es BLOQUEADOR de: HU-06, HU-07, HU-08, HU-09, HU-12, HU-14
├─ Flujo de dependencias: HU-01,02,03,04 → HU-05 → HU-06,07,08,09 → HU-12,14
├─ HU-10, HU-11 (Autenticación) pueden hacerse en paralelo (no críticas)
└─ HU-13 (Mejoras) es último pero no bloqueador
```

---

## 5. MAPEO ÉPICAS-SPRINTS

```
DISTRIBUCIÓN TEMPORAL DE HISTORIAS POR ÉPICA
═════════════════════════════════════════════════════════════════

┌─ SPRINT 1 (23-Mar → 05-Abr) [12 puntos]
│  └─ EPIC-01: HU-01 (5pts), HU-02 (5pts), HU-10 (2pts)
│     Objetivo: Modelos base de datos
│     Entregable: CRUD completo para docentes, cursos, usuarios
│
├─ SPRINT 2 (06-Abr → 19-Abr) [14 puntos]
│  └─ EPIC-01: HU-03 (3pts), HU-04 (5pts), HU-11 (3pts), prep HU-05 (3pts)
│     Objetivo: Completar gestión de datos y disponibilidad
│     Entregable: Aulas, disponibilidad docentes, auth
│
├─ SPRINT 3 (20-Abr → 03-May) [13 puntos] ⚠️ CRÍTICO
│  └─ EPIC-02: HU-05 (13pts)
│     Objetivo: Motor CSP completamente funcional
│     Entregable: Solver implementado, 25 tests diseñados
│     ⚠️ RUTA CRÍTICA: Retraso aquí = retraso en Sprints 4-7
│
├─ SPRINT 4 (04-May → 17-May) [3 puntos]
│  └─ EPIC-02: HU-06 (3pts)
│     Objetivo: Validación de conflictos
│     Entregable: Detector de conflictos integrado
│     Dependencia: HU-05 debe estar 100% listo
│
├─ SPRINT 5 (18-May → 31-May) [9 puntos]
│  └─ EPIC-02: HU-07 (4pts), HU-08 (5pts)
│     Objetivo: Optimización y visualización
│     Entregable: Interfaz gráfica de horarios
│
├─ SPRINT 6 (01-Jun → 14-Jun) [3 puntos]
│  └─ EPIC-02: HU-09 (3pts)
│     Objetivo: Exportación en múltiples formatos
│     Entregable: PDF, Excel, iCal funcionando
│
└─ SPRINT 7 (15-Jun → 05-Jul) [15 puntos]
   ├─ EPIC-03: HU-12 (8pts), HU-13 (4pts), HU-14 (3pts)
   │  Objetivo: Testing exhaustivo e integración final
   │  Entregable: 25 tests pasados, 87% coverage, GitHub setup
   └─ Milestone: ENTREGA FINAL

TOTAL: 69 puntos en 7 sprints (39 puntos de trabajo, 30 de integración/testing)
```

---
