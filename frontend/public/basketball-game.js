// Basketball Hoop Master Game - Enhanced with Custom Balls
class BasketballGame {
    constructor() {
        this.canvas = document.getElementById('basketballCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game state
        this.gameMode = 'classic';
        this.score = 0;
        this.streak = 0;
        this.bestStreak = 0;
        this.shotsMade = 0;
        this.shotsAttempted = 0;
        this.timeLeft = 60;
        this.gameRunning = false;
        this.gameTimer = null;
        
        // Basketball physics
        this.ball = {
            x: 100,
            y: 500,
            vx: 0,
            vy: 0,
            radius: 15,
            isDragging: false,
            launched: false,
            type: 'classic' // classic, aanane-fireball, ice-ball, rainbow-ball, lightning-ball
        };
        
        // Custom ball types
        this.ballTypes = {
            classic: {
                name: 'Classic Basketball',
                colors: ['#ff8c42', '#ff6b35'],
                effect: null,
                unlocked: true,
                description: 'The traditional orange basketball'
            },
            'aanane-fireball': {
                name: 'Aanane Fireball',
                colors: ['#ff4500', '#ff0000', '#ffff00'],
                effect: 'fire',
                unlocked: true,
                description: 'Mr. Aanane\'s legendary flaming basketball! 🔥'
            },
            'ice-ball': {
                name: 'Frozen Shot',
                colors: ['#00ffff', '#87ceeb', '#ffffff'],
                effect: 'ice',
                unlocked: true,
                description: 'Cool as ice, hot as fire! ❄️'
            },
            'rainbow-ball': {
                name: 'Rainbow Power',
                colors: ['#ff0000', '#ff7700', '#ffff00', '#00ff00', '#0077ff', '#4400ff', '#9900ff'],
                effect: 'rainbow',
                unlocked: true,
                description: 'Taste the rainbow! 🌈'
            },
            'lightning-ball': {
                name: 'Thunder Strike',
                colors: ['#ffff00', '#ffffff', '#9999ff'],
                effect: 'lightning',
                unlocked: true,
                description: 'Electrifying shots! ⚡'
            }
        };
        
        // Hoop
        this.hoop = {
            x: 650,
            y: 200,
            width: 80,
            height: 10,
            rimLeft: 650,
            rimRight: 730
        };
        
        // Power meter
        this.powerMeter = {
            power: 0,
            charging: false,
            maxPower: 100
        };
        
        // Particle system
        this.particles = [];
        
        // Effect particles for special balls
        this.effectParticles = [];
        
        // Targets for precision mode
        this.targets = [];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadStats();
        this.updateDisplay();
        this.startAnimationLoop();
        this.setupBallSelector();
    }
    
    setupBallSelector() {
        // Create ball selector UI in game screen
        const gameInterface = document.querySelector('.game-interface');
        if (!document.getElementById('ballSelector')) {
            const ballSelectorHTML = `
                <div id="ballSelector" class="ball-selector">
                    <h4>🏀 Ball Selection</h4>
                    <div class="ball-options">
                        ${Object.entries(this.ballTypes).map(([key, ball]) => `
                            <div class="ball-option ${key === 'classic' ? 'active' : ''}" 
                                 data-ball-type="${key}" 
                                 title="${ball.description}">
                                <div class="ball-preview" data-type="${key}"></div>
                                <span>${ball.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            // Add to game interface
            const gameControls = document.querySelector('.game-controls');
            gameControls.insertAdjacentHTML('beforebegin', ballSelectorHTML);
            
            // Bind ball selection events
            this.bindBallSelector();
        }
    }
    
    bindBallSelector() {
        document.querySelectorAll('.ball-option').forEach(option => {
            option.addEventListener('click', () => {
                const ballType = option.getAttribute('data-ball-type');
                this.selectBall(ballType);
                
                // Update active state
                document.querySelectorAll('.ball-option').forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            });
        });
    }
    
    selectBall(ballType) {
        this.ball.type = ballType;
        const ballData = this.ballTypes[ballType];
        
        // Show selection feedback
        this.showFeedback(`Selected: ${ballData.name}! ${ballData.description}`, 'info');
        
        // Play selection sound
        this.playSound('select');
    }
    
    bindEvents() {
        // Game mode selection
        document.querySelectorAll('.mode-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                this.gameMode = card.getAttribute('data-mode');
            });
        });
        
        // Mouse controls for ball
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        
        // Touch controls for mobile
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
        
        // Prevent context menu
        this.canvas.addEventListener('contextmenu', e => e.preventDefault());
    }
    
    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (this.isNearBall(x, y) && !this.ball.launched) {
            this.ball.isDragging = true;
            this.powerMeter.charging = true;
            this.canvas.style.cursor = 'grabbing';
        }
    }
    
    handleMouseMove(e) {
        if (!this.ball.isDragging) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate power based on distance from ball
        const dx = x - this.ball.x;
        const dy = y - this.ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        this.powerMeter.power = Math.min(distance / 3, this.powerMeter.maxPower);
    }
    
    handleMouseUp(e) {
        if (!this.ball.isDragging) return;
        
        this.shootBall(e);
        this.ball.isDragging = false;
        this.powerMeter.charging = false;
        this.canvas.style.cursor = 'default';
    }
    
    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        this.handleMouseDown(touch);
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        this.handleMouseMove(touch);
    }
    
    handleTouchEnd(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        this.handleMouseUp(touch);
    }
    
    isNearBall(x, y) {
        const dx = x - this.ball.x;
        const dy = y - this.ball.y;
        return Math.sqrt(dx * dx + dy * dy) < this.ball.radius + 20;
    }
    
    shootBall(e) {
        if (this.ball.launched) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Calculate launch velocity based on power and direction
        const dx = mouseX - this.ball.x;
        const dy = mouseY - this.ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 20) {
            const power = this.powerMeter.power / 100;
            this.ball.vx = (dx / distance) * power * 15;
            this.ball.vy = (dy / distance) * power * 15;
            this.ball.launched = true;
            this.shotsAttempted++;
            
            this.playSound('shoot');
            this.updateDisplay();
        }
        
        this.powerMeter.power = 0;
    }
    
    updatePhysics() {
        if (!this.ball.launched) return;
        
        // Apply gravity
        this.ball.vy += 0.5;
        
        // Update position
        this.ball.x += this.ball.vx;
        this.ball.y += this.ball.vy;
        
        // Air resistance
        this.ball.vx *= 0.995;
        
        // Check boundaries
        if (this.ball.x < this.ball.radius || this.ball.x > this.canvas.width - this.ball.radius) {
            this.ball.vx *= -0.6;
            this.ball.x = Math.max(this.ball.radius, Math.min(this.canvas.width - this.ball.radius, this.ball.x));
        }
        
        if (this.ball.y > this.canvas.height - this.ball.radius) {
            this.ball.y = this.canvas.height - this.ball.radius;
            this.ball.vy *= -0.4;
            this.ball.vx *= 0.8;
            
            // Reset ball if it stops bouncing
            if (Math.abs(this.ball.vy) < 1 && Math.abs(this.ball.vx) < 1) {
                this.resetBall();
            }
        }
        
        // Check hoop collision
        this.checkHoopCollision();
        
        // Update particles
        this.updateParticles();
    }
    
    checkHoopCollision() {
        const ballBottom = this.ball.y + this.ball.radius;
        const ballTop = this.ball.y - this.ball.radius;
        const ballLeft = this.ball.x - this.ball.radius;
        const ballRight = this.ball.x + this.ball.radius;
        
        // Check if ball passes through hoop
        if (ballTop < this.hoop.y + this.hoop.height &&
            ballBottom > this.hoop.y &&
            ballLeft > this.hoop.rimLeft &&
            ballRight < this.hoop.rimRight &&
            this.ball.vy > 0) {
            
            this.scoreBasket();
        }
        
        // Rim collision
        if (ballBottom > this.hoop.y &&
            ballTop < this.hoop.y + this.hoop.height) {
            
            if ((ballRight > this.hoop.rimLeft && ballLeft < this.hoop.rimLeft + 5) ||
                (ballLeft < this.hoop.rimRight && ballRight > this.hoop.rimRight - 5)) {
                
                this.ball.vx *= -0.5;
                this.ball.vy *= 0.3;
                this.playSound('rim');
                this.createParticles(this.ball.x, this.ball.y, '#ff6600', 5);
            }
        }
    }
    
    scoreBasket() {
        this.score += this.calculatePoints();
        this.shotsMade++;
        this.streak++;
        this.bestStreak = Math.max(this.bestStreak, this.streak);
        
        this.playSound('score');
        this.createParticles(this.hoop.x + this.hoop.width/2, this.hoop.y, '#00ff00', 15);
        this.showFeedback(this.getScoreMessage(), 'success');
        
        // Check for achievements
        this.checkAchievements();
        
        this.updateDisplay();
        this.resetBall();
    }
    
    calculatePoints() {
        let points = 2;
        
        // Streak bonus
        if (this.streak >= 5) points += 1;
        if (this.streak >= 10) points += 2;
        
        // Perfect shot bonus (through center)
        const centerX = this.hoop.x + this.hoop.width/2;
        const ballDistanceFromCenter = Math.abs(this.ball.x - centerX);
        if (ballDistanceFromCenter < 10) points += 1;
        
        return points;
    }
    
    getScoreMessage() {
        if (this.streak >= 10) return '🔥 ON FIRE! +' + this.calculatePoints();
        if (this.streak >= 5) return '⚡ HOT STREAK! +' + this.calculatePoints();
        if (this.streak >= 3) return '✨ NICE SHOT! +' + this.calculatePoints();
        return '🏀 BASKET! +' + this.calculatePoints();
    }
    
    resetBall() {
        setTimeout(() => {
            this.ball.x = 100;
            this.ball.y = 500;
            this.ball.vx = 0;
            this.ball.vy = 0;
            this.ball.launched = false;
            this.ball.isDragging = false;
        }, 1000);
    }
    
    createParticles(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                color: color,
                life: 60,
                maxLife: 60
            });
        }
    }
    
    updateParticles() {
        // Update regular particles
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.2;
            particle.life--;
            return particle.life > 0;
        });
        
        // Update effect particles
        this.effectParticles = this.effectParticles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1;
            particle.life--;
            return particle.life > 0;
        });
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw court
        this.drawCourt();
        
        // Draw hoop
        this.drawHoop();
        
        // Draw targets (precision mode)
        if (this.gameMode === 'precision') {
            this.drawTargets();
        }
        
        // Draw ball
        this.drawBall();
        
        // Draw particles
        this.drawParticles();
        
        // Draw trajectory line
        if (this.ball.isDragging) {
            this.drawTrajectory();
        }
        
        // Draw power meter
        if (this.powerMeter.charging) {
            this.drawPowerMeter();
        }
    }
    
    drawCourt() {
        // Court background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#4a5d23');
        gradient.addColorStop(1, '#2d3516');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Court lines
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([]);
        
        // Free throw line
        this.ctx.beginPath();
        this.ctx.moveTo(500, 350);
        this.ctx.lineTo(700, 350);
        this.ctx.stroke();
        
        // Three-point arc
        this.ctx.beginPath();
        this.ctx.arc(this.hoop.x + this.hoop.width/2, this.hoop.y + 50, 200, 0.3, Math.PI - 0.3);
        this.ctx.stroke();
    }
    
    drawHoop() {
        // Backboard
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(this.hoop.x + 20, this.hoop.y - 60, 10, 80);
        
        // Rim
        this.ctx.strokeStyle = '#ff6600';
        this.ctx.lineWidth = 8;
        this.ctx.beginPath();
        this.ctx.moveTo(this.hoop.rimLeft, this.hoop.y);
        this.ctx.lineTo(this.hoop.rimRight, this.hoop.y);
        this.ctx.stroke();
        
        // Net
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            const x = this.hoop.rimLeft + (i / 7) * this.hoop.width;
            this.ctx.beginPath();
            this.ctx.moveTo(x, this.hoop.y);
            this.ctx.quadraticCurveTo(x + 5, this.hoop.y + 20, x - 5, this.hoop.y + 30);
            this.ctx.stroke();
        }
    }
    
    drawBall() {
        const ballData = this.ballTypes[this.ball.type];
        
        // Ball shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(this.ball.x, this.canvas.height - 5, this.ball.radius * 0.8, this.ball.radius * 0.3, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw special effects before ball
        this.drawBallEffects();
        
        // Ball gradient based on type
        const gradient = this.ctx.createRadialGradient(
            this.ball.x - 5, this.ball.y - 5, 0,
            this.ball.x, this.ball.y, this.ball.radius
        );
        
        if (ballData.colors.length > 2) {
            // Multi-color gradient for special balls
            ballData.colors.forEach((color, index) => {
                gradient.addColorStop(index / (ballData.colors.length - 1), color);
            });
        } else {
            // Standard two-color gradient
            gradient.addColorStop(0, ballData.colors[0]);
            gradient.addColorStop(1, ballData.colors[1] || ballData.colors[0]);
        }
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Special ball effects
        switch(ballData.effect) {
            case 'fire':
                this.drawFireEffect();
                break;
            case 'ice':
                this.drawIceEffect();
                break;
            case 'rainbow':
                this.drawRainbowEffect();
                break;
            case 'lightning':
                this.drawLightningEffect();
                break;
        }
        
        // Ball lines (classic basketball pattern)
        this.ctx.strokeStyle = this.ball.type === 'aanane-fireball' ? '#000000' : '#333333';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius - 2, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Ball seams
        if (this.ball.type === 'classic' || this.ball.type === 'aanane-fireball') {
            this.ctx.beginPath();
            this.ctx.moveTo(this.ball.x - this.ball.radius + 2, this.ball.y);
            this.ctx.lineTo(this.ball.x + this.ball.radius - 2, this.ball.y);
            this.ctx.moveTo(this.ball.x, this.ball.y - this.ball.radius + 2);
            this.ctx.lineTo(this.ball.x, this.ball.y + this.ball.radius - 2);
            this.ctx.stroke();
        }
        
        // Draw trailing effect particles during flight
        if (this.ball.launched && ballData.effect) {
            this.createTrailParticles();
        }
    }
    
    drawBallEffects() {
        const ballData = this.ballTypes[this.ball.type];
        
        switch(ballData.effect) {
            case 'fire':
                // Pulsing glow
                this.ctx.shadowColor = '#ff4500';
                this.ctx.shadowBlur = 20 + Math.sin(Date.now() * 0.01) * 10;
                break;
            case 'ice':
                this.ctx.shadowColor = '#00ffff';
                this.ctx.shadowBlur = 15;
                break;
            case 'lightning':
                this.ctx.shadowColor = '#ffff00';
                this.ctx.shadowBlur = 25 + Math.random() * 15;
                break;
            case 'rainbow':
                this.ctx.shadowColor = `hsl(${Date.now() * 0.1 % 360}, 100%, 50%)`;
                this.ctx.shadowBlur = 20;
                break;
        }
    }
    
    drawFireEffect() {
        // Create flame particles around the ball
        for (let i = 0; i < 3; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = this.ball.radius + Math.random() * 10;
            const x = this.ball.x + Math.cos(angle) * distance;
            const y = this.ball.y + Math.sin(angle) * distance;
            
            this.ctx.fillStyle = `rgba(255, ${100 + Math.random() * 100}, 0, ${0.3 + Math.random() * 0.4})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 2 + Math.random() * 3, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Reset shadow
        this.ctx.shadowBlur = 0;
    }
    
    drawIceEffect() {
        // Ice crystals
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x1 = this.ball.x + Math.cos(angle) * (this.ball.radius - 5);
            const y1 = this.ball.y + Math.sin(angle) * (this.ball.radius - 5);
            const x2 = this.ball.x + Math.cos(angle) * (this.ball.radius + 3);
            const y2 = this.ball.y + Math.sin(angle) * (this.ball.radius + 3);
            
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
        
        this.ctx.shadowBlur = 0;
    }
    
    drawRainbowEffect() {
        // Rainbow trail effect
        this.ctx.strokeStyle = `hsl(${Date.now() * 0.2 % 360}, 100%, 50%)`;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius + 5, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.shadowBlur = 0;
    }
    
    drawLightningEffect() {
        // Lightning bolts around ball
        if (Math.random() < 0.3) {
            this.ctx.strokeStyle = '#ffff00';
            this.ctx.lineWidth = 2;
            
            for (let i = 0; i < 2; i++) {
                const startAngle = Math.random() * Math.PI * 2;
                const x1 = this.ball.x + Math.cos(startAngle) * this.ball.radius;
                const y1 = this.ball.y + Math.sin(startAngle) * this.ball.radius;
                const x2 = this.ball.x + Math.cos(startAngle) * (this.ball.radius + 15);
                const y2 = this.ball.y + Math.sin(startAngle) * (this.ball.radius + 15);
                
                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2 + (Math.random() - 0.5) * 10, y2 + (Math.random() - 0.5) * 10);
                this.ctx.stroke();
            }
        }
        
        this.ctx.shadowBlur = 0;
    }
    
    createTrailParticles() {
        const ballData = this.ballTypes[this.ball.type];
        
        if (Math.random() < 0.5) {
            let color, size;
            
            switch(ballData.effect) {
                case 'fire':
                    color = ['#ff4500', '#ff6600', '#ffff00'][Math.floor(Math.random() * 3)];
                    size = 2 + Math.random() * 3;
                    break;
                case 'ice':
                    color = ['#00ffff', '#87ceeb', '#ffffff'][Math.floor(Math.random() * 3)];
                    size = 1 + Math.random() * 2;
                    break;
                case 'rainbow':
                    color = `hsl(${Math.random() * 360}, 100%, 50%)`;
                    size = 2 + Math.random() * 2;
                    break;
                case 'lightning':
                    color = ['#ffff00', '#ffffff', '#9999ff'][Math.floor(Math.random() * 3)];
                    size = 1 + Math.random() * 3;
                    break;
                default:
                    return;
            }
            
            this.effectParticles.push({
                x: this.ball.x + (Math.random() - 0.5) * this.ball.radius,
                y: this.ball.y + (Math.random() - 0.5) * this.ball.radius,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                color: color,
                size: size,
                life: 30,
                maxLife: 30
            });
        }
    }
    
    drawParticles() {
        // Draw regular particles
        this.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            this.ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Draw special effect particles
        this.effectParticles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            this.ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    updateParticles() {
        // Update regular particles
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.2;
            particle.life--;
            return particle.life > 0;
        });
        
        // Update effect particles
        this.effectParticles = this.effectParticles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1;
            particle.life--;
            return particle.life > 0;
        });
    }
    
    drawTrajectory() {
        const steps = 20;
        let x = this.ball.x;
        let y = this.ball.y;
        let vx = this.ball.vx;
        let vy = this.ball.vy;
        
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        
        for (let i = 0; i < steps; i++) {
            vy += 0.5;
            x += vx;
            y += vy;
            vx *= 0.995;
            
            if (y > this.canvas.height) break;
            
            this.ctx.lineTo(x, y);
        }
        
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
    
    drawPowerMeter() {
        const meterX = 50;
        const meterY = 100;
        const meterHeight = 200;
        const meterWidth = 20;
        
        // Background
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fillRect(meterX, meterY, meterWidth, meterHeight);
        
        // Power fill
        const fillHeight = (this.powerMeter.power / this.powerMeter.maxPower) * meterHeight;
        const color = this.powerMeter.power < 50 ? '#00ff00' : this.powerMeter.power < 80 ? '#ffff00' : '#ff0000';
        
        this.ctx.fillStyle = color;
        this.ctx.fillRect(meterX, meterY + meterHeight - fillHeight, meterWidth, fillHeight);
        
        // Border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(meterX, meterY, meterWidth, meterHeight);
        
        // Label
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '14px Inter';
        this.ctx.fillText('Power', meterX - 5, meterY - 10);
    }
    
    startGame() {
        this.score = 0;
        this.streak = 0;
        this.shotsMade = 0;
        this.shotsAttempted = 0;
        this.resetBall();
        
        switch(this.gameMode) {
            case 'classic':
                this.timeLeft = 60;
                this.startTimer();
                break;
            case 'streak':
                this.timeLeft = 0;
                break;
            case 'precision':
                this.timeLeft = 0;
                this.setupPrecisionMode();
                break;
        }
        
        this.gameRunning = true;
        this.updateDisplay();
        showScreen('gameScreen');
    }
    
    startTimer() {
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }
    
    setupPrecisionMode() {
        // Create moving targets
        this.targets = [];
        for (let i = 0; i < 3; i++) {
            this.targets.push({
                x: 200 + i * 200,
                y: 150 + Math.random() * 100,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: 30,
                hit: false
            });
        }
    }
    
    drawTargets() {
        this.targets.forEach(target => {
            if (target.hit) return;
            
            this.ctx.strokeStyle = '#ff0000';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
            this.ctx.stroke();
            
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(target.x, target.y, target.radius * 0.5, 0, Math.PI * 2);
            this.ctx.stroke();
        });
    }
    
    pauseGame() {
        this.gameRunning = false;
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
        }
    }
    
    endGame() {
        this.gameRunning = false;
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        
        this.saveStats();
        this.showGameOver();
    }
    
    showGameOver() {
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalStreak').textContent = this.bestStreak;
        document.getElementById('shotsMade').textContent = this.shotsMade;
        document.getElementById('accuracy').textContent = this.shotsAttempted > 0 ? 
            Math.round((this.shotsMade / this.shotsAttempted) * 100) + '%' : '0%';
        
        // Show achievements
        this.displayAchievements();
        
        showScreen('gameOverScreen');
    }
    
    checkAchievements() {
        if (this.streak === 5) {
            this.showAchievement('Hot Streak!', 'Made 5 shots in a row!');
        }
        if (this.streak === 10) {
            this.showAchievement('On Fire!', 'Made 10 shots in a row!');
        }
        if (this.score >= 100) {
            this.showAchievement('Century!', 'Scored 100 points!');
        }
        if (this.shotsMade >= 20) {
            this.showAchievement('Sharpshooter!', 'Made 20 baskets!');
        }
    }
    
    displayAchievements() {
        const achievementsDiv = document.getElementById('gameAchievements');
        achievementsDiv.innerHTML = '';
        
        const achievements = [];
        if (this.bestStreak >= 5) achievements.push('🔥 Hot Streak Master');
        if (this.score >= 100) achievements.push('💯 Century Club');
        if (this.shotsMade >= 20) achievements.push('🎯 Sharpshooter');
        if (this.shotsAttempted > 0 && (this.shotsMade / this.shotsAttempted) >= 0.8) {
            achievements.push('🏆 Accuracy Expert');
        }
        
        achievements.forEach(achievement => {
            const div = document.createElement('div');
            div.className = 'achievement-badge';
            div.textContent = achievement;
            achievementsDiv.appendChild(div);
        });
    }
    
    showFeedback(message, type) {
        const feedback = document.getElementById('gameFeedback');
        const feedbackText = document.getElementById('feedbackText');
        
        feedbackText.textContent = message;
        feedback.className = `game-feedback ${type}`;
        feedback.style.opacity = '1';
        
        setTimeout(() => {
            feedback.style.opacity = '0';
        }, 2000);
    }
    
    updateDisplay() {
        document.getElementById('playerScore').textContent = this.score;
        document.getElementById('playerStreak').textContent = this.streak;
        document.getElementById('timeRemaining').textContent = this.timeLeft;
        
        document.getElementById('currentScore').textContent = this.score;
        document.getElementById('currentStreak').textContent = this.streak;
        document.getElementById('gameTimer').textContent = this.timeLeft;
        document.getElementById('shotsRemaining').textContent = this.gameMode === 'precision' ? '10' : '∞';
    }
    
    startAnimationLoop() {
        const animate = () => {
            if (this.gameRunning) {
                this.updatePhysics();
            }
            this.draw();
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    showAchievement(title, description) {
        const popup = document.getElementById('achievementPopup');
        document.getElementById('achievementTitle').textContent = title;
        document.getElementById('achievementDescription').textContent = description;
        
        popup.classList.add('show');
        setTimeout(() => popup.classList.remove('show'), 3000);
        
        this.playSound('achievement');
    }
    
    shareScore() {
        const text = `I just scored ${this.score} points in Basketball Hoop Master! 🏀🔥`;
        if (navigator.share) {
            navigator.share({
                title: 'Basketball Hoop Master',
                text: text,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(text);
            this.showAchievement('Score Copied!', 'Score copied to clipboard!');
        }
    }
    
    loadStats() {
        const saved = localStorage.getItem('basketballStats');
        if (saved) {
            const stats = JSON.parse(saved);
            document.getElementById('classicBest').textContent = stats.classicBest || 0;
            document.getElementById('streakBest').textContent = stats.streakBest || 0;
            document.getElementById('precisionBest').textContent = stats.precisionBest || 0;
        }
    }
    
    saveStats() {
        const stats = JSON.parse(localStorage.getItem('basketballStats') || '{}');
        
        stats[this.gameMode + 'Best'] = Math.max(stats[this.gameMode + 'Best'] || 0, this.score);
        stats.totalGames = (stats.totalGames || 0) + 1;
        stats.totalScore = (stats.totalScore || 0) + this.score;
        
        localStorage.setItem('basketballStats', JSON.stringify(stats));
        this.loadStats();
    }
    
    playSound(type) {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        switch(type) {
            case 'shoot':
                oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(180, this.audioContext.currentTime + 0.1);
                break;
            case 'score':
                oscillator.frequency.setValueAtTime(523, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(784, this.audioContext.currentTime + 0.3);
                break;
            case 'rim':
                oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.2);
                break;
            case 'achievement':
                oscillator.frequency.setValueAtTime(523, this.audioContext.currentTime);
                oscillator.frequency.setValueAtTime(659, this.audioContext.currentTime + 0.1);
                oscillator.frequency.setValueAtTime(784, this.audioContext.currentTime + 0.2);
                break;
            case 'select':
                oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(550, this.audioContext.currentTime + 0.2);
                break;
        }
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }
}

// Game instance
let basketballGame;

// Screen management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function startGame() {
    if (!basketballGame) {
        basketballGame = new BasketballGame();
    }
    basketballGame.startGame();
}

function pauseGame() {
    if (basketballGame) {
        basketballGame.pauseGame();
    }
}

function showStats() {
    // Implementation for showing detailed statistics
    alert('Statistics feature coming soon!');
}

function shareScore() {
    if (basketballGame) {
        basketballGame.shareScore();
    }
}

// Initialize game on page load
document.addEventListener('DOMContentLoaded', function() {
    basketballGame = new BasketballGame();
});