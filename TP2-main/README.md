# HorarioConti — Sistema de Generacion Optima de Horarios Academicos

[![Tests](https://github.com/FranklinR26/PFA-TallerProyectos2/actions/workflows/tests.yml/badge.svg)](https://github.com/FranklinR26/PFA-TallerProyectos2/actions/workflows/tests.yml)
[![CI](https://github.com/FranklinR26/PFA-TallerProyectos2/actions/workflows/ci.yml/badge.svg)](https://github.com/FranklinR26/PFA-TallerProyectos2/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-green)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-yellow)](LICENSE)
[![Version](https://img.shields.io/badge/version-v1.0.0-blue)]()

---

## Tabla de contenido

1. [Integrantes del equipo](#integrantes-del-equipo)
2. [Problematica abordada](#problematica-abordada)
3. [Justificacion del PMV](#justificacion-del-pmv)
4. [Tecnologias utilizadas](#tecnologias-utilizadas)
5. [Arquitectura del sistema](#arquitectura-del-sistema)
6. [Instrucciones de instalacion](#instrucciones-de-instalacion)
7. [Instrucciones de build](#instrucciones-de-build)
8. [Instrucciones de despliegue](#instrucciones-de-despliegue)
9. [Tests](#tests)
10. [Estructura del proyecto](#estructura-del-proyecto)
11. [Documentacion](#documentacion)
12. [Video explicativo](#video-explicativo)

---

## Integrantes del equipo

| Rol | Nombre |
|-----|--------|
| Scrum Master | Gabriel D. Landa Sabuco |
| Product Owner | Piero Curassi Montano |
| Fullstack Developer | Rolfi Escobar Rojas |
| Frontend & UX | Franklin Rojas Ortiz |
| Frontend & UX | Anthony Camarena Chavez |

**Curso:** Taller de Proyectos 2 — Ingenieria de Sistemas e Informatica, Universidad Continental.

---

## Problematica abordada

La planificacion de horarios academicos en universidades con curriculo flexible representa un desafio significativo debido a la interaccion de multiples variables y restricciones simultaneas:

- **Conflictos de horarios** entre cursos obligatorios que impiden a los estudiantes matricularse correctamente.
- **Baja utilizacion de aulas** y recursos institucionales por asignaciones manuales suboptimas.
- **Ineficiencia en la asignacion de docentes**, generando sobrecargas en algunos y subutilizacion en otros.
- **Complejidad combinatoria**: el problema pertenece a la clase NP-completo, lo que hace inviable una solucion manual optima para instancias reales (50+ cursos).

Estos factores se agravan por cambios constantes en la matricula, dependencias academicas (prerrequisitos/corequisitos) y la necesidad de generar soluciones en tiempos limitados.

---

## Justificacion del PMV

El Producto Minimo Viable (PMV) se enfoca en resolver el nucleo del problema: **generar automaticamente horarios academicos libres de conflictos** mediante un modelo de Satisfaccion de Restricciones (CSP) con backtracking, AC-3 y heuristica MRV.

**Por que un PMV:**
- Permite validar la viabilidad tecnica del enfoque CSP antes de invertir en funcionalidades secundarias.
- Cubre los 5 requerimientos funcionales criticos (RF-01 a RF-05): autenticacion, gestion de datos academicos, generacion de horarios, visualizacion y exportacion.
- Garantiza **0 violaciones de restricciones duras** (7 HC definidas formalmente) y optimiza 5 restricciones blandas.
- Resuelve instancias de hasta 100 cursos en menos de 5 segundos, cumpliendo el objetivo de reducir el tiempo de planificacion en al menos 50%.

**Valor entregado:** el PMV es funcional, desplegable con Docker y verificado con 114+ tests automatizados.

---

## Tecnologias utilizadas

| Capa | Tecnologia |
|------|-----------|
| Frontend | React 19 + Vite + Zustand |
| Backend | Node.js 20 + Express 5 |
| Base de datos | MongoDB 7 (Mongoose 9) |
| Autenticacion | JWT en cookie httpOnly |
| Testing | Vitest + React Testing Library + MSW + Cypress + Playwright |
| Calidad | SonarQube + OWASP Top 10 + WCAG 2.1 + SUS |
| Infraestructura | Docker + nginx + GitHub Actions CI/CD |
| Gestion de proyecto | Jira (Scrum) + GitHub Projects |

---

## Arquitectura del sistema

El sistema sigue una arquitectura **SPA + API REST** con separacion clara en tres capas:

```
┌─────────────────────────────────────────────────────────────┐
│                    Cliente (Browser)                         │
│              React 19 SPA + Zustand Store                   │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST (JSON)
┌──────────────────────▼──────────────────────────────────────┐
│                   Backend (API REST)                         │
│              Node.js 20 + Express 5                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │Controllers│  │Middleware│  │  Routes  │  │  CSP Engine │  │
│  │(logica)  │  │(auth,    │  │(endpoints│  │(solver,    │  │
│  │          │  │ cache,   │  │  REST)   │  │ constraints│  │
│  │          │  │ security)│  │          │  │ scoring)   │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ Mongoose ODM
┌──────────────────────▼──────────────────────────────────────┐
│                   MongoDB 7                                  │
│         Persistencia de datos academicos                     │
└─────────────────────────────────────────────────────────────┘
```

- **Frontend**: capa de presentacion (UI/UX). Paginas: Login, Portal, Dashboard, Gestion de datos, Generacion de horarios, Sostenibilidad.
- **Backend**: logica de negocio y acceso a datos mediante API REST. Incluye el motor CSP que resuelve el problema de calendarizacion en worker threads.
- **Base de datos**: almacena usuarios, cursos, docentes, aulas, secciones, periodos y horarios generados.

La arquitectura aplica **separacion de responsabilidades** (controllers/models/routes/middleware), es **mantenible** (modulos independientes) y **escalable** (solver en worker thread, cache, Docker).

Para mas detalles: [`docs/ejecucion/arquitectura.md`](docs/ejecucion/arquitectura.md)

---

## Instrucciones de instalacion

### Prerrequisitos

- [Node.js 20+](https://nodejs.org/)
- [MongoDB 7+](https://www.mongodb.com/) (local o Atlas)
- [Docker](https://www.docker.com/) y Docker Compose (opcional, recomendado)
- Git

### Instalacion local

```bash
# 1. Clonar el repositorio
git clone https://github.com/FranklinR26/PFA-TallerProyectos2.git
cd PFA-TallerProyectos2/TP2-main

# 2. Backend
cd Backend
cp .env.example .env          # configurar variables de entorno
npm install

# 3. Frontend (en otra terminal)
cd ../Frontend
npm install
```

### Variables de entorno (Backend/.env)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/horarioconti
JWT_SECRET=cambia_esto_por_un_secreto_seguro
JWT_EXPIRES_IN=7d
```

---

## Instrucciones de build

### Desarrollo

```bash
# Backend (desde TP2-main/Backend)
npm run dev

# Frontend (desde TP2-main/Frontend)
npm run dev
```

El frontend estara disponible en `http://localhost:5173` y la API en `http://localhost:5000`.

### Build de produccion

```bash
# Frontend: genera los archivos estaticos en dist/
cd Frontend
npm run build

# Backend: se ejecuta directamente con Node.js
cd Backend
NODE_ENV=production node index.js
```

---

## Instrucciones de despliegue

### Con Docker (recomendado)

```bash
cd TP2-main
docker compose up --build
```

Esto levanta tres servicios:
- **tp2-mongo**: MongoDB 7 con healthcheck y volumen persistente.
- **tp2-backend**: API REST en el puerto 5000.
- **tp2-frontend**: aplicacion React servida por nginx en el puerto 80.

La aplicacion estara disponible en:
- Frontend: `http://localhost` (puerto 80)
- API: `http://localhost:5000`

### Despliegue manual en servidor

1. Instalar Node.js 20+, MongoDB 7+ y nginx.
2. Clonar el repositorio y configurar las variables de entorno.
3. Ejecutar `npm run build` en el frontend y servir `dist/` con nginx.
4. Ejecutar el backend con `NODE_ENV=production node index.js`.
5. Configurar nginx como reverse proxy para la API (`/api -> localhost:5000`).

---

## Tests

```bash
# Backend (114 tests)
cd TP2-main/Backend
npm test                # ejecutar tests
npm run test:coverage   # con reporte de cobertura

# Frontend (unitarios + integracion)
cd TP2-main/Frontend
npm test                # unitarios + integracion
npm run test:coverage   # con cobertura

# Frontend E2E
npm run cypress:run     # E2E con Cypress
npx playwright test     # E2E con Playwright
```

---

## Estructura del proyecto

```
TP2-main/
├── Backend/                # API REST (Express + Mongoose)
│   ├── controllers/        # Logica de negocio
│   ├── csp/                # Motor CSP (solver, constraints, scoring)
│   ├── middleware/          # Auth, cache, rate-limit, CO2
│   ├── models/             # Esquemas Mongoose
│   ├── routes/             # Definicion de endpoints
│   ├── __tests__/          # Tests unitarios backend (10 suites)
│   └── Dockerfile
├── Frontend/               # SPA React
│   ├── src/
│   │   ├── pages/          # Paginas (Login, Portal, Dashboard, etc.)
│   │   ├── components/     # Componentes reutilizables
│   │   ├── api/            # Clientes HTTP (axios)
│   │   ├── store/          # Estado global (Zustand)
│   │   ├── mocks/          # MSW handlers para tests
│   │   └── __tests__/      # Tests unitarios frontend (8 suites)
│   ├── cypress/            # Tests E2E Cypress
│   ├── e2e/                # Tests E2E Playwright
│   └── Dockerfile
├── docs/                   # Documentacion PMBOK
│   ├── Inicio/             # Fase de inicio (6 documentos)
│   ├── Planificacion/      # Fase de planificacion (10 documentos)
│   ├── ejecucion/          # Fase de ejecucion (3 documentos)
│   ├── seguimiento_control/# Seguimiento y control (10+ documentos)
│   ├── cierre/             # Fase de cierre (10 documentos)
│   ├── otros/              # Documentacion adicional
│   └── informe_final.pdf   # Informe final consolidado
├── Otros/                  # Recursos complementarios (JIRA)
├── .env                    # Variables de entorno (no versionado)
├── .gitignore              # Exclusion de archivos
├── docker-compose.yml      # Orquestacion full-stack
└── README.md               # Este archivo
```

---

## Documentacion

La documentacion esta organizada en la carpeta [`docs/`](docs/) siguiendo las areas de conocimiento del PMBOK:

### Inicio
| Documento | Ruta |
|-----------|------|
| Documento de inicio | [`docs/Inicio/Documento de inicio.md`](docs/Inicio/Documento%20de%20inicio.md) |
| Vision del proyecto | [`docs/Inicio/Vision del proyecto.md`](docs/Inicio/Visión%20del%20proyecto.md) |
| Casos de uso | [`docs/Inicio/Especificacion-casos-de-uso.md`](docs/Inicio/Especificacion-casos-de-uso.md) |
| Enfoque del proyecto | [`docs/Inicio/Enfoque del proyecto.md`](docs/Inicio/Enfoque%20del%20proyecto.md) |
| Supuestos y restricciones | [`docs/Inicio/Registro de supuestos y restricciones.md`](docs/Inicio/Registro%20de%20supuestos%20y%20restricciones.md) |

### Planificacion
| Documento | Ruta |
|-----------|------|
| Acta de constitucion (CSP) | [`docs/Planificacion/CONSTITUTION.md`](docs/Planificación/CONSTITUTION.md) |
| Backlog formal | [`docs/Planificacion/BACKLOG_FORMAL.md`](docs/Planificación/BACKLOG_FORMAL.md) |
| Sprints y objetivos | [`docs/Planificacion/SPRINTS_OBJETIVOS.md`](docs/Planificación/SPRINTS_OBJETIVOS.md) |
| Especificacion formal CSP | [`docs/Planificacion/ESPECIFICACION_FORMAL.md`](docs/Planificación/ESPECIFICACION_FORMAL.md) |
| Gestion de riesgos | [`docs/Planificacion/GESTION_RIESGOS_OPORTUNIDADES.md`](docs/Planificación/GESTION_RIESGOS_OPORTUNIDADES.md) |
| Presupuesto | [`docs/Planificacion/PRESUPUESTO.md`](docs/Planificación/PRESUPUESTO.md) |
| Plan de comunicaciones | [`docs/Planificacion/PLAN_COMUNICACIONES.md`](docs/Planificación/PLAN_COMUNICACIONES.md) |
| WBS | [`docs/Planificacion/WBS.md`](docs/Planificación/WBS.md) |
| Diagrama Gantt | [`docs/Planificacion/DIAGRAMA_GANTT.md`](docs/Planificación/DIAGRAMA_GANTT.md) |
| Actas de reuniones | [`docs/Planificacion/ACTAS_REUNIONES.md`](docs/Planificación/ACTAS_REUNIONES.md) |

### Ejecucion
| Documento | Ruta |
|-----------|------|
| Arquitectura (ARC42) | [`docs/ejecucion/arquitectura.md`](docs/ejecucion/arquitectura.md) |
| Modelado | [`docs/ejecucion/modelado.md`](docs/ejecucion/modelado.md) |
| Entregables tecnicos | [`docs/ejecucion/ENTREGABLES_TECNICOS.md`](docs/ejecucion/ENTREGABLES_TECNICOS.md) |

### Seguimiento y control
| Documento | Ruta |
|-----------|------|
| OWASP Top 10 | [`docs/seguimiento_control/Calidad/OWASP_TOP10_2025_MATRIZ.md`](docs/seguimiento_control/Calidad/OWASP_TOP10_2025_MATRIZ.md) |
| WCAG Checklist | [`docs/seguimiento_control/Calidad/WCAG_CHECKLIST.md`](docs/seguimiento_control/Calidad/WCAG_CHECKLIST.md) |
| SUS Usabilidad | [`docs/seguimiento_control/Calidad/SUS_INSTRUMENTO.md`](docs/seguimiento_control/Calidad/SUS_INSTRUMENTO.md) |
| Informe tecnico integral | [`docs/seguimiento_control/Calidad/INFORME_TECNICO_INTEGRAL.md`](docs/seguimiento_control/Calidad/INFORME_TECNICO_INTEGRAL.md) |
| Evidencias de testing | [`docs/seguimiento_control/EVIDENCIAS_TESTING.md`](docs/seguimiento_control/EVIDENCIAS_TESTING.md) |
| Sostenibilidad | [`docs/seguimiento_control/informe_sostenibilidad.md`](docs/seguimiento_control/informe_sostenibilidad.md) |
| Valor ganado (EVM) | [`docs/seguimiento_control/VALOR_GANADO_EVM.md`](docs/seguimiento_control/VALOR_GANADO_EVM.md) |

### Cierre
| Documento | Ruta |
|-----------|------|
| Informe final | [`docs/cierre/01_INFORME_FINAL_PROYECTO.md`](docs/cierre/01_INFORME_FINAL_PROYECTO.md) |
| Lecciones aprendidas | [`docs/cierre/02_INFORME_LECCIONES_APRENDIDAS.md`](docs/cierre/02_INFORME_LECCIONES_APRENDIDAS.md) |
| Registro de riesgos | [`docs/cierre/03_REGISTRO_RIESGOS_CIERRE.md`](docs/cierre/03_REGISTRO_RIESGOS_CIERRE.md) |
| Registro de incidentes | [`docs/cierre/04_REGISTRO_INCIDENTES.md`](docs/cierre/04_REGISTRO_INCIDENTES.md) |
| Registro de impedimentos | [`docs/cierre/05_REGISTRO_IMPEDIMENTOS.md`](docs/cierre/05_REGISTRO_IMPEDIMENTOS.md) |
| Registro de defectos | [`docs/cierre/06_REGISTRO_DEFECTOS.md`](docs/cierre/06_REGISTRO_DEFECTOS.md) |
| Revision acta constitucion | [`docs/cierre/08_REVISION_ACTA_CONSTITUCION.md`](docs/cierre/08_REVISION_ACTA_CONSTITUCION.md) |
| Declaracion de trabajo (SOW) | [`docs/cierre/09_DECLARACION_TRABAJO_SOW.md`](docs/cierre/09_DECLARACION_TRABAJO_SOW.md) |
| Documentacion de capacitacion | [`docs/cierre/10_DOCUMENTACION_CAPACITACION.md`](docs/cierre/10_DOCUMENTACION_CAPACITACION.md) |
| Informe final PDF | [`docs/informe_final.pdf`](docs/informe_final.pdf) |

### Otros
| Documento | Ruta |
|-----------|------|
| API REST | [`docs/API.md`](docs/API.md) |
| Test Report | [`docs/Planificacion/TEST_REPORT.md`](docs/Planificación/TEST_REPORT.md) |

---

## Video explicativo

> **Video demostrativo del sistema** (max. 5 minutos):
>
> [Enlace al video explicativo](https://drive.google.com/PENDIENTE)
>
> El video muestra: autenticacion, carga de datos academicos, generacion automatica de horarios con el motor CSP, visualizacion de resultados y dashboard de sostenibilidad.

*Nota: el equipo debe reemplazar el enlace con la URL real del video antes de la entrega.*

---

## Flujo de trabajo Git

El equipo utiliza **Feature Branch Workflow** como estrategia de control de versiones. Para mas detalles y justificacion, consultar [`docs/Planificacion/FLUJO_GIT.md`](docs/Planificación/FLUJO_GIT.md).

---

## Contribuir

Ver [CONTRIBUCIONES.md](CONTRIBUCIONES.md).

## Seguridad

Ver [SEGURIDAD.md](SEGURIDAD.md).
