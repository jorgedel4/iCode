package read

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/jorgedel4/iCode/packages/structs"
)

func Courses(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")

		query := "SELECT id_course, course_name, count_modules(id_course) FROM courses;"

		rows, err := mysqlDB.Query(query)
		if err != nil {
			http.Error(w, "Error executing query", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var results []structs.Course
		for rows.Next() {
			var result structs.Course
			if err = rows.Scan(&result.ID, &result.Name, &result.NModules); err != nil {
				http.Error(w, "Error reading results", http.StatusInternalServerError)
				return
			}
			results = append(results, result)
		}

		coursesJSON, err := json.Marshal(results)
		if err != nil {
			http.Error(w, "Error parsing response", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(coursesJSON)
		w.(http.Flusher).Flush()
		w.(http.CloseNotifier).CloseNotify()
	}
}
