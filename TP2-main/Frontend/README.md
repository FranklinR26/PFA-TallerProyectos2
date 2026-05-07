# HorarioConti — Frontend

Interfaz web del sistema inteligente de generación óptima de horarios académicos.

## Stack tecnológico

| Tecnología | Versión | Rol |
|-----------|---------|-----|
| React | 19.2.5 | Framework UI |
| Vite | 8.0.9 | Bundler y servidor de desarrollo |
| Zustand | — | Gestión de estado global |
| Axios | — | Cliente HTTP para consumo de la API REST |
| dnd-kit | — | Edición manual del horario por drag-and-drop |
| jsPDF | — | Exportación del horario a PDF |

## Estructura del proyecto

```
Frontend/src/
├── api/          # Clientes HTTP por dominio (auth, data, schedule, metrics, portal)
├── store/        # Stores de Zustand (authStore, scheduleStore, dataStore, etc.)
├── pages/        # Páginas principales de la aplicación
│   ├── LoginPage.jsx       # Autenticación por roles
│   ├── DataPage.jsx        # CRUD de docentes, aulas, cursos, estudiantes
│   ├── GeneratePage.jsx    # Configuración y ejecución del algoritmo CSP
│   ├── SchedulePage.jsx    # Visualización y edición del horario generado
│   ├── DashboardPage.jsx   # Métricas y estadísticas
│   └── PortalPage.jsx      # Portal del estudiante
├── components/   # Componentes reutilizables (Navbar, LogoUC)
└── router/       # Rutas protegidas por rol (ProtectedRoute)
```

## Roles de usuario

| Rol | Acceso |
|-----|--------|
| `admin` | Gestión completa |
| `coordinador` | Generación y edición de horarios |
| `docente` | Visualización de su horario |
| `estudiante` | Portal de matrícula y horario personal |

## Ejecutar en desarrollo

```bash
npm install
npm run dev
```

El frontend corre en `http://localhost:5173` y se comunica con el backend en `http://localhost:5000`.

## Credenciales de prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | admin@uni.edu | admin123 |
| Coordinador | coord@uni.edu | coord123 |
| Docente | cperez@uni.edu | doc123 |
| Estudiante | ana@uni.edu | est123 |
