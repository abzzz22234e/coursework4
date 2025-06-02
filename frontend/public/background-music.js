// Background Music System
class BackgroundMusicPlayer {
    constructor() {
        this.audioContext = null;
        this.currentTrack = null;
        this.isPlaying = false;
        this.volume = 0.3;
        this.tracks = {
            games: 'games-theme',
            roast: 'roast-theme',
            basketball: 'basketball-theme',
            snake: 'snake-theme'
        };
        
        this.init();
    }
    
    init() {
        // Create audio context when user first interacts
        document.addEventListener('click', () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        }, { once: true });
    }
    
    // Generate background music using Web Audio API
    playGamesTheme() {
        this.stop();
        this.currentTrack = 'games';
        
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        this.playMelody([
            { freq: 440, duration: 0.5 },
            { freq: 523, duration: 0.5 },
            { freq: 659, duration: 0.5 },
            { freq: 784, duration: 0.5 },
            { freq: 659, duration: 0.5 },
            { freq: 523, duration: 0.5 },
            { freq: 440, duration: 1.0 }
        ], true);
    }
    
    playRoastTheme() {
        this.stop();
        this.currentTrack = 'roast';
        
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Dark, dramatic theme for roast room
        this.playMelody([
            { freq: 220, duration: 0.8 },
            { freq: 246, duration: 0.4 },
            { freq: 261, duration: 0.8 },
            { freq: 293, duration: 0.4 },
            { freq: 329, duration: 1.2 },
            { freq: 293, duration: 0.8 },
            { freq: 261, duration: 0.8 },
            { freq: 220, duration: 1.6 }
        ], true);
    }
    
    playBasketballTheme() {
        this.stop();
        this.currentTrack = 'basketball';
        
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Energetic basketball theme
        this.playMelody([
            { freq: 523, duration: 0.3 },
            { freq: 659, duration: 0.3 },
            { freq: 784, duration: 0.3 },
            { freq: 1047, duration: 0.3 },
            { freq: 880, duration: 0.6 },
            { freq: 784, duration: 0.3 },
            { freq: 659, duration: 0.3 },
            { freq: 523, duration: 0.6 }
        ], true);
    }
    
    playSnakeTheme() {
        this.stop();
        this.currentTrack = 'snake';
        
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Mysterious snake theme
        this.playMelody([
            { freq: 330, duration: 0.6 },
            { freq: 370, duration: 0.6 },
            { freq: 415, duration: 0.6 },
            { freq: 466, duration: 0.6 },
            { freq: 415, duration: 0.6 },
            { freq: 370, duration: 0.6 },
            { freq: 330, duration: 1.2 }
        ], true);
    }
    
    playMelody(notes, loop = false) {
        if (!this.audioContext) return;
        
        this.isPlaying = true;
        let currentTime = this.audioContext.currentTime;
        
        const playNotes = () => {
            if (!this.isPlaying) return;
            
            notes.forEach((note, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(note.freq, currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, currentTime);
                gainNode.gain.linearRampToValueAtTime(this.volume, currentTime + 0.1);
                gainNode.gain.linearRampToValueAtTime(this.volume * 0.7, currentTime + note.duration - 0.1);
                gainNode.gain.linearRampToValueAtTime(0, currentTime + note.duration);
                
                oscillator.start(currentTime);
                oscillator.stop(currentTime + note.duration);
                
                currentTime += note.duration;
            });
            
            if (loop && this.isPlaying) {
                const totalDuration = notes.reduce((sum, note) => sum + note.duration, 0);
                setTimeout(() => {
                    if (this.isPlaying) {
                        currentTime = this.audioContext.currentTime;
                        playNotes();
                    }
                }, totalDuration * 1000);
            }
        };
        
        playNotes();
    }
    
    stop() {
        this.isPlaying = false;
        this.currentTrack = null;
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }
    
    toggle() {
        if (this.isPlaying) {
            this.stop();
        } else {
            // Resume the last track or default to games theme
            switch(this.currentTrack) {
                case 'roast':
                    this.playRoastTheme();
                    break;
                case 'basketball':
                    this.playBasketballTheme();
                    break;
                case 'snake':
                    this.playSnakeTheme();
                    break;
                default:
                    this.playGamesTheme();
            }
        }
    }
}

// Initialize global music player
const musicPlayer = new BackgroundMusicPlayer();

// Add music control UI
function initMusicControls() {
    const musicControls = document.createElement('div');
    musicControls.innerHTML = `
        <div class="music-controls">
            <button id="musicToggle" class="music-btn">
                <i class="fas fa-music"></i>
                <span id="musicStatus">Play Music</span>
            </button>
            <div class="volume-control">
                <i class="fas fa-volume-down"></i>
                <input type="range" id="volumeSlider" min="0" max="100" value="30">
                <i class="fas fa-volume-up"></i>
            </div>
        </div>
    `;
    
    // Add styles
    const musicStyles = document.createElement('style');
    musicStyles.textContent = `
        .music-controls {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            padding: 1rem;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            border: 2px solid #ff6b35;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            z-index: 1000;
            box-shadow: 0 10px 30px rgba(255, 107, 53, 0.3);
        }
        
        .music-btn {
            background: linear-gradient(45deg, #ff6b35, #ff8c42);
            border: none;
            padding: 0.7rem 1rem;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            min-width: 120px;
            justify-content: center;
        }
        
        .music-btn:hover {
            background: linear-gradient(45deg, #ff8c42, #ffaa66);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 107, 53, 0.4);
        }
        
        .music-btn.playing {
            background: linear-gradient(45deg, #4CAF50, #45a049);
        }
        
        .music-btn.playing:hover {
            background: linear-gradient(45deg, #45a049, #3d8b40);
        }
        
        .volume-control {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: white;
        }
        
        .volume-control i {
            color: #ff6b35;
            font-size: 0.9rem;
        }
        
        #volumeSlider {
            width: 80px;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 2px;
            outline: none;
            -webkit-appearance: none;
        }
        
        #volumeSlider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 16px;
            height: 16px;
            background: #ff6b35;
            border-radius: 50%;
            cursor: pointer;
        }
        
        #volumeSlider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            background: #ff6b35;
            border-radius: 50%;
            cursor: pointer;
            border: none;
        }
        
        @media (max-width: 768px) {
            .music-controls {
                bottom: 10px;
                right: 10px;
                padding: 0.7rem;
            }
            
            .music-btn {
                padding: 0.5rem 0.8rem;
                font-size: 0.9rem;
                min-width: 100px;
            }
            
            #volumeSlider {
                width: 60px;
            }
        }
    `;
    
    document.head.appendChild(musicStyles);
    document.body.appendChild(musicControls);
    
    // Bind controls
    const toggleBtn = document.getElementById('musicToggle');
    const volumeSlider = document.getElementById('volumeSlider');
    const musicStatus = document.getElementById('musicStatus');
    
    toggleBtn.addEventListener('click', () => {
        musicPlayer.toggle();
        updateMusicUI();
    });
    
    volumeSlider.addEventListener('input', (e) => {
        const volume = e.target.value / 100;
        musicPlayer.setVolume(volume);
    });
    
    function updateMusicUI() {
        if (musicPlayer.isPlaying) {
            toggleBtn.classList.add('playing');
            musicStatus.textContent = 'Stop Music';
            toggleBtn.querySelector('i').className = 'fas fa-stop';
        } else {
            toggleBtn.classList.remove('playing');
            musicStatus.textContent = 'Play Music';
            toggleBtn.querySelector('i').className = 'fas fa-music';
        }
    }
    
    // Auto-start music based on page
    const currentPage = window.location.pathname;
    if (currentPage.includes('games.html')) {
        setTimeout(() => musicPlayer.playGamesTheme(), 1000);
    } else if (currentPage.includes('basketball-game.html')) {
        setTimeout(() => musicPlayer.playBasketballTheme(), 1000);
    } else if (currentPage.includes('snake-game.html')) {
        setTimeout(() => musicPlayer.playSnakeTheme(), 1000);
    } else if (currentPage.includes('secret-roast.html')) {
        setTimeout(() => musicPlayer.playRoastTheme(), 1000);
    }
    
    // Update UI periodically
    setInterval(updateMusicUI, 1000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initMusicControls);

// Export for global use
window.musicPlayer = musicPlayer;