# Guion de Presentación Técnica — Defensa del PFA

**Proyecto:** HorarioConti — Aseguramiento integral de calidad
**Ejes:** SonarQube · OWASP Top 10 2025 · WCAG 2.1 AA · SUS · Testing automatizado
**Duración sugerida:** 12–15 min de exposición + 5 min de preguntas

> Este guion está diseñado para cubrir el criterio de la rúbrica de mayor peso (**Presentación técnica, peso 8 — nivel Sobresaliente**): demostración funcional fluida, explicación de métricas, vulnerabilidades detectadas y mitigadas, accesibilidad, usabilidad y pruebas, con dominio técnico y respuesta precisa a preguntas.

---

## 1. Estructura de la exposición (slides)

| # | Slide | Mensaje clave | Tiempo |
|---|-------|---------------|--------|
| 1 | **Portada** | Proyecto, equipo, curso, fecha | 0:30 |
| 2 | **Contexto y problema** | Riesgos: seguridad, mantenibilidad, accesibilidad, usabilidad, cobertura | 1:00 |
| 3 | **Objetivo y enfoque** | Auditoría integral con 4 estándares + testing | 0:45 |
| 4 | **Arquitectura del sistema** | MERN + motor CSP; dónde se auditó | 1:00 |
| 5 | **SonarQube — antes/después** | Quality Gate Passed; Bugs 5→0; Reliability D→A | 2:00 |
| 6 | **OWASP Top 10 2025** | 7 hallazgos; matriz; 5 mitigados con código | 2:30 |
| 7 | **WCAG 2.1 AA** | 8 criterios corregidos; Lighthouse | 1:30 |
| 8 | **SUS** | Puntaje 79.0 "Bueno"; 10 participantes; mejoras | 1:30 |
| 9 | **Testing automatizado** | 99 tests: unit/integración/E2E + cobertura | 1:30 |
| 10 | **Demostración funcional** | Demo en vivo (ver §3) | 2:00 |
| 11 | **Conclusiones y mejoras** | Tabla de impacto verificable | 1:00 |
| 12 | **Cierre + preguntas** | — | — |

---

## 2. Discurso por slide (puntos de hablado)

### Slide 5 — SonarQube
> "Ejecutamos **dos análisis consecutivos** con SonarQube Community v26.6 para documentar el estado *antes* y *después* de las correcciones. El **Quality Gate pasó** en ambos. El cambio verificable más importante: detectamos **5 bugs críticos** —cinco `.sort()` sin función comparadora en `SchedulePage.jsx`, que en JavaScript ordena alfabéticamente y rompe el orden de nombres con tildes y ñ—. Los corregimos con `localeCompare`, llevando el **Reliability Rating de D a A**. Además resolvimos **2 security hotspots** en el `Dockerfile` (COPY recursivo y ejecución como root), subiendo el **Security Review de E a A**."

**Métrica para citar de memoria:** Bugs 5→0 · Reliability D→A · Security Review E→A · Code Smells 237 (rating A) · Duplicación 0.3 % · Quality Gate Passed.

### Slide 6 — OWASP Top 10 2025
> "Auditamos contra las 10 categorías del OWASP Top 10 2025 y documentamos **7 hallazgos** en una matriz trazable: 1 alto, 4 medios, 2 bajos. El de mayor severidad fue **inyección NoSQL (A05)**: el login aceptaba objetos en el campo email, permitiendo operadores de Mongo. Lo mitigamos validando que las credenciales sean strings, y lo **probamos**: una petición con `{"$gt":""}` ahora devuelve 400 en vez de consultar la base. Cinco hallazgos se mitigaron con código en esta rama; los dos restantes —JWT en almacenamiento del navegador y ausencia de alertas— quedan documentados con su **riesgo residual** y plan de cierre (cookie httpOnly)."

### Slide 7 — WCAG
> "Sobre el flujo de autenticación corregimos **8 criterios WCAG 2.1 AA** con código verificable: idioma de página, etiquetas de formulario asociadas, toggle de contraseña operable por teclado, mensajes de error con `role="alert"`, **3 combinaciones de contraste** que estaban por debajo de 4.5:1, estructura semántica y controles con `aria-pressed`. Lo validamos con **Lighthouse y axe DevTools**; los reportes HTML/JSON están archivados como evidencia."

### Slide 8 — SUS
> "Aplicamos el instrumento **SUS** a **10 participantes** de 4 perfiles. El puntaje fue **79.0**, que en la escala de Bangor clasifica como **'Bueno' y aceptable**, 11 puntos por encima del umbral de industria (68). El análisis por segmento mostró que los estudiantes de ciclos iniciales puntúan más bajo (65), lo que derivó en propuestas concretas: onboarding guiado y simplificación del flujo de generación."

### Slide 9 — Testing
> "Implementamos los cuatro tipos de prueba que pide la consigna: **unitarias** (Vitest, 92 en backend + 7 en frontend), **integración** (con MSW simulando la API), **E2E** (Playwright y Cypress sobre el login) y **cobertura** (LCOV, integrada a SonarQube). En total **99 pruebas** automatizadas pasando."

---

## 3. Script de demostración funcional (demo en vivo)

> Objetivo: demostrar que el sistema es funcional **y** que las mitigaciones funcionan en tiempo real.

**Preparación previa:** Backend (`npm run dev`) y Frontend (`npm run dev`) corriendo; MongoDB con datos sembrados (`npm run seed`); SonarQube levantado si se mostrará el dashboard.

1. **Login funcional** — iniciar sesión como admin → mostrar el dashboard. *(funcionalidad)*
2. **Generación de horario** — cargar datos y generar un horario con el motor CSP. *(funcionalidad core)*
3. **Mitigación OWASP en vivo** — desde una terminal, lanzar la inyección NoSQL y mostrar el **400**:
   ```bash
   curl -s -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":{"$gt":""},"password":{"$gt":""}}'
   # → 400 "Email y contraseña requeridos"  (antes: consultaba la BD)
   ```
4. **Accesibilidad** — navegar el login **solo con teclado** (Tab/Enter) y mostrar el toggle de contraseña enfocable + el foco visible.
5. **Calidad** — abrir el dashboard de SonarQube (`localhost:9000`) y mostrar Quality Gate **Passed** con ratings A.
6. **Pruebas** — ejecutar `npm test` en vivo y mostrar la suite en verde.

---

## 4. Banco de preguntas anticipadas (Q&A)

**P: ¿Por qué la cobertura es solo 17.7 %?**
R: La suite histórica cubría a fondo el módulo `csp/` (>90 %). Al medir *todo* el código (controllers, routes, pages) afloró la brecha real. No es ausencia de pruebas —hay 99 pasando— sino alcance. El plan prioriza tests para `auth.controller.js`, `DataPage.jsx` y `SchedulePage.jsx`. La consigna exige *pruebas de cobertura* (implementadas y medidas con LCOV), no un umbral fijo.

**P: ¿La inyección NoSQL era explotable?**
R: Sí. Express parsea JSON, y Mongoose interpretaba `{"$gt":""}` como operador, permitiendo evadir la comparación de email. La mitigación valida tipo string antes de consultar; lo demostramos con el 400 en la demo.

**P: ¿Por qué el JWT en `sessionStorage` sigue siendo riesgo residual?**
R: `sessionStorage` reduce la persistencia frente a `localStorage`, pero sigue siendo accesible por JavaScript, así que un XSS podría leerlo. El cierre definitivo es cookie `httpOnly` + `SameSite=Strict`, documentado como mejora futura. Lo declaramos abiertamente como riesgo residual: trazabilidad honesta.

**P: ¿Code Smells 237 no es mucho?**
R: El volumen importa menos que el rating: **A** significa deuda < 5 % del esfuerzo. Se concentran en estado excesivo de componentes y duplicación de filtros; el plan es refactor con custom hooks. No comprometen funcionalidad ni seguridad.

**P: ¿Cómo garantizan que las correcciones no rompieron nada?**
R: Cada corrección está respaldada por la suite automatizada (99 tests) y por el segundo análisis SonarQube, que muestra Quality Gate Passed sin regresiones.

**P: ¿El análisis es reproducible?**
R: Sí. `sonar-project.properties` versionado, coverage por `npm run test:coverage`, y tres rutas de ejecución (Docker local, CI self-hosted, SonarCloud) documentadas en el README §8.

**P: ¿Por qué SonarQube local y no SonarCloud?**
R: El análisis se ejecutó en SonarQube Community local para control total durante la auditoría. Dejamos el workflow de SonarCloud listo para integración automática continua con GitHub (`sonarcloud.yml`).

**P: ¿WCAG en qué nivel?**
R: Nivel **AA** de WCAG 2.1, enfocado en el flujo crítico de autenticación. 8 criterios corregidos con código; quedan documentados los pendientes de validación manual (foco visible completo, reflow 320 px, recorrido con NVDA).

---

## 5. Checklist de cierre antes de exponer

- [ ] Backend, Frontend y MongoDB corriendo y probados 10 min antes.
- [ ] SonarQube levantado con el último análisis cargado (Quality Gate Passed visible).
- [ ] Terminal lista con el comando de inyección NoSQL para la demo.
- [ ] Capturas de respaldo (`sonar-antes.png`, `sonar-despues.png`) por si falla la demo en vivo.
- [ ] Cada integrante domina al menos un eje (Sonar / OWASP / WCAG / SUS / Testing).
- [ ] Informe técnico integral abierto para responder con evidencia.
