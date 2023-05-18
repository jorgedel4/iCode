package create

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/jorgedel4/iCode/packages/structs"
)

func Enrollment(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		var req structs.EnrollmentReq
		if err := json.Unmarshal(body, &req); err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		baseQuery := "INSERT INTO enrollments(grupo, student) VALUES (?, ?)"

		stmt, err := mysqlDB.Prepare(baseQuery)
		if err != nil {
			http.Error(w, "Error preparing query", http.StatusInternalServerError)
			return
		}
		defer stmt.Close()

		_, err = stmt.Exec(req.Group, req.Student)
		if err != nil {
			if strings.HasPrefix(err.Error(), "Error 1062 (23000): Duplicate entry") {
				http.Error(w, fmt.Sprintf("'%s' already enrolled in '%s'", req.Student, req.Group), http.StatusConflict)
				return
			} else if strings.Contains(err.Error(), "grupos"){
				http.Error(w, fmt.Sprintf("Group '%s' does not exist", req.Group), http.StatusBadRequest)
				return
			} else if strings.Contains(err.Error(), "students"){
				http.Error(w, fmt.Sprintf("Student '%s' does not exist", req.Student), http.StatusBadRequest)
				return
			}
		}

		w.WriteHeader(http.StatusCreated)
		w.(http.Flusher).Flush()
		w.(http.CloseNotifier).CloseNotify()
	}
}
