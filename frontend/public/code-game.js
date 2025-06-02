// Finish the Code Game - Fully Functional
class CodeChallengeGame {
    constructor() {
        this.currentChallenge = 0;
        this.score = 0;
        this.level = 1;
        this.difficulty = 'beginner';
        this.timeLeft = 60;
        this.hintsUsed = 0;
        this.gameTimer = null;
        this.challengesCompleted = 0;
        
        // Challenge database
        this.challenges = {
            beginner: [
                {
                    title: "Complete the HTML Structure",
                    description: "Complete the basic HTML document structure with a title and heading.",
                    code: `<!DOCTYPE html>\n<html>\n<head>\n    <title>____</title>\n</head>\n<body>\n    <____>Hello World</____>\n</body>\n</html>`,
                    solution: `<!DOCTYPE html>\n<html>\n<head>\n    <title>My First Page</title>\n</head>\n<body>\n    <h1>Hello World</h1>\n</body>\n</html>`,
                    hints: [
                        "HTML documents need a title in the head section",
                        "Use h1 tags for the main heading",
                        "Don't forget the closing tags!"
                    ],
                    points: 20
                },
                {
                    title: "JavaScript Variables",
                    description: "Declare variables and assign values in JavaScript.",
                    code: `// Declare a variable called 'name' and assign your name\n____ name = "____";\n\n// Declare a variable called 'age' and assign a number\n____ age = ____;\n\nconsole.log("Hello, " + name + "! You are " + age + " years old.");`,
                    solution: `// Declare a variable called 'name' and assign your name\nlet name = "Abubakar";\n\n// Declare a variable called 'age' and assign a number\nlet age = 18;\n\nconsole.log("Hello, " + name + "! You are " + age + " years old.");`,
                    hints: [
                        "Use 'let' or 'var' to declare variables",
                        "Strings need quotes around them",
                        "Numbers don't need quotes"
                    ],
                    points: 25
                },
                {
                    title: "Create a Function",
                    description: "Write a simple function that adds two numbers.",
                    code: `// Complete this function to add two numbers\nfunction ______(a, b) {\n    return ____;\n}\n\n// Test the function\nconsole.log(addNumbers(5, 3));`,
                    solution: `// Complete this function to add two numbers\nfunction addNumbers(a, b) {\n    return a + b;\n}\n\n// Test the function\nconsole.log(addNumbers(5, 3));`,
                    hints: [
                        "Function names should describe what they do",
                        "Use the + operator to add numbers",
                        "Don't forget to return the result"
                    ],
                    points: 30
                }
            ],
            intermediate: [
                {
                    title: "DOM Manipulation",
                    description: "Write code to change the content of an HTML element.",
                    code: `// Get the element with id 'myTitle'\nconst element = document.____('____');\n\n// Change its text content\nelement.____ = "New Title!";\n\n// Change its style\nelement.style.color = "____";`,
                    solution: `// Get the element with id 'myTitle'\nconst element = document.getElementById('myTitle');\n\n// Change its text content\nelement.textContent = "New Title!";\n\n// Change its style\nelement.style.color = "blue";`,
                    hints: [
                        "Use getElementById to get elements by their ID",
                        "Use textContent to change text",
                        "CSS colors can be names like 'blue' or 'red'"
                    ],
                    points: 40
                },
                {
                    title: "Event Listeners",
                    description: "Add a click event listener to a button.",
                    code: `// Get the button element\nconst button = document.getElementById('myButton');\n\n// Add a click event listener\nbutton.____('____', function() {\n    alert('Button clicked!');\n});`,
                    solution: `// Get the button element\nconst button = document.getElementById('myButton');\n\n// Add a click event listener\nbutton.addEventListener('click', function() {\n    alert('Button clicked!');\n});`,
                    hints: [
                        "Use addEventListener to add events",
                        "The first parameter is the event type",
                        "The second parameter is the function to run"
                    ],
                    points: 45
                },
                {
                    title: "Array Methods",
                    description: "Use array methods to manipulate data.",
                    code: `const numbers = [1, 2, 3, 4, 5];\n\n// Double each number using map\nconst doubled = numbers.____((num) => {\n    return num * ____;\n});\n\nconsole.log(doubled);`,
                    solution: `const numbers = [1, 2, 3, 4, 5];\n\n// Double each number using map\nconst doubled = numbers.map((num) => {\n    return num * 2;\n});\n\nconsole.log(doubled);`,
                    hints: [
                        "The map method transforms each array element",
                        "To double a number, multiply by 2",
                        "Map returns a new array"
                    ],
                    points: 50
                }
            ],
            advanced: [
                {
                    title: "Async/Await",
                    description: "Write an async function that fetches data.",
                    code: `// Create an async function\n____ function fetchData() {\n    try {\n        const response = ____ fetch('https://api.example.com/data');\n        const data = ____ response.json();\n        return data;\n    } catch (error) {\n        console.error('Error:', error);\n    }\n}`,
                    solution: `// Create an async function\nasync function fetchData() {\n    try {\n        const response = await fetch('https://api.example.com/data');\n        const data = await response.json();\n        return data;\n    } catch (error) {\n        console.error('Error:', error);\n    }\n}`,
                    hints: [
                        "Use 'async' keyword before function",
                        "Use 'await' before promises",
                        "Always handle errors with try/catch"
                    ],
                    points: 60
                },
                {
                    title: "ES6 Destructuring",
                    description: "Use destructuring to extract values from objects.",
                    code: `const user = {\n    name: 'Abubakar',\n    age: 18,\n    email: 'abubakar@radcliffe.edu'\n};\n\n// Destructure name and email\nconst { ____, ____ } = user;\n\nconsole.log(name, email);`,
                    solution: `const user = {\n    name: 'Abubakar',\n    age: 18,\n    email: 'abubakar@radcliffe.edu'\n};\n\n// Destructure name and email\nconst { name, email } = user;\n\nconsole.log(name, email);`,
                    hints: [
                        "Use curly braces for object destructuring",
                        "Property names must match object keys",
                        "Destructuring creates new variables"
                    ],
                    points: 65
                },
                {
                    title: "Promise Chain",
                    description: "Create a promise chain with error handling.",
                    code: `function processData() {\n    return fetch('/api/data')\n        .____((response) => response.json())\n        .____((data) => {\n            return data.results;\n        })\n        .____((error) => {\n            console.error('Failed to process:', error);\n        });\n}`,
                    solution: `function processData() {\n    return fetch('/api/data')\n        .then((response) => response.json())\n        .then((data) => {\n            return data.results;\n        })\n        .catch((error) => {\n            console.error('Failed to process:', error);\n        });\n}`,
                    hints: [
                        "Use .then() for successful promise resolution",
                        "Chain multiple .then() calls",
                        "Use .catch() for error handling"
                    ],
                    points: 70
                }
            ]
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadProgress();
    }
    
    bindEvents() {
        // Difficulty selection
        document.querySelectorAll('.difficulty-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.difficulty-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                this.difficulty = card.getAttribute('data-difficulty');
            });
        });
        
        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });
        
        // Code input with line numbers
        const codeInput = document.getElementById('codeInput');
        codeInput.addEventListener('input', this.updateLineNumbers);
        codeInput.addEventListener('scroll', this.syncScroll);
    }
    
    updateLineNumbers() {
        const lines = document.getElementById('codeInput').value.split('\n').length;
        const lineNumbers = document.getElementById('lineNumbers');
        
        lineNumbers.innerHTML = '';
        for (let i = 1; i <= lines; i++) {
            const lineDiv = document.createElement('div');
            lineDiv.textContent = i;
            lineNumbers.appendChild(lineDiv);
        }
    }
    
    syncScroll() {
        const codeInput = document.getElementById('codeInput');
        const lineNumbers = document.getElementById('lineNumbers');
        lineNumbers.scrollTop = codeInput.scrollTop;
    }
    
    startGame() {
        this.currentChallenge = 0;
        this.score = 0;
        this.challengesCompleted = 0;
        this.hintsUsed = 0;
        this.loadChallenge();
        this.startTimer();
        showScreen('gameScreen');
    }
    
    loadChallenge() {
        const challenges = this.challenges[this.difficulty];
        if (this.currentChallenge >= challenges.length) {
            this.endGame();
            return;
        }
        
        const challenge = challenges[this.currentChallenge];
        
        document.getElementById('challengeTitle').textContent = challenge.title;
        document.getElementById('challengeText').textContent = challenge.description;
        document.getElementById('currentLevel').textContent = `Level ${this.currentChallenge + 1}`;
        document.getElementById('currentDifficulty').textContent = this.difficulty;
        document.getElementById('challengePoints').textContent = `+${challenge.points} points`;
        
        document.getElementById('codeInput').value = challenge.code;
        this.updateLineNumbers();
        
        // Clear hints
        document.getElementById('hintsList').innerHTML = '<div class="hint">Click "Show Hint" if you get stuck!</div>';
        this.hintsUsed = 0;
        
        this.clearOutput();
    }
    
    runCode() {
        const code = document.getElementById('codeInput').value;
        const output = document.getElementById('codeOutput');
        
        // Simple code execution simulation
        output.innerHTML = '<div class="output-line success">✅ Code executed successfully!</div>';
        
        if (code.includes('console.log')) {
            const logMatches = code.match(/console\.log\((.*?)\)/g);
            if (logMatches) {
                logMatches.forEach(match => {
                    const content = match.match(/console\.log\((.*?)\)/)[1];
                    output.innerHTML += `<div class="output-line">${content}</div>`;
                });
            }
        }
        
        this.playSound('run');
    }
    
    submitCode() {
        const userCode = document.getElementById('codeInput').value.trim();
        const challenge = this.challenges[this.difficulty][this.currentChallenge];
        const solution = challenge.solution.trim();
        
        // Simple similarity check
        const similarity = this.calculateSimilarity(userCode, solution);
        
        if (similarity > 0.8) {
            this.showSuccess();
            this.score += challenge.points - (this.hintsUsed * 5);
            this.challengesCompleted++;
            this.currentChallenge++;
            
            setTimeout(() => {
                this.loadChallenge();
            }, 2000);
        } else if (similarity > 0.5) {
            this.showPartialCredit();
        } else {
            this.showIncorrect();
        }
        
        this.updateDisplay();
    }
    
    calculateSimilarity(str1, str2) {
        // Remove whitespace and normalize
        const normalize = (str) => str.replace(/\s+/g, ' ').toLowerCase();
        const norm1 = normalize(str1);
        const norm2 = normalize(str2);
        
        // Simple word-based similarity
        const words1 = norm1.split(' ');
        const words2 = norm2.split(' ');
        
        let matches = 0;
        words1.forEach(word => {
            if (words2.includes(word)) matches++;
        });
        
        return matches / Math.max(words1.length, words2.length);
    }
    
    showHint() {
        const challenge = this.challenges[this.difficulty][this.currentChallenge];
        const hintsList = document.getElementById('hintsList');
        
        if (this.hintsUsed < challenge.hints.length) {
            const hint = document.createElement('div');
            hint.className = 'hint';
            hint.innerHTML = `💡 ${challenge.hints[this.hintsUsed]}`;
            hintsList.appendChild(hint);
            
            this.hintsUsed++;
            this.score = Math.max(0, this.score - 5);
            this.updateDisplay();
            this.playSound('hint');
        }
    }
    
    showSuccess() {
        this.showFeedback('🎉 Excellent! Code is correct!', 'success');
        this.playSound('success');
        this.showAchievement('Challenge Complete!', 'You solved the coding challenge!');
    }
    
    showPartialCredit() {
        this.showFeedback('⚠️ Close, but not quite right. Try again!', 'warning');
        this.playSound('warning');
    }
    
    showIncorrect() {
        this.showFeedback('❌ Incorrect. Check the hints and try again!', 'error');
        this.playSound('error');
    }
    
    showFeedback(message, type) {
        const feedback = document.getElementById('gameFeedback');
        const feedbackText = document.getElementById('feedbackText');
        
        feedbackText.textContent = message;
        feedback.className = `game-feedback ${type}`;
        
        setTimeout(() => {
            feedback.className = 'game-feedback';
        }, 3000);
    }
    
    clearOutput() {
        document.getElementById('codeOutput').innerHTML = '<div class="output-line">Ready to test your code...</div>';
    }
    
    startTimer() {
        this.timeLeft = 60;
        this.updateTimer();
        
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }
    
    updateTimer() {
        document.getElementById('timer').textContent = this.timeLeft;
        document.getElementById('timeLeft').textContent = this.timeLeft;
        
        // Visual warning when time is low
        const timer = document.querySelector('.timer-circle');
        if (this.timeLeft <= 10) {
            timer.style.animation = 'timerPulse 1s ease-in-out infinite';
            timer.style.borderColor = '#ff4500';
        } else {
            timer.style.animation = '';
            timer.style.borderColor = '#00ff00';
        }
    }
    
    updateDisplay() {
        document.getElementById('playerLevel').textContent = this.level;
        document.getElementById('playerScore').textContent = this.score;
    }
    
    endGame() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        
        this.saveProgress();
        this.showResults();
    }
    
    showResults() {
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('challengesCompleted').textContent = this.challengesCompleted;
        document.getElementById('finalLevel').textContent = this.currentChallenge + 1;
        
        const timeBonus = Math.max(0, this.timeLeft * 2);
        document.getElementById('timeBonus').textContent = `+${timeBonus}`;
        
        if (this.score > 200) {
            document.getElementById('resultIcon').textContent = '🏆';
            document.getElementById('resultTitle').textContent = 'Coding Master!';
            document.getElementById('resultMessage').textContent = 'Outstanding performance!';
        } else if (this.score > 100) {
            document.getElementById('resultIcon').textContent = '⭐';
            document.getElementById('resultTitle').textContent = 'Great Job!';
            document.getElementById('resultMessage').textContent = 'You\'re getting good at this!';
        } else {
            document.getElementById('resultIcon').textContent = '💻';
            document.getElementById('resultTitle').textContent = 'Keep Learning!';
            document.getElementById('resultMessage').textContent = 'Practice makes perfect!';
        }
        
        showScreen('resultsScreen');
    }
    
    nextChallenge() {
        this.startGame();
    }
    
    showLeaderboard() {
        document.getElementById('yourScore').textContent = this.score;
        document.getElementById('yourLevel').textContent = this.level;
        showScreen('leaderboardScreen');
    }
    
    shareScore() {
        const text = `I just scored ${this.score} points in the Finish the Code challenge! 💻🔥`;
        if (navigator.share) {
            navigator.share({
                title: 'Finish the Code Game',
                text: text,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(text);
            this.showAchievement('Score Copied!', 'Score copied to clipboard!');
        }
    }
    
    loadProgress() {
        this.score = parseInt(localStorage.getItem('codeGameScore')) || 0;
        this.level = parseInt(localStorage.getItem('codeGameLevel')) || 1;
        this.updateDisplay();
    }
    
    saveProgress() {
        localStorage.setItem('codeGameScore', this.score);
        localStorage.setItem('codeGameLevel', this.level);
        
        if (this.score > (parseInt(localStorage.getItem('codeGameHighScore')) || 0)) {
            localStorage.setItem('codeGameHighScore', this.score);
            this.showAchievement('New High Score!', `You scored ${this.score} points!`);
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
    
    playSound(type) {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        switch(type) {
            case 'success':
                oscillator.frequency.setValueAtTime(523, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(784, this.audioContext.currentTime + 0.3);
                break;
            case 'error':
                oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.3);
                break;
            case 'warning':
                oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(330, this.audioContext.currentTime + 0.2);
                break;
            case 'run':
                oscillator.frequency.setValueAtTime(660, this.audioContext.currentTime);
                break;
            case 'hint':
                oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime);
                break;
            case 'achievement':
                oscillator.frequency.setValueAtTime(523, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(1047, this.audioContext.currentTime + 0.5);
                break;
        }
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }
}

// Game instance
let codeGame;

// Screen management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function startGame() {
    if (!codeGame) {
        codeGame = new CodeChallengeGame();
    }
    codeGame.startGame();
}

function runCode() {
    if (codeGame) codeGame.runCode();
}

function submitCode() {
    if (codeGame) codeGame.submitCode();
}

function showHint() {
    if (codeGame) codeGame.showHint();
}

function clearOutput() {
    if (codeGame) codeGame.clearOutput();
}

function nextChallenge() {
    if (codeGame) codeGame.nextChallenge();
}

function showLeaderboard() {
    if (codeGame) codeGame.showLeaderboard();
}

function shareScore() {
    if (codeGame) codeGame.shareScore();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    codeGame = new CodeChallengeGame();
    
    // Add CSS for timer animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes timerPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        .game-feedback.success {
            background: rgba(0, 255, 0, 0.1);
            border-left: 4px solid #00ff00;
            color: #00ff00;
        }
        
        .game-feedback.warning {
            background: rgba(255, 165, 0, 0.1);
            border-left: 4px solid #ffa500;
            color: #ffa500;
        }
        
        .game-feedback.error {
            background: rgba(255, 0, 0, 0.1);
            border-left: 4px solid #ff0000;
            color: #ff0000;
        }
    `;
    document.head.appendChild(style);
});