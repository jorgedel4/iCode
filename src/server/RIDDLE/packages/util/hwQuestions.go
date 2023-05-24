package util

import (
	"database/sql"
	"elPadrino/RIDDLE/packages/structs"
	"errors"
)

func HWQuestion(req structs.SelectQuestion, mysqlDB *sql.DB) (structs.ResultQuestion, error) {
	var question structs.ResultQuestion
	query := `SELECT id_question, q_type, info
	FROM questions
	WHERE id_question = HomeworkQuestionID(?, ?)
	LIMIT 1`

	err := mysqlDB.QueryRow(query, req.Assigment, req.Student).Scan(&question.IdPregunta, &question.Type, &question.Info)
	if err != nil {
		return question, err
	}

	// No questions avaliable
	if question.IdPregunta == "" {
		return question, errors.New("no more questions available")
	}

	return question, nil
}