# Resumen de pruebas de backend

## Comando ejecutado

Se validó la suite de pruebas backend con cobertura usando:

```bash
cd TP2-main/Backend
npx vitest run --coverage --reporter=dot
```

## Resultado verificado

Ejecución validada con éxito:

- 8 archivos de prueba ejecutados
- 92 pruebas ejecutadas
- 92 pruebas aprobadas
- 0 fallos

## Archivos de prueba incluidos

| Archivo | Qué valida | Para qué sirve |
|---|---|---|
| `__tests__/co2Monitor.test.js` | El monitoreo de consumo energético y la integración del módulo de CO2. | Verifica que la medición ambiental se registre correctamente y no rompa el flujo principal de la API. |
| `__tests__/constraints.test.js` | Las restricciones de la lógica CSP y sus combinaciones válidas/invalidas. | Asegura que el algoritmo no genere horarios imposibles o inconsistentes. |
| `__tests__/environmental.controller.test.js` | El controlador de métricas ambientales y sus respuestas HTTP. | Confirma que los endpoints ambientales devuelven resultados correctos y manejan errores de forma segura. |
| `__tests__/metrics.test.js` | El cálculo de métricas, pesos y derivaciones del modelo. | Comprueba la exactitud numérica de los indicadores usados para evaluar sostenibilidad y rendimiento. |
| `__tests__/scoring.test.js` | La puntuación de soluciones y la comparación entre alternativas. | Garantiza que la evaluación del horario sea coherente y reproducible. |
| `__tests__/solver.test.js` | La lógica del solver CSP y el generador de horarios. | Valida el corazón del sistema, asegurando que la asignación de horarios funcione como se espera. |
| `__tests__/sustainability.controller.test.js` | El endpoint y la lógica de sostenibilidad del backend. | Verifica que la capa de reporte ambiental responda correctamente en escenarios normales y de borde. |
| `__tests__/variables.test.js` | Las variables del modelo, sus valores y reglas de uso. | Confirma que los datos de entrada del solver están bien definidos y no producen resultados erróneos. |

## Cobertura observada

La ejecución con `--coverage` reportó:

- Cobertura global de sentencias: 32%
- Cobertura global de ramas: 76.61%
- Cobertura global de funciones: 41.79%
- Cobertura global de líneas: 32%

## Conclusión

La suite backend está funcional y estable para la evidencia de calidad del proyecto, con 92 pruebas verdes y cobertura medible en la capa de negocio y lógica del solver.
