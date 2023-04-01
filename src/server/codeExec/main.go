package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// TODO
// Connect to DB to get codingExercise by ID
// Turn result into a go struct
// (For python only)
// Function to purge code
// Function to inject test cases
// Function to run code (posibly in docker container)
// Function to parse result
// Check result for response status code
// Return info to client
// Move code into packages

// IMPORTANT
// Move this to .env before pushing to prod
const PORT string = ":8001"
const MONGO_URI = "mongodb+srv://jdel4:uwu1234.@icode.zoaqta4.mongodb.net/?retryWrites=true&w=majority"
const DB_NAME = "iCode"
const CE_COLLECTION = "CodingExercises"

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

func runCode(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Parsing request body into a struct
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		var reqBody RequestBody
		err = json.Unmarshal(body, &reqBody)
		if err != nil {
			http.Error(w, "Error decoding request body", http.StatusBadRequest)
			return
		}

		// Query to get problem document
		ceCollection := client.Database(DB_NAME).Collection(CE_COLLECTION)
		filter := bson.M{"id": reqBody.ID}
		var problem CodingExercise
		err = ceCollection.FindOne(context.Background(), filter).Decode(&problem)
		if err != nil {
			http.Error(w, "Error executing query", http.StatusInternalServerError)
			return
		}

		// TODO: Implement the remaining functionality
		fmt.Println("Successfully got problem from MongoDB")
		fmt.Println(problem)
	}
}

func main() {
	// MongoDB connection
	clientOptions := options.Client().ApplyURI(MONGO_URI)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal("Error connecting to MongoDB:", err)
	}
	defer func() {
		if err = client.Disconnect(ctx); err != nil {
			log.Fatal("Error disconnecting from MongoDB:", err)
		}
	}()
	fmt.Println("Connected to MongoDB!")

	// Creating router and defining routing functions
	r := mux.NewRouter()
	r.HandleFunc("/exec", runCode(client)).Methods("POST")

	fmt.Println("Starting CodeExec on", PORT)
	log.Fatal(http.ListenAndServe(PORT, r))
}
