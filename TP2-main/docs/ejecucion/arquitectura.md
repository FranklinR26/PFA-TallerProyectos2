# Arquitectura del Sistema (ARC42)

---

## 1. Visión General

El sistema sigue una arquitectura basada en el modelo **SPA + API REST**, con separación clara entre frontend, backend y lógica de optimización.

---

## 2. Contexto del Sistema

El sistema:

1. Recibe datos desde el usuario (frontend)
2. Envía datos al backend
3. Procesa mediante el motor CSP
4. Devuelve el horario generado

---

## 3. Vista de Contenedores

### Frontend

* Tecnología: React
* Función: Interfaz de usuario
* Responsabilidad: Captura y visualización

### Backend

* Tecnología: Node.js + Express
* Función: API REST
* Responsabilidad: lógica del sistema

### Base de Datos

* Tecnología: MongoDB
* Función: Persistencia
* Responsabilidad: almacenamiento de datos

### Motor CSP

* Ubicación: Backend
* Función: generación de horarios
* Responsabilidad: resolver restricciones

---

## 4. Vista de Componentes

### Módulo de Entrada

* Registro de cursos, docentes y aulas

### Módulo CSP

* Algoritmo de generación
* Validación de restricciones

### Módulo de Validación

* Verificación de conflictos

### Módulo de Visualización

* Representación de horarios

---

## 5. Flujo de Datos

1. Usuario ingresa datos
2. Frontend envía request HTTP
3. Backend procesa datos
4. Motor CSP genera solución
5. Backend responde
6. Frontend muestra resultado

---

## 6. Estilo Arquitectónico

* SPA (Single Page Application)
* API REST
* Arquitectura desacoplada

---

## 7. Decisiones Arquitectónicas

* Separación frontend/backend para escalabilidad
* Motor CSP independiente para mantenibilidad
* Uso de MongoDB por flexibilidad de datos

---

## 8. Requisitos No Funcionales Relacionados

* Rendimiento: procesamiento ≤ 5 segundos
* Escalabilidad: soporte ≥ 100 cursos
* Disponibilidad: 99%
* Mantenibilidad: arquitectura modular

---

## 9. Limitaciones

* Dependencia de la calidad de datos
* Posible incremento de tiempo en grandes datasets
* No se implementan heurísticas avanzadas en MVP

---

## 10. Evolución Futura

* Integración de algoritmos genéticos
* Optimización avanzada de horarios
* Escalabilidad horizontal

---
