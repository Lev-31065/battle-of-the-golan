// race-draw.js — draws Mt Hermon Racing: the snowy track, the mountains, the trees,
// the sleds and the race info on top (lap, place, speed, countdown).
//
// How the "3D" works (a trick old arcade racing games used, called pseudo-3D):
// the track is a row of short flat pieces (race-track.js). For each piece we work out
// where its near end and far end land on the screen ("projecting"): far-away pieces are
// small and near the middle of the screen, close ones are wide and near the bottom.
// Then we paint each piece as a flat shape, from near to far. Nothing is really 3D,
// but it looks like it, and it's fast enough for any phone.

// The camera: `depth` comes from how wide it sees (the field of view). `playerZ` is how
// far in front of the camera my sled sits.
const raceCamera = { depth: 1 / Math.tan((RACE.fieldOfView / 2) * Math.PI / 180) };
raceCamera.playerZ = RACE.cameraHeight * raceCamera.depth;

const SLED_WIDTH = 420; // a sled's width in track units

const RACE_COLORS = {
  snow: "#f6f9fd", snowDark: "#e2ebf5",           // the snow beside the track (light/dark stripes)
  track: "#d3e4f2", trackDark: "#c6d9ea",         // the packed-snow track
  edge: "#ffffff", edgeDark: "#e11d48",           // the red and white edge stripes
  lane: "rgba(255, 255, 255, 0.9)",               // the lane lines
  mist: "#eef5fb",                                // far-away things fade into this
};

const lerp = (a, b, t) => a + (b - a) * t;

// Where a point on the track lands on the screen. `w` and `h` are the screen size.
function projectPoint(p, cameraX, cameraY, cameraZ, w, h) {
  p.camera.x = 0 - cameraX;
  p.camera.y = p.world.y - cameraY;
  p.camera.z = p.world.z - cameraZ;
  p.screen.scale = raceCamera.depth / p.camera.z;
  p.screen.x = Math.round(w / 2 + p.screen.scale * p.camera.x * w / 2);
  p.screen.y = Math.round(h / 2 - p.screen.scale * p.camera.y * h / 2);
  p.screen.w = Math.round(p.screen.scale * RACE.roadWidth * w / 2);
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

// ---------- The sky and the mountains ----------

// A wavy mountain line. `t` goes 0 → 1 around a full circle, so the line joins up
// with itself and the mountains can scroll forever as you turn.
function ridge(t, waves) {
  let y = 0;
  for (const [k, amount, shift] of waves) y += amount * Math.sin(2 * Math.PI * (k * t + shift));
  return y;
}
const HERMON_WAVES = [[1, 0.55, 0.1], [2, 0.25, 0.4], [3, 0.12, 0.7], [7, 0.05, 0.2], [13, 0.025, 0.5]];
const HILL_WAVES = [[2, 0.5, 0.3], [3, 0.3, 0.8], [5, 0.2, 0.1], [11, 0.08, 0.6]];

// `turn` goes up as you turn right and down as you turn left, so the mountains slide
// sideways. Far mountains slide slowly, near hills slide faster (that's "parallax").
function drawRaceSky(ctx, w, h, turn) {
  const horizon = h * 0.53;
  const sky = ctx.createLinearGradient(0, 0, 0, horizon);
  sky.addColorStop(0, "#4ea4e6");
  sky.addColorStop(1, "#d4ebfa");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, horizon + 2);
  // The sun.
  ctx.fillStyle = "rgba(255, 250, 220, 0.9)";
  ctx.beginPath();
  ctx.arc(w * 0.8, h * 0.12, Math.max(14, h * 0.05), 0, Math.PI * 2);
  ctx.fill();

  // Far away: Mt Hermon itself, gray-blue with a snowy top.
  const farShift = turn * 0.15;
  const mountainY = (x) => horizon - h * (0.15 + 0.11 * ridge(((x / w) * 0.5 + farShift) % 1 + 1, HERMON_WAVES));
  ctx.beginPath();
  ctx.moveTo(0, horizon);
  for (let x = 0; x <= w + 4; x += 4) ctx.lineTo(x, mountainY(x));
  ctx.lineTo(w, horizon);
  ctx.closePath();
  ctx.fillStyle = "#8ea8c3";
  ctx.fill();
  // The snow cap: everything above a wobbly line, inside the mountain.
  ctx.save();
  ctx.clip();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  for (let x = 0; x <= w + 6; x += 6) {
    const t = (x / w) * 0.5 + farShift;
    ctx.lineTo(x, horizon - h * 0.15 + h * 0.012 * Math.sin(t * 90));
  }
  ctx.lineTo(w, 0);
  ctx.closePath();
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.restore();

  // Closer: low snowy hills with a line of dark pine trees on top.
  const nearShift = turn * 0.4;
  const hillY = (x) => horizon - h * (0.035 + 0.025 * ridge(((x / w) * 0.5 + nearShift) % 1 + 1, HILL_WAVES));
  ctx.beginPath();
  ctx.moveTo(0, horizon + 2);
  for (let x = 0; x <= w + 4; x += 4) ctx.lineTo(x, hillY(x));
  ctx.lineTo(w, horizon + 2);
  ctx.closePath();
  ctx.fillStyle = "#e9f1f8";
  ctx.fill();
  ctx.fillStyle = "#3d5a4c";
  const step = Math.max(6, w / 120);
  const first = Math.floor((nearShift * w * 2) / step);
  for (let i = first; i * step < nearShift * w * 2 + w + step; i++) {
    // The same trees every time: "random" from the tree's number.
    const r = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
    if (r < 0.45) continue;
    const x = i * step - nearShift * w * 2;
    const base = hillY(x) + 2;
    const tall = h * (0.012 + r * 0.02);
    ctx.beginPath();
    ctx.moveTo(x - tall * 0.35, base);
    ctx.lineTo(x, base - tall);
    ctx.lineTo(x + tall * 0.35, base);
    ctx.fill();
  }
  // Snow all the way down (the track gets painted on top).
  ctx.fillStyle = RACE_COLORS.snow;
  ctx.fillRect(0, horizon + 1, w, h - horizon);
}

// ---------- One piece of track ----------

function drawSegment(ctx, w, seg, mist) {
  const a = seg.p1.screen; // near end (lower on the screen)
  const b = seg.p2.screen; // far end
  const edgeA = a.w / 6, edgeB = b.w / 6;
  ctx.fillStyle = seg.dark ? RACE_COLORS.snowDark : RACE_COLORS.snow;
  ctx.fillRect(0, b.y, w, a.y - b.y + 1); // (+1 so no thin gaps show between pieces)
  const edge = seg.dark ? RACE_COLORS.edgeDark : RACE_COLORS.edge;
  polygon(ctx, a.x - a.w - edgeA, a.y, a.x - a.w, a.y, b.x - b.w, b.y, b.x - b.w - edgeB, b.y, edge);
  polygon(ctx, a.x + a.w + edgeA, a.y, a.x + a.w, a.y, b.x + b.w, b.y, b.x + b.w + edgeB, b.y, edge);
  polygon(ctx, a.x - a.w, a.y, a.x + a.w, a.y, b.x + b.w, b.y, b.x - b.w, b.y, seg.dark ? RACE_COLORS.trackDark : RACE_COLORS.track);

  if (seg.index <= 1) {
    // The start/finish line: black and white squares, two rows.
    const columns = 12;
    for (let row = 0; row < 2; row++) {
      const yA = lerp(a.y, b.y, row / 2), yB = lerp(a.y, b.y, (row + 1) / 2);
      const xA = lerp(a.x, b.x, row / 2), xB = lerp(a.x, b.x, (row + 1) / 2);
      const wA = lerp(a.w, b.w, row / 2), wB = lerp(a.w, b.w, (row + 1) / 2);
      for (let c = 0; c < columns; c++) {
        const color = (c + row + seg.index * 2) % 2 === 0 ? "#111827" : "#ffffff";
        const l = c / columns * 2 - 1, r = (c + 1) / columns * 2 - 1;
        polygon(ctx, xA + wA * l, yA, xA + wA * r, yA, xB + wB * r, yB, xB + wB * l, yB, color);
      }
    }
  } else if (!seg.dark) {
    // Dashed lines between the lanes.
    const lineA = a.w / 24, lineB = b.w / 24;
    for (let lane = 1; lane < RACE.lanes; lane++) {
      const t = lane / RACE.lanes * 2 - 1;
      const xA = a.x + a.w * t, xB = b.x + b.w * t;
      polygon(ctx, xA - lineA / 2, a.y, xA + lineA / 2, a.y, xB + lineB / 2, b.y, xB - lineB / 2, b.y, RACE_COLORS.lane);
    }
  }

  // Far away, everything fades into the mountain mist.
  if (mist > 0.02) {
    ctx.globalAlpha = mist;
    ctx.fillStyle = RACE_COLORS.mist;
    ctx.fillRect(0, b.y, w, a.y - b.y + 1);
    ctx.globalAlpha = 1;
  }
}

// ---------- Trees, snowmen, flags, cabins (painted once, then reused) ----------
// Each picture is painted once onto its own little hidden canvas. After that, drawing
// it is just "copy this picture, this big, here", which is very fast.

const spritePictures = {};

function spritePicture(type) {
  if (spritePictures[type]) return spritePictures[type];
  const size = SPRITE_SIZES[type];
  const H = 320;
  const W = Math.round(H * size.w / size.h);
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d");
  if (type === "pine" || type === "bigPine") paintPine(g, W, H);
  else if (type === "snowman") paintSnowman(g, W, H);
  else if (type === "rock") paintRock(g, W, H);
  else if (type === "cabin") paintCabin(g, W, H);
  else if (type === "flagRed") paintFlag(g, W, H, "#e11d48");
  else if (type === "flagBlue") paintFlag(g, W, H, "#2563eb");
  spritePictures[type] = c;
  return c;
}

function paintPine(g, W, H) {
  const cx = W / 2;
  g.fillStyle = "#6b4423"; // the trunk
  g.fillRect(cx - W * 0.06, H * 0.84, W * 0.12, H * 0.16);
  for (let i = 0; i < 4; i++) {
    const bottom = H * (0.88 - i * 0.19);
    const top = bottom - H * 0.34;
    const half = W * 0.5 * (1 - i * 0.2);
    // Dark green on the left, lighter on the right (the sun is on the right).
    g.fillStyle = "#1f4d36";
    g.beginPath(); g.moveTo(cx - half, bottom); g.lineTo(cx, top); g.lineTo(cx, bottom); g.fill();
    g.fillStyle = "#2f6b4c";
    g.beginPath(); g.moveTo(cx, top); g.lineTo(cx + half, bottom); g.lineTo(cx, bottom); g.fill();
    // Snow on the branches.
    g.fillStyle = "#f1f6fb";
    g.beginPath(); g.moveTo(cx - half * 0.42, top + H * 0.14); g.lineTo(cx, top); g.lineTo(cx + half * 0.42, top + H * 0.14);
    g.quadraticCurveTo(cx, top + H * 0.1, cx - half * 0.42, top + H * 0.14); g.fill();
    for (let k = -2; k <= 2; k++) {
      g.beginPath();
      g.ellipse(cx + k * half * 0.38, bottom - H * 0.012, half * 0.16, H * 0.016, 0, 0, Math.PI * 2);
      g.fill();
    }
  }
}

function paintSnowman(g, W, H) {
  const cx = W / 2;
  const ball = (y, r) => {
    g.fillStyle = "#ffffff";
    g.beginPath(); g.arc(cx, y, r, 0, Math.PI * 2); g.fill();
    g.fillStyle = "rgba(140, 170, 200, 0.35)"; // a blue shadow on the left
    g.beginPath(); g.arc(cx - r * 0.15, y + r * 0.1, r, Math.PI * 0.55, Math.PI * 1.45); g.arc(cx, y, r, Math.PI * 1.45, Math.PI * 0.55, true); g.fill();
  };
  const r1 = W * 0.42, r2 = W * 0.31, r3 = W * 0.22;
  const y1 = H - r1, y2 = y1 - r1 - r2 * 0.7, y3 = y2 - r2 - r3 * 0.7;
  // Stick arms, waving.
  g.strokeStyle = "#5b3a1e"; g.lineWidth = W * 0.035; g.lineCap = "round";
  g.beginPath(); g.moveTo(cx - r2 * 0.8, y2); g.lineTo(cx - W * 0.5, y2 - r2 * 1.1); g.stroke();
  g.beginPath(); g.moveTo(cx + r2 * 0.8, y2); g.lineTo(cx + W * 0.5, y2 - r2 * 0.6); g.stroke();
  ball(y1, r1); ball(y2, r2); ball(y3, r3);
  g.fillStyle = "#dc2626"; // scarf
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

function paintRock(g, W, H) {
  g.fillStyle = "#6b7280";
  g.beginPath();
  g.moveTo(0, H); g.lineTo(W * 0.08, H * 0.45); g.lineTo(W * 0.35, H * 0.12); g.lineTo(W * 0.7, H * 0.2);
  g.lineTo(W * 0.95, H * 0.55); g.lineTo(W, H); g.closePath(); g.fill();
  g.fillStyle = "#4b5563";
  g.beginPath(); g.moveTo(W * 0.55, H); g.lineTo(W * 0.7, H * 0.2); g.lineTo(W * 0.95, H * 0.55); g.lineTo(W, H); g.fill();
  g.fillStyle = "#f8fafc"; // snow on top
  g.beginPath(); g.moveTo(W * 0.12, H * 0.42); g.lineTo(W * 0.35, H * 0.12); g.lineTo(W * 0.7, H * 0.2); g.lineTo(W * 0.88, H * 0.45);
  g.quadraticCurveTo(W * 0.5, H * 0.32, W * 0.12, H * 0.42); g.fill();
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
  g.strokeStyle = "#5b3a1e"; g.lineWidth = H * 0.015; g.strokeRect(W * 0.2, H * 0.62, W * 0.2, H * 0.16);
  g.fillStyle = "rgba(220, 230, 240, 0.7)"; // smoke
  for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(W * (0.66 + i * 0.05), H * (0.08 - i * 0.03), H * (0.03 + i * 0.012), 0, Math.PI * 2); g.fill(); }
}

function paintFlag(g, W, H, color) {
  g.fillStyle = "#475569"; g.fillRect(W * 0.1, 0, W * 0.16, H);
  g.fillStyle = color;
  g.beginPath(); g.moveTo(W * 0.26, H * 0.02); g.lineTo(W, H * 0.12); g.lineTo(W * 0.26, H * 0.24); g.fill();
}

// ---------- A sled, seen from behind ----------
// cx, bottom = where it sits on the screen. size = its width in pixels.
// steer (-1 … 1) tilts it into the turn.
function drawSled(ctx, cx, bottom, size, color, steer, time, name) {
  const u = size / 100;
  ctx.save();
  // A soft shadow on the snow.
  ctx.fillStyle = "rgba(30, 60, 90, 0.18)";
  ctx.beginPath(); ctx.ellipse(cx, bottom - u * 2, u * 54, u * 8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.translate(cx, bottom);
  ctx.rotate(steer * 0.13);
  // The two metal runners, curling up at the back.
  ctx.strokeStyle = "#334155"; ctx.lineWidth = u * 5; ctx.lineCap = "round";
  for (const s of [-1, 1]) {
    ctx.beginPath(); ctx.moveTo(s * u * 36, -u * 4); ctx.lineTo(s * u * 36, -u * 13);
    ctx.arc(s * u * 36 - s * u * 5, -u * 13, u * 5, s > 0 ? 0 : Math.PI, Math.PI * 1.5, s < 0); ctx.stroke();
  }
  // The wooden seat.
  ctx.fillStyle = "#a0522d";
  ctx.beginPath(); ctx.moveTo(-u * 46, -u * 12); ctx.lineTo(u * 46, -u * 12); ctx.lineTo(u * 42, -u * 22); ctx.lineTo(-u * 42, -u * 22); ctx.fill();
  ctx.fillStyle = "#7c3f1d"; ctx.fillRect(-u * 46, -u * 14, u * 92, u * 2.5);
  // The rider's jacket (in this sled's color), sitting up.
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-u * 30, -u * 20); ctx.lineTo(u * 30, -u * 20);
  ctx.quadraticCurveTo(u * 27, -u * 56, u * 18, -u * 62);
  ctx.lineTo(-u * 18, -u * 62);
  ctx.quadraticCurveTo(-u * 27, -u * 56, -u * 30, -u * 20);
  ctx.fill();
  // Arms holding on to the sides.
  ctx.strokeStyle = shadeColor(color, -0.25); ctx.lineWidth = u * 9;
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s * u * 22, -u * 54); ctx.quadraticCurveTo(s * u * 38, -u * 40, s * u * 40, -u * 22); ctx.stroke(); }
  ctx.fillStyle = "#1f2937"; // mittens
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(s * u * 40, -u * 21, u * 5, 0, Math.PI * 2); ctx.fill(); }
  // The scarf tail flaps in the wind, away from the turn.
  const flap = Math.sin(time * 14) * u * 3;
  ctx.fillStyle = "#facc15";
  ctx.beginPath(); ctx.moveTo(-u * 6, -u * 60); ctx.quadraticCurveTo(-u * 20 - steer * u * 10, -u * 56 + flap, -u * 30 - steer * u * 14, -u * 50 - flap);
  ctx.lineTo(-u * 26 - steer * u * 14, -u * 45 - flap); ctx.quadraticCurveTo(-u * 16, -u * 52, -u * 2, -u * 55); ctx.fill();
  ctx.fillRect(-u * 17, -u * 64, u * 34, u * 7);
  // Head: hair, then a warm hat with a pom-pom.
  ctx.fillStyle = "#5b3a1e";
  ctx.beginPath(); ctx.arc(0, -u * 74, u * 14, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#f8fafc";
  ctx.beginPath(); ctx.arc(0, -u * 77, u * 14.5, Math.PI, 0); ctx.fill();
  ctx.fillStyle = color; ctx.fillRect(-u * 14.5, -u * 79, u * 29, u * 5);
  ctx.fillStyle = "#f8fafc"; ctx.beginPath(); ctx.arc(0, -u * 93, u * 6, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  // Name above other players' sleds.
  if (name) {
    const fontSize = Math.max(10, Math.min(22, u * 14));
    ctx.font = `800 ${fontSize}px Rubik, Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(15, 23, 42, 0.8)";
    ctx.strokeText(name, cx, bottom - u * 104);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(name, cx, bottom - u * 104);
  }
}

// A color made lighter (amount > 0) or darker (amount < 0). Works with "#rrggbb" colors.
function shadeColor(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c) => Math.round(amount < 0 ? c * (1 + amount) : c + (255 - c) * amount);
  const r = mix(n >> 16), g = mix((n >> 8) & 255), b = mix(n & 255);
  return `rgb(${r}, ${g}, ${b})`;
}

// ---------- The whole picture ----------
// scene = {
//   cameraZ:  how far along the track the camera is
//   cameraX:  how far left/right the camera is (my sled's sideways spot)
//   turn:     for sliding the mountains as you turn
//   time:     the clock (for flapping scarves)
//   sleds:    other sleds: [{ y (distance along the track), x (sideways), color, name, steer }]
// }
function drawRaceScene(ctx, w, h, scene) {
  const segments = TRACK.segments;
  const count = segments.length;
  const L = RACE.segmentLength;
  const cameraZ = wrapTrack(scene.cameraZ);
  const base = findSegment(cameraZ);
  const basePercent = (cameraZ % L) / L;

  // The camera floats above the snow where my sled is, so it goes up and down the hills.
  const mySpot = wrapTrack(cameraZ + raceCamera.playerZ);
  const mySegment = findSegment(mySpot);
  const height = lerp(mySegment.p1.world.y, mySegment.p2.world.y, (mySpot % L) / L);
  const cameraY = height + RACE.cameraHeight;
  const cameraX = scene.cameraX * RACE.roadWidth;

  drawRaceSky(ctx, w, h, scene.turn);

  // Near to far. `x` and `dx` bend the track: each curved piece shifts the next one a bit more.
  // `maxY` = the top of what's been painted so far: a piece hidden behind a hill is skipped.
  let maxY = h;
  let x = 0;
  let dx = -(base.curve * basePercent);
  const drawCount = Math.min(RACE.drawDistance, count);
  for (let n = 0; n < drawCount; n++) {
    const seg = segments[(base.index + n) % count];
    const looped = seg.index < base.index; // (past the end of the lap: the start of the next one)
    const z = cameraZ - (looped ? TRACK.length : 0);
    seg.clip = maxY;
    projectPoint(seg.p1, cameraX - x, cameraY, z, w, h);
    projectPoint(seg.p2, cameraX - x - dx, cameraY, z, w, h);
    x += dx;
    dx += seg.curve;
    seg.visible = seg.p1.camera.z > raceCamera.depth;
    if (!seg.visible || seg.p2.screen.y >= seg.p1.screen.y || seg.p2.screen.y >= maxY) continue;
    const far = n / drawCount;
    drawSegment(ctx, w, seg, 1 - Math.exp(-far * far * 2.5));
    maxY = seg.p2.screen.y;
  }

  // Which other sleds are on which piece of track.
  const sledsOn = new Map();
  for (const sled of scene.sleds) {
    const index = findSegment(sled.y).index;
    if (!sledsOn.has(index)) sledsOn.set(index, []);
    sledsOn.get(index).push(sled);
  }

  // Far to near, so near things are painted over far things.
  for (let n = drawCount - 1; n > 0; n--) {
    const seg = segments[(base.index + n) % count];
    if (!seg.visible) continue;
    const scale = seg.p1.screen.scale;
    for (const sprite of seg.sprites) {
      const size = SPRITE_SIZES[sprite.type];
      const width = size.w * scale * w / 2;
      const tall = size.h * scale * w / 2;
      if (width < 0.8) continue;
      const sx = seg.p1.screen.x + scale * sprite.offset * RACE.roadWidth * w / 2;
      if (sx + width / 2 < 0 || sx - width / 2 > w) continue;
      const top = seg.p1.screen.y - tall;
      // Cut off the bottom if a hill in front hides it.
      const hidden = Math.max(0, top + tall - seg.clip);
      if (hidden >= tall) continue;
      const picture = spritePicture(sprite.type);
      ctx.drawImage(picture, 0, 0, picture.width, picture.height * (1 - hidden / tall), sx - width / 2, top, width, tall - hidden);
    }
    if (seg.index === 0) drawStartBanner(ctx, w, seg);
    for (const sled of sledsOn.get(seg.index) || []) {
      const t = (wrapTrack(sled.y) % L) / L;
      const s = lerp(seg.p1.screen.scale, seg.p2.screen.scale, t);
      const sy = lerp(seg.p1.screen.y, seg.p2.screen.y, t);
      if (sy > seg.clip + 2) continue; // behind a hill
      const sx = lerp(seg.p1.screen.x, seg.p2.screen.x, t) + s * sled.x * RACE.roadWidth * w / 2;
      drawSled(ctx, sx, sy, SLED_WIDTH * s * w / 2, sled.color, sled.steer || 0, scene.time, sled.name);
    }
  }
}

// The banner over the start/finish line: "Mt Hermon Racing".
function drawStartBanner(ctx, w, seg) {
  const a = seg.p1.screen;
  const tall = 1700 * a.scale * w / 2;
  if (tall < 4) return;
  const left = a.x - a.w * 1.18, right = a.x + a.w * 1.18;
  const poleW = Math.max(2, a.w * 0.04);
  ctx.fillStyle = "#475569";
  ctx.fillRect(left - poleW / 2, a.y - tall, poleW, tall);
  ctx.fillRect(right - poleW / 2, a.y - tall, poleW, tall);
  const bannerH = tall * 0.24;
  ctx.fillStyle = "#1d4ed8";
  ctx.fillRect(left, a.y - tall, right - left, bannerH);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(left, a.y - tall + bannerH * 0.06, right - left, bannerH * 0.06);
  ctx.fillRect(left, a.y - tall + bannerH * 0.88, right - left, bannerH * 0.06);
  const fontSize = bannerH * 0.5;
  if (fontSize < 5) return;
  ctx.font = `800 ${fontSize}px Rubik, Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.direction = "rtl";
  ctx.fillText("מֵרוֹץ הַחֶרְמוֹן · MT HERMON RACING", a.x, a.y - tall + bannerH * 0.52);
  ctx.direction = "ltr";
  ctx.textBaseline = "alphabetic";
}

// ---------- The race info on top ----------

// Hebrew on top (bigger), English underneath (smaller), centered on x.
function drawBilingualText(ctx, hebrew, english, x, y, size, color = "#ffffff") {
  ctx.textAlign = "center";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(15, 23, 42, 0.75)";
  ctx.fillStyle = color;
  ctx.font = `800 ${size}px Rubik, Arial, sans-serif`;
  ctx.direction = "rtl";
  ctx.lineWidth = Math.max(3, size / 7);
  ctx.strokeText(hebrew, x, y);
  ctx.fillText(hebrew, x, y);
  ctx.direction = "ltr";
  if (english) {
    const small = Math.round(size * 0.5);
    ctx.font = `600 ${small}px Rubik, Arial, sans-serif`;
    ctx.lineWidth = Math.max(2, small / 6);
    ctx.strokeText(english, x, y + small * 1.3);
    ctx.fillText(english, x, y + small * 1.3);
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

// info = { lap, place, racers, kmh, countdown (a number, "go", or null), finishedPlace, deepSnow, showArrows }
function drawRaceHud(ctx, w, h, info) {
  const size = Math.max(18, Math.min(30, h * 0.065));
  if (info.finishedPlace) {
    drawBilingualText(ctx, `🏁 סִיַּמְתֶּם! מָקוֹם ${info.finishedPlace}`, `You finished! ${ordinal(info.finishedPlace)} place`, w / 2, h * 0.32, size * 1.6, "#fde047");
  } else {
    drawBilingualText(ctx, `הַקָּפָה ${info.lap}/${RACE.laps}`, `Lap ${info.lap}/${RACE.laps}`, w / 2, size + 8, size);
  }
  // My place, bottom left. My speed, bottom right.
  drawBilingualText(ctx, `מָקוֹם ${info.place}`, `${ordinal(info.place)} of ${info.racers}`, Math.max(70, w * 0.1), h - size * 1.2, size * 1.2, "#fde047");
  drawBilingualText(ctx, `${info.kmh} קמ״ש`, "km/h", w - Math.max(70, w * 0.1), h - size * 1.2, size);
  if (info.deepSnow && !info.finishedPlace) {
    drawBilingualText(ctx, "שֶׁלֶג עָמֹק — אִטִּי!", "❄️ Deep snow — slow!", w / 2, size * 2.9 + 8, size * 0.75, "#bae6fd");
  }
  if (info.showArrows) {
    // Where to tap to steer.
    ctx.globalAlpha = 0.55;
    drawBilingualText(ctx, "◀ שְׂמֹאלָה", "Hold to steer left", w * 0.2, h * 0.66, size * 0.9);
    drawBilingualText(ctx, "יָמִינָה ▶", "Hold to steer right", w * 0.8, h * 0.66, size * 0.9);
    ctx.globalAlpha = 1;
  }
  if (info.countdown !== null) {
    const go = info.countdown === "go";
    drawBilingualText(ctx, go ? "יוֹצְאִים!" : String(info.countdown), go ? "Go!" : "", w / 2, h * 0.42, size * (go ? 2.6 : 3.4), go ? "#4ade80" : "#ffffff");
  }
}
