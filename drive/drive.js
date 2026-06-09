//canvas
const canvas = document.getElementById("board");
const ctx    = canvas.getContext("2d");
 
canvas.width  = 500;
canvas.height = 500;
 
// ===== LANE POSITIONS (never change) =====
const leftLane   = 150;
const centerLane = 250;
const rightLane  = 350;
const lanes      = [leftLane, centerLane, rightLane];
 
// ===== LANE MARKER ANIMATION =====
let markerY = 0;
 
// ===== PLAYER SIZE (never changes) =====
const playerW = 50;
const playerH = 80;
 
// ===== PLAYER POSITION (changes as player moves) =====
let playerX = 250;
let playerY = 400;
 
// ===== IMAGES (the image objects never change, just their .src) =====
const bgImage     = new Image();
const playerImage = new Image();
const sheetImage  = new Image();
const fireImage   = new Image();
 
bgImage.src     = "carbg.png";
playerImage.src = "car.png";
sheetImage.src  = "othercar.png";
fireImage.src   = "fire.png";
 
// ===== SPRITESHEET INFO (never changes) =====
const sheetCols = 4;
const sheetRows = 4;
const cellW     = 310;
const cellH     = 480;
 
 
// ===== OPPONENT CARS (the array changes as cars are added/removed) =====
let cars = [];
 
// ===== GAME VARIABLES (all change during the game) =====
let score    = 0;
let speed    = 4;
let gameover = false;
let crashX   = 0;
let crashY   = 0;
 
//HIGH SCORE
let highScore = 0;
 
const saved = localStorage.getItem("driveHighScore");
if (saved) {
    highScore = parseInt(saved);
}
document.getElementById("high-score").textContent = highScore;
 
 
//KEYBOARD INPUT
document.addEventListener("keydown", function(e) {
 
    if (gameover) {
        return;
    }
 
    if (e.code == "ArrowLeft" && playerX > leftLane) {
        playerX = playerX - 100;
    }
 
    if (e.code == "ArrowRight" && playerX < rightLane) {
        playerX = playerX + 100;
    }
 
});
 
 
//ADD A NEW OPPONENT CAR
function addCar() {
 
    // pick a random lane
    const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
 
    // pick a random car from the spritesheet
    const randomCol = Math.floor(Math.random() * sheetCols);
    const randomRow = Math.floor(Math.random() * sheetRows);
 
    const newCar= {
        x:   randomLane,
        y:   -100,
        w:   50,
        h:   80,
        col: randomCol,
        row: randomRow
    };
 
    cars.push(newCar);
}
 
 
// ===== DRAW ONE CAR FROM THE SPRITESHEET =====
function drawCarFromSheet(car) {
 
    // where to draw on the canvas
    const drawX = car.x - car.w / 2;
    const drawY = car.y - car.h / 2;
 
    // where to cut from on the spritesheet
    const srcX = car.col * cellW;
    const srcY = car.row * cellH;
 
    ctx.drawImage(
        sheetImage,
        srcX, srcY, cellW, cellH,   // cut from sheet
        drawX, drawY, car.w, car.h  // draw on canvas
    );
}
 
 
// ===== CHECK COLLISION =====
function isCrashing(car) {
 
    const playerLeft   = playerX - playerW / 2;
    const playerRight  = playerX + playerW / 2;
    const playerTop    = playerY - playerH / 2;
    const playerBottom = playerY + playerH / 2;
 
    const carLeft   = car.x - car.w / 2;
    const carRight  = car.x + car.w / 2;
    const carTop    = car.y - car.h / 2;
    const carBottom = car.y + car.h / 2;
 
    const hitsX = playerLeft < carRight  && playerRight  > carLeft;
    const hitsY = playerTop  < carBottom && playerBottom > carTop;
 
    return hitsX && hitsY;
}
 
 
// ===== GAME OVER =====
function doGameOver() {
 
    gameover = true;
    crashX   = playerX;
    crashY   = playerY - playerH / 2;
 
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("driveHighScore", highScore);
    }
 
    document.getElementById("final-score").textContent = score;
    document.getElementById("final-high").textContent  = highScore;
    document.getElementById("game-over-screen").classList.remove("hidden");
}
 
 
// ===== RESTART =====
function restartGame() {
 
    playerX  = 250;
    playerY  = 400;
    cars     = [];
    score    = 0;
    speed    = 4;
    gameover = false;
    markerY  = 0;
 
    document.getElementById("current-score").textContent = 0;
    document.getElementById("high-score").textContent    = highScore;
    document.getElementById("game-over-screen").classList.add("hidden");
}
 
 
// ===== DRAW PLAYER =====
function drawPlayer() {
 
    const x = playerX - playerW / 2;
    const y = playerY - playerH / 2;
 
    if (playerImage.complete) {
        ctx.drawImage(playerImage, x, y, playerW, playerH);
    } else {
        ctx.fillStyle = "blue";
        ctx.fillRect(x, y, playerW, playerH);
    }
}
 
 
// ===== DRAW ALL OPPONENT CARS =====
function drawCars() {
 
    for (let i = 0; i < cars.length; i++) {
 
        if (sheetImage.complete) {
            drawCarFromSheet(cars[i]);
        } else {
            const x = cars[i].x - cars[i].w / 2;
            const y = cars[i].y - cars[i].h / 2;
            ctx.fillStyle = "red";
            ctx.fillRect(x, y, cars[i].w, cars[i].h);
        }
    }
}
 
 
// ===== DRAW FIRE =====
function drawFire() {
 
    if (fireImage.complete) {
        ctx.drawImage(fireImage, crashX - 30, crashY - 30, 60, 60);
    } else {
        ctx.fillStyle = "orange";
        ctx.fillRect(crashX - 20, crashY - 20, 40, 40);
    }
}
 
 
// ===== MAIN UPDATE =====
function update() {
 
    // draw background
    if (bgImage.complete) {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "#555";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
 
    // animate lane markers
    markerY = markerY + speed * 2;
    if (markerY >= 100) {
        markerY = 0;
    }
 
    ctx.fillStyle = "white";
    for (let y = -100; y < canvas.height; y += 100) {
        ctx.fillRect(leftLane   + 45, y + markerY, 10, 50);
        ctx.fillRect(centerLane + 45, y + markerY, 10, 50);
    }
 
    // frozen frame when game is over
    if (gameover) {
        drawPlayer();
        drawCars();
        drawFire();
        return;
    }
 
    // move each car down
    for (let i = 0; i < cars.length; i++) {
 
        cars[i].y = cars[i].y + speed;
 
        // crashed into player?
        if (isCrashing(cars[i])) {
            doGameOver();
            return;
        }
 
        // went off the bottom?
        if (cars[i].y - cars[i].h / 2 > canvas.height) {
            cars.splice(i, 1);
            i = i - 1;
            score = score + 1;
            document.getElementById("current-score").textContent = score;
 
            // speed up every 3 cars
            if (score % 3 == 0) {
                speed = speed + 1;
            }
        }
    }
 
    // add new car if fewer than 2 on screen
    if (cars.length < 2) {
 
        let topIsClear = true;
 
        for (let i = 0; i < cars.length; i++) {
            if (cars[i].y < cars[i].h * 1.5) {
                topIsClear = false;
            }
        }
 
        if (topIsClear) {
            addCar();
        }
    }
 
    drawPlayer();
    drawCars();
}
 
 
// ===== START GAME LOOP =====
setInterval(update, 1000 / 60);
 