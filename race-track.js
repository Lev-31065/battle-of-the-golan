// race-track.js — the path for Mt Hermon Racing: one long ride from the snowy top of
// Mt Hermon all the way down to the Kinneret (no laps).
//
// The path is a long row of short, straight pieces called "segments" (RACE.segmentLength
// long each, settings in rules.js). Each segment can bend left or right a little ("curve")
// and go down or up ("y" = height). Put thousands of them in a row and you get a curvy
// mountain path. Each segment also knows:
//   width  how wide the path is there (narrow, but much wider at the answer gates)
//   snow   how snowy the ground beside the path is (1 = all snow at the top, 0 = no snow lower down)
//   sand   0 = a snowy path, 1 = the sandy beach at the Kinneret
//   water  true = the lake itself (past the finish line)
//
// Things beside the path (bushes, rocks, trees, snowmen) are "sprites": each one sits on a
// segment, at a sideways spot called "offset", measured in RACE.roadWidth from the middle
// (0 = the middle, minus = left, plus = right).
//
// Every phone builds exactly the same path, because the "random" numbers below always
// come out the same (they start from the same seed).

const TRACK = {
  segments: [],
  length: 0,  // the whole path, start to lake (track units)
  startZ: 0,  // where the start line is
  finishZ: 0, // where the finish line is (on the beach)
  gates: [],  // the answer gates: { number, index (which segment it stands on), z, width }
};

// How big each kind of sprite is in the world (width, height), and whether a sled
// crashes into it. (race-draw.js paints them.)
const SPRITE_SIZES = {
  bush:     { w: 760,  h: 460,  solid: true },
  bushSnow: { w: 760,  h: 500,  solid: true },
  oak:      { w: 1400, h: 1500, solid: true },
  oakSnow:  { w: 1400, h: 1500, solid: true },
  olive:    { w: 1300, h: 1100, solid: true },
  palm:     { w: 1000, h: 2300, solid: true },
  rock:     { w: 700,  h: 400,  solid: true },
  rockSnow: { w: 700,  h: 430,  solid: true },
  snowman:  { w: 480,  h: 720,  solid: true },
  cabin:    { w: 1800, h: 1350, solid: true },
  sign:     { w: 1300, h: 1000, solid: true },
  pole:     { w: 70,   h: 650,  solid: false }, // orange-tipped snow poles that mark the path's edge
  reeds:    { w: 650,  h: 520,  solid: false },
};

// The segment at a distance along the path. (Before the start or past the lake: the first or last one.)
function findSegment(z) {
  const index = Math.floor(z / RACE.segmentLength);
  return TRACK.segments[Math.max(0, Math.min(TRACK.segments.length - 1, index))];
}

// How far along the race a distance is: 0 = the start line, 1 = the finish line.
function trackProgress(z) {
  return Math.max(0, Math.min(1, (z - TRACK.startZ) / (TRACK.finishZ - TRACK.startZ)));
}

(function buildTrack() {
  const segments = TRACK.segments;
  const L = RACE.segmentLength;

  // "Random" numbers that come out the same on every phone (a seeded random generator).
  let seed = 11;
  function random() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }

  // Smooth changes, so curves and slopes start and end gently (no sudden jolts).
  const easeIn = (a, b, t) => a + (b - a) * t * t;
  const easeInOut = (a, b, t) => a + (b - a) * (-Math.cos(t * Math.PI) / 2 + 0.5);
  const smooth = (t) => t * t * (3 - 2 * t);

  function lastY() {
    return segments.length === 0 ? 0 : segments[segments.length - 1].p2.world.y;
  }

  function addSegment(curve, y) {
    const n = segments.length;
    segments.push({
      index: n,
      // p1 = the near end of this piece, p2 = the far end. (camera + screen get filled in while drawing.)
      p1: { world: { y: lastY(), z: n * L }, camera: {}, screen: {} },
      p2: { world: { y, z: (n + 1) * L }, camera: {}, screen: {} },
      curve,
      sprites: [],
      dark: Math.floor(n / 3) % 2 === 1, // light and dark stripes, so you can feel the speed
      width: RACE.pathWidth,
      snow: 1,
      sand: 0,
      water: false,
    });
  }

  // One stretch of path: it eases INTO the curve, HOLDS it, then eases back OUT.
  // `height` = how far it climbs, in segment lengths (minus = downhill).
  function addRoad(enter, hold, leave, curve, height) {
    const startY = lastY();
    const endY = startY + height * L;
    const total = enter + hold + leave;
    for (let n = 0; n < enter; n++) addSegment(easeIn(0, curve, n / enter), easeInOut(startY, endY, n / total));
    for (let n = 0; n < hold; n++) addSegment(curve, easeInOut(startY, endY, (enter + hold === 0 ? 0 : (enter + n) / total)));
    for (let n = 0; n < leave; n++) addSegment(easeInOut(curve, 0, n / leave), easeInOut(startY, endY, (enter + hold + n) / total));
  }

  // Going downhill for n segments. `steep` = how much it drops per segment (0.1 = gentle, 0.2 = steep).
  function downhill(n, curve, steep) {
    const enter = Math.round(n * 0.3), hold = Math.round(n * 0.4);
    addRoad(enter, hold, n - enter - hold, curve, -steep * n);
  }

  // ----- The course -----
  // A flat start at the top, then curvy downhill stretches with a straight, wide answer
  // gate between them, then the path flattens out onto the beach at the Kinneret.
  addRoad(0, 90, 0, 0, 0); // the start, on top of the mountain
  TRACK.startZ = 40 * L;
  let lastCurve = 1;
  for (let g = 0; g < RACE.gateCount; g++) {
    // The curvy stretch before this gate (the first one is shorter, so the first question comes soon).
    const stretch = g === 0 ? 260 : RACE.gateGap - RACE.gateZone;
    let made = 0;
    while (made < stretch) {
      const n = Math.min(stretch - made, 70 + Math.floor(random() * 90));
      lastCurve = -Math.sign(lastCurve) * (random() < 0.25 ? 0 : 1 + random() * 2.5); // bends left and right, in turn
      downhill(n, lastCurve, 0.12 + random() * 0.16);
      made += n;
    }
    // The gate: a straight, gently sloping stretch, with the gate in the middle.
    const gateIndex = segments.length + Math.floor(RACE.gateZone / 2);
    addRoad(0, RACE.gateZone, 0, 0, -0.04 * RACE.gateZone);
    TRACK.gates.push({ number: g, index: gateIndex, z: gateIndex * L, width: RACE.gateWidth });
  }
  downhill(220, -1.5, 0.1);         // the last stretch down
  downhill(160, 1, 0.05);
  addRoad(40, 60, 0, 0, -3);        // flattening out by the lake
  const finishIndex = segments.length + 50;
  addRoad(0, 140, 0, 0, 0);         // the beach (the finish line is on it)
  const waterIndex = segments.length;
  addRoad(0, RACE.drawDistance + 20, 0, 0, 0); // the Kinneret itself
  TRACK.finishZ = finishIndex * L;
  TRACK.length = segments.length * L;

  // ----- Path width, snow and sand -----
  for (const seg of segments) {
    const progress = trackProgress(seg.p1.world.z);
    // The ground beside the path: all snow at the top, melting away between 12% and 40% of the way down.
    seg.snow = progress < 0.12 ? 1 : progress < 0.4 ? 1 - (progress - 0.12) / 0.28 : 0;
    // The path itself stays snowy until near the lake, then turns into sand.
    seg.sand = Math.max(0, Math.min(1, (seg.index - (finishIndex - 120)) / 70));
    seg.water = seg.index >= waterIndex;
    // Wider at the start, at each gate and at the finish.
    let wide = 0;
    if (seg.index < 110) wide = Math.max(wide, 1 - smooth(Math.max(0, Math.min(1, (seg.index - 80) / 30))));
    for (const gate of TRACK.gates) {
      const away = Math.abs(seg.index - gate.index);
      wide = Math.max(wide, 1 - smooth(Math.max(0, Math.min(1, (away - RACE.gateZone / 2 + 30) / 35))) * 1);
    }
    if (seg.index > finishIndex - 60) wide = Math.max(wide, smooth(Math.min(1, (seg.index - finishIndex + 60) / 30)));
    const wideWidth = seg.index < 110 || seg.index > finishIndex - 60 ? RACE.startWidth : RACE.gateWidth;
    seg.width = RACE.pathWidth + (wideWidth - RACE.pathWidth) * wide;
  }
  // The far end of each piece takes the next piece's width, so the edges join up smoothly.
  segments.forEach((seg, i) => { seg.width2 = (segments[i + 1] || seg).width; });
  segments[Math.floor(TRACK.startZ / L)].line = "start";
  segments[finishIndex].line = "finish";

  // ----- Things beside the path -----
  const add = (n, type, offset) => { if (segments[n]) segments[n].sprites.push({ type, offset }); };

  // What grows here: snowy at the top, oaks and bushes in the middle, olives and palms by the lake.
  function pickType(seg, progress) {
    const r = random();
    if (seg.sand > 0) return r < 0.6 ? "palm" : "reeds";
    if (seg.snow > 0.6) return r < 0.5 ? "bushSnow" : r < 0.8 ? "rockSnow" : "oakSnow";
    if (progress < 0.72) {
      if (r < 0.4) return seg.snow > 0.25 ? "bushSnow" : "bush";
      if (r < 0.65) return seg.snow > 0.25 ? "rockSnow" : "rock";
      return seg.snow > 0.3 ? "oakSnow" : "oak";
    }
    return r < 0.35 ? "olive" : r < 0.6 ? "bush" : r < 0.75 ? "rock" : progress > 0.9 ? "palm" : "olive";
  }

  for (let n = 20; n < waterIndex - 5; n++) {
    const seg = segments[n];
    const progress = trackProgress(seg.p1.world.z);
    // Snow poles along the edges (not on the beach).
    if (n % 12 === 0 && seg.sand === 0) { add(n, "pole", -(seg.width + 0.08)); add(n, "pole", seg.width + 0.08); }
    // A bush, rock or tree every few segments, on one side or the other (lots of open ground too).
    if (n % 3 === 0) {
      for (const side of [-1, 1]) {
        if (random() < 0.45) continue;
        add(n, pickType(seg, progress), side * (seg.width + 0.2 + random() * (RACE.shoulder - 0.4)));
      }
    }
  }
  // Snowmen cheering and a ski cabin at the start.
  const startIndex = Math.floor(TRACK.startZ / L);
  add(startIndex + 4, "snowman", -(RACE.startWidth + 0.45));
  add(startIndex + 4, "snowman", RACE.startWidth + 0.45);
  add(startIndex + 30, "cabin", -(RACE.startWidth + 1.3));
  // A wooden sign pointing to the Kinneret, shortly before the beach.
  add(finishIndex - 160, "sign", RACE.pathWidth + 0.9);

  // Keep the gates clear, so their poles are easy to see.
  for (const gate of TRACK.gates) {
    for (let k = gate.index - 4; k <= gate.index + 4; k++) {
      segments[k].sprites = segments[k].sprites.filter((s) => Math.abs(s.offset) > RACE.gateWidth + 0.6);
    }
  }
  const finish = segments[finishIndex];
  finish.sprites = finish.sprites.filter((s) => Math.abs(s.offset) > RACE.startWidth + 0.6);
})();
