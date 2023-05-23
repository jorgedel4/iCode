package util

import (
	"database/sql"
	"elPadrino/RIDDLE/packages/structs"

	"fmt"
	"strings"
)

func MoQuestions(req structs.SelectQuestion, mysqlDB *sql.DB) (structs.ResultQuestion, error) {
	//Query de base para preguntas de modulo
	baseQuery := `SELECT q.id_question, q.q_type, q.info
	FROM questions q`

	var selectors []string
	var values []interface{}

	values = append(values, req.Group)
	values = append(values, req.Student)

	selectors = append(selectors, "current_status = ?")
	values = append(values, "APP")

	selectors = append(selectors, "module = ?")
	values = append(values, req.Assigment)

	selectors = append(selectors, "mod_question_status(?, id_question, ?) = ? OR mod_question_status(?, id_question, ?) = ?")
	//Primer chequeo con PEN
	values = append(values, req.Group)
	values = append(values, req.Student)
	values = append(values, "PEN")
	//Segunda revision con "FAI"
	values = append(values, req.Group)
	values = append(values, req.Student)
	values = append(values, "FAI")

	//Complete the Query
	var query string
	if len(selectors) > 0 {
		query = fmt.Sprintf("%s WHERE %s LIMIT 1", baseQuery, strings.Join(selectors, " AND "))
	} else {
		query = baseQuery
	}

	//Launch the query to the DB
	var result structs.ResultQuestion
	err := mysqlDB.QueryRow(query, values...).Scan(&result.IdPregunta, &result.Type, &result.Info)
	if err != nil {
		return result, err
	}

	return result, nil
}
