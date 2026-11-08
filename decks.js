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
const deckWordsInput = document.getElementById("deck-words");
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

// One clickable row. english/hebrew = the two lines; detail = small gray text on the right.
function makePickRow(id, english, hebrew, detail, detailHe) {
  const row = document.createElement("button");
  row.type = "button";
  row.className = "deck-row" + (id === teacherPickId() ? " picked" : "");
  const name = document.createElement("span");
  name.className = "deck-row-name";
  setBilingual(name, english, hebrew); // (setBilingual uses textContent: typed names can't break the page)
  row.appendChild(name);
  if (detail) {
    const count = document.createElement("span");
    count.className = "deck-row-count";
    setBilingual(count, detail, detailHe);
    row.appendChild(count);
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
    const row = makePickRow(id, deck.english, "", `${n} words`, `${n} מִלִּים`);
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

  // Column 2: the premade decks (one idea each).
  const premadeList = document.getElementById("premade-list");
  premadeList.innerHTML = "";
  for (const deck of TOPIC_DECKS) {
    const n = deck.words.length;
    premadeList.appendChild(makePickRow(deck.id, deck.english, deck.hebrew, `${n} words`, `${n} מִלִּים`));
  }

  // Column 3: Auto, then every level.
  const levelsList = document.getElementById("levels-list");
  levelsList.innerHTML = "";
  levelsList.appendChild(makePickRow(AUTO, "🤖 Auto: a level for each player", "אוֹטוֹמָטִי: רָמָה אִישִׁית"));
  for (const deck of DECKS) {
    levelsList.appendChild(makePickRow(deck.id, `${deck.number} · ${deck.english}`, `${deck.numberHe} · ${deck.hebrew}`));
  }

  // Under the Host button: what the class will play.
  const picked = teacherPickId();
  const pickEl = document.getElementById("teacher-pick");
  if (picked === AUTO) {
    setBilingual(pickEl, "Words: 🤖 Auto (each student plays their own level)", "מִלִּים: אוֹטוֹמָטִי (כָּל תַּלְמִיד בָּרָמָה שֶׁלּוֹ)");
  } else {
    const deck = findDeck(picked);
    const hebrewName = deck.custom ? `📚 ${deck.english}` : deck.topic ? `🎯 ${deck.hebrew}` : `${deck.numberHe} · ${deck.hebrew}`;
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

// ---------- Reading the words box ----------

const HEBREW_LETTERS = /[֐-׿]/; // the range of Hebrew letters and nikud in Unicode

// Turn the typed text into a word list. Also returns the line numbers that didn't make sense.
function parseDeckText(text) {
  const words = [];
  const badLines = [];
  const seen = new Set();
  text.split(/\r?\n/).forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (!line) return; // empty lines are fine
    // Split at the first "=" (or, if there isn't one, at the first tab).
    const splitAt = line.includes("=") ? line.indexOf("=") : line.indexOf("\t");
    if (splitAt === -1) {
      badLines.push(index + 1);
      return;
    }
    // Normally the Hebrew comes first. But if only the SECOND part has Hebrew
    // letters (someone typed English first), swap them.
    let hebrew = line.slice(0, splitAt).trim();
    let english = line.slice(splitAt + 1).trim();
    if (!HEBREW_LETTERS.test(hebrew) && HEBREW_LETTERS.test(english)) [english, hebrew] = [hebrew, english];
    if (!english || !hebrew || english.length > DECK_LIMITS.maxTextLength || hebrew.length > DECK_LIMITS.maxTextLength) {
      badLines.push(index + 1);
      return;
    }
    const key = english + "|" + hebrew;
    if (seen.has(key)) return; // the same line twice: keep one
    seen.add(key);
    words.push({ english, hebrew });
  });
  return { words, badLines };
}

// The little line under the box: "12 words", plus any lines that need fixing.
function updateDeckCount() {
  const { words, badLines } = parseDeckText(deckWordsInput.value);
  let english = `${words.length} words`;
  let hebrew = `${words.length} מִלִּים`;
  if (words.length < DECK_LIMITS.minWords) {
    english += ` · at least ${DECK_LIMITS.minWords}`;
    hebrew += ` · לְפָחוֹת ${DECK_LIMITS.minWords}`;
  }
  if (badLines.length > 0) {
    const list = badLines.slice(0, 5).join(", ") + (badLines.length > 5 ? "…" : "");
    english += ` · ⚠️ Check line ${list}`;
    hebrew += ` · ⚠️ בּוֹדְקִים אֶת שׁוּרָה ${list}`;
  }
  setBilingual(deckCount, english, hebrew);
}
deckWordsInput.addEventListener("input", updateDeckCount);

// ---------- The editor ----------

function openDeckEditor(deckId) {
  editingDeckId = deckId;
  const deck = deckId ? customDecks.get(deckId) : null;
  if (deck) {
    setBilingual(deckEditorTitle, "✏️ Edit deck", "עֲרִיכַת חֲפִיסָה");
    deckNameInput.value = deck.english;
    deckWordsInput.value = deck.words.map((w) => `${w.hebrew} = ${w.english}`).join("\n");
  } else {
    setBilingual(deckEditorTitle, "➕ New deck", "חֲפִיסָה חֲדָשָׁה");
    deckNameInput.value = "";
    deckWordsInput.value = "";
  }
  deckDeleteButton.hidden = !deck; // nothing to delete yet for a new deck
  disarmDelete();
  setBilingual(deckMessage, "");
  deckSaveButton.disabled = false;
  updateDeckCount();
  decksListView.hidden = true;
  deckEditor.hidden = false;
}

document.getElementById("deck-cancel").addEventListener("click", showDeckList);

function setDeckMessage(english, hebrew, isInfo) {
  setBilingual(deckMessage, english || "", hebrew);
  deckMessage.classList.toggle("info", Boolean(isInfo));
}

deckSaveButton.addEventListener("click", async () => {
  if (!supa || !account.user) return;
  const name = deckNameInput.value.trim().slice(0, DECK_LIMITS.maxNameLength);
  const { words, badLines } = parseDeckText(deckWordsInput.value);
  if (!name) {
    deckNameInput.focus();
    return setDeckMessage("Give the deck a name.", "נוֹתְנִים לַחֲפִיסָה שֵׁם.");
  }
  if (badLines.length > 0) {
    return setDeckMessage(`Each line needs Hebrew = English. Check line ${badLines.join(", ")}.`,
      `בְּכָל שׁוּרָה צָרִיךְ עִבְרִית = אַנְגְּלִית. בּוֹדְקִים אֶת שׁוּרָה ${badLines.join(", ")}.`);
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
