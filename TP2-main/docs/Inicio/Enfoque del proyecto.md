# # **SPRINT 0: INICIO DEL PROYECTO**
## **Sistema Inteligente de Generación Óptima de Horarios Académicos**
## **Selección del Enfoque del Proyecto (con Justificación Técnica)**
El presente proyecto adopta un enfoque basado en la formulación del problema como un Problema de Satisfacción de Restricciones (Constraint Satisfaction Problem - CSP)**,** complementado con técnicas de optimización combinatoria**.**
### **1.1 Naturaleza del problema**
La generación de horarios académicos en entornos de currículo flexible constituye un problema altamente complejo debido a la coexistencia de múltiples variables interdependientes, tales como cursos, docentes, estudiantes, aulas y franjas horarias. Estas variables están sujetas a diversas restricciones que deben cumplirse simultáneamente, lo cual incrementa significativamente la dificultad del problema.

Asimismo, el problema presenta características propias de sistemas complejos:

- Alta dimensionalidad (gran número de combinaciones posibles)
- Restricciones duras (obligatorias) y blandas (preferenciales)
- Dinamismo en la información (cambios en matrícula o disponibilidad)
- Necesidad de soluciones eficientes en tiempo razonable
### **1.2 Justificación del uso de CSP**
El enfoque CSP permite representar formalmente el problema mediante:

- Un conjunto de variables
- Dominios posibles para cada variable
- Restricciones que limitan las combinaciones válidas

Esto permite:

- Garantizar la validez de las soluciones generadas
- Modelar de manera estructurada la complejidad del problema
- Facilitar la implementación de algoritmos de búsqueda (backtracking, heurísticas, etc.)
### **1.3 Justificación del uso de optimización combinatoria**
Dado que pueden existir múltiples soluciones válidas, se requiere incorporar criterios de optimización que permitan seleccionar la mejor alternativa posible. Entre los criterios considerados se encuentran:

- Minimización de conflictos de horarios
- Uso eficiente de aulas
- Distribución equilibrada de carga académica
- Mejora en la experiencia del usuario (estudiantes y docentes)
### **1.4 Soporte conceptual: Google Antigravity**

El concepto de **Google Antigravity** aplicado a este proyecto proviene del enfoque de diseño que consiste en especificar **lo que el sistema no debe hacer** (las restricciones que actúan como "gravedad") en lugar de prescribir paso a paso lo que sí debe hacer. Al eliminar explícitamente las combinaciones inválidas, el sistema queda libre de "volar" por el espacio de soluciones restante.

En la implementación concreta del solver CSP (`csp/solver.js`):

- Las **restricciones duras** actúan como gravedad: conflictos de docente, aula y estudiante son eliminados del espacio de búsqueda mediante forward checking antes de intentar la asignación.
- El algoritmo **no sigue un camino predeterminado**: selecciona la variable más restringida (MRV) y prueba valores ordenados por preferencia, retrocediendo cuando alcanza un callejón sin salida.
- Los **reinicios aleatorios** (múltiples semillas) permiten explorar distintas regiones del espacio válido, encontrando mejores soluciones sin quedar atrapado en óptimos locales.
- Las **restricciones blandas** (scoring) guían la elección entre múltiples soluciones válidas, favoreciendo distribución equilibrada, slots preferidos y horarios compactos.

Este principio garantiza que el sistema genere horarios válidos y optimizados de forma autónoma, sin necesidad de intervención manual.

### **1.5 Conclusión del enfoque**
La combinación de CSP, optimización combinatoria y el principio Google Antigravity proporciona una base sólida para abordar el problema, permitiendo no solo generar soluciones válidas, sino también optimizadas según criterios definidos, alineándose con problemas reales de ingeniería de software.

**Enlace a repositorio:** https://github.com/GaboLand/PFA-TallerProyectos2

