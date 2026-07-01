# Reporte de Auditoría de Dependencias — npm audit

**Proyecto:** HorarioConti — Sistema de Horarios Académicos
**Fecha de ejecución:** 2026-07-01
**Herramienta:** `npm audit` (Node.js 20)

---

## 1. Backend (`TP2-main/Backend`)

**Comando:** `npm audit`

| Severidad | Cantidad |
|-----------|----------|
| Critical | 2 |
| High | 2 |
| Moderate | 7 |
| **Total** | **11** |

### Vulnerabilidades detectadas

| Paquete | Severidad | Descripción | Fix disponible |
|---------|-----------|-------------|----------------|
| `brace-expansion` 5.0.2–5.0.5 | Moderate | Large numeric range defeats `max` DoS protection (GHSA-jxxr-4gwj-5jf2) | `npm audit fix` |
| `esbuild` ≤0.24.2 | Moderate | Cualquier sitio web puede enviar requests al dev server (GHSA-67mh-4wv8-2f99) | Solo en devDependencies (no afecta producción) |
| `form-data` 4.0.0–4.0.5 | High | CRLF injection en nombres de campo multipart (GHSA-hmw2-7cc7-3qxx) | `npm audit fix` |
| `ip-address` ≤10.1.0 | Moderate | XSS en métodos HTML de Address6 (GHSA-v2v4-37r5-5v8g) | `npm audit fix` |
| `qs` 6.11.1–6.15.1 | Moderate | DoS en `qs.stringify` con arrays comma-format (GHSA-q8mj-m7cp-5q26) | `npm audit fix` |

### Análisis de impacto

- **`esbuild`**: Solo presente en devDependencies (Vitest). No se incluye en la imagen Docker de producción (`npm ci --omit=dev`). **Riesgo en producción: NULO.**
- **`form-data`**: Dependencia transitiva de `supertest` (devDependency). No se usa en producción. **Riesgo en producción: NULO.**
- **`ip-address`/`express-rate-limit`**: Fix disponible directamente. Aplicar `npm audit fix`.
- **`qs`**: Dependencia transitiva de Express. Fix disponible.

---

## 2. Frontend (`TP2-main/Frontend`)

**Comando:** `npm audit`

| Severidad | Cantidad |
|-----------|----------|
| High | 8+ |
| Moderate | 6+ |

### Vulnerabilidades detectadas

| Paquete | Severidad | Descripción | Fix disponible |
|---------|-----------|-------------|----------------|
| `dompurify` ≤3.4.10 | Moderate | Bypass de Trusted Types y SAFE_FOR_TEMPLATES (3 CVEs) | `npm audit fix` |
| `esbuild` ≤0.24.2 | Moderate | Dev server expuesto (solo desarrollo) | Solo devDependency |
| `form-data` 4.0.0–4.0.5 | High | CRLF injection (GHSA-hmw2-7cc7-3qxx) | `npm audit fix` |
| `undici` 7.0.0–7.27.2 | High | Múltiples CVEs: TLS bypass, header injection, DoS, response poisoning (7 CVEs) | `npm audit fix` |
| `cookie` <0.7.0 | Moderate | Acepta caracteres fuera de rango en nombre/path/domain | Fix requiere breaking change (msw v2) |
| `uuid` <11.1.1 | Moderate | Missing buffer bounds check en v3/v5/v6 | Fix requiere breaking change |

### Análisis de impacto

- **`dompurify`**: Usado por `jspdf` para sanitizar HTML. Fix disponible sin breaking changes.
- **`undici`**: Dependencia de Playwright (devDependency). No se incluye en producción. **Riesgo: NULO.**
- **`cookie`/`msw`**: Solo en devDependencies (mocking de tests). No afecta producción.
- **`esbuild`/`vite`**: Solo desarrollo y build. La imagen Docker usa nginx para servir archivos estáticos.

---

## 3. Conclusión

| Entorno | Vulnerabilidades en producción | Acción |
|---------|-------------------------------|--------|
| Backend | 2 (moderate en qs, ip-address) | Aplicar `npm audit fix` |
| Frontend | 1 (moderate en dompurify) | Aplicar `npm audit fix` |
| DevDependencies | Múltiples | No afectan producción; actualizar periódicamente |

**Recomendación:** Ejecutar `npm audit fix` en ambos directorios. Las vulnerabilidades restantes requieren breaking changes en dependencias de desarrollo y no afectan la aplicación en producción.

---

## 4. Reproducción

```bash
# Backend
cd TP2-main/Backend
npm audit
npm audit fix

# Frontend
cd TP2-main/Frontend
npm audit
npm audit fix
```
