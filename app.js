const board = document.querySelector('.board');
const startBtn = document.querySelector(".btn-start");
const restartBtn = document.querySelector(".btn-restart");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const scoreElement = document.querySelector("#score");
const hoghScoreElement = document.querySelector("#high-score");
const timeElement = document.querySelector("#time");

// grid
const rows = 10;
const cols = 10;

const blocks = {};

// game state
let snake = [{ x: 1, y: 3 }];
let direction = "down";
let food = randomFood();

let intervalId = null;
let timerId = null;

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let time = 0;
let speed = 300;

hoghScoreElement.innerText = highScore;

// create grid
for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
        const block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${r}-${c}`] = block;
    }
}

function randomFood() {
    return {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols)
    };
}

// main game loop
function render() {
    let head;

    if (direction === "left") head = { x: snake[0].x, y: snake[0].y - 1 };
    else if (direction === "right") head = { x: snake[0].x, y: snake[0].y + 1 };
    else if (direction === "down") head = { x: snake[0].x + 1, y: snake[0].y };
    else head = { x: snake[0].x - 1, y: snake[0].y };

    // wall collision
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        gameOver();
        return;
    }

    // remove snake visuals
    snake.forEach(seg => {
        blocks[`${seg.x}-${seg.y}`].classList.remove("fill");
    });

    snake.unshift(head);

    // food eaten
    if (head.x === food.x && head.y === food.y) {

        score += 10;
        scoreElement.innerText = score;

        // speed increase
        speed = Math.max(80, speed - 10);
        clearInterval(intervalId);
        intervalId = setInterval(render, speed);

        // high score
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            hoghScoreElement.innerText = highScore;
        }

        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = randomFood();

    } else {
        snake.pop();
    }

    // draw food
    blocks[`${food.x}-${food.y}`].classList.add("food");

    // draw snake
    snake.forEach(seg => {
        blocks[`${seg.x}-${seg.y}`].classList.add("fill");
    });
}

// controls
addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && direction !== "down") direction = "up";
    else if (e.key === "ArrowDown" && direction !== "up") direction = "down";
    else if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
    else if (e.key === "ArrowRight" && direction !== "left") direction = "right";
});

// timer
function startTimer() {
    clearInterval(timerId);

    timerId = setInterval(() => {
        time++;

        let min = Math.floor(time / 60);
        let sec = time % 60;

        timeElement.innerText =
            `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    }, 1000);
}

startBtn.addEventListener("click", () => {
    modal.style.display = "none";

    score = 0;
    time = 0;
    speed = 300;

    scoreElement.innerText = score;
    timeElement.innerText = "00:00";

    clearInterval(intervalId);
    intervalId = setInterval(render, speed);

    startTimer();
});

// restart
restartBtn.addEventListener("click", restartGame);

function restartGame() {

    clearInterval(intervalId);
    clearInterval(timerId);

    Object.values(blocks).forEach(b => {
        b.classList.remove("food", "fill");
    });

    modal.style.display = "none";
    gameOverModal.style.display = "none";

    direction = "down";
    snake = [{ x: 1, y: 3 }];

    score = 0;
    time = 0;
    speed = 300;

    scoreElement.innerText = score;
    timeElement.innerText = "00:00";

    food = randomFood();

    intervalId = setInterval(render, speed);
    startTimer();
}
function gameOver() {
    clearInterval(intervalId);
    clearInterval(timerId);

    modal.style.display = "flex";
    startGameModal.style.display = "none";
    gameOverModal.style.display = "flex";
} 