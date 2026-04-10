# <a name="_heading=h.nw8bxvul5sln"></a>**SPRINT 0: INICIO DEL PROYECTO**
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
### **1.4 Conclusión del enfoque**
La combinación de CSP y optimización combinatoria proporciona una base sólida para abordar el problema, permitiendo no solo generar soluciones válidas, sino también optimizadas según criterios definidos, alineándose con problemas reales de ingeniería de software.

<a name="_heading=h.1fb3s3iqiea8"></a>**Enlace a repositorio:** 



