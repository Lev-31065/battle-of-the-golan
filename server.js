// server.js — the REFEREE. Only the HOST's phone runs this code.
//
// Every phone moves its own player (so walking feels instant), but the referee
// makes all the important decisions so everyone agrees on what happened:
//   who got hit, who's knocked out, who has a flag, and the score.
//
// About 20 times a second, the referee packs up the whole game into a
// "snapshot" and sends it to every phone.
//
// This file is the SHARED part of the referee: rooms, players joining and leaving,
// teams in the lobby, the words, and starting and ending a game. Everything that is
// special to one game (like flags and weapons in Capture the Flag) is in that game's
// own file (ctf-server.js). Each game file adds itself to SERVER_GAMES, and this file
// asks it what to do (see serverGame() below).

const server = {
  hostId: null,
  time: 0,          // the referee's clock (seconds) — every phone syncs to this
  phase: "lobby",   // "lobby" → "playing" → "over" → (a few seconds later) back to "lobby"
  winner: null,
  overAt: 0,        // when the last game ended
  players: {},      // every player, by id
  pastTeams: {},    // nickname → team, for players who left (so they rejoin the same team)
  events: [],       // things that just happened (hits, messages) to send with the next snapshot
  deckId: "auto",   // "auto" (each player's own level) or the one deck everyone plays (the host picks)
  customDeck: null, // if the host picked one of their own decks: { id, name, words } to send to every phone
  classGame: false, // true = a teacher's class game: only then can the host pick the words for everyone
  mode: "ctf",      // which game: "ctf" = Capture the Flag (two more games are coming)
  public: false,    // true = a public room (PUBLIC in rules.js): made-up names, and the game starts by itself
  autoStartAt: null, // (public rooms) when the game will start by itself (null = not enough players yet)
  // (Each game adds its own things here too, like server.flags in Capture the Flag.)
};

// ---------- The games ----------
// Each game's referee file adds itself here: SERVER_GAMES.ctf = { ... } (in ctf-server.js).
// A game answers these questions from the shared referee:
//   newRound()          a fresh round: set up the game's own things (flags, score…)
//   newPlayer(p)        someone joined: give them the game's own fields (health, position…)
//   playerLeaving(p)    someone is leaving (drop what they carry, etc.)
//   startGame()         the host tapped Start: put everyone in place
//   handle(p, msg)      a message from a phone that isn't one of the shared ones
//   update(dt)          one frame while playing
//   snapshot(snap)      add the game's own things to the snapshot sent to phones
// And one setting: teams: false = a game without blue and red teams (like the race).
const SERVER_GAMES = {};

// The game this room is playing.
function serverGame() {
  return SERVER_GAMES[server.mode] || SERVER_GAMES.ctf;
}

// The host picked the words. A teacher deck only lives on the host's phone, so we
// also keep a copy to send to everyone (with the next snapshot, and to anyone who asks later).
function serverSetDeck(deckId) {
  server.deckId = isDeckChoice(deckId) ? deckId : AUTO;
  const deck = findDeck(server.deckId);
  server.customDeck = deck && deck.custom ? { id: deck.id, name: deck.english, words: deck.words } : null;
  if (server.customDeck) server.events.push({ kind: "deck", deck: server.customDeck });
}

// Start a fresh room. options: { classGame: true/false, mode: "ctf" }
function serverReset(hostId, deckId, options = {}) {
  server.hostId = hostId;
  server.events = [];
  server.deckSentAt = -Infinity;
  server.classGame = Boolean(options.classGame);
  server.mode = options.mode || "ctf";
  server.public = Boolean(options.public);
  server.autoStartAt = null;
  // A normal room is always Auto here: each phone plays the level its own player picks.
  serverSetDeck(server.classGame ? deckId : AUTO);
  server.time = 0;
  server.phase = "lobby";
  server.players = {};
  server.pastTeams = {};
  serverGame().newRound();
}

// ---------- Events (sent to phones with the next snapshot) ----------

// A message for everyone ("all") or one player (their id). `he` is the Hebrew, shown underneath.
function toast(text, he, to = "all") {
  server.events.push({ kind: "toast", text, he, to });
}
// Words that float up from the map. `he` (optional) is a Hebrew line drawn underneath.
// `sound` (optional) is the name of a sound effect from sound.js for phones nearby to play.
function floatText(text, x, y, color = "#fde047", life = 0.9, sound = null, he = null) {
  server.events.push({ kind: "text", text, he, x, y, color, life, sound });
}

// ---------- Players joining and leaving ----------

function cleanName(name) {
  return String(name || "").trim().slice(0, 12) || "Player";
}

// A made-up name for a public room, like "🦊 שׁוּעָל 27" (one nobody in the room has yet).
function publicName() {
  let name = "";
  for (let tries = 0; tries < 40; tries++) {
    const animal = PUBLIC.animals[Math.floor(Math.random() * PUBLIC.animals.length)];
    name = `${animal[0]} ${animal[1]} ${1 + Math.floor(Math.random() * 99)}`;
    if (!Object.values(server.players).some((p) => p.name === name)) break;
  }
  return name;
}

// (Public rooms) is the room full? Bots do not count.
function serverIsFull() {
  return server.public && Object.values(server.players).filter((p) => !p.bot).length >= PUBLIC.maxPlayers;
}

function serverAddPlayer(id, name, look) {
  if (server.players[id]) return;
  // In a public room nobody types a nickname (the players are strangers): everyone gets a made-up one.
  if (server.public) name = publicName();
  // Closed the game and came straight back? The old "you" may still be standing there
  // (we wait 8 seconds before removing a silent phone). If someone with the same
  // nickname has been silent for 2+ seconds, that's the old you: remove it now.
  // Like a knockout, it drops any flag and loses the hammer. (Phones that are really
  // playing check in every second, so a different player with the same name is safe.)
  for (const old of Object.values(server.players)) {
    if (!server.public && old.id !== server.hostId && old.name === cleanName(name) && server.time - old.lastSeen > 2) {
      serverRemovePlayer(old.id);
    }
  }
  // Coming back after leaving (same nickname)? Back on your old team.
  // Otherwise, join whichever team is smaller.
  const everyone = Object.values(server.players);
  const blueCount = everyone.filter((p) => p.team === "blue").length;
  const pastTeam = server.pastTeams[cleanName(name)];
  const team = pastTeam || (blueCount <= everyone.length - blueCount ? "blue" : "red");

  const p = {
    id,
    name: server.public ? name : cleanName(name),
    look: findLook(look) ? look : "none", // the hat (or other look) this player wears: LOOKS in rules.js
    team,
    alive: true,
    spawnCount: 0,      // goes up each time the referee teleports you (start, respawn)
    lastSeen: server.time,
  };
  serverGame().newPlayer(p); // the game's own fields (position, health, items…)
  server.players[id] = p;
  const playerName = p.name;
  if (serverGame().teams === false) {
    // A game without teams (like the race): just "joined".
    toast(`👋 ${playerName} joined the game`, `${playerName} הִצְטָרֵף/הִצְטָרְפָה לַמִּשְׂחָק`);
  } else {
    toast(`👋 ${playerName} joined the ${TEAM_NAMES[team]} team`, `${playerName} הִצְטָרֵף/הִצְטָרְפָה ${TEAM_HE[team].toTeam}`);
  }
}

function serverRemovePlayer(id) {
  const p = server.players[id];
  if (!p) return;
  serverGame().playerLeaving(p);
  server.pastTeams[p.name] = p.team; // remember their team in case they come back
  delete server.players[id];
  toast(`👋 ${p.name} left the game`, `${p.name} יָצָא/יָצְאָה מֵהַמִּשְׂחָק`);
}

// ---------- Messages from phones ----------

function serverHandle(id, msg) {
  if (!msg || typeof msg !== "object") return;
  if (msg.type === "join") {
    serverAddPlayer(id, msg.name, msg.look);
    return;
  }
  const p = server.players[id];
  if (!p) return;
  p.lastSeen = server.time;

  switch (msg.type) {
    case "ping":
      break; // just "I'm still here"
    case "team":
      if (server.phase === "lobby") p.team = msg.team === "red" ? "red" : "blue";
      break;
    case "start":
      if (id === server.hostId && !server.public) serverStartGame(); // (a public game starts by itself)
      break;
    case "deck":
      // Only the host of a CLASS game can pick the words for everyone, and not in the middle of a battle.
      if (server.classGame && id === server.hostId && server.phase !== "playing" && isDeckChoice(msg.deckId)) {
        serverSetDeck(msg.deckId);
      }
      break;
    case "needDeck":
      // A phone doesn't have the host's teacher deck yet (it just joined). Send it.
      // (It goes out with the next snapshot. Every phone gets it, which is harmless.)
      // At most once a second, even if several phones ask at the same moment.
      if (server.customDeck && server.time - (server.deckSentAt || -Infinity) >= 1) {
        server.deckSentAt = server.time;
        server.events.push({ kind: "deck", deck: server.customDeck });
      }
      break;
    default:
      // Everything else ("move", "swing", "grab"…) belongs to the game being played.
      serverGame().handle(p, msg);
  }
}

function serverStartGame() {
  server.autoStartAt = null;
  serverGame().newRound();
  server.phase = "playing";
  serverGame().startGame();
}

// The game is over: show the winner for a few seconds (then serverUpdate goes back to the lobby).
function serverEndGame(winner) {
  server.phase = "over";
  server.winner = winner;
  server.overAt = server.time;
}

// ---------- Every frame ----------

function serverUpdate(dt) {
  server.time += dt;

  // Remove players we haven't heard from in 8 seconds (their phone probably went to sleep).
  for (const p of Object.values(server.players)) {
    if (p.id !== server.hostId && server.time - p.lastSeen > 8) serverRemovePlayer(p.id);
  }

  // The game ended a few seconds ago: everyone goes back to the teams screen (the lobby).
  if (server.phase === "over" && server.time - server.overAt >= WINNER_SCREEN_TIME) {
    server.phase = "lobby";
    serverGame().newRound();
  }

  // A public room: once there are enough players, the game starts by itself a little later.
  if (server.public && server.phase === "lobby") {
    const count = Object.values(server.players).filter((p) => !p.bot).length;
    if (count < (PUBLIC.minPlayers[server.mode] || 1)) server.autoStartAt = null;
    else if (server.autoStartAt === null) server.autoStartAt = server.time + PUBLIC.startDelay;
    else if (server.time >= server.autoStartAt) serverStartGame();
  }

  if (server.phase !== "playing") return;
  serverGame().update(dt);
}

// Pack up everything the phones need to draw the game.
function serverSnapshot() {
  const snapshot = {
    type: "state",
    time: server.time,
    phase: server.phase,
    winner: server.winner,
    hostId: server.hostId,
    deckId: server.deckId,
    classGame: server.classGame,
    mode: server.mode,
    public: server.public,
    startIn: server.autoStartAt === null ? null : Math.max(0, Math.ceil(server.autoStartAt - server.time)), // (public rooms) seconds until the game starts by itself

    players: Object.values(server.players).map((p) => ({ ...p })),
    events: server.events,
  };
  serverGame().snapshot(snapshot); // the game adds its own things (flags, score…)
  server.events = [];
  return snapshot;
}
