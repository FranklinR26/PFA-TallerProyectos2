# Registro de Supuestos — Validación de Cierre (Assumption Log)

**Proyecto:** CSP Schedule Solver
**Fase:** Control y Cierre
**Fecha:** 2026-06-18
**Versión:** 1.0
**Base:** [../Inicio/Registro de supuestos y restricciones.md](../Inicio/Registro%20de%20supuestos%20y%20restricciones.md)

> Este registro toma los supuestos definidos en el Inicio (Sprint 0) y documenta su **impacto potencial** y su **validación durante la ejecución**, indicando si se confirmaron, se invalidaron o requirieron ajuste (vista exigida por la fase de cierre).

---

## 1. Validación de Supuestos del Sistema

| ID | Supuesto (Inicio) | Impacto potencial si falla | Validación durante la ejecución | Estado final |
|---|---|---|---|---|
| **S1** | La información ingresada (estudiantes, cursos, docentes, aulas) es correcta y completa | Horarios inválidos o solver no factible | Se añadió `validarDatos()` y validación de esquema MongoDB; mitiga dependencia del supuesto | ✅ Confirmado (con control) |
| **S2** | Prerrequisitos de cursos correctamente definidos | Violación de HC-7 (co-requisitos) | Validación de grafo acíclico (`TC-021`) | ✅ Confirmado |
| **S3** | Docentes con disponibilidad previamente registrada | Violación de HC-5/HC-6 | Módulo de disponibilidad (HU-04) + tests `TC-013/014` | ✅ Confirmado |
| **S4** | Estudiantes seleccionan cursos dentro del rango de créditos (20-22) | Sobrecarga / restricciones académicas | Validado a nivel de reglas de negocio | ✅ Confirmado |
| **S5** | Aulas con características definidas (capacidad, tipo, equipamiento) | Violación de HC-4 (capacidad) y HC-6 (tipo) | Modelo `Classroom` con campos obligatorios; `TC-010/011` | ✅ Confirmado |
| **S6** | El sistema opera en entorno controlado con usuarios limitados | RNF-02 (50 concurrentes) no garantizado a escala | No se ejecutó prueba de carga concurrente | 🟡 Parcialmente validado |
| **S7** | No se consideran cambios en tiempo real durante la generación | Complejidad adicional no prevista | Generación por periodos (batch); confirmado | ✅ Confirmado |
| **S8** | Conectividad a internet disponible (MongoDB Atlas) | Fallo de conexión (R-08) | Retry con backoff + connection pooling | ✅ Confirmado (con mitigación) |
| **S9** | Usuarios con conocimientos básicos del sistema | Curva de aprendizaje > 30 min (RNF-05) | Validado con instrumento SUS de usabilidad | ✅ Confirmado |

---

## 2. Restricciones Asumidas — Verificación

| Tipo | Restricción | ¿Se mantuvo durante la ejecución? |
|---|---|---|
| Técnica | Uso obligatorio del stack MERN | ✅ Sí |
| Técnica | Arquitectura web (SPA + API REST) | ✅ Sí |
| Técnica | Solución del CSP ≤5 s | ✅ Sí (2,340 ms para 50 cursos) |
| Académica | Cumplimiento de prerrequisitos / créditos | ✅ Sí |
| Operativa | Disponibilidad limitada de docentes/aulas | ✅ Modelada como HC-5/HC-4 |
| Negocio | Sin uso de APIs externas en tiempo real | ✅ Sí |

---

## 3. Supuestos Nuevos Surgidos Durante la Ejecución

| ID | Supuesto emergente | Impacto | Estado |
|---|---|---|---|
| SE-1 | El equipo dispone de Node.js ≥18 homogéneo | Reproducibilidad de pruebas | Documentado como prerrequisito |
| SE-2 | La contingencia (30%) no se gastaría proactivamente | Control de costos | ✅ Confirmado (reserva intacta) |
| SE-3 | 14 HU permanecen sin *scope creep* | Cumplimiento de cronograma/costo | ✅ Confirmado |

---

## 4. Conclusión

La mayoría de los supuestos iniciales se **confirmaron y, donde representaban riesgo (S1, S5, S8), se reforzaron con controles técnicos**. El único supuesto **parcialmente validado** es S6 (operación a escala/concurrencia), que se transfiere como recomendación al mantenimiento (prueba de carga formal).

---

## 5. Referencias

- Supuestos de inicio: [../Inicio/Registro de supuestos y restricciones.md](../Inicio/Registro%20de%20supuestos%20y%20restricciones.md)
- Riesgos: [03_REGISTRO_RIESGOS_CIERRE.md](03_REGISTRO_RIESGOS_CIERRE.md)
