package exec

import (
	"database/sql"
	"encoding/json"
	"io"
	"net/http"
)

func Code(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Reading requests body
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		// Parsing the body into a struct
		var reqBody RequestBody
		if err := json.Unmarshal(body, &reqBody); err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		var problemJSON string
		query := "SELECT info FROM hw_questions WHERE id_hwquestion = ?"
		err = db.QueryRow(query, reqBody.ID).Scan(&problemJSON)
		if err != nil {
			http.Error(w, "Error executing query", http.StatusInternalServerError)
		}

		// Parsing the body into a struct
		var problem Problem
		err = json.Unmarshal([]byte(problemJSON), &problem)
		if err != nil {
			http.Error(w, "Error parsing result from db", http.StatusInternalServerError)
		}

		
	}
}
