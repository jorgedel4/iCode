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
	baseQueryHw := `SELECT id_question, q_type, info, homeworkQuestions(?, id_question, ?) AS status
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
	selectors = append(selectors, "homeworkQuestions(?, id_question, ?) = ? OR mod_question_status2(?, id_question, ?) = ?")
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
	//  guardalos en results para despu[es mostrarlos]
	var results []structs.ResultQuestion
	for rows.Next() {
		var result structs.ResultQuestion
		if err = rows.Scan(&result.IdPregunta, &result.Type, &result.Info, &result.Status); err != nil {
			http.Error(w, "Error reading results", http.StatusInternalServerError)
			return []structs.ResultQuestion{}, err
		}
		results = append(results, result)
	}

	return results, nil
}

/* /* FUnction to questions from homeworks */
/* DELIMITER $$

CREATE FUNCTION get_hwQuestion_status (in_homework CHAR(10), in_question CHAR(20), in_student CHAR(9))
RETURNS CHAR(3)
BEGIN
    DECLARE out_status CHAR(3);
    SELECT
        CASE
            WHEN EXISTS (
                SELECT * FROM hw_questionAttempts
                WHERE student = in_student AND grupo = in_homework AND question = in_question AND attempt_status = 'PAS'
            ) THEN 'PAS'
            WHEN EXISTS (
                SELECT * FROM hw_questionAttempts
                WHERE student = in_student AND grupo = in_group AND question = in_question
            ) THEN 'FAI'
            ELSE 'PEN'
        END
    INTO out_status;
    RETURN out_status;
END$$

DELIMITER ;

SHOW FUNCTION STATUS WHERE Db = 'iCode';

DELIMITER $$
CREATE FUNCTION get_hw_status2(id_task CHAR(20), question_id CHAR(20), student CHAR(9))
RETURNS CHAR(3)
BEGIN
    RETURN (
        SELECT
            CASE
                WHEN EXISTS (
                    SELECT *
                    FROM hw_questionAttempts
                    WHERE
                        student = get_hw_status.student AND
                        grupo = id_task AND
                        question = question_id AND
                        attempt_status = 'PAS'
                )
                THEN 'PAS'
                WHEN EXISTS (
                    SELECT *
                    FROM hw_questionAttempts
                    WHERE
                        student = get_hw_status.student AND
                        grupo = id_task AND
                        question = question_id AND
                        attempt_status <> 'PAS'
                )
                THEN 'FAI'
                ELSE 'PEN'
            END
        );
END$$ */
