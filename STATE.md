# State

## Works now
- **Core game:** capture the flag (first to 3), rivers at 15% speed, bushes at 30%, rocks that ask a question, hammer shop, speed box, minimap, sounds, room codes, invite links. Tested on real phones with 2+ players.
- **Scoring rule (`checkBase` in `server.js`):** both flags inside a team's circle = a point for that team, whether the flags are on the stand, on the ground, or carried by a teammate. A flag in an enemy's hands doesn't count. Your own flag dropped inside your base goes straight home.
- **After a game:** the winner screen shows for `WINNER_SCREEN_TIME` (6 s), then everyone goes back to the teams screen automatically. Tested on phones.
- **Leaving:** 🚪 button in the game and 🏠 Home in the lobby. Both show an "Are you sure?" popup for anyone in the game, and for the host in the lobby (joiners in the lobby leave right away). Tested on phones.
- **Rejoining:** joining mid-game works. The room code shows on the left edge during the game. A joiner's last room code is pre-filled for 3 hours (`golan-last-room`). The same nickname goes back on the same team (`server.pastTeams`).
- **Questions:** the popup closes instantly after a right answer. A flag-grab question closes by itself if the flag returns home or someone else grabs it.
- **Voice (`speech.js`):** reads the English when a question opens, the Hebrew after a wrong answer, and a recap after a right answer. 🗣️ button turns it on/off.
- **Flashcards (`progress.js`):** spaced repetition. Settings in `REVIEW_STEPS` in `rules.js`.
- **Two languages:** every English text has Hebrew with nikud underneath.
- **Logins (`account.js` + Supabase):** email + password or a sign-in link, 13+ checkbox. Progress follows the account. Tested live.
- **Levels:** named 1A, 2A, 2B … 15A, 15B (Hebrew: 3א/3ב). A = the level's words; B = review (that level + an equal number of random earlier words). A small "Level 3B / Room KZTP" tag shows on the left edge during play.
- **Auto level:** Daniel says it's "pretty great." Retuned on 2026-11-07: up after 4 of the last 5 right (2 fast); down only after 10+ answers at a level with 3 or fewer of the last 10 right. Tested in headless Edge; not yet tuned on phones.
- **Masculine/feminine choice (first screen):** "I" and "we" sentences use the player's choice (the `f:` part of a line in `words.js`). Saved on the phone only (`golan-gender`). Tested on phones with 2 players.

## Unverified or incomplete
- **27 new pronoun sentences (step 4)** — they (f.), you all (m./f.), you (m./f.), him/her/them (אוֹתוֹ/אוֹתָהּ/אוֹתָם/אוֹתָן) in levels 4, 7, 8, 10–14. Total is now 252 questions. Not uploaded or played yet, and the nikud still needs Daniel's check.
- **The new Auto numbers** haven't been played on phones yet.
- **iPhone 2× zoom fix:** blocks pinch and double-tap zoom, and the lobby dropdown text is now 16px. Not yet confirmed on an iPhone.
- **Full screen:** turns on when you tap Play Game, Create or Join; the ⛶ button turns it off and on. Android only; iPhones don't allow it (the button is hidden there, and "Add to Home Screen" is the workaround). Not yet tested on Android.
- **No privacy policy page yet.** Needed before real users sign up. It would be good to add a "delete my account" option at the same time.

## Key decisions
- **PeerJS with the host as referee.** Free, with no game server. If the host leaves, the room closes for everyone.
- **GitHub Pages through web upload** (no git installed).
- **Supabase for logins and data.** The project URL and publishable key in `account.js` are public by design. Never add the secret/service_role key.
- **Sign-in link instead of a typed code:** Supabase's email text can't be edited without custom SMTP. Later: Resend plus our own domain (~$10/yr).
- **Levels are decks:** teacher decks will plug into the same lobby picker.
- **Auto is per player, not per room.** The lobby choice is saved as `golan-deck-v2`.
- **"We" wrong answers never include the other gender,** because a mixed group correctly uses the masculine form. "I" wrong answers do include it.
- **Future they (f.)/you all (f.)** use everyday forms (הֵן יִכְתְּבוּ), not old formal ones (תִּכְתֹּבְנָה).
- **Interface Hebrew uses dictionary nikud spelling**, the same style as `words.js`.

## Gotchas
- School Wi-Fi may block connections; mobile data is the fallback.
- The host's copy of the game decides the rules and the words, so upload changes before playing.
- Changing a sentence's English (or Hebrew) resets that sentence in everyone's flashcard memory, because the word's key is `english|hebrew`.
- Supabase's free email sender allows only a few emails per hour.
- Sign-in links open in the phone's default browser.
- Headless Edge testing: `file://` scripts hide error details ("Script error"). Run with `--enable-logging=stderr` to see the real error. `performance.now()` starts near 0 on a fresh page, so use `-Infinity` (not 0) for "never happened" timestamps.
