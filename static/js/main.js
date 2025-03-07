document.addEventListener('DOMContentLoaded', function() {
    // Animation de défilement pour l'indicateur de défilement
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }

    // Initialiser GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Animation de l'en-tête
    gsap.from('.hero-content', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
    });

    // Animation des sections au défilement
    gsap.utils.toArray('.section').forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Animation des cartes d'avantages
    gsap.utils.toArray('.benefit-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.5,
            delay: i * 0.1,
            scrollTrigger: {
                trigger: '.benefits-grid',
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Animation des poubelles de recyclage
    gsap.utils.toArray('.bin-card').forEach((bin, i) => {
        gsap.from(bin, {
            opacity: 0,
            y: 50,
            duration: 0.5,
            delay: i * 0.1,
            scrollTrigger: {
                trigger: '.recycling-bins',
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Animation des cartes d'impact
    gsap.utils.toArray('.impact-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.5,
            delay: i * 0.1,
            scrollTrigger: {
                trigger: '.impact-facts',
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Animation des compteurs pour les statistiques
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    // Animation des statistiques au défilement
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const value = parseInt(element.getAttribute('data-value'));
                animateValue(element, 0, value, 2000);
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-value, .impact-number').forEach(el => {
        observer.observe(el);
    });

    // Animation parallaxe pour la section d'impact
    gsap.to('.parallax', {
        backgroundPosition: `50% ${window.innerHeight / 2}px`,
        ease: 'none',
        scrollTrigger: {
            trigger: '.parallax',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });

    // Animation des astuces
    gsap.utils.toArray('.tip').forEach((tip, i) => {
        gsap.from(tip, {
            opacity: 0,
            y: 50,
            duration: 0.5,
            delay: i * 0.1,
            scrollTrigger: {
                trigger: '.tips-container',
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Gestion de l'animation du bouton flottant
    const quizButton = document.querySelector('.floating-quiz-button');
    
    if (quizButton) {
        // Stocker les dimensions et la position initiales du bouton
        let initialWidth = quizButton.offsetWidth;
        let initialRight = 30; // valeur par défaut en px
        
        window.addEventListener('scroll', function() {
            // Calcul de la position de défilement
            const scrollPosition = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;
            const scrollBottom = scrollHeight - scrollPosition - clientHeight;
            
            // Distance à partir de laquelle l'animation commence (500px du bas)
            const startDistance = 700;
            
            // Calcul du pourcentage de progression
            let progress = 0;
            
            // Si on est suffisamment bas dans la page
            if (scrollBottom < startDistance) {
                // Calcul de la progression entre 0 et 1
                progress = 1 - (scrollBottom / startDistance);
                
                // S'assurer que la valeur est entre 0 et 1
                progress = Math.max(0, Math.min(1, progress));
                
                // Appliquer les styles progressivement
                const borderRadius = 50 - (progress * 50); // De 50px à 0px
                
                // La largeur augmente progressivement depuis la taille initiale
                const screenWidth = window.innerWidth;
                const targetRight = 0;
                const widthDiff = screenWidth - initialWidth;
                
                // Calculer la largeur et les positions actuelles
                const currentWidth = initialWidth + (widthDiff * progress);
                const currentRight = initialRight - (initialRight * progress);
                
                // Ajuster la taille de police
                const fontSize = 1 + (progress * 0.3); // De 1rem à 1.3rem
                
                // Appliquer les modifications de style
                quizButton.style.borderRadius = borderRadius + 'px';
                quizButton.style.width = currentWidth + 'px';
                quizButton.style.right = currentRight + 'px';
                quizButton.style.fontSize = fontSize + 'rem';
                
                // Transformer le texte et l'icône
                const rotation = progress * 360;
                const svg = quizButton.querySelector('svg');
                if (svg) {
                    svg.style.transform = `rotate(${rotation}deg)`;
                    svg.style.width = (24 + progress * 8) + 'px';
                    svg.style.height = (24 + progress * 8) + 'px';
                    svg.style.marginRight = (progress * 10) + 'px';
                }
                
                // Ajuster bottom pour créer un effet d'expansion vers le bas
                quizButton.style.bottom = (30 - progress * 30) + 'px';
                
                // Si la progression est complète, ajouter l'animation de lueur
                if (progress > 0.9) {
                    quizButton.classList.add('glow-animation');
                } else {
                    quizButton.classList.remove('glow-animation');
                }
            } else {
                // Réinitialiser les styles quand on remonte
                quizButton.style.borderRadius = '50px';
                quizButton.style.width = initialWidth + 'px';
                quizButton.style.fontSize = '1rem';
                quizButton.style.right = initialRight + 'px';
                quizButton.style.bottom = '30px';
                
                const svg = quizButton.querySelector('svg');
                if (svg) {
                    svg.style.transform = 'rotate(0deg)';
                    svg.style.width = '24px';
                    svg.style.height = '24px';
                    svg.style.marginRight = '0px';
                }
                
                quizButton.classList.remove('glow-animation');
            }
        });
    }
}); 