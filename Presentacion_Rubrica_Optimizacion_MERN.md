# Guion (solo MD): Qué decir y qué mostrar — Optimización + Sostenibilidad (Proyecto MERN)

> Usa este guion para cumplir la rúbrica: **5+ impactos**, **3+ oportunidades de mejora**, **3+ mejoras implementadas** (+ optimizaciones adicionales), **técnicas múltiples**, **antes/después con métricas y capturas**, **beneficios medibles**, **repo y trazabilidad**.

---

## 0) Apertura (30–45 s)

### Qué decir
“Voy a presentar un análisis de optimización en un proyecto **MERN (MongoDB, Express, React, Node)** enfocado en **rendimiento** y **sostenibilidad**.  
Voy a: (1) identificar impactos y oportunidades, (2) mostrar mejoras implementadas, (3) validar con evidencias cuantitativas antes/después, y (4) mostrar trazabilidad en GitHub.”

### Qué mostrar
- Estructura del proyecto (carpetas):
  - `TP2-main/Backend`
  - `TP2-main/Frontend`
- (Opcional) Una diapositiva o dibujo rápido: React → Express API → MongoDB.

---

## 1) Impactos relevantes (mínimo 5) vinculados al MERN (2–3 min)

> Aquí NO solo enumeras: haces **análisis crítico** (causa técnica → efecto → evidencia → trade-off).

### Impacto 1 — Payloads grandes (red + memoria) por respuestas sin control
**Qué decir:**  
“En MERN, el frontend consume APIs JSON. Si el backend devuelve listas completas sin control, aumentan los **KB transferidos**, el **tiempo de respuesta**, el **uso de memoria** en cliente y servidor, y el costo energético por red.”
**Qué mostrar:**  
- Endpoint con paginación en backend:
  - `TP2-main/Backend/controllers/data.controller.js` (`getCourses`, `getStudents`) con `?page=&limit=`.
**Evidencia (antes/después):**  
- DevTools → Network: `Transfer Size` y `Time` comparando:
  - `/api/data/courses` vs `/api/data/courses?page=1&limit=20`
**Análisis crítico / trade-off:**  
- “Paginación mejora rendimiento pero exige manejo de `total/pages` en UI y coherencia con filtros/orden.”

### Impacto 2 — Consultas MongoDB costosas (CPU/IO) y patrón N+1
**Qué decir:**  
“En MERN, MongoDB suele ser el cuello de botella. Consultas ineficientes (N+1, traer campos de más, no usar `lean`) elevan CPU/IO en el servidor y degradan tiempos de respuesta.”
**Qué mostrar:**  
- Optimización de consulta en:
  - `TP2-main/Backend/controllers/data.controller.js` (`getCourses`)
  - uso de `.select(...)`, `.lean()`, y agregación `Student.aggregate([...])` para evitar múltiples consultas.
**Evidencia (antes/después):**  
- Tiempo de respuesta del endpoint en ms (logs / Postman / curl).  
- (Opcional) `explain("executionStats")` si lo tienen.
**Análisis crítico / trade-off:**  
- “Agregaciones reducen round-trips pero pueden exigir más diseño y pruebas para no romper consistencia de datos.”

### Impacto 3 — Bundle inicial grande en React (CPU + TTI + energía del cliente)
**Qué decir:**  
“En React, un bundle inicial grande implica más descarga y más trabajo del navegador (parse/compile), afectando **LCP/TTI** y consumo energético, especialmente en móviles.”
**Qué mostrar:**  
- Lazy loading en frontend:
  - `TP2-main/Frontend/src/App.jsx` con `lazy(() => import(...))` y `Suspense`.
**Evidencia (antes/después):**  
- DevTools → Network: ver que los chunks de páginas se cargan al navegar, no al inicio.  
- Lighthouse: mejora en Performance (o reducción de JS initial load).
**Análisis crítico / trade-off:**  
- “Lazy loading introduce cargas diferidas; se mitiga con `fallback` y precarga en rutas críticas si hace falta.”

### Impacto 4 — Imágenes pesadas (red + almacenamiento + tiempo de carga)
**Qué decir:**  
“Las imágenes suelen ser el mayor peso en web. Reducirlas baja transferencia, acelera cargas y reduce energía consumida por red.”
**Qué mostrar:**  
- Script de compresión:
  - `TP2-main/Frontend/scripts/optimize-images.mjs` (convierte PNG/JPG a WebP si reduce tamaño).
**Evidencia (antes/después):**  
- Output del script con KB antes/después (captura).  
- Network: imágenes `.png/.jpg` vs `.webp` y su `transfer size`.
**Análisis crítico / trade-off:**  
- “WebP mejora tamaño pero requiere validar compatibilidad; hoy es ampliamente soportado.”

### Impacto 5 — Muchas solicitudes HTTP repetidas (latencia + energía por tráfico)
**Qué decir:**  
“Cada request tiene costo fijo (handshake, headers, latencia). Muchas solicitudes repetidas elevan tiempos y consumo de red.”
**Qué mostrar:**  
- Cache en backend para GET:
  - `TP2-main/Backend/middleware/cache.js` y su uso en `TP2-main/Backend/index.js`.
- Cache de estáticos:
  - `express.static(... { maxAge: '30d', immutable: true, etag: true })` en `TP2-main/Backend/index.js`.
**Evidencia (antes/después):**  
- 2 llamadas seguidas a un GET con `_cached: true` en la segunda (captura).  
- Network: `304 Not Modified` en assets (cuando aplica).
**Análisis crítico / trade-off:**  
- “La caché requiere TTL e invalidación; si TTL es alto puede servir datos desactualizados.”

### Impacto 6 (extra recomendado) — Respuestas sin compresión (más KB por API)
**Qué decir:**  
“Sin compresión, JSON viaja con más KB. En MERN, APIs devuelven JSON y se benefician de gzip/brotli.”
**Qué mostrar:**  
- `compression({ level: 6, threshold: 1024 })` en `TP2-main/Backend/index.js`.
**Evidencia (antes/después):**  
- Network: header `content-encoding: gzip` y reducción de `transfer size`.
**Análisis crítico / trade-off:**  
- “Compresión usa CPU; conviene balancear nivel/threshold (por eso se configura).”

---

## 2) Oportunidades de mejora (mínimo 3) con criterios de rendimiento + sostenibilidad (2–3 min)

### Oportunidad 1 — Estandarizar paginación y evitar “devolver todo”
**Qué decir:**  
“Oportunidad: convertir endpoints de listas a paginados por defecto.  
Rendimiento: reduce payload/latencia.  
Sostenibilidad: baja transferencia y trabajo de renderizado en cliente.”
**Qué mostrar:**  
- Diseño del contrato: `?page` / `?limit` y respuesta `{ data, total, page, pages }`.
- Capturas comparativas en Network.

### Oportunidad 2 — Optimización sistemática de consultas (select/lean/índices)
**Qué decir:**  
“Oportunidad: revisar consultas críticas y aplicar `select`, `lean` y, si aplica, **índices** en campos usados en `sort`/`match`.  
Rendimiento: menos CPU/IO.  
Sostenibilidad: menor energía por request y menor tiempo de cómputo total.”
**Qué mostrar:**  
- Ejemplo real en `data.controller.js` (ya optimizado) como patrón replicable.  
- (Si aplica) Mostrar índices en MongoDB Compass o script.

### Oportunidad 3 — Optimización de assets (imágenes y cache) como política de build
**Qué decir:**  
“Oportunidad: automatizar optimización de imágenes y cacheo agresivo de assets.  
Rendimiento: menos KB y menos requests repetidas.  
Sostenibilidad: baja consumo de datos y energía del cliente.”
**Qué mostrar:**  
- `optimize-images.mjs` y su comando npm.  
- `express.static` con `maxAge/immutable/etag`.

### Oportunidad 4 (extra recomendado) — Reducir dependencias y mejorar tiempos de CI/CD
**Qué decir:**  
“Oportunidad: auditar dependencias no usadas.  
Rendimiento: builds más rápidos.  
Sostenibilidad: menos cómputo y descargas en cada pipeline/instalación.”
**Qué mostrar:**  
- `package.json` y `npm ls --depth=0` (captura).

---

## 3) Mejoras implementadas (mínimo 3) + optimizaciones adicionales (6–8 min)

> Para cada mejora: **qué problema** → **qué cambio** → **cómo verifico**.

### Mejora 1 — Optimización MongoDB/Mongoose (consultas)
**Qué decir:**  
“Implementamos optimización de consultas: `select` + `lean` + agregación para evitar N+1.”
**Qué mostrar:**  
- `TP2-main/Backend/controllers/data.controller.js` (`getCourses`) y el bloque de `Student.aggregate`.
**Verificación:**  
- Comparar tiempo de respuesta (ms) del endpoint antes vs después.

### Mejora 2 — Paginación en endpoints de listas
**Qué decir:**  
“Implementamos paginación para reducir payload y mejorar escalabilidad.”
**Qué mostrar:**  
- `getCourses` y `getStudents` con `skip/limit` y retorno `{ total, page, pages }`.
**Verificación:**  
- Request con y sin `page/limit` mostrando reducción de KB y tiempo.

### Mejora 3 — Compresión de imágenes (WebP)
**Qué decir:**  
“Automatizamos compresión de imágenes y conversión a WebP cuando reduce tamaño.”
**Qué mostrar:**  
- `TP2-main/Frontend/scripts/optimize-images.mjs`
- Ejecutar (o mostrar captura del resultado) de `npm run images:optimize`.
**Verificación:**  
- Network: menor transfer size en imágenes.

### Mejora 4 — Lazy loading en React (solicitada)
**Qué decir:**  
“Aplicamos lazy loading para disminuir el bundle inicial y mejorar la carga.”
**Qué mostrar:**  
- `TP2-main/Frontend/src/App.jsx` con `lazy` + `Suspense`.
**Verificación:**  
- Network: chunks cargados al navegar a rutas específicas.

### Mejora 5 — Caché (solicitada) + reducción de solicitudes HTTP
**Qué decir:**  
“Implementamos caché de respuestas GET y cache de estáticos para evitar recomputación y descargas repetidas.”
**Qué mostrar:**  
- `TP2-main/Backend/middleware/cache.js`
- `TP2-main/Backend/index.js` donde se aplica a `/api/data`, `/api/metrics`, `/api/periods` y `/assets`.
**Verificación:**  
- Segunda llamada devuelve `_cached: true` (captura).  
- Assets con 304/desde cache (captura).

### Optimizaciones adicionales NO solicitadas (para sumar rúbrica)
**Qué decir:**  
“Además de lo solicitado, incorporamos optimizaciones de API y operación segura/estable.”
**Qué mostrar (elige las que tengas):**
- `rateLimit` en `/api/auth` (`TP2-main/Backend/index.js`) → protección y estabilidad.
- `helmet()` → mejores prácticas de seguridad (evita sobrecosto por ataques triviales).
- `/api/health` → endpoint de salud para ver estado y targets.
- Monitoreo:
  - `performanceMonitor` y `co2Monitor()` (si lo están usando en el proyecto).

---

## 4) Técnicas aplicadas y reducción medible (antes/después) (3–5 min)

### Qué decir
“Para demostrar mejora real, comparamos **métricas cuantitativas** antes/después. No basta con percepción.”

### Qué mostrar (tabla para llenar con TUS datos)
> Pega capturas y pon los valores reales.

| Categoría | Métrica | Antes | Después | Evidencia (captura/enlace) |
|---|---|---:|---:|---|
| Frontend | Lighthouse Performance | ___ | ___ | `docs/evidencias/...` |
| Frontend | Requests carga inicial | ___ | ___ | DevTools Network |
| Frontend | Transferencia total (KB/MB) | ___ | ___ | DevTools Network |
| Frontend | Tamaño JS inicial (KB/MB) | ___ | ___ | Network / build |
| Backend/API | Tiempo endpoint X (ms) | ___ | ___ | Postman/curl/log |
| Backend/API | Tamaño respuesta endpoint X (KB) | ___ | ___ | Network |
| Backend/API | Compresión activa (gzip) | No/Sí | Sí | Headers |
| Caché | `_cached: true` en 2da llamada | No | Sí | Captura JSON |

### Capturas mínimas (checklist)
- [ ] Lighthouse “ANTES” (Performance)  
- [ ] Lighthouse “DESPUÉS” (Performance)  
- [ ] Network “ANTES” (requests + transfer)  
- [ ] Network “DESPUÉS” (requests + transfer)  
- [ ] Comparación endpoint sin paginación vs con paginación  
- [ ] Evidencia caché (`_cached: true` / 304 / from disk cache)  
- [ ] Evidencia imágenes (antes PNG/JPG vs después WebP)  

---

## 5) Beneficios medibles relacionados con sostenibilidad y eficiencia (1–2 min)

### Qué decir
“Los beneficios se reflejan en indicadores: menos **KB**, menos **requests**, menor **tiempo de respuesta**, menor **carga de CPU** y menor trabajo del cliente.  
Esto contribuye a sostenibilidad porque reduce consumo energético por: (1) menos transferencia de red, (2) menos cómputo en servidor, y (3) menos trabajo del navegador.”

### Qué mostrar
- La tabla de métricas completada.
- 2–3 capturas clave (Lighthouse + Network + caché).

---

## 6) Repositorio actualizado: commits, documentación y trazabilidad (1–2 min)

### Qué decir
“Todas las mejoras están integradas y verificables en el repositorio, con commits claros y documentación que permite replicar el proceso.”

### Qué mostrar (GitHub)
- Historial de commits (evidencia de trazabilidad):
  - commits separados por tipo: `perf(mongo)`, `perf(api)`, `perf(frontend)`, `perf(images)`, etc.
- Archivos/documentación:
  - `README` o sección `docs/` explicando:
    - qué se optimizó
    - cómo ejecutar mediciones (Lighthouse/Network)
    - cómo ejecutar script de imágenes
    - endpoints con paginación
- Carpeta de evidencias:
  - `docs/evidencias/` con capturas antes/después (ordenadas).

---

## 7) Cierre (30–45 s)

### Qué decir
“Cumplimos la rúbrica al identificar impactos y oportunidades, implementar mejoras verificables y demostrar evidencia cuantitativa del antes/después.  
Los resultados mejoran rendimiento y, en paralelo, sostenibilidad al reducir consumo de recursos en red, servidor y cliente.”

### Qué mostrar
- Una diapositiva/tabla final con los 3–5 números más fuertes (antes vs después).

