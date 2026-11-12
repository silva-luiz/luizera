document.addEventListener("DOMContentLoaded", function () {
    setupMenu();
    setupClock();
    setupCopyButtons();
    setupSearch();
});

// Menu no mobile
function setupMenu() {
    const toggle = document.querySelector("#menuToggle button");
    const menu = document.getElementById("menu");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", function () {
        const open = menu.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });
}

// Relógio da barra de tarefas
function setupClock() {
    const clock = document.getElementById("footer-clock");
    if (!clock) return;
    const update = function () {
        clock.textContent = new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
        });
    };
    update();
    setInterval(update, 1000);
}

// Botão "Copiar" nos blocos de código
function setupCopyButtons() {
    if (!navigator.clipboard) return;
    document.querySelectorAll(".highlight").forEach(function (block) {
        const code = block.querySelector("code");
        if (!code) return;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "copy-code";
        button.textContent = "Copiar";
        button.setAttribute("aria-label", "Copiar código");
        button.addEventListener("click", function () {
            // Copia sem os números de linha
            const clone = code.cloneNode(true);
            clone.querySelectorAll(".ln, .lnt").forEach(function (n) { n.remove(); });
            navigator.clipboard.writeText(clone.textContent.replace(/\n$/, "")).then(function () {
                button.textContent = "Copiado!";
            }, function () {
                button.textContent = "Erro :(";
            }).finally(function () {
                setTimeout(function () { button.textContent = "Copiar"; }, 1500);
            });
        });
        block.appendChild(button);
    });
}

// Busca (página /busca/)
function setupSearch() {
    const input = document.getElementById("search-input");
    const status = document.getElementById("search-status");
    const results = document.getElementById("search-results");
    if (!input || !status || !results) return;

    const normalize = function (s) {
        return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    };
    const escapeHtml = function (s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    };
    const escapeRegex = function (s) {
        return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    };

    let index = null;

    // Trecho do conteúdo em volta do primeiro termo, com os termos destacados
    const snippet = function (p, terms) {
        const text = p.content || "";
        const pos = p._content.indexOf(terms[0]);
        if (pos < 0) return escapeHtml(p.summary);
        const start = Math.max(0, pos - 80);
        const raw = (start > 0 ? "…" : "") + text.slice(start, pos + 140) + "…";
        // normalize() mantém o tamanho do texto para letras acentuadas comuns,
        // então as posições batem entre o texto original e o normalizado
        const norm = normalize(raw);
        const re = new RegExp(terms.map(escapeRegex).join("|"), "g");
        let html = "", i = 0, m;
        while ((m = re.exec(norm)) !== null) {
            html += escapeHtml(raw.slice(i, m.index)) + "<mark>" + escapeHtml(raw.slice(m.index, m.index + m[0].length)) + "</mark>";
            i = m.index + m[0].length;
        }
        return html + escapeHtml(raw.slice(i));
    };

    const run = function () {
        if (!index) return;
        const query = input.value.trim();
        const terms = normalize(query).split(/\s+/).filter(Boolean);
        const url = new URL(location.href);
        if (query) url.searchParams.set("q", query); else url.searchParams.delete("q");
        history.replaceState(null, "", url);

        results.innerHTML = "";
        if (!terms.length) {
            status.textContent = index.length + " posts indexados. Digite algo pra buscar.";
            return;
        }
        const found = index.map(function (p) {
            let score = 0;
            for (const t of terms) {
                const inTitle = p._title.includes(t), inMeta = p._meta.includes(t), inContent = p._content.includes(t);
                if (!inTitle && !inMeta && !inContent) return null;
                score += (inTitle ? 10 : 0) + (inMeta ? 5 : 0) + (inContent ? 1 : 0);
            }
            return { p: p, score: score };
        }).filter(Boolean).sort(function (a, b) { return b.score - a.score; });

        status.textContent = found.length
            ? found.length + (found.length === 1 ? " resultado" : " resultados") + " para \"" + query + "\""
            : "Nada encontrado para \"" + query + "\". Tente outra palavra.";

        results.innerHTML = found.map(function (r) {
            return '<li><a class="search-result-title" href="' + escapeHtml(r.p.url) + '">' + escapeHtml(r.p.title) + "</a>" +
                '<div class="search-result-meta">' + escapeHtml(r.p.date) + "</div>" +
                "<p>" + snippet(r.p, terms) + "</p></li>";
        }).join("");
    };

    status.textContent = "Carregando índice...";
    fetch(input.dataset.index)
        .then(function (r) { return r.json(); })
        .then(function (data) {
            index = data.map(function (p) {
                return Object.assign({}, p, {
                    _title: normalize(p.title),
                    _meta: normalize((p.tags || []).concat(p.categories || []).join(" ")),
                    _content: normalize(p.content)
                });
            });
            const q = new URLSearchParams(location.search).get("q");
            if (q) input.value = q;
            run();
        })
        .catch(function () {
            status.textContent = "Não consegui carregar o índice de busca.";
        });

    let timer;
    input.addEventListener("input", function () {
        clearTimeout(timer);
        timer = setTimeout(run, 150);
    });
}
