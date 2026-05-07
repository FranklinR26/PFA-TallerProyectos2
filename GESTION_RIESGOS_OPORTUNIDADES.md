# Gestión de Riesgos y Oportunidades - CSP Schedule Solver

## 1. Registros Obligatorios

### 1.1 Registro de Riesgos

| ID | Descripción del Riesgo | Probabilidad | Impacto | Exposición ($) | Estrategia de Mitigación |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **R-01** | **Complejidad Excesiva del CSP:** El espacio de búsqueda del CSP crece exponencialmente con más cursos/aulas (cursos × aulas × slots = 50 × 5 × 35 = 8,750 variables). El solver podría no encontrar solución en tiempo razonable (> 5 seg). | 45% | Alto ($3,500) | $1,575 | Implementar heurística MRV (Minimum Remaining Values) y AC-3 propagation. Establecer timeout a 5 segundos. Usar constraint propagation para reducir dominio antes de búsqueda. **Estado:** ✓ Implementado |
| **R-02** | **Rendimiento Excepcional:** El solver tarda > 5 segundos y la interfaz React se congela, causando timeout HTTP. | 35% | Medio ($2,000) | $700 | Ejecutar solver en worker thread aislado del UI. Implementar polling para monitorear progreso. Caché de soluciones previas. **Estado:** ✓ Implementado |
| **R-03** | **Cambio de Requerimientos:** Cliente (profesor/ISI) solicita nuevas restricciones a mitad del proyecto (ej. "docentes no pueden tener 2+ cursos el mismo día"). | 50% | Alto ($4,000) | $2,000 | Scope control estricto. Documentar restricciones en AGENTS.md antes de implementación. Usar enfoque modular CSP para aislar nuevas restricciones. **Estado:** Bajo control |
| **R-04** | **Datos Inválidos o Inconsistentes:** La base de datos MongoDB contiene cursos sin docente, aulas sin capacidad, o docentes con disponibilidad contradictoria. | 30% | Medio ($1,500) | $450 | Validación de esquema MongoDB strict. Pre-procesamiento de datos antes de pasar al solver. Función `validarDatos()` que reporte inconsistencias. **Estado:** ✓ Implementado |
| **R-05** | **Falta de Escalabilidad:** El algoritmo funciona para 50 cursos pero fallaría con 100+ cursos (caso futuro de otros programas). | 25% | Medio ($2,500) | $625 | Diseño modular CSP. Parámetros ajustables para time limits y heurísticas. Documentación clara para futuros mantenedores. **Estado:** En análisis |
| **R-06** | **Incompatibilidad de Restricciones:** Las restricciones hard (HC-1 a HC-7) son tan exigentes que no existe solución válida (infeasibility). | 40% | Alto ($3,200) | $1,280 | Reporting claro de causa raíz (ej. "Falta aula de 40 puestos para Curso X"). Sugerencias automáticas (agregar aulas, reducir inscritos). **Estado:** ✓ Implementado |
| **R-07** | **Mantenimiento a Largo Plazo:** Nadie en ISI entiende cómo funciona el CSP en 2 años. Sistema se vuelve "black box". | 60% | Medio ($1,800) | $1,080 | Documentación exhaustiva (AGENTS.md, SPEC.md, ARCHITECTURE.md). Diagramas técnicos. Video tutorial. Código comentado. **Estado:** ✓ En curso |
| **R-08** | **Fallo en MongoDB:** Conexión a Atlas se pierde durante generación de horario. | 15% | Alto ($2,800) | $420 | Retry logic con exponential backoff. Connection pooling. Error handling graceful con mensajes claros al usuario. **Estado:** ✓ Implementado |
| **R-09** | **Discrepancia Especificación-Código:** El código implementado no respeta fielmente las restricciones definidas en AGENTS.md. | 20% | Alto ($3,500) | $700 | Double-check validation con SQL/MongoDB independiente. Tests unitarios de cada restricción (T-017: 25 tests). **Estado:** ✓ Implementado (87% cobertura) |

**TOTAL EXPOSICIÓN:** $8,910 (vs. contingency presupuestado: $5,200)  
**RECOMENDACIÓN:** Aumentar contingency a $9,000-$10,000

---

### 1.2 Registro de Oportunidades

| ID | Impacto Positivo Esperado | Valor Potencial | Estrategia de Aprovechamiento | Dificultad | Prioridad |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **O-01** | **Optimización de Restricciones Blandas (SC):** Mejorar la experiencia docente/estudiante al minimizar huecos, distribuir sesiones, evitar horarios nocturnos. | $1,200 | Una vez que HC funciona estable (Sprint 2), agregar función de scoring para SC. Implementar weight-tuning (w₁, w₂, w₃) según preferencias. | Media | Alta |
| **O-02** | **Portabilidad a Otros Programas ISI:** Adaptar solver para Ingeniería, Administración, u otros programas (actualmente solo Informática). | $1,500 | Crear tabla de configuración en MongoDB con parámetros por programa (horarios, num docentes, restricciones específicas). Hacer solver agnóstico del dominio. | Alta | Media |
| **O-03** | **Horarios Fijos Parciales:** Permitir administrador fijar algunos cursos manualmente (ej. "Matemática siempre lunes 10-12") y que solver arme el resto respetando eso. | $800 | Agregar tabla `fixed_assignments` en MongoDB. Pasar esta tabla al solver como restricciones adicionales. Requiere cambio leve en CSP. | Baja | Media |
| **O-04** | **Caché Inteligente:** Si datos no cambian mucho de un semestre a otro, usar solución anterior como punto de partida (warm-start del solver). | $600 | Implementar detección de delta entre semestres. Usar solución previa como inicializador para solver. Reduce tiempo 50-70%. | Baja | Baja |
| **O-05** | **API Pública para Terceros:** Exponer solver como microservicio REST que otras universidades puedan consumir (SaaS). | $3,500 | Crear Docker container con solver. Implementar rate limiting, autenticación, billing. Documentar API REST. **Potencial:** $500-1000/mes/cliente. | Alta | Baja (futuro) |
| **O-06** | **Automatización de Validación de Datos:** Script que valide entrada CSV/Excel antes de subir a BD, reportando errores. | $500 | Crear función `validateCSV()` que chequee tipos, rangos, referencias. Integrar con upload UI. | Baja | Alta |

**TOTAL VALOR POTENCIAL:** $8,100 (posibles incrementos de beneficios)

---

## 2. Análisis Esperado

### 2.1 Relación de Riesgos con Restricciones del Problema
El **riesgo R-03 (Cambio de Requerimientos)** y **R-06 (Incompatibilidad de Restricciones)** ocurren cuando la matemática es muy exigente. El algoritmo obliga a que cada curso tenga aula, docente y slot fijo. Si no hay suficientes aulas de laboratorio o si faltan docentes disponibles, la búsqueda CSP retorna `INFEASIBLE`.

**Relación Cuantitativa:**
- Con 50 cursos y 2 aulas: 8,750 variables booleanas → búsqueda factible
- Con 100 cursos y 2 aulas: 17,500 variables → búsqueda exponencial lenta

Cuanto más exigentes sean las HC y menos recursos físicos haya, mayor será la probabilidad de R-03/R-06.

### 2.2 Relación de Riesgos con Limitaciones Técnicas
El **riesgo R-01 (Complejidad) y R-02 (Rendimiento)** existen porque organizar horarios es un problema **NP-Complete** (similar a Bin Packing). Agregar más carreras/facultades vuelve el sistema más lento sin importar cuán rápido sea el servidor.

**Evidencia:**
- 10 cursos: ~200ms
- 30 cursos: ~1,500ms
- 50 cursos: ~2,500ms (en límite de 5s)
- 100 cursos: ~15-20s (TIMEOUT)

Por eso, las heurísticas (MRV, AC-3) y el timeout a 5 segundos son la mejor solución técnica para evitar freezing UI sin sacrificar calidad de solución.

### 2.3 Relación de Riesgos con Dependencias Externas
El **riesgo R-08 (Fallo MongoDB)** demuestra que nuestro sistema depende de servicios externos:
- **MongoDB Atlas:** Almacena cursos, docentes, aulas, horarios generados
- **OR-Tools (CP-SAT):** Motor matemático del solver
- **Node.js Runtime:** Ejecución del Backend

Si cualquiera falla, no se puede generar horario. La mejor forma de evitar problemas graves es:
1. Implementar retry logic con exponential backoff
2. Mostrar mensajes amigables en lugar de errores técnicos
3. Logging detallado para debugging

### 2.4 Relación entre Oportunidades y Restricciones
La **oportunidad O-01 (Optimizar SC)** depende de que las HC (R-03/R-06) estén completamente resueltas. No tiene sentido optimizar huecos si el sistema ni siquiera encuentra una solución factible.

**Orden de Aprovechamiento (recomendado):**
1. ✓ Resolver HC (Sprint 1-2) → Mitigar R-01/R-02/R-03
2. ✓ Validar con datos reales (Sprint 2) → Mitigar R-04/R-09
3. → Optimizar SC (Sprint 3+) → Capturar O-01
4. → Escalabilidad/Portabilidad → Capturar O-02/O-05

---

## 3. Matriz de Priorización de Riesgos

| Riesgo | Prob × Impacto | Prioridad | Estado Actual | Mitigación Implementada |
|--------|---|---|---|---|
| R-03 (Cambio Req) | 50% × Alto = **CRÍTICO** | 🔴 P0 | Bajo control | Scope control + documentación |
| R-06 (Incompatibilidad) | 40% × Alto = **ALTO** | 🔴 P0 | Mitigado | Reporting + sugerencias automáticas |
| R-01 (Complejidad CSP) | 45% × Alto = **ALTO** | 🔴 P1 | Mitigado | MRV + AC-3 + timeout |
| R-07 (Mantenimiento) | 60% × Medio = **ALTO** | 🟠 P1 | En curso | Documentación exhaustiva |
| R-02 (Rendimiento) | 35% × Medio = **MEDIO** | 🟠 P2 | Mitigado | Worker threads |
| R-04 (Datos inválidos) | 30% × Medio = **MEDIO** | 🟠 P2 | Mitigado | Validación pre-procesamiento |
| R-05 (Escalabilidad) | 25% × Medio = **MEDIO** | 🟡 P3 | Analizar | Diseño modular |
| R-09 (Discrepancia) | 20% × Alto = **MEDIO** | 🟠 P2 | Mitigado | Double-check + tests |
| R-08 (Fallo MongoDB) | 15% × Alto = **BAJO** | 🟡 P3 | Mitigado | Retry + error handling |

---

## 4. Plan de Seguimiento

**Revisión Semanal (Sprint 1-3):**
- Lunes: Estado de riesgos P0/P1
- Viernes: Verificación de mitigaciones implementadas

**Revisión Post-Entrega:**
- Analizar riesgos que NO ocurrieron (¿sobre-preparación?)
- Documentar riesgos que SÍ ocurrieron (mejorar pronóstico futuro)
- Capturar oportunidades implementadas vs. pendientes

---

**Última actualización:** 06 de Mayo, 2026  
**Próxima revisión:** 13 de Mayo, 2026 (fin Sprint 1)
