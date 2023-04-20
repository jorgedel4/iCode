# CodeExec API

CodeExec es una REST API implementada en Go. Permite ejecutar y evaluar código de manera remota.

## URL Base

`34.125.0.99:8081`

## Endpoints

### `/exec`

#### Method

`POST`

#### Parametros
(Mediante el body de la peticion)

| Parameter | Type   | Requerido | Description                                     |
| --------- | ------ | --------- | ----------------------------------------------- |
| code      | string | si        | Código a ejecutar                               |
| id        | string | si        | ID del problema en MongoDB                      |

#### Respuesta

La respuesta tiene formato JSON y contiene los siguientes campos

| Campo          | Tipo                  | Descripcion                                                                               |
| -------------- | --------------------- | -----------------------------------------------------------------                         |
| error          | string                | Error generado al ejecutar el código, en caso de que no hayan errores es un string vacio  |
| shownTests     | [ map[string]string ] | Casos de prueba visibles                                                                  |
| hiddenTests    | map[string]int        | Cantidad de casos de prueba no visibles que pasaron y fallaron                            |

#### Ejemplo
**Peticion**
GET 34.125.0.99:8081
Content-Type: application/json

```
{
    "code": "def sumOfTwo(a, b):\n\treturn a + b",
    "id": "TC1028/2/23"
}
```
**Respuesta**
HTTP/1.1 200 OK
Content-Type: application/json

```
{
    "error": "",
    "shownTests": [
        {
            "expected": "2",
            "got": "3",
            "input": "3,2",
            "status": "failed"
        }
    ],
    "hiddenTests": {
        "failed": 1,
        "passed": 0
    }
}
```

## Respuestas de error
En caso de que se presente un error no relacionado con la ejecucion del código, se regresara un mensaje describiendo el error. 

| HTTP Status | Error Message                                    | Description                                                                                                 |
| ----------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| 400         | Error reading request body                       | No se proporcionaron todos los atributos necesarios, o nose cumple con el formato                           |
| 403         | Found disallowed functions in code ({functions}) | El código recibido contiene funciones no permitidas, no se ejecutará                                        |   
| 500         | Error executing query                            | Problema al hacer la consulta a MongoDB, probablemente no exista un documento con el ID dado                |
| 500         | Error creating tests                             | Problema interno del servidor para generar casos de prueba, indica que el problema en la BBDD no es correcto|
| 500         | Error executing code                             | Error al ejecutar código no relacionado directamente con este, probablemente le falta algo al ambiente en el que se ejecuto|
| 500         | Error parsing result                             | Error al "parsear" el output de la ejecucion del código, indica un error en codeExec/packages/util parseIntoResult()|
| 500         | Error encoding response                          | Error al transformar el objeto de respuesta a un json, indica un error en la definición del struct `Result` |



## Funcionamiento
Esta API es un microservicio, ya que unicamente es capaz de ejecutar código y regresar los resultados. Como medida de seguridad ante inyecciones de código, cada ejecución es realizada en un contenedor de docker el cual es desechado después de su uso.

![Arquitectura](codeExecArq.png)
