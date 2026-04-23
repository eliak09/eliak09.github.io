// ============================================================
//  AZÚL ALCATRAZ — El Calabozo
//  js/torches.js · Motor de antorchas pixel-art procedimentales
//  Depende de: fire-palette.js (FIRE_PALETTE debe estar definida)
//  Noctis Poenam · MMXXVI
// ============================================================

const setupTorch = (id, offset = 0) => {
    const canvas = document.getElementById(id);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    // Resolución baja: 32×48 px → escalado a 64×96 por CSS
    canvas.width  = 32;
    canvas.height = 48;
    ctx.imageSmoothingEnabled = false;

    let particles = [];
    let frameCount = 0;

    // Embers — partículas independientes que suben y desaparecen
    const createParticle = () => {
        const size = Math.floor(Math.random() * 3 + 1) * 2; // 2, 4 o 6 px (múltiplos de 2 = pixel-art)
        const colorIndex = Math.floor(Math.random() * FIRE_PALETTE.length);
        return {
            x:      Math.floor(12 + (Math.random() - 0.5) * 10),
            y:      Math.floor(36 + Math.random() * 4),
            size,
            speedY: +(Math.random() * 0.7 + 0.3).toFixed(1),
            speedX: +((Math.random() - 0.5) * 0.4).toFixed(1),
            life:   1.0,
            decay:  +(Math.random() * 0.025 + 0.015).toFixed(3),
            colorIndex,
        };
    };

    // Llama base: columna de píxeles apilados, redibujar cada frame
    const drawFlameBase = () => {
        // Oscilación: alterna 1px a izquierda/derecha según frame par/impar
        const wobble = (frameCount % 4 < 2) ? 0 : 1;

        // Capa externa (rojo oscuro)
        ctx.fillStyle = FIRE_PALETTE[5];
        ctx.fillRect(10 + wobble, 10, 12, 26);

        // Capa media (rojo)
        ctx.fillStyle = FIRE_PALETTE[4];
        ctx.fillRect(11 + wobble, 12, 10, 22);

        // Capa naranja oscuro
        ctx.fillStyle = FIRE_PALETTE[3];
        ctx.fillRect(12, 14, 8, 20);

        // Capa naranja vivo
        ctx.fillStyle = FIRE_PALETTE[2];
        ctx.fillRect(13, 17, 6, 16);

        // Capa amarilla
        ctx.fillStyle = FIRE_PALETTE[1];
        ctx.fillRect(13 + wobble, 20, 4, 12);

        // Núcleo blanco (chispa)
        if (frameCount % 3 === 0) {
            ctx.fillStyle = FIRE_PALETTE[0];
            ctx.fillRect(14, 24, 2, 4);
        }
    };

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        frameCount++;

        // Dibujar llama base
        drawFlameBase();

        // Spawnear nueva partícula (no cada frame → más caótico)
        if (Math.random() > 0.35) {
            particles.push(createParticle());
        }

        // Actualizar y dibujar partículas
        particles = particles.filter(p => p.life > 0);

        for (const p of particles) {
            // Mover en pasos enteros (pixelado)
            p.x = Math.floor(p.x + p.speedX);
            p.y = Math.floor(p.y - p.speedY);
            p.life -= p.decay;

            // El color sube por la paleta a medida que sube
            const ci = Math.min(FIRE_PALETTE.length - 1,
                        Math.floor((1 - p.life) * FIRE_PALETTE.length));

            ctx.globalAlpha = p.life;
            ctx.fillStyle   = FIRE_PALETTE[ci];
            ctx.fillRect(p.x, p.y, p.size, p.size);
            ctx.globalAlpha = 1;
        }

        // Bloquear a 12 FPS → sensación retro
        setTimeout(() => requestAnimationFrame(draw), 1000 / 12);
    };

    // Stagger: arrancar las antorchas con distinto delay para desincronizarlas
    setTimeout(() => draw(), offset);
};

// Arrancar las dos antorchas del gate screen
setupTorch('canvas-tl', 0);
setupTorch('canvas-tr', 80); // 80 ms de desfase
