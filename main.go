package main

import (
	"encoding/json"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

type Question struct {
	Question string   `json:"question"`
	Options  []string `json:"options"`
	Answer   string   `json:"answer"`
}

type PageData struct {
	Title         string
	Questions     []Question
	QuestionsJSON template.JS
}

func main() {
	// Charger les questions depuis le fichier de configuration
	questions, err := loadQuestions("config/quiz.json")
	if err != nil {
		log.Printf("Erreur lors du chargement des questions: %v. Utilisation de questions par défaut.", err)
		questions = getDefaultQuestions()
	}

	// Encoder les questions en JSON pour JavaScript
	questionsJSON, err := json.Marshal(questions)
	if err != nil {
		log.Printf("Erreur lors de l'encodage des questions en JSON: %v", err)
		questionsJSON = []byte("[]")
	}

	// Configurer les templates
	tmpl := template.Must(template.ParseGlob("templates/*.html"))

	// Servir les fichiers statiques
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	// Page d'accueil
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		data := PageData{
			Title: "ÉcoTri - Pour un avenir plus vert",
		}
		tmpl.ExecuteTemplate(w, "index.html", data)
	})

	// Page de quiz
	http.HandleFunc("/quiz", func(w http.ResponseWriter, r *http.Request) {
		data := PageData{
			Title:         "Quiz sur le Tri Sélectif",
			Questions:     questions,
			QuestionsJSON: template.JS(questionsJSON),
		}
		tmpl.ExecuteTemplate(w, "quiz.html", data)
	})

	// API pour vérifier les réponses
	http.HandleFunc("/api/check-answers", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
			return
		}

		var answers map[string]string
		err := json.NewDecoder(r.Body).Decode(&answers)
		if err != nil {
			http.Error(w, "Format de requête invalide", http.StatusBadRequest)
			return
		}

		score := 0
		for i, q := range questions {
			qID := string(rune('q' + i))
			if userAnswer, ok := answers[qID]; ok && userAnswer == q.Answer {
				score++
			}
		}

		result := map[string]interface{}{
			"score":      score,
			"total":      len(questions),
			"percentage": float64(score) / float64(len(questions)) * 100,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(result)
	})

	// Démarrer le serveur
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Serveur démarré sur le port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func loadQuestions(filePath string) ([]Question, error) {
	// S'assurer que le répertoire existe
	dir := filepath.Dir(filePath)
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		os.MkdirAll(dir, 0755)
	}

	// Vérifier si le fichier existe
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		// Créer le fichier avec des questions par défaut
		defaultQuestions := getDefaultQuestions()
		data, err := json.MarshalIndent(defaultQuestions, "", "  ")
		if err != nil {
			return nil, err
		}
		err = ioutil.WriteFile(filePath, data, 0644)
		if err != nil {
			return nil, err
		}
		return defaultQuestions, nil
	}

	// Lire le fichier existant
	data, err := ioutil.ReadFile(filePath)
	if err != nil {
		return nil, err
	}

	var questions []Question
	err = json.Unmarshal(data, &questions)
	return questions, err
}

func getDefaultQuestions() []Question {
	return []Question{
		{
			Question: "Dans quelle poubelle doit-on jeter les bouteilles en plastique ?",
			Options:  []string{"Poubelle Jaune", "Poubelle Verte", "Poubelle Grise"},
			Answer:   "Poubelle Jaune",
		},
		{
			Question: "Où doit-on jeter les restes de nourriture ?",
			Options:  []string{"Compost", "Poubelle Jaune", "Poubelle Verte"},
			Answer:   "Compost",
		},
		{
			Question: "Les journaux doivent être jetés dans quelle poubelle ?",
			Options:  []string{"Poubelle Bleue", "Poubelle Jaune", "Poubelle Verte"},
			Answer:   "Poubelle Jaune",
		},
		{
			Question: "Où doit-on jeter les canettes en aluminium ?",
			Options:  []string{"Poubelle Jaune", "Poubelle Verte", "Poubelle Grise"},
			Answer:   "Poubelle Jaune",
		},
		{
			Question: "Les ampoules usagées doivent être jetées où ?",
			Options:  []string{"Déchetterie", "Poubelle Jaune", "Poubelle Verte"},
			Answer:   "Déchetterie",
		},
		{
			Question: "Où doit-on jeter les cartons d'emballage ?",
			Options:  []string{"Poubelle Jaune", "Poubelle Verte", "Poubelle Grise"},
			Answer:   "Poubelle Jaune",
		},
		{
			Question: "Les piles usagées doivent être déposées où ?",
			Options:  []string{"Déchetterie", "Poubelle Jaune", "Poubelle Verte"},
			Answer:   "Déchetterie",
		},
		{
			Question: "Où doit-on jeter les vêtements usagés ?",
			Options:  []string{"Conteneur à vêtements", "Poubelle Jaune", "Poubelle Verte"},
			Answer:   "Conteneur à vêtements",
		},
		{
			Question: "Les bouteilles en verre doivent être jetées dans quelle poubelle ?",
			Options:  []string{"Poubelle Verte", "Poubelle Jaune", "Poubelle Grise"},
			Answer:   "Poubelle Verte",
		},
		{
			Question: "Où doit-on jeter les sacs en plastique ?",
			Options:  []string{"Poubelle Jaune", "Poubelle Verte", "Poubelle Grise"},
			Answer:   "Poubelle Jaune",
		},
	}
}
