// sound.js — sound effects made with code. No sound files needed!
//
// The browser's "Web Audio" feature can play pure tones. Each sound below is a
// few tones: a starting pitch (frequency, in Hz), how long it lasts, and
// optionally a pitch it slides to. High numbers = high notes.

let audioCtx = null;
let muted = false;
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
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration); // fade out
  oscillator.connect(gain).connect(audioCtx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
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
  nudge:   () => tone(140, 0.08, { type: "sine", slideTo: 100, volume: 0.04 }), // bumping into a player (soft!)
  munch:   () => melody([520, 700], 0.05, { type: "triangle", volume: 0.07 }),  // eating berries
  throw:   () => tone(350, 0.14, { type: "triangle", slideTo: 900, volume: 0.09 }), // a whoosh (rock, ninja star)
  freeze:  () => melody([1500, 1150, 1800], 0.05, { type: "sine", volume: 0.1 }),  // icy tinkle: frozen by a rock
  boom:    () => { tone(110, 0.6, { type: "sawtooth", slideTo: 35, volume: 0.25 }); tone(70, 0.4, { type: "square", slideTo: 30, volume: 0.15 }); }, // pomegranate grenade
  plant:   () => melody([392, 523, 659], 0.06, { type: "triangle", volume: 0.12 }), // planting a tree
  tick:    () => tone(620, 0.16, { type: "sine", volume: 0.18 }),              // race countdown: 3… 2… 1…
  go:      () => tone(990, 0.45, { type: "sine", volume: 0.2 }),               // race countdown: Go!
};

function playSound(name) {
  if (SOUNDS[name]) SOUNDS[name]();
}

function toggleMute() {
  muted = !muted;
  try { localStorage.setItem("golan-muted", muted ? "1" : "0"); } catch {}
  return muted;
}
