  
**Universidad Nacional de Colombia \- sede Bogotá**  
**Facultad de Ingeniería**  
**Departamento de Sistemas e Industrial**  
**Curso:  Ingeniería de Software 1 (2016701)**

| CLASIFICAR CATÁLOGO POR SECCIONES DEFINIDAS POR EL USUARIO  |  |
| :---- | :---- |
| **ACTORES** Usuario final Sistema | **REQUERIMIENTO** RF\_14 – Clasificar el catálogo por secciones definidas por el usuario.  |
| **DESCRIPCIÓN** Este caso de uso permite al usuario organizar el catálogo de cócteles en secciones personalizadas, creadas según sus propios criterios. Estas secciones funcionan como agrupaciones temáticas o prácticas (por ejemplo: "Cócteles para brunch", "Rápidos de hacer", "Sin alcohol", etc.), facilitando una navegación más intuitiva y personalizada dentro del catálogo. |  |
| **PRECONDICIONES** El usuario debe haber iniciado sesión. Debe existir al menos un cóctel creado o visualizado por el usuario.  |  |
| **FLUJO NORMAL** El usuario accede al catálogo de cócteles. El usuario selecciona la opción "Clasificar por secciones" o "Administrar secciones". El sistema muestra las secciones existentes creadas por el usuario (si hay). El usuario puede: a. Crear una nueva sección proporcionando nombre y descripción (opcional). b. Editar el nombre o eliminar una sección existente. c. Asignar uno o varios cócteles a una sección. El sistema guarda los cambios realizados y reorganiza el catálogo según las secciones personalizadas. El usuario puede visualizar el catálogo filtrado por sus secciones. Fin del caso de uso.  |  |
| **POSTCONDICIONES** Las secciones definidas quedan almacenadas y disponibles para futuras sesiones. Los cócteles se mantienen clasificados en las secciones correspondientes. |  |
| **NOTAS** Un cóctel puede pertenecer a múltiples secciones definidas por el usuario. Las secciones son privadas y visibles únicamente para el usuario que las creó. Esta funcionalidad mejora la experiencia del usuario, especialmente si el catálogo contiene muchos cócteles. Podría incluirse una opción de “secciones recomendadas” con base en el historial de uso o preferencias.  |  |

