// race-draw.js — draws Mt Hermon Racing: the mountain path, the valley far below with the
// Kinneret, the bushes and trees, the sleds, and the race info on top.
//
// How the "3D" works (a trick old arcade racing games used, called pseudo-3D):
// the path is a row of short flat pieces (race-track.js). For each piece we work out
// where its near end and far end land on the screen ("projecting"): far-away pieces are
// small and high up, close ones are wide and near the bottom. Then we paint the pieces
// from FAR to NEAR (like a painter: the back of the picture first), so near things cover
// far things. Nothing is really 3D, but it looks like it, and it's fast enough for any phone.
//
// The path runs along a ridge: beside it there's a strip of ground ("shoulder"), and past
// that the mountainside drops away, so you look down into the valley (painted behind
// everything, like a giant backdrop).

// The camera: `depth` comes from how wide it sees (the field of view). `playerZ` is how
// far in front of the camera my sled sits.
const raceCamera = { depth: 1 / Math.tan((RACE.fieldOfView / 2) * Math.PI / 180) };
raceCamera.playerZ = RACE.cameraHeight * raceCamera.depth;

const SLED_WIDTH = 600; // a sled's width in track units

const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (t) => Math.max(0, Math.min(1, t));

// ---------- Colors ----------
// Colors are mixed on the fly (snowy → grassy → sandy), so they're kept as [red, green, blue].
function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
}
function mixRgb(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
function rgbText(c) {
  return `rgb(${Math.round(c[0])}, ${Math.round(c[1])}, ${Math.round(c[2])})`;
}
const C = {
  snow: hexToRgb("#f4f8fc"), snowDark: hexToRgb("#e5edf5"),         // snowy ground (light/dark stripes)
  grass: hexToRgb("#9aad62"), grassDark: hexToRgb("#8ea258"),       // green winter grass lower down
  sand: hexToRgb("#eadaa8"), sandDark: hexToRgb("#e1cf98"),         // the beach
  path: hexToRgb("#e9f1f9"), pathDark: hexToRgb("#dce7f2"),         // the packed-snow path
  pathEdge: hexToRgb("#bccddf"),                                      // its edges
  sandPath: hexToRgb("#d9c48b"), sandPathDark: hexToRgb("#d1bb80"),
  slopeSnow: hexToRgb("#cfdbe6"), slopeRock: hexToRgb("#857a66"),   // the mountainside dropping away
  slopeSand: hexToRgb("#c9b47e"),
  water: hexToRgb("#3f8fcf"), waterDark: hexToRgb("#4a99d8"),
  haze: hexToRgb("#dce7ee"),                                          // far-away things fade into this
};

// Where a point on the path lands on the screen. `w` and `h` are the screen size,
// `width` is the path's half width there (in RACE.roadWidth).
function projectPoint(p, cameraX, cameraY, cameraZ, w, h, width) {
  p.camera.x = 0 - cameraX;
  p.camera.y = p.world.y - cameraY;
  p.camera.z = p.world.z - cameraZ;
  p.screen.scale = raceCamera.depth / p.camera.z;
  p.screen.unit = p.screen.scale * RACE.roadWidth * w / 2;   // pixels for one RACE.roadWidth, here
  p.screen.x = Math.round(w / 2 + p.screen.scale * p.camera.x * w / 2);
  p.screen.y = Math.round(h * RACE.horizon - p.screen.scale * p.camera.y * h / 2); // (RACE.horizon = where the horizon sits)
  p.screen.w = p.screen.unit * width;
}

function polygon(ctx, x1, y1, x2, y2, x3, y3, x4, y4, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.lineTo(x4, y4);
  ctx.closePath();
  ctx.fill();
}

// ---------- The backdrop: sky, far hills, and the valley with the Kinneret ----------

// A wavy line. `t` goes 0 → 1 around a full circle, so the line joins up with itself.
function ridge(t, waves) {
  let y = 0;
  for (const [k, amount, shift] of waves) y += amount * Math.sin(2 * Math.PI * (k * t + shift));
  return y;
}
const FAR_HILL_WAVES = [[1, 0.4, 0.15], [2, 0.3, 0.6], [5, 0.15, 0.3], [11, 0.06, 0.8], [23, 0.025, 0.1]];
const FIELD_COLORS = ["#8aa65a", "#97b063", "#a9ad68", "#7f9b50", "#b5a873", "#8fa85c", "#a3b56c", "#9c9a62"].map(hexToRgb);

// A number from 0 to 1 that's always the same for the same inputs (for "random" field colors).
function hash(a, b) {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

// turn = how much the path has turned (slides the backdrop sideways).
// progress = how far down the mountain I am (0 = the top, 1 = the lake): the Kinneret grows as you get closer.
// pan = how far the view has turned (in pixels): everything in the backdrop slides by that much.
function drawValley(ctx, w, h, turn, progress, time, snow, pan = 0) {
  const horizon = Math.round(h * RACE.horizon);
  const slide = Math.max(-0.45, Math.min(0.45, turn * 0.5)) * w - pan; // (how far the lake slides as you turn)

  // The sky, and the sun.
  const sky = ctx.createLinearGradient(0, 0, 0, horizon);
  sky.addColorStop(0, "#4f9fe0");
  sky.addColorStop(1, "#d3e8f6");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, horizon + 1);
  ctx.fillStyle = "rgba(255, 250, 225, 0.95)";
  ctx.beginPath();
  ctx.arc(w * 0.82, h * 0.07, Math.max(10, h * 0.032), 0, Math.PI * 2);
  ctx.fill();
  // A few soft clouds, drifting slowly.
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  for (let i = 0; i < 5; i++) {
    const span = w + 300;
    const cx = ((i * 0.23 + 0.1) * span - slide * 0.3 + time * 6 * (1 + i * 0.2)) % span;
    const x = (cx + span) % span - 150;
    const y = h * (0.05 + (i % 3) * 0.05);
    const r = h * (0.025 + (i % 2) * 0.012);
    for (const [dx, dy, k] of [[0, 0, 1], [r * 1.1, r * 0.2, 0.8], [-r * 1.1, r * 0.25, 0.75], [r * 0.4, -r * 0.4, 0.7]]) {
      ctx.beginPath();
      ctx.ellipse(x + dx, y + dy, r * 1.6 * k, r * k, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Far hills on the other side of the valley, hazy blue.
  const hillY = (x) => horizon - h * (0.03 + 0.022 * ridge(((x - slide * 0.4) / w * 0.5 % 1 + 2) % 1, FAR_HILL_WAVES));
  ctx.beginPath();
  ctx.moveTo(0, horizon + 1);
  for (let x = 0; x <= w + 4; x += 4) ctx.lineTo(x, hillY(x));
  ctx.lineTo(w, horizon + 1);
  ctx.closePath();
  ctx.fillStyle = "#9db3c6";
  ctx.fill();

  // The valley floor, far below: a patchwork of fields, tiny near the horizon and bigger closer in.
  // As you go down the mountain, the rows slowly slide toward you. Below the valley, the
  // mountainside I'm on fills the bottom of the screen (snowy up high, rocky lower down).
  const valleyBottom = horizon + (h - horizon) * 0.36;
  const side = rgbText(mixRgb(C.slopeRock, C.slopeSnow, snow));
  const mountain = ctx.createLinearGradient(0, valleyBottom - h * 0.06, 0, h);
  mountain.addColorStop(0, "rgba(0, 0, 0, 0)");
  mountain.addColorStop(0.25, side);
  mountain.addColorStop(1, side);
  ctx.fillStyle = "#b9c7ae";
  ctx.fillRect(0, horizon, w, h - horizon);
  const rows = 30;
  const scroll = progress * 160;
  const phase = scroll % 1;
  for (let r = rows - 1; r >= 0; r--) {
    const t0 = (r + phase) / rows, t1 = (r + 1 + phase) / rows;
    const y0 = horizon + (valleyBottom - horizon) * Math.pow(t0, 2.2);
    const y1 = horizon + (valleyBottom - horizon) * Math.pow(Math.min(1, t1), 2.2);
    const row = r - Math.floor(scroll); // (the same row keeps the same fields as it slides)
    const colW = 12 + t0 * 60;
    const shift = -slide * (0.6 + t0) + hash(row, 0) * colW;
    const first = Math.floor(-shift / colW) - 1;
    const haze = 0.25 + 0.45 * (1 - t0) * (1 - t0);
    for (let c = first; c * colW + shift < w; c++) {
      const color = FIELD_COLORS[Math.floor(hash(row, c) * FIELD_COLORS.length)];
      ctx.fillStyle = rgbText(mixRgb(color, C.haze, haze));
      ctx.fillRect(c * colW + shift, y0, colW - 1, y1 - y0 + 0.5);
    }
  }

  // The Kinneret, far ahead, growing as you come down the mountain.
  const lakeX = w / 2 - slide;
  const lakeY = horizon + h * (0.012 + progress * 0.045);
  const rx = w * (0.22 + progress * 0.75), ry = h * (0.012 + progress * 0.03);
  // The Jordan River winding toward it.
  ctx.strokeStyle = "rgba(78, 145, 205, 0.9)";
  ctx.lineCap = "round";
  ctx.beginPath();
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    const y = lakeY + (valleyBottom - lakeY) * Math.pow(t, 2);
    const x = lakeX + rx * 0.15 + Math.sin(t * 9 + 1) * w * 0.05 * t + t * w * 0.35 - slide * t;
    ctx.lineWidth = 1 + t * 10;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.fillStyle = "#d9cf9f"; // the shore
  ctx.beginPath();
  ctx.ellipse(lakeX, lakeY, rx * 1.03, ry * 1.25, 0, 0, Math.PI * 2);
  ctx.fill();
  const lake = ctx.createLinearGradient(0, lakeY - ry, 0, lakeY + ry);
  lake.addColorStop(0, "#5ea9df");
  lake.addColorStop(1, "#2f7fc0");
  ctx.fillStyle = lake;
  ctx.beginPath();
  ctx.ellipse(lakeX, lakeY, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  // Sparkles on the water.
  ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 9; i++) {
    const sx = lakeX + (hash(i, 3) - 0.5) * rx * 1.4;
    const sy = lakeY + (hash(i, 7) - 0.5) * ry * 1.2;
    const len = rx * 0.06 * (0.6 + 0.4 * Math.sin(time * 2 + i));
    ctx.beginPath(); ctx.moveTo(sx - len / 2, sy); ctx.lineTo(sx + len / 2, sy); ctx.stroke();
  }
  // A little white town on the far shore.
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  for (let i = 0; i < 10; i++) {
    const tx = lakeX + rx * (0.55 + hash(i, 11) * 0.35);
    const ty = lakeY - ry * (0.6 + hash(i, 13) * 0.6);
    const s = Math.max(1, ry * 0.18);
    ctx.fillRect(tx, ty, s * 1.4, s);
  }
  // The mountainside below me.
  ctx.fillStyle = mountain;
  ctx.fillRect(0, valleyBottom - h * 0.06, w, h - valleyBottom + h * 0.06);
  // Haze over the far part of the valley.
  const mist = ctx.createLinearGradient(0, horizon, 0, horizon + h * 0.2);
  mist.addColorStop(0, "rgba(220, 231, 238, 0.75)");
  mist.addColorStop(1, "rgba(220, 231, 238, 0)");
  ctx.fillStyle = mist;
  ctx.fillRect(0, horizon - h * 0.02, w, h * 0.22);
}

// ---------- One piece of path ----------
// mist = how much it fades into the haze (0 = close, 1 = far away).

function drawSegment(ctx, w, seg, mist) {
  const a = seg.p1.screen; // near end (lower on the screen)
  const b = seg.p2.screen; // far end
  const fade = (c) => rgbText(mixRgb(c, C.haze, mist));
  const pick = (light, dark) => (seg.dark ? dark : light);

  if (seg.water) {
    // The Kinneret: water all the way across.
    ctx.fillStyle = fade(pick(C.water, C.waterDark));
    ctx.fillRect(0, b.y, w, a.y - b.y + 1);
    return;
  }

  // The ground beside the path: snowy at the top, grassy lower down, sand at the beach.
  let ground = mixRgb(pick(C.grass, C.grassDark), pick(C.snow, C.snowDark), seg.snow);
  ground = mixRgb(ground, pick(C.sand, C.sandDark), seg.sand);
  let slope = mixRgb(C.slopeRock, C.slopeSnow, seg.snow);
  slope = mixRgb(slope, C.slopeSand, seg.sand);

  // How far the ground reaches on each side, and the mountainside dropping away below it.
  const edgeA = a.w + RACE.shoulder * a.unit, edgeB = b.w + RACE.shoulder * b.unit;
  const dropA = a.unit * 9, dropB = b.unit * 9;   // how far down the slope goes (on the screen)
  const outA = a.unit * 2.5, outB = b.unit * 2.5;     // and how far out
  const slopeColor = fade(slope);
  polygon(ctx, a.x - edgeA, a.y, b.x - edgeB, b.y, b.x - edgeB - outB, b.y + dropB, a.x - edgeA - outA, a.y + dropA, slopeColor);
  ctx.strokeStyle = slopeColor; ctx.lineWidth = 1.5; ctx.stroke(); // (an outline in the same color fills the tiny gaps between pieces on sharp bends)
  polygon(ctx, a.x + edgeA, a.y, b.x + edgeB, b.y, b.x + edgeB + outB, b.y + dropB, a.x + edgeA + outA, a.y + dropA, slopeColor);
  ctx.stroke();
  polygon(ctx, a.x - edgeA, a.y, a.x + edgeA, a.y, b.x + edgeB, b.y, b.x - edgeB, b.y, fade(ground));

  // The path, with slightly darker packed edges.
  const path = mixRgb(pick(C.path, C.pathDark), pick(C.sandPath, C.sandPathDark), seg.sand);
  const rimA = a.w * 0.08 + 1, rimB = b.w * 0.08 + 1;
  polygon(ctx, a.x - a.w - rimA, a.y, a.x + a.w + rimA, a.y, b.x + b.w + rimB, b.y, b.x - b.w - rimB, b.y, fade(mixRgb(C.pathEdge, path, seg.sand)));
  polygon(ctx, a.x - a.w, a.y, a.x + a.w, a.y, b.x + b.w, b.y, b.x - b.w, b.y, fade(path));

  // Grooves in the snow from sleds that went down before you: two wobbly pairs of runner tracks.
  if (!seg.line && seg.sand < 0.5 && a.unit > 3) {
    const groove = fade(mixRgb(path, C.pathEdge, 0.45));
    const lineA = Math.max(0.6, a.unit / 70), lineB = Math.max(0.6, b.unit / 70);
    for (const k of [-0.5, -0.36, 0.3, 0.44]) {
      const offA = k * Math.min(seg.width, 1.2) + 0.1 * Math.sin(seg.index * 0.045 + k * 4);
      const offB = k * Math.min(seg.width2, 1.2) + 0.1 * Math.sin((seg.index + 1) * 0.045 + k * 4);
      const xA = a.x + offA * a.unit, xB = b.x + offB * b.unit;
      polygon(ctx, xA - lineA, a.y, xA + lineA, a.y, xB + lineB, b.y, xB - lineB, b.y, groove);
    }
  }

  if (seg.line) {
    // The start and finish lines: black and white squares, two rows.
    const columns = 14;
    for (let row = 0; row < 2; row++) {
      const yA = lerp(a.y, b.y, row / 2), yB = lerp(a.y, b.y, (row + 1) / 2);
      const xA = lerp(a.x, b.x, row / 2), xB = lerp(a.x, b.x, (row + 1) / 2);
      const wA = lerp(a.w, b.w, row / 2), wB = lerp(a.w, b.w, (row + 1) / 2);
      for (let c = 0; c < columns; c++) {
        const color = (c + row) % 2 === 0 ? "#111827" : "#ffffff";
        const l = c / columns * 2 - 1, r = (c + 1) / columns * 2 - 1;
        polygon(ctx, xA + wA * l, yA, xA + wA * r, yA, xB + wB * r, yB, xB + wB * l, yB, color);
      }
    }
  } else if (!seg.dark && seg.width > RACE.gateWidth * 0.8 && seg.width < 2.4 && !seg.island) { // (no lane lines on the big snowfields)
    // Where the path is wide (at the gates), dashed lines show the 3 lanes.
    const lineA = a.unit / 30, lineB = b.unit / 30;
    for (let lane = 1; lane < RACE.lanes; lane++) {
      const t = lane / RACE.lanes * 2 - 1;
      const xA = a.x + a.w * t, xB = b.x + b.w * t;
      polygon(ctx, xA - lineA / 2, a.y, xA + lineA / 2, a.y, xB + lineB / 2, b.y, xB - lineB / 2, b.y, fade(C.pathEdge));
    }
  }
}

// Extras lying on a piece of path: the island where the path splits (rocky ground down the
// middle) and snow ramps (bright bands, so you can see them coming). The flat drawing keeps
// these simple; the real 3D drawing (race-3d.js) builds them properly.
function drawSegmentExtras(ctx, seg, mist) {
  const a = seg.p1.screen, b = seg.p2.screen;
  const fade = (c) => rgbText(mixRgb(c, C.haze, mist));
  if (seg.island > 0.02) {
    const rocky = mixRgb(C.slopeRock, C.slopeSnow, seg.snow * 0.7);
    polygon(ctx, a.x + (seg.islandAt - seg.island) * a.unit, a.y, a.x + (seg.islandAt + seg.island) * a.unit, a.y, b.x + (seg.islandAt2 + seg.island2) * b.unit, b.y, b.x + (seg.islandAt2 - seg.island2) * b.unit, b.y, fade(rocky));
  }
  for (const ramp of seg.ramps || []) {
    const l = ramp.offset - ramp.half, r = ramp.offset + ramp.half;
    const color = ramp.kind === "pier" ? hexToRgb(seg.index % 2 ? "#b98a55" : "#9f6f42") : hexToRgb(seg.index >= ramp.index + ramp.length - 2 ? "#f97316" : seg.index % 2 ? "#a9d2f3" : "#ffffff");
    polygon(ctx, a.x + l * a.unit, a.y, a.x + r * a.unit, a.y, b.x + r * b.unit, b.y, b.x + l * b.unit, b.y, fade(color));
  }
}

// ---------- Bushes, rocks, trees (painted once, then reused) ----------
// Each picture is painted once onto its own little hidden canvas. After that, drawing
// it is just "copy this picture, this big, here", which is very fast.

const spritePictures = {};

function spritePicture(type) {
  if (spritePictures[type]) return spritePictures[type];
  const size = SPRITE_SIZES[type];
  const H = 300;
  const W = Math.max(8, Math.round(H * size.w / size.h));
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d");
  const painters = {
    bush: () => paintBush(g, W, H, false),
    bushSnow: () => paintBush(g, W, H, true),
    oak: () => paintOak(g, W, H, false),
    oakSnow: () => paintOak(g, W, H, true),
    pineSnow: () => paintPine(g, W, H),
    giantPine: () => paintPine(g, W, H),
    thicket: () => paintBush(g, W, H, false),
    thicketSnow: () => paintBush(g, W, H, true),
    olive: () => paintOlive(g, W, H),
    almond: () => paintAlmond(g, W, H),
    palm: () => paintPalm(g, W, H),
    rock: () => paintRock(g, W, H, false),
    rockSnow: () => paintRock(g, W, H, true),
    snowman: () => paintSnowman(g, W, H),
    cabin: () => paintCabin(g, W, H),
    sign: () => paintSign(g, W, H),
    pole: () => paintPole(g, W, H),
    reeds: () => paintReeds(g, W, H),
  };
  painters[type]();
  spritePictures[type] = c;
  return c;
}

// A blob made of overlapping circles: [x, y, radius] as fractions of the picture.
function blob(g, W, H, circles, color) {
  g.fillStyle = color;
  for (const [x, y, r] of circles) {
    g.beginPath();
    g.arc(x * W, y * H, r * Math.min(W, H), 0, Math.PI * 2);
    g.fill();
  }
}

// A leafy crown lit by the sun (up on the right): a dark shady layer underneath, the main
// color on top of it, then bright sunlit bits, then little clumps of leaves for texture.
function leafyCrown(g, W, H, circles, dark, mid, light, seed) {
  blob(g, W, H, circles.map(([x, y, r]) => [x - 0.01, y + 0.02, r]), dark);
  blob(g, W, H, circles.map(([x, y, r]) => [x + 0.02, y - 0.02, r * 0.82]), mid);
  blob(g, W, H, circles.map(([x, y, r]) => [x + 0.05, y - 0.05, r * 0.42]), light);
  for (let i = 0; i < 26; i++) {
    const [x, y, r] = circles[i % circles.length];
    const angle = hash(i, seed) * Math.PI * 2, reach = Math.sqrt(hash(seed, i)) * r * 0.9;
    const px = x + Math.cos(angle) * reach * Math.min(W, H) / W, py = y + Math.sin(angle) * reach * Math.min(W, H) / H;
    blob(g, W, H, [[px, py, r * 0.16]], Math.sin(angle) < -0.2 || Math.cos(angle) > 0.4 ? light : dark);
  }
}

// A rough little trunk, darker on the shady (left) side.
function trunk(g, W, H, points, color) {
  g.fillStyle = color;
  g.beginPath();
  points.forEach(([x, y], i) => (i === 0 ? g.moveTo(x * W, y * H) : g.lineTo(x * W, y * H)));
  g.fill();
  g.fillStyle = "rgba(0, 0, 0, 0.25)";
  g.fillRect(points[0][0] * W, H * 0.6, W * 0.03, H * 0.4);
}

function paintBush(g, W, H, snowy) {
  const body = [[0.25, 0.7, 0.28], [0.5, 0.58, 0.36], [0.75, 0.7, 0.28], [0.5, 0.78, 0.3]];
  leafyCrown(g, W, H, body, "#2f4721", "#4a6a31", "#6f8f45", 3);
  if (snowy) {
    // A thick cap of snow on top, with a blue shadow under its edge.
    blob(g, W, H, [[0.3, 0.5, 0.2], [0.52, 0.37, 0.25], [0.72, 0.5, 0.19]], "#c9d8e8");
    blob(g, W, H, [[0.31, 0.46, 0.19], [0.53, 0.33, 0.24], [0.71, 0.46, 0.18]], "#f4f8fc");
    blob(g, W, H, [[0.45, 0.3, 0.12], [0.64, 0.38, 0.09]], "#ffffff");
  }
}

// A round oak tree (Mt Hermon has oaks, not pines).
function paintOak(g, W, H, snowy) {
  trunk(g, W, H, [[0.45, 1], [0.47, 0.55], [0.36, 0.42], [0.41, 0.39], [0.5, 0.49], [0.61, 0.37], [0.65, 0.4], [0.55, 0.56], [0.57, 1]], "#5b3f26");
  const crown = [[0.28, 0.4, 0.19], [0.5, 0.26, 0.25], [0.73, 0.39, 0.19], [0.4, 0.47, 0.17], [0.62, 0.48, 0.17], [0.5, 0.4, 0.2]];
  leafyCrown(g, W, H, crown, "#26391d", "#3d5a2b", "#5f7f3c", 7);
  if (snowy) {
    blob(g, W, H, [[0.3, 0.3, 0.12], [0.5, 0.16, 0.15], [0.71, 0.3, 0.12]], "#cbd9e8");
    blob(g, W, H, [[0.31, 0.27, 0.11], [0.51, 0.13, 0.14], [0.71, 0.27, 0.11]], "#f6f9fc");
  }
}

// A tall snowy tree of the deep woods: a trunk and four layers of dark branches with snow on them.
function paintPine(g, W, H) {
  g.fillStyle = "#5b3f26";
  g.fillRect(W * 0.46, H * 0.72, W * 0.08, H * 0.28);
  for (const [top, bottom, half] of [[0.5, 0.84, 0.46], [0.33, 0.66, 0.38], [0.17, 0.48, 0.29], [0.02, 0.3, 0.2]]) {
    g.fillStyle = "#2c5a3a";
    g.beginPath(); g.moveTo(W * 0.5, H * top); g.lineTo(W * (0.5 + half), H * bottom); g.lineTo(W * (0.5 - half), H * bottom); g.closePath(); g.fill();
    g.fillStyle = "#f6f9fc"; // the snow on the upper part of each layer
    const mid = top + (bottom - top) * 0.55;
    g.beginPath(); g.moveTo(W * 0.5, H * top); g.lineTo(W * (0.5 + half * 0.55), H * mid); g.lineTo(W * 0.5, H * (mid - 0.03)); g.lineTo(W * (0.5 - half * 0.55), H * mid); g.closePath(); g.fill();
  }
}

// An olive tree: silvery green, with a twisty, gnarled trunk.
function paintOlive(g, W, H) {
  g.strokeStyle = "#5e4e3b"; g.lineCap = "round";
  g.lineWidth = W * 0.1;
  g.beginPath(); g.moveTo(W * 0.52, H); g.quadraticCurveTo(W * 0.36, H * 0.75, W * 0.5, H * 0.5); g.stroke();
  g.strokeStyle = "#7a6650"; g.lineWidth = W * 0.035;
  g.beginPath(); g.moveTo(W * 0.56, H); g.quadraticCurveTo(W * 0.42, H * 0.75, W * 0.54, H * 0.52); g.stroke();
  g.strokeStyle = "#5e4e3b"; g.lineWidth = W * 0.05;
  g.beginPath(); g.moveTo(W * 0.48, H * 0.6); g.lineTo(W * 0.28, H * 0.45); g.stroke();
  g.beginPath(); g.moveTo(W * 0.5, H * 0.55); g.lineTo(W * 0.72, H * 0.42); g.stroke();
  const crown = [[0.25, 0.4, 0.17], [0.45, 0.3, 0.21], [0.68, 0.35, 0.19], [0.55, 0.45, 0.16], [0.35, 0.48, 0.13]];
  leafyCrown(g, W, H, crown, "#56653f", "#76875a", "#a3b38a", 11);
}

// An almond tree in blossom: a dark twiggy tree covered in white-pink flowers
// (almond trees flower in the middle of winter in Israel, around Tu BiShvat).
function paintAlmond(g, W, H) {
  g.strokeStyle = "#4a3426"; g.lineCap = "round";
  g.lineWidth = W * 0.07;
  g.beginPath(); g.moveTo(W * 0.5, H); g.lineTo(W * 0.5, H * 0.55); g.stroke();
  g.lineWidth = W * 0.035;
  for (const [x, y] of [[0.22, 0.3], [0.38, 0.18], [0.62, 0.16], [0.8, 0.32], [0.5, 0.12]]) {
    g.beginPath(); g.moveTo(W * 0.5, H * 0.6); g.quadraticCurveTo(W * (0.5 + (x - 0.5) * 0.4), H * 0.4, W * x, H * y); g.stroke();
  }
  const crown = [[0.27, 0.36, 0.17], [0.45, 0.25, 0.2], [0.65, 0.27, 0.19], [0.75, 0.4, 0.14], [0.5, 0.42, 0.17]];
  leafyCrown(g, W, H, crown, "#e9b9c8", "#f6d6df", "#fff4f7", 13);
  // A few darker pink buds.
  for (let i = 0; i < 18; i++) {
    const [x, y, r] = crown[i % crown.length];
    const angle = hash(i, 17) * Math.PI * 2, reach = hash(17, i) * r * 0.9;
    blob(g, W, H, [[x + Math.cos(angle) * reach, y + Math.sin(angle) * reach, 0.018]], "#d9879f");
  }
}

function paintPalm(g, W, H) {
  g.strokeStyle = "#8b6a42"; g.lineCap = "round"; g.lineWidth = W * 0.08;
  g.beginPath(); g.moveTo(W * 0.5, H); g.quadraticCurveTo(W * 0.42, H * 0.55, W * 0.52, H * 0.18); g.stroke();
  g.strokeStyle = "#6f5233"; g.lineWidth = W * 0.02;
  for (let y = 0.3; y < 1; y += 0.07) { g.beginPath(); g.moveTo(W * 0.43, H * y); g.lineTo(W * 0.55, H * y - H * 0.01); g.stroke(); }
  g.strokeStyle = "#3f7a3a"; g.lineWidth = W * 0.05;
  for (const [dx, dy] of [[-0.45, 0.12], [-0.4, -0.02], [-0.2, -0.12], [0.2, -0.12], [0.42, -0.02], [0.47, 0.12]]) {
    g.beginPath();
    g.moveTo(W * 0.52, H * 0.18);
    g.quadraticCurveTo(W * (0.52 + dx * 0.6), H * (0.12 + dy - 0.06), W * (0.52 + dx), H * (0.18 + dy + 0.06));
    g.stroke();
  }
}

// A black basalt rock (the Golan and the Hermon foothills are full of them).
function paintRock(g, W, H, snowy) {
  g.fillStyle = "#3f3d3b";
  g.beginPath();
  g.moveTo(0, H); g.lineTo(W * 0.06, H * 0.5); g.lineTo(W * 0.3, H * 0.15); g.lineTo(W * 0.66, H * 0.12);
  g.lineTo(W * 0.94, H * 0.5); g.lineTo(W, H); g.closePath(); g.fill();
  g.fillStyle = "#57534e";
  g.beginPath(); g.moveTo(W * 0.3, H * 0.15); g.lineTo(W * 0.66, H * 0.12); g.lineTo(W * 0.6, H * 0.6); g.lineTo(W * 0.2, H * 0.55); g.fill();
  g.fillStyle = "#6e6a64"; // the sunny side (the sun is on the right)
  g.beginPath(); g.moveTo(W * 0.66, H * 0.12); g.lineTo(W * 0.94, H * 0.5); g.lineTo(W, H); g.lineTo(W * 0.62, H); g.lineTo(W * 0.6, H * 0.6); g.fill();
  g.fillStyle = "rgba(0, 0, 0, 0.3)"; // little holes in the basalt
  for (let i = 0; i < 14; i++) { g.beginPath(); g.arc(W * (0.12 + hash(i, 5) * 0.76), H * (0.3 + hash(5, i) * 0.6), W * 0.012, 0, Math.PI * 2); g.fill(); }
  if (snowy) {
    g.fillStyle = "#f4f8fc";
    g.beginPath(); g.moveTo(W * 0.1, H * 0.45); g.lineTo(W * 0.3, H * 0.12); g.lineTo(W * 0.66, H * 0.09); g.lineTo(W * 0.9, H * 0.45);
    g.quadraticCurveTo(W * 0.5, H * 0.3, W * 0.1, H * 0.45); g.fill();
  }
}

function paintSnowman(g, W, H) {
  const cx = W / 2;
  const ball = (y, r) => {
    g.fillStyle = "#ffffff";
    g.beginPath(); g.arc(cx, y, r, 0, Math.PI * 2); g.fill();
    g.fillStyle = "rgba(140, 170, 200, 0.3)"; // a blue shadow on the left
    g.beginPath(); g.arc(cx - r * 0.2, y + r * 0.1, r * 0.85, Math.PI * 0.55, Math.PI * 1.45); g.fill();
  };
  const r1 = W * 0.42, r2 = W * 0.31, r3 = W * 0.22;
  const y1 = H - r1, y2 = y1 - r1 - r2 * 0.7, y3 = y2 - r2 - r3 * 0.7;
  g.strokeStyle = "#5b3a1e"; g.lineWidth = W * 0.035; g.lineCap = "round"; // stick arms, waving
  g.beginPath(); g.moveTo(cx - r2 * 0.8, y2); g.lineTo(cx - W * 0.5, y2 - r2 * 1.1); g.stroke();
  g.beginPath(); g.moveTo(cx + r2 * 0.8, y2); g.lineTo(cx + W * 0.5, y2 - r2 * 0.6); g.stroke();
  ball(y1, r1); ball(y2, r2); ball(y3, r3);
  g.fillStyle = "#2563eb"; // a blue and white scarf
  g.fillRect(cx - r3 * 0.95, y3 + r3 * 0.65, r3 * 1.9, r3 * 0.35);
  g.fillRect(cx + r3 * 0.3, y3 + r3 * 0.8, r3 * 0.35, r3 * 0.9);
  g.fillStyle = "#111827"; // eyes, buttons, hat
  for (const dx of [-0.35, 0.35]) { g.beginPath(); g.arc(cx + dx * r3, y3 - r3 * 0.15, r3 * 0.1, 0, Math.PI * 2); g.fill(); }
  for (const dy of [-0.45, 0, 0.45]) { g.beginPath(); g.arc(cx, y2 + dy * r2, r2 * 0.09, 0, Math.PI * 2); g.fill(); }
  g.fillRect(cx - r3 * 0.95, y3 - r3 * 0.95, r3 * 1.9, r3 * 0.18);
  g.fillRect(cx - r3 * 0.6, y3 - r3 * 1.75, r3 * 1.2, r3 * 0.85);
  g.fillStyle = "#f97316"; // carrot nose
  g.beginPath(); g.moveTo(cx - r3 * 0.12, y3 + r3 * 0.08); g.lineTo(cx + r3 * 0.12, y3 + r3 * 0.08); g.lineTo(cx, y3 + r3 * 0.5); g.fill();
}

function paintCabin(g, W, H) {
  const wallTop = H * 0.48;
  g.fillStyle = "#8b5a2b"; g.fillRect(W * 0.1, wallTop, W * 0.8, H - wallTop);
  g.strokeStyle = "#6b4423"; g.lineWidth = H * 0.012;
  for (let y = wallTop + H * 0.05; y < H; y += H * 0.065) { g.beginPath(); g.moveTo(W * 0.1, y); g.lineTo(W * 0.9, y); g.stroke(); }
  g.fillStyle = "#4b2e14"; g.fillRect(W * 0.62, H * 0.12, W * 0.08, H * 0.3); // chimney
  g.fillStyle = "#3f2a17"; // roof
  g.beginPath(); g.moveTo(0, wallTop + H * 0.04); g.lineTo(W * 0.5, H * 0.14); g.lineTo(W, wallTop + H * 0.04); g.fill();
  g.fillStyle = "#ffffff"; // thick snow on the roof
  g.beginPath(); g.moveTo(-W * 0.01, wallTop); g.lineTo(W * 0.5, H * 0.1); g.lineTo(W * 1.01, wallTop);
  g.quadraticCurveTo(W * 0.5, H * 0.24, -W * 0.01, wallTop); g.fill();
  g.fillStyle = "#fde68a"; g.fillRect(W * 0.2, H * 0.62, W * 0.2, H * 0.16); // a warm window
  g.fillStyle = "#5b3a1e"; g.fillRect(W * 0.55, H * 0.6, W * 0.18, H * 0.4);  // the door
  g.fillStyle = "rgba(220, 230, 240, 0.7)"; // smoke
  for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(W * (0.66 + i * 0.05), H * (0.08 - i * 0.03), H * (0.03 + i * 0.012), 0, Math.PI * 2); g.fill(); }
}

// A wooden sign: "כִּנֶּרֶת" with an arrow.
function paintSign(g, W, H) {
  g.fillStyle = "#6b4423";
  g.fillRect(W * 0.2, H * 0.4, W * 0.07, H * 0.6);
  g.fillRect(W * 0.73, H * 0.4, W * 0.07, H * 0.6);
  g.fillStyle = "#a0703f";
  g.fillRect(W * 0.05, H * 0.05, W * 0.9, H * 0.5);
  g.strokeStyle = "#6b4423"; g.lineWidth = H * 0.025; g.strokeRect(W * 0.05, H * 0.05, W * 0.9, H * 0.5);
  g.fillStyle = "#fff8e1";
  g.textAlign = "center"; g.textBaseline = "middle";
  g.font = `800 ${H * 0.17}px Rubik, Arial, sans-serif`;
  g.direction = "rtl";
  g.fillText("כִּנֶּרֶת", W * 0.5, H * 0.2);
  g.direction = "ltr";
  g.font = `700 ${H * 0.11}px Rubik, Arial, sans-serif`;
  g.fillText("Kinneret ↓", W * 0.5, H * 0.4);
}

// A thin snow pole with an orange top, marking the path's edge.
function paintPole(g, W, H) {
  g.fillStyle = "#1f2937"; g.fillRect(W * 0.25, H * 0.15, W * 0.5, H * 0.85);
  g.fillStyle = "#f97316"; g.fillRect(W * 0.2, 0, W * 0.6, H * 0.2);
}

function paintReeds(g, W, H) {
  g.strokeStyle = "#7c8b3e"; g.lineCap = "round"; g.lineWidth = W * 0.03;
  for (let i = 0; i < 9; i++) {
    const x = W * (0.1 + i * 0.1);
    g.beginPath(); g.moveTo(x, H); g.quadraticCurveTo(x + W * 0.04, H * 0.5, x + W * (i % 2 ? 0.08 : -0.05), H * (0.1 + (i % 3) * 0.08)); g.stroke();
  }
  g.fillStyle = "#7a5230";
  for (let i = 0; i < 9; i += 2) { g.beginPath(); g.ellipse(W * (0.1 + i * 0.1) + W * 0.03, H * 0.25, W * 0.025, H * 0.07, 0, 0, Math.PI * 2); g.fill(); }
}

// ---------- The whole picture ----------
// scene = {
//   cameraZ:  how far along the path the camera is
//   cameraX:  how far left/right the camera is (my sled's sideways spot)
//   turn:     for sliding the backdrop as you turn
//   time:     the clock (for flapping scarves and sparkles)
//   sleds:    other sleds: [{ y (distance along the path), x (sideways), color, name, steer }]
//   gate:     the question on the next gate: { number, english, choices: [left, middle, right] } (or null)
// }
function drawRaceScene(ctx, w, h, scene) {
  const segments = TRACK.segments;
  const L = RACE.segmentLength;
  const cameraZ = Math.max(0, scene.cameraZ);
  const base = findSegment(cameraZ);
  const basePercent = clamp01((cameraZ - base.p1.world.z) / L);

  // The camera floats above the path where my sled is, so it goes down the mountain (and over the hills) with me.
  const mySpot = cameraZ + raceCamera.playerZ;
  const mySegment = findSegment(mySpot);
  const height = lerp(mySegment.p1.world.y, mySegment.p2.world.y, clamp01((mySpot - mySegment.p1.world.z) / L));
  // …but never inside a hill: going down the far side of a hilltop, the top can be right
  // behind my sled, higher than me. So the camera also stays above the highest ground
  // between it and my sled (otherwise the snow right in front of the lens fills the screen).
  let highest = -Infinity;
  for (let i = base.index; i <= mySegment.index; i++) highest = Math.max(highest, segments[i].p1.world.y, segments[i].p2.world.y);
  const cameraY = Math.max(height + RACE.cameraHeight, highest + RACE.cameraHeight * 0.75);

  // Turning the view: when my sled points right, the camera swings round behind it, so
  // everything far away slides LEFT across the screen (the world turns around me), while
  // my sled stays in the middle. `pan` = how far (in pixels) things far away slide.
  const viewTurn = scene.viewTurn || 0;
  const pan = -Math.tan(viewTurn) * raceCamera.depth * w / 2;
  const cameraX = scene.cameraX * RACE.roadWidth - Math.sin(viewTurn) * raceCamera.playerZ;

  drawValley(ctx, w, h, scene.turn, trackProgress(cameraZ), scene.time, mySegment.snow, pan);

  // First work out where every piece lands on the screen, near to far.
  // `x` and `dx` bend the path: each curved piece shifts the next one a bit more.
  // `clip` = the highest point on the screen the path has reached so far: anything
  // further away that lands lower than that is hidden behind a hill.
  const shown = [];
  let x = 0;
  let dx = -(base.curve * basePercent);
  let clip = h;
  const drawCount = Math.min(RACE.drawDistance, segments.length - base.index);
  for (let n = 0; n < drawCount; n++) {
    const seg = segments[base.index + n];
    projectPoint(seg.p1, cameraX - x, cameraY, cameraZ, w, h, seg.width);
    projectPoint(seg.p2, cameraX - x - dx, cameraY, cameraZ, w, h, seg.width2);
    seg.p1.screen.x += pan;
    seg.p2.screen.x += pan;
    x += dx;
    dx += seg.curve;
    if (seg.p1.camera.z <= raceCamera.depth) continue; // behind the camera
    seg.clip = clip;
    seg.hidden = seg.p2.screen.y >= clip; // completely behind a hill (but trees there can still poke up)
    clip = Math.min(clip, seg.p2.screen.y);
    shown.push(seg);
  }

  // Which other sleds are on which piece of path.
  const sledsOn = new Map();
  for (const sled of scene.sleds) {
    const index = findSegment(sled.y).index;
    if (!sledsOn.has(index)) sledsOn.set(index, []);
    sledsOn.get(index).push(sled);
  }

  // Banana peels, mangoes and rimonim: which piece of path each one is on.
  const extrasOn = new Map();
  const putExtra = (z, x, icon, lift) => {
    const index = findSegment(z).index;
    if (!extrasOn.has(index)) extrasOn.set(index, []);
    extrasOn.get(index).push({ z, x, icon, lift });
  };
  for (const thing of scene.things || []) {
    if (thing.kind === "goat") putExtra(thing.y, thing.x, "🐐", (thing.air || 0) + 250);
    else if (thing.kind === "rimon") putExtra(thing.y, thing.x, "💣", thing.air || 0);
    else putExtra(thing.y, thing.x, thing.kind === "banana" ? "🍌" : "🥭", thing.kind === "banana" ? 0 : 250);
  }

  // Then paint them far to near, each piece with the things standing on it.
  for (let i = shown.length - 1; i >= 0; i--) {
    const seg = shown[i];
    const a = seg.p1.screen, b = seg.p2.screen;
    if (b.y >= h && a.y >= h) continue; // below the screen
    const far = i / drawCount;
    // Behind a hill, only the part above the top of the hill shows (the path, its
    // mountainside, trees, sleds…), so everything is cut off at the hilltop's line.
    ctx.save();
    if (seg.hidden || a.y > seg.clip + 1) {
      ctx.beginPath();
      ctx.rect(0, 0, w, seg.clip);
      ctx.clip();
    }
    if (!seg.hidden) drawSegment(ctx, w, seg, Math.min(0.85, far * far * 0.9));
    if (!seg.hidden && !seg.water) drawSegmentExtras(ctx, seg, Math.min(0.85, far * far * 0.9));
    for (const sprite of seg.sprites) {
      const size = SPRITE_SIZES[sprite.type];
      const width = size.w * a.scale * w / 2;
      const tall = size.h * a.scale * w / 2;
      if (width < 0.8) continue;
      const sx = a.x + sprite.offset * a.unit;
      if (sx + width / 2 < 0 || sx - width / 2 > w) continue;
      if (size.solid && width > 3) {
        // A soft blue shadow on the ground (the sun is up on the right, so it falls a bit to the left).
        ctx.fillStyle = "rgba(40, 60, 100, 0.2)";
        ctx.beginPath(); ctx.ellipse(sx - width * 0.15, a.y, width * 0.55, Math.max(1, width * 0.1), 0, 0, Math.PI * 2); ctx.fill();
      }
      ctx.drawImage(spritePicture(sprite.type), sx - width / 2, a.y - tall, width, tall);
    }
    if (seg.line === "start") drawBanner(ctx, w, seg, "מֵרוֹץ הַחֶרְמוֹן · MT HERMON RACING", "#1d4ed8");
    if (seg.line === "finish") drawBanner(ctx, w, seg, "🏁 כִּנֶּרֶת · KINNERET 🏁", "#0e7490");
    if (seg.gate) drawGate(ctx, w, seg, scene.gate && scene.gate.number === seg.gate.number ? scene.gate : null);
    for (const extra of extrasOn.get(seg.index) || []) {
      const t = clamp01((extra.z - seg.p1.world.z) / L);
      const s = lerp(a.scale, b.scale, t);
      const big = 520 * s * w / 2;
      if (big < 4) continue;
      ctx.font = `${big}px Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(extra.icon, lerp(a.x, b.x, t) + s * extra.x * RACE.roadWidth * w / 2, lerp(a.y, b.y, t) - extra.lift * s * w / 2);
    }
    for (const sled of sledsOn.get(seg.index) || []) {
      const t = clamp01((sled.y - seg.p1.world.z) / L);
      const s = lerp(a.scale, b.scale, t);
      const sy = lerp(a.y, b.y, t) - (sled.air || 0) * s * w / 2; // (higher up while it is flying)
      const sx = lerp(a.x, b.x, t) + s * sled.x * RACE.roadWidth * w / 2;
      drawSled(ctx, sx, sy, SLED_WIDTH * s * w / 2, sled.color, (sled.turn || 0) - viewTurn + (sled.spin || 0), scene.time, sled.name);
    }
    ctx.restore();
  }
}

// "1st", "2nd", "3rd", "4th"…
function ordinal(n) {
  const last = n % 10, lastTwo = n % 100;
  if (last === 1 && lastTwo !== 11) return n + "st";
  if (last === 2 && lastTwo !== 12) return n + "nd";
  if (last === 3 && lastTwo !== 13) return n + "rd";
  return n + "th";
}

// A banner over the path (the start and the finish).
function drawBanner(ctx, w, seg, text, color) {
  const a = seg.p1.screen;
  const tall = 2000 * a.scale * w / 2;
  if (tall < 4) return;
  const left = a.x - a.w * 1.1, right = a.x + a.w * 1.1;
  const poleW = Math.max(2, a.w * 0.035);
  ctx.fillStyle = "#475569";
  ctx.fillRect(left - poleW / 2, a.y - tall, poleW, tall);
  ctx.fillRect(right - poleW / 2, a.y - tall, poleW, tall);
  const bannerH = tall * 0.22;
  ctx.fillStyle = color;
  ctx.fillRect(left, a.y - tall, right - left, bannerH);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(left, a.y - tall + bannerH * 0.06, right - left, bannerH * 0.06);
  ctx.fillRect(left, a.y - tall + bannerH * 0.88, right - left, bannerH * 0.06);
  drawTextInBox(ctx, text, a.x, a.y - tall + bannerH * 0.5, right - left, bannerH * 0.8, 400, "#ffffff", true);
}

// ---------- A sled, seen from behind (and a little from above) ----------
// An old-fashioned wooden sled: two wooden runners with iron strips, curling up at the front,
// and a deck of wooden slats. The rider wears a wool coat (in this sled's color), a knitted
// kippah, and a white scarf with blue stripes like a tallit, with tzitzit peeking out
// under the coat. A little Israeli flag flies from the back.
//
// cx, bottom = where the back of the sled sits on the screen. size = its width in pixels.
// turn = which way it points, compared to the camera (radians: plus = right).
//
// The sled is a tiny 3D model: every point has x (sideways), y (up) and z (forward), in
// "sled units" (the sled is about 100 wide). `at(x, y, z)` turns the point round by `turn`
// and works out where it lands on the screen. That's why it really looks like it turns.
function drawSled(ctx, cx, bottom, size, color, turn, time, name) {
  const u = size / 100;
  const cos = Math.cos(turn), sin = Math.sin(turn);
  const tilt = 0.42; // how much of the top we see (the camera looks down a little)
  const nose = 0.2;  // the sled tips forward, nose down, like it's heading down the slope (radians)
  const noseCos = Math.cos(nose), noseSin = Math.sin(nose);
  const at = (x, y, z) => {
    const X = x * cos + z * sin, Z = -x * sin + z * cos;
    const Y = y * noseCos - Z * noseSin, Zn = Z * noseCos + y * noseSin; // (tipped nose down)
    return [cx + X * u, bottom - (Y + Zn * tilt) * u];
  };
  const trace = (points) => {
    ctx.beginPath();
    points.forEach(([x, y, z], i) => { const [sx, sy] = at(x, y, z); if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy); });
  };
  const shape = (points, fill, stroke, lineWidth) => {
    trace(points);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth * u; ctx.stroke(); }
  };
  const line = (points, stroke, width) => {
    trace(points);
    ctx.strokeStyle = stroke; ctx.lineWidth = width * u; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke();
  };
  const coat = mixedColor(color, "#5b4636", 0.3);     // wool, a bit earthy
  const coatDark = mixedColor(color, "#2b2118", 0.5);
  const flap = Math.sin(time * 14);

  ctx.save();
  // A soft shadow on the snow, under the whole sled.
  shape([[-50, 0, -4], [50, 0, -4], [50, 0, 150], [-50, 0, 150]], "rgba(30, 60, 90, 0.16)");

  // The runners: an iron strip on the bottom, wood on top, curling up at the front.
  for (const s of [-1, 1]) {
    const x = s * 40;
    const runner = [[x, 2, -6], [x, 2, 126], [x, 6, 138], [x, 14, 145], [x, 21, 141], [x, 20, 134]];
    line(runner, "#3a3f44", 6);
    line(runner.map(([px, py, pz]) => [px, py + 4, pz]), "#8a5a2b", 5);
    // Little posts holding up the deck.
    for (const z of [8, 60, 112]) line([[x, 6, z], [x * 0.95, 16, z]], "#6b4423", 4);
  }
  // The deck: wooden slats from the front to the back (far ones first, so near ones cover them).
  const woods = ["#b98a55", "#a8784a", "#c29462", "#9f6f42", "#b3834f", "#a77649"];
  for (let i = 5; i >= 0; i--) {
    const z0 = 4 + i * 21, z1 = z0 + 17;
    shape([[-46, 17, z0], [46, 17, z0], [46, 17, z1], [-46, 17, z1]], woods[i], "#5e3b1c", 1);
    line([[-30, 17.2, z0 + 8], [10, 17.2, z0 + 9]], "rgba(94, 59, 28, 0.35)", 0.8); // wood grain
  }
  // The steering rope, from the front curls back to the rider's hands.
  line([[-40, 22, 140], [-30, 24, 92], [-22, 30, 62]], "#d6c08a", 2.2);
  line([[40, 22, 140], [30, 24, 92], [22, 30, 62]], "#d6c08a", 2.2);

  // The rider, sitting on the deck (a little forward from the back).
  const [hx, hy] = at(0, 17, 40);
  const r = u;
  ctx.translate(hx, hy);
  ctx.scale(1, 0.9); // (leaning forward a little, so we see a bit less of their back)
  // Tzitzit: white strings hanging down at both sides, swinging.
  ctx.strokeStyle = "#f8fafc"; ctx.lineWidth = r * 1.4; ctx.lineCap = "round";
  for (const s of [-1, 1]) {
    for (let k = 0; k < 3; k++) {
      ctx.beginPath();
      ctx.moveTo(s * (24 + k * 2) * r, -r * 14);
      ctx.quadraticCurveTo((s * (28 + k * 2) - flap * 2) * r, -r * 6, (s * (30 + k * 2.5) - flap * 3) * r, r * 1);
      ctx.stroke();
    }
  }
  // The coat: a wool jacket with a belt, sitting up.
  ctx.fillStyle = coat;
  ctx.beginPath();
  ctx.moveTo(-r * 29, -r * 8); ctx.lineTo(r * 29, -r * 8);
  ctx.quadraticCurveTo(r * 28, -r * 44, r * 17, -r * 52);
  ctx.lineTo(-r * 17, -r * 52);
  ctx.quadraticCurveTo(-r * 28, -r * 44, -r * 29, -r * 8);
  ctx.fill();
  ctx.fillStyle = coatDark;
  ctx.fillRect(-r * 28, -r * 20, r * 56, r * 4);  // belt
  ctx.fillRect(-r * 1, -r * 50, r * 2, r * 30);   // the back seam
  // Arms reaching forward to the rope, leaning into the turn.
  const lean = turn * 10;
  ctx.strokeStyle = coatDark; ctx.lineWidth = r * 9; ctx.lineCap = "round";
  for (const s of [-1, 1]) {
    ctx.beginPath(); ctx.moveTo(s * r * 21, -r * 46);
    ctx.quadraticCurveTo(s * r * 33 + lean * r, -r * 36, s * r * 26 + lean * r, -r * 24); ctx.stroke();
  }
  ctx.fillStyle = "#6b4a2e"; // leather mittens
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(s * r * 26 + lean * r, -r * 23, r * 4.5, 0, Math.PI * 2); ctx.fill(); }
  // The scarf: white with blue stripes, its end flying back in the wind, away from the turn.
  const fly = -turn * 18;
  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.moveTo(r * 4, -r * 50);
  ctx.quadraticCurveTo(r * (16 + fly), -r * (44 + flap * 2), r * (24 + fly * 1.4), -r * (36 + flap * 4));
  ctx.lineTo(r * (19 + fly * 1.4), -r * (32 + flap * 4));
  ctx.quadraticCurveTo(r * (11 + fly), -r * 41, r * 1, -r * 45);
  ctx.fill();
  ctx.fillRect(-r * 16, -r * 56, r * 32, r * 8);
  ctx.fillStyle = "#1d4ed8";
  ctx.fillRect(-r * 16, -r * 54.5, r * 32, r * 1.4);
  ctx.fillRect(-r * 16, -r * 50.5, r * 32, r * 1.4);
  // Head: dark curly hair, seen from behind.
  ctx.fillStyle = "#3b2414";
  ctx.beginPath(); ctx.arc(0, -r * 67, r * 13.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#4a2e1a";
  for (const [dx, dy] of [[-9, -60], [9, -60], [-11, -69], [11, -69], [0, -57], [-5, -76], [5, -76]]) {
    ctx.beginPath(); ctx.arc(dx * r, dy * r, r * 4.2, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = "#e8b48f"; // ears
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(s * r * 13.5, -r * 66, r * 2.5, r * 4, 0, 0, Math.PI * 2); ctx.fill(); }
  // The knitted kippah on top (in this sled's color, with a white pattern around the edge).
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(0, -r * 77, r * 9.5, r * 5.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#ffffff"; ctx.lineWidth = r * 1.1;
  ctx.setLineDash([r * 1.6, r * 1.2]);
  ctx.beginPath(); ctx.ellipse(0, -r * 77, r * 7, r * 3.8, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.setLineDash([]);
  ctx.scale(1, 1 / 0.9);
  ctx.translate(-hx, -hy);

  // A little Israeli flag on a stick at the back corner, waving in the wind.
  const [px, py] = at(-38, 18, 2);
  const stick = 46 * r;
  ctx.strokeStyle = "#6b4423"; ctx.lineWidth = r * 2;
  ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py - stick); ctx.stroke();
  const fw = 24 * r, fh = 16 * r;
  const wave = (t) => Math.sin(time * 9 + t * 4) * r * 1.6 * t;
  const fx = px, fy = py - stick;
  const band = (y0, y1, fill) => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    for (let k = 0; k <= 6; k++) { const t = k / 6; ctx[k === 0 ? "moveTo" : "lineTo"](fx - t * fw, fy + y0 * fh + wave(t)); }
    for (let k = 6; k >= 0; k--) { const t = k / 6; ctx.lineTo(fx - t * fw, fy + y1 * fh + wave(t)); }
    ctx.fill();
  };
  band(0, 1, "#ffffff");
  band(0.1, 0.24, "#1d4ed8");
  band(0.76, 0.9, "#1d4ed8");
  // The Star of David in the middle: two triangles.
  const sx = fx - fw * 0.5, sy = fy + fh * 0.5 + wave(0.5), sr = fh * 0.2;
  ctx.strokeStyle = "#1d4ed8"; ctx.lineWidth = Math.max(0.6, r * 0.9);
  for (const flip of [1, -1]) {
    ctx.beginPath();
    for (let k = 0; k < 3; k++) {
      const angle = -Math.PI / 2 * flip + k * Math.PI * 2 / 3;
      const X = sx + Math.cos(angle) * sr, Y = sy + Math.sin(angle) * sr;
      if (k === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
    }
    ctx.closePath(); ctx.stroke();
  }
  ctx.restore();

  // A name above other players' sleds.
  if (name) {
    const fontSize = Math.max(10, Math.min(22, u * 14));
    ctx.font = `800 ${fontSize}px Rubik, Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(15, 23, 42, 0.8)";
    ctx.strokeText(name, cx, bottom - u * 110);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(name, cx, bottom - u * 110);
  }
}

// Two "#rrggbb" colors mixed: t = 0 → all the first, 1 → all the second.
function mixedColor(a, b, t) {
  return rgbText(mixRgb(hexToRgb(a), hexToRgb(b), t));
}

// A color made lighter (amount > 0) or darker (amount < 0). Works with "#rrggbb" colors.
function shadeColor(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c) => Math.round(amount < 0 ? c * (1 + amount) : c + (255 - c) * amount);
  const r = mix(n >> 16), g = mix((n >> 8) & 255), b = mix(n & 255);
  return `rgb(${r}, ${g}, ${b})`;
}


// ---------- Fitting words into a box ----------

// Split text into lines that fit `maxWidth` (breaking between words).
function wrapLines(ctx, text, maxWidth) {
  const words = String(text).split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (line && ctx.measureText(test).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Write text centered in a box, as big as fits (up to `maxSize`), on up to 2 lines.
function drawTextInBox(ctx, text, x, y, boxW, boxH, maxSize, color, hebrew, weight = 800) {
  let size = Math.min(maxSize, boxH * 0.62);
  let lines;
  ctx.direction = hebrew ? "rtl" : "ltr";
  for (;;) {
    ctx.font = `${weight} ${size}px Rubik, Arial, sans-serif`;
    lines = wrapLines(ctx, text, boxW * 0.92);
    const tooWide = lines.some((l) => ctx.measureText(l).width > boxW * 0.92);
    if ((lines.length <= 2 && !tooWide && lines.length * size * 1.1 <= boxH * 0.92) || size <= 6) break;
    size *= 0.9;
  }
  if (size < 5) { ctx.direction = "ltr"; return; }
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const shown = Math.min(lines.length, 2);
  lines.slice(0, 2).forEach((l, i) => {
    ctx.fillText(l, x, y + (i - (shown - 1) / 2) * size * 1.1);
  });
  ctx.textBaseline = "alphabetic";
  ctx.direction = "ltr";
}

function roundedBox(ctx, x, y, w, h, r, fill, stroke, lineWidth) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth || 2; ctx.stroke(); }
}

// ---------- An answer gate ----------
// A frame across the track: the English word on top, and one Hebrew answer hanging
// over each lane. You drive under the answer you think is right.
// info = { english, choices: [left, middle, right] }, or null = not your question yet (shows "?").
const LANE_COLORS = ["#2563eb", "#7c3aed", "#0e7490"];

function drawGate(ctx, w, seg, info) {
  const a = seg.p1.screen;
  if (seg.hidden && a.y - 2600 * a.scale * w / 2 > seg.clip) return; // completely behind a hill
  const unit = a.scale * w / 2;   // pixels per track unit, at this distance
  const tall = 2600 * unit; // (big, so you can read it from far away)
  if (tall < 6) return;
  const gate = seg.gate || { center: 0, half: seg.width };
  const middle = a.x + a.w * gate.center / seg.width, halfW = a.w * gate.half / seg.width;
  const poleW = Math.max(2, halfW * 0.035);
  const edges = [-1, -1 / 3, 1 / 3, 1].map((t) => middle + halfW * t);
  const top = a.y - tall;
  ctx.fillStyle = "#334155";
  for (const x of edges) ctx.fillRect(x - poleW / 2, top, poleW, tall);
  const beamH = tall * 0.06;
  ctx.fillRect(edges[0] - poleW / 2, top, edges[3] - edges[0] + poleW, beamH);

  // The English word, on a white sign above the frame.
  const signW = halfW * 0.8, signH = tall * 0.2;
  roundedBox(ctx, middle - signW / 2, top - signH, signW, signH, signH * 0.2, "#ffffff", "#1e3a8a", Math.max(1, signH * 0.06));
  drawTextInBox(ctx, info ? info.english : "🎁 ?", middle, top - signH / 2, signW, signH, 200, "#1e3a8a", false);

  // One Hebrew answer over each lane.
  const panelTop = top + beamH;
  const panelH = tall * 0.26;
  for (let lane = 0; lane < 3; lane++) {
    const gap = (edges[lane + 1] - edges[lane]) * 0.05;
    const left = edges[lane] + poleW / 2 + gap / 2;
    const width = edges[lane + 1] - edges[lane] - poleW - gap;
    roundedBox(ctx, left, panelTop, width, panelH, panelH * 0.12, LANE_COLORS[lane], "#ffffff", Math.max(1, panelH * 0.04));
    const tried = info && info.wrong && info.wrong[lane]; // (an answer I already tried: grayed out, with a ✗)
    if (tried) roundedBox(ctx, left, panelTop, width, panelH, panelH * 0.12, "#64748b", "#ffffff", Math.max(1, panelH * 0.04));
    drawTextInBox(ctx, tried ? "✗" : info ? info.choices[lane] : "?", left + width / 2, panelTop + panelH / 2, width, panelH, 200, "#ffffff", true);
  }
}

// ---------- The race info on top ----------

// Hebrew on top (bigger), English underneath (smaller). align = "center", "left" or "right" of x.
function drawBilingualText(ctx, hebrew, english, x, y, size, color = "#ffffff", align = "center") {
  ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(15, 23, 42, 0.75)";
  ctx.fillStyle = color;
  ctx.font = `800 ${size}px Rubik, Arial, sans-serif`;
  ctx.direction = "rtl";
  ctx.textAlign = align;
  ctx.lineWidth = Math.max(3, size / 7);
  ctx.strokeText(hebrew, x, y);
  ctx.fillText(hebrew, x, y);
  ctx.direction = "ltr";
  ctx.textAlign = align;
  if (english) {
    const small = Math.round(size * 0.5);
    ctx.font = `600 ${small}px Rubik, Arial, sans-serif`;
    ctx.lineWidth = Math.max(2, small / 6);
    ctx.strokeText(english, x, y + small * 1.3);
    ctx.fillText(english, x, y + small * 1.3);
  }
  ctx.textAlign = "center";
}

const PANEL_COLORS = { right: "rgba(22, 163, 74, 0.8)", wrong: "rgba(220, 38, 38, 0.8)", missed: "rgba(71, 85, 105, 0.8)" };

// The question panel at the top: ONE thin row. The English word on the left, then the 3 Hebrew
// answers, in the same order as the lanes (left, middle, right). The lane I'm in has a yellow frame.
// (It used to be two rows and twice as tall: on a phone it covered the path ahead. RACE.panelSee
// and RACE.panelWide in rules.js.)
// Returns where the panel ends (so other things can go under it).
function drawGatePanel(ctx, w, size, gate) {
  const panelW = Math.min(w * RACE.panelWide, 620);
  const x = (w - panelW) / 2;
  const y = 4;
  const answerH = size * 1.45;
  const panelH = answerH + 8;
  const wordW = panelW * 0.31; // (the English word gets this much of the row)
  if (RACE.panelSee > 0) roundedBox(ctx, x, y, panelW, panelH, 12, `rgba(15, 23, 42, ${RACE.panelSee})`);
  drawTextInBox(ctx, gate.english, x + wordW / 2 + 2, y + panelH / 2, wordW - 8, panelH, size * 1.05, "#ffffff", false);
  const boxW = (panelW - wordW - 10) / 3;
  const boxY = y + 4;
  for (let lane = 0; lane < 3; lane++) {
    const bx = x + wordW + 2 + lane * (boxW + 2);
    const mine = lane === gate.myLane;
    const tried = gate.wrong && gate.wrong[lane]; // (an answer I already tried: grayed out, with a ✗)
    roundedBox(ctx, bx, boxY, boxW, answerH, 10, tried ? "#64748b" : LANE_COLORS[lane], mine ? "#fde047" : null, 3);
    drawTextInBox(ctx, tried ? "✗ " + gate.choices[lane] : gate.choices[lane], bx + boxW / 2, boxY + answerH / 2, boxW - 6, answerH, size, tried ? "#cbd5e1" : "#ffffff", true);
  }
  return y + panelH;
}

// After a gate: "Correct!" (green), "Not that one: try again!" (red) or "Go THROUGH the gate" (gray), at the top.
// (A wrong answer does not show the right one: the gate bounces you back for another try.)
function drawGateFeedback(ctx, w, size, feedback) {
  const panelW = Math.min(w * 0.5, 480);
  const x = (w - panelW) / 2;
  const panelH = size * 2; // (smaller than it was, 2.6: it covered the path ahead on a phone)
  roundedBox(ctx, x, 6, panelW, panelH, 14, PANEL_COLORS[feedback.kind]);
  const e = feedback.entry;
  let he, en;
  if (feedback.kind === "right") { he = `✅ נָכוֹן! ${e.hebrew}`; en = `Correct! ${e.english} = ${e.hebrew} · ⚡ Boost + 🎁 gift!`; }
  else if (feedback.kind === "wrong") { he = "❌ לֹא נָכוֹן. נַסּוּ שׁוּב!"; en = `Not that one. Try again: ${e.english}`; }
  else { he = "↩ עוֹבְרִים דֶּרֶךְ הַשַּׁעַר!"; en = `Go THROUGH the gate: ${e.english}`; }
  drawTextInBox(ctx, he, w / 2, 6 + panelH * 0.38, panelW - 20, panelH * 0.62, size * 1.1, "#ffffff", true);
  drawTextInBox(ctx, en, w / 2, 6 + panelH * 0.8, panelW - 20, panelH * 0.3, size * 0.55, "#f1f5f9", false, 600);
  return 6 + panelH;
}

// info = { progress: { me, others: [{ at, color }] } (0 = start, 1 = the Kinneret), place, racers, kmh, countdown (a number, "go", or null), finishedPlace,
//          deepSnow, showArrows, gate (the question, or null), feedback (or null), boosting }
function drawRaceHud(ctx, w, h, info) {
  const size = Math.max(16, Math.min(28, h * 0.06));
  drawProgressBar(ctx, w, size, info.progress);

  let below = 6;
  if (info.finishedPlace) {
    drawBilingualText(ctx, `🏁 סִיַּמְתֶּם! מָקוֹם ${info.finishedPlace}`, `You finished! ${ordinal(info.finishedPlace)} place`, w / 2, h * 0.3, size * 1.6, "#fde047");
  } else if (info.feedback) {
    below = drawGateFeedback(ctx, w, size, info.feedback);
  } else if (info.gate) {
    // (It fades away just before the gate, so you can see the real gate you drive under.)
    ctx.globalAlpha = info.gate.fade === undefined ? 1 : info.gate.fade;
    below = drawGatePanel(ctx, w, size, info.gate);
    ctx.globalAlpha = 1;
  }
  // My place, bottom left. My speed, bottom right.
  // (Clear of the buttons in the corners: on a sideways phone there are two side by side, a skid button and a steering arrow; in easy mode just one arrow.)
  const cornerX = w >= 640 ? (info.easy ? 138 : 232) + size * 3 : Math.max(70, w * 0.1) + 104;
  drawBilingualText(ctx, `מָקוֹם ${info.place}`, `${ordinal(info.place)} of ${info.racers}`, cornerX, h - size * 1.2, size * 1.2, "#fde047");
  drawBilingualText(ctx, `${info.kmh} קמ״ש`, "km/h", w - cornerX, h - size * 1.2, size);
  if (info.spinning) drawBilingualText(ctx, "🌀 מִסְתּוֹבְבִים!", "Spinning out!", w - cornerX, h - size * 3.2, size * 0.9, "#fca5a5");
  else if (info.flying) drawBilingualText(ctx, "🛷 קְפִיצָה!", "Jump!", w - cornerX, h - size * 3.2, size * 0.9, "#bae6fd");
  else if (info.skidding) drawBilingualText(ctx, "💨 הַחְלָקָה!", "Skid!", w - cornerX, h - size * 3.2, size * 0.9, "#bae6fd");
  else if (info.boosting) drawBilingualText(ctx, "⚡ טוּרְבּוֹ!", "Boost!", w - cornerX, h - size * 3.2, size * 0.9, "#fde047");
  if (info.deepSnow && !info.finishedPlace) {
    drawBilingualText(ctx, "מִחוּץ לַשְּׁבִיל — אִטִּי!", "❄️ Off the path — slow!", w / 2, below + size * 1.1, size * 0.75, "#bae6fd");
  }
  if (info.showHint) drawSteerHint(ctx, w, h, size, info.easy);
  if (info.countdown !== null) {
    const go = info.countdown === "go";
    drawBilingualText(ctx, go ? "יוֹצְאִים!" : String(info.countdown), go ? "Go!" : "", w / 2, h * 0.5, size * (go ? 2.6 : 3.4), go ? "#4ade80" : "#ffffff");
  }
}

// At the start of every race: a box near the top that says what the buttons do.
// (The arrows and the skid buttons themselves are real, faded buttons at the bottom of the
// screen all race long: see .steer-pad and .skid-button in style.css.)
// Easy mode: the sled follows the path by itself, and the arrows change lanes.
function drawSteerHint(ctx, w, h, size, easy) {
  const boxW = Math.min(w - Math.max(56, w * 0.16), 460), boxH = size * 4.4;
  if (boxW < 120) return; // (no room on a very narrow screen)
  const top = size * 1.5; // (near the top: above the 3… 2… 1…, and not over my sled)
  roundedBox(ctx, (w - boxW) / 2, top, boxW, boxH, 14, "rgba(15, 23, 42, 0.62)");
  if (easy) {
    drawTextInBox(ctx, "הַמִּזְחֶלֶת נוֹסַעַת לְבַד", w / 2, top + boxH * 0.16, boxW - 16, boxH * 0.26, size * 0.95, "#ffffff", true);
    drawTextInBox(ctx, "Easy mode: the sled follows the path by itself", w / 2, top + boxH * 0.36, boxW - 16, boxH * 0.16, size * 0.55, "#e2e8f0", false, 600);
    drawTextInBox(ctx, "◀ ▶ הַחִצִּים: מַחֲלִיפִים נָתִיב", w / 2, top + boxH * 0.62, boxW - 16, boxH * 0.26, size * 0.95, "#fde047", true);
    drawTextInBox(ctx, "Tap ◀ or ▶ to change lanes", w / 2, top + boxH * 0.84, boxW - 16, boxH * 0.16, size * 0.55, "#e2e8f0", false, 600);
    return;
  }
  drawTextInBox(ctx, "◀ ▶ מַחֲזִיקִים חֵץ: פּוֹנִים", w / 2, top + boxH * 0.16, boxW - 16, boxH * 0.26, size * 0.95, "#ffffff", true);
  drawTextInBox(ctx, "Hold ◀ or ▶ (or anywhere on that side) to turn", w / 2, top + boxH * 0.36, boxW - 16, boxH * 0.16, size * 0.55, "#e2e8f0", false, 600);
  drawTextInBox(ctx, "כַּפְתּוֹרֵי הַהַחְלָקָה: רַק לְסִיבוּב חַד", w / 2, top + boxH * 0.62, boxW - 16, boxH * 0.26, size * 0.95, "#fde047", true);
  drawTextInBox(ctx, "Skid buttons: only for a very sharp bend (sharper, but slower)", w / 2, top + boxH * 0.84, boxW - 16, boxH * 0.16, size * 0.55, "#e2e8f0", false, 600);
}

// Top left: how far down the mountain everyone is. ⛰️ = the start, 🌊 = the Kinneret.
// My dot is big and yellow; the other sleds are small dots in their colors.
function drawProgressBar(ctx, w, size, progress) {
  const x = 14, y = 10;
  const barW = Math.min(230, w * 0.24);
  ctx.font = `${Math.round(size * 0.8)}px Rubik, Arial, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  const lineY = y + size * 0.55;
  ctx.fillText("⛰️", x, lineY);
  ctx.fillText("🌊", x + barW + size * 0.9, lineY);
  const left = x + size * 1.05, right = x + barW + size * 0.75;
  roundedBox(ctx, left, lineY - 4, right - left, 8, 4, "rgba(15, 23, 42, 0.55)");
  roundedBox(ctx, left, lineY - 4, (right - left) * progress.me, 8, 4, "#fde047");
  for (const other of progress.others) {
    ctx.fillStyle = other.color;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(left + (right - left) * other.at, lineY, size * 0.22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  ctx.fillStyle = "#fde047";
  ctx.strokeStyle = "#1f2937";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(left + (right - left) * progress.me, lineY, size * 0.32, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.textBaseline = "alphabetic";
  drawBilingualText(ctx, "לַכִּנֶּרֶת", "To the Kinneret", (left + right) / 2, lineY + size * 1.25, size * 0.6);
}


// White speed lines flying past while boosting.
function drawBoostLines(ctx, w, h, time) {
  ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
  ctx.lineWidth = 2;
  const cx = w / 2, cy = h * RACE.horizon;
  const far = Math.max(w, h);
  for (let i = 0; i < 26; i++) {
    const angle = (i / 26) * Math.PI * 2 + i * 1.7;
    if (Math.sin(angle) < -0.2) continue; // (not up in the sky)
    const t = (time * 2.2 + i * 0.37) % 1; // each line slides outward, then starts again
    const r1 = far * (0.25 + t * 0.55);
    const r2 = r1 + far * 0.12;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
    ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
    ctx.stroke();
  }
}

// Snowflakes drifting down past the camera, up high on the mountain. amount = 0 (none) … 1 (the top).
// speed = how fast I'm going (0 … 1): the flakes rush toward me a bit when I'm fast.
// Each flake's path comes from `hash`, so nothing has to be stored.
function drawSnowfall(ctx, w, h, time, amount, speed, pan) {
  if (amount <= 0.02) return;
  ctx.fillStyle = "#ffffff";
  const count = Math.round(70 * amount);
  for (let i = 0; i < count; i++) {
    const fall = 0.06 + hash(i, 21) * 0.08 + speed * 0.12;   // how fast it falls (screens per second)
    const t = (time * fall + hash(i, 22)) % 1;               // 0 = top of the screen, 1 = bottom
    const size = 1 + hash(i, 23) * 2.5 * (0.6 + t);          // near the bottom = closer = bigger
    const x = ((hash(i, 24) * w + Math.sin(time * (0.8 + hash(i, 25)) + i) * 18 + pan * 0.4) % w + w) % w;
    ctx.globalAlpha = 0.85 * amount * Math.min(1, t * 6);
    ctx.beginPath(); ctx.arc(x, t * h, size, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}
