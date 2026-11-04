// ── DSM-5 AI Chat Assistant ──────────────────────────────────────
// Intelligent local search assistant that helps find disorders,
// criteria, symptoms, and differential diagnosis from dsm5Data.

document.addEventListener('DOMContentLoaded', () => {
    if (typeof dsm5Data === 'undefined') return;

    // ── Data references ──────────────────────────────────────────
    const disorders   = dsm5Data.disorders || [];
    const section1    = dsm5Data.section1  || [];
    const glossTech   = (dsm5Data.glossary_technical || { terms: [] }).terms;
    const glossCult   = (dsm5Data.glossary_cultural  || { terms: [] }).terms;

    // ── Normalize helper ─────────────────────────────────────────
    const norm = str =>
        (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // ── Chat DOM Creation ────────────────────────────────────────
    const chatToggle = document.createElement('button');
    chatToggle.id = 'aiChatToggle';
    chatToggle.className = 'ai-chat-toggle';
    chatToggle.innerHTML = `
        <span class="chat-toggle-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
        </span>
        <span class="chat-toggle-label">Asistente IA</span>
        <span class="chat-toggle-pulse"></span>`;
    document.body.appendChild(chatToggle);

    const chatPanel = document.createElement('div');
    chatPanel.id = 'aiChatPanel';
    chatPanel.className = 'ai-chat-panel';
    chatPanel.innerHTML = `
        <div class="chat-header">
            <div class="chat-header-left">
                <div class="chat-avatar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/>
                        <line x1="9" y1="22" x2="15" y2="22"/>
                        <line x1="10" y1="2" x2="10" y2="4"/>
                        <line x1="14" y1="2" x2="14" y2="4"/>
                    </svg>
                </div>
                <div>
                    <h3 class="chat-title">Asistente DSM-5</h3>
                    <span class="chat-status"><span class="status-dot"></span> En línea</span>
                </div>
            </div>
            <div class="chat-header-actions">
                <button class="chat-clear-btn" id="chatClearBtn" title="Limpiar chat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                </button>
                <button class="chat-close-btn" id="chatCloseBtn" title="Cerrar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
        </div>

        <div class="chat-messages" id="chatMessages">
            <!-- Messages injected here -->
        </div>

        <div class="chat-suggestions" id="chatSuggestions">
            <button class="suggestion-chip" data-q="¿Qué tipos de trastornos de ansiedad hay?">😰 Ansiedad</button>
            <button class="suggestion-chip" data-q="¿Cuáles son los criterios del TDAH?">🧠 TDAH</button>
            <button class="suggestion-chip" data-q="Trastornos depresivos">😔 Depresión</button>
        </div>

        <div class="chat-input-area">
            <div class="chat-input-wrapper">
                <input type="text" id="chatInput" placeholder="Pregúntame sobre cualquier trastorno..." autocomplete="off"/>
                <button id="chatSendBtn" class="chat-send-btn" title="Enviar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                </button>
            </div>
            <span class="chat-disclaimer">Busca en los 144 trastornos del DSM-5 📚</span>
        </div>`;
    document.body.appendChild(chatPanel);

    // ── DOM refs ─────────────────────────────────────────────────
    const messagesEl    = document.getElementById('chatMessages');
    const inputEl       = document.getElementById('chatInput');
    const sendBtn       = document.getElementById('chatSendBtn');
    const closeBtn      = document.getElementById('chatCloseBtn');
    const clearBtn      = document.getElementById('chatClearBtn');
    const suggestionsEl = document.getElementById('chatSuggestions');
    let isOpen = false;

    // ── Toggle panel ─────────────────────────────────────────────
    chatToggle.addEventListener('click', () => {
        isOpen = !isOpen;
        chatPanel.classList.toggle('open', isOpen);
        chatToggle.classList.toggle('active', isOpen);
        if (isOpen) {
            inputEl.focus();
            if (messagesEl.children.length === 0) addWelcomeMessage();
        }
    });

    closeBtn.addEventListener('click', () => {
        isOpen = false;
        chatPanel.classList.remove('open');
        chatToggle.classList.remove('active');
    });

    clearBtn.addEventListener('click', () => {
        messagesEl.innerHTML = '';
        suggestionsEl.style.display = 'flex';
        addWelcomeMessage();
    });

    // ── Suggestions ──────────────────────────────────────────────
    suggestionsEl.querySelectorAll('.suggestion-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const q = chip.dataset.q;
            inputEl.value = q;
            handleSend();
        });
    });

    // ── Send message ─────────────────────────────────────────────
    sendBtn.addEventListener('click', handleSend);
    inputEl.addEventListener('keydown', e => {
        if (e.key === 'Enter') handleSend();
    });

    function handleSend() {
        const text = inputEl.value.trim();
        if (!text) return;

        suggestionsEl.style.display = 'none';
        addMessage('user', text);
        inputEl.value = '';

        // Show typing indicator
        const typingEl = addTypingIndicator();

        // Simulate small delay for natural feel
        setTimeout(() => {
            typingEl.remove();
            const response = generateResponse(text);
            addMessage('bot', response.html, response.actions);
            messagesEl.scrollTop = messagesEl.scrollHeight;
        }, 400 + Math.random() * 500);
    }

    // ── Messages ─────────────────────────────────────────────────
    function addWelcomeMessage() {
        addMessage('bot', `
            <p>¡Hola! 👋 Soy tu asistente del <strong>DSM-5</strong>.</p>
            <p>Dime qué trastorno buscas o qué dudas tienes y te ayudaré rápido. ✨</p>
        `);
    }

    function addMessage(type, html, actions) {
        const msgEl = document.createElement('div');
        msgEl.className = `chat-msg chat-msg-${type}`;

        const now = new Date();
        const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

        let avatarSvg = '';
        if (type === 'bot') {
            avatarSvg = `<div class="msg-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/>
                    <line x1="9" y1="22" x2="15" y2="22"/>
                </svg>
            </div>`;
        }

        let actionsHtml = '';
        if (actions && actions.length > 0) {
            actionsHtml = `<div class="msg-actions">${actions.map(a =>
                `<button class="msg-action-btn" data-disorder-id="${a.id}">${a.icon || '📋'} ${a.label}</button>`
            ).join('')}</div>`;
        }

        msgEl.innerHTML = `
            ${avatarSvg}
            <div class="msg-content">
                <div class="msg-bubble">${html}</div>
                ${actionsHtml}
                <span class="msg-time">${time}</span>
            </div>`;

        messagesEl.appendChild(msgEl);
        messagesEl.scrollTop = messagesEl.scrollHeight;

        // Bind action buttons
        msgEl.querySelectorAll('.msg-action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.disorderId;
                navigateToDisorder(id);
            });
        });

        return msgEl;
    }

    function addTypingIndicator() {
        const el = document.createElement('div');
        el.className = 'chat-msg chat-msg-bot typing-indicator-msg';
        el.innerHTML = `
            <div class="msg-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/>
                </svg>
            </div>
            <div class="msg-content">
                <div class="msg-bubble typing-indicator">
                    <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                </div>
            </div>`;
        messagesEl.appendChild(el);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        return el;
    }

    // ── Navigate to disorder ─────────────────────────────────────
    function navigateToDisorder(id) {
        // Find in sidebar and click it
        const tocItems = document.querySelectorAll('.toc-item');
        const target = disorders.find(d => d.id === id);
        if (!target) return;

        // Trigger the app's showItem
        for (const li of tocItems) {
            const titleEl = li.querySelector('.toc-title');
            if (titleEl && norm(titleEl.textContent).includes(norm(target.title).substring(0, 30))) {
                li.click();
                // Close chat on mobile
                if (window.innerWidth < 768) {
                    isOpen = false;
                    chatPanel.classList.remove('open');
                    chatToggle.classList.remove('active');
                }
                return;
            }
        }
    }

    // ── Intelligent Response Engine ──────────────────────────────
    function generateResponse(query) {
        const q = norm(query);
        const words = q.split(/\s+/).filter(w => w.length > 2);

        // ── Intent detection ─────────────────────────────────
        const isQuestion        = /^\?|que es|qué es|que son|qué son|cuales|cuáles|como|cómo|cuando|cuándo|donde|dónde|por que|por qué|explica|dime|hablame|háblame/.test(q);
        const wantsCriteria     = /criterio|diagnos|sintoma|síntoma/.test(q);
        const wantsDifferential = /diferenci|diferencial|comparar|compara|distinguir|vs|versus|parecid/.test(q);
        const wantsPrevalence   = /prevalencia|frecuencia|comun|común|porcentaje|cuantos|cuántos|estadistic/.test(q);
        const wantsChapter      = /capitulo|capítulo|seccion|sección|categoria|categoría|tipos|clasificacion|clasificación/.test(q);
        const wantsGlossary     = /glosario|termino|término|definicion|definición|significa|concepto/.test(q);
        const wantsCourse       = /curso|desarrollo|edad|inicio|evolucion|evolución|pronostico|pronóstico/.test(q);
        const wantsRisk         = /riesgo|factor|causa|etiolog|genetico|genético|ambiental/.test(q);
        const wantsComorbidity  = /comorbilidad|comorbid|asociad|concurr|acompañ/.test(q);
        const wantsSpecifiers   = /especificad|subtipo|gravedad|leve|moderado|grave/.test(q);

        // ── Search in disorders ──────────────────────────────
        let matches = [];

        // Exact title matches first
        const exactMatches = disorders.filter(d => norm(d.title).includes(q) || q.includes(norm(d.title)));
        if (exactMatches.length > 0) {
            matches = exactMatches;
        } else {
            // Word-based scoring
            const scored = disorders.map(d => {
                let score = 0;
                const searchFields = [
                    { text: d.title, weight: 5 },
                    { text: d.code || '', weight: 4 },
                    { text: d.chapter || '', weight: 3 },
                    { text: d.criterios_raw || '', weight: 2 },
                    { text: d.diagnostico_diferencial || '', weight: 1.5 },
                    { text: d.caracteristicas || '', weight: 1 },
                    { text: d.comorbilidad || '', weight: 1 },
                ];

                words.forEach(w => {
                    searchFields.forEach(f => {
                        if (norm(f.text).includes(w)) score += f.weight;
                    });
                });

                return { disorder: d, score };
            }).filter(s => s.score > 0).sort((a, b) => b.score - a.score);

            matches = scored.slice(0, 8).map(s => s.disorder);
        }

        // ── Search in chapters ───────────────────────────────
        const chapterMatches = (dsm5Data.chapters || []).filter(ch =>
            words.some(w => norm(ch).includes(w))
        );

        // ── Search in glossary ───────────────────────────────
        let glossMatches = [];
        if (wantsGlossary || matches.length === 0) {
            glossMatches = [...glossTech, ...glossCult].filter(t =>
                words.some(w =>
                    norm(t.term || t.concept || '').includes(w) ||
                    norm(t.definition || t.description || '').includes(w)
                )
            ).slice(0, 5);
        }

        // ── Build response ───────────────────────────────────
        let html = '';
        let actions = [];

        // Greeting handling
        if (/^(hola|hey|buenas|buenos|hi|hello|saludos|ey)/.test(q) && words.length <= 3) {
            return {
                html: `<p>¡Hola! 😊 ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre cualquier trastorno del DSM-5, sus criterios, diagnóstico diferencial, y más.</p>`,
                actions: []
            };
        }

        // Gratitude handling
        if (/^(gracias|thanks|ty|genial|perfecto|excelente|bien)/.test(q) && words.length <= 4) {
            return {
                html: `<p>¡De nada! 💕 Si necesitas algo más, aquí estoy para ayudarte. 📚</p>`,
                actions: []
            };
        }

        // If asking about chapters/categories
        if (wantsChapter && chapterMatches.length > 0) {
            html += `<p>📂 Encontré estos <strong>capítulos</strong> relacionados:</p><ul>`;
            chapterMatches.forEach(ch => {
                const count = disorders.filter(d => d.chapter === ch).length;
                html += `<li><strong>${escHtml(ch)}</strong> — ${count} trastornos</li>`;
            });
            html += `</ul>`;

            if (chapterMatches.length === 1) {
                const chName = chapterMatches[0];
                const chDisorders = disorders.filter(d => d.chapter === chName).slice(0, 6);
                if (chDisorders.length > 0) {
                    html += `<p>Estos son algunos trastornos de este capítulo:</p>`;
                    actions = chDisorders.map(d => ({
                        id: d.id,
                        label: d.title,
                        icon: '📋'
                    }));
                }
            }
        }

        // If we found disorder matches
        if (matches.length > 0) {
            if (matches.length === 1) {
                const d = matches[0];
                html += `<p>✨ Encontré: <strong>${escHtml(d.title)}</strong></p>`;
                html += `<p class="msg-meta">📁 ${escHtml(d.chapter)} · ${escHtml(d.code || 'Sin código')}</p>`;

                if (wantsCriteria || (!wantsDifferential && !wantsPrevalence && !wantsCourse && !wantsRisk && !wantsComorbidity && !wantsSpecifiers)) {
                    const criteriaPreview = (d.criterios || []).slice(0, 2).map(c =>
                        escHtml(c.length > 180 ? c.substring(0, 180) + '…' : c)
                    );
                    if (criteriaPreview.length > 0) {
                        html += `<p><strong>📋 Criterios diagnósticos:</strong></p>`;
                        html += criteriaPreview.map(c => `<p class="msg-criteria">${c}</p>`).join('');
                        if ((d.criterios || []).length > 2) {
                            html += `<p class="msg-more">...y ${d.criterios.length - 2} criterio(s) más</p>`;
                        }
                    }
                }

                if (wantsDifferential && d.diagnostico_diferencial) {
                    const diffPreview = d.diagnostico_diferencial.substring(0, 300);
                    html += `<p><strong>⚖️ Diagnóstico Diferencial:</strong></p>`;
                    html += `<p>${escHtml(diffPreview)}${d.diagnostico_diferencial.length > 300 ? '…' : ''}</p>`;
                }

                if (wantsPrevalence && d.prevalencia) {
                    html += `<p><strong>📊 Prevalencia:</strong></p>`;
                    html += `<p>${escHtml(d.prevalencia.substring(0, 250))}</p>`;
                }

                if (wantsCourse && d.desarrollo_y_curso) {
                    html += `<p><strong>📈 Desarrollo y Curso:</strong></p>`;
                    html += `<p>${escHtml(d.desarrollo_y_curso.substring(0, 300))}…</p>`;
                }

                if (wantsRisk && d.factores_de_riesgo) {
                    html += `<p><strong>⚠️ Factores de Riesgo:</strong></p>`;
                    html += `<p>${escHtml(d.factores_de_riesgo.substring(0, 300))}…</p>`;
                }

                if (wantsComorbidity && d.comorbilidad) {
                    html += `<p><strong>🔗 Comorbilidad:</strong></p>`;
                    html += `<p>${escHtml(d.comorbilidad.substring(0, 300))}…</p>`;
                }

                html += `<p>👆 Haz clic abajo para ver toda la información completa:</p>`;
                actions = [{ id: d.id, label: `Ver ${d.title}`, icon: '📖' }];

            } else {
                html += `<p>🔎 Encontré <strong>${matches.length} trastornos</strong> relacionados:</p>`;
                const displayMatches = matches.slice(0, 6);
                actions = displayMatches.map(d => ({
                    id: d.id,
                    label: d.title,
                    icon: '📋'
                }));
                if (matches.length > 6) {
                    html += `<p class="msg-more">...y ${matches.length - 6} resultado(s) más. Intenta ser más específica en tu búsqueda.</p>`;
                }
            }
        }

        // Glossary results
        if (glossMatches.length > 0) {
            html += `<p>📖 <strong>Del Glosario:</strong></p>`;
            glossMatches.slice(0, 3).forEach(t => {
                const term = t.term || t.concept || '';
                const def = (t.definition || t.description || '').substring(0, 200);
                html += `<div class="msg-glossary-card"><strong>${escHtml(term)}</strong><br/>${escHtml(def)}${(t.definition || t.description || '').length > 200 ? '…' : ''}</div>`;
            });
        }

        // Fallback — no results
        if (!html) {
            // Try fuzzy matching with partial words
            const fuzzyMatches = disorders.filter(d => {
                const allText = norm(`${d.title} ${d.chapter} ${d.code} ${d.criterios_raw}`);
                return words.some(w => w.length > 3 && allText.includes(w.substring(0, Math.min(w.length, 5))));
            }).slice(0, 5);

            if (fuzzyMatches.length > 0) {
                html = `<p>🤔 No encontré un resultado exacto, pero estos trastornos podrían estar relacionados:</p>`;
                actions = fuzzyMatches.map(d => ({
                    id: d.id,
                    label: d.title,
                    icon: '📋'
                }));
            } else {
                html = `<p>😅 No encontré resultados para "<em>${escHtml(query)}</em>".</p>
                    <p>Intenta buscar con otras palabras, por ejemplo:</p>
                    <ul>
                        <li>El nombre del trastorno (ej: "TDAH", "esquizofrenia")</li>
                        <li>Un síntoma (ej: "alucinaciones", "ansiedad")</li>
                        <li>Un código CIE (ej: "F32", "F20")</li>
                        <li>Un capítulo (ej: "trastornos de ansiedad")</li>
                    </ul>`;
            }
        }

        return { html, actions };
    }

    function escHtml(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
});
