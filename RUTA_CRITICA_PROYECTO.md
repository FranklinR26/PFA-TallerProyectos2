# Ruta Crítica: CSP Schedule Solver
**Fecha:** 6 de Mayo, 2026  
**Proyecto:** Taller de Proyectos 2 - Ingeniería de Sistemas  
**Análisis de Dependencias:** Identificación de tareas bloqueadoras y ruta de entrega

---

## 1. Definición de Ruta Crítica

La **Ruta Crítica** es la secuencia de tareas que determina la duración mínima del proyecto. Cualquier retraso en una tarea crítica retrasa **todo el proyecto**.

**Para este proyecto:**
- **Ruta Crítica Identificada:** Sprint 3 (HU-05) → Sprint 4 (HU-06) → Sprint 6 (HU-08/09) → Sprint 7 (HU-14)
- **Duración Total en Ruta Crítica:** 75 días (23-Mar → 05-Jul)
- **Tarea Más Crítica:** HU-05 (Motor CSP)

---

## 2. Análisis de Dependencias (Matriz ADM)

### 2.1 Dependencias por User Story

| User Story | Descripción | Duración | Predecesoras | Bloqueadores | Crítica |
|-----------|-------------|----------|--------------|-------------|---------|
| **HU-01** | Gestión Docentes | 2 sem | Ninguna | Ninguno | No |
| **HU-02** | Gestión Cursos | 2 sem | Ninguna | Ninguno | No |
| **HU-03** | Gestión Aulas | 1.5 sem | Ninguna | Ninguno | No |
| **HU-04** | Disponibilidad Docentes | 2 sem | HU-01, HU-02, HU-03 | Ninguno | No |
| **HU-10** | Registro Usuarios | 2 sem | Ninguna | Ninguno | No |
| **HU-11** | Login | 1.5 sem | HU-10 | Ninguno | No |
| **HU-05** | **Motor CSP** | **2.5 sem** | **HU-01, HU-02, HU-03, HU-04** | **Bloquea 4 HUs** | **🔴 SÍ** |
| **HU-06** | Detectar Conflictos | 1 sem | **HU-05** | HU-05 | No |
| **HU-07** | Optimización SC | 1.5 sem | **HU-05, HU-06** | HU-05, HU-06 | No |
| **HU-08** | Visualización | 2 sem | **HU-05** | HU-05 | No |
| **HU-09** | Exportación | 1.5 sem | **HU-08** | HU-08 | No |
| **HU-12** | Corrección Errores | 2 sem | HU-06, HU-07, HU-08, HU-09 | Sprint QA | No |
| **HU-13** | Mejoras | 1.5 sem | HU-12 | HU-12 | No |
| **HU-14** | Integración Final | 1 sem | HU-12, HU-13 | HU-12, HU-13 | No |

---

## 3. Gráfico de Ruta Crítica (ASCII)

```
INICIO (23-Mar)
   ↓
┌──────────────────────────────────────────┐
│  SPRINT 1 (23-Mar → 05-Abr)             │
│  ✅ HU-01 ─┐                            │
│  ✅ HU-02 ─┼──→ HU-04 ─┐               │
│  ✅ HU-03 ─┘           │               │
│                        ↓               │
│  ✅ HU-04 (05-Abr)     │ 0% Tiempo    │
│  ✅ HU-10 (19-Abr)     │ de espera    │
│  🔄 HU-11 (19-Abr)     │               │
└────────────────┬───────┬───────────────┘
                 │       │
                 ↓       ↓
    ┌────────────────────────────────────┐
    │  SPRINT 3 (20-Abr → 03-May)       │
    │  🔴 HU-05: Motor CSP              │
    │     • 13 puntos de complejidad    │
    │     • Bloquea 4 tareas posteriores│
    │     • Estado: EN CURSO             │
    │     • Riesgo: CRÍTICO (R-01)      │
    └────┬──────────────────────────────┘
         │ [BLOQUEADOR CRÍTICO]
         ↓
    ┌────────────────────────────────────┐
    │  SPRINT 4 (04-May → 17-May)       │
    │  ⏳ HU-06: Detectar Conflictos    │
    │     • Dependencia: HU-05          │
    │     • No puede iniciar sin HU-05  │
    └────┬──────────────────────────────┘
         │
         ├─────────────────────┬────────────────┐
         │                     │                │
         ↓                     ↓                ↓
    ┌─────────────┐    ┌──────────────┐  ┌──────────────┐
    │ SPRINT 5    │    │ SPRINT 6     │  │ SPRINT 6     │
    │ HU-07       │    │ HU-08        │  │ HU-09        │
    │ Optimization│    │ Visualization│  │ Export       │
    └─────────────┘    └──────────────┘  └──────────────┘
         │                     │                │
         └─────────────────────┴────────────────┘
                    ↓
         ┌──────────────────────────────┐
         │  SPRINT 7 (15-Jun → 05-Jul) │
         │  HU-12: QA & Correcciones   │
         │  HU-13: Mejoras             │
         │  HU-14: Integración Final   │
         └──────────────────────────────┘
                    ↓
               FIN (05-Jul)
```

---

## 4. Análisis Detallado: HU-05 Como Bloqueador

### 4.1 Por Qué HU-05 Es Crítica

HU-05 implementa el **Motor CSP**, que es el corazón del proyecto. Sin ella:

| Impacto | Tareas Bloqueadas | Duración Bloqueada |
|---------|------------------|-------------------|
| Directo | HU-06, HU-07, HU-08, HU-09 | 8 semanas |
| Indirecto | HU-12, HU-13, HU-14 | 4 semanas adicionales |
| Total | 8 de 14 tareas | 75 días de proyecto |

### 4.2 Complejidad de HU-05

**Especificación:**
- 7 restricciones hard (HC-1 a HC-7)
- 5 restricciones soft (SC-1 a SC-5)
- 8,750 variables booleanas en espacio factible
- 105,000 variables antes de pre-filtrado
- Complejidad NP-Complete

**Esfuerzo Requerido:**
- Estimado: 120 horas (3 semanas)
- Multiplicador CSP: 1.385x del costo base
- Testing requerido: 25 test cases, 87% coverage
- Riesgos mitigados: R-01 (45%), R-02 (35%), R-03 (50%), R-08 (15%)

### 4.3 Estado Actual (06-May-2026)

- **Sprint:** 3 de 7
- **Duración Planificada:** 20-Abr → 03-May (14 días)
- **Duración Real (hasta hoy):** 17 días → **3 días de retraso potencial**
- **Progreso Reportado:** 0% completado (aún en desarrollo)
- **Riesgo:** 🔴 **CRÍTICO** - Cualquier retraso adicional impacta directamente Sprints 4-7

---

## 5. Escenarios de Retraso

### Escenario A: HU-05 Completada a Tiempo (03-May)
```
Sprint 3: HU-05 completa → 03-May
Sprint 4: HU-06 inicia → 04-May, termina 17-May ✅
Sprint 5: HU-07 inicia → 18-May, termina 31-May ✅
Sprint 6: HU-08, HU-09 inician → 01-Jun, terminan 14-Jun ✅
Sprint 7: QA completa, entrega → 05-Jul ✅
**Resultado: Proyecto ON TIME**
```

### Escenario B: HU-05 Retrasada 1 Semana (10-May)
```
Sprint 3: HU-05 completa → 10-May (+7 días)
Sprint 4: HU-06 inicia → 11-May, termina 24-May (+7 días)
Sprint 5: HU-07 inicia → 25-May, termina 07-Jun (+7 días)
Sprint 6: HU-08, HU-09 inician → 08-Jun, terminan 21-Jun (+7 días)
Sprint 7: QA completa, entrega → 12-Jul (+7 días)
**Resultado: Proyecto ATRASADO 7 DÍAS**
```

### Escenario C: HU-05 Retrasada 2 Semanas (17-May)
```
Sprint 3-4: HU-05 completa → 17-May (+14 días)
Cascada de retrasos: HU-06, HU-07, HU-08, HU-09 todas retrasadas +14 días
Sprint 6: Overlap con Sprint 7 (parallelización forzada)
Sprint 7: QA deficiente, riesgos no mitigados
**Resultado: Proyecto CRÍTICO - Rúbrica SOBRESALIENTE en RIESGO**
```

---

## 6. Holgura (Slack) Por Tarea

| Task | ES | EF | LS | LF | Slack | Tipo |
|------|----|----|----|----|-------|------|
| HU-01 | 0 | 2 | 1 | 3 | 1 | No crítica |
| HU-02 | 0 | 2 | 1 | 3 | 1 | No crítica |
| HU-03 | 0 | 1.5 | 2 | 3.5 | 2 | No crítica |
| HU-04 | 2 | 4 | 2 | 4 | **0** | Crítica |
| **HU-05** | **4** | **6.5** | **4** | **6.5** | **0** | **Crítica** |
| HU-06 | 6.5 | 7.5 | 6.5 | 7.5 | **0** | Crítica |
| HU-08 | 6.5 | 8.5 | 6.5 | 8.5 | **0** | Crítica |
| HU-09 | 8.5 | 10 | 8.5 | 10 | **0** | Crítica |
| HU-07 | 7.5 | 9 | 9 | 10.5 | 1.5 | No crítica |
| HU-12 | 10 | 12 | 10 | 12 | **0** | Crítica |
| HU-13 | 12 | 13.5 | 12 | 13.5 | **0** | Crítica |
| HU-14 | 13.5 | 14.5 | 13.5 | 14.5 | **0** | Crítica |

**Interpretación:** 10 de 14 tareas están en la ruta crítica (holgura = 0). Un retraso en cualquiera de ellas retrasa **todo el proyecto**.

---

## 7. Acciones Recomendadas

### 7.1 Inmediato (Esta Semana)

1. **Asignar Responsable a HU-05** 
   - Persona designada: _[PENDIENTE]_
   - Confirmar capacidad: 120 horas disponibles
   - Revisar progreso diario

2. **Establecer Checkpoints Internos en HU-05**
   - Lunes: HC-1, HC-2 implementadas
   - Martes: HC-3, HC-4 implementadas
   - Miércoles: HC-5, HC-6, HC-7 implementadas
   - Jueves-Viernes: Testing y debugging

3. **Preparar Sprint 4 Paralelamente**
   - Revisar especificación de HU-06
   - Preparar ambiente y herramientas
   - Estar listo para iniciar 04-May

### 7.2 Corto Plazo (2-3 Semanas)

1. **Acelerar HU-10 y HU-11** (Autentificación)
   - Actualmente en 50% completado
   - No está en ruta crítica pero necesaria para release
   - Deadline: 19-Abr (ya pasado, necesita urgencia)

2. **Establecer Testing Framework**
   - 25 test cases definidos en TC-001 a TC-005
   - Ambiente de testing configurado
   - Coverage requerida: 87% (para Sobresaliente)

3. **Documentación Contínua**
   - IMPLEMENTATION_LOG.md (decisiones arquitectónicas)
   - TEST_REPORT.md (resultados de testing)
   - Actualizar ESPECIFICACION_FORMAL.md con decisiones

### 7.3 Mediano Plazo (4-8 Semanas)

1. **Parallelización Estratégica**
   - Si HU-05 se completa a tiempo: HU-06, HU-07, HU-08, HU-09 pueden iniciar en paralelo
   - Asignación de recursos: Mínimo 2 desarrolladores para sprints 4-6

2. **Gestión de Riesgos Activa**
   - Monitor diario de R-01 (Complejidad CSP)
   - Monitor de R-02 (Rendimiento - timeout 5s)
   - Escalación de riesgos a profesor/coordinador

3. **Preparación para QA (Sprint 7)**
   - HU-12 (Corrección de Errores): Testing exhaustivo
   - HU-13 (Mejoras): Performance tuning
   - HU-14 (Integración): Validación end-to-end

---

## 8. Indicadores de Seguimiento

### 8.1 KPIs Críticos

| KPI | Baseline | Meta | Frecuencia | Responsable |
|-----|----------|------|-----------|------------|
| **HU-05 Completitud** | 0% | 100% | Diario | _[Por asignar]_ |
| **Número de Tests Verdes** | 0 | 25 | Diario | QA |
| **Deuda Técnica** | 0 | <5 items | Semanal | TechLead |
| **Documentación Actualizada** | 85% | 95% | Semanal | PM |
| **Sprints On Time** | 1/7 | 7/7 | Semanal | Scrum Master |

### 8.2 Señales de Alerta 🚨

| Señal | Umbral | Acción |
|-------|--------|--------|
| HU-05 >50% sin testing | Si ocurre | Detener, validar HC-1 a HC-4 |
| Timeout de motor >5 segundos | Si ocurre | Debug performance, revisar heurísticas |
| Test coverage <85% | Si ocurre | Expandir test suite |
| Commit sin ticket Jira | >3 veces | Enforcement de Git hooks |
| Documentación >1 semana sin update | Si ocurre | Bloquear PR hasta documentar |

---

## 9. Cadena de Valor (Trazabilidad)

```
ESPECIFICACION_FORMAL.md
    ↓ (Requisitos CSP)
CONSTITUTION.md
    ↓ (Principios del sistema)
JIRA Tablero (7 Epics, 14 User Stories)
    ↓ (Implementación)
GitHub (Commits semánticos, PRs)
    ↓ (Código)
TEST_REPORT.md (25 tests, 87% coverage)
    ↓ (Validación)
METRICAS_AGILES_PROYECTO.xlsx (Burndown, Velocidad, Control)
    ↓ (Seguimiento)
RUTA_CRITICA_PROYECTO.md (Este documento)
    ↓ (Análisis de riesgos de entrega)
GESTION_RIESGOS_OPORTUNIDADES.md (9 riesgos, 6 oportunidades)
    ↓ (Mitigación)
Evaluación Final (Rúbrica 8 criterios)
```

---

## 10. Conclusión

**HU-05 (Motor CSP) es el cuello de botella del proyecto.** Su éxito es **condición necesaria** para alcanzar la calificación de **SOBRESALIENTE**.

- **Ruta Crítica:** 10 de 14 tareas en serie crítica
- **Holgura Total:** 0 días (cualquier retraso impacta entrega final)
- **Fecha Crítica:** 03-May-2026 (finalización HU-05)
- **Estado Actual:** 🟡 **EN RIESGO** (3 días de retraso potencial)
- **Recomendación:** Asignación inmediata de recursos senior y monitoring diario

**Cada día de retraso en HU-05 = 1 día de retraso en entrega final + 1 punto de rúbrica en riesgo.**

---

**Próxima Revisión:** 13-May-2026 (Fin de Sprint 3)  
**Fecha de Entrega Final Comprometida:** 05-Jul-2026 (Sprint 7 cierre)
