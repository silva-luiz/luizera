// Campo Minado da sidebar (partial minesweeper.html).
// Clique abre, clique direito (ou o botão "Bandeira") marca. O primeiro clique nunca é mina.
// Clicar num número com as bandeiras certas em volta abre os vizinhos. Tecla F marca bandeira.

const FACES = { playing: "🙂", pressing: "😮", won: "😎", lost: "😵" };
const RECORD_KEY = "luizera-minesweeper-record";

export function setupMinesweeper() {
    document.querySelectorAll("[data-minesweeper]").forEach(createGame);
}

function createGame(root) {
    const rows = parseInt(root.dataset.rows, 10) || 9;
    const cols = parseInt(root.dataset.cols, 10) || 9;
    const mineCount = parseInt(root.dataset.mines, 10) || 10;

    const board = root.querySelector("[data-ms-board]");
    const face = root.querySelector("[data-ms-reset]");
    const minesLed = root.querySelector("[data-ms-mines]");
    const timerLed = root.querySelector("[data-ms-timer]");
    const flagModeButton = root.querySelector("[data-ms-flag-mode]");
    const status = root.querySelector("[data-ms-status]");

    let cells, state, flags, revealed, seconds, timer, flagMode = false;

    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    function reset() {
        stopTimer();
        state = "ready"; // ready -> playing -> won | lost
        flags = 0;
        revealed = 0;
        seconds = 0;
        cells = [];
        board.textContent = "";
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const el = document.createElement("button");
                el.type = "button";
                el.className = "ms-cell";
                const cell = { r, c, el, mine: false, open: false, flag: false, count: 0 };
                el.addEventListener("click", () => (flagMode ? toggleFlag(cell) : open(cell)));
                el.addEventListener("contextmenu", (e) => { e.preventDefault(); toggleFlag(cell); });
                el.addEventListener("keydown", (e) => { if (e.key === "f" || e.key === "F") toggleFlag(cell); });
                el.addEventListener("pointerdown", (e) => { if (e.button === 0 && isActive()) face.textContent = FACES.pressing; });
                cells.push(cell);
                label(cell);
                board.appendChild(el);
            }
        }
        face.textContent = FACES.playing;
        setStatus(recordText());
        updateLeds();
    }

    const at = (r, c) => cells[r * cols + c];
    const isActive = () => state === "ready" || state === "playing";

    function neighbors(cell) {
        const list = [];
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const r = cell.r + dr, c = cell.c + dc;
                if ((dr || dc) && r >= 0 && r < rows && c >= 0 && c < cols) list.push(at(r, c));
            }
        }
        return list;
    }

    // Espalha as minas longe do primeiro clique (a célula e as vizinhas ficam livres)
    function placeMines(first) {
        const safe = new Set([first, ...neighbors(first)]);
        const pool = cells.filter((cell) => !safe.has(cell));
        for (let i = 0; i < mineCount && pool.length; i++) {
            const pick = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
            pick.mine = true;
        }
        cells.forEach((cell) => { cell.count = neighbors(cell).filter((n) => n.mine).length; });
    }

    function open(cell) {
        if (!isActive() || cell.flag) return;
        if (state === "ready") {
            placeMines(cell);
            state = "playing";
            startTimer();
        }
        if (cell.open) { chord(cell); return; }
        if (cell.mine) { lose(cell); return; }
        flood(cell);
        checkWin();
    }

    // Abre a célula e, se for zero, as vizinhas também
    function flood(start) {
        const stack = [start];
        while (stack.length) {
            const cell = stack.pop();
            if (cell.open || cell.flag) continue;
            cell.open = true;
            revealed++;
            paint(cell);
            if (cell.count === 0) neighbors(cell).forEach((n) => { if (!n.open && !n.mine) stack.push(n); });
        }
    }

    // Clique num número já aberto: se as bandeiras em volta batem, abre o resto
    function chord(cell) {
        if (!cell.count) return;
        const around = neighbors(cell);
        if (around.filter((n) => n.flag).length !== cell.count) return;
        for (const n of around) {
            if (n.open || n.flag) continue;
            if (n.mine) { lose(n); return; }
            flood(n);
        }
        checkWin();
    }

    function toggleFlag(cell) {
        if (!isActive() || cell.open) return;
        cell.flag = !cell.flag;
        flags += cell.flag ? 1 : -1;
        paint(cell);
        updateLeds();
    }

    function lose(hit) {
        state = "lost";
        stopTimer();
        face.textContent = FACES.lost;
        cells.forEach((cell) => {
            if (cell.mine && !cell.flag) { cell.open = true; paint(cell); }
            else if (!cell.mine && cell.flag) cell.el.classList.add("ms-wrong");
        });
        hit.el.classList.add("ms-hit");
        setStatus("BOOM! Clique na carinha para tentar de novo.");
    }

    function checkWin() {
        if (state !== "playing" || revealed !== rows * cols - mineCount) return;
        state = "won";
        stopTimer();
        face.textContent = FACES.won;
        cells.forEach((cell) => { if (cell.mine && !cell.flag) { cell.flag = true; paint(cell); } });
        flags = mineCount;
        updateLeds();
        const record = readRecord();
        if (!record || seconds < record) {
            saveRecord(seconds);
            setStatus(`Novo recorde: ${seconds}s!`);
        } else {
            setStatus(`Venceu em ${seconds}s! Recorde: ${record}s`);
        }
    }

    function paint(cell) {
        const el = cell.el;
        el.classList.toggle("ms-open", cell.open);
        el.classList.toggle("ms-flag", cell.flag);
        el.removeAttribute("data-n");
        if (cell.open) {
            el.textContent = cell.mine ? "💣" : (cell.count || "");
            if (!cell.mine && cell.count) el.dataset.n = cell.count;
        } else {
            el.textContent = cell.flag ? "🚩" : "";
        }
        label(cell);
    }

    function label(cell) {
        let what = "fechada";
        if (cell.flag) what = "com bandeira";
        else if (cell.open) what = cell.mine ? "mina" : (cell.count ? `${cell.count} minas em volta` : "vazia");
        cell.el.setAttribute("aria-label", `Linha ${cell.r + 1}, coluna ${cell.c + 1}: ${what}`);
    }

    function startTimer() {
        timer = setInterval(() => { seconds = Math.min(seconds + 1, 999); updateLeds(); }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
        timer = null;
    }

    const led = (n) => (n < 0 ? "-" + String(-n).padStart(2, "0") : String(n).padStart(3, "0"));

    function updateLeds() {
        minesLed.textContent = led(mineCount - flags);
        timerLed.textContent = led(seconds);
    }

    function setStatus(text) { status.textContent = text; }

    function readRecord() {
        try { return parseInt(localStorage.getItem(RECORD_KEY), 10) || 0; } catch (e) { return 0; }
    }

    function saveRecord(value) {
        try { localStorage.setItem(RECORD_KEY, String(value)); } catch (e) { /* modo privado */ }
    }

    function recordText() {
        const record = readRecord();
        return record ? `Recorde: ${record}s` : "";
    }

    face.addEventListener("click", reset);
    // Solta o mouse fora da célula: volta a carinha normal
    document.addEventListener("pointerup", () => { if (isActive()) face.textContent = FACES.playing; });
    flagModeButton.addEventListener("click", () => {
        flagMode = !flagMode;
        flagModeButton.setAttribute("aria-pressed", flagMode ? "true" : "false");
    });

    reset();
}
