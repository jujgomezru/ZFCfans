  
**Universidad Nacional de Colombia \- sede Bogotá**  
**Facultad de Ingeniería**  
**Departamento de Sistemas e Industrial**  
**Curso:  Ingeniería de Software 1 (2016701)**

| MODIFICAR INGREDIENTES O DOSIS |  |
| :---- | :---- |
| **ACTORES** Usuario final | **REQUERIMIENTO** (RF\_10) Mostrar campos editables para cambios libres del usuario  |
| **DESCRIPCIÓN** Cuando el sistema deba {**Mostrar Instructivo Detallado**}, los campos de Ingrediente y Dosis de cada uno de los pasos debe ser modificable. Si el cliente hace clic en estos campos, permitirá editar el contenido de los campos. Al momento de salir de {**Mostrar resumen informativo**} si el sistema detecta que hubo cambios, va a preguntarle al usuario si desea guardar los cambios. Si el cóctel modificado es creado por el usuario, va a permitir modificar el contenido en base de datos. Si el cóctel modificado es predefinido, sólo va a permitir guardar un nuevo cóctel, con un nuevo nombre. |  |
| **PRECONDICIONES** El Usuario debe estar tener sesión iniciada El Usuario debe haber elegido un único cóctel a preparar El Usuario debe haber escogido algún paso para visualizar |  |
| **FLUJO NORMAL** El usuario selecciona un campo de ingrediente o dosis El sistema actualiza la GUI para mostrar la opción de input de texto El usuario realiza los cambios deseados El usuario cierra el instructivo detallado El sistema compara la información actual con la base de datos El sistema detecta que hay cambios en la información actual, y consulta si es un cóctel predeterminado El sistema confirma que no es un cóctel predeterminado, y le pregunta al usuario si desea guardar los cambios, o crear un nuevo cóctel El usuario confirma que desea guardar los cambios El sistema vuelve al resumen informativo |  |
| **FLUJO ALTERNATIVO** El usuario selecciona un campo de ingrediente o dosis El sistema actualiza la GUI para mostrar la opción de input de texto El usuario realiza los cambios deseados El usuario cierra el instructivo detallado El sistema compara la información actual con la base de datos El sistema detecta que hay cambios en la información actual, y consulta si es un cóctel predeterminado El sistema confirma que es un cóctel predeterminado, y le pregunta al usuario si desea guardar un nuevo cóctel El usuario confirma que desea guardar un nuevo cóctel El sistema solicita un nuevo nombre al usuario El usuario introduce un nuevo nombre El sistema vuelve al resumen informativo, mostrando al nuevo cóctel |  |
| **POSTCONDICIONES** El sistema actualiza la base de datos con la nueva información |  |

