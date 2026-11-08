// account.js — optional logins, using Supabase (a free online database with logins built in).
//
// Nobody HAS to log in. Logging in just means your progress is saved to your
// account, so it follows you to any phone or computer. (Later: teachers' word decks too.)
//
// Ways to log in:
//   • Email + password
//   • A sign-in link sent to your email (for people who don't want a password).
//     Tapping the link in the email opens the game, already logged in.
//     (It's a link, not a typed code, because Supabase only lets us change the
//     email's wording once we connect our own email service. Maybe later.)
// Making an account needs the "I'm 13 or older" box ticked.
//
// The two values below are PUBLIC on purpose — every visitor's browser needs them
// to talk to Supabase. What keeps data private are the security rules in
// supabase/setup.sql (each person can only see their own rows).
// ⚠️ NEVER put the "secret" / "service_role" key in any game file.

const SUPABASE_URL = "https://atiqvtjmhwhnmkexovlm.supabase.co";
const SUPABASE_KEY = "sb_publishable_2HAI2Dbutdam1J2PDk2EBQ_F1zJ7MHs";

const account = {
  user: null,        // the logged-in user (null = not logged in)
  mode: "login",     // which form is showing: "login" or "signup"
  synced: false,     // true once we've loaded the account's saved progress (safe to upload)
};
let supa = null;     // our connection to Supabase (null if it couldn't load)

const accountEl = document.getElementById("account");
const accountTitle = document.getElementById("account-title");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const ageRow = document.getElementById("age-row");
const ageCheck = document.getElementById("age-check");
const accountSubmit = document.getElementById("account-submit");
const linkButton = document.getElementById("link-button");
const modeSwitch = document.getElementById("mode-switch");
const accountMessage = document.getElementById("account-message");
const loginButton = document.getElementById("login-button");
const accountBox = document.getElementById("account-box");
const accountEmail = document.getElementById("account-email");

// ---------- Starting up ----------

// Wait until every script has loaded (game.js too), then connect.
window.addEventListener("DOMContentLoaded", () => {
  try {
    if (window.supabase) supa = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  } catch {}
  if (!supa) {
    // No internet, or the Supabase library didn't load. The game still works without logins.
    setBilingual(loginButton, "🔑 Login isn't available right now", "הַהִתְחַבְּרוּת לֹא זְמִינָה כָּרֶגַע");
    loginButton.disabled = true;
    return;
  }
  // Supabase tells us whenever someone logs in or out (including "already logged in" at startup).
  supa.auth.onAuthStateChange((event, session) => {
    // setTimeout: Supabase asks us not to talk to it from inside this callback directly.
    setTimeout(() => handleUser(session ? session.user : null), 0);
  });
});

// Someone logged in (user) or out (null).
async function handleUser(user) {
  const sameUser = (account.user && account.user.id) === (user && user.id);
  account.user = user;
  if (!sameUser) {
    if (user) {
      // Fetch this account's saved progress, then combine it with this phone's.
      const { data, error } = await supa.from("progress").select("data").eq("user_id", user.id).maybeSingle();
      // If fetching failed (bad internet), DON'T upload: that could overwrite the account's
      // saved progress with only this phone's. We'll try again next time the game opens.
      account.synced = !error;
      switchProgressOwner(user.id, data ? data.data : null);
      if (account.synced) uploadProgress();
    } else {
      account.synced = false;
      switchProgressOwner(null);
    }
  }
  updateAccountUI();
}

// ---------- Saving progress to the account ----------

let uploadTimer = null;

// progress.js calls this every time progress changes. We wait 3 seconds and send
// everything in one go, instead of after every single answer.
onProgressSaved = () => {
  if (!account.user || !account.synced) return;
  clearTimeout(uploadTimer);
  uploadTimer = setTimeout(uploadProgress, 3000);
};

async function uploadProgress() {
  clearTimeout(uploadTimer);
  uploadTimer = null;
  if (!supa || !account.user || !account.synced) return;
  const { error } = await supa.from("progress").upsert({
    user_id: account.user.id,
    data: progress,
    updated_at: new Date().toISOString(),
  });
  if (error) console.warn("Couldn't save progress to the account:", error.message);
}

// Phone going to sleep or switching apps? Save right away.
document.addEventListener("visibilitychange", () => {
  if (document.hidden && uploadTimer) uploadProgress();
});

// ---------- The home screen: "Log in" or "Logged in as ..." ----------

function updateAccountUI() {
  const loggedIn = Boolean(account.user);
  loginButton.hidden = loggedIn;
  accountBox.hidden = !loggedIn;
  if (loggedIn) {
    setBilingual(accountEmail, "✅ Logged in: " + account.user.email, "חֶשְׁבּוֹן מְחֻבָּר: " + account.user.email);
  }
  if (typeof updateProgressSummary === "function") updateProgressSummary();
}

loginButton.addEventListener("click", () => openAccountScreen("login"));

document.getElementById("logout-button").addEventListener("click", async () => {
  if (!supa) return;
  await uploadProgress();   // save the last answers first
  await supa.auth.signOut();
  showToast("👋 Logged out.", "הִתְנַתַּקְתֶּם.");
});

// ---------- "Delete my account" ----------
// Asks "Are you sure?" first. Then it calls delete_my_account (a function in
// supabase/setup.sql) which removes the login. The account's progress and decks
// are removed with it. Then we log out on this phone and forget the copy saved here.

const deleteEl = document.getElementById("delete-confirm");
const deleteYes = document.getElementById("delete-yes");
const deleteMessage = document.getElementById("delete-message");

document.getElementById("delete-account-button").addEventListener("click", () => {
  if (!account.user) return;
  setBilingual(deleteMessage, "");
  deleteYes.disabled = false;
  deleteEl.hidden = false;
});

document.getElementById("delete-no").addEventListener("click", () => { deleteEl.hidden = true; });

deleteYes.addEventListener("click", async () => {
  if (!supa || !account.user) return;
  const userId = account.user.id;
  deleteYes.disabled = true;
  setBilingual(deleteMessage, "Deleting…", "מוֹחֲקִים…");
  // Stop saving progress to the account (it's about to be gone).
  clearTimeout(uploadTimer);
  uploadTimer = null;
  account.synced = false;

  const { error } = await supa.rpc("delete_my_account");
  if (error) {
    console.warn("Couldn't delete the account:", error.message);
    account.synced = true;   // nothing was deleted, so saving can carry on
    deleteYes.disabled = false;
    setBilingual(deleteMessage, "Something went wrong. Nothing was deleted. Try again later.",
      "מַשֶּׁהוּ הִשְׁתַּבֵּשׁ. שׁוּם דָּבָר לֹא נִמְחַק. מְנַסִּים שׁוּב מְאֻחָר יוֹתֵר.");
    return;
  }

  // Forget this account's copy of the progress on this phone too.
  try { localStorage.removeItem(GUEST_PROGRESS_KEY + "-" + userId); } catch {}
  // "local" = just forget the login on this phone (the login no longer exists on Supabase).
  await supa.auth.signOut({ scope: "local" });
  deleteEl.hidden = true;
  showToast("🗑️ Your account was deleted.", "הַחֶשְׁבּוֹן נִמְחַק.");
});

// ---------- The login / sign-up screen ----------

function openAccountScreen(mode) {
  account.mode = mode;
  const signup = mode === "signup";
  setBilingual(accountTitle, signup ? "Create an account" : "Log in", signup ? "יְצִירַת חֶשְׁבּוֹן" : "הִתְחַבְּרוּת");
  setBilingual(accountSubmit, signup ? "Create account" : "Log in", signup ? "יְצִירַת חֶשְׁבּוֹן" : "הִתְחַבְּרוּת");
  setBilingual(modeSwitch,
    signup ? "Already have an account? Log in" : "New here? Create an account",
    signup ? "כְּבָר יֵשׁ חֶשְׁבּוֹן? מִתְחַבְּרִים" : "חֲדָשִׁים כָּאן? יוֹצְרִים חֶשְׁבּוֹן");
  ageRow.hidden = !signup;
  document.getElementById("signup-privacy").hidden = !signup;
  passwordInput.autocomplete = signup ? "new-password" : "current-password";
  setAccountMessage("");
  showScreen("account");
}

modeSwitch.addEventListener("click", () => openAccountScreen(account.mode === "signup" ? "login" : "signup"));
document.getElementById("account-back").addEventListener("click", () => showScreen("home"));

function setAccountMessage(english, hebrew, isInfo) {
  setBilingual(accountMessage, english || "", hebrew);
  accountMessage.classList.toggle("info", Boolean(isInfo));
}

function setAccountBusy(busy) {
  for (const b of [accountSubmit, linkButton]) b.disabled = busy;
}

// Check the email box (and the age box, when signing up). Returns the email, or null.
function readEmail() {
  const email = emailInput.value.trim();
  if (!email.includes("@")) {
    setAccountMessage("Type your email.", "כּוֹתְבִים כְּתֹבֶת אִימֵייל.");
    emailInput.focus();
    return null;
  }
  if (account.mode === "signup" && !ageCheck.checked) {
    setAccountMessage("Please confirm you're 13 or older.", "צָרִיךְ לְאַשֵּׁר גִּיל 13 וָמַעְלָה.");
    return null;
  }
  return email;
}

// The big button: log in, or create an account.
accountSubmit.addEventListener("click", async () => {
  const email = readEmail();
  if (!email) return;
  const password = passwordInput.value;
  if (!password) {
    setAccountMessage("Type a password.", "כּוֹתְבִים סִיסְמָה.");
    passwordInput.focus();
    return;
  }
  setAccountBusy(true);

  if (account.mode === "login") {
    setAccountMessage("Logging in…", "מִתְחַבְּרִים…", true);
    const { error } = await supa.auth.signInWithPassword({ email, password });
    setAccountBusy(false);
    if (error) return showAccountError(error);
    finishLogin();
    return;
  }

  setAccountMessage("Creating your account…", "יוֹצְרִים חֶשְׁבּוֹן…", true);
  const { data, error } = await supa.auth.signUp({
    email,
    password,
    options: {
      data: { age_13_or_older: true },                        // saved with the account
      emailRedirectTo: location.origin + location.pathname,   // the email link brings you back here
    },
  });
  setAccountBusy(false);
  if (error) return showAccountError(error);
  // Supabase hides whether an email is already taken, but this is how you can tell:
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return setAccountMessage("There's already an account with this email. Try logging in.", "כְּבָר יֵשׁ חֶשְׁבּוֹן עִם הָאִימֵייל הַזֶּה. מְנַסִּים לְהִתְחַבֵּר.");
  }
  if (data.session) return finishLogin(); // no email check needed: logged in already
  setAccountMessage("📧 Check your email and tap the link to finish.", "📧 בּוֹדְקִים אֶת הָאִימֵייל וְלוֹחֲצִים עַל הַקִּשּׁוּר.", true);
});

// "Email me a sign-in link"
linkButton.addEventListener("click", async () => {
  const email = readEmail();
  if (!email) return;
  setAccountBusy(true);
  setAccountMessage("Sending the link…", "שׁוֹלְחִים קִשּׁוּר…", true);
  const signup = account.mode === "signup";
  const { error } = await supa.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: signup,   // only make a new account from the sign-up form (where the age box is)
      data: signup ? { age_13_or_older: true } : undefined,
      emailRedirectTo: location.origin + location.pathname,
    },
  });
  setAccountBusy(false);
  if (error) return showAccountError(error);
  setAccountMessage("📧 Check your email and tap the link to log in.", "📧 בּוֹדְקִים אֶת הָאִימֵייל וְלוֹחֲצִים עַל הַקִּשּׁוּר כְּדֵי לְהִתְחַבֵּר.", true);
});

// Came back from an email link that didn't work (too old, or already used)?
// Supabase puts the reason in the page address after a "#". Show a friendly message.
window.addEventListener("DOMContentLoaded", () => {
  if (!location.hash.includes("error")) return;
  setTimeout(() => showToast("⚠️ That email link is too old or was already used. Ask for a new one.",
    "הַקִּשּׁוּר יָשָׁן מִדַּי אוֹ שֶׁכְּבָר הִשְׁתַּמְּשׁוּ בּוֹ. מְבַקְּשִׁים קִשּׁוּר חָדָשׁ."), 500);
  history.replaceState(null, "", location.pathname + location.search); // tidy the address
});

function finishLogin() {
  passwordInput.value = "";
  setAccountMessage("");
  showScreen("home");
  showToast("✅ You're logged in!", "הִתְחַבַּרְתֶּם!");
}

// Turn Supabase's error messages into friendly ones, in both languages.
function showAccountError(error) {
  const code = error.code || "";
  const text = (error.message || "").toLowerCase();
  if (code === "invalid_credentials" || text.includes("invalid login")) {
    setAccountMessage("Wrong email or password.", "אִימֵייל אוֹ סִיסְמָה לֹא נְכוֹנִים.");
  } else if (code === "email_not_confirmed" || text.includes("not confirmed")) {
    setAccountMessage("Please confirm your email first (check your inbox).", "צָרִיךְ קֹדֶם לְאַשֵּׁר אֶת הָאִימֵייל (בּוֹדְקִים בַּדֹּאַר).");
  } else if (code === "user_already_exists" || text.includes("already registered")) {
    setAccountMessage("There's already an account with this email. Try logging in.", "כְּבָר יֵשׁ חֶשְׁבּוֹן עִם הָאִימֵייל הַזֶּה. מְנַסִּים לְהִתְחַבֵּר.");
  } else if (code === "weak_password" || text.includes("password should")) {
    setAccountMessage("The password needs at least 6 characters.", "הַסִּיסְמָה צְרִיכָה לִהְיוֹת לְפָחוֹת 6 תָּוִים.");
  } else if (code === "otp_disabled" || text.includes("signups not allowed")) {
    setAccountMessage("No account with this email yet. Tap “Create an account” first.", "אֵין עֲדַיִן חֶשְׁבּוֹן עִם הָאִימֵייל הַזֶּה. יוֹצְרִים חֶשְׁבּוֹן קֹדֶם.");
  } else if (error.status === 429 || text.includes("rate limit")) {
    setAccountMessage("Too many tries. Wait a little and try again.", "יוֹתֵר מִדַּי נִסְיוֹנוֹת. מְחַכִּים קְצָת וּמְנַסִּים שׁוּב.");
  } else {
    setAccountMessage("Something went wrong: " + error.message, "מַשֶּׁהוּ הִשְׁתַּבֵּשׁ.");
  }
}
