// cats.js – Gatitos con silueta Canvas 2D 🐱🐾
(function () {
    'use strict';

    // ── helpers ──────────────────────────────────────────
    const pick  = arr => arr[Math.floor(Math.random() * arr.length)];
    const rand  = (a, b) => a + Math.random() * (b - a);
    const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

    // Accent color from CSS variable
    const accent = () => isDark() ? '#f48cbf' : '#e6609a';

    const MESSAGES = [
        '¡Miau! 🐾 Repasa el Diagnóstico Diferencial~',
        '¡Tú puedes con la psicología! 🌸',
        'Purrrr... ( =^∇^= ) 💕',
        'Criterio A cumplido: ¡muy inteligente! 🐱',
        '¡Ánimo estudiando el DSM-5! 🐾✨',
        '¡Los gatitos apoyan tu carrera! 😸💖',
        'Recuerda tomar agua, nyan~ 💧🐾',
        'Una siesta y luego más DSM-5 🛌🐱',
    ];

    // ── Silueta de gato (Canvas 2D) ───────────────────────
    // Dibuja una silueta minimalista de gato caminando.
    // cx,cy = centro cuerpo; s = escala; legT = tiempo legs; tailT = tiempo cola
    function drawCatSilhouette(ctx, cx, cy, s, legT, tailT) {
        const c = accent();
        ctx.fillStyle   = c;
        ctx.strokeStyle = c;

        // Cola
        ctx.save();
        ctx.translate(cx - s * 1.3, cy + s * 0.1);
        const tailAngle = Math.sin(tailT) * 0.45;
        ctx.rotate(tailAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-s * 0.2, -s * 1.1, s * 0.5, -s * 1.5, s * 0.15, -s * 2.0);
        ctx.lineWidth = s * 0.3;
        ctx.lineCap   = 'round';
        ctx.stroke();
        ctx.restore();

        // Cuerpo (elipse)
        ctx.beginPath();
        ctx.ellipse(cx, cy, s * 1.15, s * 0.78, 0, 0, Math.PI * 2);
        ctx.fill();

        // Patas (4 líneas simples con swing alternado)
        const swing = Math.sin(legT) * s * 0.4;
        [
            { x: cx - s * 0.7, phase:  1 },
            { x: cx - s * 0.25, phase: -1 },
            { x: cx + s * 0.25, phase:  1 },
            { x: cx + s * 0.7,  phase: -1 },
        ].forEach(({ x, phase }) => {
            const dy = phase * swing;
            ctx.beginPath();
            ctx.moveTo(x, cy + s * 0.6);
            ctx.lineTo(x, cy + s * 0.6 + s * 0.75 + dy);
            ctx.lineWidth = s * 0.3;
            ctx.lineCap   = 'round';
            ctx.stroke();
        });

        // Cabeza
        ctx.beginPath();
        ctx.arc(cx + s * 1.0, cy - s * 0.5, s * 0.8, 0, Math.PI * 2);
        ctx.fill();

        // Orejas (dos triángulos)
        const hx = cx + s * 1.0, hy = cy - s * 0.5;
        [[-s * 0.38, -s * 0.2], [s * 0.18, -s * 0.2]].forEach(([ex, ey]) => {
            ctx.beginPath();
            ctx.moveTo(hx + ex,              hy + ey + s * 0.15);
            ctx.lineTo(hx + ex + s * 0.1,   hy + ey - s * 0.45);
            ctx.lineTo(hx + ex + s * 0.32,  hy + ey + s * 0.15);
            ctx.closePath();
            ctx.fill();
        });

        // Ojos (dos puntos blancos pequeños) — solo en silueta
        ctx.fillStyle = isDark() ? '#1a0d14' : '#fff5f7';
        [[-s * 0.3, -s * 0.55], [s * 0.22, -s * 0.55]].forEach(([ex, ey]) => {
            ctx.beginPath();
            ctx.arc(hx + ex, hy + ey, s * 0.13, 0, Math.PI * 2);
            ctx.fill();
        });

        // Reset
        ctx.fillStyle   = c;
        ctx.strokeStyle = c;
    }

    // ── 1. Gato caminante (Canvas bottom-of-screen) ───────
    let walkActive = false;

    function launchWalkingCat() {
        if (walkActive) return;
        walkActive = true;

        const canvas = document.createElement('canvas');
        canvas.style.cssText = [
            'position:fixed', 'bottom:0', 'left:0',
            'width:100vw', 'height:96px',
            'pointer-events:auto', 'z-index:9998',
            'cursor:pointer',
        ].join(';');
        canvas.width  = window.innerWidth;
        canvas.height = 96;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const S   = 14;           // escala del gato
        let   x   = -90;
        let   legT  = 0, tailT = 0;
        let   bubble = null, bubbleFrames = 0;
        let   raf;

        canvas.addEventListener('click', e => {
            bubble = pick(MESSAGES);
            bubbleFrames = 200;
            spawnPaws(e.clientX, e.clientY, 3);
        });

        const loop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            drawCatSilhouette(ctx, x, 60, S, legT, tailT);

            // Burbuja de texto
            if (bubble && bubbleFrames > 0) {
                bubbleFrames--;
                ctx.save();
                ctx.font = 'bold 12px "DM Sans",sans-serif';
                const tw = ctx.measureText(bubble).width + 20;
                const bx = Math.min(x + 10, canvas.width - tw - 10);
                const by = 4;
                ctx.fillStyle = isDark() ? '#2e1626' : '#fff';
                ctx.strokeStyle = accent();
                ctx.lineWidth   = 1.5;
                ctx.beginPath();
                ctx.roundRect(bx, by, tw, 26, 8);
                ctx.fill(); ctx.stroke();
                ctx.fillStyle = accent();
                ctx.fillText(bubble, bx + 10, by + 17);
                ctx.restore();
            }

            x     += 1.7;
            legT  += 0.11;
            tailT += 0.04;

            if (x > canvas.width + 100) {
                cancelAnimationFrame(raf);
                canvas.remove();
                walkActive = false;
                return;
            }
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
    }

    // ── 2. Gatito dormido en el sidebar ───────────────────
    function addSidebarCat() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;

        const wrap = document.createElement('div');
        wrap.style.cssText = [
            'display:flex', 'flex-direction:column', 'align-items:center',
            'padding:10px 0 8px',
            'border-top:1px solid var(--border-soft)',
            'cursor:pointer', 'user-select:none',
        ].join(';');

        const canvas = document.createElement('canvas');
        canvas.width = 110; canvas.height = 80;
        canvas.style.display = 'block';

        const label = document.createElement('div');
        label.textContent = 'Haz clic 🐾';
        label.style.cssText = 'font-size:0.68rem;color:var(--text-muted);margin-top:4px;font-family:"DM Sans",sans-serif;';

        wrap.appendChild(canvas);
        wrap.appendChild(label);
        sidebar.appendChild(wrap);

        const ctx = canvas.getContext('2d');
        let sleeping = true;
        let zzT = 0;

        const drawSleeping = () => {
            ctx.clearRect(0, 0, 110, 80);
            const c  = accent();
            const cx = 55, cy = 58;
            const S  = 11;

            ctx.fillStyle   = c;
            ctx.strokeStyle = c;

            // Cola enroscada
            ctx.beginPath();
            ctx.arc(cx + S * 1.0, cy + S * 0.25, S * 0.8, -0.3, Math.PI * 0.8);
            ctx.lineWidth = S * 0.3;
            ctx.lineCap   = 'round';
            ctx.stroke();

            // Cuerpo acurrucado
            ctx.beginPath();
            ctx.ellipse(cx, cy, S * 1.8, S * 0.9, -0.15, 0, Math.PI * 2);
            ctx.fill();

            // Cabeza
            ctx.beginPath();
            ctx.arc(cx - S * 1.1, cy - S * 0.45, S * 0.75, 0, Math.PI * 2);
            ctx.fill();

            // Orejas
            const hx = cx - S * 1.1, hy = cy - S * 0.45;
            [[-S*0.35,-S*0.18],[S*0.18,-S*0.18]].forEach(([ex,ey]) => {
                ctx.beginPath();
                ctx.moveTo(hx+ex,         hy+ey+S*0.12);
                ctx.lineTo(hx+ex+S*0.08,  hy+ey-S*0.38);
                ctx.lineTo(hx+ex+S*0.28,  hy+ey+S*0.12);
                ctx.closePath(); ctx.fill();
            });

            // Ojos cerrados (curvitas)
            if (sleeping) {
                ctx.strokeStyle = isDark() ? '#1a0d14' : '#fff5f7';
                ctx.lineWidth   = S * 0.12;
                ctx.lineCap     = 'round';
                [[-S*0.28,-S*0.5],[S*0.2,-S*0.5]].forEach(([ex,ey]) => {
                    ctx.beginPath();
                    ctx.arc(hx+ex, hy+ey, S*0.16, Math.PI, 0);
                    ctx.stroke();
                });
                // zzzs
                zzT += 0.04;
                ctx.fillStyle   = c;
                ctx.strokeStyle = c;
                ctx.font = `bold ${S*0.85}px serif`;
                ctx.globalAlpha = 0.65 + Math.sin(zzT)*0.35;
                ctx.fillText('z', cx-S*0.3,  cy - S*1.9 + Math.sin(zzT)*3);
                ctx.fillText('z', cx+S*0.25, cy - S*2.4 + Math.sin(zzT+1)*3);
                ctx.fillText('Z', cx+S*0.8,  cy - S*2.9 + Math.sin(zzT+2)*3);
                ctx.globalAlpha = 1;
            } else {
                // Ojos abiertos
                const bgCol = isDark() ? '#1a0d14' : '#fff5f7';
                ctx.fillStyle = bgCol;
                [[-S*0.28,-S*0.5],[S*0.2,-S*0.5]].forEach(([ex,ey]) => {
                    ctx.beginPath();
                    ctx.arc(hx+ex, hy+ey, S*0.18, 0, Math.PI*2);
                    ctx.fill();
                });
                ctx.fillStyle = c; // pupil
                [[-S*0.28,-S*0.5],[S*0.2,-S*0.5]].forEach(([ex,ey]) => {
                    ctx.beginPath();
                    ctx.arc(hx+ex+S*0.03, hy+ey+S*0.02, S*0.09, 0, Math.PI*2);
                    ctx.fill();
                });
            }
        };

        wrap.addEventListener('click', e => {
            sleeping = !sleeping;
            label.textContent = sleeping ? 'Haz clic 🐾' : '¡Miau! ( ^ω^) 💕';
            spawnPaws(
                wrap.getBoundingClientRect().left + 55,
                wrap.getBoundingClientRect().top  + 40,
                3
            );
        });

        const loop = () => { drawSleeping(); requestAnimationFrame(loop); };
        loop();
    }

    // ── 3. Gatitos flotantes en el fondo ──────────────────
    function addFloatingCats() {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = [
            'position:fixed', 'top:0', 'left:0',
            'width:100vw', 'height:100vh',
            'pointer-events:none', 'z-index:0', 'opacity:0.12',
        ].join(';');
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.insertBefore(canvas, document.body.firstChild);
        const ctx = canvas.getContext('2d');

        const floaters = [
            { rx: 0.72, ry: 0.14, s: 7,  phase: 0.0,  spd: 0.0006 },
            { rx: 0.88, ry: 0.55, s: 5,  phase: 1.2,  spd: 0.0008 },
            { rx: 0.62, ry: 0.82, s: 9,  phase: 2.5,  spd: 0.0004 },
        ];

        const loop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            floaters.forEach(f => {
                f.phase += f.spd;
                const cx = f.rx * canvas.width;
                const cy = f.ry * canvas.height + Math.sin(f.phase * Math.PI * 2) * 12;
                ctx.save();
                ctx.rotate(Math.sin(f.phase * Math.PI * 2) * 0.1);
                drawCatSilhouette(ctx, cx, cy, f.s, f.phase * 10, f.phase * 4);
                ctx.restore();
            });
            requestAnimationFrame(loop);
        };
        loop();

        window.addEventListener('resize', () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // ── 4. Huellas de patita al hacer clic ────────────────
    const PAW_CHARS = ['🐾','🐱','💕','✨','😸','🐾'];

    function spawnPaws(cx, cy, n = 1) {
        for (let i = 0; i < n; i++) {
            const el = document.createElement('span');
            el.textContent = pick(PAW_CHARS);
            el.style.cssText = [
                'position:fixed',
                `left:${cx + rand(-16, 16)}px`,
                `top:${cy  + rand(-16, 16)}px`,
                `font-size:${rand(13, 21)}px`,
                'pointer-events:none',
                'z-index:9999',
                'animation:catPawPop 0.8s ease-out forwards',
            ].join(';');
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 850);
        }
    }

    // Keyframe global (sólo una vez)
    if (!document.getElementById('_catKF')) {
        const s = document.createElement('style');
        s.id = '_catKF';
        s.textContent = `
            @keyframes catPawPop {
                0%   { opacity:1; transform: scale(0.3) translateY(0)   rotate(0deg);  }
                55%  { opacity:1; transform: scale(1.3) translateY(-18px) rotate(10deg); }
                100% { opacity:0; transform: scale(0.9) translateY(-35px) rotate(-8deg); }
            }`;
        document.head.appendChild(s);
    }

    // Huellas al hacer clic en elementos interactivos
    document.addEventListener('click', e => {
        if (e.target.closest('.toc-item,.tab-btn,.pill,.icon-btn,#catSummonBtn')) {
            spawnPaws(e.clientX, e.clientY, 2);
        }
    });

    // ── 5. Botón de convocar ──────────────────────────────
    const btn = document.getElementById('catSummonBtn');
    if (btn) btn.addEventListener('click', launchWalkingCat);

    // ── Init ──────────────────────────────────────────────
    addSidebarCat();
    addFloatingCats();

    // Auto-gato cada 45 s
    setInterval(launchWalkingCat, 45000);

    // Gato de bienvenida después de 2 s
    setTimeout(launchWalkingCat, 2000);

})();
