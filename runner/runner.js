let canvas = document.getElementById("c");
let ctx= canvas.getContext("2d")
canvas.width = 800;
canvas.height = 500;

let run1 = new Image();
let run2 = new Image();
let run3 = new Image();
let jumpImage = new Image();
let obstacleImage = new Image();

run1.src = "./run1.png";
run2.src = "./run2.png";
run3.src = "./run3.png";
jumpImage.src = "./jump.png";
obstacleImage.src = "./obstacle.png";

let runImage = [run1, run2, run3];

let groundY = 280;

let playerX = 100;
let playerY = groundY;
let playerWidth=60;
let playerHeight=70;
let playerSpeedY=0;
let isJumping= false;

let obstacleList = [];
let spawnTimer = 80;

let score = 0;
let gameSpeed = 2;
let obstaclesPassed = 0;

let currentFrame = 0;
let frameTimer = 0;

let gameOver = false;

document.addEventListener("keydown", function(e) {
    if (e.code == "Space" || e.code == "ArrowUp") {
        if (gameOver) {
            resetGame();
            return;
        }
        if (isJumping == false) {
            playerSpeedY = -11;
            isJumping = true;
        }
    }
});

canvas.addEventListener("click", function() {
    if (gameOver) {
        resetGame();
        return;
    }

    if (isJumping == false) {
        playerSpeedY = -11;
        isJumping = true;
    }
});

function resetGame(){
    playerY = groundY;
    playerSpeedY = 0;
    isJumping = false;
    obstacleList = [];
    score = 0;
    gameSpeed = 4;
    obstaclesPassed = 0;
    spawnTimer = 180;
    gameOver = false;
}

function update() {
    if (gameOver) return;

    playerSpeedY = playerSpeedY + 0.3;
    playerY = playerY + playerSpeedY;

    if (playerY >= groundY) {
        playerY = groundY;
        playerSpeedY = 0;
        isJumping = false;
    }

    frameTimer = frameTimer + 1;
    if (frameTimer > 10) {
        frameTimer = 0;
        currentFrame = currentFrame + 1;
        if (currentFrame > 2) {
            currentFrame = 0;
        }
    }

    spawnTimer = spawnTimer - 1;
    if (spawnTimer <= 0) {
        let newObstacle = {
            x: canvas.width,
            y: groundY + playerHeight - 50,
            width: 30,
            height: 50
        };
        obstacleList.push(newObstacle);
        spawnTimer = 180 + Math.floor(Math.random() * 80);
    }

    let stillOnScreen = [];
    for (let i = 0; i < obstacleList.length; i++) {
        obstacleList[i].x = obstacleList[i].x - gameSpeed;

        if (obstacleList[i].x + obstacleList[i].width < 0) {
            obstaclesPassed = obstaclesPassed + 1;
        } else {
            stillOnScreen.push(obstacleList[i]);
        }
    }
    obstacleList = stillOnScreen;

    gameSpeed = 2 + Math.floor(obstaclesPassed / 3) * 0.5;
    score = score + 1;

    for (let i = 0; i < obstacleList.length; i++) {
        let obstacle = obstacleList[i];
        let hitX = playerX + 15;
        let hitY = playerY + 10;
        let hitW = playerWidth - 30;
        let hitH = playerHeight - 15;
        if (hitX < obstacle.x + obstacle.width &&
            hitX + hitW > obstacle.x &&
            hitY < obstacle.y + obstacle.height &&
            hitY + hitH > obstacle.y) {
            gameOver = true;
        }
    }
}

function draw() {
    // draw sky
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    ctx.fillStyle = "#5a9e6f";
    ctx.fillRect(0, groundY + playerHeight, canvas.width, canvas.height);
 

    for (let i = 0; i < obstacleList.length; i++) {
        let obstacle = obstacleList[i];
        ctx.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
 
    // draw player
    if (isJumping) {
        ctx.drawImage(jumpImage, playerX, playerY, playerWidth, playerHeight);
    } else {
        ctx.drawImage(runImage[currentFrame], playerX, playerY, playerWidth, playerHeight);
    }
 
    // draw score top left
    ctx.fillStyle = "#1a1a2e";
    ctx.font = "bold 20px Courier New";
    ctx.fillText("Score: " + Math.floor(score / 6), 16, 30);
    ctx.font = "14px Courier New";
    ctx.fillText("Speed: " + gameSpeed.toFixed(1), 16, 52);

    // game over screen
    if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
 
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "bold 36px Courier New";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);
 
        ctx.font = "20px Courier New";
        ctx.fillText("Score: " + Math.floor(score / 6), canvas.width / 2, canvas.height / 2 + 15);
 
        ctx.font = "16px Courier New";
        ctx.fillText("Space or Click to restart", canvas.width / 2, canvas.height / 2 + 45);
 
        ctx.textAlign = "left";
    }
}
 
// main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
 
gameLoop();
