package packages

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type CodingExercise struct {
	ID              string       `json:"id" bson:"id"`
	Description     string       `json:"description" bson:"description"`
	Language        string       `json:"language" bson:"language"`
	Inputs          [][][]string `json:"inputs" bson:"inputs"`
	Outputs         [][][]string `json:"outputs" bson:"outputs"`
	DriverFunc      string       `json:"driverFunction" bson:"driverFunction"`
	NotAllowedFuncs []string     `json:"notAllowedFunctions" bson:"notAllowedFunctions"`
}

type RequestBody struct {
	ID   string `json:"id"`
	Code string `json:"code"`
}

type CodeResult struct {
}

// Utility function to check if a slice contains a value
func contains(sl []string, s string) bool {
	for _, v := range sl {
		if v == s {
			return true
		}
	}
	return false
}

// Function that takes code and a slice of disallowed functions
// Returns a slice of strings containing all the disallowed functions that were found (non-repeating, first found first added to the slice)
func disallowedFuncs(pythonCode string, notAllowedFuncs []string) []string {
	disallowedFuncsFound := []string{}
	for _, function := range notAllowedFuncs {
		if strings.Contains(pythonCode, function) {
			if !contains(disallowedFuncsFound, function) {
				disallowedFuncsFound = append(disallowedFuncsFound, function)
			}
		}
	}
	return disallowedFuncsFound
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

		disallowedFuncs := disallowedFuncs(reqBody.Code, problem.NotAllowedFuncs)
		if len(disallowedFuncs) != 0 {
			http.Error(w,
				fmt.Sprintf("Found disallowed functions in code (%s)", strings.Join(disallowedFuncs, ", ")),
				http.StatusForbidden)
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
