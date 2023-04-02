package packages

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"os"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type CodingExercise struct {
	ID              string       `json:"id"`
	Description     string       `json:"description"`
	Language        string       `json:"language"`
	Inputs          [][][]string `json:"inputs"`
	Outputs         [][][]string `json:"outputs"`
	DriverFunc      string       `json:"driverFunction"`
	NotAllowedFuncs []string     `json:"notAllowedFunctions"`
}

type RequestBody struct {
	ID   string `json:"id"`
	Code string `json:"code"`
}

type CodeResult struct {
}


func RunCode(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Reading request's body (returns a slice of bytes, not usable yet)
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		// Parsing request body into a struct (unmarshaling)
		var reqBody RequestBody
		err = json.Unmarshal(body, &reqBody)
		if err != nil {
			http.Error(w, "Error decoding request body", http.StatusBadRequest)
			return
		}

		// Query to get problem document
		ceCollection := client.Database(os.Getenv("DB_NAME")).Collection(os.Getenv("CE_COLLECTION"))
		filter := bson.M{"id": reqBody.ID}
		var problem CodingExercise
		err = ceCollection.FindOne(context.Background(), filter).Decode(&problem)
		if err != nil {
			http.Error(w, "Error executing query", http.StatusInternalServerError)
			return
		}

		var _ CodeResult

		switch problem.Language {
		case "Python":
			_, err = runPython(problem, reqBody)
		}

		if err != nil {
			http.Error(w, "Error executing code ", http.StatusInternalServerError)
			return
		}
	}
}
