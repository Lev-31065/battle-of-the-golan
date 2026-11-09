# Battle of the Golan: project rules

## What it is
- A 2D top-down capture-the-flag game that runs in a phone browser. Hebrew vocabulary questions guard the key actions: buying weapons, grabbing flags and passing rocks.
- For teens playing together in the same room, each on their own phone. Built by Daniel, who is a beginner.
- Live: https://lev-31065.github.io/battle-of-the-golan/

## Tech stack
- Plain HTML, CSS and JavaScript. No build step, no npm, no frameworks.
- PeerJS 1.5.4 (from unpkg) for phone-to-phone connections.
- Supabase (supabase-js 2.49.4 from jsDelivr) for optional logins and saving progress online. Project URL + publishable key live in `account.js` (they're public by design; never add the secret/service_role key). Database setup: `supabase/setup.sql`.
- MyMemory (free, no key) auto-translates Hebrew → English in the deck editor. Settings in `TRANSLATE` (`rules.js`). About 5,000 letters a day free per computer. Mentioned on the privacy page.
- Rubik font from Google Fonts. Sounds are synthesized with Web Audio, so there are no audio files.

## Run, test, deploy
- **Run:** double-click `index.html`. To test multiplayer, open it in two browser windows and join one from the other.
- **Test:** there's no test framework, and neither Node nor git is installed. To check changes, run headless Edge (`--headless=new`) with `--screenshot` or `--dump-dom`:
  - `requestAnimationFrame` doesn't tick under `--virtual-time-budget`, so test pages have to call `update()` themselves.
  - The headless window can't go narrower than 504px. Narrow screenshots look clipped even when the layout is fine.
  - For a real two-browser PeerJS test, run two headless Edge instances with `--remote-debugging-port` and have them POST results to a PowerShell `HttpListener`.
- **Deploy:** upload changed files on GitHub's website (Add file → Upload files → Commit). Pages serves the `main` branch from the root folder.

## Folder structure
- `index.html`: all screens (home, play, lobby, HUD, shop, quiz, winner)
- `style.css`: looks
- `map.js`: map layout (rivers, bridges, bushes, rocks, bases), plus `isInWater` and `isInBush`
- `rules.js`: every tweakable setting, plus shared helpers
- `sound.js`: sound effects and mute
- `speech.js`: reads words out loud with the phone's built-in voice (or a recording, if a word has `audio`), plus the word card at the top
- `words.js`: the 16 built-in levels (`LEVELS`), each a deck of English → Hebrew (nikud, tricky `wrong` answers, optional `hint` like the infinitive, optional `f:` = feminine version of an "I"/"we" line; `forMyGender()` picks per player). Levels are named 1A … 16A; `DECKS` adds auto-built review levels 2B … 16B (that level + an equal number of random earlier words). `number`/`numberHe` hold "3B"/"3ב". `TOPIC_DECKS` are ready-made decks with `kind: "theme"` (school, restaurant, trip) or `kind: "root"` (1–2 verb roots: infinitive, present, nouns from the root, and sentences where the same verb takes different words after it, e.g. מְדַבֵּר עִם / עַל; the wrong answers swap them), plus an `icon`, called "Premade decks" in the lobby, listed only in class games (normal rooms show only Auto + levels, no premade or own decks), and never used by Auto. `WORDS` is the deck being played; `useDeck(id)` switches it. The host picks `auto` (default: each phone plays its own level, from `autoDeckId()` in `progress.js`) or one deck for everyone; the referee sends `deckId` in every snapshot.
- `progress.js`: flashcard memory (spaced repetition) and each player's Auto level (`noteAutoAnswer`; settings in `AUTO_LEVEL` in `rules.js`), saved on the phone, plus the account when logged in
- `account.js`: optional login (email + password, or an emailed sign-in link; 13+ checkbox to sign up). Typed email codes need custom SMTP so the Supabase email template can be edited and uploading progress to Supabase
- `supabase/setup.sql`: creates the `decks` and `progress` tables, their security rules, and the `delete_my_account()` function (paste into Supabase's SQL Editor)
- `decks.js`: the 🎓 Teacher dashboard (logged-in only; free for now, later the paid door): a wide computer layout: "🏫 Host a class game" (calls `openPlayScreen(true)` in `game.js`) above 3 columns (My decks with ✏️ edit buttons, Premade decks, Levels incl. Auto). Clicking a row picks the class deck (`teacherPickId()`, saved as `golan-deck-v2`). "My decks" = make/edit/delete word lists saved in Supabase's `decks` table. The editor is a table (Hebrew | English | wrong answers with ➕, up to `DECK_LIMITS.maxWrong` | 🗑); Enter moves like a spreadsheet; pasting lines/tab-columns into a Hebrew box fills many rows (extra columns = wrong answers). Premade decks have 📋 "copy & edit" (keeps `f:` feminine versions while the Hebrew is unchanged). Leaving a Hebrew box auto-fills an EMPTY English box (`autoTranslateRow`; purple `auto-translated` until edited; never overwrites typed English; Hebrew sent as typed, since stripping nikud gave worse results). Saved words: `{ english, hebrew, wrong?, f? }`, tidied by `cleanDeckWords` in `words.js`. Decks register in `customDecks` (`words.js`, ids `custom-<db id>`) and show in the lobby picker under "My decks". The referee keeps a copy (`server.customDeck`) and sends it to phones as a `deck` event; a phone that's missing it sends `needDeck`. Limits in `DECK_LIMITS` (`rules.js`).
- `privacy.html`: the privacy page (its own page with its own styles, so it can scroll). Update it if the game starts saving something new.
- `quiz.js`: question popup (`openQuiz`)
- `draw.js`: all canvas drawing, including the minimap
- `network.js`: PeerJS room codes and messages
- `server.js`: the referee. Only the host runs it. It decides hits, knockouts, flags and score (`checkBase`: both flags in a team's circle = point), returns everyone to the lobby after a game, and sends snapshots 20 times a second. `serverReset(hostId, deckId, { classGame, mode })`: only a class game lets the host force a deck (`server.classGame`); a normal room is always `auto`. `server.mode` = which game ("ctf" for now). Both go out in every snapshot.
- `game.js`: runs on every phone. Handles the screens, controls, the player's own movement, applying snapshots and the game loop.

## Conventions
- Write beginner-friendly comments, and explain every change in plain English.
- Settings belong in `rules.js`, not scattered through the code.
- Gameplay decisions go in `server.js`. Each phone moves only its own player and asks the referee for everything else.
- `index.html` loads the scripts in order (map → rules → sound → speech → words → progress → account → decks → quiz → draw → network → server → game). Keep it that way.
- Action buttons use `pointerdown` so they work while a finger is on the joystick. Grab and Shop call `resetStick()`, so the player stops. Hit and Drop don't.
- Show player names with `textContent`, never `innerHTML`.
- **Hebrew first, everywhere: Hebrew on top (bigger), English underneath (smaller)**, to get players reading Hebrew first. The one exception is the lobby's level list (one line per option, "English · Hebrew"). In HTML use `<span class="he" lang="he" dir="rtl">…</span><span class="en">…</span>` (Hebrew span FIRST). In JS use `setBilingual(el, en, he)` (in `rules.js`), `showToast(en, he)`, or `toast(en, he, to)` in the referee. The one exception is the English word in the quiz, because its Hebrew is the answer.
- Screens: home (masculine/feminine, Play Game / Log in / 🎓 Teacher dashboard) → play (nickname, create/join; class games hide join) → modes (pick a game: Capture the Flag + 2 "coming soon") → lobby → game → winner → back to lobby. Leaving uses the `leave-confirm` popup. Messages pop up at the bottom; the word card sits at the very top.
- Two kinds of rooms: **normal** (from Play Game): each phone picks its own level in the lobby (`golan-my-level`, default Auto). **Class game** (from the dashboard): the host picks for everyone (`golan-deck-v2`). `playedDeckId()` in `game.js` decides which deck a phone plays. The lobby picker sits under the room code and is our own dropdown (`deck-dropdown-*`, drawn from the hidden `<select id="deck-select">`), because phones' built-in lists cover the whole screen.
- Keep file names lowercase, because GitHub Pages is case-sensitive.
