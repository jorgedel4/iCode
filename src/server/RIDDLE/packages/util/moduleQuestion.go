package util

import (
	"database/sql"
	"elPadrino/RIDDLE/packages/structs"

	"fmt"
	"strings"
)

func ModuleQuestion(req structs.SelectQuestion, mysqlDB *sql.DB) (structs.ResultQuestion, error) {

	baseQuery := `SELECT q.id_question, q.q_type, q.info
	FROM questions q`

	var selectors []string
	var values []interface{}

	selectors = append(selectors, "current_status = ?")
	values = append(values, "APP")

	selectors = append(selectors, "module = ?")
	values = append(values, req.Assigment)

	selectors = append(selectors, "id_question = ModuleQuestionID(?,?,?)")
	values = append(values, req.Group)
	values = append(values, req.Assigment)
	values = append(values, req.Student)

	//Complete the Query
	var query string
	if len(selectors) > 0 {
		query = fmt.Sprintf("%s WHERE %s LIMIT 1", baseQuery, strings.Join(selectors, " AND "))
	} else {
		query = baseQuery
	}

	//Launch the query to the DB
	rows, err := mysqlDB.Query(query, values...)
	if err != nil {
		return structs.ResultQuestion{}, err
	}
	defer rows.Close() //Close the conection

	var result structs.ResultQuestion
	for rows.Next() {
		if err = rows.Scan(&result.IdPregunta, &result.Type, &result.Info); err != nil {
			return structs.ResultQuestion{}, err
		}
	}

	return result, nil
}
