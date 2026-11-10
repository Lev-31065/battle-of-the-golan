# State

## Works now
- **Core game:** capture the flag (first to 3), rivers at 15% speed, bushes at 30%, rocks that ask a question, hammer shop, speed box, minimap, sounds, room codes, invite links. Tested on real phones with 2+ players.
- **Scoring rule (`checkBase` in `server.js`):** both flags inside a team's circle = a point for that team, whether the flags are on the stand, on the ground, or carried by a teammate. A flag in an enemy's hands doesn't count. Your own flag dropped inside your base goes straight home. Tested on phones.
- **After a game:** the winner screen shows for `WINNER_SCREEN_TIME` (6 s), then everyone goes back to the teams screen automatically. Tested on phones.
- **Leaving:** 🚪 button in the game and 🏠 Home in the lobby, with an "Are you sure?" popup. Tested on phones. (The popups use z-index 40; the screens are 30.)
- **Rejoining:** joining mid-game works. The room code shows on the left edge during play. A joiner's last room code is pre-filled for 3 hours. The same nickname goes back on the same team (`server.pastTeams`). The 2026-11-08 rejoin fixes (timer reset on clock jumps, auto re-join, replacing a silent same-name player) were tested by Daniel; no problems reported.
- **Questions:** the popup closes instantly after a right answer. A flag-grab question closes by itself if the flag returns home or someone else grabs it.
- **Voice (`speech.js`):** reads the English when a question opens, the Hebrew after a wrong answer, and a recap after a right answer. 🗣️ turns it on/off.
- **Flashcards (`progress.js`):** spaced repetition. Settings in `REVIEW_STEPS` in `rules.js`.
- **Logins (`account.js` + Supabase):** email + password or a sign-in link, 13+ checkbox. Progress follows the account. Tested live.
- **Delete my account:** red link on the home screen. It calls the `delete_my_account()` function in Supabase, which is set up in `setup.sql`. The account's progress and decks go with it (cascade). Tested on phones.
- **Privacy page (`privacy.html`):** linked from the home screen and the sign-up form. Contact email: concoctors@gmail.com.
- **Levels:** 1A, 2A, 2B … 16A, 16B (Hebrew 3א/3ב). A = the level's words; B = review. A "Level 3B / Room KZTP" tag shows during play.
- **Object-pronoun level (11A, id `level-object-pronouns`, 2026-11-09):** אוֹתִי … אוֹתָן + present-tense sentences. Reviewed in 13A and 15A (not 16A, the hardest). Old 11–15 became 12–16. Tested by Daniel.
- **Auto-translate:** tested by Daniel. "Not amazing, but gets most simple words right." Nikud seemed right so far.
- **Lobby/editor tweaks (2026-11-09), tested:** "My decks" sits right under Auto in the class-game dropdown; the deck editor's "Add a word" button is on the right.
- **Premade decks replaced (2026-11-09):** 3 themes (school, restaurant, trip) + 8 root decks (infinitive, present, nouns from the root, which word comes after the verb, e.g. מְדַבֵּר עִם / עַל). Tested by Daniel.
- **Auto level:** per player. Daniel says it's "pretty great". Retuned on 2026-11-07.
- **Masculine/feminine choice (first screen):** "I" and "we" sentences use the player's choice. Tested on phones.
- **Hebrew first everywhere:** Hebrew on top and bigger, English underneath and smaller.
- **Restructure (2026-11-08), all tested by Daniel:**
  - **Game-mode screen:** "Create a room" → pick a game. Capture the Flag + 2 "🔒 Coming soon" buttons. `server.mode` = "ctf".
  - **Two kinds of rooms:** normal (from Play Game): each phone picks its own level from a list of Auto + levels only. Class game (from the teacher dashboard): the teacher picks for everyone; students' picker is grayed out. Enforced by the referee (`server.classGame`).
  - **Teacher dashboard** (replaces "My decks", logged-in only, free for now): wide computer layout, "🏫 Host a class game", and 3 columns to pick the class deck: My decks (✏️ edit), Premade decks (📋 copy & edit), Levels (incl. Auto).
  - **Premade decks** (`TOPIC_DECKS`): class games only. Contents replaced on 2026-11-09 (see above).
  - **Custom dropdown** in the lobby, right under the room code (phones' built-in lists covered the whole screen). Daniel loves it.
  - **Deck editor as a table:** Hebrew | English | wrong answers (➕ tags, up to 5) | 🗑. Enter moves like a spreadsheet. Pasting from Excel fills many rows (extra columns = wrong answers). Copying a premade deck keeps feminine versions (♀ tag).

## Built, not yet tested (2026-11-09)
- **"🔁 Verb roots: past & future" premade section:** 11 `conj-*` decks (כתב, למד, עבד, אכל, שתה, דבר, ספר, הלך, בוא, עזר, חכה). Each: 8 past + 8 future forms (pronoun included in the answer) + 2 sentences. Wrong answers = other tense / other gender or I↔we / other person. Headless check: all 22 premade decks valid, 3 headings in the dashboard. Daniel still needs to test, and check the nikud of guttural/irregular forms (תַּעַבְדִי, אֹכַל, שָׁתְתָה, חִכְּתָה, בָּאת).
- **Privacy page line about MyMemory:** Daniel should read it.
- **Nikud still needs Daniel's check:** the 27 pronoun sentences from 2026-11-07 and the new object-pronoun level.
- **Not yet confirmed:** the iPhone 2× zoom fix, and full screen on Android.

## Key decisions
- **PeerJS with the host as referee.** Free, no game server. If the host leaves, the room closes.
- **GitHub Pages via web upload.** Git isn't installed yet; Daniel is considering it, so Claude could upload.
- **Supabase for logins and data.** The URL and publishable key in `account.js` are public by design. Never add the secret/service_role key.
- **Teacher features will be paid later.** For now the dashboard is free for anyone logged in. Later, lock the dashboard door (and the `decks` table) behind a paid account; nothing else should need to change.
- **Class game = room hosted from the dashboard.** That's how the game knows the host is a teacher.
- **Normal rooms show only Auto + levels.** Premade decks and own decks are teacher tools.
- **Teacher decks are private in Supabase**, so the host's phone sends the words to the other players. Joiners never read the database.
- **Hebrew first, to get players reading Hebrew.** The quiz still shows the English word, because its Hebrew is the answer.
- **Sign-in link instead of a typed code** (Supabase's email text can't be edited without custom SMTP). Later: Resend plus our own domain.
- **Auto is per player, not per room.** Saved choices: `golan-my-level` (my level in normal rooms), `golan-deck-v2` (the teacher's class-game pick).
- **MyMemory for auto-translate**, sending the Hebrew as typed (stripping nikud gave worse results: "שלחן" → "desktop"). Switch to Google Translate (needs billing + a server piece) if it isn't good enough.
- **"We" wrong answers never include the other gender. "I" wrong answers do.**
- **Interface Hebrew uses dictionary nikud spelling**, the same as `words.js`.

## Gotchas
- School Wi-Fi may block connections; mobile data is the fallback.
- The host's copy of the game decides the rules and words, and each phone needs the new files. Upload, then refresh every phone. (A phone with an old `words.js` drops a teacher's wrong answers.)
- Changing a sentence's English or Hebrew resets it in everyone's flashcard memory (the key is `english|hebrew`).
- Supabase's free email sender allows only a few emails per hour.
- MyMemory's free limit is about 5,000 letters a day per computer. Single words translate well; sentences are hit-and-miss. Single English words are lowercased (so "Jerusalem" would need fixing).
- Sign-in links open in the phone's default browser.
- Popups that can open over a screen need a z-index above 30.
- iPhones ignore `hidden` on `<option>`/`<optgroup>`, so the deck list adds and removes whole groups instead.
- Headless Edge testing:
  - For a test page, copy `index.html` with a `<base href="file:///…/battle-of-the-golan/">` and an extra `<script>` at the end, run it with `--dump-dom`, and capture the output directly. `Start-Process` redirection came back empty.
  - Git Bash garbles Hebrew in command lines (curl showed "???"). Use PowerShell for anything with Hebrew text.
  - Use `--enable-logging=stderr` to see real errors.
  - Add `--user-data-dir=<scratchpad>\edgeprofile` and pipe to `Out-String`. Without its own profile, headless Edge hands off to the Edge that's already open and prints nothing.
  - Level ids ≠ level numbers from 11 on (`level-object-pronouns` = 11A, `level-11` = 12A …). Ids never change, so saved Auto levels stay put. Add new levels with a name-style id.
  - Use `-Infinity` (not 0) for "never happened" timestamps.
