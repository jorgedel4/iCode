package read

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"regexp"
	"strings"

	"io"
	"net/http"

	"time"
)

type HWReq struct {
	ID      string `json:"id"`
	Time    string `json:"time"`     // should support: week (hw for the next 7 days), all (past and future), future (u know what this does)
	Group   string `json:"group"`    // should support: all (al enrolled groups) and the ID of the group
	GroupBy string `json:"group_by"` // group or day (7)
}

type HWStudent struct {
	HW_ID      string    `json:"hw_id"`
	HW_Name    string    `json:"hw_name"`
	CourseID   string    `json:"course_id"`
	CourseName string    `json:"course_name"`
	GroupID    string    `json:"group_id"`
	Opening    time.Time `json:"opening"`
	Closing    time.Time `json:"closing"`
	Needed     int       `json:"needed"`
	Done       int       `json:"done"`
}

type HWProfessor struct {
	HW_ID      string    `json:"hw_id"`
	HW_Name    string    `json:"hw_name"`
	CourseID   string    `json:"course_id"`
	CourseName string    `json:"course_name"`
	GroupID    string    `json:"group_id"`
	Opening    time.Time `json:"opening"`
	Closing    time.Time `json:"closing"`
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

		var baseQuery string
		var selectors []string

		if accountType == "professor" {
			baseQuery = `SELECT hw.id_homework, hw.hw_name, g.course, c.course_name, hw.grupo, hw.open_date, hw.close_date
			FROM homework hw
			JOIN grupos g ON hw.grupo = g.id_group
			JOIN courses c ON g.course = c.id_course`

			selectors = append(selectors, fmt.Sprintf("g.main_professor = '%s'", hwReq.ID))
		} else if accountType == "student" {
			baseQuery = `SELECT hw.id_homework, hw.hw_name, g.course, c.course_name, hw.grupo, hw.open_date, hw.close_date, hw.n_questions, successful_hw_attempts(e.student, hw.id_homework) AS successful_attempts
			FROM homework hw
			JOIN grupos g ON hw.grupo = g.id_group
			JOIN courses c ON g.course = c.id_course
			JOIN enrollments e ON hw.grupo = e.grupo`

			selectors = append(selectors, fmt.Sprintf("e.student = '%s'", hwReq.ID))
		}
		
		if hwReq.Time == "week" {
			selectors = append(selectors, "hw.close_date BETWEEN CURRENT_TIMESTAMP AND DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 DAY)")
		} else if hwReq.Time == "future" {
			selectors = append(selectors, "hw.close_date > CURRENT_TIMESTAMP")
		}

		regex := regexp.MustCompile(`G\d{8}`)
		if regex.MatchString(hwReq.Group) {
			selectors = append(selectors, fmt.Sprintf("hw.grupo = '%s'", hwReq.Group))
		}

		query := fmt.Sprintf("%s WHERE %s", baseQuery, strings.Join(selectors, " AND "))

		// Execute the query and get the result set
		rows, err := mysqlDB.Query(query)
		if err != nil {
			http.Error(w, "Error executing query", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		if accountType == "student" {
			var results []HWStudent
			for rows.Next() {
				var result HWStudent
				if err := rows.Scan(&result.HW_ID, &result.HW_Name, &result.CourseID, &result.CourseName, &result.GroupID, &result.Opening, &result.Closing, &result.Needed, &result.Done); err != nil {
					http.Error(w, "Error reading results", http.StatusInternalServerError)
					return
				}
				results = append(results, result)
			}

			resultArray := make([][]HWStudent, 7)
			if hwReq.GroupBy == "day" {
				for _, result := range results {
					now := time.Now().Truncate(24 * time.Hour)
					result.Closing = result.Closing.Truncate(24 * time.Hour)
					diff := int(result.Closing.Sub(now).Hours() / 24)

					var ind int

					if diff < 0 {
						ind = 0
					} else {
						ind = diff
					}

					resultArray[ind] = append(resultArray[ind], result)
				}
			}

			hwJSON, err := json.Marshal(resultArray)
			if err != nil {
				http.Error(w, "Error parsing response", http.StatusInternalServerError)
			}
			w.Header().Set("Content-Type", "application/json")
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.WriteHeader(http.StatusOK)
			w.Write(hwJSON)
			w.(http.Flusher).Flush()
			w.(http.CloseNotifier).CloseNotify()
		} else if accountType == "professor" {
			var results []HWProfessor
			for rows.Next() {
				var result HWProfessor
				if err := rows.Scan(&result.HW_ID, &result.HW_Name, &result.CourseID, &result.CourseName, &result.GroupID, &result.Opening, &result.Closing); err != nil {
					http.Error(w, "Error reading results", http.StatusInternalServerError)
					return
				}
				results = append(results, result)
			}

			resultMap := make(map[string]HWProfessor)
			if hwReq.GroupBy == "group" {
				for _, result := range results {
					resultMap[result.GroupID] = result
				}
			}

			hwJSON, err := json.Marshal(resultMap)
			if err != nil {
				http.Error(w, "Error parsing response", http.StatusInternalServerError)
			}
			w.Header().Set("Content-Type", "application/json")
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.WriteHeader(http.StatusOK)
			w.Write(hwJSON)
			w.(http.Flusher).Flush()
			w.(http.CloseNotifier).CloseNotify()
		}
	}
}
