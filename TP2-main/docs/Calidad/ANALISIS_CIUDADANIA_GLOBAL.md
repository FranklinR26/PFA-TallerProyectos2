# Análisis de Ciudadanía Glocal y Entornos Locales/Globales

**Proyecto:** HorarioConti — Sistema de Generación Óptima de Horarios Académicos (MERN)
**Curso:** Taller de Proyectos 2 — Ingeniería de Sistemas e Informática
**Competencias cubiertas:** 3.1 Respeto y valoración de la diversidad · 3.2 Aspectos éticos y normativos · **3.3 Conocimiento de entornos locales y globales**

---

## 1. Propósito

Este documento analiza el proyecto desde la **Competencia 3 — Ciudadanía Glocal**, con foco en el indicador **3.3**: *"Analiza el impacto de los procesos de globalización en diferentes ámbitos de la vida social tanto a nivel local como global para la construcción de ciudadanías democráticas."* Se articula la dimensión **local** (Universidad Continental, Perú) con la dimensión **global** (estándares y tendencias internacionales del software).

## 2. Procesos de globalización que atraviesan el proyecto (3.3)

### 2.1 Estandarización global como lenguaje común de ingeniería
La globalización del software se manifiesta en la adopción de **estándares transnacionales** que permiten que una solución desarrollada localmente sea interoperable, auditable y comparable a nivel mundial. El proyecto los adopta deliberadamente:

| Estándar global | Organismo | Ámbito | Uso en el proyecto |
|-----------------|-----------|--------|--------------------|
| **WCAG 2.1 AA** | W3C (internacional) | Accesibilidad | Checklist y correcciones de accesibilidad |
| **OWASP Top 10 2025** | OWASP Foundation (global) | Seguridad | Matriz de vulnerabilidades y mitigaciones |
| **ISO/IEC 25010** | ISO/IEC (internacional) | Calidad de producto | Ratings de mantenibilidad/fiabilidad/seguridad en SonarQube |
| **Green Software / SWD** | Green Software Foundation | Sostenibilidad | Medición de huella de carbono (CO2.js) |

**Impacto:** la solución no queda aislada en su contexto local; "habla" el mismo idioma técnico que la industria global, lo que facilita su evaluación, mantenimiento y eventual escalamiento por equipos de cualquier país.

### 2.2 Tensión local ↔ global en el dominio del problema
- **Dimensión global:** el problema de generación de horarios (*timetabling*) es **universal** en la educación superior; el enfoque **CSP** (Constraint Satisfaction Problem) es una técnica reconocida internacionalmente, lo que permite comparar la solución con sistemas académicos de otras latitudes.
- **Dimensión local:** las restricciones del modelo reflejan el **contexto peruano y de la Universidad Continental**: estructura de períodos académicos **`AAAA-I` / `AAAA-II`**, roles (coordinador, docente, estudiante), idioma **español** (`<html lang="es">`, i18n) y calendario local.

La solución **contextualiza** un patrón global a una necesidad local concreta, sin perder compatibilidad con prácticas internacionales.

### 2.3 Globalización de la infraestructura y soberanía de datos
El despliegue sobre nube (p. ej. **MongoDB Atlas**) implica que datos de usuarios podrían alojarse en infraestructura distribuida globalmente. Esto introduce consideraciones de **soberanía y transferencia transfronteriza de datos**, atendidas mediante las medidas de protección descritas en el [informe de sostenibilidad §7.4](../informe_sostenibilidad.md) (alineación con la Ley N.º 29733) y la auditoría OWASP.

### 2.4 Brecha digital y ciudadanía democrática
La construcción de **ciudadanías democráticas** exige que la tecnología no excluya:
- **Accesibilidad (WCAG):** amplía el acceso a personas con discapacidad — un criterio de equidad tanto local como global.
- **Eficiencia (Green Software):** el *lazy loading*, la compresión gzip y la optimización de consultas reducen los requisitos de hardware y ancho de banda, **mejorando el acceso desde dispositivos de gama baja o redes limitadas**, frecuentes en contextos de brecha digital.
- **Acceso equitativo a la información:** horarios consultables por rol garantizan que estudiantes y docentes accedan en igualdad de condiciones.

## 3. Articulación con 3.1 y 3.2

- **3.1 Diversidad.** El sistema considera **perfiles de usuario diversos** (estudiantes de distintos ciclos, docentes, coordinadores, administradores), validados con segmentación en el estudio **SUS**, y atiende la diversidad funcional vía accesibilidad.
- **3.2 Ética y normativa.** Las decisiones técnicas consideran consecuencias éticas y normativas: **protección de datos personales** (Ley N.º 29733), **seguridad** (OWASP), **inclusión** (Ley N.º 29973 / WCAG) y **propiedad intelectual** (licencia MIT). Ver matriz OWASP e [informe de sostenibilidad §7.4](../informe_sostenibilidad.md).

## 4. Síntesis

| Indicador | Evidencia | Nivel sustentado |
|-----------|-----------|------------------|
| 3.1 Diversidad | Segmentación SUS + accesibilidad WCAG | Suficiente/Sobresaliente |
| 3.2 Ética y normativa | OWASP + Ley 29733 + Ley 29973 + MIT | Suficiente/Sobresaliente |
| 3.3 Globalización local/global | Estándares globales (W3C/ISO/OWASP/GSF), tensión local-global del dominio, brecha digital y soberanía de datos | Suficiente/Sobresaliente |

El proyecto evidencia que un sistema de alcance **local** (una universidad peruana) se diseña con **estándares y conciencia global**, contribuyendo a una ciudadanía digital democrática e inclusiva.
