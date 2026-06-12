# Carpeta de Evidencias Técnicas — Calidad del Software

Esta carpeta almacena las evidencias verificables del proceso de aseguramiento de calidad.

## Archivos de texto (incluidos en el repositorio)

| Archivo | Descripción |
|---------|-------------|
| `SONAR_METRICAS.md` | Métricas exactas de las dos ejecuciones de SonarQube (antes/después) |
| `WCAG_LIGHTHOUSE_MANUAL.md` | Auditoría de accesibilidad con cambios verificables en código y evaluación manual |
| `README.md` | Este índice |

## Capturas de pantalla requeridas (agregar manualmente)

| Archivo | Cómo obtenerlo |
|---------|---------------|
| `sonar-antes.png` | Dashboard del 1er análisis en http://localhost:9000 |
| `sonar-despues.png` | Dashboard del 2do análisis (actual) en http://localhost:9000 — **ya disponible** |
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
- El puntaje SUS y los datos individuales están en `../SUS_INSTRUMENTO.md`.
