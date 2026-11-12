// race-game.js — Mt Hermon Racing on the phone: steering my sled, speeding up and
// slowing down, crashing into trees, the countdown, and the winner screen.
//
// The sled goes forward by itself. Hold the left half of the screen to steer left,
// the right half to steer right (or use the arrow keys / A and D on a computer).
// The drawing is in race-draw.js and the track in race-track.js.
// The referee's side is race-server.js. (The questions game.js asks are at the bottom: PHONE_GAMES.race.)

let raceInfo = { startAt: Infinity, finishers: [] }; // from the referee
let mySpeed = 0;          // how fast my sled is going (track units per second)
let mySteer = 0;          // my steering, smoothed (for tilting the sled)
let raceTurn = 0;         // goes up and down as the track turns (slides the mountains)
let crashAt = -Infinity;  // when I last hit a tree (for the screen shake)
let lastRaceSend = -Infinity; // when I last told the referee where I am (game clock)
let lastCountdown = null; // the last countdown number I beeped for
let myFinishedPlace = 0;  // my place once I've crossed the finish line (0 = still racing)
let inDeepSnow = false;
const snowPuffs = [];     // snow spraying up behind my sled (on the screen only)
let mySledSize = 100;     // how wide my sled is on the screen, in pixels (set while drawing)
const raceWinnerEl = document.getElementById("winner");

// ---------- Steering ----------
// Every finger on the screen counts: left half = -1 (left), right half = 1 (right).
// A finger can slide across the middle to switch sides.
const steerFingers = new Map(); // finger (pointer id) → -1 or 1

function sideOfScreen(event) {
  return event.clientX < window.innerWidth / 2 ? -1 : 1;
}
// Only touches on the game itself steer, not on buttons or popups.
function isOnTheTrack(target) {
  return !target.closest("button, .overlay, .screen, a, input, select");
}
window.addEventListener("pointerdown", (event) => {
  if (client.mode !== "race" || client.phase !== "playing" || !isOnTheTrack(event.target)) return;
  steerFingers.set(event.pointerId, sideOfScreen(event));
});
window.addEventListener("pointermove", (event) => {
  if (steerFingers.has(event.pointerId)) steerFingers.set(event.pointerId, sideOfScreen(event));
});
for (const type of ["pointerup", "pointercancel"]) {
  window.addEventListener(type, (event) => steerFingers.delete(event.pointerId));
}

// -1 = full left, 0 = straight, 1 = full right.
function steerInput() {
  let steer = keyboardDirection().x;
  for (const side of steerFingers.values()) steer += side;
  return Math.max(-1, Math.min(1, steer));
}

// ---------- Moving my sled every frame ----------

function raceUpdate(dt) {
  // Snow puffs drift and fade.
  for (let i = snowPuffs.length - 1; i >= 0; i--) {
    const puff = snowPuffs[i];
    puff.age += dt;
    puff.x += puff.vx * dt;
    puff.y += puff.vy * dt;
    puff.vy += 300 * dt; // falling back down
    if (puff.age > puff.life) snowPuffs.splice(i, 1);
  }

  const me = myPlayer();
  if (!me || client.phase !== "playing") return;

  const started = gameTime >= raceInfo.startAt;
  const steer = started ? steerInput() : 0;
  mySteer += (steer - mySteer) * Math.min(1, dt * 8);

  if (started) {
    const segment = findSegment(me.y);
    const fraction = mySpeed / RACE.maxSpeed; // 0 = stopped, 1 = top speed
    // Steering moves you sideways (faster when you're going fast)…
    me.x += steer * RACE.steerSpeed * fraction * dt;
    // …and curves push you toward the outside, so you have to steer into them.
    me.x -= segment.curve * RACE.curvePush * fraction * fraction * dt;
    me.x = Math.max(-RACE.maxSide, Math.min(RACE.maxSide, me.x));

    // Past the red and white edge = deep snow: much slower.
    inDeepSnow = Math.abs(me.x) > 1;
    const top = RACE.maxSpeed * (inDeepSnow ? RACE.offTrackSpeed : 1);
    if (mySpeed > top) mySpeed = Math.max(top, mySpeed - RACE.offTrackSlowdown * dt);
    else mySpeed = Math.min(top, mySpeed + RACE.accel * dt);

    // Crashing into a tree, a snowman, a rock or a cabin.
    if (inDeepSnow && gameTime - crashAt > 0.6) {
      for (const sprite of segment.sprites) {
        const size = SPRITE_SIZES[sprite.type];
        if (!size.solid) continue;
        const reach = (SLED_WIDTH / 2 + size.w * 0.35) / RACE.roadWidth;
        if (Math.abs(me.x - sprite.offset) < reach) {
          mySpeed = Math.min(mySpeed, RACE.maxSpeed * RACE.crashSpeed);
          crashAt = gameTime;
          me.x -= Math.sign(me.x) * 0.15; // bounce back toward the track
          playSound("bump");
          break;
        }
      }
    }

    // The mountains slide as the track turns.
    raceTurn += segment.curve * (mySpeed * dt / RACE.segmentLength) * 0.003;
    me.y += mySpeed * dt;

    // Snow spraying up from the runners when turning or in deep snow.
    if (mySpeed > 1500 && (Math.abs(steer) > 0 || inDeepSnow) && snowPuffs.length < 60) {
      for (const side of [-1, 1]) {
        if (!inDeepSnow && side === Math.sign(steer)) continue; // turning: spray from the outside runner
        snowPuffs.push({
          x: side * mySledSize * (0.32 + Math.random() * 0.12), y: 0, // (in pixels from the middle of my sled)
          vx: side * (40 + Math.random() * 80) - steer * 60, vy: -(120 + Math.random() * 160),
          age: 0, life: 0.35 + Math.random() * 0.3, size: 3 + Math.random() * 5,
        });
      }
    }

    // Tell the referee where I am, 10 times a second.

    if (gameTime - lastRaceSend > RACE.sendEvery / 1000) {
      lastRaceSend = gameTime;
      sendToServer({ type: "move", x: me.x, y: me.y, speed: mySpeed, steer: mySteer });
    }
  }

  // Countdown beeps: 3… 2… 1… Go!
  if (!started) {
    const left = Math.ceil(raceInfo.startAt - gameTime);
    if (left >= 1 && left <= RACE.countdown && left !== lastCountdown) {
      lastCountdown = left;
      playSound("tick");
    }
  } else if (lastCountdown !== 0 && gameTime - raceInfo.startAt < 1) {
    lastCountdown = 0;
    playSound("go");
  }

  // Just crossed the finish line? (The referee decides, and tells us my place.)
  if (me.finished && !myFinishedPlace) {
    myFinishedPlace = me.place;
    playSound(me.place === 1 ? "win" : "score");
  }
}

// Everyone in order: finished sleds by their place, then the rest by how far they've gone.
function raceOrder() {
  return Object.values(players).sort((a, b) => {
    if (a.finished || b.finished) return (a.finished ? a.place : Infinity) - (b.finished ? b.place : Infinity);
    return b.y - a.y;
  });
}

// ---------- Drawing ----------

function raceRender() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);

  const me = myPlayer();
  const racing = me && client.phase !== "lobby";
  // In the lobby (behind the room code), the camera just glides along the track.
  const myY = racing ? me.y : gameTime * 1500;
  const myX = racing ? me.x : 0;

  // A little shake right after a crash.
  const sinceCrash = Math.max(0, gameTime - crashAt);
  const shake = sinceCrash < 0.3 ? (1 - sinceCrash / 0.3) * 8 : 0;
  if (shake) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);

  const sleds = !racing ? [] : Object.values(players)
    .filter((p) => p.id !== client.myId)
    .map((p) => ({ y: p.y, x: p.x, color: p.color, name: p.name, steer: p.steer }));
  drawRaceScene(ctx, w, h, { cameraZ: myY - raceCamera.playerZ, cameraX: myX, turn: raceTurn, time: gameTime, sleds });
  if (!racing) return;

  // My sled, near the bottom in the middle. It bumps along in deep snow.
  const size = SLED_WIDTH * (raceCamera.depth / raceCamera.playerZ) * w / 2;
  const fraction = mySpeed / RACE.maxSpeed;
  const bounce = inDeepSnow ? Math.sin(gameTime * 30) * size * 0.025 : Math.sin(gameTime * 18) * size * 0.006 * fraction;
  const bottom = h * 0.97 + bounce;
  mySledSize = size;
  ctx.fillStyle = "#ffffff";
  for (const puff of snowPuffs) {
    ctx.globalAlpha = 1 - puff.age / puff.life;
    ctx.beginPath();
    ctx.arc(w / 2 + puff.x, bottom - size * 0.05 + puff.y, puff.size * (1 + puff.age * 2), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  drawSled(ctx, w / 2, bottom, size, me.color || RACE.colors[0], mySteer, gameTime, null);

  // The race info on top.
  const order = raceOrder();
  const started = gameTime >= raceInfo.startAt;
  const sinceStart = gameTime - raceInfo.startAt;
  drawRaceHud(ctx, w, h, {
    lap: Math.max(1, Math.min(RACE.laps, Math.floor(me.y / TRACK.length) + 1)),
    place: order.indexOf(me) + 1,
    racers: order.length,
    kmh: Math.round(fraction * 90),
    countdown: !started ? Math.max(1, Math.ceil(raceInfo.startAt - gameTime)) : sinceStart < 0.8 ? "go" : null,
    finishedPlace: myFinishedPlace,
    deepSnow: inDeepSnow,
    showArrows: !started || sinceStart < 4,
  });
}

// ---------- The winner screen ----------

function formatRaceTime(seconds) {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function showRaceWinner() {
  const order = raceOrder();
  const winner = players[client.winner];
  if (winner) {
    setBilingual(document.getElementById("winner-title"), `🏆 1st place: ${winner.name}`, `🏆 מָקוֹם רִאשׁוֹן: ${winner.name}`);
  } else {
    setBilingual(document.getElementById("winner-title"), "⏱️ The race is over", "⏱️ הַמֵּרוֹץ נִגְמַר");
  }
  const medals = ["🥇", "🥈", "🥉"];
  const results = order.slice(0, 6).map((p, i) =>
    p.finished ? `${medals[i] || ordinal(i + 1)} ${p.name} ${formatRaceTime(p.finishTime)}` : `${p.name}: didn't finish`);
  setBilingual(document.getElementById("winner-score"), results.join(" · "), "הַתּוֹצָאוֹת");
  raceWinnerEl.hidden = false;
  // Confetti in snowy colors.
  const layer = document.getElementById("confetti");
  layer.innerHTML = "";
  const colors = ["#ffffff", "#bae6fd", "#60a5fa", "#facc15"];
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

// ---------- Answering game.js's questions ----------

function raceResetTimers() {
  crashAt = -Infinity;
  lastRaceSend = -Infinity;
}

function raceClear() {
  raceInfo = { startAt: Infinity, finishers: [] };
  mySpeed = 0;
  myFinishedPlace = 0;
  steerFingers.clear();
  snowPuffs.length = 0;
  raceWinnerEl.hidden = true;
}

function raceApplySnapshot(snap) {
  if (snap.race) raceInfo = snap.race;
}

function raceOnPhase(phase) {
  raceWinnerEl.hidden = true;
  if (phase === "playing") {
    mySpeed = 0;
    mySteer = 0;
    crashAt = -Infinity;
    myFinishedPlace = 0;
    lastCountdown = null;
    inDeepSnow = false;
    steerFingers.clear();
    snowPuffs.length = 0;
  } else if (phase === "over") {
    steerFingers.clear();
    showRaceWinner();
  }
}

function raceUpdateHud(p, playing) {
  // The race draws its own info on the canvas, and steers without the joystick.
  hudEl.hidden = true;
  joystickBase.hidden = true;
}

PHONE_GAMES.race = {
  teams: false, // the lobby shows one list of racers, not blue and red teams
  startText: { en: "Start the race!", he: "מַתְחִילִים אֶת הַמֵּרוֹץ!" },
  resetTimers: raceResetTimers,
  clear: raceClear,
  onKey: () => {},
  applySnapshot: raceApplySnapshot,
  onEvent: () => {},
  onPhase: raceOnPhase,
  update: raceUpdate,
  render: raceRender,
  updateHud: raceUpdateHud,
};
