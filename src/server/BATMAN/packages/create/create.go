package create

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
	"github.com/jorgedel4/iCode/packages/util"
	// "go.mongodb.org/mongo-driver/mongo"
)

type Campus struct {
	ID   string `json:"id" db:"id_campus"`
	Name string `json:"name" db:"name_campus"`
}

type Term struct {
	ID   string `json:"id" db:"id_term"`
	Name string `json:"name" db:"term"`
}

func Handler(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Reading request's body (returns a slice of bytes, not usable yet)
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		category := mux.Vars(r)["category"]
		switch category {
		case "campus":
			var campus Campus
			if err := json.Unmarshal(body, &campus); err != nil {
				http.Error(w, "Error decoding request body", http.StatusBadRequest)
				return
			}
			if err := util.InsertRow(mysqlDB, "campus", campus); err != nil {
				if strings.Contains(err.Error(), "Error 1062") {
					http.Error(w, fmt.Sprintf("Record with id '%s' already exists in table 'campus'", campus.ID), http.StatusConflict)
					return
				} else {
					http.Error(w, fmt.Sprintf("Error creating %s record: %v", category, err), http.StatusInternalServerError)
					return
				}
			}
		case "term":
			var term Term
			if err := json.Unmarshal(body, &term); err != nil {
				http.Error(w, "Error decoding request body", http.StatusBadRequest)
				return
			}
			if err := util.InsertRow(mysqlDB, "terms", term); err != nil {
				if strings.Contains(err.Error(), "Error 1062") {
					http.Error(w, fmt.Sprintf("Record with id '%s' already exists in table 'terms'", term.ID), http.StatusConflict)
					return
				} else {
					http.Error(w, fmt.Sprintf("Error creating %s record: %v", category, err), http.StatusInternalServerError)
					return
				}
			}
		default:
			http.Error(w, "Invalid category", http.StatusBadRequest)
			return
		}

		w.WriteHeader(http.StatusCreated)
	}
}