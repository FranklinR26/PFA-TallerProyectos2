# Entregables de Sostenibilidad del Proyecto

## 1. Introducción

Este archivo documenta los entregables relacionados con sostenibilidad y Green Software dentro del proyecto de generación de horarios académicos. La idea es demostrar que el desarrollo no solo cumple requisitos funcionales, sino también criterios ambientales y de eficiencia energética.

## 2. Características de Sostenibilidad Implementadas

### 2.1 Monitoreo de huella de carbono

- `Backend/config/co2.js` — Configuración de la librería de cálculo de emisiones CO₂.
- `Backend/middleware/co2Monitor.js` — Middleware que mide bytes, tiempo de respuesta y estima CO₂ por request.
- `Backend/models/EnvironmentalMetric.js` — Modelo que persiste métricas ambientales en MongoDB.
- `Backend/controllers/environmental.controller.js` — Dashboard público de impacto ambiental.

### 2.2 Análisis de Green Software con GreenFrame

- `.greenframe.yml` — Configuración del análisis con contenedores y escenarios de prueba.
- `scenario.js` — Escenario de navegación que simula el flujo crítico del sistema.
- `docker-compose.yml` — Stack completo para análisis full-stack.
- `Backend/public/assets/greenframe-latest.json` (generado) — Reporte de análisis.

### 2.3 Endpoint de reporte

- `Backend/routes/sustainability.routes.js` — Ruta pública de reporte de sostenibilidad.
- `Backend/controllers/sustainability.controller.js` — Sirve el reporte GreenFrame y métricas de impacto.

## 3. Evidencia de Calidad Ambiental

### 3.1 Métricas observables

- CO₂ estimado por request.
- Tiempo de respuesta del backend.
- Volumen de datos transferidos por endpoint.
- Ranking de rutas según impacto ambiental.

### 3.2 Buenas prácticas adoptadas

- Optimización de middleware para evitar bloqueos de I/O.
- Persistencia no bloqueante de métricas ambientales.
- Uso de Docker para analizar el impacto del sistema completo.
- Exposición de métricas públicas con bajo riesgo de seguridad.

## 4. Validación para Sobresaliente

Para una evaluación sobresaliente, entregue además:

- Capturas del dashboard de impacto `GET /environmental-impact`.
- Resultados de `npm run sustainability:analyze` con el reporte GreenFrame.
- Ejemplos de mejoras aplicadas en base al análisis ambiental.
- Un resumen de cómo la solución reduce costos energéticos y mejora la eficiencia operativa.

## 5. Conclusión

La sostenibilidad es un componente esencial de la solución. Su integración en el proyecto demuestra un enfoque profesional y moderno, alineado con las mejores prácticas de ingeniería de software y con los requisitos de la consigna sobre Green Software.
