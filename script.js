document.addEventListener('DOMContentLoaded', () => {
    // Use more efficient selectors
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    // Optimize scroll and resize handlers with RAF
    let scrollTimeout, resizeTimeout;
    const throttle = (callback, wait) => {
        let waiting = false;
        return function () {
            if (!waiting) {
                waiting = true;
                setTimeout(() => {
                    callback.apply(this, arguments);
                    waiting = false;
                }, wait);
            }
        };
    };

    // Fade out overlay
    setTimeout(() => {
        const overlay = $('.overlay');
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 2000);
    }, 500);

    // Optimize intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    entry.target.classList.add('visible');
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    // Observe the cards section
    const cardsSection = $('.cards-section');
    observer.observe(cardsSection);

    // Update all external links to open in new tab
    const allLinks = $$('a[href^="http"]');
    allLinks.forEach(link => {
        if (!link.hasAttribute('target')) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });

    // Update smooth scroll handling to exclude external links
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            // Keep internal links in same tab
            $('[name="' + this.getAttribute('href').substring(1) + '"]').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    const sections = $$('.section');
    const container = $('.container');

    // Initial check
    checkVisibility();

    // Check visibility on scroll
    container.addEventListener('scroll', checkVisibility, { passive: true });

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

    // Optimize scroll handling
    const handleScroll = throttle(() => {
        requestAnimationFrame(() => {
            const cardsSectionBottom = cardsSection.getBoundingClientRect().bottom;
            const containerHeight = container.clientHeight;
            
            if (cardsSectionBottom <= containerHeight + 100) {
                // Add 3 second delay before showing the button
                setTimeout(() => {
                    $('.back-to-top').classList.add('visible');
                }, 3000);
            } else {
                $('.back-to-top').classList.remove('visible');
            }
        });
    }, 100);

    // Use passive event listeners for better scroll performance
    container.addEventListener('scroll', handleScroll, { passive: true });

    // Back to top click handler
    $('.back-to-top').addEventListener('click', () => {
        container.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Replace the existing carousel functionality with this updated version
    const track = $('.carousel-track');
    const prevBtn = $('.carousel-btn.prev');
    const nextBtn = $('.carousel-btn.next');
    let currentIndex = 0;

    // Clone the initial cards for infinite scroll
    const cards = $$('.interview-card');
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });

    // Optimize carousel performance
    function updateCarousel(direction) {
        const cardWidth = $('.interview-card').offsetWidth;
        const gap = 32;
        const moveAmount = cardWidth + gap;
        
        requestAnimationFrame(() => {
            if (direction === 'next') {
                currentIndex++;
                track.style.transform = `translate3d(-${currentIndex * moveAmount}px, 0, 0)`;
                
                if (currentIndex >= cards.length) {
                    setTimeout(() => {
                        track.style.transition = 'none';
                        currentIndex = 0;
                        track.style.transform = 'translate3d(0, 0, 0)';
                        requestAnimationFrame(() => {
                            track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                        });
                    }, 500);
                }
            } else {
                if (currentIndex === 0) {
                    track.style.transition = 'none';
                    currentIndex = cards.length;
                    track.style.transform = `translate3d(-${currentIndex * moveAmount}px, 0, 0)`;
                    setTimeout(() => {
                        track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                        currentIndex--;
                        track.style.transform = `translate3d(-${currentIndex * moveAmount}px, 0, 0)`;
                    }, 50);
                } else {
                    currentIndex--;
                    track.style.transform = `translate3d(-${currentIndex * moveAmount}px, 0, 0)`;
                }
            }
        });
    }

    prevBtn.addEventListener('click', () => updateCarousel('prev'));
    nextBtn.addEventListener('click', () => updateCarousel('next'));

    // Optimize resize handling
    const handleResize = throttle(() => {
        requestAnimationFrame(() => {
            const cardWidth = $('.interview-card').offsetWidth;
            const gap = 32;
            track.style.transform = `translate3d(-${currentIndex * (cardWidth + gap)}px, 0, 0)`;
        });
    }, 100);

    // Use passive event listeners for better resize performance
    window.addEventListener('resize', handleResize, { passive: true });

    // Update the booking button animation
    const bookingLink = $('.booking-link');
    if (bookingLink) {
        // Use requestAnimationFrame for smooth animation
        requestAnimationFrame(() => {
            setTimeout(() => {
                bookingLink.classList.add('visible');
            }, 1500); // Delay the animation slightly for better UX
        });
    }

    // Add smooth scroll for curriculum button
    const curriculumBtn = $('.request-btn');
    curriculumBtn.addEventListener('click', () => {
        $('.cards-section').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });

    // Modal handling
    const modalOverlay = $('.modal-overlay');
    const modalClose = $('.modal-close');
    const invitationBtn = $('.read-invitation-btn');

    function openModal() {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Show accept invitation button after a short delay
        setTimeout(() => {
            $('.accept-invitation-btn').classList.add('visible');
        }, 500);
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Hide accept invitation button
        $('.accept-invitation-btn').classList.remove('visible');
    }

    invitationBtn.addEventListener('click', openModal);
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}); 