package remove

import (
	"database/sql"
	"net/http"

	"github.com/gorilla/mux"
)

func Homework(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		hwID := mux.Vars(r)["homeworkID"]

		tx, err := mysqlDB.Begin()
		if err != nil {
			http.Error(w, "Error deleting homework", http.StatusInternalServerError)
			return
		}

		_, err = tx.Exec("DELETE FROM homeworkConfigs WHERE homework = ?", hwID)
		if err != nil {
			tx.Rollback()
			http.Error(w, "Error deleting homework", http.StatusInternalServerError)
			return
		}

		_, err = tx.Exec("DELETE FROM hw_questionAttempts WHERE homework = ?", hwID)
		if err != nil {
			tx.Rollback()
			http.Error(w, "Error deleting homework", http.StatusInternalServerError)
			return
		}

		_, err = tx.Exec("DELETE FROM homework WHERE id_homework = ?", hwID)
		if err != nil {
			tx.Rollback()
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		err = tx.Commit()
		if err != nil {
			http.Error(w, "Error deleting homework", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.(http.Flusher).Flush()
		w.(http.CloseNotifier).CloseNotify()
	}
}
