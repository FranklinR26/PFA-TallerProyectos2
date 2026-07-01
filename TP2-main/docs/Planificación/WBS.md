# WBS — Work Breakdown Structure

**Proyecto:** Sistema de Generación Óptima de Horarios Académicos (CSP Schedule Solver)
**Fecha:** 2026-03-23
**Método de descomposición:** Por entregables → épicas → historias de usuario → tareas

---

## 1. Diagrama WBS (texto)

```
1.0 HorarioConti — CSP Schedule Solver
│
├── 1.1 GESTIÓN DEL PROYECTO
│   ├── 1.1.1 Inicio
│   │   ├── Documento de inicio del problema
│   │   ├── Visión del proyecto
│   │   ├── Registro de supuestos y restricciones
│   │   ├── Lista preliminar de stakeholders
│   │   └── Enfoque del proyecto
│   ├── 1.1.2 Planificación
│   │   ├── Acta de constitución (Project Charter)
│   │   ├── Backlog formal (14 HUs, 4 épicas)
│   │   ├── Sprints y objetivos (7 sprints bisemanales)
│   │   ├── Presupuesto ($72,468)
│   │   ├── Gestión de riesgos (9 riesgos)
│   │   ├── Plan de comunicaciones
│   │   ├── Especificación formal CSP
│   │   └── Justificación de costos
│   ├── 1.1.3 Seguimiento y control
│   │   ├── Actas de reunión (7 sprint reviews)
│   │   ├── Análisis de valor ganado (EVM)
│   │   ├── Control de riesgos
│   │   └── Reportes de estado
│   └── 1.1.4 Cierre
│       ├── Informe final del proyecto
│       ├── Lecciones aprendidas
│       ├── Registro de riesgos de cierre
│       ├── Registro de incidentes
│       ├── Registro de impedimentos
│       ├── Registro de defectos
│       ├── Revisión del acta de constitución
│       ├── Declaración de trabajo (SOW)
│       └── Documentación de capacitación
│
├── 1.2 EPIC-01: GESTIÓN DE DATOS (23 pts, Sprints 1-2)
│   ├── 1.2.1 HU-01: Gestión de Docentes (5 pts)
│   │   ├── Modelo Mongoose Teacher
│   │   ├── CRUD API endpoints (/api/data/teachers)
│   │   ├── Validaciones de entrada
│   │   └── Tests unitarios
│   ├── 1.2.2 HU-02: Gestión de Aulas (3 pts)
│   │   ├── Modelo Mongoose Classroom
│   │   ├── CRUD API endpoints (/api/data/classrooms)
│   │   ├── Tipos: teoría, laboratorio, taller
│   │   └── Tests unitarios
│   ├── 1.2.3 HU-03: Gestión de Cursos (5 pts)
│   │   ├── Modelo Mongoose Course
│   │   ├── CRUD API endpoints (/api/data/courses)
│   │   ├── Relación con docentes y secciones
│   │   └── Tests unitarios
│   ├── 1.2.4 HU-04: Gestión de Secciones (3 pts)
│   │   ├── Modelo Mongoose Section
│   │   ├── CRUD API endpoints (/api/data/sections)
│   │   └── Tests unitarios
│   ├── 1.2.5 HU-10: Autenticación y Roles (5 pts)
│   │   ├── Modelo User con roles (admin, coordinador, docente, estudiante)
│   │   ├── Login con JWT (cookie httpOnly)
│   │   ├── Middleware verifyToken + checkRole
│   │   ├── Registro restringido a admin
│   │   └── Tests de autenticación (12 tests)
│   └── 1.2.6 HU-11: Gestión de Estudiantes (2 pts)
│       ├── Modelo Mongoose Student
│       ├── CRUD + matrícula masiva
│       └── Tests unitarios
│
├── 1.3 EPIC-02: MOTOR CSP (31 pts, Sprints 3-6)
│   ├── 1.3.1 HU-05: Motor CSP Core (13 pts) ⚠️ RUTA CRÍTICA
│   │   ├── Definición de variables CSP (variables.js)
│   │   ├── Restricciones duras HC-1 a HC-7 (constraints.js)
│   │   ├── Restricciones blandas SC-1 a SC-5
│   │   ├── Algoritmo backtracking + AC-3 + MRV (solver.js)
│   │   ├── Worker thread para ejecución aislada (solverWorker.js)
│   │   ├── Sistema de scoring (scoring.js)
│   │   ├── Tests de restricciones (25 test cases)
│   │   └── Métricas del solver (metrics.js)
│   ├── 1.3.2 HU-06: Visualización de Horarios (5 pts)
│   │   ├── Componente SchedulePage (grilla semanal)
│   │   ├── Drag & Drop con @dnd-kit
│   │   ├── Exportación a PDF (jsPDF)
│   │   └── Vista por docente/aula/sección
│   ├── 1.3.3 HU-07: Portal Personalizado (5 pts)
│   │   ├── Vista docente (disponibilidad, cursos asignados)
│   │   ├── Vista estudiante (matrícula, horario personal)
│   │   ├── API portal con datos contextuales
│   │   └── Tests de integración
│   ├── 1.3.4 HU-08: Gestión de Períodos (3 pts)
│   │   ├── CRUD de períodos académicos
│   │   ├── Activación/desactivación
│   │   └── Tests de controlador (10 tests)
│   └── 1.3.5 HU-09: Dashboard de Métricas (5 pts)
│       ├── Métricas del solver (conflictos, score, distribución)
│       ├── Visualización en DashboardPage
│       └── API de métricas
│
├── 1.4 EPIC-03: TESTING Y CALIDAD (15 pts, Sprint 7)
│   ├── 1.4.1 HU-12: Testing Automatizado
│   │   ├── 114 tests backend (Vitest)
│   │   ├── Tests frontend (Vitest + RTL + MSW)
│   │   ├── E2E: Cypress (login flow)
│   │   ├── E2E: Playwright (redirect flow)
│   │   ├── CI: GitHub Actions
│   │   └── Cobertura: reportes HTML + lcov
│   ├── 1.4.2 HU-13: Aseguramiento de Calidad
│   │   ├── SonarQube (análisis estático)
│   │   ├── OWASP Top 10 2025 (auditoría de seguridad)
│   │   ├── WCAG 2.1 AA (accesibilidad)
│   │   ├── SUS (usabilidad)
│   │   └── npm audit (dependencias)
│   └── 1.4.3 HU-14: Sostenibilidad
│       ├── Monitoreo CO2 por request (CO2.js)
│       ├── GreenFrame analysis
│       ├── Compresión gzip y optimización de imágenes
│       └── Dashboard ambiental
│
└── 1.5 INFRAESTRUCTURA
    ├── 1.5.1 Docker
    │   ├── Dockerfile Backend (node:20-alpine + healthcheck)
    │   ├── Dockerfile Frontend (multi-stage: build + nginx)
    │   ├── docker-compose.yml (3 servicios + MongoDB)
    │   └── docker-compose.sonar.yml (SonarQube)
    └── 1.5.2 Repositorio
        ├── GitHub: estructura de carpetas docs/ por fase PMBOK
        ├── .github/workflows/ (CI/CD)
        ├── .editorconfig, SECURITY.md, CONTRIBUTING.md
        └── Templates de PR e issues
```

---

## 2. Diccionario WBS

| Código | Paquete de trabajo | Responsable | Entregable | Criterio de aceptación |
|--------|-------------------|-------------|-----------|----------------------|
| 1.1 | Gestión del Proyecto | Dev Lead | Documentación PMBOK completa | Todas las fases documentadas |
| 1.2 | Gestión de Datos | Equipo | API REST funcional con CRUD | Endpoints probados, datos persistidos |
| 1.3 | Motor CSP | Equipo | Solver que genera horarios válidos | 0 violaciones de restricciones duras |
| 1.4 | Testing y Calidad | Equipo | Suite de tests + reportes de calidad | ≥87% cobertura backend, auditorías completas |
| 1.5 | Infraestructura | Equipo | Docker + CI/CD funcional | `docker compose up` levanta todo el stack |

---

## 3. Ruta Crítica

```
HU-01 → HU-02 → HU-03 → HU-04 → HU-05 (Motor CSP) → HU-06 → HU-07 → HU-12 → HU-13
         (Sprint 1)        (Sprint 2)     (Sprints 3-6)      (Sprint 6)    (Sprint 7)
```

**Tarea crítica:** HU-05 Motor CSP (13 pts, 100 hrs estimadas). Bloqueador de 6 tareas downstream. Cualquier retraso en HU-05 retrasa directamente la fecha de entrega del proyecto.

**Holgura:** Las HUs de infraestructura (Docker, CI) y documentación tienen holgura y pueden ejecutarse en paralelo sin afectar la ruta crítica.
