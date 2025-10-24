
    function themeSwitcher() {
        return {
            theme: 'dark',
            initTheme() {
                const savedTheme = localStorage.getItem('theme') || 'dark';
                this.setTheme(savedTheme);
            },
            setTheme(theme) {
                this.theme = theme;
                if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
                localStorage.setItem('theme', theme);
            },
            toggleTheme() {
                const newTheme = this.theme === 'dark' ? 'light' : 'dark';
                this.setTheme(newTheme);
            }
        }
    }

    function timer() {
        return {
            durationMinutes: 15,
            soundOption: 'end', // 'off', 'every_second', 'inhale', 'exhale', 'end'
            inhaleDuration: 4,
            exhaleDuration: 8,
            timeLeft: 15 * 60,
            interval: null,
            breathingTimeout: null,
            isRunning: false,
            breathingPhase: 'exhale', // Start with exhale
            woodblockAudio: null,
            circle: null,
            init: function() {
                this.timeLeft = this.durationMinutes * 60;
                this.woodblockAudio = new Audio('sounds/woodblock.mp3');
                this.circle = document.getElementById('breathing-circle');
                this.reset();
            },
            start: function() {
                if (this.isRunning || this.timeLeft <= 0) return;
                this.isRunning = true;

                this.interval = setInterval(() => {
                    if (!this.isRunning) return;

                    this.timeLeft--;

                    if (this.timeLeft > 0) {
                        if (this.soundOption === 'every_second') {
                            this.playSound();
                        }
                    }

                    if (this.timeLeft <= 0) {
                        this.pause();
                        this.timeLeft = 0;
                        // Play end sound for all options except 'off'
                        if (this.soundOption !== 'off') {
                            this.playEndSound();
                        }
                    }
                }, 1000);

                this.runBreathingCycle();
            },
            playSound: function() {
                if (this.woodblockAudio) {
                    // Pause and reset time to ensure the sound can be re-played immediately
                    this.woodblockAudio.pause();
                    this.woodblockAudio.currentTime = 0;
                    this.woodblockAudio.play();
                }
            },
            runBreathingCycle: function() {
                if (!this.isRunning) return;

                if (this.breathingPhase === 'exhale') {
                    this.circle.style.transitionDuration = `${this.exhaleDuration}s`;
                    this.circle.style.transform = 'scale(0)';
                    this.breathingPhase = 'inhale';

                    this.breathingTimeout = setTimeout(() => {
                        if ((this.soundOption === 'exhale' || this.soundOption === 'inhale_exhale') && this.isRunning) {
                            this.playSound();
                        }
                        this.runBreathingCycle();
                    }, this.exhaleDuration * 1000);
                } else { // inhale
                    this.circle.style.transitionDuration = `${this.inhaleDuration}s`;
                    this.circle.style.transform = 'scale(1)';
                    this.breathingPhase = 'exhale';

                    this.breathingTimeout = setTimeout(() => {
                        if ((this.soundOption === 'inhale' || this.soundOption === 'inhale_exhale') && this.isRunning) {
                            this.playSound();
                        }
                        this.runBreathingCycle();
                    }, this.inhaleDuration * 1000);
                }
            },
            playEndSound: function() {
                let count = 0;
                const endInterval = setInterval(() => {
                    this.playSound();
                    count++;
                    if (count >= 3) {
                        clearInterval(endInterval);
                    }
                }, 600);
            },
            pause: function() {
                this.isRunning = false;
                clearInterval(this.interval);
                clearTimeout(this.breathingTimeout);
            },
            reset: function() {
                this.pause();
                this.timeLeft = this.durationMinutes * 60;
                this.breathingPhase = 'exhale'; // Reset to start with exhale
                if (this.circle) {
                    this.circle.style.transitionDuration = '0s';
                    // Start scaled up, as the first action is to exhale (scale down)
                    this.circle.style.transform = 'scale(1)';
                }
            },
            resetTimer: function() {
                if (this.durationMinutes < 1) this.durationMinutes = 1;
                this.reset();
            },
            incrementTime: function() {
                this.durationMinutes++;
                this.resetTimer();
            },
            decrementTime: function() {
                if (this.durationMinutes > 1) {
                    this.durationMinutes--;
                    this.resetTimer();
                }
            },
            incrementInhale: function() {
                this.inhaleDuration++;
            },
            decrementInhale: function() {
                if (this.inhaleDuration > 1) {
                    this.inhaleDuration--;
                }
            },
            incrementExhale: function() {
                this.exhaleDuration++;
            },
            decrementExhale: function() {
                if (this.exhaleDuration > 1) {
                    this.exhaleDuration--;
                }
            },
            formatTime: function() {
                const minutes = Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
                const seconds = (this.timeLeft % 60).toString().padStart(2, '0');
                return `${minutes}:${seconds}`;
            }
        }
    }
