// ============================================================
//  AZÚL ALCATRAZ — El Calabozo
//  js/gate-animation.js · Secuencia de apertura con GSAP
//  Depende de: gsap.min.js (debe cargarse antes en el HTML)
//  Noctis Poenam · MMXXVI
// ============================================================

const startBtn = document.getElementById('start-btn');

startBtn.addEventListener('click', () => {
    const tl = gsap.timeline();

    // 1. Botón desaparece
    tl.to('#start-btn', {
        scale: 0,
        opacity: 0,
        duration: 0.25,
        ease: 'steps(4)', // Escala en pasos = pixel-art feel
    })

    // 2. Brazos suben desde abajo
    .to('#arms-container', {
        bottom: -10,
        opacity: 1,
        duration: 0.5,
        ease: 'steps(6)',
    })

    // 3. Empuje de puerta: sacudida hacia adelante y atrás
    .to('.arm', {
        y: -24,
        duration: 0.18,
        ease: 'steps(3)',
        repeat: 1,
        yoyo: true,
    })

    // 4. Pantalla de gate sube como si se alzara una portcullis
    .to('#gate-screen', {
        y: '-100%',
        duration: 1.1,
        ease: 'steps(18)', // Movimiento escalonado tipo Doom
    }, '+=0.2')

    // 5. Dungeon home aparece
    .to('#dungeon-home', {
        opacity: 1,
        duration: 0.8,
        ease: 'steps(8)',
    }, '-=0.6')

    // 6. Desbloquear scroll del body
    .set('body', { overflow: 'auto' });
});
