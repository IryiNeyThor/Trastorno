document.addEventListener('DOMContentLoaded', () => {

    // ── Verificación de datos ──────────────────────────────────
    if (typeof dsm5Data === 'undefined') {
        document.getElementById('welcomeScreen').innerHTML = `
            <div class="welcome-card glass-panel" style="border-color:var(--accent)">
                <span class="welcome-emoji">⚠️</span>
                <h2 style="color:var(--accent)">Error de carga</h2>
                <p>No se pudo cargar <strong>data.js</strong>. Asegúrate de generarlo primero.</p>
            </div>`;
        return;
    }

    // ── Referencias DOM ────────────────────────────────────────
    const tocList        = document.getElementById('tocList');
    const searchInput    = document.getElementById('searchInput');
    const resultsCount   = document.getElementById('resultsCount');
    const filterPills    = document.getElementById('filterPills');
    const welcomeScreen  = document.getElementById('welcomeScreen');
    const contentViewer  = document.getElementById('contentViewer');
    const contentTitle   = document.getElementById('contentTitle');
    const contentTag     = document.getElementById('contentTag');
    const contentCode    = document.getElementById('contentCode');
    const contentChapter = document.getElementById('contentChapter');
    const viewTabs       = document.getElementById('viewTabs');
    const generalReader  = document.getElementById('generalReader');
    const generalText    = document.getElementById('generalText');
    const criteriaList   = document.getElementById('criteriaList');
    const diffText       = document.getElementById('diffText');
    const caractGrid     = document.getElementById('caractGrid');
    const especifContent = document.getElementById('especifContent');
    const themeToggle    = document.getElementById('themeToggle');
    const sunIcon        = document.querySelector('.sun-icon');
    const moonIcon       = document.querySelector('.moon-icon');

    let currentFilter = 'all';

    // ── Tema ──────────────────────────────────────────────────
    const initTheme = () => {
        const saved = localStorage.getItem('dsm5-theme') || 'light';
        document.documentElement.setAttribute('data-theme', saved);
        updateThemeIcons(saved);
    };
    const updateThemeIcons = (theme) => {
        sunIcon.style.display  = theme === 'dark' ? 'none'  : 'block';
        moonIcon.style.display = theme === 'dark' ? 'block' : 'none';
    };
    themeToggle.addEventListener('click', () => {
        const cur  = document.documentElement.getAttribute('data-theme');
        const next = cur === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('dsm5-theme', next);
        updateThemeIcons(next);
    });
    initTheme();

    // ── Utilidades ────────────────────────────────────────────
    const normalize = str =>
        (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const escapeHtml = str => {
        if (typeof str !== 'string') return '';
        return str.replace(/&/g,'&amp;').replace(/</g,'&lt;')
                  .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    };

    // ── Datos ─────────────────────────────────────────────────
    const disordersList = dsm5Data.disorders || [];
    const section1List  = dsm5Data.section1  || [];
    const techGlossary  = dsm5Data.glossary_technical || { terms: [] };
    const cultGlossary  = dsm5Data.glossary_cultural  || { terms: [] };

    // ── Tabs de contenido ─────────────────────────────────────
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const pane = document.getElementById('pane' + target.charAt(0).toUpperCase() + target.slice(1));
            if (pane) pane.classList.add('active');
        });
    });

    // ── Filtros del sidebar ───────────────────────────────────
    filterPills.querySelectorAll('.pill').forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentFilter = pill.dataset.filter;
            applyFilters();
        });
    });

    // ── Renderizado del sidebar ───────────────────────────────
    const renderSidebar = (disorders, sec1Items, showGlossary) => {
        tocList.innerHTML = '';
        let total = 0;
        const frag = document.createDocumentFragment();

        // Sección I
        if (sec1Items.length > 0 && (currentFilter === 'all' || currentFilter === 'section1')) {
            const grp = makeGroup('Sección I. Conceptos Básicos');
            sec1Items.forEach(item => {
                total++;
                grp.ul.appendChild(makeTocItem(item.title, item.description, item.section, () => showItem(item, 'guide')));
            });
            grp.el.appendChild(grp.ul);
            frag.appendChild(grp.el);
        }

        // Glosarios
        if (showGlossary && (currentFilter === 'all' || currentFilter === 'glossary')) {
            const grp = makeGroup('Apéndices y Glosarios');
            if (techGlossary.terms.length > 0) {
                total++;
                grp.ul.appendChild(makeTocItem('Glosario de Términos Técnicos', `${techGlossary.terms.length} términos`, 'Apéndice', () => showItem(techGlossary, 'glossary_tech')));
            }
            if (cultGlossary.terms.length > 0) {
                total++;
                grp.ul.appendChild(makeTocItem('Glosario de Conceptos Culturales', `${cultGlossary.terms.length} conceptos`, 'Apéndice', () => showItem(cultGlossary, 'glossary_cult')));
            }
            grp.el.appendChild(grp.ul);
            frag.appendChild(grp.el);
        }

        // Trastornos por capítulo
        if (disorders.length > 0 && (currentFilter === 'all' || currentFilter === 'disorders')) {
            const chapMap = {};
            disorders.forEach(d => {
                const c = d.chapter || 'Otros';
                if (!chapMap[c]) chapMap[c] = [];
                chapMap[c].push(d);
            });
            Object.entries(chapMap).forEach(([chapName, list]) => {
                const grp = makeGroup(chapName, list.length);
                list.forEach(d => {
                    total++;
                    const prev = (d.criterios_raw || d.title).substring(0, 80);
                    grp.ul.appendChild(makeTocItem(d.title, prev, d.code || '', () => showItem(d, 'disorder')));
                });
                grp.el.appendChild(grp.ul);
                frag.appendChild(grp.el);
            });
        }

        resultsCount.textContent = `${total} elemento${total !== 1 ? 's' : ''}`;
        if (total === 0) {
            tocList.innerHTML = '<li style="padding:24px;text-align:center;color:var(--text-muted)">🔍 Sin resultados</li>';
        } else {
            tocList.appendChild(frag);
        }
    };

    const makeGroup = (title, count) => {
        const el = document.createElement('div');
        el.className = 'chapter-group';
        const badge = count != null ? `<span class="toc-badge">${count}</span>` : '';
        el.innerHTML = `<div class="chapter-header"><span>${escapeHtml(title)}</span>${badge}</div>`;
        const ul = document.createElement('ul');
        ul.className = 'toc-list';
        return { el, ul };
    };

    const makeTocItem = (title, preview, badge, onClick) => {
        const li = document.createElement('li');
        li.className = 'toc-item';
        li.innerHTML = `
            <div class="toc-title">${escapeHtml(title)} ${badge ? `<span class="toc-badge">[${escapeHtml(badge)}]</span>` : ''}</div>
            <div class="toc-preview">${escapeHtml(preview)}</div>`;
        li.addEventListener('click', () => {
            document.querySelector('.toc-item.active')?.classList.remove('active');
            li.classList.add('active');
            onClick();
        });
        return li;
    };

    // ── Mostrar contenido ─────────────────────────────────────
    const showItem = (item, type) => {
        welcomeScreen.style.display = 'none';
        contentViewer.style.display = 'block';
        contentTitle.textContent = item.title;

        if (type === 'disorder') {
            viewTabs.style.display = 'flex';
            generalReader.style.display = 'none';
            document.querySelectorAll('.tab-pane').forEach(p => p.style.display = '');

            contentTag.textContent = item.section || 'Sección II';
            contentCode.style.display = item.code ? 'inline-block' : 'none';
            contentCode.textContent = item.code || '';
            contentChapter.textContent = item.chapter || '';

            renderCriteria(item.criterios || []);

            diffText.innerHTML = (item.diagnostico_diferencial && item.diagnostico_diferencial.trim())
                ? formatParas(item.diagnostico_diferencial)
                : `<p style="color:var(--text-muted)">Ver capítulo <em>${escapeHtml(item.chapter)}</em> para diagnóstico diferencial general.</p>`;

            renderGrid(item);

            especifContent.innerHTML = (item.especificadores && item.especificadores.trim())
                ? formatParas(item.especificadores)
                : `<p style="color:var(--text-muted)">Sin especificadores adicionales.</p>`;

            document.querySelector('.tab-btn[data-tab="criterios"]').click();

        } else if (type === 'glossary_tech' || type === 'glossary_cult') {
            viewTabs.style.display = 'none';
            document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');
            generalReader.style.display = 'block';
            contentTag.textContent = 'Apéndice';
            contentCode.style.display = 'none';
            contentChapter.textContent = 'Glosarios del DSM-5';

            const terms = item.terms || [];
            generalText.innerHTML = '<div class="glossary-grid">' + terms.map(t => `
                <div class="glossary-card">
                    <div class="glossary-term">${escapeHtml(t.term || t.concept)}</div>
                    <div class="glossary-def">${escapeHtml(t.definition || t.description)}</div>
                </div>`).join('') + '</div>';

        } else if (type === 'guide') {
            viewTabs.style.display = 'none';
            document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');
            generalReader.style.display = 'block';
            contentTag.textContent = 'Sección I';
            contentCode.style.display = 'none';
            contentChapter.textContent = 'Conceptos Básicos';
            generalText.innerHTML = formatParas(item.content || item.description);
        }

        document.querySelector('.main-content').scrollTop = 0;
    };

    const renderCriteria = criterios => {
        criteriaList.innerHTML = '';
        if (!criterios || criterios.length === 0) {
            criteriaList.innerHTML = '<p style="color:var(--text-muted)">Sin criterios registrados.</p>';
            return;
        }
        criterios.forEach(crit => {
            const card = document.createElement('div');
            card.className = 'criteria-card';
            let html = escapeHtml(crit)
                .replace(/^([A-Z]\.\s+)/, '<strong>$1</strong>')
                .replace(/(\d+\.\s+)/g, '<strong>$1</strong>');
            card.innerHTML = `<p>${html}</p>`;
            criteriaList.appendChild(card);
        });
    };

    const renderGrid = item => {
        caractGrid.innerHTML = '';
        [
            { title: 'Características Diagnósticas', text: item.caracteristicas },
            { title: 'Comorbilidad',                  text: item.comorbilidad },
            { title: 'Prevalencia',                   text: item.prevalencia },
            { title: 'Desarrollo y Curso',            text: item.desarrollo_y_curso },
            { title: 'Factores de Riesgo',            text: item.factores_de_riesgo },
        ].forEach(sec => {
            if (sec.text && sec.text.trim()) {
                const box = document.createElement('div');
                box.className = 'sec-box';
                box.innerHTML = `<h4>${escapeHtml(sec.title)}</h4>${formatParas(sec.text)}`;
                caractGrid.appendChild(box);
            }
        });
        if (!caractGrid.children.length)
            caractGrid.innerHTML = '<p style="color:var(--text-muted)">Sin información adicional.</p>';
    };

    const formatParas = text => {
        if (!text) return '';
        return text.split('\n')
            .filter(l => l.trim())
            .map(l => `<p>${escapeHtml(l.trim())}</p>`)
            .join('');
    };

    // ── Búsqueda ──────────────────────────────────────────────
    let searchTimer;
    const applyFilters = () => {
        const q = normalize(searchInput.value.trim());
        let filtDisorders = disordersList;
        let filtSec1      = section1List;
        if (q) {
            filtDisorders = disordersList.filter(d =>
                normalize(d.title).includes(q) ||
                normalize(d.code || '').includes(q) ||
                normalize(d.criterios_raw || '').includes(q) ||
                normalize(d.diagnostico_diferencial || '').includes(q)
            );
            filtSec1 = section1List.filter(s =>
                normalize(s.title).includes(q) || normalize(s.description || '').includes(q)
            );
        }
        renderSidebar(filtDisorders, filtSec1, true);
    };
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(applyFilters, 150);
    });

    // ── Render inicial ─────────────────────────────────────────
    renderSidebar(disordersList, section1List, true);
});
