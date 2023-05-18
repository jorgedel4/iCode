package read

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jorgedel4/iCode/packages/structs"
)

func GroupModules(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")

		groupID := mux.Vars(r)["groupID"]
		userID := r.URL.Query().Get("user_id")

		var baseQuery string
		results := make([]interface{}, 0)
		var values []interface{}

		if len(userID) > 0 && userID[0] == 'A' {
			baseQuery = `SELECT id_module, nombre, locked, n_question, successful_mod_attempts(?, id_module) AS answered
			FROM moduleConfigs mc
			JOIN modules m ON mc.module = m.id_module 
			WHERE mc.grupo = ?`

			values = append(values, userID)
			values = append(values, groupID)

			rows, err := mysqlDB.Query(baseQuery, values...)
			if err != nil {
				http.Error(w, "Error executing query", http.StatusInternalServerError)
				return
			}
			defer rows.Close()

			for rows.Next() {
				var result structs.ModuleStudent
				err = rows.Scan(&result.ID, &result.Name, &result.Locked, &result.NQuestions, &result.NAnswered)

				result.Progress = int((float32(result.NAnswered) / float32(result.NQuestions)) * 100)

				if err != nil {
					http.Error(w, "Error reading results", http.StatusInternalServerError)
					return
				}

				results = append(results, result)
			}
		} else {
			baseQuery = `SELECT id_module, nombre, locked, n_question
			FROM moduleConfigs mc
			JOIN modules m ON mc.module = m.id_module 
			WHERE mc.grupo = ?`

			values = append(values, groupID)

			rows, err := mysqlDB.Query(baseQuery, values...)
			if err != nil {
				http.Error(w, "Error executing query", http.StatusInternalServerError)
				return
			}
			defer rows.Close()

			for rows.Next() {
				var result structs.Module
				err = rows.Scan(&result.ID, &result.Name, &result.Locked, &result.NQuestions)

				if err != nil {
					http.Error(w, "Error reading results", http.StatusInternalServerError)
					return
				}

				results = append(results, result)
			}
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
