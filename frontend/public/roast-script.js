// Secret Roast Zone JavaScript

let currentRoastLevel = 'mild';

// Roast level management
function changeRoastLevel(level) {
    currentRoastLevel = level;
    
    // Update active button
    document.querySelectorAll('.level-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-level="${level}"]`).classList.add('active');
    
    // Update warning text
    const warnings = {
        mild: 'Friendly banter mode',
        medium: 'Standard roasting heat',
        spicy: 'Extra crispy roasts incoming!',
        nuclear: '☢️ MAXIMUM DESTRUCTION MODE ☢️'
    };
    
    document.getElementById('currentLevel').textContent = level.toUpperCase();
    document.getElementById('roastWarning').querySelector('p').innerHTML = 
        `⚠️ Current Level: <span id="currentLevel">${level.toUpperCase()}</span> - ${warnings[level]}`;
    
    // Change background effects based on level
    updateBackgroundLevel(level);
    
    // Update roast content intensity
    updateRoastContent(level);
    
    // Show level change feedback
    showLevelChangeEffect(level);
    
    // Play level change sound
    playLevelChangeSound(level);
}

function updateBackgroundLevel(level) {
    const body = document.body;
    const fireBackground = document.querySelector('.fire-bg');
    
    // Remove existing level classes
    body.classList.remove('roast-mild', 'roast-medium', 'roast-spicy', 'roast-nuclear');
    
    // Add new level class
    body.classList.add(`roast-${level}`);
    
    // Update flame intensity
    if (fireBackground) {
        const flames = fireBackground.querySelector('.flames');
        const sparks = fireBackground.querySelector('.sparks');
        
        switch(level) {
            case 'mild':
                flames.style.opacity = '0.3';
                sparks.style.opacity = '0.2';
                flames.style.animationDuration = '4s';
                break;
            case 'medium':
                flames.style.opacity = '0.5';
                sparks.style.opacity = '0.4';
                flames.style.animationDuration = '3s';
                break;
            case 'spicy':
                flames.style.opacity = '0.7';
                sparks.style.opacity = '0.6';
                flames.style.animationDuration = '2s';
                break;
            case 'nuclear':
                flames.style.opacity = '1';
                sparks.style.opacity = '1';
                flames.style.animationDuration = '1s';
                // Add nuclear glow effect
                body.style.filter = 'drop-shadow(0 0 20px #ff0000)';
                break;
        }
    }
}

function updateRoastContent(level) {
    const roastCards = document.querySelectorAll('.roast-card');
    
    roastCards.forEach(card => {
        const roastMeter = card.querySelector('.roast-level');
        const roastQuote = card.querySelector('.roast-quote');
        const roastRating = card.querySelector('.roast-rating');
        
        // Update roast meter based on level
        let meterMultiplier;
        switch(level) {
            case 'mild': meterMultiplier = 0.6; break;
            case 'medium': meterMultiplier = 0.8; break;
            case 'spicy': meterMultiplier = 1.0; break;
            case 'nuclear': meterMultiplier = 1.2; break;
        }
        
        const baseWidth = parseInt(roastMeter.style.width) || 80;
        const newWidth = Math.min(100, baseWidth * meterMultiplier);
        roastMeter.style.width = newWidth + '%';
        
        // Update meter color
        const colors = {
            mild: 'linear-gradient(45deg, #4CAF50, #45a049)',
            medium: 'linear-gradient(45deg, #ff9800, #ff6b35)',
            spicy: 'linear-gradient(45deg, #ff4500, #ff0000)',
            nuclear: 'linear-gradient(45deg, #ff0000, #8b0000, #ff0000)'
        };
        roastMeter.style.background = colors[level];
        
        // Add intensity effects
        if (level === 'nuclear') {
            roastMeter.style.boxShadow = '0 0 15px #ff0000';
            roastMeter.style.animation = 'nuclearPulse 1s ease-in-out infinite alternate';
            card.style.borderColor = '#ff0000';
            card.style.boxShadow = '0 0 25px rgba(255, 0, 0, 0.6)';
        } else {
            roastMeter.style.boxShadow = '';
            roastMeter.style.animation = '';
            card.style.borderColor = '';
            card.style.boxShadow = '';
        }
    });
}

function showLevelChangeEffect(level) {
    const effect = document.createElement('div');
    effect.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 3rem;
        font-weight: bold;
        color: white;
        text-shadow: 0 0 20px currentColor;
        z-index: 10002;
        pointer-events: none;
        animation: levelChangeEffect 2s ease-out forwards;
    `;
    
    const levelMessages = {
        mild: '🌱 MILD ROAST ACTIVATED',
        medium: '🔥 MEDIUM HEAT ENGAGED',
        spicy: '🌶️ SPICY MODE ON!',
        nuclear: '☢️ NUCLEAR DESTRUCTION!'
    };
    
    const colors = {
        mild: '#4CAF50',
        medium: '#ff9800',
        spicy: '#ff4500',
        nuclear: '#ff0000'
    };
    
    effect.textContent = levelMessages[level];
    effect.style.color = colors[level];
    
    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 2000);
}

function playLevelChangeSound(level) {
    if (!window.AudioContext) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const frequencies = {
        mild: [220, 330],
        medium: [330, 440],
        spicy: [440, 660],
        nuclear: [660, 880, 1100]
    };
    
    const freqs = frequencies[level];
    oscillator.frequency.setValueAtTime(freqs[0], audioContext.currentTime);
    
    freqs.forEach((freq, index) => {
        if (index > 0) {
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.1);
        }
    });
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Warning screen management
function enterRoastZone() {
    document.getElementById('warningScreen').classList.remove('active');
    showAchievement('Secret Discovered!', 'You found the legendary roast zone! 🔥');
    
    // Add some dramatic entrance effects
    document.querySelectorAll('.roast-card').forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'cardEntrance 0.8s ease-out forwards';
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
        }, index * 200);
    });
}

function goBack() {
    window.location.href = 'index.html';
}

// Roast sound effects
function playRoastSound(victim) {
    // Create audio context for roast sound effects
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Different roast sounds for each victim
    switch(victim) {
        case 'jawad':
            // Nerdy beeping sound
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.5);
            break;
        case 'zulkernain':
            // Sleepy/slow sound
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 1);
            break;
        case 'abdi':
            // Overconfident fanfare
            oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.2);
            oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.4);
            break;
        case 'nasir':
            // Confused wobble
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(220, audioContext.currentTime + 0.3);
            oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.6);
            break;
    }
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
    
    // Visual feedback
    const button = event.target.closest('.roast-btn');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-volume-up"></i> ROASTED! 🔥';
    button.style.background = 'linear-gradient(45deg, #ff6b35, #ff8c42)';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = 'linear-gradient(45deg, #ff4500, #ff6b35)';
    }, 2000);
    
    // Create roast particles
    createRoastParticles(button);
    
    // Show roast reaction
    showRoastReaction(victim);
}

// Create roast particle effect
function createRoastParticles(button) {
    const rect = button.getBoundingClientRect();
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.textContent = ['🔥', '💀', '😂', '⚡'][Math.floor(Math.random() * 4)];
        particle.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width/2}px;
            top: ${rect.top + rect.height/2}px;
            font-size: 20px;
            pointer-events: none;
            z-index: 10000;
            animation: roastParticle 2s ease-out forwards;
        `;
        
        const angle = (i / 8) * Math.PI * 2;
        const distance = 100 + Math.random() * 50;
        const endX = rect.left + rect.width/2 + Math.cos(angle) * distance;
        const endY = rect.top + rect.height/2 + Math.sin(angle) * distance;
        
        particle.style.setProperty('--endX', endX + 'px');
        particle.style.setProperty('--endY', endY + 'px');
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 2000);
    }
}

// Show roast reaction
function showRoastReaction(victim) {
    const reactions = {
        jawad: ['🤓 "Actually, that\'s not entirely accurate..."', '📚 *adjusts glasses*', '💻 "Let me Google that..."'],
        zulkernain: ['😴 "Huh? What happened?"', '☕ "Need more coffee..."', '💤 *snores*'],
        abdi: ['😎 "I\'m still the best though"', '💪 "That\'s not even my final form"', '🚀 "Watch me code!"'],
        nasir: ['🤔 "Wait, what was the question?"', '🧭 "I think I\'m lost again"', '💡 "Oh! I get it now... wait, no"']
    };
    
    const victimReactions = reactions[victim];
    const randomReaction = victimReactions[Math.floor(Math.random() * victimReactions.length)];
    
    const reactionPopup = document.createElement('div');
    reactionPopup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        font-size: 1.2rem;
        z-index: 10001;
        border: 2px solid #ff4500;
        animation: reactionPop 3s ease-in-out forwards;
    `;
    
    reactionPopup.textContent = randomReaction;
    document.body.appendChild(reactionPopup);
    
    setTimeout(() => reactionPopup.remove(), 3000);
}

// Achievement system
function showAchievement(title, description) {
    const popup = document.getElementById('roastAchievement');
    document.getElementById('roastAchievementTitle').textContent = title;
    document.getElementById('roastAchievementText').textContent = description;
    
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 4000);
}

// Enhanced card interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add hover sound effects to cards
    document.querySelectorAll('.roast-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Subtle hover sound
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.02, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            
            // Visual effect
            this.style.filter = 'brightness(1.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.filter = 'brightness(1)';
        });
    });
    
    // Add click effects to roast cards
    document.querySelectorAll('.roast-card').forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
    
    // Animate roast meters on page load
    setTimeout(() => {
        document.querySelectorAll('.roast-level').forEach(meter => {
            const width = meter.style.width;
            meter.style.width = '0%';
            meter.style.transition = 'width 2s ease-out';
            setTimeout(() => {
                meter.style.width = width;
            }, 100);
        });
    }, 500);
    
    // Add typing effect to quotes
    document.querySelectorAll('.roast-quote').forEach((quote, index) => {
        const text = quote.textContent;
        quote.textContent = '';
        
        setTimeout(() => {
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    quote.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 50);
        }, index * 1000 + 1000);
    });
});

// Add entrance animations CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes cardEntrance {
        from {
            opacity: 0;
            transform: translateY(50px) rotateX(-10deg);
        }
        to {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
        }
    }
    
    @keyframes roastParticle {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(
                calc(var(--endX) - var(--startX, 0px)), 
                calc(var(--endY) - var(--startY, 0px))
            ) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes reactionPop {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
        10% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 1;
        }
        20% {
            transform: translate(-50%, -50%) scale(1);
        }
        80% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Easter egg: Konami code for ultimate roast
let konamiSequence = [];
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', function(e) {
    konamiSequence.push(e.code);
    
    if (konamiSequence.length > konamiCode.length) {
        konamiSequence.shift();
    }
    
    if (konamiSequence.length === konamiCode.length && 
        konamiSequence.every((code, index) => code === konamiCode[index])) {
        
        // Ultimate roast mode
        document.body.style.animation = 'ultimateRoast 3s ease-in-out';
        
        showAchievement('ULTIMATE ROAST UNLOCKED!', 'You discovered the secret roast code! 🔥💀🔥');
        
        // Make all roast meters go to 100%
        document.querySelectorAll('.roast-level').forEach(meter => {
            meter.style.width = '100%';
            meter.style.background = 'linear-gradient(45deg, #ff0000, #ff4500, #ff6b35)';
        });
        
        konamiSequence = [];
    }
});

// Add ultimate roast animation
const ultimateStyle = document.createElement('style');
ultimateStyle.textContent = `
    @keyframes ultimateRoast {
        0%, 100% { filter: hue-rotate(0deg) brightness(1); }
        25% { filter: hue-rotate(90deg) brightness(1.2); }
        50% { filter: hue-rotate(180deg) brightness(1.4); }
        75% { filter: hue-rotate(270deg) brightness(1.2); }
    }
`;
document.head.appendChild(ultimateStyle);

// Auto-play entrance if coming from another page
if (document.referrer && !document.referrer.includes('secret-roast.html')) {
    setTimeout(() => {
        if (document.getElementById('warningScreen').classList.contains('active')) {
            // Auto-show for dramatic effect, but only if they haven't interacted
            setTimeout(() => {
                showAchievement('Hidden Page Found!', 'You discovered a secret page! 👀');
            }, 2000);
        }
    }, 1000);
}