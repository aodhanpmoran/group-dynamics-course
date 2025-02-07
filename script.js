document.addEventListener('DOMContentLoaded', () => {
    // Fade out overlay
    setTimeout(() => {
        const overlay = document.getElementById('overlay');
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 2000);
    }, 500);

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe the cards section
    const cardsSection = document.querySelector('.cards-section');
    observer.observe(cardsSection);

    // Smooth scroll handling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    const sections = document.querySelectorAll('.section');
    const container = document.querySelector('.container');

    // Initial check
    checkVisibility();

    // Check visibility on scroll
    container.addEventListener('scroll', checkVisibility);

    function checkVisibility() {
        const scrollTop = container.scrollTop;
        const windowHeight = window.innerHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            
            if (scrollTop >= sectionTop - windowHeight/2 && 
                scrollTop < sectionTop + windowHeight/2) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }

    // Handle resize
    window.addEventListener('resize', checkVisibility);

    const cardsContainer = document.querySelector('.cards-container');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    let isScrolling;

    // Hide indicator when scrolling
    cardsContainer.addEventListener('scroll', () => {
        scrollIndicator.classList.add('hidden');
        
        // Clear timeout if scrolling continues
        window.clearTimeout(isScrolling);

        // Set timeout to show indicator after scrolling stops
        isScrolling = setTimeout(() => {
            // Only show if not at bottom
            if (cardsContainer.scrollHeight - cardsContainer.scrollTop > cardsContainer.clientHeight + 100) {
                scrollIndicator.classList.remove('hidden');
            }
        }, 1000);
    });

    // Hide indicator when at bottom
    const checkBottom = () => {
        if (cardsContainer.scrollHeight - cardsContainer.scrollTop <= cardsContainer.clientHeight + 100) {
            scrollIndicator.classList.add('hidden');
        }
    };

    cardsContainer.addEventListener('scroll', checkBottom);

    // Add smooth scroll for View Curriculum button
    const viewCurriculumBtn = document.querySelector('.request-btn');
    viewCurriculumBtn.addEventListener('click', () => {
        document.getElementById('curriculum').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });
}); 