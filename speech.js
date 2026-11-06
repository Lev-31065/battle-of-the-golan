// speech.js — the game reads words out loud, in English and in Hebrew.
//
// It uses the phone's own built-in voice (the browser's "Web Speech" feature),
// so there are no sound files to download. How good the Hebrew sounds depends
// on the phone: iPhones have a Hebrew voice built in, most Android phones get
// one from Google, and some computers have none at all.
//
// RECORDINGS (optional, for later): if a word in words.js has an "audio" line,
// like  { english: "dog", hebrew: "כֶּלֶב", audio: "audio/dog.mp3" },
// the game plays that recording for the Hebrew instead of the built-in voice.
//
// It also shows the "word card" at the top of the screen: the English word with
// the Hebrew underneath, while that pair is being read out loud.
//
// Other code uses it like this:
//     speakSteps([ { card: entry, lines: [ { text: "dog", lang: "en" }, ... ] } ]);
//     stopSpeech();   // go quiet right now (for example, when a new question opens)

let voiceOn = true;
try { voiceOn = localStorage.getItem("golan-voice") !== "0"; } catch {}

// Does this browser know how to talk at all?
const canSpeak = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

// The list of voices loads a moment after the page does, so we grab it when it's ready.
let voices = [];
function loadVoices() { if (canSpeak) voices = speechSynthesis.getVoices(); }
if (canSpeak) {
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
}

// Find a voice for a language. "he" = Hebrew (some older Androids call it "iw"), "en" = English.
function pickVoice(lang) {
  const codes = lang === "he" ? ["he", "iw"] : ["en"];
  const matching = voices.filter((v) => {
    const code = v.lang.toLowerCase().replace("_", "-");
    return codes.some((c) => code === c || code.startsWith(c + "-"));
  });
  if (lang === "en") {
    // Prefer the phone's usual English voice, then an American one.
    return matching.find((v) => v.default) || matching.find((v) => /en-us/i.test(v.lang)) || matching[0];
  }
  return matching[0];
}

// iPhones only allow talking after the first touch, so we say "nothing" at the first touch to unlock it.
let speechUnlocked = false;
function unlockSpeech() {
  if (speechUnlocked || !canSpeak) return;
  speechUnlocked = true;
  const silent = new SpeechSynthesisUtterance(" ");
  silent.volume = 0;
  speechSynthesis.speak(silent);
}
window.addEventListener("pointerdown", unlockSpeech);
window.addEventListener("keydown", unlockSpeech);

// ---------- The word card at the top of the screen ----------

const wordCardEl = document.getElementById("word-card");
const wordCardEnglish = document.getElementById("word-card-english");
const wordCardHebrew = document.getElementById("word-card-hebrew");

function showWordCard(entry) {
  wordCardEnglish.textContent = entry.english;
  wordCardHebrew.textContent = entry.hebrew;
  wordCardEl.hidden = false;
}
function hideWordCard() {
  wordCardEl.hidden = true;
}

// ---------- Playing a list of things to say ----------

// Every time we start or stop, this number goes up. Old, unfinished speech checks
// the number, sees it's out of date, and quietly gives up. That's how "stop" works.
let speechToken = 0;
let speechAudio = null;  // a recording that's playing right now (if any)

// Go quiet right away and hide the word card.
function stopSpeech() {
  speechToken++;
  if (canSpeak) speechSynthesis.cancel();
  if (speechAudio) { speechAudio.pause(); speechAudio = null; }
  hideWordCard();
}

// steps: a list of { card, lines }.
//   card  = a word to show at the top while its lines are read (or null for no card)
//   lines = what to say, in order: { text, lang: "en" or "he", file (optional recording) }
function speakSteps(steps) {
  stopSpeech();
  const token = speechToken;
  let stepIndex = 0;
  let lineIndex = 0;

  function next() {
    if (token !== speechToken) return; // something newer took over, so stop here
    if (stepIndex >= steps.length) {
      // All done. Leave the last card up for a moment, then hide it.
      setTimeout(() => { if (token === speechToken) hideWordCard(); }, VOICE.cardLingerTime * 1000);
      return;
    }
    const step = steps[stepIndex];
    if (lineIndex === 0) {
      if (step.card) showWordCard(step.card);
      else hideWordCard();
    }
    if (lineIndex >= step.lines.length) {
      stepIndex++;
      lineIndex = 0;
      return next();
    }
    sayLine(step.lines[lineIndex++], token, next);
  }

  // A tiny pause first: some browsers drop speech that starts right after a stop.
  setTimeout(next, 60);
}

// Say one line, then call done() when it's finished.
function sayLine(line, token, done) {
  let finished = false;
  const finish = () => {
    if (finished || token !== speechToken) return;
    finished = true;
    setTimeout(done, VOICE.gapBetweenLines * 1000);
  };

  // Voice switched off (or the phone can't talk)? Just leave the card up for a moment.
  if (!voiceOn || (!canSpeak && !line.file)) {
    setTimeout(finish, VOICE.silentLineTime * 1000);
    return;
  }

  // Safety net: some phones forget to say when they're done talking, so we
  // move on anyway after a while (longer text gets more time).
  setTimeout(finish, 2500 + line.text.length * 150);

  if (line.file) {
    speechAudio = new Audio(line.file);
    speechAudio.onended = finish;
    // If the recording is missing or won't play, use the built-in voice instead.
    const useVoiceInstead = () => { if (token === speechToken && canSpeak) speakText(line, finish); };
    speechAudio.onerror = useVoiceInstead;
    speechAudio.play().catch(useVoiceInstead);
    return;
  }
  speakText(line, finish);
}

// Ask the built-in voice to say something.
function speakText(line, finish) {
  const utterance = new SpeechSynthesisUtterance(line.text);
  utterance.lang = line.lang === "he" ? "he-IL" : "en-US";
  const voice = pickVoice(line.lang);
  if (voice) utterance.voice = voice;
  utterance.rate = line.lang === "he" ? VOICE.hebrewRate : VOICE.englishRate;
  utterance.onend = finish;
  utterance.onerror = finish;
  speechSynthesis.speak(utterance);
}

// Small helpers so other files don't have to build the lines by hand.
function englishLine(entry) { return { text: entry.english, lang: "en" }; }
function hebrewLine(entry) { return { text: entry.hebrew, lang: "he", file: entry.audio }; }

// The 🗣️ button: voice on or off.
function toggleVoice() {
  voiceOn = !voiceOn;
  try { localStorage.setItem("golan-voice", voiceOn ? "1" : "0"); } catch {}
  if (!voiceOn && canSpeak) speechSynthesis.cancel();
  return voiceOn;
}
