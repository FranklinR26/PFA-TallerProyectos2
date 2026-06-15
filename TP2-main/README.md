# HorarioConti — Sistema de Generación Óptima de Horarios Académicos

Aplicación **Web Full Stack (MERN)** para la generación automática de horarios académicos mediante un motor de **Programación con Restricciones (CSP)**, con módulo de sostenibilidad (huella de CO₂) y panel de métricas.

Este repositorio es el entregable del **Proyecto de Fin de Asignatura (PFA)** de *Taller de Proyectos 2 – Ingeniería de Sistemas e Informática*, sometido a un proceso integral de aseguramiento de calidad: **SonarQube · OWASP Top 10 2025 · WCAG 2.1 AA · SUS · Testing automatizado**.

> **Repositorio:** https://github.com/FranklinR26/PFA-TallerProyectos2

---

## 1. Tabla de contenidos

- [2. Stack tecnológico](#2-stack-tecnológico)
- [3. Arquitectura](#3-arquitectura)
- [4. Prerrequisitos](#4-prerrequisitos)
- [5. Instalación (reproducible)](#5-instalación-reproducible)
- [6. Ejecución](#6-ejecución)
- [7. Pruebas y cobertura](#7-pruebas-y-cobertura)
- [8. Análisis de calidad (SonarQube / SonarCloud)](#8-análisis-de-calidad-sonarqube--sonarcloud)
- [9. Estrategia de ramas y commits](#9-estrategia-de-ramas-y-commits)
- [10. Documentación técnica (índice de entregables)](#10-documentación-técnica-índice-de-entregables)
- [11. Resumen de calidad alcanzada](#11-resumen-de-calidad-alcanzada)

---

## 2. Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 19 · Vite · Zustand · React Router · @dnd-kit |
| **Backend** | Node.js · Express 5 · Mongoose 9 |
| **Base de datos** | MongoDB (local o Atlas) |
| **Autenticación** | JWT por roles (RBAC) · bcrypt (cost 12) · Helmet · rate-limiting |
| **Motor de horarios** | Solver CSP propio (`Backend/csp/`) |
| **Testing** | Vitest · Testing Library · MSW · Playwright · Cypress |
| **Calidad** | SonarQube Community / SonarCloud · Lighthouse · axe DevTools |

---

## 3. Arquitectura

SPA (React) + API REST (Express) + motor CSP + MongoDB. Detalle completo en
[`docs/arquitectura.md`](docs/arquitectura.md) (modelo ARC42) y [`docs/modelado.md`](docs/modelado.md).

```
Usuario ──▶ Frontend (React/Vite, :5173) ──▶ API REST (Express, :5000) ──▶ Motor CSP
                                                      │
                                                      ▼
                                                  MongoDB
```

**Rutas API principales:** `/api/auth`, `/api/data`, `/api/schedule`, `/api/portal`,
`/api/metrics`, `/api/periods`, `/api/environmental-impact`, `/api/sustainability`.

---

## 4. Prerrequisitos

- **Node.js 20+** y npm
- **MongoDB** (local en `mongodb://localhost:27017` o un clúster de Atlas)
- **Docker** (opcional, solo para levantar SonarQube local)

---

## 5. Instalación (reproducible)

```bash
# 1. Clonar
git clone https://github.com/FranklinR26/PFA-TallerProyectos2.git
cd PFA-TallerProyectos2/TP2-main

# 2. Backend
cd Backend
npm ci
cp .env.example .env        # editar MONGO_URI y JWT_SECRET
npm run seed                # (opcional) carga datos de ejemplo

# 3. Frontend
cd ../Frontend
npm ci
```

### Variables de entorno (`Backend/.env`)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del backend | `5000` |
| `NODE_ENV` | Entorno | `development` |
| `MONGO_URI` | Cadena de conexión MongoDB | `mongodb://localhost:27017/horarioconti` |
| `JWT_SECRET` | Secreto de firma JWT (cadena larga y aleatoria) | `***` |
| `JWT_EXPIRES_IN` | Expiración del token | `7d` |
| `CLIENT_URL` | Origen permitido por CORS (solo producción) | `https://...` |

---

## 6. Ejecución

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd TP2-main/Backend && npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd TP2-main/Frontend && npm run dev
```

---

## 7. Pruebas y cobertura

La consigna exige pruebas **unitarias, de integración, E2E y de cobertura**. Todas están implementadas:

```bash
# Backend — unitarias + integración (Vitest)
cd TP2-main/Backend
npm test                 # 92 tests
npm run test:coverage    # genera coverage/lcov.info

# Frontend — unitarias + integración (Vitest + MSW)
cd TP2-main/Frontend
npm test
npm run test:coverage    # genera coverage/lcov.info

# Frontend — E2E
npm run cypress:run                       # Cypress (login.cy.js)
npx playwright test                       # Playwright (e2e/app.spec.ts)
```

| Tipo | Herramienta | Ubicación |
|------|-------------|-----------|
| Unitarias backend | Vitest | `Backend/__tests__/` (8 suites) |
| Unitarias frontend | Vitest + Testing Library | `Frontend/src/__tests__/` |
| Integración | Vitest + MSW | `Frontend/src/__tests__/portal.integration.test.jsx` |
| E2E | Playwright + Cypress | `Frontend/e2e/`, `Frontend/cypress/e2e/` |
| Cobertura | `@vitest/coverage-v8` (LCOV) | `npm run test:coverage` |

---

## 8. Análisis de calidad (SonarQube / SonarCloud)

Configuración en [`sonar-project.properties`](sonar-project.properties). Existen **tres formas** de ejecutar el análisis:

### A) Local (Docker)
```bash
cd TP2-main/Backend  && npm run test:coverage
cd TP2-main/Frontend && npm run test:coverage
docker compose -f docker-compose.sonar.yml up -d        # http://localhost:9000
docker run --rm --network host -v "$PWD:/usr/src" sonarsource/sonar-scanner-cli \
  "-Dsonar.host.url=http://localhost:9000" "-Dsonar.token=<TOKEN>"
```

### B) CI con SonarQube self-hosted
Job `sonarqube` en [`.github/workflows/tests.yml`](.github/workflows/tests.yml).
Habilitar con la variable `SONAR_ENABLED=true` y los secrets `SONAR_HOST_URL` y `SONAR_TOKEN`.

### C) CI con SonarCloud (análisis automático integrado a GitHub)
Workflow [`.github/workflows/sonarcloud.yml`](.github/workflows/sonarcloud.yml).
Habilitar con `SONARCLOUD_ENABLED=true`, `SONAR_ORGANIZATION` y el secret `SONAR_TOKEN`.

---

## 9. Estrategia de ramas y commits

- **`main`** — rama estable e integrada. Protegida; se actualiza vía Pull Request.
- **`claude/*` / `feature/*`** — ramas de trabajo por funcionalidad o tarea de calidad.
- **Convención de commits:** mensajes descriptivos en español con prefijo de intención
  (`docs:`, `fix:`, `test:`, `Integrar…`, `Corregir…`), describiendo el *qué* y el *porqué*.
- **Flujo:** rama de trabajo → PR hacia `main` → revisión → merge.

---

## 10. Documentación técnica (índice de entregables)

| Documento | Contenido |
|-----------|-----------|
| [`docs/Calidad/INFORME_TECNICO_INTEGRAL.md`](docs/Calidad/INFORME_TECNICO_INTEGRAL.md) | **Informe integral**: SonarQube, OWASP, WCAG, SUS, testing |
| [`docs/Calidad/OWASP_TOP10_2025_MATRIZ.md`](docs/Calidad/OWASP_TOP10_2025_MATRIZ.md) | Matriz de vulnerabilidades OWASP + mitigaciones + riesgo residual |
| [`docs/Calidad/WCAG_CHECKLIST.md`](docs/Calidad/WCAG_CHECKLIST.md) | Checklist WCAG 2.1 AA con correcciones |
| [`docs/Calidad/SUS_INSTRUMENTO.md`](docs/Calidad/SUS_INSTRUMENTO.md) | Instrumento SUS, datos, cálculo e interpretación |
| [`docs/Calidad/evidencias/`](docs/Calidad/evidencias/) | Capturas, reportes Lighthouse, métricas SonarQube |
| [`docs/Calidad/PRESENTACION_TECNICA.md`](docs/Calidad/PRESENTACION_TECNICA.md) | Guion de la defensa técnica + preguntas anticipadas + demo |
| [`docs/arquitectura.md`](docs/arquitectura.md) | Arquitectura (ARC42) |
| [`docs/Planificación/`](docs/Planificación/) | Backlog, riesgos, sprints, presupuesto |

---

## 11. Resumen de calidad alcanzada

| Eje | Resultado |
|-----|-----------|
| **SonarQube** | Quality Gate **Passed**; Bugs 5 → **0**; Reliability **D → A**; Security Review **E → A** |
| **OWASP Top 10 2025** | 7 hallazgos; **5 mitigados con código**; 2 con riesgo residual documentado |
| **WCAG 2.1 AA** | **8 criterios corregidos** con código verificable en el flujo de autenticación |
| **SUS** | Puntaje **79.0** ("Bueno", aceptable) con 10 participantes |
| **Testing** | **99 tests** (unit + integración + E2E) + cobertura LCOV |

> Detalle completo y trazabilidad en el [informe técnico integral](docs/Calidad/INFORME_TECNICO_INTEGRAL.md).
