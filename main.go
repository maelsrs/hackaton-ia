package main

import (
	"encoding/base64"
	"encoding/json"
	"html/template"
	"log"
	"net/http"
	"strconv"
	"strings"
)

type QuizQuestion struct {
	ID       int
	Question string
	Options  []string
	Answer   int
}

type QuizData struct {
	Questions []QuizQuestion
}

type QuizResults struct {
	Score    int
	Message  string
	Feedback []string
}

// Template functions
var funcMap = template.FuncMap{
	"add": func(a, b int) int {
		return a + b
	},
	"contains": func(s, substr string) bool {
		return strings.Contains(s, substr)
	},
	"hasPrefix": func(s, prefix string) bool {
		return strings.HasPrefix(s, prefix)
	},
}

var quizData = QuizData{
	Questions: []QuizQuestion{
		{
			ID:       1,
			Question: "What type of waste goes in the green bin?",
			Options:  []string{"Plastic", "Organic waste", "Glass", "Paper"},
			Answer:   1,
		},
		{
			ID:       2,
			Question: "Which of these items should NOT go in the recycling bin?",
			Options:  []string{"Clean paper", "Plastic bottles", "Food waste", "Aluminum cans"},
			Answer:   2,
		},
		{
			ID:       3,
			Question: "What color is typically used for glass recycling bins?",
			Options:  []string{"Green", "Blue", "Yellow", "Brown"},
			Answer:   3,
		},
		{
			ID:       4,
			Question: "Which of these is recyclable?",
			Options:  []string{"Pizza boxes with grease", "Plastic bags", "Batteries", "None of the above"},
			Answer:   3,
		},
		{
			ID:       5,
			Question: "What should you do with empty aerosol cans?",
			Options:  []string{"Throw in regular trash", "Recycle with metal", "Bury in garden", "Throw in ocean"},
			Answer:   1,
		},
	},
}

func main() {
	// Serve static files
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	// Routes
	http.HandleFunc("/", handleHome)
	http.HandleFunc("/quiz", handleQuiz)
	http.HandleFunc("/submit-quiz", handleQuizSubmit)
	http.HandleFunc("/quiz-results", handleQuizResults)

	log.Println("Server starting on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func handleHome(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.New("home.html").Funcs(funcMap).ParseFiles("templates/home.html"))
	tmpl.Execute(w, nil)
}

func handleQuiz(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.New("quiz.html").Funcs(funcMap).ParseFiles("templates/quiz.html"))
	tmpl.Execute(w, quizData)
}

func handleQuizSubmit(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Redirect(w, r, "/quiz", http.StatusSeeOther)
		return
	}

	score := 0
	feedback := []string{}

	// Check answers
	for _, question := range quizData.Questions {
		answerStr := r.FormValue("q" + strconv.Itoa(question.ID))
		answer, err := strconv.Atoi(answerStr)
		if err != nil {
			continue
		}

		if answer == question.Answer {
			score += 20
			feedback = append(feedback, "Correct: "+question.Question)
		} else {
			correctAnswer := question.Options[question.Answer]
			feedback = append(feedback, "Incorrect: "+question.Question+" (Correct answer: "+correctAnswer+")")
		}
	}

	// Create results
	results := QuizResults{
		Score:    score,
		Message:  getScoreMessage(score),
		Feedback: feedback,
	}

	// Store results in a cookie
	resultsJSON, err := json.Marshal(results)
	if err != nil {
		log.Printf("Error marshaling results: %v", err)
		http.Redirect(w, r, "/quiz", http.StatusSeeOther)
		return
	}

	// Use URL-safe base64 encoding
	encodedValue := base64.URLEncoding.EncodeToString(resultsJSON)
	cookie := &http.Cookie{
		Name:     "quiz_results",
		Value:    encodedValue,
		Path:     "/",
		MaxAge:   3600,
		HttpOnly: true,
	}
	http.SetCookie(w, cookie)

	http.Redirect(w, r, "/quiz-results", http.StatusSeeOther)
}

func handleQuizResults(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("quiz_results")
	if err != nil {
		http.Redirect(w, r, "/quiz", http.StatusSeeOther)
		return
	}

	// Decode the URL-safe base64 value
	decodedValue, err := base64.URLEncoding.DecodeString(cookie.Value)
	if err != nil {
		log.Printf("Error decoding cookie value: %v", err)
		http.Redirect(w, r, "/quiz", http.StatusSeeOther)
		return
	}

	var results QuizResults
	if err := json.Unmarshal(decodedValue, &results); err != nil {
		log.Printf("Error unmarshaling results: %v", err)
		http.Redirect(w, r, "/quiz", http.StatusSeeOther)
		return
	}

	tmpl := template.Must(template.New("quiz-results.html").Funcs(funcMap).ParseFiles("templates/quiz-results.html"))
	tmpl.Execute(w, results)
}

func getScoreMessage(score int) string {
	switch {
	case score >= 80:
		return "Excellent! You're a recycling expert! 🌟"
	case score >= 60:
		return "Good job! You have a solid understanding of recycling! 🌱"
	case score >= 40:
		return "Not bad! Keep learning about recycling! 🌍"
	default:
		return "Keep learning! Every day is a chance to improve your recycling knowledge! ♻️"
	}
}
