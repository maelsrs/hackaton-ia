package main

import (
	"encoding/json"
	"html/template"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"os"
	"path/filepath"
	"time"
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

const QUIZ_SIZE = 10 // Nombre de questions à sélectionner pour le quiz

func main() {
	// Initialiser le générateur de nombres aléatoires
	rand.Seed(time.Now().UnixNano())

	// Charger les questions depuis le fichier de configuration
	allQuestions, err := loadQuestions("config/quiz.json")
	if err != nil {
		log.Printf("Erreur lors du chargement des questions: %v. Utilisation de questions par défaut.", err)
		allQuestions = getDefaultQuestions()
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
		// Sélectionner aléatoirement 10 questions
		questions := selectRandomQuestions(allQuestions, QUIZ_SIZE)

		// Encoder les questions en JSON pour JavaScript
		questionsJSON, err := json.Marshal(questions)
		if err != nil {
			log.Printf("Erreur lors de l'encodage des questions en JSON: %v", err)
			questionsJSON = []byte("[]")
		}

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

		// Récupérer les questions de la session (pour une application réelle, utilisez une session)
		// Ici, nous utilisons simplement les 10 premières questions comme une simplification
		questions := selectRandomQuestions(allQuestions, QUIZ_SIZE)

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

	// Nouvel endpoint pour obtenir de nouvelles questions
	http.HandleFunc("/api/new-questions", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
			return
		}

		// Sélectionner de nouvelles questions aléatoires
		newQuestions := selectRandomQuestions(allQuestions, QUIZ_SIZE)

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(newQuestions)
	})

	// Démarrer le serveur
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Serveur démarré sur le port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

// Sélectionne aléatoirement n questions parmi toutes les questions disponibles
func selectRandomQuestions(allQuestions []Question, n int) []Question {
	// Si nous avons moins de questions que demandé, retourner toutes les questions
	if len(allQuestions) <= n {
		return allQuestions
	}

	// Copier le slice pour ne pas modifier l'original
	questionsCopy := make([]Question, len(allQuestions))
	copy(questionsCopy, allQuestions)

	// Mélanger les questions
	rand.Shuffle(len(questionsCopy), func(i, j int) {
		questionsCopy[i], questionsCopy[j] = questionsCopy[j], questionsCopy[i]
	})

	// Retourner les n premières questions
	return questionsCopy[:n]
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
			Question: "Quel type de déchets doit-on mettre dans la poubelle jaune ?",
			Options:  []string{"Emballages plastiques et cartons", "Bouteilles en verre", "Déchets alimentaires"},
			Answer:   "Emballages plastiques et cartons",
		},
		{
			Question: "Où doit-on jeter les bouteilles en verre ?",
			Options:  []string{"Poubelle verte", "Poubelle jaune", "Poubelle grise"},
			Answer:   "Poubelle verte",
		},
		{
			Question: "Les épluchures de légumes doivent être jetées dans :",
			Options:  []string{"Le compost", "La poubelle jaune", "La poubelle grise"},
			Answer:   "Le compost",
		},
		{
			Question: "Combien d'arbres sont préservés pour chaque tonne de papier recyclé ?",
			Options:  []string{"17 arbres", "5 arbres", "30 arbres"},
			Answer:   "17 arbres",
		},
		{
			Question: "Quel pourcentage d'énergie est économisé en recyclant l'aluminium ?",
			Options:  []string{"95%", "50%", "75%"},
			Answer:   "95%",
		},
		{
			Question: "Combien d'années sont nécessaires pour qu'une bouteille en plastique se décompose ?",
			Options:  []string{"450 ans", "100 ans", "50 ans"},
			Answer:   "450 ans",
		},
		{
			Question: "Parmi ces déchets, lequel doit être déposé en déchetterie ?",
			Options:  []string{"Les piles usagées", "Les journaux", "Les boîtes de conserve"},
			Answer:   "Les piles usagées",
		},
		{
			Question: "Quelle est l'une des meilleures façons de réduire les emballages selon le site ?",
			Options:  []string{"Acheter en vrac", "Utiliser des sacs en plastique biodégradables", "Préférer les produits surgelés"},
			Answer:   "Acheter en vrac",
		},
		{
			Question: "Les mouchoirs usagés doivent être jetés dans quelle poubelle ?",
			Options:  []string{"Poubelle grise", "Poubelle jaune", "Compost"},
			Answer:   "Poubelle grise",
		},
		{
			Question: "Quelle action n'est PAS recommandée pour réduire ses déchets ?",
			Options:  []string{"Utiliser des pailles en plastique jetables", "Composter les déchets organiques", "Réparer au lieu de jeter"},
			Answer:   "Utiliser des pailles en plastique jetables",
		},
		{
			Question: "Qu'est-ce qu'on peut mettre dans le compost ?",
			Options:  []string{"Marc de café", "Plastiques biodégradables", "Viande crue"},
			Answer:   "Marc de café",
		},
		{
			Question: "Où doit-on jeter les ampoules usagées ?",
			Options:  []string{"En déchetterie", "Poubelle jaune", "Poubelle grise"},
			Answer:   "En déchetterie",
		},
		{
			Question: "Quelle est la couleur de la poubelle pour les conserves métalliques ?",
			Options:  []string{"Jaune", "Verte", "Grise"},
			Answer:   "Jaune",
		},
		{
			Question: "Les vêtements usagés doivent être déposés où ?",
			Options:  []string{"Dans un conteneur spécifique", "Poubelle grise", "Poubelle jaune"},
			Answer:   "Dans un conteneur spécifique",
		},
		{
			Question: "Le verre peut être recyclé :",
			Options:  []string{"À l'infini", "Maximum 10 fois", "Maximum 3 fois"},
			Answer:   "À l'infini",
		},
	}
}
