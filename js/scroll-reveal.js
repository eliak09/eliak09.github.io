// ============================================================
//  AZÚL ALCATRAZ — El Calabozo
//  js/scroll-reveal.js · IntersectionObserver para .reveal
//  y activación de barras .rune-bar-fill vía data-width
//  Depende de: DOM cargado (colocar antes de </body>)
//  Noctis Poenam · MMXXVI
// ============================================================

(function () {

    // ----------------------------------------------------------
    //  1. REVEAL — añade .visible cuando el elemento entra
    //     al viewport (umbral 15 % → se dispara antes de verlo)
    // ----------------------------------------------------------
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add('visible');

                // Activar barras de habilidad si están dentro
                entry.target
                    .querySelectorAll('.rune-bar-fill')
                    .forEach(activateBar);

                // Dejar de observar: la animación solo ocurre una vez
                revealObserver.unobserve(entry.target);
            });
        },
        { threshold: 0.15 }
    );

    // ----------------------------------------------------------
    //  2. RUNE BARS — lee data-width y aplica scaleX()
    //     Se llama tanto desde el observer como en el caso de
    //     que una barra ya sea visible al cargar la página
    // ----------------------------------------------------------
    function activateBar(bar) {
        const target = parseFloat(bar.dataset.width);
        if (isNaN(target)) return;
        // Pequeño delay para que la transición CSS sea visible
        requestAnimationFrame(() => {
            bar.style.transform = 'scaleX(' + target + ')';
        });
    }

    // ----------------------------------------------------------
    //  3. OBSERVAR todos los .reveal actuales en el DOM
    //     (los que se inyecten dinámicamente deben registrarse
    //      manualmente o re-ejecutar observeAll())
    // ----------------------------------------------------------
    function observeAll() {
        document.querySelectorAll('.reveal').forEach((el) => {
            revealObserver.observe(el);
        });
    }

    // ----------------------------------------------------------
    //  4. INIT — esperar a que el DOM esté listo
    //     Si el script está al final del <body> el DOM ya existe;
    //     el DOMContentLoaded actúa como red de seguridad.
    // ----------------------------------------------------------
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeAll);
    } else {
        observeAll();
    }

})();