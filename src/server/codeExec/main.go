package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// TODO
// (For python only)
// Function to purge code
// Function to inject test cases
// Function to run code (posibly in docker container)
// Function to parse result
// Check result for response status code
// Return info to client
// Move code into packages
// Test functions

// Not important
// maybe change python code funcs to modify params instead of returning another variable

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

func cleanPython(pythonCode string, notAllowedFuncs []string) string{
	lines := strings.Split(pythonCode, "\n")
	var filteredLines []string
	for _, line := range lines {
		isDisallowed := false
		for _, funcName := range notAllowedFuncs {
			if strings.Contains(line, funcName) {
				isDisallowed = true
				break
			}
		}
		if !isDisallowed {
			filteredLines = append(filteredLines, line)
		}
	}
	return strings.Join(filteredLines, "\n")
}

func injectTestsPython(pythonCode string, notAllowedFuncs []string) string{
	
}

// TODO
// Implement functionality
// Pipeline:
// 1. Clean code
// 2. Inject tests to code
// 3. Run code in container
// 4. Parse execution result

func runPython(problem CodingExercise, reqBody RequestBody) (CodeResult, error) {
	// Cleaning code
	reqBody.Code = cleanPython(reqBody.Code, problem.NotAllowedFuncs)
	// Injecting test cases
	reqBody.Code = injectTestsPython(reqBody.Code, problem.NotAllowedFuncs)

	var cr CodeResult
	return cr, nil


}

func runCode(client *mongo.Client) http.HandlerFunc {
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

func main() {
	// MongoDB connection
	clientOptions := options.Client().ApplyURI(os.Getenv("MONGO_URI"))
	// Throw timeout error after 10 seconds
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		fmt.Println(os.Getenv("MONGO_URI"))
		log.Fatal("Error connecting to MongoDB:", err)
	}
	// Function will be called after program is exited in order to safely disconnect from DB
	defer func() {
		if err = client.Disconnect(ctx); err != nil {
			log.Fatal("Error disconnecting from MongoDB:", err)
		}
	}()
	fmt.Println("Connected to MongoDB!")

	// Creating router and defining routing functions
	r := mux.NewRouter()
	r.HandleFunc("/exec", runCode(client)).Methods("POST")

	fmt.Println("Starting CodeExec on", os.Getenv("PORT"))
	log.Fatal(http.ListenAndServe(os.Getenv("PORT"), r))
}
