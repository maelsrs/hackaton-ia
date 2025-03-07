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

    // Compteurs animés pour les statistiques
    function animateValue(element, start, end, duration) {
        const range = end - start;
        const startTime = new Date().getTime();
        const endTime = startTime + duration;

        function updateValue() {
            const currentTime = new Date().getTime();
            const elapsed = Math.min(currentTime - startTime, duration);
            const progress = elapsed / duration;
            const value = Math.floor(start + (progress * range));
            
            element.textContent = value;
            
            if (elapsed < duration) {
                requestAnimationFrame(updateValue);
            } else {
                element.textContent = end;
            }
        }
        
        updateValue();
    }

    // Animer les statistiques lorsqu'elles sont visibles
    const statElements = document.querySelectorAll('.stat-value, .impact-number');
    
    statElements.forEach(element => {
        const targetValue = parseInt(element.getAttribute('data-value'), 10);
        
        ScrollTrigger.create({
            trigger: element,
            start: 'top 80%',
            onEnter: () => animateValue(element, 0, targetValue, 1500)
        });
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
}); 