/* ===================================================================
   Brin de Nature - Main JavaScript
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileNav();
    initScrollAnimations();
    initContactForm();
    initSmoothScroll();
});

/* --- Sticky Header --- */
function initHeader() {
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

/* --- Mobile Navigation --- */
function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.classList.add('nav__overlay');
    document.body.appendChild(overlay);

    function closeMenu() {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function openMenu() {
        toggle.classList.add('active');
        menu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    toggle.addEventListener('click', () => {
        if (menu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    overlay.addEventListener('click', closeMenu);

    // Close on link click
    menu.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            closeMenu();
        }
    });
}

/* --- Scroll Animations (Intersection Observer) --- */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');

    if (!animatedElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay based on position in viewport
                const siblings = entry.target.parentElement.querySelectorAll('[data-animate]');
                const siblingIndex = Array.from(siblings).indexOf(entry.target);
                const delay = siblingIndex * 100;

                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, delay);

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
}

/* --- Contact Form --- */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Basic validation
        if (!data.name || !data.email || !data.subject || !data.message) {
            showFormMessage(form, 'Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showFormMessage(form, 'Veuillez entrer une adresse email valide.', 'error');
            return;
        }

        // Simulate submission
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Envoi en cours...';
        btn.disabled = true;

        setTimeout(() => {
            showFormMessage(form, 'Merci ! Votre message a bien été envoyé. Nous vous répondrons dans les 24h.', 'success');
            form.reset();
            btn.textContent = originalText;
            btn.disabled = false;
        }, 1500);
    });
}

function showFormMessage(form, message, type) {
    // Remove existing messages
    const existing = form.querySelector('.form__message');
    if (existing) existing.remove();

    const messageEl = document.createElement('div');
    messageEl.classList.add('form__message', `form__message--${type}`);
    messageEl.textContent = message;
    messageEl.style.cssText = `
        grid-column: 1 / -1;
        padding: 1rem;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 500;
        text-align: center;
        animation: fadeIn 0.3s ease;
        ${type === 'success'
            ? 'background: #E8F5E2; color: #2D5A27; border: 1px solid #A8E6A8;'
            : 'background: #FFF5F5; color: #C0392B; border: 1px solid #F5C6CB;'
        }
    `;

    form.insertBefore(messageEl, form.querySelector('button[type="submit"]'));

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.style.opacity = '0';
            messageEl.style.transition = 'opacity 0.3s ease';
            setTimeout(() => messageEl.remove(), 300);
        }
    }, 5000);
}

/* --- Smooth Scroll for anchor links --- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            const headerHeight = document.getElementById('header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}
