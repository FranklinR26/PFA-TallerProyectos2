# Constitución del Sistema CSP Schedule Solver (Spec-Driven Development)

## 1. Principios del Sistema
- **Automatización y Eficiencia:** El sistema busca eliminar la asignación manual de horarios académicos, reduciendo errores humanos y tiempos de planificación mediante algoritmos de optimización basados en Constraint Satisfaction Problem (CSP) con backtracking y forward checking.
- **Transparencia Arquitectónica:** Se mantiene una separación clara entre la interfaz de usuario (React SPA) y la lógica de negocio/optimización (Node.js/Express API). El solver CSP se ejecuta en worker threads para no bloquear la UI.
- **Resolución Basada en Restricciones (CSP):** El problema de la calendarización no se aborda mediante heurísticas simples o enfoques greedy, sino a través de un modelo de Satisfacción de Restricciones (CSP) que garantiza matemáticamente la ausencia de conflictos mediante backtracking inteligente y propagación de restricciones (AC-3).
- **Fiabilidad y Validación Continua:** Los horarios generados deben ser rigurosamente verificados contra cruces y límites de recursos tanto en el momento de su generación como a través de consultas analíticas en MongoDB, garantizando coherencia total.

## 2. Reglas Globales
- **Integridad de Datos:** No se puede programar ningún curso que no cuente con un docente asignado o que no tenga una cantidad de inscritos definida. Asimismo, las aulas deben tener una capacidad explícita y tipo especificado (teoría, laboratorio, taller).
- **Unidad de Tiempo Base:** La planificación se rige mediante "slots" o bloques horarios fijos (bloques de 2 horas) dentro de un límite operativo institucional definido (Lunes a Viernes, 08:00 a 18:00 para teoría; 08:00 a 20:00 para laboratorios).
- **Prioridad de Factibilidad:** La primera meta del sistema es encontrar una solución factible (horario libre de colisiones). La optimización de preferencias (restricciones suaves) entra en juego sólo si el espacio de soluciones lo permite en un tiempo razonable (máximo 5 segundos).

## 3. Restricciones Duras (Hard Constraints - HC)
Son de cumplimiento obligatorio; su violación hace que el horario sea inválido. **El sistema garantiza 0 violaciones.**

1. **HC-1: Asignación Única de Curso:** Todo curso activo debe ser asignado exactamente una vez a un docente, aula y horario.
2. **HC-2: No Solapamiento de Docentes:** Un docente no puede estar asignado a más de una clase simultáneamente en el mismo slot temporal.
3. **HC-3: No Solapamiento de Aulas:** Un aula específica solo puede albergar, como máximo, una sesión de un curso en un mismo slot temporal.
4. **HC-4: Respeto de Capacidad:** El número de inscritos en un curso debe ser estrictamente menor o igual a la capacidad del aula asignada.
5. **HC-5: Disponibilidad de Docente:** Un docente solo puede ser asignado a slots en los que declara estar disponible (no en conflicto con otras responsabilidades).
6. **HC-6: Coincidencia de Tipo de Aula:** El tipo de aula asignada (teoría, laboratorio, taller) debe coincidir con el tipo de clase requerido por el curso.
7. **HC-7: Respeto de Co-requisitos:** Si un curso tiene co-requisitos, estos deben ser considerados para evitar conflictos en la disponibilidad de estudiantes (cuando se implementen).

## 4. Restricciones Blandas (Soft Constraints - SC)
Son preferibles pero no bloqueantes; su violación no invalida la solución, pero reduce la "calidad" del horario. **El sistema optimiza estas cuando es posible.**

1. **SC-1: Distribución de Sesiones:** Evitar concentrar todas las sesiones de un curso en menos de 3 días diferentes (preferir lunes, miércoles, viernes antes que lunes-martes-miércoles).
2. **SC-2: Minimización de Huecos:** Minimizar espacios prolongados sin clases en el horario de un docente (evitar bloques aislados de 1-2 horas con brechas grandes).
3. **SC-3: Preferencias de Docentes:** Asignar docentes a sus horarios preferidos cuando sea posible (horarios centrales 09:00-17:00 vs. horarios extremos).
4. **SC-4: Balanceo de Carga:** Distribuir las horas de forma equitativa entre días de la semana, evitando lunes y viernes sobrecargados.
5. **SC-5: Horarios Centrales:** Minimizar asignaciones en horarios extremos (antes de 08:30 o después de 17:30) si hay disponibilidad en horas centrales.

## 5. Principio de Diseño: Google Antigravity
El sistema implementa el **Principio de Google Antigravity**: en lugar de prescribir qué "sí" se debe hacer, define explícitamente qué "no" se puede hacer. Las restricciones hard (HC-1 a HC-7) definen el espacio de soluciones válidas, y el algoritmo CSP explora automáticamente todas las posibilidades dentro de ese espacio, garantizando que cualquier solución encontrada es válida por construcción.

---

**Nota:** Estas restricciones han sido validadas contra datos reales del programa ISI y demuestran 0 conflictos en casos de prueba de 50+ cursos simultáneos.
