# Especificaciones del proyecto

**Grupo:** ZFC Fans  
**Integrantes:**  
Cristian Leonardo Castañeda Olarte  
Alan Ryan Cheyne Gómez  
Juan Jerónimo Gómez Rubiano  
David Santiago Velásquez Gómez

## **Nombre del sistema:** ZFCocteles

## **Objetivo del sistema:** 

Proveer una plataforma de gestión y preparación de cocteles para distintos entornos sociales (personal, comidas elegantes, fiesta, entre otros)

1. # Generar una lista de todos los requerimientos identificados dados por el usuario.

- (req1) Tener un catálogo de cócteles pre definidos y creados por el usuario  
- (req2) Filtrar/Buscar cócteles de acuerdo a uno o varios de los criterios fijados por el usuario.  
- (req3) Creador de cócteles, darle al usuario la posibilidad de guardar sus propias creaciones  
- (req4) Sugerir acompañamientos (maridaje) de cócteles  
- (req5) Presentar un manual de instrucciones para el cóctel seleccionado  
- (req6) Incluir mensajes de advertencia, seguridad y salud  
- (req7) Mostrar una sección de categorías (incluye cócteles favoritos)  
- (req8) Mostrar un historial de búsqueda  
- (req9) Permitir la modificación de cantidades de los ingredientes  
- (req10) Crear una interfaz gráfica amigable con el usuario  
- (req11) Historial de cócteles preparados  
- (req12) El usuario puede clasificar cócteles como favoritos o por categorías.  
- (req13) Mostrar detalles del cóctel particular desde el catálogo    
- (req14) Clasificar el catálogo por secciones definidas por el usuario  
- (req 15\) Presentar una herramienta interactiva que permita seguir la preparación paso por paso.

2. # Dividir los requerimientos en funcionales o no funcionales 

| FUNCIONALES | NO FUNCIONALES |
| :---- | :---- |
| (RF\_1) Tener un catálogo de cócteles pre definidos y creados por el usuario (RF\_2) Clasificar el catálogo por secciones definidos por el usuario. (RF\_3) Filtrar/Buscar cócteles de acuerdo a uno o varios de los criterios fijados por el usuario. (RF\_4) Mostrar un historial de búsqueda. (RF\_5) Incluir una pestaña/sección  en el panel principal que permita visualizar las diferentes categorías definidas por el usuario (incluida favoritos). (RF\_6) Tener herramienta funcional de creación de cócteles (RF\_7) Presentar manual de instrucciones para la preparación de un cóctel. (RF\_8) Presentar una herramienta interactiva que permita seguir la preparación paso por paso (RF\_9) Modificar las instrucciones de acuerdo a la cantidad de clientes indicada. (RF\_10) Mostrar campos editables para cambios libres del usuario (RF\_11) El usuario puede clasificar cócteles como favoritos o por categorías. (RF\_12) Historial de cócteles preparados. (RF 13\) Mostrar detalles del cóctel particular desde el catálogo. | (RNF\_1) Crear una interfaz gráfica para permitir la navegación del usuario (RNF\_2) Incluir recomendaciones educadas de maridaje de cócteles  (RNF\_3) Incluir mensajes y advertencias de seguridad y salud pública (RNF\_4) Clasificar el catálogo por secciones definidas por el usuario |

3. # Organizar por MoSCoW

**MUST** *(DEBE \- obligatorio sin él el sistema pierde sentido o no funciona)*

- **(RF\_1) Tener un catálogo de cócteles pre definidos y creados por el usuario:** El programa muestra una lista o menú con todas las opciones de cócteles incluidas preparaciones creadas por el propio usuario,   
- **(RF\_7) Presentar manual de instrucciones para la preparación de un cóctel:** El sistema debe permitir mostrar al usuario un manual o listado de pasos detallados para la preparación de cada cóctel registrado. Este manual debe incluir la secuencia de instrucciones ingresadas durante la creación de la receta, presentadas de forma clara y ordenada, de modo que puedan ser consultadas desde la vista de detalle de cada cóctel.  
- **(RNF\_1) Crear una interfaz gráfica para permitir la navegación del usuario:** Se debe contar con una interfaz gráfica intuitiva, organizada y visualmente accesible que permita al usuario interactuar de manera sencilla con las distintas funciones del recetario de cócteles  
- **(RNF\_3) Incluir mensajes y advertencias de seguridad y salud pública:** Se debe mostrar mensajes informativos y advertencias relacionadas con el consumo responsable de bebidas alcohólicas (La alta prioridad de este requerimiento está ligada a principios ético y normativas legales sobre el consumo de alcohol)  
- **(RF\_3 ) Filtrar/Buscar cócteles de acuerdo a uno o varios de los criterios fijados por el usuario:** El sistema debe permitir al usuario realizar búsquedas de cócteles dentro del catálogo mediante diferentes criterios configurables, como nombre, tipo de licor, categoría, ingredientes.  
- **(RF\_13) Mostrar detalles del cóctel particular desde el catálogo:** Se debe ofrecer la opción de consultar una vista detallada de cada cóctel listado en el catálogo. Esta vista debe incluir información completa de la receta, como nombre, ingredientes y cantidades, instrucciones de preparación, imagen (si existe). Esencial para la funcionalidad del sistema, ya que permite acceder a la información de cada cóctel.


**SHOULD** *(DEBERÍA \- no obligatorio pero aporta mucho a la exp de usuario)*

- **(RF\_6) Tener herramienta funcional de creación de cócteles:** Este debe disponer de un módulo que permita a los usuarios crear nuevas recetas de cócteles, ingresando información como nombre, ingredientes con sus cantidades e instrucciones de preparación.   
- **(RF\_8) Presentar una herramienta interactiva que permita seguir la preparación paso por paso:** Será posible ofrecer una funcionalidad que guíe al usuario en la preparación de un cóctel mostrando las instrucciones de manera secuencial e interactiva. El usuario podrá avanzar entre los pasos y marcarlos como completados para facilitar el seguimiento del proceso.  
- **(RF\_9) Modificar las instrucciones de acuerdo a la cantidad de clientes indicada:** Se debe permitir al usuario ajustar automáticamente las cantidades de los ingredientes de una receta en función del número de porciones o clientes especificados.  
- **(RF\_11)El usuario puede clasificar cócteles como favoritos o por categoría:** El sistema debe permitir a los usuarios organizar las recetas de cócteles en categorías predefinidas (por ejemplo: con licor, sin licor, aperitivo, tropical, etc.) y también marcar recetas como favoritas


**COULD** (PODRÍA \- es un plus usualmente personalización, se desarrolla usualmente cuando queda tiempo)

- **(RF\_4) Mostrar un historial de búsqueda:** El sistema debe registrar y mostrar al usuario un historial de las búsquedas recientes realizadas dentro del recetario de cócteles.  
- **(RF\_5) Incluir una pestaña/sección  en el panel principal que permita visualizar las diferentes categorías definidas por el usuario (incluida favoritos):** Disponer de una sección donde se muestran claramente todas las categorías creadas por el usuario, incluyendo una categoría especial de favoritos. Esta sección permitirá consultar de forma rápida las recetas agrupadas según estas categorías.  
- **(RF\_10) Mostrar campos editables para cambios libres del usuario:** ofrecer en las diferentes secciones de la creación y edición de recetas campos editables donde el usuario pueda ingresar o modificar libremente información, como notas, recomendaciones adicionales o ajustes personalizados.

**WONT** *(NO NECESARIO \- puede esperar al punto que esté o no no pasa nada si nunca se desarrolla)*

- **(RNF\_2) Incluir recomendaciones educadas de maridaje de cócteles:** Mostrar recomendaciones amigables y sugerencias de maridaje para los cócteles registrados, indicando posibles combinaciones con aperitivos, platos, o momentos ideales para su consumo  
- **(RF 12\) Historial de cócteles preparados:** Llevar un registro de los cócteles que el usuario ha preparado, guardando la fecha y hora de preparación, así como la receta correspondiente. Este historial podrá ser consultado por el usuario desde una sección específica para revisar qué cócteles ha preparado y cuándo, facilitando así el seguimiento de su actividad en la aplicación.

## **Tabla general**

| Must | (RF\_1) Tener un catálogo de cócteles pre definidos y creados por el usuario (RF\_7) Presentar manual de instrucciones para la preparación de un cóctel (RNF\_1) Crear una interfaz gráfica para permitir la navegación del usuario (RNF\_4) Incluir mensajes y advertencias de seguridad y salud pública. (RF\_3) Filtrar/Buscar cócteles de acuerdo a uno o varios de los criterios fijados por el usuario. (RF\_13) Mostrar detalles del cóctel particular desde el catálogo |
| :---: | :---- |
| Should | (RF\_6) Tener herramienta funcional de creación de cócteles (RF\_8) Presentar una herramienta interactiva que permita seguir la preparación paso por paso (RF\_9) Modificar las instrucciones de acuerdo a la cantidad de clientes indicada (RF\_11)El usuario puede clasificar cócteles como favoritos o por categoría  |
| Could | (RF\_2) Clasificar el catálogo por grupos definidos por el usuario (RF\_3) Permitir la búsqueda de cócteles por categoría de ingredientes (RF\_4) Mostrar un historial de búsqueda (RF\_5) Incluir una pestaña/sección  en el panel principal que permita visualizar las diferentes categorías definidas por el usuario (incluida favoritos). (RF\_10) Mostrar campos editables para cambios libres del usuario |
| Wont | (RNF\_3) Incluir recomendaciones educadas de maridaje de cócteles. (RF\_12) Historial de cócteles preparados |

| Requisito |  |  | Estimación | Argumento |
| ----- | :---- | ----- | ----- | ----- |
| RF\_1 | Tener un catálogo de cócteles pre definidos y creados por el usuario |  | 2 | Programarlo requiere solamente tener una lista y visualizarla en la interfaz. Pero toca investigar para incluir información verídica de coctéles predefinidos |
| MUST |  |  |  |  |
| RF\_7 | Presentar manual de instrucciones para la preparación de un cóctel |  | 8 | La visualización gráfica del resumen informativo es más compleja. Porque maneja muchos elementos visuales, y puede tener formas diferentes, al manejar cócteles con un número distinto de pasos, o tener información incompleta |
| MUST |  |  |  |  |
| RNF\_1 | Crear una interfaz gráfica para permitir la navegación del usuario  |  | 8 | El proceso de montar un servidor, diseñar, e implementar el frontend de la aplicación es largo, aunque el conocimiento necesario sea de acceso libre |
| MUST |  |  |  |  |
| RNF\_4 | Incluir mensajes y advertencias de seguridad y salud pública. |  | 3 | Los mensajes son strings que son fáciles de almacenar. Pero habría que investigar en mayor profundidad aspectos legales que concierne a la aplicación, así como potenciales efectos adversos a la salud del usuario, para garantizar que los mensajes sean correctos y pertinentes |
| MUST |  |  |  |  |
| RF\_3 | Filtrar/Buscar cócteles de acuerdo a uno o varios de los criterios fijados por el usuario.  |  | 8 | Las búsquedas por categorías se realizará por medio de una base de datos relacional (SQLite, MySQL, PostgreSQL) con tablas para cocteles, ingredientes, categorías y sus relaciones |
| MUST |  |  |  |  |
| RF\_13 | Mostrar detalles del cóctel particular desde el catálogo |  | 5 | Se requieren tablas que almacenan la información completa de cada cóctel, incluyendo: nombre, ingredientes con cantidades, instrucciones, imagen (opcional), tipo de licor, categoría, dificultad, vaso, etc. Estas tablas deben tener claves primarias y relaciones entre cócteles e ingredientes. |
| MUST |  |  |  |  |
| RF\_6 | Tener herramienta funcional de creación de cócteles. |  | 13 | Necesita crear un aplicativo específico contenido en la aplicación general, que permita la introducción de múltiples tipos de datos, visualizarse de manera que el usuario pueda interactuar de la manera deseada, y cambiar sus ventanas de acuerdo a las acciones del usuario, lo que implica programar la interactividad del módulo |
| SHOULD |  |  |  |  |
| RF\_8 | Presentar una herramienta interactiva que permita seguir la preparación paso por paso |  | 21 | Necesita hacer consultas en bases de datos, que es muy rápido. Pero también necesita crear de manera dinámica un módulo gráfico por cada paso del cóctel. Esto también implica, que la presentación gráfica de cada módulo es variada, y además, debe ser interactiva |
| SHOULD |  |  |  |  |
| RF\_9 | Modificar las instrucciones de acuerdo a la cantidad de clientes indicada |  | 2 | Toca implementar inputs que pueda llenar el usuario, y modificar el contenido suministrado en base a estos inputs |
| SHOULD |  |  |  |  |
| RF\_11 | El usuario puede clasificar cócteles como favoritos o por categoría |  | 5 | Se requiere trabajar en la base de datos para que esta cuente con clasificaciones para categorías y favoritos.  |
| SHOULD |  |  |  |  |
| RF\_2 | Clasificar el catálogo por grupos definidos por el usuario |  | 1 | Requiere hacer búsquedas en bases de datos, lo cual todos los integrantes pueden hacer rápidamente |
| COULD |  |  |  |  |
| RF\_3 | Permitir la búsqueda de cócteles por categoría de ingredientes |  | 8 | Requiere consultar todos los ingredientes agrupados por categoría y buscar los cócteles que contengan uno o más ingredientes de una categoría seleccionada. Esto se puede realizar con consultas SQL |
| COULD |  |  |  |  |
| RF\_4 | Mostrar un historial de búsqueda:  |  | 2 | Necesita hacer búsquedas en una estructura de datos tipo pila, e implementar una visualización dinámica minimalista |
| COULD |  |  |  |  |
| RF\_5 | Incluir una pestaña/sección  en el panel principal que permita visualizar las diferentes categorías definidas por el usuario (incluida favoritos). |  | 8 | Requiere funciones que consulten las categorías existentes y los cócteles asignados a cada una. Deben devolver esta información al frontend para renderizarla en la interfaz principal, agrupada correctamente. |
| COULD |  |  |  |  |
| RF\_10 | Mostrar campos editables para cambios libres del usuario: |  | 5 | Son funciones que permiten guardar, actualizar y consultar los cambios personalizados realizados por el usuario sobre las recetas, sin restricciones de contenido salvo validaciones básicas. |
| COULD |  |  |  |  |
| RNF\_3 | (RNF\_3) Incluir recomendaciones educadas de maridaje de cócteles. |  | 21 | Este apartado requiere un estudio más extenso sobre acompañamientos por lo que más trabajo de desarrollo, está enfocado a el trabajo de investigación y clasificación.  |
| WONT |  |  |  |  |
| RF\_12 | (RF\_12) Historial de cócteles preparados |  | 2 | Es necesario llevar un registro en la base de datos cada vez que un usuario finaliza la preparación de un cóctel (ya sea pulsando un botón tipo “Marcar como preparado” o al completar la última instrucción de la guía paso a paso). También funciones para consultar y listar ese historial. |
| WONT |  |  |  |  |

##  **Reglas de Negocio 📜** 

1\. Consumo responsable como prioridad ética 🚨  
El sistema deberá mostrar advertencias claras sobre el consumo moderado de alcohol en todas las recetas que incluyan bebidas alcohólicas. Estas alertas seguirán lineamientos de salud pública y normativas legales, asegurando que la aplicación promueva hábitos seguros.

2\. Propiedad intelectual y contenido generado por usuarios ✍️  
Las recetas creadas por los usuarios serán de su autoría, pero la plataforma podrá incluir dichas preparaciones en el catálogo público (sin fines comerciales). Si un cóctel infringe derechos de terceros (ej. marcas registradas), el equipo reservará el derecho de eliminarlo.

3\. Experiencia intuitiva como estándar de calidad 🎯  
La interfaz debe garantizar navegación fluida, con búsquedas filtradas y acceso rápido a instrucciones paso a paso. Cualquier funcionalidad que genere confusión en pruebas de usuario será reevaluada antes del lanzamiento.

4\. Escalabilidad controlada 🔍  
En esta fase, el desarrollo se limitará a funciones básicas (catálogo, creación de recetas y guía interactiva). Features avanzados como maridaje o historial de preparaciones quedarán en backlog hasta validar la adopción inicial.

5\. Sin monetización directa 💡  
ZFCocteles operará como herramienta gratuita sin publicidad integrada. Si en el futuro se explotan modelos de negocio (ej. suscripciones premium), se notificará a los usuarios y se mantendrá el acceso libre al núcleo funcional.

6\. Soporte multiplataforma 🌐  
La versión 1.0 priorizará navegadores web modernos (Chrome, Firefox, Edge). El soporte para apps móviles nativas se considerará solo si hay demanda demostrable tras analizar métricas de uso.

---

## **🔹 Notas clave**

* Flexibilidad en diseño: La paleta de colores y disposición de elementos podrá ajustarse tras pruebas de usabilidad, pero siempre conservando accesibilidad.  
* Mínimo producto viable (MVP): Las funcionalidades "MUST" son innegociables para el lanzamiento; el resto se integrará en futuras iteraciones.

## **📜  Alcance y restricciones:** 

El proyecto está diseñado para ser un recetario interactivo de cócteles permitiendo a los usuarios explorar, crear y seguir preparaciones de bebidas de manera intuitiva. El alcance del proyecto consiste en ofrecer un catálogo de cócteles, con recetas predefinidas, pero también le permitirá a los usuarios crear sus propias recetas, o modificar las existentes a conveniencia. También se encargará de presentar una visualización interactiva de las recetas. De esta manera, facilitará la realización paso por paso de la receta elegida por el usuario. Esta interfaz está diseñada para ser accesible y estética, de manera que las instrucciones sean claras, y los usuarios puedan disfrutar nuevas recetas. También cumplirá con un requerimiento de responsabilidad social, ofreciendo consejos y advertencias sobre el contenido de alcohol de cada receta, y recomendaciones básicas de salud.

El proyecto ZFCocktails no es una aplicación de venta o pedidos de cócteles. El aplicativo informa cuáles son los ingredientes necesarios para crear un cóctel, pero no permite comprar cócteles ni ingredientes. El proyecto no está construido por profesionales de la salud, y las recomendaciones de consumo saludable son de uso general. Se recomienda uso con discreción con personas que tengan condiciones de salud específicas. Tampoco puede garantizar que la modificación de un cóctel sea 100% segura, aunque si puede dar advertencias si el uso de ingredientes sugerido es indebido.

