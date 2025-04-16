package main

import (
	"log"
	"net/http"
	"server/handlers"
	"server/middleware"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)


func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	r := mux.NewRouter()

	r.Use(middleware.CORS)

	r.HandleFunc("/upload", handlers.UploadHandler).Methods("POST", "OPTIONS")
r.HandleFunc("/chat", handlers.ChatHandler).Methods("POST", "OPTIONS")


	log.Println("Server started on :8080")

	err = http.ListenAndServe(":8080", r)
	if err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
