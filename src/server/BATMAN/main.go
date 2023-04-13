package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/jorgedel4/iCode/packages/create"
	"github.com/jorgedel4/iCode/packages/read"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// Loading env variables (.env file)
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
		return
	}

	// MongoDB connection
	clientOptions := options.Client().ApplyURI(os.Getenv("MONGO_URI"))
	// Throw timeout error after 10 seconds
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	mongoDB, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal("Error connecting to MongoDB:", err)
		return
	}
	// Function will be called after program is exited in order to safely disconnect from DB
	defer func() {
		if err = mongoDB.Disconnect(ctx); err != nil {
			log.Fatal("Error disconnecting from MongoDB:", err)
		}
	}()
	log.Println("Connected to MongoDB")

	// MySQL connection
	mysqlDB, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", os.Getenv("MYSQL_USER"), os.Getenv("MYSQL_PASSWORD"), os.Getenv("MYSQL_IP"), os.Getenv("MYSQL_PORT"), os.Getenv("MYSQL_DBNAME")))
	if err != nil {
		log.Fatal("Error connecting to MySQL:", err)
	}
	defer func() {
		if err = mysqlDB.Close(); err != nil {
			log.Fatal("Error disconnecting from MySQL:", err)
		}
	}()
	log.Println("Connected to MySQL")

	// Creating router and defining routing functions
	r := mux.NewRouter()
	// Create operations
	r.HandleFunc("/register/{category}", create.Handler(mongoDB, mysqlDB)).Methods("POST")
	// Read operations
	r.HandleFunc("/groups", read.Groups(mongoDB, mysqlDB)).Methods("GET")

	log.Println("Starting BATMAN on", os.Getenv("PORT"))
	err = http.ListenAndServe(os.Getenv("PORT"), r)
	if err != nil {
		log.Fatal(err)
		return
	}
}
