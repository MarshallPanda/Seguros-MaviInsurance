
// Filtros
document.querySelectorAll('.filtro').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filtro').forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');

        const filtro = btn.getAttribute('data-filtro');
        document.querySelectorAll('.item').forEach(item => {
            const categoria = item.getAttribute('data-categoria');
            item.classList.toggle('oculto', filtro !== 'todos' && filtro !== categoria);
        });
    });
});

// Lightbox
document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').src;
        const nombre = item.querySelector('.nombre').textContent;
        const link = item.getAttribute('data-link');

        document.getElementById('lightbox-img').src = imgSrc;
        document.getElementById('lightbox-nombre').textContent = nombre;

        const btn = document.getElementById('lightbox-link');
        if (link && link !== '#') {
            btn.href = link;
            btn.style.display = 'inline-block';
        } else {
            btn.style.display = 'none';
        }

        document.getElementById('lightbox').style.display = 'flex';
    });
});

function cerrarLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

