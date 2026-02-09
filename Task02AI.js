const arrow = document.querySelector("#arrow");
const target = document.querySelector("#target");
const scoreDisplay = document.querySelector("#scoreVal");
const timeDisplay = document.querySelector("#timeVal");
const highDisplay = document.querySelector("#highScore");
const messageBox = document.querySelector("#message");
const restartBtn = document.querySelector("#restartBtn");
const resetBtnTop = document.querySelector("#resetBtnTop");

let score = 0;
let highScore = localStorage.getItem("archeryHighScore") || 0;
let timeLeft = 90;
let isGameOver = false;
let isArrowFlying = false;
let targetY = 100;
let baseSpeed = 5;
let currentSpeed = 5;
let targetDirection = 1;

let targetInterval, timerInterval, arrowInterval;

highDisplay.textContent = highScore;

function init() {
    startTimer();
    moveTarget();
    document.addEventListener("click", handleShoot);
    document.addEventListener("mousemove", (e) => {
        if(!isGameOver) {
            const bow = document.querySelector("#bow");
            const y = Math.max(100, Math.min(e.clientY, window.innerHeight - 100));
            bow.style.top = y + "px";
        }
    });
    restartBtn.addEventListener("click", resetGame);
    resetBtnTop.addEventListener("click", resetGame);
}

function moveTarget() {
    clearInterval(targetInterval);
    targetInterval = setInterval(() => {
        if (isGameOver) return;
        targetY += currentSpeed * targetDirection;
        if (targetY <= 80 || targetY >= window.innerHeight - 120) {
            targetDirection *= -1;
        }
        target.style.top = targetY + "px";
    }, 16);
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
    const startY = bow.offsetTop + 35;
    arrow.style.top = startY + "px";
    let arrowX = 100;

    clearInterval(arrowInterval);
    arrowInterval = setInterval(() => {
        arrowX += 25;
        arrow.style.left = arrowX + "px";

        if (checkCollision()) {
            triggerHitEffect();
            updateScore();
            resetArrow();
        }

        if (arrowX > window.innerWidth) {
            resetArrow();
        }
    }, 16);
}

function checkCollision() {
    const a = arrow.getBoundingClientRect();
    const t = target.getBoundingClientRect();
    return !(a.right < t.left || a.left > t.right || a.bottom < t.top || a.top > t.bottom);
}

function triggerHitEffect() {
    target.classList.add("hit-animation");
    setTimeout(() => target.classList.remove("hit-animation"), 300);
}

function updateScore() {
    score += 10;
    scoreDisplay.textContent = score;
    currentSpeed = baseSpeed + (score / 50);
}

function resetArrow() {
    clearInterval(arrowInterval);
    isArrowFlying = false;
    arrow.style.display = "none";
    arrow.style.left = "100px";
}

function endGame() {
    isGameOver = true;
    clearInterval(targetInterval);
    clearInterval(timerInterval);

    document.querySelector("#finalScore").textContent = score;
    messageBox.style.display = "grid";

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("archeryHighScore", highScore);
        highDisplay.textContent = highScore;
        document.querySelector("#newRecord").classList.remove("hidden");
    } else {
        document.querySelector("#newRecord").classList.add("hidden");
    }
}

function resetGame() {
    clearInterval(targetInterval);
    clearInterval(timerInterval);
    clearInterval(arrowInterval);

    score = 0;
    timeLeft = 90;
    isGameOver = false;
    isArrowFlying = false;
    currentSpeed = baseSpeed;

    scoreDisplay.textContent = "0";
    timeDisplay.textContent = "90";
    messageBox.style.display = "none";
    arrow.style.display = "none";

    moveTarget();
    startTimer();
}

init();