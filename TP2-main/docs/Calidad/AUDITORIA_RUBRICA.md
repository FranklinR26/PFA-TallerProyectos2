# Auditoría de Calidad vs. Rúbrica — Cierre de Brechas

**Proyecto:** HorarioConti — Sistema de Generación Óptima de Horarios Académicos (MERN)
**Curso:** Taller de Proyectos 2 — Ingeniería de Sistemas e Informática
**Fecha de auditoría:** 2026-06-18

Este documento contrasta cada afirmación de los informes de calidad con el estado real del código y registra las correcciones aplicadas para que ambos coincidan.

## 1. Correcciones de seguridad (OWASP Top 10 2025)

| ID | Categoría | Archivo | Cambio |
|----|-----------|---------|--------|
| H-01 | A10 | `Backend/controllers/auth.controller.js` | `register` devuelve mensaje genérico; detalle al logger |
| H-02 | A02 | `Backend/index.js` | Lista blanca `DEV_ORIGINS`; se elimina `cb(null, true)` |
| H-03 | A05 | `Backend/controllers/auth.controller.js` | `login`/`register` rechazan no-string (bloquea inyección NoSQL) |
| H-04 | A07 | `Backend/controllers/auth.controller.js` | Política de contraseña: 8+ con letras y números |
| H-05 | A02 | `git rm --cached TP2-main/.env` | `.env` ya no se versiona |

## 2. Correcciones de accesibilidad (WCAG 2.1 AA)

| Criterio | Archivo | Cambio |
|----------|---------|--------|
| 3.1.1 Idioma | `Frontend/index.html` | `lang="en"` to `lang="es"` |
| 2.4.7 Foco visible | `Frontend/src/index.css` | Regla global `:focus-visible` |
| 1.4.10 Reflow | `Frontend/src/index.css` | Media query 600px colapsa el login a una columna |

## 3. Repositorio y evidencias

- `README.md`: Quick Start corregido (`Backend`/`Frontend`); badge de cobertura consistente (17.7%).
- `docs/Calidad/evidencias/SONAR_METRICAS.md`: token redactado a variable de entorno (invalidar en SonarQube).
- `sonar-project.properties`: project key alineado a `PFA-TallerProyectos2`.

## 4. Cobertura de pruebas

- `Backend/__tests__/auth.controller.test.js` (12 tests) — verifica H-01/H-03/H-04.
- `Backend/__tests__/period.controller.test.js` (10 tests).
- Backend: 31.7% to 36.2% de líneas; funciones de controladores 68%; 114/114 tests verde.

## 5. Verificación

- Tests backend: 114/114 pasan.
- Build frontend: OK.
- `git ls-files | grep .env`: solo `Backend/.env.example`.

## 6. Pendientes manuales (requieren servicios)

- Capturas: `sonar-antes.png`, `wcag-login-antes.png`, `sus-formulario.png`.
- Re-escaneo de SonarQube para reflejar la nueva cobertura.
- Invalidar el token expuesto en SonarQube.

## 7. Mapa a la rúbrica de competencias

| Competencia | Evidencia | Nivel |
|-------------|-----------|-------|
| 12.2 W3C/ISO 25010/OWASP/WCAG/Green Software | SonarQube + OWASP + WCAG + sostenibilidad | Sobresaliente |
| 9.1 / 9.2 Sostenibilidad e impactos | informe_sostenibilidad (incl. impactos legal/salud/seguridad) | Suficiente/Sobresaliente |
| 3.1 / 3.2 / 3.3 Ciudadanía glocal | ANALISIS_CIUDADANIA_GLOBAL.md | Suficiente/Sobresaliente |
| 4.1 / 4.2 Comunicación escrita | Informe integral y este documento | Sobresaliente |
| 2.1 / 2.2 Aprendizaje experiencial/colaborativo | Herramientas + historial multi-rama | Suficiente |
| 4.3 / 4.4 Comunicación oral | Defensa en vivo | Pendiente |
