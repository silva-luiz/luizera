document.addEventListener("DOMContentLoaded", function () {
    // Menu no mobile
    const toggle = document.querySelector("#menuToggle button");
    const menu = document.getElementById("menu");
    if (toggle && menu) {
        toggle.addEventListener("click", function () {
            const open = menu.classList.toggle("open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
            toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
        });
    }

    // Relógio da barra de tarefas
    const clock = document.getElementById("footer-clock");
    if (clock) {
        const update = function () {
            clock.textContent = new Date().toLocaleTimeString("pt-BR", {
                hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
            });
        };
        update();
        setInterval(update, 1000);
    }
});
