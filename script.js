// Portfolio JavaScript functionality

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const typedText = document.getElementById('typed-text');
const contactForm = document.getElementById('contact-form');

// Typing Animation
class TypeWriter {
    constructor(element, words, wait = 3000) {
        this.element = element;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.element.innerHTML = this.txt;

        let typeSpeed = 150;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Initialize typing animation
function initTypingAnimation() {
    if (typedText) {
        const words = [
            'Python Developer',
            'Data Analyst', 
            'ML Explorer',
            'Backend Enthusiast',
            'Interested in Data Science and AI'
        ];
        new TypeWriter(typedText, words, 3000);
    }
}

// Navbar Scroll Effect
function handleNavbarScroll() {
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    if (navLinks) {
        navLinks.classList.toggle('active');
        
        // Animate hamburger icon
        if (navToggle) {
            const spans = navToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navLinks.classList.contains('active')) {
                    switch(index) {
                        case 0:
                            span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                            break;
                        case 1:
                            span.style.opacity = '0';
                            break;
                        case 2:
                            span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                            break;
                    }
                } else {
                    span.style.transform = '';
                    span.style.opacity = '';
                }
            });
        }
    }
}

// Smooth Scrolling for Navigation Links
function smoothScrollToSection(targetId) {
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        const navHeight = navbar ? navbar.offsetHeight : 80;
        const targetPosition = targetElement.offsetTop - navHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (navLinks && navLinks.classList.contains('active')) {
            toggleMobileMenu();
        }
        
        return true;
    }
    return false;
}

// Active Navigation Link Highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navHeight = navbar ? navbar.offsetHeight : 80;
    const scrollPosition = window.scrollY + navHeight + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Update all nav links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Contact Form Handling
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Simple validation
    if (!name || !email || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate form submission
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        showNotification('Thank you! Your message has been sent successfully.', 'success');
        contactForm.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        ${type === 'success' ? 'background: #10b981;' : ''}
        ${type === 'error' ? 'background: #ef4444;' : ''}
        ${type === 'info' ? 'background: #3b82f6;' : ''}
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: 1rem;
        padding: 0;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Smooth scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
function toggleScrollTopButton() {
    let scrollTopBtn = document.querySelector('.scroll-top-btn');
    
    if (!scrollTopBtn) {
        scrollTopBtn = document.createElement('button');
        scrollTopBtn.className = 'scroll-top-btn';
        scrollTopBtn.innerHTML = '↑';
        scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
        
        scrollTopBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            border: none;
            cursor: pointer;
            font-size: 1.2rem;
            font-weight: bold;
            z-index: 1000;
            transition: all 0.3s ease;
            opacity: 0;
            visibility: hidden;
            transform: translateY(100px);
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        `;
        
        scrollTopBtn.addEventListener('click', scrollToTop);
        scrollTopBtn.addEventListener('mouseenter', () => {
            scrollTopBtn.style.transform = 'translateY(-5px) scale(1.1)';
        });
        scrollTopBtn.addEventListener('mouseleave', () => {
            scrollTopBtn.style.transform = 'translateY(0) scale(1)';
        });
        
        document.body.appendChild(scrollTopBtn);
    }
    
    if (window.scrollY > 500) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.visibility = 'visible';
        scrollTopBtn.style.transform = 'translateY(0)';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
        scrollTopBtn.style.transform = 'translateY(100px)';
    }
}

// SVG Hover Effects
function setupSVGInteractions() {
    const profilePlaceholder = document.querySelector('.profile-placeholder');
    const profileSVG = document.querySelector('.profile-placeholder svg');
    
    if (profilePlaceholder && profileSVG) {
        // Add subtle rotation on hover
        profilePlaceholder.addEventListener('mouseenter', () => {
            profileSVG.style.transform = 'translateY(-5px) rotate(5deg)';
        });
        
        profilePlaceholder.addEventListener('mouseleave', () => {
            profileSVG.style.transform = 'translateY(0) rotate(0deg)';
        });
        
        // Add click interaction
        profilePlaceholder.addEventListener('click', () => {
            profileSVG.style.transform = 'translateY(-10px) rotate(10deg) scale(1.1)';
            setTimeout(() => {
                profileSVG.style.transform = 'translateY(0) rotate(0deg) scale(1)';
            }, 200);
        });
    }
}

// Performance optimization: throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Throttled scroll handler
const throttledScroll = throttle(() => {
    handleNavbarScroll();
    updateActiveNavLink();
    toggleScrollTopButton();
}, 16);

// Add smooth reveal animations for sections
function addRevealAnimations() {
    const revealElements = document.querySelectorAll('.skill-category, .project-card');
    
    revealElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.transitionDelay = `${index * 0.1}s`;
    });
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(el => revealObserver.observe(el));
}

// Initialize all functionality
function init() {
    console.log('Initializing portfolio...');
    
    // Initialize typing animation
    initTypingAnimation();
    
    // Setup SVG interactions
    setupSVGInteractions();
    
    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Scroll event listener
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    // Initial calls
    handleNavbarScroll();
    updateActiveNavLink();
    toggleScrollTopButton();
    
    // Initialize reveal animations
    setTimeout(addRevealAnimations, 500);
    
    console.log('Portfolio initialized successfully');
}

// Setup navigation after DOM is fully loaded
function setupNavigation() {
    // Navigation link event listeners
    const allNavLinks = document.querySelectorAll('.nav-link');
    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                smoothScrollToSection(href);
            }
        });
    });
    
    // Mobile toggle
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Hero CTA buttons
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                smoothScrollToSection(href);
            }
        });
    });
    
    console.log('Navigation setup complete');
}

// Start everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    init();
    setupNavigation();
});

// Additional setup when page is fully loaded
window.addEventListener('load', function() {
    // Re-setup navigation after everything is loaded to ensure all elements are available
    setupNavigation();
    
    // Trigger initial animations
    document.body.classList.add('loaded');
    
    console.log('Portfolio fully loaded and navigation confirmed');
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const mobileNav = document.getElementById('nav-links');
        if (mobileNav?.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
    
    // Enter key on navigation links
    if (e.key === 'Enter' && e.target.classList.contains('nav-link')) {
        e.target.click();
    }
    
    // Space bar on SVG for accessibility
    if (e.key === ' ' && e.target.closest('.profile-placeholder')) {
        e.preventDefault();
        e.target.closest('.profile-placeholder').click();
    }
});

// Resize handling for mobile menu
window.addEventListener('resize', () => {
    const mobileNav = document.getElementById('nav-links');
    if (window.innerWidth > 768 && mobileNav?.classList.contains('active')) {
        toggleMobileMenu();
    }
});