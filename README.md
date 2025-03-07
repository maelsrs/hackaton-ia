# ÉcoTri - Site Web sur le Tri Sélectif

Ce projet est un site web éducatif sur le tri sélectif, créé pour un hackathon sur l'environnement. Il comprend une page d'accueil informative et un quiz interactif pour tester les connaissances sur le tri des déchets.

## Fonctionnalités

- Site web responsive avec design moderne et sombre
- Animations fluides pour une expérience utilisateur améliorée
- Informations détaillées sur l'importance du tri sélectif
- Quiz interactif de 10 questions avec système de score
- Quiz configurable via un fichier JSON

## Prérequis

- Go 1.15 ou supérieur
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)

## Installation et exécution

1. Clonez ce dépôt sur votre machine locale :
   ```
   git clone https://github.com/votre-username/ecotri.git
   cd ecotri
   ```

2. Exécutez le serveur Go :
   ```
   go run main.go
   ```

3. Accédez au site web dans votre navigateur à l'adresse :
   ```
   http://localhost:8080
   ```

## Structure du projet

```
.
├── main.go                 # Fichier principal du serveur Go
├── config/
│   └── quiz.json           # Configuration des questions du quiz
├── static/
│   ├── css/
│   │   └── styles.css      # Feuilles de style CSS
│   ├── js/
│   │   ├── main.js         # JavaScript pour la page d'accueil
│   │   └── quiz.js         # JavaScript pour le quiz
│   └── images/             # Images du site (à ajouter)
└── templates/
    ├── index.html          # Template pour la page d'accueil
    └── quiz.html           # Template pour la page de quiz
```

## Personnalisation du quiz

Vous pouvez facilement modifier les questions du quiz en éditant le fichier `config/quiz.json`. Chaque question est définie avec le format suivant :

```json
{
  "question": "Texte de la question ?",
  "options": ["Option 1", "Option 2", "Option 3"],
  "answer": "Option correcte"
}
```

Assurez-vous que la valeur de `answer` correspond exactement à l'une des options de la liste `options`.

## Déploiement

Pour déployer l'application sur un serveur, vous pouvez utiliser la variable d'environnement `PORT` pour spécifier le port d'écoute du serveur :

```
PORT=80 go run main.go
```

## Améliorations possibles

- Ajouter une base de données pour stocker les scores des utilisateurs
- Créer un système d'authentification pour suivre les progrès individuels
- Ajouter plus de questions et créer différentes catégories de quiz
- Intégrer des statistiques et des graphiques sur l'impact environnemental

## Licence

Ce projet est sous licence MIT.

## Crédits

Créé avec passion pour l'environnement dans le cadre d'un hackathon. 