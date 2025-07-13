  
**Universidad Nacional de Colombia \- sede Bogotá**  
**Facultad de Ingeniería**  
**Departamento de Sistemas e Industrial**  
**Curso:  Ingeniería de Software 1 (2016701)**

| CLASIFICAR CÓCTELES COMO FAVORITOS O POR CATEGORÍAS |  |
| :---- | :---- |
| **ACTORES** Usuario final Sistema | **REQUERIMIENTO** RF\_11 – El usuario puede clasificar cócteles como favoritos o por categorías.  |
| **DESCRIPCIÓN** Este caso de uso permite al usuario organizar sus cócteles favoritos o asignarlos a categorías personalizadas (por ejemplo, “Para fiestas”, “Cócteles sin alcohol”, “Elegantes”, etc.). El sistema debe permitir marcar cócteles como favoritos y crear, editar o eliminar categorías para una clasificación más personalizada y funcional. |  |
| **PRECONDICIONES** El usuario debe haber iniciado sesión en el sistema. Debe existir al menos un cóctel en el catálogo personal o general. |  |
| **FLUJO NORMAL** El usuario accede al catálogo de cócteles. El usuario selecciona un cóctel que desea clasificar. El sistema muestra las opciones disponibles: a. Marcar como favorito b. Asignar a categoría existente c. Crear nueva categoría El usuario selecciona la opción deseada: Si marca como favorito, el cóctel se añade a su lista personal de favoritos. Si elige asignar a una categoría, selecciona una de la lista disponible. Si crea una nueva categoría, proporciona un nombre y, opcionalmente, una descripción. El sistema guarda los cambios de clasificación. El usuario puede acceder posteriormente a los cócteles según su clasificación personalizada. Fin del caso de uso. |  |
| **POSTCONDICIONES** El sistema actualiza la información de clasificación del cóctel. Las categorías quedan registradas para uso exclusivo del usuario (si son personalizadas). El cóctel queda disponible dentro de las secciones de favoritos o categorías correspondientes. |  |
| **NOTAS** Un cóctel puede pertenecer a múltiples categorías. Las categorías personalizadas son únicas por usuario. El sistema podría sugerir categorías inteligentes a futuro con base en el uso o popularidad. Existe la posibilidad de desmarcar un cóctel como favorito o removerlo de una categoría cuando el usuario lo desee. |  |

