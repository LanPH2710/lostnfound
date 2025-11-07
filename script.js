// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Hero section animation
document.addEventListener('DOMContentLoaded', () => {
    gsap.to('.hero-content', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
    });
});

// Navigation menu background on scroll
const nav = document.querySelector('.main-nav');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Handle scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Handle mobile menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('active');
    });
});

// Scroll to top button
const scrollToTopBtn = document.getElementById('scrollToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Initialize Intersection Observer for animations
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('about-content')) {
                entry.target.classList.add('fade-in');
            }
            if (entry.target.classList.contains('screenshot')) {
                entry.target.classList.add('slide-in');
            }
            if (entry.target.classList.contains('step')) {
                entry.target.classList.add('fade-in');
            }
        } else {
            // Remove classes when element is not in viewport
            entry.target.classList.remove('fade-in', 'slide-in');
        }
    });
}, { 
    threshold: 0.2,
    rootMargin: '-50px'
});

// Observe elements
document.querySelectorAll('.about-content, .screenshot, .step').forEach(element => {
    observer.observe(element);
});

// Screenshot carousel controls: left/right buttons to scroll by visible items
const carousel = document.querySelector('.screenshot-carousel');
const btnLeft = document.querySelector('.carousel-btn.left');
const btnRight = document.querySelector('.carousel-btn.right');

let carouselStep = 0; // number of pixels to scroll per click

function computeCarouselStep() {
    if (!carousel) return;
    const items = carousel.querySelectorAll('.screenshot');
    if (!items.length) return;
    const itemRect = items[0].getBoundingClientRect();
    const style = window.getComputedStyle(carousel);
    // gap can be returned as e.g. "32px"
    const gap = parseFloat(style.columnGap || style.gap) || 16;
    const itemWidth = itemRect.width;
    // how many full items fit in the visible area
    const visibleCount = Math.max(1, Math.floor((carousel.clientWidth + gap) / (itemWidth + gap)));
    carouselStep = Math.round((itemWidth + gap) * visibleCount);
}

function scrollCarousel(amount) {
    if (!carousel) return;
    carousel.scrollBy({ left: amount, behavior: 'smooth' });
}

function updateCarouselButtons() {
    if (!carousel || !btnLeft || !btnRight) return;
    const maxScroll = Math.max(0, carousel.scrollWidth - carousel.clientWidth);
    const eps = 4; // tolerance
    if (carousel.scrollLeft <= eps) {
        btnLeft.style.opacity = '0.3';
        btnLeft.disabled = true;
    } else {
        btnLeft.style.opacity = '1';
        btnLeft.disabled = false;
    }
    if (carousel.scrollLeft >= maxScroll - eps) {
        btnRight.style.opacity = '0.3';
        btnRight.disabled = true;
    } else {
        btnRight.style.opacity = '1';
        btnRight.disabled = false;
    }
}

if (btnLeft && btnRight && carousel) {
    // compute step initially
    computeCarouselStep();

    btnLeft.addEventListener('click', () => {
        scrollCarousel(-carouselStep);
    });
    btnRight.addEventListener('click', () => {
        scrollCarousel(carouselStep);
    });

    carousel.addEventListener('scroll', () => {
        window.requestAnimationFrame(updateCarouselButtons);
    });

    window.addEventListener('resize', () => {
        computeCarouselStep();
        window.requestAnimationFrame(updateCarouselButtons);
    });

    // initial state after images/layout settle
    window.addEventListener('load', () => {
        computeCarouselStep();
        window.requestAnimationFrame(updateCarouselButtons);
    });

    // also run shortly after DOMContentLoaded in case images are cached
    setTimeout(() => { computeCarouselStep(); updateCarouselButtons(); }, 250);
}

// GSAP Animations for sections
gsap.utils.toArray('section').forEach((section, i) => {
    ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        toggleClass: {targets: section, className: 'active'},
        markers: false
    });
});

// Parallax effect for sections
const parallaxSections = document.querySelectorAll('section');
window.addEventListener('scroll', () => {
    parallaxSections.forEach(section => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        section.style.transform = `translate3d(0, ${rate}px, 0)`;
    });
});

// Auto-play video when in viewport
const videoSection = document.querySelector('#tutorial');
const videoFrame = document.querySelector('#tutorial iframe');

const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add autoplay parameter to URL
            const videoSrc = videoFrame.src;
            if (!videoSrc.includes('autoplay=1')) {
                videoFrame.src = videoSrc + '&autoplay=1';
            }
        }
    });
}, { threshold: 0.5 });

videoObserver.observe(videoSection);

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth'
        });
    });
});