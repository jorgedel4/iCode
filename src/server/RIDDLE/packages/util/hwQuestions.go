package util

/* import (
	"database/sql"
	"elPadrino/RIDDLE/packages/structs"
	"fmt"
	"net/http"
	"strings"
)

// Funcion que reciba el id_estudiante y id_hwQuestion para asignar status a cada pregunta y de este modo definir como se muestran
func HwQuestions(w http.ResponseWriter, req structs.SelectQuestion, mysqlDB *sql.DB) {

	//Permitir que cualquier origen ingrese a este recurso
	w.Header().Set("Access-Control-Allow-Origin", "*")

	//Query de base para preguntas de tareas
	baseQueryHw := `SELECT q.q_type, q.info
	FROM hw_questionAttempts hqa
	JOIN questions q ON hqa.question = q.id_question`

	//Slices para almacenar los argumentos del Where
	var selectors []string
	var values []interface{}

	//Almacenamiento de los parametros en los argmentos de la query
	if reqS != "all" {
		selectors = append(selectors, "hqa.student = ?")
		values = append(values, req.Student)
	}

	if reqA != "all" {
		selectors = append(selectors, "q.module = ?")
		//module en DB pero es referente a Assigment tanto para grupo como tarea
		values = append(values, reqA)
	}

	//agregar al where preguntas con unn estatus en especifico
	//En este caso a
	selectors = append(selectors, "q.current_status = ?")
	values = append(values, "NOP")

	//Complete the Query
	var query string
	if len(selectors) > 0 {
		query = fmt.Sprintf("%s WHERE %s", baseQueryHw, strings.Join(selectors, " AND "))
	} else {
		query = baseQueryHw
	}

	//Launch the query to the DB
	rows, err := mysqlDB.Query(query, values...)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close() //Close the conection

	//Leer linea por linea o registros por registro de los resultados encontrados
	//  guardalos en results para despu[es mostrarlos]
	var results []structs.ResultQuestion
	for rows.Next() {
		var result structs.ResultQuestion
		if err = rows.Scan(&result.Type, &result.Info); err != nil {
			http.Error(w, "Error reading results", http.StatusInternalServerError)
			return
		}
		results = append(results, result)
	}
} */
