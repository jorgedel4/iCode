package main

import (
	"database/sql"
	"elPadrino/RIDDLE/packages/read"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {

	// Loading env variables (.env file) with GodoTenv library
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
		return
	}

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

	// Creating router and defining routing functions
	r := mux.NewRouter()

	//Read operations
	r.HandleFunc("/questions", read.Questions(mysqlDB)).Methods("GET")

	//
	log.Println("Starting RIDDLE on", os.Getenv("PORT"))
	err = http.ListenAndServe(os.Getenv("PORT"), r)
	if err != nil {
		log.Fatal(err)
		return
	}
}