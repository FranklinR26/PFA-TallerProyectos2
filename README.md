# 📌 Sistema de Generación Óptima de Horarios Académicos (MERN Stack)

## 📑 Tabla de Contenidos
- [1. Visión del Proyecto](#1-visión-del-proyecto)
- [2. Descripción del Problema](#2-descripción-del-problema)
- [3. Complejidad del Problema](#3-complejidad-del-problema)
- [4. Stakeholders](#4-stakeholders)
- [5. Supuestos](#5-supuestos)
- [6. Restricciones](#6-restricciones)
- [7. Requerimientos](#7-requerimientos)
- [8. Arquitectura (ARC42)](#8-arquitectura-arc42)
- [9. Selección del Enfoque](#9-selección-del-enfoque)
- [10. Metodología](#10-metodología)
- [11. Stack Tecnológico](#11-stack-tecnológico)
- [12. Equipo](#12-equipo)
- [13. Documentación](#13-documentación)

---

## 1. Visión del Proyecto

**Problema:**  
Las universidades con currículos flexibles enfrentan dificultades para generar horarios académicos sin conflictos debido a la alta cantidad de variables y restricciones.

**Solución:**  
Desarrollo de un sistema basado en un modelo de optimización tipo CSP (Constraint Satisfaction Problem) que automatiza la generación de horarios.

**Usuarios:**  
Administradores académicos y coordinadores.

**Beneficio:**  
Reducción del tiempo de planificación en al menos un 50% y minimización de conflictos en la asignación.

**Diferenciador:**  
Uso de técnicas de optimización combinatoria integradas en una aplicación web moderna basada en MERN.

---

## 2. Descripción del Problema

El problema consiste en asignar cursos, docentes, aulas y horarios cumpliendo múltiples restricciones simultáneamente.  
Esto implica evaluar un número elevado de combinaciones posibles para encontrar soluciones válidas y óptimas.

---

## 3. Complejidad del Problema

El problema presenta alta complejidad debido a:

- Naturaleza combinatoria (explosión exponencial de soluciones)  
- Múltiples restricciones simultáneas (docentes, aulas, horarios)  
- Dependencias entre variables  
- Necesidad de obtener soluciones en tiempo acotado  

**Modelado:** Problema de Satisfacción de Restricciones (CSP)

**Justificación técnica:**  
Debido a la naturaleza combinatoria del problema (NP-completo), se selecciona un modelo CSP que permite representar formalmente variables, dominios y restricciones, optimizando la búsqueda de soluciones factibles en tiempos razonables.

## Modelado Formal (CSP)

## Variables
 
```
X = {x₁, x₂, ..., xₙ}  donde cada xᵢ representa un curso
```
 
## Dominios
 
```
D(xᵢ) = {día, hora, aula}
```
 
## Restricciones Duras 
 
* Un docente no puede estar en dos cursos simultáneamente
* Un aula no puede tener más de un curso al mismo tiempo
* Se deben cumplir todas las horas asignadas por curso
* Capacidad del aula ≥ estudiantes
## Restricciones Suaves 
 
* Minimizar huecos en horarios
* Preferencias de docentes
* Evitar horarios extremos
## Función Objetivo
 
```
Minimizar: f = Σ penalizaciones (huecos + incumplimientos suaves)
```
---

## 4. Stakeholders

- Administradores académicos  
- Coordinadores  
- Docentes  
- Estudiantes  
- Equipo de desarrollo  

---

## 5. Supuestos

S1: Los datos ingresados son correctos y completos  
S2: El sistema se ejecuta en un entorno estable  
S3: Existe conectividad a internet  
S4: Los usuarios poseen conocimientos básicos del sistema  
S5: La generación de horarios ocurre por periodos académicos  

---

## 6. Restricciones

R1: El modelo CSP debe generar soluciones en un tiempo máximo de 5 segundos  
R2: Uso exclusivo del stack MERN (MongoDB, Express, React, Node.js)  
R3: No se permite el uso de APIs externas en tiempo real  
R4: Limitaciones de hardware del entorno de ejecución  
R5: Dependencia de la calidad de los datos ingresados  

---

## 7. Requerimientos

### 7.1 Requerimientos Funcionales (SMART)

RF-01: El sistema permitirá registrar cursos, docentes y aulas en un tiempo ≤2 segundos por operación.  
RF-02: El sistema generará horarios automáticamente mediante un modelo CSP en un tiempo ≤5 segundos.  
RF-03: El sistema evitará conflictos de asignación en al menos el 99% de los casos.  
RF-04: El sistema mostrará los horarios generados en una interfaz visual interactiva.  
RF-05: El sistema permitirá modificar parámetros de entrada antes de ejecutar la generación.  

### 7.2 Requerimientos No Funcionales (SMART)

RNF-01: El sistema responderá a las interacciones del usuario en un tiempo ≤2 segundos.  
RNF-02: El sistema soportará al menos 50 usuarios concurrentes.  
RNF-03: El sistema será modular para facilitar mantenimiento y escalabilidad.  
RNF-04: El sistema tendrá una disponibilidad mínima del 99%.  
RNF-05: La interfaz permitirá un aprendizaje del usuario en menos de 30 minutos.  

---

## 8. Arquitectura (ARC42)

### 8.1 Contexto
El sistema recibe datos desde el frontend, los procesa en el backend mediante un motor CSP y devuelve horarios optimizados.

### 8.2 Contenedores
- Frontend (React): Interfaz de usuario  
- Backend (Node.js + Express): API REST  
- Base de Datos (MongoDB): Persistencia de datos  
- Motor CSP: Lógica de optimización  

### 8.3 Componentes
- Módulo de entrada de datos  
- Módulo de procesamiento (CSP)  
- Módulo de visualización  
- Módulo de exportación  

### 8.4 Estilo Arquitectónico
Arquitectura SPA (Single Page Application) que consume una API REST.  
El motor CSP se encuentra desacoplado en el backend para mejorar escalabilidad y mantenibilidad.

---

## 9. Selección del Enfoque

### Alternativas evaluadas

| Criterio | Algoritmos tradicionales | CSP |
|---------|------------------------|-----|
| Manejo de restricciones | Limitado | Alto |
| Flexibilidad | Baja | Alta |
| Eficiencia en combinatoria | Baja | Alta |

### Decisión
Se selecciona CSP debido a su capacidad para modelar múltiples restricciones simultáneamente y resolver problemas combinatorios de forma eficiente.
## Implementación con TDD
 
## Estrategia
 
Se aplica el ciclo iterativo:
 
```
RED → GREEN → REFACTOR
```
 
1. **RED**: Escribir el test antes de implementar la funcionalidad (falla intencionalmente).
2. **GREEN**: Implementar el mínimo código necesario para que el test pase.
3. **REFACTOR**: Mejorar el código sin romper los tests existentes.
## Ubicación de los Tests
 
```
TP2-main/
└── Otros/
    └── tests/
        ├── generarHorario.test.js
        ├── validarConflictos.test.js
        └── restricciones.test.js
```
 
## Ejecutar Tests
 
```bash
cd TP2-main/Otros
npm test
```
 
Para ver cobertura:
 
```bash
npm test -- --coverage
```
 
## Casos de Test (Jest)
 
### Caso 1: Generación sin conflictos de docente
 
```javascript
const { generarHorario } = require('../src/csp/generarHorario');
const { validarConflictosDocente } = require('../src/csp/validaciones');
 
test("no hay conflictos de docente en el horario generado", () => {
  const data = {
    cursos: [
      { id: "C1", docente: "D1", horas: 2 },
      { id: "C2", docente: "D1", horas: 2 },
    ],
    aulas: ["A1", "A2"],
    slots: ["LUN-8:00", "LUN-10:00", "MAR-8:00"]
  };
  const horario = generarHorario(data);
  expect(validarConflictosDocente(horario)).toBe(true);
});
```
 
### Caso 2: Generación sin conflictos de aula
 
```javascript
test("no hay conflictos de aula en el horario generado", () => {
  const data = {
    cursos: [
      { id: "C1", docente: "D1", horas: 1 },
      { id: "C2", docente: "D2", horas: 1 },
    ],
    aulas: ["A1"],
    slots: ["LUN-8:00", "LUN-10:00"]
  };
  const horario = generarHorario(data);
  expect(validarConflictosAula(horario)).toBe(true);
});
```
 
### Caso 3: Backtracking cuando no hay slots disponibles
 
```javascript
test("retorna null si no existe solución válida", () => {
  const dataImposible = {
    cursos: [
      { id: "C1", docente: "D1", horas: 3 },
      { id: "C2", docente: "D1", horas: 3 },
    ],
    aulas: ["A1"],
    slots: ["LUN-8:00"] // Solo 1 slot para 2 cursos del mismo docente
  };
  const horario = generarHorario(dataImposible);
  expect(horario).toBeNull();
});
```
 
### Caso 4: Todas las horas requeridas son asignadas
 
```javascript
test("todos los cursos tienen sus horas asignadas", () => {
  const data = { /* dataset válido */ };
  const horario = generarHorario(data);
  data.cursos.forEach(curso => {
    const horasAsignadas = horario.filter(h => h.cursoId === curso.id).length;
    expect(horasAsignadas).toBe(curso.horas);
  });
});
```
 
## Cobertura
 
* Cobertura objetivo ≥ 70%
* Módulos críticos (CSP, validaciones): ≥ 90%
 
---
 
# 10. Instalación y Ejecución
 
## Prerrequisitos
 
* Node.js ≥ 18
* MongoDB (local o Atlas)
* Git
## 1. Clonar el repositorio
 
```bash
git clone https://github.com/FranklinR26/PFA-TallerProyectos2.git
cd PFA-TallerProyectos2/TP2-main
```
 
## 2. Configurar variables de entorno
 
Crear el archivo `.env` dentro de `server/`:
 
```bash
cp server/.env.example server/.env
```
 
Editar `server/.env` con tus valores:
 
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/horarios_db
```
 
> Si usas MongoDB Atlas, reemplaza `MONGODB_URI` con tu connection string.
 
## 3. Instalar y ejecutar el Backend
 
```bash
cd server
npm install
npm run dev
```
 
El servidor estará disponible en: `http://localhost:5000`
 
## 4. Instalar y ejecutar el Frontend
 
En otra terminal:
 
```bash
cd ../client
npm install
npm run dev
```
 
La aplicación estará disponible en: `http://localhost:5173`
 
## 5. Ejecutar los Tests
 
```bash
cd server
npm test
```
 
Para ver el reporte de cobertura:
 
```bash
npm test -- --coverage
```
---

## 11. Metodología

Se adopta Scrum debido a:

- Iteraciones cortas (Sprints)  
- Adaptación a cambios en requerimientos  
- Validación continua del producto  
- Entregas incrementales del PMV  

---

## 12. Stack Tecnológico

- MongoDB → almacenamiento de datos  
- Express.js → backend y API REST  
- Node.js → ejecución del servidor  
- React → interfaz de usuario  

---

## 13. Equipo

### Roles Scrum

- Scrum Master: Gabriel D. Landa Sabuco  
- Product Owner: Piero Curassi Montano  
- Fullstack Developer: Rolfi Escobar Rojas  

### Frontend & UX
- Rojas Ortiz Franklin  
- Camarena Chavez Anthony  

### Normas de trabajo
- Daily Scrum de 15 minutos  
- Uso de control de versiones (Git)  
- Desarrollo incremental por sprints  

---

## 14. Documentación

La documentación del proyecto se encuentra en:

📂 📂 [Documentacion](./TP2-main/docs)

Incluye:
- Plan del proyecto  
- Backlog  
- Evidencias de sprints  
- Documentos de gestión  

---
