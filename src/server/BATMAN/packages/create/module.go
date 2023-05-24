package create

import (
	"database/sql"
	"encoding/json"
	"io"
	"net/http"

	"github.com/jorgedel4/iCode/packages/structs"
	"github.com/jorgedel4/iCode/packages/util"
)

func Module(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Enable CORS
		w.Header().Set("Access-Control-Allow-Origin", "*")

		// Read request body
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		// Cast into struct
		var req structs.NewModule
		if err := json.Unmarshal(body, &req); err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		// Generate ID for the Module
		moduleID, _ := util.GenerateID("M", 19)

		// Call the MySQL function to insert the module
		query := "SELECT InsertModule(?, ?, ?)"
		var errorMessage string
		err = mysqlDB.QueryRow(query, moduleID, req.Course, req.Name).Scan(&errorMessage)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if errorMessage != "" {
			http.Error(w, errorMessage, http.StatusConflict)
			return
		}

		// Send response and close connection
		w.WriteHeader(http.StatusCreated)
		w.(http.Flusher).Flush()
		w.(http.CloseNotifier).CloseNotify()
	}
}
