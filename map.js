// map.js — describes the battlefield: how big it is, where the rivers,
// bridges, bushes, bases, trees and rocks are, and what kind of ground a spot is.
//
// The map uses its own "world units" (not screen pixels).
// x goes left → right, y goes top → bottom. The point (0, 0) is the top-left corner.

const MAP = {
  width: 2000,
  height: 1200,

  // How much the ground slows you down. 1 = full speed, 0.5 = half speed.
  waterSlowdown: 0.15,  // rivers: 15% speed — wading is really slow!
  bushSlowdown: 0.3,    // bushes: 30% speed

  // Each team's home base: a circle with the flag in the middle.
  // The shop position is filled in below (just above the flag).
  bases: {
    blue: { x: 220, y: 600, radius: 200 },
    red: { x: 1780, y: 600, radius: 200 },
  },

  // How far above the flag the shop stands.
  shopDistance: 150,

  // Each river is a wiggly line through these [x, y] points.
  // The water is `width` units wide, centered on that line.
  rivers: [
    { width: 90, points: [[700, -60], [640, 250], [760, 520], [660, 820], [730, 1260]] },
    { width: 90, points: [[1300, -60], [1360, 300], [1240, 600], [1350, 900], [1270, 1260]] },
  ],

  // Bridges are rectangles laid over the rivers. Walking on a bridge is full speed.
  // (x, y) is the center of the bridge; w is its length and h is its width.
  // There's deliberately NO bridge in the middle — the shortest path is through the water!
  bridges: [
    { x: 640, y: 250, w: 170, h: 64 },
    { x: 660, y: 820, w: 170, h: 64 },
    { x: 1360, y: 300, w: 170, h: 64 },
    { x: 1350, y: 900, w: 170, h: 64 },
  ],

  // Bushes slow you down, and you're partly hidden inside them.
  // [x, y, radius]
  bushes: [
    [430, 420, 50], [380, 820, 50], [880, 300, 50], [820, 700, 50],
    [1120, 900, 50], [1160, 480, 50], [1570, 420, 50], [1620, 820, 50],
  ],

  // Trees are decorations. You can walk right past them.
  trees: [
    [120, 150], [430, 200], [470, 1020], [110, 1060], [520, 600],
    [1000, 150], [900, 420], [1100, 780], [980, 1050],
    [1880, 150], [1570, 200], [1530, 1020], [1890, 1060], [1480, 600],
  ],
  // Rocks are SOLID — bump into one and you must answer a Hebrew question to pass.
  rocks: [[560, 420], [1440, 780], [860, 960], [1140, 240], [880, 520], [1120, 680]],

  // The speed boost box sits in the very middle, so both teams have a fair shot at it.
  speedBox: { x: 1000, y: 600 },

  // Lighter/darker grass spots, filled in below so the grass isn't one flat color.
  grassPatches: [],
};

// Put each team's shop straight above its flag.
for (const team of ["blue", "red"]) {
  const base = MAP.bases[team];
  base.shop = { x: base.x, y: base.y - MAP.shopDistance };
}

// Make 70 random grass patches. We use a "seeded" random number maker so the
// patches land in the same places every time the page loads.
(function makeGrassPatches() {
  let seed = 42;
  function random() {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  }
  for (let i = 0; i < 70; i++) {
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
  for (const river of MAP.rivers) {
    for (let i = 0; i < river.points.length - 1; i++) {
      if (distanceToSegment(x, y, river.points[i], river.points[i + 1]) < river.width / 2) {
        return true;
      }
    }
  }
  return false;
}

// Is the point (x, y) inside a bush?
function isInBush(x, y) {
  for (const [bx, by, radius] of MAP.bushes) {
    if (Math.hypot(x - bx, y - by) < radius) return true;
  }
  return false;
}
