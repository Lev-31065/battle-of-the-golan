// ctf-bots.js — computer players ("bots") for CAPTURE THE FLAG. Only the host's phone runs this.
//
// When a game starts with only a few people (fewer than CTF_BOTS.fewerThan), bots join so
// there are CTF_BOTS.players in all, split between the two teams. They leave again when the
// game is over. To every phone a bot is just another player (bot: true): the referee moves
// it, and uses the SAME rules as for people (serverGrab, serverSwing, serverThrow…).
//
// What a bot does:
//   - An ATTACKER goes for the enemy flag, grabs it and carries it home.
//   - A DEFENDER walks about near its own base and goes after enemies who come close.
//   - Everyone chases an enemy who is running off with their flag, and picks their own flag
//     up if it is lying on the ground.
//   - Some bots stop at the shop first for a stick, a rock or a hammer, and use it.
// A bot can't answer questions. Wherever a player would answer one (buying, grabbing a flag,
// thawing out after a rock) the bot waits about as long as answering takes (CTF_BOTS.answerTime).
// Settings: CTF_BOTS in rules.js.

// A random number between the two numbers of a pair like [2, 4].
function botBetween(pair) {
  return pair[0] + Math.random() * (pair[1] - pair[0]);
}

// ---------- Joining and leaving ----------

function ctfRemoveBots() {
  for (const p of Object.values(server.players)) {
    if (!p.bot) continue;
    serverDropFlag(p);
    delete server.players[p.id];
  }
}

// Called when a game starts: fill both teams up with bots.
function ctfAddBots() {
  const people = Object.values(server.players).filter((p) => !p.bot);
  if (!CTF_BOTS.players || people.length >= CTF_BOTS.fewerThan) return;
  const count = { blue: 0, red: 0 };
  for (const p of people) count[p.team] += 1;
  // Each team gets half of CTF_BOTS.players. (If one team already has more people than that,
  // the other team is filled up to match.)
  const perTeam = Math.min(4, Math.max(Math.ceil(CTF_BOTS.players / 2), count.blue, count.red));
  let made = 0;
  for (const team of ["blue", "red"]) {
    for (let k = 0; count[team] + k < perTeam; k++) {
      const i = made++;
      const p = {
        id: "robot" + (i + 1),
        name: CTF_BOTS.names[i % CTF_BOTS.names.length],
        look: "none",
        team,
        alive: true,
        spawnCount: 0,
        lastSeen: server.time,
        bot: true,
        skill: CTF_BOTS.speed[i % CTF_BOTS.speed.length],
        // The second bot on a team guards the base; the others attack.
        role: k === 1 ? "defend" : "attack",
      };
      ctfNewPlayer(p);
      server.players[p.id] = p;
    }
  }
}

// What a bot is planning (its "mind"): kept here, not on the player, so it is not sent to
// every phone with each snapshot. ctfBotNewLife below lists what is in it.
const ctfBotMinds = new WeakMap();
function ctfMind(p) {
  if (!ctfBotMinds.has(p)) ctfBotMinds.set(p, { botLife: -1 });
  return ctfBotMinds.get(p);
}

// ---------- Things in the way ----------
// Rocks and logs are solid, and bushes are slow, so bots walk round them. Each one is a circle
// here: { x, y, r (how wide a berth to give it), soft (true = a bush: slow, but not solid) }.
let ctfBotBlocks = null;
function ctfBlocks() {
  if (ctfBotBlocks) return ctfBotBlocks;
  ctfBotBlocks = [];
  for (const [x, y] of MAP.rocks) ctfBotBlocks.push({ x, y, r: ROCK_RADIUS + PLAYER_RADIUS + 12 });
  for (const log of MAP.logs) {
    // (A log is long and thin: a row of circles along it.)
    const steps = Math.max(1, Math.round(log.length / 50));
    for (let k = 0; k <= steps; k++) {
      const along = (k / steps - 0.5) * log.length;
      ctfBotBlocks.push({ x: log.x + log.dirX * along, y: log.y + log.dirY * along, r: LOG.width / 2 + PLAYER_RADIUS + 14 });
    }
  }
  for (const [x, y, r] of MAP.bushes) ctfBotBlocks.push({ x, y, r: r + 6, soft: true });
  ctfBotBlocks.push({ x: MAP.speedBox.x, y: MAP.speedBox.y, r: 28 + PLAYER_RADIUS + 8 });
  return ctfBotBlocks;
}

// Which way should a bot walk to get to (tx, ty)? Straight there, unless something is in the
// way: then round it. Returns an arrow of length 1: [x, y].
function ctfBotSteer(p, tx, ty) {
  const m = ctfMind(p);
  let dx = tx - p.x, dy = ty - p.y;
  const far = Math.hypot(dx, dy) || 1;
  dx /= far; dy /= far;
  let first = null, firstAt = Infinity;
  for (const block of ctfBlocks()) {
    if (Math.hypot(tx - block.x, ty - block.y) < block.r) continue; // (where I am going is inside it: no way round)
    const ox = block.x - p.x, oy = block.y - p.y, gap = Math.hypot(ox, oy);
    if (gap < block.r) {
      if (block.soft) continue;                                        // already in the bush: just keep going
      return ctfArrow(dx - ox / (gap || 1) * 1.5, dy - oy / (gap || 1) * 1.5); // touching a rock or a log: away from it
    }
    const ahead = ox * dx + oy * dy;               // how far ahead of me it is
    const aside = ox * dy - oy * dx;               // how far to the side of my line it is
    if (ahead <= 0 || ahead > Math.min(far, 190 + block.r) || Math.abs(aside) >= block.r) continue;
    if (ahead < firstAt) { firstAt = ahead; first = { block, aside }; }
  }
  if (!first) return [dx, dy];
  // Round it, on the side I am already nearer to. (Once picked, keep to that side, so a bot
  // heading straight at the middle of something doesn't dither.)
  if (m.roundBlock !== first.block) { m.roundBlock = first.block; m.roundSide = first.aside >= 0 ? 1 : -1; }
  const b = first.block, out = b.r + 16;
  return ctfArrow(b.x - m.roundSide * dy * out - p.x, b.y + m.roundSide * dx * out - p.y);
}
function ctfArrow(x, y) {
  const length = Math.hypot(x, y) || 1;
  return [x / length, y / length];
}

// ---------- A new life ----------
// After joining, and after every knockout: fresh plans. Maybe a trip to the shop first.
function ctfBotNewLife(p) {
  const m = ctfMind(p);
  m.botLife = p.spawnCount;
  m.route = null;        // the bridges (or not) it will cross on a long walk: a list of [x, y]
  m.routeFor = null;     // …and which errand that route is for
  m.grabAt = 0;          // when it will have "answered the question" to grab a flag
  m.grabFlag = null;
  m.thawAt = 0;          // when it will have answered its way out of being frozen
  m.nextSwing = server.time + 0.5;
  m.patrol = null;       // (a defender) the spot it is strolling to
  m.stuckAt = server.time;
  m.stuckX = p.x; m.stuckY = p.y;
  m.sideStepUntil = 0;
  m.shopItem = null;
  m.buyAt = 0;
  if (p.role === "defend" || Math.random() < CTF_BOTS.shopChance) { // (a guard always gets something to guard with)
    // Pick what to buy, by its chances.
    const chances = CTF_BOTS.shopItems;
    let roll = Math.random() * Object.values(chances).reduce((sum, chance) => sum + chance, 0);
    for (const id of Object.keys(chances)) {
      roll -= chances[id];
      if (roll <= 0 && ITEMS[id]) { m.shopItem = id; break; }
    }
  }
}

// ---------- Where to go ----------
// Returns { x, y, why }: "home" (carrying a flag in), "shop", "grab" (+ flag: which one),
// "chase" (+ enemy), "escort", "patrol".
function ctfBotGoal(p, enemies) {
  const m = ctfMind(p);
  const home = MAP.bases[p.team];
  const own = server.flags[p.team], theirs = server.flags[otherTeam(p.team)];
  const visible = enemies.filter((e) => !e.inLog);
  const nearest = (list, spot) => list.reduce((best, e) => (!best || distance(e, spot) < distance(best, spot) ? e : best), null);

  // Carrying a flag: take it home.
  if (p.carrying) return { x: home.x, y: home.y, why: "home" };
  // A trip to the shop first (the shopkeeper stands a little above the flag).
  if (m.shopItem) return { x: home.shop.x, y: home.shop.y + 60, why: "shop" };

  // Somebody is running off with OUR flag: after them! (Defenders always; attackers if they are near.)
  const thief = carrierOf(own);
  if (thief && thief.team !== p.team && !thief.inLog && (p.role === "defend" || distance(thief, p) < 600)) {
    return { x: thief.x, y: thief.y, why: "chase", enemy: thief };
  }
  // Our flag is lying on the ground: pick it up (defenders always; attackers if it is near).
  if (own.state === "dropped" && (p.role === "defend" || distance(own, p) < 450)) return { x: own.x, y: own.y, why: "grab", flag: p.team };

  const armed = ITEMS[p.held] && (ITEMS[p.held].kind === "melee" || ITEMS[p.held].kind === "throw");
  if (p.role === "defend") {
    // Guarding: go after any enemy who comes close to the base. Otherwise stroll about near it.
    const intruder = nearest(visible.filter((e) => distance(e, home) < CTF_BOTS.guard), home);
    if (intruder && armed) return { x: intruder.x, y: intruder.y, why: "chase", enemy: intruder };
    if (!m.patrol || distance(p, m.patrol) < 30 || server.time > m.patrol.until) {
      const angle = Math.random() * Math.PI * 2, out = 110 + Math.random() * 120;
      const toMiddle = p.team === "blue" ? 1 : -1; // (mostly on the side of the base that faces the enemy)
      m.patrol = { x: home.x + Math.abs(Math.cos(angle)) * out * toMiddle, y: home.y + Math.sin(angle) * out, until: server.time + 3 + Math.random() * 3 };
    }
    return { x: m.patrol.x, y: m.patrol.y, why: "patrol" };
  }

  // Attacking. (An attacker does not go out of its way to fight: it swings at whoever is in
  // reach as it goes by. Only an enemy carrying a flag is worth turning aside for.)
  const robber = nearest(visible.filter((e) => e.carrying && distance(e, p) < CTF_BOTS.see), p);
  if (robber && armed) return { x: robber.x, y: robber.y, why: "chase", enemy: robber };
  // The enemy flag: go and get it. (A teammate has it already? Walk with them.)
  const friend = carrierOf(theirs);
  if (friend && friend.team === p.team) return { x: friend.x + (p.team === "blue" ? 70 : -70), y: friend.y, why: "escort" };
  if (theirs.state !== "carried") return { x: theirs.x, y: theirs.y, why: "grab", flag: theirs.team };
  return { x: home.x, y: home.y, why: "patrol" };
}

// A long walk to the other side of the map: over the top bridges, over the bottom bridges,
// or straight through the rivers (slow in the water, but the shortest way). Picked at random,
// so bots don't all come the same way.
function ctfBotRoute(p, goal) {
  if (Math.abs(goal.x - p.x) < 900) return [];
  const pick = Math.random();
  if (pick < 0.4) return [];
  const y = pick < 0.7 ? 300 : 1200;
  const stops = MAP.bridges.filter((bridge) => bridge.y === y).map((bridge) => [bridge.x, bridge.y]);
  // (Only the bridges that are between me and where I am going, nearest first.)
  return stops
    .filter(([x]) => (x - p.x) * (goal.x - p.x) > 0 && Math.abs(x - p.x) < Math.abs(goal.x - p.x))
    .sort((a, b) => Math.abs(a[0] - p.x) - Math.abs(b[0] - p.x));
}

// ---------- One frame of one bot ----------

function ctfMoveBot(p, dt) {
  p.lastSeen = server.time; // (so the referee never thinks a bot's phone fell asleep)
  const m = ctfMind(p);
  if (!p.alive) { p.moving = false; return; }
  if (m.botLife !== p.spawnCount) ctfBotNewLife(p);

  // Frozen by a rock: it "answers the question" (it waits), then it is free.
  if (p.frozen) {
    if (!m.thawAt) m.thawAt = server.time + botBetween(CTF_BOTS.answerTime);
    if (server.time >= m.thawAt) { p.frozen = false; m.thawAt = 0; }
    p.moving = false;
    return;
  }
  m.thawAt = 0;

  const enemies = Object.values(server.players).filter((e) => e.team !== p.team && e.alive);
  const goal = ctfBotGoal(p, enemies);
  let standStill = false;

  // At the shop: wait as long as the answers take, then take the thing (the same as a player buying it).
  if (goal.why === "shop" && nearShop(p)) {
    standStill = true;
    const item = ITEMS[m.shopItem];
    if (!m.buyAt) m.buyAt = server.time + item.cost * botBetween(CTF_BOTS.answerTime);
    if (server.time >= m.buyAt) {
      if (item.kind === "throw") p.ammo[m.shopItem] = (p.ammo[m.shopItem] || 0) + item.perBuy;
      if (!p.items.includes(m.shopItem)) p.items.push(m.shopItem);
      p.held = m.shopItem;
      m.shopItem = null;
      m.buyAt = 0;
    }
  }

  // At a flag it wants: wait for one answer, then grab it.
  if (goal.why === "grab" && distance(server.flags[goal.flag], p) < FLAG_REACH - 8) {
    standStill = true;
    if (m.grabFlag !== goal.flag || !m.grabAt) { m.grabFlag = goal.flag; m.grabAt = server.time + botBetween(CTF_BOTS.answerTime); }
    if (server.time >= m.grabAt) { m.grabAt = 0; m.grabFlag = null; serverGrab(p, goal.flag); }
  } else {
    m.grabAt = 0;
    m.grabFlag = null;
  }
  // Home with the enemy flag, but our own flag is not there yet: wait in the base.
  if (goal.why === "home" && distance(p, goal) < 60) standStill = true;
  if ((goal.why === "patrol" || goal.why === "escort") && distance(p, goal) < 25) standStill = true;

  // ----- Walking -----
  // A long way to go: by a route (bridges, or straight through the water).
  const errand = goal.why + (goal.flag || "");
  if (m.routeFor !== errand) { m.routeFor = errand; m.route = goal.why === "chase" ? [] : ctfBotRoute(p, goal); }
  while (m.route.length && Math.hypot(m.route[0][0] - p.x, m.route[0][1] - p.y) < 70) m.route.shift();
  const next = m.route.length ? { x: m.route[0][0], y: m.route[0][1] } : goal;

  const oldX = p.x, oldY = p.y;
  if (!standStill) {
    let [dx, dy] = ctfBotSteer(p, next.x, next.y);
    // (Stuck against something? A step to the side for a moment.)
    if (server.time < m.sideStepUntil) { const turn = m.sideStepTurn; [dx, dy] = [dx * Math.cos(turn) - dy * Math.sin(turn), dx * Math.sin(turn) + dy * Math.cos(turn)]; }
    // Speed: the same rules as a player (river, bush, berries, carrying a flag, the speed box), times this bot's own speed.
    const inWater = isInWater(p.x, p.y);
    let ground = 1;
    if (inWater) ground = MAP.waterSlowdown;
    else if (isInBush(p.x, p.y) && !p.items.includes("boots")) ground = MAP.bushSlowdown;
    const berries = Math.min((p.berryBoosts || []).filter((end) => end > server.time).length, BERRY.maxAtOnce) * BERRY.boostEach;
    let speed = PLAYER_SPEED * (ground + berries) * p.skill;
    if (p.carrying) speed *= CARRY_SLOWDOWN;
    if (p.boostUntil > server.time) speed *= SPEED_BOOST.multiplier;
    p.x += dx * speed * dt;
    p.y += dy * speed * dt;
    const flow = inWater ? riverFlowAt(p.x, p.y) : null; // the river carries it downstream
    if (flow) { p.x += flow.x * MAP.riverFlow * dt; p.y += flow.y * MAP.riverFlow * dt; }
    p.facing = Math.atan2(dy, dx);
  }

  // Rocks and logs are solid: pushed back out of them.
  for (const [rx, ry] of MAP.rocks) {
    const gap = Math.hypot(p.x - rx, p.y - ry), min = ROCK_RADIUS + p.radius;
    if (gap < min && gap > 0) { p.x = rx + (p.x - rx) / gap * min; p.y = ry + (p.y - ry) / gap * min; }
  }
  for (const log of MAP.logs) {
    const { along, side } = logLocal(log, p.x, p.y), reach = LOG.width / 2 + p.radius;
    if (Math.abs(along) >= log.length / 2 + p.radius || Math.abs(side) >= reach) continue;
    const push = (side >= 0 ? reach : -reach) - side; // (out through the nearer long side)
    p.x += -log.dirY * push;
    p.y += log.dirX * push;
  }
  // Players are solid too: step out of anyone it is standing in.
  for (const other of Object.values(server.players)) {
    if (other === p || !other.alive || other.inLog) continue;
    const gap = distance(other, p), min = p.radius + other.radius;
    if (gap < min && gap > 0.01) { p.x += (p.x - other.x) / gap * (min - gap) * 0.5; p.y += (p.y - other.y) / gap * (min - gap) * 0.5; }
  }
  clampToMap(p);
  p.moving = !standStill && Math.hypot(p.x - oldX, p.y - oldY) > 0.01;

  // Not getting anywhere for a while? Try a step to one side.
  if (standStill) { m.stuckAt = server.time; m.stuckX = p.x; m.stuckY = p.y; }
  else if (server.time - m.stuckAt > 1.2) {
    if (Math.hypot(p.x - m.stuckX, p.y - m.stuckY) < 14) { m.sideStepUntil = server.time + 0.7; m.sideStepTurn = (Math.random() < 0.5 ? 1 : -1) * 1.4; m.roundBlock = null; }
    m.stuckAt = server.time; m.stuckX = p.x; m.stuckY = p.y;
  }

  // Ripe berries it walks into: eaten (a speed boost and a little health, like a player).
  for (let i = 0; i < MAP.berries.length; i++) {
    const berry = MAP.berries[i];
    if (Math.abs(berry.x - p.x) < 40 && Math.abs(berry.y - p.y) < 40 && berryRipe(i) && Math.hypot(berry.x - p.x, berry.y - p.y) < p.radius + BERRY.touch) serverEat(p, i);
  }

  // ----- Fighting -----
  // (Not while carrying a flag: nobody can. The referee's own rules check the rest.)
  const weapon = ITEMS[p.held];
  if (!weapon || p.carrying || server.time < m.nextSwing) return;
  const target = enemies.filter((e) => !e.inLog).reduce((best, e) => (!best || distance(e, p) < distance(best, p) ? e : best), null);
  if (!target) return;
  const gap = distance(target, p), angle = Math.atan2(target.y - p.y, target.x - p.x);
  if (weapon.kind === "melee" && gap < weapon.range + target.radius - 6) {
    p.facing = angle;
    serverSwing(p);
    m.nextSwing = server.time + weapon.cooldown + botBetween(CTF_BOTS.swingWait);
  } else if (weapon.kind === "throw" && !weapon.lands && gap < weapon.range * 0.8 && !target.frozen) {
    serverThrow(p, angle + (Math.random() * 2 - 1) * CTF_BOTS.throwError);
    m.nextSwing = server.time + weapon.cooldown + botBetween(CTF_BOTS.swingWait) + 0.6;
  }
}

function ctfMoveBots(dt) {
  for (const p of Object.values(server.players)) {
    if (p.bot) ctfMoveBot(p, dt);
  }
}
