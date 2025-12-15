document.addEventListener("DOMContentLoaded", function () {

  const board = document.querySelector(".box");
  const movesEl = document.getElementById("moves");
  const pairsEl = document.getElementById("pairs");
  const restartBtn = document.getElementById("restart");
  const timerEl = document.getElementById("title");

  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let moves = 0;
  let pairs = 0;
  let totalPairs = 0;
  let timeLeft = 60;
  let timerInterval = null;

  function formatTime(seconds) {
    const hr = Math.floor(seconds / 3600);
    const min = Math.floor((seconds % 3600) / 60);
    const sec = seconds % 60;

    return (
      String(hr) + ":" + String(min).padStart(2, "0") + ":" + String(sec).padStart(2, "0")
    );
  }

  function updateTimer() {
    timerEl.textContent = formatTime(timeLeft);
  }

  function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 60;
    updateTimer();

    timerInterval = setInterval(function () {
      timeLeft--;
      if (timeLeft < 0) timeLeft = 0;
      updateTimer();

      if (timeLeft === 0) {
        clearInterval(timerInterval);
        lockBoard = true;
        alert("⏰ Time's up! Try again.");
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  function setupCards() {
    const cards = document.querySelectorAll(".flip-card");
    totalPairs = cards.length / 2;

    cards.forEach(function (card, index) {
      const img = card.querySelector(".flip-card-back img");
      card.dataset.key = img ? img.src : index;
    });
  }

  function shuffleCards() {
    const cards = document.querySelectorAll(".flip-card");
    cards.forEach(function (card) {
      card.style.order = Math.floor(Math.random() * cards.length);
    });
  }

  function flipCard(card) {
    const inner = card.querySelector(".flip-card-inner");
    inner.classList.add("is-flipped");
  }

  function unflipCard(card) {
    const inner = card.querySelector(".flip-card-inner");
    inner.classList.remove("is-flipped");
  }

  function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

  function checkMatch() {
    if (firstCard.dataset.key === secondCard.dataset.key) {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");

      pairs++;
      pairsEl.textContent = pairs;

      resetTurn();

      if (pairs === totalPairs) {
        stopTimer();
        setTimeout(function () {
          alert("🎉 You won in " + moves + " moves with " + timeLeft + " Sec left!!!");
        }, 200);
      }
    } else {
      setTimeout(function () {
        unflipCard(firstCard);
        unflipCard(secondCard);
        resetTurn();
      }, 600);
    }
  }

  function handleCardClick(card) {
    if (lockBoard) return;
    if (card.classList.contains("matched")) return;
    if (card === firstCard) return;

    flipCard(card);

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    moves++;
    movesEl.textContent = moves;
    lockBoard = true;

    checkMatch();
  }

  function restartGame() {
    stopTimer();
    moves = 0;
    pairs = 0;
    movesEl.textContent = 0;
    pairsEl.textContent = 0;

    document.querySelectorAll(".flip-card-inner").forEach(function (inner) {
      inner.classList.remove("is-flipped");
    });

    document.querySelectorAll(".flip-card").forEach(function (card) {
      card.classList.remove("matched");
    });

    shuffleCards();
    setupCards();
    resetTurn();
    startTimer();
  }

  board.addEventListener("click", function (e) {
    const card = e.target.closest(".flip-card");
    if (!card) return;
    handleCardClick(card);
  });

  restartBtn.addEventListener("click", restartGame);


  setupCards();
  shuffleCards();
  updateTimer();
  startTimer();

});

