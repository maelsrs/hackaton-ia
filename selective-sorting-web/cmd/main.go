package main

import (
    "net/http"
    "github.com/gorilla/mux"
    "selective-sorting-web/internal/handlers"
)

func main() {
    r := mux.NewRouter()
    r.HandleFunc("/", handlers.HomeHandler).Methods("GET")
    r.HandleFunc("/quiz", handlers.QuizHandler).Methods("GET")

    http.Handle("/", r)
    http.ListenAndServe(":8080", nil)
}