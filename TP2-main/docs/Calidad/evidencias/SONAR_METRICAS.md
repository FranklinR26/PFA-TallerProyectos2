# Evidencia SonarQube — Métricas Verificables

**Proyecto:** PFA-TallerProyectos2  
**SonarQube:** Community Build v26.6.0.123539  
**URL:** http://localhost:9000/dashboard?id=PFA-TallerProyectos2  
**Fecha:** 2026-06-11

---

## Primera ejecución — Estado inicial del código

Ejecutada con el código en su estado original (antes de las correcciones de bugs y Dockerfile).

| Métrica | Valor | Rating |
|---------|-------|--------|
| Quality Gate | **Passed** | ✅ |
| Bugs | **5** | D (Reliability) |
| Vulnerabilities | **0** | A (Security) |
| Code Smells | **237** | A (Maintainability) |
| Security Hotspots | **2** | E (0 % revisados) |
| Coverage | **17.7 %** | — |
| Duplications | **0.3 %** | — |
| Technical Debt | **1461 min (≈ 3 d)** | — |
| Lines of Code | **6 449** | — |

**Bugs detectados (5 CRITICAL — todos en `SchedulePage.jsx`):**
```
CRITICAL | SchedulePage.jsx | Provide a compare function to avoid sorting elements alphabetically.
CRITICAL | SchedulePage.jsx | Provide a compare function to avoid sorting elements alphabetically.
CRITICAL | SchedulePage.jsx | Provide a compare function to avoid sorting elements alphabetically.
CRITICAL | SchedulePage.jsx | Provide a compare function to avoid sorting elements alphabetically.
CRITICAL | SchedulePage.jsx | Provide a compare function to avoid sorting elements alphabetically.
```

**Security Hotspots (2 — en `Backend/Dockerfile`):**
```
TO_REVIEW | MEDIUM | Dockerfile | Copying recursively might inadvertently add sensitive data to the container.
TO_REVIEW | MEDIUM | Dockerfile | The "node" image runs with "root" as the default user.
```

> 📸 **Captura de pantalla:** guardar dashboard en `sonar-antes.png`

---

## Segunda ejecución — Estado tras correcciones

Ejecutada después de:
1. Corrección de los 5 `.sort()` sin comparador en `SchedulePage.jsx`
2. Adición de `USER node` y `chown` en `Backend/Dockerfile`
3. Creación de `Backend/.dockerignore`
4. Marcado de los 2 hotspots como `REVIEWED` (SAFE y FIXED)

| Métrica | Valor | Rating | Cambio |
|---------|-------|--------|--------|
| Quality Gate | **Passed** | ✅ | Sin cambio |
| Bugs | **0** | **A** (Reliability) | ✅ −5 |
| Vulnerabilities | **0** | **A** (Security) | Sin cambio |
| Code Smells | **237** | **A** (Maintainability) | Sin cambio |
| Security Hotspots | **0** | **A** (100 % revisados) | ✅ −2 hotspots |
| Coverage | **17.7 %** | — | Sin cambio |
| Duplications | **0.3 %** | — | Sin cambio |
| Technical Debt | **1461 min** | — | Sin cambio |
| Lines of Code | **6 449** | — | Sin cambio |

**Resumen de mejoras:**
- Reliability Rating: **D → A** (eliminación de 5 bugs críticos)
- Security Review Rating: **E → A** (hotspots revisados y mitigados)
- Todos los ratings finales: **A / A / A / A**

> 📸 **Captura de pantalla:** guardar dashboard en `sonar-despues.png`

---

## Comandos de verificación

```bash
# Verificar métricas via API (SonarQube debe estar corriendo)
curl -u squ_326e2caf9f89a384a25a98a57553f7dba148686f: \
  "http://localhost:9000/api/measures/component?component=PFA-TallerProyectos2&metricKeys=bugs,vulnerabilities,reliability_rating,security_rating,security_review_rating,coverage"
```

Resultado esperado (2ª ejecución):
```json
{
  "bugs": "0",
  "vulnerabilities": "0",
  "reliability_rating": "1.0",
  "security_rating": "1.0",
  "security_review_rating": "1.0",
  "coverage": "17.7"
}
```
