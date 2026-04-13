# 📌 Sistema de Generación Óptima de Horarios Académicos (MERN Stack)

---

## 📑 Tabla de Contenidos

* [1. Visión del Proyecto](#1-visión-del-proyecto)
* [2. Descripción del Problema](#2-descripción-del-problema)
* [3. Complejidad del Problema](#3-complejidad-del-problema)
* [4. Requerimientos](#4-requerimientos)

  * [4.1 Requerimientos Funcionales](#41-requerimientos-funcionales)
  * [4.2 Requerimientos No Funcionales](#42-requerimientos-no-funcionales)
* [5. Restricciones](#5-restricciones)
* [6. Supuestos](#6-supuestos)
* [7. Arquitectura (ARC42)](#7-arquitectura-arc42)
* [8. Metodología](#8-metodología)
* [9. Stack Tecnológico](#9-stack-tecnológico)
* [10. Equipo](#10-equipo)
* [11. Documentación](#11-documentación)

---

## 1. Visión del Proyecto

* **Problema:** Las universidades con currículos flexibles enfrentan dificultades para generar horarios sin conflictos.
* **Solución:** Desarrollo de un sistema basado en un modelo de optimización tipo CSP que automatiza la generación de horarios.
* **Usuarios:** Administradores académicos y coordinadores.
* **Beneficio:** Reducción significativa del tiempo de planificación y minimización de conflictos.
* **Diferenciador:** Uso de técnicas de optimización combinatoria integradas en una aplicación web moderna.

---

## 2. Descripción del Problema

El problema consiste en asignar cursos, docentes, aulas y horarios cumpliendo múltiples restricciones. Esto implica evaluar una gran cantidad de combinaciones posibles para encontrar una solución válida y óptima.

---

## 3. Complejidad del Problema

El problema presenta alta complejidad debido a:

* Naturaleza combinatoria (explosión exponencial de soluciones).
* Múltiples restricciones simultáneas (docentes, aulas, horarios).
* Dependencias entre variables.
* Necesidad de soluciones en tiempo razonable.
* Modelado como Problema de Satisfacción de Restricciones (CSP).

---

## 4. Requerimientos

### 4.1 Requerimientos Funcionales

* **RF1:** El sistema debe permitir registrar cursos, docentes y aulas.
* **RF2:** El sistema debe generar horarios automáticamente usando un modelo CSP.
* **RF3:** El sistema debe evitar conflictos de horarios.
* **RF4:** El sistema debe mostrar los horarios generados en una interfaz visual.
* **RF5:** El sistema debe permitir modificar parámetros de entrada.

### 4.2 Requerimientos No Funcionales

* **RNF1:** El sistema debe generar resultados en menos de 5 segundos.
* **RNF2:** La interfaz debe responder en menos de 2 segundos.
* **RNF3:** El sistema debe ser escalable.
* **RNF4:** El sistema debe ser mantenible y modular.
* **RNF5:** El sistema debe garantizar una experiencia de usuario intuitiva.

---

## 5. Restricciones

* El modelo debe ejecutarse en tiempo limitado.
* Uso exclusivo del stack MERN.
* No se permite dependencia de APIs externas en tiempo real.
* Dependencia de la calidad de datos ingresados.
* Limitaciones de hardware del entorno de ejecución.

---

## 6. Supuestos

* Los usuarios ingresan datos correctos.
* El sistema se ejecuta en un entorno estable.
* Existe conectividad a internet.
* Los usuarios tienen conocimientos básicos del sistema.

---

## 7. Arquitectura (ARC42)

### 7.1 Contexto

El sistema recibe datos desde el frontend, los procesa en el backend mediante un motor de optimización y devuelve horarios generados.

### 7.2 Contenedores

* **Frontend (React):** Interfaz de usuario dinámica.
* **Backend (Node.js + Express):** API REST.
* **Base de Datos (MongoDB):** Almacenamiento flexible.
* **Motor de Optimización:** Implementación del CSP.

### 7.3 Componentes

* Módulo de entrada de datos.
* Módulo de procesamiento (CSP).
* Módulo de visualización.
* Módulo de exportación.

### 7.4 Estilo Arquitectónico

El sistema sigue un modelo **SPA (Single Page Application)** que consume una API REST.
La lógica de optimización está desacoplada en el backend para permitir escalabilidad.

---

## 8. Metodología

Se adopta Scrum debido a:

* Iteraciones rápidas (sprints).
* Adaptación a cambios en requerimientos.
* Validación continua del producto.
* Entregas incrementales del PMV.

---

## 9. Stack Tecnológico

* **MongoDB:** Manejo flexible de datos académicos.
* **Express.js:** Gestión de rutas y lógica del backend.
* **Node.js:** Ejecución eficiente de procesos asíncronos.
* **React:** Interfaz dinámica sin recarga de página.

---

## 10. Equipo

### 👥 Roles (Scrum)

* **Scrum Master:** Gabriel D. Landa Sabuco – Facilitador y gestión de bloqueos.
* **Product Owner:** Piero Curassi Montano – Gestión del backlog y visión del cliente.
* **Fullstack Developer:** Rolfi Escobar Rojas – Implementación del modelo CSP.
* **Frontend & UX:**

  * Rojas Ortiz Franklin
  * Camarena Chavez Anthony

---

## 11. Documentación

Toda la gestión del proyecto bajo el marco **PMBOK** y **Scrum** se encuentra en la carpeta:

```
/docs
```

---
