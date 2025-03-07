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
    let animating = false;
    
    // S'assurer qu'aucune option n'est sélectionnée au démarrage
    function clearAllSelections() {
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.checked = false;
        });
    }
    
    // S'assurer que toutes les questions sont cachées au départ
    function resetQuestions() {
        questions.forEach(q => {
            q.classList.remove('active');
            q.style.animation = '';
        });
    }
    
    // Initialisation
    resetQuestions();
    clearAllSelections();
    
    // Fonction pour afficher une question avec animation
    function showQuestion(index) {
        if (animating) return;
        animating = true;
        
        // Cacher la question actuelle
        resetQuestions();
        
        // Afficher la nouvelle question
        if (questions[index]) {
            questions[index].classList.add('active');
            currentQuestionIndex = index;
            
            // Vérifier si l'utilisateur a déjà répondu à cette question et mettre à jour l'interface
            const questionId = `q${index}`;
            const userAnswer = userAnswers[questionId];
            const radioInputs = document.querySelectorAll(`input[name="${questionId}"]`);
            
            // D'abord, désélectionner toutes les options
            radioInputs.forEach(input => {
                input.checked = false;
            });
            
            // Ensuite, sélectionner la réponse de l'utilisateur s'il y en a une
            if (userAnswer) {
                radioInputs.forEach(input => {
                    if (input.value === userAnswer) {
                        input.checked = true;
                    }
                });
            }
            
            // Mettre à jour la barre de progression
            updateProgressBar(index);
            
            // Mettre à jour les boutons de navigation
            updateNavigationButtons();
        }
        
        animating = false;
    }
    
    // Mettre à jour la barre de progression avec animation
    function updateProgressBar(index) {
        const progress = ((index + 1) / totalQuestions) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `Question ${index + 1}/${totalQuestions}`;
        
        // Animation de pulse pour la barre de progression
        progressFill.classList.add('pulse');
        setTimeout(() => {
            progressFill.classList.remove('pulse');
        }, 500);
    }
    
    // Mettre à jour les boutons de navigation
    function updateNavigationButtons() {
        prevBtn.disabled = currentQuestionIndex === 0;
        
        if (currentQuestionIndex === totalQuestions - 1) {
            nextBtn.textContent = 'Terminer';
            nextBtn.classList.add('finish-btn');
        } else {
            nextBtn.textContent = 'Suivant';
            nextBtn.classList.remove('finish-btn');
        }
    }
    
    // Transition douce vers la page de résultats
    function transitionToResults() {
        if (animating) return;
        animating = true;
        
        // Masquer le contenu du quiz et afficher les résultats
        quizContent.classList.remove('active');
        quizResults.classList.add('active');
        showResults();
        
        animating = false;
    }
    
    // Démarrer le quiz avec animation
    startBtn.addEventListener('click', function() {
        if (animating) return;
        
        // Réinitialiser les réponses de l'utilisateur au démarrage du quiz
        userAnswers = {};
        clearAllSelections();
        
        // Masquer l'intro et afficher le contenu du quiz
        quizIntro.classList.remove('active');
        quizContent.classList.add('active');
        
        // Afficher la première question
        showQuestion(0);
    });
    
    // Navigation précédent
    prevBtn.addEventListener('click', function() {
        if (currentQuestionIndex > 0 && !animating) {
            showQuestion(currentQuestionIndex - 1);
        }
    });
    
    // Navigation suivant ou terminer
    nextBtn.addEventListener('click', function() {
        if (animating) return;
        
        // Sauvegarder la réponse actuelle
        const questionId = `q${currentQuestionIndex}`;
        const selectedOption = document.querySelector(`input[name="${questionId}"]:checked`);
        
        if (selectedOption) {
            userAnswers[questionId] = selectedOption.value;
            
            if (currentQuestionIndex < totalQuestions - 1) {
                showQuestion(currentQuestionIndex + 1);
            } else {
                transitionToResults();
            }
        } else {
            // Animation pour indiquer qu'une réponse est requise
            const options = document.querySelectorAll(`.question[data-question-id="${currentQuestionIndex}"] .option label`);
            options.forEach(option => {
                option.classList.add('shake');
                setTimeout(() => {
                    option.classList.remove('shake');
                }, 500);
            });
        }
    });
    
    // Redémarrer le quiz avec animation
    restartBtn.addEventListener('click', function() {
        if (animating) return;
        
        // Réinitialiser le quiz
        userAnswers = {};
        currentQuestionIndex = 0;
        
        // Décocher toutes les options
        clearAllSelections();
        
        // Masquer les résultats et afficher le contenu du quiz
        quizResults.classList.remove('active');
        quizContent.classList.add('active');
        
        // Afficher la première question
        showQuestion(0);
    });
    
    // Afficher les résultats avec animations
    function showResults() {
        let score = 0;
        let summaryHTML = '';
        
        // Calculer le score et générer le récapitulatif
        for (let i = 0; i < totalQuestions; i++) {
            const questionId = `q${i}`;
            const userAnswer = userAnswers[questionId];
            const questionData = quizData.questions[i];
            const correctAnswer = questionData.answer;
            const isCorrect = userAnswer === correctAnswer;
            
            if (isCorrect) {
                score++;
            }
            
            // Générer l'élément HTML pour cette question dans le récapitulatif
            summaryHTML += `
                <div class="summary-item ${isCorrect ? 'correct' : 'incorrect'}">
                    <div class="summary-item-title">
                        ${isCorrect ? 'Correct' : 'Incorrect'} : ${questionData.question}
                    </div>
                    <div class="user-answer">
                        Votre réponse : <span class="${isCorrect ? 'correct' : 'incorrect'}">${userAnswer || 'Aucune réponse'}</span>
                    </div>
                    ${!isCorrect ? `<div class="correct-answer">
                        Réponse correcte : <span>${correctAnswer}</span>
                    </div>` : ''}
                </div>
            `;
        }
        
        // Mettre à jour l'affichage du score
        const percentage = Math.round((score / totalQuestions) * 100);
        
        // Animation du cercle de score
        const scoreCircle = document.getElementById('score-circle');
        scoreCircle.setAttribute('stroke-dasharray', `${percentage}, 100`);
        
        // Afficher le score
        document.getElementById('score-value').textContent = score;
        document.getElementById('score-text').textContent = `${percentage}%`;
        
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
        
        // Ajouter le récapitulatif des réponses
        document.getElementById('summary-container').innerHTML = summaryHTML;
        
        // Ajout d'un bouton pour basculer l'affichage du récapitulatif sur mobile
        if (window.innerWidth < 768) {
            // Vérifier si le bouton existe déjà pour éviter les doublons
            if (!document.querySelector('.toggle-summary')) {
                const toggleButton = document.createElement('button');
                toggleButton.className = 'secondary-button toggle-summary';
                toggleButton.textContent = 'Voir le détail des réponses';
                toggleButton.style.marginTop = '1rem';
                toggleButton.style.width = '100%';
                
                const summarySection = document.getElementById('answers-summary');
                summarySection.style.display = 'none';
                
                document.querySelector('.result-card').insertAdjacentElement('afterend', toggleButton);
                
                toggleButton.addEventListener('click', function() {
                    const isVisible = summarySection.style.display !== 'none';
                    summarySection.style.display = isVisible ? 'none' : 'block';
                    this.textContent = isVisible ? 'Voir le détail des réponses' : 'Masquer le détail des réponses';
                });
            }
        }
    }
    
    // Ajouter des effets de survol pour les options
    document.querySelectorAll('.option label').forEach(label => {
        label.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = 'var(--shadow-md)';
        });
        
        label.addEventListener('mouseout', function() {
            if (!this.previousElementSibling.checked) {
                this.style.transform = '';
                this.style.boxShadow = '';
            }
        });
    });
    
    // Ajouter des animations aux clics sur les options
    document.querySelectorAll('.option input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                const label = this.nextElementSibling;
                label.style.animation = 'pulse 0.5s ease';
                
                setTimeout(() => {
                    label.style.animation = '';
                }, 500);
            }
        });
    });

    async function resetQuiz() {
        try {
            // Récupérer de nouvelles questions depuis l'API
            const response = await fetch('/api/new-questions');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des questions');
            }
            questions = await response.json();

            // Réinitialiser les variables
            currentQuestionIndex = 0;
            userAnswers = {};
            let score = 0;
            
            // Masquer les résultats et le résumé
            document.querySelector('.results').style.display = 'none';
            const summaryContainer = document.querySelector('.answers-summary');
            if (summaryContainer) {
                summaryContainer.style.display = 'none';
            }

            // Réinitialiser l'affichage des questions
            resetQuestions();
            showQuestion(0);
            
            // Afficher la première question
            document.querySelector('.quiz-container').style.display = 'block';
            updateProgress();
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors du rechargement du quiz');
        }
    }
});
 