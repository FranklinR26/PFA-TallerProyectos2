# Documentación de Capacitación y Transferencia de Conocimiento

**Proyecto:** CSP Schedule Solver
**Fase:** Control y Cierre
**Fecha:** 2026-06-18
**Versión:** 1.0
**Audiencia:** Cliente / equipo de operaciones que heredará el producto

> Documento de transferencia operativa para que el equipo receptor pueda **instalar, operar, mantener y resolver problemas** del sistema sin el equipo de desarrollo original (mitiga el riesgo residual R-07).

---

## 1. Visión General del Sistema

El sistema genera horarios académicos sin conflictos a partir de los datos de cursos, docentes, aulas y disponibilidad. Se compone de:

- **Frontend (React + Vite):** interfaz de gestión de datos y visualización de horarios.
- **Backend (Node.js + Express):** API REST y motor CSP (en `Backend/csp/`).
- **Base de datos (MongoDB):** persistencia de docentes, cursos, aulas y horarios.

Arquitectura detallada: [../ejecucion/arquitectura.md](../ejecucion/arquitectura.md) · modelado: [../ejecucion/modelado.md](../ejecucion/modelado.md).

---

## 2. Requisitos Previos

- Node.js ≥ 18
- MongoDB (local o Atlas)
- Git

---

## 3. Instalación y Puesta en Marcha

```bash
# 1. Clonar
git clone https://github.com/FranklinR26/PFA-TallerProyectos2.git
cd PFA-TallerProyectos2/TP2-main

# 2. Configurar variables de entorno del backend
cp Backend/.env.example Backend/.env
# Editar Backend/.env:
#   PORT=5000
#   MONGODB_URI=mongodb://localhost:27017/horarios_db

# 3. Backend
cd Backend && npm install && npm run dev      # http://localhost:5000

# 4. Frontend (otra terminal)
cd ../Frontend && npm install --legacy-peer-deps && npm run dev   # http://localhost:5173
```

> **Nota operativa:** el frontend requiere `--legacy-peer-deps`. Para datos de ejemplo, usar los *seeds* en `Backend/scripts/` (`seedAll.js`, `seedData.js`).

---

## 4. Operación Básica (Guía de Usuario)

1. **Iniciar sesión** con un usuario válido (autenticación JWT).
2. **Registrar datos maestros:** docentes (con disponibilidad), cursos (tipo, créditos, co-requisitos) y aulas (capacidad, tipo).
3. **Generar el horario:** ejecutar el solver desde la interfaz (endpoint `POST /api/horarios/generar`). El sistema responde en ≤5 s para instancias de hasta ~100 cursos.
4. **Revisar resultados:** vistas por docente, por aula y por carrera; reporte de conflictos si el problema es infeasible.
5. **Exportar** el horario en los formatos disponibles.

---

## 5. Operación Técnica y Mantenimiento

### 5.1 Endpoints principales (API REST)

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/horarios/generar` | Ejecuta el solver CSP |
| GET | `/api/horarios` | Lista horarios generados |
| GET | `/api/horarios/:id/validar` | Valida restricciones duras |
| POST/GET | `/api/docentes`, `/api/cursos` | Gestión de datos maestros |

### 5.2 Parámetros del solver

- **Timeout:** 5 s (configurable). · **Workers:** 4 (búsqueda paralela). · **Heurística:** MRV + AC-3.
- Módulos clave: `csp/solver.js`, `csp/constraints.js` (HC/SC), `csp/scoring.js`, `csp/variables.js`, `csp/solverWorker.js`.

### 5.3 Ejecución de pruebas (verificación post-cambios)

```bash
cd TP2-main/Backend && npm test          # suites backend (CSP, controladores)
cd ../Frontend && npm run test           # unitarias/integración frontend
```

### 5.4 Mantenimiento recomendado

- Mantener la suite de pruebas actualizada al añadir nuevas restricciones (preservar trazabilidad HC/SC ↔ TC).
- Ejecutar el análisis SonarQube periódicamente (config en `sonar-project.properties`).
- Antes de un uso productivo a escala: ejecutar prueba de carga (RNF-02) y definir estrategia de disponibilidad (RNF-04).

---

## 6. Resolución de Problemas (Troubleshooting)

| Síntoma | Causa probable | Solución |
|---|---|---|
| El solver retorna `infeasible` | Restricciones incompatibles (p. ej. falta aula con capacidad) | Revisar el reporte de causa raíz; ajustar datos (aulas/disponibilidad) |
| Horario vacío en una vista | Datos incompletos / filtro de vista | Verificar datos maestros (ref. defecto DEF-01, ya corregido) |
| Falla conexión MongoDB | URI incorrecta o Atlas caído | Verificar `MONGODB_URI`; el sistema reintenta con backoff |
| Instalación frontend falla | Conflicto de *peer deps* | Usar `npm install --legacy-peer-deps` |
| Cypress no instala | Error de red (ECONNRESET) | Reintentar en red estable o usar Playwright |

---

## 7. Material de Apoyo Disponible

- **Guía de capturas / evidencias:** [../seguimiento_control/GUIA_CAPTURAS.md](../seguimiento_control/GUIA_CAPTURAS.md)
- **Evidencias de testing:** [../seguimiento_control/EVIDENCIAS_TESTING.md](../seguimiento_control/EVIDENCIAS_TESTING.md)
- **Informe técnico integral (calidad):** [../seguimiento_control/Calidad/INFORME_TECNICO_INTEGRAL.md](../seguimiento_control/Calidad/INFORME_TECNICO_INTEGRAL.md)
- **README del repositorio** (arquitectura, API, modelo CSP): [../../../README.md](../../../README.md)

---

## 8. Contacto del Equipo (Transferencia)

Equipo de desarrollo: Franklin Rojas, Anthony Camarena, Gabriel Landa, Rolfi Escobar, Piero Curassi.
Correo: 73234956@continental.edu.pe

---

## 9. Referencias

- Declaración de trabajo: [09_DECLARACION_TRABAJO_SOW.md](09_DECLARACION_TRABAJO_SOW.md)
- Informe final: [01_INFORME_FINAL_PROYECTO.md](01_INFORME_FINAL_PROYECTO.md)
