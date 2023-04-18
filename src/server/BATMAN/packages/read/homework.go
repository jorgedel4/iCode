package read

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

type HWReq struct {
	ID    string
	Time  string // should support: week (hw for the next 7 days), all ()
	Group string // should support: all (al enrolled groups) and the ID of the group
}

//week

type HW struct {
	HW_ID      string    `json:"hw_id"`
	HW_Name    string    `json:"hw_name"`
	CourseID   string    `json:"course_id"`
	CourseName string    `json:"course_name"`
	GroupID    string    `json:"group_id"`
	Opening    time.Time `json:"opening"`
	Closing    time.Time `json:"closing"`
	State	   string	 `json:"state"` // closed, solved, active
}

func Homework(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var accountTypes = make(map[byte]string)
		accountTypes['L'] = "professor"
		accountTypes['A'] = "student"
		accountTypes['S'] = "admin"
		body, err := io.ReadAll(r.Body)

		if err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		var hwReq HWReq
		if err := json.Unmarshal(body, &hwReq); err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		accountType := accountTypes[hwReq.ID[0]]

		baseQuery := `SELECT * 
		FROM homework hw 
		JOIN grupos g ON hw.grupo = g.id_group`

		if accountType == "professor" {

		} else if accountType == "student" {

		}

		var selectors []string

		query := fmt.Sprintf("%s WHERE %s", baseQuery, strings.Join(selectors, " AND "))
	}
}
