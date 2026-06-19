# Registro de Incidentes / Problemas (Issue Log)

**Proyecto:** CSP Schedule Solver
**Fase:** Control y Cierre
**Fecha:** 2026-06-18
**Versión:** 1.0

> Documenta incidencias reales surgidas durante la ejecución, con responsable, estado, prioridad y acciones correctivas. Las incidencias se reconstruyen a partir del historial de Git (93 commits, 8 PRs) y de las evidencias de testing.

---

## 1. Registro de Incidentes

| ID | Fecha | Descripción del incidente | Origen / Evidencia | Prioridad | Responsable | Acción correctiva | Estado |
|---|---|---|---|---|---|---|---|
| **INC-01** | 2026-06-05 | Conflictos de merge en `package.json` al integrar ramas | Commit `9467320` (merge main→Gabo) | Media | Scrum Master | Resolución manual de conflictos y sincronización de dependencias | ✅ Resuelto |
| **INC-02** | 2026-06-08 | Divergencia entre `origin/main` y `main` local | Commit `864beef` (merge + resolución) | Media | Equipo | Merge y resincronización de `main` | ✅ Resuelto |
| **INC-03** | 2026-06-05 | Tests E2E Playwright fallan al no haber dev server activo | `EVIDENCIAS_TESTING.md` §7 | Media | QA / Frontend | Documentar prerrequisito (`npm run dev`) y planificar arranque automático en CI | 🟡 Mitigado |
| **INC-04** | 2026-06-05 | Falla de instalación de Cypress (`ECONNRESET`) | `EVIDENCIAS_TESTING.md` §7 | Media | QA / DevOps | Reintento en red estable / registry alternativo; pendiente en CI | 🟡 Abierto (ver IMP-01) |
| **INC-05** | 2026-06-04 | Código con *issues* detectados y residuos en repositorio | Commits `f87c49e` ("Delete issues in code"), `5b90bb1` | Baja | Fullstack Dev | Limpieza de código e issues; eliminación de archivos obsoletos | ✅ Resuelto |
| **INC-06** | 2026-05-08 | Horario generado se mostraba vacío en ciertas vistas | Commit `4a6b70d` (fix) | Alta | Fullstack Dev | Corrección de lógica de render + vistas por docente/estudiante | ✅ Resuelto (ver DEF-01) |
| **INC-07** | 2026-06-12 | Necesidad de evidencias de calidad/seguridad inconsistentes | Commits `67e1c1a`, `6770358` | Baja | QA | Actualización de evidencias de tests y login | ✅ Resuelto |

**Prioridad:** Alta / Media / Baja · **Estado:** Abierto / Mitigado / Resuelto

---

## 2. Resumen de Control

| Estado | Cantidad |
|---|---:|
| Resuelto | 5 |
| Mitigado | 1 |
| Abierto | 1 |
| **Total** | **7** |

- **Incidente crítico de producto:** INC-06 (horario vacío) — resuelto y verificado.
- **Incidente abierto:** INC-04 (Cypress) — escalado como impedimento de infraestructura (IMP-01), sin impacto en la entrega del producto (las suites Vitest/Playwright cubren el flujo).

---

## 3. Referencias

- Impedimentos: [05_REGISTRO_IMPEDIMENTOS.md](05_REGISTRO_IMPEDIMENTOS.md)
- Defectos: [06_REGISTRO_DEFECTOS.md](06_REGISTRO_DEFECTOS.md)
- Evidencias de testing: [../seguimiento_control/EVIDENCIAS_TESTING.md](../seguimiento_control/EVIDENCIAS_TESTING.md)
- Tablero JIRA: ver `../../Otros/JIRA.md`
