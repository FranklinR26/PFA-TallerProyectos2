# SPRINT 1: ESPECIFICACIÓN TÉCNICA

## Sistema Inteligente de Generación Óptima de Horarios Académicos

## Spec-Driven Development — Casos de Uso Verificables

El equipo aplica **Spec-Driven Development (SDD)**: cada caso de uso se define antes de implementarse, con criterios de aceptación explícitos en formato **Given / When / Then**, que sirven directamente como base para los tests automatizados.

---

## Soporte conceptual: Google Antigravity

El concepto de **Google Antigravity** aplicado a este proyecto se refiere al principio de especificar **lo que el sistema NO debe hacer** (restricciones = "gravedad") en lugar de solo lo que sí debe hacer. El algoritmo CSP trabaja exactamente así: el espacio de soluciones queda definido por lo que las restricciones eliminan, y el solver explora libremente lo que queda.

En la práctica, esto significa:

- Se definen primero las **restricciones duras** (lo que está prohibido): conflictos de docente, de aula, de estudiante.
- El solver aplica **forward checking** (poda anticipada) para eliminar asignaciones inválidas antes de intentarlas.
- Las **restricciones blandas** (criterios de optimización) guían la selección hacia la mejor solución del espacio válido.
- Los **reinicios aleatorios** (múltiples semillas) exploran distintas regiones del espacio sin restricciones artificiales.

Esto permite que el sistema "vuele" libremente dentro del espacio que las restricciones definen, encontrando la solución óptima de forma autónoma.

---

## Casos de Uso Especificados

---

### CU-01: Generación de Horario Sin Conflictos

**Actor:** Coordinador Académico  
**Precondición:** Existen cursos, docentes con disponibilidad y aulas cargadas en el sistema.

**Especificación:**

```
DADO que soy coordinador autenticado
  Y existen al menos 2 cursos con docentes y aulas compatibles
CUANDO ejecuto la generación de horario
ENTONCES el sistema devuelve un horario donde:
  - ningún docente dicta dos cursos en el mismo bloque horario
  - ningún aula es usada simultáneamente por dos cursos
  - ningún estudiante tiene dos cursos en el mismo bloque horario
  - el tiempo de generación es ≤ 2000 ms
```

**Test correspondiente:** `solver.test.js` → "should return a valid assignment with no hard constraint violations"

---

### CU-02: Respeto de Disponibilidad del Docente

**Actor:** Algoritmo CSP  
**Precondición:** Un docente tiene bloques marcados como no disponibles (availability = 0).

**Especificación:**

```
DADO que el docente tiene marcados los slots del viernes tarde como no disponibles
CUANDO el algoritmo asigna sesiones a ese docente
ENTONCES ninguna sesión queda asignada en los slots marcados con availability = 0
```

**Test correspondiente:** `constraints.test.js` → "should detect teacher availability conflict"

---

### CU-03: Priorización de Slots Preferidos

**Actor:** Algoritmo de scoring  
**Precondición:** Un docente tiene slots preferidos marcados (availability = 2).

**Especificación:**

```
DADO que un docente tiene preferencia por las mañanas (availability = 2)
CUANDO el solver elige entre dos asignaciones igualmente válidas
ENTONCES la asignación en slot preferido obtiene mayor puntaje (score += W.pref)
  Y el horario final prioriza esos slots sobre los neutros (availability = 1)
```

**Test correspondiente:** `scoring.test.js` → "pref: scores preferred slots higher"

---

### CU-04: Validación de Tipo y Capacidad de Aula

**Actor:** Algoritmo CSP  
**Precondición:** Un curso de laboratorio requiere roomType = 'lab' con capacidad ≥ 25.

**Especificación:**

```
DADO que un curso requiere aula tipo "lab" con capacidad para 25 estudiantes
CUANDO el algoritmo construye el dominio de asignaciones posibles
ENTONCES el dominio excluye aulas de tipo "teoria" o con capacidad < 25
  Y solo incluye aulas que satisfacen ambas condiciones simultáneamente
```

**Test correspondiente:** `variables.test.js` → "buildDomain should filter by roomType and capacity"

---

### CU-05: Autenticación por Roles

**Actor:** Usuario del sistema  
**Precondición:** El usuario tiene cuenta registrada con un rol asignado.

**Especificación:**

```
DADO que un usuario intenta iniciar sesión con email y contraseña correctos
CUANDO envía las credenciales al endpoint POST /api/auth/login
ENTONCES el sistema responde con:
  - HTTP 200
  - token JWT válido
  - objeto user con { id, name, email, role }

DADO que un usuario envía credenciales incorrectas
CUANDO envía las credenciales al endpoint POST /api/auth/login
ENTONCES el sistema responde con:
  - HTTP 401
  - mensaje "Credenciales incorrectas"
```

---

### CU-06: Distribución Equilibrada de Carga Académica

**Actor:** Algoritmo de scoring  
**Precondición:** Un estudiante tiene 4 cursos matriculados.

**Especificación:**

```
DADO que un estudiante tiene 4 cursos con 2 sesiones cada uno
CUANDO el solver evalúa dos horarios alternativos:
  - Horario A: todos los cursos concentrados en lunes y martes
  - Horario B: cursos distribuidos de lunes a jueves
ENTONCES el Horario B obtiene mayor puntaje (menor varianza en carga diaria)
  Y el criterio "balance" penaliza el Horario A con score -= varianza × W.balance
```

**Test correspondiente:** `scoring.test.js` → "balance: penalizes uneven daily load"

---

### CU-07: Exportación del Horario a PDF

**Actor:** Coordinador o Docente  
**Precondición:** Existe un horario generado y guardado.

**Especificación:**

```
DADO que existe un horario generado visible en la pantalla SchedulePage
CUANDO el usuario hace clic en "Exportar PDF"
ENTONCES el sistema descarga un archivo PDF con:
  - la grilla del horario (días × bloques horarios)
  - nombre del docente o sección según la vista activa
  - formato legible sin cortes ni superposiciones
```

---

## Trazabilidad Spec → Test → Código

| Caso de Uso | Test File | Función en Código |
|-------------|-----------|-------------------|
| CU-01 | solver.test.js | `runSolver()` en csp/solver.js |
| CU-02 | constraints.test.js | `hasConflict()` en csp/constraints.js |
| CU-03 | scoring.test.js | `scoreSolution()` → criterio `pref` |
| CU-04 | variables.test.js | `buildDomain()` en csp/variables.js |
| CU-05 | — (manual) | `login()` en controllers/auth.controller.js |
| CU-06 | scoring.test.js | `scoreSolution()` → criterio `balance` |
| CU-07 | — (manual) | SchedulePage.jsx → exportación jsPDF |
