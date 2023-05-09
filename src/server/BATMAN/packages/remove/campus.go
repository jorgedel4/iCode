package remove

import (
	"database/sql"
	"net/http"

	"github.com/gorilla/mux"
)

func Campus(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		campusID := mux.Vars(r)["campusID"]

		query := `DELETE FROM campus
		WHERE id_campus = ?`

		_, err := mysqlDB.Exec(query, campusID)
		if err != nil {
			http.Error(w, "Error deleting campus", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.(http.Flusher).Flush()
		w.(http.CloseNotifier).CloseNotify()
	}
}
