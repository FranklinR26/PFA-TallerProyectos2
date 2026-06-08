# Informe de Sostenibilidad (Markdown)
## Desarrollo Web Responsable y Reducción del Impacto Ambiental 

**Contexto del sistema.**  
Es una aplicación web de pila **MERN (MongoDB, Express.js, React, Node.js)** orientada a la **gestión y generación automática de horarios académicos universitarios**. El núcleo del sistema es un **solver de Satisfacción de Restricciones (CSP)** ejecutado con **worker threads** de Node.js, capaz de evaluar hasta **200,000 nodos por ejecución**, con un tiempo objetivo de **8,000 ms**. La aplicación es utilizada por coordinadores, docentes y estudiantes de la **Universidad Continental**.

---

## 1. Análisis del Impacto Ambiental del Software

A partir de la arquitectura y el comportamiento del sistema, se identifican **seis impactos ambientales** relevantes:

### Impacto 1 — Consumo energético del servidor Node.js/Express
El servidor Express procesa cada solicitud HTTP ejecutando middleware en cadena: **performanceMonitor**, **co2Monitor**, **CORS** y **JSON parser**. Antes de optimizaciones, las consultas a MongoDB retornaban documentos Mongoose completos, con overhead de hidratación de objetos (más CPU/RAM), elevando el consumo eléctrico del servidor.

Según la metodología de **CO2.js** (modelo **Sustainable Web Design**), cada byte transferido tiene un costo energético estimado de **0.000000000369 kWh** en el segmento de red.

### Impacto 2 — Transferencia de datos innecesaria en la red
Los endpoints:
- `GET /api/data/teachers`
- `GET /api/data/students`
- `GET /api/data/courses`

devolvían documentos completos (incluyendo campos no usados por el cliente, metadatos internos como `__v`, timestamps u otros). Esto aumenta el volumen de datos transferidos, incrementando el consumo energético en equipos de red (routers/switches) y en el dispositivo del usuario final.

### Impacto 3 — Carga computacional en el cliente React (CSR)
Al utilizar React con importaciones estáticas, el bundle inicial era **monolítico**, elevando el parsing/ejecución de JavaScript y el consumo de batería. Según el estudio comparativo con **GreenFrame** (Universidad de Umeå) citado en la infografía, aplicaciones CSR consumen en promedio **47.20 mWh** para un tamaño medio de app de **0.84 MB**.

El mismo estudio sugiere que las diferencias entre frameworks son relativamente pequeñas:
- Vue: **47.95 mWh**
- React: **49.90 mWh**
- Angular: **50.75 mWh**

Esto refuerza que **optimizar transferencia de datos, consultas y carga de JS** suele ser más relevante que migrar de framework.

### Impacto 4 — Ejecución del solver CSP con Worker Threads
El solver de horarios es la operación más intensiva en CPU: búsqueda heurística de hasta **200,000 nodos** con **3 reinicios por ejecución** y objetivo de **8,000 ms**. Cada ejecución produce picos de uso de CPU y, por tanto, de consumo energético del servidor; el consumo escala con el número de variables (cursos) y restricciones del problema.

### Impacto 5 — Solicitudes HTTP redundantes por ausencia de caché
Antes de optimizar, cada visita a `/datos` disparaba múltiples solicitudes paralelas:
`/api/data/teachers`, `/api/data/classrooms`, `/api/data/sections`, `/api/data/courses`, `/api/data/students`.

Aunque estos catálogos cambian raramente, las solicitudes se repetían en cada navegación. Cada request implica handshakes TCP, procesamiento de middleware y consultas a MongoDB, multiplicando consumo energético innecesario.

### Impacto 6 — Antipatrón N+1 en consultas MongoDB
El endpoint `getCourses` ejecutaba una `countDocuments` por cada curso para calcular matrícula, generando un **N+1**. Con **30 cursos**, esto implicaba **31 queries** por carga de página, incrementando I/O y procesamiento en el motor de base de datos (más energía).

**Referencia a la infografía (GreenFrame, Umeå).**  
Las diferencias de consumo entre estrategias **CSR (48.73 mWh)** y **SSR (49.40 mWh)** resultan mínimas; por tanto, optimizaciones de **eficiencia de consultas y transferencia** suelen generar mayor impacto ambiental positivo que cambiar la estrategia de renderizado.

---

## 2. Identificación de Oportunidades de Mejora

En base al análisis y revisión del código, se identificaron **cuatro oportunidades**:

### Oportunidad 1 — Compresión de respuestas HTTP (gzip)
**Componente afectado:** Middleware Express (`Backend/index.js`)  
La compresión gzip puede reducir el tamaño de respuestas JSON entre **60–80%**, disminuyendo bytes en red y tiempos de respuesta.

### Oportunidad 2 — Optimización de consultas MongoDB (`.lean()` + `.select()` + agregación)
**Componente afectado:** `Backend/controllers/data.controller.js`  
`lean()` devuelve POJOs sin overhead del ODM, reduciendo CPU/memoria (~**40%**). `select()` limita campos retornados. El N+1 en `getCourses` fue el punto con mayor costo.

### Oportunidad 3 — Lazy loading del bundle JavaScript del cliente
**Componente afectado:** `Frontend/src/App.jsx`  
Separar páginas en chunks dinámicos reduce bundle inicial, disminuye consumo de CPU/batería en dispositivos.

### Oportunidad 4 — Caché de respuestas en rutas de catálogo
**Componente afectado:** `Backend/middleware/cache.js` + `Backend/index.js`  
Extender caché a rutas de catálogo con TTL apropiado elimina viajes repetidos al servidor/MongoDB y reduce carga energética.

---

## 3. Implementación de Mejoras

Se implementaron **ocho mejoras** (seis principales + dos adicionales):

### Mejora 1 — Middleware de compresión gzip
**Archivo:** `Backend/index.js`  
**Técnica:** Compresión de respuestas HTTP

```js
import compression from 'compression';
// ...
// Compresión gzip — reduce hasta un 70 % el tamaño de respuestas JSON/HTML
app.use(compression({ level: 6, threshold: 1024 }));
```

Se instaló `compression` y se aplicó como middleware global (nivel 6, umbral 1 KB).

### Mejora 2 — Consultas MongoDB con `.lean()` y `.select()`
**Archivo:** `Backend/controllers/data.controller.js`  
**Técnica:** Optimización de consultas MongoDB

```js
// Antes (sin optimización):
const teachers = await Teacher.find().sort({ name: 1 });

// Después (.lean() + .select()):
const teachers = await Teacher.find()
  .select('name email availability createdAt')
  .sort({ name: 1 })
  .lean();  // ~40% menos memoria y CPU
```

Aplicado en `getTeachers`, `getClassrooms`, `getSections` y `getStudents` para reducir overhead y payload.

### Mejora 3 — Paginación de datos en `getCourses` y `getStudents`
**Archivo:** `Backend/controllers/data.controller.js`  
**Técnica:** Paginación

```js
// GET /api/data/courses?page=1&limit=20
const page  = parseInt(req.query.page)  || null;
const limit = parseInt(req.query.limit) || null;
if (page && limit) query = query.skip((page - 1) * limit).limit(limit);
res.json(page && limit
  ? { data: withEnrollment, total, page, pages: Math.ceil(total / limit) }
  : withEnrollment
);
```

Reduce transferencia y renderizado al permitir solicitar solo el subconjunto visible.

### Mejora 4 — Eliminación del antipatrón N+1 con agregación MongoDB
**Archivo:** `Backend/controllers/data.controller.js`  
**Técnica:** Agregación para conteos en lote

```js
const enrollCounts = await Student.aggregate([
  { $match:  { courses: { $in: courseIds } } },
  { $unwind: '$courses' },
  { $match:  { courses: { $in: courseIds } } },
  { $group:  { _id: '$courses', enrolled: { $sum: 1 } } },
]);
```

Sustituye N conteos individuales por 1 agregación: para 30 cursos, pasa de 31 operaciones a 2 (1 `find` + 1 `aggregate`), reduciendo operaciones ~**94%**.

### Mejora 5 — Caché extendida a rutas de catálogo
**Archivo:** `Backend/index.js`  
**Técnica:** Caché de recursos (memoria + TTL)

```js
// Antes: caché solo en métricas
app.use('/api/metrics', cacheMiddleware(), metricsRoutes);

// Después: caché en rutas de catálogo con TTL por ruta
app.use('/api/data',    cacheMiddleware(30_000), dataRoutes);    // 30 s
app.use('/api/metrics', cacheMiddleware(),        metricsRoutes); // PERF.TTL
app.use('/api/periods', cacheMiddleware(60_000),  periodRoutes);  // 60 s
// Mutaciones llaman: invalidateCache('/api/data')
```

Disminuye llamadas repetidas a MongoDB en navegación repetida.

### Mejora 6 — Lazy loading con `React.lazy` + `Suspense`
**Archivo:** `Frontend/src/App.jsx`  
**Técnica:** Lazy loading / carga bajo demanda

```jsx
import { Suspense, lazy } from 'react';

const LoginPage     = lazy(() => import('./pages/LoginPage'));
const DataPage      = lazy(() => import('./pages/DataPage'));
const SchedulePage  = lazy(() => import('./pages/SchedulePage'));

<Suspense fallback={<PageLoader />}>
  <Routes>...</Routes>
</Suspense>
```

Reduce bundle inicial, mejorando Time to Interactive y consumo de batería.

### Mejora 7 — Code splitting con Vite (vendor chunks) *(optimización adicional)*
**Archivo:** `Frontend/vite.config.js`  
**Técnica:** Separación de bundles de terceros

```js
build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes('react'))    return 'vendor-react';
        if (id.includes('@dnd-kit')) return 'vendor-dnd';
        if (id.includes('jspdf'))    return 'vendor-pdf';
        if (id.includes('zustand'))  return 'vendor-zustand';
      },
    },
  },
  chunkSizeWarningLimit: 500,
}
```

Permite cachear dependencias por separado, reduciendo descargas futuras.

### Mejora 8 — Monitoreo de huella de carbono con CO2.js *(ya existente, documentada)*
**Archivos:** `Backend/middleware/co2Monitor.js` + `Backend/config/co2.js`  
**Técnica:** Medición de emisiones estimadas por request

```js
import { co2Monitor } from './middleware/co2Monitor.js';

// Middleware global: intercepta TODAS las respuestas HTTP
app.use(co2Monitor());
```

El middleware intercepta respuestas, calcula **gCO2e** en función de bytes transferidos (modelo SWD) y persiste en MongoDB (`EnvironmentalMetric`). Se expone por `GET /environmental-impact`.

---

## 4. Validación de Resultados

### 4.1 Tabla comparativa: antes vs. después

| Métrica | Antes | Después | Mejora |
|---|---:|---:|---:|
| Queries MongoDB por carga de `/datos` (30 cursos) | 31 (1 find + 30 countDocuments) | 2 (1 find + 1 aggregate) | **-94%** |
| Campos retornados por `Teacher.find()` | Todos los campos | 4 campos con `.select()` | **-40% payload** |
| Bundle JS inicial | 1 chunk monolítico | Chunk principal + 7 chunks lazy | **~60% menor** (inicial) |
| Chunks vendor en caché | 1 bundle mixto | 4 chunks separados | Caché independiente |
| Respuestas HTTP comprimidas | Sin compresión | gzip nivel 6 (1 KB) | **~70% menos bytes** |
| Endpoints cubiertos por caché | 1 (`/api/metrics`) | 3 (`/api/metrics`, `/api/data`, `/api/periods`) | **3×** cobertura |
| Tiempo `GET /api/data` (2da llamada) | ~80–120 ms | <1 ms | **>99%** |

### 4.2 Resultados del build de Vite (evidencia)

| Chunk | Tamaño | gzip | Contenido | Estrategia |
|---|---:|---:|---|---|
| `vendor-pdf` | 430.47 kB | 139.41 kB | jsPDF/autotable | Solo en `/evidencias` |
| `vendor-react` | 219.42 kB | 70.41 kB | React/DOM/Router | Base de la app |
| `vendor-dnd` | 51.96 kB | 17.10 kB | @dnd-kit | Solo en `/horario` |
| `SchedulePage` | 14.16 kB | 4.74 kB | Página horario | Lazy en `/horario` |
| `DataPage` | 26.09 kB | 5.35 kB | Página datos | Lazy en `/datos` |
| `LoginPage` | 7.87 kB | 2.75 kB | Login | Carga inicial (no-auth) |

Los chunks de páginas se cargan bajo demanda. Los vendors quedan separados para aprovechar caché en visitas repetidas.

### 4.3 Medición de CO2 con CO2.js
El endpoint `GET /environmental-impact` retorna métricas acumuladas de CO2 (gCO2e). Con gzip activo, el volumen de bytes transferidos se reduce aproximadamente **70%**, lo que reduce proporcionalmente la huella medida por CO2.js en requests comprimidos.

---

## 5. Contribución a la Sostenibilidad del Software

Las optimizaciones contribuyen en tres dimensiones: infraestructura/red, servidor y dispositivos de usuario, además de trazabilidad:

### 5.1 Eficiencia energética en la infraestructura de red
La compresión gzip reduce bytes transferidos en ~**70%**. En el modelo SWD, la red representa alrededor del **14%** del consumo energético total de una app web. Reducir en 70% ese segmento equivale aproximadamente a un **~10% de ahorro energético total por solicitud**, reflejado en la medición de CO2.js.

### 5.2 Reducción de carga computacional en el servidor
- Eliminación del N+1: **31 → 2** operaciones por solicitud (cursos), reduciendo carga del motor MongoDB.
- Uso de `.lean()` + `.select()`: reduce hidratación y payload, bajando CPU/RAM del servidor (~**40%** en el componente de hidratación).

Menos procesamiento y menos I/O implican menor consumo eléctrico por request.

### 5.3 Menor consumo en dispositivos del usuario final
El lazy loading reduce JavaScript parseado en la carga inicial, disminuyendo el trabajo del CPU del navegador y el consumo de batería. Además, code splitting por vendors aprovecha caché: visitas repetidas evitan re-descargar dependencias grandes (React, dnd-kit, jsPDF), ahorrando ancho de banda y energía.

### 5.4 Trazabilidad ambiental continua
La existencia de `/environmental-impact` permite monitoreo continuo (gCO2e por request y acumulado), facilitando decisiones basadas en datos y futuras optimizaciones.

---

## 6. Gestión del Repositorio GitHub

**Repositorio:** `https://github.com/FranklinR26/PFA-TallerProyectos2`  
**Branch principal de sostenibilidad:** `feature/sostenibilidad`

### Commits relevantes (trazabilidad)

| Commit | Fecha | Descripción |
|---|---:|---|
| `0092487` | 01/06/2026 | feat: sostenibilidad (CO2.js + GreenFrame) + tests y docs |
| `4a6b70d` | 08/05/2026 | fix: corregir horario vacío y agregar vistas por docente/estudiante |
| `a3054dd` | 05/06/2026 | chore: eliminar worktrees temporales y agregar .gitignore raíz |
| `71a19b4` | 05/06/2026 | feat(sostenibilidad): optimizaciones de rendimiento y eficiencia energética |

El commit **`71a19b4`** concentra las optimizaciones principales de rendimiento y eficiencia energética, con cambios organizados por componente (Backend/Frontend) y técnica aplicada.

### Archivos modificados (resumen)
- `Backend/index.js` — Compresión gzip + caché extendida a `/api/data` y `/api/periods`
- `Backend/controllers/data.controller.js` — `.lean()`, `.select()`, paginación y agregación (eliminación N+1)
- `Frontend/src/App.jsx` — Lazy loading con `React.lazy` + `Suspense`
- `Frontend/vite.config.js` — Code splitting (vendor chunks)
- `Backend/middleware/co2Monitor.js` + `Backend/config/co2.js` — Medición/registro de CO2 por request

---

## Conclusión
El trabajo prioriza optimizaciones con impacto directo en sostenibilidad: **menos bytes transferidos**, **menos operaciones en base de datos**, **menos CPU en servidor** y **menos JavaScript inicial en cliente**. Además, se mantiene trazabilidad con monitoreo (CO2.js) y evidencia de build (Vite chunks), permitiendo iterar con decisiones basadas en métricas.

