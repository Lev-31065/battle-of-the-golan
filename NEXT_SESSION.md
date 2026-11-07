# Next session

## Where we stopped
- Built review levels (2.5 … 15.5, auto-mixed) and the Auto level (default; each player gets their own level).
- Daniel still needs to upload: `words.js`, `progress.js`, `quiz.js`, `game.js`, `server.js`, `rules.js`, `AGENTS.md`, `STATE.md`, `NEXT_SESSION.md`.

## Next steps
1. Upload, then test Auto on 2 phones: one answers fast (should see "Level up!"), one answers slowly/wrong (should stay low). Then the host picks a level like 6.5 and both phones get the review mix.
2. Tune `AUTO_LEVEL` in `rules.js` if it climbs too fast or too slow.
3. Build **teacher decks**: a "My decks" page for logged-in users (make, edit, delete; paste lines like `dog = כֶּלֶב`). Their decks appear in the lobby picker when they host, and the host sends the words to every phone. The Supabase `decks` table already exists.

## Open questions for Daniel
- How does Auto feel: too fast, too slow, or about right?
- When will there be a privacy policy page, and should we get a domain plus Resend for nicer emails (and typed codes)?
