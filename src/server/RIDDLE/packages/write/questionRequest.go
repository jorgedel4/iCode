package write

import (
	"database/sql"
	"elPadrino/RIDDLE/packages/structs"
	"elPadrino/RIDDLE/packages/util"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

/* Function to post questions */
func RequestQuestion(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")

		//Revisar el metodo
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		//Leer el body de la conexion
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "chispas", http.StatusBadRequest)
			return
		}

		//Tomar del JSON la informacion
		var req []structs.RequestQuestion // slice de preguntas
		if err := json.Unmarshal(body, &req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		//Query de inserciona la base de datos
		baseQuery := "INSERT INTO questions(id_question,module, q_type, info, created_by, submittedOn, current_status) VALUES (?, ?, ?, ?, ?, ?, ?)"

		//Prepara genera un puntero
		stmt, err := mysqlDB.Prepare(baseQuery)
		if err != nil {
			http.Error(w, "Error preparing query", http.StatusInternalServerError)
			return
		}
		defer stmt.Close()

		for _, question := range req {
			//Generate Id_Question
			idQuestion, _ := util.GenerateID("CQ", 18)
			//Generate the time of submittion
			now := time.Now()

			//if the q_type isnt a correct value
			if question.QType != `codep` && question.QType != `multi` {
				http.Error(w, fmt.Sprintf("The Type Question '%s' does not exist", question.QType), http.StatusBadRequest)
				return
			}

			_, err = stmt.Exec(idQuestion, question.Module, question.QType, question.Info, question.CreatedBy, now, "PEN")
			if err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				if strings.HasPrefix(err.Error(), "Error 1062 (23000): Duplicate entry") {
					http.Error(w, fmt.Sprintf("'%s' already existe in the questions", idQuestion), http.StatusConflict)
					return
				} else if err.Error() == "Error 1452 (23000): Cannot add or update a child row: a foreign key constraint fails (`icode`.`questions`, CONSTRAINT `questions_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `professors` (`nomina`) ON DELETE CASCADE)" {
					http.Error(w, fmt.Sprintf("The professor'%s' does not exist", question.CreatedBy), http.StatusBadRequest)
					return
				} else if err.Error() == "Error 1452 (23000): Cannot add or update a child row: a foreign key constraint fails (`icode`.`questions`, CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`module`) REFERENCES `modules` (`id_module`) ON DELETE CASCADE)" {
					http.Error(w, fmt.Sprintf("Student '%s' does not exist", question.Module), http.StatusBadRequest)
					return
				}
			}
		}

		// Enviar respuesta
		w.WriteHeader(http.StatusOK)

	}
}
