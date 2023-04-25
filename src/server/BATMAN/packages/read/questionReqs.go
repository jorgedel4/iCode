package read

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/jorgedel4/iCode/packages/structs"
)

func QuestionReqs(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		var req structs.QuestionReqsReq
		if err := json.Unmarshal(body, &req); err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		baseQuery := `SELECT q.id_question, q.q_type, q.info, q.created_by, CONCAT(p.first_name, ' ', p.flast_name, ' ', p.slast_name), c.id_course, c.course_name, m.nombre, q.current_status, q.submittedOn
		FROM questions q
		JOIN professors p ON q.created_by = p.nomina
		JOIN modules m ON q.module = m.id_module
		JOIN courses c ON m.course = c.id_course`

		var selectors []string
		var values []interface{}

		if req.QuestionsType != "all" {
			selectors = append(selectors, "q.q_type = ?")
			values = append(values, req.QuestionsType)
		}

		if req.RequestedBy != "all" {
			selectors = append(selectors, "q.created_by = ?")
			values = append(values, req.RequestedBy)
		}

		if req.Course != "all" {
			selectors = append(selectors, "c.id_course = ?")
			values = append(values, req.Course)
		}

		if req.Status != "all" {
			selectors = append(selectors, "q.current_status = ?")
			values = append(values, req.Status)
		}

		var query string
		if len(selectors) > 0 {
			query = fmt.Sprintf("%s WHERE %s", baseQuery, strings.Join(selectors, " AND "))
		} else {
			query = baseQuery
		}

		rows, err := mysqlDB.Query(query, values...)
		if err != nil {
			http.Error(w, "Error executing query", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var results []structs.QuestionReq
		for rows.Next() {
			var result structs.QuestionReq
			if err = rows.Scan(&result.ID, &result.Type, &result.Info, &result.RequestersID, &result.RequestersName, &result.Course, &result.CourseName, &result.Module, &result.Status, &result.SubmittedOn); err != nil {
				http.Error(w, "Error reading results", http.StatusInternalServerError)
				return
			}
			results = append(results, result)
		}

		hwreqsJSON, err := json.Marshal(results)
		if err != nil {
			http.Error(w, "Error parsing response", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(hwreqsJSON)
		w.(http.Flusher).Flush()
		w.(http.CloseNotifier).CloseNotify()
	}
}
