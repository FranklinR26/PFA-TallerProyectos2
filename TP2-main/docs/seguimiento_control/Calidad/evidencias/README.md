# Carpeta de Evidencias Técnicas — Calidad del Software

Esta carpeta almacena las evidencias verificables del proceso de aseguramiento de calidad.

## Evidencias disponibles en esta carpeta

| Archivo | Descripción |
|---------|-------------|
| `SONAR_METRICAS.md` | Métricas exactas de las dos ejecuciones de SonarQube (antes/después) |
| `WCAG_LIGHTHOUSE_MANUAL.md` | Auditoría de accesibilidad con cambios verificables en código y evaluación manual |
| `README.md` | Este índice |
| `sonar-despues.png` | Captura disponible del dashboard final de SonarQube |
| `wcag-login-100.html` | Reporte Lighthouse HTML del estado inicial de `/login` |
| `wcag-login-despues.html` | Reporte Lighthouse HTML del estado final de `/login` |
| `wcag-login-despues.json` | JSON crudo del reporte Lighthouse final de `/login` |
| `wcag-login-despues2.json` | Segunda ejecución JSON del reporte Lighthouse final de `/login` |
| `wcag-login-final.json` | JSON final consolidado del reporte Lighthouse de `/login` |

## Capturas pendientes de agregar manualmente

| Archivo | Cómo obtenerlo |
|---------|---------------|
| `sonar-antes.png` | Dashboard del 1er análisis en http://localhost:9000 |
| `wcag-login-antes.png` | Lighthouse en DevTools antes de los cambios WCAG (usar git checkout del commit anterior) |
| `wcag-login-despues.png` | Lighthouse → Accessibility en http://localhost:5173/login → exportar HTML |
| `sus-formulario.png` | Captura del formulario Google Forms o equivalente usado para recolección |

## Cómo abrir el dashboard de SonarQube

```bash
# Asegurarse de que SonarQube está corriendo
docker compose -f docker-compose.sonar.yml up -d

# Abrir en el navegador
# http://localhost:9000/dashboard?id=PFA-TallerProyectos2
# Usuario: admin | Contraseña: la que configuraste
```

## Notas

- Las métricas numéricas están documentadas en `SONAR_METRICAS.md` y son verificables
  reproduciendo el análisis con `sonar-scanner-cli` (instrucciones en el informe §2.2).
- Los cambios de código WCAG son verificables directamente en el diff de git.
- Los reportes Lighthouse en HTML y JSON ya están archivados en esta misma carpeta.
- El puntaje SUS y los datos individuales están en `../SUS_INSTRUMENTO.md`.
