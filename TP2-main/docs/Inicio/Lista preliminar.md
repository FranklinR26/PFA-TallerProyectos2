# **SPRINT 0: INICIO DEL PROYECTO**
## **Sistema Inteligente de Generación Óptima de Horarios Académicos**
## **Lista Preliminar de Requerimientos**
### 1\.1 Requerimientos Funcionales
- RF01: El sistema debe permitir el registro de estudiantes.
- RF02: El sistema debe permitir el registro de docentes.
- RF03: El sistema debe permitir el registro de cursos.
- RF04: El sistema debe permitir el registro de aulas.
- RF05: El sistema debe gestionar la disponibilidad de docentes.
- RF06: El sistema debe validar la matrícula de estudiantes (créditos y prerrequisitos).
- RF07: El sistema debe generar automáticamente horarios académicos.
- RF08: El sistema debe garantizar la ausencia de conflictos de horario.
- RF09: El sistema debe permitir la visualización de horarios generados.
- RF10: El sistema puede permitir la edición manual de horarios generados (funcionalidad futura).
### 1\.2 Requerimientos No Funcionales (ISO/IEC 25010)

| ID | Categoría | Requisito | Métrica | Implementación |
|----|-----------|-----------|---------|---------------|
| RNF-01 | Rendimiento | El sistema debe generar horarios en tiempo ≤ 2 segundos | `SCHEDULE_GENERATION_MS = 2000` | `config/performance.js` + worker thread |
| RNF-02 | Rendimiento | Las respuestas de la API deben tomar ≤ 500 ms | `API_RESPONSE_MS = 500` | `middleware/performanceMonitor.js` |
| RNF-03 | Escalabilidad | El sistema debe soportar al menos 50 usuarios concurrentes | 50 req simultáneas sin degradación | Worker thread no bloqueante + rate limiting |
| RNF-04 | Seguridad | Autenticación obligatoria en todos los endpoints protegidos | 0 endpoints sin token expuestos | JWT + `middleware/verifyToken.js` |
| RNF-05 | Seguridad | Limitar intentos de login a 20 por cada 15 minutos | Max 20 req/15min por IP | `express-rate-limit` en `/api/auth` |
| RNF-06 | Eficiencia | Las métricas del dashboard deben cachearse | TTL = 60 segundos | `middleware/cache.js` |
| RNF-07 | Usabilidad | El sistema debe ser aprendido por un usuario nuevo en < 30 minutos | Prueba con usuarios reales | UI con roles diferenciados y flujo guiado |
| RNF-08 | Disponibilidad | El sistema debe estar disponible desde cualquier navegador moderno | 99% uptime en entorno de desarrollo | MongoDB Atlas + Node.js en proceso continuo |
| RNF-09 | Mantenibilidad | El código del algoritmo debe tener cobertura de tests ≥ 70% | Cobertura medida con Vitest coverage v8 | `__tests__/` con 59 casos automatizados |
| RNF-10 | Seguridad | Cabeceras HTTP seguras habilitadas | Headers: CSP, HSTS, X-Frame-Options | `helmet.js` en index.js |

**Enlace a repositorio:** https://github.com/GaboLand/PFA-TallerProyectos2

