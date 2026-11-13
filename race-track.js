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
//   island 0 = normal; more = the path is split here, and this is half the width of the island
//          in the middle (rocks and trees: slow, like being off the path)
//   ramps  the snow jumps on this piece (most pieces have none)
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
  ramps: [],  // snow jumps: { index (the segment it starts on), length (segments), z0, z1 (its top edge), offset + half (where it is across the path, and half its width), height, kind ("snow" or "pier") }
  forks: [],  // places where the path splits in two around an island: { from, to (segments), jumpSide (-1 / 1: the side with the jump) }
  boxes: [],  // gift boxes: { id, z, offset }
  waterZ: 0,  // where the Kinneret starts
};

// How big each kind of sprite is in the world (width, height), whether a sled crashes into
// it (solid), and how wide the part you actually hit is (hit: a tree's trunk, a whole rock).
// (race-draw.js paints them flat; race-3d.js builds them in 3D.)
const SPRITE_SIZES = {
  bush:     { w: 760,  h: 460,  solid: true, hit: 560 },
  bushSnow: { w: 760,  h: 500,  solid: true, hit: 560 },
  oak:      { w: 1400, h: 1500, solid: true, hit: 260 },
  oakSnow:  { w: 1400, h: 1500, solid: true, hit: 260 },
  olive:    { w: 1300, h: 1100, solid: true, hit: 300 },
  almond:   { w: 1300, h: 1300, solid: true, hit: 200 }, // an almond tree in blossom (they flower in winter, around Tu BiShvat)
  palm:     { w: 1000, h: 2300, solid: true, hit: 180 },
  rock:     { w: 700,  h: 400,  solid: true, hit: 620 },
  rockSnow: { w: 700,  h: 430,  solid: true, hit: 620 },
  snowman:  { w: 480,  h: 720,  solid: true, hit: 400 },
  cabin:    { w: 1800, h: 1350, solid: true, hit: 1500 },
  sign:     { w: 1300, h: 1000, solid: true, hit: 1100 },
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

  let pieceWidth = RACE.fieldWidth; // how wide the pieces being built are (the start is a big open snowfield)

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
      baseWidth: pieceWidth, // (how wide this piece was planned; smoothed into `width` later)
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
  // A flat start at the top, then curvy stretches with hills and dips, with a straight,
  // wide answer gate between them, then the path flattens out onto the beach at the Kinneret.
  // (`pieceWidth` = how wide the path is on the pieces being built; smoothed out further down.)

  addRoad(0, 90, 0, 0, 0); // the start, on top of the mountain
  TRACK.startZ = 40 * L;
  let lastCurve = 1;
  for (let g = 0; g < RACE.gateCount; g++) {
    // The curvy stretch before this gate (the first one is shorter, so the first question comes soon).
    const stretch = g === 0 ? 260 : RACE.gateGap - RACE.gateZone;
    let made = 0;
    let forkMade = g === 0; // (no split before the first gate: that stretch is short)
    while (made < stretch) {
      // Once in every stretch the path SPLITS in two around an island of rocks and trees, and
      // joins up again further down. One way has a jump, the other has gift boxes.
      if (!forkMade && made > stretch * 0.2 && stretch - made > RACE.forkLength + 100) {
        forkMade = true;
        pieceWidth = RACE.forkWidth;
        lastCurve = -(Math.sign(lastCurve) || 1) * (1 + random() * 1.5); // (a gentle bend)
        TRACK.forks.push({ from: segments.length, to: segments.length + RACE.forkLength, jumpSide: random() < 0.5 ? -1 : 1 });
        downhill(RACE.forkLength, lastCurve, 0.12 + random() * 0.08);
        made += RACE.forkLength;
        continue;
      }
      const n = Math.min(stretch - made, 40 + Math.floor(random() * 70));
      const lastPiece = made + n >= stretch;
      // Bends: mostly left, right, left, right… sometimes two the same way, sometimes a short straight.
      const r = random();
      const turnAmount = r < 0.12 ? 0 : 2 + random() * 5;
      const sameWay = random() < 0.25;
      lastCurve = (sameWay ? Math.sign(lastCurve) || 1 : -Math.sign(lastCurve) || 1) * turnAmount;
      // How wide: mostly wide, sometimes very wide, now and then narrow (never right before a gate).
      const wr = random();
      // …and some pieces are big open SNOWFIELDS: lots of room to pick your own way down (and gentler bends).
      // (The start is one too: the first pieces carry on from the field at the top.)
      const field = (g === 0 && made < 100) || wr > 0.82;
      if (field) lastCurve *= 0.3;
      pieceWidth = field ? RACE.fieldWidth
        : wr < 0.15 && !lastPiece ? RACE.narrowWidth
        : wr < 0.4 ? RACE.wideWidth
        : RACE.pathWidth + (random() - 0.5) * 0.3;
      downhill(n, lastCurve, 0.1 + random() * 0.16);
      made += n;
    }
    // The gate: a straight, gently sloping stretch, with the gate in the middle.
    pieceWidth = RACE.gateWidth;
    const gateIndex = segments.length + Math.floor(RACE.gateZone / 2);
    addRoad(0, RACE.gateZone, 0, 0, -0.04 * RACE.gateZone);
    TRACK.gates.push({ number: g, index: gateIndex, z: gateIndex * L, width: RACE.gateWidth });
  }
  pieceWidth = RACE.pathWidth;
  downhill(120, -4, 0.12);          // the last stretch down
  downhill(100, 5, 0.1);
  downhill(120, -2.5, 0.05);
  addRoad(40, 60, 0, 0, -3);        // flattening out by the lake
  pieceWidth = RACE.startWidth;
  const beachStart = segments.length;
  addRoad(0, 140, 0, 0, 0);         // the beach
  const waterIndex = segments.length;
  // The beach ends in a big wooden ramp, and the finish line is right at the foot of it:
  // you cross the line, shoot up the ramp and fly into the Kinneret!
  const finishIndex = waterIndex - RACE.lakeRampLength - 3;
  TRACK.waterZ = waterIndex * L;
  addRoad(0, RACE.drawDistance + 20, 0, 0, 0); // the Kinneret itself
  TRACK.finishZ = finishIndex * L;
  TRACK.length = segments.length * L;

  // ----- Hills and dips (like a roller coaster, while still going down the mountain overall) -----
  // Each hill is a smooth bump up (or a dip down), kept away from the gates, the start and the finish.
  const bump = new Array(segments.length + 1).fill(0);
  for (let at = 130; at < beachStart - 210;) {
    const length = 90 + Math.floor(random() * 90); // (long and smooth, so the slopes are never too steep)
    const nearGate = TRACK.gates.some((gate) => at + length > gate.index - RACE.gateZone / 2 - 15 && at < gate.index + RACE.gateZone / 2 + 15);
    if (!nearGate) {
      const amount = (random() < 0.65 ? 1 : -1) * (7 + random() * 13) * L * RACE.hills;
      for (let k = 0; k <= length; k++) bump[at + k] += amount * (1 - Math.cos(2 * Math.PI * k / length)) / 2;
      at += length + 20 + Math.floor(random() * 80);
    } else {
      at += 10;
    }
  }
  segments.forEach((seg, n) => { seg.p1.world.y += bump[n]; seg.p2.world.y += bump[n + 1]; });

  // ----- Path width, snow and sand -----
  // Smooth the widths, so the path gets wider and narrower gently instead of in sudden steps.
  const smoothWidth = segments.map((_, n) => {
    let sum = 0, count = 0;
    for (let k = n - 20; k <= n + 20; k++) { if (segments[k]) { sum += segments[k].baseWidth; count++; } }
    return sum / count;
  });
  // A snowfield closes in to a normal path slowly (and opens out a bit quicker), like a funnel,
  // so there is time to steer back toward the middle.
  for (let n = segments.length - 2; n >= 0; n--) smoothWidth[n] = Math.min(smoothWidth[n], smoothWidth[n + 1] + 0.045);
  for (let n = 1; n < segments.length; n++) smoothWidth[n] = Math.min(smoothWidth[n], smoothWidth[n - 1] + 0.08);
  for (const seg of segments) {
    const progress = trackProgress(seg.p1.world.z);
    // The ground beside the path: all snow at the top, melting away between 12% and 40% of the way down.
    seg.snow = progress < 0.12 ? 1 : progress < 0.4 ? 1 - (progress - 0.12) / 0.28 : 0;
    // The path itself stays snowy until near the lake, then turns into sand.
    seg.sand = Math.max(0, Math.min(1, (seg.index - (beachStart - 70)) / 70));
    seg.water = seg.index >= waterIndex;
    seg.width = smoothWidth[seg.index];
    // Exactly the gate width around each gate (so the 3 lanes line up with the answers).
    for (const gate of TRACK.gates) {
      const away = Math.abs(seg.index - gate.index);
      const t = 1 - smooth(Math.max(0, Math.min(1, (away - RACE.gateZone / 2 + 30) / 30)));
      if (t > 0) seg.width = seg.width + (RACE.gateWidth - seg.width) * t;
    }
  }
  // Where the path splits, an island grows in the middle: as wide as there is room for
  // (each way round stays wide enough to drive), with pointed ends.
  for (const seg of segments) seg.island = 0;
  for (const fork of TRACK.forks) {
    for (let n = fork.from - 10; n <= fork.to + 30; n++) {
      const seg = segments[n];
      // (The front tip grows slowly, so there is time to pick a side; the tail closes a bit quicker.)
      const ends = smooth(Math.max(0, Math.min(1, (n - (fork.from - 10)) / 45, (fork.to + 30 - n) / 25)));
      seg.island = Math.max(0, Math.min(RACE.forkIsland, seg.width - 1.25)) * ends;
      seg.fork = fork;
    }
  }
  // The far end of each piece takes the next piece's width, so the edges join up smoothly.
  segments.forEach((seg, i) => { seg.width2 = (segments[i + 1] || seg).width; seg.island2 = (segments[i + 1] || seg).island; });
  segments[Math.floor(TRACK.startZ / L)].line = "start";
  segments[finishIndex].line = "finish";
  // Each gate stands on its own piece of path (that's how the drawing finds it).
  for (const gate of TRACK.gates) segments[gate.index].gate = gate;

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
      if (r < 0.75 && seg.snow < 0.15) return "almond";
      return seg.snow > 0.3 ? "oakSnow" : "oak";
    }
    if (r < 0.12 && progress < 0.85) return "almond";
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
        // (Far enough from the edge that nothing solid pokes into the path: staying on the path is always safe from these.)
        add(n, pickType(seg, progress), side * (seg.width + 0.45 + random() * (RACE.shoulder - 0.65)));
      }
    }
  }
  // Snowmen cheering and a ski cabin at the start.
  const startIndex = Math.floor(TRACK.startZ / L);
  // (Beside the start banner, which stands in the middle of the big snowfield, and at the field's edge.)
  add(startIndex + 4, "snowman", -1.9);
  add(startIndex + 4, "snowman", 1.9);
  add(startIndex + 30, "cabin", -(segments[startIndex + 30].width + 1.3));
  // A wooden sign pointing to the Kinneret, shortly before the beach.
  add(beachStart - 110, "sign", RACE.pathWidth + 0.9);

  // Trees and rocks right ON the path, to steer around (only where it's wide enough to get
  // past, never near a gate, the start or the finish). In the very wide places, sometimes two.
  const clearOfGates = (n) => TRACK.gates.every((gate) => Math.abs(n - gate.index) > RACE.gateZone / 2 + 45);
  for (let n = 220; n < beachStart - 210; n += 30 + Math.floor(random() * 50)) {
    const seg = segments[n];
    if (random() > RACE.treesOnPath || seg.width < 0.9 || !clearOfGates(n) || seg.fork || Math.abs(seg.curve) > 3) continue; // (not in a sharp bend: that is hard enough already)
    const progress = trackProgress(seg.p1.world.z);
    const type = seg.snow > 0.6 ? (random() < 0.6 ? "oakSnow" : "rockSnow")
      : progress < 0.72 ? (random() < 0.5 ? "oak" : random() < 0.5 ? "almond" : "rock")
      : (random() < 0.7 ? "olive" : "rock");
    const room = seg.width - 0.45; // how far from the middle it can stand (so there's always a way past)
    const spot = (random() * 2 - 1) * room;
    add(n, type, spot);
    if (seg.width > 1.5 && random() < 0.5) add(n + 8, random() < 0.5 ? "bush" : seg.snow > 0.5 ? "bushSnow" : "rock", spot > 0 ? spot - 1.3 : spot + 1.3);
  }

  // The snowfields: trees, rocks and bushes scattered all over them, with plenty of room in
  // between, so everyone picks their own way through. (Not right after the start, or near a gate.)
  for (let n = startIndex + 30; n < beachStart - 210; n += 5) {
    const seg = segments[n];
    if (seg.width < 2.4 || seg.fork || !clearOfGates(n) || random() > RACE.fieldTrees) continue;
    const r = random();
    const snowy = seg.snow > 0.3;
    const type = r < 0.35 ? (snowy ? "oakSnow" : "oak") : r < 0.65 ? (snowy ? "rockSnow" : "rock") : r < 0.92 ? (snowy ? "bushSnow" : "bush") : snowy ? "snowman" : "almond";
    add(n, type, (random() * 2 - 1) * (seg.width - 0.5));
  }

  // ----- The islands where the path splits -----
  // A big rock at the island's tip, poles along its edges, and rocks, trees and bushes down the middle.
  for (const fork of TRACK.forks) {
    let tip = true;
    for (let n = fork.from - 10; n <= fork.to + 30; n++) {
      const seg = segments[n];
      if (seg.island < 0.35) continue;
      const snowy = seg.snow > 0.3;
      if (tip) { add(n, snowy ? "rockSnow" : "rock", 0); tip = false; continue; }
      if (n % 6 === 0) { add(n, "pole", -(seg.island + 0.06)); add(n, "pole", seg.island + 0.06); }
      if (n % 4 === 0 && seg.island > 0.7) { // (well inside the island, so nothing solid pokes out into the path)
        const r = random();
        const type = r < 0.4 ? (snowy ? "oakSnow" : "oak") : r < 0.75 ? (snowy ? "rockSnow" : "rock") : snowy ? "bushSnow" : "bush";
        add(n, type, (random() * 2 - 1) * (seg.island - 0.55));
      }
    }
  }

  // ----- Snow jumps -----
  // A ramp is a wedge of packed snow: ride up it and you fly. Small ramps cover part of the
  // path (so you can choose to take them or not); some go right across. On wide stretches
  // there are a few side by side. Never in a sharp bend, a narrow place or just before a gate.
  function addRamp(index, length, offset, half, height, kind) {
    const ramp = { index, length, z0: index * L, z1: (index + length) * L, offset, half, height, kind };
    TRACK.ramps.push(ramp);
    for (let k = index; k < index + length; k++) (segments[k].ramps = segments[k].ramps || []).push(ramp);
  }
  const awayFromGates = (n) => TRACK.gates.every((gate) => n > gate.index + 45 || n < gate.index - 140);
  // How a jump from a ramp here would go at top speed: how many seconds in the air, and how
  // high above the ground at most. (A ramp just before the ground falls away steeply would
  // throw sleds half way down the mountain, and one on an uphill would hardly lift them.)
  const baseHeight = (z) => { const seg = findSegment(z); return seg.p1.world.y + (seg.p2.world.y - seg.p1.world.y) * (z - seg.p1.world.z) / L; };
  function tryJump(n, len, height, speed) {
    const z0 = (n + len) * L;
    // (The same sums as sledFlight, at the bottom of this file.)
    const up = (baseHeight(z0) - baseHeight(z0 - L)) / L * speed + 1.6 * height / (len * L) * Math.min(speed, RACE.maxSpeed);
    let peak = 0;
    for (let t = 0.05; t < 6; t += 0.05) {
      const above = baseHeight(z0) + height + up * t - RACE.gravity * t * t / 2 - baseHeight(z0 + speed * t);
      if (above <= 0) return { time: t, peak };
      peak = Math.max(peak, above);
    }
    return { time: 6, peak };
  }
  const goodJump = (n) => {
    const normal = tryJump(n, RACE.rampLength, RACE.rampHeight, RACE.maxSpeed);
    const boosted = tryJump(n, RACE.rampLength, RACE.rampHeight, RACE.maxSpeed * RACE.boostSpeed); // (arriving with a boost)
    return normal.time >= 0.8 && normal.time <= 1.8 && boosted.time <= 2.1 && normal.peak <= 1500 && boosted.peak <= 1900;
  };
  for (let n = startIndex + 110; n < beachStart - 260; n += 15) { // (a spot that is no good: try a little further on)
    const len = RACE.rampLength;
    if (!awayFromGates(n) || segments[n - 5].fork || segments[n + len + 45].fork || !goodJump(n)) continue;
    let bend = 0, widthHere = Infinity, widthAfter = Infinity;
    for (let k = n; k < n + len + 55; k++) {
      bend = Math.max(bend, Math.abs(segments[k].curve));
      if (k < n + len) widthHere = Math.min(widthHere, segments[k].width);
      widthAfter = Math.min(widthAfter, segments[k].width);
    }
    if (bend > 4 || widthAfter < 0.85) continue;
    const r = random();
    if (widthHere < 1.5) {
      if (r < 0.35) addRamp(n, len, 0, widthHere + 0.12, RACE.rampHeight, "snow"); // right across the path: everybody jumps!
      else addRamp(n, len, (r < 0.57 ? -1 : r < 0.79 ? 0 : 1) * (widthHere - RACE.rampWidth - 0.1), RACE.rampWidth, RACE.rampHeight, "snow");
    } else {
      const count = widthHere > 2.6 ? 3 : 2;
      for (let k = 0; k < count; k++) addRamp(n, len, ((k + 0.5) / count * 2 - 1) * (widthHere - 0.3), RACE.rampWidth * 1.25, RACE.rampHeight, "snow");
    }
    n += Math.round(RACE.rampEvery * (0.6 + random() * 0.8)) - 15; // on to the next one
  }
  // Where the path splits: two jumps on one way round…
  for (const fork of TRACK.forks) {
    for (const start of [fork.from + 35, fork.from + 95]) {
      let n = start;
      while (n < start + 20 && !goodJump(n)) n += 4; // (nudged along a little if the ground there is wrong for a jump)
      const seg = segments[n];
      const room = (seg.width - seg.island) / 2; // half the width of one way round
      if (room > 0.45 && goodJump(n)) addRamp(n, RACE.rampLength, fork.jumpSide * (seg.island + room), room - 0.08, RACE.rampHeight, "snow");
    }
  }
  // The big wooden ramp at the very end, into the Kinneret.
  addRamp(waterIndex - RACE.lakeRampLength, RACE.lakeRampLength, 0, RACE.startWidth + 0.15, RACE.lakeRampHeight, "pier");

  // ----- Gift boxes -----
  // Rows of boxes right across the path (and at each split, on the way round WITHOUT the jump).
  const addBoxes = (n, center, half) => {
    const count = Math.max(2, Math.min(7, Math.round(half * 2 / 0.55)));
    for (let k = 0; k < count; k++) {
      TRACK.boxes.push({ id: TRACK.boxes.length, z: n * L, offset: center + ((k + 0.5) / count * 2 - 1) * half });
    }
  };
  const nearRamp = (n) => { for (let k = n - RACE.rampLength - 75; k <= n + 12; k++) { if (segments[k].ramps) return true; } return false; };
  for (let n = startIndex + 150; n < beachStart - 200;) {
    if (segments[n].fork || nearRamp(n) || TRACK.gates.some((gate) => Math.abs(n - gate.index) < 75)) { n += 20; continue; }
    addBoxes(n, 0, segments[n].width);
    n += Math.round(RACE.boxEvery * (0.8 + random() * 0.4));
  }
  for (const fork of TRACK.forks) {
    for (const n of [fork.from + 50, fork.from + 105]) {
      const seg = segments[n], room = (seg.width - seg.island) / 2;
      addBoxes(n, -fork.jumpSide * (seg.island + room), room);
    }
  }

  // Nothing solid on a ramp, where a jump lands, or right at a gift box.
  for (const ramp of TRACK.ramps) {
    for (let k = ramp.index - 8; k <= Math.min(segments.length - 1, ramp.index + ramp.length + 75); k++) {
      segments[k].sprites = segments[k].sprites.filter((s) => !SPRITE_SIZES[s.type].solid || Math.abs(s.offset - ramp.offset) > ramp.half + 0.55);
    }
  }
  for (const box of TRACK.boxes) {
    const n = Math.round(box.z / L);
    for (let k = n - 5; k <= n + 5; k++) {
      segments[k].sprites = segments[k].sprites.filter((s) => !SPRITE_SIZES[s.type].solid || Math.abs(s.offset - box.offset) > 0.5);
    }
  }

  // Keep the gates clear, so their poles are easy to see.
  for (const gate of TRACK.gates) {
    for (let k = gate.index - 4; k <= gate.index + 4; k++) {
      segments[k].sprites = segments[k].sprites.filter((s) => Math.abs(s.offset) > RACE.gateWidth + 0.6);
    }
  }
  const finish = segments[finishIndex];
  finish.sprites = finish.sprites.filter((s) => Math.abs(s.offset) > RACE.startWidth + 0.6);
})();

// ---------- Heights, jumps and flying ----------

// How high a ramp is at a spot (0 = no ramp there). A ramp starts flat and gets steeper
// toward its top edge, where it ends in a drop.
function rampHeightAt(z, x) {
  const seg = findSegment(z);
  if (!seg.ramps) return 0;
  let height = 0;
  for (const ramp of seg.ramps) {
    if (z < ramp.z0 || z >= ramp.z1 || Math.abs(x - ramp.offset) > ramp.half) continue;
    height = Math.max(height, ramp.height * Math.pow((z - ramp.z0) / (ramp.z1 - ramp.z0), 1.6));
  }
  return height;
}

// How high the ground is at a spot on the path (the path's own ups and downs, plus any ramp).
function trackHeight(z, x) {
  const seg = findSegment(z);
  const t = Math.max(0, Math.min(1, (z - seg.p1.world.z) / RACE.segmentLength));
  return seg.p1.world.y + (seg.p2.world.y - seg.p1.world.y) * t + rampHeightAt(z, x);
}

// Off the path? (Beside it, or on the island in the middle where the path splits.)
function offThePath(seg, x) {
  return Math.abs(x) > seg.width || Math.abs(x) < seg.island - 0.05;
}

// Flying! Call this right after moving a sled (oldY, oldX = where it was a moment ago).
// A sled has `air` (how high it is above the ground; 0 = on the ground) and `vy` (how fast
// it is going up, or down if minus). Riding off the top edge of a ramp throws it into the
// air at the ramp's angle; then gravity pulls it back down. Answers "launched" (it just
// took off), "flying", "landed" (it just came down) or "" (on the ground).
// (Phones use this for their own sled, and the referee for the bots.)
function sledFlight(s, oldY, oldX, dt) {
  if (s.air > 0) {
    s.vy -= RACE.gravity * dt;
    s.air += trackHeight(oldY, oldX) + s.vy * dt - trackHeight(s.y, s.x);
    if (s.air > 0) return "flying";
    s.air = 0;
    s.vy = 0;
    return "landed";
  }
  // On the ground: did the ramp just end under the sled?
  if (s.speed <= 0 || rampHeightAt(oldY, oldX) - rampHeightAt(s.y, s.x) < 60) return "";
  const before = trackHeight(oldY, oldX);
  // How steeply it was going up: the ramp itself, plus the slope of the path under the ramp.
  // (A boosted sled flies further, but the ramp does not kick it any harder than a sled at
  // top speed, or boosted jumps would go half way down the mountain.)
  const ramp = Math.max(0, Math.min(0.5, (rampHeightAt(oldY, oldX) - rampHeightAt(oldY - 150, oldX)) / 150));
  const path = (before - trackHeight(oldY - 150, oldX)) / 150 - (rampHeightAt(oldY, oldX) - rampHeightAt(oldY - 150, oldX)) / 150;
  s.vy = path * s.speed + ramp * Math.min(s.speed, RACE.maxSpeed);
  s.air = before + s.vy * dt - trackHeight(s.y, s.x);
  if (s.air > 0) return "launched";
  s.air = 0;
  s.vy = 0;
  return "";
}

// Sleds are solid: two sleds can't be in the same spot. Is sled `a` touching sled `b`?
// No: null. Yes: { side: which way `a` should slide to get clear (-1 left, 1 right),
// lined: true if they're one behind the other (nose to tail) rather than side by side,
// behind: true if `a` is the one at the back }.
// (Every phone checks this for its own sled, and the referee for the bots, so both sleds move apart.)
function sledsTouch(a, b) {
  const dx = (a.x - b.x) * RACE.roadWidth, dy = a.y - b.y;
  if (Math.abs(dx) >= SLED_WIDTH || Math.abs(dy) >= RACE.sledLength) return null;
  if (Math.abs((a.air || 0) - (b.air || 0)) > 250) return null; // (one of them is flying over the other)
  const side = dx > 0 ? 1 : dx < 0 ? -1 : (String(a.id) < String(b.id) ? -1 : 1);
  return { side, lined: Math.abs(dx) < SLED_WIDTH * 0.6, behind: dy < 0 };
}
