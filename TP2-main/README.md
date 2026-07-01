# HorarioConti — Sistema de Generación Óptima de Horarios Académicos

[![Tests](https://github.com/FranklinR26/PFA-TallerProyectos2/actions/workflows/tests.yml/badge.svg)](https://github.com/FranklinR26/PFA-TallerProyectos2/actions/workflows/tests.yml)
[![CI](https://github.com/FranklinR26/PFA-TallerProyectos2/actions/workflows/ci.yml/badge.svg)](https://github.com/FranklinR26/PFA-TallerProyectos2/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-green)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-yellow)](LICENSE)

Sistema web para la generación automática de horarios académicos universitarios usando **Constraint Satisfaction Problem (CSP)** con backtracking, AC-3 y heurística MRV. Desarrollado como proyecto del curso *Taller de Proyectos 2* — Universidad Continental.

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + Vite + Zustand |
| Backend | Node.js 20 + Express 5 |
| Base de datos | MongoDB 7 (Mongoose 9) |
| Autenticación | JWT en cookie httpOnly |
| Testing | Vitest + RTL + MSW + Cypress + Playwright |
| Calidad | SonarQube + OWASP + WCAG + SUS |
| Infraestructura | Docker + nginx + GitHub Actions |

## Inicio rápido

### Con Docker (recomendado)

```bash
cd TP2-main
docker compose up --build
```

La aplicación estará disponible en `http://localhost` (frontend) y `http://localhost:5000` (API).

### Sin Docker

```bash
# Backend
cd TP2-main/Backend
cp .env.example .env
npm install
npm run dev

# Frontend (otra terminal)
cd TP2-main/Frontend
npm install
npm run dev
```

## Tests

```bash
# Backend (114 tests)
cd TP2-main/Backend
npm test                # ejecutar tests
npm run test:coverage   # con reporte de cobertura

# Frontend
cd TP2-main/Frontend
npm test                # unitarios + integración
npm run test:coverage   # con cobertura
npm run cypress:run     # E2E con Cypress
```

## Estructura del proyecto

```
TP2-main/
├── Backend/            # API REST (Express + Mongoose)
│   ├── controllers/    # Lógica de negocio
│   ├── csp/            # Motor CSP (solver, constraints, scoring)
│   ├── middleware/      # Auth, cache, rate-limit, CO2
│   ├── models/         # Esquemas Mongoose
│   ├── routes/         # Definición de endpoints
│   └── __tests__/      # Tests unitarios backend
├── Frontend/           # SPA React
│   ├── src/
│   │   ├── pages/      # Páginas (Login, Portal, Schedule, etc.)
│   │   ├── components/ # Componentes reutilizables
│   │   ├── api/        # Clientes HTTP
│   │   ├── store/      # Estado global (Zustand)
│   │   ├── mocks/      # MSW handlers para tests
│   │   └── __tests__/  # Tests unitarios frontend
│   ├── cypress/        # Tests E2E Cypress
│   └── e2e/            # Tests E2E Playwright
├── docs/               # Documentación PMBOK
│   ├── Inicio/         # Fase de inicio
│   ├── Planificación/  # Fase de planificación
│   ├── ejecucion/      # Fase de ejecución
│   ├── seguimiento_control/  # Calidad, testing, sostenibilidad
│   └── cierre/         # Fase de cierre (10 documentos)
└── docker-compose.yml  # Orquestación full-stack
```

## Documentación

| Documento | Ruta |
|-----------|------|
| Arquitectura (ARC42) | `docs/ejecucion/arquitectura.md` |
| API REST | `docs/API.md` |
| Especificación CSP | `docs/Planificación/ESPECIFICACION_FORMAL.md` |
| Test Report | `docs/Planificación/TEST_REPORT.md` |
| OWASP Top 10 | `docs/seguimiento_control/Calidad/OWASP_TOP10_2025_MATRIZ.md` |
| WCAG Checklist | `docs/seguimiento_control/Calidad/WCAG_CHECKLIST.md` |
| SUS Usabilidad | `docs/seguimiento_control/Calidad/SUS_INSTRUMENTO.md` |
| Informe Final | `docs/cierre/01_INFORME_FINAL_PROYECTO.md` |

## Contribuir

Ver [CONTRIBUCIONES.md](CONTRIBUCIONES.md).

## Seguridad

Ver [SEGURIDAD.md](SEGURIDAD.md).
