# State

## Works now
- **Core game:** capture the flag (first to 3), rivers at 15% speed, bushes at 30%, rocks that ask a question, hammer shop, speed box, minimap, sounds, room codes, invite links. Tested on real phones with 2+ players.
- **Scoring rule (`checkBase` in `server.js`):** both flags inside a team's circle = a point for that team, whether the flags are on the stand, on the ground, or carried by a teammate. A flag in an enemy's hands doesn't count. Your own flag dropped inside your base goes straight home. Tested on phones.
- **After a game:** the winner screen shows for `WINNER_SCREEN_TIME` (6 s), then everyone goes back to the teams screen automatically. Tested on phones.
- **Leaving:** 🚪 button in the game and 🏠 Home in the lobby, with an "Are you sure?" popup. Tested on phones. (The popups use z-index 40; the screens are 30.)
- **Rejoining:** joining mid-game works. The room code shows on the left edge during play. A joiner's last room code is pre-filled for 3 hours. The same nickname goes back on the same team (`server.pastTeams`).
- **Questions:** the popup closes instantly after a right answer. A flag-grab question closes by itself if the flag returns home or someone else grabs it.
- **Voice (`speech.js`):** reads the English when a question opens, the Hebrew after a wrong answer, and a recap after a right answer. 🗣️ turns it on/off.
- **Flashcards (`progress.js`):** spaced repetition. Settings in `REVIEW_STEPS` in `rules.js`.
- **Logins (`account.js` + Supabase):** email + password or a sign-in link, 13+ checkbox. Progress follows the account. Tested live.
- **Delete my account:** red link on the home screen. It calls the `delete_my_account()` function in Supabase, which is set up in `setup.sql`. The account's progress and decks go with it (cascade). Tested on phones.
- **Privacy page (`privacy.html`):** linked from the home screen and the sign-up form. Contact email: concoctors@gmail.com.
- **Levels:** 1, 2A, 2B … 15A, 15B (Hebrew 3א/3ב). A = the level's words; B = review. A "Level 3B / Room KZTP" tag shows during play.
- **Auto level:** per player. Daniel says it's "pretty great". Retuned on 2026-11-07.
- **Masculine/feminine choice (first screen):** "I" and "we" sentences use the player's choice. Tested on phones.

## Built, not yet tested on phones (2026-11-08)
- **Hebrew first everywhere:** Hebrew on top and bigger, English underneath and smaller. This covers the HTML, `setBilingual`, the word card, the floating canvas text and the privacy page. The lobby's level list is the only exception.
- **Teacher decks (`decks.js`):** "📚 My decks" (logged in) to make, edit and delete decks in Supabase's `decks` table. Hebrew-first editor written for ulpan teachers: lines are `עִבְרִית = English`, typed right-to-left; tabs and English-first also work. A deck needs 4–200 words. Decks show in the lobby under "My decks". The host's referee sends the deck to every phone (`deck` event; a phone without it asks with `needDeck`).
- **Topic decks (`TOPIC_DECKS` in `words.js`):** subject pronouns, object pronouns (אוֹתִי … אוֹתָן, "they like her = הֵם אוֹהֲבִים אוֹתָהּ") and all the prefixes, shown under "🎯 Topics" in the lobby. Auto never uses them. Daniel needs to check the nikud.
- **27 pronoun sentences from 2026-11-07** (levels 4, 7, 8, 10–14): the nikud still needs Daniel's check.
- **Rejoin fixes:**
  - Timers reset when the clock jumps by more than 2 s. This fixes the red, shaking screen after joining another room.
  - A phone the referee dropped asks to join again by itself.
  - A silent player with the same nickname gets replaced on rejoin. It counts like a knockout: the flag drops and the hammer is lost.
- **Not yet confirmed:** the iPhone 2× zoom fix, and full screen on Android.

## Key decisions
- **PeerJS with the host as referee.** Free, no game server. If the host leaves, the room closes.
- **GitHub Pages via web upload.** Git isn't installed yet; Daniel is considering it, so Claude could upload.
- **Supabase for logins and data.** The URL and publishable key in `account.js` are public by design. Never add the secret/service_role key.
- **Teacher decks are private in Supabase**, so the host's phone sends the words to the other players. Joiners never read the database.
- **Hebrew first, to get players reading Hebrew.** The quiz still shows the English word, because its Hebrew is the answer.
- **Sign-in link instead of a typed code** (Supabase's email text can't be edited without custom SMTP). Later: Resend plus our own domain.
- **Auto is per player, not per room.** The lobby choice is saved as `golan-deck-v2`.
- **"We" wrong answers never include the other gender. "I" wrong answers do.**
- **Interface Hebrew uses dictionary nikud spelling**, the same as `words.js`.

## Gotchas
- School Wi-Fi may block connections; mobile data is the fallback.
- The host's copy of the game decides the rules and words, and each phone needs the new `words.js` for the topic decks. Upload, then refresh every phone.
- Changing a sentence's English or Hebrew resets it in everyone's flashcard memory (the key is `english|hebrew`).
- Supabase's free email sender allows only a few emails per hour.
- Sign-in links open in the phone's default browser.
- Popups that can open over a screen need a z-index above 30.
- Headless Edge testing:
  - For a test page, copy `index.html` with an extra `<script>` at the end, run it with `--dump-dom`, and capture the output directly. `Start-Process` redirection came back empty.
  - Use `--enable-logging=stderr` to see real errors.
  - Use `-Infinity` (not 0) for "never happened" timestamps.
