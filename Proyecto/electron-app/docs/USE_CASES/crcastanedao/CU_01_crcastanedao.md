  
**Universidad Nacional de Colombia \- sede Bogotá**  
**Facultad de Ingeniería**  
**Departamento de Sistemas e Industrial**  
**Curso:  Ingeniería de Software 1 (2016701)**

| FILTRAR CÓCTELES SEGÚN LOS CRITERIOS FIJADOS POR EL USUARIO |  |
| :---- | :---- |
| **ACTORES** Usuario final. | **REQUERIMIENTO** (RF\_3) Filtrar/Buscar cócteles de acuerdo a uno o varios de los criterios fijados por el usuario.  |
| **DESCRIPCIÓN** La aplicación permitirá al usuario buscar y/o filtrar cócteles dentro del catálogo disponible, aplicando uno o varios criterios seleccionados por él, como el nombre del cóctel, los ingredientes que contiene, el tipo de maridaje sugerido, su categoría y el nivel de dificultad de elaboración. El sistema mostrará los resultados que cumplan con los parámetros definidos, ordenándolos por relevancia o coincidencia. |  |
| **PRECONDICIONES** El usuario debe haber accedido a la sección de búsqueda o filtrado de cócteles dentro de la aplicación.. El catálogo de cócteles debe estar cargado correctamente desde el sistema. Los servicios de búsqueda de información del sistema deben funcionar correctamente. Ej. La conexión a la base de datos o API. |  |
| **FLUJO NORMAL** El usuario accede a la sección de búsqueda o filtrado de cócteles. Nombre del cóctel Ingredientes Maridaje Categoría Nivel de dificultad El sistema muestra los campos de filtro disponibles: El usuario ingresa uno o varios criterios de búsqueda. El sistema valida que los criterios sean válidos. El sistema consulta el catálogo de cócteles según los filtros aplicados. El sistema muestra la lista de resultados coincidentes con los filtros aplicados. El usuario puede seleccionar un cóctel para ver sus detalles o modificar los filtros. |  |
| **POSTCONDICIONES** Se actualiza la vista del usuario con los resultados correspondientes. El sistema registra la operación de búsqueda en el log del sistema (opcional). |  |
| **NOTAS** El sistema debe permitir búsquedas con errores ortográficos menores en el nombre del cóctel. En caso de seleccionar múltiples ingredientes, el sistema debe considerar cócteles que contengan todos o algunos de ellos, priorizando los que cumplan la mayor cantidad de criterios. La búsqueda debe ser responsiva y ágil para una buena experiencia de usuario. Los ingredientes deben ser reconocidos a partir de sinónimos o nombres alternativos comunes (ej. “ron blanco” ≈ “ron”). Las categorías pueden incluir: clásicos, tropicales, sin alcohol, calientes, entre otros. El nivel de dificultad se clasifica en: fácil, medio y avanzado. |  |

