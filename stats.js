// stats.js — counts how much the game is used, and shows the numbers to the game's owner.
//
// COUNTING: the game tells our database (Supabase) three things:
//   "visit"       someone opened the game
//   "game_start"  a game started on this phone (which game, what kind of room)
//   "game_end"    that game finished
// With each one goes a random number that this phone made up once (so we can count
// "how many different phones", without knowing whose they are). No names, no emails.
// The database part is in supabase/usage.sql.
//
// SEEING THE NUMBERS: a "📊 Usage" button on the home screen, only for logins that are
// on the owner list in the database. Everyone else never sees it.

const DEVICE_KEY = "golan-device";
const statsEl = document.getElementById("stats");
const statsButton = document.getElementById("stats-button");
const statsBody = document.getElementById("stats-body");

// Only count on the real website (not when testing from a folder on a computer).
function countingIsOn() {
  return Boolean(supa) && location.protocol === "https:";
}

// This phone's random number. Made once, then remembered on the phone.
function deviceId() {
  let id = null;
  try { id = localStorage.getItem(DEVICE_KEY); } catch {}
  if (!/^[0-9a-f-]{36}$/.test(id || "")) {
    id = crypto.randomUUID ? crypto.randomUUID() : makeRandomId();
    try { localStorage.setItem(DEVICE_KEY, id); } catch {}
  }
  return id;
}

// (For old phones that don't have crypto.randomUUID.)
function makeRandomId() {
  return "xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx".replace(/x/g, () => Math.floor(Math.random() * 16).toString(16));
}

// Send one count. If it fails (no internet, database not set up) nothing happens:
// counting must never get in the way of playing.
function countUsage(event, details = {}) {
  if (!countingIsOn()) return;
  const row = {
    event,
    mode: details.mode || null,
    room: details.room || null,
    host: Boolean(details.host),
    players: details.players || null,
    device: deviceId(),
  };
  try {
    supa.from("usage_events").insert(row).then(() => {}, () => {});
  } catch {}
}

// A game started or ended on this phone (game.js calls this).
function countGame(event) {
  const humans = Object.values(players).filter((p) => !p.bot).length;
  countUsage(event, {
    mode: client.mode,
    room: client.roomIsPublic ? "public" : client.roomIsClass ? "class" : "private",
    host: client.isHost,
    players: client.isHost ? Math.max(1, humans) : null,
  });
}

// Someone opened the game. (account.js connects to Supabase first: it is loaded before this file.)
window.addEventListener("DOMContentLoaded", () => countUsage("visit"));

// ---------- The owner's "Usage" screen ----------

// Ask the database for the numbers. It only answers the owner; for anyone else this is null.
async function fetchStats() {
  if (!supa || !account.user) return null;
  let tz = "UTC";
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"; } catch {}
  try {
    const { data, error } = await supa.rpc("usage_stats", { tz });
    return error ? null : data;
  } catch {
    return null;
  }
}

// Logged in or out: show the button only if the database says this login is the owner.
// (account.js calls this.)
let statsCheckedFor = null;
async function checkStatsOwner() {
  const id = account.user ? account.user.id : null;
  if (id === statsCheckedFor) return;
  statsCheckedFor = id;
  statsButton.hidden = true;
  if (!id) return;
  const data = await fetchStats();
  if (statsCheckedFor === id) statsButton.hidden = !data;
}

statsButton.addEventListener("click", async () => {
  statsBody.textContent = "Loading…";
  statsEl.hidden = false;
  const data = await fetchStats();
  if (!data) { statsBody.textContent = "Couldn't load the numbers. Try again later."; return; }
  drawStats(data);
});
document.getElementById("stats-close").addEventListener("click", () => { statsEl.hidden = true; });

// Build a table from rows of text. (textContent, never innerHTML.)
function statsTable(headings, rows) {
  const table = document.createElement("table");
  table.className = "stats-table";
  const addRow = (cells, tag) => {
    const tr = document.createElement("tr");
    for (const cell of cells) {
      const el = document.createElement(tag);
      el.textContent = cell;
      tr.appendChild(el);
    }
    table.appendChild(tr);
  };
  addRow(headings, "th");
  for (const row of rows) addRow(row, "td");
  return table;
}

function drawStats(data) {
  statsBody.textContent = "";
  const periods = data.periods || [];
  const names = { 1: "24 hours", 7: "7 days", 30: "30 days" };
  const line = (label, key) => [label, ...periods.map((p) => String(p[key]))];
  statsBody.appendChild(statsTable(["Last…", ...periods.map((p) => names[p.days] || p.days + " days")], [
    line("Times the game was opened", "visits"),
    line("Different phones", "phones"),
    line("Games started", "games"),
    line("Games finished", "finished"),
    line("Players in those games", "plays"),
    line("· Capture the Flag", "ctf_games"),
    line("· Mt Hermon Racing", "race_games"),
    line("· Public games", "public_games"),
    line("· Private rooms", "private_games"),
    line("· Class games", "class_games"),
  ]));

  const title = document.createElement("p");
  title.className = "stats-title";
  title.textContent = "Day by day (last 30 days)";
  statsBody.appendChild(title);
  const daily = data.daily || [];
  if (!daily.length) {
    const none = document.createElement("p");
    none.textContent = "Nothing counted yet.";
    statsBody.appendChild(none);
    return;
  }
  statsBody.appendChild(statsTable(["Day", "Opened", "Phones", "Games", "Players"],
    daily.map((d) => [d.day, String(d.visits), String(d.phones), String(d.games), String(d.plays)])));
}
