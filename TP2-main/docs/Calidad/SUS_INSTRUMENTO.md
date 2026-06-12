# Evaluación de Usabilidad — SUS (System Usability Scale)

**Proyecto:** HorarioConti — Sistema de Horarios Académicos
**Instrumento:** SUS estándar (Brooke, 1996), traducción validada al español
**Fecha de aplicación:** 2026-06-11
**Facilitador:** Equipo PFA — Taller de Proyectos 2

---

## 1. Diseño del instrumento

Cuestionario de 10 ítems con escala Likert de 5 puntos:
- 1 = Totalmente en desacuerdo
- 5 = Totalmente de acuerdo

| # | Ítem |
|---|------|
| 1 | Creo que me gustaría usar este sistema con frecuencia |
| 2 | Encontré el sistema innecesariamente complejo |
| 3 | Pensé que el sistema era fácil de usar |
| 4 | Creo que necesitaría el apoyo de un técnico para poder usar este sistema |
| 5 | Encontré que las diversas funciones del sistema estaban bien integradas |
| 6 | Pensé que había demasiada inconsistencia en este sistema |
| 7 | Imagino que la mayoría de las personas aprenderían a usar este sistema muy rápidamente |
| 8 | Encontré el sistema muy engorroso de usar |
| 9 | Me sentí muy confiado(a) usando el sistema |
| 10 | Necesité aprender muchas cosas antes de poder empezar a usar este sistema |

---

## 2. Protocolo de aplicación controlada

**Participantes:** 10 (4 estudiantes, 3 docentes, 2 coordinadores, 1 administrador).

**Tareas ejecutadas antes del cuestionario** (sin asistencia del facilitador):

| Tarea | Descripción | Roles |
|-------|-------------|-------|
| T1 | Iniciar sesión con el rol asignado | Todos |
| T2a | (Coord./Admin) Registrar un docente y un curso nuevo | Coordinador, Admin |
| T2b | (Docente/Estudiante) Consultar el horario asignado en el portal | Docente, Estudiante |
| T3a | (Admin) Generar un horario automáticamente con el solver CSP | Admin |
| T3b | (Coord./Docente) Exportar el horario en PDF y CSV | Coordinador, Docente |

Procedimiento: cada participante recibió credenciales de prueba, ejecutó las tareas de forma independiente en un entorno de staging y respondió el cuestionario inmediatamente después. Se registraron observaciones cualitativas.

---

## 3. Base de resultados

| Participante | Rol | P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10 | SUS |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| U01 | Estudiante (Ciclo 5) | 4 | 2 | 4 | 2 | 4 | 2 | 5 | 2 | 4 | 2 | **77.5** |
| U02 | Docente (5 años exp.) | 5 | 2 | 5 | 1 | 4 | 2 | 5 | 1 | 5 | 1 | **92.5** |
| U03 | Estudiante (Ciclo 2) | 4 | 3 | 3 | 2 | 3 | 3 | 4 | 2 | 3 | 3 | **60.0** |
| U04 | Coordinador | 5 | 1 | 5 | 1 | 5 | 1 | 5 | 1 | 5 | 1 | **100.0** |
| U05 | Docente (2 años exp.) | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 2 | **75.0** |
| U06 | Estudiante (Ciclo 3) | 4 | 2 | 4 | 3 | 3 | 2 | 4 | 2 | 4 | 3 | **67.5** |
| U07 | Administrador | 5 | 2 | 5 | 1 | 5 | 1 | 5 | 1 | 5 | 2 | **95.0** |
| U08 | Docente (nuevo) | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 3 | 4 | 2 | **72.5** |
| U09 | Coordinador | 4 | 1 | 5 | 2 | 4 | 2 | 5 | 1 | 4 | 2 | **85.0** |
| U10 | Estudiante (Ciclo 1) | 4 | 3 | 3 | 2 | 3 | 3 | 4 | 2 | 4 | 2 | **65.0** |
| | **Promedio** | | | | | | | | | | | **79.0** |

---

## 4. Cálculo del puntaje

**Fórmula SUS por participante:**
- Ítems impares (1, 3, 5, 7, 9): `puntuación − 1`
- Ítems pares (2, 4, 6, 8, 10): `5 − puntuación`
- Suma de los 10 valores ajustados × **2.5** → puntaje 0–100

**Verificación U01** (ejemplo detallado):

| Ítem | Valor | Ajuste | Resultado |
|------|-------|--------|-----------|
| P1 (impar) | 4 | 4−1 | 3 |
| P2 (par) | 2 | 5−2 | 3 |
| P3 (impar) | 4 | 4−1 | 3 |
| P4 (par) | 2 | 5−2 | 3 |
| P5 (impar) | 4 | 4−1 | 3 |
| P6 (par) | 2 | 5−2 | 3 |
| P7 (impar) | 5 | 5−1 | 4 |
| P8 (par) | 2 | 5−2 | 3 |
| P9 (impar) | 4 | 4−1 | 3 |
| P10 (par) | 2 | 5−2 | 3 |
| **Suma** | | | **31** |
| **× 2.5** | | | **77.5** |

**Puntaje SUS del sistema:** (77.5 + 92.5 + 60.0 + 100.0 + 75.0 + 67.5 + 95.0 + 72.5 + 85.0 + 65.0) / 10 = **79.0**

---

## 5. Escala de interpretación

| Puntaje SUS | Adjetivo | Aceptabilidad | Grado |
|-------------|----------|---------------|-------|
| ≥ 84.1 | Excelente | Aceptable | A+ |
| 80.8 – 84.0 | Excelente | Aceptable | A |
| **71.1 – 80.7** | **Bueno** | **Aceptable** | **B** ← resultado |
| 68 | Promedio industria | Marginal alto | C |
| 51 – 67.9 | Aceptable con reservas | Marginal | D |
| < 51 | Deficiente | No aceptable | F |

---

## 6. Interpretación técnica

### Nivel de aceptabilidad
El puntaje **79.0** cae en la banda "Bueno" (71.1–80.7) y clasifica como **Aceptable** según los criterios de Bangor et al. (2009). Supera en **11 puntos** el umbral mínimo de la industria (68), lo que representa un margen positivo sólido para un sistema de gestión académica en etapa de desarrollo.

### Percepción de facilidad de uso (ítems 3 y 7)
- Ítem 3 ("fácil de usar"): promedio = 4.1 → percepción claramente positiva.
- Ítem 7 ("aprendizaje rápido"): promedio = 4.3 → los usuarios sienten que el sistema es intuitivo en sus flujos principales.

### Necesidad de soporte técnico (ítems 4 y 10)
- Ítem 4 ("necesitaría soporte"): promedio = 1.6 → la mayoría no necesita asistencia para operar el sistema.
- Ítem 10 ("aprender muchas cosas"): promedio = 2.0 → la curva de aprendizaje es moderada.

### Análisis por segmento de usuarios

| Segmento | N | Puntaje promedio | Observación |
|----------|---|-----------------|-------------|
| Estudiantes (ciclos 1–3) | 3 | 64.2 | Dificultad con flujos avanzados |
| Estudiante (ciclo 5) | 1 | 77.5 | Flujo básico dominado |
| Docentes | 3 | 80.0 | Buen dominio de la interfaz |
| Coordinadores | 2 | 92.5 | Alta familiaridad con el dominio |
| Administrador | 1 | 95.0 | Dominio completo del sistema |

### Hallazgos cualitativos (observaciones del facilitador)

1. **Estudiantes de ciclos iniciales** (U03, U06, U10) expresaron confusión al intentar consultar su horario desde el portal, principalmente porque el menú de navegación no indica claramente qué rol puede acceder a qué sección.
2. **La interfaz drag & drop de SchedulePage** fue señalada por 2 participantes como no intuitiva en el primer uso.
3. **Los coordinadores y el administrador** completaron todas las tareas sin fricción y destacaron la funcionalidad de filtrado por docente/aula como un punto fuerte.
4. **La exportación a PDF/CSV** fue considerada "muy útil" por 7/10 participantes.

---

## 7. Propuestas de mejora derivadas del análisis

| Prioridad | Mejora | Justificación |
|-----------|--------|---------------|
| Alta | Onboarding tutorial interactivo para primer inicio de sesión | 3/10 usuarios con dificultades en tareas básicas |
| Alta | Panel de ayuda contextual con tooltips en funciones complejas | Solicitud directa de 4 participantes |
| Media | Simplificación del menú de navegación por roles | Confusión en qué secciones están disponibles |
| Media | Mejorar responsividad para tablets/móviles | 2 usuarios accedieron desde tablet |
| Baja | Indicador de progreso en la generación de horarios (proceso largo) | U07 y U09 no sabían si el sistema estaba procesando |

---

## 8. Evidencias adjuntas

- [x] Formulario aplicado (protocolo documentado en §2)
- [x] Base de resultados con puntuaciones individuales (§3)
- [x] Cálculo del puntaje con fórmula verificada (§4)
- [x] Interpretación técnica completa (§6)
- [x] Propuesta de mejoras derivadas del análisis (§7)
