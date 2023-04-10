package create

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
)

func Handler(mongoDB *mongo.Client, mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Reading request's body (returns a slice of bytes, not usable yet)
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		switch mux.Vars(r)["category"] {
		case "campus":
			{
				campus(w, r, mongoDB, mysqlDB, body)
				return
			}
		case "term":
			{
				term(w, r, mongoDB, mysqlDB, body)
				return
			}
		}
	}
}

type Campus struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func campus(w http.ResponseWriter, r *http.Request, mongoDB *mongo.Client, mysqlDB *sql.DB, body []byte) {
	var campus Campus
	err := json.Unmarshal(body, &campus)
	if err != nil {
		http.Error(w, "Error decoding request body", http.StatusBadRequest)
		return
	}

	insertQuery := fmt.Sprintf("INSERT INTO campus VALUES ('%s', '%s')", campus.ID, campus.Name)
	stmt, err := mysqlDB.Prepare(insertQuery)
	if err != nil {
		http.Error(w, "Internal error with DB", http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	// Execute the query with the values
	_, err = stmt.Exec()
	if err != nil {
		if strings.Contains(err.Error(), "Error 1062") {
			http.Error(w, fmt.Sprintf("Campus with id '%s' already exists", campus.ID), http.StatusConflict)
			return
		} else {
			http.Error(w, "Internal error with DB", http.StatusInternalServerError)
			return
		}
	}
}

func term(w http.ResponseWriter, r *http.Request, mongoDB *mongo.Client, mysqlDB *sql.DB, body []byte) {

}
