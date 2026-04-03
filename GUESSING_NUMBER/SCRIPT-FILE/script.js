// my declared vrbl
let targetNumber = 0;
let maxLimit = 100;
let attemptsLeft = 3;
const maxAttempts = 3;
let gameActive = false;

// dom element
const setupPhase = document.getElementById("setup-phase");
const gameplayPhase = document.getElementById("gameplay-phase");
const resultPhase = document.getElementById("result-phase");
const gameCard = document.querySelector(".game-card");
const subtitle = document.getElementById("game-subtitle");

const maxLimitInput = document.getElementById("max-limit-input");
const guessInput = document.getElementById("guess-input");
const attemptsContainer = document.getElementById("attempts-container");
const feedbackMsg = document.getElementById("feedback-msg");

const resultTitle = document.getElementById("result-title");
const resultMessage = document.getElementById("result-message");
const resultIcon = document.getElementById("result-icon");

// nav-func
function showSection(section) {
    const landing = document.getElementById("landing-section");
    const game = document.getElementById("game-section");
    const navHome = document.getElementById("nav-home");

    if (section === "game") {
        landing.classList.remove("active-section");
        landing.classList.add("hidden-section");
        game.classList.remove("hidden-section");
        game.classList.add("active-section");
        navHome.classList.remove("hidden");
    } else {
        game.classList.remove("active-section");
        game.classList.add("hidden-section");
        landing.classList.remove("hidden-section");
        landing.classList.add("active-section");
        navHome.classList.add("hidden");
        resetGame();
    }
}

function startGameFlow() {
    showSection("game");
}

function scrollToHowToPlay() {
    document.getElementById("how-to-play").scrollIntoView({ behavior: "smooth" });
}

// game logc function
function initGame() {
    const limit = parseInt(maxLimitInput.value);

    if (!limit || limit < 1) {
        shakeElement(maxLimitInput);
        subtitle.textContent = "Please enter a valid number greater than 0";
        subtitle.style.color = "#f87171";
        return;
    }

    maxLimit = limit;
    targetNumber = Math.floor(Math.random() * maxLimit) + 1;
    attemptsLeft = maxAttempts;
    gameActive = true;

    // ui transition
    setupPhase.classList.add("hidden");
    gameplayPhase.classList.remove("hidden");
    gameplayPhase.classList.add("animate-pop");

    subtitle.textContent = `Guess a number between 1 and ${maxLimit}`;
    subtitle.style.color = "";

    updateAttemptsUI();
    guessInput.focus();

    console.log(`Debug: Target number is ${targetNumber}`);
}

function submitGuess() {
    if (!gameActive) return;

    const guess = parseInt(guessInput.value);

    // validation
    if (isNaN(guess) || guess < 1 || guess > maxLimit) {
        feedbackMsg.textContent = `Enter a number between 1 and ${maxLimit}`;
        feedbackMsg.className = "feedback-message hint-low";
        shakeElement(guessInput);
        return;
    }

    // check Logic
    if (guess === targetNumber) {
        handleWin();
    } else {
        handleWrongGuess(guess);
    }
}

function handleWrongGuess(guess) {
    attemptsLeft--;
    updateAttemptsUI();

    // visual feedback
    shakeElement(gameCard);
    guessInput.value = "";
    guessInput.focus();

    // hint logic
    const hint = guess < targetNumber ? "Too Low!" : "Too High!";
    feedbackMsg.textContent = `${hint} Try again.`;
    feedbackMsg.className = "feedback-message hint-high";

    if (attemptsLeft === 0) {
        handleGameOver();
    }
}

function handleWin() {
    gameActive = false;
    gameplayPhase.classList.add("hidden");
    resultPhase.classList.remove("hidden");

    resultTitle.textContent = "You Win!";
    resultTitle.className = "result-title win";
    resultMessage.textContent = `You guessed ${targetNumber} correctly!`;
    resultIcon.textContent = "🎉";

    fireConfetti();
}

function handleGameOver() {
    gameActive = false;
    gameplayPhase.classList.add("hidden");
    resultPhase.classList.remove("hidden");

    resultTitle.textContent = "Game Over";
    resultTitle.className = "result-title lose";
    resultMessage.innerHTML = `The number was <span style="color: #818cf8; font-weight: 700; font-size: 1.25rem;">${targetNumber}</span>. Better luck next time!`;
    resultIcon.textContent = "💀";
}

function resetGame() {
    // reset state
    gameActive = false;
    maxLimitInput.value = "";
    guessInput.value = "";
    feedbackMsg.textContent = "";
    feedbackMsg.className = "feedback-message";

    // ui reset
    resultPhase.classList.add("hidden");
    gameplayPhase.classList.add("hidden");
    setupPhase.classList.remove("hidden");
    setupPhase.classList.add("animate-pop");

    subtitle.textContent = "Set the difficulty to begin";
    subtitle.style.color = "";
}

// helper function and yung dot
function updateAttemptsUI() {
    attemptsContainer.innerHTML = "";
    for (let i = 0; i < maxAttempts; i++) {
        const dot = document.createElement("div");
        dot.className =
        i < attemptsLeft ? "attempt-dot active" : "attempt-dot inactive";
        attemptsContainer.appendChild(dot);
    }
}

function shakeElement(element) {
    element.classList.remove("animate-shake");
    void element.offsetWidth; // trigger reflow
    element.classList.add("animate-shake");

    // remove class after animation
    setTimeout(() => {
        element.classList.remove("animate-shake");
    }, 500);
}

// event listener 
maxLimitInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") initGame();
    });

    guessInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") submitGuess();
    });

// coffeti canvas
const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

class Particle {
constructor() {
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight / 2;
        this.vx = (Math.random() - 0.5) * 20;
        this.vy = (Math.random() - 0.5) * 20 - 5;
        this.gravity = 0.5;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.size = Math.random() * 8 + 4;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
        this.life = 100;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.rotation += this.rotationSpeed;
        this.life -= 1;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

function fireConfetti() {
    particles = [];
    for (let i = 0; i < 150; i++) {
        particles.push(new Particle());
    }
animateConfetti();
    }

    function animateConfetti() {
    if (particles.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        if (particles[i].life <= 0 || particles[i].y > canvas.height) {
        particles.splice(i, 1);
        i--;
        }
    }
    requestAnimationFrame(animateConfetti);
}
