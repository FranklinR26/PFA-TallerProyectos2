# Sprints Objetivos: CSP Schedule Solver

**Proyecto:** Taller de Proyectos 2 - Ingeniería de Sistemas  

---

## 📋 RESUMEN EJECUTIVO

```
ESTRUCTURA DE 7 SPRINTS BISEMANALES
═══════════════════════════════════════════════════════════

Total de Trabajo: 69 puntos de historia distribuidos en 3 épicas
├─ EPIC-01 (Gestión Datos): 6 HUs, 23 puntos → Sprints 1-2 (4 semanas)
├─ EPIC-02 (Motor CSP): 5 HUs, 31 puntos → Sprints 3-6 (8 semanas, CRÍTICO)
└─ EPIC-03 (Testing): 3 HUs, 15 puntos → Sprint 7 (2 semanas)

Duración Total: 14 semanas (23-Mar → 05-Jul)
Equipo: 1 desarrollador dedicado (600 horas)
Costo: $72,468 (base directo $36,302 + contingencia $16,408 + indirectos)
Ruta Crítica: HU-05 Motor CSP (bloqueador de 6 tareas downstream)
```

---

## 🎯 SPRINT 1: Fundación de Datos (23 Mar - 05 Abr)

### 1.1 Información Básica

| Aspecto | Detalle |
|---------|---------|
| **Duración** | 2 semanas (10 días hábiles) |
| **Período** | 23 de Marzo - 5 de Abril, 2026 |
| **Story Points** | 12 puntos |
| **Horas Estimadas** | 100 horas (10 hrs/día hábil) |
| **Tasa Burn Rate** | $545/día (100 hrs × $54.46/hr ÷ 10 días) |
| **Costo Esperado** | $5,446 |
| **Velocidad Objetivo** | 12 puntos completados (baseline inicial) |
| **Riesgo Overall** | ⚠️ BAJO - Foundation work, pocas dependencias |

### 1.2 Objetivo del Sprint

Establecer la **capa de persistencia y autenticación básica** del sistema. El sprint 1 sienta las bases de datos para todas las historias posteriores (HU-05 Motor CSP depende de HU-01, HU-02, HU-03, HU-04 completamente funcionales).

**Objetivo Formal:**

### 1.3 Historias de Usuario Asignadas

#### HU-01: Gestión de Docentes (5 pts, 40 hrs, HIGH)

```
┌─ DESCRIPCIÓN
│  As a administrador de horarios
│  I want to manage docente profiles (CRUD)
│  So that I can assign them to courses and timeslots
│
├─ CRITERIOS DE ACEPTACIÓN
│  ✓ Create: Formulario con nombre, dept, expertise, horario preferido
│  ✓ Read: Listar docentes con filtros por departamento
│  ✓ Update: Modificar disponibilidad sin afectar horarios asignados
│  ✓ Delete: Soft-delete (marcar inactivo, no eliminar físicamente)
│  ✓ Validation: Email único, min 3 chars nombre, dept válido
│  ✓ DB: tabla docentes con FK a departamentos
│
├─ RESTRICCIONES CSP APLICABLES
│  ├─ HC-2 (No overlapping assignments): Dato de entrada para validación
│  ├─ HC-3 (Capacity constraints): Docente puede enseñar max 5 cursos/semana
│  └─ HC-6 (Availability): Tabular disponibilidad horaria
│
├─ TESTS ASOCIADOS
│  ├─ TC-001: Create docente con datos válidos → Success
│  ├─ TC-002: Create docente sin email → Error de validación
│  ├─ TC-003: Update docente existente → Cambios reflejados
│  └─ TC-004: Soft-delete docente → Inactivo pero recoverable
│
├─ ENTREGABLES
│  ├─ Modelo Docente en MongoDB
│  ├─ API endpoints: POST /docentes, GET /docentes, PUT /docentes/:id, DELETE /docentes/:id
│  ├─ Validaciones en backend (Joi schema)
│  └─ Tests unitarios (Mocha + Chai)
│
└─ DEFINICIÓN DE DONE
   ✓ Código escrito y revisado
   ✓ Todos los tests pasan (TC-001 a TC-004)
   ✓ Commit semántico: feat(docentes): CRUD management
   ✓ PR merged a develop con 1+ revisor
   ✓ Documentación: endpoint specs en README
```

#### HU-02: Gestión de Cursos (5 pts, 40 hrs, HIGH)

```
┌─ DESCRIPCIÓN
│  As a administrador de horarios
│  I want to manage course catalog (CRUD)
│  So that I can assign courses to timeslots and docentes
│
├─ CRITERIOS DE ACEPTACIÓN
│  ✓ Create: Formulario con código, nombre, créditos, co-requisitos, tipo aula
│  ✓ Read: Listar cursos con filtros por código/tipo
│  ✓ Update: Modificar co-requisitos sin afectar asignaciones previas
│  ✓ Delete: Soft-delete (marcar archived)
│  ✓ Validation: Código único (regex: [A-Z]{2}\d{4}), créditos 1-4
│  ✓ DB: tabla cursos con FK a room_types
│
├─ RESTRICCIONES CSP APLICABLES
│  ├─ HC-3 (Capacity): Cursos tienen enrolled students → room capacity check
│  ├─ HC-5 (Room type): Curso de lab requiere sala tech, curso teórico aula normal
│  ├─ HC-7 (Co-requisites): Desplegar árbol de co-requisitos para validación
│  └─ SC-1 (Distribution): Datos de entrada para balanceo horario
│
├─ TESTS ASOCIADOS
│  ├─ TC-005: Create curso con código válido → Success
│  ├─ TC-006: Create curso sin tipo aula → Error
│  ├─ TC-007: Co-requisites circular → Detectar y rechazar
│  └─ TC-008: Listar cursos con filtro por código → Resultados correctos
│
├─ ENTREGABLES
│  ├─ Modelo Curso en MongoDB
│  ├─ API endpoints: POST, GET, PUT, DELETE para /cursos
│  ├─ Validación de co-requisites (graph traversal)
│  └─ Tests (TC-005 a TC-008)
│
└─ DEFINICIÓN DE DONE
   ✓ Código escrito
   ✓ Tests pasan
   ✓ Commit: feat(cursos): Course catalog CRUD
   ✓ PR merged
```

#### HU-10: Autenticación Básica (2 pts, 20 hrs, MEDIUM)

```
┌─ DESCRIPCIÓN
│  As a usuario del sistema
│  I want to login with email/password
│  So that my profile is protected and role-based
│
├─ CRITERIOS DE ACEPTACIÓN
│  ✓ Register: Email + contraseña (hash bcrypt, min 8 chars)
│  ✓ Login: JWT token válido por 24 horas
│  ✓ Logout: Token revocado
│  ✓ Validation: Email format check, password strength
│
├─ ENTREGABLES
│  ├─ Modelo Usuario con hashed password
│  ├─ Endpoints: POST /auth/register, POST /auth/login, POST /auth/logout
│  ├─ JWT middleware para rutas protegidas
│  └─ Tests (TC-009, TC-010)
│
└─ DEFINICIÓN DE DONE (igual patrón)
```

### 1.4 Capacidad y Velocidad

```
DISTRIBUCIÓN DE ESFUERZO EN SPRINT 1
═════════════════════════════════════════════════════════════

HU       Pts  Horas  Semana 1  Semana 2  Estado Esperado
─────────────────────────────────────────────────────────
HU-01     5    40     20 hrs    20 hrs    COMPLETADO
HU-02     5    40     25 hrs    15 hrs    COMPLETADO
HU-10     2    20      5 hrs    15 hrs    COMPLETADO
─────────────────────────────────────────────────────────
TOTAL    12   100     50 hrs    50 hrs    12 PUNTOS

VELOCIDAD: 12 puntos / 10 días = 1.2 pts/día (BASELINE)
```

### 1.5 Dependencias

```
DIAGRAMA DE DEPENDENCIAS SPRINT 1
═════════════════════════════════════════════════════════════

            ┌─────────────────┐
            │   Sprint 1      │
            │   (23-Mar)      │
            └────────┬────────┘
                     │
          ┌──────────┼──────────┐
          │          │          │
        [HU-01]   [HU-02]   [HU-10]
        Docentes  Cursos      Auth
          │          │          │
          └──────────┼──────────┘
                     ↓
          (Fin Sprint 1: 05-Abr)
             ↓ Prerequisito para
                 Sprint 2
```

**Notas:**
- HU-01, HU-02, HU-10 pueden ejecutarse en paralelo (sin dependencias internas)
- Todos deben estar COMPLETADOS antes de Sprint 2
- HU-05 (Motor CSP) requiere HU-01, HU-02, HU-03, HU-04 funcionales

### 1.6 Entregables Esperados

| Entregable | Descripción | Criterio de Aceptación |
|-----------|------------|------------------------|
| **API Docentes** | Endpoints CRUD funcionales | Postman tests pasan |
| **API Cursos** | Endpoints CRUD funcionales | Postman tests pasan |
| **API Auth** | Login/Logout con JWT | Token válido, expiration correcto |
| **DB Schema** | MongoDB collections con indices | Schema validado |
| **Test Suite** | TC-001 a TC-010 | 100% pass rate |
| **Code Quality** | Eslint 0 errors | SonarQube quality gate |
| **Documentation** | README.md actualizado | Endpoints documentados |

### 1.7 Métricas del Sprint

| Métrica | Target | Umbral Crítico | Observación |
|---------|--------|----------------|------------|
| **Velocity** | 12 pts | <8 pts (67% goal) | Baseline inicial |
| **Code Coverage** | 70%+ | <50% | Unit tests obligatorios |
| **Test Pass Rate** | 100% | <95% | Zero failing tests |
| **Burn Rate** | $545/día | >$600/día | Control presupuestario |
| **Código Review** | <2 hrs espera | >8 hrs | Calidad gate |

### 1.8 Riesgos y Mitigación

| ID | Riesgo | Probabilidad | Impacto | Exposición | Mitigación |
|----|----|--------------|--------|-----------|-----------|
| **R1.1** | Cambios en schema de MongoDB mid-sprint | 20% | ALTO | 2.0 | Congelar schema el 20-Mar, 48h antes |
| **R1.2** | JWT token expiration bug descubierto tarde | 15% | MEDIO | 1.5 | Test de JWT el primer día (23-Mar) |
| **R1.3** | Validación email débil, spam en tests | 10% | BAJO | 1.0 | Usar librería validated (RFC 5322) |

---

## 🎯 SPRINT 2: Completar Gestión de Datos (06 Abr - 19 Abr)

### 2.1 Información Básica

| Aspecto | Detalle |
|---------|---------|
| **Duración** | 2 semanas (10 días hábiles) |
| **Período** | 6 de Abril - 19 de Abril, 2026 |
| **Story Points** | 14 puntos |
| **Horas Estimadas** | 90 horas |
| **Tasa Burn Rate** | $490/día |
| **Costo Esperado** | $4,901 |
| **Riesgo Overall** | ⚠️ BAJO - Continuación Sprint 1, setup HU-05 |

### 2.2 Objetivo del Sprint

Completar la capa de gestión de datos (aulas, disponibilidad docente) y **iniciar preparación del Motor CSP**. Sprint 2 termina con todas las tablas base pobladas y lista la configuración preliminar del solver.

**Objetivo Formal:**
> "Implementar gestión de aulas y disponibilidad docente, y crear infraestructura de preparación para el Motor CSP (EPIC-02)."

### 2.3 Historias de Usuario Asignadas

#### HU-03: Gestión de Aulas (3 pts, 24 hrs, MEDIUM)
- Modelo: sala_id, nombre, capacidad, tipo (teoría/lab/lab-especial), equipamiento
- API CRUD: POST /salas, GET /salas, etc.
- Validación: capacidad 20-150, tipos del enum
- Tests: TC-011 a TC-014

#### HU-04: Disponibilidad Docentes (5 pts, 40 hrs, HIGH)
- Modelo: docente_id, día (lun-vie), hora_inicio, hora_fin, disponible (bool)
- API: POST /docentes/:id/disponibilidad, GET /docentes/:id/disponibilidad
- Validación: no overlapping timeslots, horario válido (7:00-20:00)
- Tests: TC-015 a TC-019
- **Crítico para HU-05:** El Motor CSP usará este dato para validar HC-6

#### HU-11: Control de Acceso / Roles (3 pts, 24 hrs, MEDIUM)
- Modelo: usuario_rol (admin, director, docente, guest)
- Middleware: @requireRole('admin') decorators
- API: GET /usuarios/:id/roles, POST /usuarios/:id/assign-role (admin-only)
- Tests: TC-020 a TC-022

#### Preparación HU-05 (3 pts, 12 hrs, MEDIUM - **NO es HU completa**)
- Setup: OR-Tools library en Node.js
- Config: Variables de solver (timeout 5s, num_workers 4)
- Docs: Arquitectura del Motor CSP (diagrama)
- Tests: TC-023 (sanity check OR-Tools inicialización)

### 2.4 Capacidad y Velocidad

```
DISTRIBUCIÓN SPRINT 2
═════════════════════════════════════════════════════════════

HU       Pts  Horas  Semana 1  Semana 2  Dep. de
─────────────────────────────────────────────────────────
HU-03     3    24     12 hrs    12 hrs   (ninguna)
HU-04     5    40     25 hrs    15 hrs   HU-01 ✓
HU-11     3    24     15 hrs     9 hrs   HU-10 ✓
Prep05    3    12      8 hrs     4 hrs   HU-01,02,03,04
─────────────────────────────────────────────────────────
TOTAL    14    90     60 hrs    30 hrs   Todas dependen

VELOCIDAD: 14 puntos / 10 días = 1.4 pts/día (↑ 17% vs S1)
```

### 2.5 Ruta de Crítica vs Dependencias

```
ANÁLISIS: Sprint 2 tiene dependencia hacia Sprint 1
═════════════════════════════════════════════════════════════

Sprint 1 Status                 Sprint 2 Impacto
─────────────────────────────────────────────
HU-01 COMPLETADO ✓              HU-04 puede iniciar (20% progreso)
HU-02 COMPLETADO ✓              Prep05 puede iniciar
HU-10 COMPLETADO ✓              HU-11 puede iniciar

RIESGO: Si Sprint 1 se retrasa >3 días:
  ├─ HU-04 start retrasado
  ├─ Prep05 start retrasado
  └─ HU-05 inicio impactado (Sprint 3 = RUTA CRÍTICA)
```

### 2.6 Entregables Esperados

| Entregable | Descripción | Criterio |
|-----------|------------|----------|
| **API Aulas** | CRUD completo para salas | All tests pass |
| **Disponibilidad UI** | Interfaz para gestionar horarios docentes | Formato JSON valida contra schema |
| **Roles & Permissions** | Sistema de control de acceso funcional | JWT claims contienen roles |
| **OR-Tools Integration** | Librería cargada, configurada, tested | Solver instancia creada exitosamente |
| **Test Suite** | TC-011 a TC-023 | 100% pass |
| **Architecture Doc** | Diagrama Motor CSP (entrada para HU-05) | Incluido en README |

### 2.7 Métricas del Sprint

| Métrica | Target | Umbral |
|---------|--------|--------|
| **Velocity** | 14 pts | >10 pts |
| **Code Coverage** | 75%+ | >60% |
| **Test Pass Rate** | 100% | >95% |
| **Burn Rate** | $490/día | <$550/día |

---

## 🔴 SPRINT 3: Motor CSP (CRÍTICO) (20 Abr - 03 May)

### 3.1 Información Básica

| Aspecto | Detalle |
|---------|---------|
| **Duración** | 2 semanas (10 días hábiles) |
| **Período** | 20 de Abril - 3 de Mayo, 2026 |
| **Story Points** | 13 puntos |
| **Horas Estimadas** | 150 horas ⚠️ (HIGH effort) |
| **Tasa Burn Rate** | $1,131/día ⚠️ (+67% vs S1) |
| **Costo Esperado** | $11,307 (31% del costo directo) |
| **Multiplicador CSP** | 1.385x (complejidad NP-Complete) |
| **Riesgo Overall** | 🔴 CRÍTICO - Bloqueador de Sprints 4-7 |

### 3.2 Objetivo del Sprint

**IMPLEMENTACIÓN COMPLETA DEL MOTOR CSP**. Este es el sprint más crítico del proyecto. HU-05 es la funcionalidad core que toda otra tarea espera.

**Objetivo Formal:**
> "Implementar solver CSP funcional que satisfaga todas las 7 restricciones hard (HC-1 a HC-7) y genere horarios válidos en <5 segundos. Incluir 25 test cases de validación de restricciones."

### 3.3 Historia de Usuario Asignada

#### **⭐ HU-05: Motor CSP (13 pts, 150 hrs, CRÍTICO) ⭐**

```
┌─ DESCRIPCIÓN
│  As a administrador de horarios
│  I want to automatically generate valid schedules
│  So that conflicts are eliminated and constraints are respected
│
├─ CRITERIOS DE ACEPTACIÓN (EXHAUSTIVOS)
│
│  RESTRICCIONES HARD (Obligatorias - Schedule es inválido sin estas)
│  ├─ HC-1: Unique Assignment
│  │   "Cada curso debe asignarse exactamente a 1 docente + 1 aula + 1 timeslot"
│  │   Test: TC-001 ✓ Schedule sin duplicados
│  │
│  ├─ HC-2: No Docent Overlap
│  │   "Un docente NO puede enseñar 2 cursos simultáneamente"
│  │   Test: TC-002 ✓ Validar timeslots no solapados por docente
│  │
│  ├─ HC-3: Room Capacity
│  │   "Enrolled students <= Room capacity"
│  │   Test: TC-003 ✓ Check enrolled vs capacidad sala
│  │
│  ├─ HC-4: No Room Overlap
│  │   "Una sala no puede tener 2 cursos en mismo timeslot"
│  │   Test: TC-004 ✓ Timeslots exclusivos por sala
│  │
│  ├─ HC-5: Room Type Matching
│  │   "Course tipo 'lab' → room tipo 'lab', curso 'teoría' → 'regular'"
│  │   Test: TC-005 ✓ Course type == Room type
│  │
│  ├─ HC-6: Docent Availability
│  │   "Docente solo asignable en horarios disponibles (HU-04)"
│  │   Test: TC-006 ✓ Timeslot dentro de disponibilidad docente
│  │
│  ├─ HC-7: Co-requisites
│  │   "Si Curso A tiene co-requisite B, entonces no pueden estar simultáneamente"
│  │   Test: TC-007 ✓ Co-requisites en horarios distintos
│  │
│  RESTRICCIONES SOFT (Optimización - Schedule es válido pero subóptimo sin estas)
│  ├─ SC-1: Course Distribution
│  │   "Cursos distribuidos entre lunes-viernes sin concentración"
│  │   Test: TC-008 ✓ Max 3 cursos por día
│  │
│  ├─ SC-2: Minimize Gaps
│  │   "Minimizar huecos >1 hora en horario docente"
│  │   Test: TC-009 ✓ Gap count <= 2 por docente
│  │
│  ├─ SC-3: Docent Preferences
│  │   "Respetar preferencias de horario (morning vs afternoon)"
│  │   Test: TC-010 ✓ Docentes matutinos reciben cursos 7:00-12:00
│  │
│  ├─ SC-4: Morning Priority
│  │   "Cursos teóricos preferiblemente 7:00-12:00"
│  │   Test: TC-011 ✓ Count(teoría 7-12) >= 70%
│  │
│  └─ SC-5: Temporal Centrality
│      "Cursos de carrera distribuidos en semana (no todos lun-mar)"
│      Test: TC-012 ✓ Variance de distribución <= 0.3
│
│  PERFORMANCE
│  ├─ Solver debe terminar en <5 segundos (para 50 cursos)
│  │   Test: TC-024 ✓ Timeout en 5s
│  │
│  ├─ Memory footprint <500MB
│  │   Test: TC-025 ✓ Memory profiler
│  │
│  └─ Validar en 100 configuraciones aleatorias
│      Test: TC-026 (fuzzing)
│
├─ ARQUITECTURA TÉCNICA
│
│  INPUT (desde DB):
│  ├─ Docentes: 50 (con disponibilidad horaria)
│  ├─ Cursos: 50 (con tipo, créditos, co-requisites, estudiantes)
│  ├─ Aulas: 12 (con tipo, capacidad)
│  └─ Timeslots: 35 (lun-vie, 7:00-20:00, duración 1.5 hrs)
│
│  VARIABLES BOOLEANAS (Search Space):
│  ├─ 8,750 variables totales
│  │   = 50 cursos × 12 docentes × 12 aulas × 35 timeslots (initial)
│  │   = Filtered to feasible 8,750 after constraint propagation
│  │
│  ├─ Variable: assign[c,d,r,t] = 1 if (curso c, docente d, aula r, timeslot t)
│  │                              = 0 otherwise
│  │
│  └─ Dominio: {0, 1} para cada variable
│
│  SOLVER CONFIGURATION:
│  ├─ Librería: OR-Tools (Google, C++ backed)
│  ├─ Search Strategy: FirstSolutionStrategy.PATH_CHEAPEST_ARC
│  ├─ Local Search: GuidedLocalSearch
│  ├─ Heurística: MRV (Minimum Remaining Values) + AC-3 (Arc Consistency)
│  ├─ Timeout: 5 segundos
│  ├─ Num Workers: 4 (parallel search)
│  └─ Objective: Minimize hard constraint violations, then optimize soft
│
│  OUTPUT (a DB):
│  ├─ schedule[]: Array de asignaciones válidas
│  │   {curso_id, docente_id, aula_id, timeslot_id, valid: true, soft_score: X}
│  ├─ Violation Report: Si no encuentra solución (HC violations)
│  └─ Optimization Score: Soft constraint satisfaction % (0-100%)
│
├─ TESTS ASOCIADOS (25 test cases)
│
│  Hard Constraints:
│  ├─ TC-001 a TC-007: Validación individual cada HC (7 tests)
│
│  Soft Constraints:
│  ├─ TC-008 a TC-012: Validación individual cada SC (5 tests)
│
│  Integration:
│  ├─ TC-013 a TC-020: Escenarios realistas (8 tests)
│  │   TC-013: Small (5 cursos) → should solve <100ms
│  │   TC-014: Medium (25 cursos) → should solve <2s
│  │   TC-015: Large (50 cursos) → should solve <5s
│  │   TC-016: Infeasible (conflictive constraints) → reject gracefully
│  │   TC-017: Multi-class course (4 secciones) → handled
│  │   TC-018: Co-requisites chain (3+ linked) → validated
│  │   TC-019: Room type diversity (mix lab/theory) → correct assignment
│  │   TC-020: Docent preferences (morning/afternoon) → respected
│
│  Performance:
│  ├─ TC-021: Memory test <500MB ✓
│  ├─ TC-022: Timeout validation <5s ✓
│  ├─ TC-023: Parallelization (num_workers=4) effective ✓
│  ├─ TC-024: Reproducibility (seed=42, same output) ✓
│  └─ TC-025: Randomized fuzzing (1000 runs) ✓
│
├─ ENTREGABLES
│  ├─ Solver class (CSPScheduler) con métodos:
│  │   - __init__(docentes, cursos, aulas, timeslots, preferences)
│  │   - solve() → schedule[], violations[]
│  │   - validate(schedule) → bool
│  │   - get_soft_score(schedule) → float (0-1)
│  │
│  ├─ OR-Tools integration layer
│  ├─ Constraint definitions (HC-1 to HC-7, SC-1 to SC-5)
│  ├─ Test suite (25 tests, all passing)
│  ├─ Performance benchmarks (timing, memory)
│  ├─ Documentation: Algorithm explanation, complexity analysis
│  └─ Commits (feat(csp): Motor CSP implementation) con git history
│
└─ DEFINICIÓN DE DONE
   ✓ Código escrito, revisado
   ✓ 25 tests pasan (TC-001 a TC-025)
   ✓ Solver <5s en caso 50-curso
   ✓ Memory <500MB
   ✓ Commits semánticos: feat(csp), test(csp)
   ✓ PR merged a develop
   ✓ Architecture doc completado
```

### 3.4 Capacidad y Velocidad

```
DISTRIBUCIÓN SPRINT 3 (CRÍTICO)
═════════════════════════════════════════════════════════════

HU       Pts  Horas  Semana 1  Semana 2  Notas
─────────────────────────────────────────────────────────
HU-05    13   150     75 hrs    75 hrs    BLOQUEADOR
─────────────────────────────────────────────────────────
TOTAL    13   150     75 hrs    75 hrs    13 PUNTOS

VELOCIDAD: 13 puntos / 10 días = 1.3 pts/día (STEADY)

BURN RATE ANALYSIS:
├─ Día 1-2 (23-24 Abr): Setup OR-Tools, define variables → 10 hrs
├─ Día 3-6 (25-28 Abr): Implement HC-1 to HC-4 → 30 hrs
├─ Día 7-8 (29-30 Abr): Implement HC-5 to HC-7, SC-1 to SC-3 → 25 hrs
├─ Día 9-10 (01-03 May): Testing, perf tuning, SC-4 to SC-5 → 30 hrs
└─ CONTINGENCY (not logged): 55 hrs de buffer para debugging/refactor
```

### 3.5 Riesgos Críticos

| ID | Riesgo | Prob | Impacto | Mitigación |
|----|--------|------|---------|-----------|
| **R3.1** | OR-Tools no converge en <5s para 50-curso case | 35% | 🔴 CRÍTICO | Profiling diario (25-Abr), si >6s → reduce scope a 30 cursos |
| **R3.2** | Constraint propagation bug (HC violation en solution) | 20% | 🔴 CRÍTICO | Fuzz test cada 48h (25-27-29 Abr), todos HC validados TC-001-007 |
| **R3.3** | Soft constraint optimization no funciona (todos soft = 0%) | 15% | 🟡 ALTO | Priorizar HC > SC, si tiempo no alcanza, entregar HC-only solución válida |
| **R3.4** | Memory leak en OR-Tools iteraciones (500MB→2GB) | 10% | 🟡 ALTO | Memory profiling (28 Abr), reset solver cada 100 iteraciones |
| **R3.5** | Co-requisites validation falla (R-02 from GESTION_RIESGOS) | 25% | 🟡 ALTO | Implementar co-requisite graph desde día 1 (TC-007 by 25-Abr) |

### 3.6 Status y Control

```
DAILY STANDUP AGENDA (Días 23-May a 03-May)
═════════════════════════════════════════════════════════════

Día 1 (20 Abr): ✅ Setup
├─ OR-Tools instalada y configurada
├─ Variable definitions mapeadas
└─ Test harness listo (TC placeholder)

Día 2-3 (21-22 Abr): HC-1, HC-2, HC-3
├─ Unique assignment constraint
├─ Docent overlap check
└─ Room capacity validation

Día 4-5 (23-24 Abr): HC-4, HC-5, HC-6
├─ Room overlap prevention
├─ Room type matching
└─ Availability check

Día 6-7 (25-26 Abr): HC-7 + SC-1, SC-2
├─ Co-requisites complex
├─ Distribution optimization
└─ Gap minimization

Día 8-9 (27-28 Abr): SC-3, SC-4, SC-5 + Testing
├─ Preferences implementation
├─ Morning priority
├─ Temporal centrality
└─ All 25 tests running

Día 10 (29-30 May): Performance + Buffer
├─ Profiling & tuning
├─ Fuzzing (100 random configs)
└─ Documentation
```

### 3.7 Métricas Críticas del Sprint

| Métrica | Target | ⚠️ Alert | 🔴 Critical |
|---------|--------|---------|-----------|
| **Velocity** | 13 pts | <10 pts | 0 pts (HU-05 not started/complete) |
| **Test Pass Rate** | 100% (25/25) | <80% (20/25) | <50% (12/25) |
| **Solver Execution Time** | <5s (50-curso) | >5s | >10s |
| **Memory** | <500MB | >700MB | >1GB |
| **Code Coverage** | 85%+ | <70% | <50% |

**CONTROL PUNTO:** Si al 27-Abr (fin día 7) no hay HC-1 a HC-5 con tests pasando → ESCALATE IMMEDIATELY

---

## 🎯 SPRINT 4: Detectar Conflictos (04 May - 17 May)

### 4.1 Información Básica

| Aspecto | Detalle |
|---------|---------|
| **Duración** | 2 semanas |
| **Período** | 4 de Mayo - 17 de Mayo, 2026 |
| **Story Points** | 3 puntos |
| **Horas Estimadas** | 50 horas |
| **Costo Esperado** | $2,995 |
| **Riesgo Overall** | ⚠️ DEPENDE de S3 (si HU-05 se retrasa, este se bloquea) |

### 4.2 Objetivo del Sprint

Implementar detección interactiva de conflictos basada en el solver. El usuario puede ver qué restricciones se violarían si forzara cierta asignación.

**HU-06: Detectar Conflictos (3 pts, 50 hrs)**
- Endpoint: POST /conflicts/detect con schedule parcial
- Output: Lista de violaciones por HC
- UI: Visualización de conflictos (qué restricción se viola y por qué)
- Tests: TC-026 a TC-029

**DEPENDENCIA CRÍTICA:** Requiere HU-05 100% completado. Si S3 se retrasa 3+ días, este sprint se desplaza.

---

## 🎯 SPRINT 5: Optimización & Visualización (18 May - 31 May)

### 5.1 Información Básica

| Aspecto | Detalle |
|---------|---------|
| **Duración** | 2 semanas |
| **Período** | 18 de Mayo - 31 de Mayo, 2026 |
| **Story Points** | 9 puntos (HU-07: 4 pts, HU-08: 5 pts) |
| **Horas Estimadas** | 80 horas |
| **Costo Esperado** | $4,574 |
| **Multiplicador** | 1.05x (optimización integración) |

### 5.2 Objetivo del Sprint

Optimización de soft constraints y construcción de UI para visualizar horarios de forma intuitiva.

**HU-07: Optimizar Soft Constraints (4 pts, 32 hrs)**
- Algoritmo post-solving: ajustar SC-1 a SC-5
- Objetivo: mejorar soft_score de 60% → 85%+
- Tests: TC-030 a TC-032

**HU-08: Visualización de Horarios (5 pts, 48 hrs)** 
- UI: Calendario interactivo (HTML5 Canvas / React)
- Vistas: Por docente, por aula, por carrera
- Export: PDF preview antes de exportar
- Tests: TC-033 a TC-036

---

## 🎯 SPRINT 6: Exportación (01 Jun - 14 Jun)

### 6.1 Información Básica

| Aspecto | Detalle |
|---------|---------|
| **Duración** | 2 semanas |
| **Período** | 1 de Junio - 14 de Junio, 2026 |
| **Story Points** | 3 puntos |
| **Horas Estimadas** | 40 horas |
| **Costo Esperado** | $2,178 |

### 6.2 Objetivo del Sprint

**HU-09: Exportar Horarios (3 pts, 40 hrs)**
- Formatos: PDF, Excel (.xlsx), iCalendar (.ics)
- Librería: pdfkit, exceljs, ical.js
- Validación: Schedule export sin corrupción
- Tests: TC-037 a TC-040

---

## 🟢 SPRINT 7: Testing & Integración Final (15 Jun - 05 Jul)

### 7.1 Información Básica

| Aspecto | Detalle |
|---------|---------|
| **Duración** | 3 semanas (15 días hábiles, incluye 30-Jun feriado) |
| **Período** | 15 de Junio - 5 de Julio, 2026 |
| **Story Points** | 15 puntos |
| **Horas Estimadas** | 90 horas |
| **Costo Esperado** | $4,901 |
| **Riesgo Overall** | 🟡 CRÍTICO si Sprints 3-6 tienen retrasos acumulados |

### 7.2 Objetivo del Sprint

Testing exhaustivo, validación de integración, setup GitHub, y entrega final con documentación.

**HU-12: Testing & Validación (8 pts, 50 hrs)**
- Ejecutar 25 test cases (TC-001 a TC-025 de HU-05)
- Validación de restricciones en schedule final
- Load testing: 50, 100, 200 cursos
- Tests: TC-041 a TC-048

**HU-13: Mejoras & Optimización (4 pts, 24 hrs)**
- Code quality: Eslint, SonarQube
- Performance tuning basado en profiling
- Documentation: CONTRIBUTING.md, ARCHITECTURE.md

**HU-14: Integración Final & Entrega (3 pts, 16 hrs)**
- GitHub setup: Git Flow branching, main/develop/feature branches
- Commits semánticos: feat(x), fix(y), test(z), docs(a)
- Create release: v1.0.0 en GitHub
- Create TRAZABILIDAD_INTEGRAL.md
- Final documentation

### 7.3 Entregables Finales

```
ENTREGA FINAL DEL PROYECTO
═════════════════════════════════════════════════════════════

Código:
├─ GitHub repo: git@github.com:FranklinR26/PFA-TallerProyectos2.git
├─ Main branch: Código producción (v1.0.0)
├─ Develop branch: Integración
├─ Feature branches: Seguimiento de HUs
└─ Commits: 50+ semánticos con trazabilidad

Documentación:
├─ README.md (instalación, uso, arquitectura)
├─ ESPECIFICACION_FORMAL.md (problem definition)
├─ CONSTITUTION.md (architectural principles)
├─ BACKLOG_FORMAL.md (14 HUs formalizadas)
├─ SPRINTS_OBJETIVOS.md (este documento)
├─ RUTA_CRITICA_PROYECTO.md (critical path analysis)
├─ GESTION_RIESGOS_OPORTUNIDADES.md (risk matrix)
├─ JUSTIFICACION_ANALISIS_CSP_COSTO.md (budget analysis)
├─ PRESUPUESTO_POR_SPRINT.md (financial breakdown)
├─ METRICAS_AGILES_PROYECTO.xlsx (agile metrics)
├─ TEST_REPORT.md (test results, 25 TCs)
└─ TRAZABILIDAD_INTEGRAL.md (requirement tracing)

Testing:
├─ 25 test cases (TC-001 a TC-025) ✓ 100% pass
├─ Code coverage: 87%+
├─ Integration tests: 15+
└─ Performance benchmarks: documented

Calidad:
├─ Eslint: 0 errors
├─ SonarQube: A+ quality gate
├─ Security: OWASP Top 10 validated
└─ Performance: <5s solver, <500MB memory
```

---

## 📊 VISTA GENERAL DE SPRINTS

```
TIMELINE VISUAL DE 7 SPRINTS
═════════════════════════════════════════════════════════════

          Mar              Abr              May              Jun       Jul
          |                |                |                |         |
          S1               S2               S3               S4-6      S7
    [===Data===]    [======Data Mgmt======]  [====MOTOR CSP====]  [Opt/Vis]  [Test]
    Pts: 12        Pts: 14                  Pts: 13 (CRÍTICO)     Pts: 12   Pts: 15
    Hrs: 100       Hrs: 90                  Hrs: 150 ⚠️ PICO     Hrs: 120  Hrs: 90
    Cost:$5.4K     Cost:$4.9K               Cost:$11.3K (31%)   Cost:$6.7K Cost:$4.9K
                                            ↓ BLOQUEADOR
                                            ├─ HU-06 espera
                                            ├─ HU-07 espera
                                            ├─ HU-08 espera
                                            ├─ HU-09 espera
                                            └─ HU-12,14 espera
          ────────────────────────────────────────────────────────────────────
          23 Mar          6 Abr             20 Abr            04 May  15 Jun 05 Jul
          START           ↓                 CRITICAL BEGINS    ↓       ↓      END
                          S1 Complete       HU-05 Start        ↓       S7 Ends
                          S2 Begins         Ruta Crítica      S5      
                                            Inicialización    Begins   
                                            
TOTAL DURACION: 14 semanas
TOTAL COSTO: $36,302 directo + $16,408 contingencia = $72,468
TOTAL PUNTOS: 69 puntos
TOTAL HORAS: 600 horas
```

---

## 🎯 ANÁLISIS DE ESTABILIDAD DEL EQUIPO

### 7.1 Velocidad Proyectada vs Real

```
CURVA DE VELOCIDAD (7 SPRINTS)
═════════════════════════════════════════════════════════════

Puntos/Sprint │
         15   │                                         ╱─── S7: 15 pts
              │                                   ╱───╱
         12   │ ╱─── S1: 12 pts              ╱─╱
              │╱  ╲                      ╱─╱
          9   │    ╲               ╱───╱    ╲─── S5: 9 pts
              │     ╲          ╱─╱        ╲
          6   │      ╲    ╱─╱              ╲─ S4: 3 pts
              │       ╲╱                    ╲
          3   │  S2:14 S3:13               ╲── S6: 3 pts
              │ (Prep)
          0   └───────────────────────────────────────────
                 S1    S2    S3    S4    S5    S6    S7

            Velocidad: 12→14→13→3→9→3→15 (VARIABLE)
            Promedios: S1-2: 13 pts, S3-6: 7 pts (CSP overhead)
                       S7: 15 pts (testing eficiente)

OBSERVACIÓN CRÍTICA:
├─ S3 (HU-05): 13 pts en 150 horas (0.087 pts/hora)
├─ S1-2: 12-14 pts en 190 horas (0.070 pts/hora)
├─ S4-6: 9 pts en 130 horas (0.070 pts/hora)
└─ S7: 15 pts en 90 horas (0.167 pts/hora) - Testing es más eficiente
```

### 7.2 Estabilidad del Equipo (Team Velocity Variance)

| Sprint | Pts | Hrs | Estabilidad | Notas |
|--------|-----|-----|-------------|-------|
| S1 | 12 | 100 | ✅ NORMAL | Baseline establecido |
| S2 | 14 | 90 | ✅ NORMAL | +17% velocity, buen momentum |
| **S3** | **13** | **150** | 🔴 **INESTABLE** | +150 hrs (overhead CSP) para 13 pts = baja eficiencia |
| S4 | 3 | 50 | ⚠️ BAJO | Transición, espera S3 |
| S5 | 9 | 80 | ✅ NORMAL | Recuperación |
| S6 | 3 | 40 | ⚠️ BAJO | Exportación simple |
| S7 | 15 | 90 | ✅ ALTO | Testing es 2x más eficiente |

**Conclusión:** La estabilidad se ve afectada por HU-05. Compensar con buffer de contingencia en S3.

---

## ⚠️ MITIGACIÓN DE RETRASOS

### Escenario A: S3 se retrasa 3 días (HU-05 no termina 03-May)

```
IMPACTO EN CASCADA
═════════════════════════════════════════════════════════════

Escenario: HU-05 termina 06-May (en lugar de 03-May)
           3 días de retraso

Impacto Directo:
├─ S4 (HU-06) debe esperar → comienza 07-May (plan: 04-May)
├─ S5 (HU-07,08) comienza 21-May (plan: 18-May)
└─ Final entrega: 08-Jul (plan: 05-Jul) = 3 DÍAS RETRASO FINAL

Impacto Presupuestario:
├─ 3 días = 24 horas adicionales
├─ 24 hrs × $54.46 × 1.385x (CSP) = +$1,810
├─ Total presupuesto: $72,468 + $1,810 = $74,278
└─ Contingencia consumida: 11% ($1,810 / $16,408)

MITIGACIÓN:
├─ Reducir scope de SC (soft constraints) si tiempo no alcanza
├─ Mantener HC (hard constraints) intacto
├─ Paralelizar S4 testing mientras S3 finaliza
└─ Budget: AÚN DENTRO DE CONTINGENCIA (30%)
```

### Escenario B: S3 se retrasa 7 días (HU-05 no termina 10-May)

```
ALERTA 🔴 CRÍTICA
═════════════════════════════════════════════════════════════

Escenario: HU-05 termina 10-May (7 días de retraso)

Impacto:
├─ Final entrega: 12-Jul (7 DÍAS RETRASO)
├─ Presupuesto: +$5,600 (+7.7%, 56 horas extra)
├─ Contingencia consumida: 34%
└─ ESTADO: ⚠️ CRÍTICO pero recoverable

ACCIÓN INMEDIATA:
├─ Activar contingency hours (máximo 30% disponible)
├─ Reducir HU-13 (Mejoras) scope si es necesario
├─ Avalizar con profesor/cliente
└─ Si va a más de 10 días: REPLANNING REQUERIDO
```

---

## 📋 CHECKLIST DE COMPLETITUD POR SPRINT

```
DEFINICIÓN DE DONE GLOBAL
═════════════════════════════════════════════════════════════

Para cada Sprint completado, validar:

CÓDIGO:
├─ [ ] Todas las HUs del sprint implementadas (100% code)
├─ [ ] Tests escritos y pasando (100% pass rate)
├─ [ ] Code review completado (1+ revisor)
├─ [ ] Commits semánticos presentes (feat, fix, test, docs)
├─ [ ] Merged a develop branch
└─ [ ] Zero Eslint/SonarQube errors

DOCUMENTACIÓN:
├─ [ ] Endpoints documentados (Swagger/OpenAPI)
├─ [ ] README.md actualizado
├─ [ ] Comments en código complejo
└─ [ ] CHANGELOG.md con cambios

TESTING:
├─ [ ] Unit tests: 80%+ coverage
├─ [ ] Integration tests: key workflows
├─ [ ] Manual testing: QA checkoff
└─ [ ] Performance benchmarks (if applicable)

MÉTRICAS:
├─ [ ] Velocity registrada
├─ [ ] Burn rate controlado
├─ [ ] Riesgos evaluados
└─ [ ] Lecciones aprendidas documentadas

ENTREGABLES:
├─ [ ] Feature branch merged
├─ [ ] Release candidate en develop
└─ [ ] Artifacts (PDF exports, backups) guardados
```

---

## 🔗 REFERENCIAS CRUZADAS

```
VÍNCULOS A OTROS DOCUMENTOS
═════════════════════════════════════════════════════════════

Este documento se relaciona con:
├─ BACKLOG_FORMAL.md → Define las HUs asignadas a cada sprint
├─ RUTA_CRITICA_PROYECTO.md → Análisis de dependencias y camino crítico
├─ METRICAS_AGILES_PROYECTO.xlsx → Tracking en vivo de velocidad/burndown
├─ GESTION_RIESGOS_OPORTUNIDADES.md → Matriz de riesgos por sprint
├─ PRESUPUESTO_POR_SPRINT.md → Desglose financiero
└─ JUSTIFICACION_ANALISIS_CSP_COSTO.md → Base teórica de costos
```

---

## 📌 CONCLUSIÓN

Este documento formaliza la estructura de 7 sprints de 2 semanas cada uno, totalizando 14 semanas de desarrollo (23 Mar - 05 Jul 2026). 

**Puntos Clave:**
- ✅ Sprint 1-2: Infraestructura de datos (23 puntos, 190 horas)
- 🔴 **Sprint 3: CRÍTICO** - Motor CSP bloqueador (13 puntos, 150 horas, 1.385x multiplicador)
- ✅ Sprint 4-6: Features dependientes (15 puntos, 130 horas)
- ✅ Sprint 7: Testing & entrega (15 puntos, 90 horas)

**Total:** 69 puntos, 600 horas, $72,468 justificados

**Próximo Paso:** Implementar Sprint 1 (23-Mar inicio) con HU-01, HU-02, HU-10

---

**Documento Finalizado:** 7 de Mayo, 2026  
**Versión:** 1.0 (COMPLETO)  
**Estado:** ✅ LISTO PARA EJECUCIÓN
