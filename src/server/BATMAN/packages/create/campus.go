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

func Campus(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		// Reading request's body (returns a slice of bytes, not usable yet)
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		var req structs.Campus
		if err = json.Unmarshal(body, &req); err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		if len(req.ID) != 3 {
			http.Error(w, "Campus' ID must be 3 characters long", http.StatusBadRequest)
			return
		}

		query := "INSERT INTO campus VALUES (?, ?)"

		_, err  = mysqlDB.Exec(query, req.ID, req.Name)
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
