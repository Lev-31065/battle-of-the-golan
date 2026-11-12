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
    kind: "throw", cost: 1, perBuy: 1, damage: 0, range: 380, speed: 380, size: 10, cooldown: 0.5,
    freezes: true, goesThrough: false,
    icon: "🪨", name: "Rock", nameHe: "אֶבֶן",
    about: "Throw it: whoever it hits freezes until they answer a question",
    aboutHe: "זוֹרְקִים אוֹתָהּ: מִי שֶׁנִּפְגָּע קוֹפֵא עַד שֶׁהוּא עוֹנֶה עַל שְׁאֵלָה",
  },
  stick: {
    kind: "melee", cost: 2, damage: 8, range: 70, cooldown: 0.25,
    icon: "🏑", pic: "stick", name: "Stick", nameHe: "מַקֵּל",
    about: "Super fast, but weak", aboutHe: "מָהִיר מְאוֹד, אֲבָל חַלָּשׁ",
  },
  // kind "wear" = you wear it, you don't hold it. It works all the time and isn't in the toolbar.
  boots: {
    kind: "wear", cost: 3,
    icon: "🥾", name: "Forest boots", nameHe: "מַגְּפֵי יַעַר",
    about: "Walk through bushes at full speed", aboutHe: "הוֹלְכִים בְּתוֹךְ שִׂיחִים בִּמְהִירוּת מְלֵאָה",
  },
  // 34 damage × 3 hits = 102, so 3 hits knock out anything with 100 health.
  hammer: {
    kind: "melee", cost: 5, damage: 34, range: 85, cooldown: 0.6,
    icon: "🔨", name: "Hammer", nameHe: "פַּטִּישׁ",
    about: "Strong: hits every enemy close to you", aboutHe: "חָזָק: פּוֹגֵעַ בְּכָל אוֹיֵב קָרוֹב",
  },
  // kind "spear" = no button. It sticks out in front of you while you hold it;
  // touch an enemy with the TIP and they're knocked out. Listed late because it's hard to use.
  spear: {
    kind: "spear", cost: 4, oneUse: true, length: 95, side: 8, tipReach: 8, cooldown: 0.8,
    // length = how far the tip sticks out past your body. side = how far right of center it's held.
    // tipReach = how close the tip must get to an enemy.
    // cooldown = seconds after a stab before the spear can stab again.
    // oneUse = it breaks after one stab (an enemy or the speed box). Daniel: it was too strong.
    icon: "🔱", name: "Spear", nameHe: "חֲנִית",
    about: "No button: touch an enemy with the tip = knocked out! Breaks after one stab",
    aboutHe: "בְּלִי כַּפְתּוֹר: נוֹגְעִים בְּאוֹיֵב עִם הַחֹד = נוֹקְאָאוּט! נִשְׁבֶּרֶת אַחֲרֵי דְּקִירָה אַחַת",
  },
  // lands = true: it doesn't hit anyone while flying. It lands at the end of its range and
  // becomes a hidden trap (settings in POMEGRANATE below).
  grenade: {
    kind: "throw", cost: 3, perBuy: 2, damage: 0, range: 260, speed: 360, size: 11, cooldown: 0.6,
    freezes: false, goesThrough: true, lands: true,
    icon: "💣", pic: "pomegranate", name: "Pomegranate grenade", nameHe: "רִמּוֹן יָד",
    about: "You get 2. Throw one: it hides, and blows up when an enemy comes near (half their health)",
    aboutHe: "מְקַבְּלִים 2. זוֹרְקִים אֶחָד: הוּא מִתְחַבֵּא וּמִתְפּוֹצֵץ כְּשֶׁאוֹיֵב מִתְקָרֵב (חֲצִי מֵהַחַיִּים)",
  },
  // Same damage as the hammer, but thrown. Flies its full range, through everyone in its path.
  stars: {
    kind: "throw", cost: 3, perBuy: 5, damage: 34, range: 470, speed: 470, size: 12, cooldown: 0.35,
    freezes: false, goesThrough: true,
    icon: "⭐", name: "Ninja stars", nameHe: "כּוֹכְבֵי נִינְגָּ׳ה",
    about: "You get 5. Each one hits every enemy in its path",
    aboutHe: "מְקַבְּלִים 5. כָּל אֶחָד פּוֹגֵעַ בְּכָל אוֹיֵב בַּדֶּרֶךְ",
  },
  // kind "plant" = hold it, then press the Plant button to plant it in front of you.
  tree: {
    kind: "plant", cost: 8,
    icon: "🌳", name: "Pomegranate tree", nameHe: "עֵץ רִמּוֹנִים",
    about: "Plant it anywhere: it drops 4 hidden grenades over 2 minutes, then becomes a log",
    aboutHe: "שׁוֹתְלִים אוֹתוֹ אֵיפֹה שֶׁרוֹצִים: הוּא מַפִּיל 4 רִמּוֹנֵי יָד בְּמֶשֶׁךְ 2 דַּקּוֹת, וְאָז הוֹפֵךְ לְבוּל עֵץ",
  },
};

// ---------- Pomegranates (the grenade and the tree) ----------
const POMEGRANATE = {
  hideTime: 20,      // a grenade on the ground hides this many seconds; then it blows up by itself
  trigger: 45,       // an enemy whose body gets this close to it sets it off
  blast: 130,        // the seeds hit every enemy this close to the explosion
  damageShare: 0.5,  // …and take away this share of their FULL health (0.5 = half)
  treeLife: 120,     // seconds a tree lives. It drops its grenades evenly over this time, then becomes a log
  treeDrops: 4,      // how many grenades a tree drops
  dropMin: 70,       // a dropped grenade lands this far from the tree's middle…
  dropMax: 130,      // …up to this far
  plantAhead: 60,    // a tree gets planted this far in front of your body
  logLength: 150,    // the log it turns into
};

// Can you hold this item in your hand (= it gets a toolbar button)? Worn things like boots can't.
function isHoldable(id) {
  return Boolean(ITEMS[id]) && ITEMS[id].kind !== "wear";
}

// Our own pictures for items that have no good emoji (an item's `pic` names one of these).
// SVG = a picture written as code, so it stays sharp at any size. The `icon` emoji is still
// used inside text messages.
const ITEM_PICS = {
  // A twig: a brown branch with a small side branch and two leaves.
  stick:
    '<svg viewBox="0 0 64 64" aria-hidden="true">' +
    '<g stroke-linecap="round" fill="none">' +
    '<path d="M12 54 L52 12" stroke="#3b2412" stroke-width="10"/>' +
    '<path d="M12 54 L52 12" stroke="#a0662b" stroke-width="6"/>' +
    '<path d="M34 31 L47 36" stroke="#3b2412" stroke-width="7"/>' +
    '<path d="M34 31 L47 36" stroke="#a0662b" stroke-width="3.5"/>' +
    '<path d="M20 46 L16 38" stroke="#3b2412" stroke-width="6"/>' +
    '<path d="M20 46 L16 38" stroke="#a0662b" stroke-width="3"/></g>' +
    '<path d="M47 36 q10 -6 12 4 q-9 6 -12 -4z" fill="#4ade80" stroke="#14532d" stroke-width="2"/>' +
    '<path d="M52 12 q2 -9 10 -6 q-2 9 -10 6z" fill="#4ade80" stroke="#14532d" stroke-width="2"/>' +
    '</svg>',
  // A pomegranate (רִמּוֹן) with its little crown, and a grenade's pull ring on the side.
  pomegranate:
    '<svg viewBox="0 0 64 64" aria-hidden="true">' +
    '<defs><radialGradient id="pomSkin" cx="0.38" cy="0.35" r="0.7">' +
    '<stop offset="0" stop-color="#fca5a5"/><stop offset="0.45" stop-color="#dc2626"/>' +
    '<stop offset="1" stop-color="#7f1d1d"/></radialGradient></defs>' +
    '<circle cx="50" cy="20" r="7" fill="none" stroke="#475569" stroke-width="3.5"/>' +
    '<path d="M44 24 L39 27" stroke="#475569" stroke-width="3.5" stroke-linecap="round"/>' +
    '<circle cx="30" cy="38" r="21" fill="url(#pomSkin)" stroke="#1f2937" stroke-width="2.5"/>' +
    '<path d="M21 20 L19 7 L26 14 L30 5 L34 14 L41 7 L39 20 Z" fill="#991b1b" stroke="#1f2937" stroke-width="2.5" stroke-linejoin="round"/>' +
    '<ellipse cx="22" cy="30" rx="5" ry="3" fill="#fff" opacity="0.45" transform="rotate(-30 22 30)"/>' +
    '</svg>',
};

// Put an item's picture into a page element: our own drawing if it has one, otherwise its emoji.
// (It remembers which item it shows, so calling it every frame costs nothing.)
function setItemIcon(element, id) {
  const item = ITEMS[id];
  const key = id || "";
  if (element.dataset.icon === key) return;
  element.dataset.icon = key;
  if (item && item.pic && ITEM_PICS[item.pic]) {
    element.innerHTML = ITEM_PICS[item.pic]; // (our own fixed drawing, never player text)
    element.classList.add("pic-icon");
  } else {
    element.textContent = item ? item.icon : "✋";
    element.classList.remove("pic-icon");
  }
}

// The Throw button: dragging less than this (screen pixels) = throw the way you're facing.
const AIM_DEADZONE = 15;

// ---------- B levels and review checkpoints (words.js) ----------
// A B level = its own hand-written sentences (levels-b.js) + this many random extras:
const REVIEW_MIX = {
  fromThisLevel: 5,  // words from the level's A part
  fromEarlier: 5,    // words from earlier levels
};
// A review checkpoint asks about this many questions, spread evenly over every level before it.
const CHECKPOINT_QUESTIONS = 30;

// ---------- Messages at the bottom of the screen ----------
const MESSAGES = {
  time: 6,           // seconds each message stays (was about 3; Daniel: "make sure they appear for a while")
  max: 3,            // at most this many at once; a 4th pushes out the oldest
  rotateTipTime: 10, // seconds the big "turn your phone sideways" card stays (a tap closes it sooner)
};

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
  // Hiding inside = safe from everything except pomegranates. From inside you can only
  // attack out through the open ends. Throwing from inside: aim within this many degrees
  // of straight along the log, or it would hit the log's wall.
  throwAngle: 20,
};

// Throwing from inside a log: is `angle` (radians) close enough to straight out of one end?
function throwFitsLog(log, angle) {
  return Math.abs(Math.cos(angle - log.angle)) >= Math.cos(LOG.throwAngle * Math.PI / 180);
}

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
const GAME_VERSION = "2026-11-12g";

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
