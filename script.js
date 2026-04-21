document.addEventListener('DOMContentLoaded', () => {
    const music = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-control');
    let isPlaying = false;

    // 1. Play music on first click (Browsers block auto-play)
    document.body.addEventListener('click', () => {
        if (!isPlaying) {
            music.play();
            isPlaying = true;
        }
    }, { once: true });

    // 2. Stop music when tab is switched
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            music.pause();
        } else {
            // Only resume if it was playing before the tab was switched
            if (isPlaying) {
                music.play();
            }
        }
    });

    // 3. Manual toggle button
    musicBtn.addEventListener('click', () => {
        if (music.paused) {
            music.play();
            isPlaying = true;
            musicBtn.style.opacity = "1";
        } else {
            music.pause();
            isPlaying = false;
            musicBtn.style.opacity = "0.5";
        }
    });
});