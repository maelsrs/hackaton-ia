# EcoSort - Environmental Education Quiz

A modern web application built with Go that helps users learn about selective sorting and environmental awareness through an interactive quiz.

## Features

- Modern, responsive dark theme UI
- Interactive quiz with multiple-choice questions
- Immediate feedback on quiz results
- Educational content about selective sorting
- Mobile-friendly design

## Prerequisites

- Go 1.16 or higher
- A modern web browser

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ecosort
```

2. Run the application:
```bash
go run main.go
```

3. Open your web browser and navigate to:
```
http://localhost:8080
```

## Project Structure

```
ecosort/
├── main.go              # Main server file
├── templates/           # HTML templates
│   ├── home.html       # Home page
│   ├── quiz.html       # Quiz page
│   └── quiz-results.html # Results page
└── static/             # Static assets
    ├── css/           # CSS files
    ├── js/            # JavaScript files
    └── images/        # Image assets
```

## Customization

### Adding Questions
To add or modify quiz questions, edit the `handleQuiz` function in `main.go`. The questions are stored in the `QuizData` struct.

### Styling
The application uses Tailwind CSS for styling. You can modify the styles in:
- `static/css/style.css` for custom CSS
- HTML templates for layout changes

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 