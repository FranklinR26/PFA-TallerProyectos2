#!/usr/bin/env markdown
# Sostenibilidad: CO2.js + GreenFrame

Este documento describe las dos *features* de sostenibilidad integradas al proyecto:

1) **Monitoreo por request en Backend (CO2.js)**  
2) **Análisis full-stack con Docker (GreenFrame) + endpoint público de reporte**

---

## 1) CO2.js (Backend) — monitoreo por endpoint + dashboard

### Objetivo
Medir la huella de carbono estimada (CO₂ eq.) por cada respuesta HTTP generada por el backend y exponer un **dashboard público** para visualizar métricas agregadas y el historial reciente.

### Componentes
- `Backend/config/co2.js`  
  Wrapper del modelo **Sustainable Web Design (SWD)** usando `@tgwf/co2`.

- `Backend/middleware/co2Monitor.js`  
  Middleware global que:
  - Cuenta bytes transferidos envolviendo `res.write`/`res.end`.
  - Mide tiempo de respuesta.
  - Calcula CO₂ estimado con CO2.js.
  - Persiste en MongoDB (modo “fire-and-forget”, no bloquea la respuesta).

- `Backend/models/EnvironmentalMetric.js`  
  Colección `environmental_metrics` con:
  `method`, `route`, `statusCode`, `bytes`, `co2Grams`, `responseTimeMs`, `timestamp`.

- `Backend/config/db.js`  
  Incluye `clearEnvironmentalMetrics()` que **borra el historial una única vez** durante el arranque del servidor (inicia una nueva sesión).

- `Backend/controllers/environmental.controller.js` + `Backend/routes/environmental.routes.js`  
  **Dashboard público**: `GET /environmental-impact`
  - Indicadores generales (totales, promedios, endpoint más contaminante / más usado).
  - Ranking por CO₂ total.
  - Tabla de registros recientes (orden por fecha descendente, con scroll).

### Cómo validar
1. Levanta el backend (MongoDB debe estar disponible con `MONGO_URI`).
2. Usa la app normalmente (genera tráfico).
3. Abre en el navegador:
   - `http://localhost:5000/environmental-impact`

> Nota: el dashboard está renderizado server-side (HTML) y es público (sin auth).

---

## 2) GreenFrame (Full-stack) — reporte y endpoint público

### Objetivo
Ejecutar **GreenFrame CLI** para analizar el proyecto MERN (React + Express + MongoDB con Docker) y exponer el **último reporte** mediante un endpoint público del backend.

### Archivos clave (raíz del proyecto)
- `.greenframe.yml`  
  Configura:
  - `containers`: frontend + backend
  - `databaseContainers`: **MongoDB separado** (importante para el cálculo I/O)
  - escenario Playwright

- `scenario.js`  
  Escenario interactivo (Playwright) de duración >= 10 s (flujo crítico).

- `docker-compose.yml`  
  Define contenedores con nombres consistentes con `.greenframe.yml`:
  `tp2-frontend`, `tp2-backend`, `tp2-mongo`.

### Scripts
En `TP2-main/package.json`:
- `npm run sustainability:up`  
  Levanta el stack con Docker Compose.
- `npm run sustainability:analyze`  
  Ejecuta `greenframe analyze --format=json` y guarda en:
  `Backend/public/assets/greenframe-latest.json`
- `npm run sustainability:analyze:text`  
  Guarda el reporte como texto en:
  `Backend/public/assets/greenframe-latest.txt`

### Endpoint público de reporte
En el backend:
- `GET /api/sustainability`
  - Si existe reporte → `200` con JSON (si se generó `.json`) o texto plano.
  - Si no existe → `404` con mensaje indicando ejecutar el análisis.

**Importante:** el endpoint solo lee y sirve el archivo local de resultados; no expone tokens ni variables de entorno.

---

## Tests (Vitest)
Los tests agregados viven en `Backend/__tests__/`:
- `co2Monitor.test.js`
- `environmental.controller.test.js`
- `sustainability.controller.test.js`

Ejecutar:
```bash
cd Backend
npm test
```

