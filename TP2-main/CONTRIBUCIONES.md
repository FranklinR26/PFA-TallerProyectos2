# Guía de Contribución

Gracias por tu interés en contribuir a **HorarioConti**. Esta guía describe el flujo de trabajo y las convenciones del proyecto.

## Requisitos previos

- Node.js 20+
- Docker y Docker Compose
- MongoDB 7+ (o usar el contenedor del `docker-compose.yml`)
- Git

## Configuración del entorno

```bash
git clone https://github.com/FranklinR26/PFA-TallerProyectos2.git
cd PFA-TallerProyectos2/TP2-main

# Backend
cd Backend
cp .env.example .env   # edita las variables según tu entorno
npm install
npm run dev

# Frontend (en otra terminal)
cd ../Frontend
npm install
npm run dev
```

O con Docker:

```bash
cd TP2-main
docker compose up --build
```

## Flujo de trabajo

1. Crea una rama desde `main`:
   ```bash
   git checkout -b feature/mi-feature
   ```
2. Realiza tus cambios siguiendo las convenciones de código.
3. Ejecuta los tests:
   ```bash
   cd Backend && npm test
   cd ../Frontend && npm test
   ```
4. Ejecuta el linter:
   ```bash
   cd Frontend && npm run lint
   ```
5. Crea un commit con mensaje descriptivo:
   ```bash
   git commit -m "feat: descripción breve del cambio"
   ```
6. Abre un Pull Request hacia `main`.

## Convenciones de commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

| Prefijo | Uso |
|---------|-----|
| `feat:` | Nueva funcionalidad |
| `fix:` | Corrección de bug |
| `docs:` | Cambios en documentación |
| `test:` | Añadir o modificar tests |
| `refactor:` | Refactorización sin cambio funcional |
| `chore:` | Tareas de mantenimiento (dependencias, configs) |
| `security:` | Correcciones de seguridad |

## Estilo de código

- **Indentación:** 2 espacios (ver `.editorconfig`).
- **Frontend:** ESLint configurado — ejecutar `npm run lint`.
- **Backend:** Seguir el estilo existente (ES modules, async/await).
- **Sin comentarios innecesarios:** el código debe ser autoexplicativo.

## Tests

- Backend: Vitest — archivos en `Backend/__tests__/`.
- Frontend: Vitest + React Testing Library — archivos en `Frontend/src/__tests__/`.
- E2E: Cypress y Playwright configurados en el frontend.
- Cobertura: `npm run test:coverage` en cada directorio.

## Reporte de bugs

Usa la plantilla de issues en `.github/ISSUE_TEMPLATE/bug_report.md`.
