// network.js — connects phones together using PeerJS.
//
// How it works:
//   • The HOST picks a random 4-letter room code (like "KZTP") and registers
//     itself under that name on PeerJS's free matchmaking server.
//   • Other phones type the code. PeerJS introduces them to the host, and from
//     then on the phones talk to each other directly.
//   • Joiners send the host short messages ("I moved here", "I swung my hammer").
//     The host sends everyone the whole game ~20 times a second.

const ROOM_PREFIX = "battle-of-the-golan-";

const net = {
  peer: null,       // our PeerJS connection
  hostConn: null,   // (joiners only) the line to the host
  clients: {},      // (host only) the lines to each joiner, by their id
};

// Letters only, and no I or O, so nobody confuses them with 1 and 0.
function makeRoomCode() {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 4; i++) code += letters[Math.floor(Math.random() * letters.length)];
  return code;
}

// Turn PeerJS's technical errors into messages a player can understand.
function friendlyError(err) {
  switch (err.type) {
    case "peer-unavailable":
      return "No room with that code. Check the code and try again.";
    case "network":
    case "server-error":
    case "socket-error":
    case "socket-closed":
      return "Couldn't reach the game server. Check your internet connection.";
    case "browser-incompatible":
      return "This browser can't play online. Try Chrome or Safari.";
    default:
      return "Something went wrong: " + (err.message || err.type);
  }
}

function peerLibraryLoaded(onError) {
  if (typeof Peer === "undefined") {
    onError("Couldn't load the multiplayer library. Check your internet connection.");
    return false;
  }
  return true;
}

// Create a room. handlers = { onReady(code, myId), onMessage(id, msg), onLeave(id), onError(text) }
function hostRoom(handlers) {
  if (!peerLibraryLoaded(handlers.onError)) return;
  const code = makeRoomCode();
  const peer = new Peer(ROOM_PREFIX + code);
  net.peer = peer;
  let ready = false;

  peer.on("open", (id) => {
    ready = true;
    handlers.onReady(code, id);
  });

  // Someone is joining!
  peer.on("connection", (conn) => {
    conn.on("open", () => { net.clients[conn.peer] = conn; });
    conn.on("data", (msg) => handlers.onMessage(conn.peer, msg));
    conn.on("close", () => {
      delete net.clients[conn.peer];
      handlers.onLeave(conn.peer);
    });
  });

  // If we lose touch with the matchmaking server, reconnect so new players can still join.
  peer.on("disconnected", () => {
    if (!peer.destroyed) peer.reconnect();
  });

  peer.on("error", (err) => {
    if (err.type === "unavailable-id") {
      // That room code is already taken — try a different one.
      peer.destroy();
      hostRoom(handlers);
    } else if (!ready) {
      handlers.onError(friendlyError(err));
    }
  });
}

// Join a room. handlers = { onConnected(myId), onMessage(msg), onClose(), onError(text) }
function joinRoom(code, handlers) {
  if (!peerLibraryLoaded(handlers.onError)) return;
  const peer = new Peer();
  net.peer = peer;
  let connected = false;

  // Give up if nothing happens for 12 seconds.
  const giveUpTimer = setTimeout(() => {
    if (connected) return;
    peer.destroy();
    handlers.onError("Couldn't connect to that room. Check the code and that you're online.");
  }, 12000);

  peer.on("open", (myId) => {
    const conn = peer.connect(ROOM_PREFIX + code, { reliable: true, serialization: "json" });
    net.hostConn = conn;
    conn.on("open", () => {
      connected = true;
      clearTimeout(giveUpTimer);
      handlers.onConnected(myId);
    });
    conn.on("data", handlers.onMessage);
    conn.on("close", () => { if (connected) handlers.onClose(); });
  });

  peer.on("error", (err) => {
    if (connected) return;
    clearTimeout(giveUpTimer);
    peer.destroy();
    handlers.onError(friendlyError(err));
  });
}

// (Joiners) send a message to the host.
function sendToHost(msg) {
  if (net.hostConn && net.hostConn.open) net.hostConn.send(msg);
}

// (Host) send a message to every joiner.
function broadcast(msg) {
  for (const conn of Object.values(net.clients)) {
    if (conn.open) conn.send(msg);
  }
}

// Hang up everything.
function disconnect() {
  if (net.peer) net.peer.destroy();
  net.peer = null;
  net.hostConn = null;
  net.clients = {};
}
