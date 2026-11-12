// race-server.js — Mt Hermon Racing's referee rules. Only the HOST's phone runs this.
//
// Like in Capture the Flag, every phone moves its own sled (so steering feels instant)
// and tells the referee where it is. The referee decides when the race starts,
// who crossed the finish line first, and when the race is over.
//
// A sled's spot is two numbers:
//   p.y = how far it has gone along the track since the start (it keeps growing, lap after lap)
//   p.x = how far left or right it is (0 = the middle, -1 / 1 = the edges)
// (They're called x and y so the shared code can glide other players smoothly, like in Capture the Flag.)
// (The questions it answers are at the bottom: SERVER_GAMES.race.)

function raceNewRound() {
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
  const everyone = Object.values(server.players);
  everyone.forEach((p, i) => {
    const row = Math.floor(i / 2);
    p.x = everyone.length === 1 ? 0 : (i % 2 === 0 ? -0.5 : 0.5);
    p.y = -RACE.segmentLength * 8 - row * RACE.segmentLength * 4; // behind the line (far enough to see the banner)
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

// Crossed the line after the last lap?
function raceCheckFinish(p) {
  if (p.finished || p.y < RACE.laps * TRACK.length) return;
  p.finished = true;
  p.finishTime = server.time - server.race.startAt;
  server.race.finishers.push(p.id);
  p.place = server.race.finishers.length;
  if (server.race.firstFinishAt === null) server.race.firstFinishAt = server.time;
  toast(`🏁 ${p.name} finished in ${ordinal(p.place)} place!`, `🏁 ${p.name} סִיֵּם/סִיְּמָה בְּמָקוֹם ${p.place}!`);
}

function raceUpdate() {
  const everyone = Object.values(server.players);
  if (everyone.length === 0) return;
  const allDone = everyone.every((p) => p.finished);
  // Everyone finished (2 seconds to enjoy it), or the slow ones ran out of time.
  const doneFor = server.race.firstFinishAt === null ? 0 : server.time - server.race.firstFinishAt;
  if ((allDone && doneFor >= 2) || doneFor >= RACE.waitAfterFirst) {
    serverEndGame(server.race.finishers[0] || null);
  }
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
