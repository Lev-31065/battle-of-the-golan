// race-3d.js — draws Mt Hermon Racing in REAL 3D.
//
// race-draw.js fakes 3D with flat pictures. This file builds an actual little world out of
// triangles (a "mesh") and lets the phone's graphics chip draw it, using the three.js
// library (three.min.js, in this folder). The graphics chip is very good at this, so it is
// usually FASTER than the old flat drawing, and it has nothing to do with the internet:
// each phone draws its own picture, and still only sends "here's where my sled is".
//
// What gets built:
//   - the path, as a real line through the world (the same bends, hills and widths as race-track.js)
//   - the mountain around it: sometimes walls rise on both sides (a valley), sometimes the
//     ground falls away (a ridge with a view), all worked out from the path
//   - trees, bushes, rocks, the gates, the sleds: small 3D models made of simple shapes
//   - snow: soft shading and a fine snow picture on the ground, tracks behind every sled,
//     and spray flying up from the runners (lots of little puffs)
//   - far away: the valley floor, the Kinneret, hazy mountains and the sky
//
// The world is built in square pieces ("chunks") just ahead of you and thrown away behind
// you, so the phone never holds the whole mountain at once.
//
// If a phone can't do 3D (very old, or 3D switched off), race-game.js uses race-draw.js instead.
// Settings: RACE.threeD, RACE.viewDistance, RACE.sharpness, RACE.bend3d (rules.js).

const U3 = 0.01;                                  // one track unit = 0.01 units in the 3D world
const SEG3 = RACE.segmentLength * U3;             // how long one piece of path is, in 3D units
const RW3 = RACE.roadWidth * U3;                  // one "road width" in 3D units
const SHOULDER3 = 26;                             // flat-ish ground beside the path (where the trees stand)
const LAND_REACH = 320;                           // how far from the path the mountain is built

// ---------- Little helpers ----------

function rgb3(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
function mix3(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
function shade3(a, k) {
  return [Math.min(1, a[0] * k), Math.min(1, a[1] * k), Math.min(1, a[2] * k)];
}
function smooth3(a, b, x) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
// "Random" numbers that are always the same for the same inputs.
function rand2(ix, iz) {
  let h = Math.imul(ix | 0, 374761393) + Math.imul(iz | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
// Smooth bumpy noise (for rough ground): -1 … 1.
function noise2(x, z) {
  const ix = Math.floor(x), iz = Math.floor(z);
  const fx = x - ix, fz = z - iz;
  const ux = fx * fx * (3 - 2 * fx), uz = fz * fz * (3 - 2 * fz);
  const a = rand2(ix, iz), b = rand2(ix + 1, iz), c = rand2(ix, iz + 1), d = rand2(ix + 1, iz + 1);
  return (a + (b - a) * ux + (c - a) * uz + (a - b - c + d) * ux * uz) * 2 - 1;
}
function rough2(x, z) {
  return noise2(x, z) * 0.6 + noise2(x * 2.3 + 40, z * 2.3 + 17) * 0.28 + noise2(x * 5.1 + 7, z * 5.1 + 90) * 0.12;
}

// ---------- The path as a real line through the world ----------
// race-track.js only says "this piece bends a little right". Here every point of the path
// gets a real spot: x (sideways), y (height), z (forward is toward MINUS z).

const P3 = (function buildPath3d() {
  const segs = TRACK.segments;
  const N = segs.length;
  const make = () => new Float32Array(N + 1);
  const p = {
    N, x: make(), y: make(), z: make(), heading: make(), cos: make(), sin: make(),
    half: make(), snow: make(), sand: make(), yLand: make(), wallL: make(), wallR: make(),
    edgeL: make().fill(NaN), edgeR: make().fill(NaN),
    waterIndex: N, finishIndex: Math.floor(TRACK.finishZ / RACE.segmentLength),
  };
  let heading = 0;
  for (let n = 0; n <= N; n++) {
    const seg = segs[Math.min(n, N - 1)];
    p.heading[n] = heading;
    p.cos[n] = Math.cos(heading);
    p.sin[n] = Math.sin(heading);
    p.y[n] = (n < N ? seg.p1.world.y : seg.p2.world.y) * U3;
    p.half[n] = seg.width * RW3;
    p.snow[n] = seg.snow;
    p.sand[n] = seg.sand;
    if (seg.water && n < p.waterIndex) p.waterIndex = n;
    if (n < N) {
      p.x[n + 1] = p.x[n] + Math.sin(heading) * SEG3;
      p.z[n + 1] = p.z[n] - Math.cos(heading) * SEG3;
      // Each piece turns the path a little. (A gentle pull back toward "straight ahead"
      // keeps the whole ride heading for the Kinneret, and stops the path crossing itself.)
      heading += seg.curve / RACE.segmentLength * RACE.bend3d - heading * 0.006;
    }
  }
  // Valleys and ridges. In a dip of the path the sides rise up (you're in a valley); on a
  // hilltop they fall away (you're on a peak with a view). On top of that each side slowly
  // changes by itself, so sometimes there's a wall on one side and a drop on the other.
  const sum = new Float64Array(N + 2);
  for (let n = 0; n <= N; n++) sum[n + 1] = sum[n] + p.y[n];
  const wave = (t) => noise2(t, 3.3) * 0.7 + noise2(t * 2.7 + 9, 8.1) * 0.3;
  for (let n = 0; n <= N; n++) {
    const a = Math.max(0, n - 110), b = Math.min(N, n + 110);
    const relief = p.y[n] - (sum[b + 1] - sum[a]) / (b - a + 1); // above (+) or below (-) the ground around it
    const dip = Math.max(-1, Math.min(1, -relief / 9));
    let left = Math.max(-1, Math.min(1, dip * 0.8 + wave(n / 150) * 0.95 + 0.05));
    let right = Math.max(-1, Math.min(1, dip * 0.8 + wave(n / 150 + 400) * 0.95 + 0.05));
    // The start is the very top of the mountain: the ground falls away on both sides.
    const top = 1 - smooth3(60, 200, n);
    left = left + (-0.75 - left) * top;
    right = right + (-0.75 - right) * top;
    p.wallL[n] = left;
    p.wallR[n] = right;
    p.yLand[n] = p.y[n] - (n >= p.waterIndex ? 4 : 0); // the lake bed dips under the water
  }
  p.lakeY = p.y[Math.min(N, p.finishIndex)];
  return p;
})();

// The first point of the path at or past a z (z gets smaller as the path goes on).
function indexAtZ(z) {
  let lo = 0, hi = P3.N;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (P3.z[mid] > z) lo = mid; else hi = mid;
  }
  return lo;
}

// The ground at a spot (px, pz): its height, how far it is from the path, how snowy…
// It looks at the path points nearby (i0 … i1) and blends them, the closest counting most,
// so the ground is smooth everywhere, even inside a bend.
const LAND = { h: 0, base: 0, d: 0, t: 0, half: 0, snow: 0, sand: 0, wall: 0, n: 0 };
function landAt(px, pz, i0, i1) {
  if (i0 === undefined) {
    const guess = indexAtZ(pz);
    i0 = Math.max(0, guess - 420);
    i1 = Math.min(P3.N, guess + 420);
  }
  let sw = 0, sy = 0, sh = 0, ss = 0, sa = 0, sv = 0, best = Infinity, bi = i0;
  for (let i = i0; i <= i1; i += 4) {
    const dx = px - P3.x[i], dz = pz - P3.z[i];
    const d2 = dx * dx + dz * dz;
    if (d2 < best) { best = d2; bi = i; }
    const w = 1 / ((d2 + 30) * (d2 + 30));
    const side = dx * P3.cos[i] + dz * P3.sin[i];
    sw += w; sy += w * P3.yLand[i]; sh += w * P3.half[i]; ss += w * P3.snow[i]; sa += w * P3.sand[i];
    sv += w * (side >= 0 ? P3.wallR[i] : P3.wallL[i]);
  }
  // The exact distance to the path (checking the little pieces around the closest point).
  let d2min = best;
  for (let j = Math.max(0, bi - 4); j < Math.min(P3.N, bi + 4); j++) {
    const ax = P3.x[j], az = P3.z[j], bx = P3.x[j + 1] - ax, bz = P3.z[j + 1] - az;
    const t = Math.max(0, Math.min(1, ((px - ax) * bx + (pz - az) * bz) / (bx * bx + bz * bz)));
    const dx = px - ax - bx * t, dz = pz - az - bz * t;
    d2min = Math.min(d2min, dx * dx + dz * dz);
  }
  const L = LAND;
  L.n = bi;
  L.base = sy / sw; L.half = sh / sw; L.snow = ss / sw; L.sand = sa / sw; L.wall = sv / sw;
  L.d = Math.sqrt(d2min);
  L.t = Math.max(0, L.d - (L.half + 16)); // how far past the flat ground beside the path
  const lift = L.wall > 0
    ? L.wall * 115 * (1 - Math.exp(-L.t / 70))    // a valley wall rising
    : L.wall * 175 * (1 - Math.exp(-L.t / 100));  // the mountainside falling away
  const bumpy = rough2(px * 0.011, pz * 0.011) * (0.3 + Math.min(L.t, 220) * 0.14)
    + noise2(px * 0.09, pz * 0.09) * Math.min(1.2, L.t * 0.05);
  L.h = L.base + (lift + bumpy) * (1 - L.sand * 0.92);
  return L;
}

// The height of the ground at the outer edge of the flat strip beside the path (worked out once, then remembered).
function edgeHeight(n, side) {
  const store = side > 0 ? P3.edgeR : P3.edgeL;
  if (isNaN(store[n])) {
    const lat = side * (P3.half[n] + SHOULDER3);
    store[n] = landAt(P3.x[n] + P3.cos[n] * lat, P3.z[n] + P3.sin[n] * lat).h;
  }
  return store[n];
}

// A big open snowfield isn't flat like a path: the snow rolls gently up and down.
// (Only where the path is very wide, and fading out toward its edges. It's just for looks.)
function fieldRoll(n, lat, half) {
  const wide = smooth3(2.2 * RW3, 3.2 * RW3, half);
  if (wide === 0) return 0;
  const x = P3.x[n] + P3.cos[n] * lat, z = P3.z[n] + P3.sin[n] * lat;
  return wide * smooth3(0, 16, half - Math.abs(lat)) * (rough2(x * 0.022, z * 0.022) * 1.3 + 0.3);
}

// The height of the path strip at point n, `lat` units sideways from the middle.
function stripHeight(n, lat) {
  const a = Math.abs(lat), half = P3.half[n], y = P3.y[n];
  if (a <= half) return y + fieldRoll(n, lat, half);
  if (a <= half + 3) return y + 0.45 * (a - half) / 3; // the little bank of snow along the edge
  const edge = edgeHeight(n, lat > 0 ? 1 : -1);
  if (a >= half + SHOULDER3) return edge;
  return y + 0.45 + (edge - y - 0.45) * (a - half - 3) / (SHOULDER3 - 3);
}

// Where a spot on the path is in the world. along = distance along the path (track units),
// side = how far left/right (in road widths, like a sled's x). Fills in `out`.
function pathSpot(along, side, out) {
  const f0 = Math.max(0, Math.min(P3.N - 0.001, along / RACE.segmentLength));
  const i = Math.floor(f0), f = f0 - i, lat = side * RW3;
  const heading = P3.heading[i] + (P3.heading[i + 1] - P3.heading[i]) * f;
  const c = Math.cos(heading), s = Math.sin(heading);
  out.x = P3.x[i] + (P3.x[i + 1] - P3.x[i]) * f + c * lat;
  out.z = P3.z[i] + (P3.z[i + 1] - P3.z[i]) * f + s * lat;
  const y0 = stripHeight(i, lat), y1 = stripHeight(i + 1, lat);
  out.y = y0 + (y1 - y0) * f;
  out.heading = heading;
  const a = Math.max(0, i - 1), b = Math.min(P3.N, i + 3);
  out.slope = (P3.y[b] - P3.y[a]) / ((b - a) * SEG3); // minus = downhill
  out.index = i;
  return out;
}

// ---------- Building shapes out of triangles ----------
// A MeshBuilder collects triangles (each corner has a spot and a color). `place` says where
// the next shapes go (and which way they face, and how big), so a tree can be described
// once, around (0, 0, 0), and then planted anywhere.

function MeshBuilder() {
  this.p = [];
  this.c = [];
  this.place(0, 0, 0, 0, 1);
  this.flip = false;
}
MeshBuilder.prototype.place = function (x, y, z, turn, size) {
  this.ox = x; this.oy = y; this.oz = z;
  this.cs = Math.cos(turn || 0); this.sn = Math.sin(turn || 0);
  this.k = size || 1;
};
MeshBuilder.prototype.vert = function (x, y, z, col) {
  const X = x * this.k, Y = y * this.k, Z = z * this.k * (this.flip ? -1 : 1);
  this.p.push(this.ox + X * this.cs + Z * this.sn, this.oy + Y, this.oz - X * this.sn + Z * this.cs);
  this.c.push(col[0], col[1], col[2]);
};
MeshBuilder.prototype.tri = function (a, b, c, col) {
  this.vert(a[0], a[1], a[2], col); this.vert(b[0], b[1], b[2], col); this.vert(c[0], c[1], c[2], col);
};
MeshBuilder.prototype.quad = function (a, b, c, d, col) {
  this.tri(a, b, c, col); this.tri(a, c, d, col);
};
// A box from its middle and its size.
MeshBuilder.prototype.box = function (cx, cy, cz, sx, sy, sz, col) {
  const x0 = cx - sx / 2, x1 = cx + sx / 2, y0 = cy - sy / 2, y1 = cy + sy / 2, z0 = cz - sz / 2, z1 = cz + sz / 2;
  const v = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
  for (const f of [[0, 1, 2, 3], [5, 4, 7, 6], [4, 0, 3, 7], [1, 5, 6, 2], [3, 2, 6, 7], [4, 5, 1, 0]]) this.quad(v[f[0]], v[f[1]], v[f[2]], v[f[3]], col);
};
// A tube (or a cone, if one end's radius is 0) from one point to another.
MeshBuilder.prototype.tube = function (a, ra, b, rb, sides, col, capped) {
  const ax = b[0] - a[0], ay = b[1] - a[1], az = b[2] - a[2];
  const len = Math.hypot(ax, ay, az) || 1;
  const dx = ax / len, dy = ay / len, dz = az / len;
  // Two directions at right angles to the tube.
  let ux = dy, uy = -dx, uz = 0;
  if (Math.abs(dx) + Math.abs(dy) < 0.001) { ux = 1; uy = 0; uz = 0; }
  const ul = Math.hypot(ux, uy, uz); ux /= ul; uy /= ul; uz /= ul;
  const vx = dy * uz - dz * uy, vy = dz * ux - dx * uz, vz = dx * uy - dy * ux;
  const ring = (p, r, k) => {
    const an = k / sides * Math.PI * 2, c = Math.cos(an) * r, s = Math.sin(an) * r;
    return [p[0] + ux * c + vx * s, p[1] + uy * c + vy * s, p[2] + uz * c + vz * s];
  };
  for (let k = 0; k < sides; k++) {
    const a0 = ring(a, ra, k), a1 = ring(a, ra, k + 1), b0 = ring(b, rb, k), b1 = ring(b, rb, k + 1);
    const tone = shade3(col, 0.9 + 0.2 * (k / sides));
    if (rb > 0) this.quad(a0, a1, b1, b0, tone); else this.tri(a0, a1, b, tone);
    if (capped && rb > 0) this.tri(b0, b1, b, tone);
  }
};
// A lumpy ball (a 20-sided shape with its corners pushed in and out a bit). Triangles that
// face up can have their own color: that's how snow sits on top of the trees.
const ICO_T = (1 + Math.sqrt(5)) / 2;
const ICO_V = [[-1, ICO_T, 0], [1, ICO_T, 0], [-1, -ICO_T, 0], [1, -ICO_T, 0], [0, -1, ICO_T], [0, 1, ICO_T], [0, -1, -ICO_T], [0, 1, -ICO_T], [ICO_T, 0, -1], [ICO_T, 0, 1], [-ICO_T, 0, -1], [-ICO_T, 0, 1]]
  .map((v) => { const l = Math.hypot(v[0], v[1], v[2]); return [v[0] / l, v[1] / l, v[2] / l]; });
const ICO_F = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
MeshBuilder.prototype.blob = function (cx, cy, cz, rx, ry, rz, col, seed, lumpy, topCol) {
  const v = ICO_V.map((p, i) => {
    const k = 1 + (rand2(seed * 31 + i, seed) - 0.5) * (lumpy === undefined ? 0.3 : lumpy);
    return [cx + p[0] * rx * k, cy + p[1] * ry * k, cz + p[2] * rz * k];
  });
  ICO_F.forEach((f, i) => {
    const up = (ICO_V[f[0]][1] + ICO_V[f[1]][1] + ICO_V[f[2]][1]) / 3;
    const base = topCol && up > 0.25 ? topCol : col;
    this.tri(v[f[0]], v[f[1]], v[f[2]], shade3(base, 0.93 + rand2(i, seed + 5) * 0.14));
  });
};
MeshBuilder.prototype.geometry = function () {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(this.p), 3));
  g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(this.c), 3));
  return g;
};

// The same, for the GROUND (the path and the snow beside it). Trees and rocks look good
// "carved" (every triangle its own shade), but snow should look soft. So here neighbouring
// triangles share their light at each corner (a "smooth normal"), and every corner knows
// where it is on the snow picture (see makeSnowPicture). ox, oz = where the piece is in the world.
MeshBuilder.prototype.groundGeometry = function (ox, oz) {
  const p = this.p, c = this.c, count = p.length / 3;
  const normal = new Float32Array(p.length), uv = new Float32Array(count * 2);
  const sums = new Map(), keys = new Array(count);
  const swap = (arr, i, j) => { for (let k = 0; k < 3; k++) { const t = arr[i + k]; arr[i + k] = arr[j + k]; arr[j + k] = t; } };
  for (let i = 0; i < count; i += 3) {
    const a = i * 3, b = a + 3, d = a + 6;
    // Which way this triangle faces (always made to face UP, so the light falls on its top).
    let nx = (p[b + 1] - p[a + 1]) * (p[d + 2] - p[a + 2]) - (p[b + 2] - p[a + 2]) * (p[d + 1] - p[a + 1]);
    let ny = (p[b + 2] - p[a + 2]) * (p[d] - p[a]) - (p[b] - p[a]) * (p[d + 2] - p[a + 2]);
    let nz = (p[b] - p[a]) * (p[d + 1] - p[a + 1]) - (p[b + 1] - p[a + 1]) * (p[d] - p[a]);
    if (ny < 0) { swap(p, b, d); swap(c, b, d); nx = -nx; ny = -ny; nz = -nz; }
    for (let v = i; v < i + 3; v++) {
      const key = Math.round(p[v * 3] * 16) + "_" + Math.round(p[v * 3 + 1] * 16) + "_" + Math.round(p[v * 3 + 2] * 16);
      keys[v] = key;
      let sum = sums.get(key);
      if (!sum) { sum = [0, 0, 0]; sums.set(key, sum); }
      sum[0] += nx; sum[1] += ny; sum[2] += nz;
    }
  }
  const su = ((ox % SNOW_TILE) + SNOW_TILE) % SNOW_TILE, sv = ((oz % SNOW_TILE) + SNOW_TILE) % SNOW_TILE;
  for (let v = 0; v < count; v++) {
    const sum = sums.get(keys[v]), len = Math.hypot(sum[0], sum[1], sum[2]) || 1;
    normal[v * 3] = sum[0] / len; normal[v * 3 + 1] = sum[1] / len; normal[v * 3 + 2] = sum[2] / len;
    uv[v * 2] = (p[v * 3] + su) / SNOW_TILE; uv[v * 2 + 1] = (p[v * 3 + 2] + sv) / SNOW_TILE;
  }
  const g = this.geometry();
  g.setAttribute("normal", new THREE.BufferAttribute(normal, 3));
  g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return g;
};

// ---------- Trees, bushes, rocks… as little 3D models ----------
// Each one is built around (0, 0, 0), standing on the ground. Sizes are in 3D units
// (a sled is 6 wide). `seed` makes every tree a little different.

const COL = {
  bark: rgb3("#5b3f26"), barkOlive: rgb3("#6b5a45"), barkPalm: rgb3("#8b6a42"),
  leafDark: rgb3("#345026"), leaf: rgb3("#47692f"), leafLight: rgb3("#64883d"),
  olive: rgb3("#75865a"), oliveLight: rgb3("#98a97c"),
  blossom: rgb3("#f6d6df"), blossomDeep: rgb3("#e9a9bf"), palm: rgb3("#3f7a3a"),
  rock: rgb3("#4a4744"), rockLight: rgb3("#6a6660"), snow: rgb3("#f7fafd"),
  wood: rgb3("#8b5a2b"), woodDark: rgb3("#5e3b1c"), orange: rgb3("#f97316"), dark: rgb3("#1f2937"),
  reed: rgb3("#7c8b3e"), reedTip: rgb3("#7a5230"),
};

const MODELS = {
  bush(B, seed, snowy) {
    const top = snowy ? COL.snow : null;
    B.blob(-2.1, 1.5, 0.2, 2.5, 2.0, 2.4, COL.leafDark, seed, 0.3, top);
    B.blob(0.2, 2.1, -0.2, 3.0, 2.6, 2.9, COL.leaf, seed + 1, 0.3, top);
    B.blob(2.2, 1.5, 0.3, 2.4, 1.9, 2.3, COL.leafLight, seed + 2, 0.3, top);
  },
  bushSnow(B, seed) { MODELS.bush(B, seed, true); },
  oak(B, seed, snowy) {
    const top = snowy ? COL.snow : null;
    B.tube([0, 0, 0], 1.0, [0.2, 6.5, 0], 0.6, 6, COL.bark);
    B.tube([0.1, 4.5, 0], 0.45, [-2.6, 7.5, 0.6], 0.25, 4, COL.bark);
    B.tube([0.1, 4.8, 0], 0.45, [2.6, 7.8, -0.5], 0.25, 4, COL.bark);
    B.blob(0, 10.6, 0, 5.2, 4.3, 5.2, COL.leaf, seed, 0.32, top);
    B.blob(-3.6, 8.4, 1.0, 3.9, 3.1, 3.9, COL.leafDark, seed + 1, 0.32, top);
    B.blob(3.6, 8.8, -0.8, 3.9, 3.2, 3.9, COL.leafLight, seed + 2, 0.32, top);
    B.blob(0.4, 8.6, 3.0, 3.4, 2.8, 3.2, COL.leaf, seed + 3, 0.32, top);
  },
  oakSnow(B, seed) { MODELS.oak(B, seed, true); },
  olive(B, seed) {
    B.tube([0, 0, 0], 1.2, [-0.9, 2.8, 0.3], 0.9, 6, COL.barkOlive);
    B.tube([-0.9, 2.8, 0.3], 0.9, [0.5, 5.6, -0.2], 0.6, 6, COL.barkOlive);
    B.tube([0, 4.2, 0], 0.4, [-3, 6.4, 0.5], 0.25, 4, COL.barkOlive);
    B.blob(0.3, 7.6, 0, 4.8, 2.9, 4.6, COL.olive, seed, 0.35);
    B.blob(-3.4, 6.8, 0.8, 3.3, 2.2, 3.2, COL.oliveLight, seed + 1, 0.35);
    B.blob(3.5, 7.0, -0.6, 3.4, 2.3, 3.3, COL.olive, seed + 2, 0.35);
  },
  almond(B, seed) {
    B.tube([0, 0, 0], 0.7, [0, 5.5, 0], 0.45, 5, COL.woodDark);
    for (const [x, z] of [[-3, 0.5], [3, -0.5], [0.3, 2.8], [-0.3, -2.6]]) B.tube([0, 5, 0], 0.3, [x, 8.5, z], 0.15, 4, COL.woodDark);
    B.blob(0, 9.6, 0, 4.2, 3.1, 4.2, COL.blossom, seed, 0.4, COL.snow);
    B.blob(-3.2, 8.2, 0.6, 3.0, 2.3, 3.0, COL.blossomDeep, seed + 1, 0.4, COL.blossom);
    B.blob(3.2, 8.4, -0.6, 3.1, 2.4, 3.1, COL.blossom, seed + 2, 0.4, COL.snow);
    B.blob(0.3, 8.0, 2.8, 2.6, 2.0, 2.6, COL.blossomDeep, seed + 3, 0.4, COL.blossom);
  },
  palm(B, seed) {
    B.tube([0, 0, 0], 0.75, [-0.6, 7, 0], 0.6, 6, COL.barkPalm);
    B.tube([-0.6, 7, 0], 0.6, [-0.2, 14, 0.2], 0.52, 6, shade3(COL.barkPalm, 0.9));
    B.tube([-0.2, 14, 0.2], 0.52, [0.6, 20, 0], 0.45, 6, COL.barkPalm);
    for (let k = 0; k < 8; k++) {
      const an = k / 8 * Math.PI * 2 + seed, c = Math.cos(an), s = Math.sin(an);
      const top = [0.6, 20.3, 0], mid = [0.6 + c * 3.2, 21.6, s * 3.2], tip = [0.6 + c * 6.4, 18.2, s * 6.4];
      const wide = [-s * 0.9, 0, c * 0.9];
      const leaf = shade3(COL.palm, 0.85 + (k % 3) * 0.12);
      B.tri(top, [mid[0] + wide[0], mid[1], mid[2] + wide[2]], [mid[0] - wide[0], mid[1], mid[2] - wide[2]], leaf);
      B.tri([mid[0] + wide[0], mid[1], mid[2] + wide[2]], tip, [mid[0] - wide[0], mid[1], mid[2] - wide[2]], shade3(leaf, 0.9));
    }
  },
  rock(B, seed, snowy) {
    B.blob(0, 1.3, 0, 3.6, 2.6, 3.0, COL.rock, seed, 0.5, snowy ? COL.snow : COL.rockLight);
    B.blob(2.0, 0.7, 0.8, 1.7, 1.3, 1.6, shade3(COL.rock, 0.9), seed + 4, 0.5, snowy ? COL.snow : null);
  },
  rockSnow(B, seed) { MODELS.rock(B, seed, true); },
  snowman(B, seed) {
    B.blob(0, 1.9, 0, 2.1, 2.0, 2.1, COL.snow, seed, 0.08);
    B.blob(0, 4.5, 0, 1.55, 1.5, 1.55, COL.snow, seed + 1, 0.08);
    B.blob(0, 6.3, 0, 1.1, 1.1, 1.1, COL.snow, seed + 2, 0.08);
    B.box(0, 7.25, 0, 2.0, 0.2, 2.0, COL.dark);
    B.box(0, 7.9, 0, 1.3, 1.2, 1.3, COL.dark);
    B.tube([0, 6.3, 1.0], 0.22, [0, 6.2, 2.0], 0, 5, COL.orange);
    B.box(0, 5.5, 0, 2.5, 0.45, 2.5, rgb3("#2563eb"));
    B.tube([-1.3, 4.8, 0], 0.12, [-3.2, 6.2, 0.3], 0.08, 4, COL.woodDark);
    B.tube([1.3, 4.8, 0], 0.12, [3.2, 5.6, 0.3], 0.08, 4, COL.woodDark);
  },
  cabin(B) {
    const wall = COL.wood, roof = rgb3("#3f2a17");
    B.box(0, 3.4, 0, 15, 6.8, 10, wall);
    for (let y = 1; y < 6.8; y += 1.1) B.box(0, y, 0, 15.15, 0.14, 10.15, COL.woodDark); // the gaps between the logs
    // The roof, with thick snow on it.
    for (const [lift, over, col] of [[0, 0, roof], [0.5, 0.25, COL.snow]]) {
      const y0 = 6.6 + lift, y1 = 11.2 + lift, hx = 8.4 - over, hz = 5.8;
      B.quad([-hx, y0, hz], [0, y1, hz], [0, y1, -hz], [-hx, y0, -hz], col);
      B.quad([hx, y0, hz], [0, y1, hz], [0, y1, -hz], [hx, y0, -hz], col);
    }
    B.tri([-7.5, 6.8, 5.02], [7.5, 6.8, 5.02], [0, 11.2, 5.02], wall);
    B.tri([-7.5, 6.8, -5.02], [7.5, 6.8, -5.02], [0, 11.2, -5.02], wall);
    B.box(3.2, 10.6, -1.5, 1.3, 3.4, 1.3, rgb3("#4b2e14"));           // chimney
    B.box(2.6, 2.2, 5.1, 2.4, 4.4, 0.2, COL.woodDark);               // the door
    B.box(-3.2, 3.8, 5.1, 2.6, 2.0, 0.2, rgb3("#fde68a"));           // a warm window
    B.box(7.55, 3.8, 0, 0.2, 2.0, 2.8, rgb3("#fde68a"));
  },
  pole(B) {
    B.box(0, 2.6, 0, 0.32, 5.2, 0.32, COL.dark);
    B.box(0, 5.85, 0, 0.44, 1.3, 0.44, COL.orange);
  },
  reeds(B, seed) {
    for (let k = 0; k < 8; k++) {
      const x = (rand2(k, seed) - 0.5) * 5.5, z = (rand2(seed, k) - 0.5) * 2.5;
      const lean = (rand2(k + 9, seed) - 0.5) * 1.6, tall = 3.4 + rand2(k, seed + 3) * 1.8;
      B.tube([x, 0, z], 0.12, [x + lean, tall, z], 0.08, 3, COL.reed);
      if (k % 2 === 0) B.tube([x + lean, tall, z], 0.2, [x + lean * 1.15, tall + 0.9, z], 0.16, 4, COL.reedTip, true);
    }
  },
  sign() {}, // (the Kinneret sign has writing on it, so it's made separately: see makeSigns)
};

// ---------- The 3D scene ----------

const world3d = {
  failed: false, ready: false, quality: 1, slowFrames: 0, lastFrameAt: 0,
  landChunks: new Map(), pathChunks: new Map(), sleds: new Map(), labels: new Map(),
  shaking: null, spray: [], trails: new Map(),
};

function race3dAvailable() {
  return RACE.threeD && typeof THREE !== "undefined" && !world3d.failed;
}

function hideRace3d() {
  const el = document.getElementById("game3d");
  if (el && !el.hidden) el.hidden = true;
}

function initRace3d() {
  const w3 = world3d;
  const canvas3d = document.getElementById("game3d");
  const ratio = Math.min(window.devicePixelRatio || 1, RACE.sharpness);
  w3.renderer = new THREE.WebGLRenderer({ canvas: canvas3d, antialias: ratio < 2, powerPreference: "high-performance" });
  // If the graphics chip gives up (it happens on some phones), go back to the flat drawing.
  canvas3d.addEventListener("webglcontextlost", () => { w3.failed = true; hideRace3d(); });
  w3.scene = new THREE.Scene();
  w3.haze = new THREE.Color(0xdce7ee);
  w3.scene.fog = new THREE.Fog(w3.haze, 200, 900);
  w3.camera = new THREE.PerspectiveCamera(58, 2, 1, 60000);

  // Light: a soft glow from the whole sky (so shadows are blue, not black), plus the sun.
  w3.scene.add(new THREE.HemisphereLight(0xe9f2ff, 0xa9b4cc, 0.74));
  const sun = new THREE.DirectionalLight(0xfff1d6, 0.5);
  sun.position.set(0.75, 0.7, 0.35);
  w3.scene.add(sun);

  // One paint for everything made of colored triangles. "flatShading" gives each triangle
  // its own light or dark, which is what makes it look like carved, low-poly 3D.
  w3.paint = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true, side: THREE.DoubleSide });
  // The ground's paint: soft (not carved), with a fine snow picture over it (grain, soft hollows, sparkles).
  w3.groundPaint = new THREE.MeshLambertMaterial({ vertexColors: true, map: makeSnowPicture(), side: THREE.DoubleSide });
  // Runner tracks in the snow behind each sled (see-through blue-gray, fading out).
  w3.trailPaint = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 });
  w3.shadowPaint = new THREE.MeshBasicMaterial({ color: 0x20324f, transparent: true, opacity: 0.2, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });

  makeBackdrop();
  makeGates();
  makeSigns();
  makeSpray();
  w3.ready = true;
}

// The snow picture: one small square that repeats all over the ground (every SNOW_TILE units).
// Mostly white, with soft blue-gray hollows, fine grain and tiny bright sparkles, so the
// snow looks like snow instead of flat white paint. (It wraps round, so the repeats join up.)
const SNOW_TILE = 25;
function makeSnowPicture() {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  g.fillStyle = "#ffffff";
  g.fillRect(0, 0, size, size);
  // Soft hollows (and wind ripples: long, thin ones).
  for (let k = 0; k < 70; k++) {
    const x = rand2(k, 11) * size, y = rand2(k, 23) * size, r = 10 + rand2(k, 37) * 34, long = k % 3 === 0 ? 3 : 1;
    for (const dx of [-size, 0, size]) for (const dy of [-size, 0, size]) {
      g.save();
      g.translate(x + dx, y + dy);
      g.scale(long, 1);
      const soft = g.createRadialGradient(0, 0, 0, 0, 0, r);
      soft.addColorStop(0, "rgba(150, 180, 220, 0.13)");
      soft.addColorStop(1, "rgba(150, 180, 220, 0)");
      g.fillStyle = soft;
      g.fillRect(-r, -r, r * 2, r * 2);
      g.restore();
    }
  }
  // Grain: lots of tiny blue-gray specks, and fewer pure white ones (the sparkles).
  for (let k = 0; k < 5200; k++) {
    g.fillStyle = k % 4 === 0 ? "rgba(255, 255, 255, 0.95)" : "rgba(130, 165, 210, 0.16)";
    const s = k % 4 === 0 ? 1.2 : 1.6;
    g.fillRect(rand2(k, 51) * size, rand2(k, 67) * size, s, s);
  }
  const picture = new THREE.CanvasTexture(c);
  picture.wrapS = picture.wrapT = THREE.RepeatWrapping;
  picture.anisotropy = Math.min(4, world3d.renderer.capabilities.getMaxAnisotropy());
  return picture;
}

// Paint for far-away things: instead of disappearing into the mist like the mountain
// around you, they only turn a little hazy, however far they are.
function farPaint(options) {
  const m = new THREE.MeshBasicMaterial(options);
  m.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace("#include <fog_fragment>",
      "#ifdef USE_FOG\n float hazy = smoothstep(1500.0, 22000.0, vFogDepth) * 0.5 + 0.06;\n gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, hazy);\n#endif");
  };
  return m;
}

// The sky, the sun, clouds, the valley floor far below, the Kinneret, and hazy mountains all around.
function makeBackdrop() {
  const w3 = world3d;
  // The sky: a giant ball around the camera, darker blue at the top.
  const skyGeo = new THREE.SphereGeometry(40000, 24, 12);
  const colors = [];
  const top = rgb3("#3f8fd8"), low = rgb3("#d6e8f5");
  const pos = skyGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const t = Math.max(0, Math.min(1, pos.getY(i) / 40000 * 2.2));
    const c = mix3(low, top, Math.pow(t, 0.7));
    colors.push(c[0], c[1], c[2]);
  }
  skyGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  w3.sky = new THREE.Group();
  w3.sky.add(new THREE.Mesh(skyGeo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false })));
  // Clouds, and the sun.
  const B = new MeshBuilder();
  for (let k = 0; k < 9; k++) {
    const an = k / 9 * Math.PI * 2 + rand2(k, 2) * 0.5, up = 0.1 + rand2(k, 4) * 0.2, far = 30000;
    B.place(Math.sin(an) * far, up * far, -Math.cos(an) * far, -an, 900 + rand2(k, 6) * 700);
    const white = [1, 1, 1], gray = [0.86, 0.9, 0.95];
    B.blob(0, 0, 0, 2.6, 0.8, 1, gray, k, 0.3, white);
    B.blob(1.6, 0.5, 0, 1.6, 0.9, 1, gray, k + 20, 0.3, white);
    B.blob(-1.5, 0.4, 0, 1.4, 0.8, 1, gray, k + 40, 0.3, white);
  }
  w3.sky.add(new THREE.Mesh(B.geometry(), new THREE.MeshBasicMaterial({ vertexColors: true, fog: false, side: THREE.DoubleSide })));
  const sunDisc = new THREE.Mesh(new THREE.CircleGeometry(1500, 24), new THREE.MeshBasicMaterial({ color: 0xfffbe3, fog: false }));
  sunDisc.position.set(0.55 * 36000, 0.42 * 36000, -0.72 * 36000);
  sunDisc.lookAt(0, 0, 0);
  w3.sky.add(sunDisc);
  w3.scene.add(w3.sky);

  // The valley floor at the level of the lake: a patchwork of fields (one small picture, repeated).
  const patch = document.createElement("canvas");
  patch.width = patch.height = 256;
  const g = patch.getContext("2d");
  const fields = ["#8aa65a", "#97b063", "#a9ad68", "#7f9b50", "#b5a873", "#8fa85c", "#a3b56c", "#9c9a62"];
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
    g.fillStyle = fields[Math.floor(rand2(i * 7 + 1, j * 13 + 2) * fields.length)];
    g.fillRect(i * 32, j * 32, 32, 32);
    g.fillStyle = "rgba(60, 80, 40, 0.25)";
    g.fillRect(i * 32, j * 32, 32, 1); g.fillRect(i * 32, j * 32, 1, 32);
  }
  const fieldPicture = new THREE.CanvasTexture(patch);
  fieldPicture.wrapS = fieldPicture.wrapT = THREE.RepeatWrapping;
  fieldPicture.repeat.set(70, 70);
  const midZ = P3.z[P3.N] / 2;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(90000, 90000), farPaint({ map: fieldPicture }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, P3.lakeY - 1.2, midZ);
  w3.scene.add(floor);

  // The Kinneret, starting exactly at the end of the beach.
  const wi = P3.waterIndex;
  const lake = new THREE.Mesh(new THREE.CircleGeometry(1, 64), farPaint({ color: 0x3f8fcf }));
  lake.rotation.x = -Math.PI / 2;
  lake.rotation.z = -P3.heading[wi]; // (turned to face the end of the path)
  lake.scale.set(5200, 2100, 1);
  const fx = Math.sin(P3.heading[wi]), fz = -Math.cos(P3.heading[wi]);
  lake.position.set(P3.x[wi] + fx * 2094, P3.lakeY - 0.5, P3.z[wi] + fz * 2094);
  w3.scene.add(lake);
  w3.lake = lake;

  // Hazy mountains all around, far away. Behind the start (north) they're higher and snowy: the Hermon range.
  const M = new MeshBuilder();
  const ringAt = (k, count, radius) => {
    const an = k / count * Math.PI * 2;
    return [Math.sin(an) * radius, -Math.cos(an) * radius + midZ, an];
  };
  for (const [radius, tall, tint] of [[26000, 1, rgb3("#8fa7bd")], [17000, 0.55, rgb3("#7f9a8f")]]) {
    const count = 90;
    const height = (k) => {
      const [, , an] = ringAt(k, count, radius);
      const north = Math.max(0, -Math.cos(an + Math.PI)); // 1 = straight behind the start
      return (500 + (noise2(k * 0.35, radius) + 1) * 800 + north * 2600) * tall;
    };
    for (let k = 0; k < count; k++) {
      const a = ringAt(k, count, radius), b = ringAt(k + 1, count, radius);
      const ha = height(k), hb = height((k + 1) % count), y0 = P3.lakeY - 30;
      const peak = (h) => (h > 2300 * tall ? mix3(tint, COL.snow, 0.8) : shade3(tint, 1.06));
      M.vert(a[0], y0, a[1], tint); M.vert(b[0], y0, b[1], tint); M.vert(b[0], y0 + hb, b[1], peak(hb));
      M.vert(a[0], y0, a[1], tint); M.vert(b[0], y0 + hb, b[1], peak(hb)); M.vert(a[0], y0 + ha, a[1], peak(ha));
    }
  }
  w3.scene.add(new THREE.Mesh(M.geometry(), farPaint({ vertexColors: true, side: THREE.DoubleSide })));
}

// ---------- The mountain around the path, in square chunks ----------

const CHUNK = 200, CELL = 5, GRID = CHUNK / CELL + 1;
const LANDC = {
  grass: rgb3("#93a85c"), grass2: rgb3("#7f9a4c"), dry: rgb3("#a9a765"),
  rock: rgb3("#857a68"), rock2: rgb3("#5a554f"), snow: rgb3("#fbfcfe"), snow2: rgb3("#dbe6f3"), sand: rgb3("#eadaa8"),
};
// The color of the ground: snow up high, grass lower down, bare rock where it's steep, sand at the beach.
function landColor(px, pz, snow, sand, steep, lift) {
  const n = noise2(px * 0.03, pz * 0.03);
  let c = mix3(LANDC.grass, n > 0 ? LANDC.grass2 : LANDC.dry, Math.abs(n) * 0.9);
  const rocky = smooth3(0.55, 1.05, steep);
  c = mix3(c, mix3(LANDC.rock, LANDC.rock2, (n + 1) / 2), rocky);
  // Snow: all over at the top of the mountain, and lower down it hangs on up on the walls.
  const snowy = smooth3(0.35, 0.65, snow * 1.25 + lift / 300 + n * 0.12 - rocky * 0.45);
  c = mix3(c, mix3(LANDC.snow, LANDC.snow2, (n + 1) / 2), snowy);
  return mix3(c, LANDC.sand, sand);
}

const LAND_TREES = ["oak", "bush", "rock", "oak", "olive", "almond", "bush", "rock"];

function buildLandChunk(cx, cz) {
  const x0 = cx * CHUNK, z0 = cz * CHUNK;
  // Which part of the path is anywhere near this chunk?
  const i0 = Math.max(0, indexAtZ(z0 + CHUNK + LAND_REACH + 40) - 4), i1 = Math.min(P3.N, indexAtZ(z0 - LAND_REACH - 40) + 4);
  let near = Infinity;
  for (let i = i0; i <= i1; i += 4) near = Math.min(near, Math.hypot(P3.x[i] - x0 - CHUNK / 2, P3.z[i] - z0 - CHUNK / 2));
  if (near > LAND_REACH + CHUNK * 0.75) return null; // too far from the path: nothing to build

  const count = GRID * GRID;
  const height = new Float32Array(count), sunk = new Float32Array(count), away = new Float32Array(count);
  const snow = new Float32Array(count), sand = new Float32Array(count), lift = new Float32Array(count);
  for (let gz = 0; gz < GRID; gz++) for (let gx = 0; gx < GRID; gx++) {
    const k = gz * GRID + gx;
    const L = landAt(x0 + gx * CELL, z0 + gz * CELL, i0, i1);
    height[k] = L.h; away[k] = L.t; snow[k] = L.snow; sand[k] = L.sand; lift[k] = L.h - L.base;
    // Right under the path the ground is pushed down a little, so the path strip sits on top of it.
    sunk[k] = L.h - 2.5 * (1 - smooth3(L.half + 18, L.half + 30, L.d));
  }
  const positions = new Float32Array(count * 3), colors = new Float32Array(count * 3);
  const normals = new Float32Array(count * 3), uvs = new Float32Array(count * 2); // (soft light + the snow picture)
  const steepness = new Float32Array(count);
  for (let gz = 0; gz < GRID; gz++) for (let gx = 0; gx < GRID; gx++) {
    const k = gz * GRID + gx;
    const hx = height[gz * GRID + Math.min(GRID - 1, gx + 1)] - height[gz * GRID + Math.max(0, gx - 1)];
    const hz = height[Math.min(GRID - 1, gz + 1) * GRID + gx] - height[Math.max(0, gz - 1) * GRID + gx];
    const steep = Math.hypot(hx, hz) / (CELL * 2);
    steepness[k] = steep;
    // Which way the ground faces here (for the light), from the slope.
    const sx = hx / (CELL * (gx === 0 || gx === GRID - 1 ? 1 : 2)), sz = hz / (CELL * (gz === 0 || gz === GRID - 1 ? 1 : 2));
    const nl = Math.hypot(sx, 1, sz);
    normals[k * 3] = -sx / nl; normals[k * 3 + 1] = 1 / nl; normals[k * 3 + 2] = -sz / nl;
    uvs[k * 2] = gx * CELL / SNOW_TILE; uvs[k * 2 + 1] = gz * CELL / SNOW_TILE;
    const c = landColor(x0 + gx * CELL, z0 + gz * CELL, snow[k], sand[k], steep, lift[k]);
    positions[k * 3] = gx * CELL; positions[k * 3 + 1] = sunk[k]; positions[k * 3 + 2] = gz * CELL;
    colors[k * 3] = c[0]; colors[k * 3 + 1] = c[1]; colors[k * 3 + 2] = c[2];
  }
  const index = [];
  for (let gz = 0; gz < GRID - 1; gz++) for (let gx = 0; gx < GRID - 1; gx++) {
    const a = gz * GRID + gx, b = a + 1, c = a + GRID, d = c + 1;
    if (Math.min(away[a], away[b], away[c], away[d]) > LAND_REACH) continue; // past the edge of the mountain
    index.push(a, c, b, b, c, d);
  }
  if (index.length === 0) return null;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(index);
  const group = new THREE.Group();
  group.position.set(x0, 0, z0);
  group.add(new THREE.Mesh(geo, world3d.groundPaint));

  // Trees, bushes and rocks scattered over the mountainside (just to look at: you can't reach them).
  const B = new MeshBuilder();
  for (let k = 0; k < 44; k++) {
    const gx = 1 + rand2(cx * 131 + k, cz * 71) * (GRID - 3), gz = 1 + rand2(cx * 17, cz * 191 + k) * (GRID - 3);
    const cell = Math.floor(gz) * GRID + Math.floor(gx);
    const t = away[cell];
    if (t < 16 || t > LAND_REACH - 15 || steepness[cell] > 0.8 || sand[cell] > 0.3) continue;
    if (t > 110 && rand2(k, cx + cz * 7) < 0.45) continue; // thinner far from the path
    const fx = gx - Math.floor(gx), fz = gz - Math.floor(gz);
    const y = (height[cell] * (1 - fx) + height[cell + 1] * fx) * (1 - fz) + (height[cell + GRID] * (1 - fx) + height[cell + GRID + 1] * fx) * fz;
    const pick = Math.floor(rand2(k * 3, cx * 5 + cz) * LAND_TREES.length);
    let type = LAND_TREES[pick];
    const snowy = snow[cell] * 1.25 + lift[cell] / 300 > 0.5;
    if (snowy) type = type === "oak" || type === "olive" || type === "almond" ? "oakSnow" : type + "Snow";
    else if (snow[cell] > 0.1 && (type === "olive" || type === "almond")) type = "oak"; // (olives and almonds grow lower down)
    B.place(gx * CELL, y - 0.3, gz * CELL, rand2(k, cx * 3 + cz * 11) * 6.3, 0.8 + rand2(cz + k, cx) * 0.7);
    MODELS[type](B, k + cx * 7 + cz * 13);
  }
  if (B.p.length) group.add(new THREE.Mesh(B.geometry(), world3d.paint));
  return group;
}

// Build the chunks near the camera (a few per frame, nearest first), and throw away the far ones.
function updateLand(camX, camZ, reach, hurry) {
  const w3 = world3d;
  const cx0 = Math.floor(camX / CHUNK), cz0 = Math.floor(camZ / CHUNK), span = Math.ceil(reach / CHUNK);
  const wanted = [];
  for (let dz = -span; dz <= span; dz++) for (let dx = -span; dx <= span; dx++) {
    const far = Math.hypot(dx, dz) * CHUNK;
    if (far > reach + CHUNK) continue;
    const key = (cx0 + dx) + "," + (cz0 + dz);
    if (!w3.landChunks.has(key)) wanted.push([far, cx0 + dx, cz0 + dz, key]);
  }
  wanted.sort((a, b) => a[0] - b[0]);
  let built = 0;
  for (const [far, cx, cz, key] of wanted) {
    if (built >= (hurry ? 400 : 2) && far > 250) break;
    const group = buildLandChunk(cx, cz);
    w3.landChunks.set(key, group);
    if (group) { w3.scene.add(group); built++; }
  }
  for (const [key, group] of w3.landChunks) {
    const [cx, cz] = key.split(",").map(Number);
    if (Math.hypot((cx + 0.5) * CHUNK - camX, (cz + 0.5) * CHUNK - camZ) > reach + CHUNK * 3) {
      if (group) disposeGroup(group);
      w3.landChunks.delete(key);
    }
  }
}

function disposeGroup(group) {
  world3d.scene.remove(group);
  group.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
}

// ---------- The path itself (with the things standing on it), in pieces of 40 segments ----------

const PATH_PIECE = 40;
const PATHC = {
  path: rgb3("#eaf1f9"), pathDark: rgb3("#dce7f3"), groove: rgb3("#b3c6dc"), bank: rgb3("#ffffff"),
  sandPath: rgb3("#d9c48b"), sandPathDark: rgb3("#d1bb80"), lane: rgb3("#9fb6d0"),
};

function buildPathPiece(piece) {
  const first = piece * PATH_PIECE, last = Math.min(first + PATH_PIECE, P3.waterIndex + 2, P3.N);
  if (first >= last) return null;
  const ox = P3.x[first], oz = P3.z[first];
  const group = new THREE.Group();
  group.position.set(ox, 0, oz);
  const B = new MeshBuilder();
  // A spot on the strip: point n of the path, `lat` units sideways.
  const at = (n, lat, lift) => [P3.x[n] - ox + P3.cos[n] * lat, stripHeight(n, lat) + (lift || 0), P3.z[n] - oz + P3.sin[n] * lat];
  // A band of ground from point n to n + 1. Wide bands are cut into columns, so they can
  // follow the rolling snow. `snowfield` (0 … 1) blends the color into natural, patchy snow.
  const strip = (n, a0, a1, b0, b1, col, snowfield) => {
    const cols = Math.max(1, Math.ceil(Math.max(Math.abs(a1 - a0), Math.abs(b1 - b0)) / 9));
    for (let k = 0; k < cols; k++) {
      const t0 = k / cols, t1 = (k + 1) / cols;
      const A0 = at(n, a0 + (a1 - a0) * t0), A1 = at(n, a0 + (a1 - a0) * t1), B1 = at(n + 1, b0 + (b1 - b0) * t1), B0 = at(n + 1, b0 + (b1 - b0) * t0);
      let color = col;
      if (snowfield) color = mix3(col, mix3(LANDC.snow, LANDC.snow2, 0.5 + 0.5 * noise2((A0[0] + ox) * 0.05, (A0[2] + oz) * 0.05)), snowfield);
      B.quad(A0, A1, B1, B0, color);
    }
  };

  for (let n = first; n < last; n++) {
    const seg = TRACK.segments[n];
    const ha = P3.half[n], hb = P3.half[n + 1];
    const mid = P3.x[n], midZ = P3.z[n];
    // The ground beside the path, and a skirt going down into the mountain so there's never a gap.
    for (const s of [-1, 1]) {
      const ground = landColor(mid + P3.cos[n] * s * (ha + 14), midZ + P3.sin[n] * s * (ha + 14), P3.snow[n], P3.sand[n], 0, 0);
      strip(n, s * (ha + 3), s * (ha + SHOULDER3), s * (hb + 3), s * (hb + SHOULDER3), ground);
      const a = at(n, s * (ha + SHOULDER3)), b = at(n + 1, s * (hb + SHOULDER3));
      const a2 = at(n, s * (ha + SHOULDER3 + 6)), b2 = at(n + 1, s * (hb + SHOULDER3 + 6));
      a2[1] -= 3.5; b2[1] -= 3.5;
      B.quad(a, a2, b2, b, ground);
      // The little bank along the path's edge.
      const bank = mix3(mix3(shade3(ground, 0.9), PATHC.bank, P3.snow[n] * 0.9 + 0.1), LANDC.sand, P3.sand[n]);
      strip(n, s * ha, s * (ha + 3), s * hb, s * (hb + 3), bank);
    }
    // The path: light and dark stripes (so you feel the speed), with thin lines on it.
    const base = mix3(seg.dark ? PATHC.pathDark : PATHC.path, seg.dark ? PATHC.sandPathDark : PATHC.sandPath, P3.sand[n]);
    const lines = []; // [where at the near end, where at the far end, half its width, color], in road widths
    if (seg.line) {
      // The start and finish lines: black and white squares.
      const squares = Math.max(14, Math.round(14 * ha / (1.2 * RW3) / 2) * 2); // (more squares where the path is wide)
      for (let row = 0; row < 2; row++) for (let c = 0; c < squares; c++) {
        const l = c / squares * 2 - 1, r = (c + 1) / squares * 2 - 1;
        const p = (lat, f) => { const A = at(n, lat * ha), Bp = at(n + 1, lat * hb); return [A[0] + (Bp[0] - A[0]) * f, A[1] + (Bp[1] - A[1]) * f, A[2] + (Bp[2] - A[2]) * f]; };
        B.quad(p(l, row / 2), p(r, row / 2), p(r, (row + 1) / 2), p(l, (row + 1) / 2), (c + row) % 2 === 0 ? [0.07, 0.09, 0.15] : [1, 1, 1]);
      }
      continue;
    }
    // (A big snowfield has no stripes or lines: it's just open snow.)
    const snowfield = smooth3(2.2, 3.2, seg.width) * (1 - P3.sand[n]);
    if (seg.width > 2.4) {
      // nothing drawn on it
    } else if (seg.width > RACE.gateWidth * 0.8) {
      if (!seg.dark) for (let lane = 1; lane < RACE.lanes; lane++) { const t = lane / RACE.lanes * 2 - 1; lines.push([t * seg.width, t * seg.width2, 0.035, PATHC.lane]); }
    } else if (seg.sand < 0.5) {
      // Grooves from sleds that went down before you.
      for (const k of [-0.5, -0.36, 0.3, 0.44]) {
        lines.push([k * Math.min(seg.width, 1.2) + 0.1 * Math.sin(n * 0.045 + k * 4), k * Math.min(seg.width2, 1.2) + 0.1 * Math.sin((n + 1) * 0.045 + k * 4), 0.016, mix3(base, PATHC.groove, 0.8)]);
      }
    }
    lines.sort((a, b) => a[0] - b[0]);
    let fromA = -ha, fromB = -hb;
    for (const [la, lb, wide, col] of lines) {
      const a0 = (la - wide) * RW3, a1 = (la + wide) * RW3, b0 = (lb - wide) * RW3, b1 = (lb + wide) * RW3;
      strip(n, fromA, a0, fromB, b0, base, snowfield);
      strip(n, a0, a1, b0, b1, col);
      fromA = a1; fromB = b1;
    }
    strip(n, fromA, ha, fromB, hb, base, snowfield);
  }
  group.add(new THREE.Mesh(B.groundGeometry(ox, oz), world3d.groundPaint));

  // The trees, bushes, rocks, poles… standing on this piece, and a soft shadow under each.
  const T = new MeshBuilder(), S = new MeshBuilder();
  const things = [];
  for (let n = first; n < Math.min(last, P3.N); n++) {
    const slope = (P3.y[Math.min(P3.N, n + 1)] - P3.y[n]) / SEG3;
    TRACK.segments[n].sprites.forEach((sprite, k) => {
      if (!MODELS[sprite.type] || sprite.type === "sign") return;
      const lat = sprite.offset * RW3;
      const x = P3.x[n] - ox + P3.cos[n] * lat, z = P3.z[n] - oz + P3.sin[n] * lat, y = stripHeight(n, lat);
      const solid = SPRITE_SIZES[sprite.type].solid;
      const seed = n * 7 + k * 13;
      const start = T.p.length / 3;
      // (Cabins and snowmen face the path; trees are turned any which way.)
      const turn = sprite.type === "cabin" || sprite.type === "snowman" || sprite.type === "pole" ? -P3.heading[n] : rand2(seed, 5) * 6.3;
      T.place(x, y - 0.15, z, turn, solid && sprite.type !== "cabin" ? 0.92 + rand2(seed, 9) * 0.2 : 1);
      MODELS[sprite.type](T, seed);
      if (solid) {
        things.push({ seg: n, offset: sprite.offset, start, count: T.p.length / 3 - start, y });
        // The shadow: a flat disc on the ground, a bit to the left (the sun is on the right).
        const r = SPRITE_SIZES[sprite.type].w * U3 * 0.5;
        const c = P3.cos[n], s = P3.sin[n];
        const ring = (j) => {
          const an = j / 10 * Math.PI * 2, sx = Math.cos(an) * r - r * 0.25, sz = Math.sin(an) * r * 0.8;
          return [x + c * sx + s * sz, stripHeight(n, lat + sx) + 0.12 + sz * slope, z + s * sx - c * sz];
        };
        for (let j = 0; j < 10; j++) S.tri([x - c * r * 0.25, y + 0.12, z - s * r * 0.25], ring(j), ring(j + 1), [0, 0, 0]);
      }
    });
  }
  let treeMesh = null;
  if (T.p.length) {
    treeMesh = new THREE.Mesh(T.geometry(), world3d.paint);
    group.add(treeMesh);
    group.add(new THREE.Mesh(S.geometry(), world3d.shadowPaint));
  }
  group.userData = { things, treeMesh, still: treeMesh ? treeMesh.geometry.attributes.position.array.slice() : null };
  return group;
}

function updatePath(index, ahead) {
  const w3 = world3d;
  const from = Math.floor(Math.max(0, index - 50) / PATH_PIECE), to = Math.floor(Math.min(P3.N - 1, index + ahead) / PATH_PIECE);
  for (let piece = from; piece <= to; piece++) {
    if (w3.pathChunks.has(piece)) continue;
    const group = buildPathPiece(piece);
    w3.pathChunks.set(piece, group);
    if (group) w3.scene.add(group);
  }
  for (const [piece, group] of w3.pathChunks) {
    if (piece < from - 1 || piece > to + 2) {
      if (group) disposeGroup(group);
      w3.pathChunks.delete(piece);
    }
  }
}

// ---------- Gates, banners and the Kinneret sign (things with writing on them) ----------

// A flat board showing a picture we paint ourselves (see-through where nothing is painted).
function pictureBoard(width, height, pxWide, pxTall, paint) {
  const c = document.createElement("canvas");
  c.width = pxWide; c.height = pxTall;
  const g = c.getContext("2d");
  paint(g, pxWide, pxTall);
  const picture = new THREE.CanvasTexture(c);
  picture.generateMipmaps = false;
  picture.minFilter = THREE.LinearFilter;
  const board = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: picture, transparent: true, alphaTest: 0.4, side: THREE.DoubleSide }));
  board.userData = { g, picture, pxWide, pxTall };
  return board;
}

// Stand something across the path at point n, facing the sleds coming down.
function standAcross(group, n) {
  group.position.set(P3.x[n], P3.y[n], P3.z[n]);
  group.rotation.y = -P3.heading[n];
  world3d.scene.add(group);
}

const GATE_TALL = 26; // (big, so you can read it from far away)

// The picture on a gate: the English word on a white sign on top, a Hebrew answer over each lane.
function paintGate(g, W, H, info) {
  g.clearRect(0, 0, W, H);
  const signH = H * 0.38, signW = W * 0.4;
  roundedBox(g, (W - signW) / 2, 4, signW, signH - 8, signH * 0.2, "#ffffff", "#1e3a8a", 8);
  drawTextInBox(g, info ? info.english : "?", W / 2, signH / 2, signW, signH - 8, 200, "#1e3a8a", false);
  const top = H * 0.5, panelH = H * 0.5 - 4, laneW = W / 3;
  for (let lane = 0; lane < 3; lane++) {
    roundedBox(g, lane * laneW + 16, top, laneW - 32, panelH, panelH * 0.12, LANE_COLORS[lane], "#ffffff", 6);
    drawTextInBox(g, info ? info.choices[lane] : "?", lane * laneW + laneW / 2, top + panelH / 2, laneW - 40, panelH, 200, "#ffffff", true);
  }
}

function makeGates() {
  const w3 = world3d;
  w3.gates = [];
  const steel = rgb3("#334155");
  for (const gate of TRACK.gates) {
    const half = RACE.gateWidth * RW3;
    const group = new THREE.Group();
    const B = new MeshBuilder();
    for (const t of [-1, -1 / 3, 1 / 3, 1]) B.box(t * half, GATE_TALL / 2, 0, 0.9, GATE_TALL, 0.9, steel);
    B.box(0, GATE_TALL - 0.8, 0, half * 2 + 0.9, 1.6, 1.1, steel);
    group.add(new THREE.Mesh(B.geometry(), w3.paint));
    // The board: the lane answers hang under the beam, the English sign stands on top of it.
    const boardTall = 14.4;
    const board = pictureBoard(half * 2, boardTall, 1400, 296, (g, W, H) => paintGate(g, W, H, null));
    board.position.set(0, GATE_TALL - 1.6 - 7.2 + boardTall / 2, 0.7);
    group.add(board);
    standAcross(group, gate.index);
    w3.gates.push({ number: gate.number, index: gate.index, group, board, shown: "" });
  }
}

function makeSigns() {
  const w3 = world3d;
  w3.signs = [];
  // The banners over the start and the finish.
  TRACK.segments.forEach((seg, n) => {
    if (!seg.line) return;
    const half = Math.min(seg.width, 1.3) * RW3 * 1.1, tall = 20; // (on the big snowfield the banner stands in the middle)
    const group = new THREE.Group();
    const B = new MeshBuilder();
    B.box(-half, tall / 2, 0, 0.8, tall, 0.8, rgb3("#475569"));
    B.box(half, tall / 2, 0, 0.8, tall, 0.8, rgb3("#475569"));
    group.add(new THREE.Mesh(B.geometry(), w3.paint));
    const text = seg.line === "start" ? "מֵרוֹץ הַחֶרְמוֹן · MT HERMON RACING" : "🏁 כִּנֶּרֶת · KINNERET 🏁";
    const board = pictureBoard(half * 2, 4.4, 1200, 100, (g, W, H) => {
      g.fillStyle = seg.line === "start" ? "#1d4ed8" : "#0e7490"; g.fillRect(0, 0, W, H);
      g.fillStyle = "#ffffff"; g.fillRect(0, 6, W, 6); g.fillRect(0, H - 12, W, 6);
      drawTextInBox(g, text, W / 2, H / 2, W, H * 0.8, 400, "#ffffff", true);
    });
    board.position.set(0, tall - 2.2, 0);
    group.add(board);
    standAcross(group, n);
    w3.signs.push({ index: n, group });
  });
  TRACK.segments.forEach((seg, n) => {
    for (const sprite of seg.sprites) {
      if (sprite.type !== "sign") continue;
      const group = new THREE.Group();
      const board = pictureBoard(13, 10, 390, 300, (g, W, H) => paintSign(g, W, H));
      board.position.set(sprite.offset * RW3, 5, 0);
      group.add(board);
      standAcross(group, n);
      group.position.y = stripHeight(n, sprite.offset * RW3);
      w3.signs.push({ index: n, group });
    }
  });
}

// ---------- The sled, as a 3D model ----------
// The same sled as before: wooden runners with iron strips, a deck of slats, and a rider in
// a wool coat with a knitted kippah, a tallit-striped scarf, tzitzit, and a little Israeli flag.
// (Built in the old drawing's sizes, where the sled is 100 wide, then shrunk to 6 wide.)

function makeFlagPicture() {
  const c = document.createElement("canvas");
  c.width = 96; c.height = 64;
  const g = c.getContext("2d");
  g.fillStyle = "#ffffff"; g.fillRect(0, 0, 96, 64);
  g.fillStyle = "#1d4ed8"; g.fillRect(0, 7, 96, 9); g.fillRect(0, 48, 96, 9);
  g.strokeStyle = "#1d4ed8"; g.lineWidth = 3;
  for (const flip of [1, -1]) {
    g.beginPath();
    for (let k = 0; k < 3; k++) {
      const an = -Math.PI / 2 * flip + k * Math.PI * 2 / 3;
      const x = 48 + Math.cos(an) * 12, y = 32 + Math.sin(an) * 12;
      if (k === 0) g.moveTo(x, y); else g.lineTo(x, y);
    }
    g.closePath(); g.stroke();
  }
  return new THREE.CanvasTexture(c);
}

function makeSled(color) {
  const w3 = world3d;
  const B = new MeshBuilder();
  B.flip = true;           // (the old sizes count "forward" as plus; in the 3D world forward is minus z)
  B.place(0, 0, 0, 0, 0.06);
  const main = rgb3(color);
  const coat = mix3(main, rgb3("#5b4636"), 0.3), coatDark = mix3(main, rgb3("#2b2118"), 0.5);
  const iron = rgb3("#3a3f44"), wood = rgb3("#8a5a2b"), rope = rgb3("#d6c08a"), white = rgb3("#f8fafc"), blue = rgb3("#1d4ed8");
  // Runners: iron underneath, wood on top, curling up at the front.
  for (const s of [-1, 1]) {
    const x = s * 40;
    B.box(x, 2, 60, 5, 4, 132, iron);
    B.box(x, 6, 60, 5, 4, 132, wood);
    B.tube([x, 4, 126], 3.4, [x, 10, 139], 3.2, 5, wood);
    B.tube([x, 10, 139], 3.2, [x, 19, 146], 2.9, 5, wood);
    B.tube([x, 19, 146], 2.9, [x, 26, 140], 2.4, 5, wood, true);
    for (const z of [8, 60, 112]) B.box(x, 12.5, z, 4, 9, 4, rgb3("#6b4423"));
    // The steering rope, from the front curl back to the rider's hands.
    B.tube([x, 24, 141], 1, [s * 30, 25, 92], 1, 4, rope);
    B.tube([s * 30, 25, 92], 1, [s * 22, 32, 64], 1, 4, rope);
  }
  // The deck: wooden slats.
  ["#b98a55", "#a8784a", "#c29462", "#9f6f42", "#b3834f", "#a77649"].forEach((c, i) => B.box(0, 18.3, 12.5 + i * 21, 92, 2.6, 17, rgb3(c)));
  // The rider: legs forward, coat, arms out to the rope.
  for (const s of [-1, 1]) {
    B.tube([s * 10, 25, 48], 6.5, [s * 14, 31, 80], 5.5, 6, rgb3("#374151"));
    B.tube([s * 14, 31, 80], 5.5, [s * 16, 23, 104], 5, 6, rgb3("#374151"));
    B.blob(s * 16, 24, 110, 5.5, 5, 8, rgb3("#3b2a1c"), 3 + s, 0.1);
    B.tube([s * 20, 52, 42], 5, [s * 30, 42, 52], 4.6, 6, coatDark);
    B.tube([s * 30, 42, 52], 4.6, [s * 23, 33, 63], 4.2, 6, coatDark);
    B.blob(s * 23, 32, 65, 5, 5, 5, rgb3("#6b4a2e"), 8 + s, 0.1);
    // Tzitzit: white strings hanging at both sides.
    for (let k = 0; k < 3; k++) B.tube([s * (21 + k * 2), 27, 36 - k * 3], 0.8, [s * (26 + k * 2.5), 9, 30 - k * 4], 0.6, 3, white);
  }
  B.tube([0, 19.6, 40], 23, [0, 34, 41], 22, 9, coat);
  B.tube([0, 30, 41], 22.6, [0, 34, 41], 22.6, 9, coatDark);            // belt
  B.tube([0, 34, 41], 22, [0, 55, 43], 15, 9, coat, true);
  // The scarf: white with blue stripes, like a tallit.
  B.tube([0, 54, 43], 13.5, [0, 60, 43.5], 12.5, 9, white);
  B.tube([0, 55.4, 43], 13.8, [0, 56.6, 43], 13.6, 9, blue);
  B.tube([0, 58, 43.3], 13.3, [0, 59.2, 43.4], 13.1, 9, blue);
  B.quad([4, 58, 31], [13, 58, 31], [20, 50, 10], [11, 49, 12], white);  // its end, flying out behind
  B.quad([10.2, 50.6, 14], [19.2, 51.4, 12.4], [18.4, 52.6, 15], [9.6, 51.6, 16.6], blue);
  // Head: dark curly hair from behind, a face in front, ears.
  B.blob(0, 70, 43, 13, 13.5, 13, rgb3("#3b2414"), 21, 0.22);
  B.blob(0, 68.5, 49, 10.5, 11, 9, rgb3("#e8b48f"), 22, 0.05);
  for (const s of [-1, 1]) B.blob(s * 12.6, 68, 44, 2.6, 4, 3, rgb3("#e8b48f"), 23, 0.05);
  // The knitted kippah, in this sled's color, with a white band around its edge.
  B.blob(0, 81.5, 41, 9.5, 3.4, 9.5, main, 24, 0.05);
  B.tube([0, 79.6, 41], 9.9, [0, 80.8, 41], 9.5, 9, white);
  // The flag's stick, at the back corner.
  B.tube([-38, 19, 2], 1.1, [-38, 68, 2], 1.1, 4, rgb3("#6b4423"));
  const sled = new THREE.Group();
  sled.rotation.order = "YXZ";
  sled.add(new THREE.Mesh(B.geometry(), w3.paint));
  // The flag itself: a little picture that waves.
  if (!w3.flagPicture) w3.flagPicture = makeFlagPicture();
  const flagHolder = new THREE.Group();
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.0), new THREE.MeshBasicMaterial({ map: w3.flagPicture, side: THREE.DoubleSide }));
  flag.position.set(-0.75, 0, 0);
  flagHolder.add(flag);
  flagHolder.position.set(-38 * 0.06, 62 * 0.06, 2 * -0.06);
  sled.add(flagHolder);
  // A soft shadow under it.
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(6.6, 10), w3.shadowPaint);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.1, -4.4);
  sled.add(shadow);
  sled.userData = { flagHolder, color };
  w3.scene.add(sled);
  return sled;
}

// Put a sled model where its sled is. turn = which way it points compared to the path (radians, plus = right).
const SPOT = {};
function poseSled(sled, along, side, turn, time, wobble) {
  pathSpot(along, side, SPOT);
  sled.position.set(SPOT.x, SPOT.y + 0.05, SPOT.z);
  sled.rotation.y = -(SPOT.heading + turn) + (wobble || 0);
  sled.rotation.x = Math.atan(SPOT.slope) + Math.abs(wobble || 0) * 0.5; // nose down on the way down, kicked up by a crash
  sled.rotation.z = -turn * 0.35 + (wobble || 0) * 0.6;                  // leaning into the turn
  sled.userData.flagHolder.rotation.y = 0.7 + Math.sin(time * 9) * 0.25;
  sled.visible = true;
}

// A name floating over another player's sled.
function nameLabel(name) {
  const w3 = world3d;
  if (w3.labels.has(name)) return w3.labels.get(name);
  const c = document.createElement("canvas");
  c.width = 256; c.height = 64;
  const g = c.getContext("2d");
  g.font = "800 40px Rubik, Arial, sans-serif";
  g.textAlign = "center"; g.textBaseline = "middle";
  g.lineWidth = 7; g.strokeStyle = "rgba(15, 23, 42, 0.85)"; g.lineJoin = "round";
  g.strokeText(name, 128, 34, 240);
  g.fillStyle = "#ffffff";
  g.fillText(name, 128, 34, 240);
  const picture = new THREE.CanvasTexture(c);
  picture.generateMipmaps = false; picture.minFilter = THREE.LinearFilter;
  const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: picture, depthWrite: false }));
  label.scale.set(8, 2, 1);
  w3.scene.add(label);
  w3.labels.set(name, label);
  return label;
}

// ---------- Snow spray ----------
// Real snow flies up when a sled cuts through it. Here that's hundreds of soft little puffs:
// each one is thrown up and out from a runner, keeps some of the sled's speed, slows down in
// the air, falls, grows and fades away. Powder trails behind every moving sled; turning
// throws a big sheet of snow out from the outside runner; deep snow flies up all around.
// (Crashing into a tree uses the same puffs: snow up high, leaves and dust lower down.)

const SPRAY_MAX = 450; // the most puffs in the air at once
const SPRAY_SNOW = [1, 1, 1], SPRAY_DUST = rgb3("#cdbf9a"), SPRAY_SAND = rgb3("#e6d6a4"), SPRAY_LEAF = rgb3("#b9c79a");

function makeSpray() {
  const w3 = world3d;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(SPRAY_MAX * 3), 3));
  geo.setAttribute("tint", new THREE.BufferAttribute(new Float32Array(SPRAY_MAX * 3), 3)); // each puff's color
  geo.setAttribute("look", new THREE.BufferAttribute(new Float32Array(SPRAY_MAX * 2), 2)); // each puff's size, and how see-through it is
  // A tiny program for the graphics chip: draw each puff as a soft round dot, smaller when
  // it's further away, white on top and a little blue underneath (so it shows up against white snow).
  w3.sprayPaint = new THREE.ShaderMaterial({
    uniforms: { scale: { value: 500 } },
    vertexShader: [
      "attribute vec3 tint; attribute vec2 look; uniform float scale;",
      "varying vec3 vTint; varying float vAlpha;",
      "void main() {",
      "  vTint = tint; vAlpha = look.y;",
      "  vec4 mv = modelViewMatrix * vec4(position, 1.0);",
      "  gl_PointSize = min(look.x * scale / max(1.0, -mv.z), scale * 0.3);",
      "  gl_Position = projectionMatrix * mv;",
      "}"].join("\n"),
    fragmentShader: [
      "varying vec3 vTint; varying float vAlpha;",
      "void main() {",
      "  vec2 q = gl_PointCoord - 0.5;",
      "  float a = (1.0 - smoothstep(0.3, 1.0, length(q) * 2.0)) * vAlpha;",
      "  if (a < 0.02) discard;",
      "  float top = 1.0 - smoothstep(-0.25, 0.4, q.y);",
      "  gl_FragColor = vec4(mix(vTint * vec3(0.64, 0.75, 0.93), vTint, top), a);",
      "}"].join("\n"),
    transparent: true, depthWrite: false,
  });
  w3.sprayPoints = new THREE.Points(geo, w3.sprayPaint);
  w3.sprayPoints.frustumCulled = false;
  w3.sprayPoints.renderOrder = 5; // (drawn after the ground and the tracks)
  w3.scene.add(w3.sprayPoints);
}

// One new puff: where it starts, how fast it flies (3D units per second), how long it lives
// (seconds), how big it is and how fast it grows, how solid it looks (0 … 1) and its color.
function addSpray(x, y, z, vx, vy, vz, life, size, grow, alpha, color) {
  const list = world3d.spray;
  if (list.length < SPRAY_MAX) list.push({ x, y, z, vx, vy, vz, age: 0, life, size, grow, alpha, color });
}

// Every frame: the puffs fly, slow down, fall, grow and fade. Then they're handed to the graphics chip.
function updateSpray(dt) {
  const w3 = world3d, list = w3.spray, geo = w3.sprayPoints.geometry;
  const pos = geo.attributes.position.array, tint = geo.attributes.tint.array, look = geo.attributes.look.array;
  const drag = Math.max(0, 1 - 1.3 * dt);
  let n = 0;
  for (let i = 0; i < list.length; i++) {
    const p = list[i];
    p.age += dt;
    if (p.age >= p.life) continue; // (melted away)
    p.vx *= drag; p.vz *= drag; p.vy = p.vy * drag - 18 * dt;
    p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
    p.size += p.grow * dt;
    pos[n * 3] = p.x; pos[n * 3 + 1] = p.y; pos[n * 3 + 2] = p.z;
    tint[n * 3] = p.color[0]; tint[n * 3 + 1] = p.color[1]; tint[n * 3 + 2] = p.color[2];
    look[n * 2] = p.size; look[n * 2 + 1] = p.alpha * (1 - p.age / p.life);
    list[n++] = p;
  }
  list.length = n;
  geo.setDrawRange(0, n);
  geo.attributes.position.needsUpdate = geo.attributes.tint.needsUpdate = geo.attributes.look.needsUpdate = true;
  w3.sprayPoints.visible = n > 0;
}

// Snow flying up from one sled. pointing = which way the sled points (radians); speed = 0 … 1;
// carve = how hard it is being steered right now (-1 … 1); deep = off the path, in deep snow;
// index = which piece of path it's on; amount = 1 for my sled, less for the others.
function sledSpray(sled, pointing, speed, carve, deep, index, dt, amount) {
  if (speed < 0.08 || dt <= 0) return;
  const fx = Math.sin(pointing), fz = -Math.cos(pointing); // forward
  const rx = Math.cos(pointing), rz = Math.sin(pointing);  // to the sled's right
  const px = sled.position.x, py = sled.position.y + 0.3, pz = sled.position.z;
  const v = speed * RACE.maxSpeed * U3; // the sled's speed in 3D units per second
  const color = P3.sand[index] > 0.5 ? SPRAY_SAND : deep && P3.snow[index] < 0.3 ? SPRAY_DUST : SPRAY_SNOW;
  const many = (perSecond) => Math.floor(perSecond * amount * dt + Math.random());
  // 1. Powder trailing from the back of both runners, whenever the sled is moving.
  for (let k = many(80 * speed); k > 0; k--) {
    const s = Math.random() < 0.5 ? -1 : 1, keep = 0.55 + Math.random() * 0.25, out = s * Math.random() * 2;
    addSpray(px + rx * s * 2.4, py, pz + rz * s * 2.4, fx * v * keep + rx * out, 1.5 + Math.random() * 3.5, fz * v * keep + rz * out,
      0.45 + Math.random() * 0.45, 1.3 + Math.random() * 1.0, 2.6, 0.75, color);
  }
  // 2. Turning: a sheet of snow thrown out from the OUTSIDE runner (turn right = snow flies left).
  const hard = Math.abs(carve);
  if (hard > 0.08) {
    const side = -Math.sign(carve);
    for (let k = many(270 * hard * (0.3 + speed)); k > 0; k--) {
      const along = Math.random() * 6.5, keep = 0.6 + Math.random() * 0.25, fling = side * (5 + Math.random() * 11) * (0.5 + speed * 0.6);
      addSpray(px + rx * side * 2.6 + fx * along, py, pz + rz * side * 2.6 + fz * along, fx * v * keep + rx * fling, 3 + Math.random() * 8, fz * v * keep + rz * fling,
        0.55 + Math.random() * 0.5, 1.5 + Math.random() * 1.5, 3.4, 0.95, color);
    }
  }
  // 3. Deep snow (off the path): it flies up on both sides, all along the sled.
  if (deep) {
    for (let k = many(200 * (0.3 + speed)); k > 0; k--) {
      const s = Math.random() < 0.5 ? -1 : 1, along = Math.random() * 7.5, keep = 0.55 + Math.random() * 0.3, fling = s * (2 + Math.random() * 7);
      addSpray(px + rx * s * 2.6 + fx * along, py, pz + rz * s * 2.6 + fz * along, fx * v * keep + rx * fling, 4 + Math.random() * 7, fz * v * keep + rz * fling,
        0.5 + Math.random() * 0.5, 1.4 + Math.random() * 1.4, 3, 0.8, color);
    }
  }
}

// ---------- Runner tracks ----------
// Every sled leaves two thin tracks in the snow behind it, which slowly fade away. A track
// is a ribbon through the last few spots the sled was at (a new spot every TRAIL_STEP units).

const TRAIL_POINTS = 44, TRAIL_STEP = 1.8;

function sledTrail(id, sled, groundY, pointing, index) {
  const w3 = world3d;
  let trail = w3.trails.get(id);
  if (!trail) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array((TRAIL_POINTS - 1) * 12 * 3), 3));
    geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array((TRAIL_POINTS - 1) * 12 * 4), 4)); // (red, green, blue + how solid)
    const mesh = new THREE.Mesh(geo, w3.trailPaint);
    mesh.frustumCulled = false;
    w3.scene.add(mesh);
    trail = { mesh, points: [] };
    w3.trails.set(id, trail);
  }
  const pts = trail.points;
  // (No tracks on the sand of the beach.)
  const here = { x: sled.position.x, y: groundY + 0.08, z: sled.position.z, rx: Math.cos(pointing), rz: Math.sin(pointing), solid: 1 - P3.sand[index] };
  // The sled jumped somewhere else (a new race)? Start a new track.
  if (pts.length && Math.hypot(here.x - pts[0].x, here.z - pts[0].z) > 40) pts.length = 0;
  if (pts.length === 0) pts.push(here, Object.assign({}, here));
  // pts[0] is always where the sled is NOW; once it's a step away from the last fixed spot, that becomes a fixed spot too.
  pts[0] = here;
  if (Math.hypot(here.x - pts[1].x, here.z - pts[1].z) > TRAIL_STEP) {
    pts.unshift(Object.assign({}, here));
    if (pts.length > TRAIL_POINTS) pts.pop();
  }
  const pos = trail.mesh.geometry.attributes.position.array, col = trail.mesh.geometry.attributes.color.array;
  let v = 0;
  const corner = (p, runner, edge, fade) => {
    const lat = runner * 2.4 + edge * 0.17;
    pos[v * 3] = p.x + p.rx * lat; pos[v * 3 + 1] = p.y; pos[v * 3 + 2] = p.z + p.rz * lat;
    col[v * 4] = 0.56; col[v * 4 + 1] = 0.67; col[v * 4 + 2] = 0.84; col[v * 4 + 3] = fade * p.solid * 0.55;
    v++;
  };
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const fa = Math.pow(1 - i / (TRAIL_POINTS - 1), 1.6), fb = Math.pow(1 - (i + 1) / (TRAIL_POINTS - 1), 1.6); // fading toward the far end
    for (const runner of [-1, 1]) {
      corner(a, runner, -1, fa); corner(a, runner, 1, fa); corner(b, runner, 1, fb);
      corner(a, runner, -1, fa); corner(b, runner, 1, fb); corner(b, runner, -1, fb);
    }
  }
  trail.mesh.geometry.setDrawRange(0, v);
  trail.mesh.geometry.attributes.position.needsUpdate = trail.mesh.geometry.attributes.color.needsUpdate = true;
  trail.mesh.visible = true;
}

// ---------- Crashing: the tree shakes, and snow (or leaves) bursts off it ----------

// Called by race-game.js when my sled hits something. segIndex + offset say which thing;
// dir = which way my sled bounced (-1 left, 1 right); time = the game clock.
function race3dCrash(segIndex, offset, dir, time) {
  const w3 = world3d;
  if (!w3.ready) return;
  const group = w3.pathChunks.get(Math.floor(segIndex / PATH_PIECE));
  const lat = offset * RW3;
  const x = P3.x[segIndex] + P3.cos[segIndex] * lat, z = P3.z[segIndex] + P3.sin[segIndex] * lat, y = stripHeight(segIndex, lat);
  if (group && group.userData.treeMesh) {
    const thing = group.userData.things.find((t) => t.seg === segIndex && t.offset === offset);
    if (thing) w3.shaking = { group, thing, startedAt: time, dx: -dir * P3.cos[segIndex] - P3.sin[segIndex] * 0.6, dz: -dir * P3.sin[segIndex] + P3.cos[segIndex] * 0.6 };
  }
  // A burst of snow up high, of leaves and dust lower down.
  const color = TRACK.segments[segIndex].snow > 0.3 ? SPRAY_SNOW : SPRAY_LEAF;
  for (let k = 0; k < 80; k++) {
    addSpray(x + (Math.random() - 0.5) * 4, y + 1 + Math.random() * 9, z + (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 18, 2 + Math.random() * 10, (Math.random() - 0.5) * 18,
      0.8 + Math.random() * 0.6, 1 + Math.random() * 1.4, 1.6, 0.95, color);
  }
}

function updateCrashEffects(time) {
  const w3 = world3d;
  // The tree rocks back and forth, less and less.
  if (w3.shaking) {
    const { group, thing, startedAt, dx, dz } = w3.shaking;
    const t = time - startedAt;
    const alive = t >= 0 && t < 1.2 && w3.pathChunks.get(Math.floor(thing.seg / PATH_PIECE)) === group;
    const lean = alive ? 0.2 * Math.exp(-4 * t) * Math.cos(t * 20) : 0;
    const still = group.userData.still, attr = group.userData.treeMesh.geometry.attributes.position;
    for (let i = thing.start; i < thing.start + thing.count; i++) {
      const up = Math.max(0, still[i * 3 + 1] - thing.y);
      attr.array[i * 3] = still[i * 3] + dx * lean * up;
      attr.array[i * 3 + 2] = still[i * 3 + 2] + dz * lean * up;
    }
    attr.needsUpdate = true;
    if (!alive) w3.shaking = null;
  }
}

// ---------- Drawing one frame ----------
// view = {
//   along, side:  where my sled is (distance along the path in track units; sideways in road widths)
//   turn:         which way my sled points (radians, plus = right);  viewTurn: how far the camera swings with it
//   racing:       false = no sleds (the lobby: the camera just glides down the path)
//   color:        my sled's color;  bounce: my sled bumping up and down (3D units)
//   wobble:       my sled rocking after a crash;  shake: the camera shaking after a crash (0 … 1)
//   speed, carve, deep:  for the snow spray: how fast I'm going (0 … 1), how hard I'm steering (-1 … 1), am I off the path
//   sleds:        the other sleds: [{ id, y, x, turn, color, name, speed }]
//   gate:         the question on the next gate ({ number, english, choices }) or null
//   time:         the game clock
// }
// Returns where my sled is on the screen: { x, y, size } in screen pixels (for the snow spray).
const CAM = {}, LOOK = new (typeof THREE !== "undefined" ? THREE.Vector3 : Object)();
const onScreen = { x: 0, y: 0, size: 100 };

function drawRace3d(view, w, h) {
  const w3 = world3d;
  try {
    if (!w3.ready) initRace3d();
  } catch (error) {
    w3.failed = true;
    hideRace3d();
    reportProblem(error, "3D");
    return null;
  }
  const canvas3d = w3.renderer.domElement;
  if (canvas3d.hidden) canvas3d.hidden = false;

  // Too slow on this phone? Draw fewer dots, then a shorter distance, until it's smooth.
  const now = performance.now(), took = now - w3.lastFrameAt;
  w3.lastFrameAt = now;
  if (took > 36 && took < 250) w3.slowFrames += 1; else w3.slowFrames = Math.max(0, w3.slowFrames - 0.5);
  if (w3.slowFrames > 70 && w3.quality > 0.45) { w3.quality *= 0.8; w3.slowFrames = 0; }
  // How much game time went by since the last picture (for the snow spray).
  const dt = Math.min(0.05, Math.max(0, view.time - (w3.lastTime === undefined ? view.time : w3.lastTime)));
  w3.lastTime = view.time;

  const ratio = Math.max(0.75, Math.min(window.devicePixelRatio || 1, RACE.sharpness) * Math.min(1, w3.quality * 1.25));
  if (w3.w !== w || w3.h !== h || w3.ratio !== ratio) {
    w3.w = w; w3.h = h; w3.ratio = ratio;
    w3.renderer.setPixelRatio(ratio);
    w3.renderer.setSize(w, h, false);
    w3.camera.aspect = w / h;
    w3.camera.fov = w >= h ? 58 : 80; // (an upright phone sees less to the sides, so it gets a wider lens)
    w3.camera.updateProjectionMatrix();
    // (So a puff of snow is the right size on this screen.)
    w3.sprayPaint.uniforms.scale.value = h * ratio / (2 * Math.tan(w3.camera.fov * Math.PI / 360));
  }
  const reach = RACE.viewDistance * Math.max(0.55, w3.quality); // how far we can see, in 3D units
  w3.scene.fog.near = reach * 0.25;
  w3.scene.fog.far = reach;

  // The camera: behind and above my sled, looking down the path ahead. (When the sled
  // points right, the camera swings round behind it, so the world turns around me.)
  pathSpot(view.along, view.side, SPOT);
  const sledX = SPOT.x, sledY = SPOT.y, sledZ = SPOT.z, index = SPOT.index;
  const camHeading = SPOT.heading + (view.viewTurn || 0);
  const fx = Math.sin(camHeading), fz = -Math.cos(camHeading);
  const back = w >= h ? 1 : 1.5; // (an upright phone is narrow, so the camera sits further back)
  let camX = sledX - fx * 13.5 * back, camZ = sledZ - fz * 13.5 * back, camY = sledY + 6.6 * back;
  // Never inside the mountain (a wall beside a bend, or a hilltop just behind me).
  camY = Math.max(camY, landAt(camX, camZ).h + 2.6);
  pathSpot(view.along - 1500, view.side, CAM);
  camY = Math.max(camY, CAM.y + 3.2);
  pathSpot(view.along + 1900, view.side * 0.6, CAM);
  const shake = (view.shake || 0) * 0.5;
  w3.camera.position.set(camX + (Math.random() - 0.5) * shake, camY + (Math.random() - 0.5) * shake, camZ);
  LOOK.set(sledX + fx * 19, CAM.y + 2.4, sledZ + fz * 19);
  w3.camera.lookAt(LOOK);
  w3.sky.position.copy(w3.camera.position);

  // Build the world around here (the first time, all of it at once).
  updatePath(index, Math.ceil(reach / SEG3));
  updateLand(camX + fx * reach * 0.35, camZ + fz * reach * 0.35, reach * 0.8, !w3.builtOnce);
  w3.builtOnce = true;

  // Gates: the one my question is on shows the word and the 3 answers; the others show "?".
  for (const gate of w3.gates) {
    gate.group.visible = gate.index > index - 30 && gate.index < index + reach / SEG3 + 20;
    const mine = view.gate && view.gate.number === gate.number ? view.gate : null;
    const shown = mine ? mine.english + "|" + mine.choices.join("|") : "";
    if (shown !== gate.shown) {
      gate.shown = shown;
      const u = gate.board.userData;
      paintGate(u.g, u.pxWide, u.pxTall, mine);
      u.picture.needsUpdate = true;
    }
  }
  for (const sign of w3.signs) sign.group.visible = sign.index > index - 30 && sign.index < index + reach / SEG3 + 20;

  // The sleds.
  const seen = new Set();
  const place = (id, color, along, side, turn, bounce, wobble, name, speed, carve, deep, amount) => {
    let sled = w3.sleds.get(id);
    if (sled && sled.userData.color !== color) { disposeGroup(sled); sled = null; }
    if (!sled) { sled = makeSled(color); w3.sleds.set(id, sled); }
    poseSled(sled, along, side, turn, view.time, wobble);
    // Its tracks in the snow, and the snow it sprays up.
    sledTrail(id, sled, SPOT.y, SPOT.heading + turn, SPOT.index);
    sledSpray(sled, SPOT.heading + turn, speed, carve, deep, SPOT.index, dt, amount * Math.max(0.5, w3.quality));
    sled.position.y += bounce || 0;
    seen.add(id);
    if (name) {
      const label = nameLabel(name);
      label.position.set(sled.position.x, sled.position.y + 7.4, sled.position.z);
      label.visible = true;
      seen.add("label:" + name);
    }
  };
  if (view.racing) {
    place("me", view.color, view.along, view.side, view.turn, view.bounce, view.wobble, null, view.speed || 0, view.carve || 0, view.deep, 1);
    for (const other of view.sleds) {
      // (Nobody tells us how hard another sled is steering, so we work it out from how fast it's turning.)
      const sled = w3.sleds.get(other.id), before = sled ? sled.userData : null;
      const turning = before && before.lastTurn !== undefined && dt > 0 ? (other.turn - before.lastTurn) / dt / (RACE.turnRate * RACE.maxTurn) : 0;
      const carve = ((before && before.carve) || 0) * 0.85 + Math.max(-1, Math.min(1, turning)) * 0.15;
      const deep = Math.abs(other.x) > findSegment(other.y).width;
      place(other.id, other.color, other.y, other.x, other.turn, 0, 0, other.name, other.speed || 0, carve, deep, 0.6);
      const now = w3.sleds.get(other.id).userData;
      now.lastTurn = other.turn; now.carve = carve;
    }
  }
  for (const [id, sled] of w3.sleds) if (!seen.has(id)) sled.visible = false;
  for (const [id, trail] of w3.trails) if (!seen.has(id)) { trail.mesh.visible = false; trail.points.length = 0; }
  for (const [name, label] of w3.labels) if (!seen.has("label:" + name)) label.visible = false;

  updateCrashEffects(view.time);
  updateSpray(dt);
  w3.renderer.render(w3.scene, w3.camera);

  // Where my sled ended up on the screen.
  LOOK.set(sledX, sledY, sledZ).project(w3.camera);
  onScreen.x = (LOOK.x + 1) / 2 * w;
  onScreen.y = (1 - LOOK.y) / 2 * h;
  LOOK.set(sledX + P3.cos[index] * 6, sledY, sledZ + P3.sin[index] * 6).project(w3.camera);
  onScreen.size = Math.abs((LOOK.x + 1) / 2 * w - onScreen.x);
  return onScreen;
}
