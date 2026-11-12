// ctf-game.js — CAPTURE THE FLAG on every phone.
//
// The shared phone code (game.js) handles screens, the lobby, the joystick, messages
// and the game loop. This file is everything special to Capture the Flag: the shop,
// the toolbar, weapons, throwing, flags, rocks, logs, berries, moving your player,
// the HUD, and drawing the map (with the pictures in ctf-draw.js).
// The questions game.js asks are at the bottom: PHONE_GAMES.ctf.

// ---------- What this phone knows about the game (filled in from the referee's snapshots) ----------

let flags = null;
let score = { blue: 0, red: 0 };
let speedBox = null;
let berries = null;   // which bushes have ripe berries (true/false for each bush), or null = all ripe
const effects = [];   // shockwave rings and floating numbers
let shots = [];       // thrown rocks and ninja stars flying right now (from the referee)
let mines = [];       // pomegranate grenades hiding on the ground (only my team's get drawn)
let trees = [];       // planted pomegranate trees (state "tree", or "log" once they've turned into one)

// Trees that turned into logs become real hollow logs: they're added to the end of MAP.logs,
// so you can hide in them just like the map's own logs. The map's own logs always come first.
const MAP_LOG_COUNT = MAP.logs.length;
const treeLogs = new Map(); // tree id → its log (the same object every time, so hiding inside keeps working)
function syncTreeLogs() {
  const logIds = trees.filter((t) => t.state === "log").map((t) => t.id).sort((a, b) => a - b);
  const now = MAP.logs.slice(MAP_LOG_COUNT).map((log) => log.treeId);
  if (logIds.join(",") === now.join(",")) return; // nothing changed
  MAP.logs.length = MAP_LOG_COUNT; // take the old tree logs off…
  for (const id of logIds) {        // …and put the current ones back, in id order (the same on every phone)
    if (!treeLogs.has(id)) {
      const t = trees.find((tree) => tree.id === id);
      treeLogs.set(id, { treeId: id, x: t.x, y: t.y, length: POMEGRANATE.logLength, angle: t.angle, dirX: Math.cos(t.angle), dirY: Math.sin(t.angle) });
    }
    MAP.logs.push(treeLogs.get(id));
  }
  if (myLog && !MAP.logs.includes(myLog)) myLog = null; // (a new game cleared the log I was in)
}

let rockPassUntil = 0; // until this time, I can walk through rocks (after answering a rock question)
let myLog = null;      // the log I'm hiding inside right now (null = not hiding)
// Which log I'm in, as a number: 1, 2, 3… (its place in MAP.logs, plus 1), or 0 = not hiding.
// Phones send this number, so players hiding in the SAME log can see each other.
function myLogNumber() {
  return myLog ? MAP.logs.indexOf(myLog) + 1 : 0;
}
const berryAskedAt = new Map(); // bush number → when I last asked the referee to eat its berries
let hurtAt = -Infinity; // when I last took damage (for the screen shake and red flash)

// Can I move right now? Not while a popup is open, and not while knocked out.
function isBusy() {
  const p = myPlayer();
  return quiz.open || !shopEl.hidden || !leaveEl.hidden || client.phase !== "playing" || !p || !p.alive;
}

// ---------- The shop ----------

// Every item costs some questions (ITEMS in rules.js). Only RIGHT answers count.
// shopPaid remembers how many you've answered right so far for each item, so if you
// close the question halfway you don't lose your progress. It's cleared when a new
// game starts and when you're knocked out.
const shopEl = document.getElementById("shop");
const shopButton = document.getElementById("shop-button");
const shopItemsEl = document.getElementById("shop-items");
let shopPaid = {};

// "1 question" / "5 questions" (Hebrew too).
function questionsText(n) {
  return n === 1 ? ["1 question", "שְׁאֵלָה אַחַת"] : [`${n} questions`, `${n} שְׁאֵלוֹת`];
}

// Build the shop's list: one button per item, in the order they're listed in ITEMS.
function fillShop(p) {
  shopItemsEl.textContent = "";
  for (const [id, item] of Object.entries(ITEMS)) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "shop-item";
    // Hand weapons: once you own one, its button is grayed out. Thrown things can always be bought again.
    const owned = item.kind !== "throw" && (p.items || []).includes(id);
    button.disabled = owned;

    const icon = document.createElement("span");
    icon.className = "shop-icon";
    setItemIcon(icon, id); // (our own drawing, or the emoji)
    const text = document.createElement("span");
    text.className = "shop-text";
    const name = document.createElement("b");
    setBilingual(name, item.name, item.nameHe);
    const about = document.createElement("small");
    setBilingual(about, item.about, item.aboutHe);
    text.append(name, about);
    const price = document.createElement("span");
    price.className = "shop-price";
    const paid = shopPaid[id] || 0;
    if (owned) setBilingual(price, "Owned ✓", "כְּבָר יֵשׁ");
    else if (paid > 0) setBilingual(price, `${paid} of ${item.cost} ✓`, `${paid} מִתּוֹךְ ${item.cost}`);
    else setBilingual(price, ...questionsText(item.cost));

    button.append(icon, text, price);
    button.addEventListener("click", () => startBuying(id));
    shopItemsEl.appendChild(button);
  }
}

function tryOpenShop() {
  const p = myPlayer();
  if (!p || isBusy() || !nearShop(p)) return;
  resetStick(); // shopping means standing still
  fillShop(p);
  shopEl.hidden = false;
}

onPress(shopButton, tryOpenShop);
document.getElementById("shop-close").addEventListener("click", () => { shopEl.hidden = true; });

// Ask the next question for this item. Each right answer pays one question;
// a wrong answer just shows the right one and then asks another (quiz.js does that).
function startBuying(id) {
  const p = myPlayer();
  const item = ITEMS[id];
  if (!p || !item || (item.kind !== "throw" && (p.items || []).includes(id))) return;
  shopEl.hidden = true;
  const questionNumber = (shopPaid[id] || 0) + 1;
  openQuiz({
    title: `${item.icon} ${item.name}: question ${questionNumber} of ${item.cost}`,
    titleHe: `${item.nameHe}: שְׁאֵלָה ${questionNumber} מִתּוֹךְ ${item.cost}`,
    onCorrect: () => {
      shopPaid[id] = questionNumber;
      if (questionNumber < item.cost) {
        startBuying(id); // not paid off yet: straight on to the next question
        return;
      }
      delete shopPaid[id];
      sendToServer({ type: "buy", item: id });
      if (item.kind === "wear") {
        // Boots: you wear them, so they're not in your hand or your toolbar.
        const p = myPlayer();
        if (p && !(p.items || []).includes(id)) p.items = [...(p.items || []), id]; // (works now, before the referee's reply)
        showToast(`${item.icon} You put on the ${item.name}! Bushes don't slow you down now.`, `נָעַלְתֶּם ${item.nameHe}! הַשִּׂיחִים כְּבָר לֹא מְאַטִּים אֶתְכֶם.`);
        return;
      }
      holdItem(id); // hold it straight away (the referee does the same)
      if (item.kind === "plant") {
        showToast(`${item.icon} You got a Pomegranate tree! Walk to a good spot and press Plant.`, `יֵשׁ עֵץ רִמּוֹנִים! הוֹלְכִים לְמָקוֹם טוֹב וְלוֹחֲצִים "לִשְׁתֹּל".`);
      } else if (item.kind === "spear") {
        showToast(`${item.icon} You got the Spear! Touch an enemy with the tip to knock them out.`, `יֵשׁ חֲנִית! נוֹגְעִים בְּאוֹיֵב עִם הַחֹד כְּדֵי לְהַפִּיל אוֹתוֹ.`);
      } else if (item.kind === "throw") {
        showToast(`${item.icon} +${item.perBuy} ${item.name}! Drag from the Throw button to aim.`, `${item.nameHe} +${item.perBuy}! גּוֹרְרִים מִכַּפְתּוֹר הַזְּרִיקָה כְּדֵי לְכַוֵּן.`);
      } else {
        showToast(`${item.icon} You got the ${item.name}! It's in your toolbar.`, `יֵשׁ ${item.nameHe}! הוּא בְּסַרְגֵּל הַכֵּלִים.`);
      }
    },
  });
}

// ---------- The toolbar: pick what you're holding ----------
// The referee decides what you hold, but tapping should feel instant, so this phone
// remembers its own pick for a moment (until the referee has heard about it).

const toolbarEl = document.getElementById("toolbar");
let myHeld = null;           // what I picked on this phone
let myHeldAt = -Infinity;    // when (performance.now()), so a slightly old snapshot can't undo the tap
const HELD_TRUST_MS = 1000;

function holdItem(id) {
  myHeld = id;
  myHeldAt = performance.now();
  const p = myPlayer();
  if (p) p.held = id;
  sendToServer({ type: "hold", item: id });
}

// Rebuild the toolbar buttons only when what I own changes (cheap to call every frame).
function updateToolbar(p) {
  // Only things you can hold get a button (boots are worn, so they don't).
  const holdable = Object.keys(ITEMS).filter((id) => (p && p.items || []).includes(id) && isHoldable(id));
  const show = client.phase === "playing" && p && p.alive && holdable.length > 0;
  toolbarEl.hidden = !show;
  if (!show) return;
  const slots = [null, ...holdable]; // null = ✋ empty hands
  const ammo = p.ammo || {};
  const key = slots.map((id) => id + ":" + (ammo[id] || "")).join(","); // (counts too, so the badges update)
  if (toolbarEl.dataset.key !== key) {
    toolbarEl.dataset.key = key;
    toolbarEl.textContent = "";
    slots.forEach((id, i) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "tool-slot";
      button.dataset.item = id || "";
      const picture = document.createElement("span");
      picture.className = "tool-pic";
      setItemIcon(picture, id); // (null = ✋ empty hands)
      button.appendChild(picture);
      button.title = (id ? ITEMS[id].name : "Empty hands") + ` (${i + 1})`;
      // Thrown things: a little badge says how many are left.
      if (ammo[id]) {
        const count = document.createElement("small");
        count.className = "tool-count";
        count.textContent = ammo[id];
        button.appendChild(count);
      }
      onPress(button, () => holdItem(id));
      toolbarEl.appendChild(button);
    });
  }
  for (const button of toolbarEl.children) {
    button.classList.toggle("held", (button.dataset.item || null) === p.held);
  }
}

// ---------- Hand weapons (stick, hammer…) ----------

const attackButton = document.getElementById("attack-button");
const attackIcon = document.getElementById("attack-icon");
onPress(attackButton, swingWeapon);

// The hand weapon I'm holding (its settings from ITEMS), or null.
function heldWeapon(p) {
  const item = p && ITEMS[p.held];
  return item && item.kind === "melee" ? item : null;
}

// Holding a tree to plant? (Then the Hit button becomes a Plant button.)
function holdingTree(p) {
  return Boolean(p) && p.held === "tree" && (p.items || []).includes("tree");
}

function canAttack(p) {
  return Boolean(heldWeapon(p) || holdingTree(p)) && !isBusy() && !p.carrying;
}

function swingWeapon() {
  const p = myPlayer();
  if (!canAttack(p)) return;
  if (holdingTree(p)) {
    sendToServer({ type: "plant" }); // the referee checks the spot and plants it (or says why not)
    return;
  }
  if (gameTime - p.lastSwing < heldWeapon(p).cooldown) return; // still cooling down
  p.lastSwing = gameTime; // start the swing animation right away
  sendToServer({ type: "swing" });
}

// ---------- Throwing (rocks, ninja stars) ----------
// While you hold something to throw, the Hit button becomes a Throw button that works
// like a joystick: put your thumb on it, drag the way you want to throw (a dashed line
// shows where it will fly), and let go. A quick tap throws the way you're facing.
// The referee flies it and decides what it hits.

const throwButton = document.getElementById("throw-button");
const throwIcon = document.getElementById("throw-icon");
const throwCount = document.getElementById("throw-count");
const AIM_MAX_DRAG = 34; // how far (screen pixels) the picture on the button follows your thumb

const aim = {
  active: false,    // true while a thumb is on the Throw button
  pointerId: null,  // which finger (so the joystick finger doesn't count)
  startX: 0, startY: 0,
  dx: 0, dy: 0,     // how far the thumb has dragged from where it started
};

// The thing to throw I'm holding (its settings from ITEMS), or null.
function heldThrowable(p) {
  const item = p && ITEMS[p.held];
  return item && item.kind === "throw" && (p.ammo || {})[p.held] > 0 ? item : null;
}

function canThrow(p) {
  return Boolean(heldThrowable(p)) && !isBusy() && !p.carrying;
}

// Which way the throw goes: where you dragged, or (a tiny drag) the way you're facing.
function aimAngle(p) {
  if (Math.hypot(aim.dx, aim.dy) < AIM_DEADZONE) return p.facing;
  return Math.atan2(aim.dy, aim.dx);
}

throwButton.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  if (aim.active || !canThrow(myPlayer())) return;
  throwButton.setPointerCapture(event.pointerId); // keep following this finger even off the button
  Object.assign(aim, { active: true, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, dx: 0, dy: 0 });
  throwButton.classList.add("aiming");
});

throwButton.addEventListener("pointermove", (event) => {
  if (!aim.active || event.pointerId !== aim.pointerId) return;
  aim.dx = event.clientX - aim.startX;
  aim.dy = event.clientY - aim.startY;
  // The picture slides after your thumb, but only a little way.
  const length = Math.hypot(aim.dx, aim.dy);
  const shown = Math.min(length, AIM_MAX_DRAG) / (length || 1);
  throwIcon.style.transform = `translate(${aim.dx * shown}px, ${aim.dy * shown}px)`;
});

throwButton.addEventListener("pointerup", (event) => {
  if (!aim.active || event.pointerId !== aim.pointerId) return;
  const p = myPlayer();
  const angle = p ? aimAngle(p) : 0;
  cancelAim();
  throwNow(angle);
});
throwButton.addEventListener("pointercancel", cancelAim);

// Stop aiming without throwing (also used when a popup opens or the game ends).
function cancelAim() {
  aim.active = false;
  aim.pointerId = null;
  aim.dx = 0;
  aim.dy = 0;
  throwIcon.style.transform = "";
  throwButton.classList.remove("aiming");
}

function throwNow(angle) {
  const p = myPlayer();
  const item = heldThrowable(p);
  if (!item || !canThrow(p)) return;
  if (gameTime - p.lastSwing < item.cooldown) return; // still cooling down
  // Hiding in a log: only straight out of an open end (sideways would hit the log's wall).
  if (myLog && !throwFitsLog(myLog, angle)) {
    showToast("🪵 From inside a log, throw out of an open end.", "מִתּוֹךְ בּוּל עֵץ זוֹרְקִים רַק הַחוּצָה מִצַּד פָּתוּחַ.");
    return;
  }
  p.lastSwing = gameTime; // start the throwing animation right away
  p.facing = angle;       // turn to face the throw
  sendMyPosition(p);      // so the referee throws it from exactly where I am
  sendToServer({ type: "throw", angle });
}

// ---------- Frozen (hit by a rock) ----------
// The referee says I'm frozen: a question pops up that can't be closed, and I can't move
// until I get one right. Each freeze has its own number (freezeId), so a late snapshot
// that still says "frozen" doesn't pop the question up again after I've answered.

let freezeQuizId = 0;    // which freeze the open question is for (0 = no freeze question open)
let answeredFreezeId = 0; // the last freeze I answered (waiting for the referee to hear it)

function checkFrozen(p) {
  const stillFrozen = p.frozen && p.freezeId !== answeredFreezeId;
  if (stillFrozen && !(quiz.open && freezeQuizId === p.freezeId)) {
    // Close whatever was open (shop, another question) and ask the freeze question.
    shopEl.hidden = true;
    flagQuizTeam = null;
    if (quiz.open) closeQuiz();
    resetStick();
    cancelAim();
    const id = p.freezeId;
    freezeQuizId = id;
    openQuiz({
      title: "🧊 A rock hit you! You're frozen. Answer to break free",
      titleHe: "אֶבֶן פָּגְעָה בָּכֶם! אַתֶּם קְפוּאִים. עוֹנִים נָכוֹן כְּדֵי לְהִשְׁתַּחְרֵר",
      closable: false,
      onCorrect: () => {
        answeredFreezeId = id;
        freezeQuizId = 0;
        p.frozen = false; // (move again straight away; the referee hears about it in a moment)
        sendToServer({ type: "unfreeze", freezeId: id });
      },
    });
  } else if (!p.frozen && freezeQuizId) {
    // Not frozen any more some other way (like being knocked out): close the question.
    freezeQuizId = 0;
    if (quiz.open) closeQuiz();
  }
}

// ---------- Flags ----------

const flagButton = document.getElementById("flag-button");
const flagButtonLabel = document.getElementById("flag-button-label");
onPress(flagButton, pressFlagButton);

// Which flag (if any) could I pick up right now?
// The enemy flag (from its base or the ground), or my own flag only if it was dropped.
function grabbableFlag(p) {
  if (!p || !flags || p.carrying || !p.alive) return null;
  for (const flag of Object.values(flags)) {
    if (flag.state === "carried") continue;
    if (flag.team === p.team && flag.state === "home") continue;
    if (distance(flag, p) < FLAG_REACH) return flag;
  }
  return null;
}

// While a "grab the flag" question is open, this says which flag it's for ("blue"/"red").
let flagQuizTeam = null;

// If that flag isn't there to grab anymore (it went back to its base by itself,
// or someone else grabbed it), close the question. Runs every frame.
function checkFlagQuiz(p) {
  if (!quiz.open) {
    flagQuizTeam = null;
    return;
  }
  if (!flagQuizTeam) return;
  const flag = grabbableFlag(p);
  if (!flag || flag.team !== flagQuizTeam) {
    flagQuizTeam = null;
    closeQuiz();
  }
}

// The 🚩 button does two jobs: drop the flag you have, or try to grab one nearby.
function pressFlagButton() {
  const p = myPlayer();
  if (!p || isBusy()) return;
  if (p.carrying) {
    // Dropping does NOT stop the joystick — you can keep running.
    sendToServer({ type: "drop" });
    return;
  }
  const flag = grabbableFlag(p);
  if (!flag) return;
  resetStick(); // grabbing means standing still to answer
  flagQuizTeam = flag.team; // remember which flag this question is for
  openQuiz({
    title: `🚩 Answer correctly to grab the ${TEAM_NAMES[flag.team]} flag`,
    titleHe: `עוֹנִים נָכוֹן וְתוֹפְסִים אֶת ${TEAM_HE[flag.team].flag}`,
    onCorrect: () => {
      sendToServer({ type: "grab", flag: flag.team });
      playSound("grab");
    },
  });
}

// ---------- Rocks ----------
// Rocks are solid. Walking into one stops you, and you must answer a question
// (no ✕ button!) before you can pass through. After a right answer you can
// walk through rocks for a couple of seconds.

function checkRocks(p, oldX, oldY) {
  if (gameTime < rockPassUntil) return; // allowed to pass through right now
  for (const [rockX, rockY] of MAP.rocks) {
    const minDistance = ROCK_RADIUS + p.radius;
    const dist = Math.hypot(p.x - rockX, p.y - rockY);
    if (dist >= minDistance) continue;

    // Push the player back out to the edge of the rock.
    const awayX = dist > 0 ? (p.x - rockX) / dist : 1;
    const awayY = dist > 0 ? (p.y - rockY) / dist : 0;
    p.x = rockX + awayX * minDistance;
    p.y = rockY + awayY * minDistance;

    // Only ask a question if you just walked INTO the rock (not if you were already
    // inside when your pass-through time ran out — then you're just nudged out).
    const wasOutside = Math.hypot(oldX - rockX, oldY - rockY) >= minDistance;
    if (wasOutside && !quiz.open) bumpRock();
    return;
  }
}

function bumpRock() {
  resetStick();
  playSound("bump");
  openQuiz({
    title: "🪨 You bumped into a rock! Answer to pass through",
    titleHe: "נִתְקַעְתֶּם בְּסֶלַע! עוֹנִים כְּדֵי לַעֲבֹר",
    closable: false,
    onCorrect: () => {
      rockPassUntil = gameTime + ROCK_PASS_TIME;
      showToast(`🪨 You can walk through rocks for ${ROCK_PASS_TIME} seconds!`, `אֶפְשָׁר לַעֲבֹר דֶּרֶךְ סְלָעִים בְּמֶשֶׁךְ ${ROCK_PASS_TIME} שְׁנִיּוֹת!`);
    },
  });
}

// ---------- Bumping into other players ----------
// Each phone only moves its own player, so each phone checks: "am I overlapping
// someone?" If so, it pushes MY player all the way out, and gives me a little
// bounce away from them. Both phones do this, so the two players bounce apart.
// While you're answering a question or shopping, your phone skips this, so the
// other player's phone does all the pushing: nobody can shove you while you answer.
// Settings are in BUMP (rules.js).

const bump = {
  vx: 0, vy: 0,          // my bounce speed right now (fades to 0)
  touching: new Set(),   // who I was touching last frame (so each new touch bounces once)
  lastSound: -Infinity,  // when the bump sound last played
};

function bumpIntoPlayers(p) {
  const nowTouching = new Set();
  const minDistance = PLAYER_RADIUS * 2; // two bodies side by side
  for (const other of Object.values(players)) {
    if (other.id === p.id || !other.alive || other.inLog) continue; // (someone in a log isn't in the way)
    if (!BUMP.teammates && other.team === p.team) continue;
    const dist = Math.hypot(p.x - other.x, p.y - other.y);
    if (dist >= minDistance) continue;
    nowTouching.add(other.id);

    // Which way is "away from them"? (If we're exactly on top of each other,
    // the player ids decide, so the two phones push in opposite directions.)
    const awayX = dist > 0 ? (p.x - other.x) / dist : (p.id < other.id ? 1 : -1);
    const awayY = dist > 0 ? (p.y - other.y) / dist : 0;
    // Step out so we're just touching, not overlapping.
    p.x = other.x + awayX * minDistance;
    p.y = other.y + awayY * minDistance;

    // A NEW touch (not one that started last frame) = a bounce.
    if (!bump.touching.has(other.id)) {
      bump.vx = awayX * BUMP.bounceSpeed;
      bump.vy = awayY * BUMP.bounceSpeed;
      if (gameTime - bump.lastSound > 0.4) {
        bump.lastSound = gameTime;
        playSound("nudge"); // a soft bump (the loud "bump" is for rocks)
      }
    }
  }
  bump.touching = nowTouching;
}

// Move by my bounce speed, then let it fade a little.
function applyBounce(p, dt) {
  p.x += bump.vx * dt;
  p.y += bump.vy * dt;
  const fade = Math.exp(-BUMP.slowdown * dt);
  bump.vx *= fade;
  bump.vy *= fade;
}

function stopBounce() {
  bump.vx = 0;
  bump.vy = 0;
  bump.touching.clear();
}

// ---------- Hollow logs ----------
// A log is solid from the sides. But walk straight into one of its open ENDS and you
// crawl inside: you can only move along the log, your screen gets darker, and other
// phones stop drawing you. Walk out of either end to leave.
// (You can't crawl in while carrying a flag: then the log is solid all over.)

function checkLogs(p) {
  const halfWidth = LOG.width / 2;

  // Already inside a log: stay on its middle line, and leave if you walk out an end.
  if (myLog) {
    const { along } = logLocal(myLog, p.x, p.y);
    const half = myLog.length / 2;
    if (Math.abs(along) > half + PLAYER_RADIUS) { // fully past an end (not just at the opening)
      // Out! Step just past the end, so we're not touching the log any more.
      const out = Math.sign(along) * (half + PLAYER_RADIUS + 2);
      p.x = myLog.x + myLog.dirX * out;
      p.y = myLog.y + myLog.dirY * out;
      myLog = null;
    } else {
      p.x = myLog.x + myLog.dirX * along;
      p.y = myLog.y + myLog.dirY * along;
    }
    return;
  }

  for (const log of MAP.logs) {
    const { along, side } = logLocal(log, p.x, p.y);
    const half = log.length / 2;
    const endReach = half + PLAYER_RADIUS;   // touching an end
    const sideReach = halfWidth + PLAYER_RADIUS; // touching a side
    if (Math.abs(along) >= endReach || Math.abs(side) >= sideReach) continue; // not touching

    // Walking into an open end, lined up with the hole? Crawl in!
    const atAnEnd = Math.abs(along) > half;
    if (atAnEnd && Math.abs(side) < halfWidth && !p.carrying) {
      myLog = log;
      p.x = log.x + log.dirX * along;
      p.y = log.y + log.dirY * along;
      return;
    }

    // Otherwise the log is solid: push out the shortest way (off the side, or off the end).
    let newAlong = along;
    let newSide = side;
    if (sideReach - Math.abs(side) < endReach - Math.abs(along)) newSide = Math.sign(side || 1) * sideReach;
    else newAlong = Math.sign(along || 1) * endReach;
    p.x = log.x + log.dirX * newAlong - log.dirY * newSide;
    p.y = log.y + log.dirY * newAlong + log.dirX * newSide;
  }
}

// ---------- Berries ----------
// Touch a ripe berry: ask the referee to let me eat it.
// (The referee decides, so two players can't both eat the same berry.)
function checkBerries(p) {
  if (!berries) return;
  MAP.berries.forEach((berry, i) => {
    if (!berries[i] || Math.hypot(p.x - berry.x, p.y - berry.y) > PLAYER_RADIUS + BERRY.touch) return;
    if (gameTime - (berryAskedAt.get(i) ?? -Infinity) < 1) return; // asked a moment ago: wait for the answer
    berryAskedAt.set(i, gameTime);
    sendMyPosition(p); // so the referee knows I'm really touching it right now
    sendToServer({ type: "eat", berry: i });
  });
}

// How much faster my berries make me: 1 = not at all, 1.3 = three berries (30% faster).
// How many berry boosts are working right now (0 … BERRY.maxAtOnce).
function activeBerries(p) {
  return Math.min((p.berryBoosts || []).filter((end) => end > gameTime).length, BERRY.maxAtOnce);
}

// Extra speed from berries, as a share of normal speed (3 berries = 0.3 = +30%).
function berryBonus(p) {
  return activeBerries(p) * BERRY.boostEach;
}

// ---------- Winner screen ----------

const winnerEl = document.getElementById("winner");

function showWinner() {
  resetStick();
  setBilingual(document.getElementById("winner-title"),
    `${TEAM_NAMES[client.winner]} team wins!`, `${TEAM_HE[client.winner].team} נִצְּחָה!`);
  setBilingual(document.getElementById("winner-score"),
    `Final score: Blue ${score.blue} – ${score.red} Red`, `תּוֹצָאָה סוֹפִית: כָּחֹל ${score.blue} – ${score.red} אָדֹם`);
  winnerEl.hidden = false;
  launchConfetti(client.winner);
}

// 60 little paper pieces in the winning team's colors, falling at random speeds.
function launchConfetti(team) {
  const layer = document.getElementById("confetti");
  layer.innerHTML = "";
  const colors = team === "blue" ? ["#3b82f6", "#93c5fd", "#facc15", "#fff"] : ["#ef4444", "#fca5a5", "#facc15", "#fff"];
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "%";
    piece.style.background = colors[i % colors.length];
    piece.style.animationDuration = 2 + Math.random() * 2.5 + "s";
    piece.style.animationDelay = Math.random() * 1.2 + "s";
    layer.appendChild(piece);
  }
}

// ---------- Drawing each frame ----------

const waterChip = document.getElementById("water-chip");
const bushChip = document.getElementById("bush-chip");
const logChip = document.getElementById("log-chip");
const weaponChip = document.getElementById("weapon-chip");
const carryChip = document.getElementById("carry-chip");
const boostChip = document.getElementById("boost-chip");
const berryChip = document.getElementById("berry-chip");
const koMessage = document.getElementById("ko-message");

function ctfRender() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "#2d4a22";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Follow my player (or look at the middle of the map on the home screen).
  const me = myPlayer();
  const focus = me && client.phase !== "lobby" ? me : { x: MAP.width / 2, y: MAP.height / 2 };
  let cameraX = cameraPosition(focus.x, view.width, MAP.width);
  let cameraY = cameraPosition(focus.y, view.height, MAP.height);

  // Screen shake for a moment after I get hit.
  // (Math.max(0, ...) guards against the clock being nudged backwards by a sync.)
  const sinceHurt = Math.max(0, gameTime - hurtAt);
  const shake = sinceHurt < 0.3 ? (1 - sinceHurt / 0.3) * 10 : 0;
  cameraX += (Math.random() - 0.5) * shake;
  cameraY += (Math.random() - 0.5) * shake;
  hurtFlash.style.opacity = sinceHurt < 0.5 ? String(1 - sinceHurt / 0.5) : "0";
  const s = view.scale * view.dpr;
  ctx.setTransform(s, 0, 0, s, -cameraX * s, -cameraY * s);

  // Back to front: ground, things on the ground, players, then bushes and effects on top.
  drawMap(ctx, gameTime);
  for (const team of ["blue", "red"]) {
    const base = MAP.bases[team];
    drawShopkeeper(ctx, base, team, gameTime);
    drawFlagStand(ctx, base, team);
    const flag = flags ? flags[team] : { state: "home", x: base.x, y: base.y };
    if (flag.state === "home") drawFlag(ctx, flag.x, flag.y, team, gameTime);
    if (flag.state === "dropped") drawDroppedFlag(ctx, flag, gameTime);
  }
  if (speedBox) drawSpeedBox(ctx, speedBox, gameTime);

  if (client.phase === "playing" || client.phase === "over") {
    // Draw me last so I'm always on top of other players.
    const everyone = Object.values(players).sort((a, b) => (a.id === client.myId) - (b.id === client.myId));
    for (const p of everyone) {
      if (!p.alive) continue;
      const isMe = p.id === client.myId;
      // Hiding in a log: invisible to everyone else, except people hiding in the SAME log.
      const inMyLog = p.inLog && p.inLog === myLogNumber();
      if (p.inLog && !isMe && !inMyLog) continue;
      if (p.carrying) drawCarriedFlag(ctx, p, p.carrying, gameTime);
      if (isMe && myLog || inMyLog) ctx.globalAlpha = 0.45; // inside a log: faint, so we can still find ourselves
      drawPlayer(ctx, p, gameTime, isMe);
      ctx.globalAlpha = 1;
    }
  }
  drawBushes(ctx, berries);
  if (client.phase === "playing" || client.phase === "over") {
    // Pomegranate trees, on top of bushes (the ones that became logs are drawn with the other logs).
    for (const tree of trees) if (tree.state === "tree") drawPomegranateTree(ctx, tree, gameTime);
    // Hidden grenades: only MY team can see ours (faint). The other team sees nothing!
    for (const mine of mines) if (me && mine.team === me.team) drawMine(ctx, mine, gameTime);
  }
  if (client.phase === "playing") drawShots(ctx, shots, gameTime); // flying over the bushes
  drawEffects(ctx, effects, gameTime);
  // Aiming a throw: show where it will fly.
  const aimingWith = aim.active && heldThrowable(me);
  if (aimingWith && client.phase === "playing") {
    // (A grenade also shows its blast circle where it will land.)
    // (Red = blocked: you're in a log and aiming at its wall.)
    const blocked = Boolean(myLog) && !throwFitsLog(myLog, aimAngle(me));
    drawAimLine(ctx, me, aimAngle(me), aimingWith.range, aimingWith.lands ? POMEGRANATE.blast : 0, blocked);
  }

  // Hiding in a log: everything gets dark, darkest at the edges of the screen.
  if (client.phase === "playing" && myLog) drawLogDarkness(ctx, view.dpr);

  // The minimap is drawn in screen pixels (not world units), in the top-right corner.
  if (client.phase === "playing" && me) {
    ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
    drawMinimap(ctx, window.innerWidth - 160, 10, 150, me, players, flags, gameTime);
  }

}

// ---------- Moving my player each frame (game.js calls this through PHONE_GAMES.ctf.update) ----------

let lastMoveSent = 0;

function ctfUpdate(dt) {
  // Remove finished effects. (Going backwards makes removing safe.)
  for (let i = effects.length - 1; i >= 0; i--) {
    if (gameTime - effects[i].born > effects[i].life) effects.splice(i, 1);
  }
  // Is each player in a river or a bush? (For speed, the chips and drawing.)
  for (const p of Object.values(players)) {
    p.inWater = isInWater(p.x, p.y);
    p.inBush = isInBush(p.x, p.y);
  }

  const now = performance.now();
  const p = myPlayer();
  if (!p || client.phase !== "playing") return;

  // Knocked out: close any popups and wait.
  if (!p.alive) {
    if (quiz.open) closeQuiz();
    shopEl.hidden = true;
    p.moving = false;
    stopBounce();
    myLog = null;
    p.inLog = 0;
    freezeQuizId = 0; // (a knockout also ends a freeze)
    cancelAim();
    return;
  }

  checkFrozen(p);   // hit by a rock? Answer a question before you can move again.
  checkFlagQuiz(p);

  if (isBusy()) {
    p.moving = false;
    stopBounce(); // answering or shopping: you stand still and can't be shoved
  } else {
    const keys = keyboardDirection();
    let dx = stick.x + keys.x;
    let dy = stick.y + keys.y;
    const amount = Math.hypot(dx, dy);
    if (amount > 1) {
      dx /= amount;
      dy /= amount;
    }

    // Work out speed.
    //   The ground: normal 1, river 0.35, bush 0.3 (forest boots: 1).
    //   Berries ADD 0.1 each (of normal speed), so they help just as much in a bush:
    //     a bush with 3 berries = 0.3 + 0.3 = 0.6. Normal ground with 3 berries = 1.3.
    //   Then: carrying a flag ×0.7, speed box boost ×1.5.
    let ground = 1;
    if (p.inWater) ground = MAP.waterSlowdown;
    else if (p.inBush && !(p.items || []).includes("boots")) ground = MAP.bushSlowdown;
    let speed = PLAYER_SPEED * (ground + berryBonus(p));
    if (p.carrying) speed *= CARRY_SLOWDOWN;
    if (p.boostUntil > gameTime) speed *= SPEED_BOOST.multiplier;

    const oldX = p.x;
    const oldY = p.y;
    p.x += dx * speed * dt;
    p.y += dy * speed * dt;
    // In a river? The current carries you downstream.
    const flow = p.inWater && !myLog ? riverFlowAt(p.x, p.y) : null;
    if (flow) {
      p.x += flow.x * MAP.riverFlow * dt;
      p.y += flow.y * MAP.riverFlow * dt;
    }
    if (myLog) {
      stopBounce();       // inside a log: nobody can bump you
    } else {
      applyBounce(p, dt); // still sliding from a bump?
      bumpIntoPlayers(p); // players are solid
    }
    checkLogs(p);         // logs are solid (or you crawl inside)
    checkBerries(p);      // walked into ripe berries? Eat them!
    checkRocks(p, oldX, oldY);
    clampToMap(p);
    p.moving = amount > 0.1;
    if (p.moving) p.facing = Math.atan2(dy, dx);
    // Aiming a throw? Turn toward where you're aiming (even while walking another way).
    if (aim.active && Math.hypot(aim.dx, aim.dy) >= AIM_DEADZONE) p.facing = aimAngle(p);
  }

  p.inLog = myLogNumber();

  // Tell the referee where I am (and whether I'm hiding), 20 times a second.
  if (now - lastMoveSent > 50) sendMyPosition(p);
}

function sendMyPosition(p) {
  lastMoveSent = performance.now();
  sendToServer({ type: "move", x: p.x, y: p.y, facing: p.facing, moving: p.moving, inLog: myLogNumber() });
}

// ---------- The HUD: Capture the Flag's buttons and labels (game.js calls this through PHONE_GAMES.ctf.updateHud) ----------

const hurtFlash = document.getElementById("hurt-flash");

function ctfUpdateHud(p, playing) {
  if (!playing) {
    for (const b of [shopButton, flagButton, attackButton, throwButton]) b.hidden = true;
    toolbarEl.hidden = true;
    koMessage.hidden = true;
    return;
  }
  document.getElementById("score-blue").textContent = score.blue;
  document.getElementById("score-red").textContent = score.red;
  waterChip.hidden = !p.inWater || !p.alive;
  bushChip.hidden = !p.inBush || !p.alive || (p.items || []).includes("boots"); // (boots: not slow)
  logChip.hidden = !myLog || !p.alive;
  const held = ITEMS[p.held];
  if (held) setBilingual(weaponChip, `${held.icon} ${held.name}`, held.nameHe);
  else setBilingual(weaponChip, "✋ No weapon", "בְּלִי נֶשֶׁק");
  updateToolbar(p);

  carryChip.hidden = !p.carrying;
  if (p.carrying === p.team) {
    setBilingual(carryChip, "🚩 Carrying your flag — take it home!", "סוֹחֲבִים אֶת הַדֶּגֶל שֶׁלָּכֶם — מַחֲזִירִים אוֹתוֹ הַבַּיְתָה!");
  } else if (p.carrying) {
    setBilingual(carryChip, `🚩 Carrying the ${TEAM_NAMES[p.carrying]} flag — run home!`, `סוֹחֲבִים אֶת ${TEAM_HE[p.carrying].flag} — רָצִים הַבַּיְתָה!`);
  }

  const boostLeft = Math.ceil(p.boostUntil - gameTime);
  boostChip.hidden = boostLeft <= 0;
  setBilingual(boostChip, `⚡ Speed boost ${boostLeft}s`, `מְהִירוּת! עוֹד ${boostLeft} שְׁנִיּוֹת`);

  // Berry boosts: how much faster, and how long until the LAST one runs out.
  const berryCount = p.alive ? activeBerries(p) : 0;
  berryChip.hidden = berryCount === 0;
  if (berryCount > 0) {
    const berryLeft = Math.ceil(Math.max(...p.berryBoosts) - gameTime);
    const percent = Math.round(berryCount * BERRY.boostEach * 100);
    // (‎ = an invisible mark that keeps "+30%" the right way round inside Hebrew text.)
    setBilingual(berryChip, `🍒 Berries: +${percent}% speed, ${berryLeft}s`, `גַּרְגְּרִים: ‎+${percent}%‎ מְהִירוּת, עוֹד ${berryLeft} שְׁנִיּוֹת`);
  }

  koMessage.hidden = p.alive;
  if (!p.alive) {
    const secondsLeft = Math.max(1, Math.ceil(p.respawnAt - gameTime));
    setBilingual(koMessage, `💥 Knocked out! Back in ${secondsLeft}…`, `הִפִּילוּ אֶתְכֶם! חוֹזְרִים בְּעוֹד ${secondsLeft}…`);
  }

  shopButton.hidden = isBusy() || !nearShop(p);
  attackButton.hidden = !canAttack(p);
  const weapon = heldWeapon(p);
  if (weapon) {
    setItemIcon(attackIcon, p.held);
    attackButton.classList.toggle("cooling", gameTime - p.lastSwing < weapon.cooldown);
  } else if (holdingTree(p)) {
    setItemIcon(attackIcon, "tree");
    attackButton.classList.remove("cooling");
  }
  // The button's words: "Plant" while holding a tree, otherwise "Hit".
  const planting = holdingTree(p);
  const attackHe = attackButton.querySelector(".he");
  const attackEn = attackButton.querySelector(".en");
  if (attackEn.textContent !== (planting ? "Plant" : "Hit")) {
    attackHe.textContent = planting ? "לִשְׁתֹּל" : "לְהַכּוֹת";
    attackEn.textContent = planting ? "Plant" : "Hit";
  }
  // The Throw button (instead of Hit) while holding something to throw.
  const throwable = heldThrowable(p);
  throwButton.hidden = !canThrow(p);
  if (throwButton.hidden) {
    if (aim.active) cancelAim(); // (ran out, got busy, or grabbed a flag mid-aim)
  } else {
    setItemIcon(throwIcon, p.held);
    const left = String(p.ammo[p.held]);
    if (throwCount.textContent !== left) throwCount.textContent = left;
    throwButton.classList.toggle("cooling", gameTime - p.lastSwing < throwable.cooldown);
  }
  flagButton.hidden = isBusy() || !(p.carrying || grabbableFlag(p));
  if (p.carrying) setBilingual(flagButtonLabel, "Drop", "לִזְרֹק");
  else setBilingual(flagButtonLabel, "Grab", "לִתְפֹּס");
}

// ---------- Capture the Flag's answers to the shared phone code (game.js) ----------

// Forget every "until this time" timer (the clock jumped: a new room, or back from sleep).
function ctfResetTimers() {
  hurtAt = -Infinity;
  rockPassUntil = 0;
  effects.length = 0;
  shots = [];
  mines = [];
  myLog = null;
  berryAskedAt.clear();
  answeredFreezeId = 0;
  cancelAim();
}

// Left the room: forget the game and close its popups.
function ctfClear() {
  flags = null;
  speedBox = null;
  berries = null;
  lastMyHp = null;
  ctfResetTimers();
  shopEl.hidden = true;
  winnerEl.hidden = true;
}

// Keys on a computer: Space = hit or throw, 1–9 = toolbar, E = shop, F = grab/drop a flag.
function ctfOnKey(key) {
  if (key === " ") {
    // Holding something to throw? Throw it the way you're facing. Otherwise swing.
    const p = myPlayer();
    if (heldThrowable(p)) throwNow(p.facing);
    else swingWeapon();
  }
  // Number keys pick a toolbar slot (1 = empty hands). Not while answering: there, 1–4 pick an answer.
  const slot = parseInt(key, 10);
  if (!quiz.open && slot >= 1 && slot <= 9 && toolbarEl.children[slot - 1]) {
    holdItem(toolbarEl.children[slot - 1].dataset.item || null);
  }
  if (key === "e") tryOpenShop();
  if (key === "f") pressFlagButton();
}

// The referee's snapshot: Capture the Flag's own things.
let lastMyHp = null; // my health in the last snapshot (to notice when I get hurt)
function ctfApplySnapshot(snap) {
  const me = myPlayer();
  if (me) {
    if (lastMyHp !== null && me.hp < lastMyHp) hurtAt = gameTime; // ouch! (shake + red flash)
    lastMyHp = me.hp;
    // Just tapped the toolbar? Keep my pick until the referee has caught up.
    if (performance.now() - myHeldAt < HELD_TRUST_MS && (myHeld === null || (me.items || []).includes(myHeld))) me.held = myHeld;
    // Knocked out = everything bought is gone, including half-paid progress.
    if (!me.alive) shopPaid = {};
  } else {
    lastMyHp = null;
  }

  flags = snap.flags;
  score = snap.score;
  speedBox = snap.speedBox;
  berries = snap.berries || null;
  // Flying things: remember WHEN we heard about them, so drawing can slide them forward until the next snapshot.
  shots = (snap.shots || []).map((s) => ({ ...s, seenAt: gameTime }));
  mines = snap.mines || [];
  trees = snap.trees || [];
  syncTreeLogs();
}

// Something happened on the map (damage numbers, shockwaves…): draw it, and play its sound if it's near me.
function ctfOnEvent(e) {
  effects.push({ ...e, born: gameTime });
  if (e.sound && isNearMe(e)) playSound(e.sound);
}

// The game started, ended, or everyone went back to the lobby.
function ctfOnPhase(phase) {
  cancelAim();
  if (phase === "lobby") {
    winnerEl.hidden = true; // (coming back after a game ended)
  } else if (phase === "playing") {
    winnerEl.hidden = true;
    rockPassUntil = 0;
    shopPaid = {};   // a new game: half-paid items start from zero
    myHeld = null;
    answeredFreezeId = 0;
  } else if (phase === "over") {
    shopEl.hidden = true;
    showWinner();
  }
}

PHONE_GAMES.ctf = {
  resetTimers: ctfResetTimers,
  clear: ctfClear,
  onKey: ctfOnKey,
  applySnapshot: ctfApplySnapshot,
  onEvent: ctfOnEvent,
  onPhase: ctfOnPhase,
  update: ctfUpdate,
  render: ctfRender,
  updateHud: ctfUpdateHud,
};
