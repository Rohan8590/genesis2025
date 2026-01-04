document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    const backToTop = document.querySelector('.back-to-top');

    // Metanoia hero elements for parallax
    const heroSection = document.querySelector('.hero');
    const heroContent = heroSection ? heroSection.querySelector('.hero-content') : null;
    
    window.addEventListener('scroll', function() {
        // Navbar scroll effect
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Back to top button
        if (window.scrollY > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }

        // Hero parallax (slow, subtle)
        if (heroSection && heroContent) {
            const scrollY = window.scrollY;
            const factor = 0.25; // lower = slower
            const offset = scrollY * factor;
            heroContent.style.transform = `translateY(${offset * -1}px)`;
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {toggle: false});
                    bsCollapse.hide();
                }
            }
        });
    });
    
    // Back to top button
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: false,
        mirror: false
    });
    
    // Counter animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the faster
    
    function animateCounter(counter) {
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText;
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounter(counter), 1);
        } else {
            counter.innerText = target;
        }
    }
    
    // Start counter when it comes into view
    const counterSection = document.querySelector('.about');
    let counterAnimated = false;
    
    function checkCounter() {
        const counterPosition = counterSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (counterPosition < screenPosition && !counterAnimated) {
            counters.forEach(counter => {
                animateCounter(counter);
            });
            counterAnimated = true;
        }
    }
    
    // Only add scroll event listener if counter section exists
    if (counterSection) {
        window.addEventListener('scroll', checkCounter);
    }
    
    // Video background fallback
    const videoBackground = document.querySelector('.video-background');
    const bgVideo = document.getElementById('bgVideo');
    
    if (bgVideo) {
        // Check if video can play, if not show fallback image
        bgVideo.addEventListener('error', function() {
            videoBackground.innerHTML = `
                <div class="fallback-image" style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: url('assets/img/about-bg.JPG') no-repeat center center/cover;
                "></div>
                <div class="video-overlay"></div>
            `;
        });
        
        // Keep the video playing on all devices (no mobile-only fallback replacement)
    }
    
    // Add active class to current nav link
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    function setActiveNavLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', setActiveNavLink);
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Here you would typically send the form data to a server
            // For now, we'll just show a success message
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
            
            // Simulate form submission
            setTimeout(() => {
                // Show success message
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert alert-success mt-3';
                alertDiv.role = 'alert';
                alertDiv.innerHTML = 'Your message has been sent successfully!';
                
                contactForm.appendChild(alertDiv);
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    alertDiv.remove();
                }, 5000);
            }, 1500);
        });
    }
    
    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Here you would typically send the email to your server
                // For now, we'll just show a success message
                const originalButtonHTML = this.innerHTML;
                const button = this.querySelector('button');
                
                button.disabled = true;
                button.innerHTML = '<i class="fas fa-check"></i>';
                
                // Simulate API call
                setTimeout(() => {
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'alert alert-success mt-2';
                    successMessage.role = 'alert';
                    successMessage.textContent = 'Thank you for subscribing!';
                    
                    this.parentNode.insertBefore(successMessage, this.nextSibling);
                    this.reset();
                    
                    // Reset button after delay
                    setTimeout(() => {
                        button.disabled = false;
                        button.innerHTML = '<i class="fas fa-paper-plane"></i>';
                        successMessage.remove();
                    }, 3000);
                }, 1000);
            }
        });
    }
    
    // Lazy loading for images
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading is supported
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
});
