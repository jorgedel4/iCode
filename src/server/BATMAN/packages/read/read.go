package read

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"go.mongodb.org/mongo-driver/mongo"
)

type CourseRBody struct {
	ID string `json:"id"`
	Term string `json:"term"`
}

func Courses(mongoDB *mongo.Client, mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var accountTypes = make(map[byte]string)
		accountTypes['L'] = "professor"
		accountTypes['A'] = "student"

		// Reading request's body (returns a slice of bytes, not usable yet)
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		var rBody CourseRBody
		if err := json.Unmarshal(body, rBody); err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		accountType := accountTypes[rBody.ID[0]]

		var query string
		switch accountType {
		case "professor":
			{
				query = fmt.Sprintf("SELECT * FROM grupos NATURAL JOIN courses WHERE main_professor = 'L01922235' AND term = 'FJ23'")
			}
		case "student":
			{
				query = fmt.Sprintf("")
			}
		}
	}
}
