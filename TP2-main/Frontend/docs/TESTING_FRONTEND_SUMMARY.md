# Resumen de pruebas frontend

## Pruebas ejecutadas

Se ejecutó la suite de pruebas de frontend con Vitest mediante el comando:

```bash
cd TP2-main/Frontend
npx vitest run --reporter=dot
```

## Cobertura de pruebas

La suite fue expandida para cubrir escenarios de alto valor para la rúbrica de calidad: UI, rutas protegidas, login, y capa de estado (stores).

1. Navbar y navegación
   - No muestra la barra cuando no hay usuario autenticado.
   - No muestra la barra en la ruta de login aunque el usuario esté autenticado.
   - Renderiza los enlaces y datos del usuario para el rol docente.
   - Confirma el cierre de sesión y la navegación a /login.

2. Protección de rutas
   - Redirige a login si no hay token.
   - Redirige a /unauthorized cuando el rol no está autorizado.
   - Renderiza el contenido protegido cuando el rol es válido.

3. Integración de portal
   - Obtiene datos de portal mediante la API mockeada.

4. Login y experiencia de usuario
   - Renderiza los roles disponibles.
   - Selección de rol y validación del formulario.
   - Redirección según rol y manejo de errores de login.

5. Stores y lógica de estado
   - Autenticación (`authStore`).
   - Datos (`dataStore`).
   - Métricas (`metricsStore`).
   - Portal (`portalStore`).
   - Horarios (`scheduleStore`).

## Resultado

Ejecución verificada con éxito:

- 9 archivos de prueba ejecutados.
- 52 pruebas ejecutadas.
- 52 pruebas aprobadas.

Estado final: ✅ Todas las pruebas frontend ejecutadas salieron correctas.
