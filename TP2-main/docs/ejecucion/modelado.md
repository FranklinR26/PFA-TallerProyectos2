# Modelado del Problema – Generación de Horarios Académicos

---

## 1. Descripción General

El problema consiste en asignar cursos a combinaciones de tiempo y espacio (slots y aulas), respetando restricciones académicas.
Se modela como un **Problema de Satisfacción de Restricciones (CSP)**.

---

## 2. Definición del Modelo

### 2.1 Variables

Sea:

X = {x₁, x₂, ..., xₙ}

Donde cada variable xᵢ representa una sesión de un curso.

> Nota: Si un curso tiene múltiples horas, se descompone en varias variables.

---

### 2.2 Dominios

Cada variable xᵢ puede tomar valores del dominio:

D(xᵢ) = { (día, hora, aula) }

Ejemplo:

* (Lunes, 8:00, Aula A1)
* (Martes, 10:00, Aula B2)

---

## 3. Restricciones

### 3.1 Restricciones Duras (Hard Constraints)

Estas restricciones deben cumplirse obligatoriamente:

* Un docente no puede estar en dos cursos al mismo tiempo
* Un aula no puede asignarse a más de un curso en el mismo horario
* Todas las horas de cada curso deben ser asignadas
* La capacidad del aula debe ser suficiente para los estudiantes

---

### 3.2 Restricciones Suaves (Soft Constraints)

Estas restricciones se optimizan, pero pueden violarse con penalización:

* Minimizar huecos en horarios
* Preferencias de docentes
* Evitar horarios extremos

---

## 4. Función Objetivo

El objetivo es minimizar las penalizaciones derivadas de restricciones suaves:

f = Σ penalizaciones

Donde:

* Penalización por huecos
* Penalización por incumplimiento de preferencias
* Penalización por distribución ineficiente

---

## 5. Representación del Problema

El problema se representa como:

CSP = (X, D, C)

Donde:

* X = Variables
* D = Dominios
* C = Conjunto de restricciones

---

## 6. Complejidad

El problema es de naturaleza combinatoria y pertenece a la clase NP-completa.

El espacio de búsqueda crece exponencialmente:

O(n!)

---

## 7. Estrategia de Resolución

Se emplea:

* Backtracking
* Validación de restricciones
* Poda del espacio de búsqueda

Esto permite encontrar soluciones válidas en tiempo razonable para tamaños de entrada moderados.

---

## 8. Consideraciones

* La calidad de la solución depende de los datos de entrada
* El rendimiento puede degradarse con grandes volúmenes
* El modelo es extensible a optimizaciones futuras (heurísticas)

---
