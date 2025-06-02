// Aanane Snake Game - Fully Functional
class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        
        // Game state
        this.snake = [{x: 10, y: 10}];
        this.food = {};
        this.coins = [];
        this.powerups = [];
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameCoins = 0;
        this.level = 1;
        this.gameSpeed = 200;
        this.gameRunning = false;
        this.gamePaused = false;
        
        // Customization
        this.snakeColor = 'classic';
        this.snakeFlag = null;
        this.selectedSnake = 'normal';
        this.selectedMap = 'classic';
        
        // Power-up types
        this.powerupTypes = ['speed', 'slow', 'double', 'shrink'];
        
        this.init();
    }
    
    init() {
        this.generateFood();
        this.generateCoin();
        this.bindEvents();
        this.loadCustomization();
        this.updateDisplay();
    }
    
    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning && !this.gamePaused) return;
            
            switch(e.key) {
                case 'ArrowUp':
                    if (this.dy === 0) { this.dx = 0; this.dy = -1; }
                    break;
                case 'ArrowDown':
                    if (this.dy === 0) { this.dx = 0; this.dy = 1; }
                    break;
                case 'ArrowLeft':
                    if (this.dx === 0) { this.dx = -1; this.dy = 0; }
                    break;
                case 'ArrowRight':
                    if (this.dx === 0) { this.dx = 1; this.dy = 0; }
                    break;
                case ' ':
                    e.preventDefault();
                    this.togglePause();
                    break;
                case 'r':
                case 'R':
                    this.restart();
                    break;
            }
        });
        
        // Touch controls for mobile
        let touchStartX, touchStartY;
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (!touchStartX || !touchStartY) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0 && this.dx === 0) { this.dx = -1; this.dy = 0; }
                else if (diffX < 0 && this.dx === 0) { this.dx = 1; this.dy = 0; }
            } else {
                if (diffY > 0 && this.dy === 0) { this.dx = 0; this.dy = -1; }
                else if (diffY < 0 && this.dy === 0) { this.dx = 0; this.dy = 1; }
            }
        });
    }
    
    loadCustomization() {
        // Load saved customization from localStorage
        this.snakeColor = localStorage.getItem('snakeColor') || 'classic';
        this.snakeFlag = localStorage.getItem('snakeFlag') || null;
        this.selectedSnake = localStorage.getItem('selectedSnake') || 'normal';
        this.selectedMap = localStorage.getItem('selectedMap') || 'classic';
        this.gameCoins = parseInt(localStorage.getItem('totalCoins')) || 0;
        
        document.getElementById('coinCount').textContent = this.gameCoins;
        document.getElementById('highScore').textContent = localStorage.getItem('highScore') || 0;
    }
    
    saveCustomization() {
        localStorage.setItem('snakeColor', this.snakeColor);
        localStorage.setItem('snakeFlag', this.snakeFlag);
        localStorage.setItem('selectedSnake', this.selectedSnake);
        localStorage.setItem('selectedMap', this.selectedMap);
        localStorage.setItem('totalCoins', this.gameCoins);
        
        if (this.score > (parseInt(localStorage.getItem('highScore')) || 0)) {
            localStorage.setItem('highScore', this.score);
            document.getElementById('highScore').textContent = this.score;
            this.showAchievement('New High Score!', `You scored ${this.score} points!`);
        }
    }
    
    generateFood() {
        this.food = {
            x: Math.floor(Math.random() * this.tileCount),
            y: Math.floor(Math.random() * this.tileCount),
            type: 'apple'
        };
    }
    
    generateCoin() {
        if (this.coins.length < 2 && Math.random() < 0.3) {
            this.coins.push({
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount),
                value: 1,
                timer: 0
            });
        }
    }
    
    generatePowerup() {
        if (this.powerups.length < 1 && Math.random() < 0.1) {
            this.powerups.push({
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount),
                type: this.powerupTypes[Math.floor(Math.random() * this.powerupTypes.length)],
                timer: 0
            });
        }
    }
    
    move() {
        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        
        // Wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }
        
        // Self collision
        for (let segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                this.gameOver();
                return;
            }
        }
        
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.generateFood();
            this.generateCoin();
            this.generatePowerup();
            this.checkLevelUp();
            this.playSound('eat');
        } else {
            this.snake.pop();
        }
        
        // Check coin collision
        this.coins = this.coins.filter(coin => {
            if (head.x === coin.x && head.y === coin.y) {
                this.score += 50;
                this.gameCoins += coin.value;
                this.playSound('coin');
                this.showFloatingText('+50', coin.x * this.gridSize, coin.y * this.gridSize, '#ffd700');
                return false;
            }
            coin.timer++;
            return coin.timer < 300; // Remove after 15 seconds
        });
        
        // Check powerup collision
        this.powerups = this.powerups.filter(powerup => {
            if (head.x === powerup.x && head.y === powerup.y) {
                this.activatePowerup(powerup.type);
                this.playSound('powerup');
                return false;
            }
            powerup.timer++;
            return powerup.timer < 200; // Remove after 10 seconds
        });
    }
    
    activatePowerup(type) {
        switch(type) {
            case 'speed':
                this.gameSpeed = Math.max(50, this.gameSpeed - 50);
                this.showAchievement('Speed Boost!', 'Snake is moving faster!');
                setTimeout(() => this.gameSpeed += 50, 5000);
                break;
            case 'slow':
                this.gameSpeed += 50;
                this.showAchievement('Slow Motion!', 'Take your time!');
                setTimeout(() => this.gameSpeed -= 50, 5000);
                break;
            case 'double':
                this.score += 100;
                this.showAchievement('Double Points!', '+100 bonus points!');
                break;
            case 'shrink':
                if (this.snake.length > 1) {
                    this.snake.pop();
                    this.showAchievement('Shrink!', 'Snake got smaller!');
                }
                break;
        }
    }
    
    checkLevelUp() {
        const newLevel = Math.floor(this.score / 100) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.gameSpeed = Math.max(80, 200 - (this.level * 10));
            this.showAchievement(`Level ${this.level}!`, 'Speed increased!');
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = this.getMapBackground();
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw map decorations
        this.drawMapDecorations();
        
        // Draw snake
        this.drawSnake();
        
        // Draw food
        this.ctx.fillStyle = '#ff0000';
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.gridSize + this.gridSize/2,
            this.food.y * this.gridSize + this.gridSize/2,
            this.gridSize/2 - 2,
            0, 2 * Math.PI
        );
        this.ctx.fill();
        
        // Draw coins
        this.coins.forEach(coin => {
            const pulse = Math.sin(coin.timer * 0.1) * 0.2 + 1;
            this.ctx.save();
            this.ctx.translate(
                coin.x * this.gridSize + this.gridSize/2,
                coin.y * this.gridSize + this.gridSize/2
            );
            this.ctx.scale(pulse, pulse);
            this.ctx.fillStyle = '#ffd700';
            this.ctx.beginPath();
            this.ctx.arc(0, 0, this.gridSize/3, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.strokeStyle = '#ffaa00';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            this.ctx.restore();
        });
        
        // Draw powerups
        this.powerups.forEach(powerup => {
            const pulse = Math.sin(powerup.timer * 0.2) * 0.3 + 1;
            this.ctx.save();
            this.ctx.translate(
                powerup.x * this.gridSize + this.gridSize/2,
                powerup.y * this.gridSize + this.gridSize/2
            );
            this.ctx.scale(pulse, pulse);
            
            switch(powerup.type) {
                case 'speed':
                    this.ctx.fillStyle = '#00ffff';
                    break;
                case 'slow':
                    this.ctx.fillStyle = '#ff00ff';
                    break;
                case 'double':
                    this.ctx.fillStyle = '#ffff00';
                    break;
                case 'shrink':
                    this.ctx.fillStyle = '#ff6600';
                    break;
            }
            
            this.ctx.beginPath();
            this.ctx.arc(0, 0, this.gridSize/3, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.restore();
        });
    }
    
    getMapBackground() {
        switch(this.selectedMap) {
            case 'neon': return '#0a0a0f';
            case 'forest': return '#2d5016';
            case 'space': return '#000011';
            default: return '#1a1a1a';
        }
    }
    
    drawMapDecorations() {
        switch(this.selectedMap) {
            case 'neon':
                // Draw neon grid
                this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
                this.ctx.lineWidth = 1;
                for (let i = 0; i <= this.tileCount; i++) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(i * this.gridSize, 0);
                    this.ctx.lineTo(i * this.gridSize, this.canvas.height);
                    this.ctx.stroke();
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, i * this.gridSize);
                    this.ctx.lineTo(this.canvas.width, i * this.gridSize);
                    this.ctx.stroke();
                }
                break;
            case 'space':
                // Draw stars
                this.ctx.fillStyle = '#ffffff';
                for (let i = 0; i < 20; i++) {
                    const x = (i * 137.5) % this.canvas.width;
                    const y = (i * 247.3) % this.canvas.height;
                    this.ctx.fillRect(x, y, 1, 1);
                }
                break;
        }
    }
    
    drawSnake() {
        this.snake.forEach((segment, index) => {
            const x = segment.x * this.gridSize;
            const y = segment.y * this.gridSize;
            
            if (this.snakeFlag) {
                this.drawFlagSegment(x, y, this.snakeFlag, index === 0);
            } else if (this.selectedSnake === 'abdi-biter') {
                this.drawAbdiBiterSegment(x, y, index === 0);
            } else {
                this.drawColorSegment(x, y, this.snakeColor, index === 0);
            }
        });
    }
    
    drawColorSegment(x, y, color, isHead) {
        let gradient;
        switch(color) {
            case 'fire':
                gradient = this.ctx.createLinearGradient(x, y, x + this.gridSize, y + this.gridSize);
                gradient.addColorStop(0, '#ff0000');
                gradient.addColorStop(1, '#ff6600');
                break;
            case 'ice':
                gradient = this.ctx.createLinearGradient(x, y, x + this.gridSize, y + this.gridSize);
                gradient.addColorStop(0, '#00ffff');
                gradient.addColorStop(1, '#0066ff');
                break;
            case 'golden':
                gradient = this.ctx.createLinearGradient(x, y, x + this.gridSize, y + this.gridSize);
                gradient.addColorStop(0, '#ffd700');
                gradient.addColorStop(1, '#ffaa00');
                break;
            case 'purple':
                gradient = this.ctx.createLinearGradient(x, y, x + this.gridSize, y + this.gridSize);
                gradient.addColorStop(0, '#9900ff');
                gradient.addColorStop(1, '#6600cc');
                break;
            case 'rainbow':
                gradient = this.ctx.createLinearGradient(x, y, x + this.gridSize, y + this.gridSize);
                gradient.addColorStop(0, '#ff0000');
                gradient.addColorStop(0.16, '#ff7700');
                gradient.addColorStop(0.33, '#ffff00');
                gradient.addColorStop(0.5, '#00ff00');
                gradient.addColorStop(0.66, '#0077ff');
                gradient.addColorStop(0.83, '#4400ff');
                gradient.addColorStop(1, '#9900ff');
                break;
            default:
                gradient = this.ctx.createLinearGradient(x, y, x + this.gridSize, y + this.gridSize);
                gradient.addColorStop(0, '#00ff00');
                gradient.addColorStop(1, '#008800');
        }
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x + 1, y + 1, this.gridSize - 2, this.gridSize - 2);
        
        if (isHead) {
            // Draw eyes
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(x + 4, y + 4, 3, 3);
            this.ctx.fillRect(x + this.gridSize - 7, y + 4, 3, 3);
            
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(x + 5, y + 5, 1, 1);
            this.ctx.fillRect(x + this.gridSize - 6, y + 5, 1, 1);
        }
    }
    
    drawFlagSegment(x, y, flag, isHead) {
        switch(flag) {
            case 'pakistan':
                // Green and white with crescent
                this.ctx.fillStyle = '#01411C';
                this.ctx.fillRect(x + 1, y + 1, this.gridSize/2, this.gridSize - 2);
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.fillRect(x + this.gridSize/2, y + 1, this.gridSize/2, this.gridSize - 2);
                
                if (isHead) {
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.font = '12px Arial';
                    this.ctx.fillText('☪', x + 3, y + 14);
                }
                break;
            case 'uk':
                // Union Jack pattern
                this.ctx.fillStyle = '#012169';
                this.ctx.fillRect(x + 1, y + 1, this.gridSize - 2, this.gridSize - 2);
                this.ctx.strokeStyle = '#FFFFFF';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(x + this.gridSize/2, y);
                this.ctx.lineTo(x + this.gridSize/2, y + this.gridSize);
                this.ctx.moveTo(x, y + this.gridSize/2);
                this.ctx.lineTo(x + this.gridSize, y + this.gridSize/2);
                this.ctx.stroke();
                break;
            case 'usa':
                // Stars and stripes
                this.ctx.fillStyle = '#B22234';
                this.ctx.fillRect(x + 1, y + 1, this.gridSize - 2, this.gridSize - 2);
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.fillRect(x + 1, y + this.gridSize/2, this.gridSize - 2, 2);
                
                this.ctx.fillStyle = '#3C3B6E';
                this.ctx.fillRect(x + 1, y + 1, this.gridSize/2, this.gridSize/2);
                break;
            case 'germany':
                // Black, red, gold stripes
                this.ctx.fillStyle = '#000000';
                this.ctx.fillRect(x + 1, y + 1, this.gridSize - 2, this.gridSize/3);
                this.ctx.fillStyle = '#DD0000';
                this.ctx.fillRect(x + 1, y + this.gridSize/3, this.gridSize - 2, this.gridSize/3);
                this.ctx.fillStyle = '#FFCE00';
                this.ctx.fillRect(x + 1, y + 2*this.gridSize/3, this.gridSize - 2, this.gridSize/3);
                break;
        }
        
        if (isHead) {
            // Draw eyes
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(x + 4, y + 4, 2, 2);
            this.ctx.fillRect(x + this.gridSize - 6, y + 4, 2, 2);
        }
    }
    
    drawAbdiBiterSegment(x, y, isHead) {
        // Special Abdi Biter design
        const gradient = this.ctx.createRadialGradient(
            x + this.gridSize/2, y + this.gridSize/2, 0,
            x + this.gridSize/2, y + this.gridSize/2, this.gridSize/2
        );
        gradient.addColorStop(0, '#ffd700');
        gradient.addColorStop(0.7, '#ffaa00');
        gradient.addColorStop(1, '#ff6600');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x + 1, y + 1, this.gridSize - 2, this.gridSize - 2);
        
        // Add sparkle effect
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(x + 3, y + 3, 2, 2);
        this.ctx.fillRect(x + this.gridSize - 5, y + this.gridSize - 5, 2, 2);
        
        if (isHead) {
            // Special Abdi Biter eyes
            this.ctx.fillStyle = '#ff0000';
            this.ctx.fillRect(x + 4, y + 4, 3, 3);
            this.ctx.fillRect(x + this.gridSize - 7, y + 4, 3, 3);
            
            // Glowing effect
            this.ctx.strokeStyle = '#ffff00';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(x, y, this.gridSize, this.gridSize);
        }
    }
    
    updateDisplay() {
        document.getElementById('currentScore').textContent = this.score;
        document.getElementById('snakeLength').textContent = this.snake.length;
        document.getElementById('gameCoins').textContent = this.gameCoins;
        document.getElementById('gameLevel').textContent = this.level;
        document.getElementById('coinCount').textContent = this.gameCoins;
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;
        
        this.move();
        this.draw();
        this.updateDisplay();
        
        setTimeout(() => this.gameLoop(), this.gameSpeed);
    }
    
    start() {
        this.gameRunning = true;
        this.gamePaused = false;
        this.dx = 1;
        this.dy = 0;
        this.gameLoop();
    }
    
    pause() {
        this.gamePaused = true;
        document.getElementById('gameOverlay').classList.add('active');
        document.getElementById('overlayTitle').textContent = 'Game Paused';
        document.getElementById('overlayMessage').textContent = 'Press SPACE to continue or click RESUME';
    }
    
    resume() {
        this.gamePaused = false;
        document.getElementById('gameOverlay').classList.remove('active');
        this.gameLoop();
    }
    
    togglePause() {
        if (this.gamePaused) {
            this.resume();
        } else {
            this.pause();
        }
    }
    
    restart() {
        this.snake = [{x: 10, y: 10}];
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.level = 1;
        this.gameSpeed = 200;
        this.coins = [];
        this.powerups = [];
        this.generateFood();
        this.updateDisplay();
        
        if (this.gameRunning) {
            document.getElementById('gameOverlay').classList.remove('active');
            this.gamePaused = false;
            this.start();
        }
    }
    
    gameOver() {
        this.gameRunning = false;
        this.saveCustomization();
        
        document.getElementById('gameOverlay').classList.add('active');
        document.getElementById('overlayTitle').textContent = 'Game Over';
        document.getElementById('overlayMessage').textContent = `Final Score: ${this.score} | Length: ${this.snake.length}`;
        
        // Check for achievements
        if (this.snake.length >= 20) {
            this.showAchievement('Snake Master!', 'Reached length 20!');
        }
        if (this.score >= 500) {
            this.showAchievement('High Scorer!', 'Scored 500+ points!');
        }
        if (this.gameCoins >= 10) {
            this.showAchievement('Coin Collector!', 'Collected 10+ coins!');
        }
    }
    
    showAchievement(title, description) {
        const popup = document.getElementById('achievementPopup');
        document.getElementById('achievementTitle').textContent = title;
        document.getElementById('achievementDescription').textContent = description;
        
        popup.classList.add('show');
        setTimeout(() => popup.classList.remove('show'), 3000);
        
        this.playSound('achievement');
    }
    
    showFloatingText(text, x, y, color) {
        const textElement = document.createElement('div');
        textElement.textContent = text;
        textElement.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            color: ${color};
            font-weight: bold;
            font-size: 16px;
            pointer-events: none;
            z-index: 1000;
            animation: floatUp 1s ease-out forwards;
        `;
        
        document.body.appendChild(textElement);
        setTimeout(() => textElement.remove(), 1000);
    }
    
    playSound(type) {
        // Create audio context for sound effects
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        switch(type) {
            case 'eat':
                oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(330, this.audioContext.currentTime + 0.1);
                break;
            case 'coin':
                oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.2);
                break;
            case 'powerup':
                oscillator.frequency.setValueAtTime(330, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(660, this.audioContext.currentTime + 0.15);
                break;
            case 'achievement':
                oscillator.frequency.setValueAtTime(523, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(784, this.audioContext.currentTime + 0.3);
                break;
        }
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }
}

// Game instance
let game;

// Screen management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    
    if (screenId === 'gameScreen') {
        if (!game) {
            game = new SnakeGame();
        }
        game.start();
    } else if (game && game.gameRunning) {
        game.gameRunning = false;
    }
}

function resumeGame() {
    if (game) {
        game.resume();
    }
}

// Customization handlers
document.addEventListener('DOMContentLoaded', function() {
    // Color selection
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            const color = this.getAttribute('data-color');
            if (game) game.snakeColor = color;
            localStorage.setItem('snakeColor', color);
        });
    });
    
    // Flag selection
    document.querySelectorAll('.flag-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.flag-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            const flag = this.getAttribute('data-flag');
            if (game) game.snakeFlag = flag;
            localStorage.setItem('snakeFlag', flag);
        });
    });
    
    // Special snake selection
    document.querySelectorAll('.special-snake').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.special-snake').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            const snake = this.getAttribute('data-snake');
            if (game) game.selectedSnake = snake;
            localStorage.setItem('selectedSnake', snake);
        });
    });
    
    // Map selection
    document.querySelectorAll('.map-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.map-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            const map = this.getAttribute('data-map');
            if (game) game.selectedMap = map;
            localStorage.setItem('selectedMap', map);
        });
    });
});

// Add floating text animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-50px); opacity: 0; }
    }
`;
document.head.appendChild(style);