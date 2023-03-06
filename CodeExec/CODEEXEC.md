# CodeExec API

API que permite evaluar el codigo de los alumnos con varios casos de prueba.

## Funcionamiento

1. Se recive una peticion POST mediante express (mas detalle de esto en la seccion de uso).
2. Se busca la informacion del problema que se desea evaluar en la base de datos de mongo.
3. Se genera archivo en el que se guarda el codigo a evaluar. Este se crea dentro de la carpeta /CodeExec/Generated/{Lenguaje}, y se nombra usando la funcion de v4 de uuid en npm (esto para evitar que 2 instancias tengan el mismo nombre y se tenga un overwrite).
4. Al archivo, se le inyectan los casos de prueba.
5. Se ejecuta el codigo en el lado del servidor.
6. Se regresa un json que contiene el estatus de las pruebas (mas detalle de esto en la seccion de uso).
7. Se borra el archivo creado.

## Uso
