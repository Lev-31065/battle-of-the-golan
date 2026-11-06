// quiz.js — the Hebrew question popup.
//
// Other code opens it like this:
//     openQuiz({ title: "Earn the hammer", onCorrect: () => { ...reward... } });
// Rules:
//   • Right answer → the popup closes instantly and onCorrect() runs (you get your reward).
//   • Wrong answer → you see the right answer, wait 3 seconds, then get a NEW question.
//   • Closing the popup doesn't skip the wait — reopening it makes you finish waiting.
//
// Which word gets asked comes from progress.js (the flashcard memory).
// What gets read out loud (speech.js):
//   • New question → the English is read.
//   • Wrong answer → the right Hebrew answer is read during the wait.
//   • Right answer → the Hebrew, then English + Hebrew once more, then English + Hebrew
//     for every word you missed along the way. The top card shows each pair as it's read.
//   • A new question always stops whatever is still being read.

const WRONG_ANSWER_WAIT = 3; // seconds

const quiz = {
  open: false,
  entry: null,          // the word being asked right now
  locked: false,        // true after you've picked an answer (so you can't click twice)
  onCorrect: null,
  waitUntil: 0,         // time (in ms) when the wrong-answer wait ends
  timer: null,
  missed: [],           // words you got wrong since your last right answer (read again at the end)
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
  const wasOpen = quiz.open;
  quiz.open = false;
  quizEl.hidden = true;
  clearInterval(quiz.timer);
  // Closed without getting one right? Still read back the words you missed.
  if (wasOpen && quiz.missed.length > 0) {
    speakSteps(quiz.missed.map((entry) => ({ card: entry, lines: [englishLine(entry), hebrewLine(entry)] })));
    quiz.missed = [];
  }
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
  quiz.entry = pickNextWord();
  quiz.locked = false;
  quizPrompt.textContent = quiz.entry.english;
  // Stop anything still being read, and read the new English word.
  speakSteps([{ card: null, lines: [englishLine(quiz.entry)] }]);
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
    recordAnswer(quiz.entry, true);
    // Read it back: Hebrew, then English + Hebrew, then every word you missed.
    const entry = quiz.entry;
    const steps = [{ card: entry, lines: [hebrewLine(entry), englishLine(entry), hebrewLine(entry)] }];
    for (const missedEntry of quiz.missed) {
      steps.push({ card: missedEntry, lines: [englishLine(missedEntry), hebrewLine(missedEntry)] });
    }
    quiz.missed = [];
    // Close the popup RIGHT AWAY so you can move again with no delay.
    // A small "Correct!" message pops up over the game instead.
    // (If the reward shows its own message, like "You earned the Hammer!",
    // that message simply replaces this one.)
    closeQuiz();
    speakSteps(steps);
    showToast("✅ נָכוֹן! Correct!");
    if (quiz.onCorrect) quiz.onCorrect();
  } else {
    playSound("wrong");
    recordAnswer(quiz.entry, false);
    // Remember it for the read-back, and say the right answer in Hebrew now.
    if (!quiz.missed.includes(quiz.entry)) quiz.missed.push(quiz.entry);
    speakSteps([{ card: null, lines: [hebrewLine(quiz.entry)] }]);
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
