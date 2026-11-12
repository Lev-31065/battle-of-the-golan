// race-game.js — Mt Hermon Racing on the phone: steering my sled, speeding up and
// slowing down, crashing into trees, the countdown, and the winner screen.
//
// The sled goes forward by itself. Hold the left half of the screen to steer left,
// the right half to steer right (or use the arrow keys / A and D on a computer).
// The drawing is in race-draw.js and the track in race-track.js.
// The referee's side is race-server.js. (The questions game.js asks are at the bottom: PHONE_GAMES.race.)

let raceInfo = { startAt: Infinity, finishers: [] }; // from the referee
let mySpeed = 0;          // how fast my sled is going (track units per second)
let mySteer = 0;          // which way my sled points: -1 = turned fully left, 0 = straight down the path, 1 = fully right
let raceTurn = 0;         // goes up and down as the track turns (slides the mountains)
let crashAt = -Infinity;  // when I last hit a tree (for the screen shake)
let lastRaceSend = -Infinity; // when I last told the referee where I am (game clock)
let lastCountdown = null; // the last countdown number I beeped for
let myFinishedPlace = 0;  // my place once I've crossed the finish line (0 = still racing)
let inDeepSnow = false;
const snowPuffs = [];     // snow spraying up behind my sled (on the screen only)
let mySledSize = 100;     // how wide my sled is on the screen, in pixels (set while drawing)
let gateQuestion = null;  // the question on the next gate: { z, gate, entry, choices, shownAt, lane, settledAt }
let gateFeedback = null;  // after a gate: { kind: "right" / "wrong" / "missed", entry, until }
let lastGateZ = -Infinity; // the last gate I went through (its distance along the race)
let boostUntil = -Infinity; // right answer: faster until this time
let slowUntil = -Infinity;  // wrong answer: slower until this time
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


// ---------- Steering by tilting the phone ----------
// The 📱 button switches between "touch" (hold the left or right half of the screen) and
// "tilt" (tip the phone left or right, like a steering wheel). The choice is remembered.
// iPhones ask "Allow motion?" the first time (they only allow asking right after a tap).
let steerByTilt = false;
let tiltSteer = 0; // -1 … 1, from the phone's tilt (0 = held level)
try { steerByTilt = localStorage.getItem("golan-race-steer") === "tilt"; } catch {}
const tiltButton = document.getElementById("tilt-button");

// The screen's angle: 0 = upright, 90 or 270 (-90) = sideways.
function screenAngle() {
  const angle = screen.orientation && typeof screen.orientation.angle === "number" ? screen.orientation.angle : Number(window.orientation) || 0;
  return ((angle % 360) + 360) % 360;
}
window.addEventListener("deviceorientation", (event) => {
  if (event.beta === null || event.gamma === null) return;
  // Upright, tipping left/right is "gamma". Sideways, it's "beta" (and which way round
  // depends on which side the phone was turned to).
  const angle = screenAngle();
  const degrees = angle === 90 ? event.beta : angle === 270 ? -event.beta : angle === 180 ? -event.gamma : event.gamma;
  // A little tip does nothing (so holding it "about level" goes straight); full turn at RACE.tiltFull degrees.
  const dead = RACE.tiltDeadZone;
  const amount = Math.abs(degrees) < dead ? 0 : (Math.abs(degrees) - dead) / (RACE.tiltFull - dead);
  tiltSteer = Math.sign(degrees) * Math.min(1, amount);
});

function setSteerByTilt(on) {
  steerByTilt = on;
  tiltSteer = 0;
  try { localStorage.setItem("golan-race-steer", on ? "tilt" : "touch"); } catch {}
  tiltButton.textContent = on ? "📱" : "👆";
  if (on) showToast("📱 Steering by tilting the phone", "📱 הִיגּוּי בְּהַטָּיַת הַטֵּלֵפוֹן");
  else showToast("👆 Steering by touch", "👆 הִיגּוּי בִּנְגִיעָה");
}
tiltButton.textContent = steerByTilt ? "📱" : "👆";
tiltButton.addEventListener("click", () => {
  if (steerByTilt) { setSteerByTilt(false); return; }
  // iPhones: ask for permission first.
  const ask = window.DeviceOrientationEvent && DeviceOrientationEvent.requestPermission;
  if (!ask) { setSteerByTilt(true); return; }
  DeviceOrientationEvent.requestPermission().then((answer) => {
    if (answer === "granted") setSteerByTilt(true);
    else showToast("The phone said no to motion, so it's touch steering", "הַטֵּלֵפוֹן לֹא הִרְשָׁה, אָז מְהַגִּים בִּנְגִיעָה");
  }).catch(() => showToast("Tilt steering isn't available here", "הִיגּוּי בְּהַטָּיָה לֹא זָמִין כָּאן"));
});
// iPhones forget the permission when the page reloads: ask again on the first tap.
let tiltAsked = false;
window.addEventListener("pointerdown", () => {
  if (!steerByTilt || tiltAsked || !window.DeviceOrientationEvent || !DeviceOrientationEvent.requestPermission) return;
  tiltAsked = true;
  DeviceOrientationEvent.requestPermission().catch(() => {});
});

// -1 = full left, 0 = straight, 1 = full right.
function steerInput() {
  let steer = keyboardDirection().x + (steerByTilt ? tiltSteer : 0);
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
  // The sled swings round toward where you steer (not instantly, like a real sled).
  mySteer += (steer - mySteer) * Math.min(1, dt * RACE.turnSpeed);

  if (started) {
    const segment = findSegment(me.y);
    const fraction = mySpeed / RACE.maxSpeed; // 0 = stopped, 1 = top speed
    // The way the sled points moves you sideways (faster when you're going fast)…
    me.x += mySteer * RACE.steerSpeed * fraction * dt;
    // …and curves push you toward the outside, so you have to steer into them.
    me.x -= segment.curve * RACE.curvePush * fraction * fraction * dt;
    // You can go off the path, but not past the edge of the mountainside.
    const farthest = segment.width + RACE.shoulder * 0.8;
    me.x = Math.max(-farthest, Math.min(farthest, me.x));

    // Off the path = much slower (deep snow up high, rough ground lower down).
    // A right answer at a gate = a boost (faster for a moment); a wrong one = slowed down.
    inDeepSnow = Math.abs(me.x) > segment.width;
    const boosting = gameTime < boostUntil, slowed = gameTime < slowUntil;
    const top = RACE.maxSpeed * (inDeepSnow ? RACE.offTrackSpeed : 1)
      * (boosting ? RACE.boostSpeed : 1) * (slowed ? RACE.slowSpeed : 1)
      * (me.finished || me.y > TRACK.finishZ ? 0 : 1); // past the finish line: slow down and stop on the beach
    if (mySpeed > top) mySpeed = Math.max(top, mySpeed - (top === 0 ? RACE.brake : RACE.offTrackSlowdown) * dt);
    else mySpeed = Math.min(top, mySpeed + RACE.accel * (boosting ? 3 : 1) * dt);

    // Crashing into a tree, a snowman, a rock or a cabin.
    // (Trees and rocks stand beside the path, and a few right on it, so watch out!)
    if (gameTime - crashAt > 0.6) {
      for (const sprite of segment.sprites) {
        const size = SPRITE_SIZES[sprite.type];
        if (!size.solid) continue;
        const reach = (SLED_WIDTH / 2 + size.w * 0.35) / RACE.roadWidth;
        if (Math.abs(me.x - sprite.offset) < reach) {
          mySpeed = Math.min(mySpeed, RACE.maxSpeed * RACE.crashSpeed);
          crashAt = gameTime;
          me.x += (me.x >= sprite.offset ? 1 : -1) * 0.15; // bounce off, away from it
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

    checkGates(me);

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

// ---------- Answer gates ----------
// When a gate comes into view, this phone picks a word from MY level (each phone asks its
// own questions, like the quiz popup): the English goes on the sign, and the right Hebrew
// plus 2 wrong ones go over the 3 lanes, in random order. Whichever lane I'm in when I
// pass under the gate is my answer.

// The next gate ahead of distance y: { z (its distance along the race), gate }, or null.
function nextGateAhead(y) {
  for (const gate of TRACK.gates) {
    if (gate.z > y && gate.z > lastGateZ) return { z: gate.z, gate };
  }
  return null;
}

// Which lane a sideways spot is in at a gate: 0 = left, 1 = middle, 2 = right, -1 = off the path.
function laneAt(x, width = RACE.gateWidth) {
  if (Math.abs(x) > width) return -1;
  return Math.max(0, Math.min(2, Math.floor((x / width + 1) / 2 * 3)));
}

// Three answers: the right one and 2 wrong ones (the quiz's tricky wrong answers first).
function gateChoices(entry) {
  let others = [];
  try {
    others = buildChoices(entry).filter((hebrew) => hebrew !== entry.hebrew);
  } catch (error) {
    reportProblem(error);
  }
  if (others.length < 2) {
    const spare = shuffle(WORDS.map((w) => w.hebrew).filter((hebrew) => hebrew !== entry.hebrew));
    others = [...others, ...spare].slice(0, 2);
  }
  return shuffle([entry.hebrew, others[0], others[1]].filter(Boolean));
}

function checkGates(me) {
  // A gate is coming: put a question on it.
  if (!gateQuestion) {
    const next = nextGateAhead(me.y);
    if (next && next.z - me.y <= RACE.gateShowAt * RACE.segmentLength) {
      const entry = pickNextWord();
      gateQuestion = { z: next.z, gate: next.gate, entry, choices: gateChoices(entry), shownAt: gameTime, lane: laneAt(me.x), settledAt: gameTime };
      gateFeedback = null; // (the new question replaces the last "Correct!")
      try { speakSteps([{ card: null, lines: [englishLine(entry)] }]); } catch (error) { reportProblem(error); }
    }
    return;
  }
  // Remember when I last changed lanes: that's how long I took to "answer" (for Auto levels).
  const lane = laneAt(me.x);
  if (lane !== gateQuestion.lane) {
    gateQuestion.lane = lane;
    gateQuestion.settledAt = gameTime;
  }
  if (me.y < gateQuestion.z) return;

  // Passing under the gate: the lane I'm in is my answer.
  const { entry, choices, shownAt, settledAt } = gateQuestion;
  lastGateZ = gateQuestion.z;
  gateQuestion = null;
  if (lane === -1) {
    // Off the track: no answer. (Nothing is saved, but you still see the answer.)
    gateFeedback = { kind: "missed", entry, until: gameTime + RACE.feedbackTime };
    playSound("wrong");
    return;
  }
  const right = choices[lane] === entry.hebrew;
  autoLevelAnswer(right, Math.max(0, settledAt - shownAt));
  recordAnswer(entry, right);
  gateFeedback = { kind: right ? "right" : "wrong", entry, until: gameTime + RACE.feedbackTime };
  if (right) {
    boostUntil = gameTime + RACE.boostTime;
    playSound("correct");
    playSound("boost");
  } else {
    slowUntil = gameTime + RACE.slowTime;
    playSound("wrong");
  }
  // Read the right Hebrew answer out loud either way.
  try { speakSteps([{ card: null, lines: [hebrewLine(entry)] }]); } catch (error) { reportProblem(error); }
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
  const myY = racing ? me.y : TRACK.startZ + (gameTime * 1500) % (TRACK.finishZ - TRACK.startZ);
  const myX = racing ? me.x : 0;

  // A little shake right after a crash.
  const sinceCrash = Math.max(0, gameTime - crashAt);
  const shake = sinceCrash < 0.3 ? (1 - sinceCrash / 0.3) * 8 : 0;
  if (shake) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);

  const sleds = !racing ? [] : Object.values(players)
    .filter((p) => p.id !== client.myId)
    .map((p) => ({ y: p.y, x: p.x, color: p.color, name: p.name, turn: (p.steer || 0) * RACE.maxTurn }));
  const gate = racing && gateQuestion ? { number: gateQuestion.gate.number, english: gateQuestion.entry.english, choices: gateQuestion.choices } : null;
  // The view turns (part of the way) with my sled, so the world swings round when I steer.
  const viewTurn = racing ? mySteer * RACE.maxTurn * RACE.cameraTurn : 0;
  drawRaceScene(ctx, w, h, { cameraZ: myY - raceCamera.playerZ, cameraX: myX, turn: raceTurn, viewTurn, time: gameTime, sleds, gate });
  // Snow falling up high (it stops lower down, where the snow has melted).
  drawSnowfall(ctx, w, h, gameTime, findSegment(myY).snow, racing ? mySpeed / RACE.maxSpeed : 0.5, -viewTurn * w);
  if (!racing) return;
  const boosting = gameTime < boostUntil;
  if (boosting) drawBoostLines(ctx, w, h, gameTime);

  // My sled, in the middle, where the track is under the camera. It bumps along in deep snow.
  // (On a sideways phone the screen is wide but short, so the sled is kept from getting too big.)
  const size = Math.min(SLED_WIDTH * (raceCamera.depth / raceCamera.playerZ) * w / 2, h * 0.3);
  const fraction = mySpeed / RACE.maxSpeed;
  const bounce = inDeepSnow ? Math.sin(gameTime * 30) * size * 0.025 : Math.sin(gameTime * 18) * size * 0.006 * fraction;
  const bottom = h * (RACE.horizon + 0.5) + bounce;
  mySledSize = size;
  ctx.fillStyle = "#ffffff";
  for (const puff of snowPuffs) {
    ctx.globalAlpha = 1 - puff.age / puff.life;
    ctx.beginPath();
    ctx.arc(w / 2 + puff.x, bottom - size * 0.05 + puff.y, puff.size * (1 + puff.age * 2), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  // (The sled points a bit further round than the view, so you can see it turning.)
  drawSled(ctx, w / 2, bottom, size, me.color || RACE.colors[0], mySteer * RACE.maxTurn - viewTurn * 0.5, gameTime, null);

  // The race info on top.
  const order = raceOrder();
  const started = gameTime >= raceInfo.startAt;
  const sinceStart = gameTime - raceInfo.startAt;
  drawRaceHud(ctx, w, h, {
    progress: {
      me: trackProgress(me.y),
      others: Object.values(players).filter((p) => p.id !== client.myId).map((p) => ({ at: trackProgress(p.y), color: p.color })),
    },
    place: order.indexOf(me) + 1,
    racers: order.length,
    kmh: Math.round(fraction * 90),
    countdown: !started ? Math.max(1, Math.ceil(raceInfo.startAt - gameTime)) : sinceStart < 0.8 ? "go" : null,
    finishedPlace: myFinishedPlace,
    deepSnow: inDeepSnow,
    showArrows: !started || sinceStart < 4,
    tilt: steerByTilt,
    gate: gateQuestion ? {
      english: gateQuestion.entry.english, choices: gateQuestion.choices, myLane: laneAt(me.x),
      // Fully shown until the gate is 40 segments away, then fading to almost nothing at 12.
      fade: Math.max(0.12, Math.min(1, ((gateQuestion.z - me.y) / RACE.segmentLength - 12) / 28)),
    } : null,
    feedback: gateFeedback && gameTime < gateFeedback.until ? gateFeedback : null,
    boosting,
    slowed: gameTime < slowUntil,
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
  forgetGates();
}

// Forget the gate question, "Correct!" and any boost or slowdown (a new race, or the clock jumped).
function forgetGates() {
  gateQuestion = null;
  gateFeedback = null;
  lastGateZ = -Infinity;
  boostUntil = -Infinity;
  slowUntil = -Infinity;
}

function raceClear() {
  raceInfo = { startAt: Infinity, finishers: [] };
  mySpeed = 0;
  myFinishedPlace = 0;
  steerFingers.clear();
  forgetGates();
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
    forgetGates();
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
  tiltButton.hidden = !playing; // 👆 / 📱: touch or tilt steering
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
