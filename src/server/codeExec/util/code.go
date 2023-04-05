package util

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/jorgedel4/iCode/structs"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func RunCode(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Reading request's body (returns a slice of bytes, not usable yet)
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		// Parsing request body into a struct (unmarshaling)
		var reqBody structs.RequestBody
		err = json.Unmarshal(body, &reqBody)
		if err != nil {
			http.Error(w, "Error decoding request body", http.StatusBadRequest)
			return
		}

		// Query to get problem document
		ceCollection := client.Database(os.Getenv("DB_NAME")).Collection(os.Getenv("CE_COLLECTION"))
		filter := bson.M{"id": reqBody.ID}
		var problem structs.CodingExercise
		err = ceCollection.FindOne(context.Background(), filter).Decode(&problem)
		if err != nil {
			http.Error(w, "Error executing query", http.StatusInternalServerError)
			return
		}

		// Check if the given code contains forbidden functions
		disallowedFuncs := disallowedFuncs(reqBody.Code, problem.ForbiddenFunctions)
		if len(disallowedFuncs) != 0 {
			http.Error(w,
				fmt.Sprintf("Found disallowed functions in code (%s)", strings.Join(disallowedFuncs, ", ")),
				http.StatusForbidden)
			return
		}

		// Inject test cases
		code, err := injectTests(reqBody.Code, problem)
		if err != nil {
			http.Error(w, "Error creating tests", http.StatusInternalServerError)
			return
		}

		// Run code
		result, err := execute(code, problem.Language)
		if err != nil {
			http.Error(w, "Error executing code", http.StatusInternalServerError)
			return
		}

		lines := strings.Split(result, "\n")
		lines = lines[:len(lines) - 1]
		for _, line := range lines {
			fmt.Println(line)
		}

		// Parse result
		// var codeResult structs.CodeResult
		// err = parseIntoCodeResult(result, problem.Language)

		// Turn object into a json and return it
	}
}
