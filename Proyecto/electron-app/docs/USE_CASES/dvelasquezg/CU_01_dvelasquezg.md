  
**Universidad Nacional de Colombia \- sede Bogotá**  
**Facultad de Ingeniería**  
**Departamento de Sistemas e Industrial**

**Curso:  Ingeniería de Software 1 (2016701)**

| ESTABLECER INGREDIENTES/CANTIDADES (MÓDULO DE CREACIÓN DE NUEVOS COCTELES.) |  |
| :---- | :---- |
| **ACTORES** Usuario final  | **REQUERIMIENTO** (RF\_1) Tener un catálogo de cócteles pre definidos y creados por el usuario (RF\_6) Tener herramienta funcional de creación de cócteles (RF\_10) Mostrar campos editables para cambios libres del usuario |
| **DESCRIPCIÓN** Este caso de uso permite al usuario definir los ingredientes y sus respectivas cantidades al crear un nuevo cóctel en el sistema. El usuario podrá seleccionar ingredientes disponibles desde una lista o registrar ingredientes nuevos, especificar su unidad de medida y asignar la cantidad correspondiente para la receta.  |  |
| **PRECONDICIONES** Debe existir un catálogo de ingredientes disponible para selección, o bien la opción habilitada para registrar nuevos ingredientes. Las unidades de medida válidas deben estar predefinidas y cargadas en el sistema para asociarlas a cada cantidad. |  |
| **FLUJO NORMAL** El usuario accede al módulo de creación de nuevos cócteles. El sistema presenta un formulario para registrar los ingredientes. El usuario selecciona de una lista desplegable los ingredientes disponibles o registra uno nuevo. El usuario especifica la cantidad correspondiente y su unidad de medida (ml, oz, piezas, etc.). El usuario repite el proceso hasta completar la lista de ingredientes de la receta. El sistema valida que no existan ingredientes duplicados y que las cantidades sean valores válidos. El usuario confirma la lista de ingredientes y continúa con el resto de la creación de la receta. |  |
| **POSTCONDICIONES** La lista de ingredientes y cantidades queda asociada a la receta en creación. Los ingredientes nuevos, si se registraron por primera vez, quedan disponibles en el catálogo de ingredientes. El sistema guarda temporalmente los ingredientes y cantidades asociados al nuevo cóctel en creación. |  |
| **NOTAS** No se permite ingresar cantidades negativas o nulas. No se pueden repetir ingredientes en una misma receta. |  |

