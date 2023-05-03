package create

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/jorgedel4/iCode/packages/structs"
)

func Term(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		var req structs.Term
		if err := json.Unmarshal(body, &req); err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		query := "INSERT INTO terms VALUES (?, ?, ?, ?)"

		_, err = mysqlDB.Exec(query, req.ID, req.Name, req.StartDate, req.EndDate)
		if err != nil {
			if strings.HasPrefix(err.Error(), "Error 1062 (23000): Duplicate entry") {
				http.Error(w, fmt.Sprintf("Campus with ID '%s' already exists", req.ID), http.StatusConflict)
			} else {
				http.Error(w, "Error creating campus", http.StatusInternalServerError)
			}
			return
		}

		w.WriteHeader(http.StatusCreated)
		w.(http.Flusher).Flush()
		w.(http.CloseNotifier).CloseNotify()
	}
}
