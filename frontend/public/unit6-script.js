// Unit 6 Coursework JavaScript

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.unit-navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        navbar.style.borderBottom = '2px solid rgba(123, 67, 151, 0.5)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.9)';
        navbar.style.borderBottom = '2px solid rgba(123, 67, 151, 0.3)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
            
            // Special handling for skill bars
            if (entry.target.classList.contains('skill-progress')) {
                const width = entry.target.getAttribute('data-width');
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 200);
            }
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.overview-card, .feature-card, .nav-card, .skill-item').forEach(el => {
    observer.observe(el);
});

// Observe skill progress bars
document.querySelectorAll('.skill-progress').forEach(el => {
    observer.observe(el);
});

// Add CSS for scroll animations
const style = document.createElement('style');
style.textContent = `
    .overview-card,
    .feature-card,
    .nav-card,
    .skill-item {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .overview-card.animate-visible,
    .feature-card.animate-visible,
    .nav-card.animate-visible,
    .skill-item.animate-visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Enhanced hover effects for cards
document.querySelectorAll('.overview-card, .feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
        
        // Add glow effect based on card type
        if (this.classList.contains('featured')) {
            this.style.boxShadow = '0 25px 50px rgba(220, 36, 48, 0.4)';
        } else {
            this.style.boxShadow = '0 25px 50px rgba(123, 67, 151, 0.3)';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '';
    });
});

// Interactive skill bars
document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        const progressBar = this.querySelector('.skill-progress');
        progressBar.style.background = 'linear-gradient(45deg, #dc2430, #7b4397, #ff6b6b)';
        progressBar.style.boxShadow = '0 0 20px rgba(123, 67, 151, 0.5)';
    });
    
    item.addEventListener('mouseleave', function() {
        const progressBar = this.querySelector('.skill-progress');
        progressBar.style.background = 'linear-gradient(45deg, #7b4397, #dc2430)';
        progressBar.style.boxShadow = '';
    });
});

// Parallax effect for floating elements
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelectorAll('.floating-elements .element');
    
    parallax.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.02}deg)`;
    });
});

// Dynamic star generation
function createStar() {
    const star = document.createElement('div');
    star.style.cssText = `
        position: fixed;
        width: 2px;
        height: 2px;
        background: white;
        border-radius: 50%;
        pointer-events: none;
        z-index: -1;
        left: ${Math.random() * window.innerWidth}px;
        top: ${Math.random() * window.innerHeight}px;
        opacity: ${Math.random() * 0.8 + 0.2};
        animation: twinkle ${2 + Math.random() * 3}s ease-in-out infinite;
    `;
    
    document.body.appendChild(star);
    
    // Remove star after animation
    setTimeout(() => {
        if (star.parentNode) {
            star.remove();
        }
    }, 5000);
}

// Generate stars periodically
setInterval(createStar, 1000);

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect on load
window.addEventListener('load', function() {
    setTimeout(() => {
        const titleLines = document.querySelectorAll('.title-line');
        titleLines.forEach((line, index) => {
            setTimeout(() => {
                const text = line.textContent;
                typeWriter(line, text, 150);
            }, index * 1000);
        });
    }, 1000);
});

// Interactive navigation cards
document.querySelectorAll('.nav-card').forEach(card => {
    card.addEventListener('click', function(e) {
        // Add click animation
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
});

// Cosmic background animation control
let cosmicAnimation = true;

// Add floating particles effect
function createCosmicParticle() {
    if (!cosmicAnimation) return;
    
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: radial-gradient(circle, #7b4397, #dc2430);
        border-radius: 50%;
        pointer-events: none;
        z-index: -1;
        left: ${Math.random() * window.innerWidth}px;
        top: ${window.innerHeight + 20}px;
        opacity: 0.7;
        animation: floatUp ${5 + Math.random() * 5}s linear infinite;
        box-shadow: 0 0 10px currentColor;
    `;
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
        }
    }, 10000);
}

// Add float up animation
const floatUpStyle = document.createElement('style');
floatUpStyle.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 0.7;
        }
        90% {
            opacity: 0.7;
        }
        100% {
            transform: translateY(-120vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(floatUpStyle);

// Generate cosmic particles
setInterval(createCosmicParticle, 2000);

// Loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Performance optimization: pause animations when tab is not visible
document.addEventListener('visibilitychange', function() {
    cosmicAnimation = !document.hidden;
});

// Easter egg: Konami code for special effect
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === konamiSequence.length && 
        konamiCode.every((code, index) => code === konamiSequence[index])) {
        
        // Special cosmic effect
        document.body.style.animation = 'cosmicPulse 2s ease-in-out';
        
        // Show achievement
        const achievement = document.createElement('div');
        achievement.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(45deg, #7b4397, #dc2430);
                color: white;
                padding: 30px;
                border-radius: 20px;
                text-align: center;
                font-size: 1.5rem;
                font-weight: bold;
                z-index: 10000;
                box-shadow: 0 0 50px rgba(123, 67, 151, 0.8);
                animation: achievementPop 3s ease-in-out;
            ">
                🎉 COSMIC ACHIEVEMENT UNLOCKED! 🎉<br>
                <span style="font-size: 1rem; opacity: 0.9;">You found the secret code!</span>
            </div>
        `;
        
        document.body.appendChild(achievement);
        
        setTimeout(() => {
            achievement.remove();
            document.body.style.animation = '';
        }, 3000);
        
        konamiCode = [];
    }
});

// Add achievement animation
const achievementStyle = document.createElement('style');
achievementStyle.textContent = `
    @keyframes cosmicPulse {
        0%, 100% { background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%); }
        50% { background: radial-gradient(ellipse at bottom, #7b4397 0%, #dc2430 100%); }
    }
    
    @keyframes achievementPop {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        20% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        30% { transform: translate(-50%, -50%) scale(1); }
        80% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
    }
`;
document.head.appendChild(achievementStyle);