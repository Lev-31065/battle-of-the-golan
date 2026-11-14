// race-track.js — the path for Mt Hermon Racing: one long ride from the snowy top of
// Mt Hermon all the way down to the Kinneret (no laps).
//
// The path is a long row of short, straight pieces called "segments" (RACE.segmentLength
// long each, settings in rules.js). Each segment can bend left or right a little ("curve")
// and go down or up ("y" = height). Put thousands of them in a row and you get a curvy
// mountain path. Each segment also knows:
//   width  how wide the path is there (narrow, but much wider at the answer gates)
//   zone   which part of the ride it is in: "top", "woods", "bridge", "face", "hills", "valley", "beach"
//   snow   how snowy the ground beside the path is (1 = all snow at the top, 0 = no snow lower down)
//   sand   0 = a snowy path, 1 = the sandy beach at the Kinneret
//   water  true = the lake itself (past the finish line)
//   island 0 = normal; more = the path is split here, and this is half the width of the island
//          in the middle (rocks and trees: slow, like being off the path). islandAt = where the
//          island's middle is across the path (0 = right in the middle)
//   bank   0 = flat; -1 … 1 = this bend is TILTED like a bowl, so you can zoom round it
//   bridge / tunnel  true = this piece is on the bridge, or in the tunnel under it (walls on both sides)
//   ramps  the snow jumps on this piece (most pieces have none)
//
// THE RIDE, from top to bottom (it is written out piece by piece further down):
//   1. the snowfield on top, then a long, fairly straight downhill
//   2. a very sharp bend (skid!) into deep woods: sharp bends and places where the path splits
//   3. out of the woods over a BRIDGE, round in a big loop, and through the TUNNEL under that bridge
//   4. the side of a steep mountain: a big wide curve, or the bumpy shortcut down the face
//   5. hills, with the path weaving between them (and jumps off some of the hills)
//   6. the last stretch down to the beach, and the big ramp into the Kinneret
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
  gates: [],  // the answer gates, in order down the path: { number, index (which segment it stands on), z, center + half (where its 3 lanes are across the path, and half their width) }. They are all the same size, right across the path
  ramps: [],  // snow jumps: { index (the segment it starts on), length (segments), z0, z1 (its top edge), offset + half (where it is across the path, and half its width), height, kind ("snow", "hill" or "pier") }
  forks: [],  // places where the path splits in two around an island: { from, to (segments), kind ("woods", "hill" or "face"), jumpSide (-1 / 1: the side with the jumps, 0 = none), fastSide (-1 / 1: the shortcut side, where sleds go faster; 0 = none) }
  goats: [],  // mountain goats wandering about on the path: { id, z (where it lives), range (how far it walks to each side), speed, phase }
  layout: null,   // where every piece of the path is on the map: { x, z, heading } (lists; in 3D units: one track unit = 0.01)
  crossing: null, // where the path crosses over itself: { upper, lower (the two segments, one above the other), bridge: [from, to], tunnel: [from, to], drop (how far below the bridge the tunnel's floor is) }
  waterZ: 0,  // where the Kinneret starts
};

// How big each kind of sprite is in the world (width, height), whether a sled runs into
// it (solid), and how wide the part you actually hit is (hit: a tree's trunk, a whole rock).
// soft = you plough right through it in a spray of snow, only slower (a bush, a snowman);
// the other solid things are HARD: clack! (a tree, a rock, a cabin).
// (race-draw.js paints them flat; race-3d.js builds them in 3D.)
const SPRITE_SIZES = {
  bush:     { w: 760,  h: 460,  solid: true, soft: true, hit: 560 },
  bushSnow: { w: 760,  h: 500,  solid: true, soft: true, hit: 560 },
  oak:      { w: 1400, h: 1500, solid: true, hit: 260 },
  oakSnow:  { w: 1400, h: 1500, solid: true, hit: 260 },
  pineSnow: { w: 1000, h: 2200, solid: true, hit: 220 }, // the tall, snowy trees of the deep woods
  olive:    { w: 1300, h: 1100, solid: true, hit: 300 },
  almond:   { w: 1300, h: 1300, solid: true, hit: 200 }, // an almond tree in blossom (they flower in winter, around Tu BiShvat)
  palm:     { w: 1000, h: 2300, solid: true, hit: 180 },
  rock:     { w: 700,  h: 400,  solid: true, hit: 620 },
  rockSnow: { w: 700,  h: 430,  solid: true, hit: 620 },
  snowman:  { w: 480,  h: 720,  solid: true, soft: true, hit: 400 },
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
  const K = RACE.bend3d / L; // how much one segment turns the path (in radians), for each 1 of "curve"

  // "Random" numbers that come out the same on every phone (a seeded random generator).
  let seed = 11;
  function random() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }

  // A smooth change from 0 to 1 (no sudden jolts).
  const smooth = (t) => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };

  // What the pieces being built right now are like. (The ride below changes these as it goes.)
  let width = RACE.fieldWidth; // half the width of the path (the start is a big open snowfield)
  let zone = "top";            // which part of the ride this is
  let snow = 1;                // how snowy it is here

  // One new segment. `steep` = how much it drops (0.1 = gentle, 0.2 = steep, 0 = flat).
  // `more` = anything special about it, like { calm: true } (no bumps, no trees ON the path,
  // no jumps, no goats: for the gates, the bridge and the tunnel).
  function addSegment(curve, steep, more) {
    const n = segments.length;
    const seg = {
      index: n,
      // p1 = the near end of this piece, p2 = the far end. (Heights are filled in later; camera + screen while drawing.)
      p1: { world: { y: 0, z: n * L }, camera: {}, screen: {} },
      p2: { world: { y: 0, z: (n + 1) * L }, camera: {}, screen: {} },
      curve, steep,
      sprites: [],
      dark: Math.floor(n / 3) % 2 === 1, // light and dark stripes, so you can feel the speed
      width: RACE.pathWidth,
      baseWidth: width, // (how wide this piece was planned; smoothed into `width` later)
      zone, snow, sand: 0, water: false,
      island: 0, islandAt: 0, bank: 0,
    };
    if (more) Object.assign(seg, more);
    segments.push(seg);
    return seg;
  }

  // A straight stretch, n segments long.
  function straight(n, steep, more) {
    for (let k = 0; k < n; k++) addSegment(0, steep, more);
  }

  // A bend. degrees = how far round it goes (plus = to the right, minus = to the left; 90 = a
  // square corner, 270 = three quarters of a circle). sharp = how tight it is (2 = a lazy
  // curve, 6 = a real bend, 11 and up = so sharp you have to skid). It eases in and out, and
  // it always turns the path by exactly that many degrees.
  // `more.banked` = this bend is tilted like a bowl (you can zoom round it).
  function turn(degrees, sharp, steep, more) {
    const radians = Math.abs(degrees) * Math.PI / 180, way = Math.sign(degrees);
    const need = radians / (sharp * K); // how many segments it takes at full sharpness
    const ease = Math.max(3, Math.min(14, Math.round(need * 0.3)));
    const hold = Math.max(0, Math.round(need - ease));
    const strength = []; // how hard each segment bends: 0 … 1
    for (let k = 0; k < ease; k++) strength.push(smooth((k + 1) / (ease + 1)));
    for (let k = 0; k < hold; k++) strength.push(1);
    for (let k = ease - 1; k >= 0; k--) strength.push(smooth((k + 1) / (ease + 1)));
    const curve = way * radians / (K * strength.reduce((sum, s) => sum + s, 0));
    for (const s of strength) {
      const seg = addSegment(curve * s, steep, more);
      // In the hills, a hill stands on the inside of every bend (the path weaves between them).
      if (zone === "hills") { seg.wallR = way > 0 ? 0.9 : -0.35; seg.wallL = way > 0 ? -0.35 : 0.9; }
      if (more && more.banked) seg.bank = way * s;
    }
  }

  // An answer gate: a straight, wide, gently sloping stretch, with the gate in the middle.
  function gate() {
    const before = width;
    width = RACE.gateWidth;
    const index = segments.length + Math.floor(RACE.gateZone / 2);
    straight(RACE.gateZone, 0.04, { calm: true });
    TRACK.gates.push({ number: TRACK.gates.length, index, z: index * L, center: 0, half: RACE.gateWidth });
    width = before;
  }

  // A place where the path SPLITS in two around an island, and joins up again further down.
  // kind: "woods" (two ways through the trees, one with small jumps), "hill" (one way goes up
  // a hill and jumps off it) or "face" (a wide easy way, or the bumpy shortcut down the mountain face).
  // `build` lays down the pieces of path the split runs along.
  function fork(kind, jumpSide, build) {
    const before = width;
    width = kind === "face" ? RACE.faceWidth : RACE.forkWidth;
    const f = { from: segments.length, to: 0, kind, jumpSide: kind === "face" ? 0 : jumpSide, fastSide: kind === "face" ? jumpSide : 0 };
    build();
    f.to = segments.length;
    TRACK.forks.push(f);
    width = before;
  }

  // ===================== THE RIDE =====================
  // (To change the path, change the pieces here. Every piece is: how far or how many degrees,
  // how sharp, how steep. Then check the map: the test page draws it.)

  // ----- 1. The top of the mountain: a big snowfield, then a long, fairly straight downhill -----
  straight(90, 0, { calm: true }); // the start, on top of the mountain
  TRACK.startZ = 40 * L;
  turn(12, 1.2, 0.12);
  width = RACE.wideWidth;
  turn(-20, 1.5, 0.14);
  width = RACE.pathWidth + 0.15;
  straight(60, 0.2);
  turn(10, 1, 0.22);
  gate();                                   // gate 1
  turn(-8, 1, 0.2);
  straight(90, 0.22);

  // ----- 2. The deep woods: a very sharp bend in (skid!), then about a minute of sharp bends and splits -----
  zone = "woods";
  width = 1.2;
  turn(100, 12, 0.1);
  width = 1.0;
  straight(40, 0.12);
  width = 1.2;
  turn(-70, 11, 0.1);
  fork("woods", 1, () => { straight(20, 0.14); turn(25, 2.2, 0.15); straight(30, 0.14); });
  turn(85, 12, 0.1);
  width = 1.0;
  straight(30, 0.14);
  width = 1.2;
  turn(-110, 12.5, 0.1);
  fork("woods", -1, () => { straight(20, 0.14); turn(-30, 2.5, 0.15); straight(30, 0.14); });
  turn(60, 10, 0.12);
  straight(20, 0.1);
  gate();                                   // gate 2, in a clearing in the woods
  turn(-95, 12, 0.1);
  fork("woods", 1, () => { straight(20, 0.14); turn(40, 3, 0.15); straight(25, 0.14); });
  turn(75, 11, 0.1);                        // two sharp bends in a row: left-right, like an S
  turn(-80, 12, 0.1);
  fork("woods", -1, () => { straight(25, 0.14); turn(20, 2, 0.15); straight(30, 0.14); });
  turn(70, 10, 0.12);
  width = 1.0;
  straight(40, 0.1);

  // ----- 3. Out of the woods: over the bridge, round in a loop, and through the tunnel under the bridge -----
  // (The loop turns exactly 270 degrees, so the path comes back and crosses under itself.)
  zone = "bridge";
  snow = 0.85;
  width = RACE.pathWidth;
  const loop = { upperFrom: segments.length, upperTo: 0, lowerFrom: 0, lowerTo: 0 };
  straight(125, 0.02, { calm: true });      // …the bridge is on this stretch
  loop.upperTo = segments.length;
  width = 1.25;
  turn(270, 9.5, 0.11, { calm: true });
  width = RACE.pathWidth;
  loop.lowerFrom = segments.length;
  straight(110, 0.08, { calm: true });      // …and the tunnel on this one
  loop.lowerTo = segments.length;

  // ----- 4. The side of a steep mountain: a wall on the right, a long drop on the left -----
  zone = "face";
  snow = 0.6;
  width = RACE.wideWidth;
  const cliff = { wallL: -1, wallR: 1 };
  straight(30, 0.1, cliff);
  gate();                                   // gate 3
  // The big curve (wide and easy), or the shortcut down the face on its inside (narrow, full
  // of rocks and trees, but faster).
  fork("face", -1, () => { straight(20, 0.16, cliff); turn(-100, 2.2, 0.18, cliff); straight(20, 0.16, cliff); });
  straight(70, 0.15, cliff);
  turn(60, 4, 0.14, { wallL: -0.6, wallR: 0.6 });
  gate();                                   // gate 4

  // ----- 5. The hills: the path weaves between them, and on some you can ride up and jump off -----
  zone = "hills";
  snow = 0.3;
  width = 1.1;
  turn(90, 6, 0.12);
  straight(60, 0.14);
  turn(-80, 7, 0.12);
  fork("hill", 1, () => { straight(30, 0.13); turn(30, 2.5, 0.14); straight(60, 0.13); });
  turn(70, 6.5, 0.14, { banked: true });    // a tilted bend: zoom!
  turn(-100, 7, 0.12);
  snow = 0.1;
  gate();                                   // gate 5
  turn(60, 5, 0.12);
  straight(70, 0.14);
  fork("hill", -1, () => { straight(30, 0.13); turn(-25, 2, 0.14); straight(60, 0.13); });
  turn(-70, 8, 0.12);
  turn(90, 7.5, 0.14, { banked: true });    // another tilted bend
  snow = 0;
  fork("hill", 1, () => { straight(30, 0.13); turn(-20, 2, 0.14); straight(60, 0.13); });
  gate();                                   // gate 6

  // ----- 6. The last stretch down to the Kinneret -----
  zone = "valley";
  width = RACE.pathWidth;
  turn(-40, 4, 0.12);
  turn(45, 5, 0.1);
  turn(-15, 2.5, 0.05);
  straight(100, 0.015, { calm: true });     // flattening out by the lake
  zone = "beach";
  width = RACE.startWidth;
  const beachStart = segments.length;
  straight(140, 0, { calm: true });         // the beach
  const waterIndex = segments.length;
  // The beach ends in a big wooden ramp, and the finish line is right at the foot of it:
  // you cross the line, shoot up the ramp and fly into the Kinneret!
  const finishIndex = waterIndex - RACE.lakeRampLength - 3;
  TRACK.waterZ = waterIndex * L;
  straight(RACE.drawDistance + 20, 0, { calm: true }); // the Kinneret itself
  TRACK.finishZ = finishIndex * L;
  TRACK.length = segments.length * L;
  const N = segments.length;

  // ===================== Turning the pieces into a mountain =====================

  // ----- Heights -----
  // Each piece said how steep it is. Smooth that out (so slopes change gently), then add it
  // all up, going down from the top.
  const steepSum = new Float64Array(N + 1);
  for (let n = 0; n < N; n++) steepSum[n + 1] = steepSum[n] + segments[n].steep;
  const height = new Float64Array(N + 1);
  for (let n = 0; n < N; n++) {
    const a = Math.max(0, n - 12), b = Math.min(N, n + 13);
    height[n + 1] = height[n] - (steepSum[b] - steepSum[a]) / (b - a) * L;
  }
  // Hills and dips (like a roller coaster, while still going down the mountain overall).
  // Each one is a smooth bump up (or a dip down). None on the calm pieces (gates, bridge, tunnel).
  const bump = new Float64Array(N + 1);
  for (let at = 130; at < beachStart - 210;) {
    const length = 90 + Math.floor(random() * 90); // (long and smooth, so the slopes are never too steep)
    let calm = false;
    for (let k = at - 15; k <= at + length + 15; k++) if (segments[k].calm) calm = true;
    if (!calm) {
      const size = segments[at].zone === "hills" ? 1.1 : segments[at].zone === "woods" ? 0.6 : 1;
      const amount = (random() < 0.65 ? 1 : -1) * (7 + random() * 13) * L * RACE.hills * size;
      for (let k = 0; k <= length; k++) bump[at + k] += amount * (1 - Math.cos(2 * Math.PI * k / length)) / 2;
      at += length + 20 + Math.floor(random() * 80);
    } else {
      at += 10;
    }
  }
  segments.forEach((seg, n) => { seg.p1.world.y = height[n] + bump[n]; seg.p2.world.y = height[n + 1] + bump[n + 1]; });

  // ----- Path width, snow and sand -----
  // Smooth the widths, so the path gets wider and narrower gently instead of in sudden steps.
  const smoothWidth = segments.map((_, n) => {
    let sum = 0, count = 0;
    for (let k = n - 20; k <= n + 20; k++) { if (segments[k]) { sum += segments[k].baseWidth; count++; } }
    return sum / count;
  });
  // A snowfield closes in to a normal path slowly (and opens out a bit quicker), like a funnel,
  // so there is time to steer back toward the middle.
  for (let n = N - 2; n >= 0; n--) smoothWidth[n] = Math.min(smoothWidth[n], smoothWidth[n + 1] + 0.045);
  for (let n = 1; n < N; n++) smoothWidth[n] = Math.min(smoothWidth[n], smoothWidth[n - 1] + 0.08);
  const plannedSnow = segments.map((seg) => seg.snow);
  for (const seg of segments) {
    // The snow melts away gently from one part of the ride to the next.
    let sum = 0, count = 0;
    for (let k = seg.index - 60; k <= seg.index + 60; k++) { if (k >= 0 && k < N) { sum += plannedSnow[k]; count++; } }
    seg.snow = sum / count;
    // The path itself stays snowy until near the lake, then turns into sand.
    seg.sand = Math.max(0, Math.min(1, (seg.index - (beachStart - 70)) / 70));
    seg.water = seg.index >= waterIndex;
    seg.width = smoothWidth[seg.index];
    // Exactly the gate width around each gate (so the 3 lanes line up with the answers).
    for (const gate of TRACK.gates) {
      const away = Math.abs(seg.index - gate.index);
      const t = 1 - smooth((away - RACE.gateZone / 2 + 30) / 30);
      if (t > 0) seg.width = seg.width + (RACE.gateWidth - seg.width) * t;
    }
  }
  // Where the path splits, an island grows in the middle: as wide as there is room for
  // (each way round stays wide enough to drive), with pointed ends.
  // (On the mountain face the island is over to the LEFT and wiggles: the narrow, twisty way
  // on its left is the shortcut; the wide way on its right is the big easy curve.)
  for (const fork of TRACK.forks) {
    for (let n = fork.from - 10; n <= fork.to + 30; n++) {
      const seg = segments[n];
      // (The front tip grows slowly, so there is time to pick a side; the tail closes a bit quicker.)
      const ends = smooth(Math.min((n - (fork.from - 10)) / 45, (fork.to + 30 - n) / 25));
      if (fork.kind === "face") {
        seg.island = Math.max(0, Math.min(RACE.faceIsland, seg.width - 2.3)) * ends;
        seg.islandAt = fork.fastSide * (RACE.faceIsland + 0.5 * Math.sin((n - fork.from) * 0.1)) * ends * (seg.island > 0 ? 1 : 0);
      } else {
        seg.island = Math.max(0, Math.min(RACE.forkIsland, seg.width - 1.25)) * ends;
      }
      seg.fork = fork;
    }
  }
  // The far end of each piece takes the next piece's width, so the edges join up smoothly.
  segments.forEach((seg, i) => {
    const next = segments[i + 1] || seg;
    seg.width2 = next.width; seg.island2 = next.island; seg.islandAt2 = next.islandAt;
  });
  segments[Math.floor(TRACK.startZ / L)].line = "start";
  segments[finishIndex].line = "finish";
  // Each gate stands on its own piece of path (that's how the drawing finds it).
  for (const gate of TRACK.gates) segments[gate.index].gate = gate;

  // ----- The map: where every piece of the path really is -----
  // Start at (0, 0) heading "forward", and walk down the path: every segment goes one step
  // the way the path is heading, then turns a little (its curve). x = sideways, z = forward
  // is toward MINUS z. (In 3D units: one track unit = 0.01. race-3d.js builds the world on this map.)
  const U = 0.01;
  const map = TRACK.layout = { x: new Float32Array(N + 1), z: new Float32Array(N + 1), heading: new Float32Array(N + 1) };
  let heading = 0;
  for (let n = 0; n < N; n++) {
    map.heading[n] = heading;
    map.x[n + 1] = map.x[n] + Math.sin(heading) * L * U;
    map.z[n + 1] = map.z[n] - Math.cos(heading) * L * U;
    heading += segments[n].curve * K;
  }
  map.heading[N] = heading;

  // ----- The bridge and the tunnel -----
  // Find the spot where the stretch after the loop passes under the stretch before it:
  // the two segments (one on each stretch) that are closest together on the map.
  let gap = Infinity, upper = loop.upperFrom, lower = loop.lowerFrom;
  for (let i = loop.upperFrom; i < loop.upperTo; i++) {
    for (let j = loop.lowerFrom; j < loop.lowerTo; j++) {
      const d = Math.hypot(map.x[i] - map.x[j], map.z[i] - map.z[j]);
      if (d < gap) { gap = d; upper = i; lower = j; }
    }
  }
  // The bridge has to reach right across the path below it (and its banks); the tunnel
  // covers the path above it, and sticks out a little way on both sides.
  const bridge = [Math.max(loop.upperFrom + 2, upper - 28), Math.min(loop.upperTo - 3, upper + 28)];
  const tunnel = [Math.max(loop.lowerFrom + 2, lower - 29), Math.min(loop.lowerTo - 3, lower + 29)];
  TRACK.crossing = { upper, lower, gap, bridge, tunnel, drop: segments[upper].p1.world.y - segments[lower].p1.world.y };
  for (let n = bridge[0]; n <= bridge[1]; n++) { segments[n].bridge = true; segments[n].walled = true; }
  for (let n = tunnel[0]; n <= tunnel[1]; n++) { segments[n].tunnel = true; segments[n].walled = true; }

  // ----- Things beside the path -----
  const add = (n, type, offset) => { if (segments[n]) segments[n].sprites.push({ type, offset }); };

  // What grows here: snowy at the top, oaks and bushes in the middle, olives and palms by the lake.
  function pickType(seg, progress) {
    const r = random();
    if (seg.sand > 0) return r < 0.6 ? "palm" : "reeds";
    if (seg.snow > 0.6) return r < 0.5 ? "bushSnow" : r < 0.8 ? "rockSnow" : "oakSnow";
    if (progress < 0.82) {
      if (r < 0.4) return seg.snow > 0.25 ? "bushSnow" : "bush";
      if (r < 0.65) return seg.snow > 0.25 ? "rockSnow" : "rock";
      if (r < 0.75 && seg.snow < 0.15) return "almond";
      return seg.snow > 0.3 ? "oakSnow" : "oak";
    }
    if (r < 0.12 && progress < 0.9) return "almond";
    return r < 0.35 ? "olive" : r < 0.6 ? "bush" : r < 0.75 ? "rock" : progress > 0.93 ? "palm" : "olive";
  }

  for (let n = 20; n < waterIndex - 5; n++) {
    const seg = segments[n];
    if (seg.bridge || seg.tunnel) continue; // (nothing grows on a bridge or in a tunnel)
    const progress = trackProgress(seg.p1.world.z);
    // Snow poles along the edges (not on the beach).
    if (n % 12 === 0 && seg.sand === 0) { add(n, "pole", -(seg.width + 0.08)); add(n, "pole", seg.width + 0.08); }
    if (seg.zone === "woods") {
      // The deep woods: tall snowy trees crowd in on both sides, all the way.
      if (n % 2 === 0) {
        for (const side of [-1, 1]) {
          if (random() < 0.12) continue;
          const r = random();
          add(n, r < 0.8 ? "pineSnow" : r < 0.9 ? "oakSnow" : r < 0.95 ? "rockSnow" : "bushSnow", side * (seg.width + 0.4 + random() * (RACE.shoulder - 0.55)));
        }
      }
    } else if (n % 3 === 0) {
      // A bush, rock or tree every few segments, on one side or the other (lots of open ground too).
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
  // past, never on a calm piece, where the path splits, or in a sharp or tilted bend).
  // In the very wide places, sometimes two. (Fewer in the woods: the bends there are hard enough.)
  const quiet = (n) => { for (let k = n - 45; k <= n + 45; k++) if (segments[k].calm) return false; return true; };
  for (let n = 220; n < beachStart - 210; n += 30 + Math.floor(random() * 50)) {
    const seg = segments[n];
    if (random() > RACE.treesOnPath * (seg.zone === "woods" ? 0.5 : 1) || seg.width < 0.9 || !quiet(n) || seg.fork || Math.abs(seg.curve) > 3 || seg.bank) continue;
    const progress = trackProgress(seg.p1.world.z);
    const type = seg.zone === "woods" ? (random() < 0.6 ? "pineSnow" : "rockSnow")
      : seg.snow > 0.6 ? (random() < 0.6 ? "oakSnow" : "rockSnow")
      : progress < 0.82 ? (random() < 0.5 ? "oak" : random() < 0.5 ? "almond" : "rock")
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
    if (seg.width < 2.4 || seg.fork || !quiet(n) || random() > RACE.fieldTrees) continue;
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
      if (tip) { add(n, snowy ? "rockSnow" : "rock", seg.islandAt); tip = false; continue; }
      if (n % 6 === 0) { add(n, "pole", seg.islandAt - (seg.island + 0.06)); add(n, "pole", seg.islandAt + seg.island + 0.06); }
      if (n % 4 === 0 && seg.island > 0.7) { // (well inside the island, so nothing solid pokes out into the path)
        const r = random();
        const tree = fork.kind === "woods" ? "pineSnow" : snowy ? "oakSnow" : "oak";
        const type = r < (fork.kind === "woods" ? 0.7 : 0.4) ? tree : r < 0.8 ? (snowy ? "rockSnow" : "rock") : snowy ? "bushSnow" : "bush";
        add(n, type, seg.islandAt + (random() * 2 - 1) * (seg.island - 0.55));
      }
    }
    // The shortcut down the mountain face: rocks and trees standing in it, first on one side
    // and then on the other, so you have to weave between them.
    if (fork.kind === "face") {
      let k = 0;
      for (let n = fork.from + 45; n < fork.to - 5; n += 15, k++) {
        const seg = segments[n];
        if (seg.island < 0.5) continue;
        const inner = seg.islandAt + fork.fastSide * seg.island, outer = fork.fastSide * seg.width; // the shortcut's two edges
        const middle = (inner + outer) / 2, half = Math.abs(outer - inner) / 2;
        const snowy = seg.snow > 0.3;
        add(n, k % 3 === 1 ? (snowy ? "oakSnow" : "oak") : snowy ? "rockSnow" : "rock", middle + (k % 2 ? 1 : -1) * half * 0.45);
      }
    }
  }

  // ----- Snow jumps -----
  // A ramp is a wedge of packed snow: ride up it and you fly. Small ramps cover part of the
  // path (so you can choose to take them or not); some go right across. On wide stretches
  // there are a few side by side. Never in a sharp bend, a narrow place or on a calm piece.
  function addRamp(index, length, offset, half, height, kind) {
    const ramp = { index, length, z0: index * L, z1: (index + length) * L, offset, half, height, kind };
    TRACK.ramps.push(ramp);
    for (let k = index; k < index + length; k++) (segments[k].ramps = segments[k].ramps || []).push(ramp);
  }
  const noJumpsNear = (n, len) => { for (let k = n - 60; k <= n + len + 140; k++) if (segments[k].calm) return true; return false; };
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
  const goodJump = (n, len = RACE.rampLength, height = RACE.rampHeight, longest = 1.8) => {
    const normal = tryJump(n, len, height, RACE.maxSpeed);
    const boosted = tryJump(n, len, height, RACE.maxSpeed * RACE.boostSpeed); // (arriving with a boost)
    return normal.time >= 0.8 && normal.time <= longest && boosted.time <= longest + 0.3 && normal.peak <= height + 1050 && boosted.peak <= height + 1450;
  };
  for (let n = startIndex + 110; n < beachStart - 260; n += 15) { // (a spot that is no good: try a little further on)
    const len = RACE.rampLength;
    if (noJumpsNear(n, len) || segments[n - 5].fork || segments[n + len + 45].fork || !goodJump(n)) continue;
    let bend = 0, widthHere = Infinity, widthAfter = Infinity, tilted = false;
    for (let k = n; k < n + len + 55; k++) {
      bend = Math.max(bend, Math.abs(segments[k].curve));
      if (k < n + len) widthHere = Math.min(widthHere, segments[k].width);
      widthAfter = Math.min(widthAfter, segments[k].width);
      if (segments[k].bank) tilted = true;
    }
    if (bend > 4 || widthAfter < 0.85 || tilted) continue;
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
  // Where the path splits…
  for (const fork of TRACK.forks) {
    if (fork.kind === "woods") {
      // …in the woods: a small jump on one way round.
      let n = fork.from + 40;
      while (n < fork.from + 60 && !goodJump(n)) n += 4; // (nudged along a little if the ground there is wrong for a jump)
      const seg = segments[n];
      const room = (seg.width - seg.island) / 2; // half the width of one way round
      if (room > 0.45 && goodJump(n)) addRamp(n, RACE.rampLength, fork.jumpSide * (seg.island + room), room - 0.08, RACE.rampHeight, "snow");
    } else if (fork.kind === "hill") {
      // …in the hills: one way goes up the side of a hill, a long slope of snow, and off the top. A BIG jump.
      const len = RACE.hillRampLength;
      let n = fork.from + 45;
      while (n < fork.from + 75 && !goodJump(n, len, RACE.hillRampHeight, 2.4)) n += 5;
      const seg = segments[n];
      const room = (seg.width - seg.island) / 2;
      if (room > 0.45) addRamp(n, len, fork.jumpSide * (seg.island + room), room - 0.08, RACE.hillRampHeight, "hill");
    }
  }
  // The big wooden ramp at the very end, into the Kinneret.
  addRamp(waterIndex - RACE.lakeRampLength, RACE.lakeRampLength, 0, RACE.startWidth + 0.15, RACE.lakeRampHeight, "pier");

  // Nothing solid on a ramp or where a jump lands.
  for (const ramp of TRACK.ramps) {
    for (let k = ramp.index - 8; k <= Math.min(N - 1, ramp.index + ramp.length + (ramp.kind === "hill" ? 110 : 75)); k++) {
      segments[k].sprites = segments[k].sprites.filter((s) => !SPRITE_SIZES[s.type].solid || Math.abs(s.offset - ramp.offset) > ramp.half + 0.55);
    }
  }

  // Keep the gates clear, so their poles are easy to see (and nothing stands in a lane just before or after one).
  for (const gate of TRACK.gates) {
    for (let k = gate.index - 4; k <= gate.index + 4; k++) segments[k].sprites = segments[k].sprites.filter((s) => Math.abs(s.offset) > RACE.gateWidth + 0.6);
  }
  const finish = segments[finishIndex];
  finish.sprites = finish.sprites.filter((s) => Math.abs(s.offset) > RACE.startWidth + 0.6);

  // ----- Mountain goats -----
  // Every so often a goat lives on the path, wandering from side to side (see goatSpot below).
  // Never on a calm piece, where the path splits, on a jump or in a sharp bend.
  // (Walking down the path: once the last goat is far enough behind, the next good spot gets one.)
  let nextGoat = startIndex + 150;
  for (let n = startIndex + 150; n < beachStart - 150; n++) {
    if (n < nextGoat) continue;
    let fine = true;
    for (let k = n - 18; k <= n + 18; k++) {
      const s = segments[k];
      if (s.calm || s.fork || s.ramps || Math.abs(s.curve) > 9 || s.bank) { fine = false; break; }
    }
    if (!fine) continue;
    nextGoat = n + 150 + Math.floor(random() * 130);
    TRACK.goats.push({ id: TRACK.goats.length, z: n * L, range: Math.max(0.3, segments[n].width - 0.3), speed: 0.35 + random() * 0.3, phase: random() * 6.28 });
  }
})();

// ---------- Mountain goats ----------
// A goat walks slowly from one side of the path to the other and back, and a little way up
// and down it. Where it is depends only on the clock, so every phone (and the referee)
// works out the same spot without sending any messages.
// Fills in and returns `out`: { x (sideways, in road widths), z (distance along the path), facing (-1 = walking left, 1 = right) }.
function goatSpot(goat, time, out) {
  const a = time * goat.speed + goat.phase;
  out.x = goat.range * Math.sin(a);
  out.z = goat.z + 500 * Math.sin(a * 0.6 + goat.phase);
  out.facing = Math.cos(a) >= 0 ? 1 : -1;
  return out;
}

// Is a sled bumping into this goat right now? (The goat is about as wide as a sled.)
const GOAT_SPOT = { x: 0, z: 0, facing: 1 };
function sledHitsGoat(sled, goat, time) {
  if ((sled.air || 0) > RACE.goatTall) return false; // (flying right over it)
  goatSpot(goat, time, GOAT_SPOT);
  return Math.abs(sled.x - GOAT_SPOT.x) < (SLED_WIDTH / 2 + RACE.goatWide / 2) / RACE.roadWidth
    && GOAT_SPOT.z > sled.y - RACE.goatWide / 2 && GOAT_SPOT.z < sled.y + RACE.sledLength + RACE.goatWide / 2;
}

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
  return Math.abs(x) > seg.width || Math.abs(x - seg.islandAt) < seg.island - 0.05;
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
