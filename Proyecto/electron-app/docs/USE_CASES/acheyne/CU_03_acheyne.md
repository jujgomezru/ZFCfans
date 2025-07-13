  
**Universidad Nacional de Colombia \- sede Bogotá**  
**Facultad de Ingeniería**  
**Departamento de Sistemas e Industrial**  
**Curso:  Ingeniería de Software 1 (2016701)**

| MOSTRAR DETALLES DE UN CÓCTEL DESDE EL CATÁLOGO |  |
| :---- | :---- |
| **ACTORES** Usuario final Sistema | **REQUERIMIENTO** RF\_13 – Mostrar detalles del cóctel particular desde el catálogo.  |
| **DESCRIPCIÓN** Este caso de uso permite al usuario consultar información detallada de un cóctel específico desde el catálogo general o personal. Al seleccionar un cóctel, el sistema presenta una vista con su nombre, ingredientes, pasos de preparación, categoría, contexto sugerido, imagen representativa y otras anotaciones asociadas. |  |
| **PRECONDICIONES** El usuario debe tener acceso al catálogo de cócteles. Debe existir al menos un cóctel en el catálogo (predefinido o creado por el usuario). |  |
| **FLUJO NORMAL** El usuario accede al catálogo de cócteles. El usuario navega por el catálogo o utiliza el buscador para ubicar un cóctel específico. El usuario selecciona un cóctel de la lista. El sistema muestra la vista detallada del cóctel, incluyendo: Nombre del cóctel Imagen (si existe) Ingredientes necesarios Instrucciones de preparación paso a paso Categoría asignada (si aplica) Contexto sugerido de consumo Autor o fuente (si es un cóctel personalizado) Opcionalmente, comentarios del usuario o notas adicionales El usuario puede cerrar la vista o iniciar la preparación del cóctel desde esta pantalla. Fin del caso de uso.  |  |
| **POSTCONDICIONES** El sistema puede actualizar estadísticas internas como “cócteles más consultados”. El detalle del cóctel permanece disponible para futuras consultas. |  |
| **NOTAS** Si el cóctel es personalizado, solo es visible para su creador. Esta funcionalidad sirve como punto de entrada para otros casos de uso como “preparar cóctel” o “clasificar cóctel”. Puede considerarse la opción de valorar o comentar el cóctel en futuras versiones. |  |

