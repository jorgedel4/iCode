package create

import (
	"database/sql"
	"encoding/json"
	"io"
	"net/http"

	"github.com/jorgedel4/iCode/packages/structs"
	"github.com/jorgedel4/iCode/packages/util"
)

func Group(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		var req structs.NewGroupReq
		if err := json.Unmarshal(body, &req); err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		// No estoy orgulloso de este metodo, pero era problematico generar IDs con prefijo que fuera autoincrementadas
		// es necesario que los IDs tengan predijo dado a que esto hace el uso de las APIs mas fluido
		groupID := util.GenerateRandomNumber("G", 9)

		// Start transaction
		tx, err := mysqlDB.Begin()
		if err != nil {
			http.Error(w, "Error starting transaction", http.StatusInternalServerError)
			return
		}

		// Create group
		_, err = tx.Exec("INSERT INTO grupos VALUES (?, ?, ?, ?)", groupID, req.CourseID, req.ProfessorID, req.TermID)
		if err != nil {
			tx.Rollback()
			http.Error(w, "Error creating group", http.StatusInternalServerError)
			return
		}

		// Save module configurations
		for _, module := range req.ModulesConfs {
			tx.Exec("INSERT INTO moduleConfigs VALUES (?, ?, ?, ?)", module.ModuleID, groupID, module.NQuestions, false)
			if err != nil {
				tx.Rollback()
				http.Error(w, "Error saving configurations", http.StatusInternalServerError)
				return
			}
		}

		// Commit transaction
		if err := tx.Commit(); err != nil {
			tx.Rollback()
			http.Error(w, "Error commiting transaction", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		w.(http.Flusher).Flush()
		w.(http.CloseNotifier).CloseNotify()
	}
}
