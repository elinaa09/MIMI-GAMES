const bgMusic = new Audio("../sounds/background.mp3");
const clickSound = new Audio("../sounds/click.mp3");
bgMusic.loop = true;

const gameCards = document.querySelectorAll('.game-card');

gameCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        bgMusic.play().catch(() => {});
    });

    card.addEventListener('click', () => {
        clickSound.currentTime = 0;
        clickSound.play();
    });
});