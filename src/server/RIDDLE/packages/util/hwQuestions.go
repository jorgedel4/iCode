package util

import (
	"database/sql"
	"elPadrino/RIDDLE/packages/structs"
	"fmt"
	"net/http"
	"strings"
)

// Funcion que reciba el id_estudiante y id_hwQuestion para asignar status a cada pregunta y de este modo definir como se muestran
func HwQuestions(w http.ResponseWriter, req structs.SelectQuestion, mysqlDB *sql.DB) ([]structs.ResultQuestion, error) {

	//Permitir que cualquier origen ingrese a este recurso
	w.Header().Set("Access-Control-Allow-Origin", "*")

	//Query de base para preguntas de tareas
	baseQueryHw := `SELECT id_question, module, q_type, info, mod_question_status(?, id_question, ?) AS status
	FROM questions`

	//Slices para almacenar los selectores y valores del where
	var selectors []string
	var values []interface{}

	//
	values = append(values, req.Assigment) //id_homework
	values = append(values, req.Student)   // studiante

	selectors = append(selectors, "current_status = ?")
	values = append(values, "APP")

	selectors = append(selectors, "module = ?")
	values = append(values, req.Module)

	//Le paso la funcion en el where para que solo me de las preguntas con PEN
	selectors = append(selectors, "mod_question_status(?, id_question, ?) = ? OR mod_question_status2(?, id_question, ?) = ?")

	//Primer chequeo con PEN
	values = append(values, req.Assigment)
	values = append(values, req.Student)
	values = append(values, "PEN")

	//Segunda revision con "FAI"
	values = append(values, req.Assigment)
	values = append(values, req.Student)
	values = append(values, "FAI")

	//Complete the Query
	var query string
	if len(selectors) > 0 {
		query = fmt.Sprintf("%s WHERE %s LIMIT 1", baseQueryHw, strings.Join(selectors, " AND "))
	} else {
		query = baseQueryHw
	}

	//Launch the query to the DB
	rows, err := mysqlDB.Query(query, values...)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return []structs.ResultQuestion{}, err
	}
	defer rows.Close() //Close the conection

	//Leer linea por linea o registros por registro de los resultados encontrados
	//  guardalos en results para despues mostrarlos
	var results []structs.ResultQuestion
	for rows.Next() {
		var result structs.ResultQuestion
		if err = rows.Scan(&result.IdPregunta, &result.Module, &result.Type, &result.Info, &result.Status); err != nil {
			http.Error(w, "Error reading results", http.StatusInternalServerError)
			return []structs.ResultQuestion{}, err
		}
		results = append(results, result)
	}

	return results, nil
}

/*
Quiero seleccionar la informacion de cada pregunta,

ya cuento con una funcion que checa el status de cada pregunta en base
a los intentos de cada tarea, es decir, toma todos los intentos de esa pregunta
y posteriormente me regresa el status del ultimo intento de cada pregunta

ahora necesito que solo me de tantas preguntas como existan en el modulo para cada
tarea,

mi primer aproximacion es desde el where, generar una funcion que sea capaz de crear un cntador que
contabilice
*/
