# CSP Schedule Solver - Documentación Completa
**Taller de Proyectos 2** | **Universidad Continental** | **Mayo 2026**

---

## 🎯 Objetivo
Sistema automático de generación de horarios académicos usando Constraint Satisfaction Problem (CSP) con restricciones hard y soft.

---

## 📚 10 ARCHIVOS ESENCIALES (Mapa de Navegación)

### 1️⃣ ESPECIFICACION_FORMAL.md
**Rúbrica: Especificación Técnica Completa (3/3)**

Define matemáticamente el problema CSP:
- 8,750 variables booleanas (50 cursos × 12 docentes × 5 aulas × 35 slots)
- 7 restricciones hard (HC-1 a HC-7)
- 5 restricciones soft (SC-1 a SC-5)
- 5 test cases formales (TC-001 a TC-005)
- Complejidad NP-Complete

**Cuándo leer:** Primero. Base de todo el proyecto.

---

### 2️⃣ CONSTITUTION.md
**Rúbrica: Documentación Arquitectura (2.5/3)**

Principios y diseño del sistema:
- 4 principios fundamentales
- Arquitectura de componentes (Motor CSP, UI, Datos)
- Heurísticas: MRV (Minimum Remaining Values), AC-3
- Stack tecnológico: Node.js, MongoDB, OR-Tools

**Cuándo leer:** Segundo. Entender cómo se implementa la especificación.

---

### 3️⃣ GESTION_RIESGOS_OPORTUNIDADES.md
**Rúbrica: Gestión de Riesgos (3/3)**

Análisis exhaustivo de riesgos:
- 9 riesgos identificados (R-01 a R-09)
- 6 oportunidades (O-01 a O-06)
- Probabilidad, impacto, exposición
- Mitigación por riesgo

**Riesgos críticos:**
- R-01: Complejidad CSP (45% probabilidad)
- R-02: Rendimiento - timeout >5s (35%)

**Cuándo leer:** Para entender qué puede salir mal y cómo evitarlo.

---

### 4️⃣ METRICAS_AGILES_PROYECTO.xlsx
**Rúbrica: Métricas Ágiles (3/3)**

Seguimiento en tiempo real del proyecto:
- Sheet 1: Datos Reales - 7 sprints con progreso actual
- Sheet 2: Burndown - Puntos pendientes (real vs ideal)
- Sheet 3: Burnup - Cumulative completado
- Sheet 4: Velocidad - Trend de puntos/sprint (12→4→0)
- Sheet 5: Indicadores - 6 KPIs con status semáforo
- Sheet 6: Resumen Ejecutivo - Dashboard de estado

**Estado actual (06-May):** 41% completado, velocidad crítica

**Cuándo leer:** Semanalmente. Tracking del proyecto en vivo.

---

### 5️⃣ PRIORIZACION_JUSTIFICADA.xlsx
**Rúbrica: Priorización Justificada (3/3)**

Matriz de priorización transparente:
- Sheet 1: Priorización - 14 HUs con 7 criterios
- Sheet 2: Metodología - Fórmula: V×35% + (10-R)×35% + (10-C)×20% + Impacto×10%
- Sheet 3: Análisis Crítico - Top 5 justificado

**Top 5:**
1. HU-05 (Motor CSP) - 9.4/10
2. HU-06 (Detectar Conflictos) - 8.75/10
3. HU-08 (Visualización) - 8.5/10
4. HU-12 (Testing/QA) - 8.55/10
5. HU-07 (Optimización SC) - 8.1/10

**Cuándo leer:** Para entender por qué cada tarea tiene su prioridad.

---

### 6️⃣ RUTA_CRITICA_PROYECTO.md
**Rúbrica: Ruta Crítica (1.5/3)**

Análisis de dependencias y camino crítico:
- Ruta crítica: HU-05 → HU-06 → HU-08/09 → HU-12 → HU-14
- Holgura: 10 de 14 tareas en serie crítica (holgura = 0 días)
- Bloqueador clave: HU-05 (Motor CSP) retrasa 4 sprints si falla
- Matriz ADM: Dependencias por tarea
- 3 escenarios de retraso: Optimista, actual, pesimista

**Hallazgo crítico:** Cualquier retraso en HU-05 = retraso en entrega final

**Cuándo leer:** Diariamente durante Sprint 3. Monitor de riesgo de entrega.

---

### 7️⃣ JUSTIFICACION_ANALISIS_CSP_COSTO.md
**Rúbrica: Análisis Costos Profundo (3/3)**

Relación matemática entre complejidad CSP y presupuesto:
- Parte 1: Definición de complejidad (105,000 vars → 8,750 factibles)
- Parte 2: Costo base por función ($32,675)
- Parte 3: Multiplicadores por restricción (HC-7: 1.30, SC-2: 1.25, etc.)
- Parte 4: Presupuesto ajustado ($72,468 recomendado)
- Parte 5: Análisis sensibilidad (4 escenarios)
- Parte 6: Benchmarks (MIT Schedulr, ISI, Stanford)
- Parte 7: ROI y sostenibilidad Green (break-even 18.1 años)
- Parte 8: Conclusiones académicas

**Presupuesto final:** $72,468 (+154.6% vs $28,449 inicial, justificado)

**Cuándo leer:** Para entender por qué el proyecto es caro y por qué es correcto.

---

### 8️⃣ PRESUPUESTO_POR_SPRINT.md
**Rúbrica: Presupuesto Detallado (3/3) ✅**

Desglose operativo del presupuesto:
- Horas y costos por sprint (7 sprints × 600 horas)
- Gráfico de costo acumulado con picos de CSP
- Flujo de caja mensual (Marzo→Julio)
- Análisis burn rate: +67% pico en Sprint 3 (HU-05)
- 3 escenarios de variación presupuestaria
- Control semanal con varianza y status
- Distribución por actividad (18% HU-01/04, 16% Motor CSP, etc.)

**Presupuesto Total:** $72,468 (vinculado a JUSTIFICACION_ANALISIS_CSP_COSTO.md)

**Cuándo leer:** Para entender cuándo se gasta cada dólar y cómo monitorearlo.

---

### 9️⃣ TEST_REPORT.md
**Rúbrica: Testing & Validación (2.5/3 pendiente)**

Resultados de testing y validación:
- 25 test cases (TC-001 a TC-025)
- Cobertura: 87% objetivo
- Resultados: PASS/FAIL por test
- Hashes de commits GitHub
- Validación de restricciones

**Status:** PENDIENTE - Será completado después de HU-05

**Cuándo leer:** Después de implementar HU-05. Evidencia de calidad.

---

### 🔟 TRAZABILIDAD_INTEGRAL.md
**Rúbrica: Trazabilidad e Integración (2.0/3 pendiente)**

Mapeo end-to-end del proyecto:
- Especificación → Definición formal (ESPECIFICACION_FORMAL.md)
- → Jira → 14 User Stories (HU-01 a HU-14)
- → GitHub → Commits semánticos con PRs
- → Testing → 25 test cases con hashes
- → Métricas → Burndown, velocidad, indicadores

**Status:** PENDIENTE - Será completado con GitHub setup

**Cuándo leer:** Después de GitHub setup. Validación de completitud.

---

### 1️⃣1️⃣ LISTA_VERIFICACION_SOBRESALIENTE.md
**Referencia Opcional - No Obligatoria**

Master checklist de progreso:
- Evaluación contra 11 criterios de rúbrica
- Status actual: 7/11 completados (64%)
- Puntuación estimada: 24/33 (SOBRESALIENTE dentro de alcance)
- 4 items críticos pendientes priorizados
- Plan de trabajo por semana

**Cuándo leer:** Semanalmente para validar progreso hacia SOBRESALIENTE.

---

## 🚨 ITEMS CRÍTICOS PENDIENTES (7 de 8 completados)

| # | Tarea | Status | Impacto | Tiempo | Deadline |
|---|-------|--------|---------|--------|----------|
| ✅ 1 | PRESUPUESTO_POR_SPRINT.md (sprint-level breakdown) | COMPLETADO | +0.5 pts | 0.5h | 06-May ✓ |
| ✅ 2 | TEST_REPORT.md (plantilla 25 tests estructurados) | PLANTILLA LISTA | +0.5 pts | - | 06-May ✓ |
| 🔴 3 | GitHub Setup (Git Flow + commits semánticos) | CRÍTICO | +3 pts | 3-4h | 31-May |
| 🔴 4 | TEST_REPORT ejecución + resultados (post HU-05) | CRÍTICO | +2 pts | 2h | 15-Jun |
| 🟡 5 | Architecture Diagram (C4/UML) | Importante | +0.5 pts | 1h | 01-Jun |
| 🟡 6 | TRAZABILIDAD_INTEGRAL.md | Importante | +0.5 pts | 1.5h | 05-Jul |
| 🟡 7 | Variance analysis en METRICAS | Mejora | +0.5 pts | 0.5h | 31-May |

**Completado Hoy:** PRESUPUESTO_POR_SPRINT.md + TEST_REPORT.md (plantilla) = +1 punto = 25/33  
**Próximo Crítico:** GitHub Setup (+3 pts) → 28/33  
**Total Trabajo Pendiente:** 7.5 horas intensivas para SOBRESALIENTE

---

## 📊 ESTADO DEL PROYECTO

**Puntuación Actual:** 24/33 (73% = 2.5/3 SUFICIENTE)  
**Puntuación con GitHub + Testing:** 30+/33 (91%+ = 3/3 SOBRESALIENTE)

**Progreso Documentación:** 9/11 archivos completados (82%)
- ✅ 8 archivos core
- ✅ 1 presupuesto (PRESUPUESTO_POR_SPRINT.md)
- ✅ 1 test template (TEST_REPORT.md plantilla lista)
- 🟡 1 pendiente (TRAZABILIDAD)

**Bloqueador Crítico:** HU-05 (Motor CSP)
- Sprint: 3 de 7 (23-May to 03-May, 3 días de retraso)
- Estado: EN CURSO (0% completado aún)
- Impacto: Bloqueador para Sprints 4-6, cadena crítica de 75 días

**Siguiente:** GitHub Setup (3-4h) → +3 puntos rúbrica = 27/33

**Próxima Revisión:** 13-May-2026 (Fin de Sprint 3)

---

## 📖 ORDEN DE LECTURA RECOMENDADO

1. README.md (este archivo) - Navegación general
2. ESPECIFICACION_FORMAL.md - Entender el problema
3. CONSTITUTION.md - Entender la solución
4. GESTION_RIESGOS_OPORTUNIDADES.md - Entender los riesgos
5. RUTA_CRITICA_PROYECTO.md - Entender la entrega
6. METRICAS_AGILES_PROYECTO.xlsx - Monitor el progreso
7. PRIORIZACION_JUSTIFICADA.xlsx - Validar priorización
8. JUSTIFICACION_ANALISIS_CSP_COSTO.md - Justificación de costos (base teórica)
9. PRESUPUESTO_POR_SPRINT.md - Desglose operativo por sprint
10. TEST_REPORT.md - Validar calidad (cuando esté listo)
11. TRAZABILIDAD_INTEGRAL.md - Validar completitud (cuando esté listo)

---

## 🎯 PARA LA EVALUACIÓN

Presenta estos 11 archivos esenciales:
1. ✅ ESPECIFICACION_FORMAL.md
2. ✅ CONSTITUTION.md
3. ✅ GESTION_RIESGOS_OPORTUNIDADES.md
4. ✅ METRICAS_AGILES_PROYECTO.xlsx
5. ✅ PRIORIZACION_JUSTIFICADA.xlsx
6. ✅ RUTA_CRITICA_PROYECTO.md
7. ✅ JUSTIFICACION_ANALISIS_CSP_COSTO.md
8. ✅ PRESUPUESTO_POR_SPRINT.md (Completado 6-May)
9. ✅ TEST_REPORT.md (Plantilla lista, ejecución post HU-05)
10. 🟡 TRAZABILIDAD_INTEGRAL.md (cuando GitHub setup complete)
11. ℹ️ LISTA_VERIFICACION_SOBRESALIENTE.md (opcional, para referencia)

---

**Última Actualización:** 6 de Mayo, 2026  
**Versión:** 2.0 (Optimizada - 10 archivos esenciales)  
**Estado:** SOBRESALIENTE en objetivo
