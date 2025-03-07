package handlers

import (
    "net/http"
    "html/template"
)

func QuizHandler(w http.ResponseWriter, r *http.Request) {
    tmpl, err := template.ParseFiles("internal/templates/quiz.html")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    err = tmpl.Execute(w, nil)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
    }
}