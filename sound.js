// sound.js — sound effects made with code. No sound files needed!
//
// The browser's "Web Audio" feature can play pure tones. Each sound below is a
// few tones: a starting pitch (frequency, in Hz), how long it lasts, and
// optionally a pitch it slides to. High numbers = high notes.

let audioCtx = null;
let muted = false;
try { muted = localStorage.getItem("golan-muted") === "1"; } catch {}

// Phones only allow sound after the player touches the screen, so we switch
// the audio on at the first touch or key press.
function unlockAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
}
window.addEventListener("pointerdown", unlockAudio);
window.addEventListener("keydown", unlockAudio);

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
  bump:    () => tone(90, 0.2, { type: "square", volume: 0.2 }),
};

function playSound(name) {
  if (SOUNDS[name]) SOUNDS[name]();
}

function toggleMute() {
  muted = !muted;
  try { localStorage.setItem("golan-muted", muted ? "1" : "0"); } catch {}
  return muted;
}
