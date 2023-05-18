package write

import (
	"database/sql"
	"net/http"
)

/* Function to post questions */
func ModQuestAttempt(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")

	}
}
