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
  if (voices.length === 0) loadVoices(); // the list may have arrived late
  const codes = lang === "he" ? ["he", "iw"] : ["en"];
  const all = voices.filter((v) => {
    const code = v.lang.toLowerCase().replace("_", "-");
    return codes.some((c) => code === c || code.startsWith(c + "-"));
  });
  // Prefer voices that live ON the phone. Online voices can fail without a sound.
  const onPhone = all.filter((v) => v.localService);
  const matching = onPhone.length > 0 ? onPhone : all;
  if (lang === "en") {
    // Prefer the phone's usual English voice, then an American one.
    return matching.find((v) => v.default) || matching.find((v) => /en-us/i.test(v.lang)) || matching[0];
  }
  return matching[0];
}

// iPhones only allow talking after the first tap, so we say "nothing" at the first tap to unlock it.
// Phones only count the END of a tap (finger lifted) or a click, not the moment the finger lands,
// so we listen for those (the old version listened for the finger landing, which phones ignore).
let speechUnlocked = false;
function unlockSpeech() {
  if (speechUnlocked || !canSpeak) return;
  speechUnlocked = true;
  loadVoices(); // some phones only fill in the voice list after a tap
  const silent = new SpeechSynthesisUtterance(" ");
  silent.volume = 0;
  speechSynthesis.speak(silent);
}
for (const eventName of ["pointerup", "touchend", "click", "keydown"]) {
  window.addEventListener(eventName, unlockSpeech, true);
}

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
// Returns true if the voice was actually talking (so the next line should wait a bit longer).
function stopSpeech() {
  speechToken++;
  let wasTalking = false;
  // Only "cancel" when something is really being said or waiting to be said:
  // on Android, cancelling for no reason can make the NEXT line fail.
  if (canSpeak && (speechSynthesis.speaking || speechSynthesis.pending)) {
    speechSynthesis.cancel();
    wasTalking = true;
  }
  if (speechAudio) { speechAudio.pause(); speechAudio = null; }
  hideWordCard();
  return wasTalking;
}

// steps: a list of { card, lines }.
//   card  = a word to show at the top while its lines are read (or null for no card)
//   lines = what to say, in order: { text, lang: "en" or "he", file (optional recording) }
function speakSteps(steps) {
  const wasTalking = stopSpeech();
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

  // A pause first: phones (Android especially) fail on speech that starts right after a stop.
  setTimeout(next, wasTalking ? 250 : 60);
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

// Chrome on Android can throw away a line that's still being said (then the "done"
// signal never comes). Keeping the last few in this list stops that.
const liveUtterances = [];

// If the voice fails, show a small message saying why, so we can fix it.
// At most once for English and once for Hebrew (so it doesn't keep popping up).
const voiceProblemShown = {};
function reportVoiceProblem(why, line, voiceName) {
  if (voiceProblemShown[line.lang] || typeof showToast !== "function") return;
  voiceProblemShown[line.lang] = true;
  const language = line.lang === "he" ? "Hebrew" : "English";
  showToast(`🗣️ ${language} voice problem: ${why} · voice: ${voiceName || "phone's choice"} · voices: ${voices.length}`,
    line.lang === "he" ? "בְּעָיָה בַּקּוֹל בְּעִבְרִית" : "בְּעָיָה בַּקּוֹל בְּאַנְגְּלִית");
}

// Hebrew without the nikud dots (some phone voices choke on them).
function withoutNikud(text) {
  return text.replace(/[֑-ׇ]/g, "");
}

// Ask the built-in voice to say something. If it fails, try again in simpler ways:
//   try 0: our chosen voice
//   try 1: no chosen voice (the phone picks one for the language)
//   try 2: a moment later, phone's voice, normal speed, and Hebrew without nikud
// If all 3 fail, show a message with the reason.
function speakText(line, finish, attempt = 0) {
  const text = attempt >= 2 && line.lang === "he" ? withoutNikud(line.text) : line.text;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = line.lang === "he" ? "he-IL" : "en-US";
  const voice = attempt === 0 ? pickVoice(line.lang) : null;
  if (voice) utterance.voice = voice;
  utterance.rate = attempt >= 2 ? 1 : line.lang === "he" ? VOICE.hebrewRate : VOICE.englishRate;
  let started = false;
  const token = speechToken;
  let failed = false; // this try failed (a retry, if any, keeps its own watch)
  utterance.onstart = () => { started = true; };
  utterance.onend = finish;
  utterance.onerror = (event) => {
    failed = true;
    const why = event.error || "error";
    if (why === "interrupted" || why === "canceled") return finish(); // we stopped it ourselves: fine
    if (token !== speechToken) return;                                // something newer took over
    // "not-allowed" = the browser wants a tap first. Unlock again at the next tap.
    if (why === "not-allowed") {
      speechUnlocked = false;
    } else if (!started && attempt < 2) {
      // Try again in a simpler way (a short wait first helps Android).
      setTimeout(() => { if (token === speechToken) speakText(line, finish, attempt + 1); }, attempt === 0 ? 0 : 300);
      return;
    }
    reportVoiceProblem(why, line, voice && voice.name);
    finish();
  };
  liveUtterances.push(utterance);
  if (liveUtterances.length > 5) liveUtterances.shift();
  // Chrome sometimes gets stuck "paused" (after the phone sleeps or you switch apps). Unstick it.
  if (speechSynthesis.paused) speechSynthesis.resume();
  speechSynthesis.speak(utterance);
  // Nothing happened after 3 seconds? Say so (once).
  setTimeout(() => {
    if (!started && !failed && token === speechToken && voiceOn) {
      reportVoiceProblem(speechSynthesis.speaking ? "stuck" : "didn't start", line, voice && voice.name);
    }
  }, 3000);
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
