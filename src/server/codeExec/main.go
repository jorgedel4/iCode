package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
	"github.com/jorgedel4/iCode/packages/packages"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

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
	r.HandleFunc("/exec", packages.RunCode(client)).Methods("POST")

	fmt.Println("Starting CodeExec on", os.Getenv("PORT"))
	log.Fatal(http.ListenAndServe(os.Getenv("PORT"), r))
}
