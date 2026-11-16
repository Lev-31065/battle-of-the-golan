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
//   bridge  true = this piece is on a bridge (walls on both sides); under = it runs under a bridge
//   ramps  the snow jumps on this piece (most pieces have none)
//
// THE RIDE, from top to bottom (it is written out piece by piece further down):
//   1. the snowfield on top, then a fairly straight downhill
//   2. a very sharp bend (skid!) into deep woods: a path between GIANT trees, with one sharp bend
//      after another, places where the path splits, and a secret shortcut behind the trees
//   3. out of the woods over a BRIDGE, round in a big loop, and through the TUNNEL under that bridge
//   4. the side of a steep mountain: a big wide curve (or the bumpy shortcut down the face), then two hairpins
//   5. a second loop (bridge + tunnel), tilted like a bowl
//   6. hills, with the path weaving between them (jumps off some of the hills, hairpins, a secret shortcut)
//   7. a third loop (bridge + tunnel)
//   8. the last stretch down to the beach (one more secret shortcut), and the big ramp into the Kinneret
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
  forks: [],  // places where the path splits in two around an island: { from, to (segments), kind ("woods", "hill", "face" or "secret"), jumpSide (-1 / 1: the side with the jumps, 0 = none), fastSide (-1 / 1: the shortcut side, where sleds go faster; 0 = none), fastSpeed (how much faster), secretSide (-1 / 1: the side a SECRET shortcut is hidden on; 0 = not a secret one) }
  goats: [],  // mountain goats wandering about on the path: { id, z (where it lives), range (how far it walks to each side), speed, phase }
  layout: null,   // where every piece of the path is on the map: { x, z, heading } (lists; in 3D units: one track unit = 0.01)
  crossings: [],  // the places where the path crosses over itself (one for each loop): { upper, lower (the two segments, one above the other), bridge: [from, to], tunnel: [from, to] (the pieces that run under the bridge), drop (how far below the bridge the path under it is) }. A segment on a bridge has `crossing` = its one
  waterZ: 0,  // where the Kinneret starts
  zigzags: [], // the zigzags down the mountainside: { legs: [{ from, to (segments), side (which side the next leg is on: -1 / 1), gap (the segment where there is a gap in the rocks along its bank) }] }
  trails: [],  // the secret trails: narrow ways off the path, across the mountainside: { kind, half (half its width), x + z (its points on the map, one every `step`), count, length, hills, … }
  grid: null,  // the map cut into squares, each with the path points in it (to find the path near a spot quickly)
  solids: null, // the same, with every solid thing (tree, rock, bush…) in each square: { x, z, r (how wide), tall, soft, rock, seg, offset }
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
  pineSnow: { w: 1000, h: 2200, solid: true, hit: 220 }, // a BABY tree of the deep woods: these stand ON the path, to dodge
  giantPine: { w: 2800, h: 7500, solid: true, hit: 460 }, // a GIANT tree of the deep woods: they tower over the path on both sides (as tall as a 10-floor building)
  thicket:     { w: 1700, h: 1100, solid: false },        // big bushes that hide the ends of a secret shortcut (you ride right through them)
  thicketSnow: { w: 1700, h: 1100, solid: false },
  olive:    { w: 1300, h: 1100, solid: true, hit: 300 },
  almond:   { w: 1300, h: 1300, solid: true, hit: 200 }, // an almond tree in blossom (they flower in winter, around Tu BiShvat)
  palm:     { w: 1000, h: 2300, solid: true, hit: 180 },
  rock:     { w: 700,  h: 400,  solid: true, hit: 620, rock: true }, // rock = it slows a sled much more than a tree does (RACE.rockHitSpeed)
  rockSnow: { w: 700,  h: 430,  solid: true, hit: 620, rock: true },
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
      if (zone === "hills" && !(more && more.zig)) { seg.wallR = way > 0 ? 0.9 : -0.35; seg.wallL = way > 0 ? -0.35 : 0.9; }
      if (more && more.banked) seg.bank = way * s;
    }
  }

  // An answer gate: a straight, wide, gently sloping stretch, with the gate in the middle.
  // (zone = how long that stretch is. Several gates in a row on one long straight use RACE.gateZoneShort.)
  function gate(zone = RACE.gateZone) {
    const before = width;
    width = RACE.gateWidth;
    const index = segments.length + Math.floor(zone / 2);
    straight(zone, 0.04, { calm: true });
    TRACK.gates.push({ number: TRACK.gates.length, index, z: index * L, center: 0, half: RACE.gateWidth });
    width = before;
  }

  // A place where the path SPLITS in two around an island, and joins up again further down.
  // kind: "woods" (two ways through the trees, one with small jumps), "hill" (one way goes up
  // a hill and jumps off it), "face" (a wide easy way, or the bumpy shortcut down the mountain face)
  // or "secret" (a narrow, fast way hidden behind a row of trees along one edge of the path, with
  // rocks in it to skid round. For "face" and "secret", the side given is the shortcut's side).
  // `build` lays down the pieces of path the split runs along.
  function fork(kind, jumpSide, build) {
    const before = width;
    const shortcut = kind === "face" || kind === "secret";
    width = kind === "face" ? RACE.faceWidth : kind === "secret" ? RACE.secretWidth : RACE.forkWidth;
    const f = {
      from: segments.length, to: 0, kind, jumpSide: shortcut ? 0 : jumpSide, fastSide: shortcut ? jumpSide : 0,
      fastSpeed: kind === "secret" ? RACE.secretSpeed : RACE.faceSpeed, secretSide: kind === "secret" ? jumpSide : 0,
    };
    build();
    f.to = segments.length;
    TRACK.forks.push(f);
    width = before;
  }

  // ===================== THE RIDE =====================
  // (To change the path, change the pieces here. Every piece is: how far or how many degrees,
  // how sharp, how steep. Then check the map: the test page draws it.)

  // A LOOP: over a stone bridge, round three quarters of a circle (way = 1 to the right, -1 to
  // the left), and back UNDER that same bridge. (It turns exactly 270 degrees, so the path
  // comes back and crosses under itself.) `banked` = the loop is tilted like a bowl.
  const loops = [];
  function loop(way, sharp, banked) {
    const widthBefore = width, zoneBefore = zone;
    zone = "bridge";
    width = RACE.pathWidth;
    const c = { upperFrom: segments.length, upperTo: 0, lowerFrom: 0, lowerTo: 0 };
    straight(60, 0.02, { calm: true });       // …the bridge is on this stretch
    c.upperTo = segments.length;
    width = 1.25;
    turn(way * 270, sharp, 0.065, { calm: true, banked }); // (nearly level, so the bridge is not far overhead when you come back under it)
    width = RACE.pathWidth;
    c.lowerFrom = segments.length;
    straight(60, 0.08, { calm: true });       // …and this one runs under it
    c.lowerTo = segments.length;
    loops.push(c);
    width = widthBefore;
    zone = zoneBefore;
  }

  // A ZIGZAG down the mountainside: straight stretches ("legs") joined by hairpins that turn
  // nearly right round (so tight that only a skid gets round them). Each leg runs back below the
  // one before it, like a Z. A row of rocks stands along the bank between two legs, with one
  // GAP in it somewhere: a secret way to drop straight down to the next leg.
  // legs = how many stretches; way = which way the first hairpin turns (1 right, -1 left).
  function zigzag(legs, way, legLength, sharp, steep) {
    const widthBefore = width;
    width = RACE.zigWidth;
    const z = { legs: [] };
    for (let k = 0; k < legs; k++) {
      const from = segments.length;
      straight(legLength, steep, { zig: true });
      z.legs.push({ from, to: segments.length, side: way, gap: 0 }); // (side = where the next leg is: its downhill bank)
      if (k < legs - 1) { turn(way * 160, sharp, steep * 0.8, { zig: true }); way = -way; } // (not quite right round: the legs open out like a Z)
    }
    TRACK.zigzags.push(z);
    width = widthBefore;
  }

  // (Places the secret trails start and end: filled in as the ride is laid down.)
  const mark = {};

  // ----- 1. The top of the mountain: a big snowfield, the first gate, then winding down toward the woods -----
  straight(90, 0, { calm: true }); // the start, on top of the mountain
  TRACK.startZ = 40 * L;
  turn(12, 1.2, 0.12);
  width = RACE.wideWidth;
  turn(-20, 1.5, 0.14);
  width = RACE.pathWidth + 0.15;
  gate();                                   // gate 1
  // (Along here a hidden trail leaves the path on the left and goes over the hills beside it.)
  const hillSide = { wallL: 0.12 };
  mark.hillFrom = segments.length + 12;
  turn(35, 5, 0.18, hillSide);
  turn(-50, 6, 0.2, hillSide);
  turn(40, 6, 0.2, hillSide);
  turn(-25, 4, 0.18, hillSide);
  mark.hillTo = segments.length - 6;
  straight(25, 0.2);

  // ----- 2. The deep woods: a path between giant trees, hairpins and a zigzag (skid!) -----
  zone = "woods";
  width = 1.15;
  mark.woods1 = [segments.length, 0];
  turn(100, 22, 0.1);                       // (a hidden trail cuts across the inside of this hairpin, through the trees)
  mark.woods1[1] = segments.length;
  turn(-60, 9, 0.12);
  turn(70, 10, 0.12);
  zigzag(3, -1, 45, 24, 0.12);
  turn(-40, 6, 0.12);
  gate();                                   // gate 2, in a clearing in the woods
  turn(-90, 22, 0.1);
  straight(25, 0.12);
  fork("woods", 1, () => { straight(20, 0.14); turn(40, 3, 0.15); straight(25, 0.14); });
  gate();                                   // a gate on the straight through the woods
  mark.woods2 = [segments.length, 0];
  turn(110, 23, 0.1);                       // (and another one here)
  mark.woods2[1] = segments.length;
  turn(-70, 10, 0.12);
  turn(60, 9, 0.12);
  gate();                                   // gate 3
  width = 1.0;
  straight(15, 0.1);

  // ----- 3. Out of the woods: the first loop (over the bridge, round to the right, back under it) -----
  snow = 0.85;
  loop(1, 12);

  // ----- 4. The side of a steep mountain: the big curve or its shortcut, then THE zigzag all the way down the face -----
  zone = "face";
  snow = 0.6;
  width = RACE.wideWidth;
  const cliff = { wallL: -1, wallR: 1 };     // the wall on the right, the drop on the left
  straight(20, 0.1, cliff);
  gate();                                   // gate 4
  // The big curve (wide and easy), or the shortcut down the face on its inside (narrow, full
  // of rocks and trees, but faster).
  fork("face", -1, () => { straight(15, 0.16, cliff); turn(-70, 3.2, 0.18, cliff); straight(15, 0.16, cliff); });
  straight(25, 0.15, cliff);
  zigzag(5, -1, 55, 24, 0.13);
  straight(15, 0.12);
  gate();                                   // gate 5

  // ----- 5. The second loop: to the left, and tilted like a bowl (zoom!) -----
  snow = 0.45;
  loop(-1, 12, true);
  gate();                                   // a gate on the straight out of the loop

  // ----- 6. The hills: the path weaves between them; a jump off a hill, a corner with a secret cut, another zigzag -----
  zone = "hills";
  snow = 0.3;
  width = 1.1;
  turn(-80, 7, 0.12);
  turn(70, 8, 0.12);
  fork("hill", 1, () => { straight(30, 0.13); turn(30, 2.5, 0.14); straight(60, 0.13); });
  turn(60, 6.5, 0.14, { banked: true });    // a tilted bend: zoom!
  mark.corner = [segments.length, 0];
  turn(-110, 22, 0.12);                     // a very sharp corner (a hidden trail cuts across the inside of it)
  mark.corner[1] = segments.length;
  snow = 0.2;
  gate();                                   // gate 6
  zigzag(3, 1, 50, 24, 0.12);
  turn(-60, 7, 0.12);
  turn(80, 7.5, 0.14, { banked: true });    // another tilted bend
  snow = 0.1;
  gate();                                   // gate 7

  // ----- 7. The third loop -----
  snow = 0;
  loop(1, 12);

  // ----- 8. The last stretch down to the Kinneret: one more zigzag -----
  zone = "valley";
  width = RACE.pathWidth;
  turn(-40, 5, 0.12);
  turn(50, 6, 0.1);
  gate();                                   // gate 8
  zigzag(3, -1, 45, 24, 0.1);
  turn(40, 5, 0.08);
  gate();
  turn(-15, 2.5, 0.05);
  // The long straight down to the lake: three gates in a row.
  gate(RACE.gateZoneShort);
  gate(RACE.gateZoneShort);
  gate(RACE.gateZoneShort);                 // the last gate (14 in all)
  straight(20, 0.015, { calm: true });      // flattening out by the lake
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
      // (A secret way opens and closes much more slowly, so there is time to slip in behind the trees.)
      const slowEnds = smooth(Math.min((n - (fork.from - 10)) / 75, (fork.to + 30 - n) / 40));
      if (fork.kind === "face") {
        seg.island = Math.max(0, Math.min(RACE.faceIsland, seg.width - 2.3)) * ends;
        seg.islandAt = fork.fastSide * (RACE.faceIsland + 0.5 * Math.sin((n - fork.from) * 0.1)) * ends * (seg.island > 0 ? 1 : 0);
      } else if (fork.kind === "secret") {
        // A secret shortcut: the "island" is a thin row of trees near one edge of the path, and
        // the narrow way hidden behind it (between the trees and the edge) is the shortcut.
        seg.island = Math.max(0, Math.min(RACE.secretIsland, seg.width - RACE.secretAt - RACE.secretIsland)) * slowEnds;
        seg.islandAt = seg.island > 0 ? fork.secretSide * RACE.secretAt : 0;
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

  // ----- The bridges and the tunnels (one of each for every loop) -----
  for (const loop of loops) {
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
    const bridge = [Math.max(loop.upperFrom + 2, upper - 18), Math.min(loop.upperTo - 3, upper + 18)];
    const tunnel = [Math.max(loop.lowerFrom + 2, lower - 19), Math.min(loop.lowerTo - 3, lower + 19)];
    const crossing = { upper, lower, gap, bridge, tunnel, drop: segments[upper].p1.world.y - segments[lower].p1.world.y };
    TRACK.crossings.push(crossing);
    for (let n = bridge[0]; n <= bridge[1]; n++) { segments[n].bridge = true; segments[n].walled = true; segments[n].crossing = crossing; }
    for (let n = tunnel[0]; n <= tunnel[1]; n++) segments[n].under = true; // (this piece runs UNDER the bridge, out in the open)
  }

  // ----- How much room there is beside the path -----
  // Normally a strip of ground runs along both sides of the path. But where another stretch
  // of path passes close by (the next leg of a zigzag, the inside of a hairpin), each can only
  // have the ground up to half way between them. seg.roomL / roomR = how wide that strip is on
  // the left / right of this piece, in road widths.
  const GRID = 60; // (the map is cut into squares this big, to find nearby path points quickly)
  const cells = new Map();
  for (let n = 0; n < N; n += 2) {
    if (segments[n].bridge) continue; // (the ground under a bridge belongs to the path below it)
    const key = Math.floor(map.x[n] / GRID) + "," + Math.floor(map.z[n] / GRID);
    if (!cells.has(key)) cells.set(key, []);
    cells.get(key).push(n);
  }
  TRACK.grid = { size: GRID, cells };
  const RW = RACE.roadWidth * U; // one road width, in map units
  const sameCrossing = (a, b) => TRACK.crossings.some((c) => a >= c.tunnel[0] - 10 && a <= c.tunnel[1] + 10 && b >= c.bridge[0] - 45 && b <= c.bridge[1] + 45);
  const rawRoom = [new Float32Array(N), new Float32Array(N)]; // (left, right)
  for (let n = 0; n < N; n++) {
    const h = map.heading[n], half = segments[n].width * RW;
    const cx = Math.floor(map.x[n] / GRID), cz = Math.floor(map.z[n] / GRID);
    for (let s = 0; s < 2; s++) {
      const nx = Math.cos(h) * (s ? 1 : -1), nz = Math.sin(h) * (s ? 1 : -1); // straight out from the path on this side
      let reach = Infinity; // how far out the spot is that is just as close to another stretch of path as to this one
      if (!segments[n].bridge) for (let ax = cx - 3; ax <= cx + 3; ax++) for (let az = cz - 3; az <= cz + 3; az++) {
        for (const j of cells.get(ax + "," + az) || []) {
          if (Math.abs(j - n) <= 45 || sameCrossing(n, j) || sameCrossing(j, n)) continue;
          const dx = map.x[j] - map.x[n], dz = map.z[j] - map.z[n], out = dx * nx + dz * nz;
          if (out > 1) reach = Math.min(reach, (dx * dx + dz * dz) / (2 * out));
        }
      }
      rawRoom[s][n] = Math.max(1.5, Math.min(RACE.shoulderWide * RW, reach - half - 1)) / RW;
    }
  }
  for (let s = 0; s < 2; s++) {
    // (Smoothed along the path, so the strip gets narrower and wider gently.)
    const least = new Float32Array(N);
    for (let n = 0; n < N; n++) { let m = Infinity; for (let k = Math.max(0, n - 4); k <= Math.min(N - 1, n + 4); k++) m = Math.min(m, rawRoom[s][k]); least[n] = m; }
    for (let n = 0; n < N; n++) {
      let sum = 0, count = 0;
      for (let k = Math.max(0, n - 5); k <= Math.min(N - 1, n + 5); k++) { sum += least[k]; count++; }
      if (s) segments[n].roomR = sum / count; else segments[n].roomL = sum / count;
    }
  }
  // A spot beside the path for a bush, rock or tree: at least `from` road widths out from the
  // edge, and up to `span` more. Where there is not that much room: null (nothing stands there).
  const beside = (seg, side, from, span) => {
    const pick = random(), room = side < 0 ? seg.roomL : seg.roomR;
    if (room < from + 0.2) return null;
    return side * (seg.width + from + pick * Math.min(span, room - from - 0.15));
  };
  const clearings = []; // spots on the map where nothing solid may stand (the secret gaps in the zigzags): [x, z]
  // Where a spot beside point n of the path is on the map (lat = how far to the right, in map units).
  const spotOnMap = (n, lat) => [map.x[n] + Math.cos(map.heading[n]) * lat, map.z[n] + Math.sin(map.heading[n]) * lat];

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
    if (seg.bridge || seg.under) continue; // (nothing grows on a bridge or under one)
    const progress = trackProgress(seg.p1.world.z);
    // Snow poles along the edges (not on the beach).
    if (n % 12 === 0 && seg.sand === 0) { add(n, "pole", -(seg.width + 0.08)); add(n, "pole", seg.width + 0.08); }
    if (seg.zone === "woods") {
      // The deep woods: GIANT trees tower over the path on both sides, all the way, with a snowy
      // bush or a rock at their feet here and there. (The small "baby" trees only stand ON the path.)
      for (const side of [-1, 1]) {
        if ((n + (side > 0 ? 1 : 0)) % 3 === 0) {
          if (random() > 0.1) { const at = beside(seg, side, 0.5, 0.4); if (at !== null) add(n, "giantPine", at); }
        } else if (random() < 0.08) {
          const type = random() < 0.6 ? "bushSnow" : "rockSnow", at = beside(seg, side, 0.4, 0.4);
          if (at !== null) add(n, type, at);
        }
      }
    } else if (n % 3 === 0) {
      // A bush, rock or tree every few segments, on one side or the other (lots of open ground too).
      for (const side of [-1, 1]) {
        if (random() < 0.45) continue;
        // (Far enough from the edge that nothing solid pokes into the path: staying on the path is always safe from these.)
        const type = pickType(seg, progress), at = beside(seg, side, 0.45, 0.35);
        if (at !== null) add(n, type, at);
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
  // In the very wide places, sometimes two. (In the woods these are the small "baby" trees.)
  const quiet = (n) => { for (let k = n - 45; k <= n + 45; k++) if (segments[k].calm) return false; return true; };
  for (let n = 220; n < beachStart - 210; n += 30 + Math.floor(random() * 50)) {
    const seg = segments[n];
    if (random() > RACE.treesOnPath || seg.width < 0.9 || !quiet(n) || seg.fork || seg.zig || Math.abs(seg.curve) > 3 || seg.bank) continue;
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

  // ----- The secret shortcuts -----
  // A row of trees hides the narrow way behind it, and big bushes hide its two ends (you ride
  // right through those). There are no marker poles on that side. Inside, rocks stand first
  // on one side and then on the other, close together: you have to skid round them.
  function hideSecretWay(fork) {
    const side = fork.secretSide;
    const full = []; // the segments where the secret way is as wide as it gets
    let first = -1, last = -1;
    for (let n = fork.from - 10; n <= fork.to + 30; n++) {
      if (segments[n].island >= 0.12) { if (first < 0) first = n; last = n; }
      if (segments[n].island >= RACE.secretIsland - 0.03) full.push(n);
    }
    if (first < 0) return;
    for (let n = fork.from - 30; n <= fork.to + 45; n++) {
      const seg = segments[n];
      seg.sprites = seg.sprites.filter((s) => !(s.type === "pole" && s.offset * side > 0));
      if (seg.island < 0.12) continue;
      const snowy = seg.snow > 0.3;
      if (n % 2 === 0) {
        // The row of trees. (Where the row is still thin, at its two ends: big bushes.)
        const tree = seg.zone === "woods" ? "giantPine" : snowy ? "oakSnow" : seg.snow < 0.05 ? "olive" : "oak";
        const type = seg.island > 0.32 ? tree : snowy ? "thicketSnow" : "thicket"; // (you can ride through these bushes: that is the way in, and the way out)
        add(n, type, seg.islandAt + (random() * 2 - 1) * Math.max(0, seg.island - 0.3));
      }
      if (n % 6 === 0) add(n, "pole", seg.islandAt - side * (seg.island + 0.06)); // (poles on the main path's side only)
    }
    // The bushes that hide the way in and the way out.
    for (const n of [first - 3, first + 3, last - 3, last + 3]) {
      const seg = segments[n];
      for (let x = RACE.secretAt + 0.1; x < seg.width + 0.2; x += 0.42) add(n, seg.snow > 0.3 ? "thicketSnow" : "thicket", side * x);
    }
    // The rocks inside: one near the trees, the next near the outer edge, and so on.
    let k = 0;
    for (let i = 16; i < full.length - 22; i += RACE.secretRocks, k++) {
      const seg = segments[full[i]];
      const inner = seg.islandAt + side * seg.island, outer = side * seg.width; // the secret way's two edges
      add(full[i], seg.snow > 0.3 ? "rockSnow" : "rock", k % 2 ? inner + side * 0.2 : outer - side * 0.2);
    }
  }

  // ----- The islands where the path splits -----
  // A big rock at the island's tip, poles along its edges, and rocks, trees and bushes down the middle.
  for (const fork of TRACK.forks) {
    if (fork.kind === "secret") { hideSecretWay(fork); continue; }
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
  const noJumpsNear = (n, len) => { for (let k = n - 30; k <= n + len + 90; k++) if (segments[k].calm || segments[k].zig) return true; return false; };
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
    for (let k = n; k < n + len + 38; k++) {
      bend = Math.max(bend, Math.abs(segments[k].curve));
      if (k < n + len) widthHere = Math.min(widthHere, segments[k].width);
      widthAfter = Math.min(widthAfter, segments[k].width);
      if (segments[k].bank) tilted = true;
    }
    if (bend > 6 || widthAfter < 0.85 || tilted) continue;
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

  // ----- The zigzags: rocks along the bank between two legs, with a secret gap -----
  // A row of rocks stands on the bank between each leg and the next one below it, like a wall:
  // you can not just slide straight down. But somewhere in every row there is a GAP: drop
  // through it and you land on the next leg, skipping the hairpin.
  for (const zig of TRACK.zigzags) {
    zig.legs.forEach((leg, k) => {
      if (k === zig.legs.length - 1) return;
      leg.gap = leg.from + Math.round((leg.to - leg.from) * (0.45 + random() * 0.35)); // (in the half of the leg nearer the hairpin, so it saves a few seconds, not the whole zigzag)
      // (Nothing else stands in the gap either, all the way down the bank to the next leg.)
      for (let n = leg.gap - Math.floor(RACE.zigGap / 2); n <= leg.gap + Math.floor(RACE.zigGap / 2); n += 3) {
        for (let out = 0; out <= 70; out += 7) clearings.push(spotOnMap(n, leg.side * (segments[n].width * RW + out)));
      }
      for (let n = leg.from + 1; n < leg.to + 4; n += 3) {
        if (Math.abs(n - leg.gap) <= RACE.zigGap / 2) continue;
        const seg = segments[n], room = leg.side > 0 ? seg.roomR : seg.roomL;
        add(n, seg.snow > 0.3 ? "rockSnow" : "rock", leg.side * (seg.width + room - 0.02));
      }
    });
  }

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

  // ----- The secret trails -----
  // A trail is a narrow, winding way across the mountainside, off the path: it leaves the path
  // at one place and comes back to it further down. On a trail a sled is not slowed down by
  // the deep snow. They are hard to spot: no poles, no stripes, just a faint track.
  //   from, to = the segments where it leaves the path and comes back; side = which side (-1 / 1)
  //   via = points it swings out through: [how far along from start to end (0 … 1), how far out to that side (map units)]
  //   wiggle + wave = how far it winds from side to side, and how long one wind is
  //   hills + hillEvery = little hills the trail goes over (how high, and how far apart)
  function addTrail(kind, from, to, side, opts) {
    const A = spotOnMap(from, side * (segments[from].width * RW + 1)), B = spotOnMap(to, side * (segments[to].width * RW + 1));
    const chord = Math.hypot(B[0] - A[0], B[1] - A[1]) || 1;
    const rx = -(B[1] - A[1]) / chord * side, rz = (B[0] - A[0]) / chord * side; // "out to that side" of the straight line from A to B
    const ctrl = [A];
    for (const [f, out] of opts.via || []) ctrl.push([A[0] + (B[0] - A[0]) * f + rx * out, A[1] + (B[1] - A[1]) * f + rz * out]);
    ctrl.push(B);
    // A smooth curve through those points…
    const curve = [];
    for (let i = 0; i < ctrl.length - 1; i++) {
      const p0 = ctrl[Math.max(0, i - 1)], p1 = ctrl[i], p2 = ctrl[i + 1], p3 = ctrl[Math.min(ctrl.length - 1, i + 2)];
      for (let k = 0; k < 24; k++) {
        const t = k / 24, t2 = t * t, t3 = t2 * t;
        curve.push([0, 1].map((d) => 0.5 * (2 * p1[d] + (p2[d] - p0[d]) * t + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t2 + (3 * p1[d] - p0[d] - 3 * p2[d] + p3[d]) * t3)));
      }
    }
    curve.push(B);
    // …walked in even steps, winding from side to side as it goes.
    const step = 2, even = [curve[0]];
    let carry = 0;
    for (let i = 1; i < curve.length; i++) {
      const a = curve[i - 1], b = curve[i], d = Math.hypot(b[0] - a[0], b[1] - a[1]);
      for (let s = step - carry; s <= d; s += step) even.push([a[0] + (b[0] - a[0]) * s / d, a[1] + (b[1] - a[1]) * s / d]);
      carry = (carry + d) % step;
    }
    const count = even.length, length = (count - 1) * step;
    const trail = { kind, from, to, side, half: opts.half || 6.5, step, count, length, x: new Float32Array(count), z: new Float32Array(count), hills: opts.hills || 0, hillEvery: opts.hillEvery || 80, speed: opts.speed || 1 };
    for (let i = 0; i < count; i++) {
      const a = even[Math.max(0, i - 1)], b = even[Math.min(count - 1, i + 1)], d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const s = i * step, ends = smooth(Math.min(s, length - s) / 24);
      const off = (opts.wiggle || 0) * Math.sin(s / (opts.wave || 80) * Math.PI * 2) * ends;
      trail.x[i] = even[i][0] - (b[1] - a[1]) / d * off;
      trail.z[i] = even[i][1] + (b[0] - a[0]) / d * off;
    }
    trail.minX = Math.min(...trail.x); trail.maxX = Math.max(...trail.x); trail.minZ = Math.min(...trail.z); trail.maxZ = Math.max(...trail.z);
    TRACK.trails.push(trail);
  }
  // 1. Over the hills beside the path, a little after the start (it leaves on the left, just after the first gate).
  addTrail("hills", mark.hillFrom, mark.hillTo, -1, { via: [[0.18, 42], [0.5, 60], [0.82, 42]], wiggle: 6, wave: 90, hills: 7, hillEvery: 70, speed: 1.35 });
  // 2 + 3. Through the giant trees, across the inside of two hairpins in the woods.
  addTrail("woods", mark.woods1[0] - 16, mark.woods1[1] + 16, 1, { wiggle: 6.5, wave: 42, speed: 0.9 });
  addTrail("woods", mark.woods2[0] - 16, mark.woods2[1] + 16, 1, { wiggle: 6.5, wave: 42, speed: 0.9 });
  // 4. Across the inside of the very sharp corner in the hills.
  addTrail("corner", mark.corner[0] - 16, mark.corner[1] + 16, -1, { wiggle: 6, wave: 42, speed: 0.9 });

  // Nothing solid stands on a trail (or right where it leaves the path).
  // (Wider at its two ends: the way in and the way out are clear openings.)
  const onATrail = (x, z, pad) => TRACK.trails.some((t) => {
    if (x < t.minX - 12 || x > t.maxX + 12 || z < t.minZ - 12 || z > t.maxZ + 12) return false;
    for (let i = 0; i < t.count; i++) if (Math.hypot(t.x[i] - x, t.z[i] - z) < t.half + (i < 18 || i > t.count - 19 ? 9 : pad)) return true;
    return false;
  });
  segments.forEach((seg, n) => {
    seg.sprites = seg.sprites.filter((s) => { if (!SPRITE_SIZES[s.type].solid) return true; const p = spotOnMap(n, s.offset * RW); return !onATrail(p[0], p[1], 3.5) && !clearings.some((c) => Math.hypot(c[0] - p[0], c[1] - p[1]) < 7); });
  });

  // ----- Every solid thing, sorted into squares on the map -----
  // (So a sled can ask "what is near me?" wherever it is, even off the path or beside another stretch of it.)
  const SOLID_GRID = 40;
  TRACK.solids = { size: SOLID_GRID, cells: new Map() };
  segments.forEach((seg, n) => {
    for (const s of seg.sprites) {
      const size = SPRITE_SIZES[s.type];
      if (!size.solid) continue;
      const p = spotOnMap(n, s.offset * RW), key = Math.floor(p[0] / SOLID_GRID) + "," + Math.floor(p[1] / SOLID_GRID);
      if (!TRACK.solids.cells.has(key)) TRACK.solids.cells.set(key, []);
      TRACK.solids.cells.get(key).push({ x: p[0], z: p[1], r: size.hit / 2 * U, tall: size.h, soft: Boolean(size.soft), rock: Boolean(size.rock), seg: n, offset: s.offset });
    }
  });
})();

// ---------- Where things are on the map ----------
// A sled on the path is at (y, x): y = how far along the path, x = how far to the side. The
// MAP is the mountain seen from above: every spot is (x, z) in map units (one map unit = 100
// track units; a sled is 6 wide). These two turn one into the other, exactly, in both directions,
// even far off the path.

// (y, x) on the path → the spot on the map. Fills in and returns `out`: { x, z, heading (which way the path points there) }.
function trackToWorld(y, x, out) {
  const map = TRACK.layout, N = TRACK.segments.length;
  const f0 = Math.max(0, Math.min(N - 0.001, y / RACE.segmentLength)), i = Math.floor(f0), f = f0 - i;
  const heading = map.heading[i] + (map.heading[i + 1] - map.heading[i]) * f, lat = x * RACE.roadWidth * 0.01;
  out.x = map.x[i] + (map.x[i + 1] - map.x[i]) * f + Math.cos(heading) * lat;
  out.z = map.z[i] + (map.z[i + 1] - map.z[i]) * f + Math.sin(heading) * lat;
  out.heading = heading;
  return out;
}

// A spot on the map → (y, x) on the stretch of path nearest to it. Fills in and returns `out`:
// { y, x, index (the segment), heading (of the path there), far (how far from the middle of the path, in map units) }.
// hint = the segment it was on a moment ago (so it does not flicker between two stretches that are equally near).
function worldToTrack(wx, wz, out, hint) {
  const map = TRACK.layout, grid = TRACK.grid, N = TRACK.segments.length;
  const cx = Math.floor(wx / grid.size), cz = Math.floor(wz / grid.size);
  let best = -1, bestD = Infinity;
  for (let ring = 1; ring <= 7; ring++) {
    for (let ax = cx - ring; ax <= cx + ring; ax++) for (let az = cz - ring; az <= cz + ring; az++) {
      if (ring > 1 && Math.abs(ax - cx) < ring && Math.abs(az - cz) < ring) continue; // (looked there already)
      for (const j of grid.cells.get(ax + "," + az) || []) {
        const d = (map.x[j] - wx) * (map.x[j] - wx) + (map.z[j] - wz) * (map.z[j] - wz);
        if (d < bestD) { bestD = d; best = j; }
      }
    }
    if (best >= 0 && bestD <= ring * grid.size * ring * grid.size) break;
  }
  if (hint !== undefined && hint >= 0 && best >= 0 && Math.abs(best - hint) > 30) {
    // Another stretch of path is nearer now. Only switch to it if it is clearly nearer.
    let near = -1, nearD = Infinity;
    for (let j = Math.max(0, hint - 10); j <= Math.min(N - 1, hint + 10); j++) {
      const d = (map.x[j] - wx) * (map.x[j] - wx) + (map.z[j] - wz) * (map.z[j] - wz);
      if (d < nearD) { nearD = d; near = j; }
    }
    if (Math.sqrt(nearD) < Math.sqrt(bestD) + 2.5) best = near;
  }
  if (best < 0) best = Math.max(0, Math.min(N - 1, hint || 0));
  // The exact spot: where a line straight out from the path passes through (wx, wz).
  const ahead = (n, f) => {
    const h = map.heading[n] + (map.heading[n + 1] - map.heading[n]) * f;
    return (wx - map.x[n] - (map.x[n + 1] - map.x[n]) * f) * Math.sin(h) - (wz - map.z[n] - (map.z[n + 1] - map.z[n]) * f) * Math.cos(h);
  };
  let j = Math.min(N - 1, best), guard = 0;
  while (j > 0 && ahead(j, 0) < 0 && guard++ < 8) j--;
  while (j < N - 1 && ahead(j, 1) >= 0 && guard++ < 16) j++;
  let lo = 0, hi = 1;
  for (let k = 0; k < 14; k++) { const mid = (lo + hi) / 2; if (ahead(j, mid) >= 0) lo = mid; else hi = mid; }
  const f = (lo + hi) / 2, h = map.heading[j] + (map.heading[j + 1] - map.heading[j]) * f;
  const lat = (wx - map.x[j] - (map.x[j + 1] - map.x[j]) * f) * Math.cos(h) + (wz - map.z[j] - (map.z[j + 1] - map.z[j]) * f) * Math.sin(h);
  out.index = j;
  out.y = (j + f) * RACE.segmentLength;
  out.x = lat / (RACE.roadWidth * 0.01);
  out.heading = h;
  out.far = Math.abs(lat);
  return out;
}

// Every solid thing near a spot on the map: calls visit(thing) for each ({ x, z, r, tall, soft, rock, seg, offset }).
function solidsNear(wx, wz, visit) {
  const grid = TRACK.solids, cx = Math.floor(wx / grid.size), cz = Math.floor(wz / grid.size);
  for (let ax = cx - 1; ax <= cx + 1; ax++) for (let az = cz - 1; az <= cz + 1; az++) {
    for (const thing of grid.cells.get(ax + "," + az) || []) visit(thing);
  }
}

// The best stretch of path to go back to from a spot on the map: of all the path within `reach`
// of it, the point that is FURTHEST along the race (but not past segment `last`). Returns its
// segment, or -1 if there is no path that close.
function furthestPathNear(wx, wz, reach, last) {
  const map = TRACK.layout, grid = TRACK.grid, ring = Math.ceil(reach / grid.size);
  const cx = Math.floor(wx / grid.size), cz = Math.floor(wz / grid.size);
  let best = -1;
  for (let ax = cx - ring; ax <= cx + ring; ax++) for (let az = cz - ring; az <= cz + ring; az++) {
    for (const j of grid.cells.get(ax + "," + az) || []) {
      if (j > best && j <= last && Math.hypot(map.x[j] - wx, map.z[j] - wz) <= reach) best = j;
    }
  }
  return best;
}

// Is there a secret trail near a spot on the map? No: null. Yes: { trail, d (how far from its
// middle line), s (how far along it) }. pad = how far away still counts as "near".
const TRAIL_AT = { trail: null, d: 0, s: 0 };
function trailAt(wx, wz, pad = 0) {
  let found = null, best = Infinity, at = 0;
  for (const t of TRACK.trails) {
    const reach = t.half + pad;
    if (wx < t.minX - reach || wx > t.maxX + reach || wz < t.minZ - reach || wz > t.maxZ + reach) continue;
    for (let i = 0; i < t.count; i++) {
      const d = (t.x[i] - wx) * (t.x[i] - wx) + (t.z[i] - wz) * (t.z[i] - wz);
      if (d < best) { best = d; found = t; at = i; }
    }
  }
  if (!found || Math.sqrt(best) > found.half + pad) return null;
  TRAIL_AT.trail = found; TRAIL_AT.d = Math.sqrt(best); TRAIL_AT.s = at * found.step;
  return TRAIL_AT;
}

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

// ---------- The slope and the speed ----------
// How much faster (or slower) a sled goes because of the slope under it: 1 on a normal
// slope, more where it is steep, less where it is flat or uphill. slope = how much the ground
// rises for every 1 forward (minus = downhill). (Phones use this for their sled, the referee for the bots.)
function slopeSpeed(slope) {
  const factor = 1 - (slope + RACE.slopeNormal) * RACE.slopeSpeed;
  return Math.max(RACE.slopeLimits[0], Math.min(RACE.slopeLimits[1], factor));
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

// Sleds only bump when one runs into the BACK of another, nearly straight from behind. Side by
// side they overlap and cross over each other freely. Is sled `a` bumping sled `b`?
// No: null. Yes: { side: which way the sled at the back should slide to get clear (-1 left,
// 1 right), behind: true if `a` is the one at the back }.
// (Every phone checks this for its own sled, and the referee for the bots. The callers also
// let a sled straight through when it is boosting, or when the other one is spinning out or
// has just hit something.)
function sledsTouch(a, b) {
  const dx = (a.x - b.x) * RACE.roadWidth, dy = a.y - b.y;
  if (Math.abs(dx) >= SLED_WIDTH * RACE.bumpLine || Math.abs(dy) >= RACE.sledLength) return null;
  if (Math.abs((a.air || 0) - (b.air || 0)) > 250) return null; // (one of them is flying over the other)
  const side = dx > 0 ? 1 : dx < 0 ? -1 : (String(a.id) < String(b.id) ? -1 : 1);
  return { side, behind: dy < 0 };
}

// ---------- The shortcut down the mountain face ----------
// It is a narrow, winding way with rocks and trees standing in it, first on one side and then
// on the other. A sled that drives itself (a bot, or a player in easy mode) asks here where to
// aim: the far side from the next rock or tree, or the middle if the way ahead is clear.
// segment = where the sled is; returns a sideways spot (road widths), or null if this is not
// a shortcut like that.
function shortcutLine(segment) {
  const fork = segment.fork;
  if (!fork || !fork.fastSide || fork.secretSide || segment.island < 0.3) return null;
  const side = fork.fastSide, segments = TRACK.segments;
  const middleOf = (seg) => (seg.islandAt + side * seg.island + side * seg.width) / 2;
  let lean = 0; // which side of the middle the next thing stands on (-1 / 1), 0 = nothing near
  for (let i = segment.index; i <= Math.min(segments.length - 1, segment.index + 14) && !lean; i++) {
    for (const sprite of segments[i].sprites) {
      if (!SPRITE_SIZES[sprite.type].solid || (sprite.offset - segments[i].islandAt) * side <= segments[i].island || Math.abs(sprite.offset) > segments[i].width) continue;
      lean = sprite.offset >= middleOf(segments[i]) ? 1 : -1;
    }
  }
  const ahead = segments[Math.min(segments.length - 1, segment.index + 4)];
  if (ahead.island < 0.3) return null; // (the shortcut is ending)
  const half = Math.abs(side * ahead.width - (ahead.islandAt + side * ahead.island)) / 2;
  return middleOf(ahead) - lean * half * 0.6;
}
