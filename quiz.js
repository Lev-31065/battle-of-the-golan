// quiz.js — the Hebrew question popup.
//
// Other code opens it like this:
//     openQuiz({ title: "Earn the hammer", onCorrect: () => { ...reward... } });
// Rules:
//   • Right answer → the popup closes and onCorrect() runs (you get your reward).
//   • Wrong answer → you see the right answer, wait 3 seconds, then get a NEW question.
//   • Closing the popup doesn't skip the wait — reopening it makes you finish waiting.

const WRONG_ANSWER_WAIT = 3; // seconds

const quiz = {
  open: false,
  entry: null,          // the word being asked right now
  locked: false,        // true after you've picked an answer (so you can't click twice)
  onCorrect: null,
  waitUntil: 0,         // time (in ms) when the wrong-answer wait ends
  timer: null,
};

const quizEl = document.getElementById("quiz");
const quizTitle = document.getElementById("quiz-title");
const quizPrompt = document.getElementById("quiz-prompt");
const quizChoices = document.getElementById("quiz-choices");
const quizFeedback = document.getElementById("quiz-feedback");
const quizCloseButton = document.getElementById("quiz-close");

// Shuffle a list into random order (the "Fisher–Yates" shuffle).
function shuffle(list) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

// We deal words like a deck of cards, so you don't see the same one twice in a row.
let deck = [];
function nextEntry() {
  if (deck.length === 0) deck = shuffle([...WORDS]);
  return deck.pop();
}

// Build 4 answer choices: the right one + up to 3 wrong ones, in random order.
function buildChoices(entry) {
  const choices = [entry.hebrew];
  for (const wrong of shuffle([...(entry.wrong || [])])) {
    if (choices.length < 4 && !choices.includes(wrong)) choices.push(wrong);
  }
  // Not enough tricky answers? Borrow other single words from the word bank.
  const others = shuffle(WORDS.filter((w) => !(w.wrong && w.wrong.length >= 3)));
  for (const other of others) {
    if (choices.length < 4 && !choices.includes(other.hebrew)) choices.push(other.hebrew);
  }
  return shuffle(choices);
}

// closable: false hides the ✕ button, so you MUST answer (used for rocks).
function openQuiz({ title, onCorrect, closable = true }) {
  quiz.open = true;
  quiz.onCorrect = onCorrect;
  quiz.closable = closable;
  quizCloseButton.hidden = !closable;
  quizTitle.textContent = title;
  quizEl.hidden = false;
  askOrWait();
}

function closeQuiz() {
  quiz.open = false;
  quizEl.hidden = true;
  clearInterval(quiz.timer);
}

// If you still have to wait from a wrong answer, show a countdown first.
function askOrWait() {
  clearInterval(quiz.timer);
  if (performance.now() < quiz.waitUntil) {
    quizChoices.innerHTML = "";
    quizPrompt.textContent = "⏳";
    const tick = () => {
      const secondsLeft = Math.ceil((quiz.waitUntil - performance.now()) / 1000);
      if (secondsLeft <= 0) return askOrWait();
      quizFeedback.className = "quiz-feedback";
      quizFeedback.textContent = `Next question in ${secondsLeft}…`;
    };
    tick();
    quiz.timer = setInterval(tick, 200);
    return;
  }
  showNewQuestion();
}

function showNewQuestion() {
  quiz.entry = nextEntry();
  quiz.locked = false;
  quizPrompt.textContent = quiz.entry.english;
  quizFeedback.textContent = "";
  quizFeedback.className = "quiz-feedback";

  // Make one button per choice.
  quizChoices.innerHTML = "";
  buildChoices(quiz.entry).forEach((hebrew, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-choice";
    button.lang = "he";
    button.dir = "rtl";            // Hebrew reads right-to-left
    button.textContent = hebrew;
    button.dataset.key = index + 1;  // shows a small 1–4 for keyboard players
    button.addEventListener("click", () => choose(button));
    quizChoices.appendChild(button);
  });
}

function choose(button) {
  if (quiz.locked) return;
  quiz.locked = true;
  const correctAnswer = quiz.entry.hebrew;

  if (button.textContent === correctAnswer) {
    playSound("correct");
    button.classList.add("correct");
    quizFeedback.className = "quiz-feedback good";
    quizFeedback.textContent = "✅ נָכוֹן! Correct!";
    setTimeout(() => {
      closeQuiz();
      if (quiz.onCorrect) quiz.onCorrect();
    }, 900);
  } else {
    playSound("wrong");
    button.classList.add("wrong");
    // Light up the right answer in green so you learn it.
    for (const other of quizChoices.children) {
      if (other.textContent === correctAnswer) other.classList.add("correct");
    }
    quiz.waitUntil = performance.now() + WRONG_ANSWER_WAIT * 1000;
    quizFeedback.className = "quiz-feedback bad";
    quizFeedback.textContent = `❌ The answer is ${correctAnswer}`;
    // After a moment, switch to the countdown and then a new question.
    quiz.timer = setTimeout(() => { if (quiz.open) askOrWait(); }, 1800);
  }
}

quizCloseButton.addEventListener("click", closeQuiz);

// Keyboard players can press 1, 2, 3 or 4 to answer.
window.addEventListener("keydown", (event) => {
  if (!quiz.open) return;
  const number = parseInt(event.key, 10);
  if (number >= 1 && number <= 4 && quizChoices.children[number - 1]) {
    choose(quizChoices.children[number - 1]);
  }
  if (event.key === "Escape" && quiz.closable) closeQuiz();
});
