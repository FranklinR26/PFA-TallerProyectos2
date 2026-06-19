# Registro de Impedimentos (Impediment Log)

**Proyecto:** CSP Schedule Solver
**Fase:** Control y Cierre
**Fecha:** 2026-06-18
**Versión:** 1.0

> Documenta los obstáculos que frenaron el progreso del equipo, su impacto en el avance y las acciones de mitigación. Gestionados principalmente por el Scrum Master durante los Daily Scrum.

---

## 1. Registro de Impedimentos

| ID | Fecha | Impedimento | Impacto en el avance | Sprint afectado | Acción de mitigación | Estado |
|---|---|---|---|---|---|---|
| **IMP-01** | 2026-06-05 | Imposibilidad de instalar Cypress por error de red (`ECONNRESET`) | Bloqueó la generación de reportes/videos de pruebas de aceptación | S7 (Testing) | Reintento en red estable; uso de Playwright como E2E alternativo; instalación diferida a CI | 🟡 En gestión |
| **IMP-02** | 2026-06-05 | Tests E2E dependen de levantar manualmente el dev server | Ejecución E2E no reproducible en un solo paso | S7 | Documentar prerrequisito y planificar `webServer` en config / CI | 🟡 Mitigado |
| **IMP-03** | 2026-04→06 | Conflictos frecuentes de integración entre ramas (`main`/`Gabo`/`feature/*`) | Tiempo extra en resolución de merges | Varios | Estrategia de PRs pequeños y merges más frecuentes; protección de `main` | ✅ Resuelto |
| **IMP-04** | 2026-04-20 | Alto esfuerzo/complejidad del Motor CSP (HU-05) como cuello de botella | 150 h concentradas; riesgo de retraso en cascada | S3 (crítico) | Buffer de contingencia, *profiling* diario, priorizar HC sobre SC | ✅ Resuelto |
| **IMP-05** | 2026-06 | Heterogeneidad de entornos del equipo (instalación de dependencias frontend) | Demoras al reproducir suites de prueba | S7 | Uso de `npm install --legacy-peer-deps` documentado; estandarizar Node ≥18 | ✅ Resuelto |

**Estado:** En gestión / Mitigado / Resuelto

---

## 2. Análisis

- El impedimento de **mayor riesgo** fue IMP-04 (Motor CSP): se gestionó activamente con la planificación de ruta crítica y no derivó en retraso de entrega.
- Los impedimentos **abiertos/mitigados (IMP-01, IMP-02)** son de **infraestructura de pruebas**, no de producto, y tienen acción clara: integración en CI.
- La gestión activa del equipo (Daily Scrum, protección de `main`) permitió resolver la mayoría de los obstáculos dentro del mismo sprint.

---

## 3. Referencias

- Incidentes relacionados: [04_REGISTRO_INCIDENTES.md](04_REGISTRO_INCIDENTES.md) (INC-04)
- Riesgos: [03_REGISTRO_RIESGOS_CIERRE.md](03_REGISTRO_RIESGOS_CIERRE.md)
- Lecciones aprendidas: [02_INFORME_LECCIONES_APRENDIDAS.md](02_INFORME_LECCIONES_APRENDIDAS.md) (LA-02, LA-03)
