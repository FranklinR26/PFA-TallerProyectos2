# Informe Técnico Integral de Calidad
## SonarQube · OWASP Top 10 2025 · WCAG · SUS · Testing Automatizado

**Proyecto:** HorarioConti — Sistema de Generación Óptima de Horarios Académicos (MERN)
**Curso:** Taller de Proyectos 2 — Ingeniería de Sistemas e Informática
**Repositorio:** https://github.com/FranklinR26/PFA-TallerProyectos2
**Fecha:** 2026-06-11

---

## 1. Introducción

Este informe consolida el proceso integral de aseguramiento de calidad aplicado a la aplicación web full stack HorarioConti, conforme a la consigna TP_2: análisis estático con SonarQube, auditoría de seguridad OWASP Top 10 2025, validación de accesibilidad WCAG, evaluación de usabilidad SUS y testing automatizado.

**Stack auditado:** Backend Node.js/Express 5 + MongoDB (Mongoose 9) · Frontend React 19 + Vite · Autenticación JWT por roles.

Se realizaron **dos análisis consecutivos** con SonarQube Community v26.6.0 para documentar el estado antes y después de las correcciones aplicadas durante esta auditoría.

---

## 2. Análisis SonarQube

### 2.1 Configuración

- **SonarQube Community** desplegado localmente vía Docker (`docker-compose.sonar.yml`), accesible en `http://localhost:9000`.
- Proyecto configurado en [`sonar-project.properties`](../../sonar-project.properties):
  - Fuentes: `Backend/` + `Frontend/src/`
  - Cobertura LCOV: `Backend/coverage/lcov.info` y `Frontend/coverage/lcov.info`
  - Exclusiones: `node_modules`, `coverage`, archivos de test, assets
- CI pipeline configurado en `.github/workflows/ci.yml` (análisis automático habilitable vía `vars.SONAR_ENABLED`).

### 2.2 Procedimiento de análisis

```bash
# 1. Generar cobertura
cd TP2-main/Backend  && npm run test:coverage
cd TP2-main/Frontend && npm run test:coverage

# 2. Levantar SonarQube
docker compose -f docker-compose.sonar.yml up -d   # http://localhost:9000

# 3. Generar token y escanear
docker run --rm --network host -v "$PWD:/usr/src" sonarsource/sonar-scanner-cli \
  "-Dsonar.host.url=http://localhost:9000" "-Dsonar.token=<TOKEN>"
```

### 2.3 Métricas antes y después de correcciones

| Métrica | 1ª Análisis (antes) | 2ª Análisis (después) | Meta | Mejora |
|---------|--------------------|-----------------------|------|--------|
| **Bugs** | 5 | **0** | 0 | ✅ −5 bugs |
| **Vulnerabilities** | 0 | **0** | 0 | ✅ Sin cambio |
| **Code Smells** | 237 | **237** | < 250 | ✅ Dentro del rango |
| **Duplicación** | 0.3 % | **0.3 %** | < 3 % | ✅ Excelente |
| **Maintainability Rating** | A | **A** | A | ✅ Mantenido |
| **Reliability Rating** | D | **A** | A | ✅ D → A |
| **Security Rating** | A | **A** | A | ✅ Mantenido |
| **Security Review Rating** | E (0 % revisado) | **A (100 %)** | A | ✅ E → A |
| **Technical Debt** | ~1461 min (≈ 3 d) | **~1461 min** | < 2 d | ⚠ Pendiente refactor |
| **Coverage** | 17.7 % | **17.7 %** | ≥ 70 % | ⚠ Brecha identificada |
| **Lines of Code** | 6 449 | **6 449** | — | — |
| **Quality Gate** | Passed | **Passed** | Passed | ✅ |

> Las capturas del dashboard (`sonar-antes.png` y `sonar-despues.png`) están guardadas en `docs/calidad/evidencias/`.

### 2.4 Interpretación técnica y componentes críticos

#### Hallazgos resueltos

**Bugs críticos (5 → 0) — `Frontend/src/pages/SchedulePage.jsx`**
SonarQube detectó 5 llamadas a `.sort()` sin función comparadora. En JavaScript, `.sort()` sin argumento convierte los elementos a strings y los ordena léxicamente, lo que produce resultados incorrectos para listas de nombres con caracteres especiales (tildes, ñ) frecuentes en español. Las correcciones aplicaron `.sort((a, b) => a.localeCompare(b))` en las 5 ocurrencias.

**Security Hotspots (2 → 0) — `Backend/Dockerfile`**
- *Hotspot 1 — COPY recursivo*: el `COPY . .` podía incluir archivos `.env` u otros secretos en la imagen Docker. **Mitigación:** se creó `Backend/.dockerignore` excluyendo `node_modules`, `.env`, logs, `coverage` y archivos de test.
- *Hotspot 2 — Ejecución como root*: la imagen oficial `node:20-alpine` corre por defecto con el usuario `root`, lo que amplía la superficie de ataque si el contenedor es comprometido. **Mitigación:** se añadió `USER node` al Dockerfile con el paso previo `chown -R node:node /app` para garantizar permisos correctos.

#### Deuda técnica residual (237 code smells)

Los 237 code smells con rating A significan que la deuda técnica representa < 5 % del tiempo de desarrollo estimado, lo que es aceptable. La mayor concentración está en:
- Duplicación de lógica de filtrado en `SchedulePage.jsx` (función de filtro anidada).
- Variables de estado excesivas en componentes complejos (DataPage, SchedulePage).
- Algunos `console.log` de depuración en el frontend.

**Plan de reducción:** refactorización de estado con custom hooks en un sprint posterior.

#### Cobertura (17.7 % → en mejora)

La cobertura base era baja porque la suite histórica cubría principalmente el módulo `csp/` (solver CSP, > 90 %). Al expandir la medición a todos los módulos (`controllers/`, `routes/`, `pages/`) se evidenció la brecha real.

**Acción correctiva aplicada:** se añadieron pruebas unitarias para `controllers/auth.controller.js` y `controllers/period.controller.js` (22 tests con modelos mockeados, sin dependencia de MongoDB), subiendo la cobertura de líneas del backend de **31.7 % → 36.2 %** y la cobertura de funciones de controladores a **68 %**. Las pruebas de autenticación además **verifican las mitigaciones OWASP** (inyección NoSQL, política de contraseñas, manejo seguro de errores). El plan continúa con `data.controller.js`, `schedule.controller.js` y los componentes `DataPage.jsx` / `SchedulePage.jsx` del frontend hasta acercarse a la meta del 70 %.

---

## 3. Auditoría de Seguridad — OWASP Top 10 2025

Auditoría completa en [`OWASP_TOP10_2025_MATRIZ.md`](OWASP_TOP10_2025_MATRIZ.md). Resumen ejecutivo:

| Hallazgo | Categoría OWASP 2025 | Severidad | Estado |
|----------|---------------------|-----------|--------|
| H-01 — Fuga de errores internos | A10 — Mishandling of Exceptional Conditions | Media | ✅ Mitigado |
| H-02 — CORS abierto | A02 — Security Misconfiguration | Media | ✅ Mitigado |
| H-03 — Inyección NoSQL | A05 — Injection | **Alta** | ✅ Mitigado |
| H-04 — Sin política de contraseñas | A07 — Authentication Failures | Media | ✅ Mitigado |
| H-05 — `.env` versionado | A02 — Security Misconfiguration | Baja | ✅ Mitigado |
| H-06 — JWT en localStorage | A04/A07 | Media | ⚠ Riesgo residual |
| H-07 — Sin alertas de seguridad | A09 — Logging & Alerting Failures | Baja | ⚠ Riesgo residual |

**Controles preexistentes verificados:** JWT con expiración, RBAC (`checkRole`), bcrypt cost 12, `helmet()`, rate-limiting `/api/auth` (20 req/15 min), registro restringido a admin, soft-delete con `isActive`.

---

## 4. Validación de Accesibilidad — WCAG 2.1 AA

Checklist completo en [`WCAG_CHECKLIST.md`](WCAG_CHECKLIST.md). Resumen:

| Criterio | Estado |
|----------|--------|
| 3.1.1 — Idioma de la página (`lang="es"`) | ✅ Corregido |
| 1.3.1/3.3.2 — Etiquetas de formulario (`<label htmlFor>`) | ✅ Corregido |
| 2.1.1 — Teclado (toggle contraseña enfocable) | ✅ Corregido |
| 4.1.3 — Mensajes de estado (`role="alert"`) | ✅ Corregido |
| 1.4.3 — Contraste mínimo (3 combinaciones corregidas) | ✅ Corregido |
| 1.3.1 — Estructura semántica (`<aside>`, `<main>`, `<nav>`) | ✅ Corregido |
| 4.1.2 — Controles personalizados (`aria-pressed`, `role="group"`) | ✅ Corregido |
| 1.1.1 — Iconos decorativos (`aria-hidden="true"`) | ✅ Corregido |
| 2.4.7 — Foco visible (`:focus-visible` global) | ✅ Corregido |
| 1.4.10 — Reflow 320 px (media query `≤600px`) | ✅ Corregido |

**10 criterios corregidos con código verificable.** Los reportes automáticos de Lighthouse y axe DevTools están documentados en `docs/calidad/evidencias/WCAG_LIGHTHOUSE_MANUAL.md`.

---

## 5. Evaluación de Usabilidad — SUS

Instrumento, protocolo y datos completos en [`SUS_INSTRUMENTO.md`](SUS_INSTRUMENTO.md).

### Resultado obtenido

| Participantes | Puntaje SUS | Adjetivo | Aceptabilidad | Grado |
|---------------|-------------|----------|---------------|-------|
| 10 (4 estudiantes, 3 docentes, 2 coordinadores, 1 admin) | **79.0** | Bueno | Aceptable | B |

El puntaje **79.0** supera el umbral mínimo de la industria (68) y se ubica en la banda "Bueno" (71.1–80.7) de la escala de Bangor et al. (2009).

**Hallazgos clave:**
- Coordinadores y administradores obtuvieron puntajes más altos (promedio: 93.3), por su mayor familiaridad con el sistema.
- Estudiantes de ciclos iniciales obtuvieron puntajes más bajos (promedio: 65.0), señalando oportunidades de mejora en onboarding.
- El flujo de generación de horarios fue identificado como el más complejo.

**Propuestas de mejora:**
1. Tutorial guiado para el primer uso (onboarding wizard).
2. Simplificación de la interfaz de generación con pasos explícitos.
3. Ayuda contextual con tooltips en funciones avanzadas.
4. Mejora de responsividad en dispositivos móviles.

---

## 6. Testing Automatizado

| Tipo | Herramienta | Ubicación | Resultado |
|------|-------------|-----------|-----------|
| Unitarias backend | Vitest | `Backend/__tests__/` (10 suites) | ✅ 114/114 pasan |
| Unitarias frontend | Vitest + Testing Library | `Frontend/src/__tests__/` | ✅ 7/7 pasan |
| Integración frontend (API mock) | Vitest + MSW | `Frontend/src/__tests__/portal.integration.test.jsx` | ✅ pasan |
| E2E funcional | Playwright | `Frontend/e2e/app.spec.ts` | ✅ configurado |
| Aceptación | Cypress | `Frontend/cypress/e2e/login.cy.js` | ✅ configurado |
| Cobertura | `@vitest/coverage-v8` (LCOV) | `npm run test:coverage` en ambas capas | ✅ Backend 36.2 % |

**Cobertura por capa:**

| Capa | Tests | Resultado | Líneas | Funciones | Ramas |
|------|-------|-----------|--------|-----------|-------|
| Backend | 114 | ✅ 114/114 | **36.2 %** | **49.3 %** | **78.9 %** |
| Frontend | 7 | ✅ 7/7 | 5.65 % | 4.2 % | 3.1 % |
| **Global SonarQube** | **121** | **✅** | pendiente re-escaneo (↑ vs. 17.7 %) | — | — |

> **Mejora de cobertura en esta auditoría:** se añadieron 22 pruebas unitarias para `auth.controller.js` (12) y `period.controller.js` (10), elevando la cobertura de líneas del backend de **31.7 % → 36.2 %** y la de funciones de controladores a **68 %**. Las pruebas de `auth.controller.js` **validan automáticamente las mitigaciones OWASP** H-01 (no fuga de errores), H-03 (rechazo de inyección NoSQL) y H-04 (política de contraseñas), reforzando el indicador 12.2 *"verifica el cumplimiento de los requerimientos"*. La cobertura global de SonarQube se actualizará al re-ejecutar el escaneo.
>
> Durante esta auditoría también se reparó la suite `sustainability.controller.test.js` (5 tests fallaban por nombres de archivo desactualizados tras migración GreenFrame→Carbometer).

---

## 7. Conclusiones y mejoras implementadas

| # | Mejora | Impacto verificable |
|---|--------|---------------------|
| 1 | Infraestructura de análisis estático (SonarQube + CI + LCOV) | Quality Gate: Passed; cobertura medible |
| 2 | 5 bugs críticos corregidos en `SchedulePage.jsx` | Reliability: D → **A** |
| 3 | 2 security hotspots resueltos en `Dockerfile` | Security Review: E → **A** |
| 4 | 5 vulnerabilidades OWASP mitigadas con código | 0 vulnerabilidades en SonarQube |
| 5 | 8 criterios WCAG corregidos en flujo de autenticación | Accesibilidad mejorada verificablemente |
| 6 | Evaluación SUS aplicada: puntaje 79.0 | Usabilidad "Buena", por encima del umbral industria |

---

## 8. Anexos

- A1. [Matriz OWASP](OWASP_TOP10_2025_MATRIZ.md)
- A2. [Checklist WCAG](WCAG_CHECKLIST.md)
- A3. [Instrumento SUS con datos](SUS_INSTRUMENTO.md)
- A4. Carpeta de capturas: `docs/calidad/evidencias/`
