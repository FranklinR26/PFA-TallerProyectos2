# Guía de capturas de evidencia — Validación (2.4)

Esta guía indica los pasos exactos para generar las evidencias **medidas** que
acompañan al *Informe de Sostenibilidad*. Requiere Docker (lo tienes) y Node 18+.

Guarda **todas** las capturas en: `TP2-main/docs/evidencias/` (crea la carpeta).

---

## 0. Preparación

```bash
cd TP2-main
# instalar dependencias raíz (GreenFrame, Lighthouse, Playwright)
npm install
# instalar dependencias de frontend y backend
cd Frontend && npm install && cd ../Backend && npm install && cd ..
```

---

## 1. Compresión de imágenes (técnica 3) — YA MEDIDA

Reproducible en cualquier momento:

```bash
cd Frontend
npm run images:report   # informe sin escribir
npm run images:optimize # aplica y reporta el ahorro
```

Resultado de referencia (ya aplicado):

| Asset          | Antes   | Después | Ahorro |
|----------------|---------|---------|--------|
| uc-icon.webp   | 3 522 B | 834 B   | -76.3% |

> Captura: salida de `npm run images:optimize` → `evidencias/01-imagenes.png`

---

## 2. Build de Vite — chunks reales (lazy loading + code splitting)

```bash
cd Frontend
npm run build
```

Copia la tabla de chunks que imprime Vite (tamaño raw + gzip por chunk).

> Captura: salida del build → `evidencias/02-build-vite.png`

Valores de referencia ya medidos sobre `dist/` (gzip nivel 6):

| Chunk            | Raw      | Gzip     | Cargado en      |
|------------------|----------|----------|-----------------|
| vendor-pdf       | 430.5 KB | 137.0 KB | solo /evidencias|
| vendor-react     | 219.4 KB | 69.5 KB  | base app        |
| vendor-dnd       | 52.0 KB  | 17.0 KB  | solo /horario   |
| DataPage (lazy)  | 26.1 KB  | 5.4 KB   | solo /datos     |
| SchedulePage     | 14.2 KB  | 4.7 KB   | solo /horario   |
| LoginPage        | 7.9 KB   | 2.8 KB   | carga inicial   |

---

## 3. Compresión gzip de la API — antes/después con DevTools

1. Levanta backend + frontend (o el stack Docker, paso 5).
2. Abre la app, inicia sesión como coordinador y entra a **/datos**.
3. DevTools (F12) → pestaña **Network** → recarga.
4. Localiza la petición **`/api/data/all`**.
   - Columna **Size**: muestra bytes transferidos (gzip) vs tamaño real.
   - En *Headers* verifica `Content-Encoding: gzip`.
5. Compara: una sola petición `/api/data/all` en lugar de 5
   (`teachers`, `classrooms`, `sections`, `courses`, `students`).

> Capturas:
> - `evidencias/03a-network-1request.png` (una sola petición /api/data/all)
> - `evidencias/03b-content-encoding-gzip.png`

Referencia medida sobre payload representativo (40 doc, 25 aulas, 30 cursos, 200 est):

| Respuesta /api/data/all | Sin comprimir | gzip 6  | Reducción |
|-------------------------|---------------|---------|-----------|
| JSON                    | 116.2 KB      | 36.4 KB | -68.7%    |

---

## 4. Lighthouse (rendimiento del cliente)

Con la app corriendo en `http://localhost:5173`:

```bash
cd TP2-main
npx lighthouse http://localhost:5173/login \
  --output=html --output-path=docs/evidencias/04-lighthouse-login.html \
  --chrome-flags="--headless=new" --only-categories=performance,best-practices
```

O en el navegador: DevTools → pestaña **Lighthouse** → *Analyze page load*.

> Captura: panel de puntuaciones (Performance, métricas Core Web Vitals) →
> `evidencias/04-lighthouse.png`

---

## 5. GreenFrame (análisis full-stack con Docker)

```bash
cd TP2-main
npm run sustainability:up        # levanta tp2-frontend, tp2-backend, tp2-mongo
# espera ~20 s a que el stack esté listo
npm run sustainability:analyze   # genera Backend/public/assets/greenframe-latest.json
npm run sustainability:analyze:text
npm run sustainability:down
```

El reporte queda también disponible vía endpoint: `GET /api/sustainability`.

> Capturas:
> - `evidencias/05a-greenframe-cli.png` (salida del análisis: kWh, gCO2e)
> - `evidencias/05b-greenframe-report.png` (contenido del JSON/endpoint)

---

## 6. Dashboard CO2.js (monitoreo en tiempo real)

Con el backend corriendo, genera tráfico usando la app y abre:

```
http://localhost:5000/environmental-impact
```

> Captura: dashboard con indicadores (CO2 total, endpoint más contaminante,
> tabla de registros) → `evidencias/06-dashboard-co2.png`

---

## Checklist de evidencias para el informe

- [ ] 01 — Compresión de imágenes (npm run images:optimize)
- [ ] 02 — Build de Vite con chunks lazy
- [ ] 03 — Network: 1 sola petición /api/data/all + Content-Encoding gzip
- [ ] 04 — Lighthouse (performance)
- [ ] 05 — GreenFrame (kWh / gCO2e)
- [ ] 06 — Dashboard /environmental-impact
