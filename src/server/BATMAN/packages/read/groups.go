package read

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/jorgedel4/iCode/packages/structs"
)

func Groups(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Setting up headers for CORS (not needed after full deployment)
		w.Header().Set("Access-Control-Allow-Origin", "*")

		var accountTypes = make(map[byte]string)
		accountTypes['L'] = "professor"
		accountTypes['A'] = "student"
		accountTypes['S'] = "admin"

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		var req structs.GroupsReq
		if err := json.Unmarshal(body, &req); err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		// Determine account type
		accountType, ok := accountTypes[req.ID[0]]
		if !ok {
			http.Error(w, "Invalid account type", http.StatusBadRequest)
			return
		}

		baseQuery := `SELECT g.id_group, c.id_course, c.course_name, t.date_start, t.date_end, p.first_name, p.flast_name, p.slast_name 
		FROM grupos g
		JOIN terms t ON g.term = t.id_term
		JOIN courses c ON g.course = c.id_course
		JOIN professors p ON g.main_professor = p.nomina`

		var values []interface{}

		var personSelector, termSelector string
		switch accountType {
		case "professor":
			{
				personSelector = "g.main_professor = ?"
				values = append(values, req.ID)
			}
		case "student":
			{
				baseQuery += "\nJOIN enrollments e ON g.id_group = e.grupo"
				personSelector = "e.student = ?"
				values = append(values, req.ID)
			}
		case "admin":
			{
				personSelector = ""
			}
		}

		switch req.Term {
		case "current":
			{
				termSelector = "CURRENT_TIMESTAMP BETWEEN t.date_start and t.date_end"
			}
		case "all":
			{
				termSelector = ""
			}
		default:
			{
				termSelector = "g.term = ?"
				values = append(values, req.ID)
			}
		}

		var query string
		if personSelector == "" && termSelector == "" {
			query = baseQuery
		} else if personSelector != "" && termSelector != "" {
			query = fmt.Sprintf("%s WHERE %s AND %s", baseQuery, personSelector, termSelector)
		} else if personSelector != "" && termSelector == "" {
			query = fmt.Sprintf("%s WHERE %s", baseQuery, personSelector)
		} else if personSelector == "" && termSelector != "" {
			query = fmt.Sprintf("%s WHERE %s", baseQuery, termSelector)
		}

		rows, err := mysqlDB.Query(query, values...)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var results []structs.Group = make([]structs.Group, 0)
		for rows.Next() {
			var result structs.Group
			if err := rows.Scan(&result.GroupID, &result.CourseID, &result.CourseName, &result.StartDate, &result.EndDate, &result.ProfName, &result.ProfFLastName, &result.ProfSLastName); err != nil {
				http.Error(w, "Error reading results", http.StatusInternalServerError)
				return
			}
			results = append(results, result)
		}

		groupsJSON, err := json.Marshal(results)
		if err != nil {
			http.Error(w, "Error parsing response", http.StatusInternalServerError)
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(groupsJSON)
		w.(http.Flusher).Flush()
		w.(http.CloseNotifier).CloseNotify()
	}
}
