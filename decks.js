// decks.js — the Teacher dashboard: host a class game, and make, change and
// delete your own word lists ("My decks").
//
// A class game = a room where the host (the teacher) picks the words for everyone.
// The dashboard is free for now; later it will need a paid account.
//
// Only for logged-in players (the decks are saved in the account, in Supabase's
// "decks" table, which already exists — see supabase/setup.sql).
//
// It's written for Hebrew-speaking (ulpan) teachers: the page is Hebrew-first,
// and each line is HEBREW = ENGLISH, typed right-to-left.
//
// How a teacher uses it:
//   1. Log in → 🎓 Teacher dashboard → ➕ New deck.
//   2. Type a name, and one word per line, like:   כֶּלֶב = dog
//   3. Save. Then 🏫 Host a class game: the deck shows up in the lobby's word list
//      under "My decks". The host's phone sends the words to everyone's phone.
//
// Also accepted: a TAB instead of "=" (so you can paste two columns from a
// spreadsheet), and English first (whichever side has Hebrew letters is the Hebrew).

const decksEl = document.getElementById("decks");
const decksListView = document.getElementById("decks-list-view");
const decksList = document.getElementById("decks-list");
const decksStatus = document.getElementById("decks-status");
const deckEditor = document.getElementById("deck-editor");
const deckEditorTitle = document.getElementById("deck-editor-title");
const deckNameInput = document.getElementById("deck-name");
const wordRows = document.getElementById("word-rows");
const deckCount = document.getElementById("deck-count");
const deckMessage = document.getElementById("deck-message");
const deckSaveButton = document.getElementById("deck-save");
const deckDeleteButton = document.getElementById("deck-delete");

let myDeckIds = [];        // ids of MY decks, newest first (the decks themselves are in customDecks, words.js)
let editingDeckId = null;  // the deck being changed (null = making a new one)
let deleteArmedUntil = 0;  // "tap again to delete" lasts until this time (ms)

function isMyDeck(deckId) {
  return myDeckIds.includes(deckId);
}

// ---------- Loading my decks from the account ----------

// account.js calls this whenever someone logs in or out.
async function loadMyDecks() {
  // Forget the old list first (for example, after logging out).
  for (const id of myDeckIds) customDecks.delete(id);
  myDeckIds = [];
  if (!supa || !account.user) {
    renderDeckList();
    if (typeof refreshDeckOptions === "function") refreshDeckOptions();
    return;
  }
  setBilingual(decksStatus, "Loading your decks…", "טוֹעֲנִים אֶת הַחֲפִיסוֹת…");
  const userId = account.user.id;
  const { data, error } = await supa.from("decks")
    .select("id, name, words, updated_at")
    .order("updated_at", { ascending: false });
  if (!account.user || account.user.id !== userId) return; // logged out while we were waiting
  if (error) {
    console.warn("Couldn't load decks:", error.message);
    setBilingual(decksStatus, "Couldn't load your decks. Check your internet.", "לֹא הִצְלַחְנוּ לִטְעֹן אֶת הַחֲפִיסוֹת. בּוֹדְקִים אֶת הַחִבּוּר לָאִינְטֶרְנֶט.");
    return;
  }
  for (const row of data) {
    const deck = registerCustomDeck(CUSTOM_PREFIX + row.id, row.name, row.words);
    myDeckIds.push(deck.id);
  }
  renderDeckList();
  if (typeof refreshDeckOptions === "function") refreshDeckOptions(); // the lobby's word list
}

// ---------- The list ----------

// ---------- Picking the words for the class game ----------
// The teacher clicks a deck in one of the 3 columns. It's remembered on this computer
// ("golan-deck-v2"), and "Host a class game" starts with it.

// The picked deck, if it's still allowed (one of my decks might have been deleted).
function teacherPickId() {
  let id = AUTO;
  try { id = localStorage.getItem("golan-deck-v2") || AUTO; } catch {}
  if (id === AUTO) return AUTO;
  const deck = findDeck(id);
  if (!deck) return AUTO;
  if (deck.custom && !isMyDeck(id)) return AUTO;
  return isDeckChoice(id) ? id : AUTO;
}

function setTeacherPick(id) {
  try { localStorage.setItem("golan-deck-v2", id); } catch {}
  renderDeckList();
}

// % mastery of a deck: how many of its words YOU know well (right 3 times in a row,
// the same rule as the lobby and home screen), out of all its words. Uses deckProgress (progress.js).
function makeMastery(deck) {
  const { known, total } = deckProgress(deck);
  const percent = total > 0 ? Math.round((known / total) * 100) : 0;
  const box = document.createElement("span");
  box.className = "deck-mastery" + (percent >= 100 ? " full" : "");
  box.title = `You know ${known} of ${total} words well (right 3 times in a row) · אַתֶּם יוֹדְעִים ${known} מִתּוֹךְ ${total} מִלִּים`;
  const bar = document.createElement("span");
  bar.className = "mastery-bar";
  const fill = document.createElement("i");
  fill.style.width = percent + "%";
  bar.appendChild(fill);
  const number = document.createElement("b");
  number.textContent = percent + "%";
  box.append(bar, number);
  return box;
}

// One clickable row. english/hebrew = the two lines; detail = small gray text on the right.
// deck (optional) = show your % mastery of it.
function makePickRow(id, english, hebrew, detail, detailHe, deck = null) {
  const row = document.createElement("button");
  row.type = "button";
  row.className = "deck-row" + (id === teacherPickId() ? " picked" : "");
  const name = document.createElement("span");
  name.className = "deck-row-name";
  setBilingual(name, english, hebrew); // (setBilingual uses textContent: typed names can't break the page)
  row.appendChild(name);
  if (detail || deck) {
    const right = document.createElement("span");
    right.className = "deck-row-right";
    if (deck) right.appendChild(makeMastery(deck));
    if (detail) {
      const count = document.createElement("span");
      count.className = "deck-row-count";
      setBilingual(count, detail, detailHe);
      right.appendChild(count);
    }
    row.appendChild(right);
  }
  row.addEventListener("click", () => setTeacherPick(id));
  return row;
}

function renderDeckList() {
  // Column 1: my own decks. Each has a ✏️ button to change it.
  decksList.innerHTML = "";
  for (const id of myDeckIds) {
    const deck = customDecks.get(id);
    if (!deck) continue;
    const line = document.createElement("div");
    line.className = "deck-line";
    const n = deck.words.length;
    const row = makePickRow(id, deck.english, "", `${n} words`, `${n} מִלִּים`, deck);
    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "deck-edit";
    edit.textContent = "✏️";
    edit.title = "Edit · עֲרִיכָה";
    edit.setAttribute("aria-label", "Edit deck");
    edit.addEventListener("click", () => openDeckEditor(id));
    line.append(row, edit);
    decksList.appendChild(line);
  }

  // Column 2: the premade decks: theme decks, then root decks, each under a small heading.
  const premadeList = document.getElementById("premade-list");
  premadeList.innerHTML = "";
  const premadeHeadings = {
    theme: ["Themes", "נוֹשְׂאִים"],
    root: ["Verb roots: what comes after the verb", "שָׁרָשִׁים: מָה בָּא אַחֲרֵי הַפֹּעַל"],
    conj: ["Verb roots: past & future", "שָׁרָשִׁים: עָבָר וְעָתִיד"],
    tense: ["Big decks: one tense, many verbs", "חֲפִיסוֹת גְּדוֹלוֹת: זְמַן אֶחָד, הַרְבֵּה פְּעָלִים"],
  };
  let lastKind = null;
  // Each has a 📋 button: "copy & edit" makes it one of MY decks, which I can change.
  for (const deck of TOPIC_DECKS) {
    if (deck.kind !== lastKind && premadeHeadings[deck.kind]) {
      const heading = document.createElement("p");
      heading.className = "premade-subheading";
      setBilingual(heading, ...premadeHeadings[deck.kind]);
      premadeList.appendChild(heading);
    }
    lastKind = deck.kind;
    const n = deck.words.length;
    const line = document.createElement("div");
    line.className = "deck-line";
    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "deck-edit";
    copy.textContent = "📋";
    copy.title = "Copy & edit · הַעְתָּקָה וַעֲרִיכָה";
    copy.setAttribute("aria-label", "Copy and edit this deck");
    copy.addEventListener("click", () => openDeckEditor(null, deck));
    line.append(makePickRow(deck.id, deck.english, deck.hebrew, `${n} words`, `${n} מִלִּים`, deck), copy);
    premadeList.appendChild(line);
  }

  // Column 3: Auto, then every level.
  const levelsList = document.getElementById("levels-list");
  levelsList.innerHTML = "";
  levelsList.appendChild(makePickRow(AUTO, "🤖 Auto: a level for each player", "אוֹטוֹמָטִי: רָמָה אִישִׁית"));
  for (const deck of DECKS) {
    levelsList.appendChild(makePickRow(deck.id, `${deck.number} · ${deck.english}`, `${deck.numberHe} · ${deck.hebrew}`, "", "", deck));
  }

  // Under the Host button: what the class will play.
  const picked = teacherPickId();
  const pickEl = document.getElementById("teacher-pick");
  if (picked === AUTO) {
    setBilingual(pickEl, "Words: 🤖 Auto (each student plays their own level)", "מִלִּים: אוֹטוֹמָטִי (כָּל תַּלְמִיד בָּרָמָה שֶׁלּוֹ)");
  } else {
    const deck = findDeck(picked);
    const hebrewName = deck.custom ? `📚 ${deck.english}` : deck.topic ? `${deck.numberHe} ${deck.hebrew}` : `${deck.numberHe} · ${deck.hebrew}`;
    setBilingual(pickEl, `Words: ${deckLabel(deck)}`, `מִלִּים: ${hebrewName}`);
  }

  if (myDeckIds.length === 0) {
    setBilingual(decksStatus, "No decks yet. Tap “New deck” to make one.", "עֲדַיִן אֵין חֲפִיסוֹת. לוֹחֲצִים עַל ״חֲפִיסָה חֲדָשָׁה״.");
  } else {
    setBilingual(decksStatus, "");
  }
}

function showDeckList() {
  deckEditor.hidden = true;
  decksListView.hidden = false;
  renderDeckList();
}

document.getElementById("teacher-button").addEventListener("click", () => {
  showDeckList();
  showScreen("decks");
  loadMyDecks(); // fresh copy (maybe you changed a deck on another phone)
});

// "Host a class game": go to the play screen in class-game mode (game.js).
document.getElementById("class-game-button").addEventListener("click", () => openPlayScreen(true));

document.getElementById("decks-back").addEventListener("click", () => {
  if (!deckEditor.hidden) showDeckList(); // from the editor → back to the list
  else showScreen("home");
});

document.getElementById("new-deck-button").addEventListener("click", () => openDeckEditor(null));

// ---------- The words table ----------
// Each row of the table is one word: Hebrew | English | wrong answers (➕) | 🗑.
// The rows live in the page itself (no separate list): to save, we read them back.

const HEBREW_LETTERS = /[֐-׿]/; // the range of Hebrew letters and nikud in Unicode

// A small text box (used for the Hebrew, the English and each wrong answer).
function makeBox(className, value, dir, placeholder) {
  const box = document.createElement("input");
  box.className = className;
  box.value = value || "";
  box.dir = dir;
  box.autocomplete = "off";
  box.spellcheck = false;
  box.maxLength = DECK_LIMITS.maxTextLength;
  if (placeholder) box.placeholder = placeholder;
  return box;
}

// One wrong answer: a little tag you can type in, with ✕ to remove it.
function addWrongAnswer(row, text, focus) {
  const list = row.querySelector(".wrong-list");
  if (list.children.length >= DECK_LIMITS.maxWrong) return;
  const chip = document.createElement("span");
  chip.className = "wrong-chip";
  const box = makeBox("wrong-input", text, "rtl", "תְּשׁוּבָה שְׁגוּיָה");
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "wrong-remove";
  remove.textContent = "✕";
  remove.setAttribute("aria-label", "Remove wrong answer");
  remove.addEventListener("click", () => { chip.remove(); updateRowExtras(row); });
  chip.append(box, remove);
  list.appendChild(chip);
  updateRowExtras(row);
  if (focus) box.focus();
}

// Hide ➕ when a word already has the most wrong answers allowed.
function updateRowExtras(row) {
  const full = row.querySelector(".wrong-list").children.length >= DECK_LIMITS.maxWrong;
  row.querySelector(".add-wrong").hidden = full;
}

// Add a row to the table. word = { hebrew, english, wrong, f } (all optional).
// after = put it right after this row (otherwise at the end).
function addWordRow(word = {}, after = null) {
  const row = document.createElement("div");
  row.className = "word-row";
  const number = document.createElement("span");
  number.className = "word-num";
  const hebrew = makeBox("word-he", word.hebrew, "rtl", "לְמָשָׁל: כֶּלֶב");
  hebrew.lang = "he";
  const english = makeBox("word-en", word.english, "ltr", "e.g. dog");
  // The wrong answers, and the ➕ that adds one.
  const wrongCell = document.createElement("div");
  wrongCell.className = "wrong-cell";
  const wrongList = document.createElement("span");
  wrongList.className = "wrong-list";
  const addWrong = document.createElement("button");
  addWrong.type = "button";
  addWrong.className = "add-wrong";
  addWrong.textContent = "➕";
  addWrong.title = "Add a wrong answer · הוֹסָפַת תְּשׁוּבָה שְׁגוּיָה";
  addWrong.setAttribute("aria-label", "Add a wrong answer");
  addWrong.addEventListener("click", () => addWrongAnswer(row, "", true));
  wrongCell.append(wrongList, addWrong);
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "word-delete";
  remove.textContent = "🗑️";
  remove.title = "Delete this word · מְחִיקַת הַמִּלָּה";
  remove.setAttribute("aria-label", "Delete this word");
  remove.addEventListener("click", () => {
    row.remove();
    if (wordRows.children.length === 0) addWordRow();
    renumberRows();
  });
  row.append(number, hebrew, english, wrongCell, remove);

  // A word copied from a premade deck may have a feminine version ("I"/"we" sentences).
  // We keep it as long as the Hebrew isn't changed, and show a small tag so the teacher knows.
  if (word.f) {
    row.feminine = { hebrew: word.f.hebrew, wrong: word.f.wrong || [], forHebrew: word.hebrew };
    const tag = document.createElement("span");
    tag.className = "fem-tag";
    tag.textContent = "♀";
    tag.title = `Feminine version · לְשׁוֹן נְקֵבָה: ${word.f.hebrew}`;
    wrongCell.appendChild(tag);
  }

  if (after && after.nextSibling) wordRows.insertBefore(row, after.nextSibling);
  else wordRows.appendChild(row);
  for (const text of word.wrong || []) addWrongAnswer(row, text, false);
  updateRowExtras(row);
  renumberRows();
  return row;
}

function renumberRows() {
  [...wordRows.children].forEach((row, index) => {
    row.querySelector(".word-num").textContent = index + 1;
  });
  updateDeckCount();
}

// Read the table back into a word list. Rows with nothing typed are skipped.
// problems = row numbers that have only one side (Hebrew without English, or the other way).
function readWordRows() {
  const words = [];
  const problems = [];
  const seen = new Set();
  [...wordRows.children].forEach((row, index) => {
    let hebrew = row.querySelector(".word-he").value.trim();
    let english = row.querySelector(".word-en").value.trim();
    const filled = Boolean(hebrew || english);
    const bad = filled && (!hebrew || !english);
    row.classList.toggle("problem", bad);
    if (!filled) return;
    if (bad) { problems.push(index + 1); return; }
    // Typed the English in the Hebrew box (and the other way around)? Swap them.
    if (!HEBREW_LETTERS.test(hebrew) && HEBREW_LETTERS.test(english)) [english, hebrew] = [hebrew, english];
    const key = english + "|" + hebrew;
    if (seen.has(key)) return; // the same word twice: keep one
    seen.add(key);
    const word = { english, hebrew };
    const wrong = cleanWrongAnswers([...row.querySelectorAll(".wrong-input")].map((box) => box.value), hebrew);
    if (wrong.length > 0) word.wrong = wrong;
    if (row.feminine && row.feminine.forHebrew === hebrew) {
      word.f = { hebrew: row.feminine.hebrew, wrong: row.feminine.wrong };
    }
    words.push(word);
  });
  return { words, problems };
}

// Pasted text from a spreadsheet or a list: one word per line.
// A line is "hebrew = english | wrong | wrong", or columns separated by tabs:
// Hebrew, English, then any extra columns are wrong answers.
function parsePastedWords(text) {
  const words = [];
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    let parts;
    if (line.includes("\t")) {
      parts = line.split("\t");
    } else if (line.includes("=")) {
      const [pair, ...wrong] = line.split("|");
      const at = pair.indexOf("=");
      parts = [pair.slice(0, at), pair.slice(at + 1), ...wrong];
    } else {
      parts = [line];
    }
    parts = parts.map((part) => part.trim());
    let [hebrew = "", english = "", ...wrong] = parts;
    // English first? (Only the second part has Hebrew letters.) Swap them.
    if (!HEBREW_LETTERS.test(hebrew) && HEBREW_LETTERS.test(english)) [english, hebrew] = [hebrew, english];
    words.push({ hebrew, english, wrong: wrong.filter(Boolean) });
  }
  return words;
}

// Pasting several lines (or columns) into a box fills in several rows at once.
wordRows.addEventListener("paste", (event) => {
  const box = event.target;
  if (!box.classList.contains("word-he") && !box.classList.contains("word-en")) return;
  const text = (event.clipboardData || window.clipboardData).getData("text");
  if (!/[\n\t]/.test(text.trim())) return; // just one word: paste it normally
  event.preventDefault();
  let row = box.closest(".word-row");
  parsePastedWords(text).forEach((word, index) => {
    const rowIsEmpty = !row.querySelector(".word-he").value.trim() && !row.querySelector(".word-en").value.trim();
    if (index === 0 && rowIsEmpty) {
      // Fill the row you pasted into.
      row.querySelector(".word-he").value = word.hebrew;
      row.querySelector(".word-en").value = word.english;
      for (const wrong of word.wrong) addWrongAnswer(row, wrong, false);
    } else {
      row = addWordRow(word, row);
    }
  });
  // Too many rows for a deck? Remove the extras from the end.
  while (wordRows.children.length > DECK_LIMITS.maxWords) wordRows.lastChild.remove();
  renumberRows();
  autoTranslateEmptyRows(); // pasted Hebrew without English? Fill it in.
});

// Enter moves along, like a spreadsheet: Hebrew → English → next row's Hebrew
// (adding a new row at the end). In a wrong answer, Enter adds another one.
wordRows.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || event.isComposing) return;
  const box = event.target;
  const row = box.closest(".word-row");
  if (!row || box.tagName !== "INPUT") return;
  event.preventDefault();
  if (box.classList.contains("word-he")) {
    row.querySelector(".word-en").focus();
  } else if (box.classList.contains("word-en")) {
    let next = row.nextElementSibling;
    if (!next && wordRows.children.length < DECK_LIMITS.maxWords) next = addWordRow();
    if (next) next.querySelector(".word-he").focus();
  } else if (box.classList.contains("wrong-input")) {
    if (box.value.trim()) addWrongAnswer(row, "", true);
  }
});

wordRows.addEventListener("input", (event) => {
  // Typing in an English box makes it yours: it's no longer an auto-translation.
  if (event.target.classList.contains("word-en")) markAutoTranslated(event.target, false);
  updateDeckCount();
});

// ---------- Auto-translate (Hebrew → English) ----------
// When you leave a Hebrew box, an EMPTY English box next to it fills itself in,
// using MyMemory (settings in TRANSLATE, rules.js). It never replaces English you typed.
// Auto-filled English is light purple until you change it, as a reminder to check it.

const translations = new Map(); // Hebrew → English, so the same word isn't asked twice
let translateResting = false;   // true after the free daily limit runs out (until the page reloads)

// Ask MyMemory. Returns the English, or null if it didn't work (no internet, limit reached…).
// (We send the Hebrew exactly as typed: removing the nikud gave worse answers,
// because "שֻׁלְחָן" without nikud is "שלחן", which came back as "desktop".)
async function translateHebrew(hebrew) {
  const plain = hebrew.trim();
  if (translations.has(plain)) return translations.get(plain);
  if (translateResting) return null;
  const url = `${TRANSLATE.url}?q=${encodeURIComponent(plain)}&langpair=he|en`;
  const stopper = new AbortController();
  const timer = setTimeout(() => stopper.abort(), TRANSLATE.timeoutMs);
  try {
    const response = await fetch(url, { signal: stopper.signal });
    const data = await response.json();
    let english = data && data.responseData && data.responseData.translatedText;
    if (data.quotaFinished || data.responseStatus === 429 || /MYMEMORY WARNING/i.test(english || "")) {
      translateResting = true;
      setDeckMessage("Auto-translate has reached today's free limit. Type the English yourself for now.",
        "הַתִּרְגּוּם הָאוֹטוֹמָטִי הִגִּיעַ לַמִּכְסָה הַיּוֹמִית. בֵּינְתַיִם כּוֹתְבִים אֶת הָאַנְגְּלִית לְבַד.", true);
      return null;
    }
    if (Number(data.responseStatus) !== 200 || typeof english !== "string") return null;
    english = tidyTranslation(english);
    if (!english || HEBREW_LETTERS.test(english)) return null; // it gave back Hebrew: no translation found
    translations.set(plain, english);
    return english;
  } catch {
    return null; // no internet, or too slow: the teacher can type it
  } finally {
    clearTimeout(timer);
  }
}

// "Dog." → "dog" (single words in lowercase, like the built-in decks; no period at the end).
function tidyTranslation(text) {
  let english = text.trim().replace(/[.。]+$/, "").slice(0, DECK_LIMITS.maxTextLength);
  if (!english.includes(" ") && english !== "I" && english !== english.toUpperCase()) {
    english = english.charAt(0).toLowerCase() + english.slice(1);
  }
  return english;
}

function markAutoTranslated(box, auto) {
  box.classList.toggle("auto-translated", auto);
  box.title = auto ? "Translated automatically: check it · תֻּרְגַּם אוֹטוֹמָטִית: כְּדַאי לִבְדֹּק" : "";
}

// Fill in one row's English, if it's empty (or was filled in automatically before).
async function autoTranslateRow(row) {
  const hebrewBox = row.querySelector(".word-he");
  const englishBox = row.querySelector(".word-en");
  const hebrew = hebrewBox.value.trim();
  const englishIsMine = () => englishBox.value.trim() && !englishBox.classList.contains("auto-translated");
  if (!HEBREW_LETTERS.test(hebrew) || englishIsMine() || row.translatedFor === hebrew) return;
  row.translatedFor = hebrew;
  englishBox.placeholder = "translating… מְתַרְגְּמִים";
  const english = await translateHebrew(hebrew);
  englishBox.placeholder = "e.g. dog";
  // Changed while we waited? (A different Hebrew word, or the teacher typed the English.)
  if (hebrewBox.value.trim() !== hebrew || englishIsMine()) return;
  if (!english) { row.translatedFor = null; return; } // didn't work: try again next time
  englishBox.value = english;
  markAutoTranslated(englishBox, true);
  updateDeckCount();
}

// Leaving a Hebrew box (after changing it) translates that row.
wordRows.addEventListener("change", (event) => {
  if (event.target.classList.contains("word-he")) autoTranslateRow(event.target.closest(".word-row"));
});

// After a paste: translate the rows that have Hebrew but no English, one at a time.
async function autoTranslateEmptyRows() {
  const rows = [...wordRows.children].filter((row) =>
    row.querySelector(".word-he").value.trim() && !row.querySelector(".word-en").value.trim());
  for (const row of rows.slice(0, TRANSLATE.maxPerPaste)) {
    if (!row.isConnected || translateResting) break; // (row deleted, or the editor was closed)
    await autoTranslateRow(row);
  }
}

document.getElementById("add-word-button").addEventListener("click", () => {
  if (wordRows.children.length >= DECK_LIMITS.maxWords) return;
  addWordRow().querySelector(".word-he").focus();
});

// The little line under the table: "12 words", plus any rows that need fixing.
function updateDeckCount() {
  const { words, problems } = readWordRows();
  let english = `${words.length} words`;
  let hebrew = `${words.length} מִלִּים`;
  if (words.length < DECK_LIMITS.minWords) {
    english += ` · at least ${DECK_LIMITS.minWords}`;
    hebrew += ` · לְפָחוֹת ${DECK_LIMITS.minWords}`;
  }
  if (problems.length > 0) {
    const list = problems.slice(0, 5).join(", ") + (problems.length > 5 ? "…" : "");
    english += ` · ⚠️ Row ${list} needs both Hebrew and English`;
    hebrew += ` · ⚠️ בְּשׁוּרָה ${list} צָרִיךְ גַּם עִבְרִית וְגַם אַנְגְּלִית`;
  }
  setBilingual(deckCount, english, hebrew);
}

// ---------- The editor ----------

// deckId = one of my decks to change, or null for a new deck.
// copyFrom = a premade deck to start from (makes a NEW deck with its words).
function openDeckEditor(deckId, copyFrom = null) {
  editingDeckId = deckId;
  const deck = deckId ? customDecks.get(deckId) : null;
  wordRows.innerHTML = "";
  if (deck) {
    setBilingual(deckEditorTitle, "✏️ Edit deck", "עֲרִיכַת חֲפִיסָה");
    deckNameInput.value = deck.english;
    for (const word of deck.words) addWordRow(word);
  } else if (copyFrom) {
    setBilingual(deckEditorTitle, "📋 Copy of a premade deck", "הֶעְתֵּק שֶׁל חֲפִיסָה מוּכָנָה");
    deckNameInput.value = copyFrom.hebrew.slice(0, DECK_LIMITS.maxNameLength);
    for (const word of copyFrom.words) addWordRow(word);
  } else {
    setBilingual(deckEditorTitle, "➕ New deck", "חֲפִיסָה חֲדָשָׁה");
    deckNameInput.value = "";
    for (let i = 0; i < 5; i++) addWordRow(); // 5 empty rows to start with
  }
  deckDeleteButton.hidden = !deck; // nothing to delete yet for a new deck
  disarmDelete();
  setBilingual(deckMessage, "");
  deckSaveButton.disabled = false;
  updateDeckCount();
  decksListView.hidden = true;
  deckEditor.hidden = false;
  decksEl.querySelector(".decks-panel").scrollTop = 0;
}

document.getElementById("deck-cancel").addEventListener("click", showDeckList);

function setDeckMessage(english, hebrew, isInfo) {
  setBilingual(deckMessage, english || "", hebrew);
  deckMessage.classList.toggle("info", Boolean(isInfo));
}

deckSaveButton.addEventListener("click", async () => {
  if (!supa || !account.user) return;
  const name = deckNameInput.value.trim().slice(0, DECK_LIMITS.maxNameLength);
  const { words, problems } = readWordRows();
  if (!name) {
    deckNameInput.focus();
    return setDeckMessage("Give the deck a name.", "נוֹתְנִים לַחֲפִיסָה שֵׁם.");
  }
  if (problems.length > 0) {
    return setDeckMessage(`Each row needs both Hebrew and English. Check row ${problems.join(", ")}.`,
      `בְּכָל שׁוּרָה צָרִיךְ גַּם עִבְרִית וְגַם אַנְגְּלִית. בּוֹדְקִים אֶת שׁוּרָה ${problems.join(", ")}.`);
  }
  if (words.length < DECK_LIMITS.minWords) {
    return setDeckMessage(`A deck needs at least ${DECK_LIMITS.minWords} words.`, `בַּחֲפִיסָה צְרִיכוֹת לִהְיוֹת לְפָחוֹת ${DECK_LIMITS.minWords} מִלִּים.`);
  }
  if (words.length > DECK_LIMITS.maxWords) {
    return setDeckMessage(`Too many words: up to ${DECK_LIMITS.maxWords}.`, `יוֹתֵר מִדַּי מִלִּים: עַד ${DECK_LIMITS.maxWords}.`);
  }

  deckSaveButton.disabled = true;
  setDeckMessage("Saving…", "שׁוֹמְרִים…", true);
  let error;
  if (editingDeckId) {
    const databaseId = editingDeckId.slice(CUSTOM_PREFIX.length);
    ({ error } = await supa.from("decks")
      .update({ name, words, updated_at: new Date().toISOString() })
      .eq("id", databaseId));
  } else {
    ({ error } = await supa.from("decks").insert({ name, words }));
  }
  deckSaveButton.disabled = false;
  if (error) {
    console.warn("Couldn't save the deck:", error.message);
    return setDeckMessage("Couldn't save. Check your internet and try again.", "לֹא הִצְלַחְנוּ לִשְׁמֹר. בּוֹדְקִים אֶת הַחִבּוּר וּמְנַסִּים שׁוּב.");
  }
  showToast("💾 Deck saved!", "הַחֲפִיסָה נִשְׁמְרָה!");
  await loadMyDecks();
  showDeckList();
});

// Deleting: the first tap asks "Tap again to delete", the second tap (within 4 seconds) deletes.
function disarmDelete() {
  deleteArmedUntil = 0;
  setBilingual(deckDeleteButton, "🗑️ Delete this deck", "מְחִיקַת הַחֲפִיסָה");
}

deckDeleteButton.addEventListener("click", async () => {
  if (!supa || !account.user || !editingDeckId) return;
  if (performance.now() > deleteArmedUntil) {
    deleteArmedUntil = performance.now() + 4000;
    setBilingual(deckDeleteButton, "⚠️ Tap again to delete", "לוֹחֲצִים שׁוּב כְּדֵי לִמְחֹק");
    setTimeout(() => { if (performance.now() > deleteArmedUntil) disarmDelete(); }, 4100);
    return;
  }
  disarmDelete();
  setDeckMessage("Deleting…", "מוֹחֲקִים…", true);
  const { error } = await supa.from("decks").delete().eq("id", editingDeckId.slice(CUSTOM_PREFIX.length));
  if (error) {
    console.warn("Couldn't delete the deck:", error.message);
    return setDeckMessage("Couldn't delete. Check your internet and try again.", "לֹא הִצְלַחְנוּ לִמְחֹק. בּוֹדְקִים אֶת הַחִבּוּר וּמְנַסִּים שׁוּב.");
  }
  showToast("🗑️ Deck deleted.", "הַחֲפִיסָה נִמְחֲקָה.");
  await loadMyDecks();
  showDeckList();
});
