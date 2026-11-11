// draw.js — everything that paints pictures onto the canvas.
//
// A canvas is like a blank sheet of paper. About 60 times every second we
// wipe it and repaint the whole scene: grass, rivers, bases, then players on top.
// Things drawn LATER appear ON TOP of things drawn earlier.

const COLORS = {
  grass: "#7cb862",
  grassLight: "#8ccb72",
  grassDark: "#6ea957",
  riverBank: "#d9c48a",
  water: "#4aa3df",
  waterShine: "#a5d8f7",
  plank: "#b07a43",
  plankDark: "#7a5229",
  outline: "#1f2937",
  blue: "#3b82f6",
  blueLight: "#93c5fd",
  blueDark: "#1e40af",
  red: "#ef4444",
  redLight: "#fca5a5",
  redDark: "#991b1b",
};

// ---------- Pictures painted once and reused ----------
// Painting thousands of grass blades 60 times a second would be slow on old phones.
// So everything that never changes (grass, paths, river water, base floors) is
// painted ONCE onto a hidden canvas the first time the map is drawn, and each frame
// we just stamp that finished picture onto the screen. Trees, rocks and bushes work
// the same way: each is painted once as a small picture (a "sprite") and stamped
// wherever it's needed.

const GROUND_RES = 1.5; // hidden-canvas dots per world unit (more = sharper, but uses more memory)
const SPRITE_RES = 2;   // the same for trees, rocks and bushes
let groundLayer = null; // the hidden canvas with the ground on it (made on first use)
const sprites = {};     // finished sprites, by name

// A random-number maker that gives the SAME numbers every time (from the same seed),
// so the grass and flowers land in the same places on every phone.
function seededRandom(seed) {
  return function random() {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}

// Make a hidden canvas `w` × `h` world units big and paint on it with `paint(g)`.
function makeCanvas(w, h, res, paint) {
  const c = document.createElement("canvas");
  c.width = Math.ceil(w * res);
  c.height = Math.ceil(h * res);
  const g = c.getContext("2d");
  g.scale(res, res); // so `paint` can use world units
  paint(g);
  return c;
}

// A sprite is a square picture `size` units wide. `paint` draws it centered on (0, 0).
function makeSprite(size, paint) {
  const canvas = makeCanvas(size, size, SPRITE_RES, (g) => {
    g.translate(size / 2, size / 2);
    paint(g);
  });
  return { canvas, size };
}

// Stamp a sprite centered on (x, y).
function drawSprite(ctx, sprite, x, y) {
  ctx.drawImage(sprite.canvas, x - sprite.size / 2, y - sprite.size / 2, sprite.size, sprite.size);
}

// Fill a circle (a small helper, since we draw a LOT of circles).
function dot(g, x, y, r) {
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fill();
}

// ---------- The map ----------

function drawMap(ctx, time) {
  // 1. The ground: grass, paths, flowers, base floors and rivers (painted once).
  if (!groundLayer) groundLayer = buildGroundLayer();
  ctx.drawImage(groundLayer, 0, 0, MAP.width, MAP.height);

  // 2. Base names (drawn each frame so the Rubik font is ready by then).
  drawBaseLabel(ctx, MAP.bases.blue, "blue");
  drawBaseLabel(ctx, MAP.bases.red, "red");

  // 3. Moving sparkles on the rivers: a dashed light line that slides along,
  //    so the water looks like it's flowing.
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.setLineDash([20, 70]);
  ctx.lineDashOffset = -time * 40;
  ctx.strokeStyle = "rgba(220, 240, 255, 0.75)";
  ctx.lineWidth = 5;
  for (const river of MAP.rivers) {
    for (const side of [-18, 18]) {
      traceLine(ctx, river.points.map(([x, y]) => [x + side, y]));
      ctx.stroke();
    }
  }
  ctx.setLineDash([]);

  // 4. Bridges over the rivers.
  for (const bridge of MAP.bridges) drawBridge(ctx, bridge);

  // 5. Rocks and hollow logs.
  for (const [x, y] of MAP.rocks) drawSprite(ctx, rockSprite(), x, y);
  for (const log of MAP.logs) drawLog(ctx, log);
}

// Draws a path through a list of points (used for rivers).
function traceLine(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
}

// Like traceLine, but with rounded bends (used for the dirt paths).
function traceCurve(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length - 1; i++) {
    const midX = (points[i][0] + points[i + 1][0]) / 2;
    const midY = (points[i][1] + points[i + 1][1]) / 2;
    ctx.quadraticCurveTo(points[i][0], points[i][1], midX, midY);
  }
  const last = points[points.length - 1];
  ctx.lineTo(last[0], last[1]);
}

function buildGroundLayer() {
  return makeCanvas(MAP.width, MAP.height, GROUND_RES, (g) => {
    const random = seededRandom(7);

    // Grass covering the whole map.
    g.fillStyle = COLORS.grass;
    g.fillRect(0, 0, MAP.width, MAP.height);

    // Soft lighter and darker patches (they fade out at the edges).
    for (const patch of MAP.grassPatches) {
      const color = patch.light ? "150, 210, 120" : "98, 156, 78";
      const glow = g.createRadialGradient(patch.x, patch.y, 0, patch.x, patch.y, patch.r * 1.3);
      glow.addColorStop(0, `rgba(${color}, 0.75)`);
      glow.addColorStop(1, `rgba(${color}, 0)`);
      g.fillStyle = glow;
      dot(g, patch.x, patch.y, patch.r * 1.3);
    }

    // Dirt paths: a darker edge, a lighter middle, and some pebbles.
    g.lineCap = "round";
    g.lineJoin = "round";
    for (const [width, color] of [[50, "#b8955f"], [38, "#cfae74"], [16, "#d9bd86"]]) {
      g.strokeStyle = color;
      g.lineWidth = width;
      for (const path of MAP.paths) {
        traceCurve(g, path);
        g.stroke();
      }
    }
    g.fillStyle = "rgba(120, 95, 60, 0.45)";
    for (const path of MAP.paths) {
      for (let i = 0; i < path.length - 1; i++) {
        for (let k = 0; k < 14; k++) {
          const t = random();
          const x = path[i][0] + (path[i + 1][0] - path[i][0]) * t + (random() - 0.5) * 30;
          const y = path[i][1] + (path[i + 1][1] - path[i][1]) * t + (random() - 0.5) * 30;
          dot(g, x, y, 1.5 + random() * 2);
        }
      }
    }

    // Grass tufts: thousands of little 3-blade clumps in three shades of green.
    // (One shade at a time, so each shade is a single big drawing job.)
    g.lineWidth = 1.6;
    for (const color of ["#5b9446", "#6aa953", "#9ad47c"]) {
      g.strokeStyle = color;
      g.beginPath();
      for (let i = 0; i < 1300; i++) {
        const x = random() * MAP.width;
        const y = random() * MAP.height;
        const tall = 6 + random() * 5;
        for (const side of [-1, 0, 1]) {
          g.moveTo(x + side * 2.5, y);
          g.lineTo(x + side * 4.5 + (random() - 0.5) * 2, y - tall + Math.abs(side) * 2);
        }
      }
      g.stroke();
    }

    // Little flower patches: white, yellow and pink.
    for (let i = 0; i < 90; i++) {
      const cx = random() * MAP.width;
      const cy = random() * MAP.height;
      const color = ["#ffffff", "#fde047", "#f9a8d4"][Math.floor(random() * 3)];
      for (let k = 0; k < 4 + random() * 4; k++) {
        const x = cx + (random() - 0.5) * 40;
        const y = cy + (random() - 0.5) * 26;
        g.fillStyle = color;
        dot(g, x, y, 2.6);
        g.fillStyle = color === "#fde047" ? "#f59e0b" : "#fde047"; // the middle
        dot(g, x, y, 1);
      }
    }

    // Base floors (before the rivers, so they sit "on the ground").
    drawBaseGround(g, MAP.bases.blue, "blue");
    drawBaseGround(g, MAP.bases.red, "red");

    // Rivers: a dark outer bank, a sandy bank, deep water at the edges, lighter in the middle.
    for (const river of MAP.rivers) {
      for (const [extra, color] of [[30, "#a88e57"], [20, COLORS.riverBank], [0, "#3a8fd0"], [-20, COLORS.water], [-50, "#6cbcee"]]) {
        traceLine(g, river.points);
        g.strokeStyle = color;
        g.lineWidth = river.width + extra;
        g.stroke();
      }
    }

    // Reeds along the river banks (but not where a bridge lands).
    g.lineWidth = 2;
    for (const river of MAP.rivers) {
      for (let i = 0; i < river.points.length - 1; i++) {
        const [ax, ay] = river.points[i];
        const [bx, by] = river.points[i + 1];
        const length = Math.hypot(bx - ax, by - ay);
        const nx = -(by - ay) / length; // "sideways" from the river's direction
        const ny = (bx - ax) / length;
        for (let d = 0; d < length; d += 26) {
          if (random() < 0.45) continue;
          const side = random() < 0.5 ? -1 : 1;
          const x = ax + (bx - ax) * (d / length) + nx * side * (river.width / 2 + 6);
          const y = ay + (by - ay) * (d / length) + ny * side * (river.width / 2 + 6);
          const nearBridge = MAP.bridges.some((b) => Math.abs(x - b.x) < b.w / 2 + 20 && Math.abs(y - b.y) < b.h / 2 + 20);
          if (nearBridge) continue;
          drawReeds(g, x, y, random);
        }
      }
    }
  });
}

// A clump of reeds: thin green stalks, some with a brown cattail on top.
function drawReeds(g, x, y, random) {
  for (let k = 0; k < 4; k++) {
    const topX = x + (random() - 0.5) * 12;
    const topY = y - 10 - random() * 10;
    g.strokeStyle = "#3f7a2b";
    g.beginPath();
    g.moveTo(x + (random() - 0.5) * 6, y + 2);
    g.lineTo(topX, topY);
    g.stroke();
    if (random() < 0.4) {
      g.fillStyle = "#7c4f24";
      g.beginPath();
      g.ellipse(topX, topY, 2, 4.5, 0, 0, Math.PI * 2);
      g.fill();
    }
  }
}

// A base's floor: the team-colored circle, a sandy ring around the flag, and the dashed edge.
function drawBaseGround(g, base, team) {
  g.fillStyle = team === "blue" ? "rgba(59,130,246,0.2)" : "rgba(239,68,68,0.2)";
  dot(g, base.x, base.y, base.radius);
  // Sandy circle around the flag stand, with a soft edge.
  const sand = g.createRadialGradient(base.x, base.y, 30, base.x, base.y, 75);
  sand.addColorStop(0, "rgba(222, 200, 145, 0.85)");
  sand.addColorStop(1, "rgba(222, 200, 145, 0)");
  g.fillStyle = sand;
  dot(g, base.x, base.y, 75);
  // Dashed edge in the team color, with a soft darker line under it.
  g.beginPath();
  g.arc(base.x, base.y, base.radius, 0, Math.PI * 2);
  g.lineWidth = 10;
  g.strokeStyle = "rgba(0,0,0,0.12)";
  g.stroke();
  g.setLineDash([18, 12]);
  g.lineWidth = 6;
  g.strokeStyle = COLORS[team];
  g.stroke();
  g.setLineDash([]);
}

// The base's name, drawn under the base.
function drawBaseLabel(ctx, base, team) {
  ctx.font = "800 26px Rubik, sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = COLORS[team];
  ctx.fillText(team === "blue" ? "BLUE BASE" : "RED BASE", base.x, base.y + base.radius - 44);
  ctx.fillText(team === "blue" ? "בָּסִיס כָּחֹל" : "בָּסִיס אָדֹם", base.x, base.y + base.radius - 16); // Hebrew underneath
}

function drawBridge(ctx, b) {
  const left = b.x - b.w / 2;
  const top = b.y - b.h / 2;
  // Shadow on the water
  ctx.fillStyle = "rgba(0, 30, 60, 0.25)";
  ctx.fillRect(left + 6, top + 10, b.w, b.h);
  // Wooden deck: planks in two slightly different browns
  let shade = 0;
  for (let x = left; x < left + b.w; x += 14) {
    ctx.fillStyle = shade++ % 2 ? "#a8723d" : COLORS.plank;
    ctx.fillRect(x, top, Math.min(14, left + b.w - x), b.h);
  }
  // Gaps between the planks
  ctx.strokeStyle = COLORS.plankDark;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x = left + 14; x < left + b.w; x += 14) {
    ctx.moveTo(x, top);
    ctx.lineTo(x, top + b.h);
  }
  ctx.stroke();
  // Railings on both sides that stand UP: a shadow, posts, and a rail across the top.
  const railHeight = 10; // how tall the railing looks
  for (const railY of [top, top + b.h]) {
    ctx.fillStyle = "rgba(0,0,0,0.25)"; // the railing's shadow
    ctx.fillRect(left + 3, railY - 1, b.w, 5);
    ctx.fillStyle = "#5c3d1e";          // posts
    for (let x = left; x <= left + b.w + 0.1; x += b.w / 4) ctx.fillRect(x - 4, railY - railHeight, 8, railHeight + 3);
    ctx.fillStyle = COLORS.plankDark;   // the rail resting on the posts
    ctx.fillRect(left - 2, railY - railHeight - 3, b.w + 4, 6);
    ctx.fillStyle = "rgba(255,255,255,0.25)"; // light catching the top of the rail
    ctx.fillRect(left - 2, railY - railHeight - 3, b.w + 4, 2);
  }
}

// ---------- Hollow logs ----------

// A hollow log lying on its side, drawn left-to-right (drawLog turns it the right way).
// It's lit from above like a round tube (light on top, dark underneath), with bark
// lines, a little moss, and a dark hole at each end — because it's hollow!
function logSprite(length) {
  const name = "log" + length;
  if (sprites[name]) return sprites[name];
  const w = LOG.width;
  const r = w / 2;
  const half = length / 2;
  const boxW = length + 40;
  const boxH = w + 40;
  const canvas = makeCanvas(boxW, boxH, SPRITE_RES, (g) => {
    g.translate(boxW / 2, boxH / 2);
    // Bark, shaded like a tube
    const bark = g.createLinearGradient(0, -r, 0, r);
    bark.addColorStop(0, "#b07c50");
    bark.addColorStop(0.4, "#83582f");
    bark.addColorStop(1, "#47301b");
    g.fillStyle = bark;
    g.fillRect(-half, -r, length, w);
    g.strokeStyle = "#3a2614";
    g.lineWidth = 2;
    g.strokeRect(-half, -r, length, w);
    // Bark lines running along the log
    g.strokeStyle = "rgba(40, 25, 10, 0.45)";
    g.lineWidth = 1.5;
    g.beginPath();
    for (const [y, from, to] of [[-0.55, -0.8, 0.3], [-0.1, -0.4, 0.85], [0.35, -0.9, 0.5], [0.7, -0.2, 0.9]]) {
      g.moveTo(from * half, y * r);
      g.lineTo(to * half, y * r);
    }
    g.stroke();
    // A knot and some moss on top
    g.fillStyle = "#5a3a20";
    g.beginPath();
    g.ellipse(half * 0.25, -r * 0.3, 6, 3.5, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "rgba(110, 170, 75, 0.85)";
    for (const [x, y, size] of [[-0.5, -0.7, 6], [-0.42, -0.6, 5], [0.55, -0.75, 5], [0.62, -0.62, 4]]) dot(g, x * half, y * r, size);
    // The two open ends: the cut wood (seen at a slant, so it's an oval) and the dark hole
    for (const end of [-half, half]) {
      g.fillStyle = "#c99c6b";
      g.beginPath();
      g.ellipse(end, 0, r * 0.45, r, 0, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = "#3a2614";
      g.lineWidth = 2;
      g.stroke();
      g.fillStyle = "#1a110a";
      g.beginPath();
      g.ellipse(end, 0, r * 0.3, r * 0.72, 0, 0, Math.PI * 2);
      g.fill();
    }
  });
  return (sprites[name] = { canvas, boxW, boxH });
}

function drawLog(ctx, log) {
  const s = logSprite(log.length);
  // The shadow first (always down and to the right, like everything else's shadow).
  ctx.save();
  ctx.translate(log.x + 6, log.y + 11);
  ctx.rotate(log.angle);
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.fillRect(-log.length / 2, -LOG.width / 2, log.length, LOG.width);
  ctx.restore();
  // Then the log itself, turned to lie the right way.
  ctx.save();
  ctx.translate(log.x, log.y);
  ctx.rotate(log.angle);
  ctx.drawImage(s.canvas, -s.boxW / 2, -s.boxH / 2, s.boxW, s.boxH);
  ctx.restore();
}

// Hiding in a log: the whole screen gets dark, darkest around the edges.
function drawLogDarkness(ctx, dpr) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  ctx.setTransform(1, 0, 0, 1, 0, 0); // screen pixels
  const dark = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.15, w / 2, h / 2, Math.max(w, h) * 0.6);
  dark.addColorStop(0, `rgba(10, 6, 2, ${LOG.darkness * 0.8})`);
  dark.addColorStop(1, `rgba(10, 6, 2, ${Math.min(1, LOG.darkness + 0.35)})`);
  ctx.fillStyle = dark;
  ctx.fillRect(0, 0, w, h);
}

// A grey rock that looks TALL: a shadow, its darker side peeking out underneath,
// then its lighter top with a highlight, a crack and a bit of moss.
function rockSprite() {
  return sprites.rock || (sprites.rock = makeSprite(100, (g) => {
    g.fillStyle = "rgba(0,0,0,0.22)";
    g.beginPath();
    g.ellipse(9, 16, 33, 19, 0, 0, Math.PI * 2);
    g.fill();
    const lumpy = (scale) => {
      g.beginPath();
      const corners = [[-31, 2], [-24, -16], [-4, -23], [18, -19], [32, -4], [27, 14], [6, 21], [-18, 18]];
      corners.forEach(([x, y], i) => (i === 0 ? g.moveTo(x * scale, y * scale) : g.lineTo(x * scale, y * scale)));
      g.closePath();
    };
    g.strokeStyle = "#3f4650";
    g.lineWidth = 2.5;
    g.lineJoin = "round";
    // The side (moved down a bit, darker)
    g.save();
    g.translate(0, 9);
    lumpy(1);
    g.fillStyle = "#5c636d";
    g.fill();
    g.stroke();
    g.restore();
    // The top
    lumpy(1);
    g.fillStyle = "#8a929c";
    g.fill();
    g.stroke();
    g.save();
    g.translate(-4, -5);
    lumpy(0.72);
    g.fillStyle = "#a9b1bb";
    g.fill();
    g.restore();
    g.fillStyle = "#dde1e6";
    g.beginPath();
    g.ellipse(-11, -11, 9, 5, -0.3, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "#5b636e"; // crack
    g.lineWidth = 1.5;
    g.beginPath();
    g.moveTo(8, -12);
    g.lineTo(4, -2);
    g.lineTo(10, 6);
    g.stroke();
    g.fillStyle = "rgba(90, 150, 70, 0.85)"; // moss
    for (const [x, y, r] of [[-22, 10, 6], [-15, 14, 5], [-26, 4, 4]]) dot(g, x, y, r);
  }));
}

// ---------- Things at each base ----------

// The shopkeeper stands behind a little market stall above the flag.
function drawShopkeeper(ctx, base, team, time) {
  const x = base.shop.x;
  const y = base.shop.y;

  // Shopkeeper (behind the counter), bobbing up and down a tiny bit.
  const bob = Math.sin(time * 3) * 2;
  ctx.fillStyle = "#8b5cf6"; // purple shirt
  ctx.beginPath();
  ctx.arc(x, y - 22 + bob, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f2c9a0"; // face
  ctx.beginPath();
  ctx.arc(x, y - 36 + bob, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#6b4226"; // beard
  ctx.beginPath();
  ctx.arc(x, y - 30 + bob, 9, 0, Math.PI);
  ctx.fill();

  // Counter
  ctx.fillStyle = "#a16207";
  ctx.fillRect(x - 50, y - 12, 100, 26);
  ctx.strokeStyle = COLORS.outline;
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 50, y - 12, 100, 26);

  // Striped awning in the team's color
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = i % 2 === 0 ? COLORS[team] : "#ffffff";
    ctx.fillRect(x - 55 + i * 22, y - 72, 22, 16);
  }

  // Sign
  ctx.font = "600 16px Rubik, sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "#fff";
  ctx.fillText("🛒 SHOP", x, y + 7);
  drawLabel(ctx, "חֲנוּת", x, y + 34); // Hebrew underneath the counter
}

// The round stand in the middle of each base where the flag lives.
// It stays visible even when the flag has been stolen, so you know where to bring it back.
function drawFlagStand(ctx, base, team) {
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.ellipse(base.x, base.y + 4, 26, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = COLORS[team];
  ctx.lineWidth = 3;
  ctx.stroke();
}

// A flag lying on the ground after being dropped: a pulsing ring makes it easy to spot.
function drawDroppedFlag(ctx, flag, time) {
  const pulse = (time * 1.2) % 1;
  ctx.strokeStyle = COLORS[flag.team];
  ctx.globalAlpha = 1 - pulse;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(flag.x, flag.y - 10, 20 + pulse * 35, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  drawFlag(ctx, flag.x, flag.y, flag.team, time);
  // Countdown until it goes home by itself.
  const secondsLeft = Math.max(0, Math.ceil(flag.droppedAt + FLAG_RETURN_TIME - time));
  drawLabel(ctx, `↩ ${secondsLeft}s`, flag.x + 10, flag.y + 26);
}

// A smaller flag sticking up from the back of whoever is carrying it.
function drawCarriedFlag(ctx, p, team, time) {
  ctx.save();
  ctx.translate(p.x - Math.cos(p.facing) * 14, p.y - Math.sin(p.facing) * 14 + 6);
  ctx.scale(0.75, 0.75);
  drawFlag(ctx, 0, 0, team, time);
  ctx.restore();
}

// A flag on a pole. The cloth waves using Math.sin, which makes a smooth wiggle over time.
function drawFlag(ctx, x, y, team, time) {
  // Pole
  ctx.strokeStyle = "#4b5563";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 60);
  ctx.stroke();
  // Cloth
  const wave = Math.sin(time * 5) * 5;
  ctx.fillStyle = COLORS[team];
  ctx.beginPath();
  ctx.moveTo(x, y - 60);
  ctx.quadraticCurveTo(x + 22, y - 62 + wave, x + 44, y - 50);
  ctx.quadraticCurveTo(x + 22, y - 38 - wave, x, y - 34);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = COLORS.outline;
  ctx.lineWidth = 2;
  ctx.stroke();
}

// ---------- Players ----------

// isMe = true for the player holding this phone (they get a yellow ring so they can find themselves).
function drawPlayer(ctx, p, time, isMe) {
  const color = COLORS[p.team];
  const light = COLORS[p.team + "Light"];

  if (isMe) {
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + p.radius * 0.6, p.radius + 8, (p.radius + 8) * 0.5, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Ripples around the player while wading through a river.
  if (p.inWater) {
    const grow = (time * 1.5) % 1; // goes 0 → 1 over and over
    ctx.strokeStyle = `rgba(255,255,255,${0.7 * (1 - grow)})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + 6, p.radius + grow * 22, (p.radius + grow * 22) * 0.6, 0, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    // Shadow on dry land
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.beginPath();
    ctx.ellipse(p.x + 3, p.y + p.radius * 0.7, p.radius, p.radius * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // A little bounce while walking
  const bounce = p.moving ? Math.abs(Math.sin(time * 12)) * 3 : 0;
  const y = p.y - bounce;

  // Feet: two small dark ovals under the body that take turns stepping forward while walking.
  if (!p.inWater) {
    const step = p.moving ? Math.sin(time * 12) * 6 : 0;
    // Forest boots = brown feet (so everyone can see who's wearing them).
    const boots = (p.items || []).includes("boots");
    ctx.fillStyle = boots ? "#92400e" : "#374151";
    for (const side of [-1, 1]) {
      const forward = step * side;
      const fx = p.x + Math.cos(p.facing) * forward + Math.cos(p.facing + Math.PI / 2) * 9 * side;
      const fy = p.y + p.radius * 0.55 + Math.sin(p.facing) * forward + Math.sin(p.facing + Math.PI / 2) * 9 * side * 0.5;
      ctx.beginPath();
      ctx.ellipse(fx, fy, boots ? 8.5 : 7, boots ? 6 : 5, p.facing, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Speed boost: a flickering yellow glow and speed lines behind you.
  if (p.boostUntil > time) {
    ctx.fillStyle = `rgba(250, 204, 21, ${0.35 + Math.sin(time * 20) * 0.15})`;
    ctx.beginPath();
    ctx.arc(p.x, y, p.radius + 10, 0, Math.PI * 2);
    ctx.fill();
    if (p.moving) {
      ctx.strokeStyle = "rgba(255,255,255,0.8)";
      ctx.lineWidth = 3;
      for (const side of [-12, 0, 12]) {
        const backX = p.x - Math.cos(p.facing) * (p.radius + 8) + Math.cos(p.facing + Math.PI / 2) * side;
        const backY = y - Math.sin(p.facing) * (p.radius + 8) + Math.sin(p.facing + Math.PI / 2) * side;
        ctx.beginPath();
        ctx.moveTo(backX, backY);
        ctx.lineTo(backX - Math.cos(p.facing) * 22, backY - Math.sin(p.facing) * 22);
        ctx.stroke();
      }
    }
  }

  // The weapon is held in the right hand. While swinging, it spins all the way around.
  // (A fast weapon like the stick gets a quicker spin, so it's done before the next swing.)
  let handAngleR = p.facing + 0.9;
  const held = ITEMS[p.held];
  const swingTime = held && held.kind === "melee" ? Math.min(SWING_TIME, held.cooldown * 0.9) : SWING_TIME;
  const swingProgress = (time - p.lastSwing) / swingTime; // 0 → 1 during a swing
  if (swingProgress >= 0 && swingProgress < 1) {
    // Throwing: the hand snaps forward and back. Hand weapons: a full spin.
    if (held && held.kind === "throw") handAngleR -= Math.sin(swingProgress * Math.PI) * 0.9;
    else if (held && held.kind !== "spear") handAngleR += swingProgress * Math.PI * 2;
  }
  if (p.held === "hammer") drawHammer(ctx, p.x, y, handAngleR, p.radius);
  if (p.held === "stick") drawStick(ctx, p.x, y, handAngleR, p.radius);
  // The spear points straight ahead (it's put away while carrying a flag, because it doesn't work then).
  // Right after a stab it jabs forward a little.
  if (p.held === "spear" && !p.carrying) {
    const jab = swingProgress >= 0 && swingProgress < 1 ? Math.sin(swingProgress * Math.PI) * 10 : 0;
    drawSpear(ctx, p.x, y, p.facing, p.radius, jab);
    handAngleR = p.facing + Math.asin(Math.min(1, ITEMS.spear.side / p.radius)); // the right hand sits on the shaft
  }

  // Hands: two small circles on either side, turned toward where the player faces.
  const handAngleL = p.facing - 0.9;
  ctx.fillStyle = light;
  ctx.strokeStyle = COLORS.outline;
  ctx.lineWidth = 2.5;
  for (const angle of [handAngleL, handAngleR]) {
    ctx.beginPath();
    ctx.arc(p.x + Math.cos(angle) * p.radius, y + Math.sin(angle) * p.radius, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  // Something to throw sits in the right hand (a little smaller than when it flies).
  if (held && held.kind === "throw") {
    drawShot(ctx, p.held, p.x + Math.cos(handAngleR) * (p.radius + 6), y + Math.sin(handAngleR) * (p.radius + 6), 0, 0.75);
  }

  // Body: shaded like a ball, lit from the top-left (light → team color → dark).
  const ball = ctx.createRadialGradient(p.x - p.radius * 0.35, y - p.radius * 0.4, p.radius * 0.1, p.x, y, p.radius);
  ball.addColorStop(0, light);
  ball.addColorStop(0.5, color);
  ball.addColorStop(1, COLORS[p.team + "Dark"]);
  ctx.fillStyle = ball;
  ctx.strokeStyle = COLORS.outline;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(p.x, y, p.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // A small shine on the body
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.beginPath();
  ctx.ellipse(p.x - p.radius * 0.38, y - p.radius * 0.42, p.radius * 0.22, p.radius * 0.14, -0.6, 0, Math.PI * 2);
  ctx.fill();

  // Eyes, looking in the direction the player faces
  const lookX = Math.cos(p.facing) * 7;
  const lookY = Math.sin(p.facing) * 7;
  for (const side of [-1, 1]) {
    // Side-to-side offset, at right angles to the facing direction
    const ex = p.x + lookX + Math.cos(p.facing + Math.PI / 2) * 7 * side;
    const ey = y + lookY + Math.sin(p.facing + Math.PI / 2) * 7 * side;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(ex, ey, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.outline;
    ctx.beginPath();
    ctx.arc(ex + Math.cos(p.facing) * 2, ey + Math.sin(p.facing) * 2, 2.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Frozen by a rock: a see-through block of ice around the whole player.
  if (p.frozen) drawIce(ctx, p.x, y, p.radius + 9, time);

  // Name tag and health bar above the head
  drawLabel(ctx, p.name, p.x, y - p.radius - 22, isMe ? "#fde047" : "#fff");
  drawHealthBar(ctx, p.x, y - p.radius - 15, p.hp, p.maxHp);
}

// How long one hammer swing animation lasts, in seconds.
const SWING_TIME = 0.3;

// A hammer pointing outward from the player at `angle`.
function drawHammer(ctx, x, y, angle, bodyRadius) {
  ctx.save();                 // remember the current pen settings…
  ctx.translate(x, y);        // …move the pen to the player's center…
  ctx.rotate(angle);          // …and turn it, so "right" now points where the hammer goes.
  ctx.fillStyle = "#8b5a2b";  // wooden handle
  ctx.fillRect(bodyRadius - 4, -3.5, 32, 7);
  ctx.fillStyle = "#6b7280";  // metal head
  ctx.fillRect(bodyRadius + 22, -12, 15, 24);
  ctx.strokeStyle = COLORS.outline;
  ctx.lineWidth = 2;
  ctx.strokeRect(bodyRadius + 22, -12, 15, 24);
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillRect(bodyRadius + 24, -10, 4, 20);
  ctx.restore();              // put the pen back the way it was
}

// A long spear pointing straight ahead at `angle`. Its tip ends ITEMS.spear.length past the
// body's edge, the same spot the referee checks (spearTip in server.js). `jab` pushes it forward.
function drawSpear(ctx, x, y, angle, bodyRadius, jab) {
  const tip = bodyRadius + ITEMS.spear.length + jab;
  const side = ITEMS.spear.side; // the spear sits a little to the right, in the right hand
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.lineCap = "round";
  // The wooden shaft (it starts behind the body, so it looks held, not glued on)
  ctx.strokeStyle = COLORS.outline;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(-bodyRadius * 0.6, side);
  ctx.lineTo(tip - 14, side);
  ctx.stroke();
  ctx.strokeStyle = "#b45309";
  ctx.lineWidth = 4;
  ctx.stroke();
  // The metal point
  ctx.fillStyle = "#cbd5e1";
  ctx.strokeStyle = COLORS.outline;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(tip, side);
  ctx.lineTo(tip - 18, side - 6);
  ctx.lineTo(tip - 14, side);
  ctx.lineTo(tip - 18, side + 6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

// A thin, slightly bent wooden stick pointing outward from the player at `angle`.
function drawStick(ctx, x, y, angle, bodyRadius) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.lineCap = "round";
  ctx.strokeStyle = COLORS.outline;   // dark outline first…
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(bodyRadius - 4, 0);
  ctx.quadraticCurveTo(bodyRadius + 18, -5, bodyRadius + 40, 2);
  ctx.stroke();
  ctx.strokeStyle = "#a16207";        // …then the wood on top
  ctx.lineWidth = 4.5;
  ctx.stroke();
  // A little twig sticking off the side
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(bodyRadius + 24, -3);
  ctx.lineTo(bodyRadius + 31, -11);
  ctx.stroke();
  ctx.restore();
}

// ---------- Thrown things (rocks, ninja stars) ----------

// One thrown thing at (x, y). `spin` turns it (in radians); `size` makes it bigger or smaller (1 = normal).
function drawShot(ctx, itemId, x, y, spin, size = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size, size);
  ctx.rotate(spin);
  ctx.strokeStyle = COLORS.outline;
  ctx.lineWidth = 2;
  if (itemId === "rock") {
    // A lumpy gray stone, lighter on the top-left.
    const stone = ctx.createRadialGradient(-3, -4, 1, 0, 0, 11);
    stone.addColorStop(0, "#d1d5db");
    stone.addColorStop(1, "#6b7280");
    ctx.fillStyle = stone;
    ctx.beginPath();
    ctx.moveTo(-10, -2);
    ctx.quadraticCurveTo(-9, -10, 0, -10);
    ctx.quadraticCurveTo(10, -9, 10, 0);
    ctx.quadraticCurveTo(9, 9, 0, 9);
    ctx.quadraticCurveTo(-10, 9, -10, -2);
    ctx.fill();
    ctx.stroke();
  } else if (itemId === "stars") {
    // A silver ninja star: 4 sharp points with a hole in the middle.
    ctx.fillStyle = "#cbd5e1";
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const reach = i % 2 === 0 ? 14 : 5; // points stick out, the corners between them tuck in
      ctx.lineTo(Math.cos(angle) * reach, Math.sin(angle) * reach);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#475569";
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (itemId === "grenade") {
    // A red pomegranate with a little crown on top.
    const skin = ctx.createRadialGradient(-4, -4, 1, 0, 0, 12);
    skin.addColorStop(0, "#fca5a5");
    skin.addColorStop(0.5, "#dc2626");
    skin.addColorStop(1, "#7f1d1d");
    ctx.fillStyle = skin;
    ctx.beginPath();
    ctx.arc(0, 1, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#991b1b";
    ctx.beginPath();
    ctx.moveTo(-5, -8);
    ctx.lineTo(-6, -15);
    ctx.lineTo(-2, -11);
    ctx.lineTo(0, -16);
    ctx.lineTo(2, -11);
    ctx.lineTo(6, -15);
    ctx.lineTo(5, -8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

// Everything flying through the air right now. The referee sends where each one was
// (20 times a second); in between, we slide it forward along its path so it moves smoothly.
function drawShots(ctx, shots, time) {
  for (const s of shots) {
    const item = ITEMS[s.item];
    if (!item) continue;
    const ahead = Math.min(Math.max(0, time - s.seenAt) * item.speed, item.range - s.flown);
    const x = s.x + (s.vx / item.speed) * ahead;
    let y = s.y + (s.vy / item.speed) * ahead;
    // A grenade is lobbed in an arc: it rises, then comes down where it lands.
    let lift = 0;
    let size = 1;
    if (item.lands) {
      const progress = Math.min(1, (s.flown + ahead) / item.range); // 0 → 1
      lift = Math.sin(progress * Math.PI) * 60;
      size = 1 + Math.sin(progress * Math.PI) * 0.4;
    }
    // A small shadow underneath, so it looks like it's flying above the ground.
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.ellipse(x + 4, y + 14, 9, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    y -= lift;
    // Ninja stars spin fast; rocks tumble slowly.
    drawShot(ctx, s.item, x, y, time * (s.item === "stars" ? 20 : 6), size);
  }
}

// While aiming with the Throw button: a dashed line showing where it will fly.
function drawAimLine(ctx, p, angle, range, blast = 0) {
  const endX = p.x + Math.cos(angle) * (p.radius + range);
  const endY = p.y + Math.sin(angle) * (p.radius + range);
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 4;
  ctx.setLineDash([14, 10]);
  ctx.beginPath();
  ctx.moveTo(p.x + Math.cos(angle) * p.radius, p.y + Math.sin(angle) * p.radius);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.arc(endX, endY, 10, 0, Math.PI * 2); // a little circle where it lands
  ctx.stroke();
  if (blast > 0) {
    // A grenade: a red dashed circle showing how far its seeds will reach.
    ctx.strokeStyle = "rgba(248, 113, 113, 0.8)";
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.arc(endX, endY, blast, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();
}

// ---------- Pomegranates ----------

// A hidden grenade on the ground. Only its own team sees it: faint, with a ring that
// shrinks as its 20 seconds run out, and a dashed circle for how close sets it off.
function drawMine(ctx, mine, time) {
  ctx.save();
  ctx.globalAlpha = 0.6;
  drawShot(ctx, "grenade", mine.x, mine.y, 0, 0.9);
  const left = Math.max(0, Math.min(1, (mine.explodeAt - time) / POMEGRANATE.hideTime)); // 1 → 0
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(mine.x, mine.y, 17, -Math.PI / 2, -Math.PI / 2 + left * Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "rgba(248, 113, 113, 0.7)";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 7]);
  ctx.beginPath();
  ctx.arc(mine.x, mine.y, POMEGRANATE.trigger + PLAYER_RADIUS, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

// A planted pomegranate tree: trunk, a round leafy top, and the pomegranates still on it.
// A little colored ring at its foot shows whose team planted it.
function drawPomegranateTree(ctx, tree, time) {
  const { x, y } = tree;
  ctx.save();
  // Team ring + shadow
  ctx.strokeStyle = COLORS[tree.team];
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(x, y + 26, 26, 11, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.ellipse(x + 10, y + 26, 48, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  // Trunk
  ctx.fillStyle = "#78350f";
  ctx.strokeStyle = COLORS.outline;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.rect(x - 7, y - 4, 14, 32);
  ctx.fill();
  ctx.stroke();
  // Leafy top: a few overlapping circles, swaying a tiny bit
  const sway = Math.sin(time * 1.5 + tree.id) * 1.5;
  const leaves = [[-20, -22, 24], [18, -24, 24], [0, -40, 26], [0, -16, 26]];
  ctx.fillStyle = "#15803d";
  for (const [dx, dy, r] of leaves) {
    ctx.beginPath();
    ctx.arc(x + dx + sway, y + dy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.fillStyle = "#22c55e";
  for (const [dx, dy, r] of leaves) {
    ctx.beginPath();
    ctx.arc(x + dx + sway - r * 0.25, y + dy - r * 0.3, r * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  // The pomegranates that haven't dropped yet
  const spots = [[-22, -20], [20, -26], [-4, -46], [6, -12]];
  for (let i = tree.dropped; i < POMEGRANATE.treeDrops && i < spots.length; i++) {
    drawShot(ctx, "grenade", x + spots[i][0] + sway, y + spots[i][1], 0, 0.75);
  }
  ctx.restore();
}

// A block of ice around a frozen player, with a slowly moving shine.
function drawIce(ctx, x, y, r, time) {
  ctx.fillStyle = "rgba(186, 230, 253, 0.55)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  // Six-sided, so it looks like a chunk of ice and not a bubble.
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + 0.3;
    ctx.lineTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  const shine = Math.sin(time * 3) * 4;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
  ctx.beginPath();
  ctx.moveTo(x - r * 0.5 + shine, y - r * 0.15);
  ctx.lineTo(x - r * 0.15 + shine, y - r * 0.55);
  ctx.stroke();
}

// White text with a dark outline so it's readable on any background.
function drawLabel(ctx, text, x, y, color = "#fff") {
  ctx.font = "600 16px Rubik, sans-serif";
  ctx.textAlign = "center";
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(0,0,0,0.6)";
  ctx.strokeText(text, x, y);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

// A small bar: green when healthy, yellow when hurt, red when almost knocked out.
function drawHealthBar(ctx, x, y, hp, maxHp) {
  const width = 48;
  const height = 7;
  const fraction = Math.max(0, hp / maxHp);
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(x - width / 2 - 2, y - 2, width + 4, height + 4);
  ctx.fillStyle = fraction > 0.5 ? "#22c55e" : fraction > 0.25 ? "#facc15" : "#ef4444";
  ctx.fillRect(x - width / 2, y, width * fraction, height);
}

// ---------- Bushes (drawn AFTER players, so you look like you're hiding inside) ----------

function drawBushes(ctx, berries) {
  // The whole bush is one picture, made see-through all at once, so overlapping
  // leaves don't make darker spots, and you can still find yourself inside.
  ctx.globalAlpha = 0.78;
  for (const [x, y, r, kind] of MAP.bushes) drawSprite(ctx, bushSprite(r, kind), x, y);
  ctx.globalAlpha = 1;
  // Then each ripe berry, on top. (Eaten ones disappear until they grow back.)
  MAP.berries.forEach((berry, i) => {
    if (!berries || berries[i]) drawSprite(ctx, berrySprite(), berry.x, berry.y);
  });
}

// One shiny red berry, with a darker edge underneath so it looks round.
function berrySprite() {
  return sprites.berry || (sprites.berry = makeSprite(18, (g) => {
    g.fillStyle = "rgba(0,0,0,0.25)";
    dot(g, 1.5, 2.5, 6);
    g.fillStyle = "#7f1d1d";
    dot(g, 0.8, 1.2, 6);
    g.fillStyle = "#e53935";
    dot(g, 0, 0, 5.5);
    g.fillStyle = "rgba(255,255,255,0.8)";
    dot(g, -1.9, -1.9, 1.8);
  }));
}

// The two kinds of bushes have their own colors.
const BUSH_COLORS = {
  berry: { edge: "#1d5422", leaves: "#2e7d32", light: "#43a047", tips: "#66bb6a" },
  leafy: { edge: "#173f24", leaves: "#2a6236", light: "#3b7f46", tips: "#5da062" },
};

// A round bush `r` units in radius, shaped like a dome: a shadow on the ground, a darker
// lower edge, leaves, and sunlit leaves on top. (Berries are drawn separately, one by one.)
function bushSprite(r, kind) {
  const name = `bush-${kind}-${r}`;
  return sprites[name] || (sprites[name] = makeSprite(r * 2.7, (g) => {
    const colors = BUSH_COLORS[kind] || BUSH_COLORS.berry;
    const random = seededRandom(r * 13 + (kind === "leafy" ? 7 : 0));
    const clumps = kind === "leafy" ? 8 : 10;
    const ring = [];
    for (let i = 0; i < clumps; i++) {
      const angle = (i / clumps) * Math.PI * 2 + random() * 0.3;
      ring.push([Math.cos(angle) * r * 0.6, Math.sin(angle) * r * 0.6, r * (0.44 + random() * 0.1)]);
    }
    // Darker lower edge, moved down a little: the "side" of the dome
    g.fillStyle = colors.edge;
    for (const [x, y, size] of ring) dot(g, x, y + r * 0.08, size + 3);
    dot(g, 0, r * 0.08, r * 0.75);
    // Leaves
    g.fillStyle = colors.leaves;
    for (const [x, y, size] of ring) dot(g, x - 2, y - r * 0.05, size);
    dot(g, -2, -r * 0.05, r * 0.7);
    // Sunlit leaves (the sun is up and to the left)
    g.fillStyle = colors.light;
    for (let i = 0; i < 7; i++) {
      const angle = random() * Math.PI * 2;
      const dist = random() * r * 0.5;
      dot(g, Math.cos(angle) * dist - r * 0.15, Math.sin(angle) * dist - r * 0.2, r * (0.16 + random() * 0.1));
    }
    g.fillStyle = colors.tips;
    for (let i = 0; i < 9; i++) {
      const angle = random() * Math.PI * 2;
      const dist = random() * r * 0.6;
      dot(g, Math.cos(angle) * dist - r * 0.15, Math.sin(angle) * dist - r * 0.2, r * 0.06);
    }
    // Dome shading: lighter at the top-left, darker at the bottom-right.
    // ("source-atop" paints only on top of the leaves, not on the empty corners.)
    g.globalCompositeOperation = "source-atop";
    const dome = g.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r * 1.2);
    dome.addColorStop(0, "rgba(255, 255, 220, 0.18)");
    dome.addColorStop(0.6, "rgba(0, 0, 0, 0)");
    dome.addColorStop(1, "rgba(0, 20, 0, 0.35)");
    g.fillStyle = dome;
    g.fillRect(-r * 1.4, -r * 1.4, r * 2.8, r * 2.8);
    // The shadow on the ground ("destination-over" puts it UNDER the leaves).
    g.globalCompositeOperation = "destination-over";
    g.fillStyle = "rgba(0, 0, 0, 0.25)";
    g.beginPath();
    g.ellipse(r * 0.14, r * 0.28, r * 0.98, r * 0.75, 0, 0, Math.PI * 2);
    g.fill();
    g.globalCompositeOperation = "source-over";
  }));
}

// ---------- Speed boost box ----------

function drawSpeedBox(ctx, box, time) {
  const size = box.radius * 2;

  if (!box.alive) {
    // Broken: show a dashed outline and how long until it comes back.
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 3;
    ctx.strokeRect(box.x - box.radius, box.y - box.radius, size, size);
    ctx.setLineDash([]);
    const secondsLeft = Math.ceil(box.respawnAt - time);
    drawLabel(ctx, `⚡ back in ${secondsLeft}s`, box.x, box.y - 4);
    drawLabel(ctx, `חוֹזֶרֶת בְּעוֹד ${secondsLeft} שְׁנִיּוֹת`, box.x, box.y + 16);
    return;
  }

  // Wobble for a moment after being hit.
  const wobble = time - box.lastHit < 0.3 ? Math.sin(time * 80) * 5 : 0;
  // The crate stands up like a real box: we see its TOP, and its FRONT below that.
  const tall = 18; // how tall the crate looks
  const left = box.x - box.radius + wobble;
  const top = box.y - box.radius - tall; // the top face is lifted up by `tall`

  // Shadow on the ground
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(left + 8, box.y - box.radius + 8, size + 4, size);
  // Front face (darker, because the light comes from above)
  ctx.fillStyle = "#94622d";
  ctx.fillRect(left, top + size, size, tall);
  ctx.strokeStyle = "#5c3a17";
  ctx.lineWidth = 3;
  ctx.strokeRect(left, top + size, size, tall);
  ctx.beginPath(); // a plank line across the front
  ctx.moveTo(left, top + size + tall / 2);
  ctx.lineTo(left + size, top + size + tall / 2);
  ctx.stroke();
  // Top face
  ctx.fillStyle = "#c58b45";
  ctx.fillRect(left, top, size, size);
  ctx.strokeStyle = "#7a5229";
  ctx.lineWidth = 4;
  ctx.strokeRect(left, top, size, size);
  ctx.beginPath(); // the "X" of planks across the top
  ctx.moveTo(left, top);
  ctx.lineTo(left + size, top + size);
  ctx.moveTo(left + size, top);
  ctx.lineTo(left, top + size);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.18)"; // light along the top edge
  ctx.fillRect(left + 2, top + 2, size - 4, 4);

  // Cracks appear as it gets damaged.
  ctx.strokeStyle = "#3b2414";
  ctx.lineWidth = 2.5;
  if (box.hp < box.maxHp * 0.7) {
    ctx.beginPath();
    ctx.moveTo(left + 8, top + 10);
    ctx.lineTo(left + 20, top + 22);
    ctx.lineTo(left + 14, top + 34);
    ctx.stroke();
  }
  if (box.hp < box.maxHp * 0.4) {
    ctx.beginPath();
    ctx.moveTo(left + size - 6, top + size - 10);
    ctx.lineTo(left + size - 20, top + size - 20);
    ctx.lineTo(left + size - 12, top + size - 34);
    ctx.stroke();
  }

  // Glowing lightning bolt in the middle
  const glow = 0.6 + Math.sin(time * 4) * 0.4;
  ctx.fillStyle = `rgba(250, 204, 21, ${0.35 * glow})`;
  ctx.beginPath();
  ctx.arc(left + box.radius, box.y - tall, box.radius * 0.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = "30px sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "#facc15";
  ctx.fillText("⚡", left + box.radius, box.y - tall + 11);

  drawLabel(ctx, box.name, box.x, top - 40);
  if (box.nameHe) drawLabel(ctx, box.nameHe, box.x, top - 20); // Hebrew underneath
  drawHealthBar(ctx, box.x, top - 13, box.hp, box.maxHp);
}

// ---------- Minimap ----------
// A tiny copy of the whole map in the corner. It shows the rivers, both bases,
// where the flags are, you (yellow), and your teammates.
// Enemies only show up if they're carrying a flag, so you can chase them!

function drawMinimap(ctx, left, top, width, me, players, flags, time) {
  const s = width / MAP.width;              // how much to shrink the map
  const height = MAP.height * s;
  const mx = (x) => left + x * s;           // world x → minimap x
  const my = (y) => top + y * s;            // world y → minimap y

  // Background and border
  ctx.fillStyle = "rgba(45, 90, 40, 0.85)";
  ctx.fillRect(left, top, width, height);
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 2;
  ctx.strokeRect(left, top, width, height);

  // Rivers
  ctx.strokeStyle = COLORS.water;
  ctx.lineWidth = 4;
  ctx.lineJoin = "round";
  for (const river of MAP.rivers) {
    ctx.beginPath();
    river.points.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(mx(x), my(y)) : ctx.lineTo(mx(x), my(y))));
    ctx.stroke();
  }

  // Bases
  for (const team of ["blue", "red"]) {
    const base = MAP.bases[team];
    ctx.fillStyle = team === "blue" ? "rgba(59,130,246,0.45)" : "rgba(239,68,68,0.45)";
    ctx.beginPath();
    ctx.arc(mx(base.x), my(base.y), base.radius * s, 0, Math.PI * 2);
    ctx.fill();
  }

  // Players
  for (const p of Object.values(players)) {
    if (!p.alive) continue;
    const isMe = me && p.id === me.id;
    // Hiding in a log: not on the minimap either (unless we're both in the same log).
    if (p.inLog && !isMe && p.inLog !== me.inLog) continue;
    const isTeammate = me && p.team === me.team;
    if (!isMe && !isTeammate && !p.carrying) continue; // hide enemies unless they have a flag
    ctx.fillStyle = isMe ? "#facc15" : COLORS[p.team];
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(mx(p.x), my(p.y), isMe ? 4.5 : 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Flags (blink when they're away from home)
  if (flags) {
    for (const flag of Object.values(flags)) {
      if (flag.state !== "home" && Math.sin(time * 8) < 0) continue;
      ctx.font = "13px sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = COLORS[flag.team];
      ctx.fillText("⚑", mx(flag.x) + 3, my(flag.y) + 2);
    }
  }
}

// ---------- Effects: hammer shockwaves and floating damage numbers ----------

function drawEffects(ctx, effects, time) {
  for (const e of effects) {
    const t = (time - e.born) / e.life; // 0 when it starts → 1 when it's gone
    if (e.kind === "boom") {
      // A pomegranate grenade going off: an orange flash, then red seeds flying out.
      ctx.fillStyle = `rgba(251, 146, 60, ${0.55 * (1 - t)})`;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.radius * (0.3 + 0.7 * Math.min(1, t * 2.5)), 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(185, 28, 28, ${1 - t})`;
      for (let i = 0; i < 18; i++) {
        const angle = i * 2.4 + e.x * 0.01; // spread out evenly (the same on every phone)
        const dist = e.radius * t * (0.6 + 0.4 * ((i * 7) % 5) / 4);
        ctx.beginPath();
        ctx.ellipse(e.x + Math.cos(angle) * dist, e.y + Math.sin(angle) * dist, 5, 3.5, angle, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (e.kind === "ring") {
      ctx.strokeStyle = `rgba(255,255,255,${1 - t})`;
      ctx.lineWidth = 8 * (1 - t) + 1;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.radius * (0.5 + 0.5 * t), 0, Math.PI * 2);
      ctx.stroke();
    } else if (e.kind === "text") {
      ctx.globalAlpha = 1 - t;
      ctx.textAlign = "center";
      ctx.lineWidth = 5;
      ctx.strokeStyle = "rgba(0,0,0,0.7)";
      ctx.fillStyle = e.color;
      const y = e.y - t * 45;
      if (e.he) {
        // Hebrew on top (big), English underneath (smaller).
        ctx.font = "800 26px Rubik, sans-serif";
        ctx.strokeText(e.he, e.x, y);
        ctx.fillText(e.he, e.x, y);
        ctx.font = "700 17px Rubik, sans-serif";
        ctx.lineWidth = 4;
        ctx.strokeText(e.text, e.x, y + 22);
        ctx.fillText(e.text, e.x, y + 22);
      } else {
        // Just one line (like "-25").
        ctx.font = "800 26px Rubik, sans-serif";
        ctx.strokeText(e.text, e.x, y);
        ctx.fillText(e.text, e.x, y);
      }
      ctx.globalAlpha = 1;
    }
  }
}
