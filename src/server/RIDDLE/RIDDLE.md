# RIDDLE API

RIDDLE (Question Resource Interface for Developing, Deploying, and Logging Exams) es una API con el
propósito de mostrar preguntas cuando el estudiante las solicite, siguiendo el siguiente orden:
1. Primero le dará las preguntas que no se hayan completado como correctas.
2. Después le dará las preguntas que haya contestado de manera incorrecta para que intente resolverlas nuevamente.

Nunca se le darán preguntas repetidas, en caso de no existir más preguntas se le notificará al usuario.
Funcionando como un conector entre las BBDDs (MongoDB y MySQL) y el cliente.

## URL BASE
34.125.0.99:8003

## ENDPOINTS de solicitud de preguntas
### /questions
#### Descripción
Solicitar el tipo de pregunta e informacion JSON de cada pregunta

#### Metodo de HTTP
GET

#### Parametros
(Mediante el URL)
| Parametro    | Tipo      | Obligatorio                                  | Decripcion                                             |
| :---------:  | :-------: | :------------------------------------------: | :----------------------------------------------------: |
| id_student   | string    | si                                           | ID del estudiante que pide preguntas                   |
| id_assigment | string    | si                                           | ID del modulo o tarea desde la que se hace la peticion | 
| id_group     | string    | no (Solo en modulos es obligatoria)          | ID del grupo al que pertene el estudiante              |

#### Respuesta 
En caso de realizar una busqueda exitosa, se desplegara el tipo de pregunta, seguido del JSON que contiene
la informacion de la pregunta a resolver.

#### Ejemplo
**Peticion**
GET 
34.125.0.99:8003/questions?id_student=A01551955&id_assigment=M0000000000000000001

**Respuesta**
HTTP/1.1 200 OK Content-Type: application/json
``` json
[
    {
        "Info": "{\"hinputs\": [[\"2\"], [\"4\"]], \"sinputs\": [[\"3\"], [\"6\"]], \"houtputs\": [\"4\", \"16\"], \"language\": \"python\", \"soutputs\": [\"9\", \"36\"], \"timeoutSec\": 10, \"description\": \"Double a number\", \"initialCode\": \"\", \"forbiddenFunctions\": []}",
        "Type": "codep"
    }
]
```
