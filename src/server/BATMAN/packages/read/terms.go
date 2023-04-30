package read

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/jorgedel4/iCode/packages/structs"
)

func Terms(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")

		baseQuery := `SELECT * FROM terms`
		var selectors[] string

		hasStarted := r.URL.Query().Get("has_started")

		if hasStarted == "false" {
			selectors = append(selectors, "CURRENT_TIMESTAMP < date_start")
		} else if hasStarted == "true" {
			selectors = append(selectors, "CURRENT_TIMESTAMO > date_start")
		}

		orderBy := "ORDER BY date_start DESC"
		var selector string
		if len(selectors) > 0 {
			selector = fmt.Sprintf("WHERE %s", strings.Join(selectors, " AND "))
		}
		query := fmt.Sprintf("%s %s %s", baseQuery, selector, orderBy)

		rows, err := mysqlDB.Query(query)
		if err != nil {
			http.Error(w, "Error executing query", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var terms []structs.Term
		for rows.Next() {
			var term structs.Term
			if err := rows.Scan(&term.ID, &term.Name, &term.StartDate, &term.EndDate); err != nil {
				http.Error(w, "Error reading results", http.StatusInternalServerError)
				return
			}
			terms = append(terms, term)
		}

		termsJSON, err := json.Marshal(terms)
		if err != nil {
			http.Error(w, "Error parsing response", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(termsJSON)
		w.(http.Flusher).Flush()
		w.(http.CloseNotifier).CloseNotify()
	}
}
