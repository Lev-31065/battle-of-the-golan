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
  flags: {},
  score: { blue: 0, red: 0 },
  speedBox: null,
  events: [],       // things that just happened (hits, messages) to send with the next snapshot
  deckId: "auto",   // "auto" (each player's own level) or the one deck everyone plays (the host picks)
};

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

function serverReset(hostId, deckId) {
  server.hostId = hostId;
  server.deckId = isDeckChoice(deckId) ? deckId : AUTO;
  server.time = 0;
  server.phase = "lobby";
  server.players = {};
  resetRound();
}

function resetRound() {
  server.flags = { blue: makeFlag("blue"), red: makeFlag("red") };
  server.score = { blue: 0, red: 0 };
  server.speedBox = makeSpeedBox();
  server.winner = null;
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
  // Put new players on whichever team is smaller.
  const everyone = Object.values(server.players);
  const blueCount = everyone.filter((p) => p.team === "blue").length;
  const team = blueCount <= everyone.length - blueCount ? "blue" : "red";

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
    weapon: null,
    carrying: null,
    boostUntil: 0,
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
      // Only the host can pick the words, and not in the middle of a battle.
      if (id === server.hostId && server.phase !== "playing" && isDeckChoice(msg.deckId)) {
        server.deckId = msg.deckId;
      }
      break;
    case "move":
      if (p.alive && server.phase === "playing" && Number.isFinite(msg.x) && Number.isFinite(msg.y)) {
        p.x = msg.x;
        p.y = msg.y;
        clampToMap(p);
        p.facing = Number(msg.facing) || 0;
        p.moving = Boolean(msg.moving);
      }
      break;
    case "swing":
      serverSwing(p);
      break;
    case "drop":
      serverDropFlag(p);
      break;
    case "grab":
      serverGrab(p, msg.flag);
      break;
    case "buy":
      if (msg.item === "hammer" && p.alive && nearShop(p, 40)) p.weapon = "hammer";
      break;
  }
}

function serverStartGame() {
  resetRound();
  server.phase = "playing";
  for (const p of Object.values(server.players)) {
    Object.assign(p, spawnPoint(p.team), {
      hp: MAX_HP, alive: true, weapon: null, carrying: null, boostUntil: 0, lastSwing: -10,
      facing: p.team === "blue" ? 0 : Math.PI,
    });
    p.spawnCount += 1;
  }
  toast("⚔️ The battle begins! Grab the enemy flag!", "הַקְּרָב מַתְחִיל! תּוֹפְסִים אֶת הַדֶּגֶל שֶׁל הָאוֹיֵב!");
}

// ---------- Fighting ----------

function serverSwing(p) {
  if (server.phase !== "playing" || !p.alive || p.weapon !== "hammer" || p.carrying) return;
  if (server.time - p.lastSwing < HAMMER.cooldown * 0.8) return; // too soon (a little leeway for lag)
  p.lastSwing = server.time;
  server.events.push({ kind: "ring", x: p.x, y: p.y, radius: HAMMER.range, life: 0.35, sound: "swing" });

  // Hit every enemy inside the zone around you.
  for (const enemy of Object.values(server.players)) {
    if (enemy.team === p.team || !enemy.alive) continue;
    if (distance(enemy, p) < HAMMER.range + enemy.radius) serverHurt(enemy, HAMMER.damage, p);
  }
  // And the speed box.
  const box = server.speedBox;
  if (box.alive && distance(box, p) < HAMMER.range + box.radius) serverHurt(box, HAMMER.damage, p);
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
    // A player is knocked out: they drop any flag, lose their weapon, and respawn soon.
    target.alive = false;
    target.respawnAt = server.time + RESPAWN_TIME;
    serverDropFlag(target);
    target.weapon = null;
    target.boostUntil = 0;
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

// Did a flag carrier make it back to their own base?
function checkFlagDelivery(p) {
  const flag = server.flags[p.carrying];
  flag.x = p.x;  // the flag travels with its carrier
  flag.y = p.y;

  const home = MAP.bases[p.team];
  if (distance(p, home) > home.radius) return;

  if (flag.team === p.team) {
    sendFlagHome(flag);
    p.carrying = null;
    toast(`🏠 ${p.name} brought the ${TEAM_NAMES[p.team]} flag home!`, `${p.name} הֶחֱזִיר/הֶחֱזִירָה אֶת ${TEAM_HE[p.team].flag} הַבַּיְתָה!`);
  } else if (server.flags[p.team].state === "home") {
    sendFlagHome(flag);
    p.carrying = null;
    server.score[p.team] += 1;
    floatText("🎉 +1", p.x, p.y - 50, "#fff", 1.5, "score");
    toast(`🎉 ${p.name} scores for ${TEAM_NAMES[p.team]}! (${server.score[p.team]} of ${WIN_SCORE})`,
      `${p.name} — נְקֻדָּה ${TEAM_HE[p.team].toPlayers}! (${server.score[p.team]} מִתּוֹךְ ${WIN_SCORE})`);
    if (server.score[p.team] >= WIN_SCORE) {
      server.phase = "over";
      server.winner = p.team;
      server.overAt = server.time; // when the game ended (for going back to the teams)
    }
  } else if (server.time - (p.lastHint || -10) > 3) {
    p.lastHint = server.time;
    toast("⚠️ Your own flag must be home before you can score!", "הַדֶּגֶל שֶׁלָּכֶם צָרִיךְ לִהְיוֹת בַּבָּסִיס כְּדֵי לְקַבֵּל נְקֻדָּה!", p.id);
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
      Object.assign(p, spawnPoint(p.team), { alive: true, hp: MAX_HP, weapon: null });
      p.spawnCount += 1;
    }
    if (p.alive && p.carrying) checkFlagDelivery(p);
    if (server.phase !== "playing") return; // someone just won
  }

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
    score: { ...server.score },
    flags: { blue: { ...server.flags.blue }, red: { ...server.flags.red } },
    speedBox: { ...server.speedBox },
    players: Object.values(server.players).map((p) => ({ ...p })),
    events: server.events,
  };
  server.events = [];
  return snapshot;
}
