  
**Universidad Nacional de Colombia \- sede Bogotá**  
**Facultad de Ingeniería**  
**Departamento de Sistemas e Industrial**  
**Curso:  Ingeniería de Software 1 (2016701)**

| MOSTRAR HISTORIAL DE BÚSQUEDA |  |
| :---- | :---- |
| **ACTORES** Usuario final. | **REQUERIMIENTO** (RF\_4) Mostrar un historial de búsqueda.  |
| **DESCRIPCIÓN** La aplicación permitirá al usuario visualizar un historial con los términos o filtros utilizados en búsquedas anteriores de cócteles. Este historial se presentará de forma ordenada y permitirá al usuario repetir búsquedas previas con un solo clic o eliminar entradas del historial si así lo desea. |  |
| **PRECONDICIONES** El usuario debe haber realizado al menos una búsqueda previamente. El sistema debe tener habilitado y funcionando correctamente el módulo de almacenamiento del historial de búsquedas. |  |
| **FLUJO NORMAL** El usuario accede a la opción de ver historial de búsqueda desde la interfaz principal o desde la sección de búsqueda. El sistema consulta las búsquedas previas asociadas al usuario en local (o previamente en la nube). El sistema muestra una lista con los términos y filtros utilizados en búsquedas anteriores, ordenados cronológicamente. El usuario puede: Seleccionar una entrada del historial para repetir esa búsqueda. Eliminar una o varias entradas del historial. Limpiar completamente el historial.  |  |
| **POSTCONDICIONES** El sistema mantiene actualizado el historial del usuario con base en su interacción. Si se repite una búsqueda desde el historial, se registra nuevamente como entrada reciente. Si se elimina una entrada, se remueve permanentemente del historial. Se procede de igual manera al limpiar el historial. |  |
| **NOTAS** El historial estará limitado a un número máximo de 20 entradas, si se excede este número las entradas excedentes serán eliminadas. En caso de cerrar sesión o eliminar datos locales, el historial se perderá definitivamente. |  |

