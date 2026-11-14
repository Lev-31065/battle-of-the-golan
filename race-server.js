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
  server.race = {
    startAt: 0, finishers: [], firstFinishAt: null, lastFinishAt: 0,
    things: [],   // banana peels and rimonim lying on the path, mangoes and rimonim flying down it
    booms: [],    // rimonim that just blew up: { id, x, y, at } (so every phone can show the explosion)
    goats: {},    // mountain goats that were bumped lately: goat id → { at (when), dir (which way it flew) }
    nextThing: 1, // (each one gets its own number)
  };
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
  raceResetSled(p);
}

// The things a sled has besides its spot: how high it is flying, the gift it is holding,
// and how many times it has been hit by a banana peel or a mango.
function raceResetSled(p) {
  p.air = 0;                // how high above the ground (0 = on the ground)
  p.vy = 0;                 // how fast it is going up (bots only: phones work out their own)
  p.item = null;            // "banana", "mango", "rimon" or null
  p.lastGiftGate = -1;      // the last gate that gave it a gift (each gate gives one only once)
  p.spinCount = 0;          // goes up by 1 with every hit (that is how the phone notices)
  p.spinKind = "";          // what hit it last
  p.safeUntil = LONG_AGO;   // nothing can hit it until then
}

// The host tapped Start: line everyone up behind the start line, four sleds per row
// (the start is a big open snowfield, so there is room),
// and start the 3… 2… 1… countdown.
function raceStartGame() {
  raceAddBots(); // computer sleds, so there's always someone to race
  const everyone = Object.values(server.players);
  everyone.forEach((p, i) => {
    const row = Math.floor(i / 4), inRow = Math.min(4, everyone.length - row * 4);
    p.x = (i % 4 - (inRow - 1) / 2) * 0.8;
    p.y = TRACK.startZ - RACE.segmentLength * 8 - row * RACE.segmentLength * 7; // behind the start line (far enough to see the banner)
    p.speed = 0;
    p.steer = 0;
    p.finished = false;
    p.place = 0;
    p.finishTime = 0;
    p.lastMoveAt = server.time;
    raceResetSled(p);
    p.spawnCount += 1; // tells the phone "jump to this spot"
  });
  server.race.things = [];
  server.race.booms = [];
  server.race.goats = {};
  server.race.startAt = server.time + RACE.countdown;
}

function raceHandle(p, msg) {
  if (server.phase !== "playing") return;
  if (server.time < server.race.startAt) return; // no moving before "Go!"
  if (msg.type === "gift") { raceGiveGift(p, Number(msg.gate)); return; } // "I got this gate's question right"
  if (msg.type === "use") { raceUseItem(p, msg.how); return; }            // "I'm using my gift" (how: "drop" = leave a rimon behind me)
  if (msg.type === "goat") { raceGoatHit(Number(msg.id), Number(msg.dir) < 0 ? -1 : 1); return; } // "I bumped into this goat"
  if (msg.type !== "move") return;
  const x = Number(msg.x), y = Number(msg.y), speed = Number(msg.speed), steer = Number(msg.steer);
  if (![x, y, speed, steer].every(Number.isFinite)) return;
  // A sled can't jump ahead faster than it could really go (a glitch or a cheat).
  const seconds = Math.max(0.05, server.time - p.lastMoveAt);
  const furthest = p.y + RACE.maxSpeed * 2 * seconds + RACE.segmentLength;
  p.lastMoveAt = server.time;
  // (Backwards is fine: a gate bounces a sled back up the path after a wrong answer. But not miles back.)
  p.y = Math.max(p.y - RACE.gateBounce - 3000, Math.min(y, furthest));
  p.x = Math.max(-RACE.maxSide, Math.min(RACE.maxSide, x));
  p.speed = Math.max(0, Math.min(RACE.maxSpeed * 2, speed));
  p.steer = Math.max(-RACE.skidTurn, Math.min(RACE.skidTurn, steer)); // (in a skid a sled swings round further than 1)
  p.air = Math.max(0, Math.min(5000, Number(msg.air) || 0)); // (how high it is flying, so everyone can see the jump)
  raceCheckFinish(p);
}

// Reached the finish line, at the foot of the big ramp into the Kinneret?
function raceCheckFinish(p) {
  if (p.finished || p.y < TRACK.finishZ) return;
  p.finished = true;
  p.finishTime = server.time - server.race.startAt;
  server.race.finishers.push(p.id);
  p.place = server.race.finishers.length;
  if (!p.bot) server.race.lastFinishAt = server.time;
  // (The "hurry up" clock for everyone else starts when the first PLAYER finishes, not a bot.)
  if (server.race.firstFinishAt === null && !p.bot) server.race.firstFinishAt = server.time;
  toast(`🏁 ${p.name} finished in ${ordinal(p.place)} place!`, `🏁 ${p.name} סִיֵּם/סִיְּמָה בְּמָקוֹם ${p.place}!`);
}

function raceUpdate(dt) {
  const everyone = Object.values(server.players);
  if (everyone.length === 0) return;
  for (const p of everyone) if (p.bot) raceMoveBot(p, dt);
  raceUpdateThings(dt);
  // (The race is done when every PLAYER has finished; nobody waits for a slow bot.)
  const players = everyone.filter((p) => !p.bot);
  if (players.length === 0) return;
  const allDone = players.every((p) => p.finished);
  // Everyone finished (and had a few seconds to fly into the lake), or the slow ones ran out of time.
  const doneFor = server.race.firstFinishAt === null ? 0 : server.time - server.race.firstFinishAt;
  if ((allDone && server.time - server.race.lastFinishAt >= RACE.afterFinish) || doneFor >= RACE.waitAfterFirst) {
    serverEndGame(server.race.finishers[0] || null);
  }
}


// ---------- Gifts: banana peels, mangoes and rimonim ----------
// A RIGHT answer at a gate puts ONE gift in your hands, to use when you like:
//   a banana peel: dropped on the path behind you. Whoever slides over it spins out.
//   a mango: thrown straight ahead, fast. It follows the path and spins out the first sled it hits.
//   a rimon (a pomegranate grenade): THROWN ahead, it flies in an arc and blows up where it lands;
//     DROPPED behind, it waits on the path and blows up when a sled comes close. The explosion is
//     wide, so it can catch several sleds at once.
// The phone says "I got gate 5 right" and "I'm using it"; the referee decides the rest:
// which gift it is, where the peels lie, where the mangoes fly, and who gets hit.

// Pick a gift by its chances, like { banana: 0.5, rimon: 0.4, mango: 0.1 }.
function racePickGift(chances) {
  let roll = Math.random() * Object.values(chances).reduce((sum, chance) => sum + chance, 0);
  for (const kind of Object.keys(chances)) {
    roll -= chances[kind];
    if (roll <= 0) return kind;
  }
  return Object.keys(chances)[0];
}

function raceGiveGift(p, number) {
  const gate = TRACK.gates[number];
  if (!gate || number <= p.lastGiftGate) return;  // no such gate, or it already gave this sled its gift
  if (Math.abs(p.y - gate.z) > 6000) return;      // (nowhere near it)
  p.lastGiftGate = number;
  if (p.item) return;                             // hands full: keep what you have
  // Out in front, mostly banana peels (nobody is ahead to throw a mango at); further back, mostly things to throw.
  const inFront = Object.values(server.players).every((other) => other.y <= p.y);
  p.item = racePickGift(inFront ? RACE.giftsInFront : RACE.giftsBehind);
  p.useAt = server.time + 1 + Math.random() * 3; // (bots: when to use it)
}

// how = "drop" (a rimon only: leave it behind me) or anything else (the usual way).
function raceUseItem(p, how) {
  const kind = p.item;
  if (!kind) return;
  p.item = null;
  const race = server.race;
  if (kind === "banana") {
    // Behind the sled. (Its owner can't slip on it for the first second.)
    race.things.push({ id: race.nextThing++, kind, x: p.x, y: p.y - 350, speed: 0, owner: p.id, ownerSafeUntil: server.time + 1, until: server.time + RACE.bananaLife });
  } else if (kind === "mango") {
    race.things.push({ id: race.nextThing++, kind, x: p.x, y: p.y + RACE.sledLength + 100, speed: Math.max(p.speed, 2500) + RACE.mangoSpeed, owner: p.id, endY: p.y + RACE.mangoRange });
  } else if (how === "drop") {
    // A rimon left lying behind the sled, waiting. (Its owner is safe from it for a moment.)
    race.things.push({ id: race.nextThing++, kind, x: p.x, y: p.y - 350, speed: 0, air: 0, owner: p.id, ownerSafeUntil: server.time + 1.5, until: server.time + RACE.rimonLife });
  } else {
    // A rimon thrown ahead: it flies in an arc from here to where it lands.
    const from = p.y + RACE.sledLength;
    race.things.push({ id: race.nextThing++, kind, x: p.x, y: from, speed: Math.max(p.speed, 2500) + RACE.rimonSpeed, air: 0, owner: p.id, thrown: true, fromY: from, landY: p.y + RACE.rimonRange });
  }
  if (race.things.length > 40) race.things.shift(); // (never too many lying around)
}

function raceUpdateThings(dt) {
  const everyone = Object.values(server.players);
  const race = server.race;
  race.booms = race.booms.filter((boom) => server.time - boom.at < 1.5);
  race.things = race.things.filter((thing) => {
    const from = thing.y;
    if (thing.kind === "mango" || thing.thrown) {
      thing.y += thing.speed * dt;
      const seg = findSegment(thing.y);
      const room = Math.max(0.1, seg.width - 0.15);
      thing.x = Math.max(-room, Math.min(room, thing.x)); // it follows the path
    }
    if (thing.kind === "mango") {
      // It splats when it has flown far enough, on an island, or in the lake.
      if (thing.y > thing.endY || thing.y > TRACK.waterZ || offThePath(findSegment(thing.y), thing.x)) return false;
    } else if (thing.thrown) {
      // A thrown rimon: up and over, hitting nobody on the way, then BOOM where it lands.
      const t = (thing.y - thing.fromY) / (thing.landY - thing.fromY);
      thing.air = Math.sin(Math.max(0, Math.min(1, t)) * Math.PI) * RACE.rimonArc;
      if (t < 1) return true;
      raceExplode(thing);
      return false;
    } else if (server.time > thing.until) {
      if (thing.kind === "rimon") raceExplode(thing); // an old rimon goes off by itself…
      return false;                                   // …and an old banana peel melts away
    }
    const reach = thing.kind === "rimon" ? RACE.rimonTrigger : 0.3;
    for (const q of everyone) {
      if (q.id === thing.owner && (thing.kind === "mango" || server.time < thing.ownerSafeUntil)) continue;
      if (q.finished || q.air > 150 || server.time < q.safeUntil) continue; // (flying sleds go right over it)
      if (Math.abs(q.x - thing.x) > reach) continue;
      // (A player's spot can be a tenth of a second old, so we look a little way behind the sled too.)
      const back = q.y - 150 - (q.bot ? 0 : Math.max(0, q.speed) * 0.12), front = q.y + RACE.sledLength;
      if (thing.y < back || from > front) continue;
      if (thing.kind === "rimon") raceExplode(thing); else raceHit(q, thing);
      return false;
    }
    return true;
  });
}

// A rimon blows up: every sled close enough spins out. (Not the sled that THREW it; one that
// DROPPED it can be caught, once its first safe moment is over. Sleds flying high are out of reach.)
function raceExplode(thing) {
  server.race.booms.push({ id: thing.id, x: thing.x, y: thing.y, at: server.time });
  for (const q of Object.values(server.players)) {
    if (q.id === thing.owner && (thing.thrown || server.time < thing.ownerSafeUntil)) continue;
    if (q.finished || q.air > 300 || server.time < q.safeUntil) continue;
    if (Math.abs(q.x - thing.x) > RACE.rimonBlast) continue;
    if (Math.abs(q.y + RACE.sledLength / 2 - thing.y) > RACE.rimonBlastLong) continue;
    raceHit(q, thing);
  }
}

// A sled was hit: it spins round and loses most of its speed. (A player's phone does that
// itself when it sees spinCount go up; the referee does it for bots.)
function raceHit(q, thing) {
  q.spinCount += 1;
  q.spinKind = thing.kind;
  q.safeUntil = server.time + RACE.itemSafeTime;
  if (q.bot) {
    q.speed *= RACE.spinSpeed;
    q.spinUntil = server.time + RACE.spinTime;
  }
  const owner = server.players[thing.owner];
  if (!q.bot) {
    if (thing.kind === "banana") toast("🍌 You slipped on a banana peel!", "🍌 הֶחֱלַקְתֶּם עַל קְלִפַּת בָּנָנָה!", q.id);
    else if (thing.kind === "rimon") toast(`💥 ${owner && owner.id !== q.id ? owner.name + "'s rimon" : "A rimon"} blew up next to you!`, "💥 רִמּוֹן הִתְפּוֹצֵץ לְיָדְכֶם!", q.id);
    else toast(`🥭 ${owner ? owner.name + "'s mango" : "A mango"} hit you!`, "🥭 מַנְגּוֹ פָּגַע בָּכֶם!", q.id);
  }
  if (owner && !owner.bot && owner.id !== q.id) toast(`🎯 You got ${q.name}!`, `🎯 פְּגִיעָה! ${q.name}`, owner.id);
}

// ---------- Mountain goats ----------
// Goats wander about on the path (race-track.js: every phone works out where each one is from
// the clock). When a sled bumps one, it is knocked flying and stays away for RACE.goatAway
// seconds. The referee only remembers WHICH goats were bumped, and when, and tells everyone.
function raceGoatHit(id, dir) {
  const goat = TRACK.goats[id];
  const last = server.race.goats[id];
  if (!goat || (last && server.time - last.at < RACE.goatAway)) return; // no such goat, or it is already away
  server.race.goats[id] = { at: server.time, dir };
}

// ---------- Bots: computer sleds ----------
// Bots are players the referee drives itself (bot: true). They only exist during a race:
// they join when the host taps Start (until there are RACE.bots sleds) and leave when
// everyone goes back to the lobby. Phones draw them like any other sled.
// Each bot: glides down a lane, wanders to a new lane now and then, steers around trees
// and rocks it sees ahead, and at each gate gets it right (boost + gift) or wrong (bounced back to try again).
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
      backUntil: LONG_AGO, // bounced back by a gate (a wrong answer) until then
      gateTries: 0,       // how many times it got the gate ahead of it wrong
      spinUntil: LONG_AGO, // spinning round after a banana peel or a mango
      freeUntil: LONG_AGO, // stuck? Until then, nothing stops it
      forkSide: 0,        // which way round an island it is going (-1 left, 1 right, 0 = no island here)
      carveTime: 0,       // how long it has been going round this bend (for the carve boost)
      useAt: 0,           // when it will use the gift it is holding
      crashAt: LONG_AGO,
      bumpAt: LONG_AGO,
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
  const oldY = p.y, oldX = p.x;

  // In the lake at the end: the water stops it.
  if (p.y >= TRACK.waterZ && p.air === 0) {
    p.speed = Math.max(0, p.speed - RACE.waterDrag * dt);
    p.y += p.speed * dt;
    return;
  }
  // Flying off a ramp: it just keeps going until it comes down. (Land on the path = a little boost.)
  if (p.air > 0) {
    p.y += p.speed * dt;
    if (sledFlight(p, oldY, oldX, dt) === "landed" && p.y < TRACK.waterZ && !offThePath(findSegment(p.y), p.x)) {
      p.boostUntil = Math.max(p.boostUntil, server.time + RACE.landBoostTime);
    }
    raceCheckFinish(p);
    return;
  }
  const spinning = server.time < p.spinUntil;

  // A wrong answer: the gate is bouncing it back up the path. Then it starts again from a standstill.
  if (server.time < p.backUntil) {
    p.y -= RACE.gateBounce / RACE.gateBounceTime * dt;
    p.speed = 0;
    return;
  }

  // Pick a new lane every few seconds.
  if (server.time > p.laneUntil) {
    p.laneUntil = server.time + 3 + Math.random() * 4;
    p.lane = (Math.random() * 2 - 1) * 0.7;
  }
  const room = Math.max(0.1, segment.width - 0.3); // stay on the path
  let target = Math.max(-room, Math.min(room, p.lane * room));
  // Where the path splits around an island: pick a way round (once), and stay on that side.
  const islandSoon = Math.max(segment.island, findSegment(p.y + 12 * RACE.segmentLength).island, findSegment(p.y + 25 * RACE.segmentLength).island);
  const islandAhead = Math.max(islandSoon, findSegment(p.y + 55 * RACE.segmentLength).island);
  const islandAt = segment.island > 0 ? segment.islandAt : findSegment(p.y + 25 * RACE.segmentLength).islandAt; // (where the island's middle is)
  const onIsland = Math.abs(p.x - islandAt) < segment.island;
  // (Bots never find the secret shortcuts: they always stay on the main path there.)
  const forkAhead = segment.fork || findSegment(p.y + 55 * RACE.segmentLength).fork;
  if (islandAhead === 0) p.forkSide = 0;
  else {
    if (forkAhead && forkAhead.secretSide) p.forkSide = -forkAhead.secretSide;
    if (!p.forkSide) p.forkSide = Math.abs(p.x - islandAt) > 0.3 ? Math.sign(p.x - islandAt) : Math.random() < 0.5 ? -1 : 1; // (the side it is on already)
    // Each way round is 1.25 wide, so its middle is about 0.6 out from the island's edge.
    // (Coming up to the island the path is still narrow: then it just keeps to that side.)
    target = Math.max(-room, Math.min(room, islandAt + p.forkSide * (islandSoon + 0.6 + p.lane * 0.15)));
  }

  // Look ahead for trees and rocks standing in the way, and aim past them.
  // (Better bots look further ahead, so they crash less.)
  const lookAhead = Math.round(12 + 34 * Math.max(0, Math.min(1, (p.skill - 0.8) / 0.18)));
  for (let i = segment.index + 1; i <= Math.min(TRACK.segments.length - 1, segment.index + lookAhead); i++) {
    for (const sprite of TRACK.segments[i].sprites) {
      const size = SPRITE_SIZES[sprite.type];
      if (!size.solid) continue;
      const reach = (SLED_WIDTH / 2 + size.hit / 2) / RACE.roadWidth + 0.15;
      // Is it in the way? Either it stands where the bot is heading, or (when it is close)
      // it stands between the bot and where it is heading, so cutting across would hit it.
      const mySide = p.x >= sprite.offset ? 1 : -1; // which side of it the bot is on now
      const across = !onIsland && (target - sprite.offset) * mySide < 0 && i - segment.index < 25 && Math.abs(p.x - sprite.offset) < 2;
      if (Math.abs(target - sprite.offset) >= reach && !across) continue;
      // Go past it on the side the bot is already on. (A tight squeeze there is still better
      // than cutting across in front of it. Only if there is really no room: the other side.)
      let spot = sprite.offset + mySide * reach;
      if (Math.abs(spot) > room) spot = sprite.offset + mySide * (reach - 0.12);
      if (Math.abs(spot) > segment.width - 0.08 || Math.abs(spot - segment.islandAt) < segment.island + 0.3) spot = sprite.offset - mySide * reach;
      target = spot;
    }
  }

  // Steer toward the target (the sled swings round, like a player's).
  const steer = spinning ? 0 : Math.max(-1, Math.min(1, (target - p.x) * 4));
  p.steer += (steer - p.steer) * Math.min(1, dt * RACE.turnSpeed);
  p.x += p.steer * RACE.steerSpeed * Math.max(fraction, RACE.slowSteer) * dt;

  // Gates: right = a boost and a gift. Wrong = bounced back up the path, to try again
  // (like a player: the second time it knows one wrong answer, so it does better).
  const gate = TRACK.gates[p.gatesDone];
  if (gate && p.y >= gate.z) {
    if (Math.random() < RACE.botRight + p.gateTries * 0.25) {
      p.gatesDone += 1;
      p.gateTries = 0;
      p.boostUntil = server.time + RACE.boostTime;
      raceGiveGift(p, gate.number);
    } else {
      p.gateTries += 1;
      p.backUntil = server.time + RACE.gateBounceTime;
      p.boostUntil = LONG_AGO;
      p.speed = 0;
      return;
    }
  }

  // Speed. To keep the race close, a bot far ahead of the best player eases off a
  // little, and one far behind pushes harder.
  const humans = Object.values(server.players).filter((other) => !other.bot);
  const best = Math.max(...humans.map((other) => other.y));
  const gap = p.y - best;
  const catchUp = !humans.length ? 1 : gap > RACE.botCatchUp ? 0.9 : gap < -RACE.botCatchUp ? 1.08 : 1;
  const boosting = server.time < p.boostUntil;
  // (A very sharp bend: it has to skid round, like a player, so it is slower there. The
  // shortcut down the mountain face and the tilted bends are faster, like for a player.)
  const skidding = Math.abs(segment.curve) > (RACE.sharpFrom + RACE.sharpFull) / 2;
  const onShortcut = segment.fork && segment.fork.fastSide && segment.island > 0.3 && (p.x - segment.islandAt) * segment.fork.fastSide > segment.island;
  const top = RACE.maxSpeed * p.skill * catchUp
    * (offThePath(segment, p.x) ? RACE.offTrackSpeed : 1)
    * (boosting ? RACE.boostSpeed : 1) * (spinning ? RACE.spinSpeed : 1)
    * (skidding ? RACE.skidSpeed : 1) * (onShortcut ? segment.fork.fastSpeed : 1) * (1 + (RACE.bankSpeed - 1) * Math.abs(segment.bank));
  if (p.speed > top) p.speed = Math.max(top, p.speed - RACE.offTrackSlowdown * dt);
  else p.speed = Math.min(top, p.speed + RACE.accel * (boosting ? 3 : 1) * dt);

  // Running into things, exactly like a player's sled: a bush or a snowman only slows it down;
  // a tree or a rock takes most of its speed and knocks it aside.
  // (A bot that hits trees twice in a few seconds is stuck, like among the trees on an island.
  // To get it going again, nothing stops it for the next two seconds.)
  if (p.speed > 0 && server.time > p.freeUntil) {
    const noseIndex = findSegment(p.y + RACE.sledLength).index;
    for (let i = segment.index; i <= noseIndex && server.time !== p.crashAt; i++) {
      for (const sprite of TRACK.segments[i].sprites) {
        const size = SPRITE_SIZES[sprite.type];
        if (!size.solid || Math.abs(p.x - sprite.offset) >= (SLED_WIDTH / 2 + size.hit / 2) / RACE.roadWidth) continue;
        if (size.soft) {
          if (sprite !== p.softHit && server.time - (p.softAt || LONG_AGO) > 0.35) { p.softHit = sprite; p.softAt = server.time; p.speed *= RACE.softHitSpeed; }
          continue;
        }
        if (server.time - p.crashAt <= 0.5) continue;
        p.crashDir = Math.abs(sprite.offset) > segment.width ? -Math.sign(sprite.offset) : p.x >= sprite.offset ? 1 : -1;
        p.speed *= size.rock ? RACE.rockHitSpeed : RACE.hardHitSpeed; // (a rock nearly stops it)
        p.y = Math.max(p.y - 250, Math.min(p.y, i * RACE.segmentLength - RACE.sledLength)); // (its nose stops AT the tree)
        if (server.time - p.crashAt < 4) p.freeUntil = server.time + 2.5;
        p.crashAt = server.time;
        break;
      }
    }
  }
  if (server.time - p.crashAt < RACE.crashShoveTime) p.x += p.crashDir * RACE.crashShove * dt;

  // Bumping into a mountain goat: the goat is knocked flying, the bot is slowed down.
  for (const goat of TRACK.goats) {
    if (Math.abs(goat.z - p.y) > 3000) continue;
    const last = server.race.goats[goat.id];
    if ((last && server.time - last.at < RACE.goatAway) || !sledHitsGoat(p, goat, server.time)) continue;
    raceGoatHit(goat.id, p.x >= GOAT_SPOT.x ? -1 : 1);
    p.speed *= RACE.goatHitSpeed;
  }

  // Sleds are solid: a bot that touches another sled gets pushed aside, just like a player.
  for (const other of Object.values(server.players)) {
    if (other === p) continue;
    const touch = sledsTouch(p, other);
    if (!touch) continue;
    p.x += touch.side * RACE.bumpShove * dt;
    if (touch.lined && touch.behind) p.speed = Math.min(p.speed, Math.max(0, other.speed) * 0.92);
    else if (touch.lined && server.time - p.bumpAt > 0.5) { p.bumpAt = server.time; p.speed += RACE.bumpBoost; }
  }

  // Carve boost, like a player's: a whole bend on the path at speed = a little boost when it ends (not every time).
  const bend = Math.abs(segment.curve);
  if (offThePath(segment, p.x) || fraction < 0.6) p.carveTime = 0;
  else if (bend >= RACE.carveCurve) p.carveTime += dt;
  else if (bend < RACE.carveCurve * 0.5) {
    if (p.carveTime >= RACE.carveAfter && Math.random() < 0.6) p.boostUntil = Math.max(p.boostUntil, server.time + RACE.carveBoost[0]);
    p.carveTime = 0;
  }

  p.y += p.speed * dt;
  sledFlight(p, oldY, oldX, dt); // (riding off the top of a ramp: it takes off)

  // A gift from a gate: use it a few seconds later.
  // (A mango waits until there is a sled ahead in the same lane, but not for ever. A rimon is
  // thrown if a sled is about where it would land, and dropped if somebody is close behind.)
  if (p.item && server.time > p.useAt && !spinning) {
    const others = Object.values(server.players).filter((other) => other !== p && !other.finished);
    if (p.item === "rimon") {
      const lands = RACE.rimonRange * 5500 / (5500 + RACE.rimonSpeed); // about how far ahead of ME it comes down
      const ahead = others.some((other) => Math.abs(other.y - p.y - lands) < RACE.rimonBlastLong * 1.5 && Math.abs(other.x - p.x) < RACE.rimonBlast);
      const behind = others.some((other) => other.y < p.y && other.y > p.y - 5000);
      if (ahead) raceUseItem(p);
      else if (behind || server.time > p.useAt + 5) raceUseItem(p, "drop");
    } else {
      const target = p.item === "mango" && others.some((other) =>
        other.y > p.y + RACE.sledLength && other.y < p.y + RACE.mangoRange * 0.7 && Math.abs(other.x - p.x) < 0.4);
      if (p.item === "banana" || target || server.time > p.useAt + 5) raceUseItem(p);
    }
  }
  raceCheckFinish(p);
}

function raceSnapshot(snap) {
  const race = server.race;
  snap.race = {
    startAt: race.startAt, finishers: race.finishers,
    things: race.things.map((thing) => ({ id: thing.id, kind: thing.kind, x: thing.x, y: thing.y, speed: thing.speed, air: Math.round(thing.air || 0) })),
    booms: race.booms.map((boom) => ({ id: boom.id, x: boom.x, y: boom.y })), // rimonim that blew up in the last moment
    goats: Object.keys(race.goats).filter((id) => server.time - race.goats[id].at < RACE.goatAway).map((id) => ({ id: Number(id), at: race.goats[id].at, dir: race.goats[id].dir })), // goats that are away right now
  };
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
