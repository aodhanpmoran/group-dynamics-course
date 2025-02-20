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
    const backToTop = document.querySelector('.back-to-top');
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

    // Function to check if we're near bottom of cards section
    const isNearBottom = () => {
        const containerHeight = container.clientHeight;
        const cardsSectionRect = cardsSection.getBoundingClientRect();
        const cardsSectionBottom = cardsSectionRect.bottom;
        
        return cardsSectionBottom <= containerHeight + 100;
    };

    // Function to handle scroll
    const handleScroll = () => {
        const cardsSectionBottom = cardsSection.getBoundingClientRect().bottom;
        const containerHeight = container.clientHeight;
        
        // Show button only when we're at the bottom of section 4
        if (cardsSectionBottom <= containerHeight + 100) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    };

    // Add scroll event listener to container instead of window
    container.addEventListener('scroll', handleScroll);

    // Back to top click handler
    backToTop.addEventListener('click', () => {
        container.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Replace the existing carousel functionality with this updated version
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    let currentIndex = 0;

    // Clone the initial cards for infinite scroll
    const cards = document.querySelectorAll('.interview-card');
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });

    function updateCarousel(direction) {
        const cardWidth = document.querySelector('.interview-card').offsetWidth;
        const gap = 32; // 2rem gap
        const moveAmount = cardWidth + gap;
        
        if (direction === 'next') {
            currentIndex++;
            track.style.transform = `translateX(-${currentIndex * moveAmount}px)`;
            
            // Reset when we reach the cloned set
            if (currentIndex >= cards.length) {
                setTimeout(() => {
                    track.style.transition = 'none';
                    currentIndex = 0;
                    track.style.transform = `translateX(0)`;
                    setTimeout(() => {
                        track.style.transition = 'transform 0.5s ease';
                    }, 50);
                }, 500);
            }
        } else {
            if (currentIndex === 0) {
                track.style.transition = 'none';
                currentIndex = cards.length;
                track.style.transform = `translateX(-${currentIndex * moveAmount}px)`;
                setTimeout(() => {
                    track.style.transition = 'transform 0.5s ease';
                    currentIndex--;
                    track.style.transform = `translateX(-${currentIndex * moveAmount}px)`;
                }, 50);
            } else {
                currentIndex--;
                track.style.transform = `translateX(-${currentIndex * moveAmount}px)`;
            }
        }
    }

    prevBtn.addEventListener('click', () => updateCarousel('prev'));
    nextBtn.addEventListener('click', () => updateCarousel('next'));

    // Update on resize
    window.addEventListener('resize', () => {
        const cardWidth = document.querySelector('.interview-card').offsetWidth;
        const gap = 32;
        track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
    });

    // Add booking button animation with longer delay
    const bookingLink = document.querySelector('.booking-link');
    setTimeout(() => {
        bookingLink.classList.add('show');
    }, 3500); // 3.5 second delay for a more natural feel
}); 