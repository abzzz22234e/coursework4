// Secret Roast Zone JavaScript

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