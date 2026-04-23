# Especificación del Sistema – Spec-Driven Development

---

## 1. Enfoque

El sistema se desarrolla bajo el enfoque **Spec-Driven Development**, donde los requisitos se formalizan mediante casos verificables antes de la implementación.

---

## 2. Casos de Uso Verificables

---

### Caso 1: Generación de horario sin conflictos

**Given:**

* Un conjunto de cursos con docentes asignados
* Un conjunto de aulas disponibles
* Un conjunto de slots de tiempo

**When:**

* Se ejecuta el algoritmo de generación de horarios

**Then:**

* No existen conflictos de docente
* No existen conflictos de aula
* Todas las horas de los cursos son asignadas

---

### Caso 2: Validación de conflictos de docente

**Given:**

* Un horario generado

**When:**

* Se evalúan las asignaciones

**Then:**

* Ningún docente tiene más de un curso en el mismo horario

---

### Caso 3: Validación de conflictos de aula

**Given:**

* Un horario generado

**When:**

* Se evalúan las asignaciones

**Then:**

* Ningún aula tiene más de un curso en el mismo horario

---

### Caso 4: Escenario sin solución

**Given:**

* Cursos con requerimientos incompatibles
* Slots insuficientes

**When:**

* Se ejecuta el algoritmo

**Then:**

* El sistema retorna null indicando que no existe solución válida

---

### Caso 5: Cumplimiento de horas por curso

**Given:**

* Cursos con un número específico de horas

**When:**

* Se genera el horario

**Then:**

* Cada curso tiene asignado exactamente su número de horas

---

## 3. Criterios de Aceptación

* El sistema genera horarios válidos en ≥ 99% de los casos
* El tiempo de generación es ≤ 5 segundos
* No existen conflictos en resultados válidos
* El sistema identifica correctamente escenarios sin solución

---

## 4. Trazabilidad Requisitos → Pruebas

| Requisito                    | Prueba                    |
| ---------------------------- | ------------------------- |
| RF-02 Generación de horarios | generarHorario.test.js    |
| RF-03 Evitar conflictos      | validarConflictos.test.js |
| RF-01 Registro de datos      | pruebas de API            |
| RF-04 Visualización          | pruebas de interfaz       |

---

## 5. Validación

Los casos definidos se validan mediante:

* Pruebas automatizadas (Jest)
* Validación lógica en backend
* Ejecución con datasets simulados

---

## 6. Consideraciones

* Los casos cubren escenarios normales y extremos
* Permiten verificar el cumplimiento de requisitos funcionales
* Facilitan el enfoque TDD

---
