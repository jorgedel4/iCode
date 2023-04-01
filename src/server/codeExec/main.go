package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

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
		// TODO: Handle empty body
		if err != nil {
			fmt.Println(err)
		}

		var reqBody RequestBody
		err = json.Unmarshal(body, &reqBody)

		// TODO: Handle bad request body
		if err != nil {
			fmt.Println("Error decoding request body:", err)
			return
		}

		// Query to get problem document
		// Setting codingExercises collection
		ceCollection := client.Database(DB_NAME).Collection(CE_COLLECTION)
		// Query to get document by ID
		filter := bson.M{"id": reqBody.ID}
		// Var that stores query result
		var problem CodingExercise
		// Executing query
		err = ceCollection.FindOne(context.Background(), filter).Decode(&problem)
		if err != nil {
			log.Fatal("Error while executing query:", err)
		}

		fmt.Println("Succesfully got problem from mongodb")
		fmt.Println(problem)
	}
}

func main() {
	// mongoDB connection
	clientOptions := options.Client().ApplyURI(MONGO_URI)
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		fmt.Println("Error connecting to MongoDB:", err)
		return
	}
	fmt.Println("Connected to MongoDB!")

	// creating router and defining routing functions
	r := mux.NewRouter()
	r.HandleFunc("/exec", runCode(client)).Methods("POST")

	fmt.Println("Starting CodeExec on", PORT)
	log.Fatal(http.ListenAndServe(PORT, r))
}
