// map.js — describes the battlefield: how big it is, where the rivers,
// bridges, paths, bushes, bases, rocks and logs are, and what kind of ground a spot is.
//
// The map uses its own "world units" (not screen pixels).
// x goes left → right, y goes top → bottom. The point (0, 0) is the top-left corner.
//
// The map is the SAME on both sides (a mirror image), so neither team has an advantage.
// So below, most things are only listed for the LEFT (blue) half; mirrorLeftHalf()
// at the bottom makes the right (red) half by flipping them over the middle line.

const MAP = {
  width: 2600,
  height: 1500,

  // How much the ground slows you down. 1 = full speed, 0.5 = half speed.
  waterSlowdown: 0.2,  // rivers: 20% speed (and the current pushes you downstream)
  riverFlow: 45,        // how fast the river carries you downstream (world units per second)
  bushSlowdown: 0.4,    // bushes: 40% speed

  // Each team's home base: a circle with the flag in the middle.
  // The shop position is filled in below (just above the flag).
  bases: {
    blue: { x: 220, y: 750, radius: 200 },
    red: { x: 2380, y: 750, radius: 200 },
  },

  // How far above the flag the shop stands.
  shopDistance: 150,

  // Each river is a wiggly line through these [x, y] points, flowing from the first
  // point to the last (top → bottom). The water is `width` units wide.
  rivers: [
    { width: 90, points: [[720, -60], [650, 300], [770, 620], [670, 900], [650, 1200], [730, 1560]] },
  ],

  // Bridges are rectangles laid over the rivers. Walking on a bridge is full speed.
  // (x, y) is the center of the bridge; w is its length and h is its width.
  // There's deliberately NO bridge in the middle — the shortest path is through the water!
  bridges: [
    { x: 650, y: 300, w: 170, h: 64 },
    { x: 650, y: 1200, w: 170, h: 64 },
  ],

  // Dirt paths (just for looks, and to help find the way; they don't change speed).
  // Each is a list of [x, y] points: from the base to its bridges, then to the middle.
  // Lots of points that zig and zag = a swervy path (the corners get rounded when drawn).
  // The four paths are shaped differently on purpose, so they don't look copied.
  paths: [
    [[220, 750], [330, 640], [290, 560], [380, 470], [470, 440], [440, 360], [565, 300]],
    [[220, 750], [340, 850], [300, 940], [400, 1040], [470, 1080], [430, 1150], [565, 1200]],
    [[735, 300], [800, 420], [930, 420], [1000, 500], [1100, 560], [1150, 680], [1300, 750]],
    [[735, 1200], [830, 1110], [960, 1120], [1000, 1020], [1110, 960], [1150, 830], [1300, 750]],
  ],

  // Bushes slow you down, and you're partly hidden inside them. [x, y, radius, kind, berries]
  //   "berry" = has berries: touch a berry to eat it for a speed boost (it grows back later)
  //   "leafy" = just leaves
  //   berries = how many berries (leave it out for the usual number, berriesPerBush below)
  // Some are BIG on purpose. Keep them off the paths and out of the rivers.
  bushes: [
    [120, 250, 70, "leafy"], [400, 140, 60, "leafy"], [130, 480, 55, "berry"],
    [530, 750, 95, "berry"],
    [120, 1250, 70, "leafy"], [400, 1360, 60, "leafy"], [130, 1020, 55, "berry"],
    [1060, 190, 170, "berry", 12], [1060, 1330, 120, "leafy"], [950, 750, 115, "leafy"],
    [860, 960, 55, "berry"], [870, 550, 55, "berry"],
  ],
  // Bushes right on the middle line (not mirrored, so they're only listed once).
  middleBushes: [[1300, 330, 80, "leafy"], [1300, 1170, 80, "berry"]],

  // Rocks are SOLID — bump into one and you must answer a Hebrew question to pass.
  rocks: [[560, 520], [1150, 420], [1110, 1150], [300, 1150]],

  // Hollow logs lying on the ground. Solid from the sides, but walk straight into an
  // open END and you crawl inside: nobody can see you. Walk out either end.
  // (x, y) = the middle, length = end to end, angle = which way it lies (0 = left-right).
  logs: [
    { x: 300, y: 330, length: 160, angle: 0.25 },
    { x: 560, y: 1000, length: 160, angle: Math.PI / 2 },
  ],
  middleLogs: [
    { x: 1300, y: 560, length: 200, angle: 0 },
    { x: 1300, y: 940, length: 200, angle: 0 },
  ],

  berriesPerBush: 4,    // berries on a normal berry bush

  // The speed boost box sits in the very middle, so both teams have a fair shot at it.
  speedBox: { x: 1300, y: 750 },

  // Lighter/darker grass spots, filled in below so the grass isn't one flat color.
  grassPatches: [],
};

// Make the right (red) half: a mirror image of the left half.
(function mirrorLeftHalf() {
  const flip = (x) => MAP.width - x;
  MAP.rivers.push(...MAP.rivers.map((r) => ({ width: r.width, points: r.points.map(([x, y]) => [flip(x), y]) })));
  MAP.bridges.push(...MAP.bridges.map((b) => ({ ...b, x: flip(b.x) })));
  MAP.paths.push(...MAP.paths.map((path) => path.map(([x, y]) => [flip(x), y])));
  MAP.bushes.push(...MAP.bushes.map(([x, y, r, kind, berries]) => [flip(x), y, r, kind, berries]), ...MAP.middleBushes);
  MAP.rocks.push(...MAP.rocks.map(([x, y]) => [flip(x), y]));
  MAP.logs.push(...MAP.logs.map((log) => ({ ...log, x: flip(log.x), angle: -log.angle })), ...MAP.middleLogs);
})();

// Every single berry gets its own spot, worked out the same way on every phone.
// They're spread out in a spiral from the middle of the bush to near its edge.
// MAP.berries = [{ x, y, bush }]  (bush = which bush it grows on)
MAP.berries = [];
MAP.bushes.forEach(([bx, by, r, kind, count], bush) => {
  if (kind !== "berry") return;
  const n = count || MAP.berriesPerBush;
  for (let k = 0; k < n; k++) {
    const angle = k * 2.4 + 0.6;                       // 2.4 radians ≈ the "golden angle": spreads them evenly
    const dist = r * (0.25 + 0.5 * Math.sqrt((k + 0.5) / n));
    MAP.berries.push({ x: bx + Math.cos(angle) * dist, y: by + Math.sin(angle) * dist, bush });
  }
});

// Each log's direction as an arrow of length 1 (handy for the math in game.js).
for (const log of MAP.logs) {
  log.dirX = Math.cos(log.angle);
  log.dirY = Math.sin(log.angle);
}

// Put each team's shop straight above its flag.
for (const team of ["blue", "red"]) {
  const base = MAP.bases[team];
  base.shop = { x: base.x, y: base.y - MAP.shopDistance };
}

// Make 120 random grass patches. We use a "seeded" random number maker so the
// patches land in the same places every time the page loads.
(function makeGrassPatches() {
  let seed = 42;
  function random() {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  }
  for (let i = 0; i < 120; i++) {
    MAP.grassPatches.push({
      x: random() * MAP.width,
      y: random() * MAP.height,
      r: 30 + random() * 70,
      light: random() > 0.5,
    });
  }
})();

// How far is point (px, py) from the straight line segment between points a and b?
// We use this to check whether a player is standing inside a river.
function distanceToSegment(px, py, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const lengthSquared = dx * dx + dy * dy;
  // t says how far along the segment the closest point is (0 = at a, 1 = at b).
  let t = ((px - a[0]) * dx + (py - a[1]) * dy) / lengthSquared;
  t = Math.max(0, Math.min(1, t));
  const closestX = a[0] + t * dx;
  const closestY = a[1] + t * dy;
  return Math.hypot(px - closestX, py - closestY);
}

// Is the point (x, y) in water? Bridges count as dry land.
function isInWater(x, y) {
  for (const bridge of MAP.bridges) {
    const onBridge =
      x > bridge.x - bridge.w / 2 && x < bridge.x + bridge.w / 2 &&
      y > bridge.y - bridge.h / 2 && y < bridge.y + bridge.h / 2;
    if (onBridge) return false;
  }
  return riverFlowAt(x, y) !== null;
}

// Which way is the river flowing at (x, y)? Gives an arrow of length 1 ({ x, y }),
// or null if (x, y) isn't in a river.
function riverFlowAt(x, y) {
  for (const river of MAP.rivers) {
    for (let i = 0; i < river.points.length - 1; i++) {
      const a = river.points[i];
      const b = river.points[i + 1];
      if (distanceToSegment(x, y, a, b) < river.width / 2) {
        const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
        return { x: (b[0] - a[0]) / length, y: (b[1] - a[1]) / length };
      }
    }
  }
  return null;
}

// Is the point (x, y) inside a bush?
function isInBush(x, y) {
  for (const [bx, by, radius] of MAP.bushes) {
    if (Math.hypot(x - bx, y - by) < radius) return true;
  }
  return false;
}

// Where is (x, y) compared to a log?
//   along = how far along the log (0 = the middle, ± length/2 = the ends)
//   side  = how far off to the side of the log's middle line
function logLocal(log, x, y) {
  const dx = x - log.x;
  const dy = y - log.y;
  return { along: dx * log.dirX + dy * log.dirY, side: -dx * log.dirY + dy * log.dirX };
}
