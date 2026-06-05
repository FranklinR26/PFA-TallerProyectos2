# Entregables Finales del Proyecto

## 1. Resumen Ejecutivo

Este documento presenta los entregables finales del proyecto "Sistema Inteligente de Generación Óptima de Horarios Académicos". El objetivo es demostrar la madurez del trabajo, su alineación con la consigna y la evidencia necesaria para obtener una calificación de sobresaliente.

## 2. Objetivo del Proyecto

- Automatizar la generación de horarios académicos en instituciones con currículo flexible.
- Cumplir estrictamente las restricciones duras del dominio académico.
- Optimizar la calidad de la solución con criterios suaves de preferencia, equidad y eficiencia.
- Mantener una arquitectura modular, documentada y sustentable.

## 3. Alcance de los Entregables

Los entregables finales cubren cuatro dimensiones clave:

1. Documentación técnica y de proyecto
2. Modelado matemático del problema
3. Implementación del motor CSP y de la API REST
4. Evidencia de pruebas, calidad y sostenibilidad

## 4. Entregables Concretos

### 4.1 Documentación de Proyecto
- `docs/Inicio/Documento de inicio.md` — Contexto inicial, problema y propuesta de valor.
- `docs/Inicio/Visión del proyecto.md` — Visión estratégica orientada a resultados y usuarios.
- `docs/Inicio/Especificacion-casos-de-uso.md` — Casos de uso alineados con pruebas automáticas.
- `docs/Inicio/Registro de supuestos y restricciones.md` — Supuestos, restricciones técnicas, académicas y ambientales.
- `docs/Entregables_Finales.md` — Documento de cierre con clave para evaluación sobresaliente.

### 4.2 Modelado y Especificación
- `docs/modelado.md` — Modelado CSP del problema.
- `docs/Planificación/ESPECIFICACION_FORMAL.md` — Definición formal del problema, dominios, variables y restricciones.
- `docs/arquitectura.md` — Arquitectura ARC42 del sistema.

### 4.3 Planificación y Gestión
- `docs/Planificación/CONSTITUTION.md` — Definición de alcance, equipo, restricciones y cronograma.
- `docs/Planificación/BACKLOG_FORMAL.md` — Backlog formal con entregables y milestones.
- `docs/Planificación/SPRINTS_OBJETIVOS.md` — Objetivos de sprint, criterios de aceptación y entregables esperados.
- `docs/Planificación/GESTION_RIESGOS_OPORTUNIDADES.md` — Gestión de riesgos y oportunidades.
- `docs/Planificación/PRESUPUESTO.md` — Presupuesto y evaluación económica del proyecto.
- `docs/Planificación/TEST_REPORT.md` — Resultados de pruebas, cobertura y criterios de validación.

### 4.4 Sostenibilidad y Calidad
- `docs/sostenibilidad.md` — Prácticas de Green Software, métricas CO2 y análisis con GreenFrame.
- `docs/ENTREGABLES_DE_SOSTENIBILIDAD.md` — Resumen de evidencia de sostenibilidad y métricas ambientales.

## 5. Criterios para Sobresaliente

Para obtener sobresaliente se recomienda cumplir con los siguientes criterios:

- Documentación completa y profesional, con orientación técnica y académica.
- Modelado formal claro y coherente con la implementación real.
- Implementación funcional del solver CSP con pruebas automatizadas.
- Uso de un stack moderno y desacoplado (React + Node.js + Express + MongoDB).
- Evidencia de sostenibilidad mediante monitoreo de huella de carbono y reporte GreenFrame.
- Planificación detallada con backlog, riesgos y presupuesto.

## 6. Evidencias Documentales

### Implementación
- Código clave en `Backend/csp/` y `Backend/controllers/`
- Rutas de API en `Backend/routes/`
- Persistencia en `Backend/models/`

### Pruebas
- Tests unitarios y de integración en `Backend/__tests__/`
- Cobertura reportada en `docs/Planificación/TEST_REPORT.md`

### Sostenibilidad
- Middleware `Backend/middleware/co2Monitor.js`
- Configuración de GreenFrame y Docker Compose
- Endpoint público de reporte ambiental

## 7. Conclusión

Esta colección de entregables pone énfasis en la claridad conceptual, la trazabilidad técnica y la evidencia de calidad. Alineado con la consigna, permite mostrar tanto el valor funcional del sistema como su sostenibilidad, lo cual es clave para una calificación de sobresaliente.
