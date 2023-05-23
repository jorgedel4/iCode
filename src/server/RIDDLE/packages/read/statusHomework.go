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

		query := `SELECT GetTotalQuestions(?, ?), GetCorrectQuestion(?, ?);`

		var progress int
		var total int
		err := mysqlDB.QueryRow(query, req.StudentID, req.HomeworkID, req.StudentID, req.HomeworkID).Scan(&total, &progress)
		if err != nil {
			http.Error(w, "Error executing query", http.StatusInternalServerError)
			return
		}

		// Create a response struct
		response := struct {
			Total    int `json:"total"`
			Progress int `json:"progress"`
		}{
			Total:    total,
			Progress: progress,
		}

		// Encode the response struct into JSON
		responseJSON, err := json.Marshal(response)
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
