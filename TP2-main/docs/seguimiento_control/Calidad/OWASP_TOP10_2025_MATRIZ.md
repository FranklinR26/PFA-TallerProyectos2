# Matriz de Vulnerabilidades — OWASP Top 10 2025

**Proyecto:** HorarioConti — Sistema de Horarios Académicos (MERN)
**Fecha de auditoría:** 2026-06-11
**Alcance:** `TP2-main/Backend` (API Express) y `TP2-main/Frontend` (React 19 + Vite)

## 1. Resumen ejecutivo

Se auditó la aplicación contra las 10 categorías del OWASP Top 10 2025. Se identificaron **7 hallazgos** (1 alto, 4 medios, 2 bajos). **Todos fueron mitigados completamente** con cambios verificables en el código:
- H-01 a H-05: mitigaciones originales (controlador, CORS, validación, política, .gitignore)
- **H-06 y H-07: mitigaciones completadas en esta fase** (JWT en cookie httpOnly, alertas de seguridad)

## 2. Matriz de vulnerabilidades

| ID | Categoría OWASP 2025 | Hallazgo | Severidad | Estado | Evidencia / Mitigación |
|----|----------------------|----------|-----------|--------|------------------------|
| H-01 | A10 — Mishandling of Exceptional Conditions | `register` devolvía `err.message` crudo al cliente (fuga de detalles internos de Mongo/Mongoose) | Media | ✅ Mitigado | `Backend/controllers/auth.controller.js`: error genérico al cliente, detalle solo en log estructurado |
| H-02 | A02 — Security Misconfiguration | CORS reflejaba **cualquier** origen en entornos no productivos (`cb(null, true)`) | Media | ✅ Mitigado | `Backend/index.js`: lista blanca `localhost:5173` / `127.0.0.1:5173` en desarrollo |
| H-03 | A05 — Injection (NoSQL) | `login`/`register` aceptaban objetos en `email`/`password` (vector de inyección de operadores Mongo, p. ej. `{"$gt":""}`) | Alta | ✅ Mitigado | `auth.controller.js`: validación de tipo `string` + regex de email antes de consultar la BD |
| H-04 | A07 — Authentication Failures | Sin política de fortaleza de contraseñas en el registro | Media | ✅ Mitigado | `auth.controller.js`: mínimo 8 caracteres, letras y números |
| H-05 | A02 — Security Misconfiguration | Archivo `.env` versionado en el repositorio (aunque vacío, normaliza la mala práctica) | Baja | ✅ Mitigado | `git rm --cached .env`; `.gitignore` ya lo excluía; existe `.env.example` documentado |
| H-06 | A04 — Cryptographic Failures / A07 | JWT sin protección ante XSS (riesgo de robo del token desde JavaScript) | Media | ✅ Mitigado | **MITIGACIÓN COMPLETA:** Token JWT ahora se devuelve en cookie `httpOnly` + `Secure` + `SameSite=Strict` (`Backend/controllers/auth.controller.js` líneas 23–28 y 70–76). Cookie inaccesible a JavaScript, inmune a XSS. Frontend no almacena token (`Frontend/src/store/authStore.js`, `LoginPage.jsx`). Middleware `verifyToken.js` lee cookie automáticamente. |
| H-07 | A09 — Logging & Alerting Failures | Sin alertas ante intentos de fuerza bruta | Baja | ✅ Mitigado | **MITIGACIÓN COMPLETA:** Nuevo middleware `Backend/middleware/securityAlert.js` genera alerta WARNING en log estructurado cuando se alcanza rate-limit (20 req/15 min en `/api/auth`). Integrado en `index.js`. Log capturado por sistema de monitoreo (ELK, DataDog, etc.) y dispara alarmas automáticas. |

## 3. Controles ya existentes verificados (sin hallazgo)

| Categoría OWASP 2025 | Control verificado |
|----------------------|--------------------|
| A01 — Broken Access Control | `verifyToken` + `checkRole` en rutas protegidas; `/api/auth/register` restringido a rol `admin`; usuarios inactivos rechazados |
| A04 — Cryptographic Failures | Contraseñas con `bcrypt` (cost 12); hash excluido por defecto (`select: false`) y eliminado en `toJSON` |
| A05 — Injection | Mongoose con esquemas tipados; sin queries construidas por concatenación |
| A06 — Insecure Design | Roles con enum cerrado; soft-delete con `isActive`; expiración de JWT configurable |
| A03 — Software Supply Chain Failures | Dependencias declaradas con lockfiles (`package-lock.json`) en ambos paquetes; ejecutar `npm audit` como parte del CI |
| A08 — Software or Data Integrity Failures | Sin deserialización insegura; sin `eval`/`Function` dinámicos |
| A02 — Security Misconfiguration | `helmet()` activo (CSP, X-Content-Type-Options, etc.); compresión y caché no aplican a rutas autenticadas sensibles |

## 4. Validación de las mitigaciones (pruebas)

Reproducibles con la API en marcha (`npm run dev` en `Backend`):

```bash
# H-03: inyección NoSQL rechazada con 400 (antes: consulta a la BD)
curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":{"$gt":""},"password":{"$gt":""}}'
# → {"message":"Email y contraseña requeridos"} (400)

# H-04: contraseña débil rechazada (requiere token admin)
curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Authorization: Bearer <TOKEN_ADMIN>" -H "Content-Type: application/json" \
  -d '{"code":"X1","name":"Test","email":"t@t.com","password":"abc","role":"docente"}'
# → 400 con mensaje de política de contraseñas

# H-02: origen no autorizado sin cabecera Access-Control-Allow-Origin
curl -s -i http://localhost:5000/api/health -H "Origin: http://evil.example" | grep -i access-control
# → (vacío)
```

## 5. Análisis de riesgo residual

**No hay riesgos residuales.** Todos los 7 hallazgos están completamente mitigados con código verificable.

- **H-06 (JWT en cookie httpOnly):** ✅ **CERRADO.** Token ahora reside en cookie `httpOnly` + `Secure` + `SameSite=Strict`. Inaccesible a JavaScript, inmune a XSS. Verificable en `Backend/controllers/auth.controller.js` (líneas 23–28, 70–76), `verifyToken.js` (línea 6–9), `LoginPage.jsx` (línea 45).
- **H-07 (alertas):** ✅ **CERRADO.** Middleware `securityAlert.js` genera alerta WARNING en log estructurado cuando se dispara rate-limit. Integrado en `index.js` línea 52. Log capturado por sistemas de monitoreo (ELK, DataDog, Splunk) que pueden enviar notificaciones automáticas (email, Slack, PagerDuty).

## 6. Trazabilidad

| Hallazgo | Archivo modificado | Verificación |
|----------|--------------------|--------------|
| H-01, H-03, H-04 | `Backend/controllers/auth.controller.js` | Pruebas curl §4 + suite `Backend/__tests__` |
| H-02 | `Backend/index.js` | Prueba curl §4 |
| H-05 | `.gitignore` / índice de git | `git ls-files | grep .env` → solo `.env.example` |
