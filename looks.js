// looks.js — mastery points, the "My look" picker, and the "log in?" card after a game.
//
// MASTERY POINTS come from learning words (progress.js counts them: masteryPoints()).
// LOOKS are hats and things for your player (the list, with what each one costs, is LOOKS
// in rules.js). They show in Capture the Flag and on your sled in Mt Hermon Racing.
// Both are only for logged-in players: a guest still collects points on this phone, and
// gets to keep them by logging in.

const looksEl = document.getElementById("looks");
const looksGrid = document.getElementById("looks-grid");
const looksNote = document.getElementById("looks-note");
const looksPoints = document.getElementById("looks-points");
const masteryLine = document.getElementById("mastery-points");
const nudgeEl = document.getElementById("login-nudge");
const nudgeNote = document.getElementById("nudge-note");

function isLoggedIn() {
  return typeof account !== "undefined" && Boolean(account.user);
}

// The look I'm wearing right now: the one I picked, if I'm logged in and (still) have
// enough points for it. Otherwise "none".
function myLook() {
  const look = findLook(progress.look);
  return isLoggedIn() && look && masteryPoints() >= look.cost ? look.id : "none";
}

// The line on the home screen: "⭐ 37 mastery points".
function updateMasteryLine() {
  const points = masteryPoints();
  if (isLoggedIn()) {
    setBilingual(masteryLine, `⭐ Mastery points: ${points}`, `⭐ נְקֻדּוֹת שְׁלִיטָה: ${points}`);
  } else if (points > 0) {
    setBilingual(masteryLine, `⭐ ${points} mastery points are waiting: log in to keep them`, `⭐ ${points} נְקֻדּוֹת שְׁלִיטָה מְחַכּוֹת לָכֶם: הִתְחַבְּרוּ כְּדֵי לִשְׁמֹר אוֹתָן`);
  } else {
    setBilingual(masteryLine, "⭐ Log in to earn mastery points and unlock looks", "⭐ הִתְחַבְּרוּ כְּדֵי לִצְבֹּר נְקֻדּוֹת שְׁלִיטָה");
  }
}

// ---------- The "My look" picker ----------

function openLooks() {
  drawLooks();
  looksEl.hidden = false;
}

function drawLooks() {
  const points = masteryPoints(), loggedIn = isLoggedIn(), wearing = myLook();
  setBilingual(looksPoints, `⭐ ${points} mastery points`, `⭐ ${points} נְקֻדּוֹת שְׁלִיטָה`);
  if (loggedIn) {
    setBilingual(looksNote, "You get a point each time a word reaches a new level. Your look shows in every game.", "כָּל מִלָּה שֶׁעוֹלָה רָמָה נוֹתֶנֶת נְקֻדָּה. הַמַּרְאֶה מוֹפִיעַ בְּכָל הַמִּשְׂחָקִים.");
  } else {
    setBilingual(looksNote, "🔑 Log in to wear a look. The points you earn on this phone come with you.", "🔑 הִתְחַבְּרוּ כְּדֵי לִלְבֹּשׁ מַרְאֶה. הַנְּקֻדּוֹת מֵהַטֶּלֶפוֹן הַזֶּה בָּאוֹת אִתְּכֶם.");
  }
  looksGrid.textContent = "";
  for (const look of LOOKS) {
    const open = points >= look.cost;
    const card = document.createElement("button");
    card.type = "button";
    card.className = "look-card" + (look.id === wearing ? " chosen" : "") + (open ? "" : " locked");
    const icon = document.createElement("span");
    icon.className = "look-icon";
    icon.textContent = look.icon;
    const name = document.createElement("span");
    name.className = "look-name";
    setBilingual(name, look.en, look.he);
    const status = document.createElement("span");
    status.className = "look-status";
    status.textContent = look.id === wearing ? "✓" : open ? (look.cost ? `⭐ ${look.cost}` : "") : `🔒 ⭐ ${look.cost}`;
    card.append(icon, name, status);
    card.addEventListener("click", () => pickLook(look));
    looksGrid.appendChild(card);
  }
}

function pickLook(look) {
  const points = masteryPoints();
  if (!isLoggedIn()) {
    showToast("🔑 Log in first to wear a look", "🔑 קֹדֶם מִתְחַבְּרִים");
    return;
  }
  if (points < look.cost) {
    showToast(`🔒 ${look.cost - points} more mastery points to go`, `🔒 חֲסֵרוֹת עוֹד ${look.cost - points} נְקֻדּוֹת`);
    return;
  }
  progress.look = look.id; // (saved with my progress, so it follows my account)
  saveProgress();
  drawLooks();
  playSound("item");
}

document.getElementById("look-button").addEventListener("click", openLooks);
document.getElementById("looks-close").addEventListener("click", () => { looksEl.hidden = true; });

// ---------- After a game ----------
// Logged in: a message with the points this game earned (and any look that just opened up).
// Not logged in: a card asking to log in (it says what there is to keep).
// before = my mastery points when the game started.
function afterGame(before) {
  const points = masteryPoints(), gained = Math.max(0, points - before);
  if (!isLoggedIn()) {
    if (typeof supa === "undefined" || !supa) return; // (logging in isn't possible right now)
    if (gained > 0) {
      setBilingual(nudgeNote, `You earned ${gained} mastery points this game (${points} so far). Log in to keep them, save your words, and unlock looks for your player.`,
        `צְבַרְתֶּם ${gained} נְקֻדּוֹת שְׁלִיטָה בַּמִּשְׂחָק הַזֶּה (${points} עַד עַכְשָׁו). הִתְחַבְּרוּ כְּדֵי לִשְׁמֹר אוֹתָן.`);
    } else {
      setBilingual(nudgeNote, "Log in to save your words, earn mastery points, and unlock looks for your player.", "הִתְחַבְּרוּ כְּדֵי לִשְׁמֹר אֶת הַמִּלִּים וְלִצְבֹּר נְקֻדּוֹת שְׁלִיטָה.");
    }
    nudgeEl.hidden = false;
    return;
  }
  if (gained > 0) showToast(`⭐ +${gained} mastery points! You have ${points}`, `⭐ +${gained} נְקֻדּוֹת שְׁלִיטָה! יֵשׁ לָכֶם ${points}`);
  for (const look of LOOKS) {
    if (look.cost > before && look.cost <= points) showToast(`🎭 New look unlocked: ${look.icon} ${look.en}. Pick it on the home screen`, `🎭 מַרְאֶה חָדָשׁ: ${look.icon} ${look.he}`);
  }
}

document.getElementById("nudge-login").addEventListener("click", () => {
  nudgeEl.hidden = true;
  openAccountScreen("login");
});
document.getElementById("nudge-later").addEventListener("click", () => { nudgeEl.hidden = true; });
