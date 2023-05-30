package read

import (
	"database/sql"
	"elPadrino/RIDDLE/packages/structs"
	"encoding/json"
	"net/http"
)

func StatusModule(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Enable CORS
		w.Header().Set("Access-Control-Allow-Origin", "*")

		var studentID, groupID, moduleID string
		studentID = r.URL.Query().Get("student")
		groupID = r.URL.Query().Get("group")
		moduleID = r.URL.Query().Get("module")

		if studentID == "" || groupID == "" || moduleID == "" {
			http.Error(w, "Missing arguments", http.StatusBadRequest)
			return
		}

		var progress structs.Progress

		// Needed questions
		neededQuery := `SELECT n_question
		FROM moduleConfigs
		WHERE module = ?
		AND grupo = ?`

		err := mysqlDB.QueryRow(neededQuery, moduleID, groupID).Scan(&progress.Needed)
		if err != nil {
			http.Error(w, "Error getting progress", http.StatusInternalServerError)
			return
		}

		// Answered questions for that module
		answeredQuery := "SELECT successful_mod_attempts(?, ?, ?)"

		err = mysqlDB.QueryRow(answeredQuery, studentID, moduleID, groupID).Scan(&progress.Answered)
		if err != nil {
			http.Error(w, "Error getting progress", http.StatusInternalServerError)
			return
		}

		progressJSON, err := json.Marshal(progress)
		if err != nil {
			http.Error(w, "Error getting progress", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(progressJSON)
		w.(http.Flusher).Flush()
		w.(http.CloseNotifier).CloseNotify()
	}
}