package read

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jorgedel4/iCode/packages/structs"
)

func CourseModules(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")

		courseID := mux.Vars(r)["courseID"]

		query := `SELECT id_module, nombre
		FROM modules
		WHERE course = ?`

		rows, err := mysqlDB.Query(query, courseID)
		if err != nil {
			http.Error(w, "Error executing query", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var results []structs.CourseModule
		for rows.Next() {
			var result structs.CourseModule
			err = rows.Scan(&result.ID, &result.Name)
			if err != nil {
				http.Error(w, "Error reading results", http.StatusInternalServerError)
				return
			}

			results = append(results, result)
		}

		modulesJSON, err := json.Marshal(results)
		if err != nil {
			http.Error(w, "Error parsing response", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(modulesJSON)
		w.(http.Flusher).Flush()
		w.(http.CloseNotifier).CloseNotify()
	}
}
