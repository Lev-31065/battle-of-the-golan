// race-server.js — Mt Hermon Racing's referee rules. Only the HOST's phone runs this.
//
// Like in Capture the Flag, every phone moves its own sled (so steering feels instant)
// and tells the referee where it is. The referee decides when the race starts,
// who crossed the finish line first, and when the race is over.
//
// A sled's spot is two numbers:
//   p.y = how far it has gone along the track since the start (from the top of the mountain down to the lake)
//   p.x = how far left or right it is (0 = the middle, -1 / 1 = the edges)
// (They're called x and y so the shared code can glide other players smoothly, like in Capture the Flag.)
// (The questions it answers are at the bottom: SERVER_GAMES.race.)

function raceNewRound() {
  raceRemoveBots(); // (bots only exist during a race)
  server.race = { startAt: 0, finishers: [], firstFinishAt: null };
  server.winner = null;
}

// Each sled gets its own color, in the order players joined.
function raceNextColor() {
  const used = new Set(Object.values(server.players).map((p) => p.color));
  return RACE.colors.find((c) => !used.has(c)) || RACE.colors[Object.keys(server.players).length % RACE.colors.length];
}

function raceNewPlayer(p) {
  p.x = 0;
  p.y = 0;
  p.speed = 0;
  p.steer = 0;
  p.color = raceNextColor();
  p.finished = false;
  p.place = 0;
  p.finishTime = 0;
  p.lastMoveAt = server.time;
}

// The host tapped Start: line everyone up behind the start line, two sleds per row,
// and start the 3… 2… 1… countdown.
function raceStartGame() {
  raceAddBots(); // computer sleds, so there's always someone to race
  const everyone = Object.values(server.players);
  everyone.forEach((p, i) => {
    const row = Math.floor(i / 2);
    p.x = everyone.length === 1 ? 0 : (i % 2 === 0 ? -0.45 : 0.45);
    p.y = TRACK.startZ - RACE.segmentLength * 8 - row * RACE.segmentLength * 4; // behind the start line (far enough to see the banner)
    p.speed = 0;
    p.steer = 0;
    p.finished = false;
    p.place = 0;
    p.finishTime = 0;
    p.lastMoveAt = server.time;
    p.spawnCount += 1; // tells the phone "jump to this spot"
  });
  server.race.startAt = server.time + RACE.countdown;
}

function raceHandle(p, msg) {
  if (msg.type !== "move" || server.phase !== "playing") return;
  if (server.time < server.race.startAt) return; // no moving before "Go!"
  const x = Number(msg.x), y = Number(msg.y), speed = Number(msg.speed), steer = Number(msg.steer);
  if (![x, y, speed, steer].every(Number.isFinite)) return;
  // A sled can't jump ahead faster than it could really go (a glitch or a cheat).
  const seconds = Math.max(0.05, server.time - p.lastMoveAt);
  const furthest = p.y + RACE.maxSpeed * 2 * seconds + RACE.segmentLength;
  p.lastMoveAt = server.time;
  p.y = Math.max(p.y, Math.min(y, furthest)); // (and never backwards)
  p.x = Math.max(-RACE.maxSide, Math.min(RACE.maxSide, x));
  p.speed = Math.max(0, Math.min(RACE.maxSpeed * 2, speed));
  p.steer = Math.max(-1, Math.min(1, steer));
  raceCheckFinish(p);
}

// Reached the finish line on the beach of the Kinneret?
function raceCheckFinish(p) {
  if (p.finished || p.y < TRACK.finishZ) return;
  p.finished = true;
  p.finishTime = server.time - server.race.startAt;
  server.race.finishers.push(p.id);
  p.place = server.race.finishers.length;
  // (The "hurry up" clock for everyone else starts when the first PLAYER finishes, not a bot.)
  if (server.race.firstFinishAt === null && !p.bot) server.race.firstFinishAt = server.time;
  toast(`🏁 ${p.name} finished in ${ordinal(p.place)} place!`, `🏁 ${p.name} סִיֵּם/סִיְּמָה בְּמָקוֹם ${p.place}!`);
}

function raceUpdate(dt) {
  const everyone = Object.values(server.players);
  if (everyone.length === 0) return;
  for (const p of everyone) if (p.bot) raceMoveBot(p, dt);
  // (The race is done when every PLAYER has finished; nobody waits for a slow bot.)
  const players = everyone.filter((p) => !p.bot);
  if (players.length === 0) return;
  const allDone = players.every((p) => p.finished);
  // Everyone finished (2 seconds to enjoy it), or the slow ones ran out of time.
  const doneFor = server.race.firstFinishAt === null ? 0 : server.time - server.race.firstFinishAt;
  if ((allDone && doneFor >= 2) || doneFor >= RACE.waitAfterFirst) {
    serverEndGame(server.race.finishers[0] || null);
  }
}


// ---------- Bots: computer sleds ----------
// Bots are players the referee drives itself (bot: true). They only exist during a race:
// they join when the host taps Start (until there are RACE.bots sleds) and leave when
// everyone goes back to the lobby. Phones draw them like any other sled.
// Each bot: glides down a lane, wanders to a new lane now and then, steers around trees
// and rocks it sees ahead, and at each gate gets it right (boost) or wrong (slowed).
// Settings: RACE.bots, botNames, botSkill, botRight, botCatchUp (rules.js).

const LONG_AGO = -1e9; // "never happened" (a plain number, so it travels safely to the phones)

function raceRemoveBots() {
  for (const p of Object.values(server.players)) {
    if (p.bot) delete server.players[p.id];
  }
}

function raceAddBots() {
  const humans = Object.keys(server.players).length;
  for (let i = 0; humans + i < RACE.bots && i < RACE.botNames.length; i++) {
    const p = {
      id: "robot" + (i + 1),
      name: RACE.botNames[i],
      team: "blue",
      alive: true,
      spawnCount: 0,
      lastSeen: server.time,
      bot: true,
      skill: RACE.botSkill[i % RACE.botSkill.length],
      lane: 0,            // where it wants to be, sideways (-1 = left edge of the path … 1 = right edge)
      laneUntil: 0,       // when it picks a new lane
      gatesDone: 0,       // how many gates it has passed
      boostUntil: LONG_AGO,
      slowUntil: LONG_AGO,
      crashAt: LONG_AGO,
      crashDir: 1,
    };
    raceNewPlayer(p);
    server.players[p.id] = p;
  }
}

function raceMoveBot(p, dt) {
  p.lastSeen = server.time; // (so the referee never thinks a bot's phone fell asleep)
  if (server.time < server.race.startAt) return;
  const segment = findSegment(p.y);
  const fraction = Math.max(0, p.speed) / RACE.maxSpeed;

  // Pick a new lane every few seconds.
  if (server.time > p.laneUntil) {
    p.laneUntil = server.time + 3 + Math.random() * 4;
    p.lane = (Math.random() * 2 - 1) * 0.7;
  }
  const room = Math.max(0.1, segment.width - 0.3); // stay on the path
  let target = Math.max(-room, Math.min(room, p.lane * room));

  // Look ahead for trees and rocks standing in the way, and aim past them.
  // (Better bots look further ahead, so they crash less.)
  const lookAhead = Math.round(12 + 34 * Math.max(0, Math.min(1, (p.skill - 0.8) / 0.18)));
  for (let i = segment.index + 1; i <= Math.min(TRACK.segments.length - 1, segment.index + lookAhead); i++) {
    for (const sprite of TRACK.segments[i].sprites) {
      const size = SPRITE_SIZES[sprite.type];
      if (!size.solid) continue;
      const reach = (SLED_WIDTH / 2 + size.hit / 2) / RACE.roadWidth + 0.15;
      if (Math.abs(target - sprite.offset) >= reach) continue;
      let side = target >= sprite.offset ? 1 : -1;
      if (Math.abs(sprite.offset + side * reach) > room) side = -side; // no room on that side: go round the other way
      target = sprite.offset + side * reach;
    }
  }

  // Steer toward the target (the sled swings round, like a player's).
  const steer = Math.max(-1, Math.min(1, (target - p.x) * 4));
  p.steer += (steer - p.steer) * Math.min(1, dt * RACE.turnSpeed);
  p.x += p.steer * RACE.steerSpeed * Math.max(fraction, RACE.slowSteer) * dt;

  // Gates: right = a boost, wrong = slowed down.
  const gate = TRACK.gates[p.gatesDone];
  if (gate && p.y >= gate.z) {
    p.gatesDone += 1;
    if (Math.random() < RACE.botRight) p.boostUntil = server.time + RACE.boostTime;
    else p.slowUntil = server.time + RACE.slowTime;
  }

  // Speed. To keep the race close, a bot far ahead of the best player eases off a
  // little, and one far behind pushes harder.
  const humans = Object.values(server.players).filter((other) => !other.bot);
  const best = Math.max(...humans.map((other) => other.y));
  const gap = p.y - best;
  const catchUp = !humans.length ? 1 : gap > RACE.botCatchUp ? 0.9 : gap < -RACE.botCatchUp ? 1.08 : 1;
  const boosting = server.time < p.boostUntil, slowed = server.time < p.slowUntil;
  const top = p.finished ? 0 : RACE.maxSpeed * p.skill * catchUp
    * (Math.abs(p.x) > segment.width ? RACE.offTrackSpeed : 1)
    * (boosting ? RACE.boostSpeed : 1) * (slowed ? RACE.slowSpeed : 1);
  if (p.speed > top) p.speed = Math.max(top, p.speed - (top === 0 ? RACE.brake : RACE.offTrackSlowdown) * dt);
  else p.speed = Math.min(top, p.speed + RACE.accel * (boosting ? 3 : 1) * dt);

  // Crashing, exactly like a player's sled: the nose hits, it bounces back and slides round.
  if (server.time - p.crashAt > 0.5 && p.speed > 0) {
    const noseIndex = findSegment(p.y + RACE.sledLength).index;
    for (let i = segment.index; i <= noseIndex && server.time !== p.crashAt; i++) {
      for (const sprite of TRACK.segments[i].sprites) {
        const size = SPRITE_SIZES[sprite.type];
        if (!size.solid || Math.abs(p.x - sprite.offset) >= (SLED_WIDTH / 2 + size.hit / 2) / RACE.roadWidth) continue;
        p.crashDir = Math.abs(sprite.offset) > segment.width ? -Math.sign(sprite.offset) : p.x >= sprite.offset ? 1 : -1;
        p.speed = -RACE.crashBounce * Math.max(0.4, fraction);
        p.crashAt = server.time;
        break;
      }
    }
  }
  if (server.time - p.crashAt < RACE.crashShoveTime) p.x += p.crashDir * RACE.crashShove * dt;

  p.y += p.speed * dt;
  raceCheckFinish(p);
}

function raceSnapshot(snap) {
  snap.race = { startAt: server.race.startAt, finishers: server.race.finishers };
}

SERVER_GAMES.race = {
  teams: false, // no blue/red teams: everyone races for themselves
  newRound: raceNewRound,
  newPlayer: raceNewPlayer,
  playerLeaving: () => {},
  startGame: raceStartGame,
  handle: raceHandle,
  update: raceUpdate,
  snapshot: raceSnapshot,
};
