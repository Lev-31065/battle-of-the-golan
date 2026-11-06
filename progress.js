// progress.js — remembers how well you know each word, like a flashcard app.
//
// The idea is called "spaced repetition":
//   • A NEW word, or one you just got WRONG, comes back again very soon.
//   • Each time you get a word right IN A ROW, it waits longer before coming back:
//     a few questions → a few minutes → the next playing session or a day → a few days → ...
//   • Get it wrong at any point and it starts over.
// The waiting times live in rules.js (REVIEW_STEPS), so they're easy to change.
//
// For now, progress is saved on this phone only (in the browser's "localStorage").
// Later, when we add logins, it will move into your account.
//
// quiz.js uses it like this:
//     pickNextWord()               → which word to ask next
//     recordAnswer(entry, true)    → you got it right (false = wrong)

const PROGRESS_KEY = "golan-progress-v1";

// Load saved progress (or start fresh).
let progress = { session: 0, lastSessionStart: 0, questionCount: 0, words: {} };
try {
  const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY));
  if (saved && saved.words) progress = saved;
} catch {}

function saveProgress() {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); } catch {}
}

// A "playing session" starts when you open the game, but only if it's been a
// while since the last one. (Opening the game 3 times in 10 minutes is one session.)
if (Date.now() - progress.lastSessionStart > SESSION_GAP_HOURS * 60 * 60 * 1000) {
  progress.session++;
  progress.lastSessionStart = Date.now();
  saveProgress();
}

// Each word gets a name made of its English + Hebrew, e.g. "dog|כֶּלֶב".
function wordKey(entry) {
  return entry.english + "|" + entry.hebrew;
}

// Is this word due to come back yet? (Whichever comes first: enough questions,
// enough minutes/days, or enough playing sessions.)
function isDue(record) {
  return progress.questionCount >= record.dueQuestion
      || Date.now() >= record.dueTime
      || progress.session >= record.dueSession;
}

let lastAskedKey = null; // so you never get the same word twice in a row

function pickNextWord() {
  const notLast = WORDS.filter((w) => wordKey(w) !== lastAskedKey);
  const pool = notLast.length > 0 ? notLast : WORDS;

  // 1) Words you've seen that are due again. Weakest ones (lowest level) first.
  const due = pool.filter((w) => progress.words[wordKey(w)] && isDue(progress.words[wordKey(w)]));
  let choice = null;
  if (due.length > 0) {
    const lowest = Math.min(...due.map((w) => progress.words[wordKey(w)].level));
    choice = randomItem(due.filter((w) => progress.words[wordKey(w)].level === lowest));
  }

  // 2) Nothing due? Teach a brand-new word.
  if (!choice) {
    const fresh = pool.filter((w) => !progress.words[wordKey(w)]);
    if (fresh.length > 0) choice = randomItem(fresh);
  }

  // 3) You've seen every word and none are due? Ask the one that's closest to
  //    coming back (the lowest level), so the game can always ask something.
  if (!choice) {
    const lowest = Math.min(...pool.map((w) => progress.words[wordKey(w)].level));
    choice = randomItem(pool.filter((w) => progress.words[wordKey(w)].level === lowest));
  }

  lastAskedKey = wordKey(choice);
  return choice;
}

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// For the home screen: how many words you've practiced, and how many you know well
// (got right at least 3 times in a row).
function progressSummary() {
  const records = Object.values(progress.words);
  return {
    practiced: records.length,
    known: records.filter((r) => r.level >= 3).length,
  };
}

// Update a word after you answer it.
function recordAnswer(entry, correct) {
  progress.questionCount++;
  const key = wordKey(entry);
  const record = progress.words[key] || { level: 0 };

  // Right → one level up (it waits longer). Wrong → back to the start.
  record.level = correct ? Math.min(record.level + 1, REVIEW_STEPS.length - 1) : 0;

  // Work out when it should come back, using the waiting time for its level.
  const step = REVIEW_STEPS[record.level];
  const never = Number.MAX_SAFE_INTEGER; // "never" = a huge number (saved files can't store Infinity)
  record.dueQuestion = step.questions != null ? progress.questionCount + step.questions : never;
  record.dueTime = step.minutes != null ? Date.now() + step.minutes * 60 * 1000
                 : step.days != null ? Date.now() + step.days * 24 * 60 * 60 * 1000
                 : never;
  record.dueSession = step.sessions != null ? progress.session + step.sessions : never;

  progress.words[key] = record;
  saveProgress();
}
