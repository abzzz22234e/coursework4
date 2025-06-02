// Smooth scrolling for navigation links
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
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Form submission handling
document.getElementById('applicationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Check for secret roast room access
    if (data.firstName.toLowerCase() === 'secret' && data.lastName.toLowerCase() === 'room') {
        // Check if other required fields are blank for secret access
        const secretFieldsBlank = !data.email && !data.phone && !data.position && !data.experience;
        
        if (secretFieldsBlank) {
            showSecretRoastAccess();
            return;
        }
    }
    
    // Simple validation for normal submissions
    const requiredFields = ['firstName', 'lastName', 'email', 'position', 'experience'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!data[field]) {
            isValid = false;
            const input = document.getElementById(field);
            input.style.borderColor = '#ff6b6b';
            input.addEventListener('input', function() {
                this.style.borderColor = '#e2e8f0';
            });
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        showNotification('Application submitted successfully! We\'ll be in touch soon.', 'success');
        this.reset();
    }, 2000);
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            max-width: 400px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        
        .notification-success {
            background: linear-gradient(135deg, #10b981, #059669);
        }
        
        .notification-error {
            background: linear-gradient(135deg, #ef4444, #dc2626);
        }
        
        .notification-info {
            background: linear-gradient(135deg, #3b82f6, #2563eb);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: auto;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    if (!document.querySelector('#notification-styles')) {
        style.id = 'notification-styles';
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.team-card, .job-card, .resource-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Counter animation for stats
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        element.textContent = currentValue + '+';
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    
    window.requestAnimationFrame(step);
}

// Trigger counter animation when stats come into view
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const stats = entry.target.querySelectorAll('.stat h3');
            stats.forEach((stat, index) => {
                const values = [50, 15, 5];
                animateCounter(stat, 0, values[index], 2000);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-background img');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Hover effects for interactive elements
document.querySelectorAll('.team-card, .job-card, .resource-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Enhanced button hover effects
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Secret access function
function secretAccess() {
    const userInput = prompt("🔥 Enter the secret code to access the roast zone (Hint: Think of Abubakar's favorite number):").toLowerCase();
    
    if (userInput === "42" || userInput === "abubakar" || userInput === "roast" || userInput === "fire") {
        window.location.href = "secret-roast.html";
    } else {
        alert("🚫 Access denied! Nice try though 😏");
    }
}

// Secret roast access with animated lock
function showSecretRoastAccess() {
    // Create animated lock overlay
    const lockOverlay = document.createElement('div');
    lockOverlay.innerHTML = `
        <div class="secret-lock-overlay">
            <div class="lock-container">
                <div class="animated-lock" id="animatedLock">
                    <div class="lock-body">
                        <div class="lock-shackle"></div>
                        <div class="lock-keyhole">🔐</div>
                    </div>
                </div>
                <div class="lock-status" id="lockStatus">
                    <h2>🔍 Secret Access Detected...</h2>
                    <p>Scanning credentials...</p>
                    <div class="loading-bar">
                        <div class="loading-progress"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add lock styles
    const lockStyles = document.createElement('style');
    lockStyles.textContent = `
        .secret-lock-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 50%, #0a0a0a 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: overlayFadeIn 1s ease;
        }
        
        .lock-container {
            text-align: center;
            color: white;
        }
        
        .animated-lock {
            font-size: 80px;
            margin-bottom: 30px;
            animation: lockPulse 2s infinite ease-in-out;
        }
        
        .lock-body {
            position: relative;
            display: inline-block;
        }
        
        .lock-shackle {
            width: 60px;
            height: 40px;
            border: 8px solid #ffd700;
            border-bottom: none;
            border-radius: 50px 50px 0 0;
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            animation: shackleShake 0.5s ease infinite;
        }
        
        .lock-keyhole {
            background: #333;
            width: 80px;
            height: 60px;
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid #ffd700;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        }
        
        .lock-status h2 {
            color: #00ff00;
            text-shadow: 0 0 10px #00ff00;
            margin-bottom: 10px;
            animation: textGlow 1s ease infinite alternate;
        }
        
        .lock-status p {
            color: #cccccc;
            margin-bottom: 20px;
        }
        
        .loading-bar {
            width: 300px;
            height: 6px;
            background: #333;
            border-radius: 3px;
            margin: 0 auto;
            overflow: hidden;
        }
        
        .loading-progress {
            height: 100%;
            background: linear-gradient(90deg, #00ff00, #00ffff, #0099ff);
            width: 0%;
            animation: loadingProgress 3s ease-in-out forwards;
        }
        
        @keyframes overlayFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes lockPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        @keyframes shackleShake {
            0%, 100% { transform: translateX(-50%) rotate(0deg); }
            25% { transform: translateX(-50%) rotate(-2deg); }
            75% { transform: translateX(-50%) rotate(2deg); }
        }
        
        @keyframes textGlow {
            from { text-shadow: 0 0 10px #00ff00; }
            to { text-shadow: 0 0 20px #00ff00, 0 0 30px #00ff00; }
        }
        
        @keyframes loadingProgress {
            to { width: 100%; }
        }
        
        .lock-unlock {
            animation: lockUnlock 1s ease forwards;
        }
        
        @keyframes lockUnlock {
            0% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.2) rotate(10deg); }
            100% { transform: scale(0) rotate(180deg); opacity: 0; }
        }
    `;
    
    document.head.appendChild(lockStyles);
    document.body.appendChild(lockOverlay);
    
    // Play unlock sound
    playUnlockSound();
    
    // Animate unlock sequence
    setTimeout(() => {
        document.getElementById('lockStatus').innerHTML = `
            <h2>✅ Access Granted!</h2>
            <p>Welcome to the secret zone...</p>
        `;
    }, 3000);
    
    setTimeout(() => {
        document.getElementById('animatedLock').classList.add('lock-unlock');
    }, 4000);
    
    setTimeout(() => {
        showWarningModal();
        lockOverlay.remove();
    }, 5000);
}

// Play unlock sound effect
function playUnlockSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create a sequence of unlock sounds
    const frequencies = [440, 523, 659, 784];
    frequencies.forEach((freq, index) => {
        setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }, index * 200);
    });
}

// Show warning modal before entering roast zone
function showWarningModal() {
    const warningModal = document.createElement('div');
    warningModal.innerHTML = `
        <div class="warning-modal-overlay">
            <div class="warning-modal">
                <div class="warning-header">
                    <div class="warning-icon">⚠️</div>
                    <h2>🔥 ROAST ZONE WARNING 🔥</h2>
                </div>
                <div class="warning-content">
                    <p>You are about to enter Abubakar's legendary <strong>SECRET ROAST ZONE</strong>!</p>
                    <p>This area contains premium roasts of your beloved classmates:</p>
                    <ul class="roast-victims">
                        <li>🤓 Zulkernain Haider - The Sleepy Coder</li>
                        <li>😎 Abdi Jama - The Overconfident One</li> 
                        <li>🤔 Jawad Ahmed - The Half-Done Wonder</li>
                        <li>🧠 Nasir Jama - The Overdoer</li>
                        <li>😰 Mr Aanane - The Stressed Teacher</li>
                    </ul>
                    <p><strong>Disclaimer:</strong> All roasts are made with love and friendly banter! 💕</p>
                </div>
                <div class="warning-buttons">
                    <button class="warning-btn danger" onclick="enterRoastZone()">
                        <i class="fas fa-fire"></i>
                        BRING ON THE HEAT! 🔥
                    </button>
                    <button class="warning-btn safe" onclick="closeWarningModal()">
                        <i class="fas fa-shield"></i>
                        TAKE ME BACK TO SAFETY
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add warning modal styles
    const warningStyles = document.createElement('style');
    warningStyles.textContent = `
        .warning-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10001;
            animation: modalFadeIn 0.5s ease;
        }
        
        .warning-modal {
            background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
            border: 3px solid #ff4500;
            border-radius: 20px;
            padding: 30px;
            max-width: 600px;
            text-align: center;
            color: white;
            animation: modalSlideIn 0.5s ease;
            box-shadow: 0 0 50px rgba(255, 69, 0, 0.5);
        }
        
        .warning-header {
            margin-bottom: 20px;
        }
        
        .warning-icon {
            font-size: 60px;
            animation: iconPulse 1s ease infinite;
        }
        
        .warning-modal h2 {
            color: #ff4500;
            text-shadow: 0 0 10px #ff4500;
            margin: 10px 0;
        }
        
        .warning-content p {
            margin: 15px 0;
            line-height: 1.6;
        }
        
        .roast-victims {
            list-style: none;
            padding: 0;
            margin: 20px 0;
        }
        
        .roast-victims li {
            background: rgba(255, 69, 0, 0.1);
            margin: 8px 0;
            padding: 10px;
            border-radius: 10px;
            border-left: 4px solid #ff4500;
        }
        
        .warning-buttons {
            display: flex;
            gap: 20px;
            justify-content: center;
            margin-top: 30px;
        }
        
        .warning-btn {
            padding: 15px 25px;
            border: none;
            border-radius: 10px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 16px;
        }
        
        .warning-btn.danger {
            background: linear-gradient(45deg, #ff4500, #ff6b35);
            color: white;
        }
        
        .warning-btn.danger:hover {
            background: linear-gradient(45deg, #ff6b35, #ff8c42);
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(255, 69, 0, 0.3);
        }
        
        .warning-btn.safe {
            background: linear-gradient(45deg, #4CAF50, #45a049);
            color: white;
        }
        
        .warning-btn.safe:hover {
            background: linear-gradient(45deg, #45a049, #3d8b40);
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(76, 175, 80, 0.3);
        }
        
        @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes modalSlideIn {
            from { transform: translateY(-50px) scale(0.9); opacity: 0; }
            to { transform: translateY(0) scale(1); opacity: 1; }
        }
        
        @keyframes iconPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
    `;
    
    document.head.appendChild(warningStyles);
    document.body.appendChild(warningModal);
}

// Warning modal functions
function enterRoastZone() {
    window.location.href = "secret-roast.html";
}

function closeWarningModal() {
    document.querySelector('.warning-modal-overlay').remove();
    showNotification('Wise choice! You have returned to safety. 🛡️', 'success');
}