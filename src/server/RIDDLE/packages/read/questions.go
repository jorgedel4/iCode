package read

import (
	"database/sql"
	"elPadrino/RIDDLE/packages/structs"
	"elPadrino/RIDDLE/packages/util"
	"encoding/json"
	"net/http"
)

func Questions(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		//Permitir que cualquier origen ingrese a este recurso
		w.Header().Set("Access-Control-Allow-Origin", "*")

		//Leer el contenido del body de la peticion, si hay error lo guarda en unavariable
		var req structs.SelectQuestion
		req.Student = r.URL.Query().Get("id_student")     //Matricula
		req.Assigment = r.URL.Query().Get("id_assigment") //Modulo o Tarea
		req.Group = r.URL.Query().Get("id_group")         //Grupo

		//Verificar que los params sean cumplidos
		if req.Student == "" || req.Assigment == "" {
			http.Error(w, "Error reading parameters from url", http.StatusBadRequest)
			return
		}

		var question structs.ResultQuestion
		var err error

		// Pregunta de modulo
		if req.Assigment[0] == 'M' {
			if req.Group == "" {
				http.Error(w, "Error reading Group", http.StatusBadRequest)
				return
			}

			//Llamar funcion para preguntas de modulos
			question, err = util.MoQuestions(req, mysqlDB)
			if err != nil {
				http.Error(w, "Error retrieving question", http.StatusInternalServerError)
				return
			}
			// Pregunta de tarea
		} else if req.Assigment[0] == 'H' {
			question, err = util.HWQuestion(req, mysqlDB)
			if err != nil {
				http.Error(w, "Error retrieving question", http.StatusInternalServerError)
				return
			}
		}

		questionJSON, err := json.Marshal(question)
		if err != nil {
			http.Error(w, "Error retrieving question", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(questionJSON)
		w.(http.Flusher).Flush()
		w.(http.CloseNotifier).CloseNotify()
	}
}