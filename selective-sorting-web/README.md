# Selective Sorting Web

This project is a web application designed to promote selective sorting, a fundamental algorithm in computer science. The application features a homepage that discusses selective sorting and its benefits, as well as a quiz page to test users' knowledge on the topic.

## Project Structure

```
selective-sorting-web
├── cmd
│   └── main.go          # Entry point of the application
├── internal
│   ├── handlers
│   │   ├── home.go     # Handler for the homepage
│   │   └── quiz.go     # Handler for the quiz page
│   └── templates
│       ├── home.html   # HTML template for the homepage
│       └── quiz.html   # HTML template for the quiz page
├── static
│   ├── css
│   │   └── styles.css   # CSS styles for the website
│   ├── js
│       └── scripts.js    # JavaScript for client-side interactivity
├── go.mod                # Module definition for the Go project
└── README.md             # Documentation for the project
```

## Features

- **Homepage**: Provides an overview of selective sorting, its benefits, and its importance in algorithm design.
- **Quiz Page**: A 10-question quiz to engage users and test their understanding of selective sorting.

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd selective-sorting-web
   ```

2. Install dependencies:
   ```
   go mod tidy
   ```

3. Run the web server:
   ```
   go run cmd/main.go
   ```

4. Open your web browser and navigate to `http://localhost:8080` to view the homepage.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.