# Flujo de trabajo Git — Feature Branch Workflow

**Proyecto:** Sistema de Generacion Optima de Horarios Academicos (HorarioConti)
**Curso:** Taller de Proyectos 2 — Ingenieria de Sistemas e Informatica
**Fecha:** 2026-07-01
**Version:** 1.0

---

## 1. Estrategia seleccionada

El equipo adopto **Feature Branch Workflow** como flujo de trabajo de control de versiones.

## 2. Justificacion

Se evaluaron tres alternativas antes de seleccionar el flujo:

| Flujo | Ventajas | Desventajas | Decision |
|-------|----------|-------------|----------|
| **Git Flow** | Estructura rigida con ramas `develop`, `release`, `hotfix` | Excesiva complejidad para un equipo de 5 personas en un PMV de 14 semanas | Descartado |
| **Trunk-Based Development** | Integracion continua rapida, ideal para CI/CD maduro | Requiere alta cobertura de tests y CI robusto desde el inicio; riesgo de inestabilidad en `main` | Descartado |
| **Feature Branch Workflow** | Ramas por funcionalidad, integracion via Pull Requests con revision de pares, compatible con equipos pequenos | Puede generar ramas de larga duracion si no se gestionan | **Seleccionado** |

**Razones principales:**
1. **Simplicidad**: un equipo de 5 integrantes no necesita la complejidad de Git Flow (ramas `develop`, `release`, `hotfix`).
2. **Revision de pares**: cada feature se integra via Pull Request, lo que garantiza revision de codigo antes de llegar a `main`.
3. **Aislamiento de trabajo**: cada integrante trabaja en su rama sin afectar la estabilidad de `main`.
4. **Compatibilidad con Scrum**: cada historia de usuario o tarea se desarrolla en una rama feature independiente, alineada con los sprints.

## 3. Convencion de ramas

| Tipo de rama | Formato | Ejemplo |
|-------------|---------|---------|
| Principal | `main` | `main` |
| Desarrollo personal | `{nombre}` | `Gabo`, `Franklin`, `Piero` |
| Funcionalidad | `feature/{descripcion}` | `feature/sostenibilidad`, `feature/frontend-tests` |

## 4. Flujo de integracion

```
1. Crear rama desde main:
   git checkout -b feature/nueva-funcionalidad main

2. Desarrollar y hacer commits descriptivos:
   git add .
   git commit -m "feat(modulo): descripcion del cambio"

3. Push a remoto:
   git push origin feature/nueva-funcionalidad

4. Crear Pull Request en GitHub:
   - Descripcion del cambio
   - Revision por al menos un miembro del equipo
   - Verificacion de CI (GitHub Actions)

5. Merge a main tras aprobacion:
   - Merge via GitHub (boton "Merge pull request")
   - Eliminar la rama feature tras el merge
```

## 5. Convencion de commits

El equipo sigue la convencion de [Conventional Commits](https://www.conventionalcommits.org/):

| Prefijo | Uso |
|---------|-----|
| `feat` | Nueva funcionalidad |
| `fix` | Correccion de errores |
| `docs` | Cambios en documentacion |
| `chore` | Tareas de mantenimiento |
| `test` | Cambios en tests |
| `refactor` | Refactorizacion sin cambio funcional |
| `security` | Mejoras de seguridad |

## 6. Evidencia

- **14+ ramas** creadas durante el proyecto (main, 5 ramas personales, 4+ ramas feature).
- **8 Pull Requests** integrados (#1 a #8).
- **120 commits** con mensajes descriptivos distribuidos entre 5 integrantes.
- **CI/CD** con GitHub Actions ejecuta tests automaticamente en cada push y PR.

## 7. Referencias

- Chacon, S. & Straub, B. (2014). *Pro Git* (2nd ed.). Apress. Seccion 5.2: Contributing to a Project — Feature Branch Workflow.
- Atlassian. (s.f.). *Feature Branch Workflow*. Recuperado de https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow
