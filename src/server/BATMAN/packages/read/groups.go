package read

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

type CourseRBody struct {
	ID   string `json:"id"`
	Term string `json:"term"`
}

type Group struct {
	GroupID       string    `json:"id_group"`
	CourseID      string    `json:"id_course"`
	CourseName    string    `json:"course_name"`
	StartDate     time.Time `json:"start_date"`
	EndDate       time.Time `json:"end_date"`
	ProfName      string    `json:"first_name"`
	ProfFLastName string    `json:"flast_name"`
	ProfSLastName string    `json:"slast_name"`
}

func Groups(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var accountTypes = make(map[byte]string)
		accountTypes['L'] = "professor"
		accountTypes['A'] = "student"
		accountTypes['S'] = "admin"

		// Reading request's body (returns a slice of bytes, not usable yet)
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		var rBody CourseRBody
		if err := json.Unmarshal(body, &rBody); err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		accountType := accountTypes[rBody.ID[0]]
		baseQuery := `SELECT g.id_group, c.id_course, c.course_name, t.startDate, t.endDate, p.first_name, p.flast_name, p.slast_name 
		FROM grupos g
		JOIN terms t ON g.term = t.id_term
		JOIN courses c ON g.course = c.id_course
		JOIN professors p ON g.main_professor = p.nomina`

		var personSelector, termSelector string
		if accountType == "professor" {
			personSelector = fmt.Sprintf("g.main_professor = '%s'", rBody.ID)
		} else if accountType == "student" {
			baseQuery += "\nJOIN enrollments e ON g.id_group = e.grupo"
			personSelector = fmt.Sprintf("e.student = '%s", rBody.ID)
		} else if accountType == "admin" {
			personSelector = ""
		}

		if rBody.Term == "current" {
			termSelector = "CURRENT_TIMESTAMP BETWEEN t.startDate and t.endDate"
		} else if rBody.Term == "all" {
			termSelector = ""
		} else {
			termSelector = fmt.Sprintf("g.term = '%s'", rBody.Term)
		}

		// not proud of this block, refactor later pls
		var query string
		if personSelector == "" && termSelector == "" {
			query = baseQuery
		} else if personSelector != "" && termSelector != "" {
			query = fmt.Sprintf("%s WHERE %s AND %s", baseQuery, personSelector, termSelector)
		} else if personSelector != "" && termSelector == "" {
			query = fmt.Sprintf("%s WHERE %s", baseQuery, personSelector)
		} else if personSelector == "" && termSelector != "" {
			query = fmt.Sprintf("%s WHERE %s", baseQuery, termSelector)
		}

		// Execute the query and get the result set
		rows, err := mysqlDB.Query(query)
		if err != nil {
			http.Error(w, "Error executing query", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var results []Group
		for rows.Next() {
			var result Group
			if err := rows.Scan(&result.GroupID, &result.CourseID, &result.CourseName, &result.StartDate, &result.EndDate, &result.ProfName, &result.ProfFLastName, &result.ProfSLastName); err != nil {
				http.Error(w, "Error reading results", http.StatusInternalServerError)
				return
			}
			results = append(results, result)
		}

		groupsJSON, err := json.Marshal(results)
		if err != nil {
			http.Error(w, "Error parsing response", http.StatusInternalServerError)
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(groupsJSON)
	}
}
