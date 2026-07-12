const bgMusic = new Audio("../sounds/background.mp3");
bgMusic.loop = true;
bgMusic.play().catch(() => {});

const blockSize = 25;
const rows = 20;
const cols = 20;
let board;
let context;

let snakeX = blockSize * 5;
let snakeY = blockSize * 5;

let velocityX = 0;
let velocityY = 0;

let snakeBody = [];

let foodX;
let foodY;

const foodImage = new Image();
foodImage.src = "food.png";

let score = 0;
let highScore = 0;

let gameOver = false;
let gameLoop;

window.onload = function() {
    const saved = localStorage.getItem("snakeHighScore");
    if (saved) {
        highScore = parseInt(saved);
    }
    document.getElementById("high-score").textContent = highScore;

    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d");

    placeFood();
    document.addEventListener("keyup", changeDirection);
    gameLoop = setInterval(update, 1000 / 10);
}

function update() {
    if (gameOver) { return; }

    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    if (foodImage.complete) {
        context.drawImage(foodImage, foodX, foodY, blockSize, blockSize);
    } else {
        context.fillStyle = "red";
        context.fillRect(foodX, foodY, blockSize, blockSize);
    }

    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        placeFood();
        score += 1;
        document.getElementById("current-score").textContent = score;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length > 0) {
        snakeBody[0] = [snakeX, snakeY];
    }

    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;

    context.fillStyle = "lime";
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    if (snakeX < 0 || snakeX >= cols * blockSize ||
        snakeY < 0 || snakeY >= rows * blockSize) {
        triggerGameOver();
        return;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            triggerGameOver();
            return;
        }
    }
}

function triggerGameOver() {
    gameOver = true;
    clearInterval(gameLoop);

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("snakeHighScore", highScore);
    }

    document.getElementById("final-score").textContent = score;
    document.getElementById("final-high-score").textContent = highScore;
    document.getElementById("game-over-screen").classList.remove("hidden");
}

function restartGame() {
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    score = 0;
    gameOver = false;

    document.getElementById("current-score").textContent = 0;
    document.getElementById("high-score").textContent = highScore;
    document.getElementById("game-over-screen").classList.add("hidden");

    placeFood();
    gameLoop = setInterval(update, 1000 / 10);
}

function changeDirection(e) {
    if (e.code == "ArrowUp" && velocityY != 1) {
        velocityX = 0; velocityY = -1;
    }
    else if (e.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0; velocityY = 1;
    }
    else if (e.code == "ArrowLeft" && velocityX != 1) {
        velocityX = -1; velocityY = 0;
    }
    else if (e.code == "ArrowRight" && velocityX != -1) {
        velocityX = 1; velocityY = 0;
    }
}

function placeFood() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}