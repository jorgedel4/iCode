package read

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jorgedel4/iCode/packages/structs"
)

func EnrolledStudents(mysql *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")

		group := mux.Vars(r)["groupID"]

		baseQuery := `SELECT s.matricula, CONCAT(first_name, ' ', flast_name, ' ', slast_name) 
		FROM enrollments e 
		JOIN students s ON e.student = s.matricula`

		query := fmt.Sprintf("%s WHERE e.grupo = ?", baseQuery)

		rows, err := mysql.Query(query, group)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var enrolledStudents []structs.Student
		for rows.Next() {
			var student structs.Student
			if err := rows.Scan(&student.ID, &student.Name); err != nil {
				http.Error(w, "Error reading results", http.StatusInternalServerError)
				return
			}
			enrolledStudents = append(enrolledStudents, student)
		}

		studentsJSON, err := json.Marshal(enrolledStudents)
		if err != nil {
			http.Error(w, "Error parsing response", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(studentsJSON)
		w.(http.Flusher).Flush()
		w.(http.CloseNotifier).CloseNotify()
	}
}