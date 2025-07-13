  
**Universidad Nacional de Colombia \- sede Bogotá**  
**Facultad de Ingeniería**  
**Departamento de Sistemas e Industrial**  
**Curso:  Ingeniería de Software 1 (2016701)**

| NOMBRAR Y GUARDAR RECETA (MÓDULO DE CREACIÓN DE NUEVOS COCTELES.) |  |
| :---- | :---- |
| **ACTORES** Usuario final, | **REQUERIMIENTO** (RF\_1) Tener un catálogo de cócteles pre definidos y creados por el usuario (RF\_6) Tener herramienta funcional de creación de cócteles (RF\_2) Clasificar el catálogo por grupos definidos por el usuario  |
| **DESCRIPCIÓN** Este caso de uso permite al usuario asignar un nombre a la receta de cóctel que está creando y guardarla en el sistema, finalizando así su registro. Al guardar, el sistema valida que se hayan cumplido los requisitos mínimos (nombre, ingredientes y al menos una instrucción) antes de almacenar la receta. |  |
| **PRECONDICIONES** El usuario debe haber registrado previamente los ingredientes, cantidades y al menos una instrucción. El sistema debe tener la capacidad de validar nombres y comprobar que no haya más de una receta con el mismo nombre o receta. |  |
| **FLUJO NORMAL** El usuario accede a la sección final del módulo de creación de cócteles. El sistema solicita al usuario ingresar un nombre único para el cóctel. El usuario introduce el nombre de la receta. El sistema valida que el nombre no esté repetido en el recetario. El usuario revisa todos los datos ingresados de la receta (ingredientes, cantidades, instrucciones y, opcionalmente, imagen). Si la receta o el nombre es idéntico a una ya guardado o preexistente en el catálogo global se dará notificación al usuario. El usuario confirma y selecciona la opción Guardar. El sistema verifica que los datos obligatorios estén completos. Si todo está correcto, el sistema guarda la receta en el catálogo de cócteles. El sistema notifica al usuario del registro exitoso. |  |
| **POSTCONDICIONES** La receta queda registrada en el catálogo global de cócteles. La receta puede modificarse en cualquier momento después de ser guardada. |  |
| **NOTAS** El nombre del cóctel debe ser único dentro del sistema. No se permite guardar una receta sin nombre. La receta debe tener al menos un ingrediente y una instrucción de preparación. |  |

