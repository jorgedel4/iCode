<h1 style="color:#93e5ab; font-size: 40px">RIDDLE API</h1>

RIDDLE (Question Resource Interface for Developing, Deploying, and Logging Exams) es una API con el
propósito de mostrar preguntas cuando el estudiante las solicite, siguiendo el siguiente orden:
1. Primero le dará las preguntas que no se hayan completado como correctas.
2. Después le dará las preguntas que haya contestado de manera incorrecta para que intente resolverlas nuevamente.

Nunca se le darán preguntas repetidas, en caso de no existir más preguntas se le notificará al usuario.
Funcionando como un conector entre las BBDDs (MongoDB y MySQL) y el cliente.

<h2 style="color:#65b891;">URL BASE</h2>
34.16.137.250:8003

<h1 style="color:#B5FFE1;">ENDPOINTS de Lectura</h1>
________________________________________________________________
<h2 style="color:#65b891;">ENDPOINT de solicitud de preguntas de Modulo o Tarea</h2>

<h3 style="color:#0000FF;">/questions</h3>

<h3 style="color:#b5ffe1;">Descripción</h3>
Solicitar una pregunta nueva, puede ser de una tarea  de un modulo

<h3 style="color:#b5ffe1;">Metodo de HTTP</h3>
GET

<h3 style="color:#b5ffe1;">Parámetros</h3>
(Mediante el URL)

| Parametro    | Tipo      | Obligatorio                                  | Decripcion                                             |
| :---------:  | :-------: | :------------------------------------------: | :----------------------------------------------------: |
| id_student   | string    | si                                           | ID del estudiante que pide preguntas                   |
| id_assigment | string    | si                                           | ID del modulo o Tarea desde la que se hace la peticion | 
| id_group     | string    | solo en caso de pregunta de modulo           | ID del grupo al que pertene el estudiante              |

<h3 style="color:#b5ffe1;">Respuesta para ambos casos</h3>
(En formato JSON) Arreglo de objetos que representan a la pregunta recibida. Cada estudiante cuenta con los siguientes camposos estudiante
| Campo          | Tipo                  | Descripcion                                                         |
| -------------- | --------------------- | ------------------------------------------------------------------: |
| id_pregunta    | string                | ID de la pregunta obtenida                                          |
| type           | string                | Tipo de la pregunta (codep o multi)                                 |
| info           | string                | Informacion de la pregunta (descripcion, inputs y outputs, etc)     |

<h3 style="color:#b5ffe1;">Ejemplos</h3>
<p style= "font-weight: bold;">Peticion Para Pregunta de Tarea</p>

GET 
34.16.137.250:8003/questions?id_assigment=H0000000000000000001&id_student=A01551955

<h3 style="color:#b5ffe1;">Respuesta</h3>

HTTP/1.1 200 OK Content-Type: application/json
``` json
{
    "id_pregunta": "CQ000000000000000005",
    "type": "codep",
    "info": "{\"hinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"sinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"houtputs\": [\"9\", \"7\"], \"language\": \"python\", \"soutputs\": [\"9\", \"7\"], \"timeoutSec\": 10, \"description\": \"create a function that returns the biggest number\", \"initialCode\": \"\", \"forbiddenFunctions\": [\"sum\"]}"
}
```

<p style= "font-weight: bold;">Peticion Para Pregunta de Modulo</p>

GET 
34.16.137.250:8003/questions?id_assigment=H0000000000000000001&id_student=A01551955&id_group=G000000001

<h3 style="color:#b5ffe1;">Respuesta</h3>

HTTP/1.1 200 OK Content-Type: application/json
``` json
{
    "id_pregunta": "CQ000000000000000004",
    "type": "codep",
    "info": "{\"hinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"sinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"houtputs\": [\"9\", \"7\"], \"language\": \"python\", \"soutputs\": [\"9\", \"7\"], \"timeoutSec\": 10, \"description\": \"create a function that returns the biggest number\", \"initialCode\": \"\", \"forbiddenFunctions\": [\"sum\"]}"
}
```

_______________________________________________
<h2 style="color:#65b891;">ENDPOINT para revisar progreso de una tarea</h2>

<h3 style="color:#0000FF;">/statusHomework</h3>

<h3 style="color:#b5ffe1;">Descripción</h3>
Solicitar el porcentaje de avance de una tarea para un estudiante dado

<h3 style="color:#b5ffe1;">Metodo de HTTP</h3>
GET

<h3 style="color:#b5ffe1;">Parámetros</h3>
(Mediante el URL)

| Parametro    | Tipo      | Obligatorio                                  | Decripcion                                             |
| :---------:  | :-------: | :------------------------------------------: | :----------------------------------------------------: |
| id_student   | string    | si                                           | ID del estudiante al que se busca evaluar su avance en la tarea                  |
| id_homework  | string    | si                                           | ID de la tarea a la que se referencia         | 


<h3 style="color:#b5ffe1;">Ejemplo</h3>

<p style= "font-weight: bold;">Peticion</p>
GET 
34.16.137.250:8003/statusHomework?student_id=A01551955&homework_id=H0000000000000000001


<h3 style="color:#b5ffe1;">Respuesta</h3>
(En formato JSON) Arreglo de objetos que representan el progreso de la tarea. De cuentan con los siguientes campos:
| Campo          | Tipo                  | Descripcion                                                         |
| -------------- | --------------------- | ------------------------------------------------------------------: |
| total          | int                   | Cantidad total de preguntas habilitadas para la tarea                                         |
| progress       | int                   | Cantidad de preguntas para esa tarea resueltas con exito                                |

HTTP/1.1 200 OK Content-Type: application/json
``` json
{
    "total": 3,
    "progress": 2
}
```
<p>"total" representa el total de preguntas con el que cuenta esa tarea</p>
<p>"progress" representa la cantidad de preguntas de esa tarea resueltas con exito</p>



<h1 style="color:#B5FFE1;">ENDPOINTS de Escritura</h1>
_____________________________________________________
<h2 style="color:#65b891;">ENDPOINT de solicitud de carga de Preguntas a Administrador desde interfaz</h2>

<h3 style="color:#0000FF;">/requestQuestion</h3>

<h3 style="color:#b5ffe1;">Descripción</h3>
Solicitud para agregar una pregunta a la base de datos

<h3 style="color:#b5ffe1;">Metodo de HTTP</h3>
POST

<h3 style="color:#b5ffe1;">Parámetros</h3>
(Mediante el Body)

| Parametro    | Tipo      | Obligatorio                                  | Decripcion                                              |
| :---------:  | :-------: | :------------------------------------------: | :-----------------------------------------------------: |
| module       | string    | si                                           | ID del modulo al que pertenece la pregunta              |
| q_type       | string    | si                                           | Tipo de pregunta a cargar                               | 
| info         | string    | si                                           | String con info de toda la pregunta                     |
| created_by   | string    | si                                           | ID del profesor que realiza la peticion                 |

<h3 style="color:#b5ffe1;">Respuesta</h3>
En caso de que se haya creado la tarea de forma exitosa, se regresa unicamente un codigo HTTP 201 (Created) Nota: Se agrega la pregunta a la tabla de questions, con un current_status de "PEN" para que el administrador pueda aceptar o rechazarla

<h3 style="color:#b5ffe1;">Ejemplo</h3>
<p style= "font-weight: bold;">Peticion</p>


POST
Peticion POST 34.16.137.250:8003/requestQuestion Content-Type: application/json 

```json
{
    "module": "M0000000000000000001",
    "q_type": "codep",
    "info": "{\"hinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"sinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"houtputs\": [\"9\", \"7\"], \"language\": \"python\", \"soutputs\": [\"9\", \"7\"], \"timeoutSec\": 10, \"description\": \"create a sefunction that returns the biggest number\", \"initialCode\": \"\", \"forbiddenFunctions\": [\"sum\"]}",
    "created_by": "L00000003"
}
```

<h3 style="color:#b5ffe1;">Respuesta</h3>
<p style= "font-weight: bold;">Respuesta</p>

HTTP/1.1 201 Created

_____________________________________________________
<h2 style="color:#65b891;">ENDPOINT de solicitud de carga de Preguntas a Administrador desde file.json</h2>

<h3 style="color:#0000FF;">/requestQuestion</h3>

<h3 style="color:#b5ffe1;">Descripción</h3>
Solicitud para agregar una pregunta o preguntas a la base de datos a traves de un file.json

<h3 style="color:#b5ffe1;">Metodo de HTTP</h3>
POST

<h3 style="color:#b5ffe1;">Parámetros</h3>
(Mediante el Body)

Se recibe un archivo llamado "file.json" el cual puede contener 1 o mas objetos de tipo json, donde cada uno de estos representa
una pregunta en especifico.

El contenido del archivo file.json debe contener una estructura de arreglos como el siguiente:

```json
[
    {
        "module": "M0000000000000000001",
        "q_type": "codep",
        "info": "{\"hinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"sinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"houtputs\": [\"9\", \"7\"], \"language\": \"python\", \"soutputs\": [\"9\", \"7\"], \"timeoutSec\": 10, \"description\": \"create a sefunction that returns the biggest number\", \"initialCode\": \"\", \"forbiddenFunctions\": [\"sum\"]}",
        "created_by": "L00000003"
    },
    {
        "module": "M0000000000000000002",
        "q_type": "multi",
        "info": "{\"hinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"sinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"houtputs\": [\"9\", \"7\"], \"language\": \"python\", \"soutputs\": [\"9\", \"7\"], \"timeoutSec\": 10, \"description\": \"create a sefunction that returns the biggest number\", \"initialCode\": \"\", \"forbiddenFunctions\": [\"sum\"]}",
        "created_by": "L00000003"
    }
]
```

Donde cada arreglo representa una pregunta, y cada arreglo contiene la siguiente informacion:

| Parametro    | Tipo      | Obligatorio                                  | Decripcion                                              |
| :---------:  | :-------: | :------------------------------------------: | :-----------------------------------------------------: |
| module       | string    | si                                           | ID del modulo al que pertenece la pregunta              |
| q_type       | string    | si                                           | Tipo de pregunta a cargar                               | 
| info         | string    | si                                           | String con info de toda la pregunta                     |
| created_by   | string    | si                                           | ID del profesor que realiza la peticion                 |

<h3 style="color:#b5ffe1;">Respuesta</h3>
En caso de que se haya creado la tarea de forma exitosa, se regresa unicamente un codigo HTTP 201 (Created) Nota: Se agrega la pregunta o preguntas a la tabla de questions, con un current_status de "PEN" para que el administrador pueda aceptar o rechazarla

<h3 style="color:#b5ffe1;">Ejemplo</h3>
<p style= "font-weight: bold;">Peticion</p>


POST
Peticion POST 34.125.0.99:8003/requestQuestion Content-Type: application/json 

<h3>file.json</h3>


<h3 style="color:#b5ffe1;">Respuesta</h3>
<p style= "font-weight: bold;">Respuesta</p>

HTTP/1.1 201 Created

_____________________________________________________
<h2 style="color:#65b891;">ENDPOINT carga de intento de pregunta de Tarea</h2>

<h3 style="color:#0000FF;">/hwQuestionAttempt</h3>

<h3 style="color:#b5ffe1;">Descripción</h3>
Carga de intentos de preguntas de tareas

<h3 style="color:#b5ffe1;">Metodo de HTTP</h3>
POST

<h3 style="color:#b5ffe1;">Parámetros</h3>
(Mediante el Body)
student, homework, question, attempt_status

| Parametro        | Tipo      | Obligatorio                                  | Decripcion                                              |
| :-------------:  | :-------: | :------------------------------------------: | :-----------------------------------------------------: |
| student          | string    | si                                           | ID del estudiante que pide preguntas                    |
| homework         | string    | si                                           | ID de la tarea desde la que se hace la peticion         | 
| question         | string    | si                                           | ID de la pregunta que se intenta                        |
| attempt_status   | string    | si                                           | status del intento de la pregunta ("PAS", "FAI")        |
| attempt_time     | int64     | si                                           | Tiempo en segundos que le toma al estudiante realizar la pregunta|


<h3 style="color:#b5ffe1;">Respuesta</h3>
En caso de que el intento de la pregunta de una tarea se registre de manera exitosa, se regresa unicamente un codigo HTTP 201 (Created) Nota: Se agrega el intento de la pregunta a la tabla de hw_questionAtempts.

<h3 style="color:#b5ffe1;">Ejemplo</h3>
<p style= "font-weight: bold;">Peticion</p>


POST
Peticion POST 34.125.0.99:8003/hwQuestionAttempt Content-Type: application/json 

```json
{
    "student": "A01731511",
    "homework": "H0000000000000000002",
    "question": "CQ000000000000000002",
    "attempt_status": "PAS",
    "attempt_time": 1568
}
```

<h3 style="color:#b5ffe1;">Respuesta</h3>
<p style= "font-weight: bold;">Respuesta</p>

HTTP/1.1 200 Ok

_____________________________________________________
<h2 style="color:#65b891;">ENDPOINT carga de intento de pregunta de Modulo</h2>

<h3 style="color:#0000FF;">/modQuestionAttempt</h3>

<h3 style="color:#b5ffe1;">Descripción</h3>
Carga de intentos de preguntas de Modulos

<h3 style="color:#b5ffe1;">Metodo de HTTP</h3>
POST

<h3 style="color:#b5ffe1;">Parámetros</h3>
(Mediante el Body)
student, grupo, question, attempt_status

| Parametro        | Tipo      | Obligatorio                                  | Decripcion                                              |
| :-------------:  | :-------: | :------------------------------------------: | :-----------------------------------------------------: |
| student          | string    | si                                           | ID del estudiante que pide preguntas                    |
| grupo            | string    | si                                           | ID del grupo                                            | 
| question         | string    | si                                           | ID de la pregunta que se intenta                        |
| attempt_status   | string    | si                                           | status del intento de la pregunta ("PAS", "FAI")        |
| attempt_time     | int64     | si                                           | Tiempo en segundos que le toma al estudiante realizar la pregunta|

<h3 style="color:#b5ffe1;">Respuesta</h3>
En caso de que el intento de la pregunta de un modulo se registre de manera exitosa, se regresa unicamente un codigo HTTP 201 (Created) Nota: Se agrega el intento de la pregunta a la tabla de questionAtempts.

<h3 style="color:#b5ffe1;">Ejemplo</h3>
<p style= "font-weight: bold;">Peticion</p>


POST
Peticion POST 34.125.0.99:8003/modQuestionAttempt Content-Type: application/json 

```json
{
    "student": "A01731511",
    "grupo": "G000000003",
    "question": "CQ000000000000000002",
    "attempt_status": "PAS",
    "attempt_time": 1568
}
```

<h3 style="color:#b5ffe1;">Respuesta</h3>
<p style= "font-weight: bold;">Respuesta</p>

HTTP/1.1 200 Ok

<h1 style="color:#B5FFE1;">ENDPOINTS de Eliminación</h1>
________________________________________________________________
<h2 style="color:#65b891;">ENDPOINT rechazo de pregunta del profesor por admin</h2>

<h3 style="color:#0000FF;">/declineQuestionRequest/{questionID}</h3>

<h3 style="color:#b5ffe1;">Descripción</h3>
Cuando el Administrador considera que una pregunta de propuesta para ser cargada a la base de datos no debe
ser admitida

<h3 style="color:#b5ffe1;">Metodo de HTTP</h3>
DELETE

<h3 style="color:#b5ffe1;">Parámetros</h3>
(Mediante el URL)

| Parametro    | Tipo      | Obligatorio                                  | Decripcion                                             |
| :---------:  | :-------: | :------------------------------------------: | :----------------------------------------------------: |
| questionID   | string    | si                                           | ID de la pregunta que debe ser eliminada de la base de datos                 |


<h3 style="color:#b5ffe1;">Respuesta</h3>
Response 
HTTP/1.1 200 OK 

<h3 style="color:#b5ffe1;">Ejemplo</h3>

DELETE 
34.16.137.250:8003/declineQuestionRequest/CQ000000000000000004

<h3 style="color:#b5ffe1;">Respuesta</h3>

HTTP/1.1 200 OK 


<h1 style="color:#B5FFE1;">ENDPOINTS de Actualización</h1>
________________________________________________________________

<h2 style="color:#65b891;">ENDPOINT aceptación de pregunta del profesor por admin</h2>

<h3 style="color:#0000FF;">/aproveQuestionRequest/{questionID}</h3>

<h3 style="color:#b5ffe1;">Descripción</h3>
Cuando el Administrador considera que una pregunta de propuesta para ser cargada a la base de datos si debe
ser admitida

<h3 style="color:#b5ffe1;">Metodo de HTTP</h3>
PATCH

<h3 style="color:#b5ffe1;">Parámetros</h3>
(Mediante el URL)

| Parametro    | Tipo      | Obligatorio                                  | Decripcion                                             |
| :---------:  | :-------: | :------------------------------------------: | :----------------------------------------------------: |
| questionID   | string    | si                                           | ID de la pregunta que debe ser eliminada de la base de datos                 |


<h3 style="color:#b5ffe1;">Respuesta</h3>
Response 
HTTP/1.1 200 OK 

<h3 style="color:#b5ffe1;">Ejemplo</h3>

DELETE 
34.16.137.250:8003/aproveQuestionRequest/CQ000000000000000004

<h3 style="color:#b5ffe1;">Respuesta</h3>

HTTP/1.1 200 OK 