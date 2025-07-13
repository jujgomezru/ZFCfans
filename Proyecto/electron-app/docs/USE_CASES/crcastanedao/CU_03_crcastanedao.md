  
**Universidad Nacional de Colombia \- sede Bogotá**  
**Facultad de Ingeniería**  
**Departamento de Sistemas e Industrial**  
**Curso:  Ingeniería de Software 1 (2016701)**

| VISUALIZAR CATEGORÍAS DEFINIDAS POR EL USUARIO |  |
| :---- | :---- |
| **ACTORES** Usuario final. | **REQUERIMIENTO** .(RF\_5) Incluir una pestaña/sección  en el panel principal que permita visualizar las diferentes categorías definidas por el usuario (incluida favoritos). |
| **DESCRIPCIÓN** La aplicación mostrará una sección o pestaña dentro del panel principal donde el usuario podrá visualizar todas las categorías existentes para organizar cócteles, incluyendo tanto categorías predefinidas (como “clásicos”, “sin alcohol”, “tropicales”) como las categorías personalizadas por el usuario (por ejemplo, “para fiestas”, “postres”) y una categoría especial de “Favoritos” que contiene los cócteles marcados por el usuario. |  |
| **PRECONDICIONES** Deben existir categorías registradas en el sistema, ya sean por defecto o creadas por el usuario. El usuario debe haber accedido correctamente al panel principal de la aplicación y posteriormente a la sección “categorías”. |  |
| **FLUJO NORMAL** El usuario accede al panel principal de la aplicación. El sistema muestra una pestaña o sección titulada “Categorías”. El usuario selecciona la pestaña “Categorías”. El sistema muestra una lista o cuadrícula con las diferentes categorías: Categorías predefinidas por el sistema Categorías creadas por el usuario Categoría “Favoritos El usuario puede: Explorar las categorías existentes Seleccionar una categoría para ver los cócteles asociados Reordenar o editar categorías personalizadas Acceder directamente a los cócteles favoritos desde su categoría  |  |
| **POSTCONDICIONES**  Se han mostrado correctamente todas las categorías disponibles. El sistema mantiene actualizado el listado conforme el usuario crea, edita o elimina categorías personalizadas. La categoría “Favoritos” refleja en tiempo real los cócteles marcados como tales. |  |
| **NOTAS** El sistema debe diferenciar visualmente las categorías predefinidas de las creadas por el usuario. La categoría “Favoritos” debe estar siempre visible, aunque el usuario no haya marcado cócteles aún. El sistema usa íconos y colores para facilitar la navegación entre categorías. Las categorías personalizadas deben almacenarse de forma persistente (localmente o en la nube).  |  |

