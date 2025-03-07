package handlers

import (
    "net/http"
    "html/template"
)

func HomeHandler(w http.ResponseWriter, r *http.Request) {
    tmpl, err := template.ParseFiles("internal/templates/home.html")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    tmpl.Execute(w, nil)
}