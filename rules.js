// rules.js — all of the game's settings in one place, plus a few small helpers
// that both the referee (server.js) and every phone (game.js) need.
//
// Want to change how the game feels? This is the file to experiment with!

// ---------- Players ----------
const PLAYER_SPEED = 172;     // world units per second
const PLAYER_RADIUS = 22;     // body size
const MAX_HP = 100;           // full health
const RESPAWN_TIME = 3;       // seconds before you come back after being knocked out

// ---------- Bumping into other players ----------
// Players are solid: you can't walk through each other. Running into someone
// bounces you both back a little. Bounce distance is about bounceSpeed ÷ slowdown.
const BUMP = {
  bounceSpeed: 300, // how hard you bounce off (world units per second at the start)
  slowdown: 9,      // how fast the bounce fades (bigger = shorter bounce)
  teammates: true,  // false = you can walk through your own teammates
};

// ---------- The shop ----------
// Everything you can buy. The shop and the toolbar list them in THIS order.
//   cost      = how many questions you must answer RIGHT to buy it (wrong answers don't count)
//   kind      = "melee": a hand weapon. Tap Hit to hurt every enemy within `range` of you.
//               "throw": thrown with the Throw button (drag from it to aim, let go to throw).
//   damage    = health taken off per hit (players have MAX_HP = 100)
//   range     = melee: how far the hit zone reaches from your center. Throw: how far it flies.
//   cooldown  = seconds you must wait between swings (or throws)
// Only for "throw" items:
//   perBuy    = how many you get each time you buy it (they get used up; buy more any time)
//   speed     = how fast it flies (world units per second; players walk at PLAYER_SPEED = 172)
//   size      = how big it is when checking what it hits
//   freezes   = true: whoever it hits FREEZES (can't move) until they answer a question right
//   goesThrough = true: it keeps flying and hits EVERY enemy in its path. false: it stops at the first one.
// Hand weapons stay in your toolbar until you're knocked out. Thrown things run out (and are lost if you're knocked out).
const ITEMS = {
  // The cheapest thing in the shop. No damage, but it freezes whoever it hits.
  rock: {
    kind: "throw", cost: 1, perBuy: 1, damage: 0, range: 450, speed: 750, size: 10, cooldown: 0.5,
    freezes: true, goesThrough: false,
    icon: "🪨", name: "Rock", nameHe: "אֶבֶן",
    about: "Throw it: whoever it hits freezes until they answer a question",
    aboutHe: "זוֹרְקִים אוֹתָהּ: מִי שֶׁנִּפְגָּע קוֹפֵא עַד שֶׁהוּא עוֹנֶה עַל שְׁאֵלָה",
  },
  stick: {
    kind: "melee", cost: 2, damage: 8, range: 70, cooldown: 0.25,
    icon: "🏑", name: "Stick", nameHe: "מַקֵּל",
    about: "Super fast, but weak", aboutHe: "מָהִיר מְאוֹד, אֲבָל חַלָּשׁ",
  },
  // 34 damage × 3 hits = 102, so 3 hits knock out anything with 100 health.
  hammer: {
    kind: "melee", cost: 5, damage: 34, range: 85, cooldown: 0.6,
    icon: "🔨", name: "Hammer", nameHe: "פַּטִּישׁ",
    about: "Strong: hits every enemy close to you", aboutHe: "חָזָק: פּוֹגֵעַ בְּכָל אוֹיֵב קָרוֹב",
  },
  // Same damage as the hammer, but thrown. Flies its full range, through everyone in its path.
  stars: {
    kind: "throw", cost: 5, perBuy: 4, damage: 34, range: 550, speed: 950, size: 12, cooldown: 0.35,
    freezes: false, goesThrough: true,
    icon: "⭐", name: "Ninja stars", nameHe: "כּוֹכְבֵי נִינְגָּ׳ה",
    about: "You get 4. Each one hits every enemy in its path",
    aboutHe: "מְקַבְּלִים 4. כָּל אֶחָד פּוֹגֵעַ בְּכָל אוֹיֵב בַּדֶּרֶךְ",
  },
};

// The Throw button: dragging less than this (screen pixels) = throw the way you're facing.
const AIM_DEADZONE = 15;

// ---------- Speed boost box ----------
const SPEED_BOOST = {
  multiplier: 1.5,  // 1.5 = one and a half times normal speed
  duration: 8,      // seconds the boost lasts
  respawn: 30,      // seconds before a new box appears
};

// ---------- Berries (in the "berry" bushes) ----------
// Touch a berry to eat it: a speed boost, and some health back. Boosts from several berries add up.
// Each berry grows back by itself later. (Where the berries are: MAP.berries in map.js.)
const BERRY = {
  boostEach: 0.1,   // each berry = 10% faster…
  duration: 8,      // …for 8 seconds
  maxAtOnce: 5,     // at most 5 berry boosts at the same time (= 50% faster)
  heal: 15,         // each berry gives back this much health (never above MAX_HP)
  touch: 8,         // how close your body's edge must get to a berry to eat it
  regrow: 80,       // seconds until an eaten berry grows back
};

// ---------- Hollow logs ----------
// Solid from the sides. Walk into an open end to hide inside (nobody can see you).
const LOG = {
  width: 44,        // how thick a log is
  darkness: 0.55,   // how dark your screen gets while hiding (0 = not at all, 1 = black)
};

// ---------- Flags ----------
const WIN_SCORE = 3;          // captures needed to win
const CARRY_SLOWDOWN = 0.7;   // carrying a flag = 70% speed
const FLAG_REACH = 70;        // how close you must be to grab a flag
const FLAG_RETURN_TIME = 30;  // a dropped flag goes home by itself after this many seconds
const WINNER_SCREEN_TIME = 6; // seconds the winner screen shows before everyone goes back to the teams

const TEAM_NAMES = { blue: "Blue", red: "Red" };
// The Hebrew versions (with nikud). Hebrew adjectives change with the noun, and
// "to the..." merges into one word (לַ...), so each phrase is spelled out in full.
const TEAM_HE = {
  blue: { name: "כָּחֹל", flag: "הַדֶּגֶל הַכָּחֹל", team: "הַקְּבוּצָה הַכְּחֻלָּה", toTeam: "לַקְּבוּצָה הַכְּחֻלָּה", toPlayers: "לַכְּחֻלִּים" },
  red:  { name: "אָדֹם", flag: "הַדֶּגֶל הָאָדֹם", team: "הַקְּבוּצָה הָאֲדֻמָּה", toTeam: "לַקְּבוּצָה הָאֲדֻמָּה", toPlayers: "לָאֲדֻמִּים" },
};

// ---------- Rocks ----------
// Rocks are solid. Bump into one and you must answer a question to pass through.
const ROCK_RADIUS = 28;
const ROCK_PASS_TIME = 2;     // seconds you can walk through rocks after answering

// ---------- Voice (speech.js) ----------
const VOICE = {
  englishRate: 1,        // talking speed: 1 = normal, 0.8 = slower, 1.2 = faster
  hebrewRate: 0.85,      // Hebrew a little slower, so it's easier to learn
  gapBetweenLines: 0.25, // seconds of quiet between one word and the next
  silentLineTime: 1.3,   // with the voice off, how long each word stays on the top card
  cardLingerTime: 1.5,   // seconds the top card stays up after the last word
};

// ---------- Flashcard review (progress.js) ----------
// How long a word waits before coming back, by how many times IN A ROW you've
// got it right. Level 0 = new or just missed. A word comes back when ANY of its
// limits is reached (whichever comes first).
//   questions = after this many more questions
//   minutes / days = after this much time
//   sessions = after this many more playing sessions
const REVIEW_STEPS = [
  { questions: 2 },             // level 0: just missed it → very soon
  { questions: 3 },             // level 1: right once
  { questions: 8 },             // level 2: right twice in a row
  { minutes: 10 },              // level 3: right 3 times in a row → a few minutes
  { days: 1, sessions: 1 },     // level 4: next playing session or tomorrow
  { days: 3, sessions: 3 },     // level 5
  { days: 7, sessions: 5 },     // level 6
  { days: 21, sessions: 10 },   // level 7: you really know it
];
// Opening the game counts as a new "playing session" only if this many hours
// have passed since the last one started.
const SESSION_GAP_HOURS = 1;

// ---------- Auto level (progress.js) ----------
// When the host picks "Auto", each player gets their own level.
//   1) Finding your level: start at level 1 and jump up a level after every few
//      fast right answers. Stop climbing once you slow down or miss a few.
//   2) After that: moving UP is judged by your last few answers (quick to climb).
//      Moving DOWN is judged by more answers, and only after you've had time at
//      the level, so a missed word can come back and you can get it right.
// Your level is remembered for next time.
const AUTO_LEVEL = {
  fastSeconds: 4,       // answering right within this many seconds counts as "fast"
  // 1) Finding your level
  jumpAfter: 3,         // this many fast right answers in a row → jump up a level
  settleAfter: 3,       // this many slow or wrong answers at one level → that's your level
  // 2) After that: going UP
  upLookBack: 5,        // judge by your last 5 answers at this level
  upIfRight: 0.8,       // move up if at least 80% were right (4 of 5)...
  upIfFast: 0.4,        // ...and at least 40% were fast (2 of 5)
  // 2) After that: going DOWN
  downLookBack: 10,     // never move down before 10 answers at this level; then judge the last 10
  downIfRight: 0.4,     // move down if less than 40% were right (3 or fewer of 10)
};

// ---------- Teacher decks ("My decks", decks.js) ----------
const DECK_LIMITS = {
  minWords: 4,          // a question shows 4 answers, so a deck needs at least 4 words
  maxWords: 200,        // the host sends the whole deck to every phone, so keep it reasonable
  maxTextLength: 120,   // longest English or Hebrew part of one line (in letters)
  maxWrong: 5,          // most wrong answers a teacher can add to one word (a question shows 3 of them, picked at random)
  maxNameLength: 80,    // longest deck name (the database allows up to 80)
};

// ---------- Auto-translate in the deck editor (decks.js) ----------
// MyMemory is a free translation service: no account, no key. Its free limit is about
// 5,000 letters a day per computer, plenty for typing decks.
const TRANSLATE = {
  url: "https://api.mymemory.translated.net/get",
  timeoutMs: 8000,      // give up on one word after 8 seconds
  maxPerPaste: 60,      // after pasting a big list, translate at most this many empty English boxes
};

// ---------- Version ----------
// Shown small on the home screen, so you can check that a phone has the NEWEST copy of
// the game (phones keep old copies for a while). Change it with every upload, together
// with the ?v=… after each script and style.css in index.html.
const GAME_VERSION = "2026-11-10f";

// ---------- Helpers ----------

// Something broke? Show a small message saying what (at most 3 different ones), so a
// screenshot tells us what to fix. Also catches any error the game didn't expect.
const problemsShown = new Set();
function reportProblem(error, where = "") {
  const text = String((error && error.message) || error).slice(0, 120) + (where ? ` @ ${where}` : "");
  console.error(error);
  if (problemsShown.has(text) || problemsShown.size >= 3) return;
  problemsShown.add(text);
  // showToast lives in game.js. Wait a moment in case it isn't ready yet.
  setTimeout(() => {
    if (typeof showToast === "function") showToast(`⚠️ Problem: ${text} (v ${GAME_VERSION})`, "מַשֶּׁהוּ הִשְׁתַּבֵּשׁ");
  }, 500);
}
window.addEventListener("error", (event) => {
  const file = String(event.filename || "").split("/").pop().split("?")[0];
  reportProblem(event.error || event.message, file ? `${file}:${event.lineno}` : "");
});

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function otherTeam(team) {
  return team === "blue" ? "red" : "blue";
}

// Where a player appears: inside their base, spread out a little so
// teammates don't all stand on top of each other.
function spawnPoint(team) {
  const base = MAP.bases[team];
  return {
    x: base.x + (team === "blue" ? 70 : -70) + (Math.random() - 0.5) * 60,
    y: base.y + 40 + (Math.random() - 0.5) * 100,
  };
}

// Is this player standing close to their own team's shopkeeper?
function nearShop(p, extraReach = 0) {
  const shop = MAP.bases[p.team].shop;
  return Math.hypot(p.x - shop.x, p.y - (shop.y + 40)) < 110 + extraReach;
}

// Put Hebrew on top (bigger) and English underneath (smaller), inside any box on the page.
// (Hebrew first, so players read the Hebrew before they reach for the English.)
//     setBilingual(someElement, "Shop", "חנות");
// Uses textContent (never innerHTML), so player names can't break the page.
// If the box already shows these exact words, it does nothing (cheap to call every frame).
function setBilingual(element, english, hebrew) {
  const key = english + "|" + (hebrew || "");
  if (element.dataset.bi === key) return;
  element.dataset.bi = key;
  element.textContent = "";
  if (hebrew) {
    const he = document.createElement("span");
    he.className = "he";
    he.lang = "he";
    he.dir = "rtl";      // Hebrew reads right-to-left
    he.textContent = hebrew;
    element.appendChild(he);
  }
  const en = document.createElement("span");
  en.className = "en";
  en.textContent = english;
  element.appendChild(en);
}

// Keep a position inside the map.
function clampToMap(p) {
  p.x = Math.min(Math.max(p.x, PLAYER_RADIUS), MAP.width - PLAYER_RADIUS);
  p.y = Math.min(Math.max(p.y, PLAYER_RADIUS), MAP.height - PLAYER_RADIUS);
}

// Show the version on the home screen.
(function showVersion() {
  const tag = document.getElementById("version-tag");
  if (tag) tag.textContent = "v " + GAME_VERSION;
})();
