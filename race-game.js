// race-game.js — Mt Hermon Racing on the phone: steering my sled, speeding up and
// slowing down, crashing into trees, the countdown, and the winner screen.
//
// The sled goes forward by itself. Hold the left half of the screen to steer left,
// the right half to steer right (or use the arrow keys / A and D on a computer).
// Hold a SKID button (bottom corners of the screen) = a skid to that side (sharper turns, but slower).
// Also here: bumping into mountain goats, flying off the snow ramps, gifts from the gates (banana peel / mango / rimon), spinning out,
// and the splash into the Kinneret at the end.
// The drawing is in race-draw.js and the track in race-track.js.
// The referee's side is race-server.js. (The questions game.js asks are at the bottom: PHONE_GAMES.race.)

let raceInfo = { startAt: Infinity, finishers: [] }; // from the referee
let mySpeed = 0;          // how fast my sled is going (track units per second)
let mySteer = 0;          // which way my sled points: -1 = turned fully left, 0 = straight down the path, 1 = fully right
let myCarve = 0;          // how hard I am steering right now (-1 … 1): for the snow spray
let bumpAt = -Infinity;   // when I last bumped into another sled
let bumpDir = 1;          // which way that bump pushed me
let raceTurn = 0;         // goes up and down as the track turns (slides the mountains)
let crashAt = -Infinity;  // when I last hit something HARD: a tree or a rock (for the screen shake)
let crashDir = 1;         // which way that crash shoved me: -1 = left, 1 = right
let lastRaceSend = -Infinity; // when I last told the referee where I am (game clock)
let lastCountdown = null; // the last countdown number I beeped for
let myFinishedPlace = 0;  // my place once I've crossed the finish line (0 = still racing)
let inDeepSnow = false;
const snowPuffs = [];     // snow spraying up behind my sled (on the screen only)
let mySledSize = 100;     // how wide my sled is on the screen, in pixels (set while drawing)
let gateQuestion = null;  // the question on the next gate: { z, gate, entry, choices, shownAt, lane, settledAt, tries (how many times I got it wrong), wrong (the lanes I already tried: [true, false, false]) }
let gateFeedback = null;  // after a gate: { kind: "right" / "wrong" / "missed", entry, until }
let lastGateZ = -Infinity; // the last gate I went through (its distance along the race)
let boostUntil = -Infinity; // right answer: faster until this time
let bounceAt = -Infinity;   // wrong answer: when the gate bounced me back up the path…
let bounceFrom = 0;         // …from here…
let bounceTo = 0;           // …to here (distances along the race)
const softHits = new Map(); // the bushes and snowmen I ploughed through lately, and when (so each one only slows me once)
let softAt = -Infinity;     // …and when
let mySlide = 0;          // how fast my sled is sliding sideways right now (road widths per second)
let myAir = 0;            // how high my sled is above the ground (0 = on the ground)
let myVy = 0;             // how fast it is going up (minus = coming down)
let carveTime = 0;        // how long I have been carving round this bend (for the carve boost)
let spinAt = -Infinity;   // when a banana peel or a mango last hit me
let mySpinCount = 0;      // how many hits the referee has counted for me (when it goes up, I spin)
let inWater = false;      // my sled has landed in the Kinneret
let itemUsedAt = -Infinity; // when I last used a gift (so the button hides straight away)
let itemTips = 0;         // how many times the "tap to use it" tip was shown
let lastItem = null;      // the gift I was holding a moment ago
let lastSecret = null;    // the last secret shortcut I found (so its message shows only once)
const hardHits = new Map(); // the trees and rocks I hit lately, and when (for a moment they can not stop me again)
let mySkid = false;       // am I skidding right now? (holding a skid button)
let steerLimit = 1;       // how far my sled may swing round right now (1 normally, more in a skid)
const seenBooms = new Set(); // the rimon explosions this phone has already shown (their ids)
const goatHits = new Map();  // the goats that were bumped lately: goat id → { at (when), dir (which way it flew: -1 left, 1 right) }
const GOAT = { x: 0, z: 0, facing: 1 }; // (a spare spot for goatSpot to fill in)
const otherSleds = new Map(); // what this phone remembers about the other sleds: id → { air, spinCount, spinAt }
const flight = { y: 0, x: 0, speed: 0, air: 0, vy: 0 }; // (my sled, the way sledFlight in race-track.js wants it)
const itemButton = document.getElementById("item-button");
const itemIcon = document.getElementById("item-icon");
const itemLabel = document.getElementById("item-label");
const dropButton = document.getElementById("drop-button"); // (a rimon only: drop it behind me instead of throwing it)
const ITEM_NAMES = {
  banana: { icon: "🍌", en: "Banana peel", he: "קְלִפַּת בָּנָנָה", tipEn: "🍌 A banana peel! Tap the button to drop it behind you", tipHe: "🍌 קְלִפַּת בָּנָנָה!" },
  mango: { icon: "🥭", en: "Mango", he: "מַנְגּוֹ", tipEn: "🥭 A mango! Tap the button to throw it ahead", tipHe: "🥭 מַנְגּוֹ!" },
  gas: { icon: "☁️", en: "Gas cloud", he: "עֲנַן גַּז", tipEn: "☁️ Gas! Tap the button: the sleds close behind you will hardly see a thing", tipHe: "☁️ עֲנַן גַּז!" },
  rimon: { icon: "💣", en: "Throw rimon", he: "לִזְרֹק רִמּוֹן", tipEn: "💣 A rimon! Big button = throw it ahead. Small button = drop it behind you", tipHe: "💣 רִמּוֹן!" },
};
const raceWinnerEl = document.getElementById("winner");

// ---------- Steering ----------
// Every finger on the screen counts: left half = -1 (left), right half = 1 (right).
// A finger can slide across the middle to switch sides.
// SKID: hold one of the two skid buttons in the bottom corners (left button = skid left,
// right button = skid right). The sled swings round much further (sharp bends!), but it
// loses speed. Let go to stop skidding. (On a computer: hold Shift with an arrow key.)
const steerFingers = new Map(); // finger (pointer id) → -1 or 1
const skidFingers = new Map();  // a finger on a skid button → -1 (the left button) or 1 (the right one)
const skidButtons = { "-1": document.getElementById("skid-left"), "1": document.getElementById("skid-right") };
for (const side of [-1, 1]) {
  skidButtons[side].addEventListener("pointerdown", (event) => {
    event.preventDefault();
    if (client.mode === "race" && client.phase === "playing") skidFingers.set(event.pointerId, side);
  });
}

// Which way I am asking to skid: -1 = left, 1 = right, 0 = not skidding.
function skidInput() {
  let side = 0;
  for (const s of skidFingers.values()) side += s;
  if (keysDown.has("shift")) side += keyboardDirection().x;
  return Math.sign(side);
}

function sideOfScreen(event) {
  return event.clientX < window.innerWidth / 2 ? -1 : 1;
}
// Only touches on the game itself steer, not on buttons or popups.
function isOnTheTrack(target) {
  return !target.closest("button, .overlay, .screen, a, input, select");
}
window.addEventListener("pointerdown", (event) => {
  if (client.mode !== "race" || client.phase !== "playing" || !isOnTheTrack(event.target)) return;
  steerFingers.set(event.pointerId, sideOfScreen(event));
});
window.addEventListener("pointermove", (event) => {
  if (steerFingers.has(event.pointerId)) steerFingers.set(event.pointerId, sideOfScreen(event));
});
for (const type of ["pointerup", "pointercancel"]) {
  window.addEventListener(type, (event) => { steerFingers.delete(event.pointerId); skidFingers.delete(event.pointerId); });
}

// ---------- Using a gift (the banana peel, mango or rimon from a gate) ----------
// Tap the big round button (or press Space). The referee decides what happens next.
// A rimon can go two ways: the big button THROWS it ahead; the small button under it
// (or the B key) DROPS it behind me. how = "drop" for that.
function useMyItem(how) {
  const me = myPlayer();
  if (!me || !me.item || client.mode !== "race" || client.phase !== "playing" || gameTime - itemUsedAt < 0.5) return;
  if (how === "drop" && me.item !== "rimon") return;
  itemUsedAt = gameTime;
  sendToServer({ type: "use", how: how || "" });
  playSound("throw");
}
itemButton.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  useMyItem();
});
dropButton.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  useMyItem("drop");
});

// How far round a sled has spun, this long after being hit (two full turns, slowing down).
function spinAngle(since) {
  if (since < 0 || since >= RACE.spinTime) return 0;
  const t = since / RACE.spinTime;
  return (1 - (1 - t) * (1 - t)) * Math.PI * 4;
}

// -1 = full left, 0 = straight, 1 = full right.
function steerInput() {
  const skid = skidInput(); // (a skid button also steers, that way)
  if (skid) return skid;
  let steer = keyboardDirection().x;
  for (const side of steerFingers.values()) steer += side;
  return Math.max(-1, Math.min(1, steer));
}

// ---------- Moving my sled every frame ----------

function raceUpdate(dt) {
  // Snow puffs drift and fade.
  for (let i = snowPuffs.length - 1; i >= 0; i--) {
    const puff = snowPuffs[i];
    puff.age += dt;
    puff.x += puff.vx * dt;
    puff.y += puff.vy * dt;
    puff.vy += 300 * dt; // falling back down
    if (puff.age > puff.life) snowPuffs.splice(i, 1);
  }

  const me = myPlayer();
  if (!me || client.phase !== "playing") return;

  const started = gameTime >= raceInfo.startAt;

  // The other sleds: glide their height (jumps look smooth), and notice when one gets hit.
  for (const other of Object.values(players)) {
    if (other.id === client.myId) continue;
    let seen = otherSleds.get(other.id);
    if (!seen) { seen = { air: 0, spinCount: other.spinCount || 0, spinAt: -Infinity }; otherSleds.set(other.id, seen); }
    seen.air += ((other.air || 0) - seen.air) * Math.min(1, dt * 12);
    if ((other.spinCount || 0) > seen.spinCount) seen.spinAt = gameTime;
    seen.spinCount = other.spinCount || 0;
  }

  // Was I hit by a banana peel or a mango? (The referee counts the hits; when the count goes up, I spin out.)
  if ((me.spinCount || 0) !== mySpinCount) {
    if ((me.spinCount || 0) > mySpinCount && started) {
      spinAt = gameTime;
      mySpeed *= RACE.spinSpeed;
      carveTime = 0;
      playSound("spin");
    }
    mySpinCount = me.spinCount || 0;
  }
  const spinning = gameTime - spinAt < RACE.spinTime;

  // A new gift in my hands? Say what it is (the first few times, also how to use it).
  if (me.item !== lastItem) {
    lastItem = me.item;
    const names = ITEM_NAMES[me.item];
    if (names && itemTips < 4) { itemTips += 1; showToast(names.tipEn, names.tipHe); }
  }

  // Rimonim that just blew up: a bang and a burst of red, once each.
  for (const boom of raceInfo.booms || []) {
    if (seenBooms.has(boom.id)) continue;
    seenBooms.add(boom.id);
    // (Only the ones near me make a noise: quieter the further away, silent past RACE.soundReach.)
    playSound("boom", 1 - Math.abs(boom.y - me.y) / RACE.soundReach);
    if (race3dAvailable()) race3dBoom(boom.y, boom.x);
    if (Math.abs(boom.y - me.y) < 3500) crashAt = Math.max(crashAt, gameTime - 0.12); // (close by: the screen shakes a little)
  }

  const flying = myAir > 0;
  const steer = started && !spinning && !inWater ? steerInput() : 0;
  // Skidding: while I hold a skid button, the sled skids to that side. It swings round faster
  // and much further, so it can take a sharp bend, but it loses speed. Only on the ground.
  const bouncing = gameTime - bounceAt < RACE.gateBounceTime; // (a gate is bouncing me back)
  const skidding = started && !spinning && !inWater && !flying && !bouncing && skidInput() !== 0;
  if (skidding && !mySkid) playSound("skid");
  mySkid = skidding;
  // (After a skid the sled straightens back to a normal turn quickly, not in one jerk.)
  steerLimit = skidding ? RACE.skidTurn : Math.max(1, steerLimit - RACE.skidRecover * dt);
  // Steering TURNS the sled, like a real one. When you stop steering it does NOT swing back
  // to straight: it keeps gliding the way it points until you steer the other way.
  // (RACE.steerReturn above 0 would make it straighten out by itself, slowly.)
  // In the air there is nothing to push against, so it only turns a little.
  mySteer += steer * RACE.turnRate * (flying ? RACE.airSteer : skidding ? RACE.skidTurnRate : 1) * dt;
  mySteer -= mySteer * Math.min(1, RACE.steerReturn * dt);
  mySteer = Math.max(-steerLimit, Math.min(steerLimit, mySteer));

  if (started && bouncing) {
    // A wrong answer: the gate bounces me back up the path (fast at first, then slowing down),
    // and I start again from a standstill. I can already steer toward another lane on the way.
    const t = Math.max(0, Math.min(1, (gameTime - bounceAt) / RACE.gateBounceTime));
    me.y = bounceFrom + (bounceTo - bounceFrom) * (1 - (1 - t) * (1 - t));
    mySpeed = 0;
    mySlide = 0;
    carveTime = 0;
    const room = findSegment(me.y).width - 0.2;
    me.x = Math.max(-room, Math.min(room, me.x + mySteer * RACE.steerSpeed * 0.6 * dt));
    if (t >= 1) mySteer = 0;
    checkGates(me); // (so the lane I'm in stays up to date)
  } else if (started) {
    const segment = findSegment(me.y);
    const fraction = Math.max(0, mySpeed) / RACE.maxSpeed; // 0 = stopped, 1 = top speed
    const oldY = me.y, oldX = me.x;

    // A sled keeps going STRAIGHT, so in a bend the path turns away under it and you have
    // to steer round, like in a kart. (RACE.curveSteer = how much of that is real.)
    // (Much less while flying, so a jump in a bend still lands on the path.)
    // (A really tight bend turns away faster than a sled can steer: only a skid gets round it.)
    // A TILTED bend holds the sled in like a bowl, so it hardly needs steering (RACE.bankHelp).
    const pull = RACE.curveSteer * (1 - RACE.bankHelp * Math.abs(segment.bank));
    mySteer -= segment.curve * RACE.bend3d / (RACE.segmentLength * RACE.segmentLength) * Math.max(0, mySpeed) * dt / RACE.maxTurn * pull * (flying ? 0.3 : 1);
    mySteer = Math.max(-steerLimit, Math.min(steerLimit, mySteer));

    // The way the sled points moves you sideways (faster when you're going fast)…
    // (Even when you're crawling you can still steer a bit: RACE.slowSteer. Otherwise you'd be stuck after a crash.)
    // …but not at once: snow is slippery, so the sled slides for a moment before it goes
    // where it points (RACE.grip). In the air it just keeps going the way it was going.
    const wanted = mySteer * RACE.steerSpeed * Math.max(fraction, RACE.slowSteer);
    if (inWater) mySlide = 0;
    else if (!flying) mySlide += (wanted - mySlide) * Math.min(1, (skidding ? RACE.skidGrip : RACE.grip) * dt);
    me.x += mySlide * dt;
    me.x -= segment.curve * RACE.curvePush * fraction * fraction * dt;
    // (For the snow spray: steering, sliding or going round a bend all throw snow out sideways.)
    myCarve = flying ? 0 : skidding ? steer : Math.max(-1, Math.min(1, steer * 0.7 + (wanted - mySlide) * 0.6 + Math.sign(segment.curve) * Math.min(1, Math.abs(segment.curve) / 6) * fraction * 0.6));

    // Other sleds are solid: if mine touches one, we get pushed apart sideways. (Every phone
    // does this for its own sled, so both move.) The sled at the back can't drive through the
    // one in front: it is held to that sled's speed until it has slid out from behind it.
    me.air = myAir; // (a sled that is flying goes right over the others)
    for (const other of Object.values(players)) {
      if (other.id === client.myId) continue;
      const touch = sledsTouch(me, other);
      if (!touch) continue;
      me.x += touch.side * RACE.bumpShove * dt;
      if (touch.lined && touch.behind) mySpeed = Math.min(mySpeed, Math.max(0, other.speed || 0) * 0.92);
      if (gameTime - bumpAt > 0.5) {
        // The first touch: a thump, a little knock off course, and a push for the sled in front.
        bumpAt = gameTime;
        bumpDir = touch.side;
        mySteer = Math.max(-steerLimit, Math.min(steerLimit, mySteer + touch.side * 0.15));
        if (touch.lined && !touch.behind) mySpeed += RACE.bumpBoost;
        playSound("thump");
      }
    }
    // You can go off the path, but not past the edge of the mountainside.
    // (On the bridge and in the tunnel there are walls right at the path's edge.)
    const farthest = segment.walled ? segment.width - 0.17 : segment.width + RACE.shoulder * 0.8;
    me.x = Math.max(-farthest, Math.min(farthest, me.x));

    // Off the path = much slower (deep snow up high, rough ground lower down). The island
    // in the middle of a split counts as off the path too.
    // A right answer at a gate = a boost (faster for a moment).
    inDeepSnow = !flying && !inWater && offThePath(segment, me.x);
    const boosting = gameTime < boostUntil;
    // The shortcut down the mountain face is steeper, so it is faster; so is a tilted bend.
    const onShortcut = !inDeepSnow && segment.fork && segment.fork.fastSide && segment.island > 0.3 && (me.x - segment.islandAt) * segment.fork.fastSide > segment.island;
    // (Found a SECRET shortcut? Say so, once for each one.)
    if (onShortcut && segment.fork.secretSide && lastSecret !== segment.fork) {
      lastSecret = segment.fork;
      showToast("🤫 A secret shortcut!", "🤫 קִצּוּר דֶּרֶךְ סוֹדִי!");
      playSound("item");
    }
    const top = RACE.maxSpeed * (inDeepSnow ? RACE.offTrackSpeed : 1)
      * (boosting ? RACE.boostSpeed : 1) * (spinning ? RACE.spinSpeed : 1)
      * (skidding ? RACE.skidSpeed : 1) * (onShortcut ? segment.fork.fastSpeed : 1)
      * slopeSpeed((segment.p2.world.y - segment.p1.world.y) / RACE.segmentLength); // (faster where the path is steep, slower where it is flat or uphill)
    // (A skid scrubs the speed off gently; deep snow or a hit brakes hard.)
    const braking = skidding && !inDeepSnow && !spinning ? RACE.skidBrake : RACE.offTrackSlowdown;
    if (inWater) mySpeed = Math.max(0, mySpeed - RACE.waterDrag * dt); // the lake stops the sled
    else if (flying) { /* in the air it just keeps its speed */ }
    else if (mySpeed > top) mySpeed = Math.max(top, mySpeed - braking * dt);
    else mySpeed = Math.min(top, mySpeed + RACE.accel * (boosting ? 3 : 1) * dt);

    // Running into things. (Trees and rocks stand beside the path, and a few right on it, so watch out!)
    //   SOFT things (a bush, a snowman): the sled ploughs right through in a big spray of
    //     snow. It is not stopped, only slowed down.
    //   HARD things (a tree, a rock, a cabin): CLACK! The sled keeps only a little of its
    //     speed, and it is knocked round to point away from the thing, so it slides off past it.
    // The sled is long: we look at everything from its back to its NOSE, so it hits the
    // moment the nose touches (not after it's already halfway through).
    // (Only the solid middle counts, like a tree's trunk: `hit` in SPRITE_SIZES. You can slip under the leaves.)
    // (A sled that is flying high enough goes right over it.)
    if (mySpeed > 0) {
      const noseIndex = findSegment(me.y + RACE.sledLength).index;
      for (let i = segment.index; i <= noseIndex && gameTime !== crashAt; i++) {
        for (const sprite of TRACK.segments[i].sprites) {
          const size = SPRITE_SIZES[sprite.type];
          if (!size.solid || myAir > size.h * 0.5) continue;
          const reach = (SLED_WIDTH / 2 + size.hit / 2) / RACE.roadWidth;
          if (Math.abs(me.x - sprite.offset) >= reach) continue;
          // Which way I get pushed: away from it. (If it stands beside the path, always back TOWARD the path.)
          const away = Math.abs(sprite.offset) > segment.width ? -Math.sign(sprite.offset) : me.x >= sprite.offset ? 1 : -1;
          if (size.soft) {
            // (Each one slows me only once, and never two in the same moment: a thicket can't trap me.)
            if (gameTime - softAt < 0.35 || gameTime - (softHits.get(sprite) || -Infinity) < 3) continue;
            if (softHits.size > 40) softHits.clear();
            softHits.set(sprite, gameTime);
            softAt = gameTime;
            mySpeed *= RACE.softHitSpeed;
            carveTime = 0;
            playSound("poof");
            if (race3dAvailable()) { race3dCrash(i, sprite.offset, away, gameTime, true); race3dSplash(me.y, me.x, false); } // snow everywhere
            continue;
          }
          if (gameTime - crashAt <= 0.8) continue; // (still sliding away from the last tree)
          // (A tree or rock I hit a moment ago can not stop me again: I slide past it this time.
          // That way a sled can never get stuck, bouncing between a rock and a row of trees.)
          if (gameTime - (hardHits.get(sprite) || -Infinity) < 3) continue;
          if (hardHits.size > 30) hardHits.clear();
          hardHits.set(sprite, gameTime);
          crashDir = away;
          crashAt = gameTime;
          mySpeed *= size.rock ? RACE.rockHitSpeed : RACE.hardHitSpeed; // (a rock nearly stops me)
          me.y = Math.max(me.y - 250, Math.min(me.y, i * RACE.segmentLength - RACE.sledLength)); // (the nose stops AT the tree, not inside it)
          steerLimit = Math.max(steerLimit, RACE.hardHitTurn);
          mySteer = crashDir * RACE.hardHitTurn; // knocked round, away from it
          mySlide = crashDir * RACE.crashShove;
          carveTime = 0;
          playSound("clack");
          if (race3dAvailable()) race3dCrash(i, sprite.offset, crashDir, gameTime); // the tree shakes, snow bursts off it
          break;
        }
      }
    }
    if (gameTime - crashAt < RACE.crashShoveTime) me.x += crashDir * RACE.crashShove * dt;

    // Mountain goats wander about on the path. Bump into one and it is knocked flying (it
    // comes back later), and I am slowed down. (The referee tells the other phones.)
    me.air = myAir;
    for (const goat of TRACK.goats) {
      if (Math.abs(goat.z - me.y) > 3000) continue;
      const hit = goatHits.get(goat.id);
      if (hit && gameTime - hit.at < RACE.goatAway) continue; // (it is not there right now)
      if (!sledHitsGoat(me, goat, gameTime)) continue;
      goatSpot(goat, gameTime, GOAT);
      const dir = me.x >= GOAT.x ? -1 : 1; // it flies off to the side away from me
      goatHits.set(goat.id, { at: gameTime, dir, mine: true });
      mySpeed *= RACE.goatHitSpeed;
      carveTime = 0;
      softAt = gameTime;
      playSound("thump");
      playSound("bleat");
      sendToServer({ type: "goat", id: goat.id, dir });
    }

    // The mountains slide as the track turns.
    raceTurn += segment.curve * (mySpeed * dt / RACE.segmentLength) * 0.003;
    me.y += mySpeed * dt;

    // Jumps: riding off the top of a ramp throws the sled into the air, and gravity brings
    // it back down (sledFlight in race-track.js). Landing on the path = a little boost.
    // The last ramp throws it into the Kinneret: splash!
    flight.y = me.y; flight.x = me.x; flight.speed = mySpeed; flight.air = myAir; flight.vy = myVy;
    const flew = sledFlight(flight, oldY, oldX, dt);
    myAir = flight.air; myVy = flight.vy;
    if (flew === "launched") playSound("jump");
    if (me.y >= TRACK.waterZ && myAir === 0 && !inWater) {
      inWater = true;
      playSound("splash");
      if (race3dAvailable()) race3dSplash(me.y, me.x, true);
    } else if (flew === "landed") {
      playSound("land");
      if (race3dAvailable()) race3dSplash(me.y, me.x, false); // (a puff of snow)
    }

    // Snow spraying up from the runners when turning or in deep snow.
    // (This is the flat drawing's spray. In 3D the spray is real 3D snow: see race-3d.js.)
    if (!race3dAvailable() && !flying && !inWater && mySpeed > 1500 && (Math.abs(steer) > 0 || inDeepSnow) && snowPuffs.length < 60) {
      for (const side of [-1, 1]) {
        if (!inDeepSnow && side === Math.sign(steer)) continue; // turning: spray from the outside runner
        snowPuffs.push({
          x: side * mySledSize * (0.32 + Math.random() * 0.12), y: 0, // (in pixels from the middle of my sled)
          vx: side * (40 + Math.random() * 80) - steer * 60, vy: -(120 + Math.random() * 160),
          age: 0, life: 0.35 + Math.random() * 0.3, size: 3 + Math.random() * 5,
        });
      }
    }

    checkGates(me);
  }
  // Tell the referee where I am, 10 times a second.
  if (started && gameTime - lastRaceSend > RACE.sendEvery / 1000) {
    lastRaceSend = gameTime;
    sendToServer({ type: "move", x: me.x, y: me.y, speed: mySpeed, steer: mySteer, air: Math.round(myAir) });
  }

  // Countdown beeps: 3… 2… 1… Go!
  if (!started) {
    const left = Math.ceil(raceInfo.startAt - gameTime);
    if (left >= 1 && left <= RACE.countdown && left !== lastCountdown) {
      lastCountdown = left;
      playSound("tick");
    }
  } else if (lastCountdown !== 0 && gameTime - raceInfo.startAt < 1) {
    lastCountdown = 0;
    playSound("go");
  }

  // Just crossed the finish line? (The referee decides, and tells us my place.)
  if (me.finished && !myFinishedPlace) {
    myFinishedPlace = me.place;
    playSound(me.place === 1 ? "win" : "score");
  }
}

// ---------- Answer gates ----------
// When a gate comes into view, this phone picks a word from MY level (each phone asks its
// own questions, like the quiz popup): the English goes on the sign, and the right Hebrew
// plus 2 wrong ones go over the 3 lanes, in random order. Whichever lane I'm in when I
// pass under the gate is my answer. Right = a boost and a gift. Wrong = the gate bounces
// me back up the path to try again (the same question), until I get it right.

// The next gate ahead of distance y: { z (its distance along the race), gate }, or null.
function nextGateAhead(y) {
  for (const gate of TRACK.gates) {
    if (gate.z > y && gate.z > lastGateZ) return { z: gate.z, gate };
  }
  return null;
}

// Which lane a sideways spot is in at a gate: 0 = left, 1 = middle, 2 = right, -1 = not under the gate (off the path).
function laneAt(x, gate) {
  const across = (x - gate.center) / gate.half; // -1 = the gate's left pole, 1 = its right pole
  if (Math.abs(across) > 1) return -1;
  return Math.max(0, Math.min(2, Math.floor((across + 1) / 2 * 3)));
}

// Three answers: the right one and 2 wrong ones (the quiz's tricky wrong answers first).
function gateChoices(entry) {
  let others = [];
  try {
    others = buildChoices(entry).filter((hebrew) => hebrew !== entry.hebrew);
  } catch (error) {
    reportProblem(error);
  }
  if (others.length < 2) {
    const spare = shuffle(WORDS.map((w) => w.hebrew).filter((hebrew) => hebrew !== entry.hebrew));
    others = [...others, ...spare].slice(0, 2);
  }
  return shuffle([entry.hebrew, others[0], others[1]].filter(Boolean));
}

function checkGates(me) {
  // A gate is coming: put a question on it.
  if (!gateQuestion) {
    const next = nextGateAhead(me.y);
    if (next && next.z - me.y <= RACE.gateShowAt * RACE.segmentLength) {
      const entry = pickNextWord();
      gateQuestion = { z: next.z, gate: next.gate, entry, choices: gateChoices(entry), shownAt: gameTime, lane: laneAt(me.x, next.gate), settledAt: gameTime, tries: 0, wrong: [false, false, false] };
      gateFeedback = null; // (the new question replaces the last "Correct!")
      try { speakSteps([{ card: null, lines: [englishLine(entry)] }]); } catch (error) { reportProblem(error); }
    }
    return;
  }
  // Remember when I last changed lanes: that's how long I took to "answer" (for Auto levels).
  const lane = laneAt(me.x, gateQuestion.gate);
  if (lane !== gateQuestion.lane) {
    gateQuestion.lane = lane;
    gateQuestion.settledAt = gameTime;
  }
  if (me.y < gateQuestion.z || gameTime - bounceAt < RACE.gateBounceTime) return;

  // Passing under the gate: the lane I'm in is my answer.
  const { entry, choices, shownAt, settledAt, gate } = gateQuestion;
  const right = lane !== -1 && choices[lane] === entry.hebrew;
  // Only my FIRST try counts for my level and my word list (after that I already know one wrong answer).
  if (gateQuestion.tries === 0 && lane !== -1) {
    autoLevelAnswer(right, Math.max(0, settledAt - shownAt));
    recordAnswer(entry, right);
  }
  if (right) {
    // Through! A boost, and a gift (the referee picks which one; if my hands are full I keep what I have).
    lastGateZ = gateQuestion.z;
    gateQuestion = null;
    gateFeedback = { kind: "right", entry, until: gameTime + RACE.feedbackTime };
    boostUntil = gameTime + RACE.boostTime;
    sendToServer({ type: "gift", gate: gate.number });
    playSound("correct");
    playSound("boost");
    playSound("item");
    // Read the right Hebrew answer out loud.
    try { speakSteps([{ card: null, lines: [hebrewLine(entry)] }]); } catch (error) { reportProblem(error); }
    return;
  }
  // A wrong answer (or I went round the side of the gate): the gate BOUNCES me back up the
  // path, and I come down again for another try, with the same question, until I get it right.
  // (The answer I tried gets a ✗, so I don't pick it again.)
  gateQuestion.tries += 1;
  if (lane !== -1) gateQuestion.wrong[lane] = true;
  gateQuestion.settledAt = gameTime;
  gateFeedback = { kind: lane === -1 ? "missed" : "wrong", entry, until: gameTime + 1.6 };
  bounceAt = gameTime;
  bounceFrom = me.y;
  bounceTo = Math.max(TRACK.startZ, gate.z - RACE.gateBounce);
  mySpeed = 0;
  boostUntil = -Infinity;
  playSound("wrong");
  playSound("boing");
  // Say the English word again.
  try { speakSteps([{ card: null, lines: [englishLine(entry)] }]); } catch (error) { reportProblem(error); }
}

// Everyone in order: finished sleds by their place, then the rest by how far they've gone.
function raceOrder() {
  return Object.values(players).sort((a, b) => {
    if (a.finished || b.finished) return (a.finished ? a.place : Infinity) - (b.finished ? b.place : Infinity);
    return b.y - a.y;
  });
}

// ---------- Drawing ----------

function raceRender() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);

  const me = myPlayer();
  const racing = me && client.phase !== "lobby";
  // In the lobby (behind the room code), the camera just glides along the track.
  const myY = racing ? me.y : TRACK.startZ + (gameTime * 1500) % (TRACK.finishZ - TRACK.startZ);
  const myX = racing ? me.x : 0;

  // A little shake right after a crash.
  const sinceCrash = Math.max(0, Math.min(gameTime - crashAt, (gameTime - softAt) * 2 + 0.15)); // (a bush shakes the screen too, but less)
  const sinceBump = Math.max(0, gameTime - bumpAt);
  const shake = sinceCrash < 0.3 ? (1 - sinceCrash / 0.3) * 8 : 0;
  if (shake) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);

  const sleds = !racing ? [] : Object.values(players)
    .filter((p) => p.id !== client.myId)
    .map((p) => {
      const seen = otherSleds.get(p.id) || { air: 0, spinAt: -Infinity };
      return {
        id: p.id, y: p.y, x: p.x, color: p.color, name: p.name, turn: (p.steer || 0) * RACE.maxTurn, speed: Math.max(0, p.speed || 0) / RACE.maxSpeed,
        air: seen.air, spin: spinAngle(gameTime - seen.spinAt), float: p.y >= TRACK.waterZ && seen.air < 20,
        gas: (p.gasUntil || -Infinity) > gameTime,
      };
    });
  // The banana peels, mangoes and rimonim on the path.
  // (A mango or a thrown rimon flies fast, so between the referee's messages we move it along ourselves.)
  const things = (raceInfo.things || []).map((thing) => ({
    id: thing.id, kind: thing.kind, x: thing.x, air: thing.air || 0,
    y: thing.y + (thing.speed || 0) * Math.max(0, Math.min(0.2, gameTime - raceInfo.thingsAt)),
  }));
  // The mountain goats near me: walking about, or (just bumped) flying off through the air.
  for (const goat of racing ? TRACK.goats : []) {
    if (Math.abs(goat.z - myY) > 30000) continue;
    const hit = goatHits.get(goat.id);
    const since = hit ? gameTime - hit.at : Infinity;
    if (since >= 1.6 && since < RACE.goatAway) continue; // knocked away: it will wander back later
    if (since < 1.6) {
      goatSpot(goat, hit.at, GOAT);
      things.push({ id: "goat" + goat.id, kind: "goat", x: GOAT.x + hit.dir * since * 1.5, y: GOAT.z + since * 4500, air: Math.max(0, 2400 * since - 1500 * since * since), facing: hit.dir, tumble: since + 0.01, phase: goat.phase });
    } else {
      goatSpot(goat, gameTime, GOAT);
      things.push({ id: "goat" + goat.id, kind: "goat", x: GOAT.x, y: GOAT.z, air: 0, facing: GOAT.facing, tumble: 0, phase: goat.phase });
    }
  }
  const gate = racing && gateQuestion ? { number: gateQuestion.gate.number, english: gateQuestion.entry.english, choices: gateQuestion.choices, wrong: gateQuestion.wrong } : null;
  // (Bounced back by a gate: the sled hops through the air on the way.)
  const sinceBounce = gameTime - bounceAt;
  const hop = racing && sinceBounce >= 0 && sinceBounce < RACE.gateBounceTime ? Math.sin(sinceBounce / RACE.gateBounceTime * Math.PI) * 380 : 0;
  // The view turns (part of the way) with my sled, so the world swings round when I steer.
  // (In a skid the sled swings round a lot further than the view does.)
  const viewTurn = racing ? Math.max(-1.2, Math.min(1.2, mySteer)) * RACE.maxTurn * RACE.cameraTurn : 0;

  // Real 3D (race-3d.js) if this phone can do it: the world is drawn on the 3D canvas
  // behind this one, and this canvas only adds the snowflakes and the race info on top.
  const fraction = Math.max(0, mySpeed) / RACE.maxSpeed;
  let sledOnScreen = null;
  if (race3dAvailable()) {
    sledOnScreen = drawRace3d({
      along: myY, side: myX, turn: mySteer * RACE.maxTurn, viewTurn, racing, time: gameTime, gate,
      color: (me && me.color) || RACE.colors[0],
      sleds, things,
      air: racing ? myAir + hop : 0, spin: spinAngle(gameTime - spinAt), float: racing && inWater, // flying, spinning out, floating in the lake
      charge: 0,
      gas: racing && (me.gasUntil || -Infinity) > gameTime, // (gas is pouring out behind my sled)
      bounce: myAir > 0 || inWater ? 0 : inDeepSnow ? Math.sin(gameTime * 30) * 0.12 : Math.sin(gameTime * 18) * 0.03 * fraction,
      wobble: (sinceCrash < 0.7 ? Math.exp(-5 * sinceCrash) * Math.sin(sinceCrash * 24) * 0.3 * crashDir : 0) // rocking after a crash…
        + (sinceBump < 0.5 ? Math.exp(-7 * sinceBump) * Math.sin(sinceBump * 26) * 0.14 * bumpDir : 0),      // …and a little after bumping a sled
      speed: fraction, carve: myCarve, deep: inDeepSnow || mySkid, // (for the snow spray: a skid throws up lots of it)
      shake: shake / 8,
    }, w, h);
  }
  if (sledOnScreen) ctx.clearRect(-10, -10, w + 20, h + 20); // (see-through, so the 3D world shows)
  else {
    hideRace3d();
    drawRaceScene(ctx, w, h, { cameraZ: myY - raceCamera.playerZ, cameraX: myX, turn: raceTurn, viewTurn, time: gameTime, sleds, gate, things });
  }
  // Snow falling up high (it stops lower down, where the snow has melted).
  drawSnowfall(ctx, w, h, gameTime, findSegment(myY).snow, racing ? mySpeed / RACE.maxSpeed : 0.5, -viewTurn * w);
  if (!racing) return;
  // Gas from a sled just ahead of me: a thick cloud over everything (but not over the race info).
  const gas = gasAround(me);
  if (gas > 0) drawGas(ctx, w, h, gas);
  const boosting = gameTime < boostUntil;
  if (boosting) drawBoostLines(ctx, w, h, gameTime);

  // My sled, in the middle, where the track is under the camera. It bumps along in deep snow.
  // (On a sideways phone the screen is wide but short, so the sled is kept from getting too big.)
  // (In 3D the sled is part of the 3D world; here we only need to know where it is, for the snow spray.)
  const size = sledOnScreen ? sledOnScreen.size : Math.min(SLED_WIDTH * (raceCamera.depth / raceCamera.playerZ) * w / 2, h * 0.3);
  const bounce = inDeepSnow ? Math.sin(gameTime * 30) * size * 0.025 : Math.sin(gameTime * 18) * size * 0.006 * fraction;
  const bottom = sledOnScreen ? sledOnScreen.y : h * (RACE.horizon + 0.5) + bounce - (myAir + hop) * size / SLED_WIDTH; // (higher up the screen while flying)
  const middle = sledOnScreen ? sledOnScreen.x : w / 2;
  mySledSize = size;
  ctx.fillStyle = "#ffffff";
  for (const puff of snowPuffs) {
    ctx.globalAlpha = 1 - puff.age / puff.life;
    ctx.beginPath();
    ctx.arc(middle + puff.x, bottom - size * 0.05 + puff.y, puff.size * (1 + puff.age * 2), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  // (The sled points a bit further round than the view, so you can see it turning.)
  if (!sledOnScreen) drawSled(ctx, w / 2, bottom, size, me.color || RACE.colors[0], mySteer * RACE.maxTurn - viewTurn * 0.5 + spinAngle(gameTime - spinAt), gameTime, null);

  // The race info on top.
  const order = raceOrder();
  const started = gameTime >= raceInfo.startAt;
  const sinceStart = gameTime - raceInfo.startAt;
  drawRaceHud(ctx, w, h, {
    progress: {
      me: trackProgress(me.y),
      others: Object.values(players).filter((p) => p.id !== client.myId).map((p) => ({ at: trackProgress(p.y), color: p.color })),
    },
    place: order.indexOf(me) + 1,
    racers: order.length,
    kmh: Math.round(fraction * 90),
    countdown: !started ? Math.max(1, Math.ceil(raceInfo.startAt - gameTime)) : sinceStart < 0.8 ? "go" : null,
    finishedPlace: myFinishedPlace,
    deepSnow: inDeepSnow,
    showHint: !started || sinceStart < RACE.hintTime, // the "hold to turn / corner buttons to skid" circles
    skidding: mySkid,
    gate: gateQuestion ? {
      english: gateQuestion.entry.english, choices: gateQuestion.choices, myLane: laneAt(me.x, gateQuestion.gate),
      wrong: gateQuestion.wrong, // (the answers I already tried: they get a ✗)
      // Fully shown until the gate is 40 segments away, then fading to almost nothing at 12.
      fade: Math.max(0.12, Math.min(1, ((gateQuestion.z - me.y) / RACE.segmentLength - 12) / 28)),
    } : null,
    feedback: gateFeedback && gameTime < gateFeedback.until ? gateFeedback : null,
    boosting,
    flying: myAir > 120,
    spinning: gameTime - spinAt < RACE.spinTime,
    inWater,
  });
}

// ---------- Gas ----------
// A sled that uses the gas gift pours out a thick cloud for RACE.gasTime seconds. Everyone
// up to RACE.gasReach behind it is inside the cloud: the closer, the thicker.
// How thick the gas is around me right now: 0 = none … 1 = the thickest.
function gasAround(me) {
  let thick = 0;
  for (const other of Object.values(players)) {
    if (other.id === client.myId) continue;
    const left = (other.gasUntil || -Infinity) - gameTime; // how many more seconds it pours out
    const gap = other.y - me.y;                            // how far ahead of me that sled is
    if (left <= 0 || gap < -400 || gap > RACE.gasReach) continue;
    const near = Math.pow(1 - Math.max(0, gap) / RACE.gasReach, 0.6);
    thick = Math.max(thick, near * Math.min(1, left / 0.7, (RACE.gasTime - left) / 0.4)); // (it thickens and clears quickly, not in one jump)
  }
  return thick;
}

// The cloud itself: a murky green-grey over the whole view, with darker puffs drifting through it.
function drawGas(ctx, w, h, thick) {
  ctx.fillStyle = `rgba(150, 165, 118, ${RACE.gasThick * thick})`;
  ctx.fillRect(-10, -10, w + 20, h + 20);
  const size = Math.max(w, h) * 0.32;
  for (let k = 0; k < 8; k++) {
    const x = w * (0.5 + 0.55 * Math.sin(gameTime * 0.6 + k * 2.1)), y = h * (0.5 + 0.5 * Math.sin(gameTime * 0.8 + k * 1.3));
    const puff = ctx.createRadialGradient(x, y, 0, x, y, size);
    puff.addColorStop(0, `rgba(104, 122, 80, ${0.55 * thick})`);
    puff.addColorStop(1, "rgba(104, 122, 80, 0)");
    ctx.fillStyle = puff;
    ctx.fillRect(x - size, y - size, size * 2, size * 2);
  }
}

// ---------- The winner screen ----------

function formatRaceTime(seconds) {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function showRaceWinner() {
  const order = raceOrder();
  const winner = players[client.winner];
  if (winner) {
    setBilingual(document.getElementById("winner-title"), `🏆 1st place: ${winner.name}`, `🏆 מָקוֹם רִאשׁוֹן: ${winner.name}`);
  } else {
    setBilingual(document.getElementById("winner-title"), "⏱️ The race is over", "⏱️ הַמֵּרוֹץ נִגְמַר");
  }
  const medals = ["🥇", "🥈", "🥉"];
  const results = order.slice(0, 6).map((p, i) =>
    p.finished ? `${medals[i] || ordinal(i + 1)} ${p.name} ${formatRaceTime(p.finishTime)}` : `${p.name}: didn't finish`);
  setBilingual(document.getElementById("winner-score"), results.join(" · "), "הַתּוֹצָאוֹת");
  raceWinnerEl.hidden = false;
  // Confetti in snowy colors.
  const layer = document.getElementById("confetti");
  layer.innerHTML = "";
  const colors = ["#ffffff", "#bae6fd", "#60a5fa", "#facc15"];
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "%";
    piece.style.background = colors[i % colors.length];
    piece.style.animationDuration = 2 + Math.random() * 2.5 + "s";
    piece.style.animationDelay = Math.random() * 1.2 + "s";
    layer.appendChild(piece);
  }
}

// ---------- Answering game.js's questions ----------

function raceResetTimers() {
  crashAt = -Infinity;
  softAt = -Infinity;
  lastRaceSend = -Infinity;
  spinAt = -Infinity;
  itemUsedAt = -Infinity;
  for (const seen of otherSleds.values()) seen.spinAt = -Infinity;
  forgetGates();
}

// Forget the gate question, "Correct!" and any boost or bounce (a new race, or the clock jumped).
function forgetGates() {
  gateQuestion = null;
  gateFeedback = null;
  lastGateZ = -Infinity;
  boostUntil = -Infinity;
  bounceAt = -Infinity;
}

function raceClear() {
  hideRace3d(); // (the 3D canvas is only for the race)
  raceInfo = { startAt: Infinity, finishers: [] };
  mySpeed = 0;
  myFinishedPlace = 0;
  steerFingers.clear();
  skidFingers.clear();
  forgetGates();
  snowPuffs.length = 0;
  otherSleds.clear();
  myAir = 0;
  inWater = false;
  raceWinnerEl.hidden = true;
}

function raceApplySnapshot(snap) {
  if (!snap.race) return;
  raceInfo = snap.race;
  raceInfo.thingsAt = gameTime; // (when we heard where the mangoes are)
  // Goats that somebody else bumped: they fly off on this phone too (with a bleat, if it was near me).
  const me = myPlayer();
  for (const hit of raceInfo.goats || []) {
    const known = goatHits.get(hit.id);
    if (known && Math.abs(known.at - hit.at) < 3) continue;
    goatHits.set(hit.id, { at: hit.at, dir: hit.dir });
    const goat = TRACK.goats[hit.id];
    if (me && goat && gameTime - hit.at < 1) playSound("bleat", 0.7 * (1 - Math.abs(goat.z - me.y) / RACE.soundReach));
  }
}

function raceOnPhase(phase) {
  raceWinnerEl.hidden = true;
  if (phase === "playing") {
    mySpeed = 0;
    mySteer = 0;
    myCarve = 0;
    mySlide = 0;
    myAir = 0;
    myVy = 0;
    carveTime = 0;
    inWater = false;
    spinAt = -Infinity;
    itemUsedAt = -Infinity;
    lastItem = null;
    mySkid = false;
    lastSecret = null;
    hardHits.clear();
    steerLimit = 1;
    skidFingers.clear();
    softHits.clear();
    softAt = -Infinity;
    seenBooms.clear();
    goatHits.clear();
    for (const boom of raceInfo.booms || []) seenBooms.add(boom.id); // (not the bangs left over from the last race)
    otherSleds.clear();
    const me = myPlayer();
    mySpinCount = me ? me.spinCount || 0 : 0;
    bumpAt = -Infinity;
    crashAt = -Infinity;
    myFinishedPlace = 0;
    lastCountdown = null;
    inDeepSnow = false;
    forgetGates();
    steerFingers.clear();
    snowPuffs.length = 0;
  } else if (phase === "over") {
    steerFingers.clear();
    showRaceWinner();
  }
}

function raceUpdateHud(p, playing) {
  // The race draws its own info on the canvas, and steers without the joystick.
  hudEl.hidden = true;
  joystickBase.hidden = true;
  // The gift button: only while I'm holding a gift. (A rimon also gets the small "drop it" button.)
  const names = playing && p.item && gameTime - itemUsedAt > 0.5 ? ITEM_NAMES[p.item] : null;
  itemButton.hidden = !names;
  dropButton.hidden = !names || p.item !== "rimon";
  // The two skid buttons, in the bottom corners. (The one being held lights up.)
  const skid = playing ? skidInput() : 0;
  for (const side of [-1, 1]) {
    skidButtons[side].hidden = !playing;
    skidButtons[side].classList.toggle("held", skid === side);
  }
  if (names) {
    itemIcon.textContent = names.icon;
    setBilingual(itemLabel, names.en, names.he);
  }
}

PHONE_GAMES.race = {
  teams: false, // the lobby shows one list of racers, not blue and red teams
  startText: { en: "Start the race!", he: "מַתְחִילִים אֶת הַמֵּרוֹץ!" },
  resetTimers: raceResetTimers,
  clear: raceClear,
  onKey: (key) => { if (key === " ") useMyItem(); else if (key === "b") useMyItem("drop"); }, // Space = use my gift (throw a rimon); B = drop a rimon behind me
  applySnapshot: raceApplySnapshot,
  onEvent: () => {},
  onPhase: raceOnPhase,
  update: raceUpdate,
  render: raceRender,
  updateHud: raceUpdateHud,
};
