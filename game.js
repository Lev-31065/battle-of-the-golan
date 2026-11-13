// game.js — runs on EVERY phone.
//
// This is the SHARED part that every game uses: the home screen, rooms, the lobby,
// picking words, the joystick and keyboard, messages, and the game loop.
// Everything special to one game (like the shop and flags in Capture the Flag) is in
// that game's own file (ctf-game.js). Each game file adds itself to PHONE_GAMES, and
// this file asks it what to do (see phoneGame() below).
// Important decisions (hits, flags, score) are made by the referee in server.js,
// which only runs on the host's phone. Phones just ask the referee
// ("I swung my hammer!") and draw whatever the referee says happened.

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
  mode: "ctf",         // which game the room is playing (the referee says so)
};

// Every player, by id. Filled in from the referee's snapshots.
const players = {};

// ---------- The games ----------
// Each game's phone file adds itself here: PHONE_GAMES.ctf = { ... } (in ctf-game.js).
// A game answers these questions from the shared code:
//   resetTimers()        forget every "until this time" timer (the clock jumped)
//   clear()              left the room: forget everything about the game
//   onKey(key, event)    a key was pressed during the game (Space, number keys…)
//   applySnapshot(snap)  the referee sent the game's own things (flags, score…)
//   onEvent(e)           something happened (not a message): a hit, a floating number…
//   onPhase(phase)       the game started ("playing"), ended ("over") or went back to "lobby"
//   update(dt)           one frame: move my player
//   render()             draw the screen
//   updateHud(p)         the game's own buttons and labels on top of the map (p = me)
// And two settings for the lobby:
//   teams: false         no blue and red teams: the lobby shows one list of players
//   startText            the host's Start button: { en: "Start the battle!", he: "…" }
// (Anything in index.html marked data-modes="ctf race" only shows for those games.)
const PHONE_GAMES = {};

// The game this room is playing.
function phoneGame() {
  return PHONE_GAMES[client.mode] || PHONE_GAMES.ctf;
}

// Forget every "until this time" timer. Needed when the game clock jumps (joining a
// different room, or coming back after the phone slept): each room has its own clock,
// so an old "I got hit at second 900" would look like it's still happening in a room
// whose clock is at second 50 (the whole screen stayed red and shaking).
function resetTimers() {
  phoneGame().resetTimers();
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
// (Not full screen any more? It asks for full screen first, then turns sideways.)
function lockSideways() {
  try {
    if (!screen.orientation || !screen.orientation.lock) return;
    const lock = () => {
      const result = screen.orientation.lock("landscape");
      if (result && result.catch) result.catch(() => {}); // the phone said no: the card will show
    };
    if (isFullscreen()) { lock(); return; }
    if (!canFullscreen) return;
    const result = (page.requestFullscreen || page.webkitRequestFullscreen).call(page);
    if (result && result.then) result.then(lock, () => {});
  } catch {}
}
// Phones only allow this right after a tap. So any tap while the game is on and the phone
// is still upright tries again, and so does the host's tap on "Start".
window.addEventListener("pointerdown", (event) => {
  if (window.innerHeight <= window.innerWidth) return;
  if (client.phase === "playing" || event.target.closest("#start-button")) lockSideways();
}, true);
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

// ---------- Keyboard controls ----------

const keysDown = new Set();
window.addEventListener("keydown", (event) => {
  if (event.target.tagName === "INPUT") return; // typing your nickname, not playing
  const key = event.key.toLowerCase();
  keysDown.add(key);
  if (key === " ") event.preventDefault(); // stops Space from also "clicking" whatever button was last pressed
  phoneGame().onKey(key, event); // the game's own keys (Space, number keys…)
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
  roomDeckId = null; // the next room will tell us its words
  phoneGame().clear(); // forget the game (and close its popups)
  closeQuiz();
  leaveEl.hidden = true;
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
  const game = phoneGame();
  // Show only the parts of the lobby that belong to this game (data-modes in index.html).
  for (const el of lobbyEl.querySelectorAll("[data-modes]")) {
    const show = el.dataset.modes.split(" ").includes(client.mode);
    if (el.hidden === show) el.hidden = !show;
  }
  // The player lists: blue and red teams, or one list for a game without teams.
  const lists = game.teams === false ? [["racer-list", () => true]]
    : [["blue-list", (p) => p.team === "blue"], ["red-list", (p) => p.team === "red"]];
  for (const [listId, belongs] of lists) {
    const list = document.getElementById(listId);
    list.innerHTML = "";
    for (const p of Object.values(players)) {
      if (!belongs(p)) continue;
      const item = document.createElement("li");
      // textContent (not innerHTML) so a weird nickname can't break the page.
      item.textContent = (p.id === hostId ? "👑 " : "") + p.name + (p.id === client.myId ? " — you · אֲנִי" : "");
      list.appendChild(item);
    }
  }
  if (game.startText) setBilingual(startButton, game.startText.en, game.startText.he);
  startButton.hidden = !client.isHost;
  lobbyWait.hidden = client.isHost;
}

// ---------- Receiving the referee's snapshots ----------

function applySnapshot(snap) {
  client.lastSnapshotAt = performance.now();
  client.mode = snap.mode || "ctf"; // which game this room is playing

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
    const { x, y, facing, moving, ...everythingElse } = sp;
    Object.assign(p, everythingElse);
    if (sp.id === client.myId) {
      // MY position is decided by this phone (so walking feels instant),
      // except when the referee teleports me (game start or respawn).
      if (teleported) Object.assign(p, { x, y, facing });
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

  client.winner = snap.winner;
  phoneGame().applySnapshot(snap); // the game's own things (flags, score…)

  // Things that just happened: messages for us, anything else for the game (damage numbers, shockwaves…).
  for (const e of snap.events) {
    if (e.kind === "toast") {
      if (e.to === "all" || e.to === client.myId) showToast(e.text, e.he);
    } else if (e.kind === "deck") {
      // (handled above)
    } else {
      phoneGame().onEvent(e);
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
  closeDeckDropdown(); // (in case the word list was open when the battle started)
  if (phase === "lobby") {
    showScreen("lobby");
  } else if (phase === "playing") {
    showScreen(null);
    lockSideways(); // Android in full screen: the game turns sideways by itself
    // Still upright after a moment (iPhones can't be turned by the game)? Show the big card.
    setTimeout(showRotateTip, 1200);
  } else if (phase === "over") {
    closeQuiz();
    playSound("win");
  }
  phoneGame().onPhase(phase); // the game gets ready, or shows who won
}

// ---------- Every frame ----------

let lastPingSent = 0;

// `dt` = "delta time": seconds since the last frame (usually about 0.016).
function update(dt) {
  // Other players glide toward their latest known position, so they don't jerk around.
  const glide = Math.min(1, dt * 12);
  for (const p of Object.values(players)) {
    if (p.id !== client.myId) {
      p.x += (p.targetX - p.x) * glide;
      p.y += (p.targetY - p.y) * glide;
    }
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

  phoneGame().update(dt); // the game moves my player
}

// ---------- Sound button ----------

const muteButton = document.getElementById("mute-button");
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
  if (playing) {
    // The level you're on right now (it changes by itself on Auto).
    const deck = findDeck(currentDeckId);
    setBilingual(levelTag, `Level ${deck.number}`, `רָמָה ${deck.numberHe}`);
    // The room code, so you can tell a friend who closed the game by accident.
    setBilingual(roomTag, `Room ${client.roomCode}`, `חֶדֶר ${client.roomCode}`);
  }
  // Buttons that belong to one game only (data-game-button="race") hide in the others.
  for (const button of document.querySelectorAll("[data-game-button]")) {
    if (button.dataset.gameButton !== client.mode) button.hidden = true;
  }
  phoneGame().updateHud(p, Boolean(playing)); // the game's own buttons and labels
}

// ---------- The game loop ----------
// About 60 times a second: (host only) run the referee, then move, then draw.

// Draw the screen: the game draws its own picture, then the buttons and labels on top.
function render() {
  phoneGame().render();
  updateHud(myPlayer());
}

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
// Start the loop once EVERY file has loaded (the game's own file, like ctf-game.js, loads after this one).
document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(loop));

// ---------- Keeping the screen on ----------
// A phone dims and locks its screen when nobody touches it for a while. That is exactly
// what happens with tilt steering (you never touch the screen!), and a host whose phone
// falls asleep closes the room for everyone. So while you're in a room, we ask the phone to
// stay awake (a "wake lock"). The phone drops it whenever you leave the page, so we keep
// checking, and ask again when you come back. (Very old phones can't do this.)
let screenLock = null;       // the phone's promise to stay awake (null = we don't have one)
let askingForScreenLock = false;
function keepScreenAwake() {
  if (!("wakeLock" in navigator)) return;
  const wanted = Boolean(client.roomCode) && document.visibilityState === "visible";
  if (wanted && !screenLock && !askingForScreenLock) {
    askingForScreenLock = true;
    navigator.wakeLock.request("screen").then((lock) => {
      screenLock = lock;
      lock.addEventListener("release", () => { if (screenLock === lock) screenLock = null; });
    }).catch(() => {}).then(() => { askingForScreenLock = false; });
  } else if (!wanted && screenLock) {
    screenLock.release().catch(() => {});
    screenLock = null;
  }
}
setInterval(keepScreenAwake, 2000);
document.addEventListener("visibilitychange", keepScreenAwake);
