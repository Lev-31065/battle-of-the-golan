// rules.js — all of the game's settings in one place, plus a few small helpers
// that both the referee (server.js) and every phone (game.js) need.
//
// Want to change how the game feels? This is the file to experiment with!

// ---------- Players ----------
const PLAYER_SPEED = 172;     // world units per second
const PLAYER_RADIUS = 22;     // body size
const MAX_HP = 100;           // full health
const RESPAWN_TIME = 3;       // seconds before you come back after being knocked out

// ---------- Hammer ----------
// 34 damage × 3 hits = 102, so 3 hits knock out anything with 100 health.
const HAMMER = {
  damage: 34,
  range: 85,      // how far the hit zone reaches from your center
  cooldown: 0.6,  // seconds you must wait between swings
};

// ---------- Speed boost box ----------
const SPEED_BOOST = {
  multiplier: 1.5,  // 1.5 = one and a half times normal speed
  duration: 8,      // seconds the boost lasts
  respawn: 60,      // seconds before a new box appears
};

// ---------- Flags ----------
const WIN_SCORE = 3;          // captures needed to win
const CARRY_SLOWDOWN = 0.7;   // carrying a flag = 70% speed
const FLAG_REACH = 70;        // how close you must be to grab a flag
const FLAG_RETURN_TIME = 30;  // a dropped flag goes home by itself after this many seconds

const TEAM_NAMES = { blue: "Blue", red: "Red" };

// ---------- Rocks ----------
// Rocks are solid. Bump into one and you must answer a question to pass through.
const ROCK_RADIUS = 28;
const ROCK_PASS_TIME = 2;     // seconds you can walk through rocks after answering

// ---------- Helpers ----------

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function otherTeam(team) {
  return team === "blue" ? "red" : "blue";
}

// Where a player appears: inside their base, spread out a little so
// teammates don't all stand on top of each other.
function spawnPoint(team) {
  const base = MAP.bases[team];
  return {
    x: base.x + (team === "blue" ? 70 : -70) + (Math.random() - 0.5) * 60,
    y: base.y + 40 + (Math.random() - 0.5) * 100,
  };
}

// Is this player standing close to their own team's shopkeeper?
function nearShop(p, extraReach = 0) {
  const shop = MAP.bases[p.team].shop;
  return Math.hypot(p.x - shop.x, p.y - (shop.y + 40)) < 110 + extraReach;
}

// Keep a position inside the map.
function clampToMap(p) {
  p.x = Math.min(Math.max(p.x, PLAYER_RADIUS), MAP.width - PLAYER_RADIUS);
  p.y = Math.min(Math.max(p.y, PLAYER_RADIUS), MAP.height - PLAYER_RADIUS);
}
