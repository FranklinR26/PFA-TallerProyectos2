# Changelog

Todos los cambios relevantes de este proyecto se documentan en este archivo.
El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [1.0.0] — 2026-06-18

### Agregado
- Motor CSP con backtracking + AC-3 + heurística MRV para generación de horarios
- Ejecución del solver en worker thread (no bloquea el event loop)
- API REST completa: autenticación, datos académicos, horarios, portal, métricas, períodos
- Frontend React 19 + Vite con SPA y rutas protegidas por rol
- Autenticación JWT en cookie httpOnly (Secure, SameSite=Strict)
- Roles: admin, coordinador, docente, estudiante
- CRUD completo: docentes, aulas, cursos, secciones, estudiantes
- Portal personalizado por rol (docente ve disponibilidad, estudiante ve matrícula)
- Dashboard de métricas del solver (conflictos, score, distribución)
- Módulo de sostenibilidad: monitoreo CO2 por request (CO2.js), GreenFrame, compresión gzip
- Dashboard ambiental con huella de carbono acumulada
- Suite de 114 tests backend (Vitest) con 36.2% de cobertura
- Suite de tests frontend (Vitest + RTL + MSW)
- Tests E2E con Cypress y Playwright
- Docker: Dockerfiles para backend y frontend + docker-compose con MongoDB
- CI: GitHub Actions para tests automatizados en push/PR
- Auditoría OWASP Top 10 2025 — 7 hallazgos mitigados
- Auditoría WCAG 2.1 AA — correcciones de accesibilidad implementadas
- Análisis SonarQube con métricas documentadas
- Instrumento SUS de usabilidad
- Documentación PMBOK: inicio, planificación, ejecución, seguimiento, cierre
- 10 documentos de cierre del proyecto

### Seguridad
- H-01: Error genérico al cliente en registro (sin fuga de detalles Mongo)
- H-02: CORS con lista blanca (no refleja cualquier Origin)
- H-03: Validación anti-inyección NoSQL en login/register
- H-04: Política de contraseñas (min 8 chars, letras + números)
- H-05: `.env` excluido de Git
- H-06: JWT en cookie httpOnly (inmune a XSS)
- H-07: Alertas de seguridad ante rate-limit alcanzado
