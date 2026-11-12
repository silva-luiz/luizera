document.addEventListener("DOMContentLoaded", function () {
    setupMenu();
    setupStartMenu();
    setupClock();
    setupCopyButtons();
    setupSearch();
    setupBSOD();
    setupImageViewer();
    setupWindows();
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

// Menu Iniciar + tela "pode desligar o computador"
function setupStartMenu() {
    const button = document.getElementById("start-button");
    const menu = document.getElementById("start-menu");
    if (!button || !menu) return;
    const items = function () { return Array.from(menu.querySelectorAll("a, button")); };

    const open = function () {
        menu.hidden = false;
        button.setAttribute("aria-expanded", "true");
        items()[0].focus();
    };
    const close = function (refocus) {
        menu.hidden = true;
        button.setAttribute("aria-expanded", "false");
        if (refocus) button.focus();
    };

    button.addEventListener("click", function (e) {
        e.stopPropagation();
        if (menu.hidden) open(); else close(false);
    });
    document.addEventListener("click", function (e) {
        if (!menu.hidden && !menu.contains(e.target)) close(false);
    });
    menu.addEventListener("keydown", function (e) {
        const list = items(), i = list.indexOf(document.activeElement);
        if (e.key === "Escape") { close(true); }
        else if (e.key === "ArrowDown") { e.preventDefault(); list[(i + 1) % list.length].focus(); }
        else if (e.key === "ArrowUp") { e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); }
    });

    const shutdownButton = document.getElementById("shutdown-button");
    const screen = document.getElementById("shutdown-screen");
    if (!shutdownButton || !screen) return;
    const wake = function () {
        screen.hidden = true;
        document.removeEventListener("keydown", wake);
        button.focus();
    };
    shutdownButton.addEventListener("click", function () {
        close(false);
        screen.hidden = false;
        screen.focus();
        // espera o clique atual terminar antes de ouvir o próximo
        setTimeout(function () { document.addEventListener("keydown", wake); }, 0);
    });
    screen.addEventListener("click", wake);
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

// 404 em tela azul: mostra o caminho pedido e volta pra home com qualquer tecla
function setupBSOD() {
    const bsod = document.getElementById("bsod");
    if (!bsod) return;
    const path = document.getElementById("bsod-path");
    if (path) path.textContent = location.host + location.pathname;
    document.addEventListener("keydown", function (e) {
        // Tab continua navegando pelos links; teclas de atalho do navegador são ignoradas
        if (e.key === "Tab" || e.ctrlKey || e.metaKey || e.altKey) return;
        location.href = bsod.dataset.home;
    });
}

// IMAGEVIEW.EXE: clicar numa imagem do post abre ela ampliada
function setupImageViewer() {
    const imgs = Array.from(document.querySelectorAll(".markdown img"))
        .filter(function (img) { return !img.closest("a"); });
    if (!imgs.length) return;

    const viewer = document.createElement("div");
    viewer.className = "imageview";
    viewer.hidden = true;
    viewer.setAttribute("role", "dialog");
    viewer.setAttribute("aria-modal", "true");
    viewer.setAttribute("aria-label", "Visualizador de imagem");
    viewer.innerHTML =
        '<div class="imageview-window">' +
        '  <div class="imageview-title"><span class="imageview-name"></span>' +
        '    <button type="button" class="imageview-close" aria-label="Fechar">×</button></div>' +
        '  <div class="imageview-body">' +
        '    <button type="button" class="imageview-nav prev" aria-label="Imagem anterior">◀</button>' +
        '    <img alt="">' +
        '    <button type="button" class="imageview-nav next" aria-label="Próxima imagem">▶</button>' +
        '  </div>' +
        '  <div class="imageview-status"><span class="imageview-caption"></span><span class="imageview-count"></span></div>' +
        '</div>';
    document.body.appendChild(viewer);

    const big = viewer.querySelector(".imageview-body img");
    const name = viewer.querySelector(".imageview-name");
    const caption = viewer.querySelector(".imageview-caption");
    const count = viewer.querySelector(".imageview-count");
    const closeBtn = viewer.querySelector(".imageview-close");
    let current = 0, opener = null;

    const show = function (i) {
        current = (i + imgs.length) % imgs.length;
        const img = imgs[current];
        const fig = img.closest("figure");
        const cap = fig && fig.querySelector("figcaption");
        big.src = img.currentSrc || img.src;
        big.alt = img.alt;
        name.textContent = "IMAGEVIEW.EXE — " + decodeURIComponent(big.src.split("/").pop().split("?")[0]);
        caption.textContent = cap ? cap.textContent.trim() : img.alt;
        count.textContent = imgs.length > 1 ? (current + 1) + " / " + imgs.length : "";
        viewer.classList.toggle("single", imgs.length < 2);
    };
    const open = function (i) {
        opener = document.activeElement;
        show(i);
        viewer.hidden = false;
        document.body.classList.add("imageview-open");
        closeBtn.focus();
    };
    const close = function () {
        viewer.hidden = true;
        document.body.classList.remove("imageview-open");
        if (opener) opener.focus();
    };

    imgs.forEach(function (img, i) {
        img.classList.add("zoomable");
        img.tabIndex = 0;
        img.setAttribute("role", "button");
        img.setAttribute("aria-label", "Ampliar imagem" + (img.alt ? ": " + img.alt : ""));
        img.addEventListener("click", function () { open(i); });
        img.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); }
        });
    });
    closeBtn.addEventListener("click", close);
    viewer.querySelector(".prev").addEventListener("click", function () { show(current - 1); });
    viewer.querySelector(".next").addEventListener("click", function () { show(current + 1); });
    viewer.addEventListener("click", function (e) { if (e.target === viewer) close(); });
    document.addEventListener("keydown", function (e) {
        if (viewer.hidden) return;
        if (e.key === "Escape") close();
        else if (e.key === "ArrowLeft") show(current - 1);
        else if (e.key === "ArrowRight") show(current + 1);
    });
}

// Janelas com _ e ×: vão para a barra de tarefas e voltam com um clique
function setupWindows() {
    const taskbar = document.querySelector(".system-footer");
    const spacer = taskbar && taskbar.querySelector(".footer-spacer");
    if (!taskbar || !spacer) return;

    const store = {
        get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
        set: function (k, v) { try { if (v) localStorage.setItem(k, v); else localStorage.removeItem(k); } catch (e) { } }
    };

    document.querySelectorAll("[data-window]").forEach(function (win) {
        const name = win.dataset.window;
        const key = "janela:" + name;
        let task = null;

        const restore = function () {
            win.classList.remove("win-minimized");
            if (task) { task.remove(); task = null; }
            store.set(key, null);
            const first = win.querySelector("[data-win-action]");
            if (first) first.focus();
        };
        const minimize = function (focusTask) {
            win.classList.add("win-minimized");
            store.set(key, "min");
            if (!task) {
                task = document.createElement("button");
                task.type = "button";
                task.className = "task-button";
                task.textContent = name;
                task.title = "Restaurar " + name;
                task.addEventListener("click", restore);
                taskbar.insertBefore(task, spacer);
            }
            if (focusTask) task.focus();
        };

        win.querySelectorAll("[data-win-action]").forEach(function (btn) {
            btn.addEventListener("click", function () { minimize(true); });
        });
        if (store.get(key) === "min") minimize(false);
    });
}
