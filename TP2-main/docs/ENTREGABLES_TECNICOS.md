# Entregables Técnicos del Proyecto

## 1. Descripción

Este documento agrupa los entregables técnicos críticos que demuestran la solidez del proyecto, la calidad de la implementación y la correspondencia entre el modelado, la arquitectura y la solución final.

## 2. Componentes Técnicos Entregables

### 2.1 Modelo de Negocio y CSP
- `docs/modelado.md` — Modelado del problema como CSP.
- `docs/Planificación/ESPECIFICACION_FORMAL.md` — Especificación formal de variables, dominios, restricciones y función objetivo.
- `Backend/csp/constraints.js` — Implementación de restricciones duras y blandas.
- `Backend/csp/variables.js` — Construcción de dominios y variables del solver.

### 2.2 Arquitectura de Software
- `docs/arquitectura.md` — Diagrama de contenedores, componentes y decisiones arquitectónicas.
- `Backend/index.js` — Orquestación de rutas y middleware.
- `Frontend/src/` — Interfaz de usuario bajo React.
- `docker-compose.yml` — Definición del stack de desarrollo completo.

### 2.3 API y Persistencia
- `Backend/routes/` — Endpoints REST para horarios, docentes, cursos, métricas y sostenibilidad.
- `Backend/models/` — Modelos de datos para MongoDB.
- `Backend/controllers/` — Controladores que separan lógica de negocio y presentación.

### 2.4 Pruebas y Calidad
- `docs/Planificación/TEST_REPORT.md` — Reporte de pruebas, cobertura y resultados.
- `Backend/__tests__/` — Suite de tests TDD que cubre solver, restricciones, métricas y controladores.
- `vitest.config.js` — Configuración de pruebas.

## 3. Criterios de Aceptación Técnica

- El solver CSP debe resolver horarios válidos sin violar ninguna restricción dura.
- El sistema debe exponer un API REST funcional y documentado.
- El frontend debe poder solicitar la generación de horarios y mostrar resultados.
- Las pruebas deben demostrar al menos 87% de cobertura y casos de borde relevantes.
- La arquitectura debe ser modular para facilitar mantenimiento y evolución.

## 4. Evidencia de Implementación

### 4.1 Módulos clave
- `Backend/csp/solver.js` — Algoritmo principal de búsqueda y optimización.
- `Backend/middleware/verifyToken.js` — Autenticación JWT y control de roles.
- `Backend/middleware/performanceMonitor.js` — Monitoreo de tiempos de respuesta.
- `Backend/controllers/sustainability.controller.js` — Endpoint de reporte ambiental.

### 4.2 Casos de Uso Tratados
- Generación de horario sin conflictos.
- Validación de disponibilidad docente.
- Filtrado de aulas por capacidad y tipo.
- Priorización de preferencias suaves.
- Exportación y visualización de resultados.

## 5. Recomendaciones para Entrega de Sobresaliente

1. Entregar la documentación organizada en la carpeta `docs/`.
2. Asegurar que cada archivo `.md` sea autocontenido y muestre evidencia de la implementación.
3. Incluir referencias claras a los archivos de código y a los tests que verifican cada requisito.
4. Demostrar que la solución es reutilizable y escalable.
5. Incluir métricas de calidad y sostenibilidad junto al análisis técnico.
