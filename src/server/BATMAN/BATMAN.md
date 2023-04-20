# BATMAN API
BATMAN (Basic API for Transactional Management And Navigation) es una API cuya principal funcionalidad es la de realizar operaciones CRUD.
Funcionando como un conector entre las BBDDs (MongoDB y MySQL) y el cliente.

## URL Base

`34.125.0.99:8082`

## Endpoints

### `/courses`
Usado para obtener todos los cursos

#### Method
`GET`

#### Parametros
(Mediante el body de la peticion)

| Parameter | Type   | Requerido | Description                                     |
| --------- | ------ | --------- | ----------------------------------------------- |
| id        | string | si        | Identificador del usuario                       |
| term      | string | si        | Periodo del cual se quieren buscar cursos. Se requiere el ID del periodo por ejemplo 'FJ23'. Otra opcion es 'current', para seleccionar los cursos del periodo actual|

#### Respuesta
La respuesta tiene formato JSON y contiene los siguientes campos

| Campo          | Tipo                  | Descripcion                             |
| -------------- | --------------------- | ----------------------------------------|
| id_group       | string                | ID del grupo                            |
| id_course      | string                | ID del curso                            |
| course_name    | string                | Nombre del curso                        |
| start_date     | string                | Fecha de inicio del curso               |
| end_date       | string                | Fecha de fin del curso                  |
| first_name     | string                | Primer nombre del profesor del curso    |
| flast_name     | string                | Primer apellido del profesor            |
| slast_name     | string                | Segundo apellido del profesor           |

#### Ejemplo
**Peticion**
POST 34.125.0.99:8082
Content-Type: application/json

```
{
    "id": "L01922384",
    "term": "current"
}
```
**Respuesta**
HTTP/1.1 200 OK
Content-Type: application/json

```
[
    {
        "id_group": "G001",
        "id_course": "TC1028",
        "course_name": "Pensamiento computacional",
        "start_date": "2023-02-15T00:00:00Z",
        "end_date": "2023-06-26T00:00:00Z",
        "first_name": "Daniel",
        "flast_name": "Perez",
        "slast_name": "Rojas"
    }
]
```

## Mensajes de error
En caso de que se presente un error no relacionado con la ejecucion del código, se regresara un mensaje describiendo el error. 

| HTTP Status | Error Message                                    | Description                                                                                                 |
| ----------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| 400         | Error reading request body                       | No se proporcionaron todos los atributos necesarios, o nose cumple con el formato                           |
| 500         | Error executing query                            | No se pudo ejecutar la query generada para SQL. Revisar las tablas o el codigo                              |
| 500         | Error reading results                            | Los datos regresados por la query no pudieron ser casteados al tipo de dato esperado                        |
| 500         | Error parsing response                           | No se pudo transformar el objeto de respuesta a JSON                                                        |