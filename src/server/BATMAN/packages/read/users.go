package read

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/jorgedel4/iCode/packages/structs"
)

func Users(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Setting up headers for CORS (not needed after full deployment)
		w.Header().Set("Access-Control-Allow-Origin", "*")

		var req structs.UsersReq
		req.UserType = r.URL.Query().Get("user_type")
		req.Campus = r.URL.Query().Get("campus")
		req.ID = r.URL.Query().Get("id")
		req.Name = r.URL.Query().Get("name")

		baseQuery := fmt.Sprintf("SELECT * FROM %ss", req.UserType)
		var selectors []string
		var values []interface{}

		if req.Campus != "all" {
			selectors = append(selectors, "campus = ?")
			values = append(values, req.Campus)
		}

		id_columns := make(map[string]string)
		id_columns["admin"] = "id_admin"
		id_columns["professor"] = "nomina"
		id_columns["student"] = "matricula"

		if req.ID != "all" {
			selectors = append(selectors, fmt.Sprintf("%s = ?", id_columns[req.UserType]))
			values = append(values, req.ID)
		}

		if req.Name != "all" {
			selectors = append(selectors, "CONCAT(first_name, ' ', flast_name, ' ', slast_name) = ?")
			values = append(values, req.Name)
		}

		var query string
		if len(selectors) > 0 {
			query = fmt.Sprintf("%s WHERE %s", baseQuery, strings.Join(selectors, " AND "))
		} else {
			query = baseQuery
		}

		rows, err := mysqlDB.Query(query, values...)
		if err != nil {
			http.Error(w, "Error executing query", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var users []structs.User
		for rows.Next() {
			var user structs.User
			var first_name, flast_name, slast_name string
			if err := rows.Scan(&user.ID, &user.Campus, &first_name, &flast_name, &slast_name); err != nil {
				http.Error(w, "Error reading results", http.StatusInternalServerError)
				return
			}
			user.Name = fmt.Sprintf("%s %s %s", first_name, flast_name, slast_name)
			user.Email = fmt.Sprintf("%s@tec.mx", user.ID)
			users = append(users, user)
		}

		usersJSON, err := json.Marshal(users)
		if err != nil {
			http.Error(w, "Error parsing response", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(usersJSON)
		w.(http.Flusher).Flush()
		w.(http.CloseNotifier).CloseNotify()
	}
}
