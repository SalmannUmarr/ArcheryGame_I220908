const arrow = document.querySelector("#arrow");
const target = document.querySelector("#target");
const scoreDisplay = document.querySelector("#scoreVal");
const timeDisplay = document.querySelector("#timeVal");
const messageBox = document.querySelector("#message");
const restartBtn = document.querySelector("#restartBtn");
const resetBtnTop = document.querySelector("#resetBtnTop");

let score = 0;
let timeLeft = 90;
let isGameOver = false;
let isArrowFlying = false;
let targetY = 100;
let targetSpeed = 5;
let targetDirection = 1;

let targetInterval;
let timerInterval;
let arrowInterval;

function init() {
    startTimer();
    moveTarget();
    document.addEventListener("click", handleShoot);
    restartBtn.addEventListener("click", resetGame);
    resetBtnTop.addEventListener("click", resetGame);
}

function moveTarget() {
    clearInterval(targetInterval);
    targetInterval = setInterval(() => {
        if (isGameOver) return;

        targetY += targetSpeed * targetDirection;

        if (targetY <= 0 || targetY >= (window.innerHeight * 0.85) - 80) {
            targetDirection *= -1;
        }

        target.style.top = targetY + "px";
    }, 20);
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;
        if (timeLeft <= 0) endGame();
    }, 1000);
}

function handleShoot(e) {
    if (isGameOver || isArrowFlying || e.target.tagName === 'BUTTON') return;

    isArrowFlying = true;
    arrow.style.display = "block";

    const bow = document.querySelector("#bow");
    arrow.style.top = (bow.offsetTop + 30) + "px";
    let arrowX = 80;

    clearInterval(arrowInterval);
    arrowInterval = setInterval(() => {
        arrowX += 18;
        arrow.style.left = arrowX + "px";

        if (checkCollision()) {
            updateScore();
            resetArrow();
        }

        if (arrowX > window.innerWidth) {
            resetArrow();
        }
    }, 20);
}

function checkCollision() {
    const a = arrow.getBoundingClientRect();
    const t = target.getBoundingClientRect();

    return !(a.right < t.left || a.left > t.right || a.bottom < t.top || a.top > t.bottom);
}

function updateScore() {
    score++;
    scoreDisplay.textContent = score;
    targetSpeed += 0.4;
}

function resetArrow() {
    clearInterval(arrowInterval);
    isArrowFlying = false;
    arrow.style.display = "none";
    arrow.style.left = "80px";
}

function endGame() {
    isGameOver = true;
    clearInterval(targetInterval);
    clearInterval(timerInterval);
    document.querySelector("#finalScore").textContent = score;
    messageBox.style.display = "block";
}

function resetGame() {
    clearInterval(targetInterval);
    clearInterval(timerInterval);
    clearInterval(arrowInterval);

    score = 0;
    timeLeft = 90;
    isGameOver = false;
    isArrowFlying = false;
    targetSpeed = 5;
    targetY = 100;

    scoreDisplay.textContent = "0";
    timeDisplay.textContent = "90";
    messageBox.style.display = "none";
    arrow.style.display = "none";

    moveTarget();
    startTimer();
}

init();