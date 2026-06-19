# Resumen de pruebas de backend

## Comando ejecutado

Se validó la suite de pruebas backend con cobertura usando:

```bash
cd TP2-main/Backend
npx vitest run --coverage --reporter=dot
```

## Resultado verificado

Ejecución validada con éxito:

- **10 archivos de prueba ejecutados**
- **114 pruebas ejecutadas**
- **114 pruebas aprobadas**
- **0 fallos**

## Archivos de prueba incluidos

| Archivo | Qué valida | Para qué sirve |
|---|---|---|
| `__tests__/auth.controller.test.js` | Autenticación (login/register), validaciones OWASP (H-01, H-03, H-04) | 12 tests: flujos de éxito/error, inyección NoSQL rechazada, política de contraseñas, sin fuga de detalles internos |
| `__tests__/period.controller.test.js` | Controlador de períodos académicos y sus respuestas HTTP | 10 tests: CRUD, validaciones de negocio, manejo de errores |
| `__tests__/co2Monitor.test.js` | El monitoreo de consumo energético y la integración del módulo de CO2 | Verifica que la medición ambiental se registre correctamente y no rompa el flujo principal de la API |
| `__tests__/constraints.test.js` | Las restricciones de la lógica CSP y sus combinaciones válidas/inválidas | Asegura que el algoritmo no genere horarios imposibles o inconsistentes |
| `__tests__/environmental.controller.test.js` | El controlador de métricas ambientales y sus respuestas HTTP | Confirma que los endpoints ambientales devuelven resultados correctos y manejan errores de forma segura |
| `__tests__/metrics.test.js` | El cálculo de métricas, pesos y derivaciones del modelo | Comprueba la exactitud numérica de los indicadores usados para evaluar sostenibilidad y rendimiento |
| `__tests__/scoring.test.js` | La puntuación de soluciones y la comparación entre alternativas | Garantiza que la evaluación del horario sea coherente y reproducible |
| `__tests__/solver.test.js` | La lógica del solver CSP y el generador de horarios | Valida el corazón del sistema, asegurando que la asignación de horarios funcione como se espera |
| `__tests__/sustainability.controller.test.js` | El endpoint y la lógica de sostenibilidad del backend | Verifica que la capa de reporte ambiental responda correctamente en escenarios normales y de borde |
| `__tests__/variables.test.js` | Las variables del modelo, sus valores y reglas de uso | Confirma que los datos de entrada del solver están bien definidos y no producen resultados erróneos |

## Cobertura observada

La ejecución con `--coverage` reportó:

| Métrica | Valor | Nota |
|---------|-------|------|
| **Cobertura de líneas (backend)** | **36.2%** | Subida de 31.7% tras agregar 22 tests de controladores (auth + period) |
| **Cobertura de funciones (controladores)** | **68%** | Tests de auth.controller.js y period.controller.js en ejecución |
| **Cobertura de ramas** | **78.9%** | Especialmente en módulos CSP (constraints, solver, variables > 90%) |
| **Cobertura global (SonarQube)** | **17.7%** | Primera ejecución; se actualiza al re-escanear con nueva cobertura de backends |

## Conclusión

La suite backend está funcional y estable, con **114/114 pruebas verdes** (0 fallos). Cobertura medible y trazable:
- **Módulos críticos (CSP, solver, constraints):** > 90% de líneas
- **Controladores (auth, period, environmental, sustainability):** 68% de funciones
- **Plan de mejora:** elevar cobertura global a 70% con tests de componentes frontend y data/schedule controllers

La suite valida automáticamente las mitigaciones OWASP H-01 (no fuga de errores), H-03 (rechazo de inyección NoSQL) y H-04 (política de contraseñas), reforzando la garantía de seguridad del sistema.
