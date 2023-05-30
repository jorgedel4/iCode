package read

import (
	"database/sql"
	"elPadrino/RIDDLE/packages/structs"
	"encoding/json"
	"net/http"
)

// Get the progress for a homework
func StatusHomework(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Enable CORS
		w.Header().Set("Access-Control-Allow-Origin", "*")

		// Get the required variables from URL parameters
		var req structs.HomeworkCheck
		req.StudentID = r.URL.Query().Get("id_student")
		req.HomeworkID = r.URL.Query().Get("id_homework")

		// Check if the required variables are provided
		if req.StudentID == "" || req.HomeworkID == "" {
			http.Error(w, "Error reading parameters from URL", http.StatusBadRequest)
			return
		}

		var progress structs.Progress
		query := `SELECT GetTotalQuestions(?, ?), GetCorrectQuestion(?, ?);`

		err := mysqlDB.QueryRow(query, req.StudentID, req.HomeworkID, req.StudentID, req.HomeworkID).Scan(&progress.Needed, &progress.Answered)
		if err != nil {
			http.Error(w, "Error executing query", http.StatusInternalServerError)
			return
		}

		// Encode the response struct into JSON
		responseJSON, err := json.Marshal(progress)
		if err != nil {
			http.Error(w, "Error parsing response", http.StatusInternalServerError)
			return
		}

		// Set the response headers and write the response JSON
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(responseJSON)
	}
}
