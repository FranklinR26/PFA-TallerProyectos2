# Documentación de la API REST

**Base URL:** `http://localhost:5000/api`
**Autenticación:** JWT en cookie `httpOnly` (enviado automáticamente con `credentials: "include"`)

---

## Autenticación

### POST `/api/auth/login`
Inicia sesión y establece la cookie `auth_token`.

**Body:**
```json
{
  "email": "admin@uni.edu",
  "password": "Admin1234"
}
```

**Respuesta 200:**
```json
{
  "user": {
    "id": "664a...",
    "name": "Administrador",
    "email": "admin@uni.edu",
    "role": "admin"
  }
}
```

**Errores:**
| Código | Descripción |
|--------|-------------|
| 400 | Campos faltantes o formato inválido |
| 401 | Credenciales incorrectas |

---

### GET `/api/auth/me`
Retorna el usuario autenticado.

**Headers:** Cookie `auth_token` (automática)
**Respuesta 200:**
```json
{
  "id": "664a...",
  "name": "Administrador",
  "email": "admin@uni.edu",
  "role": "admin"
}
```

---

### POST `/api/auth/register`
Registra un nuevo usuario. **Solo admin.**

**Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@uni.edu",
  "password": "Password123",
  "role": "docente"
}
```

**Validaciones:**
- Email: formato válido, único en BD
- Password: mínimo 8 caracteres, al menos una letra y un número
- Role: `admin`, `coordinador`, `docente`, `estudiante`

---

## Datos Académicos

Todas las rutas requieren autenticación. Las operaciones de escritura requieren rol `admin` o `coordinador`.

### GET `/api/data/all`
Retorna los 5 catálogos en una sola petición (optimización HTTP).

**Roles:** admin, coordinador
**Respuesta 200:**
```json
{
  "teachers": [...],
  "classrooms": [...],
  "courses": [...],
  "sections": [...],
  "students": [...]
}
```

---

### Docentes

| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| GET | `/api/data/teachers` | Todos | Listar docentes |
| POST | `/api/data/teachers` | admin, coordinador | Crear docente |
| PUT | `/api/data/teachers/:id` | admin, coordinador | Actualizar docente |
| DELETE | `/api/data/teachers/:id` | admin, coordinador | Eliminar docente |

### Aulas

| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| GET | `/api/data/classrooms` | Todos | Listar aulas |
| POST | `/api/data/classrooms` | admin, coordinador | Crear aula |
| PUT | `/api/data/classrooms/:id` | admin, coordinador | Actualizar aula |
| DELETE | `/api/data/classrooms/:id` | admin, coordinador | Eliminar aula |

### Cursos

| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| GET | `/api/data/courses` | Todos | Listar cursos |
| POST | `/api/data/courses` | admin, coordinador | Crear curso |
| PUT | `/api/data/courses/:id` | admin, coordinador | Actualizar curso |
| DELETE | `/api/data/courses/:id` | admin, coordinador | Eliminar curso |

### Secciones

| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| GET | `/api/data/sections` | Todos | Listar secciones |
| POST | `/api/data/sections` | admin, coordinador | Crear sección |
| PUT | `/api/data/sections/:id` | admin, coordinador | Actualizar sección |
| DELETE | `/api/data/sections/:id` | admin, coordinador | Eliminar sección |

### Estudiantes

| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| GET | `/api/data/students` | admin, coordinador | Listar estudiantes |
| POST | `/api/data/students` | admin, coordinador | Crear estudiante |
| PUT | `/api/data/students/:id` | admin, coordinador | Actualizar estudiante |
| DELETE | `/api/data/students/:id` | admin, coordinador | Eliminar estudiante |

### Matrícula

| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| POST | `/api/data/enroll/bulk` | admin, coordinador | Matrícula masiva |
| POST | `/api/data/enroll/:studentId/:courseId` | admin, coordinador | Matricular estudiante |
| DELETE | `/api/data/enroll/:studentId/:courseId` | admin, coordinador | Desmatricular estudiante |

---

## Horarios

### POST `/api/schedule/generate`
Ejecuta el solver CSP para generar un horario óptimo.

**Roles:** admin, coordinador
**Respuesta 200:**
```json
{
  "schedule": { ... },
  "metrics": {
    "score": 85.2,
    "conflicts": 0,
    "solveTimeMs": 2300
  }
}
```

### GET `/api/schedule/active`
Retorna el horario activo del período actual.

### GET `/api/schedule/full`
Retorna el horario completo con todas las asignaciones.

### GET `/api/schedule/history`
Retorna el historial de horarios generados.

### GET `/api/schedule/validate`
Valida el horario activo contra todas las restricciones.

**Roles:** admin, coordinador

### PATCH `/api/schedule/entry`
Modifica una entrada individual del horario.

**Roles:** admin, coordinador

### PUT `/api/schedule/:id/activate`
Activa un horario específico.

**Roles:** admin, coordinador

---

## Portal

Todas las rutas requieren autenticación y rol `estudiante`, `docente`, `coordinador` o `admin`.

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/portal` | Datos del portal según el rol del usuario |
| PUT | `/api/portal/availability` | Actualizar disponibilidad horaria (docente) |
| POST | `/api/portal/enroll/:courseId` | Matricularse en un curso (estudiante) |
| DELETE | `/api/portal/enroll/:courseId` | Desmatricularse (estudiante) |
| POST | `/api/portal/waitlist/:courseId` | Unirse a lista de espera |
| DELETE | `/api/portal/waitlist/:courseId` | Salir de lista de espera |

---

## Períodos Académicos

| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| GET | `/api/periods` | Todos | Listar períodos |
| POST | `/api/periods` | admin, coordinador | Crear período |
| PUT | `/api/periods/:id/activate` | admin, coordinador | Activar período |
| DELETE | `/api/periods/:id` | admin, coordinador | Eliminar período |

---

## Métricas

### GET `/api/metrics`
Retorna métricas del solver CSP (score, conflictos, distribución).

**Autenticación requerida.**

---

## Sostenibilidad y Medio Ambiente

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/environmental-impact` | No | Dashboard HTML de huella de carbono |
| GET | `/api/environmental-impact` | No | Datos JSON de impacto ambiental |
| GET | `/api/sustainability` | No | Reporte de GreenFrame (JSON/texto) |

---

## Códigos de error comunes

| Código | Significado |
|--------|-------------|
| 400 | Datos de entrada inválidos |
| 401 | No autenticado (cookie ausente o expirada) |
| 403 | No autorizado (rol insuficiente) |
| 404 | Recurso no encontrado |
| 429 | Rate limit alcanzado (max 20 req/15 min en /auth) |
| 500 | Error interno del servidor |

---

## Variables de entorno

Ver `Backend/.env.example` para la lista completa de variables configurables.
