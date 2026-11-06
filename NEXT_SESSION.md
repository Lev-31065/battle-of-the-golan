# Next session

## Where we stopped
- Just built the 15 learning levels and the lobby deck picker (the host chooses, everyone plays it).
- Daniel still needs to upload: `words.js`, `index.html`, `style.css`, `quiz.js`, `game.js`, `server.js`, `progress.js`, `AGENTS.md`.

## Next steps
1. Upload those files, then play a few levels on 2+ phones. Check that long sentences fit in the answer buttons and that the level switches for everyone.
2. Build **teacher decks**: a "My decks" page for logged-in users (make, edit, delete; paste lines like `dog = כֶּלֶב`). Their decks appear in the lobby picker when they host, and the host sends the words to every phone. The Supabase `decks` table already exists.
3. Have a Hebrew teacher check the nikud in `words.js` and the interface text.

## Open questions for Daniel
- Did the levels feel the right size and difficulty? Any wrong answers that are confusing?
- Should the level picker suggest the next level automatically, or stay fully manual for teachers?
- When will there be a privacy policy page, and should we get a domain plus Resend for nicer emails (and typed codes)?
