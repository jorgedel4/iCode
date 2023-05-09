package create

import (
	"database/sql"
	"encoding/json"
	"io"
	"net/http"

	"github.com/jorgedel4/iCode/packages/structs"
	"github.com/jorgedel4/iCode/packages/util"
)

func Homework(mysql *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		var req structs.NewHWReq
		if err := json.Unmarshal(body, &req); err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		tx, err := mysql.Begin()
		if err != nil {
			http.Error(w, "Error starting transaction", http.StatusInternalServerError)
			return
		}

		for _, group := range req.Groups {
			hwID, err := util.GenerateID("H", 19)
			if err != nil {
				tx.Rollback()
				http.Error(w, "Error creating homework", http.StatusInternalServerError)
				return
			}

			_, err = tx.Exec("INSERT INTO homework VALUES (?, ?, ?, ?, ?)", hwID, group, req.HWName, req.OpenDate, req.CloseDate)
			if err != nil {
				tx.Rollback()
				http.Error(w, "Error creating homework", http.StatusInternalServerError)
				return
			}

			for _, moduleQuestion := range req.ModulesQuestions {
				_, err = tx.Exec("INSERT INTO homeworkConfigs VALUES (?, ?, ?)", hwID, moduleQuestion.Module, moduleQuestion.NQuestions)
				if err != nil {
					tx.Rollback()
					http.Error(w, "Error saving configurations", http.StatusInternalServerError)
					return
				}
			}
		}

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
