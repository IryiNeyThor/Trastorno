// birthday.js – 🎂 Sección de Cumpleaños con Gatitos Cantores 🐱🎶
// Audio: FELIZ CUMPLEAÑOS - Versión Gatuna (1:14 = 74s)
(function () {
    'use strict';

    // ── Config ──────────────────────────────────────────────
    const AUDIO_FILE = 'FELIZ CUMPLEA\u00d1OS - Versi\u00f3n Gatuna - Fancro Craft.mp3';
    const AUDIO_DURATION = 74; // 1:14 en segundos
    const BIRTHDAY_DATE = new Date(2026, 10, 4); // Nov 4, 2026

    const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';
    const accent = () => isDark() ? '#f48cbf' : '#e6609a';
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const rand = (a, b) => a + Math.random() * (b - a);

    // ── Create Birthday Button (floating) ──────────────────
    const bdayBtn = document.createElement('button');
    bdayBtn.id = 'birthdayBtn';
    bdayBtn.className = 'birthday-float-btn';
    bdayBtn.innerHTML = '🎂 ¡Cumpleaños!';
    bdayBtn.title = '¡Abre la fiesta de cumpleaños!';
    document.body.appendChild(bdayBtn);

    // ── Create Birthday Overlay ────────────────────────────
    const overlay = document.createElement('div');
    overlay.id = 'birthdayOverlay';
    overlay.className = 'birthday-overlay';
    overlay.innerHTML = `
        <div class="birthday-scene" id="birthdayScene">
            <!-- Close button -->
            <button class="bday-close-btn" id="bdayCloseBtn" title="Cerrar">✕</button>

            <!-- Confetti Canvas -->
            <canvas id="confettiCanvas" class="confetti-canvas"></canvas>

            <!-- Floating balloons layer -->
            <div class="balloons-layer" id="balloonsLayer"></div>

            <!-- Stars sparkle layer -->
            <canvas id="starsCanvas" class="stars-canvas"></canvas>

            <!-- VIEW 1: BIG CENTERED COUNTDOWN (Active before 9:00 AM) -->
            <div class="countdown-hero-container" id="countdownHeroView">
                <div class="countdown-hero-card">
                    <div class="countdown-hero-badge">
                        <span>⏰ CUENTA REGRESIVA DE CUMPLEAÑOS 🐾</span>
                    </div>

                    <h1 class="countdown-hero-title">
                        ¡Una sorpresa muy especial está por comenzar!
                    </h1>
                    <p class="countdown-hero-subtitle">
                        El show de cumpleaños de los gatitos se revelará mañana <strong>4 de Noviembre a las 9:00 AM</strong> 🎂✨
                    </p>

                    <!-- Big Digital Countdown -->
                    <div class="countdown-digits-row">
                        <div class="countdown-digit-card">
                            <span class="digit-value" id="heroCdHours">00</span>
                            <span class="digit-label">HORAS</span>
                        </div>
                        <span class="digit-divider">:</span>
                        <div class="countdown-digit-card">
                            <span class="digit-value" id="heroCdMinutes">00</span>
                            <span class="digit-label">MINUTOS</span>
                        </div>
                        <span class="digit-divider">:</span>
                        <div class="countdown-digit-card">
                            <span class="digit-value" id="heroCdSeconds">00</span>
                            <span class="digit-label">SEGUNDOS</span>
                        </div>
                    </div>

                    <!-- Waiting Cats Animation -->
                    <div class="countdown-waiting-scene">
                        <div class="waiting-cat-icon">🐱💤</div>
                        <p class="waiting-cat-text">
                            Los gatitos están durmiendo su siesta de belleza, decorando el pastel y ensayando la canción... ¡La fiesta comenzará automáticamente a las 9:00 AM! 🎂🐾
                        </p>
                    </div>
                </div>
            </div>

            <!-- VIEW 2: FULL BIRTHDAY PARTY SHOW (Active ONLY when countdown finishes at 9:00 AM) -->
            <div class="bday-content" id="bdayPartyView" style="display:none;">
                <!-- Title -->
                <h1 class="bday-title">
                    <span class="bday-cake-icon">🎂</span>
                    ¡Feliz Cumpleaños!
                    <span class="bday-cake-icon">🎂</span>
                </h1>
                <p class="bday-subtitle">4 de Noviembre 🎉</p>

                <!-- Cat Stage - Animated Singing Cats -->
                <div class="cat-stage" id="catStage">
                    <canvas id="catStageCanvas" width="700" height="320"></canvas>
                </div>

                <!-- Music Notes floating -->
                <div class="music-notes-layer" id="musicNotesLayer"></div>

                <!-- Audio Player Section -->
                <div class="bday-audio-section">
                    <div class="audio-player-card" id="audioPlayerCard">
                        <div class="audio-cat-icon">🐱🎤</div>
                        <h3>♪ Los Gatitos Cantan Feliz Cumpleaños ♪</h3>
                        <p class="audio-hint">Versión Gatuna 🐾 Duración: 1:14</p>

                        <div class="audio-controls" id="audioControls">
                            <button class="audio-play-btn" id="audioPlayBtn">
                                <span class="play-icon" id="playIcon">▶</span>
                            </button>
                            <div class="audio-progress-wrapper">
                                <div class="audio-progress-bar" id="audioProgressBar">
                                    <div class="audio-progress-fill" id="audioProgressFill"></div>
                                    <div class="audio-progress-thumb" id="audioProgressThumb"></div>
                                </div>
                                <div class="audio-time-row">
                                    <span class="audio-time" id="audioTimeCurrent">0:00</span>
                                    <span class="audio-time" id="audioTimeTotal">1:14</span>
                                </div>
                            </div>
                        </div>

                        <!-- Singing cats indicator -->
                        <div class="singing-indicator" id="singingIndicator" style="display:none;">
                            <span>🐱</span><span>🎶</span><span>🐱</span><span>🎶</span><span>🐱</span>
                            <p>¡Los gatitos están cantando!</p>
                        </div>
                    </div>
                </div>

                <!-- Progress bar for the full show -->
                <div class="show-progress" id="showProgress" style="display:none;">
                    <div class="show-progress-bar">
                        <div class="show-progress-fill" id="showProgressFill"></div>
                    </div>
                    <span class="show-progress-text" id="showProgressText">🎵 Show en progreso...</span>
                </div>

                <!-- Birthday message -->
                <div class="bday-message-card">
                    <p>🌸 Que este día esté lleno de alegría, amor y muchos ronroneos 🐾</p>
                    <p class="bday-hearts">💖✨🎀✨💖</p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // ── DOM References ─────────────────────────────────────
    const closeBtn = document.getElementById('bdayCloseBtn');
    const confettiCanvas = document.getElementById('confettiCanvas');
    const starsCanvas = document.getElementById('starsCanvas');
    const catStageCanvas = document.getElementById('catStageCanvas');
    const audioPlayBtn = document.getElementById('audioPlayBtn');
    const playIcon = document.getElementById('playIcon');
    const audioProgressBar = document.getElementById('audioProgressBar');
    const audioProgressFill = document.getElementById('audioProgressFill');
    const audioProgressThumb = document.getElementById('audioProgressThumb');
    const audioTimeCurrent = document.getElementById('audioTimeCurrent');
    const audioTimeTotal = document.getElementById('audioTimeTotal');
    const singingIndicator = document.getElementById('singingIndicator');
    const balloonsLayer = document.getElementById('balloonsLayer');
    const musicNotesLayer = document.getElementById('musicNotesLayer');
    const showProgress = document.getElementById('showProgress');
    const showProgressFill = document.getElementById('showProgressFill');
    const showProgressText = document.getElementById('showProgressText');

    // Countdown Hero Elements
    const countdownHeroView = document.getElementById('countdownHeroView');
    const bdayPartyView = document.getElementById('bdayPartyView');
    const heroCdHours = document.getElementById('heroCdHours');
    const heroCdMinutes = document.getElementById('heroCdMinutes');
    const heroCdSeconds = document.getElementById('heroCdSeconds');

    let isOverlayOpen = false;
    let isPlaying = false;
    let isSinging = false;
    let isPartyUnlocked = false;
    let countdownInterval = null;
    let confettiRAF, starsRAF, catRAF;

    // ── Target Date: 4 de Noviembre a las 9:00 AM ──────────
    function getTargetBirthday() {
        const now = new Date();
        // Target: Nov 4 of current year at 09:00:00 AM
        return new Date(now.getFullYear(), 10, 4, 9, 0, 0);
    }

    function isTimeReached() {
        return new Date() >= getTargetBirthday();
    }

    // ── Audio Setup ────────────────────────────────────────
    const AUDIO_RAW = 'FELIZ CUMPLEA\u00d1OS - Versi\u00f3n Gatuna - Fancro Craft.mp3';
    const AUDIO_ENCODED = encodeURI(AUDIO_RAW);
    const audioEl = new Audio(AUDIO_ENCODED);
    audioEl.preload = 'auto';

    audioEl.addEventListener('error', () => {
        if (audioEl.src.includes('%20') || audioEl.src.includes('%C3')) {
            audioEl.src = AUDIO_RAW;
        }
    }, { once: true });

    audioEl.addEventListener('loadedmetadata', () => {
        const dur = audioEl.duration || AUDIO_DURATION;
        const mins = Math.floor(dur / 60);
        const secs = Math.floor(dur % 60).toString().padStart(2, '0');
        audioTimeTotal.textContent = `${mins}:${secs}`;
    });

    audioEl.addEventListener('timeupdate', () => {
        const dur = audioEl.duration || AUDIO_DURATION;
        const pct = (audioEl.currentTime / dur) * 100;
        audioProgressFill.style.width = pct + '%';
        audioProgressThumb.style.left = pct + '%';

        const mins = Math.floor(audioEl.currentTime / 60);
        const secs = Math.floor(audioEl.currentTime % 60).toString().padStart(2, '0');
        audioTimeCurrent.textContent = `${mins}:${secs}`;

        showProgressFill.style.width = pct + '%';

        if (audioEl.currentTime < 4) {
            showProgressText.textContent = '🎵 ¡Comienza el show de cumpleaños!';
        } else if (audioEl.currentTime < 18) {
            showProgressText.textContent = '🐱 Los gatitos afinan sus voces...';
        } else if (audioEl.currentTime < 40) {
            showProgressText.textContent = '🎶 ¡¡Cumpleaños Feliz, Cumpleaños Feliz!! 🎂';
        } else if (audioEl.currentTime < 62) {
            showProgressText.textContent = '🎤 ¡¡Te deseamos todos... Miau Miau Miau!! 🐾';
        } else {
            showProgressText.textContent = '🎉✨ ¡¡GRAN FINAL DE CUMPLEAÑOS!! 💖✨';
        }
    });

    audioEl.addEventListener('ended', () => {
        isPlaying = false;
        isSinging = false;
        playIcon.textContent = '🔁';
        singingIndicator.style.display = 'none';
        showProgressText.textContent = '🎉 ¡¡Muchas felicidades!! Haz clic en 🔁 para volver a cantar';
        stopMusicNotes();
        audioProgressFill.style.width = '100%';
        audioProgressThumb.style.left = '100%';
        triggerFinaleBurst();
    });

    // ── Unlock Full Birthday Party (Music + Cats + Confetti) ──
    function unlockBirthdayParty() {
        isPartyUnlocked = true;
        countdownHeroView.style.display = 'none';
        bdayPartyView.style.display = 'block';

        // Trigger celebratory effects
        triggerFinaleBurst();
        startAllAnimations();

        // Start 1:14 song
        audioEl.currentTime = 0;
        audioEl.play().then(() => {
            isPlaying = true;
            playIcon.textContent = '⏸';
            singingIndicator.style.display = 'flex';
            showProgress.style.display = 'block';
            startMusicNotes();
        }).catch(() => {
            playIcon.textContent = '▶';
        });

        bdayBtn.innerHTML = '🎂 ¡Cumpleaños!';
    }

    // ── Live Countdown Loop ────────────────────────────────
    function updateCountdownTimer() {
        const now = new Date();
        const target = getTargetBirthday();
        const diff = target - now;

        if (diff <= 0) {
            // TIME'S UP! Unlock automatically if not yet unlocked
            if (!isPartyUnlocked) {
                unlockBirthdayParty();
            }
            bdayBtn.innerHTML = '🎂 ¡Cumpleaños!';
            return;
        }

        // Calculate hours, minutes, seconds remaining
        const totalSeconds = Math.floor(diff / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const hStr = String(hours).padStart(2, '0');
        const mStr = String(minutes).padStart(2, '0');
        const sStr = String(seconds).padStart(2, '0');

        heroCdHours.textContent = hStr;
        heroCdMinutes.textContent = mStr;
        heroCdSeconds.textContent = sStr;

        bdayBtn.innerHTML = `⏰ ${hStr}:${mStr}:${sStr} 🎂`;
    }

    function startCountdownInterval() {
        updateCountdownTimer();
        if (countdownInterval) clearInterval(countdownInterval);
        countdownInterval = setInterval(updateCountdownTimer, 1000);
    }

    // ── Open / Close ───────────────────────────────────────
    bdayBtn.addEventListener('click', () => {
        isOverlayOpen = true;
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        spawnBalloons();

        if (isTimeReached() || isPartyUnlocked) {
            unlockBirthdayParty();
        } else {
            countdownHeroView.style.display = 'flex';
            bdayPartyView.style.display = 'none';
            initStars();
            initConfetti();
            startCountdownInterval();
        }
    });

    closeBtn.addEventListener('click', closeBirthday);

    function closeBirthday() {
        isOverlayOpen = false;
        overlay.classList.remove('open');
        document.body.style.overflow = '';
        stopAllAnimations();
        if (isPlaying) {
            audioEl.pause();
            audioEl.currentTime = 0;
            isPlaying = false;
            isSinging = false;
            playIcon.textContent = '▶';
            singingIndicator.style.display = 'none';
            showProgress.style.display = 'none';
            stopMusicNotes();
            audioProgressFill.style.width = '0%';
            audioProgressThumb.style.left = '0%';
            audioTimeCurrent.textContent = '0:00';
        }
    }

    // ── Countdown ──────────────────────────────────────────
    function updateCountdown() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const bdayThisYear = new Date(now.getFullYear(), BIRTHDAY_DATE.getMonth(), BIRTHDAY_DATE.getDate());

        const diffMs = bdayThisYear - today;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            countdownEl.innerHTML = `
                <div class="countdown-today">
                    <span class="countdown-emoji">🎉🎂🎉</span>
                    <span class="countdown-text">¡¡HOY ES EL DÍA!! ¡FELIZ CUMPLEAÑOS!</span>
                    <span class="countdown-emoji">🎉🎂🎉</span>
                </div>`;
            countdownEl.classList.add('is-today');
        } else if (diffDays === 1) {
            countdownEl.innerHTML = `
                <div class="countdown-tomorrow">
                    <span class="countdown-emoji">⏰🎂</span>
                    <span class="countdown-text">¡MAÑANA es el gran día! ¡Falta solo 1 día!</span>
                    <span class="countdown-emoji">🎂⏰</span>
                </div>`;
            countdownEl.classList.add('is-tomorrow');
        } else if (diffDays > 0) {
            countdownEl.innerHTML = `
                <div class="countdown-future">
                    <span class="countdown-text">Faltan <strong>${diffDays}</strong> días para el cumpleaños 🎂</span>
                </div>`;
        } else {
            countdownEl.innerHTML = `
                <div class="countdown-today">
                    <span class="countdown-emoji">🎉🎂🎉</span>
                    <span class="countdown-text">¡Celebremos el cumpleaños!</span>
                    <span class="countdown-emoji">🎉🎂🎉</span>
                </div>`;
        }
    }

    // ── Balloons ───────────────────────────────────────────
    function spawnBalloons() {
        balloonsLayer.innerHTML = '';
        const colors = ['#e6609a', '#f48cbf', '#ff6b9d', '#c084fc', '#fb7185', '#f9a8cf', '#fda4af', '#a78bfa'];
        for (let i = 0; i < 18; i++) {
            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            const color = pick(colors);
            const left = rand(2, 95);
            const delay = rand(0, 8);
            const dur = rand(10, 20);
            const size = rand(28, 48);
            balloon.style.cssText = `
                left: ${left}%;
                width: ${size}px;
                height: ${size * 1.25}px;
                background: radial-gradient(circle at 35% 25%, ${color}cc, ${color});
                animation-delay: ${delay}s;
                animation-duration: ${dur}s;
            `;
            const string = document.createElement('div');
            string.className = 'balloon-string';
            string.style.borderColor = color;
            balloon.appendChild(string);
            balloonsLayer.appendChild(balloon);
        }
    }

    // ── Confetti System ────────────────────────────────────
    let confettiParticles = [];

    function initConfetti() {
        const ctx = confettiCanvas.getContext('2d');
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
        confettiParticles = [];

        const colors = ['#e6609a', '#f48cbf', '#ffd700', '#ff6b9d', '#c084fc', '#4ade80', '#fb923c', '#38bdf8', '#f9a8cf'];

        for (let i = 0; i < 150; i++) {
            confettiParticles.push({
                x: rand(0, confettiCanvas.width),
                y: rand(-confettiCanvas.height, 0),
                w: rand(4, 10),
                h: rand(6, 14),
                color: pick(colors),
                rot: rand(0, 360),
                rotSpeed: rand(-6, 6),
                vy: rand(1.2, 3.5),
                vx: rand(-1, 1),
                wave: rand(0, Math.PI * 2),
                waveSpeed: rand(0.02, 0.06),
            });
        }

        function drawConfetti() {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

            // More intense confetti when singing
            const speedMult = isSinging ? 1.5 : 1;

            confettiParticles.forEach(p => {
                p.y += p.vy * speedMult;
                p.x += p.vx + Math.sin(p.wave) * 0.5;
                p.rot += p.rotSpeed * speedMult;
                p.wave += p.waveSpeed;

                if (p.y > confettiCanvas.height + 20) {
                    p.y = -20;
                    p.x = rand(0, confettiCanvas.width);
                }

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot * Math.PI / 180);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = isSinging ? 1 : 0.7;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            });
            if (isOverlayOpen) confettiRAF = requestAnimationFrame(drawConfetti);
        }
        drawConfetti();
    }

    // ── Stars Sparkle System ───────────────────────────────
    function initStars() {
        const ctx = starsCanvas.getContext('2d');
        starsCanvas.width = window.innerWidth;
        starsCanvas.height = window.innerHeight;

        const stars = [];
        for (let i = 0; i < 40; i++) {
            stars.push({
                x: rand(0, starsCanvas.width),
                y: rand(0, starsCanvas.height),
                size: rand(2, 5),
                phase: rand(0, Math.PI * 2),
                speed: rand(0.02, 0.06),
            });
        }

        function drawStars() {
            ctx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
            stars.forEach(s => {
                s.phase += s.speed;
                const alpha = 0.3 + Math.sin(s.phase) * 0.7;
                const scale = 0.5 + Math.sin(s.phase) * 0.5;
                ctx.save();
                ctx.translate(s.x, s.y);
                ctx.scale(scale, scale);
                ctx.globalAlpha = Math.max(0, alpha);
                ctx.fillStyle = '#ffd700';

                // Star shape
                ctx.beginPath();
                for (let j = 0; j < 10; j++) {
                    const r = j % 2 === 0 ? s.size : s.size * 0.4;
                    const angle = (j * Math.PI) / 5 - Math.PI / 2;
                    const method = j === 0 ? 'moveTo' : 'lineTo';
                    ctx[method](Math.cos(angle) * r, Math.sin(angle) * r);
                }
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            });
            if (isOverlayOpen) starsRAF = requestAnimationFrame(drawStars);
        }
        drawStars();
    }

    // ── Cat Stage Animation (synced to 74s audio) ──────────
    function initCatStage() {
        const canvas = catStageCanvas;
        const ctx = canvas.getContext('2d');

        const containerW = Math.min(700, window.innerWidth - 40);
        canvas.width = containerW;
        canvas.height = 320;
        canvas.style.width = containerW + 'px';

        const cats = [
            { x: containerW * 0.12, baseY: 210, s: 16, color: '#e6609a', hatColor: '#ffd700', mouthPhase: 0, eyeBlink: 0, bobPhase: 0 },
            { x: containerW * 0.30, baseY: 195, s: 18, color: '#f48cbf', hatColor: '#c084fc', mouthPhase: 0.5, eyeBlink: 0.3, bobPhase: 1 },
            { x: containerW * 0.50, baseY: 185, s: 22, color: '#ff6b9d', hatColor: '#4ade80', mouthPhase: 1.0, eyeBlink: 0.6, bobPhase: 2 },
            { x: containerW * 0.70, baseY: 195, s: 18, color: '#c084fc', hatColor: '#fb923c', mouthPhase: 1.5, eyeBlink: 0.9, bobPhase: 3 },
            { x: containerW * 0.88, baseY: 210, s: 16, color: '#fb7185', hatColor: '#38bdf8', mouthPhase: 2.0, eyeBlink: 1.2, bobPhase: 4 },
        ];

        let t = 0;

        // ── Phases of the 74s show ─────────────────────────
        // 0-5s:    Intro - cats sway gently
        // 5-10s:   Cats start opening mouths
        // 10-65s:  Full singing
        // 65-74s:  Finale - excited bouncing, last notes

        function getShowPhase() {
            if (!isPlaying) return 'idle';
            const ct = audioEl.currentTime;
            if (ct < 3) return 'intro';
            if (ct < 8) return 'warmup';
            if (ct < 62) return 'singing';
            return 'finale';
        }

        function drawCatWithHat(ctx, cat, time, phase) {
            const { x, s, color, hatColor, mouthPhase, bobPhase } = cat;

            // Bobbing intensity depends on phase
            let bobAmt = 3;
            let bobSpeed = 1.5;
            let mouthIntensity = 0;
            let pawWave = false;

            switch (phase) {
                case 'idle':
                    bobAmt = 2; bobSpeed = 1; mouthIntensity = 0;
                    break;
                case 'intro':
                    bobAmt = 3; bobSpeed = 1.5; mouthIntensity = 0;
                    break;
                case 'warmup':
                    bobAmt = 4; bobSpeed = 2; mouthIntensity = 0.4;
                    break;
                case 'singing':
                    bobAmt = 6; bobSpeed = 2.5; mouthIntensity = 1.0; pawWave = true;
                    break;
                case 'finale':
                    bobAmt = 10; bobSpeed = 4; mouthIntensity = 1.0; pawWave = true;
                    break;
            }

            const bob = Math.sin(time * bobSpeed + bobPhase) * bobAmt;
            const y = cat.baseY + bob;

            // Body
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.ellipse(x, y, s * 1.2, s * 0.85, 0, 0, Math.PI * 2);
            ctx.fill();

            // Head
            const hx = x, hy = y - s * 1.3;
            ctx.beginPath();
            ctx.arc(hx, hy, s * 0.9, 0, Math.PI * 2);
            ctx.fill();

            // Ears
            ctx.beginPath();
            ctx.moveTo(hx - s * 0.6, hy - s * 0.3);
            ctx.lineTo(hx - s * 0.35, hy - s * 1.1);
            ctx.lineTo(hx - s * 0.05, hy - s * 0.35);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(hx + s * 0.05, hy - s * 0.35);
            ctx.lineTo(hx + s * 0.35, hy - s * 1.1);
            ctx.lineTo(hx + s * 0.6, hy - s * 0.35);
            ctx.closePath();
            ctx.fill();

            // Inner ears
            ctx.fillStyle = isDark() ? '#3d1a2e' : '#fff5f7';
            ctx.beginPath();
            ctx.moveTo(hx - s * 0.5, hy - s * 0.35);
            ctx.lineTo(hx - s * 0.35, hy - s * 0.85);
            ctx.lineTo(hx - s * 0.15, hy - s * 0.38);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(hx + s * 0.15, hy - s * 0.38);
            ctx.lineTo(hx + s * 0.35, hy - s * 0.85);
            ctx.lineTo(hx + s * 0.5, hy - s * 0.35);
            ctx.closePath();
            ctx.fill();

            // Eyes
            const eyeY = hy - s * 0.05;
            const blinkCycle = Math.sin(time * 1.5 + cat.eyeBlink * 10);
            // Blink more during finale
            const blinkThreshold = phase === 'finale' ? 0.85 : 0.92;
            const eyeH = blinkCycle > blinkThreshold ? s * 0.02 : s * 0.22;

            ctx.fillStyle = isDark() ? '#1a0d14' : '#3d1a2e';
            ctx.beginPath();
            ctx.ellipse(hx - s * 0.3, eyeY, s * 0.15, eyeH, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(hx + s * 0.3, eyeY, s * 0.15, eyeH, 0, 0, Math.PI * 2);
            ctx.fill();

            // Eye sparkles
            if (blinkCycle <= blinkThreshold) {
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(hx - s * 0.25, eyeY - s * 0.06, s * 0.06, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(hx + s * 0.35, eyeY - s * 0.06, s * 0.06, 0, Math.PI * 2);
                ctx.fill();
            }

            // Cheek blush (rosy cheeks, more visible when singing)
            if (mouthIntensity > 0) {
                ctx.globalAlpha = 0.2 + mouthIntensity * 0.2;
                ctx.fillStyle = '#ff6b9d';
                ctx.beginPath();
                ctx.ellipse(hx - s * 0.55, hy + s * 0.15, s * 0.18, s * 0.12, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(hx + s * 0.55, hy + s * 0.15, s * 0.18, s * 0.12, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            // Nose
            ctx.fillStyle = isDark() ? '#ffb6d5' : '#d04d87';
            ctx.beginPath();
            ctx.arc(hx, hy + s * 0.2, s * 0.08, 0, Math.PI * 2);
            ctx.fill();

            // Mouth - SINGING animation synced to music
            const mouthOpen = mouthIntensity > 0
                ? Math.abs(Math.sin(time * 6 + mouthPhase)) * s * 0.28 * mouthIntensity
                : s * 0.02;
            ctx.fillStyle = isDark() ? '#2a0a1a' : '#8b2252';
            ctx.beginPath();
            ctx.ellipse(hx, hy + s * 0.35, s * 0.15, mouthOpen + s * 0.02, 0, 0, Math.PI * 2);
            ctx.fill();

            // Tongue when mouth is wide open
            if (mouthOpen > s * 0.15) {
                ctx.fillStyle = '#ff8fab';
                ctx.beginPath();
                ctx.ellipse(hx, hy + s * 0.38 + mouthOpen * 0.3, s * 0.07, s * 0.05, 0, 0, Math.PI);
                ctx.fill();
            }

            // Whiskers
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.6;
            [[-1, 0.05], [-1, 0.3], [1, 0.05], [1, 0.3]].forEach(([dir, yOff]) => {
                ctx.beginPath();
                ctx.moveTo(hx + dir * s * 0.2, hy + s * (0.18 + yOff * 0.3));
                ctx.lineTo(hx + dir * s * 0.9, hy + s * yOff);
                ctx.stroke();
            });
            ctx.globalAlpha = 1;

            // Paws
            ctx.fillStyle = color;
            if (pawWave) {
                // Waving paws during singing!
                const pawAngle = Math.sin(time * 4 + bobPhase) * 0.3;
                ctx.save();
                ctx.translate(x - s * 0.5, y + s * 0.5);
                ctx.rotate(pawAngle);
                ctx.beginPath();
                ctx.ellipse(0, s * 0.2, s * 0.25, s * 0.15, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();

                ctx.save();
                ctx.translate(x + s * 0.5, y + s * 0.5);
                ctx.rotate(-pawAngle);
                ctx.beginPath();
                ctx.ellipse(0, s * 0.2, s * 0.25, s * 0.15, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            } else {
                ctx.beginPath();
                ctx.ellipse(x - s * 0.5, y + s * 0.7, s * 0.25, s * 0.15, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(x + s * 0.5, y + s * 0.7, s * 0.25, s * 0.15, 0, 0, Math.PI * 2);
                ctx.fill();
            }

            // Tail
            ctx.strokeStyle = color;
            ctx.lineWidth = s * 0.22;
            ctx.lineCap = 'round';
            const tailSpeed = phase === 'finale' ? 5 : (phase === 'singing' ? 3 : 2);
            const tailWag = Math.sin(time * tailSpeed + bobPhase) * 0.4;
            ctx.save();
            ctx.translate(x + s * 0.8, y + s * 0.2);
            ctx.rotate(tailWag);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(s * 0.5, -s * 0.3, s * 0.8, -s * 1.0, s * 0.3, -s * 1.5);
            ctx.stroke();
            ctx.restore();

            // ── PARTY HAT ──
            const hatBase = hy - s * 0.7;
            const hatTilt = Math.sin(time * bobSpeed + bobPhase) * 0.08;
            ctx.save();
            ctx.translate(hx, hatBase);
            ctx.rotate(hatTilt);

            ctx.fillStyle = hatColor;
            ctx.beginPath();
            ctx.moveTo(-s * 0.45, s * 0.15);
            ctx.lineTo(0, -s * 1.2);
            ctx.lineTo(s * 0.45, s * 0.15);
            ctx.closePath();
            ctx.fill();

            // Hat stripes
            ctx.strokeStyle = 'rgba(255,255,255,0.4)';
            ctx.lineWidth = 2;
            for (let stripe = 0.25; stripe < 1; stripe += 0.25) {
                const sy = s * 0.15 - (s * 1.35 * stripe);
                const sw = s * 0.45 * (1 - stripe);
                ctx.beginPath();
                ctx.moveTo(-sw, sy);
                ctx.lineTo(sw, sy);
                ctx.stroke();
            }

            // Pompom
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, -s * 1.2, s * 0.15, 0, Math.PI * 2);
            ctx.fill();

            // Hat elastic
            ctx.strokeStyle = hatColor;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-s * 0.45, s * 0.15);
            ctx.quadraticCurveTo(0, s * 0.35, s * 0.45, s * 0.15);
            ctx.stroke();

            ctx.restore();

            // Musical notes from mouth when singing
            if (mouthIntensity > 0.3) {
                const noteCount = phase === 'finale' ? 3 : 2;
                for (let n = 0; n < noteCount; n++) {
                    const noteTime = time * 2 + mouthPhase + n * 1.2;
                    const noteProgress = (noteTime % 3) / 3;
                    const noteY = hy - s * 0.5 - noteProgress * s * 2.5;
                    const noteX = hx + Math.sin(noteTime * 2 + n) * s * 0.5;
                    const noteAlpha = 1 - noteProgress;
                    ctx.globalAlpha = Math.max(0, noteAlpha * 0.8);
                    ctx.font = `${s * 0.5}px serif`;
                    ctx.fillStyle = hatColor;
                    ctx.fillText(n % 2 === 0 ? '♪' : '♫', noteX, noteY);
                }
                ctx.globalAlpha = 1;
            }
        }

        function drawBirthdayCake(ctx, cx, cy, time) {
            const s = 12;
            const cakeGlow = isSinging ? 0.15 + Math.sin(time * 3) * 0.1 : 0;

            // Glow around cake when singing
            if (cakeGlow > 0) {
                ctx.globalAlpha = cakeGlow;
                ctx.fillStyle = '#ffd700';
                ctx.beginPath();
                ctx.arc(cx, cy - s, s * 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            // Cake plate
            ctx.fillStyle = isDark() ? '#5a2d42' : '#fce7f3';
            ctx.beginPath();
            ctx.ellipse(cx, cy + s * 0.8, s * 3.2, s * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Bottom layer
            ctx.fillStyle = '#f9a8cf';
            ctx.beginPath();
            ctx.ellipse(cx, cy, s * 2.8, s * 0.9, 0, 0, Math.PI);
            ctx.fill();
            ctx.fillRect(cx - s * 2.8, cy - s * 1.2, s * 5.6, s * 1.2);
            ctx.beginPath();
            ctx.ellipse(cx, cy - s * 1.2, s * 2.8, s * 0.9, 0, Math.PI, Math.PI * 2);
            ctx.fill();

            // Frosting drips
            ctx.fillStyle = '#e6609a';
            for (let i = 0; i < 8; i++) {
                const dx = cx - s * 2.5 + i * s * 0.72;
                const dripH = s * 0.3 + Math.sin(time + i) * s * 0.15;
                ctx.beginPath();
                ctx.ellipse(dx, cy - s * 1.2 + s * 0.1, s * 0.2, dripH, 0, 0, Math.PI);
                ctx.fill();
            }

            // Top
            ctx.fillStyle = '#ff6b9d';
            ctx.beginPath();
            ctx.ellipse(cx, cy - s * 1.2, s * 2.8, s * 0.9, 0, 0, Math.PI * 2);
            ctx.fill();

            // Upper tier
            ctx.fillStyle = '#fda4af';
            ctx.fillRect(cx - s * 2, cy - s * 2.5, s * 4, s * 1.0);
            ctx.beginPath();
            ctx.ellipse(cx, cy - s * 2.5, s * 2, s * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();

            // Top frosting
            ctx.fillStyle = '#fce7f3';
            ctx.beginPath();
            ctx.ellipse(cx, cy - s * 2.5, s * 2, s * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();

            // Candles
            const candleColors = ['#ffd700', '#c084fc', '#4ade80', '#fb923c', '#38bdf8'];
            for (let i = 0; i < 5; i++) {
                const candleX = cx - s * 1.5 + i * s * 0.75;
                const candleY = cy - s * 2.5;

                ctx.fillStyle = candleColors[i];
                ctx.fillRect(candleX - 2, candleY - s * 0.9, 4, s * 0.9);

                const flicker = Math.sin(time * 8 + i * 2) * 2;
                ctx.fillStyle = '#ffd700';
                ctx.beginPath();
                ctx.ellipse(candleX, candleY - s * 1.1 + flicker, 3, 5, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#ff6b2e';
                ctx.beginPath();
                ctx.ellipse(candleX, candleY - s * 1.2 + flicker, 2, 3, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.globalAlpha = 0.15 + Math.sin(time * 6 + i) * 0.1;
                ctx.fillStyle = '#ffd700';
                ctx.beginPath();
                ctx.arc(candleX, candleY - s * 1.1, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            // Hearts on cake
            ctx.font = '8px serif';
            ctx.fillStyle = '#ffffff';
            for (let i = 0; i < 6; i++) {
                const hx = cx - s * 2.2 + i * s * 0.85;
                const hy = cy - s * 0.5 + Math.sin(time + i) * 2;
                ctx.fillText('♥', hx, hy);
            }
        }

        function drawStage() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            t += 0.016;

            const phase = getShowPhase();
            isSinging = (phase === 'singing' || phase === 'warmup' || phase === 'finale');

            // Stage floor
            const grad = ctx.createLinearGradient(0, 260, 0, 320);
            grad.addColorStop(0, isDark() ? 'rgba(61,26,46,0.5)' : 'rgba(252,231,243,0.7)');
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 255, canvas.width, 65);

            // Cake
            drawBirthdayCake(ctx, canvas.width / 2, 260, t);

            // Cats
            cats.forEach(cat => drawCatWithHat(ctx, cat, t, phase));

            // Banner
            ctx.save();
            ctx.font = `bold ${canvas.width < 500 ? 14 : 20}px "DM Serif Display", Georgia, serif`;
            ctx.textAlign = 'center';
            ctx.fillStyle = accent();
            ctx.globalAlpha = 0.7 + Math.sin(t * 2) * 0.3;

            let bannerText = '♪ ¡Miau Miau Feliz Cumpleaños! ♪';
            if (phase === 'singing') {
                const bannerOpts = [
                    '♪ ¡Feliz Cumpleaños a ti! ♪',
                    '♫ ¡Miau Miau Miau! ♫',
                    '🎶 ¡Que los cumplas feliz! 🎶',
                    '♪ ¡Cumpleaños Gatuno! ♪',
                ];
                bannerText = bannerOpts[Math.floor(t / 4) % bannerOpts.length];
            } else if (phase === 'finale') {
                bannerText = '🎉✨ ¡¡FELICIDADES!! ✨🎉';
            }

            ctx.fillText(bannerText, canvas.width / 2, 30);
            ctx.globalAlpha = 1;
            ctx.restore();

            if (isOverlayOpen) catRAF = requestAnimationFrame(drawStage);
        }

        drawStage();
    }

    // ── Floating Music Notes (during playback) ─────────────
    let musicNotesInterval;

    function startMusicNotes() {
        if (musicNotesInterval) return;
        musicNotesInterval = setInterval(() => {
            if (!isPlaying || !isOverlayOpen) return;
            const note = document.createElement('div');
            note.className = 'floating-music-note';
            note.textContent = pick(['♪', '♫', '♬', '🎵', '🎶']);
            note.style.left = rand(10, 90) + '%';
            note.style.fontSize = rand(16, 32) + 'px';
            note.style.animationDuration = rand(2, 4) + 's';
            musicNotesLayer.appendChild(note);
            setTimeout(() => note.remove(), 4000);
        }, 250);
    }

    function stopMusicNotes() {
        clearInterval(musicNotesInterval);
        musicNotesInterval = null;
    }

    // ── Finale Burst ───────────────────────────────────────
    function triggerFinaleBurst() {
        // Spawn a burst of emojis
        const emojis = ['🎉', '🎊', '🥳', '🎂', '🐱', '💖', '✨', '🎈', '🎀', '🌟'];
        for (let i = 0; i < 25; i++) {
            setTimeout(() => {
                const el = document.createElement('span');
                el.textContent = pick(emojis);
                el.style.cssText = `
                    position: fixed;
                    left: ${rand(10, 90)}%;
                    top: ${rand(20, 80)}%;
                    font-size: ${rand(20, 44)}px;
                    pointer-events: none;
                    z-index: 10010;
                    animation: finaleBurst 1.5s ease-out forwards;
                `;
                document.body.appendChild(el);
                setTimeout(() => el.remove(), 1600);
            }, i * 60);
        }
    }

    // Finale keyframe
    if (!document.getElementById('_bdayFinaleKF')) {
        const s = document.createElement('style');
        s.id = '_bdayFinaleKF';
        s.textContent = `
            @keyframes finaleBurst {
                0%   { opacity: 1; transform: scale(0.3) translateY(0) rotate(0deg); }
                40%  { opacity: 1; transform: scale(1.4) translateY(-30px) rotate(15deg); }
                100% { opacity: 0; transform: scale(0.8) translateY(-80px) rotate(-10deg); }
            }`;
        document.head.appendChild(s);
    }

    // ── Audio Play / Pause ─────────────────────────────────
    audioPlayBtn.addEventListener('click', () => {
        if (isPlaying) {
            audioEl.pause();
            isPlaying = false;
            playIcon.textContent = '▶';
            singingIndicator.style.display = 'none';
            stopMusicNotes();
        } else {
            if (audioEl.ended || audioEl.currentTime >= (audioEl.duration || AUDIO_DURATION)) {
                audioEl.currentTime = 0;
            }
            audioEl.play().then(() => {
                isPlaying = true;
                playIcon.textContent = '⏸';
                singingIndicator.style.display = 'flex';
                showProgress.style.display = 'block';
                startMusicNotes();
            }).catch(err => {
                console.warn('Audio play failed:', err);
            });
        }
    });

    audioProgressBar.addEventListener('click', (e) => {
        if (!audioEl.duration) return;
        const rect = audioProgressBar.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        audioEl.currentTime = pct * audioEl.duration;
    });

    // ── Start / Stop All Animations ────────────────────────
    function startAllAnimations() {
        initConfetti();
        initStars();
        initCatStage();
    }

    function stopAllAnimations() {
        cancelAnimationFrame(confettiRAF);
        cancelAnimationFrame(starsRAF);
        cancelAnimationFrame(catRAF);
        stopMusicNotes();
    }

    // ── Handle Resize ──────────────────────────────────────
    window.addEventListener('resize', () => {
        if (isOverlayOpen) {
            confettiCanvas.width = window.innerWidth;
            confettiCanvas.height = window.innerHeight;
            starsCanvas.width = window.innerWidth;
            starsCanvas.height = window.innerHeight;
        }
    });

    // ── Start Countdown on load ────────────────────────────
    startCountdownInterval();

})();
