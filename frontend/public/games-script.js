// Games Portal JavaScript

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
    const navbar = document.querySelector('.games-navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        navbar.style.borderBottom = '2px solid rgba(0, 255, 255, 0.5)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.9)';
        navbar.style.borderBottom = '2px solid rgba(0, 255, 255, 0.3)';
    }
});

// Game card hover effects
document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.03)';
        
        // Add pulsing glow effect
        const cardType = this.classList.contains('featured') ? 'featured' : 
                        this.classList.contains('special') ? 'special' : 'normal';
        
        switch(cardType) {
            case 'featured':
                this.style.boxShadow = '0 25px 50px rgba(255, 0, 255, 0.4), 0 0 60px rgba(255, 0, 255, 0.2)';
                break;
            case 'special':
                this.style.boxShadow = '0 25px 50px rgba(255, 255, 0, 0.4), 0 0 60px rgba(255, 255, 0, 0.2)';
                break;
            default:
                this.style.boxShadow = '0 25px 50px rgba(0, 255, 255, 0.3), 0 0 60px rgba(0, 255, 255, 0.15)';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '';
    });
});

// Game launch function
function openGame(gameFile) {
    // Add loading effect
    const btn = event.target.closest('.game-btn');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> LOADING...';
    btn.style.background = 'linear-gradient(45deg, #333, #666)';
    
    // Simulate loading time
    setTimeout(() => {
        window.open(gameFile, '_blank');
        
        // Reset button after delay
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = 'linear-gradient(45deg, #ff00ff, #00ffff)';
        }, 1000);
    }, 1500);
}

// Parallax effect for background elements
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.neon-grid');
    const speed = scrolled * 0.2;
    
    if (parallax) {
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Dynamic particle generation
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'dynamic-particle';
    particle.style.cssText = `
        position: fixed;
        width: 3px;
        height: 3px;
        background: ${['#00ffff', '#ff00ff', '#ffff00', '#00ff00'][Math.floor(Math.random() * 4)]};
        border-radius: 50%;
        pointer-events: none;
        z-index: -1;
        left: ${Math.random() * window.innerWidth}px;
        top: ${Math.random() * window.innerHeight}px;
        box-shadow: 0 0 10px currentColor;
        animation: particleFloat ${5 + Math.random() * 10}s linear infinite;
    `;
    
    document.body.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
        }
    }, 15000);
}

// Add particle animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Generate particles periodically
setInterval(createParticle, 2000);

// Game card click analytics (placeholder)
document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', function() {
        const gameName = this.querySelector('h3').textContent;
        console.log(`Game clicked: ${gameName}`);
        
        // Add click effect
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
});

// Neon text glow intensity based on scroll
window.addEventListener('scroll', function() {
    const scrollPercent = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
    const intensity = 0.5 + (scrollPercent * 0.5);
    
    const neonElements = document.querySelectorAll('.glitch, .section-title');
    neonElements.forEach(element => {
        element.style.textShadow = `
            0 0 ${10 * intensity}px currentColor,
            0 0 ${20 * intensity}px currentColor,
            0 0 ${40 * intensity}px currentColor
        `;
    });
});

// Loading screen effect
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Keyboard shortcuts for games
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) return; // Don't interfere with browser shortcuts
    
    switch(e.key.toLowerCase()) {
        case '1':
            openGame('snake-game.html');
            break;
        case '2':
            openGame('code-game.html');
            break;
        case '3':
            openGame('basketball-game.html');
            break;
        case '4':
            openGame('memory-game.html');
            break;
        case '5':
            openGame('runner-game.html');
            break;
        case '6':
            openGame('arcade-game.html');
            break;
    }
});

// Show keyboard shortcuts hint
setTimeout(() => {
    const hint = document.createElement('div');
    hint.innerHTML = `
        <div style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 255, 255, 0.1);
            border: 1px solid rgba(0, 255, 255, 0.3);
            border-radius: 10px;
            padding: 15px;
            color: #00ffff;
            font-size: 0.9rem;
            backdrop-filter: blur(10px);
            z-index: 1000;
            animation: fadeIn 0.5s ease;
        ">
            💡 Tip: Press 1-6 to quick-launch games!
        </div>
    `;
    document.body.appendChild(hint);
    
    // Remove hint after 5 seconds
    setTimeout(() => {
        hint.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => hint.remove(), 500);
    }, 5000);
}, 3000);

// Add fadeOut animation
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(20px); }
    }
`;
document.head.appendChild(fadeOutStyle);