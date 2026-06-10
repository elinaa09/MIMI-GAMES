//board
let board;
let boardWidth = window.innerWidth;
let boardHeight = window.innerHeight;
let context;

//plane
let planeWidth = 60;   // FIXED: was 10, too small to see
let planeHeight = 40;  // FIXED: was 10, too small to see
let planeX = boardWidth/8;
let planeY = boardHeight/2;
let planeImg;

let plane = {
    x : planeX,
    y : planeY,
    width : planeWidth,
    height : planeHeight
}

//poles
let poleArray = [];
let poleWidth = 64;
let poleHeight = 512;
let poleX = boardWidth;
let poleY = 0;

let toppoleImg;
let bottompoleImg;

//physics
let velocityX = -2;
let velocityY = -4;
let gravity = 0.02;  // strong enough to pull back down quickly

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // FIXED: load all images first, only start game when ALL are ready
    let imagesLoaded = 0;

    function onLoad() {
        imagesLoaded++;
        // wait until all 3 images are loaded before starting
        if (imagesLoaded == 3) {
            requestAnimationFrame(update);
            setInterval(placepoles, 1500);
        }
    }

    planeImg = new Image();
    planeImg.src = "./plane.png";
    planeImg.onload = onLoad;

    toppoleImg = new Image();
    toppoleImg.src = "./toppole.png";
    toppoleImg.onload = onLoad;

    bottompoleImg = new Image();
    bottompoleImg.src = "./bottompole.png";
    bottompoleImg.onload = onLoad;

    document.addEventListener("keydown", moveplane);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // FIXED: draw background image instead of leaving it blank
    context.drawImage(bgImg, 0, 0, boardWidth, boardHeight);

    //plane
    velocityY += gravity;
    plane.y = Math.max(plane.y + velocityY, 0);
    context.drawImage(planeImg, plane.x, plane.y, plane.width, plane.height);

    if (plane.y > board.height) {
        gameOver = true;
    }

    //poles
    for (let i = 0; i < poleArray.length; i++) {
        let pole = poleArray[i];
        pole.x += velocityX;
        context.drawImage(pole.img, pole.x, pole.y, pole.width, pole.height);

        if (!pole.passed && plane.x > pole.x + pole.width) {
            score += 0.5;
            pole.passed = true;
        }

        if (detectCollision(plane, pole)) {
            gameOver = true;
        }
    }

    //clear poles that went off screen
    while (poleArray.length > 0 && poleArray[0].x < -poleWidth) {
        poleArray.shift();
    }

    //score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(Math.floor(score), 5, 45);  // FIXED: Math.floor so no 0.5, 1.5 etc

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
        context.font = "20px sans-serif";
        context.fillText("Press Space to restart", 5, 130);
    }
}

function placepoles() {
    if (gameOver) {
        return;
    }

    let randompoleY = -poleHeight + Math.random() * (board.height / 2);
    let openingSpace = 180;  // fixed gap in pixels between top and bottom pole

    let toppole = {
        img : toppoleImg,
        x : poleX,
        y : randompoleY,
        width : poleWidth,
        height : poleHeight,
        passed : false
    }
    poleArray.push(toppole);

    let bottompole = {
        img : bottompoleImg,
        x : poleX,
        y : randompoleY + poleHeight + openingSpace,
        width : poleWidth,
        height : poleHeight,
        passed : false
    }
    poleArray.push(bottompole);
}

function moveplane(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        velocityY = -2;

        if (gameOver) {
            plane.y = planeY;
            poleArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}


const bgImg = new Image();
bgImg.src = "./bg.jpg";