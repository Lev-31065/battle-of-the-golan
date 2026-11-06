# State

## Works now
- **Core game:** capture the flag (first to 3), rivers at 15% speed, bushes at 30%, rocks that ask a question, hammer shop, speed box, minimap, sounds, room codes, invite links. Tested on real phones with 2 players.
- **Questions:** the popup closes instantly after a right answer. A flag-grab question closes by itself if the flag returns home or someone else grabs it.
- **Voice (`speech.js`):** the phone's built-in voice reads the English when a question opens. A wrong answer reads the Hebrew. A right answer reads the Hebrew, then English + Hebrew, then a recap of missed words. A word card shows each pair at the top of the screen. 🗣️ button turns the voice on/off. Works on all phones tested; computers have no Hebrew voice (fine).
- **Flashcards (`progress.js`):** spaced repetition. Missed words come back soon; right-in-a-row waits longer (questions → 10 min → sessions/days). Settings in `rules.js`.
- **Two languages:** every English text has Hebrew with nikud underneath. Gender-neutral wording; name messages give both forms (תָּפַס/תָּפְסָה).
- **Screens:** home (Play Game, Log in, word count) → account or play (nickname, create/join) → lobby. Messages pop up at the bottom, a bit see-through.
- **Logins (`account.js` + Supabase):** email + password, or an emailed sign-in link. Sign-up needs "I'm 13 or older". Progress saves to the account and follows you between devices. Tested live and working.
- **15 levels (`words.js`, 225 questions):** nouns → adjectives → הַ/וְ → no-verb sentences → בְּ/לְ/מִ → infinitives → want/like → present → שֶׁ/כְּשֶׁ → present+אֶת → past → past+אֶת → future → future+אֶת → passive. Verbs show the infinitive as a hint. The host picks the level in the lobby, and everyone plays it.

## Unverified or incomplete
- The 15 levels haven't been played on real phones yet, or with 2+ phones.
- No teacher has checked the nikud (`words.js` and the interface Hebrew).
- No privacy policy page yet. Needed before real users sign up.

## Key decisions
- **PeerJS with the host as referee.** Free, with no game server.
- **GitHub Pages through web upload** (no git installed).
- **Supabase for logins and data.** The project URL and publishable key in `account.js` are public by design. Security rules in `supabase/setup.sql` mean each person sees only their own rows. Never add the secret/service_role key.
- **Sign-in link instead of a typed code:** Supabase's email text can't be edited without custom SMTP. Later: Resend plus our own domain (~$10/yr).
- **Levels are decks:** teacher decks will plug into the same lobby picker.
- **Interface Hebrew uses dictionary nikud spelling** (כָּחֹל, קִשּׁוּר), the same style as `words.js`.

## Gotchas
- If the host leaves, the game ends for everyone. School Wi-Fi may block connections; mobile data is the fallback.
- The host's copy of the game decides the rules and the words, so upload changes before playing.
- Supabase's free email sender allows only a few emails per hour.
- Sign-in links open in the phone's default browser.
- Headless Edge testing: `file://` scripts hide error details ("Script error"). Run with `--enable-logging=stderr` to see the real error.
