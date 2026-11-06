# Battle of the Golan: project rules

## What it is
- A 2D top-down capture-the-flag game that runs in a phone browser. Hebrew vocabulary questions guard the key actions: buying weapons, grabbing flags and passing rocks.
- For teens playing together in the same room, each on their own phone. Built by Daniel, who is a beginner.
- Live: https://lev-31065.github.io/battle-of-the-golan/

## Tech stack
- Plain HTML, CSS and JavaScript. No build step, no npm, no frameworks.
- PeerJS 1.5.4 (from unpkg) for phone-to-phone connections.
- Supabase (supabase-js 2.49.4 from jsDelivr) for optional logins and saving progress online. Project URL + publishable key live in `account.js` (they're public by design; never add the secret/service_role key). Database setup: `supabase/setup.sql`.
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
- `words.js`: the 15 built-in levels (`LEVELS`), each a deck of English → Hebrew (nikud, tricky `wrong` answers, optional `hint` like the infinitive). `DECKS` adds auto-built review levels (2.5 … 15.5 = that level + an equal number of random earlier words). `WORDS` is the deck being played; `useDeck(id)` switches it. The host picks `auto` (default: each phone plays its own level, from `autoDeckId()` in `progress.js`) or one deck for everyone; the referee sends `deckId` in every snapshot.
- `progress.js`: flashcard memory (spaced repetition) and each player's Auto level (`noteAutoAnswer`; settings in `AUTO_LEVEL` in `rules.js`), saved on the phone, plus the account when logged in
- `account.js`: optional login (email + password, or an emailed sign-in link; 13+ checkbox to sign up). Typed email codes need custom SMTP so the Supabase email template can be edited and uploading progress to Supabase
- `supabase/setup.sql`: creates the `decks` and `progress` tables and their security rules (paste into Supabase's SQL Editor)
- `quiz.js`: question popup (`openQuiz`)
- `draw.js`: all canvas drawing, including the minimap
- `network.js`: PeerJS room codes and messages
- `server.js`: the referee. Only the host runs it. It decides hits, knockouts, flags and score, and sends snapshots 20 times a second.
- `game.js`: runs on every phone. Handles the screens, controls, the player's own movement, applying snapshots and the game loop.

## Conventions
- Write beginner-friendly comments, and explain every change in plain English.
- Settings belong in `rules.js`, not scattered through the code.
- Gameplay decisions go in `server.js`. Each phone moves only its own player and asks the referee for everything else.
- `index.html` loads the scripts in order (map → rules → sound → speech → words → progress → account → quiz → draw → network → server → game). Keep it that way.
- Action buttons use `pointerdown` so they work while a finger is on the joystick. Grab and Shop call `resetStick()`, so the player stops. Hit and Drop don't.
- Show player names with `textContent`, never `innerHTML`.
- **Every English text has Hebrew underneath.** In HTML use `<span class="en">…</span><span class="he" lang="he" dir="rtl">…</span>`. In JS use `setBilingual(el, en, he)` (in `rules.js`), `showToast(en, he)`, or `toast(en, he, to)` in the referee. The one exception is the English word in the quiz, because its Hebrew is the answer.
- Screens: home (Play Game / Log in) → account (login) or play (nickname, create/join) → lobby. Messages pop up at the bottom; the word card sits at the very top.
- Keep file names lowercase, because GitHub Pages is case-sensitive.
