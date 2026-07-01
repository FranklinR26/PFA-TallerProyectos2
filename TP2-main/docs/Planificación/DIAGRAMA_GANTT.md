# Diagrama de Gantt — Cronograma del Proyecto

**Proyecto:** Sistema de Generación Óptima de Horarios Académicos (CSP Schedule Solver)
**Duración total:** 14 semanas (23 Mar — 05 Jul 2026)
**Sprints:** 7 sprints bisemanales

---

## 1. Cronograma por Sprint

```
                        MAR          ABR          MAY          JUN          JUL
                   23  30  06  13  20  27  04  11  18  25  01  08  15  22  29  05
Sprint 1           ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
Sprint 2           ░░░░░░░░████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
Sprint 3           ░░░░░░░░░░░░░░░░████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
Sprint 4           ░░░░░░░░░░░░░░░░░░░░░░░░████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░
Sprint 5           ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████░░░░░░░░░░░░░░░░░░░░
Sprint 6           ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████░░░░░░░░░░░░
Sprint 7           ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████░░░░
Cierre             ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████
```

## 2. Detalle por tarea (Gantt textual)

```
TAREA                          INICIO      FIN         DURACIÓN  SPRINT  DEPENDENCIA
─────────────────────────────────────────────────────────────────────────────────────
EPIC-01: Gestión de Datos
  HU-01 Gestión Docentes       23-Mar      05-Abr      2 sem     S1      —
  HU-02 Gestión Aulas          23-Mar      05-Abr      2 sem     S1      —
  HU-10 Autenticación          23-Mar      05-Abr      2 sem     S1      —
  HU-03 Gestión Cursos         06-Abr      19-Abr      2 sem     S2      HU-01
  HU-04 Gestión Secciones      06-Abr      19-Abr      2 sem     S2      HU-03
  HU-11 Gestión Estudiantes    06-Abr      19-Abr      2 sem     S2      HU-10

EPIC-02: Motor CSP
  HU-05 Motor CSP Core ⚠️      20-Abr      17-May      4 sem     S3-S4   HU-01..04
  HU-08 Períodos Académicos    18-May      31-May      2 sem     S5      HU-05
  HU-06 Visualización          18-May      31-May      2 sem     S5      HU-05
  HU-09 Dashboard Métricas     01-Jun      14-Jun      2 sem     S6      HU-05
  HU-07 Portal Personalizado   01-Jun      14-Jun      2 sem     S6      HU-05,HU-10

EPIC-03: Testing y Calidad
  HU-12 Testing Automatizado   15-Jun      28-Jun      2 sem     S7      HU-05..09
  HU-13 Aseg. Calidad          15-Jun      28-Jun      2 sem     S7      HU-12
  HU-14 Sostenibilidad         15-Jun      28-Jun      2 sem     S7      —

CIERRE
  Documentación de cierre       29-Jun      05-Jul      1 sem     —       Todas
  Informe final                 29-Jun      05-Jul      1 sem     —       Todas
```

## 3. Ruta Crítica

```
HU-01 ──→ HU-03 ──→ HU-05 (Motor CSP) ──→ HU-06 ──→ HU-12 ──→ HU-13 ──→ Cierre
 2sem      2sem        4sem ⚠️ CRÍTICO       2sem      2sem      2sem      1sem
                                                                     TOTAL: 15 sem
```

**Holgura total:** 1 semana (buffer entre Sprint 7 y fecha de entrega)

**Tareas con holgura:**
- HU-02 (Aulas): 2 semanas de holgura — puede retrasarse sin afectar HU-05
- HU-11 (Estudiantes): 4 semanas de holgura
- HU-14 (Sostenibilidad): No está en ruta crítica, puede ejecutarse en paralelo

**Tarea sin holgura (crítica):**
- HU-05 Motor CSP: 0 días de holgura. Cualquier retraso aquí retrasa todo el proyecto.

## 4. Hitos principales

| Hito | Fecha | Entregable |
|------|-------|-----------|
| M1: Datos base completos | 19-Abr | CRUD funcional para todas las entidades |
| M2: Motor CSP operativo | 17-May | Solver genera horarios sin conflictos |
| M3: UI completa | 14-Jun | Visualización + portal + dashboard |
| M4: Calidad verificada | 28-Jun | Tests + SonarQube + OWASP + WCAG |
| M5: Cierre del proyecto | 05-Jul | Informe final + documentación completa |
