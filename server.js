// server.js — the REFEREE. Only the HOST's phone runs this code.
//
// Every phone moves its own player (so walking feels instant), but the referee
// makes all the important decisions so everyone agrees on what happened:
//   who got hit, who's knocked out, who has a flag, and the score.
//
// About 20 times a second, the referee packs up the whole game into a
// "snapshot" and sends it to every phone.

const server = {
  hostId: null,
  time: 0,          // the referee's clock (seconds) — every phone syncs to this
  phase: "lobby",   // "lobby" → "playing" → "over" → (a few seconds later) back to "lobby"
  winner: null,
  overAt: 0,        // when the last game ended
  players: {},      // every player, by id
  pastTeams: {},    // nickname → team, for players who left (so they rejoin the same team)
  flags: {},
  score: { blue: 0, red: 0 },
  speedBox: null,
  events: [],       // things that just happened (hits, messages) to send with the next snapshot
  deckId: "auto",   // "auto" (each player's own level) or the one deck everyone plays (the host picks)
  customDeck: null, // if the host picked one of their own decks: { id, name, words } to send to every phone
  classGame: false, // true = a teacher's class game: only then can the host pick the words for everyone
  mode: "ctf",      // which game: "ctf" = Capture the Flag (two more games are coming)
  shots: [],        // things flying through the air right now (thrown rocks, ninja stars)
  nextShotId: 1,
  freezeCount: 0,   // goes up with every freeze, so each freeze has its own number (see serverFreeze)
};

// The host picked the words. A teacher deck only lives on the host's phone, so we
// also keep a copy to send to everyone (with the next snapshot, and to anyone who asks later).
function serverSetDeck(deckId) {
  server.deckId = isDeckChoice(deckId) ? deckId : AUTO;
  const deck = findDeck(server.deckId);
  server.customDeck = deck && deck.custom ? { id: deck.id, name: deck.english, words: deck.words } : null;
  if (server.customDeck) server.events.push({ kind: "deck", deck: server.customDeck });
}

// The two flags. Each flag is in one of three states:
//   "home"    — standing on its stand in the middle of its base
//   "carried" — on someone's back (carrierId says whose)
//   "dropped" — lying on the ground (droppedAt says when, for the 30-second return)
function makeFlag(team) {
  const base = MAP.bases[team];
  return { team, x: base.x, y: base.y, state: "home", carrierId: null, droppedAt: 0 };
}

function makeSpeedBox() {
  return {
    name: "Speed box", nameHe: "קֻפְסַת מְהִירוּת", x: MAP.speedBox.x, y: MAP.speedBox.y, radius: 28,
    hp: 100, maxHp: 100, alive: true, lastHit: -10, respawnAt: 0,
  };
}

// Start a fresh room. options: { classGame: true/false, mode: "ctf" }
function serverReset(hostId, deckId, options = {}) {
  server.hostId = hostId;
  server.events = [];
  server.deckSentAt = -Infinity;
  server.classGame = Boolean(options.classGame);
  server.mode = options.mode || "ctf";
  // A normal room is always Auto here: each phone plays the level its own player picks.
  serverSetDeck(server.classGame ? deckId : AUTO);
  server.time = 0;
  server.phase = "lobby";
  server.players = {};
  server.pastTeams = {};
  resetRound();
}

function resetRound() {
  server.flags = { blue: makeFlag("blue"), red: makeFlag("red") };
  server.score = { blue: 0, red: 0 };
  server.speedBox = makeSpeedBox();
  // When each berry was last eaten (-Infinity = never, so it's ripe).
  server.berryEatenAt = MAP.berries.map(() => -Infinity);
  server.shots = [];
  server.mines = []; // pomegranate grenades lying hidden on the ground
  server.trees = []; // planted pomegranate trees (and the logs they turned into)
  server.winner = null;
}

// Is berry number `i` ripe (there to eat) right now?
function berryRipe(i) {
  return Boolean(MAP.berries[i]) && server.time - server.berryEatenAt[i] >= BERRY.regrow;
}

// A player touched a berry: they eat it and get a speed boost.
// Each berry's boost has its own end time, so several berries add up (up to BERRY.maxAtOnce).
function serverEat(p, i) {
  if (server.phase !== "playing" || !p.alive || !berryRipe(i)) return;
  const berry = MAP.berries[i];
  if (Math.hypot(p.x - berry.x, p.y - berry.y) > p.radius + BERRY.touch + 40) return; // too far (a little leeway for lag)
  server.berryEatenAt[i] = server.time;
  const boosts = (p.berryBoosts || []).filter((end) => end > server.time); // forget finished boosts
  if (boosts.length >= BERRY.maxAtOnce) boosts.sort((a, b) => a - b).shift(); // full: the oldest one makes room
  boosts.push(server.time + BERRY.duration);
  p.berryBoosts = boosts;
  // Berries also heal you a little (never above full health).
  const healed = Math.min(BERRY.heal, p.maxHp - p.hp);
  p.hp += healed;
  const heart = healed > 0 ? `  ❤️+${healed}` : "";
  floatText(`🍒 +${Math.round(boosts.length * BERRY.boostEach * 100)}%${heart}`, p.x, p.y - 40, "#fca5a5", 0.8, "munch");
}

// ---------- Events (sent to phones with the next snapshot) ----------

// A message for everyone ("all") or one player (their id). `he` is the Hebrew, shown underneath.
function toast(text, he, to = "all") {
  server.events.push({ kind: "toast", text, he, to });
}
// Words that float up from the map. `he` (optional) is a Hebrew line drawn underneath.
// `sound` (optional) is the name of a sound effect from sound.js for phones nearby to play.
function floatText(text, x, y, color = "#fde047", life = 0.9, sound = null, he = null) {
  server.events.push({ kind: "text", text, he, x, y, color, life, sound });
}

// ---------- Players joining and leaving ----------

function cleanName(name) {
  return String(name || "").trim().slice(0, 12) || "Player";
}

function serverAddPlayer(id, name) {
  if (server.players[id]) return;
  // Closed the game and came straight back? The old "you" may still be standing there
  // (we wait 8 seconds before removing a silent phone). If someone with the same
  // nickname has been silent for 2+ seconds, that's the old you: remove it now.
  // Like a knockout, it drops any flag and loses the hammer. (Phones that are really
  // playing check in every second, so a different player with the same name is safe.)
  for (const old of Object.values(server.players)) {
    if (old.id !== server.hostId && old.name === cleanName(name) && server.time - old.lastSeen > 2) {
      serverRemovePlayer(old.id);
    }
  }
  // Coming back after leaving (same nickname)? Back on your old team.
  // Otherwise, join whichever team is smaller.
  const everyone = Object.values(server.players);
  const blueCount = everyone.filter((p) => p.team === "blue").length;
  const pastTeam = server.pastTeams[cleanName(name)];
  const team = pastTeam || (blueCount <= everyone.length - blueCount ? "blue" : "red");

  server.players[id] = {
    id,
    name: cleanName(name),
    team,
    ...spawnPoint(team),
    radius: PLAYER_RADIUS,
    facing: team === "blue" ? 0 : Math.PI,
    moving: false,
    hp: MAX_HP,
    maxHp: MAX_HP,
    alive: true,
    respawnAt: 0,
    items: [],          // what I've bought (ids from ITEMS in rules.js), lost when knocked out
    ammo: {},           // how many of each THROWN item I have left, like { rock: 2, stars: 4 }
    held: null,         // which of my items I'm holding right now (null = empty hands)
    frozen: false,      // hit by a rock: can't move until I answer a question right
    freezeId: 0,        // which freeze that is (each freeze gets a new number)
    carrying: null,
    boostUntil: 0,
    berryBoosts: [],    // end times of my berry speed boosts (they add up)
    inLog: 0,           // which log I'm hiding in (1, 2, 3…), 0 = not hiding (other phones don't draw you)
    lastSwing: -10,
    lastHit: -10,
    spawnCount: 0,      // goes up each time the referee teleports you (start, respawn)
    lastSeen: server.time,
  };
  const playerName = server.players[id].name;
  toast(`👋 ${playerName} joined the ${TEAM_NAMES[team]} team`, `${playerName} הִצְטָרֵף/הִצְטָרְפָה ${TEAM_HE[team].toTeam}`);
}

function serverRemovePlayer(id) {
  const p = server.players[id];
  if (!p) return;
  serverDropFlag(p);
  server.pastTeams[p.name] = p.team; // remember their team in case they come back
  delete server.players[id];
  toast(`👋 ${p.name} left the game`, `${p.name} יָצָא/יָצְאָה מֵהַמִּשְׂחָק`);
}

// ---------- Messages from phones ----------

function serverHandle(id, msg) {
  if (!msg || typeof msg !== "object") return;
  if (msg.type === "join") {
    serverAddPlayer(id, msg.name);
    return;
  }
  const p = server.players[id];
  if (!p) return;
  p.lastSeen = server.time;

  switch (msg.type) {
    case "ping":
      break; // just "I'm still here"
    case "team":
      if (server.phase === "lobby") p.team = msg.team === "red" ? "red" : "blue";
      break;
    case "start":
      if (id === server.hostId) serverStartGame();
      break;
    case "deck":
      // Only the host of a CLASS game can pick the words for everyone, and not in the middle of a battle.
      if (server.classGame && id === server.hostId && server.phase !== "playing" && isDeckChoice(msg.deckId)) {
        serverSetDeck(msg.deckId);
      }
      break;
    case "needDeck":
      // A phone doesn't have the host's teacher deck yet (it just joined). Send it.
      // (It goes out with the next snapshot. Every phone gets it, which is harmless.)
      // At most once a second, even if several phones ask at the same moment.
      if (server.customDeck && server.time - (server.deckSentAt || -Infinity) >= 1) {
        server.deckSentAt = server.time;
        server.events.push({ kind: "deck", deck: server.customDeck });
      }
      break;
    case "move":
      if (p.alive && server.phase === "playing" && Number.isFinite(msg.x) && Number.isFinite(msg.y)) {
        p.x = msg.x;
        p.y = msg.y;
        clampToMap(p);
        p.facing = Number(msg.facing) || 0;
        p.moving = Boolean(msg.moving);
        // Which log they're hiding in (1, 2, 3…), or 0 = not hiding. Flag carriers can't hide.
        p.inLog = p.carrying ? 0 : Math.max(0, Math.floor(Number(msg.inLog) || 0));
      }
      break;
    case "eat":
      serverEat(p, Number(msg.berry));
      break;
    case "swing":
      serverSwing(p);
      break;
    case "throw":
      serverThrow(p, Number(msg.angle));
      break;
    case "unfreeze":
      // The frozen player answered a question right. (The number makes sure it's an
      // answer to THIS freeze, not an old message arriving late.)
      if (p.frozen && msg.freezeId === p.freezeId) p.frozen = false;
      break;
    case "drop":
      serverDropFlag(p);
      break;
    case "grab":
      serverGrab(p, msg.flag);
      break;
    case "buy":
      // The phone already made the player answer the questions (the item's cost).
      // Hand weapons: you buy each one once. Thrown things: you can buy more any time
      // (each buy adds `perBuy` of them). Either way, you start holding it straight away.
      if (ITEMS[msg.item] && p.alive && nearShop(p, 40)) {
        const item = ITEMS[msg.item];
        if (item.kind === "throw") {
          p.ammo[msg.item] = (p.ammo[msg.item] || 0) + item.perBuy;
          if (!p.items.includes(msg.item)) p.items.push(msg.item);
          p.held = msg.item;
        } else if (!p.items.includes(msg.item)) {
          p.items.push(msg.item);
          if (isHoldable(msg.item)) p.held = msg.item; // (boots are worn, not held)
        }
      }
      break;
    case "plant":
      serverPlant(p);
      break;
    case "hold":
      // Picked something in the toolbar (or empty hands = null).
      if (msg.item === null || (p.items.includes(msg.item) && isHoldable(msg.item))) p.held = msg.item;
      break;
  }
}

function serverStartGame() {
  resetRound();
  server.phase = "playing";
  for (const p of Object.values(server.players)) {
    Object.assign(p, spawnPoint(p.team), {
      hp: MAX_HP, alive: true, items: [], ammo: {}, held: null, frozen: false, carrying: null, boostUntil: 0, berryBoosts: [], inLog: 0, lastSwing: -10,
      facing: p.team === "blue" ? 0 : Math.PI,
    });
    p.spawnCount += 1;
  }
  toast("⚔️ The battle begins! Grab the enemy flag!", "הַקְּרָב מַתְחִיל! תּוֹפְסִים אֶת הַדֶּגֶל שֶׁל הָאוֹיֵב!");
}

// ---------- Fighting ----------

// Logs (step 6): hiding in a log keeps you safe from everything except pomegranates.
// From inside, you can only attack OUT through the open ends.

// The log this player is hiding in, or null.
function logOf(p) {
  return p && p.inLog ? MAP.logs[p.inLog - 1] || null : null;
}

// Is `target` safe from `attacker` because it's hiding in a log? (Not if they're both in the SAME log.)
function safeInLog(target, attacker) {
  return Boolean(target.inLog) && target.inLog !== (attacker && attacker.inLog);
}

// Is the spot (x, y) out past one of the log's open ends, lined up with the hole?
// `radius` = the size of whatever is there (a player's body counts if it overlaps the opening).
function outThroughEnd(log, x, y, radius = 0) {
  const { along, side } = logLocal(log, x, y);
  return Math.abs(along) > log.length / 2 && Math.abs(side) < LOG.width / 2 + radius;
}

// Can `attacker` reach `target` (a player or the speed box), as far as logs go?
function logAllowsHit(attacker, target) {
  if (target.inLog !== undefined && safeInLog(target, attacker)) return false; // target is hiding
  const log = logOf(attacker);
  if (!log || (target.inLog && target.inLog === attacker.inLog)) return true; // not hiding, or same log
  return outThroughEnd(log, target.x, target.y, target.radius); // hiding: only out through the ends
}

// A swing with whatever hand weapon you're holding (stick, hammer…). Its numbers are in ITEMS.
function serverSwing(p) {
  const weapon = ITEMS[p.held];
  if (server.phase !== "playing" || !p.alive || !weapon || weapon.kind !== "melee" || p.carrying || p.frozen) return;
  if (server.time - p.lastSwing < weapon.cooldown * 0.8) return; // too soon (a little leeway for lag)
  p.lastSwing = server.time;
  server.events.push({ kind: "ring", x: p.x, y: p.y, radius: weapon.range, life: 0.35, sound: "swing" });

  // Hit every enemy inside the zone around you (logs can get in the way: logAllowsHit).
  for (const enemy of Object.values(server.players)) {
    if (enemy.team === p.team || !enemy.alive || !logAllowsHit(p, enemy)) continue;
    if (distance(enemy, p) < weapon.range + enemy.radius) serverHurt(enemy, weapon.damage, p);
  }
  // And the speed box.
  const box = server.speedBox;
  if (box.alive && logAllowsHit(p, box) && distance(box, p) < weapon.range + box.radius) serverHurt(box, weapon.damage, p);
}

// ---------- The spear ----------

// Where the tip of a player's spear is: straight out in front of them, a little to the right
// (it's in the right hand). drawSpear in draw.js draws it in the same spot.
function spearTip(p) {
  const reach = p.radius + ITEMS.spear.length;
  const side = ITEMS.spear.side;
  const right = p.facing + Math.PI / 2;
  return {
    x: p.x + Math.cos(p.facing) * reach + Math.cos(right) * side,
    y: p.y + Math.sin(p.facing) * reach + Math.sin(right) * side,
  };
}

// Runs every frame. Anyone holding a spear whose tip touches an enemy knocks them out.
// (Not while frozen or carrying a flag, the same as the other weapons.)
function serverCheckSpears() {
  const spear = ITEMS.spear;
  for (const p of Object.values(server.players)) {
    if (p.held !== "spear" || !p.alive || p.frozen || p.carrying) continue;
    if (server.time - p.lastSwing < spear.cooldown) continue; // just stabbed someone
    const tip = spearTip(p);
    // Hiding in a log? The spear only works if its tip sticks out of an open end.
    const log = logOf(p);
    if (log && !outThroughEnd(log, tip.x, tip.y)) continue;
    // The speed box: one stab smashes it (and you get the speed boost).
    const box = server.speedBox;
    if (box.alive && distance(box, tip) <= box.radius + spear.tipReach) {
      p.lastSwing = server.time;
      serverHurt(box, box.hp, p);
      continue;
    }
    for (const enemy of Object.values(server.players)) {
      if (enemy.team === p.team || !enemy.alive || safeInLog(enemy, p)) continue;
      if (distance(enemy, tip) > enemy.radius + spear.tipReach) continue;
      p.lastSwing = server.time; // (phones use this to draw a quick jab)
      serverHurt(enemy, enemy.hp, p); // all their health = knocked out
      break; // one stab at a time
    }
  }
}

// ---------- Throwing (rocks, ninja stars) ----------

// A player threw what they're holding, toward `angle` (radians: 0 = right, π/2 = down).
// The referee makes a "shot" that flies across the map; serverMoveShots moves it every frame.
function serverThrow(p, angle) {
  const id = p.held;
  const item = ITEMS[id];
  if (server.phase !== "playing" || !p.alive || !item || item.kind !== "throw" || p.carrying || p.frozen) return;
  if (!Number.isFinite(angle) || !(p.ammo[id] > 0)) return;
  if (server.time - p.lastSwing < item.cooldown * 0.8) return; // too soon (a little leeway for lag)
  // Hiding in a log: you can only throw straight out of an open end (sideways = the log's wall).
  const log = logOf(p);
  if (log && !throwFitsLog(log, angle)) return;
  p.lastSwing = server.time;
  p.facing = angle;

  // Use one up. The last one? It's gone from your toolbar, and your hands are empty.
  p.ammo[id] -= 1;
  if (p.ammo[id] <= 0) {
    delete p.ammo[id];
    p.items = p.items.filter((other) => other !== id);
    p.held = null;
  }

  // It starts at the edge of your body and flies in a straight line.
  const dirX = Math.cos(angle);
  const dirY = Math.sin(angle);
  server.shots.push({
    id: server.nextShotId++,
    item: id,
    team: p.team,
    ownerId: p.id,
    ownerName: p.name,
    x: p.x + dirX * p.radius,
    y: p.y + dirY * p.radius,
    vx: dirX * item.speed,   // speed in each direction (for phones to draw it smoothly between snapshots)
    vy: dirY * item.speed,
    flown: 0,                // how far it has flown so far
    ownerLog: p.inLog,       // the log it was thrown from (0 = none): it can hit people in THAT log only
    hitIds: [],              // who it already hit (a ninja star hits each enemy only once)
  });
  server.events.push({ kind: "sound", x: p.x, y: p.y, life: 0, sound: "throw" });
}

// How close does the line from (x1, y1) to (x2, y2) come to point c?
// (Checking the whole line, not just the end, means a fast shot can't skip over someone.)
function distanceToLine(c, x1, y1, x2, y2) {
  const lineX = x2 - x1;
  const lineY = y2 - y1;
  const lengthSquared = lineX * lineX + lineY * lineY;
  let t = lengthSquared > 0 ? ((c.x - x1) * lineX + (c.y - y1) * lineY) / lengthSquared : 0;
  t = Math.min(1, Math.max(0, t)); // stay between the two ends
  return Math.hypot(c.x - (x1 + lineX * t), c.y - (y1 + lineY * t));
}

// Move everything that's flying, and check what it hits. Runs every frame.
function serverMoveShots(dt) {
  for (const shot of server.shots) {
    const item = ITEMS[shot.item];
    const step = Math.min(item.speed * dt, item.range - shot.flown); // never past its full range
    const fromX = shot.x;
    const fromY = shot.y;
    const toX = fromX + (shot.vx / item.speed) * step;
    const toY = fromY + (shot.vy / item.speed) * step;
    // Whoever threw it (they might have left the game since; then just their name).
    const owner = server.players[shot.ownerId] || { id: null, name: shot.ownerName };

    // Did it hit an enemy on the way? (A grenade flies over everyone; it only lands.)
    for (const enemy of Object.values(server.players)) {
      if (item.lands) break;
      if (enemy.team === shot.team || !enemy.alive || shot.hitIds.includes(enemy.id)) continue;
      if (enemy.inLog && enemy.inLog !== shot.ownerLog) continue; // hiding in a log: it flies over them
      if (distanceToLine(enemy, fromX, fromY, toX, toY) > enemy.radius + item.size) continue;
      shot.hitIds.push(enemy.id);
      if (item.freezes) serverFreeze(enemy, owner);
      if (item.damage > 0) serverHurt(enemy, item.damage, owner);
      if (!item.goesThrough) {
        shot.done = true; // a rock stops at the first person it hits
        break;
      }
    }
    // Things that do damage can smash the speed box too.
    const box = server.speedBox;
    if (!shot.done && !item.lands && item.damage > 0 && box.alive && !shot.hitIds.includes("box") &&
        distanceToLine(box, fromX, fromY, toX, toY) <= box.radius + item.size) {
      shot.hitIds.push("box");
      serverHurt(box, item.damage, owner);
      if (!item.goesThrough) shot.done = true;
    }

    shot.x = toX;
    shot.y = toY;
    shot.flown += step;
    const offMap = shot.x < 0 || shot.y < 0 || shot.x > MAP.width || shot.y > MAP.height;
    if (shot.flown >= item.range || offMap) {
      shot.done = true;
      // A grenade lands where it stopped and hides there.
      if (item.lands) addMine(shot.x, shot.y, shot.team, owner);
    }
  }
  server.shots = server.shots.filter((shot) => !shot.done);
}

// ---------- Pomegranates (settings in POMEGRANATE in rules.js) ----------

// A pomegranate grenade lands on the ground. Enemies can't see it (their phones don't draw it).
function addMine(x, y, team, owner) {
  server.mines.push({
    id: server.nextShotId++,
    x: Math.min(MAP.width - 10, Math.max(10, x)),
    y: Math.min(MAP.height - 10, Math.max(10, y)),
    team,
    ownerId: owner.id,
    ownerName: owner.name,
    explodeAt: server.time + POMEGRANATE.hideTime, // nobody came near? It blows up by itself then.
  });
}

// Runs every frame: does an enemy walk near a hidden grenade? Is its time up?
function serverUpdateMines() {
  for (const mine of server.mines) {
    const enemyNear = Object.values(server.players).some((enemy) =>
      enemy.team !== mine.team && enemy.alive && distance(enemy, mine) < enemy.radius + POMEGRANATE.trigger);
    if (enemyNear || server.time >= mine.explodeAt) {
      mine.done = true;
      explodeMine(mine);
    }
  }
  server.mines = server.mines.filter((mine) => !mine.done);
}

// BOOM: seeds fly everywhere. Every enemy in range loses half of their FULL health.
function explodeMine(mine) {
  server.events.push({ kind: "boom", x: mine.x, y: mine.y, radius: POMEGRANATE.blast, life: 0.7, sound: "boom" });
  const owner = server.players[mine.ownerId] || { id: null, name: mine.ownerName };
  for (const enemy of Object.values(server.players)) {
    if (enemy.team === mine.team || !enemy.alive) continue;
    if (distance(enemy, mine) < POMEGRANATE.blast + enemy.radius) {
      serverHurt(enemy, Math.ceil(enemy.maxHp * POMEGRANATE.damageShare), owner);
    }
  }
}

// Is this a good spot for a tree? Not in a river, a base, on top of a rock, log or another
// tree, or right at the edge of the map. (There must be room for the log it turns into.)
function canPlantAt(x, y) {
  const edge = POMEGRANATE.logLength / 2 + 20;
  if (x < edge || y < edge || x > MAP.width - edge || y > MAP.height - edge) return false;
  if (isInWater(x, y)) return false;
  for (const base of Object.values(MAP.bases)) {
    if (Math.hypot(x - base.x, y - base.y) < base.radius + 60) return false;
  }
  for (const [rx, ry] of MAP.rocks) {
    if (Math.hypot(x - rx, y - ry) < ROCK_RADIUS + 90) return false;
  }
  for (const log of MAP.logs) {
    if (Math.hypot(x - log.x, y - log.y) < log.length / 2 + 90) return false;
  }
  for (const tree of server.trees) {
    if (Math.hypot(x - tree.x, y - tree.y) < POMEGRANATE.logLength + 20) return false;
  }
  return true;
}

// A player pressed Plant while holding a tree: plant it just in front of them.
function serverPlant(p) {
  if (server.phase !== "playing" || !p.alive || p.held !== "tree" || p.carrying || p.frozen) return;
  const reach = p.radius + POMEGRANATE.plantAhead;
  const x = p.x + Math.cos(p.facing) * reach;
  const y = p.y + Math.sin(p.facing) * reach;
  if (!canPlantAt(x, y)) {
    toast("🌳 You can't plant a tree here. Try an open spot (not a river, base, rock or log).",
      "אִי אֶפְשָׁר לִשְׁתֹּל עֵץ כָּאן. נַסּוּ מָקוֹם פָּתוּחַ (לֹא נָהָר, בָּסִיס, סֶלַע אוֹ בּוּל עֵץ).", p.id);
    return;
  }
  p.items = p.items.filter((id) => id !== "tree");
  p.held = null;
  server.trees.push({
    id: server.nextShotId++,
    x, y,
    team: p.team,
    ownerId: p.id,
    ownerName: p.name,
    plantedAt: server.time,
    dropped: 0,                       // grenades dropped so far
    state: "tree",                    // "tree" → later "log"
    angle: Math.random() * Math.PI,   // which way the log will lie
  });
  server.events.push({ kind: "sound", x, y, life: 0, sound: "plant" });
  toast("🌳 Tree planted! It will drop hidden pomegranate grenades.", "שְׁתַלְתֶּם עֵץ! הוּא יַפִּיל רִמּוֹנֵי יָד נִסְתָּרִים.", p.id);
}

// Runs every frame: trees drop a grenade every (treeLife ÷ treeDrops) seconds,
// and after the last one they turn into a hollow log (phones add it to MAP.logs).
function serverUpdateTrees() {
  const every = POMEGRANATE.treeLife / POMEGRANATE.treeDrops; // 120 ÷ 4 = every 30 seconds
  for (const tree of server.trees) {
    if (tree.state !== "tree") continue;
    if (tree.dropped < POMEGRANATE.treeDrops && server.time >= tree.plantedAt + (tree.dropped + 1) * every) {
      tree.dropped += 1;
      const angle = Math.random() * Math.PI * 2;
      const dist = POMEGRANATE.dropMin + Math.random() * (POMEGRANATE.dropMax - POMEGRANATE.dropMin);
      const owner = server.players[tree.ownerId] || { id: null, name: tree.ownerName };
      addMine(tree.x + Math.cos(angle) * dist, tree.y + Math.sin(angle) * dist, tree.team, owner);
    }
    if (server.time >= tree.plantedAt + POMEGRANATE.treeLife) tree.state = "log";
  }
}

// Hit by a rock: frozen until you answer a question right (your phone asks it, and
// sends "unfreeze" with this freeze's number). Being frozen again while frozen changes nothing.
function serverFreeze(target, attacker) {
  if (target.frozen) return;
  target.frozen = true;
  server.freezeCount += 1;
  target.freezeId = server.freezeCount;
  floatText("Frozen!", target.x, target.y - 50, "#bae6fd", 1.2, "freeze", "קָפוּא!");
  if (attacker.id) toast(`🧊 You froze ${target.name}!`, `הִקְפֵּאתֶם אֶת ${target.name}!`, attacker.id);
}

function serverHurt(target, amount, attacker) {
  target.hp = Math.max(0, target.hp - amount);
  target.lastHit = server.time;
  floatText("-" + amount, target.x, target.y - 30, "#fde047", 0.9, "hit");
  if (target.hp > 0) return;

  if (target === server.speedBox) {
    // Box smashed: the attacker gets a speed boost.
    target.alive = false;
    target.respawnAt = server.time + SPEED_BOOST.respawn;
    attacker.boostUntil = server.time + SPEED_BOOST.duration;
    floatText("⚡ SPEED!", target.x, target.y - 50, "#fde047", 1.4, "boost", "מְהִירוּת!");
    toast(`⚡ Speed boost! ${SPEED_BOOST.multiplier}× speed for ${SPEED_BOOST.duration} seconds`,
      `מְהִירוּת ×${SPEED_BOOST.multiplier} לְמֶשֶׁךְ ${SPEED_BOOST.duration} שְׁנִיּוֹת!`, attacker.id);
  } else {
    // A player is knocked out: they drop any flag, lose everything they bought, and respawn soon.
    target.alive = false;
    target.respawnAt = server.time + RESPAWN_TIME;
    serverDropFlag(target);
    target.items = [];
    target.ammo = {};
    target.held = null;
    target.frozen = false;
    target.boostUntil = 0;
    target.berryBoosts = [];
    target.inLog = 0;
    floatText("💥 KO!", target.x, target.y - 60, "#fff", 1.2, "ko", "נוֹקְאָאוּט!");
    toast(`💥 ${attacker.name} knocked out ${target.name}!`, `${attacker.name} הִפִּיל/הִפִּילָה אֶת ${target.name}!`);
  }
}

// ---------- Flags ----------

function serverGrab(p, team) {
  const flag = server.flags[team];
  if (!flag || server.phase !== "playing" || !p.alive || p.carrying) return;
  if (flag.state === "carried") {
    toast("Too slow — someone else grabbed it!", "מְאֻחָר מִדַּי — מִישֶׁהוּ אַחֵר תָּפַס אוֹתוֹ!", p.id);
    return;
  }
  if (flag.team === p.team && flag.state === "home") return; // your flag is already safe
  if (distance(flag, p) > FLAG_REACH + 40) return;           // too far away (a little leeway for lag)

  flag.state = "carried";
  flag.carrierId = p.id;
  p.carrying = team;
  if (team === p.team) {
    toast("🚩 Got your flag back! Carry it home.", "יֵשׁ! הַדֶּגֶל שֶׁלָּכֶם חָזַר. מַחֲזִירִים אוֹתוֹ הַבַּיְתָה.", p.id);
  } else {
    toast("🚩 You've got the flag! Run back to your base!", "יֵשׁ דֶּגֶל! רָצִים חֲזָרָה לַבָּסִיס!", p.id);
    toast(`🚨 ${p.name} grabbed the ${TEAM_NAMES[team]} flag!`, `${p.name} תָּפַס/תָּפְסָה אֶת ${TEAM_HE[team].flag}!`);
  }
}

function serverDropFlag(p) {
  if (!p.carrying) return;
  const flag = server.flags[p.carrying];
  flag.state = "dropped";
  flag.x = p.x;
  flag.y = p.y;
  flag.carrierId = null;
  flag.droppedAt = server.time;
  p.carrying = null;
}

function sendFlagHome(flag) {
  Object.assign(flag, makeFlag(flag.team));
}

// Who is carrying this flag right now? (null if nobody)
function carrierOf(flag) {
  return flag.state === "carried" ? server.players[flag.carrierId] || null : null;
}

// Checks one team's base (the big circle), every frame.
// THE RULE: if BOTH flags are inside a team's circle, that team gets a point.
// A flag counts if it's standing on its stand, lying on the ground, or carried
// by someone on that team. (A flag in an ENEMY's hands doesn't count — it's being stolen.)
function checkBase(team) {
  const home = MAP.bases[team];
  const own = server.flags[team];
  const enemy = server.flags[otherTeam(team)];
  const counts = (flag) => {
    const carrier = carrierOf(flag);
    return distance(flag, home) <= home.radius && (!carrier || carrier.team === team);
  };

  // 1) Your own flag is back inside your base (carried in, or dropped there) → back on its stand.
  if (own.state !== "home" && counts(own)) {
    const carrier = carrierOf(own);
    sendFlagHome(own);
    if (carrier) {
      carrier.carrying = null;
      toast(`🏠 ${carrier.name} brought the ${TEAM_NAMES[team]} flag home!`, `${carrier.name} הֶחֱזִיר/הֶחֱזִירָה אֶת ${TEAM_HE[team].flag} הַבַּיְתָה!`);
    } else {
      toast(`↩️ The ${TEAM_NAMES[team]} flag returned to its base.`, `${TEAM_HE[team].flag} חָזַר לַבָּסִיס.`);
    }
  }

  if (!counts(enemy)) return;
  const scorer = carrierOf(enemy); // a player, or null if the flag was dropped here

  // 2) Both flags are in your base → a point!
  if (counts(own)) {
    if (scorer) scorer.carrying = null;
    sendFlagHome(enemy);
    server.score[team] += 1;
    const spot = scorer || home;
    floatText("🎉 +1", spot.x, spot.y - 50, "#fff", 1.5, "score");
    const points = `(${server.score[team]} of ${WIN_SCORE})`;
    const pointsHe = `(${server.score[team]} מִתּוֹךְ ${WIN_SCORE})`;
    if (scorer) {
      toast(`🎉 ${scorer.name} scores for ${TEAM_NAMES[team]}! ${points}`, `${scorer.name} — נְקֻדָּה ${TEAM_HE[team].toPlayers}! ${pointsHe}`);
    } else {
      toast(`🎉 Point for ${TEAM_NAMES[team]}! ${points}`, `נְקֻדָּה ${TEAM_HE[team].toPlayers}! ${pointsHe}`);
    }
    if (server.score[team] >= WIN_SCORE) {
      server.phase = "over";
      server.winner = team;
      server.overAt = server.time; // when the game ended (for going back to the teams)
    }
  } else if (scorer && server.time - (scorer.lastHint || -10) > 3) {
    // Brought the enemy flag home, but your own flag is missing.
    scorer.lastHint = server.time;
    toast("⚠️ Your own flag must be in your base too before you can score!", "גַּם הַדֶּגֶל שֶׁלָּכֶם צָרִיךְ לִהְיוֹת בַּבָּסִיס כְּדֵי לְקַבֵּל נְקֻדָּה!", scorer.id);
  }
}

// ---------- Every frame ----------

function serverUpdate(dt) {
  server.time += dt;

  // Remove players we haven't heard from in 8 seconds (their phone probably went to sleep).
  for (const p of Object.values(server.players)) {
    if (p.id !== server.hostId && server.time - p.lastSeen > 8) serverRemovePlayer(p.id);
  }

  // The game ended a few seconds ago: everyone goes back to the teams screen (the lobby).
  if (server.phase === "over" && server.time - server.overAt >= WINNER_SCREEN_TIME) {
    server.phase = "lobby";
    resetRound();
  }

  if (server.phase !== "playing") return;

  for (const p of Object.values(server.players)) {
    // Respawn knocked-out players at their base, with nothing.
    if (!p.alive && server.time >= p.respawnAt) {
      Object.assign(p, spawnPoint(p.team), { alive: true, hp: MAX_HP, items: [], ammo: {}, held: null, frozen: false });
      p.spawnCount += 1;
    }
    // A carried flag travels with its carrier.
    if (p.alive && p.carrying) {
      server.flags[p.carrying].x = p.x;
      server.flags[p.carrying].y = p.y;
    }
  }

  // Check both bases for returned flags and points.
  for (const team of ["blue", "red"]) {
    checkBase(team);
    if (server.phase !== "playing") return; // someone just won
  }

  serverMoveShots(dt); // thrown rocks and ninja stars fly (and maybe hit someone)
  serverCheckSpears(); // spear tips touching enemies
  serverUpdateTrees(); // pomegranate trees drop grenades, then become logs
  serverUpdateMines(); // hidden grenades go off

  const box = server.speedBox;
  if (!box.alive && server.time >= box.respawnAt) Object.assign(box, makeSpeedBox());

  // Dropped flags go home by themselves after a while.
  for (const flag of Object.values(server.flags)) {
    if (flag.state === "dropped" && server.time - flag.droppedAt >= FLAG_RETURN_TIME) {
      sendFlagHome(flag);
      toast(`↩️ The ${TEAM_NAMES[flag.team]} flag returned to its base.`, `${TEAM_HE[flag.team].flag} חָזַר לַבָּסִיס.`);
    }
  }
}

// Pack up everything the phones need to draw the game.
function serverSnapshot() {
  const snapshot = {
    type: "state",
    time: server.time,
    phase: server.phase,
    winner: server.winner,
    hostId: server.hostId,
    deckId: server.deckId,
    classGame: server.classGame,
    mode: server.mode,
    score: { ...server.score },
    flags: { blue: { ...server.flags.blue }, red: { ...server.flags.red } },
    speedBox: { ...server.speedBox },
    berries: MAP.berries.map((berry, i) => berryRipe(i)), // which berries are ripe (true/false each)

    // Things flying through the air (just what phones need to draw them).
    shots: server.shots.map((s) => ({ id: s.id, item: s.item, x: s.x, y: s.y, vx: s.vx, vy: s.vy, flown: s.flown })),
    // Hidden grenades (phones only draw their OWN team's) and planted trees.
    mines: (server.mines || []).map((m) => ({ id: m.id, x: m.x, y: m.y, team: m.team, explodeAt: m.explodeAt })),
    trees: (server.trees || []).map((t) => ({ id: t.id, x: t.x, y: t.y, team: t.team, dropped: t.dropped, state: t.state, angle: t.angle })),

    players: Object.values(server.players).map((p) => ({ ...p, ammo: { ...p.ammo } })),
    events: server.events,
  };
  server.events = [];
  return snapshot;
}
