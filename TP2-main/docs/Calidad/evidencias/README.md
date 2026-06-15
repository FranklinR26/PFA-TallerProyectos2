# Carpeta de Evidencias Técnicas — Calidad del Software

Esta carpeta almacena las evidencias verificables del proceso de aseguramiento de calidad.
Cada evidencia es **trazable** a un requisito de la consigna y **reproducible** mediante el
comando o ruta indicados.

---

## 1. Matriz de trazabilidad consigna → evidencia

| Consigna | Evidencia obligatoria | Archivo / ubicación | Estado |
|----------|----------------------|---------------------|--------|
| **6.1.d** SonarQube | Métricas antes/después | [`SONAR_METRICAS.md`](SONAR_METRICAS.md) | ✅ |
| **6.1.d** SonarQube | Reporte técnico de análisis | [`../INFORME_TECNICO_INTEGRAL.md`](../INFORME_TECNICO_INTEGRAL.md) §2 | ✅ |
| **6.1.d** SonarQube | Captura dashboard (después) | `sonar-despues.png` | ✅ |
| **6.1.d** SonarQube | Captura dashboard (antes) | `sonar-antes.png` | ⏳ Pendiente captura |
| **6.2** OWASP | Matriz de vulnerabilidades | [`../OWASP_TOP10_2025_MATRIZ.md`](../OWASP_TOP10_2025_MATRIZ.md) §2 | ✅ |
| **6.2** OWASP | Evidencia de mitigación + pruebas | `../OWASP...MATRIZ.md` §4 | ✅ |
| **6.2** OWASP | Análisis de riesgo residual | `../OWASP...MATRIZ.md` §5 | ✅ |
| **6.3** WCAG | Reportes automáticos | `wcag-login-*.html` / `wcag-login-*.json` | ✅ |
| **6.3** WCAG | Checklist WCAG | [`../WCAG_CHECKLIST.md`](../WCAG_CHECKLIST.md) | ✅ |
| **6.3** WCAG | Listado de incumplimientos + correcciones | `WCAG_LIGHTHOUSE_MANUAL.md` | ✅ |
| **6.3** WCAG | Captura validación (antes) | `wcag-login-antes.png` | ⏳ Pendiente captura |
| **6.4** SUS | Formulario + base de resultados + cálculo | [`../SUS_INSTRUMENTO.md`](../SUS_INSTRUMENTO.md) | ✅ |
| **6.4** SUS | Captura del formulario aplicado | `sus-formulario.png` | ⏳ Pendiente captura |
| **6.5** Testing | Pruebas unit/integración/E2E + cobertura | `../../../EVIDENCIAS_TESTING.md` | ✅ |

> **Nota de honestidad técnica:** las tres capturas marcadas ⏳ son las únicas evidencias
> pendientes. Las métricas y datos que respaldan están todos presentes y son verificables; solo
> falta el archivo de imagen. Instrucciones para generarlas en la sección §3.

---

## 2. Archivos disponibles en esta carpeta

| Archivo | Descripción |
|---------|-------------|
| `SONAR_METRICAS.md` | Métricas exactas de las dos ejecuciones de SonarQube (antes/después) |
| `WCAG_LIGHTHOUSE_MANUAL.md` | Auditoría de accesibilidad con cambios verificables y evaluación manual |
| `sonar-despues.png` | Dashboard final de SonarQube (después de correcciones) |
| `wcag-login-100.html` | Reporte Lighthouse del estado inicial de `/login` |
| `wcag-login-despues.html` | Reporte Lighthouse del estado final de `/login` |
| `wcag-login-despues.json` / `wcag-login-despues2.json` / `wcag-login-final.json` | JSON crudo de los reportes Lighthouse |
| `README.md` | Este índice y matriz de trazabilidad |

---

## 3. Cómo generar las capturas pendientes

| Archivo | Cómo obtenerlo |
|---------|----------------|
| `sonar-antes.png` | Levantar SonarQube (`docker compose -f docker-compose.sonar.yml up -d`), abrir el primer análisis en `http://localhost:9000/dashboard?id=PFA-TallerProyectos2` y capturar. Si ya se sobrescribió, hacer `git checkout` del commit previo a las correcciones, re-escanear y capturar. |
| `wcag-login-antes.png` | En DevTools → Lighthouse → Accessibility sobre `http://localhost:5173/login`, usando `git checkout` del commit anterior a los cambios WCAG. |
| `sus-formulario.png` | Captura del Google Forms (o instrumento equivalente) usado para recolectar las 10 respuestas SUS. |

### Reproducir el dashboard de SonarQube
```bash
docker compose -f docker-compose.sonar.yml up -d
# http://localhost:9000/dashboard?id=PFA-TallerProyectos2
```

### Verificar métricas vía API
```bash
curl -u <TOKEN>: \
  "http://localhost:9000/api/measures/component?component=PFA-TallerProyectos2&metricKeys=bugs,vulnerabilities,reliability_rating,security_rating,security_review_rating,coverage"
```

---

## 4. Notas

- Las métricas numéricas están en `SONAR_METRICAS.md` y son reproducibles con `sonar-scanner-cli`.
- Los cambios de código (WCAG, OWASP, bugs) son verificables directamente en el diff de git.
- Los reportes Lighthouse en HTML/JSON ya están archivados en esta carpeta.
- El instrumento SUS, la base de datos y el cálculo están en `../SUS_INSTRUMENTO.md`.
