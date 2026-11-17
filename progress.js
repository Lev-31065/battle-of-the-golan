// progress.js — remembers how well you know each word, like a flashcard app.
//
// The idea is called "spaced repetition":
//   • A NEW word, or one you just got WRONG, comes back again very soon.
//   • Each time you get a word right IN A ROW, it waits longer before coming back:
//     a few questions → a few minutes → the next playing session or a day → a few days → ...
//   • Get it wrong at any point and it starts over.
// The waiting times live in rules.js (REVIEW_STEPS), so they're easy to change.
//
// Where it's saved:
//   • Not logged in → on this phone only (in the browser's "localStorage").
//   • Logged in → on this phone AND in your account (account.js uploads it),
//     so it follows you to any phone or computer.
//
// quiz.js uses it like this:
//     pickNextWord()               → which word to ask next
//     recordAnswer(entry, true)    → you got it right (false = wrong)

const GUEST_PROGRESS_KEY = "golan-progress-v1"; // the phone's storage slot for "not logged in"
let progressKey = GUEST_PROGRESS_KEY;           // the slot we're using right now

function emptyProgress() {
  return { session: 0, lastSessionStart: 0, questionCount: 0, words: {} };
}

function loadProgressFrom(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && saved.words) return saved;
  } catch {}
  return emptyProgress();
}

let progress = loadProgressFrom(GUEST_PROGRESS_KEY);

// account.js sets this to a function that uploads progress to your account.
let onProgressSaved = null;

function saveProgress() {
  try { localStorage.setItem(progressKey, JSON.stringify(progress)); } catch {}
  if (onProgressSaved) onProgressSaved();
}

// A "playing session" starts when you open the game, but only if it's been a
// while since the last one. (Opening the game 3 times in 10 minutes is one session.)
function startSessionIfNeeded() {
  if (Date.now() - progress.lastSessionStart > SESSION_GAP_HOURS * 60 * 60 * 1000) {
    progress.session++;
    progress.lastSessionStart = Date.now();
    saveProgress();
  }
}
startSessionIfNeeded();

// Combine two sets of progress (for example, this phone's and your account's).
// For each word, keep whichever one you answered most recently.
function mergeProgress(a, b) {
  const merged = {
    session: Math.max(a.session || 0, b.session || 0),
    lastSessionStart: Math.max(a.lastSessionStart || 0, b.lastSessionStart || 0),
    questionCount: Math.max(a.questionCount || 0, b.questionCount || 0),
    words: { ...a.words },
    // Auto level: keep whichever one changed most recently.
    auto: ((a.auto && a.auto.updated) || 0) >= ((b.auto && b.auto.updated) || 0) ? a.auto : b.auto,
  };
  for (const [key, record] of Object.entries(b.words || {})) {
    const other = merged.words[key];
    const newer = !other
      || (record.seen || 0) > (other.seen || 0)
      || ((record.seen || 0) === (other.seen || 0) && record.level > other.level);
    // (best = the highest level this word ever reached: keep the higher one, whichever record wins.)
    const best = Math.max(bestLevel(record), other ? bestLevel(other) : 0);
    if (newer) merged.words[key] = record;
    merged.words[key].best = best;
  }
  merged.look = a.look || b.look; // the look I picked (looks.js)
  return merged;
}

// Called by account.js when someone logs in (userId + their saved progress
// from the account) or logs out (userId = null).
function switchProgressOwner(userId, accountData) {
  if (!userId) {
    progressKey = GUEST_PROGRESS_KEY;
    progress = loadProgressFrom(GUEST_PROGRESS_KEY);
    startSessionIfNeeded();
    return;
  }
  progressKey = GUEST_PROGRESS_KEY + "-" + userId;
  let merged = mergeProgress(loadProgressFrom(progressKey), accountData && accountData.words ? accountData : emptyProgress());
  // Words practiced before logging in get added to the account (then the guest slot is emptied).
  const guest = loadProgressFrom(GUEST_PROGRESS_KEY);
  if (Object.keys(guest.words).length > 0) {
    merged = mergeProgress(merged, guest);
    try { localStorage.removeItem(GUEST_PROGRESS_KEY); } catch {}
  }
  progress = merged;
  saveProgress();
  startSessionIfNeeded();
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

// For the lobby: how many words of one deck you know well, out of how many.
function deckProgress(deck) {
  const known = deck.words.map(forMyGender).filter((w) => {
    const record = progress.words[wordKey(w)];
    return record && record.level >= 3;
  }).length;
  return { known, total: deck.words.length };
}

// ---------- Mastery points ----------
// The highest flashcard level a word has ever reached. (Older saved words have no `best` yet:
// for them it is the level they are at now.)
function bestLevel(record) {
  return Math.max(record.best || 0, record.level || 0);
}

// My mastery points: 1 for every level every word has ever climbed. A wrong answer sends
// a word back to level 0, but its best level stays, so points never go down; and a word
// only gives a new point when it gets further than it ever has before.
function masteryPoints() {
  let points = 0;
  for (const record of Object.values(progress.words)) points += bestLevel(record);
  return points;
}

// Update a word after you answer it.
function recordAnswer(entry, correct) {
  progress.questionCount++;
  const key = wordKey(entry);
  const record = progress.words[key] || { level: 0 };
  const bestBefore = bestLevel(record);

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
  record.seen = Date.now(); // when you last answered it (used when combining phones)
  record.best = Math.max(bestBefore, record.level); // (for mastery points)

  progress.words[key] = record;
  saveProgress();
}

// ---------- Auto level ----------
// Each player's own level, used when the host picks "Auto" in the lobby.
// The settings live in rules.js (AUTO_LEVEL).
// Saved inside progress (so it follows your account too):
//   deckId  = your level right now
//   placing = true while we're still finding your level (fast climbing)
//   recent  = your answers since you arrived at this level: { right, fast }

function autoState() {
  if (!progress.auto || !findDeck(progress.auto.deckId)) {
    progress.auto = { deckId: DECKS[0].id, placing: true, recent: [], updated: 0 };
  }
  return progress.auto;
}

// Your Auto level's deck id, like "level-4" (level 4A) or "review-6" (level 6B).
// (From level 11 on, the id's number is one less than the level shown, e.g. "level-11" = 12A,
//  because the object-pronoun level was added later as level 11.)
function autoDeckId() {
  return autoState().deckId;
}

// Called after every answer while playing on Auto.
// Returns "up" or "down" if your level changed, "try" while still finding your level (now trying
// another one), "found" when your level has just been found, otherwise null.
function noteAutoAnswer(correct, seconds) {
  const auto = autoState();
  auto.recent.push({ right: correct, fast: correct && seconds <= AUTO_LEVEL.fastSeconds });
  auto.updated = Date.now();
  let move = null;
  const index = DECKS.findIndex((deck) => deck.id === auto.deckId);

  if (auto.placing) {
    // 1) Still finding your level: big jumps, then halfway steps (AUTO_LEVEL in rules.js).
    //    lo = the highest main level passed so far, hi = the lowest one found too hard
    //    (both are places in the list of main levels; -1 / main.length = none yet).
    const main = DECKS.filter((deck) => !deck.review && !deck.checkpoint);
    let at = main.findIndex((deck) => deck.id === auto.deckId);
    if (at === -1) { // (on a B level or a checkpoint: the A level before it)
      const after = main.findIndex((deck) => DECKS.indexOf(deck) > index);
      at = after === -1 ? main.length - 1 : Math.max(0, after - 1);
    }
    // (A player who was halfway through the OLD climb passed every level below this one.)
    if (auto.lo === undefined) { auto.lo = at - 1; auto.hi = main.length; }
    const rights = auto.recent.filter((a) => a.right).length;
    const wrongs = auto.recent.length - rights;
    let next = null;   // the level to try next
    let found = null;  // or: this is your level
    if (rights - wrongs >= AUTO_LEVEL.placePass) {
      auto.lo = at;
      if (auto.hi >= main.length) next = Math.min(at + AUTO_LEVEL.bigJump, main.length - 1); // nothing too hard yet: big jump
      else next = Math.ceil((auto.lo + auto.hi) / 2);                                           // halfway up
      if (next <= at) found = at; // (at the top, or the next level up was already too hard)
    } else if (wrongs - rights >= AUTO_LEVEL.placeFail) {
      if (auto.lo < 0 && !auto.retried) { auto.retried = true; auto.recent = []; } // (level 1 too hard? One more go first: maybe it was just a slow start)
      else if (auto.lo < 0) found = 0;               // level 1 is too hard: start at level 1 anyway
      else {
        auto.hi = at;
        next = Math.floor((auto.lo + auto.hi) / 2);  // halfway down
        if (next <= auto.lo) found = auto.lo;        // the level just below was passed: that's it
      }
    }
    if (found !== null) {
      auto.placing = false;
      delete auto.lo;
      delete auto.hi;
      delete auto.retried;
      auto.deckId = main[found].id;
      auto.recent = [];
      move = "found";
    } else if (next !== null) {
      auto.deckId = main[next].id;
      auto.recent = [];
      move = "try";
    }
  } else {
    // 2) Settled. Going up looks at a few recent answers; going down looks at more.
    auto.recent = auto.recent.slice(-Math.max(AUTO_LEVEL.upLookBack, AUTO_LEVEL.downLookBack));
    // share(list, "right") = what fraction of the answers in the list were right (0 to 1).
    const share = (list, what) => list.filter((a) => a[what]).length / list.length;
    const forUp = auto.recent.slice(-AUTO_LEVEL.upLookBack);
    const forDown = auto.recent.slice(-AUTO_LEVEL.downLookBack);
    if (forUp.length >= AUTO_LEVEL.upLookBack
        && share(forUp, "right") >= AUTO_LEVEL.upIfRight
        && share(forUp, "fast") >= AUTO_LEVEL.upIfFast
        && index < DECKS.length - 1) {
      auto.deckId = DECKS[index + 1].id;
      move = "up";
    } else if (forDown.length >= AUTO_LEVEL.downLookBack
        && share(forDown, "right") < AUTO_LEVEL.downIfRight
        && index > 0) {
      auto.deckId = DECKS[index - 1].id;
      move = "down";
    }
    if (move) auto.recent = [];
  }

  saveProgress();
  return move;
}
