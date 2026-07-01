# Política de Seguridad

## Versiones soportadas

| Versión | Soporte |
|---------|---------|
| 1.x (main) | :white_check_mark: Activa |

## Reportar una vulnerabilidad

Si descubres una vulnerabilidad de seguridad, **no abras un issue público**. En su lugar, envía un correo a los mantenedores del proyecto con los detalles:

1. Descripción de la vulnerabilidad.
2. Pasos para reproducirla.
3. Impacto potencial.
4. Sugerencia de mitigación (si la tienes).

Nos comprometemos a responder en un plazo máximo de **72 horas** y a publicar un fix en un plazo razonable.

## Prácticas de seguridad implementadas

| Control | Implementación |
|---------|---------------|
| Autenticación | JWT en cookie `httpOnly` + `Secure` + `SameSite=Strict` |
| Autorización | Middleware `verifyToken` + `checkRole` por ruta |
| Hashing de contraseñas | bcrypt con cost factor 12 |
| Protección CORS | Lista blanca de orígenes (no refleja cualquier Origin) |
| Rate limiting | `express-rate-limit` en `/api/auth` (20 req/15 min) |
| Cabeceras de seguridad | Helmet.js (CSP, X-Frame-Options, HSTS, etc.) |
| Validación de entrada | Tipo `string` + regex en login/register; rechazo de operadores NoSQL |
| Política de contraseñas | Mínimo 8 caracteres, letras y números |
| Alertas de fuerza bruta | Middleware `securityAlert.js` genera WARNING al alcanzar rate-limit |
| Secretos | `.env` excluido de Git; `.env.example` documenta variables sin valores reales |

## Auditorías realizadas

- **OWASP Top 10 2025**: auditoría completa documentada en `docs/seguimiento_control/Calidad/OWASP_TOP10_2025_MATRIZ.md` — 7 hallazgos identificados y mitigados.
- **SonarQube**: análisis estático antes/después documentado en `docs/seguimiento_control/Calidad/evidencias/SONAR_METRICAS.md`.
- **Dependencias**: ejecutar `npm audit` en `Backend/` y `Frontend/` para verificar el estado actual.
