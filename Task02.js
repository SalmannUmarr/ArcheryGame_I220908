// Selecting DOM Elements using modern methods [cite: 14]
const arrow = document.querySelector("#arrow");
const target = document.querySelector("#target");
const scoreDisplay = document.querySelector("#scoreVal");
const timeDisplay = document.querySelector("#timeVal");
const messageBox = document.querySelector("#message");
const restartBtn = document.querySelector("#restartBtn");

// Game State Variables [cite: 36, 38]
let score = 0;
let timeLeft = 30;
let isGameOver = false;
let isArrowFlying = false;
let targetY = 100;
let targetSpeed = 5;
let targetDirection = 1;

// Intervals
let targetInterval;
let timerInterval;

// Initialize Game
function init() {
    startTimer();
    moveTarget();
    // Event listener for shooting [cite: 14]
    document.addEventListener("click", handleShoot);
    restartBtn.addEventListener("click", resetGame);
}

// Function to move the archery target [cite: 24]
function moveTarget() {
    targetInterval = setInterval(() => {
        if (isGameOver) return;

        targetY += targetSpeed * targetDirection;

        // Bounce logic [cite: 4]
        if (targetY <= 0 || targetY >= (window.innerHeight * 0.85) - 60) {
            targetDirection *= -1;
        }

        target.style.top = targetY + "px";
    }, 20);
}

// Function to handle the countdown [cite: 25, 45]
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;
        if (timeLeft <= 0) endGame();
    }, 1000);
}

// Function to shoot the arrow [cite: 3, 60]
function handleShoot(e) {
    if (isGameOver || isArrowFlying || e.target.id === 'restartBtn') return;

    isArrowFlying = true;
    arrow.style.display = "block";

    // Position arrow relative to bow
    const bow = document.querySelector("#bow");
    arrow.style.top = (bow.offsetTop + 25) + "px";
    let arrowX = 80;

    let arrowInterval = setInterval(() => {
        arrowX += 15;
        arrow.style.left = arrowX + "px";

        // Collision Detection [cite: 6, 63]
        if (checkCollision()) {
            updateScore();
            resetArrow(arrowInterval);
        }

        // Arrow out of screen [cite: 60]
        if (arrowX > window.innerWidth) {
            resetArrow(arrowInterval);
        }
    }, 20);
}

function checkCollision() {
    const a = arrow.getBoundingClientRect();
    const t = target.getBoundingClientRect();

    return !(a.right < t.left || a.left > t.right || a.bottom < t.top || a.top > t.bottom);
}

// Increases score when target is hit [cite: 26, 51]
function updateScore() {
    score++;
    scoreDisplay.textContent = score;
    increaseDifficulty();
}

// Makes the game harder [cite: 28, 53]
function increaseDifficulty() {
    targetSpeed += 0.5;
}

function resetArrow(interval) {
    clearInterval(interval);
    isArrowFlying = false;
    arrow.style.display = "none";
    arrow.style.left = "80px";
}

// Logic for when time reaches zero [cite: 46, 48]
function endGame() {
    isGameOver = true;
    clearInterval(targetInterval);
    clearInterval(timerInterval);
    document.querySelector("#finalScore").textContent = score;
    messageBox.style.display = "block";
}

function resetGame() {
    score = 0;
    timeLeft = 30;
    isGameOver = false;
    targetSpeed = 5;
    scoreDisplay.textContent = "0";
    timeDisplay.textContent = "60";
    messageBox.style.display = "none";
    moveTarget();
    startTimer();
}

// Start the game logic [cite: 6]
init();