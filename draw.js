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
  red: "#ef4444",
  redLight: "#fca5a5",
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

  // 5. Rocks and trees.
  for (const [x, y] of MAP.rocks) drawSprite(ctx, rockSprite(), x, y);
  for (const [x, y] of MAP.trees) drawSprite(ctx, treeSprite(), x, y);
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

// Dirt paths: from each base to its two bridges, and from the bridges to the
// ⚡ box in the middle. Just for looks (and to help find the way); they don't change speed.
const DIRT_PATHS = [
  [[220, 600], [390, 420], [560, 250]],
  [[220, 600], [400, 730], [580, 820]],
  [[720, 250], [860, 420], [1000, 600]],
  [[740, 820], [880, 690], [1000, 600]],
  [[1000, 600], [1140, 430], [1280, 300]],
  [[1000, 600], [1130, 770], [1270, 900]],
  [[1440, 300], [1610, 440], [1780, 600]],
  [[1430, 900], [1600, 770], [1780, 600]],
];

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
      for (const path of DIRT_PATHS) {
        traceCurve(g, path);
        g.stroke();
      }
    }
    g.fillStyle = "rgba(120, 95, 60, 0.45)";
    for (const path of DIRT_PATHS) {
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
  // Railings on both sides, with posts
  ctx.fillStyle = COLORS.plankDark;
  ctx.fillRect(left, top - 4, b.w, 7);
  ctx.fillRect(left, top + b.h - 3, b.w, 7);
  ctx.fillStyle = "#5c3d1e";
  for (let x = left; x <= left + b.w; x += b.w / 4) {
    ctx.fillRect(x - 4, top - 7, 8, 12);
    ctx.fillRect(x - 4, top + b.h - 6, 8, 12);
  }
}

// A tree seen from above: a shadow, then dark → light layers of leaf clumps.
function treeSprite() {
  return sprites.tree || (sprites.tree = makeSprite(150, (g) => {
    g.fillStyle = "rgba(0,0,0,0.2)";
    g.beginPath();
    g.ellipse(10, 16, 56, 40, 0, 0, Math.PI * 2);
    g.fill();
    const clumps = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      clumps.push([Math.cos(angle) * 30, Math.sin(angle) * 26]);
    }
    g.fillStyle = "#24592a"; // dark outline
    for (const [x, y] of clumps) dot(g, x, y, 28);
    dot(g, 0, 0, 36);
    g.fillStyle = "#357a34"; // leaves
    for (const [x, y] of clumps) dot(g, x - 2, y - 3, 24);
    dot(g, -2, -3, 33);
    g.fillStyle = "#4b9a43"; // lighter leaves where the sun hits (top-left)
    for (const [x, y, r] of [[-14, -14, 20], [10, -18, 15], [-24, 6, 14], [6, 2, 16]]) dot(g, x, y, r);
    g.fillStyle = "#6dbb5c"; // little shiny spots
    for (const [x, y, r] of [[-18, -20, 8], [6, -24, 6], [-28, 0, 5], [2, -4, 6]]) dot(g, x, y, r);
  }));
}

// A grey rock with a shadow, a lighter top, a highlight, a crack and a bit of moss.
function rockSprite() {
  return sprites.rock || (sprites.rock = makeSprite(90, (g) => {
    g.fillStyle = "rgba(0,0,0,0.22)";
    g.beginPath();
    g.ellipse(7, 10, 32, 19, 0, 0, Math.PI * 2);
    g.fill();
    const lumpy = (scale) => {
      g.beginPath();
      const corners = [[-31, 2], [-24, -16], [-4, -23], [18, -19], [32, -4], [27, 14], [6, 21], [-18, 18]];
      corners.forEach(([x, y], i) => (i === 0 ? g.moveTo(x * scale, y * scale) : g.lineTo(x * scale, y * scale)));
      g.closePath();
    };
    lumpy(1);
    g.fillStyle = "#7d858f";
    g.fill();
    g.strokeStyle = "#4b5563";
    g.lineWidth = 2.5;
    g.lineJoin = "round";
    g.stroke();
    g.save();
    g.translate(-4, -5);
    lumpy(0.72);
    g.fillStyle = "#a3abb5";
    g.fill();
    g.restore();
    g.fillStyle = "#d3d8de";
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
    g.fillStyle = "rgba(90, 150, 70, 0.8)"; // moss
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

  // The hammer is held in the right hand. While swinging, it spins all the way around.
  let handAngleR = p.facing + 0.9;
  const swingProgress = (time - p.lastSwing) / SWING_TIME; // 0 → 1 during a swing
  if (swingProgress >= 0 && swingProgress < 1) handAngleR += swingProgress * Math.PI * 2;
  if (p.weapon === "hammer") drawHammer(ctx, p.x, y, handAngleR, p.radius);

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

  // Body
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(p.x, y, p.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Shine on the body
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.arc(p.x - p.radius * 0.35, y - p.radius * 0.35, p.radius * 0.3, 0, Math.PI * 2);
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

function drawBushes(ctx) {
  // The whole bush is one picture, made see-through all at once, so overlapping
  // leaves don't make darker spots, and you can still find yourself inside.
  ctx.globalAlpha = 0.75;
  for (const [x, y, r] of MAP.bushes) drawSprite(ctx, bushSprite(r), x, y);
  ctx.globalAlpha = 1;
}

// A round, leafy bush `r` units in radius: dark edge, leaves, light leaves, berries.
function bushSprite(r) {
  const name = "bush" + r;
  return sprites[name] || (sprites[name] = makeSprite(r * 2.6, (g) => {
    const random = seededRandom(r * 13);
    const ring = [];
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2 + random() * 0.3;
      ring.push([Math.cos(angle) * r * 0.62, Math.sin(angle) * r * 0.62, r * (0.42 + random() * 0.1)]);
    }
    g.fillStyle = "#1d5422"; // dark edge
    for (const [x, y, size] of ring) dot(g, x, y, size + 3);
    dot(g, 0, 0, r * 0.75);
    g.fillStyle = "#2e7d32"; // leaves
    for (const [x, y, size] of ring) dot(g, x - 2, y - 3, size);
    dot(g, -2, -3, r * 0.7);
    g.fillStyle = "#43a047"; // lighter leaves (top-left, where the sun hits)
    for (let i = 0; i < 7; i++) {
      const angle = random() * Math.PI * 2;
      const dist = random() * r * 0.55;
      dot(g, Math.cos(angle) * dist - r * 0.1, Math.sin(angle) * dist - r * 0.12, r * (0.16 + random() * 0.1));
    }
    g.fillStyle = "#66bb6a"; // shiny leaf tips
    for (let i = 0; i < 9; i++) {
      const angle = random() * Math.PI * 2;
      const dist = random() * r * 0.7;
      dot(g, Math.cos(angle) * dist - r * 0.1, Math.sin(angle) * dist - r * 0.12, r * 0.06);
    }
    for (let i = 0; i < 6; i++) { // red berries with a little shine
      const angle = random() * Math.PI * 2;
      const dist = r * (0.3 + random() * 0.45);
      const bx = Math.cos(angle) * dist;
      const by = Math.sin(angle) * dist;
      g.fillStyle = "#d32f2f";
      dot(g, bx, by, 4.5);
      g.fillStyle = "rgba(255,255,255,0.7)";
      dot(g, bx - 1.5, by - 1.5, 1.5);
    }
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
  const left = box.x - box.radius + wobble;
  const top = box.y - box.radius;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.fillRect(left + 6, top + 8, size, size);
  // Wooden crate
  ctx.fillStyle = "#c58b45";
  ctx.fillRect(left, top, size, size);
  ctx.strokeStyle = "#7a5229";
  ctx.lineWidth = 4;
  ctx.strokeRect(left, top, size, size);
  ctx.beginPath(); // the "X" of planks across the crate
  ctx.moveTo(left, top);
  ctx.lineTo(left + size, top + size);
  ctx.moveTo(left + size, top);
  ctx.lineTo(left, top + size);
  ctx.stroke();

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
  ctx.arc(left + box.radius, box.y, box.radius * 0.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = "30px sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "#facc15";
  ctx.fillText("⚡", left + box.radius, box.y + 11);

  drawLabel(ctx, box.name, box.x, box.y - box.radius - 40);
  if (box.nameHe) drawLabel(ctx, box.nameHe, box.x, box.y - box.radius - 20); // Hebrew underneath
  drawHealthBar(ctx, box.x, box.y - box.radius - 13, box.hp, box.maxHp);
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
    if (e.kind === "ring") {
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
