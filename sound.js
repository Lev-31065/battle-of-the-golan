// sound.js — sound effects made with code. No sound files needed!
//
// The browser's "Web Audio" feature can play pure tones. Each sound below is a
// few tones: a starting pitch (frequency, in Hz), how long it lasts, and
// optionally a pitch it slides to. High numbers = high notes.

let audioCtx = null;
let muted = false;
let loudness = 1; // how loud the sound being played right now is (1 = normal; less for things far away)
try { muted = localStorage.getItem("golan-muted") === "1"; } catch {}

// iPhones: tell the phone this page plays real sound (like a music app), so the
// sounds still play when the silent switch on the side of the phone is on.
// (Newer iPhones only. Other phones don't have this and simply skip it.)
try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch {}

// Phones only allow sound after the player taps the screen, so we switch the audio
// on at a tap. IMPORTANT: phones only count the END of a tap (finger lifted) or a
// click, not the moment the finger lands. So we listen for all of them, every time:
// the audio can also go to sleep again when you switch apps or lock the phone.
function unlockAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  // "suspended" = not allowed yet; "interrupted" = iPhones, after a phone call or switching apps.
  if (audioCtx && audioCtx.state !== "running") {
    audioCtx.resume();
    // Play one silent, tiny sound. Some iPhones only really wake up the audio after that.
    try {
      const buffer = audioCtx.createBuffer(1, 1, 22050);
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start(0);
    } catch {}
  }
}
for (const eventName of ["pointerdown", "pointerup", "touchend", "click", "keydown"]) {
  window.addEventListener(eventName, unlockAudio, true); // true = hear it before any button does
}

// Play one tone.
function tone(frequency, duration, { type = "sine", volume = 0.2, slideTo = null, delay = 0 } = {}) {
  if (muted || !audioCtx) return;
  const start = audioCtx.currentTime + delay;
  const oscillator = audioCtx.createOscillator(); // makes the sound wave
  const gain = audioCtx.createGain();             // controls the volume
  oscillator.type = type;                         // "sine" = smooth, "square" = buzzy, "triangle" = soft, "sawtooth" = harsh
  oscillator.frequency.setValueAtTime(frequency, start);
  if (slideTo) oscillator.frequency.exponentialRampToValueAtTime(slideTo, start + duration);
  gain.gain.setValueAtTime(Math.max(0.0011, volume * loudness), start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration); // fade out
  oscillator.connect(gain).connect(audioCtx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

// Play a soft burst of "noise" (a hiss, like snow or a thud), instead of a clear note.
// `from` → `to` = how bright the hiss is at the start and at the end (high = hissy, low = a dull thump).
let noiseBuffer = null;
function noise(duration, { volume = 0.2, from = 900, to = 150, delay = 0 } = {}) {
  if (muted || !audioCtx) return;
  if (!noiseBuffer) {
    // One second of random crackle, made once and reused.
    noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate, audioCtx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const start = audioCtx.currentTime + delay;
  const source = audioCtx.createBufferSource();
  source.buffer = noiseBuffer;
  source.loop = true;
  const filter = audioCtx.createBiquadFilter(); // lets only the low, soft part through
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(from, start);
  filter.frequency.exponentialRampToValueAtTime(Math.max(20, to), start + duration);
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(Math.max(0.0011, volume * loudness), start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration); // fade out
  source.connect(filter).connect(gain).connect(audioCtx.destination);
  source.start(start, Math.random() * 0.5);
  source.stop(start + duration + 0.02);
}

// Play several notes one after another, like a little tune.
function melody(notes, gap, options) {
  notes.forEach((frequency, i) => tone(frequency, gap * 1.6, { ...options, delay: i * gap }));
}

const SOUNDS = {
  swing:   () => tone(700, 0.15, { type: "triangle", slideTo: 150, volume: 0.15 }),
  hit:     () => tone(180, 0.18, { type: "square", slideTo: 60, volume: 0.18 }),
  ko:      () => tone(500, 0.5, { type: "sawtooth", slideTo: 50, volume: 0.15 }),
  correct: () => melody([660, 990], 0.1, { volume: 0.2 }),
  wrong:   () => tone(160, 0.35, { type: "square", volume: 0.1 }),
  grab:    () => melody([523, 659, 784], 0.07, { type: "triangle" }),
  score:   () => melody([523, 659, 784, 1047], 0.1, { type: "triangle", volume: 0.22 }),
  win:     () => melody([523, 659, 784, 1047, 784, 1047], 0.13, { type: "triangle", volume: 0.22 }),
  boost:   () => tone(300, 0.45, { type: "sawtooth", slideTo: 1200, volume: 0.1 }),
  bump:    () => tone(90, 0.2, { type: "square", volume: 0.2 }),          // walking into a rock
  crash:   () => { noise(0.4, { volume: 0.55, from: 1400, to: 110 }); tone(85, 0.28, { type: "sine", slideTo: 40, volume: 0.3 }); }, // a soft, snowy crash
  clack:   () => { tone(1250, 0.05, { type: "square", slideTo: 700, volume: 0.32 }); tone(820, 0.07, { type: "triangle", slideTo: 420, volume: 0.4, delay: 0.045 }); noise(0.09, { volume: 0.7, from: 6000, to: 1800 }); noise(0.3, { volume: 0.4, from: 1100, to: 120, delay: 0.03 }); tone(120, 0.22, { type: "sine", slideTo: 50, volume: 0.4 }); }, // a sled hitting a tree or a rock: a loud wooden CLACK
  poof:    () => { noise(0.45, { volume: 0.4, from: 2600, to: 300 }); noise(0.25, { volume: 0.3, from: 700, to: 120 }); }, // ploughing through a bush or a snowman: a puff of snow
  bleat:   () => { tone(520, 0.45, { type: "sawtooth", slideTo: 380, volume: 0.1 }); tone(535, 0.45, { type: "square", slideTo: 395, volume: 0.05, delay: 0.02 }); noise(0.2, { volume: 0.3, from: 900, to: 150 }); }, // bumping a mountain goat: thump, "meh-eh-eh!"
  boing:   () => { tone(180, 0.5, { type: "triangle", slideTo: 520, volume: 0.25 }); tone(90, 0.3, { type: "sine", slideTo: 60, volume: 0.3 }); }, // a wrong answer: the gate bounces you back
  thump:   () => { noise(0.2, { volume: 0.35, from: 800, to: 140 }); tone(105, 0.14, { type: "sine", slideTo: 60, volume: 0.18 }); }, // two sleds bumping
  skid:    () => noise(0.35, { volume: 0.14, from: 3200, to: 900 }),             // a sled starting to skid: a hiss of snow
  nudge:   () => tone(140, 0.08, { type: "sine", slideTo: 100, volume: 0.04 }), // bumping into a player (soft!)
  munch:   () => melody([520, 700], 0.05, { type: "triangle", volume: 0.07 }),  // eating berries
  throw:   () => tone(350, 0.14, { type: "triangle", slideTo: 900, volume: 0.09 }), // a whoosh (rock, ninja star)
  freeze:  () => melody([1500, 1150, 1800], 0.05, { type: "sine", volume: 0.1 }),  // icy tinkle: frozen by a rock
  boom:    () => { tone(110, 0.6, { type: "sawtooth", slideTo: 35, volume: 0.25 }); tone(70, 0.4, { type: "square", slideTo: 30, volume: 0.15 }); }, // pomegranate grenade
  plant:   () => melody([392, 523, 659], 0.06, { type: "triangle", volume: 0.12 }), // planting a tree
  tick:    () => tone(620, 0.16, { type: "sine", volume: 0.18 }),              // race countdown: 3… 2… 1…
  go:      () => tone(990, 0.45, { type: "sine", volume: 0.2 }),               // race countdown: Go!
  jump:    () => tone(260, 0.5, { type: "triangle", slideTo: 880, volume: 0.12 }),   // a sled flying off a ramp
  land:    () => tone(120, 0.16, { type: "sine", slideTo: 60, volume: 0.25 }),       // …and coming down: a soft thump
  splash:  () => { tone(900, 0.5, { type: "sawtooth", slideTo: 90, volume: 0.12 }); tone(1400, 0.7, { type: "triangle", slideTo: 200, volume: 0.1, delay: 0.05 }); tone(70, 0.5, { type: "sine", slideTo: 40, volume: 0.3 }); }, // into the Kinneret!
  item:    () => melody([784, 988, 1175, 1568], 0.06, { type: "triangle", volume: 0.14 }), // driving through a gift box
  spin:    () => { noise(0.3, { volume: 0.4, from: 1200, to: 150 }); noise(0.7, { volume: 0.16, from: 2600, to: 400, delay: 0.1 }); tone(420, 0.6, { type: "sine", slideTo: 140, volume: 0.08 }); }, // hit by a banana peel, a mango or a rimon: a soft thud, then sliding round on the snow
};

// loud: 1 = normal (the usual), less = quieter (something far away).
function playSound(name, loud = 1) {
  if (!SOUNDS[name] || loud <= 0) return;
  loudness = Math.min(1, loud);
  try { SOUNDS[name](); } finally { loudness = 1; }
}

function toggleMute() {
  muted = !muted;
  try { localStorage.setItem("golan-muted", muted ? "1" : "0"); } catch {}
  return muted;
}
