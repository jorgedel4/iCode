# BATMAN API
BATMAN (Basic API for Transactional Management And Navigation) es una API cuya principal funcionalidad es la de realizar operaciones CRUD.
Funciona como un conector entre la BBDD en MySQL y el cliente, incorporando la logica necesaria para que el front-end reciba la informacion de la manera mas simple posible.

## URL Base

`34.125.0.99:8002`

## Endpoints de creacion

## Endpoints de lectura
### `/courses`
#### Descripcion
Todos los cursos que se tienen registrados

#### Metodo de HTTP
`GET`

#### Parametros
No se necesitan parametros

#### Respuesta
(En formato JSON) Arreglo de objetos que representan los cursos. Cada curso cuenta con los siguientes campos
| Campo          | Tipo                  | Descripcion                               |
| -------------- | --------------------- | ----------------------------------------- |
| id             | string                | Identificador del curso                   |
| name           | string                | Nombre completo del curso                 |
| n_modules      | int                   | Numero de modulos pertenecientes al curso |

#### Ejemplo
**Peticion**
GET 34.125.0.99:8002/courses

**Respuesta**
HTTP/1.1 200 OK
Content-Type: application/json
``` json
[
    {
        "id": "TC1028",
        "name": "Pensamiento computacional",
        "n_modules": 3
    },
    {
        "id": "TC1030",
        "name": "Programacion orientada a objetos",
        "n_modules": 3
    },
    {
        "id": "TC1031",
        "name": "Estructuras de datos y algoritmos",
        "n_modules": 3
    }
]
```

### `/enrolledstudents/{groupID}`
#### Descripcion
Estudiantes inscritos en un grupo

#### Metodo de HTTP
`GET`

#### Parametros
* `groudID` (obligatorio): ID del grupo del cual se desea la lista de estudiantes

#### Respuesta
(En formato JSON) Arreglo de objetos que representan a los estudiantes. Cada estudiante cuenta con los siguientes campos
| Campo          | Tipo                  | Descripcion            |
| -------------- | --------------------- | ---------------------- |
| id             | string                | Matricula del alumno   |
| name           | string                | Nombre del alumno      |

#### Ejemplo
**Peticion**
GET 34.125.0.99:8002/enrolledstudents/G000000001

**Respuesta**
HTTP/1.1 200 OK
Content-Type: application/json
``` json
[
    {
        "id": "A00157831",
        "name": "Jose Cardoza Mendez"
    },
    {
        "id": "A01551955",
        "name": "Jorge Delgado Morales"
    },
    {
        "id": "A01712734",
        "name": "Adriana Fernandez Rojas"
    },
    {
        "id": "A01731511",
        "name": "Karla Sanchez Olivares"
    }
]
```

### `/groups`
#### Descripcion
Grupos que impate e/o impatio un profesor. O en los que esta/estaba inscrito un estudiante

#### Metodo de HTTP
`GET`

#### Parametros
(Mediante parametros de url)
* `id` (obligatorio): ID del estudiante/profesor del cual se desean consultar sus grupos
* `term` (obligatorio): Periodo del que se desean los grupos. Se puede mandar el ID del periodo (4 caracteres. Ej: IV23), 'all' para todos los periodos y 'current' para el periodo actual

#### Respuesta
(En formato JSON) Arreglo de objetos que representan a los grupos. Cada grupo cuenta con los siguientes campos
| Campo          | Tipo                  | Descripcion                                  |
| -------------- | --------------------- | ----------------------                       |
| id_group       | string                | ID del grupo                                 |
| id_course      | string                | ID del curso                                 |
| course_name    | string                | Nombre del curso                             |
| start_date     | string                | Fecha de inicio del grupo (formato ISO 8601) |
| end_date       | string                | Fecha de fin del grupo (formato ISO 8601)    |
| first_name     | string                | Nombre del profesor que impate el grupo      |
| flast_name     | string                | Apellido paterno del profesor                |
| slast_name     | string                | Apellido materno del profesor                |


#### Ejemplo
**Peticion**
GET 34.125.0.99:8002/groups?id=A01551955&term=current

**Respuesta**
HTTP/1.1 200 OK
Content-Type: application/json
``` json
[
    {
        "id_group": "G000000001",
        "id_course": "TC1028",
        "course_name": "Pensamiento computacional",
        "start_date": "2023-02-15T00:00:00Z",
        "end_date": "2023-06-26T23:59:59Z",
        "first_name": "Daniel",
        "flast_name": "Perez",
        "slast_name": "Rojas"
    },
    {
        "id_group": "G000000005",
        "id_course": "TC1030",
        "course_name": "Programacion orientada a objetos",
        "start_date": "2023-02-15T00:00:00Z",
        "end_date": "2023-06-26T23:59:59Z",
        "first_name": "Claudia",
        "flast_name": "Perez",
        "slast_name": "Lezama"
    }
]
```



### `/homework`
#### Descripcion
Tareas que un estudiante tiene asignadas. O tareas que un profesor ha asignado a sus grupos

#### Metodo de HTTP
`GET`

#### Parametros
(Mediante parametros de url)
* `id` (obligatorio): ID del estudiante/profesor del cual se desean consultar sus tareas
* `time` (obligatorio): Intervalo de tiempo del cual se desean las tareas. 'week' para las tareas que se cierran de la fecha de solicitud a una semana en adelante, 'future' para todas las tareas que aun no se han cerrado.
* `group` (obligatorio): ID del grupo del que se desean las tareas. En caso de que se deseen las tareas de todos los grupos usar 'all'
* `group_by` (obligatorio): Formato en el que se agruparan las tareas. 'group' para regresar un mapa donde la llave es el ID del grupo y el contenido un arreglo de tareas, 'week' regresa un arreglo de tareas, el indice 0 representa las tareas del mismo dia de la solicitud, indice 1 el del dia despues y asi consecutivamente hasta el indice 6

#### Respuestas
(En formato JSON) Independientemente de la forma en la que se agrupan las tareas, cada una tiene los siguientes campos
| Campo          | Tipo                  | Descripcion                                  |
| -------------- | --------------------- | ----------------------                       |
| hw_id          | string                | ID de la tarea                               |
| hw_name        | string                | Nombre de la tarea                           |
| course_id      | string                | ID del curso                                 |
| course_name    | string                | Nombre del curso                             |
| group_id       | string                | ID del grupo                                 |
| opening        | string                | Fecha de apertuda de la tarea                |
| closing        | string                | Fecha de cierre de la tarea                  |
| needed         | int                   | Numero de preguntas necesitadas para terminar|
| done           | int                   | Numero de preguntas hechas por el alumno     |


#### Ejemplo (group_by=group)
**Peticion**
GET 34.125.0.99:8002/homework?id=A01551955&time=week&group=all&group_by=group

**Respuesta**
HTTP/1.1 200 OK
Content-Type: application/json
``` json
{
    "G000000001": [
        {
            "hw_id": "H0000000000000000001",
            "hw_name": "Tarea 1: Condicionales",
            "course_id": "TC1028",
            "course_name": "Pensamiento computacional",
            "group_id": "G000000001",
            "opening": "2023-04-20T00:00:00Z",
            "closing": "2023-04-28T23:59:59Z",
            "needed": 2,
            "done": 1
        }
    ]
}
```

#### Ejemplo (group_by=week)
**Peticion**
GET 34.125.0.99:8002/homework?id=A01551955&time=week&group=all&group_by=week

**Respuesta**
HTTP/1.1 200 OK
Content-Type: application/json
``` json
{
    [
        {
            "hw_id": "H0000000000000000001",
            "hw_name": "Tarea 1: Condicionales",
            "course_id": "TC1028",
            "course_name": "Pensamiento computacional",
            "group_id": "G000000001",
            "opening": "2023-04-20T00:00:00Z",
            "closing": "2023-04-28T23:59:59Z",
            "needed": 2,
            "done": 1
        }
    ]
}
```


### `/questionrequests`
#### Descripcion
Listado de preguntas que han sido solicitadas para ser agregadas al banco de preguntas

#### Metodo de HTTP
`GET`

#### Parametros
(Mediante parametros de url)
* `question_type` (obligatorio): Tipo de pregunta de las solicitudes. 'all' para todos los tipos, 'multi' para preguntas de opcion multiple y 'codep' para preguntas de codigo
* `requested_by` (obligatorio): ID del profesor que solicito agregar dicha pregunta. 'all' para todos los profesores
* `course` (obligatorio): ID del curso del que se desean las peticiones. 'all' para todos los cursos
* `status` (obligatorio): Estatus en el que se encuentran las preguntas. 'all' para todas, 'passed' para las aprovadas, 'rejected' para las rechazadas y 'pending' para las que aun no han sido evaluadas

#### Respuestas
(En formato JSON) Independientemente de la forma en la que se agrupan las tareas, cada una tiene los siguientes campos
| Campo            | Tipo                  | Descripcion                                  |
| ---------------- | --------------------- | ----------------------                       |
| id               | string                | ID de la pregunta en la BBDD                 |
| type             | string                | Tipo de la pregunta                          |
| info             | string                | JSON que contiene informacion de la pregunta |
| requesters_id    | string                | Nomina del profesor que hizo la peticion     |
| requesters_name  | string                | Nombre completo del profesor                 |
| course           | string                | ID del curso al que se quiere agregar la pregunta |
| course_name      | string                | Nombre del curso                             |
| module           | string                | Modulo al que se quiere agregar la pregunta  |
| status           | string                | Estatus en el que se encuentra la solicitud  |
| submitted_on     | string                | Fecha en la que se hizo la solicitud         |


#### Ejemplo
**Peticion**
GET 34.125.0.99:8002/questionrequests?question_type=all&requested_by=all&course=all&status=all

**Respuesta**
HTTP/1.1 200 OK
Content-Type: application/json
``` json
[
    {
        "id": "CQ000000000000000009",
        "type": "codep",
        "info": "{\"hinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"sinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"houtputs\": [\"9\", \"7\"], \"language\": \"python\", \"soutputs\": [\"9\", \"7\"], \"timeoutSec\": 10, \"description\": \"create a function that returns the biggest number\", \"initialCode\": \"\", \"forbiddenFunctions\": [\"sum\"]}",
        "requesters_id": "L00000001",
        "requesters_name": "Daniel Perez Rojas",
        "course": "TC1028",
        "course_name": "Pensamiento computacional",
        "module": "For loops",
        "status": "APP",
        "submitted_on": "2023-04-15T00:00:00Z"
    },
    {
        "id": "CQ000000000000000008",
        "type": "codep",
        "info": "{\"hinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"sinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"houtputs\": [\"9\", \"7\"], \"language\": \"python\", \"soutputs\": [\"9\", \"7\"], \"timeoutSec\": 10, \"description\": \"create a function that returns the biggest number\", \"initialCode\": \"\", \"forbiddenFunctions\": [\"sum\"]}",
        "requesters_id": "L00000001",
        "requesters_name": "Daniel Perez Rojas",
        "course": "TC1028",
        "course_name": "Pensamiento computacional",
        "module": "For loops",
        "status": "APP",
        "submitted_on": "2023-04-15T00:00:00Z"
    },
    {
        "id": "CQ000000000000000007",
        "type": "codep",
        "info": "{\"hinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"sinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"houtputs\": [\"9\", \"7\"], \"language\": \"python\", \"soutputs\": [\"9\", \"7\"], \"timeoutSec\": 10, \"description\": \"create a function that returns the biggest number\", \"initialCode\": \"\", \"forbiddenFunctions\": [\"sum\"]}",
        "requesters_id": "L00000001",
        "requesters_name": "Daniel Perez Rojas",
        "course": "TC1028",
        "course_name": "Pensamiento computacional",
        "module": "For loops",
        "status": "APP",
        "submitted_on": "2023-04-15T00:00:00Z"
    }
]
```


### `/users`
#### Descripcion
Usarios que estan dados de alta en la plataforma

#### Metodo de HTTP
`GET`

#### Parametros
(Mediante parametros de url)
* `user_type` (obligatorio): Tipo de usuarios a buscar. 'all' para todos, 'student' para alumnos, 'professor' para profesores
* `campus` (obligatorio): Campus de usuarios a buscar. 'all' para todos
* `id` (obligatorio): ID usuario a buscar. 'all' para todos
* `name` (obligatorio): Nombre del usuario a buscar. 'all' para todos

#### Respuestas
(En formato JSON) Se regresa un arreglo de estudiantes. Cada estudiante tiene los siguientes campos
| Campo            | Tipo                  | Descripcion                                  |
| ---------------- | --------------------- | ----------------------                       |
| name             | string                | Nombre completo del usuario                  |
| id               | string                | ID del usuario                               |
| campus           | string                | Campus del usuario                           |
| email            | string                | Correo del usuario                           |


#### Ejemplo
**Peticion**
GET 34.125.0.99:8002/users?user_type=student&campus=all&id=all&name=all

**Respuesta**
HTTP/1.1 200 OK
Content-Type: application/json
``` json
[
    {
        "name": "Carlos Villasenor Pacheco",
        "id": "A00102193",
        "campus": "CSF",
        "email": "A00102193@tec.mx"
    },
    {
        "name": "Jose Cardoza Mendez",
        "id": "A00157831",
        "campus": "PUE",
        "email": "A00157831@tec.mx"
    },
    {
        "name": "Sofia Garcia Jimenez",
        "id": "A00871372",
        "campus": "MTY",
        "email": "A00871372@tec.mx"
    },
    {
        "name": "Paulina Rojas Torres",
        "id": "A01112341",
        "campus": "GDL",
        "email": "A01112341@tec.mx"
    }
]
```



### `/terms`
#### Descripcion
Periodos academicos registrados

#### Metodo de HTTP
`GET`

#### Parametros
(Mediante parametros de url)
* `has_started` (opcional): 'true' para periodos que ya empezaron. 'false' para periodos que aun no empiezan. No dar este parametro regresa todos los periodos sin importar sus fechas. Los periodos se regresan en orden descendiente de acuerdo a sus fechas.

#### Respuestas
(En formato JSON) Se regresa un arreglo de periodos. Cada periodo tiene los siguientes campos
| Campo            | Tipo                  | Descripcion                |
| ---------------- | --------------------- | -------------------------- |
| id               | string                | ID del periodo             |
| name             | string                | Nombre entero del periodo  |
| start_date       | string                | Campus del usuario         |
| end_date         | string                | Correo del usuario         |


#### Ejemplo
**Peticion**
GET 34.125.0.99:8002/terms?has_started=false

**Respuesta**
HTTP/1.1 200 OK
Content-Type: application/json
``` json
[
    {
        "id": "AD23",
        "name": "Agosto-Diciembre 2023",
        "start_date": "2023-08-28T00:00:00Z",
        "end_date": "2023-12-12T23:59:59Z"
    },
    {
        "id": "VE23",
        "name": "Verano 2023",
        "start_date": "2023-07-05T00:00:00Z",
        "end_date": "2023-08-25T23:59:59Z"
    }
]
```


### `/groupmodules/{groupID}`
#### Descripcion
Modulos de un grupo

#### Metodo de HTTP
`GET`

#### Parametros
(Mediante variables de url)
* `groupID` (obligatorio): 'true' para periodos que ya empezaron. 'false' para periodos que aun no empiezan. No dar este parametro regresa todos los periodos sin importar sus fechas. Los periodos se regresan en orden descendiente de acuerdo a sus fechas.

(Mediante parametros de url)
* `user_id` (obligatorio): ID del usuario del que se quieren obtener los modulos.

#### Respuestas
(En formato JSON) Se regresa un arreglo de periodos. Cada periodo tiene los siguientes campos
| Campo            | Tipo                  | Descripcion                |
| ---------------- | --------------------- | -------------------------- |
| id               | string                | ID del periodo             |
| name             | string                | Nombre entero del periodo  |
| start_date       | string                | Campus del usuario         |
| end_date         | string                | Correo del usuario         |


#### Ejemplo
**Peticion**
GET 34.125.0.99:8002/terms?has_started=false

**Respuesta**
HTTP/1.1 200 OK
Content-Type: application/json
``` json
[
    {
        "id": "AD23",
        "name": "Agosto-Diciembre 2023",
        "start_date": "2023-08-28T00:00:00Z",
        "end_date": "2023-12-12T23:59:59Z"
    },
    {
        "id": "VE23",
        "name": "Verano 2023",
        "start_date": "2023-07-05T00:00:00Z",
        "end_date": "2023-08-25T23:59:59Z"
    }
]
```


## Endpoints de actualizacion

## Endpoints de eliminacion
