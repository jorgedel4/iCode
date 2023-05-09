package remove

import (
	"database/sql"
	"net/http"

	"github.com/gorilla/mux"
)

func Module(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		moduleID := mux.Vars(r)["moduleID"]

		query := `DELETE FROM modules
		WHERE id = ?`

		_, err := mysqlDB.Exec(query, moduleID)
		if err != nil {
			http.Error(w, "Error deleting module", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.(http.Flusher).Flush()
		w.(http.CloseNotifier).CloseNotify()
	}
}
