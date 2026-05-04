# GUÍA DE PRESENTACIÓN — Prototipo de Generación Óptima de Horarios Académicos

**Taller de Proyectos 2 — Ingeniería de Sistemas e Informática**

---

## Antes de comenzar

Tener abierto y listo:
- Terminal con el **backend corriendo** (`npm run dev` en `Backend/`)
- Terminal con el **frontend corriendo** (`npm run dev` en `Frontend/`)
- Navegador en `http://localhost:5173`
- VS Code con el proyecto abierto
- GitHub del repositorio abierto en otra pestaña

---

---

## PUNTO 1 — Organización del Entorno

### Qué mostrar
1. GitHub abierto → mostrar las **ramas del equipo** (main, Gabo, Gabriel, Piero, Franklin, Cristian)
2. VS Code → abrir la **estructura de carpetas**: `Backend/`, `Frontend/`, `docs/`
3. Abrir el archivo `README.md` de la raíz del proyecto
4. Mostrar las **dos terminales corriendo** (backend en 5000, frontend en 5173)

### Qué decir

> "Nuestro repositorio está organizado en Git con ramas individuales por integrante del equipo, lo que nos permitió trabajar en paralelo sin conflictos. La rama `main` contiene el código estable e integrado."

> "El stack tecnológico que usamos es **MERN completo**:
> - **M** — MongoDB Atlas como base de datos en la nube
> - **E** — Express.js como servidor de la API REST
> - **R** — React 19 como interfaz de usuario
> - **N** — Node.js como entorno de ejecución del servidor"

> "El proyecto está separado en dos carpetas: `Backend` contiene toda la lógica del servidor y el algoritmo, y `Frontend` contiene la interfaz web. La carpeta `docs` contiene toda la documentación técnica del proyecto."

> "Como pueden ver en las terminales, el backend está conectado a MongoDB y corriendo en el puerto 5000, y el frontend está disponible en el puerto 5173."

---

---

## PUNTO 2 — Modelado del Problema

### Qué mostrar
1. Abrir `docs/Inicio/Enfoque del proyecto.md` — leer las secciones 1.1 y 1.2
2. Abrir `Backend/csp/constraints.js` — mostrar las funciones `hasConflict` y `sameCourseConflict`
3. Abrir `Backend/csp/scoring.js` — mostrar los 5 criterios con sus pesos
4. Abrir `Backend/models/Teacher.js` — mostrar el campo `availability` (grilla 5×12)

### Qué decir

> "El problema de generación de horarios es un problema NP-completo, lo que significa que la cantidad de combinaciones posibles crece exponencialmente con el número de cursos, docentes y aulas. Por eso lo modelamos como un **Constraint Satisfaction Problem (CSP)**."

> "En el CSP definimos tres elementos fundamentales: las **variables** (cada sesión de cada curso que hay que programar), los **dominios** (todos los posibles bloques horario-aula para esa sesión) y las **restricciones** (las reglas que eliminan combinaciones inválidas)."

**Mostrar `constraints.js` y explicar:**

> "Implementamos **7 restricciones duras** — son obligatorias, ningún horario válido puede violarlas:
> 1. Un docente no puede dictar dos cursos al mismo tiempo
> 2. Un aula no puede usarse por dos cursos simultáneamente
> 3. Un estudiante no puede asistir a dos cursos en el mismo bloque
> 4. El tipo de aula debe coincidir con el curso (teoría, laboratorio, taller)
> 5. La capacidad del aula debe ser mayor o igual a la matrícula del curso
> 6. El docente debe estar disponible en el horario asignado — aquí cada docente tiene una grilla de 5 días por 12 bloques horarios donde 0 = no disponible, 1 = disponible, 2 = horario preferido
> 7. Las sesiones del mismo curso deben estar en días distintos"

**Mostrar `scoring.js` y explicar:**

> "Además de las restricciones duras, definimos **5 criterios de optimización** con pesos distintos según su importancia. El sistema no solo genera un horario válido, sino el mejor posible según estos criterios:
> - **Spread (peso 7):** distribuir las sesiones del mismo curso en días distintos para no saturar un solo día
> - **Gaps (peso 6):** minimizar los huecos vacíos en el horario del estudiante
> - **Pref (peso 5):** usar los horarios que el docente marcó como preferidos
> - **Balance (peso 4):** distribuir la carga académica uniformemente a lo largo de la semana
> - **Core (peso 3):** preferir el horario central entre las 9am y 5pm"

---

---

## PUNTO 3 — Especificación y Enfoque de Desarrollo

### Qué mostrar
1. Abrir `docs/Inicio/Especificacion-casos-de-uso.md` — leer la sección de Google Antigravity
2. Mostrar 2 casos de uso en formato Given/When/Then (CU-01 y CU-02)
3. Mostrar la tabla de trazabilidad al final del documento
4. Abrir `docs/Inicio/Enfoque del proyecto.md` — sección 1.4 Google Antigravity

### Qué decir

> "Aplicamos **Spec-Driven Development**: antes de escribir cualquier línea de código del algoritmo, escribimos la especificación de lo que debía hacer en formato Given/When/Then. Esto nos aseguró que cada funcionalidad tuviera criterios de aceptación claros y verificables."

**Leer CU-01 en voz alta:**

> "Por ejemplo, el caso de uso 1 dice: DADO que soy coordinador autenticado y existen cursos con docentes y aulas, CUANDO ejecuto la generación, ENTONCES el horario resultante no tiene ningún docente en dos lugares al mismo tiempo, ningún aula usada en paralelo, ningún estudiante con conflicto de horario, y el tiempo de generación es menor a 2 segundos. Ese criterio se convirtió directamente en un test automatizado."

> "Como soporte conceptual usamos el principio de **Google Antigravity**, que en nuestro contexto significa lo siguiente: en lugar de decirle al sistema exactamente qué hacer, le decimos qué está **prohibido** — las restricciones actúan como 'gravedad' que elimina las combinaciones inválidas. El algoritmo entonces queda libre de explorar el espacio de soluciones restante, que es exactamente el espacio válido. Esto es lo que hace el forward checking en nuestro solver: antes de intentar una asignación, ya sabe qué opciones están bloqueadas."

**Mostrar la tabla de trazabilidad:**

> "Cada caso de uso está trazado directamente al archivo de test y a la función de código correspondiente, lo que garantiza que todo lo especificado está implementado y verificado."

---

---

## PUNTO 4 — Implementación con TDD

### Qué mostrar
1. Abrir `Backend/__tests__/` — mostrar los 5 archivos de test
2. Abrir `Backend/__tests__/solver.test.js` — mostrar un test concreto
3. En terminal ejecutar: `npm test` dentro de `Backend/`
4. Mostrar los 74 tests pasando en verde
5. Abrir `docs/Inicio/TDD-evidencias.md` — mostrar el ciclo Red-Green-Refactor documentado

### Qué decir

> "Implementamos **Test-Driven Development** para el núcleo del algoritmo. El ciclo que seguimos fue: primero escribir un test que falla porque la función no existe (RED), luego implementar el mínimo código necesario para que pase (GREEN), y finalmente mejorar el código sin romper nada (REFACTOR)."

**Mostrar un test concreto de `solver.test.js` y explicar:**

> "Por ejemplo, antes de implementar `hasConflict`, escribimos el test que verifica que si dos cursos tienen el mismo docente y se solapan en el mismo día, el sistema detecta el conflicto. El test falló porque la función no existía. Luego la implementamos, el test pasó, y después la extendimos para detectar también conflictos de aula y de estudiantes."

**Ejecutar `npm test` en vivo:**

> "Como pueden ver, tenemos **74 tests automatizados que cubren los 5 módulos del algoritmo**:
> - `constraints.test.js` — verifica cada tipo de conflicto posible
> - `solver.test.js` — verifica que el solver encuentra soluciones válidas y respeta todas las restricciones
> - `scoring.test.js` — verifica que cada criterio de optimización funciona correctamente
> - `variables.test.js` — verifica que los dominios se construyen correctamente filtrando por tipo y capacidad de aula
> - `metrics.test.js` — verifica el cálculo de métricas como utilización de aulas y balance de carga"

> "Todos los tests pasan en verde, lo que nos da confianza de que el algoritmo se comporta exactamente como fue especificado."

---

---

## PUNTO 5 — Requisitos No Funcionales

### Qué mostrar
1. Abrir `docs/Inicio/Lista preliminar.md` — mostrar la tabla de RNF con métricas
2. Abrir `Backend/config/performance.js` — mostrar las constantes de SLA
3. Abrir `Backend/middleware/performanceMonitor.js` — mostrar el monitoreo automático
4. En el navegador ir a `http://localhost:5000/api/health` — mostrar el JSON de estado
5. Mostrar en la terminal los logs con tiempos de respuesta al hacer una petición

### Qué decir

> "Documentamos 10 requisitos no funcionales con **métricas medibles y verificables**, no solo descripciones generales. Cada requisito tiene un número concreto que se puede medir."

**Mostrar `performance.js`:**

> "Los SLAs del sistema están definidos como constantes en el código: la generación de horarios debe completarse en máximo **2000 milisegundos**, y las respuestas de la API en máximo **500 milisegundos**. Estos no son valores arbitrarios: están medidos automáticamente en cada petición."

**Mostrar `performanceMonitor.js`:**

> "Este middleware intercepta cada petición al servidor, mide el tiempo que toma, y lo registra en los logs. Si supera el límite, lo marca como excedido. Así tenemos evidencia real del rendimiento."

**Abrir `/api/health` en el navegador:**

> "El endpoint `/api/health` nos da el estado actual del servidor en tiempo real: uptime, uso de memoria, y los targets de rendimiento configurados."

> "En términos de escalabilidad: el algoritmo corre en un **worker thread separado**, lo que significa que no bloquea el servidor mientras genera el horario — otros usuarios pueden seguir haciendo peticiones normalmente. Las métricas del dashboard están **cacheadas por 60 segundos** para no golpear la base de datos en cada consulta. Y el endpoint de login tiene un **rate limit de 20 intentos por 15 minutos** para protección contra ataques de fuerza bruta."

---

---

## PUNTO 6 — Entregable (Demo en vivo)

### Qué mostrar — secuencia completa

**Paso 1 — Login**
- Ir a `http://localhost:5173`
- Iniciar sesión con `coord@uni.edu` / `coord123`

> "El sistema tiene 4 roles: admin, coordinador, docente y estudiante. Cada uno ve una interfaz diferente según sus permisos. Ingresamos como coordinador, que es el actor principal del sistema."

---

**Paso 2 — Ver los datos cargados**
- Ir a la sección "Datos"
- Mostrar la lista de docentes con sus disponibilidades
- Mostrar los cursos con tipo de aula y sesiones por semana
- Mostrar las aulas con tipo y capacidad

> "Estos son los datos de entrada del algoritmo: 5 docentes con sus grillas de disponibilidad horaria, 10 cursos distribuidos entre los docentes, y 8 aulas de distintos tipos. Todo esto está almacenado en MongoDB Atlas."

---

**Paso 3 — Generar el horario**
- Ir a "Generar horario"
- Mostrar los pesos de los criterios de optimización
- Ejecutar la generación
- Mostrar el log en tiempo real y el tiempo que tardó

> "Antes de generar, podemos ajustar los pesos de los criterios de optimización. Por defecto priorizamos la distribución por semana y la minimización de huecos. Al ejecutar, el solver corre en segundo plano y nos muestra en tiempo real cuántos nodos exploró y cuánto tardó. En este caso tardó X milisegundos, dentro del objetivo de 2000ms."

---

**Paso 4 — Ver el horario generado**
- Ir a "Horario"
- Mostrar la grilla visual de horarios
- Filtrar por docente y por sección
- Mover una sesión con drag-and-drop

> "El horario generado se visualiza en una grilla interactiva. Podemos filtrar por docente para ver su carga individual, o por sección para ver el horario de los estudiantes. El coordinador también puede hacer ajustes manuales arrastrando y soltando sesiones directamente en la grilla."

---

**Paso 5 — Exportar PDF**
- Hacer clic en "Exportar PDF"
- Mostrar el archivo descargado

> "El horario puede exportarse a PDF para distribución impresa o digital."

---

**Paso 6 — Dashboard de métricas**
- Ir a "Dashboard"
- Mostrar utilización de aulas, balance de carga, score general

> "El dashboard muestra métricas del horario generado: qué porcentaje de su capacidad está usando cada aula, qué tan equilibrada es la carga académica entre los estudiantes, y el puntaje general de optimización."

---

**Paso 7 — Mostrar los tests como cierre**
- Ir a la terminal
- Ejecutar `npm test`
- Mostrar los 74 tests en verde

> "Para cerrar, aquí están las evidencias técnicas del prototipo: 74 tests automatizados que validan el algoritmo, todos pasando. Esto garantiza que el sistema cumple con las condiciones especificadas desde el inicio del proyecto."

---

---

## Posibles preguntas y cómo responderlas

**¿Por qué CSP y no un algoritmo genético o búsqueda aleatoria?**
> "El CSP con backtracking nos garantiza encontrar la solución óptima dentro del espacio válido, no solo una solución aceptable. El forward checking elimina opciones inválidas antes de intentarlas, lo que lo hace mucho más eficiente que una búsqueda aleatoria."

**¿Qué pasa si no hay solución posible?**
> "El solver detecta cuándo un dominio queda vacío durante la búsqueda (forward checking) y retrocede inmediatamente. Si agota todos los caminos dentro del tiempo límite, devuelve un mensaje explicando por qué no se pudo generar: por ejemplo, 'el docente X no tiene disponibilidad compatible con el tipo de aula requerida'."

**¿Cómo garantizan la seguridad?**
> "Todos los endpoints excepto el login requieren un token JWT válido. Los roles controlan qué operaciones puede hacer cada usuario. El servidor tiene cabeceras de seguridad HTTP activadas con Helmet, y el login tiene rate limiting para prevenir ataques de fuerza bruta."

**¿Cómo escala el sistema con más datos?**
> "El algoritmo corre en un worker thread que no bloquea el servidor. Las métricas están cacheadas. MongoDB Atlas maneja el escalado de la base de datos. Para conjuntos de datos muy grandes, los parámetros de `maxNodes` y `timeout` del solver se pueden ajustar."

**¿Por qué no hay tests en el frontend?**
> "Los tests cubren el núcleo crítico del sistema, que es el algoritmo de generación. La interfaz fue validada manualmente durante el desarrollo. En una siguiente iteración agregaríamos tests con React Testing Library."

---

## Tiempos sugeridos

| Punto | Tiempo |
|-------|--------|
| 1. Organización del Entorno | 3 min |
| 2. Modelado del Problema | 5 min |
| 3. Especificación y Enfoque | 4 min |
| 4. TDD | 4 min |
| 5. Requisitos No Funcionales | 3 min |
| 6. Demo en vivo | 6 min |
| Preguntas | 5 min |
| **Total** | **30 min** |
