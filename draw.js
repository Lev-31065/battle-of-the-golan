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

// ---------- The map ----------

function drawMap(ctx, time) {
  // 1. Grass covering the whole map.
  ctx.fillStyle = COLORS.grass;
  ctx.fillRect(0, 0, MAP.width, MAP.height);

  // 2. Grass patches for texture.
  for (const patch of MAP.grassPatches) {
    ctx.fillStyle = patch.light ? COLORS.grassLight : COLORS.grassDark;
    ctx.beginPath();
    ctx.ellipse(patch.x, patch.y, patch.r, patch.r * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Bases (drawn before rivers and decorations so they sit "on the ground").
  drawBase(ctx, MAP.bases.blue, "blue");
  drawBase(ctx, MAP.bases.red, "red");

  // 4. Rivers: a sandy bank, then the water, then moving sparkles on top.
  for (const river of MAP.rivers) {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    traceLine(ctx, river.points);
    ctx.strokeStyle = COLORS.riverBank;
    ctx.lineWidth = river.width + 18;
    ctx.stroke();
    ctx.strokeStyle = COLORS.water;
    ctx.lineWidth = river.width;
    ctx.stroke();
    // Dashed light line that slides along — it makes the water look like it's flowing.
    ctx.setLineDash([24, 60]);
    ctx.lineDashOffset = -time * 40;
    ctx.strokeStyle = COLORS.waterShine;
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // 5. Bridges over the rivers.
  for (const bridge of MAP.bridges) drawBridge(ctx, bridge);

  // 6. Rocks and trees.
  for (const [x, y] of MAP.rocks) drawRock(ctx, x, y);
  for (const [x, y] of MAP.trees) drawTree(ctx, x, y);
}

// Draws a path through a list of points (used for rivers).
function traceLine(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
}

function drawBase(ctx, base, team) {
  ctx.beginPath();
  ctx.arc(base.x, base.y, base.radius, 0, Math.PI * 2);
  ctx.fillStyle = team === "blue" ? "rgba(59,130,246,0.18)" : "rgba(239,68,68,0.18)";
  ctx.fill();
  ctx.setLineDash([18, 12]);
  ctx.lineWidth = 6;
  ctx.strokeStyle = COLORS[team];
  ctx.stroke();
  ctx.setLineDash([]);

  // Label under the base.
  ctx.font = "800 26px Rubik, sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = COLORS[team];
  ctx.fillText(team === "blue" ? "BLUE BASE" : "RED BASE", base.x, base.y + base.radius - 44);
  ctx.fillText(team === "blue" ? "בָּסִיס כָּחֹל" : "בָּסִיס אָדֹם", base.x, base.y + base.radius - 16); // Hebrew underneath
}

function drawBridge(ctx, b) {
  const left = b.x - b.w / 2;
  const top = b.y - b.h / 2;
  // Wooden deck
  ctx.fillStyle = COLORS.plank;
  ctx.fillRect(left, top, b.w, b.h);
  // Plank lines
  ctx.strokeStyle = COLORS.plankDark;
  ctx.lineWidth = 2;
  for (let x = left + 14; x < left + b.w; x += 14) {
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, top + b.h);
    ctx.stroke();
  }
  // Railings on both sides
  ctx.fillStyle = COLORS.plankDark;
  ctx.fillRect(left, top - 4, b.w, 7);
  ctx.fillRect(left, top + b.h - 3, b.w, 7);
}

function drawTree(ctx, x, y) {
  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(x + 8, y + 12, 44, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  // Leaves: a few overlapping circles
  ctx.fillStyle = "#3f8a3a";
  for (const [ox, oy, r] of [[-16, 6, 28], [16, 6, 28], [0, -12, 30], [0, 10, 30]]) {
    ctx.beginPath();
    ctx.arc(x + ox, y + oy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // Highlight
  ctx.fillStyle = "#5aa84f";
  ctx.beginPath();
  ctx.arc(x - 8, y - 14, 14, 0, Math.PI * 2);
  ctx.fill();
}

function drawRock(ctx, x, y) {
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(x + 6, y + 8, 30, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#9ca3af";
  ctx.beginPath();
  ctx.ellipse(x, y, 30, 22, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#c4c9d1";
  ctx.beginPath();
  ctx.ellipse(x - 8, y - 6, 12, 8, 0.3, 0, Math.PI * 2);
  ctx.fill();
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
  for (const [x, y, r] of MAP.bushes) {
    ctx.globalAlpha = 0.7; // see-through, so you can still find yourself
    ctx.fillStyle = "#2f7d32";
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(x + Math.cos(angle) * r * 0.55, y + Math.sin(angle) * r * 0.55, r * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(x, y, r * 0.6, 0, Math.PI * 2);
    ctx.fill();
    // Lighter leaves and a few berries on top
    ctx.fillStyle = "#43a047";
    for (const [ox, oy] of [[-0.3, -0.3], [0.3, -0.1], [-0.05, 0.3]]) {
      ctx.beginPath();
      ctx.arc(x + ox * r, y + oy * r, r * 0.28, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#e53935";
    for (const [ox, oy] of [[-0.45, 0.1], [0.4, 0.35], [0.1, -0.5]]) {
      ctx.beginPath();
      ctx.arc(x + ox * r, y + oy * r, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
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
