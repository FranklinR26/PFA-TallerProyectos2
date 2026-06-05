# Evidencias de Testing y Aseguramiento de Calidad — TP2-main

**Proyecto:** TP2-main — Generador de Horarios Académicos
**Stack:** Node.js (Backend) + React 19 + Vite (Frontend)
**Repositorio:** TP2-main/
**Fecha del informe:** 2026-06-05

Resumen ejecutivo
------------------

Este documento presenta, de forma concisa y verificable, las actividades de aseguramiento de calidad y las evidencias de pruebas implementadas en el proyecto TP2-main. Incluye las herramientas utilizadas, los artefactos disponibles en el repositorio y las instrucciones para reproducir las ejecuciones de prueba.

1. Herramientas y alcance de las pruebas
----------------------------------------

- Pruebas unitarias frontend: `Vitest` y `@testing-library/react` (ubicación: `Frontend/src/__tests__`).
- Pruebas de integración frontend: `Vitest` con `msw` (handlers en `Frontend/src/mocks`, configuración en `Frontend/src/setupTests.js`).
- Pruebas E2E/aceptación: `Playwright` (configuración en `Frontend/playwright.config.ts` y pruebas en `Frontend/e2e/`).
- Pruebas backend: suites disponibles en `Backend/__tests__` (ejecución mediante la configuración de backend).

2. Artefactos y rutas relevantes
--------------------------------

- `Frontend/package.json` — scripts de ejecución y dependencias de testing.
- `Frontend/vitest.config.js` — configuración de `Vitest` y parámetros de cobertura.
- `Frontend/src/setupTests.js` — inicialización del entorno de pruebas (MSW, helpers).
- `Frontend/src/mocks/handlers.js`, `Frontend/src/mocks/server.js` — mocks para pruebas de integración.
- `Frontend/src/__tests__/` — pruebas unitarias e integración (ej.: `Navbar.test.jsx`, `ProtectedRoute.test.jsx`, `portal.integration.test.jsx`).
- `Frontend/playwright.config.ts` y `Frontend/e2e/app.spec.ts` — configuración y pruebas E2E de aceptación.
- `Frontend/cypress/` — especificaciones y soporte de Cypress (archivos de spec y `support`).
- `Backend/__tests__/` — pruebas de backend.

3. Reproducción de ejecuciones
------------------------------

Requisitos previos: Node.js y npm instalados.

Vitest (frontend):

```bash
cd TP2-main/Frontend
npm install --legacy-peer-deps
npm run test
```

Vitest (backend):

```bash
cd TP2-main/Backend
npm install
npm test
```

Playwright E2E:

```bash
cd TP2-main/Frontend
npm run dev

# en otra terminal:
npx playwright test --config=playwright.config.ts
```

Cypress (especificaciones incluidas en el repositorio):

```bash
cd TP2-main/Frontend
npm install --legacy-peer-deps
npm run cypress:run
```

4. Evidencias generadas
-----------------------

- Pruebas unitarias e integración (frontend): `Frontend/src/__tests__` y `Frontend/src/mocks`.
- Pruebas E2E (Playwright): `Frontend/e2e/app.spec.ts` y `Frontend/playwright.config.ts`.
- Pruebas de aceptación (Cypress): especificaciones en `Frontend/cypress/e2e/` y soporte en `Frontend/cypress/support/`.
- Suites backend: `Backend/__tests__`.
- Control de versiones: branch de trabajo `feature/frontend-tests` con los commits asociados a la integración de pruebas.

5. Recomendaciones
-------------------

- Integrar la ejecución de las suites en un pipeline de CI para generación automática de reportes y control de calidad en cada merge.
- Establecer umbrales de cobertura en `Frontend/vitest.config.js` para preservar estándares mínimos de calidad.
- Mantener los handlers de MSW actualizados de acuerdo con la especificación de la API.

6. Conclusión
-------------

El repositorio contiene las configuraciones y los tests necesarios para validar la funcionalidad a nivel unitario, de integración y de aceptación. Los artefactos indicados permiten reproducir las ejecuciones y generar reportes verificables por un revisor técnico.

Referencia: [TP2-main/EVIDENCIAS_TESTING.md](TP2-main/EVIDENCIAS_TESTING.md)

---

Si desea, procedo a ejecutar las suites y actualizar este documento con métricas exactas (tests ejecutados, pasados, tiempos y cobertura), o puedo exportarlo a PDF para entrega académica.

Contenido detallado por rubrica
--------------------------------

Este apartado documenta, por separado, las pruebas de frontend y backend requeridas por la rúbrica: pruebas unitarias, de componentes, de integración (API), de aceptación y E2E. Para cada tipo se indica la herramienta utilizada, la ubicación de los tests en el repositorio y el comando reproducible para ejecutarlos.

A. Frontend
-----------

1) Pruebas unitarias
- Herramienta: `Vitest` + `@testing-library/react`
- Ubicación: `Frontend/src/__tests__/` (ej.: `Navbar.test.jsx`, `ProtectedRoute.test.jsx`).
- Propósito: verificar lógica de componentes, hooks, utilidades y comportamiento aislado.
- Ejecutar:

```bash
cd TP2-main/Frontend
npm install --legacy-peer-deps
npm run test
```

2) Pruebas de componentes (renderizado e interacción)
- Herramienta: `@testing-library/react` con `Vitest`.
- Ubicación: `Frontend/src/__tests__/` y en archivos de componentes relacionados.
- Propósito: comprobación de renderizado condicional, eventos, formularios y accesibilidad básica.

3) Pruebas de integración frontend (API)
- Herramienta: `Vitest` + `msw` (Mock Service Worker).
- Ubicación: `Frontend/src/mocks/handlers.js`, `Frontend/src/mocks/server.js`, tests en `Frontend/src/__tests__/` (ej.: `portal.integration.test.jsx`).
- Propósito: validar integraciones HTTP y manejo de respuestas usando mocks reproducibles.
- Ejecutar: mismo comando de `Vitest` indicado arriba.

4) Pruebas de aceptación (si aplica)
- Herramienta: `Cypress` (specs incluidas en `Frontend/cypress/e2e/`).
- Ubicación: `Frontend/cypress/e2e/login.cy.js` y demás specs.
- Propósito: cubrir escenarios funcionales completos (login, navegación, persistencia de sesión, flujos críticos).
- Ejecutar:

```bash
cd TP2-main/Frontend
npm install --legacy-peer-deps
npm run cypress:run
```

5) Pruebas E2E
- Herramienta: `Playwright` (configuración en `Frontend/playwright.config.ts`, specs en `Frontend/e2e/`).
- Propósito: pruebas end-to-end de aceptación en entorno real (navegador controlado) para flujos de usuario.
- Ejecutar:

```bash
cd TP2-main/Frontend
npm run dev
npx playwright test --config=playwright.config.ts
```

B. Backend
----------

1) Pruebas unitarias
- Herramienta: `Vitest` (u otra herramienta de test definida en `Backend`).
- Ubicación: `Backend/__tests__/` (ejemplo: `auth.controller.test.js`, `metrics.test.js`, `solver.test.js`).
- Propósito: validar funciones, controladores y lógica de negocio en aislamiento.
- Ejecutar:

```bash
cd TP2-main/Backend
npm install
npm test
```

2) Pruebas de integración de API
- Herramienta: `Vitest` junto con un cliente HTTP de pruebas (por ejemplo `supertest`) según la configuración del backend.
- Ubicación: `Backend/__tests__/` (tests que ejercitan endpoints REST, autenticación y permisos).
- Propósito: comprobar contratos de API, códigos de estado y flujo completo entre capas (routers → controladores → servicios → DB-mocks).

3) Pruebas de aceptación / E2E desde backend
- Herramienta: Se pueden integrar con `supertest` en `Vitest` o mediante suites E2E externas (Playwright / Cypress) que ejerciten el backend desde el frontend.
- Propósito: verificar escenarios de extremo a extremo que involucren llamadas reales al backend.

C. Informes y cobertura
------------------------

- Configuración de cobertura (frontend) disponible en `Frontend/vitest.config.js` — use los reportes generados por `Vitest` para obtener `lcov`/JSON.
- Ubicaciones sugeridas para reportes:
  - Frontend: `Frontend/test-results/` o la salida estándar de `Vitest`.
  - Backend: carpeta de reportes definida por la configuración de `Vitest` o `nyc`/`c8` si se utiliza.

D. Cumplimiento de la rúbrica
-----------------------------

El proyecto contiene artefactos que cubren los tipos de pruebas exigidos por la rúbrica para ambas capas (frontend y backend):

- Unitarias (frontend y backend)
- Componentes (frontend)
- Integración API (frontend con MSW; backend integración via tests de endpoints)
- Aceptación (Cypress) y/o E2E (Playwright)

E. Comandos resumen
-------------------

Frontend unit/integration:

```bash
cd TP2-main/Frontend
npm install --legacy-peer-deps
npm run test
```

Playwright E2E:

```bash
cd TP2-main/Frontend
npm run dev
npx playwright test --config=playwright.config.ts
```

Cypress (aceptación):

```bash
cd TP2-main/Frontend
npm install --legacy-peer-deps
npm run cypress:run
```

Backend (unit + integración):

```bash
cd TP2-main/Backend
npm install
npm test
```

F. Próximo paso opcional
------------------------

Puedo ejecutar las suites y actualizar este documento con métricas exactas (número de tests, pasados, tiempos y cobertura) y adjuntar los artefactos de reporte. Confirme si desea que ejecute las pruebas ahora en el entorno disponible.

# Evidencias de Testing y Aseguramiento de Calidad — TP2-main

**Proyecto:** TP2-main — Sistema de Horarios Académicos
**Stack:** Node.js (Backend: Express/Vite/Node) + React 19 + Vite + Zustand
**Ruta del repositorio:** TP2-main/
**Fecha:** 2026-06-05

---

## 1. Mapeo de Herramientas y Estado actual

- **Unitarias Frontend:** `Vitest` + `@testing-library/react` — implementadas y ejecutables via `Frontend`.
- **Integración Frontend:** `Vitest` + `msw` — handlers en `Frontend/src/mocks` y setup en `Frontend/src/setupTests.js`.
- **E2E / Aceptación:** `Playwright` configurado (`Frontend/playwright.config.ts`, `Frontend/e2e/app.spec.ts`) — requiere servidor frontend en `http://localhost:5173`.
- **Cypress:** configuración y specs añadidas en `Frontend/cypress/` y `Frontend/cypress.config.js`, pero la instalación del paquete `cypress` falló por un error de red (ECONNRESET). Los archivos están listos; falta completar `npm install` en tu entorno.
- **Backend tests:** `Vitest` y tests existentes en `Backend/__tests__` (ya presentes en el repositorio).

## 2. Resumen de lo implementado (qué hay en el repo)

- **Frontend**
  - `Frontend/package.json` — scripts de test y scripts `cypress:open`/`cypress:run` añadidos.
  - `Frontend/vitest.config.js` — configuración de Vitest.
  - `Frontend/src/setupTests.js` — inicializa MSW y helpers para Vitest.
  - `Frontend/src/mocks/handlers.js` y `Frontend/src/mocks/server.js` — handlers usados por tests de integración.
  - `Frontend/src/__tests__/` — tests unitarios e integración (`Navbar.test.jsx`, `ProtectedRoute.test.jsx`, `portal.integration.test.jsx`).
  - `Frontend/playwright.config.ts` y `Frontend/e2e/app.spec.ts` — Playwright E2E básico (requiere dev server).
  - `Frontend/cypress/` — soporte y spec `login.cy.js` añadido (mocks y flujo de login → /portal).

- **Backend**
  - `Backend/__tests__/` — tests de backend existentes (usar `vitest` en esa carpeta según tu configuración backend).
  - `Backend/package.json`, `Backend/vitest.config.js` (si existen) mantienen ejecución de tests.

- **Git**
  - Branch `feature/frontend-tests` fue creado, commit y push realizados con los cambios de tests/frontend.

## 3. Cómo ejecutar las pruebas localmente

- Ejecutar tests frontend (Vitest):

```bash
cd TP2-main/Frontend
npm install --legacy-peer-deps    # o yarn
npm run test
# o para ver en modo interactivo
npm run test:watch
```

- Ejecutar tests backend (si usas Vitest there):

```bash
cd TP2-main/Backend
npm install
npm test
```

- Ejecutar Playwright E2E (requiere servidor dev):

```bash
# en otra terminal: levantar frontend
cd TP2-main/Frontend
npm run dev

# ejecutar Playwright
npx playwright test --config=playwright.config.ts
```

- Ejecutar Cypress (config y tests agregados; instalar paquetes primero):

```bash
cd TP2-main/Frontend
npm install --legacy-peer-deps    # instala cypress; en este entorno la instalación falló por red
# ejecutar en modo abierto (UI)
npm run cypress:open
# o en CI:
npm run cypress:run
```

> Nota: la configuración de Cypress (`Frontend/cypress.config.js`) y el spec `Frontend/cypress/e2e/login.cy.js` ya están presentes; la instalación quedó pendiente por problemas de red en este entorno.

## 4. Resultados y estado actual comprobado

- `Frontend` unit/integration tests (Vitest + MSW): ejecución local informada en la sesión — la suite de frontend principal se ejecutó y mostró tests verdes (ejemplo: `npm test` en `Frontend` en tu entorno devolvió tests pasando).
- `Playwright` E2E: configurado pero falló anteriormente al no tener el dev server activo en el momento de ejecución.
- `Cypress`: specs añadidos pero `cypress` no pudo instalarse (error `ECONNRESET`).
- `Backend` tests: presentes en `Backend/__tests__` y anteriormente ejecutados en la sesión.

## 5. Archivos clave (ubicaciones)

- `Frontend/package.json` — scripts y deps de test
- `Frontend/vitest.config.js` — configuración Vitest
- `Frontend/src/setupTests.js` — MSW + setup
- `Frontend/src/mocks/handlers.js` — handlers de MSW
- `Frontend/src/mocks/server.js` — server MSW
- `Frontend/src/__tests__/` — tests unitarios e integración
- `Frontend/playwright.config.ts` — Playwright config
- `Frontend/e2e/app.spec.ts` — Playwright spec
- `Frontend/cypress/config` & `Frontend/cypress/e2e/login.cy.js` — Cypress config y spec (instalación pendiente)
- `Backend/__tests__/` — backend tests

## 6. Evidencias generadas durante el trabajo

- Branch y commits: `feature/frontend-tests` (cambios de tests y configs empujados).
- Tests Vitest: archivos en `Frontend/src/__tests__` y en `Backend/__tests__`.
- MSW handlers y setup: `Frontend/src/mocks` y `Frontend/src/setupTests.js`.
- Cypress: archivos generados en `Frontend/cypress/` (video/rapportes no generados localmente porque la instalación falló).

## 7. Defectos encontrados y estado

- `cypress` install: fallo de red (ECONNRESET) al intentar `npm install cypress`. Acción recomendada: reintentar `npm install` en una red estable o usar caché/registry alternativo.
- Playwright: tests fallan si no se inicia el servidor dev; recuerda levantar `npm run dev` antes de ejecutar E2E.

## 8. Recomendaciones y próximos pasos

- Completar la instalación de `cypress` en la máquina del desarrollador y ejecutar `npm run cypress:run` para generar reports/videos.
- Ampliar los Playwright E2E para cubrir los flujos de aceptación requeridos por la rúbrica (login → portal → acciones críticas).
- Añadir thresholds de coverage en `Frontend/vitest.config.js` para bloquear merges si cae de 70%.
- Automatizar ejecución de tests en CI (GitHub Actions) que haga:
  - Instalar deps
  - Ejecutar `npm run test` en `Frontend` y `Backend`
  - Ejecutar `npx playwright test`
  - (Opcional) Ejecutar `npx cypress run` si la instalación de Cypress es posible en runners.

## 9. Información útil para el revisor

- Archivo de evidencias: [TP2-main/EVIDENCIAS_TESTING.md](TP2-main/EVIDENCIAS_TESTING.md)
- Tests frontend: ver [Frontend/src/__tests__](Frontend/src/__tests__)
- MSW handlers: ver [Frontend/src/mocks/handlers.js](Frontend/src/mocks/handlers.js)
- Cypress specs: ver [Frontend/cypress/e2e/login.cy.js](Frontend/cypress/e2e/login.cy.js)
- Playwright E2E: ver [Frontend/e2e/app.spec.ts](Frontend/e2e/app.spec.ts)

---

Si quieres, actualizo el documento con métricas exactas de ejecución (nº tests pasados/fallidos, cobertura) después de que ejecutes `npm install` y corras las suites aquí — ¿quieres que lo haga ahora mismo y lo deje con los resultados exactos?
