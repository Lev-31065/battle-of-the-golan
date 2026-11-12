// game.js — runs on EVERY phone.
//
// It handles the home screen and lobby, reads your joystick and buttons,
// moves YOUR player, asks the Hebrew questions, and draws everything.
// Important decisions (hits, flags, score) are made by the referee in server.js,
// which only runs on the host's phone. This file just asks the referee
// ("I swung my hammer!") and draws whatever the referee says happened.

// ---------- Setup ----------

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Game clock in seconds. It's kept in step with the referee's clock.
let gameTime = 0;

// What this phone knows about the game.
const client = {
  myId: null,       // my player's id
  isHost: false,    // true if this phone created the room (and runs the referee)
  roomCode: "",
  phase: "home",    // "home" → "lobby" → "playing" → "over"
  winner: null,
  lastSnapshotAt: 0,
  name: "",         // my nickname (to join again if the referee drops me)
  joinSentAt: 0,    // when I last asked to join (so I don't ask over and over)
  hostingClass: false, // true if I came from the teacher dashboard ("Host a class game")
  roomIsClass: false,  // true if the room I'm in is a class game (the referee says so)
};

// Everything below gets filled in from the referee's snapshots.
const players = {};   // every player, by id
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

// Forget every "until this time" timer. Needed when the game clock jumps (joining a
// different room, or coming back after the phone slept): each room has its own clock,
// so an old "I got hit at second 900" would look like it's still happening in a room
// whose clock is at second 50 (the whole screen stayed red and shaking).
function resetTimers() {
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

function myPlayer() {
  return players[client.myId];
}

// Send a message to the referee. If I'm the host, the referee is right here on this phone.
function sendToServer(msg) {
  if (client.isHost) serverHandle(client.myId, msg);
  else sendToHost(msg);
}

// ---------- No zooming ----------
// iPhones ignore the "no zooming" line in index.html, so block pinch-zoom and
// double-tap zoom here too.
document.addEventListener("gesturestart", (event) => event.preventDefault());
document.addEventListener("dblclick", (event) => event.preventDefault());

// ---------- Full screen (hides the browser's address bar) ----------
// Phones only allow full screen right after a tap, so it turns on when you tap
// Play Game, Create or Join. The ⛶ button in the game turns it off and on.
// (iPhones don't allow it at all, so there the button stays hidden.)
const page = document.documentElement;
const canFullscreen = Boolean(document.fullscreenEnabled || document.webkitFullscreenEnabled);
function isFullscreen() {
  return Boolean(document.fullscreenElement || document.webkitFullscreenElement);
}
function enterFullscreen() {
  if (!canFullscreen || isFullscreen()) return;
  try {
    const result = (page.requestFullscreen || page.webkitRequestFullscreen).call(page);
    if (result && result.catch) result.catch(() => {}); // the phone said no: that's fine
  } catch {}
}
function exitFullscreen() {
  if (!isFullscreen()) return;
  try {
    const result = (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    if (result && result.catch) result.catch(() => {});
  } catch {}
}
// ---------- Sideways (landscape) ----------
// Android lets a full-screen page turn itself sideways (screen.orientation.lock). iPhones
// don't allow it, so there an upright phone gets a big "turn your phone sideways" card.
function lockSideways() {
  try {
    if (!isFullscreen() || !screen.orientation || !screen.orientation.lock) return;
    const result = screen.orientation.lock("landscape");
    if (result && result.catch) result.catch(() => {}); // the phone said no: the card will show
  } catch {}
}
function unlockSideways() {
  try { if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); } catch {}
}
const rotateTip = document.getElementById("rotate-tip");
let rotateTipTimer = null;
function showRotateTip() {
  if (client.phase !== "playing" || window.innerHeight <= window.innerWidth) return;
  rotateTip.hidden = false;
  clearTimeout(rotateTipTimer);
  rotateTipTimer = setTimeout(() => { rotateTip.hidden = true; }, MESSAGES.rotateTipTime * 1000);
}
// Turned sideways (or the game ended)? The card goes away right away. A tap also closes it.
window.addEventListener("resize", () => {
  if (window.innerHeight <= window.innerWidth) rotateTip.hidden = true;
});
rotateTip.addEventListener("pointerdown", () => { rotateTip.hidden = true; });

const fullscreenButton = document.getElementById("fullscreen-button");
fullscreenButton.addEventListener("click", () => {
  if (isFullscreen()) exitFullscreen();
  else enterFullscreen();
});

// ---------- Screen size and camera ----------

const view = { scale: 1, width: 0, height: 0, dpr: 1 };

function resize() {
  // devicePixelRatio is how many real dots each screen "pixel" has (2 or 3 on phones).
  view.dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(window.innerWidth * view.dpr);
  canvas.height = Math.round(window.innerHeight * view.dpr);
  // Zoom so that about the same amount of map is visible on a phone or a big screen.
  view.scale = Math.sqrt(window.innerWidth * window.innerHeight) / 750;
  view.width = window.innerWidth / view.scale;
  view.height = window.innerHeight / view.scale;
}
window.addEventListener("resize", resize);
resize();

// The camera follows the player but stops at the map's edges.
function cameraPosition(target, viewSize, mapSize) {
  if (viewSize >= mapSize) return (mapSize - viewSize) / 2;
  return Math.min(Math.max(target - viewSize / 2, 0), mapSize - viewSize);
}

// Can I move right now? Not while a popup is open, and not while knocked out.
function isBusy() {
  const p = myPlayer();
  return quiz.open || !shopEl.hidden || !leaveEl.hidden || client.phase !== "playing" || !p || !p.alive;
}

// ---------- Keyboard controls ----------

const keysDown = new Set();
window.addEventListener("keydown", (event) => {
  if (event.target.tagName === "INPUT") return; // typing your nickname, not playing
  const key = event.key.toLowerCase();
  keysDown.add(key);
  if (key === " ") {
    event.preventDefault(); // stops Space from also "clicking" whatever button was last pressed
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
});
window.addEventListener("keyup", (event) => keysDown.delete(event.key.toLowerCase()));

function keyboardDirection() {
  let x = 0;
  let y = 0;
  if (keysDown.has("arrowleft") || keysDown.has("a")) x -= 1;
  if (keysDown.has("arrowright") || keysDown.has("d")) x += 1;
  if (keysDown.has("arrowup") || keysDown.has("w")) y -= 1;
  if (keysDown.has("arrowdown") || keysDown.has("s")) y += 1;
  return { x, y };
}

// ---------- Touch joystick ----------
// The joystick is always shown while playing, resting faded in the bottom-left corner
// (its resting spot is set in style.css). Put your thumb anywhere on the left half of
// the screen: the joystick jumps there, and dragging away from it moves the player.
// Let go and it slides back to its corner.

const joystickZone = document.getElementById("joystick-zone");
const joystickBase = document.getElementById("joystick-base");
const joystickKnob = document.getElementById("joystick-knob");
const STICK_RADIUS = 55;
const stick = { x: 0, y: 0 };
let stickPointerId = null;
let stickStartX = 0;
let stickStartY = 0;

joystickZone.addEventListener("pointerdown", (event) => {
  if (stickPointerId !== null) return;
  stickPointerId = event.pointerId;
  joystickZone.setPointerCapture(event.pointerId);
  stickStartX = event.clientX;
  stickStartY = event.clientY;
  joystickBase.style.left = stickStartX + "px";
  joystickBase.style.top = stickStartY + "px";
  joystickKnob.style.transform = "translate(0px, 0px)";
  joystickBase.classList.add("active"); // bright while your thumb is on it
});

joystickZone.addEventListener("pointermove", (event) => {
  if (event.pointerId !== stickPointerId) return;
  let dx = event.clientX - stickStartX;
  let dy = event.clientY - stickStartY;
  const length = Math.hypot(dx, dy);
  if (length > STICK_RADIUS) {
    dx *= STICK_RADIUS / length;
    dy *= STICK_RADIUS / length;
  }
  joystickKnob.style.transform = `translate(${dx}px, ${dy}px)`;
  stick.x = dx / STICK_RADIUS;
  stick.y = dy / STICK_RADIUS;
});

// Let go of the joystick (also used to force-stop it when a popup opens).
function resetStick() {
  stickPointerId = null;
  stick.x = 0;
  stick.y = 0;
  // Back to the resting corner: removing the inline left/top lets style.css's spot apply again.
  joystickBase.style.left = "";
  joystickBase.style.top = "";
  joystickKnob.style.transform = "translate(0px, 0px)";
  joystickBase.classList.remove("active");
}
function releaseStick(event) {
  if (event.pointerId === stickPointerId) resetStick();
}
joystickZone.addEventListener("pointerup", releaseStick);
joystickZone.addEventListener("pointercancel", releaseStick);

// Action buttons react on "pointerdown" (the instant a finger touches them), not "click".
// Phones don't send clicks while another finger is on the screen, so this is what lets
// you press Hit or Drop while your other thumb is still steering with the joystick.
function onPress(button, action) {
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    action();
  });
}

// ---------- Messages ----------

// Messages stack up at the bottom (newest at the bottom), so a new one doesn't wipe out
// the one you're reading. Each stays MESSAGES.time seconds; at most MESSAGES.max at once.
const toastArea = document.getElementById("toast-area");
// showToast("English", "עברית") — the Hebrew shows on top.
function showToast(english, hebrew) {
  // The same message again? Just restart its clock (no copies).
  for (const old of toastArea.children) {
    if (old.dataset.bi === english + "|" + (hebrew || "")) {
      clearTimeout(old.timer);
      old.timer = setTimeout(() => old.remove(), MESSAGES.time * 1000);
      toastArea.appendChild(old); // (moves it to the bottom, as the newest)
      return;
    }
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  setBilingual(toast, english, hebrew);
  toastArea.appendChild(toast);
  toast.timer = setTimeout(() => toast.remove(), MESSAGES.time * 1000);
  // Too many? The oldest goes first.
  while (toastArea.children.length > MESSAGES.max) {
    clearTimeout(toastArea.firstChild.timer);
    toastArea.firstChild.remove();
  }
}

// ---------- Home screen (the first screen: Play Game, Log in, your progress) ----------

const homeEl = document.getElementById("home");
const playEl = document.getElementById("play");
const modesEl = document.getElementById("modes");
const lobbyEl = document.getElementById("lobby");

// The play screen (nickname + create/join a room) comes in two kinds:
//   normal:     from "Play Game" on the home screen. Everyone picks their own level.
//   class game: from "Host a class game" on the teacher dashboard. The host picks the
//               words for everyone, so there's no "join" box (teachers host, they don't join).
function openPlayScreen(classGame) {
  client.hostingClass = classGame;
  document.getElementById("class-note").hidden = !classGame;
  document.getElementById("join-area").hidden = classGame;
  setHomeMessage("");
  enterFullscreen();
  showScreen("play");
}

document.getElementById("play-game-button").addEventListener("click", () => openPlayScreen(false));
// "Back" goes to wherever you came from: the teacher dashboard or the home screen.
document.getElementById("back-button").addEventListener("click", () => {
  setHomeMessage("");
  showScreen(client.hostingClass ? "decks" : "home");
});

// Masculine / feminine buttons. The picked one is highlighted (words.js remembers the choice).
const genderButtons = { m: document.getElementById("gender-m"), f: document.getElementById("gender-f") };
function showGenderChoice() {
  for (const [gender, button] of Object.entries(genderButtons)) {
    button.classList.toggle("picked", gender === myGender);
  }
}
for (const [gender, button] of Object.entries(genderButtons)) {
  button.addEventListener("click", () => {
    setMyGender(gender);
    showGenderChoice();
  });
}
showGenderChoice();

// Show how many words you've practiced on the home screen.
function updateProgressSummary() {
  const { practiced, known } = progressSummary();
  const el = document.getElementById("progress-summary");
  if (practiced === 0 && account.user) {
    setBilingual(el, "📚 Every question you answer is saved to your account.", "📚 כָּל תְּשׁוּבָה נִשְׁמֶרֶת בַּחֶשְׁבּוֹן.");
  } else if (practiced === 0) {
    setBilingual(el, "📚 Every question you answer is saved on this phone.", "📚 כָּל תְּשׁוּבָה נִשְׁמֶרֶת בַּטֶּלֶפוֹן הַזֶּה.");
  } else {
    setBilingual(el,
      `📚 Words practiced: ${practiced} · Words you know well: ${known}`,
      `📚 מִלִּים שֶׁתֻּרְגְּלוּ: ${practiced} · מִלִּים יְדוּעוֹת הֵיטֵב: ${known}`);
  }
}
updateProgressSummary();

// ---------- Play screen (nickname, create or join a room) ----------

const hudEl = document.getElementById("hud");
const nameInput = document.getElementById("name-input");
const codeInput = document.getElementById("code-input");
const createButton = document.getElementById("create-button");
const joinButton = document.getElementById("join-button");
const homeMessage = document.getElementById("home-message");

// Remember your nickname for next time. (try/catch because some browsers block storage.)
try { nameInput.value = localStorage.getItem("golan-nickname") || ""; } catch {}

// Room codes are letters only, shown in capitals.
codeInput.addEventListener("input", () => {
  codeInput.value = codeInput.value.toUpperCase().replace(/[^A-Z]/g, "");
});

// Opened from an invite link like ".../?room=KZTP"? Fill in the code for them.
// Otherwise, if you joined a room in the last 3 hours (maybe you closed the game
// by accident?), fill in that room's code so you can jump back in.
const roomFromLink = new URLSearchParams(location.search).get("room");
if (!roomFromLink) {
  try {
    const last = JSON.parse(localStorage.getItem("golan-last-room"));
    if (last && Date.now() - last.at < 3 * 60 * 60 * 1000) {
      codeInput.value = last.code;
      setTimeout(() => setHomeMessage(`Your last room was ${last.code}. Tap Join to go back in.`,
        `הַחֶדֶר הָאַחֲרוֹן שֶׁלָּכֶם: ${last.code}. לוֹחֲצִים עַל ״הִצְטָרְפוּת״ כְּדֵי לַחֲזֹר.`, true), 0);
    }
  } catch {}
}
if (roomFromLink) {
  codeInput.value = roomFromLink.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4);
  // Skip the home screen and go straight to joining.
  setTimeout(() => {
    showScreen("play");
    setHomeMessage("You've been invited! Type your nickname and tap Join.", "קִבַּלְתֶּם הַזְמָנָה! כּוֹתְבִים כִּנּוּי וְלוֹחֲצִים עַל ״הִצְטָרְפוּת״.", true);
  }, 0);
}

// The message under the buttons on the play screen. isInfo = gray (not a red error).
function setHomeMessage(english, hebrew, isInfo) {
  setBilingual(homeMessage, english || "", hebrew);
  homeMessage.classList.toggle("info", Boolean(isInfo));
}

function setHomeButtons(enabled) {
  createButton.disabled = !enabled;
  joinButton.disabled = !enabled;
}

function readNickname() {
  const name = nameInput.value.trim();
  if (!name) {
    setHomeMessage("Type a nickname first 🙂", "קֹדֶם כּוֹתְבִים כִּנּוּי 🙂");
    nameInput.focus();
    return null;
  }
  try { localStorage.setItem("golan-nickname", name); } catch {}
  return name;
}

// "Create a room" → first pick which game to play (the game-mode screen).
createButton.addEventListener("click", () => {
  if (!readNickname()) return;
  enterFullscreen();
  showScreen("modes");
});
document.getElementById("modes-back").addEventListener("click", () => showScreen("play"));
for (const button of document.querySelectorAll(".mode-button[data-mode]")) {
  button.addEventListener("click", () => createRoom(button.dataset.mode));
}

// Picked a game: open the room. (mode = "ctf" for Capture the Flag; more games later.)
function createRoom(mode) {
  const name = readNickname();
  if (!name) { showScreen("play"); return; }
  showScreen("play"); // shows "Creating a room…" (or what went wrong)
  setHomeButtons(false);
  setHomeMessage("Creating a room…", "פּוֹתְחִים חֶדֶר…", true);
  const classGame = client.hostingClass;
  hostRoom({
    onReady: (code, myId) => {
      client.isHost = true;
      client.myId = myId;
      client.roomCode = code;
      // A class game starts on the teacher's last pick. A normal room is always
      // Auto on the referee's side: each phone then plays the level its player picks.
      serverReset(myId, classGame ? teacherPickId() : AUTO, { classGame, mode });
      serverAddPlayer(myId, name);
      applySnapshot(serverSnapshot());
    },
    onMessage: (id, msg) => serverHandle(id, msg),
    onLeave: (id) => serverRemovePlayer(id),
    onError: (english, hebrew) => {
      setHomeButtons(true);
      setHomeMessage(english, hebrew);
    },
  });
}

joinButton.addEventListener("click", () => {
  const name = readNickname();
  if (!name) return;
  const code = codeInput.value.trim();
  if (code.length !== 4) {
    setHomeMessage("Room codes have 4 letters.", "לְקוֹד הַחֶדֶר יֵשׁ 4 אוֹתִיּוֹת.");
    codeInput.focus();
    return;
  }
  enterFullscreen();
  setHomeButtons(false);
  setHomeMessage("Joining…", "מִצְטָרְפִים…", true);
  joinRoom(code, {
    onConnected: (myId) => {
      client.myId = myId;
      client.roomCode = code;
      // Remember this room, in case the game gets closed by accident.
      try { localStorage.setItem("golan-last-room", JSON.stringify({ code, at: Date.now() })); } catch {}
      client.lastSnapshotAt = performance.now();
      client.name = name;
      client.joinSentAt = performance.now();
      sendToHost({ type: "join", name });
    },
    onMessage: (msg) => {
      if (msg && msg.type === "state") applySnapshot(msg);
    },
    onClose: () => backToHome("The host left the game.", "הַמְּאָרֵחַ יָצָא מֵהַמִּשְׂחָק."),
    onError: (english, hebrew) => {
      setHomeButtons(true);
      setHomeMessage(english, hebrew);
    },
  });
});

// Leave the game and go back to the play screen (with a message saying why).
function backToHome(english, hebrew) {
  disconnect();
  client.isHost = false;
  client.myId = null;
  client.roomIsClass = false;
  client.phase = "home";
  for (const id of Object.keys(players)) delete players[id];
  flags = null;
  speedBox = null;
  berries = null;
  roomDeckId = null; // the next room will tell us its words
  resetTimers();
  closeQuiz();
  shopEl.hidden = true;
  leaveEl.hidden = true;
  winnerEl.hidden = true;
  showScreen("play");
  setHomeButtons(true);
  setHomeMessage(english, hebrew);
}

// Show one full-screen panel ("home", "account", "decks", "play", "modes" or "lobby"), or none while playing.
function showScreen(name) {
  homeEl.hidden = name !== "home";
  accountEl.hidden = name !== "account";
  decksEl.hidden = name !== "decks";
  playEl.hidden = name !== "play";
  modesEl.hidden = name !== "modes";
  lobbyEl.hidden = name !== "lobby";
  if (name !== null) rotateTip.hidden = true; // (not in a game any more)
  // Back on the home or play screen: let the phone turn upright again. (The lobby stays
  // sideways between games, so the phone doesn't flip back and forth.)
  if (name === "home" || name === "play") unlockSideways();
  if (name === "home") updateProgressSummary();
}

// ---------- Lobby ----------

const startButton = document.getElementById("start-button");
const lobbyWait = document.getElementById("lobby-wait");

document.getElementById("switch-team").addEventListener("click", () => {
  const p = myPlayer();
  if (p) sendToServer({ type: "team", team: otherTeam(p.team) });
});
startButton.addEventListener("click", () => sendToServer({ type: "start" }));

// ---------- Leaving (🏠 in the lobby, 🚪 in the game) ----------
// The host's phone IS the room, so if the host leaves, everyone's game ends.
// In the game, everyone gets an "Are you sure?" popup. In the lobby, only the host does.

const leaveEl = document.getElementById("leave-confirm");
const leaveNote = document.getElementById("leave-note");

function askToLeave() {
  resetStick();
  if (client.isHost) {
    setBilingual(leaveNote, "You're the host: if you leave, the room closes for everyone.",
      "אַתֶּם הַמְּאָרְחִים: אִם תֵּצְאוּ, הַחֶדֶר יִסָּגֵר לְכֻלָּם.");
  } else {
    setBilingual(leaveNote, `To come back later, join room ${client.roomCode} again.`,
      `כְּדֵי לַחֲזֹר אַחַר כָּךְ, מִצְטָרְפִים שׁוּב לְחֶדֶר ${client.roomCode}.`);
  }
  leaveEl.hidden = false;
}

function leaveRoom() {
  backToHome("", ""); // hangs up and hides the popup
  showScreen("home");
}

document.getElementById("leave-yes").addEventListener("click", leaveRoom);
document.getElementById("leave-no").addEventListener("click", () => { leaveEl.hidden = true; });
document.getElementById("leave-button").addEventListener("click", askToLeave);
document.getElementById("lobby-home").addEventListener("click", () => {
  if (client.isHost) askToLeave();
  else leaveRoom();
});

// Share a link that opens the game with the room code already filled in.
document.getElementById("invite-button").addEventListener("click", async () => {
  const link = location.origin + location.pathname + "?room=" + client.roomCode;
  try {
    if (navigator.share) {
      await navigator.share({
        title: "Battle of the Golan · הַקְּרָב עַל הַגּוֹלָן",
        text: `Join my game! Room code: ${client.roomCode}\nבּוֹאוּ לְשַׂחֵק אִתִּי! קוֹד הַחֶדֶר: ${client.roomCode}`,
        url: link,
      });
    } else {
      await navigator.clipboard.writeText(link);
      showToast("📋 Invite link copied! Paste it to your friends.", "קִשּׁוּר הַהַזְמָנָה הוּעֲתַק! שׁוֹלְחִים אוֹתוֹ לַחֲבֵרִים.");
    }
  } catch {
    showToast("Room code: " + client.roomCode, "קוֹד הַחֶדֶר: " + client.roomCode);
  }
});

// ---------- Picking the word deck (in the lobby) ----------

// There are two kinds of rooms:
//   class game (a teacher hosts from the dashboard): the host picks the words for EVERYONE.
//              The referee sends that pick (deckId) to every phone.
//   normal room: the referee always says Auto, and each player picks their OWN level
//              on their own phone. Nobody else sees or is affected by that pick.

const deckSelect = document.getElementById("deck-select");
const deckLabelEl = document.getElementById("deck-label");
const deckProgressEl = document.getElementById("deck-progress");

// (The teacher's class-game pick is made on the dashboard: teacherPickId() in decks.js.)

// My own level for normal rooms, remembered on this phone (Auto if none yet).
let myLevel = AUTO;
try { myLevel = localStorage.getItem("golan-my-level") || AUTO; } catch {}

// My level, but only if it still exists (a deck of mine may have been deleted, or I logged out).
// In a normal room you can only pick Auto or one of the levels: the premade decks
// and "My decks" are teacher tools, for class games only.
function myLevelChoice() {
  return DECKS.some((deck) => deck.id === myLevel) ? myLevel : AUTO;
}

// The deck this phone should be playing right now.
function playedDeckId() {
  if (roomDeckId && roomDeckId !== AUTO) return roomDeckId; // the teacher picked for everyone
  if (client.roomIsClass) return autoDeckId();                // the teacher picked Auto
  const mine = myLevelChoice();                               // a normal room: my own pick
  return mine === AUTO ? autoDeckId() : mine;
}

// Am I on Auto right now? (Then my level moves up and down as I answer.)
function playingAuto() {
  if (roomDeckId !== AUTO) return false;
  return client.roomIsClass || myLevelChoice() === AUTO;
}

// What the lobby's list should show: the room's pick in a class game, my own pick otherwise.
function pickerValue() {
  return client.roomIsClass ? roomDeckId : myLevelChoice();
}

// Fill the list: Auto first, then "My decks" and the premade decks (class games only),
// then every level and review level.
// (An "optgroup" is a labeled section inside a dropdown list.)
function makeDeckGroup(label, decks) {
  const group = document.createElement("optgroup");
  group.label = label;
  for (const deck of decks) {
    const option = document.createElement("option");
    option.value = deck.id;
    option.textContent = `${deckLabel(deck)} · ${deck.hebrew}`;
    group.appendChild(option);
  }
  return group;
}
const autoOption = document.createElement("option");
autoOption.value = AUTO;
autoOption.textContent = "🤖 Auto: a level for each player · אוֹטוֹמָטִי: רָמָה אִישִׁית";
// The premade decks: one section each for themes, key concepts and every verb pattern
// (premadeSections() in words.js).
const premadeGroups = premadeSections().map((section) =>
  makeDeckGroup(`🎯 ${section.english} · ${section.hebrew}`, section.decks));
const levelsGroup = makeDeckGroup("📈 Levels · רָמוֹת", DECKS);
deckSelect.append(autoOption, levelsGroup);

// Premade decks sit between Auto and the levels, but only in a class game.
// (We take whole groups out of the list, because iPhones ignore "hidden" on list items.)
function showPremadeDecks(show) {
  for (const group of premadeGroups) {
    if (show && !group.parentNode) deckSelect.insertBefore(group, levelsGroup);
    if (!show && group.parentNode) group.remove();
  }
}

// Teacher decks go in their own group right under Auto (class games only):
// my own decks (if I'm logged in), plus the room's deck if the host sent one.
const customGroup = document.createElement("optgroup");
customGroup.label = "📚 My decks · הַחֲפִיסוֹת שֶׁלִּי";
let customGroupKey = "";

function refreshDeckOptions() {
  showPremadeDecks(client.roomIsClass);
  const decks = !client.roomIsClass ? [] : [...customDecks.values()].filter((deck) =>
    deck.words.length >= DECK_LIMITS.minWords && (isMyDeck(deck.id) || deck.id === roomDeckId));
  // Only rebuild when something changed (this is called often).
  const key = decks.map((deck) => deck.id + deck.english + deck.words.length).join("|");
  if (key === customGroupKey) return;
  customGroupKey = key;
  customGroup.innerHTML = "";
  for (const deck of decks) {
    const option = document.createElement("option");
    option.value = deck.id;
    option.textContent = `${deckLabel(deck)} (${deck.words.length})`; // textContent: deck names are typed by people
    customGroup.appendChild(option);
  }
  // Right under Auto, so a teacher sees their own decks first.
  if (decks.length > 0 && !customGroup.parentNode) autoOption.after(customGroup);
  if (decks.length === 0 && customGroup.parentNode) customGroup.remove();
  if (roomDeckId) deckSelect.value = pickerValue();
}

// ---------- Getting the host's teacher deck ----------
// A teacher deck only lives on the host's phone, so the referee sends it along.
// If this phone doesn't have it yet (it just joined), ask for it every few seconds until it arrives.
let deckAskedAt = -Infinity;

function receiveRoomDeck(sent) {
  if (!sent || typeof sent.id !== "string" || !sent.id.startsWith(CUSTOM_PREFIX)) return;
  if (client.isHost) return; // the host has its own copy already
  registerCustomDeck(sent.id, sent.name, sent.words);
  if (sent.id === roomDeckId) useDeck(roomDeckId);
  refreshDeckOptions();
}

function askForMissingDeck() {
  if (client.isHost || !roomDeckId || roomDeckId === AUTO || findDeck(roomDeckId)) return;
  const now = performance.now();
  if (now - deckAskedAt < 3000) return;
  deckAskedAt = now;
  sendToHost({ type: "needDeck" });
}

deckSelect.addEventListener("change", () => {
  if (client.roomIsClass) {
    // Class game: the teacher picked for everyone. Tell the referee (who tells everyone).
    try { localStorage.setItem("golan-deck-v2", deckSelect.value); } catch {}
    sendToServer({ type: "deck", deckId: deckSelect.value });
  } else {
    // Normal room: this is just MY level. Nobody else is affected.
    myLevel = deckSelect.value;
    try { localStorage.setItem("golan-my-level", myLevel); } catch {}
    useDeck(playedDeckId());
  }
});

// The room's choice changed (from the referee's snapshot). On Auto, this phone
// plays its own level (or its own pick, in a normal room); otherwise everyone plays the teacher's pick.
function useRoomDeck(deckId) {
  roomDeckId = deckId;
  // (A teacher deck we don't have yet: keep the old words until it arrives. useDeck ignores unknown ids.)
  useDeck(playedDeckId());
  refreshDeckOptions();
}

// quiz.js calls this after every answer. Only does something on Auto.
function autoLevelAnswer(correct, seconds) {
  if (!playingAuto()) return;
  const move = noteAutoAnswer(correct, seconds);
  if (!move) return;
  useDeck(autoDeckId());
  const { number, numberHe } = findDeck(currentDeckId);
  // Wait a moment, so this doesn't cover up "Correct!" or "You earned the Hammer!".
  setTimeout(() => {
    if (move === "up") showToast(`⬆️ Level up! Now level ${number}`, `⬆️ עוֹלִים רָמָה! עַכְשָׁו רָמָה ${numberHe}`);
    else showToast(`⬇️ Back to level ${number} for some practice`, `⬇️ חוֹזְרִים לְרָמָה ${numberHe} לְתַרְגּוּל`);
  }, 2500);
}

function renderDeckPicker() {
  // (Only change things that are different: this runs 20 times a second.)
  refreshDeckOptions(); // the right sections for this kind of room
  const value = pickerValue();
  if (deckSelect.value !== value) deckSelect.value = value;
  // Keep up with the right deck (for example, after logging in here).
  const played = playedDeckId();
  if (currentDeckId !== played) useDeck(played);
  // Class game: only the host (teacher) can change it. Normal room: everyone picks their own.
  const canPick = client.roomIsClass ? client.isHost : true;
  if (deckSelect.disabled !== !canPick) deckSelect.disabled = !canPick;
  let pickNote = "", pickNoteHe = "";
  if (client.roomIsClass) {
    setBilingual(deckLabelEl, "📚 Words for this game", "הַמִּלִּים בַּמִּשְׂחָק");
    setOptionText(autoOption, "🤖 Auto: a level for each player · אוֹטוֹמָטִי: רָמָה אִישִׁית");
    if (!client.isHost) { pickNote = " · The host picks the words"; pickNoteHe = " · הַמְּאָרֵחַ בּוֹחֵר אֶת הַמִּלִּים"; }
  } else {
    setBilingual(deckLabelEl, "📚 Your level (everyone picks their own)", "הָרָמָה שֶׁלִּי (כָּל אֶחָד בּוֹחֵר לְעַצְמוֹ)");
    setOptionText(autoOption, "🤖 Auto (my level) · אוֹטוֹמָטִי");
  }
  updateDeckDropdown();
  const deck = findDeck(currentDeckId);
  const { known, total } = deckProgress(deck);
  if (playingAuto()) {
    setBilingual(deckProgressEl,
      `Your level: ${deckLabel(deck)} · You know ${known} of ${total} well`,
      `רָמָה נוֹכְחִית: ${deck.numberHe} · ${known} מִתּוֹךְ ${total} יְדוּעוֹת הֵיטֵב`);
  } else {
    setBilingual(deckProgressEl,
      `You know ${known} of ${total} well${pickNote}`,
      `${known} מִתּוֹךְ ${total} יְדוּעוֹת הֵיטֵב${pickNoteHe}`);
  }
}

// Change a dropdown option's words, only if they're different (renderDeckPicker runs a lot).
function setOptionText(option, text) {
  if (option.textContent !== text) option.textContent = text;
}

// ---------- Our own dropdown for the word list ----------
// A phone's built-in list covers the whole screen, so we draw our own: a button that
// opens a short scrolling list right under it. The hidden <select> still holds the
// choice, so everything above keeps working with deckSelect as before.

const dropdownButton = document.getElementById("deck-dropdown-button");
const dropdownText = document.getElementById("deck-dropdown-text");
const dropdownList = document.getElementById("deck-dropdown-list");

// Keep the button in step with the hidden <select> (its words, and whether you can tap it).
function updateDeckDropdown() {
  const option = deckSelect.selectedOptions[0];
  const text = option ? option.textContent : "";
  if (dropdownText.textContent !== text) dropdownText.textContent = text;
  if (dropdownButton.disabled !== deckSelect.disabled) dropdownButton.disabled = deckSelect.disabled;
  if (deckSelect.disabled) closeDeckDropdown();
}

// Copy the <select>'s sections and options into our list.
function buildDeckDropdown() {
  dropdownList.textContent = "";
  const addItem = (option) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "dropdown-item" + (option.value === deckSelect.value ? " picked" : "");
    item.setAttribute("role", "option");
    item.textContent = option.textContent; // textContent: teacher deck names are typed by people
    item.addEventListener("click", () => chooseFromDropdown(option.value));
    dropdownList.appendChild(item);
  };
  for (const child of deckSelect.children) {
    if (child.tagName === "OPTGROUP") {
      const heading = document.createElement("div");
      heading.className = "dropdown-heading";
      heading.textContent = child.label;
      dropdownList.appendChild(heading);
      for (const option of child.children) addItem(option);
    } else {
      addItem(child);
    }
  }
}

function openDeckDropdown() {
  buildDeckDropdown();
  dropdownList.hidden = false;
  dropdownButton.setAttribute("aria-expanded", "true");
  // Scroll the list so the current choice is showing.
  const picked = dropdownList.querySelector(".picked");
  if (picked) dropdownList.scrollTop = picked.offsetTop - dropdownList.clientHeight / 2;
}

function closeDeckDropdown() {
  if (dropdownList.hidden) return;
  dropdownList.hidden = true;
  dropdownButton.setAttribute("aria-expanded", "false");
}

// Picked something: put it in the hidden <select>, and let its "change" code do the rest.
function chooseFromDropdown(value) {
  closeDeckDropdown();
  if (value === deckSelect.value) return;
  deckSelect.value = value;
  deckSelect.dispatchEvent(new Event("change"));
  updateDeckDropdown();
}

dropdownButton.addEventListener("click", () => {
  if (dropdownList.hidden) openDeckDropdown();
  else closeDeckDropdown();
});
// Tapping anywhere else closes the list.
document.addEventListener("pointerdown", (event) => {
  if (!dropdownList.hidden && !dropdownList.contains(event.target) && !dropdownButton.contains(event.target)) {
    closeDeckDropdown();
  }
});

function renderLobby(hostId) {
  document.getElementById("lobby-code").textContent = client.roomCode;
  renderDeckPicker();
  for (const team of ["blue", "red"]) {
    const list = document.getElementById(team + "-list");
    list.innerHTML = "";
    for (const p of Object.values(players)) {
      if (p.team !== team) continue;
      const item = document.createElement("li");
      // textContent (not innerHTML) so a weird nickname can't break the page.
      item.textContent = (p.id === hostId ? "👑 " : "") + p.name + (p.id === client.myId ? " — you · אֲנִי" : "");
      list.appendChild(item);
    }
  }
  startButton.hidden = !client.isHost;
  lobbyWait.hidden = client.isHost;
}

// ---------- Receiving the referee's snapshots ----------

function applySnapshot(snap) {
  client.lastSnapshotAt = performance.now();

  // Keep our clock in step with the referee's clock.
  const clockJump = Math.abs(snap.time - gameTime);
  if (clockJump > 2) resetTimers(); // a new room, or back from sleep: old timers mean nothing now
  if (clockJump > 0.3) gameTime = snap.time;
  else gameTime += (snap.time - gameTime) * 0.1;

  // Players: add new ones, update existing ones, remove ones who left.
  const stillHere = new Set();
  for (const sp of snap.players) {
    stillHere.add(sp.id);
    const p = players[sp.id];
    if (!p) {
      players[sp.id] = { ...sp, targetX: sp.x, targetY: sp.y };
      continue;
    }
    const teleported = sp.spawnCount !== p.spawnCount;
    if (sp.id === client.myId && sp.hp < p.hp) hurtAt = gameTime; // ouch! (shake + red flash)
    const { x, y, facing, moving, ...everythingElse } = sp;
    Object.assign(p, everythingElse);
    if (sp.id === client.myId) {
      // MY position is decided by this phone (so walking feels instant),
      // except when the referee teleports me (game start or respawn).
      if (teleported) Object.assign(p, { x, y, facing });
      // Just tapped the toolbar? Keep my pick until the referee has caught up.
      if (performance.now() - myHeldAt < HELD_TRUST_MS && (myHeld === null || (p.items || []).includes(myHeld))) p.held = myHeld;
      // Knocked out = everything bought is gone, including half-paid progress.
      if (!p.alive) shopPaid = {};
    } else {
      // Other players: glide smoothly toward where the referee says they are.
      Object.assign(p, { targetX: x, targetY: y, facing, moving });
      if (teleported) Object.assign(p, { x, y });
    }
  }
  for (const id of Object.keys(players)) {
    if (!stillHere.has(id)) delete players[id];
  }

  // Not in the game any more? (The referee removes phones it hasn't heard from in
  // 8 seconds, like when you switch apps.) Ask to join again: you come back at your
  // base like after a knockout, on the same team.
  if (!client.isHost && client.myId && !stillHere.has(client.myId) && performance.now() - client.joinSentAt > 2000) {
    client.joinSentAt = performance.now();
    resetTimers();
    sendToHost({ type: "join", name: client.name });
  }

  // Is this a class game (the teacher picks the words) or a normal room (everyone picks their own)?
  client.roomIsClass = Boolean(snap.classGame);

  // A teacher deck sent by the host? (Before switching, so it's ready to use.)
  for (const e of snap.events) {
    if (e.kind === "deck") receiveRoomDeck(e.deck);
  }
  // The host picked different words (or Auto)? Switch this phone's questions.
  if (snap.deckId && snap.deckId !== roomDeckId) useRoomDeck(snap.deckId);
  askForMissingDeck();

  flags = snap.flags;
  score = snap.score;
  speedBox = snap.speedBox;
  berries = snap.berries || null;
  // Flying things: remember WHEN we heard about them, so drawing can slide them forward until the next snapshot.
  shots = (snap.shots || []).map((s) => ({ ...s, seenAt: gameTime }));
  mines = snap.mines || [];
  trees = snap.trees || [];
  syncTreeLogs();
  client.winner = snap.winner;

  // Things that just happened: messages, damage numbers, shockwaves.
  for (const e of snap.events) {
    if (e.kind === "toast") {
      if (e.to === "all" || e.to === client.myId) showToast(e.text, e.he);
    } else if (e.kind === "deck") {
      // (handled above)
    } else {
      effects.push({ ...e, born: gameTime });
      if (e.sound && isNearMe(e)) playSound(e.sound);
    }
  }

  if (snap.phase !== client.phase) changePhase(snap.phase);
  if (client.phase === "lobby") renderLobby(snap.hostId);
}

// Only play sounds for things happening near me (not across the whole map).
function isNearMe(event) {
  const me = myPlayer();
  return !me || Math.hypot(event.x - me.x, event.y - me.y) < 900;
}

function changePhase(phase) {
  client.phase = phase;
  resetStick();
  cancelAim();
  closeDeckDropdown(); // (in case the word list was open when the battle started)
  if (phase === "lobby") {
    winnerEl.hidden = true; // (coming back after a game ended)
    showScreen("lobby");
  } else if (phase === "playing") {
    showScreen(null);
    winnerEl.hidden = true;
    rockPassUntil = 0;
    shopPaid = {};   // a new game: half-paid items start from zero
    myHeld = null;
    answeredFreezeId = 0;
    lockSideways(); // Android in full screen: the game turns sideways by itself
    // Still upright after a moment (iPhones can't be turned by the game)? Show the big card.
    setTimeout(showRotateTip, 1200);
  } else if (phase === "over") {
    closeQuiz();
    shopEl.hidden = true;
    showWinner();
    playSound("win");
  }
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

// ---------- Moving my player each frame ----------

let lastMoveSent = 0;
let lastPingSent = 0;

// `dt` = "delta time": seconds since the last frame (usually about 0.016).
function update(dt) {
  // Remove finished effects. (Going backwards makes removing safe.)
  for (let i = effects.length - 1; i >= 0; i--) {
    if (gameTime - effects[i].born > effects[i].life) effects.splice(i, 1);
  }

  // Other players glide toward their latest known position, so they don't jerk around.
  const glide = Math.min(1, dt * 12);
  for (const p of Object.values(players)) {
    if (p.id !== client.myId) {
      p.x += (p.targetX - p.x) * glide;
      p.y += (p.targetY - p.y) * glide;
    }
    p.inWater = isInWater(p.x, p.y);
    p.inBush = isInBush(p.x, p.y);
  }

  const now = performance.now();

  // Joiners: if the host has gone quiet for 6 seconds, the game is over.
  if (!client.isHost && client.phase !== "home" && now - client.lastSnapshotAt > 6000) {
    backToHome("Lost connection to the host.", "הַחִבּוּר לַמְּאָרֵחַ נִתַּק.");
    return;
  }
  // Joiners: tell the host "I'm still here" once a second.
  if (!client.isHost && client.phase !== "home" && now - lastPingSent > 1000) {
    lastPingSent = now;
    sendToHost({ type: "ping" });
  }

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

// ---------- Drawing each frame ----------

const waterChip = document.getElementById("water-chip");
const bushChip = document.getElementById("bush-chip");
const logChip = document.getElementById("log-chip");
const weaponChip = document.getElementById("weapon-chip");
const carryChip = document.getElementById("carry-chip");
const boostChip = document.getElementById("boost-chip");
const berryChip = document.getElementById("berry-chip");
const koMessage = document.getElementById("ko-message");

function render() {
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

  updateHud(me);
}

// ---------- Sound button ----------

const muteButton = document.getElementById("mute-button");
const hurtFlash = document.getElementById("hurt-flash");
muteButton.textContent = muted ? "🔇" : "🔊";
muteButton.addEventListener("click", () => {
  muteButton.textContent = toggleMute() ? "🔇" : "🔊";
});

// Voice button: turns the words read out loud on or off (sound effects stay as they are).
const voiceButton = document.getElementById("voice-button");
function updateVoiceButton() {
  voiceButton.textContent = "🗣️";
  voiceButton.style.opacity = voiceOn ? "1" : "0.4";   // faded = voice off
}
updateVoiceButton();
voiceButton.addEventListener("click", () => {
  toggleVoice();
  updateVoiceButton();
  if (voiceOn) showToast("🗣️ Voice on", "הַקּוֹל פּוֹעֵל");
  else showToast("🤐 Voice off", "הַקּוֹל כָּבוּי");
});

const sideTags = document.getElementById("side-tags");
const levelTag = document.getElementById("level-tag");
const roomTag = document.getElementById("room-tag");
const leaveButton = document.getElementById("leave-button");

function updateHud(p) {
  const playing = client.phase === "playing" && p;
  hudEl.hidden = !playing;
  muteButton.hidden = !playing;
  voiceButton.hidden = !playing;
  leaveButton.hidden = !playing;
  fullscreenButton.hidden = !playing || !canFullscreen;
  sideTags.hidden = !playing;
  joystickBase.hidden = !playing; // the joystick shows whenever you're in a game
  if (!playing) {
    for (const b of [shopButton, flagButton, attackButton, throwButton]) b.hidden = true;
    toolbarEl.hidden = true;
    koMessage.hidden = true;
    return;
  }

  // The level you're on right now (it changes by itself on Auto).
  const deck = findDeck(currentDeckId);
  setBilingual(levelTag, `Level ${deck.number}`, `רָמָה ${deck.numberHe}`);
  // The room code, so you can tell a friend who closed the game by accident.
  setBilingual(roomTag, `Room ${client.roomCode}`, `חֶדֶר ${client.roomCode}`);

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

// ---------- The game loop ----------
// About 60 times a second: (host only) run the referee, then move, then draw.

let lastTime = performance.now();
let lastBroadcast = 0;
function loop(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.05); // cap it so a slow frame can't teleport you
  lastTime = now;
  gameTime += dt;

  if (client.isHost) {
    serverUpdate(dt);
    // Send everyone (including this phone) a snapshot 20 times a second.
    if (now - lastBroadcast > 50) {
      lastBroadcast = now;
      const snapshot = serverSnapshot();
      broadcast(snapshot);
      applySnapshot(snapshot);
    }
  }

  update(dt);
  render();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
