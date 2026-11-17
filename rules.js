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
// ---------- Tapping the map in Capture the Flag (ctf-game.js) ----------
// Tap an enemy while holding a hand weapon = hit. Tap anywhere while holding something to
// throw = throw it that way (tap an enemy = throw it at them). Drag starting ON your own
// player = a joystick centered on the player.
const TOUCH = {
  tapMove: 14,   // a finger that moved more than this many screen pixels was a drag, not a tap
  tapTime: 400,  // …and one that stayed down longer than this many milliseconds was a hold, not a tap
  grab: 48,      // a touch this close to the middle of my player (screen pixels) starts the joystick on the player
  target: 34,    // a tap this close to an enemy's edge (map units) counts as tapping that enemy
};

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
  // 1) Finding your level (new players). Big jumps, then halfway steps, like guessing a number:
  //    pass a level → jump up bigJump levels (until something is too hard);
  //    after that, try halfway between the highest level passed and the lowest one failed,
  //    until they're next to each other: the highest one passed is your level.
  //    (Only the main "A" levels; B levels and checkpoints are skipped.) Daniel 2026-11-17: the old
  //    one-level-at-a-time climb was far too slow for new players.
  placePass: 3,         // RIGHT answers minus wrong ones at a level reaches this = passed it (so 3 right in a row, or 4 right + 1 wrong…)
  placeFail: 2,         // WRONG answers minus right ones reaches this = too hard. (Counting the difference, not just wrong answers,
                        // means one unlucky slip or one lucky guess hardly ever sends a player to the wrong level.)
  bigJump: 10,          // levels to jump up after passing one, until a level is too hard
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

// ---------- Mt Hermon Racing (the sled race: race-*.js) ----------
// Distances are in "track units". The path is a long row of short pieces called
// segments (race-track.js), each RACE.segmentLength long.
const RACE = {
  // The path: one long ride from the top of Mt Hermon down to the Kinneret (race-track.js).
  countdown: 10,          // seconds of 10… 9… 8… before the sleds can go (was 3: time to turn the phone and read the steering tips)
  segmentLength: 200,     // how long one piece of the path is
  roadWidth: 2000,        // the measuring stick for widths: the widths below are in these
  pathWidth: 1.05,        // half the width of the normal path (most of the way)
  narrowWidth: 0.5,       // half the width in the few narrow places
  wideWidth: 1.8,         // half the width in the very wide places
  fieldWidth: 4.2,        // half the width of the big open snowfields (the start is one): lots of room to pick your own way down
  fieldTrees: 0.55,       // how many trees and rocks are scattered over a snowfield (0 = none, 1 = lots)
  hills: 1,               // how big the hills and dips are (0 = none, 1 = normal, 2 = huge)
  gateWidth: 1.7,         // half the width of the path at an answer gate
  startWidth: 1.2,        // half the width at the start and the finish
  shoulder: 1.0,          // (the old flat drawing only) how far off the path a sled can go
  shoulderWide: 1.3,      // how wide the strip of ground beside the path is (road widths). Where another stretch of path is close, the two share the ground between them
  zigWidth: 0.95,         // half the width of the path on a zigzag
  zigGap: 17,             // how long the gap in the rocks along each leg of a zigzag is, in segments (the secret way down to the next leg)
  lanes: 3,               // lanes at the gates (one answer over each lane)
  maxSpeed: 3700,         // top speed on a normal slope (track units per second). Was 10000, then 6000, 5500, 4200
  accel: 1400,            // how fast you speed up on the path
  coast: 380,             // MOMENTUM: going faster than the slope here allows (after a steep bit, or a boost), you only lose this much speed each second, so you keep your speed for a while
  roamCoast: 1100,        // …and off the path (deep snow, running up a bank) you lose it this fast
  offTrackSpeed: 0.7,     // off the path, in the deeper snow, your top speed drops to 70% (was 30%)
  offTrackSlowdown: 2500, // how fast going off the path (or anything else) slows you down to your top speed
  // The slope: a sled goes faster where the path is steep, and slower where it is flat or goes uphill.
  // (Apart from this, a skid, and the boost at a gate, the speed stays the same: no surprise boosts.)
  slopeNormal: 0.13,      // on a slope like this (it drops 13 for every 100 forward) you go exactly `maxSpeed`
  slopeSpeed: 0.5,        // how much the slope matters (0 = not at all; 0.5 = a slope twice as steep is about 6% faster). Was 0.8
  slopeLimits: [0.8, 1.15], // …but never slower than 80% or faster than 115% because of the slope (was 70% to 130%)
  steerSpeed: 1.6,        // how fast you move left and right at top speed (when turned all the way)
  slowSteer: 0.35,        // even when you're barely moving, you steer at least this much of that (so you can get unstuck after a crash)
  turnRate: 1.8,          // steering TURNS the sled, and it keeps going that way until you steer back. This is how fast it turns (1.8 = from straight to turned all the way in about half a second). Was 1.5
  steerReturn: 0,         // 0 = the sled keeps its direction when you stop steering. Higher = it slowly straightens out by itself (try 0.5 if it feels too slippery)
  turnSpeed: 4,           // how quickly a BOT's sled swings round (higher = snappier)
  maxTurn: 0.45,          // how far the sled turns round when you steer (in radians: 0.45 is about 25 degrees). Was 0.6
  cameraTurn: 0.9,        // how much the view turns with the sled (0 = not at all, 1 = fully: the camera sits right behind the sled, wherever it points). Was 0.35
  cameraFollow: 6,        // how quickly the camera swings round behind the sled (higher = snappier, lower = lazier)
  treesOnPath: 0.5,       // how many trees and rocks stand right ON the path, to dodge (0 = none, 1 = lots)
  curvePush: 0,           // an extra sideways push in bends (was 0.1; `curveSteer` below does this job now)
  maxSide: 20,            // the farthest from the middle of the path any sled can be, in road widths (the referee checks this)
  // Roaming: off the path, anywhere on the mountain (race-game.js: roamUpdate)
  roamTurn: 1.15,         // how fast the sled turns round out there (radians per second: 1.15 is about a third of a full turn in 2 seconds)
  roamSkidTurn: 2.1,      // …and in a skid
  roamSlope: [0.5, 1.25], // out there the slope matters more: from 50% of your speed (struggling up a steep bank) to 125% (straight down one). Was 35% to 145%
  roamJoin: 1.0,          // back on the path, you are "riding the path" again once you point within this much of its direction (radians: 1.0 is about 57 degrees). Pointing more across it than that, you just cross it
  roamFar: 260,           // this far from any path (map units; a sled is 6 wide) the game puts you back on the path by itself
  // Steering feel: a bit like a kart racing game (race-game.js)
  curveSteer: 0.8,        // in a bend, the path turns away under the sled, so you have to steer round it. 0 = the sled follows bends by itself, 1 = fully real. (Was 0.5.) With this, a bend sharper than about 18 can only be taken in a skid
  grip: 5,                // how quickly the sled's sideways slide catches up with where it points. Lower = slides more, like ice; 20 = no sliding at all
  airSteer: 0.35,         // in the air you can only turn this much of normal
  skidCurve: 18,          // bends sharper than this need a skid (bots slow down in them, like a skidding player)
  // Tilted bends ("banked", like a bowl): the tilt holds the sled in, so you can zoom round.
  bankHelp: 0.8,          // a tilted bend throws the sled outward this much LESS (0.8 = 80% less)
  // Skidding: hold one of the two SKID BUTTONS in the bottom corners of the screen (left button = skid left,
  // right button = skid right; on a computer: Shift + an arrow key). The sled swings round much further and
  // faster, so it takes sharp bends, but it loses speed while it skids.
  skidTurn: 1.4,          // how far the sled can swing round in a skid (1 = as far as normal steering). Was 1.9: too tight
  skidTurnRate: 1.6,      // …and how much faster it swings round (was 2.2)
  skidSpeed: 0.9,         // top speed while skidding (0.9 = 90% of normal). Was 0.72: too slow
  skidBrake: 900,         // how fast a skid slows you down to that speed (was 2600)
  skidSlide: 0.7,         // in a skid the sled swings round a long way, but it only moves SIDEWAYS this much as fast as its nose says (0.7 = 70%). Lower = a skid holds a tight bend without diving off the inside of it
  skidGrip: 7,            // grip while skidding (see `grip`): higher = the skid bites sooner
  skidRecover: 3,         // after a skid, how fast the sled straightens back to a normal turn
  hintTime: 10,           // the "hold to turn, corner buttons to skid" words stay this many seconds after "Go!"
  // EASY MODE (for little kids): the sled follows the path by itself, and the two arrows change lanes
  // (left, middle, right). It is on by itself for players who are not logged in; the "Easy mode" button
  // in the race lobby turns it on or off (race-game.js: raceEasy).
  easyLane: 0.565,        // how far apart the lanes are (road widths; a sled is 0.3 wide). The lanes go right across the path: 3 on a normal stretch, more where it is wide. At a gate there are exactly 3: one for each answer
  easyGateAt: 110,        // this many segments before a gate, the arrows start picking one of its 3 answers
  easySecretAt: 55,       // a secret shortcut can be taken from this many segments before it: be in the lane at that edge of the path and press the arrow again (the arrow glows gold)
  easyLaneSpeed: 2.2,     // how fast the sled slides over to the next lane (road widths per second)
  easyRepeat: 0.3,        // hold an arrow: it changes lane again every this many seconds
  easySpeed: 0.92,        // top speed in easy mode (0.92 = 92%): a little slower, because it never has to skid or slow down for a bend
  easyLook: 45,           // how many segments ahead it looks for trees and rocks standing on the path, to go round them by itself
  cameraMotion: true,     // true = the camera looks the way the sled is really MOVING (like off the path); false = the way its nose points
  // Snow jumps (the ramps are placed in race-track.js)
  gravity: 2050,          // how fast a flying sled falls. Lower = longer, floatier jumps
  rampEvery: 90,          // about one snow ramp every this many segments (lower = more jumps)
  rampLength: 12,         // how long a ramp is, in segments
  rampHeight: 450,        // how high its top is (a sled is 600 wide)
  rampWidth: 0.42,        // half the width of a small ramp (some ramps go right across the path)
  lakeRampLength: 16,     // the big wooden ramp at the end, into the Kinneret
  lakeRampHeight: 700,
  waterDrag: 9000,        // how fast the lake stops a sled
  afterFinish: 4.5,       // seconds after the last player finishes before the results show (time for the splash!)
  // Alternate paths: the path splits in two around an island of rocks and trees, then joins up again
  forkWidth: 2.8,        // half the width of the whole split (both ways + the island)
  forkIsland: 1.1,        // half the width of the island in the middle
  faceWidth: 3.4,         // the mountain face: half the width of the big curve + the island + the shortcut together
  faceIsland: 0.9,        // …half the width of the island between them
  faceSpeed: 1.2,         // …and on the shortcut your top speed is this much higher (1.2 = 120%): it is steeper
  // Secret shortcuts: a narrow way hidden behind a row of trees along one edge of the path, with rocks in it to skid round
  secretWidth: 2.5,       // half the width of the path where there is a secret shortcut (the main path + the row of trees + the secret way)
  secretAt: 1.0,          // …the row of trees is this far from the middle of the path…
  secretIsland: 0.5,      // …and this is half its width (so the secret way is 2.5 - 1.5 = 1 wide; a sled is 0.3)
  secretSpeed: 1.5,       // on a secret shortcut your top speed is this much higher (1.5 = 150%)
  secretRocks: 30,        // a rock every this many segments inside it, on one side and then the other (lower = closer together = harder)
  hillRampLength: 30,     // in the hills, one way round goes up a hill and jumps off: how long that slope is (segments)…
  hillRampHeight: 1000,   // …and how high its top is
  // Gifts: a RIGHT answer at a gate also puts a gift in your hands: a banana peel (dropped behind you), a mango
  // (thrown ahead; it steers itself toward the sled in front), a rimon, a pomegranate grenade (thrown ahead OR
  // dropped behind), or GAS (a thick cloud pours out behind you: the sleds close behind can hardly see).
  giftsInFront: { banana: 0.3, gas: 0.3, rimon: 0.2, mango: 0.05, anona: 0.15, orange: 0.15 }, // what you get when you are in first place (nobody ahead to throw at)…
  giftsBehind: { banana: 0.1, gas: 0.1, rimon: 0.25, mango: 0.3, anona: 0.25, orange: 0.2 }, // …and when somebody is ahead of you
  anonaSpeed: 1.45,       // an ANONA (a cherimoya: sweet and full of energy) is a speed boost: top speed goes up to 145%…
  anonaTime: 3.5,         // …for this many seconds
  orangeSpeed: 2,         // an ORANGE is a very fast, very short burst: top speed doubles (2 = 200%)…
  orangeTime: 1.4,        // …for only this many seconds…
  orangeKick: 6,          // …and the sled gets up to that speed this many times faster than normal (it kicks in at once)
  orangeFade: 3000,       // when the orange runs out, the extra speed is lost this fast (much faster than normal momentum, so the burst stays short)
  gasTime: 6,             // the gas pours out for this many seconds…
  gasReach: 7000,         // …and blinds sleds up to this far behind you (the closer, the thicker)
  gasThick: 0.9,          // how much of the view the thickest gas hides (1 = everything)
  gasBotSpeed: 0.85,      // a bot in the gas slows down to this much (it can't see either)
  mangoSee: 9000,         // a flying mango steers itself toward the nearest sled up to this far ahead of it…
  mangoHome: 1.6,         // …this fast (road widths per second)
  rimonSpeed: 2400,       // a thrown rimon flies this much faster than the sled that threw it…
  rimonRange: 13000,      // …and lands this far down the path, where it blows up
  rimonArc: 900,          // how high it flies on the way
  rimonBlast: 0.9,        // the explosion reaches this far sideways (in road widths; a banana peel only reaches 0.3)…
  rimonBlastLong: 1700,   // …and this far up and down the path
  rimonTrigger: 0.45,     // a DROPPED rimon waits on the path and blows up when a sled comes this close sideways…
  rimonLife: 25,          // …or by itself after this many seconds
  spinTime: 1.0,          // hit by a banana peel, a mango or a rimon: you spin round for this many seconds…
  spinSpeed: 0.35,        // …and drop to this much of your speed
  itemSafeTime: 2.5,      // after being hit, nothing can hit you again for this many seconds
  mangoSpeed: 3000,       // a thrown mango flies this much faster than the sled that threw it
  mangoRange: 18000,      // …and this far before it lands and splats
  bananaLife: 60,         // a banana peel that nobody hits melts away after this many seconds
  // Running into things. SOFT things (a bush, a snowman): you plough through in a spray of snow, but slower.
  // HARD things (a tree, a rock, a cabin): CLACK! You keep a little of your speed and get knocked round, away from it.
  softHitSpeed: 0.55,     // a bush or a snowman: you keep this much of your speed (0.55 = 55%)
  hardHitSpeed: 0.3,      // a tree (or a cabin): you keep this much of your speed…
  rockHitSpeed: 0.1,      // a ROCK: you keep only this much (rocks nearly stop you)…
  hardHitTurn: 1.5,       // …and the sled is knocked round this far, away from it (1 = as far as normal steering turns it)
  spinHitFrom: 0.75,      // hit a tree or a rock going faster than this much of top speed (0.75 = 75%) and you SPIN OUT. Slower than that, you are only knocked aside: the slower, the less
  crashShove: 1.1,        // …and shoved sideways, away from it, this fast (road widths per second)…
  crashShoveTime: 0.45,   // …for this many seconds, so you slide round it
  sledLength: 900,        // how long a sled is (its nose is this far ahead of its back)
  // Boulders: huge pale rocks out on the mountainside, off the path. Run into one and you have to answer a question to get going again (then you hop over it).
  boulders: 3,            // how many are tried in each big square of mountainside; about 1 in 3 finds a good spot (0 = none)
  boulderSize: [2.2, 3.8], // how big they are, compared with a normal rock
  boulderHop: 19,         // how hard a right answer throws you up and over it
  // Mountain goats wander about on the path. Bump one and it is knocked flying (it comes back later), and you are slowed down.
  goatWide: 560,          // how big a goat is to bump into (a sled is 600 wide)
  goatTall: 700,          // a sled flying higher than this goes right over it
  goatHitSpeed: 0.5,      // bumping a goat: you keep this much of your speed
  goatAway: 12,           // a goat that was bumped stays away this many seconds, then wanders back
  sledBumps: false,       // false = sleds never bump: they overlap and cross through each other from any direction (Daniel, 2026-11-17: "for now"). true = the bump rules below
  bumpShove: 2.5,         // a sled that runs into the BACK of another slides out to the side this fast (road widths per second)
  bumpLine: 0.5,          // …and that only counts when it is nearly straight behind: their middles less than this much of a sled's width apart (0.5 = half a sled). Further to the side, sleds overlap and cross over freely
  bumpSlow: 0.4,          // a sled going slower than this much of top speed (it is spinning out, or it just hit something) can not be bumped: you go straight through it
  bumpBoost: 250,         // bumped from behind, the sled in front gets this little push forward
  waitAfterFirst: 25,     // after the first sled finishes, the others get this many seconds
  // Bots: computer sleds, so even one player has someone to race (the referee drives them: race-server.js)
  bots: 7,                // bots join until there are this many sleds (7 = one player gets 6 bots; 0 = no bots). Was 10, and 4 before that
  gridRow: 4,             // how many sleds stand side by side in one row at the start
  botNames: ["🤖 גַּל", "🤖 נֹעָה", "🤖 טַל", "🤖 שַׁי", "🤖 לִיאוֹר", "🤖 עֹמֶר", "🤖 יוּבַל", "🤖 אוֹר", "🤖 דָּנִי"],
  // (The bots go from very good to slow, in even steps, so there is one to race at every level. Before 2026-11-17 they were all between 0.86 and 1 and finished in a bunch.)
  botSkill: [1, 0.93, 0.89, 0.86, 0.82, 0.77, 0.97, 0.85, 0.73], // each bot's top speed (1 = as fast as a player who never slows down); better bots also spot trees sooner. (Only the first 6 are used with 7 sleds)
  botRight: [0.92, 0.82, 0.72, 0.62, 0.52, 0.42, 0.87, 0.67, 0.47], // how often each bot picks the right answer at a gate (0.92 = 92%). A wrong answer bounces it back, like a player
  botLead: [9, 6, 3.5, 1.5, 0, 0, 7, 2.5, 0], // how many seconds ahead of the best player each bot may get before it starts easing off. Different for each bot, so they do not all wait in a bunch just in front of a slow player
  botCatchUp: 3000,       // a bot this far ahead of the best player eases off a little; this far behind, it pushes harder
  botEase: [0.9, 0.82],   // …it eases off to 90% when it is that far ahead, and to 82% when it is three times that far ahead (so a bot in front never runs away with the race)
  botPush: 1.06,          // …and pushes to 106% when it is that far behind
  botShortcut: 0.6,       // how often the best bot takes the fast shortcut down the mountain face (the weaker bots less often)
  // Answer gates: an English word on a sign, a Hebrew answer over each lane. Drive through the right one!
  gateZone: 70,           // the straight, wide stretch around each gate (in segments)
  gateZoneShort: 95,      // …and where two or three gates stand in a row on one long straight: how far apart they are
  gateShowAt: 170,        // the question shows up when the gate is this many segments ahead
  // How tall a gate is, in 3D units (a sled with its rider is about 5 tall, the camera is camHeight above the sled).
  // Lowered on 2026-11-17: the Hebrew answers were so high up that you could not read them and watch the path at once.
  gateClear: 8.5,         // the bottom edge of the Hebrew answers is this high above the snow (was 17.2). The sleds ride under them
  gateAnswerTall: 6,      // how tall the row of Hebrew answers is (was 7.2)
  gateSignTall: 4.6,      // how tall the English sign on top is (was 5.5)
  // The question box at the top of the screen (the same question as on the gate, for when the gate is still far away)
  panelSee: 0.5,          // how dark the box behind it is: 0 = no box at all, 1 = solid (was 0.72). Lower = you see more of the mountain through it
  panelWide: 0.56,        // how much of the screen's width it may take (it is one thin row now: the English word, then the 3 answers)
  boostSpeed: 1.25,       // right answer: top speed goes up to 125%… (was 145%)
  boostTime: 2,           // …for this many seconds
  gateBounce: 7000,       // wrong answer (or missing the gate): the gate bounces you BACK this far up the path, to try again…
  gateBounceTime: 0.9,    // …and the bounce takes this many seconds. (You start again from a standstill, until you get it right.)
  soundReach: 9000,       // you only hear a rimon blow up if it is this close to you (quieter the further away)
  feedbackTime: 2.5,      // seconds "Correct!" or "The answer is…" stays on the screen
  // Real 3D (race-3d.js)
  threeD: true,           // draw the race in real 3D (false = the old flat drawing; phones that can't do 3D use that anyway)
  nearView: 300,          // every piece of path this close to you is drawn too, wherever it is along the path (the stretch above or below you on a zigzag, a bridge overhead)
  viewDistance: 900,      // how far you can see before the mist, in 3D units (a sled is 6 wide). Lower = faster on old phones
  sharpness: 2,           // the most screen dots drawn per "pixel" (phones have 2 or 3; 3 looks a bit sharper but is slower)
  bend3d: 0.6,            // how sharp the bends are in the 3D world (higher = tighter bends)
  bankTilt: 0.28,         // how much a tilted bend leans (0.28 = its outside edge is about 6 higher than its middle)
  camBack: 16,            // the camera sits this far behind my sled (3D units; a sled is 6 wide). Was 13.5
  camHeight: 13,          // …and this high above it. Higher = looking down more from above. Was 6.6
  camAhead: 2600,         // it looks at the path this far ahead of my sled (track units). Was 1900
  camFov: 62,             // how wide the lens is, in degrees (an upright phone gets a wider one by itself). Was 58
  // Screen (the old flat drawing)
  cameraHeight: 1700,     // how high the camera floats above the path (higher = more from above)
  fieldOfView: 100,       // how wide the camera sees (degrees)
  horizon: 0.3,           // where the horizon is on the screen (0 = top, 0.5 = middle)
  drawDistance: 320,      // how many segments ahead get drawn (fewer = faster on old phones)
  sendEvery: 100,         // milliseconds between "here's where my sled is" messages
  colors: ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#ec4899", "#14b8a6", "#f97316", "#84cc16", "#0ea5e9"], // one per sled
};

// ---------- Bots in Capture the Flag (ctf-bots.js) ----------
// Computer players, so a game with only a few people is still a real game. They join when
// the game starts and leave when it ends. The referee (the host's phone) drives them.
// A bot can't answer questions, so wherever a player would answer one (to buy something, to
// grab a flag, to thaw out after a rock) the bot WAITS about as long as an answer takes.
const CTF_BOTS = {
  fewerThan: 4,          // bots join when a game starts with fewer than this many players…
  players: 6,            // …until there are this many in all, half on each team (6 = 3 against 3). If one team already has more people than that, the other team is filled up to match (up to 8 in all). 0 = no bots
  names: ["🤖 אוּרִי", "🤖 מַיָּה", "🤖 אִיתַי", "🤖 שִׁירָה", "🤖 נָדָב", "🤖 תָּמָר", "🤖 רוֹנִי", "🤖 עִדּוֹ"],
  speed: [0.96, 0.9, 0.94, 0.99, 0.88, 0.92, 0.96, 0.86], // each bot's walking speed (1 = as fast as a player). (Raised 2026-11-17: Daniel wanted the bots a little better)
  answerTime: [1.2, 2.5],  // a bot "answers a question" in this many seconds (between the two numbers)
  shopChance: 0.65,       // how often an ATTACKER goes to the shop first when it comes (back) to life (a guard always does). Otherwise it sets off with empty hands
  // What a bot buys: one of these lists, picked by its chance (the first number). It buys the things in
  // order, waiting each item's cost in answers. It holds whichever thing suits the moment (ctfBotChoose in ctf-bots.js).
  shopping: {
    attack: [
      [3, ["stick"]], [3, ["hammer"]], [2, ["rock", "stick"]], [2, ["stars"]],
      [2, ["spear", "stick"]], [1, ["boots", "stick"]], [1, ["grenade", "stick"]],
    ],
    defend: [
      [2, ["hammer"]], [2, ["rock", "stick"]], [2, ["spear", "stick"]], [2, ["grenade", "stick"]],
      [1, ["tree", "stick"]], [1, ["stars"]],
    ],
  },
  see: 300,              // an attacking bot with a weapon turns aside for an enemy carrying a flag who comes this close…
  fight: 0,              // …or for ANY enemy this close (if it has a hand weapon or a spear, and no flag). 0 = never (more than about 90 and games turn into brawls: hardly any flags get home)
  guard: 380,            // …and a bot guarding its base goes after any enemy this close to the base
  swingWait: [0.2, 0.6], // after a swing or a throw it waits its weapon's own pause plus this much (so it is beatable)
  throwError: 0.1,       // how badly it aims a throw (radians: 0.1 is about 6 degrees to either side). It aims where the enemy is GOING
  spearAt: 240,          // with a spear: it points it at an enemy this close and runs straight at them
  boxAt: 260,            // an attacker with a hand weapon passing this close to the speed box smashes it for the boost
  trapEvery: 15,         // a guard with grenades leaves one in front of its base this often (seconds), up to 2 at a time
  treeOut: 170,          // a guard with a tree plants it about this far out from its base, toward the middle
};

// ---------- Mastery points and looks (looks.js) ----------
// MASTERY POINTS: every time one of your words climbs to a flashcard level it has never
// reached before, you get 1 point (progress.js: masteryPoints). So points come from really
// learning words, not from playing the same easy ones over and over, and they never go down.
// LOOKS: whole OUTFITS for your player, in Capture the Flag AND on your sled: clothes from
// head to toe, not just a hat. Each one opens up when you have `cost` points (you don't
// spend the points). Only for logged-in players.
//   cloth + dark = the two main colors of the clothes (both games use them)
// To add a look: a line here + how it is drawn (ctf-draw.js: drawLook, race-3d.js: riderOutfit and riderLook).
// (No outfit is mostly blue or red: in Capture the Flag those are the team colors.)
const LOOKS = [
  { id: "none",     cost: 0,   icon: "🙂", en: "Just me",    he: "רַק אֲנִי" },
  { id: "tembel",   cost: 25,  icon: "👒", en: "Kibbutznik", he: "קִבּוּצְנִיק", cloth: "#c2ae7c", dark: "#8f7d51" },
  { id: "shades",   cost: 60,  icon: "🕶️", en: "Cool kid",   he: "מַגְנִיב",     cloth: "#2f343c", dark: "#14161a" },
  { id: "cowboy",   cost: 120, icon: "🤠", en: "Cowboy",     he: "בּוֹקֵר",      cloth: "#7a4a22", dark: "#4f2f14" },
  { id: "headband", cost: 200, icon: "🥷", en: "Ninja",      he: "נִינְגָ'ה",    cloth: "#262a31", dark: "#0d0f13" },
  { id: "wizard",   cost: 320, icon: "🧙", en: "Wizard",     he: "קוֹסֵם",       cloth: "#6d28d9", dark: "#4c1d95" },
  { id: "bandit",   cost: 450, icon: "🦹", en: "Bandit",     he: "שׁוֹדֵד",      cloth: "#6b5a3e", dark: "#3d3222" },
  { id: "crown",    cost: 600, icon: "👑", en: "King",       he: "מֶלֶךְ",       cloth: "#efe6cf", dark: "#b8a674" },
];
function findLook(id) {
  return LOOKS.find((look) => look.id === id) || null;
}

// ---------- Public games (game.js: playPublic, server.js) ----------
// "Play Game" drops you into a PUBLIC room for the game you pick: anyone can land in it.
// There is no list of rooms anywhere. Public rooms have fixed names ("PUBLIC-race-1",
// "PUBLIC-race-2"…): your phone tries to OPEN room 1; if somebody already has it open, it
// JOINS that one instead; if that one is full, it tries room 2, and so on.
// Nobody is in charge of a public room, so the game starts by itself, and (because players
// are strangers) nobody types a nickname: everyone gets a made-up animal name.
const PUBLIC = {
  rooms: 5,               // how many public rooms each game can have at once
  maxPlayers: 8,          // a room with this many players is full (the next player opens the next room)
  startDelay: 20,         // the game starts by itself this many seconds after there are enough players
  minPlayers: { ctf: 1, race: 1 }, // how many players are "enough" (1 = the timer starts as soon as someone is in the room; others can still join after the game has started)
  // Made-up names: a picture, a Hebrew animal and a number, like "🦊 שׁוּעָל 27".
  animals: [
    ["🦊", "שׁוּעָל"], ["🦅", "נֶשֶׁר"], ["🦌", "צְבִי"], ["🐐", "יָעֵל"], ["🐺", "זְאֵב"], ["🐻", "דֹּב"],
    ["🦁", "אַרְיֵה"], ["🐆", "נָמֵר"], ["🦉", "יַנְשׁוּף"], ["🐬", "דּוֹלְפִין"], ["🐢", "צָב"], ["🐇", "אַרְנָב"],
    ["🐎", "סוּס"], ["🐪", "גָּמָל"],
  ],
};

// ---------- Version ----------
// Shown small on the home screen, so you can check that a phone has the NEWEST copy of
// the game (phones keep old copies for a while). Change it with every upload, together
// with the ?v=… after each script and style.css in index.html.
const GAME_VERSION = "2026-11-17e";

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
