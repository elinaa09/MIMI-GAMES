//@ts-nocheck

//board
let board;
const rowCount = 21;
const columnCount = 19;
const tileSize = 32;
const boardWidth = columnCount*tileSize;
const boardHeight = rowCount*tileSize;

let context;

let snake1Image;
let snake2Image;
let snake3Image;
let snake4Image;

let UpImage;
let DownImage;
let LeftImage;
let RightImage;
let bushImage;


//X = bush, O = skip, m = mimi, ' ' = food
//snake: 1,  2, 3,  4
const tileMap = [
    "XXXXXXXXXXXXXXXXXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X                 X",
    "X XX X XXXXX X XX X",
    "X    X       X    X",
    "XXXX XXXX XXXX XXXX",
    "OOOX X       X XOOO",
    "XXXX X XX4XX X XXXX",
    "O       132       O",
    "XXXX X XXXXX X XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXXXX X XXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X  X     m     X  X",
    "XX X X XXXXX X X XX",
    "X    X   X   X    X",
    "X XXXXXX X XXXXXX X",
    "X                 X",
    "XXXXXXXXXXXXXXXXXXX",
];

const walls= new Set();
const foods= new Set();
let snakes= new Set();

let pacmi;

const directions = ['W', 'S', 'A', 'D']; //up down left right
let score = 0;
let lives = 3;
let gameOver = false;

class Block {
    constructor(image, x, y, width, height) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
         this.startX = x;
         this.startY = y;
        this.direction = 'D';
        this.velocityX = 0;
        this.velocityY = 0;
    }

             updateDirection(direction) {
        const prevDirection = this.direction;
        this.direction = direction;
        this.updateVelocity();
        this.x += this.velocityX;
        this.y += this.velocityY;
    
    for (let wall of walls.values()) {
            if (collision(this, wall)) {
                this.x -= this.velocityX;
                this.y -= this.velocityY;
                this.direction = prevDirection;
                this.updateVelocity();
                return;
            }
        }
    }

    updateVelocity() {
        const speed = tileSize / 4;
        if      (this.direction == 'W') {this.velocityX = 0;      this.velocityY = -speed;}
        else if (this.direction == 'S') {this.velocityX = 0;      this.velocityY =  speed; }
        else if (this.direction == 'A') { this.velocityX = -speed; this.velocityY = 0; }
        else if (this.direction == 'D') { this.velocityX =  speed; this.velocityY = 0; }
    }

     reset() {
        this.x = this.startX;
        this.y = this.startY;
    }
}

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

loadImages();
    loadMap();

    //gives random direction
     for (let snake of snakes.values()) {
        const newDirection = directions[Math.floor(Math.random()*4)];
        snake.updateDirection(newDirection);
    }
    update();
    document.addEventListener("keyup", movePacmi);
};


function loadImages() {
    wallImage = new Image();
    wallImage.src = "./wall.png";

    snake1Image = new Image();
    snake1Image.src = "./snake1.png";
    snake2Image = new Image();
    snake2Image.src = "./snake2.png";
    snake3Image = new Image();
    snake3Image.src = "./snake3.png";
    snake4Image = new Image();
    snake4Image.src = "./snake4.png";

    UpImage = new Image();
    UpImage.src = "./up.png"
    DownImage = new Image();
    DownImage.src = "./down.png";
    LeftImage= new Image();
    LeftImage.src="./left.png";
    RightImage= new Image();
    RightImage.src="./right.png";
}
    

function loadMap() {
    walls.clear();
    foods.clear();
    snakes.clear();

    for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < columnCount; c++) {
            const row = tileMap[r];
            const tileMapChar = row[c];

            const x = c*tileSize;
            const y = r*tileSize;

            if (tileMapChar == 'X') { //block wall
                const wall = new Block(wallImage, x, y, tileSize, tileSize);
                walls.add(wall);  
            }
            else if (tileMapChar == '1') { 
                const snake = new Block(snake1Image, x, y, tileSize, tileSize);
                snakes.add(snake);
            }
            else if (tileMapChar == '2') { 
                const snake = new Block(snake2Image, x, y, tileSize, tileSize);
                snakes.add(snake);
            }
            else if (tileMapChar == '3') { 
                const snake = new Block(snake3Image, x, y, tileSize, tileSize);
                snakes.add(snake);
            }
            else if (tileMapChar == '4') { 
                const snake = new Block(snake4Image, x, y, tileSize, tileSize);
                snakes.add(snake);
            }
            else if (tileMapChar == 'm') { //pacmi
                pacmi = new Block(RightImage, x, y, tileSize, tileSize);
            }
            else if (tileMapChar == ' ') { 
                const food = new Block(null, x + 8, y + 8, 6, 6);
                foods.add(food);
            }
        }
    }
}
function update() {
    if (gameOver){
         return;
}
    move();
    draw();
    setTimeout(update, 50); //1000/50 = 20 FPS
}

function draw() {
    context.clearRect(0, 0, board.width, board.height);
context.drawImage(pacmi.image, pacmi.x, pacmi.y, pacmi.width, pacmi.height);
   
for (let wall of walls.values()) {
        context.drawImage(wall.image,wall.x,wall.y,wall.width,wall.height);
    }

    
    for (let snake of snakes.values()) {
        context.drawImage(snake.image, snake.x, snake.y, snake.width, snake.height);
    }
    
    context.fillStyle = "yellow";
    for (let food of foods.values()) {
        context.fillRect(food.x, food.y, food.width, food.height);
    context.font="14px sans-serif";
    }  
     let pacmiImage= RightImage;
     if      (pacmi.direction=='W') pacmiImage= UpImage;
     else if (pacmi.direction=='S') pacmiImage= DownImage;
     else if (pacmi.direction=='A') pacmiImage= LeftImage;


    //score
    context.drawImage(pacmiImage, pacmi.x, pacmi.y, pacmi.width, pacmi.height);
    context.fillStyle = gameOver? "red" : "white";
    context.font= "bold 14px monospace";
    if (gameOver) {
      context.fillText("Game Over: " + String(score), tileSize/2, tileSize/2);  
    }
    else {
        context.fillText("x" + String(lives) + " " + String(score), tileSize/2, tileSize/2);
    }
}

function move() {
    pacmi.x += pacmi.velocityX;
    pacmi.y += pacmi.velocityY;

    //check bush collisions
    for (let wall of walls.values()) {
        if (collision(pacmi, wall)) {
            pacmi.x -= pacmi.velocityX;
            pacmi.y -= pacmi.velocityY;
            break;
        }
    }
    //check snake collision
    for (let snake of snakes.values()) {
        if (collision(pacmi, snake)) {    //always true
            lives -=1;
            if (lives == 0){
                gameOver = true; return;
                 }
            resetPositions();
        }

        if (snake.y == tileSize*9 && snake.direction != 'W' && snake.direction != 'S') {
            snake.updateDirection('W');
        }

        snake.x += snake.velocityX;
        snake.y += snake.velocityY;

        for (let wall of walls.values()) {
            if (collision(snake, wall) || snake.x <= 0 || snake.x + snake.width >= boardWidth) {
                snake.x -= snake.velocityX;
                snake.y -= snake.velocityY;
                const newDirection = directions[Math.floor(Math.random()*4)];
                snake.updateDirection(newDirection);
                }
            }
        }

    //check food collision
    let eaten = null;
    for (let food of foods.values()) {
        if (collision(pacmi, food)){
            eaten = food;
            score += 10;
            break;
        }
    }
    
    foods.delete(eaten);

    if (foods.size == 0){
          loadMap(); 
        resetPositions(); 
    }
}

function movePacmi(e) {
    if (gameOver) {
        loadMap();
        resetPositions();
        lives = 3;
        score = 0;
        gameOver = false;
        update(); //restart game loop
        return;
    }
    if      (e.code == "ArrowUp" || e.code == "KeyW") pacmi.updateDirection('W');

    else if (e.code == "ArrowDown" || e.code == "KeyS")  pacmi.updateDirection('S');
    
    else if (e.code == "ArrowLeft" || e.code == "KeyA")  pacmi.updateDirection('A');

    else if (e.code == "ArrowRight" || e.code == "KeyD") pacmi.updateDirection('D');
}


function collision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
 }       

function resetPositions() {
    pacmi.reset();
    pacmi.velocityX = 0;
    pacmi.velocityY = 0;
    for (let snake of snakes.values()) {
        snake.reset();
        snake.updateDirection (directions[Math.floor(Math.random()*4)]);
    }
}
