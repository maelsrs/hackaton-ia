document.addEventListener('DOMContentLoaded', function() {
    // Éléments du quiz
    const quizIntro = document.getElementById('quiz-intro');
    const quizContent = document.getElementById('quiz-content');
    const quizResults = document.getElementById('quiz-results');
    const startBtn = document.getElementById('start-quiz');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const restartBtn = document.getElementById('restart-btn');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const questions = document.querySelectorAll('.question');
    
    let currentQuestionIndex = 0;
    const totalQuestions = questions.length;
    let userAnswers = {};
    
    // Ajouter des classes active pour l'animation
    function showQuestion(index) {
        // Cacher toutes les questions
        questions.forEach(q => q.classList.remove('active'));
        
        // Afficher la question actuelle
        questions[index].classList.add('active');
        
        // Mettre à jour la barre de progression
        const progress = ((index + 1) / totalQuestions) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `Question ${index + 1}/${totalQuestions}`;
        
        // Mettre à jour les boutons de navigation
        prevBtn.disabled = index === 0;
        
        if (index === totalQuestions - 1) {
            nextBtn.textContent = 'Terminer';
        } else {
            nextBtn.textContent = 'Suivant';
        }
    }
    
    // Démarrer le quiz
    startBtn.addEventListener('click', function() {
        quizIntro.classList.remove('active');
        quizContent.classList.add('active');
        showQuestion(0);
    });
    
    // Navigation précédent
    prevBtn.addEventListener('click', function() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion(currentQuestionIndex);
        }
    });
    
    // Navigation suivant ou terminer
    nextBtn.addEventListener('click', function() {
        // Sauvegarder la réponse actuelle
        const questionId = `q${currentQuestionIndex}`;
        const selectedOption = document.querySelector(`input[name="${questionId}"]:checked`);
        
        if (selectedOption) {
            userAnswers[questionId] = selectedOption.value;
        }
        
        if (currentQuestionIndex < totalQuestions - 1) {
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        } else {
            // Terminer le quiz
            showResults();
        }
    });
    
    // Redémarrer le quiz
    restartBtn.addEventListener('click', function() {
        userAnswers = {};
        currentQuestionIndex = 0;
        
        // Décocher toutes les options
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.checked = false;
        });
        
        quizResults.classList.remove('active');
        quizContent.classList.add('active');
        showQuestion(0);
    });
    
    // Afficher les résultats
    function showResults() {
        quizContent.classList.remove('active');
        quizResults.classList.add('active');
        
        let score = 0;
        
        // Calculer le score
        for (let i = 0; i < totalQuestions; i++) {
            const questionId = `q${i}`;
            const userAnswer = userAnswers[questionId];
            const correctAnswer = quizData.questions[i].answer;
            
            if (userAnswer === correctAnswer) {
                score++;
            }
        }
        
        // Mettre à jour l'affichage du score
        const percentage = Math.round((score / totalQuestions) * 100);
        document.getElementById('score-value').textContent = score;
        document.getElementById('score-text').textContent = `${percentage}%`;
        
        // Animer le cercle de score
        const scoreCircle = document.getElementById('score-circle');
        scoreCircle.setAttribute('stroke-dasharray', `${percentage}, 100`);
        
        // Afficher un message en fonction du score
        const scoreMessage = document.getElementById('score-message');
        if (percentage >= 80) {
            scoreMessage.textContent = 'Excellent ! Vous êtes un champion du tri sélectif !';
        } else if (percentage >= 60) {
            scoreMessage.textContent = 'Bien joué ! Vous connaissez bien les bases du tri sélectif.';
        } else if (percentage >= 40) {
            scoreMessage.textContent = 'Pas mal, mais il y a encore place à l\'amélioration.';
        } else {
            scoreMessage.textContent = 'Il est temps d\'apprendre davantage sur le tri sélectif !';
        }
    }

    // Vérifier s'il y a des questions dans le template
    if(questions.length > 0) {
        // Activer la première question par défaut lorsque le quiz commence
        questions[0].classList.add('active');
    }
});
 