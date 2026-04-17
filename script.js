document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    const fullImg = document.getElementById('full-img');
    const closeBtn = document.querySelector('.close-btn');
    const images = document.querySelectorAll('.clickable');

    images.forEach(img => {
        img.addEventListener('click', () => {
            lightbox.style.display = 'block';
            fullImg.src = img.src;
        });
    });

    closeBtn.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target !== fullImg) {
            lightbox.style.display = 'none';
        }
    });
});