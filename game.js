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
};

// Everything below gets filled in from the referee's snapshots.
const players = {};   // every player, by id
let flags = null;
let score = { blue: 0, red: 0 };
let speedBox = null;
const effects = [];   // shockwave rings and floating numbers

let rockPassUntil = 0; // until this time, I can walk through rocks (after answering a rock question)
let hurtAt = -10;      // when I last took damage (for the screen shake and red flash)

function myPlayer() {
  return players[client.myId];
}

// Send a message to the referee. If I'm the host, the referee is right here on this phone.
function sendToServer(msg) {
  if (client.isHost) serverHandle(client.myId, msg);
  else sendToHost(msg);
}

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
  return quiz.open || !shopEl.hidden || client.phase !== "playing" || !p || !p.alive;
}

// ---------- Keyboard controls ----------

const keysDown = new Set();
window.addEventListener("keydown", (event) => {
  if (event.target.tagName === "INPUT") return; // typing your nickname, not playing
  const key = event.key.toLowerCase();
  keysDown.add(key);
  if (key === " ") {
    event.preventDefault(); // stops Space from also "clicking" whatever button was last pressed
    swingHammer();
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
// Put your thumb anywhere on the left half of the screen. That spot becomes the
// center of the joystick, and dragging away from it moves the player that way.

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
  joystickBase.hidden = false;
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
  joystickBase.hidden = true;
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

const toastEl = document.getElementById("toast");
let toastTimer = null;
function showToast(message) {
  toastEl.textContent = message;
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.hidden = true; }, 2800);
}

// ---------- Home screen ----------

const homeEl = document.getElementById("home");
const lobbyEl = document.getElementById("lobby");
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
const roomFromLink = new URLSearchParams(location.search).get("room");
if (roomFromLink) {
  codeInput.value = roomFromLink.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4);
  setTimeout(() => setHomeMessage("You've been invited! Type your nickname and tap Join.", true), 0);
}

function setHomeMessage(text, isInfo) {
  homeMessage.textContent = text || "";
  homeMessage.classList.toggle("info", Boolean(isInfo));
}

function setHomeButtons(enabled) {
  createButton.disabled = !enabled;
  joinButton.disabled = !enabled;
}

function readNickname() {
  const name = nameInput.value.trim();
  if (!name) {
    setHomeMessage("Type a nickname first 🙂");
    nameInput.focus();
    return null;
  }
  try { localStorage.setItem("golan-nickname", name); } catch {}
  return name;
}

createButton.addEventListener("click", () => {
  const name = readNickname();
  if (!name) return;
  setHomeButtons(false);
  setHomeMessage("Creating a room…", true);
  hostRoom({
    onReady: (code, myId) => {
      client.isHost = true;
      client.myId = myId;
      client.roomCode = code;
      serverReset(myId);
      serverAddPlayer(myId, name);
      applySnapshot(serverSnapshot());
    },
    onMessage: (id, msg) => serverHandle(id, msg),
    onLeave: (id) => serverRemovePlayer(id),
    onError: (text) => {
      setHomeButtons(true);
      setHomeMessage(text);
    },
  });
});

joinButton.addEventListener("click", () => {
  const name = readNickname();
  if (!name) return;
  const code = codeInput.value.trim();
  if (code.length !== 4) {
    setHomeMessage("Room codes have 4 letters.");
    codeInput.focus();
    return;
  }
  setHomeButtons(false);
  setHomeMessage("Joining…", true);
  joinRoom(code, {
    onConnected: (myId) => {
      client.myId = myId;
      client.roomCode = code;
      client.lastSnapshotAt = performance.now();
      sendToHost({ type: "join", name });
    },
    onMessage: (msg) => {
      if (msg && msg.type === "state") applySnapshot(msg);
    },
    onClose: () => backToHome("The host left the game."),
    onError: (text) => {
      setHomeButtons(true);
      setHomeMessage(text);
    },
  });
});

// Leave the game and go back to the home screen.
function backToHome(message) {
  disconnect();
  client.isHost = false;
  client.myId = null;
  client.phase = "home";
  for (const id of Object.keys(players)) delete players[id];
  flags = null;
  speedBox = null;
  closeQuiz();
  shopEl.hidden = true;
  winnerEl.hidden = true;
  showScreen("home");
  setHomeButtons(true);
  setHomeMessage(message);
}

// Show one full-screen panel (or none, while playing).
function showScreen(name) {
  homeEl.hidden = name !== "home";
  lobbyEl.hidden = name !== "lobby";
}

// ---------- Lobby ----------

const startButton = document.getElementById("start-button");
const lobbyWait = document.getElementById("lobby-wait");

document.getElementById("switch-team").addEventListener("click", () => {
  const p = myPlayer();
  if (p) sendToServer({ type: "team", team: otherTeam(p.team) });
});
startButton.addEventListener("click", () => sendToServer({ type: "start" }));

// Share a link that opens the game with the room code already filled in.
document.getElementById("invite-button").addEventListener("click", async () => {
  const link = location.origin + location.pathname + "?room=" + client.roomCode;
  try {
    if (navigator.share) {
      await navigator.share({ title: "Battle of the Golan", text: "Join my game! Room code: " + client.roomCode, url: link });
    } else {
      await navigator.clipboard.writeText(link);
      showToast("📋 Invite link copied! Paste it to your friends.");
    }
  } catch {
    showToast("Room code: " + client.roomCode);
  }
});

function renderLobby(hostId) {
  document.getElementById("lobby-code").textContent = client.roomCode;
  for (const team of ["blue", "red"]) {
    const list = document.getElementById(team + "-list");
    list.innerHTML = "";
    for (const p of Object.values(players)) {
      if (p.team !== team) continue;
      const item = document.createElement("li");
      // textContent (not innerHTML) so a weird nickname can't break the page.
      item.textContent = (p.id === hostId ? "👑 " : "") + p.name + (p.id === client.myId ? " (you)" : "");
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
  if (Math.abs(snap.time - gameTime) > 0.3) gameTime = snap.time;
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
    } else {
      // Other players: glide smoothly toward where the referee says they are.
      Object.assign(p, { targetX: x, targetY: y, facing, moving });
      if (teleported) Object.assign(p, { x, y });
    }
  }
  for (const id of Object.keys(players)) {
    if (!stillHere.has(id)) delete players[id];
  }

  flags = snap.flags;
  score = snap.score;
  speedBox = snap.speedBox;
  client.winner = snap.winner;

  // Things that just happened: messages, damage numbers, shockwaves.
  for (const e of snap.events) {
    if (e.kind === "toast") {
      if (e.to === "all" || e.to === client.myId) showToast(e.text);
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
  if (phase === "lobby") {
    showScreen("lobby");
  } else if (phase === "playing") {
    showScreen(null);
    winnerEl.hidden = true;
    rockPassUntil = 0;
    if (window.innerHeight > window.innerWidth) {
      setTimeout(() => showToast("📱 Tip: turn your phone sideways to see more of the map!"), 3000);
    }
  } else if (phase === "over") {
    closeQuiz();
    shopEl.hidden = true;
    showWinner();
    playSound("win");
  }
}

// ---------- The shop ----------

const shopEl = document.getElementById("shop");
const shopButton = document.getElementById("shop-button");
const buyHammerButton = document.getElementById("buy-hammer");
const hammerStatus = document.getElementById("hammer-status");

function tryOpenShop() {
  const p = myPlayer();
  if (!p || isBusy() || !nearShop(p)) return;
  resetStick(); // shopping means standing still
  const owned = p.weapon === "hammer";
  buyHammerButton.disabled = owned;
  hammerStatus.textContent = owned ? "Owned ✓" : "1 question";
  shopEl.hidden = false;
}

onPress(shopButton, tryOpenShop);
document.getElementById("shop-close").addEventListener("click", () => { shopEl.hidden = true; });

buyHammerButton.addEventListener("click", () => {
  const p = myPlayer();
  if (!p || p.weapon === "hammer") return;
  shopEl.hidden = true;
  openQuiz({
    title: "🔨 Answer correctly to earn the Hammer",
    onCorrect: () => {
      sendToServer({ type: "buy", item: "hammer" });
      showToast("🔨 You earned the Hammer! Tap Hit to swing it.");
    },
  });
});

// ---------- The hammer ----------

const attackButton = document.getElementById("attack-button");
onPress(attackButton, swingHammer);

function canAttack(p) {
  return p && p.weapon === "hammer" && !isBusy() && !p.carrying;
}

function swingHammer() {
  const p = myPlayer();
  if (!canAttack(p)) return;
  if (gameTime - p.lastSwing < HAMMER.cooldown) return; // still cooling down
  p.lastSwing = gameTime; // start the swing animation right away
  sendToServer({ type: "swing" });
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
  openQuiz({
    title: `🚩 Answer correctly to grab the ${TEAM_NAMES[flag.team]} flag`,
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
    closable: false,
    onCorrect: () => {
      rockPassUntil = gameTime + ROCK_PASS_TIME;
      showToast(`🪨 You can walk through rocks for ${ROCK_PASS_TIME} seconds!`);
    },
  });
}

// ---------- Winner screen ----------

const winnerEl = document.getElementById("winner");

function showWinner() {
  resetStick();
  document.getElementById("winner-title").textContent = `${TEAM_NAMES[client.winner]} team wins!`;
  document.getElementById("winner-score").textContent = `Final score: Blue ${score.blue} – ${score.red} Red`;
  document.getElementById("play-again").hidden = !client.isHost;
  document.getElementById("winner-wait").hidden = client.isHost;
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

document.getElementById("play-again").addEventListener("click", () => sendToServer({ type: "start" }));

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
    backToHome("Lost connection to the host.");
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
    return;
  }

  if (isBusy()) {
    p.moving = false;
  } else {
    const keys = keyboardDirection();
    let dx = stick.x + keys.x;
    let dy = stick.y + keys.y;
    const amount = Math.hypot(dx, dy);
    if (amount > 1) {
      dx /= amount;
      dy /= amount;
    }

    // Work out speed. Each thing multiplies it:
    //   river ×0.1   bush ×0.3   carrying a flag ×0.7   speed boost ×1.5
    let speed = PLAYER_SPEED;
    if (p.inWater) speed *= MAP.waterSlowdown;
    else if (p.inBush) speed *= MAP.bushSlowdown;
    if (p.carrying) speed *= CARRY_SLOWDOWN;
    if (p.boostUntil > gameTime) speed *= SPEED_BOOST.multiplier;

    const oldX = p.x;
    const oldY = p.y;
    p.x += dx * speed * dt;
    p.y += dy * speed * dt;
    checkRocks(p, oldX, oldY);
    clampToMap(p);
    p.moving = amount > 0.1;
    if (p.moving) p.facing = Math.atan2(dy, dx);
  }

  // Tell the referee where I am, 20 times a second.
  if (now - lastMoveSent > 50) {
    lastMoveSent = now;
    sendToServer({ type: "move", x: p.x, y: p.y, facing: p.facing, moving: p.moving });
  }
}

// ---------- Drawing each frame ----------

const waterChip = document.getElementById("water-chip");
const bushChip = document.getElementById("bush-chip");
const weaponChip = document.getElementById("weapon-chip");
const carryChip = document.getElementById("carry-chip");
const boostChip = document.getElementById("boost-chip");
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
      if (p.carrying) drawCarriedFlag(ctx, p, p.carrying, gameTime);
      drawPlayer(ctx, p, gameTime, p.id === client.myId);
    }
  }
  drawBushes(ctx);
  drawEffects(ctx, effects, gameTime);

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

function updateHud(p) {
  const playing = client.phase === "playing" && p;
  hudEl.hidden = !playing;
  muteButton.hidden = !playing;
  if (!playing) {
    for (const b of [shopButton, flagButton, attackButton]) b.hidden = true;
    koMessage.hidden = true;
    return;
  }

  document.getElementById("score-blue").textContent = score.blue;
  document.getElementById("score-red").textContent = score.red;
  waterChip.hidden = !p.inWater || !p.alive;
  bushChip.hidden = !p.inBush || !p.alive;
  weaponChip.textContent = p.weapon === "hammer" ? "🔨 Hammer" : "✋ No weapon";

  carryChip.hidden = !p.carrying;
  if (p.carrying) {
    carryChip.textContent = p.carrying === p.team
      ? "🚩 Carrying your flag — take it home!"
      : `🚩 Carrying the ${TEAM_NAMES[p.carrying]} flag — run home!`;
  }

  const boostLeft = Math.ceil(p.boostUntil - gameTime);
  boostChip.hidden = boostLeft <= 0;
  boostChip.textContent = `⚡ Speed boost ${boostLeft}s`;

  koMessage.hidden = p.alive;
  if (!p.alive) {
    const secondsLeft = Math.max(1, Math.ceil(p.respawnAt - gameTime));
    koMessage.textContent = `💥 Knocked out! Back in ${secondsLeft}…`;
  }

  shopButton.hidden = isBusy() || !nearShop(p);
  attackButton.hidden = !canAttack(p);
  attackButton.classList.toggle("cooling", gameTime - p.lastSwing < HAMMER.cooldown);
  flagButton.hidden = isBusy() || !(p.carrying || grabbableFlag(p));
  flagButtonLabel.textContent = p.carrying ? "Drop" : "Grab";
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
